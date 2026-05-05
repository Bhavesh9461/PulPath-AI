import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      freeBeds,
      freeIcuBeds,
    } = body;

    const hospital = await prisma.hospital.update({
      where: { id },
      data: {
        freeBeds: Number(freeBeds),
        freeIcuBeds: Number(freeIcuBeds),
      },
    });

    return NextResponse.json({
      message: "Capacity updated successfully",
      hospital,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update hospital capacity" },
      { status: 500 }
    );
  }
}