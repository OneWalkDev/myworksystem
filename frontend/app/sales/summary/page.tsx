"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/app/components/layout/AppHeader";
import { useAuth } from "@/app/hooks/useAuth";
import { salesApi } from "@/app/lib/api";
import {
  CaseBreakdown,
  MonthlySummary,
  MonthlyTotal,
  YearlySummary,
} from "@/app/types/sale";

const colorPalette = [
  "#2563eb",
  "#f97316",
  "#10b981",
  "#a855f7",
  "#ef4444",
  "#14b8a6",
  "#84cc16",
  "#f59e0b",
];

type ViewMode = "month" | "year";

const formatCurrency = (value?: number) =>
  value !== undefined
    ? new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        maximumFractionDigits: 0,
      }).format(value)
    : "-";

function PieChart({
  breakdown,
  total,
}: {
  breakdown: CaseBreakdown[];
  total: number;
}) {
  let currentDeg = 0;
  const segments = breakdown.map((item, index) => {
    const start = currentDeg;
    const sweep = Math.max(item.ratio * 360, 0);
    const end = start + sweep;
    currentDeg = end;
    const color = colorPalette[index % colorPalette.length];
    return `${color} ${start}deg ${end}deg`;
  });

  const gradient =
    segments.length > 0
      ? `conic-gradient(${segments.join(",")})`
      : "conic-gradient(#e5e7eb 0deg 360deg)";

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div
        className="relative h-48 w-48 rounded-full shadow-inner sm:h-56 sm:w-56"
        style={{ backgroundImage: gradient }}
      >
        <div className="absolute inset-6 rounded-full bg-white dark:bg-gray-800" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">合計</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-3">
        {breakdown.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            この期間の売上データがありません。
          </p>
        ) : (
          breakdown.map((item, index) => (
            <div
              key={`${item.case_id}-${item.case_name}-${index}`}
              className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-800/60"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.case_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.sale_count} 件
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(item.total_amount)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(item.ratio * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MonthlyBarChart({ monthlyTotals }: { monthlyTotals: MonthlyTotal[] }) {
  const maxAmount = Math.max(
    ...monthlyTotals.map((item) => item.total_amount),
    1
  );

  return (
    <div className="mt-2">
      <div className="flex items-end gap-2 overflow-x-auto pb-2">
        {monthlyTotals.map((item) => {
          const height = Math.max((item.total_amount / maxAmount) * 100, 4);
          return (
            <div key={item.month} className="flex min-w-[48px] flex-col items-center gap-2">
              <div className="relative flex h-40 w-8 items-end justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                <div
                  className="w-6 rounded-md bg-blue-500 shadow-sm"
                  style={{ height: `${height}%` }}
                  title={`${item.month}月: ${formatCurrency(item.total_amount)}`}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.month}月</p>
            </div>
          );
        })}
      </div>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        最大値 {formatCurrency(maxAmount)} を基準にしています。
      </div>
    </div>
  );
}

export default function SalesSummaryPage() {
  const { logout } = useAuth();
  const today = new Date();
  const [viewMode, setViewMode] = useState<ViewMode>("year");
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [yearlySummary, setYearlySummary] = useState<YearlySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const monthInputValue = useMemo(() => {
    const month = selectedMonth.toString().padStart(2, "0");
    return `${selectedYear}-${month}`;
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError("");
        if (viewMode === "month") {
          const data = await salesApi.getMonthlySummary(token, {
            year: selectedYear,
            month: selectedMonth,
          });
          setMonthlySummary(data);
        } else {
          const data = await salesApi.getYearlySummary(token, { year: selectedYear });
          setYearlySummary(data);
        }
      } catch (err) {
        console.error("Failed to load summary", err);
        setError("集計データの取得に失敗しました。時間をおいて再度お試しください。");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [viewMode, selectedYear, selectedMonth]);

  const handlePrevMonth = () => {
    const current = new Date(selectedYear, selectedMonth - 1, 1);
    current.setMonth(current.getMonth() - 1);
    setSelectedYear(current.getFullYear());
    setSelectedMonth(current.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const current = new Date(selectedYear, selectedMonth - 1, 1);
    current.setMonth(current.getMonth() + 1);
    setSelectedYear(current.getFullYear());
    setSelectedMonth(current.getMonth() + 1);
  };

  const handlePrevYear = () => setSelectedYear((prev) => prev - 1);
  const handleNextYear = () => setSelectedYear((prev) => prev + 1);

  const activeSummary = viewMode === "month" ? monthlySummary : yearlySummary;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppHeader onLogout={logout} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-300">売上集計</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              売上グラフ
            </h1>
          </div>
          <div className="inline-flex rounded-lg bg-white p-1 shadow dark:bg-gray-800">
            <button
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                viewMode === "month"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => setViewMode("month")}
            >
              月別
            </button>
            <button
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                viewMode === "year"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => setViewMode("year")}
            >
              年別
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow dark:bg-gray-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrevYear}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              前の年
            </button>
            {viewMode === "month" && (
              <button
                onClick={handlePrevMonth}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                前の月
              </button>
            )}
            {viewMode === "month" ? (
              <input
                type="month"
                value={monthInputValue}
                onChange={(e) => {
                  const [yearStr, monthStr] = e.target.value.split("-");
                  setSelectedYear(Number(yearStr));
                  setSelectedMonth(Number(monthStr));
                }}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            ) : (
              <input
                type="number"
                value={selectedYear}
                min={2000}
                max={3000}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            )}
            {viewMode === "month" && (
              <button
                onClick={handleNextMonth}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                次の月
              </button>
            )}
            <button
              onClick={handleNextYear}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              次の年
            </button>
          </div>
          <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {viewMode === "month"
              ? `${selectedYear}年${selectedMonth}月のデータ`
              : `${selectedYear}年のデータ`}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {loading && (
            <div className="rounded-lg bg-white p-6 text-center text-gray-600 shadow dark:bg-gray-800 dark:text-gray-300">
              集計中です…
            </div>
          )}

          {!loading && activeSummary && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">合計売上</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(activeSummary.totals.amount)}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">件数</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {activeSummary.totals.count} 件
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">期間</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {viewMode === "month"
                      ? `${(activeSummary as MonthlySummary).period.start_date} 〜 ${(activeSummary as MonthlySummary).period.end_date}`
                      : `${(activeSummary as YearlySummary).period.start_date} 〜 ${(activeSummary as YearlySummary).period.end_date}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-5 shadow dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      案件別の売上構成
                    </h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400">円グラフ</span>
                  </div>
                  <PieChart
                    breakdown={activeSummary.case_breakdown}
                    total={activeSummary.totals.amount}
                  />
                </div>

                {viewMode === "year" && (
                  <div className="rounded-lg bg-white p-5 shadow dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        月別の推移
                      </h2>
                      <span className="text-xs text-gray-500 dark:text-gray-400">棒グラフ</span>
                    </div>
                    <MonthlyBarChart
                      monthlyTotals={(activeSummary as YearlySummary).monthly_totals}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {!loading && !activeSummary && (
            <div className="rounded-lg bg-white p-6 text-center text-gray-600 shadow dark:bg-gray-800 dark:text-gray-300">
              集計データがありません。
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
