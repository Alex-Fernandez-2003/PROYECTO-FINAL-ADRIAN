import { useState } from "react";
import Modal from "./Modal";
import type { Guest } from "../screens/Register";

export default function GiftsSection({
  guests,
  gifts,
  onAddGift,
}: {
  guests: Guest[];
  gifts: Record<string, string[]>;
  onAddGift: (
    guestId: string | undefined,
    giftText: string
  ) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<string | undefined>(
    guests.length === 1 ? guests[0].id : undefined
  );

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold">Regalos</h2>
      <p className="text-sm text-gray-600 mb-4">
        Si deseas regalarnos algo más que tu hermosa presencia...
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-md border hover:bg-black hover:text-white cursor-pointer"
        >
          Ver regalos registrados
        </button>
        <button
          onClick={() => {
            setAddOpen(true);
            setSelectedGuest(undefined);
          }}
          className="px-4 py-2 rounded-md bg-yellow-400 text-white cursor-pointer hover:bg-yellow-800"
        >
          Añadir regalo
        </button>
      </div>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Regalos registrados</h3>
            <div className="space-y-3 max-h-72 overflow-auto">
              {guests.map((g) => (
                <div key={g.id} className="border rounded p-3">
                  <div className="font-medium">{g.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {g.gift ? (
                      g.gift
                    ) : (
                      <span className="italic text-gray-400">
                        No ha indicado regalo
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {/* also show anonymous local if present in gifts */}
              {Object.keys(gifts).length === 0 && guests.length === 0 && (
                <div className="text-gray-600">
                  No hay regalos registrados aún.
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {addOpen && (
        <Modal onClose={() => setAddOpen(false)}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3">Añadir regalo</h3>

            <label className="block text-sm text-gray-700 mb-1">
              Invitado (opcional)
            </label>
            <select
              className="w-full mb-3 rounded border p-2"
              value={selectedGuest ?? ""}
              onChange={(e) => setSelectedGuest(e.target.value || undefined)}
            >
              <option value="">-- Seleccione una persona --</option>
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <AddGiftForm
              onSave={async (text) => {
                await onAddGift(selectedGuest, text);
                setAddOpen(false);
              }}
            />
          </div>
        </Modal>
      )}
    </section>
  );
}

function AddGiftForm({ onSave }: { onSave: (text: string) => void }) {
  const [txt, setTxt] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!txt.trim()) return;
        onSave(txt.trim());
        setTxt("");
      }}
    >
      <textarea
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        className="w-full rounded border p-2 mb-3"
        placeholder="Escribe el regalo o link..."
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-yellow-400 text-white cursor-pointer hover:bg-yellow-800"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
