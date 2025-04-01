import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data in correct order
  await prisma.$transaction([
    prisma.seatingArrangement.deleteMany(),
    prisma.examEntry.deleteMany(),
    prisma.timetable.deleteMany(),
    prisma.student.deleteMany(),
    prisma.seat.deleteMany(),
    prisma.classroom.deleteMany(),
  ]);

  // Define branches and classroom configuration
  const branches = ["CSE", "AIDS", "ECE", "ME"];
  const years = [1, 2, 3, 4];
  const classroomsPerBranch = 2; // Creates 2 classrooms per branch (total 8 classrooms)
  const seatsPerClassroom = 30;
  const studentsPerYear = 60;

  // Create classrooms for all branches
  const classrooms = await Promise.all(
    branches.flatMap((branch) =>
      years.map((year) =>
        prisma.classroom.create({
          data: {
            name: `${branch}-${year}01`,
            capacity: seatsPerClassroom,
            branch: branch,
            year: year,
            seats: {
              create: Array.from({ length: seatsPerClassroom }, (_, i) => ({
                seatNumber: `A${i + 1}`,
              })),
            },
          },
        })
      )
    )
  );

  // Generate students for all branches and years
  const students = [];
  for (const branch of branches) {
    for (const year of years) {
      for (let i = 1; i <= studentsPerYear; i++) {
        students.push({
          rollNumber: `${branch}${year}-${i.toString().padStart(3, "0")}`,
          name: `Student ${i} ${branch}${year}`,
          branch: branch,
          year: year,
        });
      }
    }
  }

  await prisma.student.createMany({ data: students });

  console.log(`Seeded:
- ${classrooms.length} classrooms (${branches.length} branches, ${
    years.length
  } years each)
- ${students.length} students
- ${classrooms.length * seatsPerClassroom} seats total`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
