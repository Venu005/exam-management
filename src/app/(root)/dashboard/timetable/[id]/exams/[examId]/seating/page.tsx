"use client";
import EditSeatModal from "@/components/EditingSeatModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SeatingPage({
  params,
}: {
  params: { id: string; examId: string };
}) {
  const [seating, setSeating] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [seatingRes, classroomsRes] = await Promise.all([
        axios.get(`/api/exam-entry/${params.examId}/seating`),
        axios.get(`/api/classrooms`),
      ]);
      setSeating(seatingRes.data);
      setClassrooms(classroomsRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSeating = async () => {
    try {
      setGenerating(true);
      if (selectedClassrooms.length === 0) {
        toast.error("Please select at least one classroom");
        return;
      }

      await axios.delete(`/api/exam-entry/${params.examId}/seating`);
      const response = await axios.post(
        `/api/exam-entry/${params.examId}/seating`,
        {
          classroomIds: selectedClassrooms,
        }
      );

      if (response.data.success) {
        await fetchData();
        toast.success(
          "Seating generated with classrooms: " +
            response.data.usedClassrooms
              .map((c: any) => `${c.name} (${c.seatsUsed})`)
              .join(", ")
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAssignment = async (
    arrangementId: string,
    seatId: string
  ) => {
    try {
      await axios.patch(
        `/api/exam-entry/${params.examId}/seating/${arrangementId}`,
        { seatId }
      );
      await fetchData();
      toast.success("Seat assignment updated");
    } catch (error) {
      toast.error("Failed to update seat assignment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8 h-full w-full">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seating Arrangement</h1>
        <Button onClick={handleGenerateSeating} disabled={generating}>
          {generating ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            "Generate Seating"
          )}
        </Button>
      </div>
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="mb-3 font-semibold">Select Classrooms:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {classrooms.map((classroom) => (
            <label key={classroom.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedClassrooms.includes(classroom.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedClassrooms([
                      ...selectedClassrooms,
                      classroom.id,
                    ]);
                  } else {
                    setSelectedClassrooms(
                      selectedClassrooms.filter((id) => id !== classroom.id)
                    );
                  }
                }}
                className="h-4 w-4"
              />
              <span>
                {classroom.name} ({classroom.capacity} seats) -{" "}
                {classroom.branch} Yr{classroom.year}
              </span>
            </label>
          ))}
        </div>
      </div>

      {seating.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No seating arrangement found</p>
          <Button
            onClick={handleGenerateSeating}
            disabled={generating}
            className="mt-4"
          >
            {generating ? "Generating..." : "Generate New Seating"}
          </Button>
        </div>
      ) : (
        <>
          <Table className="border rounded-lg">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Seat Number</TableHead>
                <TableHead>Classroom</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seating.map((arrangement) => (
                <TableRow key={arrangement.id}>
                  <TableCell>{arrangement.student.name}</TableCell>
                  <TableCell>{arrangement.student.rollNumber}</TableCell>
                  <TableCell>{arrangement.seat.seatNumber}</TableCell>
                  <TableCell>{arrangement.seat.classroom.name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setEditingAssignment(arrangement)}
                        >
                          Edit Seat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <EditSeatModal
            assignment={editingAssignment}
            open={!!editingAssignment}
            onOpenChange={(open) => !open && setEditingAssignment(null)}
            onSave={handleSaveAssignment}
            examId={params.examId}
          />
        </>
      )}
    </div>
  );
}
