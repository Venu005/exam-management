import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchrecentTimetables } from "@/lib/actions/table.actions";
import { Timetable } from "@prisma/client";
import { AlertTriangle, Eye } from "lucide-react";
import Link from "next/link";

export default async function RecentTimetables() {
  try {
    const response = await fetchrecentTimetables();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const timetables: Timetable[] = await response.json();

    return (
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Timetables</CardTitle>
            <CardDescription>
              Recently created and updated timetables
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/timetable">
              <Eye className="h-4 w-4" />
              View All Timetables
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No timetables found.
                  </TableCell>
                </TableRow>
              ) : (
                timetables.map((timetable) => (
                  <TableRow key={timetable.id}>
                    <TableCell className="font-medium">
                      {timetable.title}
                    </TableCell>
                    <TableCell>{timetable.branch}</TableCell>
                    <TableCell>{timetable.year}</TableCell>
                    <TableCell>
                      {new Date(timetable.startDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(timetable.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to load recent timetables";

    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Loading Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">{errorMessage}</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </CardContent>
      </Card>
    );
  }
}
