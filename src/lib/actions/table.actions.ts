import axios from "axios";
import { NextResponse } from "next/server";

export async function fetchTimetables() {
  try {
    const response = await axios.get("http://localhost:3000/api/timetable");
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
