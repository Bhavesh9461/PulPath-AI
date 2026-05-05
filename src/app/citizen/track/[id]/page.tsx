import CitizenTracking from "@/components/citizen/citizen-tracking";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CitizenTracking requestId={id} />;
}