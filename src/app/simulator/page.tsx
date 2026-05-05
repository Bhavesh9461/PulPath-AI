"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

const route = [
  { latitude: 23.027, longitude: 72.571 },
  { latitude: 23.026, longitude: 72.572 },
  { latitude: 23.025, longitude: 72.573 },
  { latitude: 23.024, longitude: 72.574 },
  { latitude: 23.023, longitude: 72.575 },
  { latitude: 23.0225, longitude: 72.5714 },
];

export default function AmbulanceSimulatorPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    socket.connect();
    socket.emit("ambulance:join", "AMB-001");

    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = prev >= route.length - 1 ? 0 : prev + 1;

        socket.emit("ambulance:location", {
          ambulanceId: "AMB-001",
          requestId: "REQ-001",
          latitude: route[next].latitude,
          longitude: route[next].longitude,
          speed: 42,
        });

        return next;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  return (
    <section className="min-h-[70vh] flex items-center justify-center">
      <div className="card p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold">
          Ambulance Simulator
        </h1>

        <p className="mt-3">
          This page sends fake ambulance GPS updates every 2
          seconds.
        </p>

        <div className="mt-6 rounded-2xl surface p-4">
          <p>Ambulance ID: AMB-001</p>
          <p>Latitude: {route[index].latitude}</p>
          <p>Longitude: {route[index].longitude}</p>
        </div>
      </div>
    </section>
  );
}