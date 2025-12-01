"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "はい",
  cancelText = "いいえ",
  onConfirm,
  onCancel,
  variant = "warning",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      icon: "text-red-600",
    },
    warning: {
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      icon: "text-yellow-600",
    },
    info: {
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      icon: "text-blue-600",
    },
  };

  const style = variantStyles[variant];

  return (
    <>
      {/* バックドロップ */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />

      {/* ダイアログ */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
          {/* アイコン */}
          <div className="flex items-center justify-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-opacity-10 ${
                variant === "danger"
                  ? "bg-red-600"
                  : variant === "warning"
                    ? "bg-yellow-600"
                    : "bg-blue-600"
              }`}
            >
              <svg
                className={`h-6 w-6 ${style.icon}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {variant === "danger" || variant === "warning" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* タイトル */}
          <h3 className="mt-4 text-center text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>

          {/* メッセージ */}
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>

          {/* ボタン */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
