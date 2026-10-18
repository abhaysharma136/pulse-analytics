"use client";

import { useMemo, useState } from "react";
import {
  Users,
  FileText,
  LayoutDashboard,
  Share2,
  Download,
  Search,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { mockTransactions } from "@/mocks/data/transactions";

type WorkspacePageProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  const cardClass = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";
  return (
    <article className={cardClass}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-700">{value}</p>
    </article>
  );
}
export default function WorkspacePage({
  activePage,
  onNavigate,
}: WorkspacePageProps) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [compactRows, setCompactRows] = useState(false);
  const [reportDownloaded, setReportDownloaded] = useState(false);

  const customers = useMemo(() => {
    const groups = new Map<
      string,
      {
        name: string;
        email: string;
        orders: number;
        spend: number;
        lastOrder: string;
      }
    >();

    for (const transaction of mockTransactions) {
      const key = transaction.email.toLowerCase();
      const existing = groups.get(key);

      if (existing) {
        existing.orders += 1;
        existing.spend += transaction.amount;

        if (transaction.date > existing.lastOrder) {
          existing.lastOrder = transaction.date;
        }
      } else {
        groups.set(key, {
          name: transaction.name,
          email: transaction.email,
          orders: 1,
          spend: transaction.amount,
          lastOrder: transaction.date,
        });
      }
    }

    return Array.from(groups.values()).sort((a, b) => b.spend - a.spend);
  }, []);

  const visibleCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email}`
      .toLowerCase()
      .includes(customerSearch.toLowerCase().trim()),
  );

  function downloadReport() {
    const headers = [
      "Customer",
      "Order ID",
      "Product",
      "Amount",
      "Status",
      "Date",
    ];
    const rows = mockTransactions.map((transaction) => [
      transaction.name,
      transaction.order,
      transaction.product,
      transaction.amount,
      transaction.status,
      transaction.date,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "pulse-analytics-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    setReportDownloaded(true);
  }

  const completed = mockTransactions.filter(
    (transaction) => transaction.status === "Completed",
  ).length;

  const totalRevenue = mockTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  const cardClass = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";
  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700";

  if (activePage === "Customers") {
    return (
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold">Customer directory</h2>
          <p className="mt-1 text-sm text-slate-500">
            Customer summaries derived from the sample transaction dataset.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Customers"
            value={customers.length.toLocaleString()}
            icon={<Users size={19} />}
          />
          <StatCard
            label="Transactions"
            value={mockTransactions.length.toLocaleString()}
            icon={<FileText size={19} />}
          />
          <StatCard
            label="Total spend"
            value={money(totalRevenue)}
            icon={<ArrowUpRight size={19} />}
          />
        </div>

        <section className={cardClass}>
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
              placeholder="Search customers..."
              aria-label="Search customers"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 text-slate-700"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead>
                <tr className="border-y bg-slate-50 text-xs text-slate-500">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Orders</th>
                  <th className="p-3">Total spend</th>
                  <th className="p-3">Last order</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleCustomers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">
                        {customer.name}
                      </p>
                      <p className="text-xs text-slate-500">{customer.email}</p>
                    </td>
                    <td className="p-3 text-slate-600">{customer.orders}</td>
                    <td className="p-3 font-semibold text-slate-600">
                      {money(customer.spend)}
                    </td>
                    <td className="p-3 text-slate-500">{customer.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleCustomers.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              No customers match your search.
            </p>
          )}
        </section>
      </div>
    );
  }

  if (activePage === "Reports") {
    return (
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold">Reports</h2>
          <p className="mt-1 text-sm text-slate-500">
            Export transaction data for offline analysis.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <article className={cardClass}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={22} />
            </div>
            <h3 className="font-bold text-slate-800">Transaction report</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Download the complete mock transaction dataset as a CSV file,
              including customer, product, amount, status, and date fields.
            </p>
            <button
              type="button"
              onClick={downloadReport}
              className={`${buttonClass} mt-5`}
            >
              <Download size={16} />
              Export CSV
            </button>
            {reportDownloaded && (
              <p role="status" className="mt-3 text-sm text-emerald-700">
                Export initiated.
              </p>
            )}
          </article>

          <article className={cardClass}>
            <h3 className="font-bold text-slate-800">Dataset summary</h3>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total transactions</span>
                <strong>{mockTransactions.length}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Completed transactions</span>
                <strong>{completed}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Transaction amount total</span>
                <strong>{money(totalRevenue)}</strong>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (activePage === "Settings") {
    return (
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold">Settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Configure local demo preferences.
          </p>
        </section>

        <section className={`${cardClass} space-y-6`}>
          <div>
            <h3 className="font-bold text-slate-800">Preferences</h3>
            <p className="mt-1 text-sm text-slate-500">
              These preferences are local to this mounted demo and are not saved
              to an account.
            </p>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium text-slate-800">
                Email notifications
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Demo preference only; no emails are sent.
              </span>
            </span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(event) => setEmailNotifications(event.target.checked)}
              aria-label="Email notifications"
              className="h-4 w-4 accent-indigo-600"
            />
          </label>

          <div className="border-t border-slate-100" />

          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium text-slate-800">
                Compact table rows
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Demo preference for a denser table layout.
              </span>
            </span>
            <input
              type="checkbox"
              checked={compactRows}
              onChange={(event) => setCompactRows(event.target.checked)}
              aria-label="Compact table rows"
              className="h-4 w-4 accent-indigo-600"
            />
          </label>

          <p role="status" className="text-sm text-emerald-700">
            <CheckCircle2 className="mr-1 inline" size={16} />
            Preferences are active for this page session.
          </p>
        </section>
      </div>
    );
  }

  const isShared = activePage === "Shared with me";
  const isSaved = activePage === "My Dashboards";

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold">{activePage}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {isShared
            ? "A demo space for dashboards shared with your workspace."
            : isSaved
              ? "Your saved analytics views in one place."
              : "Explore your business data and reports."}
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className={cardClass}>
          <LayoutDashboard className="mb-4 text-indigo-600" size={24} />
          <h3 className="font-bold text-slate-800">Business overview</h3>
          <p className="mt-2 text-sm text-slate-500">
            Key performance indicators, revenue trends, and recent transactions.
          </p>
          <button
            onClick={() => onNavigate("Overview")}
            className="mt-4 text-sm font-semibold text-indigo-600"
          >
            Open overview →
          </button>
        </article>

        <article className={cardClass}>
          <Users className="mb-4 text-indigo-600" size={24} />
          <h3 className="font-bold text-slate-800">Customer insights</h3>
          <p className="mt-2 text-sm text-slate-500">
            Review customer activity and spending from the demo dataset.
          </p>
          <button
            onClick={() => onNavigate("Customers")}
            className="mt-4 text-sm font-semibold text-indigo-600"
          >
            Explore customers →
          </button>
        </article>

        <article className={cardClass}>
          <Share2 className="mb-4 text-indigo-600" size={24} />
          <h3 className="font-bold text-slate-800">
            {isShared ? "Shared dashboard preview" : "Analytics Explorer"}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Inspect time-based trends, traffic sources, and exportable
            analytics.
          </p>
          <button
            onClick={() => onNavigate("Analytics Explorer")}
            className="mt-4 text-sm font-semibold text-indigo-600"
          >
            Open analytics →
          </button>
        </article>
      </div>

      <p className="text-xs text-slate-400">
        {isSaved || isShared
          ? "Saved views and sharing are UI demonstrations; persistence and real collaboration are not configured."
          : "Portfolio demo using sample business data."}
      </p>
    </div>
  );
}
