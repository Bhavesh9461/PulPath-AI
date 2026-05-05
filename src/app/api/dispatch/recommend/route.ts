import { prisma } from "@/lib/prisma";
import { scoreHospitals } from "@/ai/hospitalScoring";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      latitude,
      longitude,
      severity = "MEDIUM",
    } = body;

    const hospitals = await prisma.hospital.findMany();

    const scoredHospitals = scoreHospitals({
      hospitals,
      patientLatitude: latitude,
      patientLongitude: longitude,
      severity,
    });

    const ambulances = await prisma.ambulance.findMany({
      where: {
        status: "AVAILABLE",
      },
    });

    const nearestAmbulance = ambulances
      .map((ambulance) => {
        const distance = Math.sqrt(
          Math.pow(ambulance.latitude - latitude, 2) +
            Math.pow(ambulance.longitude - longitude, 2)
        );

        return {
          ...ambulance,
          roughDistance: distance,
        };
      })
      .sort((a, b) => a.roughDistance - b.roughDistance)[0];

    return NextResponse.json({
      recommendedHospital: scoredHospitals[0],
      hospitalOptions: scoredHospitals,
      nearestAmbulance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}