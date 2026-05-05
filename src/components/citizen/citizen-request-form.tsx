"use client";

import { useState } from "react";
import { socket } from "@/lib/socket";
import {
  Ambulance,
  MapPin,
  Send,
  ShieldAlert,
  LocateFixed,
  CheckCircle2,
  Clock,
  Hospital,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CitizenRequestForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locFetched, setLocFetched] = useState(false);

  const [location, setLocation] = useState({
    latitude: 23.0225,
    longitude: 72.5714,
  });

  const getCurrentLocation = () => {
    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocFetched(true);
        setLocLoading(false);
      },
      () => {
        setLocLoading(false);
        alert("Location permission denied. Default location used.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const payload = {
      patientName: form.get("patientName"),
      phone: form.get("phone"),
      symptoms: form.get("symptoms"),
      severity: form.get("severity"),
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const res = await fetch("/api/emergency/request", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    socket.connect();
    socket.emit("emergency:new", {
      emergency: data.emergency,
      recommendedHospital: data.recommendedHospital,
      nearestAmbulance: data.nearestAmbulance,
    });

    setLoading(false);

    router.push(`/citizen/track/${data.emergency.id}`);
  };

  return (
    <section className="grid lg:grid-cols-[1fr_0.85fr] gap-8 items-stretch">
      <div className="pt-4 flex flex-col min-h-[640px]">
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Citizen Emergency Portal
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mt-3 leading-tight">
            Request ambulance with{" "}
            <span className="text-gradient">AI dispatch</span>
          </h1>

          <p className="mt-5 max-w-2xl">
            Submit emergency details and PulsePath AI will recommend the best
            ambulance and hospital using live location, hospital load, and
            severity.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <MiniCard icon={<MapPin size={22} />} title="Location Aware" />
            <MiniCard icon={<Ambulance size={22} />} title="Smart Ambulance" />
            <MiniCard icon={<ShieldAlert size={22} />} title="Priority Based" />
          </div>
        </div>

        <div className="space-y-4 mt-10">
          <div className="card p-5 overflow-hidden relative">
            <div
              className="absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl opacity-40"
              style={{ background: "var(--primary)" }}
            />

            <div className="flex items-center gap-3 relative z-10">
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: "var(--gradient-brand)",
                  color: "white",
                }}
              >
                <Activity size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold">Live AI Dispatch Layer</p>
                <p className="text-xs mt-1">
                  Emergency request is instantly routed to the dispatcher system.
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <BottomStat
              icon={<Clock size={18} />}
              title="Avg Response"
              value="6 min"
            />
            <BottomStat
              icon={<Hospital size={18} />}
              title="Hospitals"
              value="50+"
            />
            <BottomStat
              icon={<Ambulance size={18} />}
              title="Ambulances"
              value="120+"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 md:p-7 space-y-5">
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--danger)" }}
          >
            SOS Request
          </p>

          <h2 className="text-2xl font-bold mt-1">Emergency Request</h2>

          <p className="text-sm mt-1">
            Fill patient and emergency details. Dispatcher will receive it
            instantly.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Patient Name</label>
          <input
            name="patientName"
            required
            placeholder="Enter patient name"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <input
            name="phone"
            required
            placeholder="+91 98765 43210"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Severity</label>
          <select name="severity" required className="mt-2">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Symptoms</label>
          <textarea
            name="symptoms"
            required
            placeholder="Chest pain, accident, breathing issue..."
            className="mt-2 min-h-28"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Emergency Location</label>

          <button
            type="button"
            onClick={getCurrentLocation}
            className="mt-2 w-full rounded-2xl border p-4 text-left transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
            style={{
              background:
                "color-mix(in srgb, var(--primary) 6%, var(--card))",
              borderColor: locFetched ? "var(--primary)" : "var(--border)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div
                  className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: locFetched
                      ? "var(--gradient-brand)"
                      : "var(--card)",
                    color: locFetched ? "white" : "var(--primary)",
                    border: locFetched ? "none" : "1px solid var(--border)",
                  }}
                >
                  {locFetched ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <LocateFixed size={20} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {locLoading
                      ? "Fetching your current location..."
                      : locFetched
                      ? "Location detected successfully"
                      : "Click to detect your current location"}
                  </p>

                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--muted)" }}
                  >
                    {locFetched
                      ? "Your actual GPS coordinates are attached to this request."
                      : "This helps dispatch the nearest ambulance faster."}
                  </p>
                </div>
              </div>

              <span
                className="text-xs font-bold px-3 py-1 rounded-full shrink-0"
                style={{
                  background: locFetched
                    ? "color-mix(in srgb, var(--success) 14%, transparent)"
                    : "color-mix(in srgb, var(--primary) 12%, transparent)",
                  color: locFetched ? "var(--success)" : "var(--primary)",
                }}
              >
                {locFetched ? "ACTIVE" : "DETECT"}
              </span>
            </div>

            {locFetched && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-xl border p-3">
                  <p
                    className="text-[11px] font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    Latitude
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {location.latitude.toFixed(6)}
                  </p>
                </div>

                <div className="rounded-xl border p-3">
                  <p
                    className="text-[11px] font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    Longitude
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {location.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </button>
        </div>

        <button
          disabled={loading}
          className="btn-danger w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Requesting..." : "Request Emergency"}
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}

function MiniCard({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="surface rounded-2xl p-4 transition-transform duration-200 hover:-translate-y-1">
      <div style={{ color: "var(--primary)" }}>{icon}</div>
      <p className="font-semibold mt-3">{title}</p>
    </div>
  );
}

function BottomStat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="surface rounded-2xl p-4">
      <div
        className="h-9 w-9 rounded-xl flex items-center justify-center"
        style={{
          background: "color-mix(in srgb, var(--primary) 12%, transparent)",
          color: "var(--primary)",
        }}
      >
        {icon}
      </div>

      <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>
        {title}
      </p>

      <h3 className="text-xl font-bold mt-1">{value}</h3>
    </div>
  );
}