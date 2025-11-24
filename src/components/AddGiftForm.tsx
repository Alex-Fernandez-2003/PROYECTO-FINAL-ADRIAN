import React, { useState } from "react";
export default function AddGiftForm({
  onSave,
}: {
  onSave: (text: string) => void;
}) {
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
          className="px-4 py-2 rounded-md bg-yellow-400 text-white cursor-pointer hover:bg-yellow-800 hover:text-white"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
