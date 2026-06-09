"use client";

import { useEffect, useState } from "react";

type Branch = {
  id: string;
  name: string;
  location: string | null;
  createdAt: string;
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editBranch, setEditBranch] = useState({ name: "", location: "" });

  const loadBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to load branches:", res.status, errorText);
        return;
      }
      const data = await res.json();
      setBranches(data);
    } catch (error) {
      console.error("Error loading branches:", error);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const addBranch = async () => {
    if (!name) return alert("اكتب اسم الفرع");

    const res = await fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location }),
    });

    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل إضافة الفرع");
    }

    setName("");
    setLocation("");
    loadBranches();
  };

  const startEdit = (branch: Branch) => {
    setEditingBranchId(branch.id);
    setEditBranch({ name: branch.name, location: branch.location || "" });
  };

  const cancelEdit = () => {
    setEditingBranchId(null);
  };

  const saveBranch = async (id: string) => {
    const res = await fetch(`/api/branches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editBranch),
    });

    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل تحديث الفرع");
    }

    setEditingBranchId(null);
    loadBranches();
  };

  const deleteBranch = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفرع؟")) return;

    const res = await fetch(`/api/branches/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل حذف الفرع");
    }

    loadBranches();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">🏢 إدارة فروع Magic Protection</h1>
        <p className="mt-2 text-slate-400">أضف فروع جديدة وحدد مواقعها لتتبع شبكتك بالكامل.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">قائمة الفروع</h2>
          {branches.length === 0 ? (
            <p className="mt-4 text-slate-400">لا يوجد فروع حتى الآن.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {branches.map((branch) => (
                <div key={branch.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  {editingBranchId === branch.id ? (
                    <div className="space-y-4">
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editBranch.name}
                        onChange={(e) => setEditBranch({ ...editBranch, name: e.target.value })}
                        placeholder="اسم الفرع"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editBranch.location}
                        onChange={(e) => setEditBranch({ ...editBranch, location: e.target.value })}
                        placeholder="الموقع"
                      />
                      <div className="flex gap-3">
                        <button
                          className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
                          onClick={() => saveBranch(branch.id)}
                        >
                          حفظ
                        </button>
                        <button
                          className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
                          onClick={cancelEdit}
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{branch.name}</h3>
                          <p className="mt-1 text-slate-400">{branch.location || "الموقع غير محدد"}</p>
                        </div>
                        <span className="rounded-full bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950">
                          فرع
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">تاريخ الإضافة: {new Date(branch.createdAt).toLocaleDateString()}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
                          onClick={() => startEdit(branch)}
                        >
                          تعديل
                        </button>
                        <button
                          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                          onClick={() => deleteBranch(branch.id)}
                        >
                          حذف
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">إضافة فرع جديد</h2>
          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="اسم الفرع"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="الموقع"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              onClick={addBranch}
            >
              إضافة فرع
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
