"use client";

import { useEffect, useState } from "react";

type Employee = {
  id: string;
  name: string;
  position: string | null;
  salary: number;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({ name: "", position: "", salary: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmployee, setEditEmployee] = useState({ name: "", position: "", salary: "" });

  const parseJsonResponse = async (res: Response) => {
    const text = await res.text();
    let json: any = null;

    if (text) {
      try {
        json = JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse JSON response", res.status, text, error);
      }
    }

    if (!res.ok) {
      const message =
        json && typeof json === "object" && json.error
          ? json.error
          : text?.trim() || res.statusText || `HTTP ${res.status}`;
      throw new Error(message);
    }

    return json ?? [];
  };

  const loadEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await parseJsonResponse(res);
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees", error);
      alert("فشل تحميل بيانات الموظفين. تأكد أن الخادم يعمل.");
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEmployee = async () => {
    if (!form.name || !form.salary) return alert("اكتب اسم الموظف وراتبه");

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        position: form.position,
        salary: Number(form.salary),
      }),
    });

    const data = await parseJsonResponse(res);
    if (!res.ok) {
      return alert(data.error || "فشل إضافة الموظف");
    }

    setForm({ name: "", position: "", salary: "" });
    loadEmployees();
  };

  const startEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setEditEmployee({
      name: employee.name,
      position: employee.position || "",
      salary: String(employee.salary),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEmployee = async (id: string) => {
    const res = await fetch(`/api/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editEmployee.name,
        position: editEmployee.position,
        salary: Number(editEmployee.salary),
      }),
    });

    const data = await parseJsonResponse(res);
    if (!res.ok) {
      return alert(data.error || "فشل تحديث الموظف");
    }

    setEditingId(null);
    loadEmployees();
  };

  const deleteEmployee = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;

    const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
    const data = await parseJsonResponse(res);
    if (!res.ok) {
      return alert(data.error || "فشل حذف الموظف");
    }

    loadEmployees();
  };

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">👥 إدارة الموظفين</h1>
        <p className="mt-2 text-slate-400">سجل الموظفين ورتبهم وربط رواتبهم بمصروفات الشركة.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">إضافة موظف جديد</h2>
          <div className="mt-6 grid gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="اسم الموظف"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="الوظيفة (اختياري)"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              placeholder="الراتب"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
            <button
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
              onClick={addEmployee}
            >
              إضافة موظف
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">قائمة الموظفين</h2>
          <div className="mt-6 space-y-4">
            {employees.length === 0 ? (
              <p className="text-slate-400">لم يتم تسجيل أي موظفين بعد.</p>
            ) : (
              employees.map((employee) => (
                <div key={employee.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  {editingId === employee.id ? (
                    <div className="space-y-4">
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editEmployee.name}
                        onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                        placeholder="اسم الموظف"
                      />
                      <input
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editEmployee.position}
                        onChange={(e) => setEditEmployee({ ...editEmployee, position: e.target.value })}
                        placeholder="الوظيفة"
                      />
                      <input
                        type="number"
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        value={editEmployee.salary}
                        onChange={(e) => setEditEmployee({ ...editEmployee, salary: e.target.value })}
                        placeholder="الراتب"
                      />
                      <div className="flex gap-3">
                        <button
                          className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
                          onClick={() => saveEmployee(employee.id)}
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
                          <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
                          <p className="text-slate-400">{employee.position || "الوظيفة غير محددة"}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400">الراتب</div>
                          <div className="text-lg font-semibold text-white">{employee.salary} EGP</div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
                          onClick={() => startEdit(employee)}
                        >
                          تعديل
                        </button>
                        <button
                          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                          onClick={() => deleteEmployee(employee.id)}
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
