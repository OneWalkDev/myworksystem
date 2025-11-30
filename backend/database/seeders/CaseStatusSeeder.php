<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CaseStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => '問い合わせ',
                'display_order' => 1,
                'color' => '#9CA3AF',
                'description' => 'クライアントから初めて問い合わせがあった段階',
                'is_active' => true,
            ],
            [
                'name' => '商談中',
                'display_order' => 2,
                'color' => '#3B82F6',
                'description' => '見積もりや条件について商談している段階',
                'is_active' => true,
            ],
            [
                'name' => '契約済み',
                'display_order' => 3,
                'color' => '#8B5CF6', 
                'description' => '契約が完了し、開始準備中の段階',
                'is_active' => true,
            ],
            [
                'name' => '進行中',
                'display_order' => 4,
                'color' => '#10B981', 
                'description' => '実際に作業を進めている段階',
                'is_active' => true,
            ],
            [
                'name' => '保留',
                'display_order' => 5,
                'color' => '#F59E0B', // amber-500
                'description' => 'クライアント都合などで一時的に停止している段階',
                'is_active' => true,
            ],
            [
                'name' => '完了',
                'display_order' => 6,
                'color' => '#059669', // emerald-600
                'description' => 'プロジェクトが正常に完了した段階',
                'is_active' => true,
            ],
            [
                'name' => 'キャンセル',
                'display_order' => 7,
                'color' => '#EF4444', // red-500
                'description' => 'プロジェクトが途中でキャンセルされた段階',
                'is_active' => true,
            ],
        ];

        foreach ($statuses as $status) {
            DB::table('case_statuses')->insert(array_merge($status, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
