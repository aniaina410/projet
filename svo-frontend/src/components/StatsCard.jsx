// src/components/StatsCard.jsx
import React from "react";

export default function StatsCard({ title, value, delta, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">{title}</div>
          <div className="text-2xl font-semibold text-gray-800">{value}</div>
        </div>
        <div className="text-sm text-green-600">{delta}</div>
      </div>
      <div className="mt-3 text-gray-500 text-sm">{icon}</div>
    </div>
  );
}
