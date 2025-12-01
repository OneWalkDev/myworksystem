"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CaseForm } from "@/app/components/cases/CaseForm";
import type { ClientCase } from "@/app/types";
import { useAuth } from "@/app/hooks/useAuth";
import { AppHeader } from "@/app/components/layout/AppHeader";
import { api } from "@/app/lib/api";
import { useParams } from "next/navigation";

export default function CaseNewPage() {
  const params = useParams();
  const { logout } = useAuth();
  const router = useRouter();
  const [clientCase, setClientCase] = useState<ClientCase | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
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

  const handleEdit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("認証トークンが見つかりません");
      }

      // FormDataからオブジェクトに変換
      const data: any = {
        name: formData.get("name") as string,
      };

      // 任意フィールドの追加
      const description = formData.get("description") as string;
      if (description) data.description = description;

      const client_name = formData.get("client_name") as string;
      if (client_name) data.client_name = client_name;

      const client_email = formData.get("client_email") as string;
      if (client_email) data.client_email = client_email;

      const client_phone = formData.get("client_phone") as string;
      if (client_phone) data.client_phone = client_phone;

      const client_company = formData.get("client_company") as string;
      if (client_company) data.client_company = client_company;

      const budget = formData.get("budget") as string;
      if (budget) data.budget = parseFloat(budget);

      const actual_amount = formData.get("actual_amount") as string;
      if (actual_amount) data.actual_amount = parseFloat(actual_amount);

      const payment_type_id = formData.get("payment_type_id") as string;
      if (payment_type_id) data.payment_type_id = parseInt(payment_type_id);

      const hourly_rate = formData.get("hourly_rate") as string;
      if (hourly_rate) data.hourly_rate = parseFloat(hourly_rate);

      const start_date = formData.get("start_date") as string;
      if (start_date) data.start_date = start_date;

      const end_date = formData.get("end_date") as string;
      if (end_date) data.end_date = end_date;

      const actual_start_date = formData.get("actual_start_date") as string;
      if (actual_start_date) data.actual_start_date = actual_start_date;

      const actual_end_date = formData.get("actual_end_date") as string;
      if (actual_end_date) data.actual_end_date = actual_end_date;

      const status_id = formData.get("status_id") as string;
      if (status_id) data.status_id = parseInt(status_id);

      const priority_id = formData.get("priority_id") as string;
      if (priority_id) data.priority_id = parseInt(priority_id);

      const notes = formData.get("notes") as string;
      if (notes) data.notes = notes;

      // API呼び出し
      await api.editCase(token, data, numericId);

      // 成功トースト表示
      toast.success("案件を編集しました");

      // 最新のデータを再取得してフォームを更新
      await fetchCase(token, numericId);
      
      // 成功したら案件一覧ページへリダイレクト
      router.push("/cases");
    } catch (err: any) {
      console.error("Case update error:", err);

      let errorMessage = "案件の更新に失敗しました";

      // エラーレスポンスからバリデーションエラーを抽出
      if (err.response && err.response.errors) {
        setValidationErrors(err.response.errors);
        errorMessage =
          "入力内容に誤りがあります。赤く表示されたフィールドを確認してください。";
      } else if (err instanceof Error) {
        const message = err.message;

        // エラーの種類に応じて適切なメッセージを表示
        if (message.includes("バリデーション")) {
          errorMessage = "入力内容に誤りがあります。確認してください。";
        } else if (message.includes("認証")) {
          errorMessage = "セッションが切れました。再度ログインしてください。";
        } else if (message.includes("データベース") || message.includes("SQL")) {
          errorMessage = "データの保存に失敗しました。入力内容を確認してください。";
        } else if (message.includes("Failed to")) {
          errorMessage = "サーバーとの通信に失敗しました。";
        } else if (message.includes("見つかりません")) {
          errorMessage = "案件が見つかりません。";
        } else {
          // SQLエラーやスタックトレースを含まない場合のみメッセージを使用
          if (!message.includes("SQLSTATE") && !message.includes("at ")) {
            errorMessage = message;
          }
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppHeader title="案件登録" onLogout={logout} />

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            案件登録
          </h1>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <CaseForm
          onSubmit={handleEdit}
          isLoading={isLoading}
          initialData={clientCase}
          errors={validationErrors}
        />
      </main>
    </div>
  );
}
