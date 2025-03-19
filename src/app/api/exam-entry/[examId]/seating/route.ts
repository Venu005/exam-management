import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Groq } from "groq-sdk";
import { currentUser } from "@clerk/nextjs/server";

// Update the POST endpoint with this code
export async function POST(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Unauthorized", { status: 401 });

    // Get the database user record
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const exam = await prisma.examEntry.findUnique({
      where: { id: params.examId },
      include: { timetable: true },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // Get students and seats
    const [students, classrooms] = await Promise.all([
      prisma.student.findMany({
        where: { branch: exam.timetable.branch, year: exam.timetable.year },
      }),
      prisma.classroom.findMany({
        where: { branch: exam.timetable.branch, year: exam.timetable.year },
        include: { seats: true },
      }),
    ]);

    const seats = classrooms.flatMap((c) => c.seats);

    // Add validation for empty data
    if (students.length === 0) {
      return NextResponse.json({ error: "No students found" }, { status: 400 });
    }
    if (seats.length === 0) {
      return NextResponse.json(
        { error: "No seats available" },
        { status: 400 }
      );
    }
    if (students.length > seats.length) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }

    // Fallback assignment algorithm
    const createBasicAssignment = () => {
      return students.map((student, index) => ({
        studentId: student.id,
        seatId: seats[index].id,
      }));
    };

    let assignments = createBasicAssignment(); // Default to fallback

    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const prompt = `
        Create seating arrangement for ${students.length} students in ${classrooms.length} classrooms.
        Students branch/year: ${exam.timetable.branch}/${exam.timetable.year}
        Available seats: ${seats.map((s) => `${s.seatNumber} (Classroom: ${s.classroomId})`).join(", ")}

        Required JSON format:
        {
          "assignments": [
            {"studentId": "${students[0].id}", "seatId": "${seats[0].id}"},
            {"studentId": "${students[1].id}", "seatId": "${seats[1].id}"}
          ]
        }

        Rules:
        1. Use EXACT student IDs from the list: [${students
          .slice(0, 5)
          .map((s) => s.id)
          .join(", ")}]
        2. Use EXACT seat IDs from the list: [${seats
          .slice(0, 5)
          .map((s) => s.id)
          .join(", ")}]
        3. Create exactly ${students.length} assignments
        4. No duplicates
      `;

      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "mixtral-8x7b-32768",
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const rawResponse = response.choices[0].message.content;
      console.log("AI response:", rawResponse);

      const parsed = JSON.parse(rawResponse || "{}");
      const aiAssignments = parsed.assignments || [];

      // Validate AI response
      const isValid =
        Array.isArray(aiAssignments) &&
        aiAssignments.length === students.length &&
        aiAssignments.every(
          (a) =>
            typeof a?.studentId === "string" && typeof a?.seatId === "string"
        ) &&
        new Set(aiAssignments.map((a) => a.studentId)).size ===
          students.length &&
        new Set(aiAssignments.map((a) => a.seatId)).size === students.length;

      if (isValid) {
        assignments = aiAssignments;
      }
    } catch (aiError) {
      console.log("AI generation failed, using fallback:", aiError);
    }

    // Final validation
    const validStudentIds = new Set(students.map((s) => s.id));
    const validSeatIds = new Set(seats.map((s) => s.id));

    const validAssignments = assignments.filter(
      (a) => validStudentIds.has(a.studentId) && validSeatIds.has(a.seatId)
    );

    if (validAssignments.length !== students.length) {
      console.log("Final validation failed, using fallback");
      assignments = createBasicAssignment();
    }

    // Clear existing arrangements
    await prisma.seatingArrangement.deleteMany({
      where: { examEntryId: params.examId },
    });

    // Create new arrangements
    await prisma.seatingArrangement.createMany({
      data: assignments.map((a: any) => ({
        examEntryId: params.examId,
        studentId: a.studentId,
        seatId: a.seatId,
        userId: dbUser.id,
      })),
    });

    return NextResponse.json({
      success: true,
      generated: assignments.length,
      studentCount: students.length,
      seatCount: seats.length,
    });
  } catch (error) {
    console.error("Seating generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate seating",
        details: error instanceof Error ? error.message : "Unknown error",
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
