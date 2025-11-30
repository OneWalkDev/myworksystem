"use client";

import { useState } from "react";
import { ClientCase } from "./CaseForm";
import Link from "next/link";

interface MasterData {
  id: number;
  name: string;
  color?: string;
}

interface CaseTableProps {
  cases: ClientCase[];
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: FilterValues) => void;
  statuses: MasterData[];
  priorities: MasterData[];
}

export interface FilterValues {
  name?: string;
  client_name?: string;
  status_id?: number;
  priority_id?: number;
  start_date_from?: string;
  start_date_to?: string;
}

export function CaseTable({
  cases,
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  onFilterChange,
  statuses,
  priorities,
}: CaseTableProps) {
  const [filters, setFilters] = useState<FilterValues>({});

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const formatCurrency = (amount?: number | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount);
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ja-JP");
  };

  return (
    <div className="space-y-4">
      {/* フィルター */}
      <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          検索フィルター
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              案件名
            </label>
            <input
              type="text"
              value={filters.name || ""}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="案件名で検索"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              クライアント名
            </label>
            <input
              type="text"
              value={filters.client_name || ""}
              onChange={(e) =>
                handleFilterChange("client_name", e.target.value)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="クライアント名で検索"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              ステータス
            </label>
            <select
              value={filters.status_id || ""}
              onChange={(e) => handleFilterChange("status_id", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">すべて</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              優先度
            </label>
            <select
              value={filters.priority_id || ""}
              onChange={(e) =>
                handleFilterChange("priority_id", e.target.value)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">すべて</option>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              開始日（From）
            </label>
            <input
              type="date"
              value={filters.start_date_from || ""}
              onChange={(e) =>
                handleFilterChange("start_date_from", e.target.value)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              開始日（To）
            </label>
            <input
              type="date"
              value={filters.start_date_to || ""}
              onChange={(e) =>
                handleFilterChange("start_date_to", e.target.value)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                案件名
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                クライアント
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                ステータス
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                優先度
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                予算
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                開始日
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                終了日
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {cases.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  案件が見つかりませんでした
                </td>
              </tr>
            ) : (
              cases.map((caseItem) => (
                <tr
                  key={caseItem.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {caseItem.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                    {caseItem.client_name || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5">
                      {caseItem.status_id || "-"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                    {caseItem.priority_id || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(caseItem.budget)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(caseItem.start_date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(caseItem.end_date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Link
                      href={`/cases/${caseItem.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow dark:bg-gray-800">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            前へ
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            次へ
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              全 <span className="font-medium">{total}</span> 件中{" "}
              <span className="font-medium">
                {(currentPage - 1) * perPage + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium">
                {Math.min(currentPage * perPage, total)}
              </span>{" "}
              件を表示
            </p>
          </div>
          <div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                前へ
              </button>
              {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                    page === currentPage
                      ? "z-10 border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                      : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                次へ
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
