"use client";

import { ConfirmDialog } from "./ConfirmDialog";
import { useConfirm } from "@/app/hooks/useConfirm";
import toast from "react-hot-toast";

export function ConfirmDialogExample() {
  const { isOpen, options, confirm, handleConfirm, handleCancel } =
    useConfirm();

  const handleDelete = async () => {
    const result = await confirm({
      title: "本当によろしいですか？",
      message: "この案件を削除すると元に戻すことはできません。",
      confirmText: "はい",
      cancelText: "いいえ",
      variant: "danger",
    });

    if (result) {
      toast.success("削除しました");
      // 実際の削除処理...
    } else {
      toast.error("キャンセルしました");
    }
  };

  const handleSave = async () => {
    const result = await confirm({
      title: "保存しますか？",
      message: "変更内容を保存してもよろしいですか？",
      confirmText: "保存する",
      cancelText: "キャンセル",
      variant: "info",
    });

    if (result) {
      toast.success("保存しました");
    }
  };

  const handleWarning = async () => {
    const result = await confirm({
      title: "注意",
      message: "この操作を実行すると、一部のデータが上書きされます。",
      confirmText: "続行",
      cancelText: "中止",
      variant: "warning",
    });

    if (result) {
      toast.success("実行しました");
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">確認ダイアログのサンプル</h2>

      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          削除の確認（危険）
        </button>

        <button
          onClick={handleSave}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          保存の確認（情報）
        </button>

        <button
          onClick={handleWarning}
          className="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
        >
          警告の確認
        </button>
      </div>

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
    </div>
  );
}
