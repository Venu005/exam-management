"use client";

import ExamCalendar from "@/components/Calender";
import PDFDownloadButton from "@/components/PdfDownloadButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTimetable } from "@/lib/actions/table.actions";
import { TimeTableSchema } from "@/validation/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const dynamic = "force-dynamic";
export default function TimetableDetail({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [notifying, setNotifying] = useState(false);

  const form = useForm<z.infer<typeof TimeTableSchema>>({
    resolver: zodResolver(TimeTableSchema),
    defaultValues: {
      title: "",
      year: 1,
      branch: "",
      startDate: "",
      endDate: "",
      exams: [],
    },
  });

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get(`/api/timetable/${params.id}`);
        const data = response.data;

        form.reset({
          ...data,
          startDate: new Date(data.startDate).toISOString().split("T")[0],
          endDate: new Date(data.endDate).toISOString().split("T")[0],
          exams: data.exams.map((exam: any) => ({
            ...exam,
            date: new Date(exam.date).toISOString().split("T")[0],
          })),
        });
        setLoading(false);
      } catch (error) {
        toast.error("Error loading timetable");
        router.push("/dashboard/timetable");
      }
    };

    fetchTimetable();
  }, [params.id]);
  // got headache fixing the data validation here hahaha
  const onSubmit = async (values: z.infer<typeof TimeTableSchema>) => {
    try {
      const payload = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        exams: values.exams.map((exam) => ({
          ...exam,
          date: new Date(exam.date).toISOString(),
          duration: exam.duration ? Number(exam.duration) : null,
          venue: exam.venue || null,
          code: exam.code || null,
        })),
      };

      const response = await axios.patch(
        `/api/timetable/${params.id}`,
        payload
      );

      // Update form with properly formatted dates
      form.reset({
        ...response.data,
        startDate: new Date(response.data.startDate)
          .toISOString()
          .split("T")[0],
        endDate: new Date(response.data.endDate).toISOString().split("T")[0],
        exams: response.data.exams.map((exam: any) => ({
          ...exam,
          date: new Date(exam.date).toISOString().split("T")[0],
        })),
      });

      toast.success("Timetable updated successfully");
    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage = error.response?.data?.error || "Update failed";
      toast.error(`Failed to update: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await deleteTimetable(params.id);
      if (response.status === 400) {
        toast.error("Failed to delete timetable");
        setDeleting(false);
        return;
      }
      toast.success("Timetable deleted");
      router.push("/dashboard/timetable");
    } catch (error) {
      toast.error("Deletion failed");
      setDeleting(false);
    }
  };
  const handleNotify = async () => {
    try {
      setNotifying(true);
      await axios.post(`/api/timetable/${params.id}/notify`);
      toast.success("Notifications sent successfully");
    } catch (error) {
      toast.error("Failed to send notifications");
    } finally {
      setNotifying(false);
    }
  };
  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
      </div>
    );

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Timetable</h1>
            <div className="flex gap-4">
              <PDFDownloadButton timetable={form.getValues()} />
              <Button
                type="button"
                variant="secondary"
                onClick={handleNotify}
                disabled={notifying}
              >
                {notifying ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 text-white" />
                    <span className="ml-2 text-sm">Notifying...</span>
                  </div>
                ) : (
                  "Notify Students"
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Timetable"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="4"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Exam Schedule</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.watch("exams").map((exam, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`exams.${index}.subject`}
                            render={({ field }) => <Input {...field} />}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`exams.${index}.date`}
                            render={({ field }) => (
                              <Input type="date" {...field} />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`exams.${index}.timeSlot`}
                            render={({ field }) => (
                              <select {...field} className="p-2 border rounded">
                                <option value="10:00-13:00">
                                  Morning (10:00-13:00)
                                </option>
                                <option value="14:00-17:00">
                                  Afternoon (14:00-17:00)
                                </option>
                              </select>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/dashboard/timetable/${params.id}/exams/${exam.id}/seating`}
                            legacyBehavior
                          >
                            <Button variant="outline" size="sm">
                              Manage Seating
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/timetable")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    console.log("i am being clicked");
                  }}
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin h-4 w-4 text-white" />
                      <span className="ml-2 text-sm">Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column - Calendar */}
            <div className="sticky top-4 h-fit w-full space-y-4">
              <h2 className="text-2xl font-bold">Exam Calendar View</h2>
              <ExamCalendar
                exams={form.watch("exams").map((exam) => ({
                  ...exam,
                  date: new Date(exam.date),
                  duration: exam.duration || null,
                  venue: exam.venue || null,
                }))}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
