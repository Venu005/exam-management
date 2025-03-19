"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Loader } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditSeatModal from "@/components/EditingSeatModel";

export default function SeatingPage({
  params,
}: {
  params: { id: string; examId: string };
}) {
  const [seating, setSeating] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);

  useEffect(() => {
    fetchSeating();
  }, []);

  const fetchSeating = async () => {
    try {
      const response = await axios.get(
        `/api/exam-entry/${params.examId}/seating`
      );
      setSeating(response.data);
    } catch (error) {
      toast.error("Failed to fetch seating arrangement");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSeating = async () => {
    try {
      setGenerating(true);

      // First clear existing seating
      const deleteResponse = await axios.delete(
        `/api/exam-entry/${params.examId}/seating`
      );

      if (!deleteResponse.data.success) {
        throw new Error("Failed to clear existing seating");
      }

      // Then generate new seating
      const generateResponse = await axios.post(
        `/api/exam-entry/${params.examId}/seating`
      );

      if (!generateResponse.data.success) {
        throw new Error("Failed to generate new seating");
      }

      // Refresh the data
      await fetchSeating();
      toast.success("Seating arrangement generated successfully");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(
        error.response?.data?.error || error.message || "Generation failed"
      );
    } finally {
      setGenerating(false);
    }
  };
  const handleSaveAssignment = async (assignmentId: string, seatId: string) => {
    try {
      await axios.patch(
        `/api/exam-entry/${params.examId}/seating/${assignmentId}`,
        { seatId }
      );
      await fetchSeating();
      toast.success("Seat assignment updated");
    } catch (error) {
      toast.error("Failed to update seat assignment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader className="animate-spin h-8 w-8" />
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
              <Loader className="animate-spin mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            "Generate Seating"
          )}
        </Button>
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
