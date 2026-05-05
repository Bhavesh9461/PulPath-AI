"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import LiveDispatchMap from "@/components/maps/dispatch-map-wrapper";
import { Ambulance, Clock, Hospital, Radio } from "lucide-react";

type Location = {
  latitude: number;
  longitude: number;
};

export default function CitizenTracking({
  requestId,
}: {
  requestId: string;
}) {
  const [ambulanceLocation, setAmbulanceLocation] =
    useState<Location>({
      latitude: 23.027,
      longitude: 72.571,
    });

  const userLocation = {
    latitude: 23.0225,
    longitude: 72.5714,
  };

  const hospitalLocation = {
    latitude: 23.0305,
    longitude: 72.5805,
  };

  useEffect(() => {
    socket.connect();
    socket.emit("citizen:track", requestId);

    socket.on("ambulance:location:update", (data) => {
      setAmbulanceLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    return () => {
      socket.off("ambulance:location:update");
      socket.disconnect();
    };
  }, [requestId]);

  return (
    <section className="space-y-6">
      <div className="card p-5 md:p-7">
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--success)" }}
        >
          Emergency Request Active
        </p>

        <h1 className="text-3xl md:text-5xl font-bold mt-2">
          Ambulance is on the way
        </h1>

        <p className="mt-3">
          Your request has been received. Track ambulance movement
          live below.
        </p>

        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          <Step icon={<Radio />} title="Requested" active />
          <Step icon={<Hospital />} title="Hospital Selected" active />
          <Step icon={<Ambulance />} title="Ambulance Assigned" active />
          <Step icon={<Clock />} title="Arriving Soon" />
        </div>
      </div>

      <LiveDispatchMap
        userLocation={userLocation}
        ambulanceLocation={ambulanceLocation}
        hospitalLocation={hospitalLocation}
      />
    </section>
  );
}

function Step({
  icon,
  title,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
}) {
  return (
    <div className="surface rounded-2xl p-4">
      <div
        className="h-10 w-10 rounded-2xl flex items-center justify-center"
        style={{
          background: active
            ? "var(--gradient-brand)"
            : "var(--card)",
          color: active ? "white" : "var(--muted)",
        }}
      >
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold">{title}</p>
    </div>
  );
}