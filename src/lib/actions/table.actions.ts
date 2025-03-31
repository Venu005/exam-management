"use server";

import { CreateTimetable } from "@/types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "../db/prisma";

export async function fetchTimetables() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/timetable`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch timetables");
    }
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching timetables:", error);
    return NextResponse.json(
      { error: "Error fetching timetables" },
      { status: 500 }
    );
  }
}

export async function createTimetable(values: CreateTimetable) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/timetable`,
      values
    );
    if (response.status === 500) {
      throw new Error("Failed to create timetable");
    }
    revalidatePath("/dashboard/timetable");
    return { message: "Timetable created successfully", status: 200 };
  } catch (error) {
    console.error("Error creating timetable:", error);
    return { error: "Error creating timetable", status: 500 };
  }
}

export async function fetchrecentTimetables() {
  try {
    const data = await prisma.timetable.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
    if (!data) {
      throw new Error("No recent timetables found");
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching recent timetables:", error);
    return NextResponse.json(
      { error: "Error fetching recent timetables" },
      { status: 500 }
    );
  }
}
