import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid2X2, List, LayoutGrid, PlusCircle, Calendar } from "lucide-react";

export default function Seats() {
  const rooms = [
    { id: "1", name: "Room 101", capacity: 60, available: true },
    { id: "2", name: "Room 102", capacity: 40, available: false },
    { id: "3", name: "Room 103", capacity: 50, available: true },
    { id: "4", name: "Room 201", capacity: 70, available: true },
    { id: "5", name: "Room 202", capacity: 45, available: false },
    { id: "6", name: "Room 203", capacity: 55, available: true },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Seat Arrangement</h1>
          <p className="text-muted-foreground">
            Manage exam room allocations and seating arrangements
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle size={18} />
          Create New Arrangement
        </Button>
      </div>

      <Tabs defaultValue="rooms">
        <TabsList className="mb-4">
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <Grid2X2 size={16} />
            Rooms
          </TabsTrigger>
          <TabsTrigger value="layouts" className="flex items-center gap-2">
            <LayoutGrid size={16} />
            Layouts
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Calendar size={16} />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <List size={16} />
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className={room.available ? "" : "opacity-70"}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>
                    Capacity: {room.capacity} students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      Status:
                      <span
                        className={`ml-1 font-medium ${
                          room.available ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {room.available ? "Available" : "In Use"}
                      </span>
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={!room.available}
                  >
                    {room.available ? "Assign Room" : "Currently Assigned"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layouts" className="mt-0">
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-white">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Room Layout Designer</h3>
              <p className="text-muted-foreground">
                Create and manage your exam room layouts
              </p>
            </div>
            <Button>Create New Layout</Button>
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="mt-0">
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-white">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Room Schedules</h3>
              <p className="text-muted-foreground">
                View and manage room allocation schedules
              </p>
            </div>
            <Button>View Calendar</Button>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-0">
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-white">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Student Assignments</h3>
              <p className="text-muted-foreground">
                Assign students to exam rooms
              </p>
            </div>
            <Button>Manage Assignments</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
