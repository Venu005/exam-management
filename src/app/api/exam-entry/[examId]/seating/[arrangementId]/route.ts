import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(
  request: Request,
  { params }: { params: { examId: string; arrangementId: string } }
) {
  try {
    await prisma.seatingArrangement.delete({
      where: {
        id: params.arrangementId,
        examEntryId: params.examId,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete seating arrangement" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { examId: string; arrangementId: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Unauthorized", { status: 401 });

    // Get or create database user
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    const { seatId } = await request.json();

    // Check seat availability within THIS exam
    const existingAssignment = await prisma.seatingArrangement.findFirst({
      where: {
        seatId,
        examEntryId: params.examId,
        id: { not: params.arrangementId },
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: "This seat is already occupied in this exam" },
        { status: 400 }
      );
    }

    const updatedAssignment = await prisma.seatingArrangement.update({
      where: {
        id: params.arrangementId,
        examEntryId: params.examId,
      },
      data: {
        seatId,
        userId: dbUser?.id,
      },
      include: {
        student: true,
        seat: { include: { classroom: true } },
      },
    });

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error("Seat update error:", error);
    return NextResponse.json(
      { error: "Failed to update seating arrangement" },
      { status: 500 }
    );
  }
}
