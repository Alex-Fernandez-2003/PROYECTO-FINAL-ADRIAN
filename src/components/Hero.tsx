import React from "react";
import bgSrc from "../assets/Weeding.jpg";

export default function Hero() {
  const bgUrl = bgSrc;

  return (
    <section className="relative h-96 rounded-b-3xl overflow-hidden mb-10 flex items-center">
      <img
        src={bgUrl}
        alt="Fondo boda"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ imageRendering: "auto" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/10 pointer-events-none" />

      <div className="relative z-10 w-full text-center px-6">
        <div className="text-sm uppercase tracking-wider text-white/90 drop-shadow">
          23 de noviembre de 2025
        </div>

        <h1 className="mt-2 text-5xl md:text-6xl font-display font-extrabold text-white drop-shadow-lg">
          Mateo &amp; Emilia
        </h1>

        <p className="mt-3 text-lg text-white/90 italic drop-shadow">
          A veces lo que empieza como una locura se convierte en lo mejor de tu
          vida.
        </p>
      </div>
    </section>
  );
}
