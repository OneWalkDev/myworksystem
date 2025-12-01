"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import type {
  ClientCase,
  CaseStatus,
  CasePriority,
  PaymentType,
} from "@/app/types";

interface CaseFormProps {
  initialData?: ClientCase;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

// 型を再エクスポート（他のファイルから使いやすくするため）
export type { ClientCase };

export function CaseForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CaseFormProps) {
  const [priorities, setPriorities] = useState<CasePriority[]>([]);
  const [statuses, setStatuses] = useState<CaseStatus[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);

  // フォームの選択値を管理
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");
  const [selectedPriorityId, setSelectedPriorityId] = useState<string>("");
  const [selectedPaymentTypeId, setSelectedPaymentTypeId] = useState<string>("");

  // 日付をYYYY-MM-DD形式に変換するヘルパー関数
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    // すでにYYYY-MM-DD形式の場合はそのまま返す
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    // YYYY-MM-DD HH:MM:SS形式の場合は日付部分のみ抽出
    return dateString.split("T")[0] || "";
  };

  // initialDataが変更されたら選択値を更新
  useEffect(() => {
    if (initialData) {
      setSelectedStatusId(initialData.status_id?.toString() || "");
      setSelectedPriorityId(initialData.priority_id?.toString() || "");
      setSelectedPaymentTypeId(initialData.payment_type_id?.toString() || "");
    }
  }, [initialData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchMasterData(token);
    }
  }, []);

  const fetchMasterData = async (token: string) => {
    try {
      // 並列でマスターデータを取得
      const [priorityData, statusData, paymentData] = await Promise.all([
        api.getCasePriority(token),
        api.getCaseStatus(token),
        api.getPaymentType(token),
      ]);

      console.log("Priority data:", priorityData, "Type:", typeof priorityData, "Is Array:", Array.isArray(priorityData));
      console.log("Status data:", statusData, "Type:", typeof statusData, "Is Array:", Array.isArray(statusData));
      console.log("Payment data:", paymentData, "Type:", typeof paymentData, "Is Array:", Array.isArray(paymentData));

      // データが配列かどうか確認して設定
      setPriorities(Array.isArray(priorityData) ? priorityData : []);
      setStatuses(Array.isArray(statusData) ? statusData : []);
      setPaymentTypes(Array.isArray(paymentData) ? paymentData : []);
    } catch (error) {
      console.error("Master data fetch error:", error);
      // エラー時は空配列を設定
      setPriorities([]);
      setStatuses([]);
      setPaymentTypes([]);
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              案件名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={initialData?.name}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="例: Webサイトリニューアル"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              説明
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ""}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="案件の詳細を入力してください"
            />
          </div>
        </div>
      </div>

      {/* クライアント情報 */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          クライアント情報
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="client_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              クライアント名
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              defaultValue={initialData?.client_name || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="田中太郎"
            />
          </div>

          <div>
            <label
              htmlFor="client_company"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              会社名
            </label>
            <input
              type="text"
              id="client_company"
              name="client_company"
              defaultValue={initialData?.client_company || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="株式会社サンプル"
            />
          </div>

          <div>
            <label
              htmlFor="client_email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="client_email"
              name="client_email"
              defaultValue={initialData?.client_email || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="client_phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              電話番号
            </label>
            <input
              type="tel"
              id="client_phone"
              name="client_phone"
              defaultValue={initialData?.client_phone || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="090-1234-5678"
            />
          </div>
        </div>
      </div>

      {/* 契約・金額情報 */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          契約・金額情報
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="payment_type_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              支払いタイプ
            </label>
            <select
              id="payment_type_id"
              name="payment_type_id"
              value={selectedPaymentTypeId}
              onChange={(e) => setSelectedPaymentTypeId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">選択してください</option>
              {paymentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              予算（円）
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              defaultValue={initialData?.budget || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="1000000"
            />
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
          </div>

          <div>
            <label
              htmlFor="actual_amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              実際の金額（円）
            </label>
            <input
              type="number"
              id="actual_amount"
              name="actual_amount"
              defaultValue={initialData?.actual_amount || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="950000"
            />
          </div>
        </div>
      </div>

      {/* 期間 */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          期間
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              開始予定日
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              defaultValue={formatDateForInput(initialData?.start_date)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              終了予定日
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              defaultValue={formatDateForInput(initialData?.end_date)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="actual_start_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              実際の開始日
            </label>
            <input
              type="date"
              id="actual_start_date"
              name="actual_start_date"
              defaultValue={formatDateForInput(initialData?.actual_start_date)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="actual_end_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              実際の終了日
            </label>
            <input
              type="date"
              id="actual_end_date"
              name="actual_end_date"
              defaultValue={formatDateForInput(initialData?.actual_end_date)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* ステータス */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          ステータス
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="status_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              案件ステータス
            </label>
            <select
              id="status_id"
              name="status_id"
              value={selectedStatusId}
              onChange={(e) => setSelectedStatusId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">選択してください</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="priority_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              優先度
            </label>
            <select
              id="priority_id"
              name="priority_id"
              value={selectedPriorityId}
              onChange={(e) => setSelectedPriorityId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">選択してください</option>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
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
