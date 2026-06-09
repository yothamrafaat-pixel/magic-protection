"use client";

import { useEffect, useState } from "react";

type Employee = {
  id: string;
  name: string;
  position: string | null;
  salary: number;
};

type Expense = {
  id: string;
  category: string;
  amount: number;
  description: string | null;
  employee?: Employee | null;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({ category: "", amount: "", description: "", employeeId: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editExpense, setEditExpense] = useState({ category: "", amount: "", description: "", employeeId: "" });

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

  const loadData = async () => {
    try {
      const [expensesRes, employeesRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/employees"),
      ]);

      const expensesData = await parseJsonResponse(expensesRes);
      const employeesData = await parseJsonResponse(employeesRes);

      setExpenses(expensesData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Failed to load expense data", error);
      alert("فشل تحميل بيانات المصروفات، تأكد من أن الخادم يعمل بشكل صحيح.");
      setExpenses([]);
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExpense = async () => {
    if (!form.category || !form.amount) return alert("اكتب فئة المصروف والمبلغ");

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: form.category,
        amount: Number(form.amount),
        description: form.description,
        employeeId: form.employeeId || null,
      }),
    });

    const data = await parseJsonResponse(res);
    if (!res.ok) {
      return alert(data.error || "فشل إضافة المصروف");
    }

    setForm({ category: "", amount: "", description: "", employeeId: "" });
    loadData();
  };

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditExpense({
      category: expense.category,
      amount: String(expense.amount),
      description: expense.description || "",
      employeeId: expense.employee?.id || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveExpense = async (id: string) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: editExpense.category,
        amount: Number(editExpense.amount),
        description: editExpense.description,
        employeeId: editExpense.employeeId || null,
      }),
    });

    const data = await parseJsonResponse(res);
    if (!res.ok) {
      return alert(data.error || "فشل تحديث المصروف");
    }

    setEditingId(null);
    loadData();
  };

  const deleteExpense = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المصروف؟")) return;

    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    const data = await parseJsonResponse(res);
    if (!res.ok) {
      return alert(data.error || "فشل حذف المصروف");
    }

    loadData();
  };

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white">المصروفات</h1>
        <p className="mt-2 text-slate-400">سجل المصروفات وربط رواتب الموظفين من هنا.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">إضافة مصروف جديد</h2>
          <div className="mt-6 grid gap-4">
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="الفئة"
            />
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="المبلغ"
            />
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            >
              <option value="">اختر موظفاً (إن كان راتباً)</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.salary} EGP
                </option>
              ))}
            </select>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="الوصف (اختياري)"
            />
            <button
              className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
              onClick={addExpense}
            >
              إضافة مصروف
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">إجمالي المصروفات</h2>
          <p className="mt-4 text-3xl font-bold text-white">{total} EGP</p>
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-300">
            <div className="text-sm uppercase tracking-[0.15em] text-slate-500">تعليمات</div>
            <p className="mt-3 text-sm leading-6">
              إذا كان المصروف مرتبطاً براتب موظف، اختر الموظف من القائمة. ستظهر معلومات الموظف داخل سجل المصروف.
            </p>
          </div>
        </aside>
      </div>

      <div className="space-y-4">
        {expenses.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            لا يوجد مصروفات
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-lg">
              {editingId === expense.id ? (
                <div className="grid gap-4">
                  <input
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                    value={editExpense.category}
                    onChange={(e) => setEditExpense({ ...editExpense, category: e.target.value })}
                    placeholder="الفئة"
                  />
                  <input
                    type="number"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                    value={editExpense.amount}
                    onChange={(e) => setEditExpense({ ...editExpense, amount: e.target.value })}
                    placeholder="المبلغ"
                  />
                  <select
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                    name="employeeId"
                    value={editExpense.employeeId}
                    onChange={(e) => setEditExpense({ ...editExpense, employeeId: e.target.value })}
                  >
                    <option value="">اختر موظفاً (إن كان راتباً)</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.salary} EGP
                      </option>
                    ))}
                  </select>
                  <textarea
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
                    value={editExpense.description}
                    onChange={(e) => setEditExpense({ ...editExpense, description: e.target.value })}
                    placeholder="الوصف"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
                      onClick={() => saveExpense(expense.id)}
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
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">{expense.category}</div>
                      <div className="mt-1 text-slate-400">{expense.description || "بدون وصف"}</div>
                      {expense.employee ? (
                        <p className="mt-2 text-sm text-cyan-300">موظف: {expense.employee.name}</p>
                      ) : null}
                    </div>
                    <div className="text-xl font-bold text-white">{expense.amount} EGP</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
                      onClick={() => startEdit(expense)}
                    >
                      تعديل
                    </button>
                    <button
                      className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                      onClick={() => deleteExpense(expense.id)}
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
    </div>
  );
}
