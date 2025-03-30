"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  students: number;
  status: "upcoming" | "ongoing" | "completed";
}

interface UpcomingExamsProps {
  exams: Exam[];
}

export default function UpcomingExams({ exams }: UpcomingExamsProps) {
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Exams</CardTitle>
        <CardDescription>Exams scheduled for the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{exam.title}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{exam.date}</span>
                  <span>•</span>
                  <span>{exam.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {exam.students} students
                </p>
              </div>
              <Badge className={statusColors[exam.status]}>
                {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
