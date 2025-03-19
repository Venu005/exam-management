// app/api/generate-timetable/route.ts
import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const requestSchema = z.object({
  year: z.number().int().min(1).max(4),
  branch: z.string().min(2).max(4),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(req: Request) {
  try {
    const { year, branch, startDate, endDate } = await req.json();

    // Validate input
    const validation = requestSchema.safeParse({
      year: Number(year),
      branch: branch.toUpperCase(),
      startDate,
      endDate,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    // Fetch subjects
    const subjects = await prisma.subject.findMany({
      where: {
        year: validation.data.year,
        branch: validation.data.branch,
      },
      select: { name: true, code: true },
    });

    if (subjects.length === 0) {
      return NextResponse.json({ error: "No subjects found" }, { status: 404 });
    }

    // Calculate excluded dates (weekends)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const excludedDates: string[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0 || d.getDay() === 6) {
        // Sunday or Saturday
        excludedDates.push(d.toISOString().split("T")[0]);
      }
    }

    // Generate timetable using AI
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `
      Generate an exam timetable for engineering students with these subjects:
      ${subjects.map((s) => `${s.name} (${s.code})`).join(", ")}

      Constraints:
      - Date range: ${startDate} to ${endDate}
      - Time slots: 
        * Morning: 10:00-13:00
        * Afternoon: 14:00-17:00
      - One exam per day
      - Avoid weekends: ${excludedDates.join(", ") || "None"}
      - Prefer morning slots for difficult subjects
      - Minimum 1-day gap between exams when possible

      Return JSON array:
      [{
        "subject": "Subject Name",
        "code": "Subject Code",
        "date": "YYYY-MM-DD",
        "timeSlot": "10:00-13:00" // or "14:00-17:00"
      }]
    `;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
    });

    const timetable = JSON.parse(response.choices[0].message.content!);
    console.log(timetable);

    const isValid = timetable.every((exam: any) => {
      const validDate = !excludedDates.includes(exam.date);
      const validSlot = ["10:00-13:00", "14:00-17:00"].includes(exam.timeSlot);
      const examDate = new Date(exam.date);
      return validDate && validSlot && examDate >= start && examDate <= end;
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Generated timetable contains invalid entries" },
        { status: 500 }
      );
    }

    // Save to database
    const savedTimetable = await prisma.timetable.create({
      data: {
        title: `${branch} Year ${year} Timetable`,
        year: validation.data.year,
        branch: validation.data.branch,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        exams: {
          create: timetable.map((exam: any) => ({
            subject: exam.subject,
            code: exam.code,
            date: new Date(exam.date),
            timeSlot: exam.timeSlot,
          })),
        },
      },
      include: { exams: true },
    });

    return NextResponse.json({ timetable: savedTimetable });
  } catch (error: any) {
    console.error("Timetable generation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const timetables = await prisma.timetable.findMany({
      include: { exams: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(timetables);
  } catch (error) {
    console.error("Error fetching timetables:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetables" },
      { status: 500 }
    );
  }
}
