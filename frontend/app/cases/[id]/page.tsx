"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { AppHeader } from "@/app/components/layout/AppHeader";
import { api } from "@/app/lib/api";
import type { ClientCase } from "@/app/types";
import Link from "next/link";

export default function CaseShowPage() {
  const params = useParams();
  const router = useRouter();
  const { logout } = useAuth();

  const [clientCase, setClientCase] = useState<ClientCase | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  // id を取得（Hooks の後で検証）
  const id = params.id;
  const numericId = Number(id);
  const isValidId = !isNaN(numericId);

  useEffect(() => {
    if (!isValidId) return;

    const token = localStorage.getItem("token");
    if (token) {
      fetchCase(token, numericId);
    }
  }, [numericId, isValidId]);

  const fetchCase = async (token: string, id: number) => {
    try {
      const response = await api.getCase(token, id);
      setClientCase(response.case);
    } finally {
      setIsLoading(false);
    }
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

  // Hooks の後で notFound を呼ぶ
  if (!isValidId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppHeader title="案件詳細" onLogout={logout} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            案件詳細
          </h1>
          <div className="flex justify-end">
            <Link
              href={`/cases/${id}/edit`}
              className="rounded-md bg-blue-600 px-4 py-2 me-5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              編集する
            </Link>
            <Link
              href="/cases"
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              一覧に戻る
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              読み込み中...
            </div>
          </div>
        ) : clientCase ? (
          <div className="space-y-6">
            {/* 基本情報 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                基本情報
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    案件名
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {clientCase.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ステータス
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {clientCase.status?.name || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    優先度
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {clientCase.priority?.name || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    予算
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(clientCase.budget)}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    説明
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {clientCase.description || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* クライアント情報 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                クライアント情報
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    クライアント名
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {clientCase.client_name || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    会社名
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {clientCase.client_company || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    メールアドレス
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {clientCase.client_email || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    電話番号
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {clientCase.client_phone || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* 日程情報 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                日程情報
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    開始日（予定）
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(clientCase.start_date)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    終了日（予定）
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(clientCase.end_date)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    開始日（実績）
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(clientCase.actual_start_date)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    終了日（実績）
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(clientCase.actual_end_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* 金額情報 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                金額情報
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    予算
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(clientCase.budget)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    実績金額
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(clientCase.actual_amount)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    時給
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(clientCase.hourly_rate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    支払いタイプ
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {clientCase.payment_type?.name || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* その他 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                その他
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    メモ
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {clientCase.notes || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              案件が見つかりませんでした
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
