import { prisma } from "@/lib/prisma";
import { scoreHospitals } from "@/ai/hospitalScoring";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      patientName,
      phone,
      symptoms,
      severity,
      latitude,
      longitude,
    } = body;

    let user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: patientName || "Emergency User",
          email: `${phone}@pulsepath.local`,
          phone,
          role: "CITIZEN",
        },
      });
    }

    const emergency = await prisma.emergencyRequest.create({
      data: {
        userId: user.id,
        patientName,
        symptoms,
        severity,
        latitude,
        longitude,
        status: "PENDING",
      },
    });

    const hospitals = await prisma.hospital.findMany();

    const scoredHospitals = scoreHospitals({
      hospitals,
      patientLatitude: latitude,
      patientLongitude: longitude,
      severity,
    });

    const ambulances = await prisma.ambulance.findMany({
      where: { status: "AVAILABLE" },
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
      emergency,
      recommendedHospital: scoredHospitals[0],
      nearestAmbulance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Emergency request failed" },
      { status: 500 }
    );
  }
}