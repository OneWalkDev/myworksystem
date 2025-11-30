"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { AppHeader } from "@/app/components/layout/AppHeader";
import { CaseTable, FilterValues } from "@/app/components/cases/CaseTable";
import { ClientCase } from "@/app/components/cases/CaseForm";
import { api } from "@/app/lib/api";
import Link from "next/link";

interface MasterData {
  id: number;
  name: string;
  color?: string;
}

export default function CasesPage() {
  const { logout } = useAuth();
  const [cases, setCases] = useState<ClientCase[]>([]);
  const [statuses, setStatuses] = useState<MasterData[]>([]);
  const [priorities, setPriorities] = useState<MasterData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<FilterValues>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchMasterData(token);
      fetchCases(token, currentPage, filters);
    }
  }, [currentPage, filters]);

  const fetchMasterData = async (token: string) => {
    try {
      const [statusData, priorityData] = await Promise.all([
        api.getCaseStatus(token),
        api.getCasePriority(token),
      ]);

      setStatuses(Array.isArray(statusData) ? statusData : []);
      setPriorities(Array.isArray(priorityData) ? priorityData : []);
    } catch (error) {
      console.error("Master data fetch error:", error);
    }
  };

  const fetchCases = async (
    token: string,
    page: number,
    filters: FilterValues
  ) => {
    try {
      setIsLoading(true);
      const response = await api.getCases(token, {
        page,
        per_page: perPage,
        ...filters,
      });

      setCases(response.data || []);
      setCurrentPage(response.current_page || 1);
      setLastPage(response.last_page || 1);
      setTotal(response.total || 0);
      setPerPage(response.per_page || 10);
    } catch (error) {
      console.error("Cases fetch error:", error);
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // フィルター変更時は1ページ目に戻る
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppHeader title="案件一覧" onLogout={logout} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            案件一覧
          </h1>
          <Link
            href="/cases/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            新規案件を作成
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              読み込み中...
            </div>
          </div>
        ) : (
          <CaseTable
            cases={cases}
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            perPage={perPage}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            statuses={statuses}
            priorities={priorities}
          />
        )}
      </main>
    </div>
  );
}
