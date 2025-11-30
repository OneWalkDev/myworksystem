"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AppHeaderProps {
  title: string;
  onLogout: () => void;
}

export function AppHeader({ title, onLogout }: AppHeaderProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "ダッシュボード", href: "/dashboard" },
    { name: "案件一覧", href: "/cases" },
    { name: "新規案件", href: "/cases/new" },
  ];

  const isActive = (href: string) => {
    if (href === "/cases") {
      return pathname === "/cases";
    }
    return pathname?.startsWith(href);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              {/* ハンバーガーメニューボタン */}
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-expanded={isSidebarOpen}
              >
                <span className="sr-only">メニューを開く</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                フリーランス管理
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* オーバーレイ */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-gray-800 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* サイドバーヘッダー */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              メニュー
            </h2>
            <button
              onClick={closeSidebar}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">閉じる</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* ナビゲーションメニュー */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center rounded-md px-4 py-3 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-gray-900 text-white dark:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* サイドバーフッター */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <button
              onClick={() => {
                closeSidebar();
                onLogout();
              }}
              className="w-full rounded-md bg-red-600 px-4 py-3 text-center text-base font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              ログアウト
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
