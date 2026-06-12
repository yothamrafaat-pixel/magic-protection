"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  costPrice: number;
  sellingPrice: number | null;
  note?: string | null;
};

type Supplier = {
  id: string;
  name: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", costPrice: "", sellingPrice: "", supplierId: "", supplierPrice: "", note: "" });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState({ name: "", costPrice: "", sellingPrice: "", note: "" });

  const load = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    try {
      const sres = await fetch("/api/suppliers");
      if (sres.ok) setSuppliers(await sres.json());
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    if (!form.name) return alert("اكتب اسم المنتج");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل إضافة المنتج");
    }

    setForm({ name: "", costPrice: "", sellingPrice: "", supplierId: "", supplierPrice: "", note: "" });
    load();
  };

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditProduct({
      name: product.name,
      costPrice: String(product.costPrice),
      sellingPrice: String(product.sellingPrice ?? ""),
      note: product.note ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
  };

  const saveProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editProduct),
    });

    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل تحديث المنتج");
    }

    setEditingProductId(null);
    load();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      return alert(data.error || "فشل حذف المنتج");
    }

    load();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">📦 إدارة المنتجات</h1>
        <p className="mt-2 text-slate-400">أضف منتجات الحماية وتتبع أسعار التكلفة والبيع لكل منتج.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">إضافة منتج جديد</h2>
          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="name"
              placeholder="اسم المنتج"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="costPrice"
              type="number"
              placeholder="سعر التكلفة"
              value={form.costPrice}
              onChange={handleChange}
            />
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="sellingPrice"
              type="number"
              placeholder="سعر البيع (اختياري)"
              value={form.sellingPrice}
              onChange={handleChange}
            />
            <select
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="supplierId"
              value={form.supplierId}
              onChange={handleChange}
            >
              <option value="">اختيار مورد (اختياري)</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="supplierPrice"
              type="number"
              placeholder="سعر المورد (اختياري)"
              value={form.supplierPrice}
              onChange={handleChange}
            />
            <textarea
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              name="note"
              placeholder="ملاحظة المنتج (اختياري)"
              value={form.note}
              onChange={handleChange}
            />
            <button
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
              onClick={addProduct}
            >
              إضافة منتج
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">المنتجات الحالية</h2>
          <div className="mt-6 space-y-4">
            {products.length === 0 ? (
              <p className="text-slate-400">لم يتم إضافة أي منتجات بعد.</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  {editingProductId === product.id ? (
                    <div className="space-y-4">
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        placeholder="اسم المنتج"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        type="number"
                        value={editProduct.costPrice}
                        onChange={(e) => setEditProduct({ ...editProduct, costPrice: e.target.value })}
                        placeholder="سعر التكلفة"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        type="number"
                        value={editProduct.sellingPrice}
                        onChange={(e) => setEditProduct({ ...editProduct, sellingPrice: e.target.value })}
                        placeholder="سعر البيع"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editProduct.note}
                        onChange={(e) => setEditProduct({ ...editProduct, note: e.target.value })}
                        placeholder="ملاحظة (اختياري)"
                      />
                      <div className="flex gap-3">
                        <button
                          className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
                          onClick={() => saveProduct(product.id)}
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
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <p className="text-sm text-slate-400">تكلفة: {product.costPrice} EGP</p>
                      <p className="text-sm text-slate-400">سعر بيع: {product.sellingPrice ?? "غير محدد"} EGP</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
                          onClick={() => startEdit(product)}
                        >
                          تعديل
                        </button>
                        <button
                          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                          onClick={() => deleteProduct(product.id)}
                        >
                          حذف
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
