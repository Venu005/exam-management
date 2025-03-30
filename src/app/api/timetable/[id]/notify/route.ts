import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Resend } from "resend";
import { ExamScheduleEmail } from "@/components/emails/ExamScheduleEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

// Sample/test email addresses
const TEST_EMAILS = [
  "122cs0021@iiitk.ac.in",
  "student2@test.com",
  "demo.user@sample.org",
  "kewaci8399@eligou.com",
  "trial.account@temp.in",
];

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    // Send to sample emails with test student data
    const emailPromises = TEST_EMAILS.map(async (email, index) => {
      try {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: ["venusaiyalamanchili@gmail.com"],
          subject: ` Exam Schedule Notification - ${timetable.title}`,
          react: ExamScheduleEmail({
            studentName: `Test Student ${index + 1}`, // Generate test student names
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
        console.error(`Failed to send email to ${email}:`, error);
      }
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Test notifications sent to ${TEST_EMAILS.length} sample emails`,
      testEmails: TEST_EMAILS,
    });
  } catch (error: any) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send notifications" },
      { status: 500 }
    );
  }
}
