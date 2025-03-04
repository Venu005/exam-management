import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Groq } from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { year, branch, startDate, endDate } = await req.json();

    // Validate input
    if (!year || !branch || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch subjects from database
    const subjects = await prisma.subject.findMany({
      where: {
        year: parseInt(year),
        branch: branch.toUpperCase(), 
      },
      select: {
        name: true,
        code: true,
      },
    });

    if (subjects.length === 0) {
      return NextResponse.json({ error: "No subjects found" }, { status: 404 });
    }

    // Generate timetable using AI
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `
      Generate an exam timetable for engineering students with these subjects:
      ${subjects.map((s) => s.name).join(", ")}

      Constraints:
      - Start date: ${startDate}
      - End date: ${endDate}
      - No more than one exam per day
      - Weekend consideration (no exams on Saturday/Sunday)
      - Maintain minimum 1-day gap between exams when possible

      Return ONLY valid JSON array with format:
      [{
        "subject": "Subject Name",
        "code": "Subject Code",
        "date": "YYYY-MM-DD"
      }]
    `;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
    });

    const timetable = JSON.parse(response.choices[0].message.content!);

    return NextResponse.json({ timetable });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
