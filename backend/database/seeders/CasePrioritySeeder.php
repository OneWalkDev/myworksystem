<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CasePrioritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $priorities = [
            [
                'name' => '低',
                'display_order' => 1,
                'color' => '#6B7280', // gray-500
                'description' => '緊急性が低く、余裕を持って対応できる案件',
                'is_active' => true,
            ],
            [
                'name' => '中',
                'display_order' => 2,
                'color' => '#3B82F6', // blue-500
                'description' => '通常の優先度で進める案件',
                'is_active' => true,
            ],
            [
                'name' => '高',
                'display_order' => 3,
                'color' => '#F59E0B', // amber-500
                'description' => '優先的に対応すべき重要な案件',
                'is_active' => true,
            ],
            [
                'name' => '緊急',
                'display_order' => 4,
                'color' => '#EF4444', // red-500
                'description' => '最優先で即座に対応が必要な案件',
                'is_active' => true,
            ],
        ];

        foreach ($priorities as $priority) {
            DB::table('case_priorities')->insert(array_merge($priority, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
