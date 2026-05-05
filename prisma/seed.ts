import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  await prisma.hospital.createMany({
    data: [
      {
        name: "Apollo Hospital",
        email: "apollo@pulsepath.ai",
        phone: "9876543210",
        latitude: 23.0305,
        longitude: 72.5805,
        totalBeds: 120,
        freeBeds: 45,
        icuBeds: 30,
        freeIcuBeds: 10,
      },
      {
        name: "Civil Hospital",
        email: "civil@pulsepath.ai",
        phone: "9876543211",
        latitude: 23.0502,
        longitude: 72.6031,
        totalBeds: 250,
        freeBeds: 80,
        icuBeds: 60,
        freeIcuBeds: 18,
      },
      {
        name: "Sterling Hospital",
        email: "sterling@pulsepath.ai",
        phone: "9876543212",
        latitude: 23.0258,
        longitude: 72.5319,
        totalBeds: 150,
        freeBeds: 55,
        icuBeds: 35,
        freeIcuBeds: 12,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.ambulance.createMany({
    data: [
      {
        vehicleNumber: "GJ01AA1010",
        latitude: 23.027,
        longitude: 72.571,
        status: "AVAILABLE",
      },
      {
        vehicleNumber: "GJ01AA2020",
        latitude: 23.039,
        longitude: 72.585,
        status: "AVAILABLE",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed data inserted successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });