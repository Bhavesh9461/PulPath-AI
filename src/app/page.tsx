import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const hospitals = await prisma.hospital.findMany();

  return (
    <div>
      <h1>PulsePath AI</h1>

      {hospitals.map((h) => (
        <p key={h.id}>{h.name}</p>
      ))}
    </div>
  );
}