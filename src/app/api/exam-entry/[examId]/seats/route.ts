import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const exam = await prisma.examEntry.findUnique({
      where: { id: params.examId },
      include: { timetable: true },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // Get URL query parameters
    const { searchParams } = new URL(request.url);
    const currentSeatId = searchParams.get("currentSeatId");

    // Get all seats for the relevant branch and year
    const allSeats = await prisma.seat.findMany({
      where: {
        classroom: {
          branch: exam.timetable.branch,
          year: exam.timetable.year,
        },
      },
      include: { classroom: true },
    });

    // Get currently occupied seats
    const occupiedSeats = await prisma.seatingArrangement.findMany({
      where: { examEntryId: params.examId },
      select: { seatId: true },
    });

    const occupiedSeatIds = new Set(occupiedSeats.map((s) => s.seatId));

    // Filter available seats (include current seat in options)
    const availableSeats = allSeats.filter(
      (seat) => !occupiedSeatIds.has(seat.id) || seat.id === currentSeatId
    );

    return NextResponse.json(availableSeats);
  } catch (error) {
    console.error("Seat fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch available seats" },
      { status: 500 }
    );
  }
}
