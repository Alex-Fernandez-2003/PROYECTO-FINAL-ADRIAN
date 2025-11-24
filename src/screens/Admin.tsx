import React, { useEffect, useState } from "react";

type Person = {
  id: string;
  name: string;
  songTitle: string;
  songArtist: string;
  songLink: string;
  gift: string;
  assistWedding: boolean;
  assistCeremony: boolean;
};

const API_BASE = "https://6876f512dba809d901ed84d4.mockapi.io/JsonInvitados";
const RESOURCE = "person";
const API_URL = `${API_BASE}/${RESOURCE}`;

export default function Admin() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [giftsOpen, setGiftsOpen] = useState(false);
  const [songsOpen, setSongsOpen] = useState(false);

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [baseUrl, setBaseUrl] = useState("http://localhost:5173/register");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  async function fetchPeople() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Person[] = await res.json();
      setPeople(data.reverse());
      const map: Record<string, boolean> = {};
      data.forEach((p) => (map[p.id] = false));
      setSelected(map);
    } catch (err: any) {
      console.error(err);
      setError("No se pudo cargar la lista. Revisa el endpoint.");
    } finally {
      setLoading(false);
    }
  }

  async function createPerson(name: string) {
    if (!name.trim()) return;
    const payload: Partial<Person> = {
      name: name.trim(),
      songTitle: "",
      songArtist: "",
      songLink: "",
      gift: "",
      assistWedding: false,
      assistCeremony: false,
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const newPerson: Person = await res.json();
      setPeople((p) => [newPerson, ...p]);
      setSelected((s) => ({ ...s, [newPerson.id]: false }));
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la persona.");
    }
  }

  async function deletePerson(id: string) {
    if (!confirm("¿Eliminar invitado?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPeople((p) => p.filter((x) => x.id !== id));
      setSelected((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar.");
    }
  }

  async function updatePerson(id: string, patch: Partial<Person>) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated: Person = await res.json();
      setPeople((p) => p.map((it) => (it.id === id ? updated : it)));
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar.");
    }
  }

  const filtered = people.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function selectAllVisible(value: boolean) {
    const newMap = { ...selected };
    filtered.forEach((p) => (newMap[p.id] = value));
    setSelected(newMap);
  }

  function getSelectedPeople() {
    return people.filter((p) => selected[p.id]);
  }

  function generateLink() {
    const chosen = getSelectedPeople();
    if (chosen.length === 0) return null;
    const minimal = chosen.map((p) => ({
      id: p.id,
      name: p.name,
      assistWedding: p.assistWedding,
      assistCeremony: p.assistCeremony,
    }));
    const encoded = encodeURIComponent(JSON.stringify(minimal));
    const link = `${baseUrl}?guests=${encoded}`;
    setGeneratedLink(link);
    return link;
  }

  async function copyLinkToClipboard() {
    const link = generatedLink ?? generateLink();
    if (!link) return alert("No hay invitados seleccionados.");
    try {
      await navigator.clipboard.writeText(link);
      alert("Enlace copiado al portapapeles");
    } catch (err) {
      console.error(err);
      alert("No se pudo copiar el enlace. Copia manualmente:");
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Gestor de invitaciones
          </h1>
          <div className="text-right"></div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <h2 className="text-lg font-medium">Agregar invitado</h2>
            <AddPersonForm onCreate={createPerson} />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium">Lista de invitados</h2>
                <div className="text-sm text-gray-500">
                  Selecciona uno o varios para generar el enlace
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filtrar por nombre..."
                  className="w-64 rounded-md border border-gray-200 px-3 py-2 shadow-sm"
                />
                <button
                  onClick={() => selectAllVisible(true)}
                  className="px-3 py-2 rounded-md border hover:bg-black cursor-pointer hover:text-white"
                >
                  Seleccionar todo
                </button>
                <button
                  onClick={() => selectAllVisible(false)}
                  className="px-3 py-2 rounded-md border hover:bg-black cursor-pointer hover:text-white"
                >
                  Deseleccionar
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-8 text-center text-gray-500">Cargando...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <div className="py-6 text-center text-gray-500">
                    No hay invitados.
                  </div>
                ) : (
                  filtered.map((person) => (
                    <PersonRow
                      key={person.id}
                      person={person}
                      selected={!!selected[person.id]}
                      onToggleSelect={() => toggleSelect(person.id)}
                      onDelete={() => deletePerson(person.id)}
                      onSaveName={(name) =>
                        updatePerson(person.id, { ...person, name })
                      }
                    />
                  ))
                )}
              </div>
            )}

            <div className="mt-6 border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Base URL:</label>
                <input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="rounded-md border px-3 py-2 w-80"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-700">
                  Seleccionados: {getSelectedPeople().length}
                </div>
                <button
                  onClick={() => {
                    generateLink();
                  }}
                  className="rounded-md bg-gradient-to-r bg-yellow-400 px-4 py-2 font-semibold text-white shadow cursor-pointer hover:bg-yellow-800"
                >
                  Generar enlace
                </button>
                <button
                  onClick={copyLinkToClipboard}
                  className="px-4 py-2 rounded-md border hover:bg-black cursor-pointer hover:text-white"
                >
                  Copiar enlace
                </button>

                <button
                  onClick={() => setGiftsOpen(true)}
                  className="rounded-md bg-gradient-to-r bg-yellow-400 px-4 py-2 font-semibold text-white shadow cursor-pointer hover:bg-yellow-800"
                >
                  Ver regalos
                </button>

                {/* NUEVO: Ver sugerencias de canciones */}
                <button
                  onClick={() => setSongsOpen(true)}
                  className="rounded-md px-4 py-2 border bg-white font-semibold text-gray-800 shadow cursor-pointer hover:bg-black hover:text-white"
                >
                  Ver sugerencias
                </button>

                {generatedLink && (
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-md border hover:bg-black cursor-pointer hover:text-white"
                  >
                    Abrir enlace
                  </a>
                )}
              </div>
            </div>

            {/* Modal: REGALOS */}
            {giftsOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/40"
                  onClick={() => setGiftsOpen(false)}
                />
                <div className="relative z-10 max-w-3xl w-full bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Regalos registrados
                    </h3>
                    <button
                      onClick={() => setGiftsOpen(false)}
                      className="px-4 py-2 rounded-md border hover:bg-black cursor-pointer hover:text-white"
                    >
                      Cerrar
                    </button>
                  </div>

                  {people.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      No hay invitados.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-auto">
                      {people.map((p) => (
                        <div
                          key={p.id}
                          className="border rounded p-3 flex items-start justify-between"
                        >
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {p.gift && p.gift.trim() ? (
                                <span>{p.gift}</span>
                              ) : (
                                <span className="italic text-gray-400">
                                  No ha indicado regalo
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal: SUGERENCIAS DE CANCIONES */}
            {songsOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/40"
                  onClick={() => setSongsOpen(false)}
                />
                <div className="relative z-10 max-w-3xl w-full bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Sugerencias de canciones
                    </h3>
                    <button
                      onClick={() => setSongsOpen(false)}
                      className="px-4 py-2 rounded-md border hover:bg-black cursor-pointer hover:text-white"
                    >
                      Cerrar
                    </button>
                  </div>

                  {people.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      No hay invitados.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-auto">
                      {people.map((p) => (
                        <div
                          key={p.id}
                          className="border rounded p-3 flex items-start justify-between"
                        >
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {p.songTitle ? (
                                <div>
                                  <div>
                                    🎵 <strong>{p.songTitle}</strong> —{" "}
                                    <span className="text-gray-600">
                                      {p.songArtist}
                                    </span>
                                  </div>
                                  {p.songLink ? (
                                    <a
                                      href={p.songLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-sm text-blue-600"
                                    >
                                      Escuchar / Enlace
                                    </a>
                                  ) : null}
                                </div>
                              ) : (
                                <span className="italic text-gray-400">
                                  No ha sugerido canción
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="ml-4 flex flex-col gap-2"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {generatedLink && (
              <div className="mt-4 p-3 rounded bg-gray-50 border">
                <div className="text-sm text-gray-600 mb-2">
                  Enlace generado:
                </div>
                <div className="break-all text-blue-600">{generatedLink}</div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

function AddPersonForm({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await onCreate(name.trim());
    setName("");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        className="flex-1 rounded-md border border-gray-200 px-3 py-2 shadow-sm"
        placeholder="Nombre del invitado"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-gradient-to-r bg-yellow-400 px-4 py-2 font-semibold text-white shadow cursor-pointer hover:bg-yellow-800"
      >
        {submitting ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
}

function PersonRow({
  person,
  selected,
  onToggleSelect,
  onDelete,
  onSaveName,
}: {
  person: Person;
  selected: boolean;
  onToggleSelect: () => void;
  onDelete: () => void;
  onSaveName: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(person.name);

  useEffect(() => setName(person.name), [person.name]);

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
      <div className="flex items-center gap-4 min-w-0">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="h-4 w-4"
        />

        <div className="flex-1 min-w-0">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                onSaveName(name.trim());
                setEditing(false);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2"
              />
              <button className="px-3 py-1 rounded-md bg-yellow-400 text-white font-medium hover:bg-yellow-800 cursor-pointer">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setName(person.name);
                }}
                className="px-2 py-1 rounded-md border hover:bg-black hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <div>
              <div className="font-medium text-gray-800 truncate">
                {person.name}
              </div>
              <div className="text-sm text-gray-500">
                {person.gift || "No ha indicado regalo"}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              person.assistWedding
                ? "bg-yellow-400 text-white"
                : "border text-gray-600"
            }`}
          >
            Boda: {person.assistWedding ? "Sí" : "No"}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              person.assistCeremony
                ? "bg-yellow-400 text-white"
                : "border text-gray-600"
            }`}
          >
            Ceremonia: {person.assistCeremony ? "Sí" : "No"}
          </span>
        </div>

        <button
          onClick={() => setEditing((s) => !s)}
          className="px-3 py-1 rounded-md border hover:bg-black cursor-pointer hover:text-white"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 rounded-md border text-red-600 hover:bg-red-800 cursor-pointer hover:text-white"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
