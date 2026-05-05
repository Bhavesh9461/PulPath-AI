"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bed,
  Building2,
  Hospital,
  Save,
  ShieldCheck,
} from "lucide-react";

type HospitalType = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  latitude: number;
  longitude: number;
  totalBeds: number;
  freeBeds: number;
  icuBeds: number;
  freeIcuBeds: number;
};

export default function HospitalDashboard() {
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [freeBeds, setFreeBeds] = useState("");
  const [freeIcuBeds, setFreeIcuBeds] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedHospital = useMemo(() => {
    return hospitals.find((h) => h.id === selectedHospitalId) || null;
  }, [hospitals, selectedHospitalId]);

  useEffect(() => {
    async function fetchHospitals() {
      try {
        const res = await fetch("/api/hospitals", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!Array.isArray(data)) {
          setHospitals([]);
          return;
        }

        setHospitals(data);

        if (data.length > 0) {
          const firstHospital = data[0];

          setSelectedHospitalId(firstHospital.id);
          setFreeBeds(String(firstHospital.freeBeds));
          setFreeIcuBeds(String(firstHospital.freeIcuBeds));
        }
      } catch (error) {
        console.error("Failed to load hospitals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHospitals();
  }, []);

  const handleHospitalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const hospitalId = e.target.value;
    const hospital = hospitals.find((h) => h.id === hospitalId);

    setSelectedHospitalId(hospitalId);

    if (hospital) {
      setFreeBeds(String(hospital.freeBeds));
      setFreeIcuBeds(String(hospital.freeIcuBeds));
    }
  };

  const updateCapacity = async () => {
    if (!selectedHospital) {
      alert("Please select a hospital first");
      return;
    }

    const beds = Number(freeBeds);
    const icu = Number(freeIcuBeds);

    if (Number.isNaN(beds) || Number.isNaN(icu)) {
      alert("Please enter valid numbers");
      return;
    }

    if (beds < 0 || icu < 0) {
      alert("Capacity cannot be negative");
      return;
    }

    if (beds > selectedHospital.totalBeds) {
      alert(
        `Free beds cannot be more than total beds (${selectedHospital.totalBeds})`
      );
      return;
    }

    if (icu > selectedHospital.icuBeds) {
      alert(
        `Free ICU beds cannot be more than total ICU beds (${selectedHospital.icuBeds})`
      );
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(
        `/api/hospitals/${selectedHospital.id}/capacity`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            freeBeds: beds,
            freeIcuBeds: icu,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update capacity");
        return;
      }

      setHospitals((prev) =>
        prev.map((hospital) =>
          hospital.id === selectedHospital.id ? data.hospital : hospital
        )
      );

      alert("Hospital capacity updated successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleFreeBedsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!selectedHospital) return;

    const value = e.target.value;

    if (value === "") {
      setFreeBeds("");
      return;
    }

    const numberValue = Number(value);

    if (numberValue < 0) {
      setFreeBeds("0");
      return;
    }

    if (numberValue > selectedHospital.totalBeds) {
      setFreeBeds(String(selectedHospital.totalBeds));
      return;
    }

    setFreeBeds(value);
  };

  const handleFreeIcuBedsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!selectedHospital) return;

    const value = e.target.value;

    if (value === "") {
      setFreeIcuBeds("");
      return;
    }

    const numberValue = Number(value);

    if (numberValue < 0) {
      setFreeIcuBeds("0");
      return;
    }

    if (numberValue > selectedHospital.icuBeds) {
      setFreeIcuBeds(String(selectedHospital.icuBeds));
      return;
    }

    setFreeIcuBeds(value);
  };

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="card p-6">Loading hospital dashboard...</div>
      </section>
    );
  }

  if (hospitals.length === 0) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="card p-6 max-w-md text-center">
          <h1 className="text-2xl font-bold">No hospitals found</h1>
          <p className="mt-2">
            Add hospital seed data first, then reload this page.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Hospital Operations
          </p>

          <h1 className="text-3xl md:text-5xl font-bold">
            Capacity Management
          </h1>

          <p className="mt-2 max-w-2xl">
            Update available beds and ICU capacity so PulsePath AI can
            recommend the safest hospital during emergencies.
          </p>
        </div>

        <div className="surface rounded-2xl px-4 py-3 flex items-center gap-2">
          <ShieldCheck size={18} style={{ color: "var(--success)" }} />
          <span className="text-sm font-medium">
            Hospital Network Online
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={<Hospital size={20} />}
          label="Hospitals"
          value={String(hospitals.length)}
          color="var(--primary)"
        />

        <StatCard
          icon={<Bed size={20} />}
          label="Total Free Beds"
          value={String(hospitals.reduce((sum, h) => sum + h.freeBeds, 0))}
          color="var(--success)"
        />

        <StatCard
          icon={<Activity size={20} />}
          label="Free ICU Beds"
          value={String(
            hospitals.reduce((sum, h) => sum + h.freeIcuBeds, 0)
          )}
          color="var(--danger)"
        />

        <StatCard
          icon={<Building2 size={20} />}
          label="Network Status"
          value="Live"
          color="var(--secondary)"
        />
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-6">
        <div className="card p-5 md:p-6">
          <h2 className="text-2xl font-bold">Update Capacity</h2>
          <p className="text-sm mt-1">
            Select hospital and update real-time capacity.
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label className="text-sm font-medium">
                Select Hospital
              </label>

              <select
                value={selectedHospitalId}
                onChange={handleHospitalChange}
                className="mt-2 cursor-pointer"
              >
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedHospital && (
              <div className="rounded-2xl border p-4">
                <p className="text-sm font-semibold">
                  {selectedHospital.name}
                </p>

                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Total Beds: {selectedHospital.totalBeds} · ICU Beds:{" "}
                  {selectedHospital.icuBeds}
                </p>

                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Lat {selectedHospital.latitude.toFixed(4)} · Lng{" "}
                  {selectedHospital.longitude.toFixed(4)}
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium">
                  Free General Beds
                </label>

                {selectedHospital && (
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--muted)" }}
                  >
                    Max {selectedHospital.totalBeds}
                  </span>
                )}
              </div>

              <input
                type="number"
                min="0"
                max={selectedHospital?.totalBeds}
                value={freeBeds}
                onChange={handleFreeBedsChange}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium">
                  Free ICU Beds
                </label>

                {selectedHospital && (
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--muted)" }}
                  >
                    Max {selectedHospital.icuBeds}
                  </span>
                )}
              </div>

              <input
                type="number"
                min="0"
                max={selectedHospital?.icuBeds}
                value={freeIcuBeds}
                onChange={handleFreeIcuBedsChange}
                className="mt-2"
              />
            </div>

            <button
              onClick={updateCapacity}
              disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Update Capacity"}
            </button>
          </div>
        </div>

        <div className="card p-5 md:p-6">
          <h2 className="text-2xl font-bold">Hospital Network</h2>
          <p className="text-sm mt-1">
            Current hospital load used by AI recommendation engine.
          </p>

          <div className="mt-5 space-y-4">
            {hospitals.map((hospital) => {
              const bedPercent =
                hospital.totalBeds === 0
                  ? 0
                  : Math.min(
                      100,
                      Math.round((hospital.freeBeds / hospital.totalBeds) * 100)
                    );

              const icuPercent =
                hospital.icuBeds === 0
                  ? 0
                  : Math.min(
                      100,
                      Math.round(
                        (hospital.freeIcuBeds / hospital.icuBeds) * 100
                      )
                    );

              const isSelected = hospital.id === selectedHospitalId;

              return (
                <button
                  type="button"
                  key={hospital.id}
                  onClick={() => {
                    setSelectedHospitalId(hospital.id);
                    setFreeBeds(String(hospital.freeBeds));
                    setFreeIcuBeds(String(hospital.freeIcuBeds));
                  }}
                  className="w-full text-left rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: isSelected
                      ? "var(--primary)"
                      : "var(--border)",
                    background: isSelected
                      ? "color-mix(in srgb, var(--primary) 7%, var(--card))"
                      : "var(--card)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{hospital.name}</h3>

                      <p className="text-xs mt-1">
                        Lat {hospital.latitude.toFixed(4)} · Lng{" "}
                        {hospital.longitude.toFixed(4)}
                      </p>
                    </div>

                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: isSelected
                          ? "color-mix(in srgb, var(--primary) 14%, transparent)"
                          : "color-mix(in srgb, var(--success) 14%, transparent)",
                        color: isSelected ? "var(--primary)" : "var(--success)",
                      }}
                    >
                      {isSelected ? "SELECTED" : "ONLINE"}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <CapacityBar
                      label="General Beds"
                      value={`${hospital.freeBeds}/${hospital.totalBeds}`}
                      percent={bedPercent}
                      color="var(--primary)"
                    />

                    <CapacityBar
                      label="ICU Beds"
                      value={`${hospital.freeIcuBeds}/${hospital.icuBeds}`}
                      percent={icuPercent}
                      color="var(--danger)"
                    />
                  </div>
                </button>
              );
            })}
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

function CapacityBar({
  label,
  value,
  percent,
  color,
}: {
  label: string;
  value: string;
  percent: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium">{label}</p>
        <p className="text-xs font-semibold">{value}</p>
      </div>

      <div
        className="h-2 rounded-full mt-2 overflow-hidden"
        style={{
          background: "color-mix(in srgb, var(--border) 70%, transparent)",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            background: color,
          }}
        />
      </div>

      <p className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
        {percent}% available
      </p>
    </div>
  );
}