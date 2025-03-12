import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const classroomSchema = z.object({
  name: z.string().min(2),
  cols: z.number().int().positive(),
  seatsPerCol: z.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = classroomSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const classroom = await prisma.classroom.create({
      data: {
        ...validation.data,
        capacity: validation.data.cols * validation.data.seatsPerCol,
      },
    });

    return NextResponse.json(classroom);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create classroom" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const classrooms = await prisma.classroom.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(classrooms);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch classrooms" },
      { status: 500 }
    );
  }
}
