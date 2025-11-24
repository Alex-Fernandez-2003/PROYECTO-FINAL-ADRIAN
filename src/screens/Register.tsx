import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import Hero from "../components/Hero";
import GuestsSection from "../components/GuestsSection";
import VenueSection from "../components/VenueSection";
import GallerySection from "../components/GallerySection";
import PartySection from "../components/PartySection";
import GiftsSection from "../components/GiftsSection";
import { updatePerson } from "../api";
import Countdown from "../components/CountDown";

export type Guest = {
  id: string;
  name: string;
  songTitle?: string;
  songArtist?: string;
  songLink?: string;
  gift?: string;
  assistWedding?: boolean;
  assistCeremony?: boolean;
};

const WEDDING_DATE = new Date(2025, 10, 28, 17, 0, 0);

export default function RegisterScreenInner() {
  const location = useLocation();

  const initialGuests = useMemo(
    () => parseGuestsFromQuery(location.search),
    [location.search]
  );
  const [guestsState, setGuestsState] = useState<Guest[]>(initialGuests);

  useEffect(() => {
    setGuestsState(parseGuestsFromQuery(location.search));
  }, [location.search]);

  const [musicPlaying, setMusicPlaying] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [giftsLocal, setGiftsLocal] = useState<Record<string, string>>({});

  useEffect(() => {
    const s = localStorage.getItem("wedding_suggestions");
    const g = localStorage.getItem("wedding_gifts");
    if (s) setSuggestions(JSON.parse(s));
    if (g) {
      try {
        setGiftsLocal(JSON.parse(g));
      } catch {
        setGiftsLocal({});
      }
    }
  }, []);
  useEffect(
    () =>
      localStorage.setItem("wedding_suggestions", JSON.stringify(suggestions)),
    [suggestions]
  );
  useEffect(
    () => localStorage.setItem("wedding_gifts", JSON.stringify(giftsLocal)),
    [giftsLocal]
  );

  async function addSuggestionLocal(item: {
    songTitle: string;
    songArtist: string;
    songLink?: string;
  }) {
    setSuggestions((s) => [item, ...s]);
  }

  async function saveGiftToApi(guestId: string | undefined, giftText: string) {
    if (!giftText || !giftText.trim()) {
      alert("Regalo vacío.");
      return;
    }

    if (!guestId) {
      alert("Porfavor, seleccione alguien para enviar el regalo.");
      return;
    }

    try {
      const patch = { gift: giftText };
      const updated = await updatePerson(guestId, patch);
      setGuestsState((prev) =>
        prev.map((g) => (g.id === guestId ? { ...g, gift: updated.gift } : g))
      );
      alert("Regalo guardado. Gracias!");
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el regalo. Intenta de nuevo.");
    }
  }

  async function saveSongToApi(
    guestId: string | undefined,
    payload: { songTitle: string; songArtist: string; songLink?: string }
  ) {
    if (!payload.songTitle?.trim() || !payload.songArtist?.trim()) {
      alert("Nombre de canción y artista son obligatorios.");
      return;
    }

    if (!guestId) {
      await addSuggestionLocal(payload);
      alert("Porfavor seleccione a una persona.");
      return;
    }

    try {
      const patch = {
        songTitle: payload.songTitle,
        songArtist: payload.songArtist,
        songLink: payload.songLink ?? "",
      };
      const updated = await updatePerson(guestId, patch);
      setGuestsState((prev) =>
        prev.map((g) => (g.id === guestId ? { ...g, ...patch } : g))
      );
      alert("Canción guardada para el invitado. ¡Gracias!");
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la canción. Intenta de nuevo.");
    }
  }

  async function addSuggestion(item: {
    songTitle: string;
    songArtist: string;
    songLink?: string;
  }) {
    setSuggestions((s) => [item, ...s]);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AudioPlayer
        musicPlaying={musicPlaying}
        setMusicPlaying={setMusicPlaying}
      />

      <main className="max-w-5xl mx-auto">
        <Hero />

        <div className="px-6">
          <Countdown targetDate={WEDDING_DATE} />

          <GuestsSection
            guests={guestsState}
            onConfirm={async (id, t) => {
              try {
                const patch: any = {};
                if (t === "wedding") patch.assistWedding = true;
                else patch.assistCeremony = true;
                const updated = await updatePerson(id, patch);
                setGuestsState((prev) =>
                  prev.map((g) => (g.id === id ? { ...g, ...patch } : g))
                );
                alert("Confirmación guardada. ¡Gracias!");
              } catch (err) {
                console.error(err);
                alert("No se pudo confirmar. Intenta de nuevo.");
              }
            }}
          />

          <VenueSection
            guests={guestsState}
            onConfirm={async (id, t) => {
              try {
                const patch: any = {};
                if (t === "wedding") patch.assistWedding = true;
                else patch.assistCeremony = true;
                const updated = await updatePerson(id, patch);
                setGuestsState((prev) =>
                  prev.map((g) => (g.id === id ? { ...g, ...patch } : g))
                );
                alert("Confirmación guardada. ¡Gracias!");
              } catch (err) {
                console.error(err);
                alert("No se pudo confirmar. Intenta de nuevo.");
              }
            }}
          />

          <PartySection
            onSuggestSong={addSuggestion}
            suggestions={suggestions}
            guests={guestsState}
            onSaveSong={(guestId, payload) => saveSongToApi(guestId, payload)}
          />

          <GiftsSection
            guests={guestsState}
            gifts={{}}
            onAddGift={(guestId, giftText) => saveGiftToApi(guestId, giftText)}
          />

          <GallerySection />
        </div>
      </main>
    </div>
  );
}

function parseGuestsFromQuery(search: string) {
  try {
    const qp = new URLSearchParams(search);
    const raw = qp.get("guests");
    if (!raw) return [];
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (!Array.isArray(parsed)) return [];
    return parsed.map((g: any) => ({
      id: String(g.id ?? g.name),
      name: String(g.name ?? "Invitado"),
      songTitle: g.songTitle ?? "",
      songArtist: g.songArtist ?? "",
      songLink: g.songLink ?? "",
      gift: g.gift ?? "",
      assistWedding: !!g.assistWedding,
      assistCeremony: !!g.assistCeremony,
    }));
  } catch (err) {
    console.warn("No se pudo parsear guests from query", err);
    return [];
  }
}

export function AppMain() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterScreenInner />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const sample = [
    { id: "1", name: "Ana" },
    { id: "2", name: "Pedro" },
    { id: "3", name: "Lucia" },
  ];
  const encoded = encodeURIComponent(JSON.stringify(sample));
  const link = `/register?guests=${encoded}`;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Invitación - Ejemplo</h2>
        <p className="mb-4">
          Usa el siguiente enlace para abrir la invitación con una lista de
          invitados de ejemplo.
        </p>
        <Link
          to={link}
          className="px-4 py-2 rounded bg-yellow-400 text-white font-semibold"
        >
          Abrir invitación de ejemplo
        </Link>
      </div>
    </div>
  );
}
