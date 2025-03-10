import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
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

    return NextResponse.json(timetable);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { exams, ...timetableData } = await request.json();

    // Validate input
    if (!exams || !Array.isArray(exams)) {
      return NextResponse.json(
        { error: "Invalid exam data structure" },
        { status: 400 }
      );
    }

    const updatedTimetable = await prisma.$transaction([
      prisma.examEntry.deleteMany({ where: { timetableId: params.id } }),
      prisma.timetable.update({
        where: { id: params.id },
        data: {
          title: timetableData.title,
          year: timetableData.year,
          branch: timetableData.branch,
          startDate: new Date(timetableData.startDate),
          endDate: new Date(timetableData.endDate),
          exams: {
            create: exams.map((exam: any) => ({
              subject: exam.subject,
              code: exam.code || null,
              date: new Date(exam.date),
              timeSlot: exam.timeSlot,
              duration: exam.duration ? Number(exam.duration) : null,
              venue: exam.venue || null,
            })),
          },
        },
        include: { exams: true },
      }),
    ]);

    // Convert dates to ISO strings for frontend
    const responseData = {
      ...updatedTimetable[1],
      startDate: updatedTimetable[1].startDate.toISOString(),
      endDate: updatedTimetable[1].endDate.toISOString(),
      exams: updatedTimetable[1].exams.map((exam) => ({
        ...exam,
        date: exam.date.toISOString(),
        createdAt: exam.createdAt.toISOString(),
        updatedAt: exam.updatedAt.toISOString(),
      })),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First delete all related exams
    await prisma.examEntry.deleteMany({
      where: { timetableId: params.id },
    });

    // Then delete the timetable
    await prisma.timetable.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete timetable" },
      { status: 500 }
    );
  }
}
