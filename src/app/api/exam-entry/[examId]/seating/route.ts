import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Groq } from "groq-sdk";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
// Update the POST endpoint with this code
const requestSchema = z.object({
  classroomIds: z
    .array(z.string().cuid())
    .min(1, "Select at least 1 classroom"),
});

export async function POST(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Unauthorized", { status: 401 });

    // Parse request body
    const { classroomIds } = await req
      .json()
      .then((body) => requestSchema.parse(body));
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const exam = await prisma.examEntry.findUnique({
      where: { id: params.examId },
      include: { timetable: true },
    });
    if (!exam)
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    // Get selected classrooms
    const classrooms = await prisma.classroom.findMany({
      where: { id: { in: classroomIds } },
      include: { seats: true },
    });

    // Get all students for this exam
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { branch: exam.timetable.branch, year: exam.timetable.year },
          { SeatingArrangement: { some: { examEntryId: params.examId } } },
        ],
      },
    });

    // Validate capacity
    const totalCapacity = classrooms.reduce((sum, c) => sum + c.capacity, 0);
    if (students.length > totalCapacity) {
      return NextResponse.json(
        {
          error: `Need ${students.length} seats but only ${totalCapacity} available`,
          required: Math.ceil(students.length / classrooms[0]?.capacity || 1),
          selectedClassrooms: classrooms.map((c) => c.name),
        },
        { status: 400 }
      );
    }

    // Get all seats from selected classrooms
    const seats = classrooms.flatMap((c) => c.seats);

    // Fallback assignment with classroom prioritization
    const createBasicAssignment = () => {
      const assignments = [];
      let classroomIndex = 0;
      let seatIndex = 0;

      for (const student of students) {
        while (classroomIndex < classrooms.length) {
          const classroom = classrooms[classroomIndex];
          if (seatIndex < classroom.seats.length) {
            assignments.push({
              studentId: student.id,
              seatId: classroom.seats[seatIndex].id,
            });
            seatIndex++;
            break;
          } else {
            classroomIndex++;
            seatIndex = 0;
          }
        }
      }
      return assignments;
    };

    let assignments = createBasicAssignment();

    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const prompt = `
        Create seating arrangement for ${students.length} students across ${
        classrooms.length
      } classrooms.
        Selected Classrooms: ${classrooms
          .map((c) => `${c.name} (${c.capacity} seats, ${c.branch} ${c.year})`)
          .join(", ")}
        
        Rules:
        1. Fill classrooms in order: ${classrooms
          .map((c) => c.name)
          .join(" → ")}
        2. Prioritize same branch/year students first
        3. Student IDs: [${students
          .slice(0, 5)
          .map((s) => s.id)
          .join(", ")}...]
        4. Seat IDs: [${seats
          .slice(0, 5)
          .map((s) => s.id)
          .join(", ")}...]
        
        Return JSON format:
        {
          "assignments": [
            {"studentId": "abc123", "seatId": "seat456"},
            ...
          ]
        }
      `;

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a seating planner. Return only valid JSON assignments using the provided seat IDs.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-70b-8192",
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      const rawResponse = response.choices[0].message.content;
      const parsed = JSON.parse(rawResponse || "{}");

      if (parsed.assignments?.length === students.length) {
        assignments = parsed.assignments;
      }
    } catch (aiError) {
      console.log("AI generation failed:", aiError);
    }

    // Final validation
    const validStudentIds = new Set(students.map((s) => s.id));
    const validSeatIds = new Set(seats.map((s) => s.id));

    const validAssignments = assignments.filter(
      (a) => validStudentIds.has(a.studentId) && validSeatIds.has(a.seatId)
    );

    // Save to database
    await prisma.seatingArrangement.deleteMany({
      where: { examEntryId: params.examId },
    });

    await prisma.seatingArrangement.createMany({
      data: validAssignments.map((a: any) => ({
        examEntryId: params.examId,
        studentId: a.studentId,
        seatId: a.seatId,
        userId: dbUser.id,
      })),
    });

    return NextResponse.json({
      success: true,
      usedClassrooms: classrooms.map((c) => ({
        name: c.name,
        branch: c.branch,
        year: c.year,
        seatsUsed: validAssignments.filter(
          (a) => seats.find((s) => s.id === a.seatId)?.classroomId === c.id
        ).length,
      })),
      totalAssigned: validAssignments.length,
    });
  } catch (error) {
    console.error("Seating error:", error);
    return NextResponse.json(
      {
        error: "Generation failed",
        details: error instanceof Error ? error.message : "",
      },
      { status: 500 }
    );
  }
}
export async function GET(
  request: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const arrangements = await prisma.seatingArrangement.findMany({
      where: { examEntryId: params.examId },
      include: {
        student: true,
        seat: { include: { classroom: true } },
      },
    });

    return NextResponse.json(arrangements);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch seating arrangements" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { examId: string } }
) {
  try {
    // Delete all seating arrangements for this exam
    await prisma.seatingArrangement.deleteMany({
      where: { examEntryId: params.examId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear seating error:", error);
    return NextResponse.json(
      { error: "Failed to clear seating arrangements" },
      { status: 500 }
    );
  }
}
