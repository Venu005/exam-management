// components/EditingSeatModel.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditSeatModal({
  assignment,
  open,
  onOpenChange,
  onSave,
  examId,
}: {
  assignment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (assignmentId: string, seatId: string) => Promise<void>;
  examId: string;
}) {
  const [selectedSeatId, setSelectedSeatId] = useState(
    assignment?.seat?.id || ""
  );
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      if (!assignment || !open) return;

      setLoadingSeats(true);
      try {
        const response = await axios.get(
          `/api/exam-entry/${examId}/seats?currentSeatId=${assignment.seat.id}`
        );
        setAvailableSeats(response.data);
      } catch (error) {
        console.error("Failed to fetch seats", error);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchAvailableSeats();
  }, [open, assignment, examId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Seat Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Student</Label>
            <p className="font-medium">{assignment?.student?.name}</p>
            <p className="text-sm text-gray-500">
              {assignment?.student?.rollNumber}
            </p>
          </div>

          {loadingSeats ? (
            <Loader className="animate-spin" />
          ) : (
            <div>
              <Label>Select New Seat</Label>
              <Select
                value={selectedSeatId}
                onValueChange={(value) => setSelectedSeatId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select seat" />
                </SelectTrigger>
                <SelectContent>
                  {availableSeats.map((seat) => (
                    <SelectItem key={seat.id} value={seat.id}>
                      {seat.classroom.name} - Seat {seat.seatNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={async () => {
              if (assignment) {
                await onSave(assignment.id, selectedSeatId);
                onOpenChange(false);
              }
            }}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
