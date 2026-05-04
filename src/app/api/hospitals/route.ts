import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const hospitals = await prisma.hospital.findMany();

  return NextResponse.json(hospitals);
}