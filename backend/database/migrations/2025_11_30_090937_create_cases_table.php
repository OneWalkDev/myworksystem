<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();

            // ユーザー関連
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // 基本情報
            $table->string('name'); // 案件名
            $table->text('description')->nullable(); // 案件の詳細説明

            // クライアント情報
            $table->string('client_name')->nullable(); // クライアント名
            $table->string('client_email')->nullable(); // クライアントメール
            $table->string('client_phone')->nullable(); // クライアント電話番号
            $table->string('client_company')->nullable(); // クライアント会社名

            // 契約・金額情報
            $table->decimal('budget', 12, 2)->nullable()->comment('予算（円）');
            $table->decimal('actual_amount', 12, 2)->nullable()->comment('実際の金額');
            $table->foreignId('payment_type_id')->nullable()->comment('支払いタイプ');
            $table->foreign('payment_type_id')->references('id')->on('payment_types')->onDelete('restrict');
            $table->decimal('hourly_rate', 10, 2)->nullable()->comment('時給');

            // 稼働時間
            $table->decimal('min_working_hours', 8, 2)->nullable()->comment('最低稼働時間（時間/月）');
            $table->decimal('max_working_hours', 8, 2)->nullable()->comment('最高稼働時間（時間/月）');

            // 期間
            $table->date('start_date')->nullable(); // 開始日
            $table->date('end_date')->nullable(); // 終了日
            $table->date('actual_start_date')->nullable(); // 実際の開始日
            $table->date('actual_end_date')->nullable(); // 実際の終了日

            // ステータス管理（マスターテーブル参照）
            $table->foreignId('status_id')->nullable()->comment('案件ステータス');
            $table->foreign('status_id')->references('id')->on('case_statuses')->onDelete('restrict');
            $table->foreignId('priority_id')->nullable()->comment('優先度');
            $table->foreign('priority_id')->references('id')->on('case_priorities')->onDelete('restrict');

            // メモ・その他
            $table->text('notes')->nullable(); // メモ
            $table->string('contract_file_path')->nullable(); // 契約書ファイルパス

            // ソフトデリート（削除したデータも保持）
            $table->softDeletes();

            $table->timestamps();

            // インデックス（検索高速化）
            $table->index('user_id');
            $table->index('status_id');
            $table->index('priority_id');
            $table->index('payment_type_id');
            $table->index('start_date');
            $table->index('client_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
