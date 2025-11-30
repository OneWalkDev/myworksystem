<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // マスターテーブル（先に実行）
            CaseStatusSeeder::class,
            CasePrioritySeeder::class,
            PaymentTypeSeeder::class,

            // ユーザーデータ
            UserSeeder::class,
        ]);
    }
}
