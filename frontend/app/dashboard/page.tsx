"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { CaseStatistics } from "@/app/types";
import { api } from "@/app/lib/api";
import { AppHeader } from "@/app/components/layout/AppHeader";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [statistics, setStatistics] = useState<CaseStatistics>({
    total: 0,
    by_status: {},
    in_progress: 0,
    completed: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchStatistics(token);
    }
  }, []);

  const fetchStatistics = async (token: string) => {
    try {
      const data = await api.getCaseStatistics(token);
      setStatistics(data);
    } catch (error) {
      console.error("Statistics fetch error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppHeader title="ダッシュボード" onLogout={logout} />

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ウェルカムメッセージ */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            ようこそ、{user?.name}さん！
          </h2>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  総案件数
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {statistics.total}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  完了した案件
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {statistics.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <svg
                  className="h-6 w-6 text-yellow-600 dark:text-yellow-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  進行中の案件
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {statistics.in_progress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            最近のアクティビティ
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center border-b border-gray-200 pb-4 dark:border-gray-700">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  ログインしました
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  たった今
                </p>
              </div>
            </div>
            <div className="flex items-center border-b border-gray-200 pb-4 dark:border-gray-700">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  プロフィールを更新しました
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2時間前
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  新しいプロジェクトを作成しました
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  1日前
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
