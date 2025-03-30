"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Timetable {
  id: string;
  title: string;
  branch: string;
  year: number;
  startDate: string;
  endDate: string;
  exams: number;
}

interface RecentTimetablesProps {
  timetables: Timetable[];
}

export default function RecentTimetables({
  timetables,
}: RecentTimetablesProps) {
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Timetables</CardTitle>
          <CardDescription>
            Recently created and updated timetables
          </CardDescription>
        </div>
        <Button>Create New</Button>
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
              <TableHead className="text-center">Exams</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timetables.map((timetable) => (
              <TableRow key={timetable.id}>
                <TableCell className="font-medium">{timetable.title}</TableCell>
                <TableCell>{timetable.branch}</TableCell>
                <TableCell>{timetable.year}</TableCell>
                <TableCell>{timetable.startDate}</TableCell>
                <TableCell>{timetable.endDate}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{timetable.exams}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
