import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { prisma } from "@/lib/db/prisma";

interface SeatingAssignment {
  studentId: string;
  classroomId: string;
  col: number;
  seat: number;
}

export async function POST(req: Request) {
  try {
    const { examEntryId } = await req.json();

    // First get the exam with proper type
    const exam = await prisma.examEntry.findUnique({
      where: { id: examEntryId },
      include: { timetable: true },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // Then get classrooms and students
    const [classrooms, students] = await Promise.all([
      prisma.classroom.findMany(),
      prisma.student.findMany({
        where: {
          year: exam.timetable.year,
          branch: exam.timetable.branch,
        },
      }),
    ]);

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `
      Generate seating arrangement for:
      - ${students.length} students
      - Classrooms: ${JSON.stringify(
        classrooms.map((c) => ({
          id: c.id,
          name: c.name,
          cols: c.cols,
          seatsPerCol: c.seatsPerCol,
          capacity: c.capacity,
        }))
      )}
      - Exam: ${exam.subject} (${exam.date.toISOString()})
      
      Rules:
      1. Fill classrooms sequentially
      2. Maintain 1 empty seat between students
      3. Prioritize larger classrooms first
      4. No duplicate seats
      
      Return JSON format:
      { "assignments": [{
        "studentId": "string",
        "classroomId": "string",
        "col": number,
        "seat": number
      }]}
    `;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.2,
    });

    const { assignments } = JSON.parse(
      response.choices[0].message.content!
    ) as {
      assignments: SeatingAssignment[];
    };

    const created = await prisma.$transaction(
      assignments.map((a) =>
        prisma.seatingArrangement.create({
          data: {
            examEntryId,
            studentId: a.studentId,
            classroomId: a.classroomId,
            col: a.col,
            seat: a.seat,
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: created.length });
  } catch (error) {
    console.error("Seating generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate seating" },
      { status: 500 }
    );
  }
}
