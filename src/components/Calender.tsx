"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function ExamCalendar({ exams }: { exams: any[] }) {
  const events = exams.map((exam) => ({
    title: `${exam.subject}`,
    start:
      new Date(exam.date).toISOString().split("T")[0] +
      (exam.timeSlot === "10:00-13:00" ? "T10:00:00" : "T14:00:00"),
    end:
      new Date(exam.date).toISOString().split("T")[0] +
      (exam.timeSlot === "10:00-13:00" ? "T13:00:00" : "T17:00:00"),
    backgroundColor: exam.timeSlot === "10:00-13:00" ? "#3B82F6" : "#F59E0B",
    borderColor: exam.timeSlot === "10:00-13:00" ? "#3B82F6" : "#F59E0B",
    textColor: "white",
    display: "auto", // Changed from default 'background'
    allDay: false, // Explicitly set to false
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "",
        }}
        dayHeaderFormat={{ weekday: "short" }}
        eventContent={(eventInfo) => (
          <div className="fc-event-content p-1 text-xs !text-white">
            {eventInfo.event.title}
          </div>
        )}
        height="auto"
        eventDidMount={(info) => {
          info.el.style.setProperty(
            "background-color",
            info.event.backgroundColor,
            "important"
          );
          info.el.style.setProperty(
            "border-color",
            info.event.borderColor,
            "important"
          );
        }}
      />
    </div>
  );
}
