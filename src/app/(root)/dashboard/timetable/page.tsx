"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { useRouter } from "next/navigation";
const formSchema = z.object({
  year: z.string().min(1, "Year is required"),
  branch: z.string().min(2, "Branch is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export default function TimetablesPage() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "",
      branch: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await axios.get("/api/timetable"); // Axios GET
      setTimetables(response.data);
    } catch (error) {
      console.error("Error fetching timetables:", error);
      toast("Error fetching timetables");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/timetable", values); // Axios POST

      setTimetables([response.data.timetable, ...timetables]);
      setOpen(false);
      form.reset();
      toast("Timetable generated successfully");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast(error.response?.data?.message || "Error generating timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-baseline mb-8 gap-4">
        <h1 className="text-2xl font-bold">Exam Timetables</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create New Timetable</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Timetable</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter year (1-4)"
                          type="number"
                          min="1"
                          max="4"
                          {...field}
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
                        <Input
                          placeholder="Enter branch (e.g., CSE, ME)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="animate-spin h-4 w-4" />
                      <span>Generating time-table</span>
                    </div>
                  ) : (
                    "Generate Timetable"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border shadow-sm bg-white">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-4 font-semibold text-gray-700">
                Title
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-gray-700">
                Year
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-gray-700">
                Branch
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-gray-700">
                Start Date
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-gray-700">
                End Date
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-gray-700 text-right">
                Exams
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timetables.map((timetable) => (
              <TableRow
                key={timetable.id}
                className="hover:bg-gray-100 even:bg-gray-50 transition-colors cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/timetable/${timetable.id}`)
                }
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
