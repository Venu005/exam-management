import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const classrooms = await prisma.classroom.findMany({
      orderBy: [{ branch: "asc" }, { year: "asc" }, { name: "asc" }],
      include: { seats: true },
    });
    return NextResponse.json(classrooms);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch classrooms" },
      { status: 500 }
    );
  }
}
