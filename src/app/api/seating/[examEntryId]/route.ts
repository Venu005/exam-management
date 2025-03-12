import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _: Request,
  { params }: { params: { examEntryId: string } }
) {
  try {
    const arrangements = await prisma.seatingArrangement.findMany({
      where: { examEntryId: params.examEntryId },
      include: {
        classroom: true,
        student: {
          select: {
            fullName: true,
            rollNumber: true,
          },
        },
      },
    });

    return NextResponse.json(arrangements);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch seating" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { examEntryId: string } }
) {
  try {
    await prisma.seatingArrangement.deleteMany({
      where: { examEntryId: params.examEntryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete seating" },
      { status: 500 }
    );
  }
}
