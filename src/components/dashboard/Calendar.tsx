"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

interface Event {
  date: Date;
  title: string;
  type: "exam" | "timetable" | "arrangement";
}

interface CalendarWidgetProps {
  events: Event[];
}

export default function CalendarWidget({ events }: CalendarWidgetProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Get all dates with events
  const eventDates = events.map((event) => event.date);

  // Get events for selected date
  const selectedDateEvents = events.filter(
    (event) => date && event.date.toDateString() === date.toDateString()
  );

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>View and manage your upcoming events</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border rounded-md p-3 w-full"
        />

        <div className="mt-4 space-y-2">
          <h4 className="font-medium">
            Events for{" "}
            {date
              ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
              : ""}
          </h4>
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    event.type === "exam"
                      ? "bg-red-500"
                      : event.type === "timetable"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                />
                <span>{event.title}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No events scheduled</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
