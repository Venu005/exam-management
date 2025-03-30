"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function Tablerow({ timetable }: { timetable: any }) {
  const router = useRouter();
  return (
    <TableRow
      key={timetable.id}
      className="hover:bg-gray-100 even:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => router.push(`/dashboard/timetable/${timetable.id}`)}
    >
      <TableCell className="px-6 py-4 font-medium text-gray-900">
        {timetable.title}
      </TableCell>
      <TableCell className="px-6 py-4">{timetable.year}</TableCell>
      <TableCell className="px-6 py-4 uppercase font-medium text-gray-700">
        {timetable.branch}
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        {new Date(timetable.startDate).toLocaleDateString("en-IN")}
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        {new Date(timetable.endDate).toLocaleDateString("en-IN")}
      </TableCell>
      <TableCell className="px-6 py-4 text-right font-medium">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
          {timetable.exams.length}
        </span>
      </TableCell>
    </TableRow>
  );
}
