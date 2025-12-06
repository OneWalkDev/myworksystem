"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";
import { AppHeader } from "@/app/components/layout/AppHeader";
import { salesApi } from "@/app/lib/api";
import { useParams } from "next/navigation";
import { Sales, SaleInput } from "@/app/types/sale";
import { SaleForm } from "@/app/components/sales/SaleForm";

export default function SaleEditPage() {
  const params = useParams();
  const { logout } = useAuth();
  const router = useRouter();
  const [sale, setSale] = useState<Sales | undefined>(
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
      const data: SaleInput = {
        case_id: Number(formData.get("case_id")),
        sale_date: (formData.get("sale_date") as string) || "",
        amount: Number(formData.get("amount")),
        total_amount: Number(formData.get("total_amount")),
      };

      const tax_amount = formData.get("tax_amount") as string | null;
      if (tax_amount) data.tax_amount = parseFloat(tax_amount);

      const working_hours = formData.get("working_hours") as string | null;
      if (working_hours) data.working_hours = parseFloat(working_hours);

      const hourly_rate = formData.get("hourly_rate") as string | null;
      if (hourly_rate) data.hourly_rate = parseFloat(hourly_rate);

      const payment_due_date = formData.get("payment_due_date") as string | null;
      if (payment_due_date) data.payment_due_date = payment_due_date;

      const payment_date = formData.get("payment_date") as string | null;
      if (payment_date) data.payment_date = payment_date;

      const is_paid = formData.get("is_paid") as string | null;
      if (is_paid !== null && is_paid !== "") data.is_paid = is_paid === "1";

      const notes = formData.get("notes") as string | null;
      if (notes) data.notes = notes;

      // API呼び出し
      await salesApi.updateSale(token, numericId, data);

      // 成功トースト表示
      toast.success("売上を編集しました");

      // 最新のデータを再取得してフォームを更新
      await fetchSale(token, numericId);

      // 成功したら売上一覧ページへリダイレクト
      router.push("/sales");
    } catch (err: any) {
      console.error("Sale update error:", err);

      let errorMessage = "売上の更新に失敗しました";

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
        } else if (
          message.includes("データベース") ||
          message.includes("SQL")
        ) {
          errorMessage =
            "データの保存に失敗しました。入力内容を確認してください。";
        } else if (message.includes("Failed to")) {
          errorMessage = "サーバーとの通信に失敗しました。";
        } else if (message.includes("見つかりません")) {
          errorMessage = "売上が見つかりません。";
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
      <AppHeader onLogout={logout} />

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            売上編集
          </h1>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <SaleForm
          onSubmit={handleEdit}
          isLoading={isLoading}
          initialData={sale}
          errors={validationErrors}
        />
      </main>
    </div>
  );
}
