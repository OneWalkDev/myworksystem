"use client";

import { useEffect, useState } from "react";
import { casesApi } from "@/app/lib/api";
import { Sales } from "@/app/types/sale";
import { ClientCase } from "@/app/types/case";

interface CaseFormProps {
  initialData?: Sales;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  errors?: Record<string, string[]>;
}

// 型を再エクスポート（他のファイルから使いやすくするため）
export type { Sales };

export function SaleForm({
  initialData,
  onSubmit,
  isLoading = false,
  errors = {},
}: CaseFormProps) {
  const [cases, setCases] = useState<ClientCase[]>([]);
  // フォームの選択値を管理
  const [selectedCaseId, setSelectCaseId] = useState<string>("");
  const [selectedIsPaid, setSelectedIsPaid] = useState<string>("0");

  // 日付をYYYY-MM-DD形式に変換するヘルパー関数
  const formatDateForInput = (
    dateString: string | null | undefined
  ): string => {
    if (!dateString) return "";
    // すでにYYYY-MM-DD形式の場合はそのまま返す
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    // YYYY-MM-DD HH:MM:SS形式の場合は日付部分のみ抽出
    return dateString.split("T")[0] || "";
  };

  // フィールドにエラーがあるかチェック
  const hasError = (fieldName: string): boolean => {
    return errors && errors[fieldName] && errors[fieldName].length > 0;
  };

  // エラーメッセージを取得
  const getErrorMessage = (fieldName: string): string => {
    if (!hasError(fieldName)) return "";
    return errors[fieldName][0];
  };

  // エラー時のinputクラス名を取得
  const getInputClassName = (
    baseClassName: string,
    fieldName: string
  ): string => {
    if (hasError(fieldName)) {
      return `${baseClassName} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    return baseClassName;
  };

  // initialDataが変更されたら選択値を更新
  useEffect(() => {
    if (initialData) {
      setSelectCaseId(initialData.case_id?.toString() || "");
      setSelectedIsPaid(initialData.is_paid ? "1" : "0");
    }
  }, [initialData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCasesData(token);
    }
  }, []);

  const fetchCasesData = async (token: string) => {
    try {
      // 案件データを取得
      const cases = await casesApi.getCasesForSelect(token);

      // データが配列かどうか確認して設定
      setCases(Array.isArray(cases) ? cases : []);

      console.log(cases);
    } catch (error) {
      console.error("Master data fetch error:", error);
      // エラー時は空配列を設定
      setCases([]);
    }
  };

  return (
    <form action={onSubmit} className="space-y-8">
      {/* 基本情報 */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          基本情報
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="case_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              案件 <span className="text-red-500">*</span>
            </label>
            <select
              id="case_id"
              name="case_id"
              value={selectedCaseId}
              onChange={(e) => setSelectCaseId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">選択してください</option>
              {cases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {hasError("case_id") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getErrorMessage("case_id")}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="sale_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              売上日
            </label>
            <input
              type="date"
              id="sale_date"
              name="sale_date"
              defaultValue={formatDateForInput(initialData?.sale_date)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* クライアント情報 */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          金額情報
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              金額(税抜)
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              defaultValue={initialData?.amount || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="500000"
            />
          </div>

          <div>
            <label
              htmlFor="tax_amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              消費税
            </label>
            <input
              type="text"
              id="tax_amount"
              name="tax_amount"
              defaultValue={initialData?.tax_amount || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="50000"
            />
          </div>

          <div>
            <label
              htmlFor="total_amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              合計金額
            </label>
            <input
              type="text"
              id="total_amount"
              name="total_amount"
              defaultValue={initialData?.total_amount || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="50000"
            />
          </div>
        </div>
      </div>

      {/* 契約・金額情報 */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          時間情報
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="working_hours"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              稼働時間
            </label>
            <input
              type="number"
              id="working_hours"
              name="working_hours"
              defaultValue={initialData?.working_hours || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="5000"
            />
            {hasError("working_hours") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getErrorMessage("working_hours")}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="hourly_rate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              時給（円）
            </label>
            <input
              type="number"
              id="hourly_rate"
              name="hourly_rate"
              defaultValue={initialData?.hourly_rate || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="5000"
            />
            {hasError("hourly_rate") && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {getErrorMessage("hourly_rate")}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="payment_due_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              請求日
            </label>
            <input
              type="date"
              id="payment_due_date"
              name="payment_due_date"
              defaultValue={formatDateForInput(initialData?.payment_due_date)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="payment_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              支払日
            </label>
            <input
              type="date"
              id="payment_date"
              name="payment_date"
              defaultValue={formatDateForInput(initialData?.payment_date)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="is_paid"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              支払済
            </label>
            <select
              id="is_paid"
              name="is_paid"
              value={selectedIsPaid}
              onChange={(e) => setSelectedIsPaid(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="0">いいえ</option>
              <option value="1">はい</option>
            </select>
          </div>
        </div>
      </div>

      {/* メモ */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          メモ・その他
        </h3>
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            メモ
          </label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={initialData?.notes || ""}
            rows={6}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="備考や注意事項など"
          />
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "保存中..." : initialData ? "更新する" : "登録する"}
        </button>
      </div>
    </form>
  );
}
