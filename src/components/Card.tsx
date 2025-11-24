import React from "react";
export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-6 bg-white shadow-sm flex flex-col">
      {children}
    </div>
  );
}
