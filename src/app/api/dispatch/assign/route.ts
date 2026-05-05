import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      requestId,
      ambulanceId,
      hospitalId,
      etaMinutes,
      routeDistanceKm,
    } = body;

    if (!requestId || !ambulanceId || !hospitalId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const assignment = await prisma.$transaction(async (tx) => {
      const createdAssignment = await tx.dispatchAssignment.create({
        data: {
          requestId,
          ambulanceId,
          hospitalId,
          etaMinutes: etaMinutes || 7,
          routeDistanceKm: routeDistanceKm || 4.2,
          status: "ACTIVE",
        },
        include: {
          request: true,
          ambulance: true,
          hospital: true,
        },
      });

      await tx.emergencyRequest.update({
        where: { id: requestId },
        data: { status: "ASSIGNED" },
      });

      await tx.ambulance.update({
        where: { id: ambulanceId },
        data: { status: "BUSY" },
      });

      return createdAssignment;
    });

    return NextResponse.json({
      message: "Dispatch assigned successfully",
      assignment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to assign dispatch" },
      { status: 500 }
    );
  }
}