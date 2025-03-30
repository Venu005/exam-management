import CreateTimetable from "@/components/timetable/CreateTimetable";
import Tables from "@/components/timetable/Tables";
import TableSkeleton from "@/components/timetable/TableSkeleton";
import { Suspense } from "react";

export default async function TimetablesPage() {
  return (
    <div className="p-6 w-full max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-baseline mb-8 gap-4">
        <h1 className="text-2xl font-bold">Exam Timetables</h1>
        <CreateTimetable />
      </div>

      <div className="rounded-lg border shadow-sm bg-white">
        <Suspense fallback={<TableSkeleton />}>
          <Tables />
        </Suspense>
      </div>
    </div>
  );
}
