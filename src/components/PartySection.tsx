import React, { useState } from "react";
import Modal from "./Modal";
import Card from "./Card";
import type { Guest } from "../screens/Register";

export default function PartySection({
  onSuggestSong,
  suggestions,
  guests,
  onSaveSong,
}: {
  onSuggestSong: (s: any) => void;
  suggestions: any[];
  guests: Guest[];
  onSaveSong: (
    guestId: string | undefined,
    payload: { songTitle: string; songArtist: string; songLink?: string }
  ) => void;
}) {
  const [songModalOpen, setSongModalOpen] = useState(false);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold">Fiesta</h2>
      <p className="text-sm text-gray-600 mb-6">
        Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en
        cuenta.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-xl font-semibold mb-2">Música</div>
          <p className="text-sm text-gray-600 mb-4">
            ¿Cuál es la canción que no debe faltar en la playlist de la fiesta?
          </p>
          <button
            onClick={() => setSongModalOpen(true)}
            className="mt-auto px-4 py-2 rounded-md bg-yellow-400 text-white font-semibold hover:bg-yellow-800 cursor-pointer"
          >
            Sugerir Canción
          </button>
        </Card>
      </div>

      {songModalOpen && (
        <SongSuggestModal
          guests={guests}
          onClose={() => setSongModalOpen(false)}
          onSave={async (guestId, payload) => {
            await onSaveSong(guestId, payload);
            setSongModalOpen(false);
          }}
        />
      )}
    </section>
  );
}

function SongSuggestModal({
  guests,
  onClose,
  onSave,
}: {
  guests: Guest[];
  onClose: () => void;
  onSave: (
    guestId: string | undefined,
    payload: { songTitle: string; songArtist: string; songLink?: string }
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [link, setLink] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<string | undefined>(
    guests.length === 1 ? guests[0].id : undefined
  );

  return (
    <Modal onClose={onClose}>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Sugerir canción</h3>

        <label className="block text-sm mb-1">Invitado</label>
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

        <label className="block text-sm mb-1">Nombre de la canción</label>
        <input
          className="w-full rounded border p-2 mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block text-sm mb-1">Artista</label>
        <input
          className="w-full rounded border p-2 mb-2"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />

        <label className="block text-sm mb-1">Enlace (opcional)</label>
        <input
          className="w-full rounded border p-2 mb-4"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded border hover:bg-black hover:text-white cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!title.trim() || !artist.trim())
                return alert("Título y artista obligatorios");
              onSave(selectedGuest, {
                songTitle: title.trim(),
                songArtist: artist.trim(),
                songLink: link.trim(),
              });
            }}
            className="px-4 py-2 rounded bg-yellow-400 text-white hover:bg-yellow-800 cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}
