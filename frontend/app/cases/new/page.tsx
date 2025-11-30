"use client";
import { CaseForm } from "@/app/components/cases/CaseForm";
import { useAuth } from "@/app/hooks/useAuth";
import { AppHeader } from "@/app/components/layout/AppHeader";

export default function CaseNewPage() {
  const { logout } = useAuth();

  const handleCreate = () => {
    return;
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
        <CaseForm onSubmit={handleCreate}></CaseForm>
      </main>
    </div>
  );
}
