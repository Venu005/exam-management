"use client";
import { Exam } from "@/types";
import { useState } from "react";

export default function TimetableGenerator() {
  const [formData, setFormData] = useState({
    year: "3",
    branch: "CSE",
    startDate: "",
    endDate: "",
  });
  const [timetable, setTimetable] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/generate-timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setTimetable(data.timetable);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          max="4"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        />
        <select
          value={formData.branch}
          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
        >
          <option>CSE</option>
          <option>ME</option>
          <option>EE</option>
        </select>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Timetable"}
        </button>
      </form>

      {timetable.length > 0 && (
        <div>
          <h2>Exam Schedule</h2>
          <ul>
            {timetable.map((exam, index) => (
              <li key={index}>
                {exam.date}: {exam.subject} ({exam.code})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
