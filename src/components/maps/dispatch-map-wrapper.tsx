"use client";

import dynamic from "next/dynamic";

const LiveDispatchMap = dynamic(
  () => import("./live-dispatch-map"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] rounded-3xl surface flex items-center justify-center">
        Loading live map...
      </div>
    ),
  }
);

export default LiveDispatchMap;