import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchTimetables } from "@/lib/actions/table.actions";
import Tablerow from "./Tablerow";

export default async function Tables() {
  try {
    const response = await fetchTimetables();

    if (!response.ok) {
      throw new Error("Failed to fetch timetables");
    }

    const timetables = await response.json();

    return (
      <Table className="min-w-full">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-4 font-semibold text-gray-700 min-w-[200px]">
              Title
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-gray-700 w-24">
              Year
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-gray-700 w-32">
              Branch
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-gray-700 w-40">
              Start Date
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-gray-700 w-40">
              End Date
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-gray-700 text-right w-24">
              Exams
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {timetables.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center p-8 text-gray-500">
                No timetables found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            timetables.map((timetable: any) => (
              <Tablerow key={timetable.id} timetable={timetable} />
            ))
          )}
        </TableBody>
      </Table>
    );
  } catch (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading timetables: {(error as Error).message}
      </div>
    );
  }
}
