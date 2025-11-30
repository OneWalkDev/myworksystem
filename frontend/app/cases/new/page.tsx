'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
}

interface CaseStatistics {
  total: number;
  by_status: Record<string, number>;
  in_progress: number;
  completed: number;
}

export default function CaseNewPage() {
      const router = useRouter();
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState(true);
      const [statistics, setStatistics] = useState<CaseStatistics>({
        total: 0,
        by_status: {},
        in_progress: 0,
        completed: 0,
      });
    
      useEffect(() => {
        // ログインチェック
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
    
        if (!token || !userData) {
          router.push('/login');
          return;
        }
    
        setUser(JSON.parse(userData));
    
        setLoading(false);
      }, [router]);

        const handleLogout = async () => {
    try {
      await fetch('http://localhost:8001/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // ローカルストレージをクリア
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };
return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              案件登録
            </h1>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      </main>
    </div>
  );
}
