import React from "react";
import type { Guest } from "../screens/Register";

export default function GuestsSection({
  guests,
  onConfirm,
}: {
  guests: Guest[];
  onConfirm: (id: string, type: "wedding" | "ceremony") => Promise<void> | void;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold">Invitados</h2>
      <p className="text-sm text-gray-600 mb-4">
        Recibimos {guests.length} invitado{guests.length !== 1 ? "s" : ""} de la
        lista
      </p>

      <div className="grid gap-2">
        {guests.map((g) => (
          <div
            key={g.id}
            className="rounded-lg border p-3 flex flex-col md:flex-row items-start md:items-center justify-between bg-white"
          >
            <div className="flex-1">
              <div className="font-medium">{g.name}</div>

              {/* show gift if present */}
              <div className="text-sm text-gray-600 mt-1">
                {g.gift ? (
                  <span>🎁 {g.gift}</span>
                ) : (
                  <span className="italic text-gray-400">
                    No ha indicado regalo
                  </span>
                )}
              </div>

              {/* show song if present */}
              <div className="text-sm text-gray-600 mt-1">
                {g.songTitle ? (
                  <span>
                    🎵 {g.songTitle} —{" "}
                    <span className="text-gray-500">{g.songArtist}</span>
                  </span>
                ) : (
                  <span className="italic text-gray-400">
                    No ha sugerido canción
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 md:mt-0 flex items-center gap-2">
              <div
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  g.assistWedding
                    ? "bg-yellow-400 text-white"
                    : "border text-gray-600"
                }`}
              >
                Boda: {g.assistWedding ? "Sí" : "No"}
              </div>
              <div
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  g.assistCeremony
                    ? "bg-yellow-400 text-white"
                    : "border text-gray-600"
                }`}
              >
                Ceremonia: {g.assistCeremony ? "Sí" : "No"}
              </div>
              <button
                onClick={() => onConfirm(g.id, "wedding")}
                className="px-3 py-1 rounded-md bg-yellow-400 text-white hover:bg-yellow-800 cursor-pointer"
              >
                Confirmar Boda
              </button>
              <button
                onClick={() => onConfirm(g.id, "ceremony")}
                className="px-3 py-1 rounded-md border hover:bg-black hover:text-white cursor-pointer"
              >
                Confirmar Ceremonia
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-gray-600 italic">
        Nos encanta compartir este momento con vos. ¡Te esperamos!
      </p>
    </section>
  );
}
