import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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
        latitude: 23.0300,
        longitude: 72.5800,
        totalBeds: 100,
        freeBeds: 40,
        icuBeds: 20,
        freeIcuBeds: 8,
      },
      {
        name: "Civil Hospital",
        latitude: 23.0500,
        longitude: 72.6000,
        totalBeds: 200,
        freeBeds: 60,
        icuBeds: 50,
        freeIcuBeds: 14,
      },
    ],
  });

  await prisma.ambulance.createMany({
    data: [
      {
        vehicleNumber: "GJ01AA1010",
        latitude: 23.027,
        longitude: 72.571,
      },
    ],
  });
}

main();