// app/api/timetable/route.ts
import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

// Request validation schema
const requestSchema = z.object({
  year: z.number().int().min(1).max(4),
  branch: z.string().min(2).max(4),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// Timetable entry validation schema
const timetableSchema = z.array(
  z.object({
    subject: z.string(),
    code: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timeSlot: z.enum(["10:00-13:00", "14:00-17:00"]),
  })
);

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
        excludedDates.push(d.toISOString().split("T")[0]);
      }
    }

    // Generate timetable using AI
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `
      Generate an exam timetable for engineering students with these subjects:
      ${subjects.map((s: any) => `${s.name} (${s.code})`).join(", ")}

      Constraints:
      - Date range: ${startDate} to ${endDate}
      - Time slots: 
        * Morning: 10:00-13:00
        * Afternoon: 14:00-17:00
      - One exam per day
      - Avoid weekends: ${excludedDates.join(", ") || "None"}
      - Prefer morning slots for difficult subjects
      - Minimum 1-day gap between exams when possible

      Return ONLY a valid JSON array following this structure:
      [{
        "subject": "Subject Name",
        "code": "Subject Code",
        "date": "YYYY-MM-DD",
        "timeSlot": "10:00-13:00" // or "14:00-17:00"
      }]

      Your response must:
      - Start with [ and end with ]
      - Contain no additional text or explanations
      - Use valid JSON syntax
      - Maintain date order
    `;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a JSON timetable generator. Return only valid JSON arrays without any formatting or text.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama3-70b-8192",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    // Extract and clean the response
    const rawResponse = response.choices[0].message.content!;
    const jsonStart = rawResponse.indexOf("[");
    const jsonEnd = rawResponse.lastIndexOf("]") + 1;
    const jsonString = rawResponse.slice(jsonStart, jsonEnd);

    // Parse and validate
    const parsedData = JSON.parse(jsonString);
    const timetable = timetableSchema.parse(parsedData);

    // Date validation
    const isValidDates = timetable.every((exam) => {
      const examDate = new Date(exam.date);
      return (
        !excludedDates.includes(exam.date) &&
        examDate >= start &&
        examDate <= end
      );
    });

    if (!isValidDates) {
      return NextResponse.json(
        { error: "Generated timetable contains invalid dates" },
        { status: 500 }
      );
    }

    // Save to database
    const savedTimetable = await prisma.timetable.create({
      data: {
        title: `${validation.data.branch} Year ${validation.data.year} Timetable`,
        year: validation.data.year,
        branch: validation.data.branch,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        exams: {
          create: timetable.map((exam) => ({
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
      {
        error: error.message?.startsWith("Invalid timetable")
          ? error.message
          : "Internal server error",
      },
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
    revalidatePath("/dashboard/timetable");
    return NextResponse.json(timetables);
  } catch (error) {
    console.error("Error fetching timetables:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetables" },
      { status: 500 }
    );
  }
}
