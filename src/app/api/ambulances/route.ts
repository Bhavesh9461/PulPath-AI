import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const ambulances = await prisma.ambulance.findMany();

  return NextResponse.json(ambulances);
}