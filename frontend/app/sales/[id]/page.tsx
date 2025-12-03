"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { AppHeader } from "@/app/components/layout/AppHeader";
import Link from "next/link";
import toast from "react-hot-toast";
import { useConfirm } from "@/app/hooks/useConfirm";
import { ConfirmDialog } from "@/app/components/common/ConfirmDialog";
import { Sales } from "@/app/types/sale";
import { salesApi } from "@/app/lib/api";

export default function SaleShowPage() {
  const params = useParams();
  const router = useRouter();
  const { isOpen, options, confirm, handleConfirm, handleCancel } =
    useConfirm();
  const { logout } = useAuth();

  const [sale, setSale] = useState<Sales | undefined>(
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
      fetchSale(token, numericId);
    }
  }, [numericId, isValidId]);

  const fetchSale = async (token: string, id: number) => {
    try {
      const response = await salesApi.getSale(token, id);
      setSale(response);
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

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await confirm({
      title: "削除します。本当によろしいですか？",
      message: "この売上を削除するともとに戻すことはできません。",
      confirmText: "はい",
      cancelText: "いいえ",
      variant: "danger",
    });

    if (result) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("認証トークンが見つかりません");
        }
        salesApi.deleteSale(token, numericId);

        router.push("/sales");
        toast.success("削除しました。");
      } catch (err) {
        console.error("Sale creation error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "売上の削除に失敗しました";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
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
      <AppHeader onLogout={logout} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            売上詳細
          </h1>
          <div className="flex justify-end">
            <button
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-4 py-2 me-5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              削除する
            </button>
            <ConfirmDialog
              isOpen={isOpen}
              title={options.title}
              message={options.message}
              confirmText={options.confirmText}
              cancelText={options.cancelText}
              variant={options.variant}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
            <Link
              href={`/sales/${id}/edit`}
              className="rounded-md bg-blue-600 px-4 py-2 me-5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              編集する
            </Link>
            <Link
              href="/sales"
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
        ) : sale ? (
          <div className="space-y-6">
            {/* 基本情報 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                基本情報
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    顧客名
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {sale.client_case?.client_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    売上期間
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(sale.sale_date)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    金額(税抜)
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(sale.amount)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    税金
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(sale.tax_amount || 0)}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    合計金額
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {sale.total_amount || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* 稼働情報 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                稼働情報
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    稼働時間
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {sale.working_hours || 0}時間
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    時給
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {sale.hourly_rate || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* 支払い情報 */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                支払い情報
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    支払期日
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(sale.payment_due_date) || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    実入金日
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDate(sale.payment_date) || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    支払済
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {sale.is_paid ? "はい" : "いいえ"}
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
                    {sale.notes || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              売上が見つかりませんでした
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
