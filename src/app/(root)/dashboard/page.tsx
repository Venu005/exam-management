import StatsCard from "@/components/dashboard/StatsCard";
import UpcomingExams from "@/components/dashboard/UpcomingExams";
import CalendarWidget from "@/components/dashboard/Calendar";
import ExamStats from "@/components/dashboard/ExamStats";
import RecentTimetables from "@/components/dashboard/RecentTimetables";
import { CalendarDays, Users, ClipboardList, School } from "lucide-react";
import { Suspense } from "react";
import TableSkeleton from "@/components/timetable/TableSkeleton";

export const dynamic = "force-dynamic";
export default function Dashboard() {
  const stats = [
    {
      title: "Total Exams",
      value: 82,
      icon: ClipboardList,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Students",
      value: 1256,
      icon: Users,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Timetables",
      value: 24,
      icon: CalendarDays,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Subjects",
      value: 45,
      icon: School,
      trend: { value: 2, isPositive: false },
    },
  ];

  const upcomingExams = [
    {
      id: "1",
      title: "CSE301 - Database Management",
      date: "May 15, 2023",
      time: "10:00 AM",
      students: 120,
      status: "upcoming" as const,
    },
    {
      id: "2",
      title: "CSE205 - Data Structures",
      date: "May 16, 2023",
      time: "2:00 PM",
      students: 98,
      status: "upcoming" as const,
    },
    {
      id: "3",
      title: "CSE104 - Introduction to Programming",
      date: "May 17, 2023",
      time: "9:00 AM",
      students: 150,
      status: "upcoming" as const,
    },
  ];

  const events = [
    {
      date: new Date(2023, 4, 15),
      title: "CSE301 Exam",
      type: "exam" as const,
    },
    {
      date: new Date(2023, 4, 16),
      title: "CSE205 Exam",
      type: "exam" as const,
    },
    {
      date: new Date(2023, 4, 20),
      title: "New Timetable",
      type: "timetable" as const,
    },
    {
      date: new Date(),
      title: "ECE202 Exam",
      type: "exam" as const,
    },
  ];

  return (
    <>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <UpcomingExams exams={upcomingExams} />
          <CalendarWidget events={events} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ExamStats />
          </div>
          <div className="lg:col-span-2">
            <Suspense fallback={<TableSkeleton />}>
              <RecentTimetables />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
