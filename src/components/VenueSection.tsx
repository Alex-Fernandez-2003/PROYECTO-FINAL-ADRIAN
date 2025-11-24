import React, { useState } from "react";
import Modal from "./Modal";
import type { Guest } from "../screens/Register";
export default function VenueSection({
  guests,
  onConfirm,
}: {
  guests: Guest[];
  onConfirm: (id: string, type: "wedding" | "ceremony") => Promise<void>;
}) {
  const [mapOpen, setMapOpen] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [typeToConfirm, setTypeToConfirm] = useState<"wedding" | "ceremony">(
    "wedding"
  );

  function openChooser(type: "wedding" | "ceremony") {
    setTypeToConfirm(type);
    if (guests.length === 1) {
      onConfirm(guests[0].id, type);
      return;
    }
    setChooserOpen(true);
  }

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border p-6 bg-white">
          <h3 className="text-xl font-semibold mb-2">Ceremonia</h3>
          <p className="text-sm text-gray-600 mb-3">Lugar: La Catedral</p>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => openChooser("ceremony")}
              className="px-4 py-2 rounded-md bg-yellow-400 text-white font-semibold cursor-pointer hover:bg-yellow-800"
            >
              Confirmar asistencia
            </button>
            <button
              onClick={() => setMapOpen(true)}
              className="px-4 py-2 rounded-md border cursor-pointer hover:bg-black hover:text-white"
            >
              Ver Dirección
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-6 bg-white">
          <h3 className="text-xl font-semibold mb-2">Fiesta</h3>
          <p className="text-sm text-gray-600 mb-3">Lugar: Salón</p>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => openChooser("wedding")}
              className="px-4 py-2 rounded-md bg-yellow-400 text-white font-semibold cursor-pointer hover:bg-yellow-800"
            >
              Confirmar asistencia
            </button>
            <button
              onClick={() => setMapOpen(true)}
              className="px-4 py-2 rounded-md border cursor-pointer hover:bg-black hover:text-white"
            >
              Ver Dirección
            </button>
          </div>
        </div>
      </div>

      {mapOpen && (
        <Modal onClose={() => setMapOpen(false)}>
          <div className="w-full h-96">
            <iframe
              title="mapa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2945.6386502836663!2d-64.74367990893752!3d-21.53621968878883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x940647dfb7a7d803%3A0x9c955b696d54271a!2sUniversidad%20Privada%20Domingo%20Savio!5e0!3m2!1ses!2scl!4v1763792863631!5m2!1ses!2scl"
              className="w-full h-full rounded-md border-0"
            />
          </div>
        </Modal>
      )}

      {chooserOpen && (
        <Modal onClose={() => setChooserOpen(false)}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3">¿Quién confirma?</h3>
            <div className="space-y-2">
              {guests.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between border rounded p-2"
                >
                  <div>{g.name}</div>
                  <button
                    onClick={async () => {
                      await onConfirm(g.id, typeToConfirm);
                      setChooserOpen(false);
                    }}
                    className="px-3 py-1 rounded bg-yellow-400 text-white cursor-pointer hover:bg-yellow-800"
                  >
                    Confirmar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
