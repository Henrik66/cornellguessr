"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Location, LocationCategory } from "@/lib/database.types";

interface Props {
  initialLocations: Location[];
}

const CATEGORIES: LocationCategory[] = [
  "landmark",
  "academic",
  "residential",
  "gorge",
  "collegetown",
];

const emptyForm = {
  name: "",
  category: "landmark" as LocationCategory,
  difficulty: 1 as 1 | 2 | 3,
  lat: "",
  lng: "",
  pano_id: "",
  heading: "0",
  pitch: "0",
};

export default function AdminClient({ initialLocations }: Props) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async (loc: Location) => {
    const { error } = await supabase
      .from("locations")
      .update({ active: !loc.active })
      .eq("id", loc.id);
    if (!error) {
      setLocations((prev) =>
        prev.map((l) => (l.id === loc.id ? { ...l, active: !l.active } : l))
      );
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { data, error } = await supabase
      .from("locations")
      .insert({
        name: form.name,
        category: form.category,
        difficulty: form.difficulty,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        pano_id: form.pano_id || null,
        heading: parseFloat(form.heading),
        pitch: parseFloat(form.pitch),
        active: true,
      })
      .select()
      .single();
    setSaving(false);
    if (error) { setError(error.message); return; }
    setLocations((prev) => [data as Location, ...prev]);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Admin — Locations</h1>

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl shadow p-6 mb-8 grid grid-cols-2 gap-4"
        >
          <h2 className="col-span-2 text-lg font-bold text-gray-800">Add location</h2>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="col-span-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as LocationCategory })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) as 1 | 2 | 3 })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option value={1}>Easy (1)</option>
            <option value={2}>Medium (2)</option>
            <option value={3}>Hard (3)</option>
          </select>

          <input
            placeholder="Latitude (e.g. 42.4475)"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            placeholder="Longitude (e.g. -76.4854)"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
            required
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            placeholder="Pano ID (optional)"
            value={form.pano_id}
            onChange={(e) => setForm({ ...form, pano_id: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
          />
          <div className="flex gap-2">
            <input
              placeholder="Heading (0)"
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
            />
            <input
              placeholder="Pitch (0)"
              value={form.pitch}
              onChange={(e) => setForm({ ...form, pitch: e.target.value })}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
            />
          </div>

          {error && <p className="col-span-2 text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="col-span-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {saving ? "Saving…" : "Add location"}
          </button>
        </form>

        {/* Location table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Diff</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {locations.map((loc) => (
                <tr key={loc.id} className={loc.active ? "" : "opacity-50"}>
                  <td className="px-4 py-3 font-medium text-gray-800">{loc.name}</td>
                  <td className="px-4 py-3 text-gray-500">{loc.category}</td>
                  <td className="px-4 py-3 text-gray-500">{loc.difficulty}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        loc.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {loc.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggle(loc)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      {loc.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
