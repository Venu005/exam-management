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

  // Seed CSE Classrooms with unique names
  const cseClassrooms = await Promise.all(
    [1, 2, 3, 4].map(async (year) => {
      return prisma.classroom.create({
        data: {
          name: `CSE-${year}01-${Date.now()}`, // Add unique timestamp
          capacity: 60,
          branch: "CSE",
          year: year,
          seats: {
            create: Array.from({ length: 60 }, (_, i) => ({
              seatNumber: `${String.fromCharCode(65 + Math.floor(i / 30))}${(i % 30) + 1}`,
            })),
          },
        },
      });
    })
  );

  // Seed Students with unique roll numbers
  const students = [];
  for (let year = 1; year <= 4; year++) {
    for (let i = 1; i <= 50; i++) {
      students.push({
        rollNumber: `CSE${year}-${i.toString().padStart(3, "0")}-${Date.now()}`, // Add timestamp
        name: `Student ${i}`,
        branch: "CSE",
        year: year,
      });
    }
  }

  await prisma.student.createMany({ data: students });
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
