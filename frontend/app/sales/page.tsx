"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { AppHeader } from "@/app/components/layout/AppHeader";
import { SaleTable, FilterValues } from "@/app/components/sales/SaleTable";
import type { Sales } from "@/app/types/sale";
import { salesApi } from "@/app/lib/api";
import Link from "next/link";

export default function SalePage() {
  const { logout } = useAuth();
  const [sales, setSales] = useState<Sales[]>([]);
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
      fetchSales(token, currentPage, filters);
    }
  }, [currentPage, filters]);

  const fetchSales = async (
    token: string,
    page: number,
    filters: FilterValues
  ) => {
    try {
      setIsFetching(true);
      const response = await salesApi.getSales(token, {
        page, 
        per_page: perPage,
        ...filters,
      });

      console.log("API Response:", response);

      if (Array.isArray(response)) {
        setSales(response);
        setCurrentPage(1);
        setLastPage(1);
        setTotal(response.length);
        setPerPage(response.length);
      } else if (response.data) {
        setSales(response.data || []);
        setCurrentPage(response.current_page || 1);
        setLastPage(response.last_page || 1);
        setTotal(response.total || 0);
        setPerPage(response.per_page || 10);
      } else {
        setSales([]);
        setCurrentPage(1);
        setLastPage(1);
        setTotal(0);
      }
    } catch (error) {
      console.error("Sales fetch error:", error);
      setSales([]);
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
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppHeader onLogout={logout} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            売上リスト
          </h1>
          <Link
            href="/sales/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            新規売上
          </Link>
        </div>

        {isInitialLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          </div>
        ) : (
          <div className="relative">
            {isFetching && (
              <div className="absolute top-0 left-0 right-0 z-10 flex justify-center">
                <div className="rounded-b-lg bg-blue-500 px-4 py-2 text-sm text-white shadow-lg">
                  Searching...
                </div>
              </div>
            )}
            <SaleTable
              sales={sales}
              currentPage={currentPage}
              lastPage={lastPage}
              total={total}
              perPage={perPage}
              onPageChange={handlePageChange}
              onFilterChange={handleFilterChange}
              filters={filters}
            />
          </div>
        )}
      </main>
    </div>
  );
}
