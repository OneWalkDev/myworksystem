<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentTypes = [
            [
                'name' => '時給',
                'display_order' => 1,
                'description' => '実働時間に応じて報酬を計算する形態',
                'is_active' => true,
            ],
            [
                'name' => '固定報酬',
                'display_order' => 2,
                'description' => 'プロジェクト全体で固定金額の報酬形態',
                'is_active' => true,
            ],
            [
                'name' => '月額',
                'display_order' => 3,
                'description' => '月単位で固定報酬を受け取る形態',
                'is_active' => true,
            ],
        ];

        foreach ($paymentTypes as $paymentType) {
            DB::table('payment_types')->insert(array_merge($paymentType, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
