import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(hospitals);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch hospitals" },
      { status: 500 }
    );
  }
}