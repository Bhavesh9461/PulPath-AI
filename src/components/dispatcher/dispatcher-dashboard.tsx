"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import LiveDispatchMap from "@/components/maps/dispatch-map-wrapper";
import {
  Activity,
  Ambulance,
  Hospital,
  Radio,
} from "lucide-react";

type Location = {
  latitude: number;
  longitude: number;
};

type LiveEmergency = {
  emergency: {
    id: string;
    patientName?: string;
    symptoms?: string;
    severity: string;
    latitude: number;
    longitude: number;
    status: string;
  };
  recommendedHospital?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    score?: number;
    distanceKm?: number;
  };
  nearestAmbulance?: {
    id: string;
    vehicleNumber: string;
    latitude: number;
    longitude: number;
  };
};

export default function DispatcherDashboard() {
  const [emergencies, setEmergencies] = useState<LiveEmergency[]>([]);

  const [ambulanceLocation, setAmbulanceLocation] = useState<Location>({
    latitude: 23.027,
    longitude: 72.571,
  });

  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 23.0225,
    longitude: 72.5714,
  });

  const [hospitalLocation, setHospitalLocation] = useState<Location>({
    latitude: 23.0305,
    longitude: 72.5805,
  });

  const [liveStatus, setLiveStatus] = useState("Connecting...");

  useEffect(() => {
    socket.connect();
    socket.emit("dispatcher:join");

    socket.on("connect", () => {
      setLiveStatus("Realtime Connected");
    });

    socket.on("disconnect", () => {
      setLiveStatus("Disconnected");
    });

    socket.on("ambulance:location:update", (data) => {
      setAmbulanceLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    socket.on("emergency:new", (data: LiveEmergency) => {
      setEmergencies((prev) => [data, ...prev]);

      if (data.emergency) {
        setUserLocation({
          latitude: data.emergency.latitude,
          longitude: data.emergency.longitude,
        });
      }

      if (data.recommendedHospital) {
        setHospitalLocation({
          latitude: data.recommendedHospital.latitude,
          longitude: data.recommendedHospital.longitude,
        });
      }

      if (data.nearestAmbulance) {
        setAmbulanceLocation({
          latitude: data.nearestAmbulance.latitude,
          longitude: data.nearestAmbulance.longitude,
        });
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("ambulance:location:update");
      socket.off("emergency:new");
      socket.disconnect();
    };
  }, []);

  const latestEmergency = emergencies[0];

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            Emergency Command Center
          </p>

          <h1 className="text-3xl md:text-5xl font-bold">
            Dispatcher Dashboard
          </h1>

          <p className="mt-2 max-w-2xl">
            Monitor emergencies, ambulances, hospital capacity, and
            AI-powered dispatch recommendations in real time.
          </p>
        </div>

        <div className="surface rounded-2xl px-4 py-3 flex items-center gap-2">
          <Radio size={18} style={{ color: "var(--success)" }} />
          <span className="text-sm font-medium">{liveStatus}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity size={20} />}
          label="Active Emergencies"
          value={String(emergencies.length)}
          color="var(--danger)"
        />

        <StatCard
          icon={<Ambulance size={20} />}
          label="Available Ambulances"
          value="12"
          color="var(--primary)"
        />

        <StatCard
          icon={<Hospital size={20} />}
          label="Hospitals Online"
          value="15"
          color="var(--secondary)"
        />

        <StatCard
          icon={<Radio size={20} />}
          label="Avg Response"
          value="7 min"
          color="var(--success)"
        />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        <LiveDispatchMap
          userLocation={userLocation}
          ambulanceLocation={ambulanceLocation}
          hospitalLocation={hospitalLocation}
        />

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-xl font-semibold">
              AI Recommendation
            </h2>

            <p className="mt-1 text-sm">
              Best dispatch decision based on distance, severity,
              hospital load, and live ambulance position.
            </p>

            <div className="mt-5 space-y-3">
              <InfoRow
                label="Assigned Ambulance"
                value={
                  latestEmergency?.nearestAmbulance?.vehicleNumber ||
                  "Waiting..."
                }
              />

              <InfoRow
                label="Recommended Hospital"
                value={
                  latestEmergency?.recommendedHospital?.name ||
                  "Waiting..."
                }
              />

              <InfoRow
                label="Hospital Score"
                value={
                  latestEmergency?.recommendedHospital?.score
                    ? String(latestEmergency.recommendedHospital.score)
                    : "Waiting..."
                }
              />

              <InfoRow
                label="Severity"
                value={latestEmergency?.emergency?.severity || "Waiting..."}
                danger={
                  latestEmergency?.emergency?.severity === "CRITICAL" ||
                  latestEmergency?.emergency?.severity === "HIGH"
                }
              />

              <InfoRow label="ETA" value="7 minutes" />
            </div>

            <button className="btn-primary w-full mt-5">
              Confirm Dispatch
            </button>
          </div>

          <div className="card p-5">
            <h2 className="text-xl font-semibold">
              Live Emergency Queue
            </h2>

            <div className="mt-4 space-y-3">
              {emergencies.length === 0 ? (
                <p className="text-sm">No live emergencies yet.</p>
              ) : (
                emergencies.map((item, index) => (
                  <div
                    key={item.emergency.id}
                    className="rounded-2xl border p-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium">
                        {item.emergency.symptoms || "Emergency Request"}
                      </p>

                      <p className="text-xs mt-1">
                        Patient:{" "}
                        {item.emergency.patientName || "Unknown"}
                      </p>

                      <p className="text-xs">
                        Recommended:{" "}
                        {item.recommendedHospital?.name || "Calculating..."}
                      </p>

                      <p className="text-xs">
                        Priority #{index + 1}
                      </p>
                    </div>

                    <span
                      className="text-xs font-semibold"
                      style={{
                        color:
                          item.emergency.severity === "CRITICAL" ||
                          item.emergency.severity === "HIGH"
                            ? "var(--danger)"
                            : "var(--primary)",
                      }}
                    >
                      {item.emergency.severity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="card p-5">
      <div
        className="h-10 w-10 rounded-2xl flex items-center justify-center"
        style={{
          background: `color-mix(in srgb, ${color} 14%, transparent)`,
          color,
        }}
      >
        {icon}
      </div>

      <p className="mt-4 text-sm">{label}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}

function InfoRow({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm" style={{ color: "var(--muted)" }}>
        {label}
      </span>

      <span
        className="text-sm font-semibold text-right"
        style={{
          color: danger ? "var(--danger)" : "var(--foreground)",
        }}
      >
        {value}
      </span>
    </div>
  );
}