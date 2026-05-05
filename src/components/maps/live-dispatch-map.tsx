"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

type Location = {
  latitude: number;
  longitude: number;
};

type Props = {
  userLocation?: Location;
  ambulanceLocation?: Location;
  hospitalLocation?: Location;
};

const ambulanceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",
  iconSize: [36, 36],
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320371.png",
  iconSize: [36, 36],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [32, 32],
});

export default function LiveDispatchMap({
  userLocation,
  ambulanceLocation,
  hospitalLocation,
}: Props) {
  const center = useMemo(() => {
    return [
      userLocation?.latitude || 23.0225,
      userLocation?.longitude || 72.5714,
    ] as [number, number];
  }, [userLocation]);

  const routePoints = [
    ambulanceLocation &&
      [ambulanceLocation.latitude, ambulanceLocation.longitude],
    userLocation && [userLocation.latitude, userLocation.longitude],
    hospitalLocation &&
      [hospitalLocation.latitude, hospitalLocation.longitude],
  ].filter(Boolean) as [number, number][];

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-3xl border surface">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Marker
            position={[
              userLocation.latitude,
              userLocation.longitude,
            ]}
            icon={userIcon}
          >
            <Popup>Emergency Location</Popup>
          </Marker>
        )}

        {ambulanceLocation && (
          <Marker
            position={[
              ambulanceLocation.latitude,
              ambulanceLocation.longitude,
            ]}
            icon={ambulanceIcon}
          >
            <Popup>Ambulance Live Location</Popup>
          </Marker>
        )}

        {hospitalLocation && (
          <Marker
            position={[
              hospitalLocation.latitude,
              hospitalLocation.longitude,
            ]}
            icon={hospitalIcon}
          >
            <Popup>Recommended Hospital</Popup>
          </Marker>
        )}

        {routePoints.length >= 2 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: "#00d1c1",
              weight: 5,
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}