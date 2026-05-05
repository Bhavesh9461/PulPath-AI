type Hospital = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  freeBeds: number;
  freeIcuBeds: number;
};

type EmergencySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function scoreHospitals(params: {
  hospitals: Hospital[];
  patientLatitude: number;
  patientLongitude: number;
  severity: EmergencySeverity;
}) {
  const {
    hospitals,
    patientLatitude,
    patientLongitude,
    severity,
  } = params;

  return hospitals
    .map((hospital) => {
      const distance = calculateDistanceKm(
        patientLatitude,
        patientLongitude,
        hospital.latitude,
        hospital.longitude
      );

      const bedScore = hospital.freeBeds * 2;
      const icuScore =
        severity === "CRITICAL" || severity === "HIGH"
          ? hospital.freeIcuBeds * 8
          : hospital.freeIcuBeds * 3;

      const distancePenalty = distance * 10;

      const finalScore = bedScore + icuScore - distancePenalty;

      return {
        ...hospital,
        distanceKm: Number(distance.toFixed(2)),
        score: Number(finalScore.toFixed(2)),
      };
    })
    .sort((a, b) => b.score - a.score);
}