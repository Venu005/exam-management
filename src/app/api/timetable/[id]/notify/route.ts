import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Resend } from "resend";
import { ExamScheduleEmail } from "@/components/emails/ExamScheduleEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get timetable with exams
    const timetable = await prisma.timetable.findUnique({
      where: { id: params.id },
      include: { exams: true },
    });

    if (!timetable) {
      return NextResponse.json(
        { error: "Timetable not found" },
        { status: 404 }
      );
    }

    // Get students from the same year and branch
    const students = await prisma.student.findMany({
      where: {
        year: timetable.year,
        branch: timetable.branch,
      },
    });

    // Send emails
    const emailPromises = students.map(async (student) => {
      try {
        await resend.emails.send({
          from: "Academia <exams@yourdomain.com>",
          to: student.email,
          subject: `Exam Schedule Notification - ${timetable.title}`,
          react: ExamScheduleEmail({
            studentName: student.fullName,
            timetable: {
              ...timetable,
              exams: timetable.exams.map((exam) => ({
                subject: exam.subject,
                date: exam.date.toISOString(),
                timeSlot: exam.timeSlot,
              })),
            },
          }),
        });
      } catch (error) {
        console.error(`Failed to send email to ${student.email}:`, error);
      }
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Notifications sent to ${students.length} students`,
    });
  } catch (error: any) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send notifications" },
      { status: 500 }
    );
  }
}
