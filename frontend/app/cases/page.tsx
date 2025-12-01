"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { AppHeader } from "@/app/components/layout/AppHeader";
import { CaseTable, FilterValues } from "@/app/components/cases/CaseTable";
import type { ClientCase } from "@/app/types";
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchMasterData(token);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
      setIsFetching(true);
      const response = await api.getCases(token, {
        page,
        per_page: perPage,
        ...filters,
      });

      console.log("API Response:", response);

      // レスポンスの構造を確認してデータを設定
      if (Array.isArray(response)) {
        // レスポンスが配列の場合（ページネーションなし）
        setCases(response);
        setCurrentPage(1);
        setLastPage(1);
        setTotal(response.length);
        setPerPage(response.length);
      } else if (response.data) {
        // ページネーション付きレスポンス
        setCases(response.data || []);
        setCurrentPage(response.current_page || 1);
        setLastPage(response.last_page || 1);
        setTotal(response.total || 0);
        setPerPage(response.per_page || 10);
      } else {
        // その他の場合は空配列
        setCases([]);
        setCurrentPage(1);
        setLastPage(1);
        setTotal(0);
      }
    } catch (error) {
      console.error("Cases fetch error:", error);
      setCases([]);
      setCurrentPage(1);
      setLastPage(1);
      setTotal(0);
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
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

        {isInitialLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              読み込み中...
            </div>
          </div>
        ) : (
          <div className="relative">
            {isFetching && (
              <div className="absolute top-0 left-0 right-0 z-10 flex justify-center">
                <div className="rounded-b-lg bg-blue-500 px-4 py-2 text-sm text-white shadow-lg">
                  検索中...
                </div>
              </div>
            )}
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
              filters={filters}
            />
          </div>
        )}
      </main>
    </div>
  );
}
