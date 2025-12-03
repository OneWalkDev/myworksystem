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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            
            //ユーザー関連
            $table->foreignId('user_id')->comment('ユーザーID');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // 案件関連
            $table->foreignId('case_id')->comment('案件ID');
            $table->foreign('case_id')->references('id')->on('cases')->onDelete('cascade');

            // 売上期間
            $table->date('sale_date')->comment('売上日（通常は月末日）');
            $table->integer('year')->comment('年');
            $table->integer('month')->comment('月');

            // 売上金額
            $table->decimal('amount', 12, 2)->comment('売上金額（円）');
            $table->decimal('tax_amount', 12, 2)->nullable()->comment('消費税額（円）');
            $table->decimal('total_amount', 12, 2)->comment('合計金額（税込）');

            // 稼働情報
            $table->decimal('working_hours', 8, 2)->nullable()->comment('稼働時間（時間）');
            $table->decimal('hourly_rate', 10, 2)->nullable()->comment('時給（その月の時給）');

            // 支払い情報
            $table->date('payment_due_date')->nullable()->comment('支払期日');
            $table->date('payment_date')->nullable()->comment('実際の入金日');
            $table->boolean('is_paid')->default(false)->comment('入金済みフラグ');

            // メモ
            $table->text('notes')->nullable()->comment('備考');

            // ソフトデリート
            $table->softDeletes();

            $table->timestamps();

            // インデックス（検索高速化）
            $table->index('case_id');
            $table->index('sale_date');
            $table->index(['year', 'month']);
            $table->index('is_paid');
            $table->index('payment_due_date');

            // ユニーク制約（同じ案件の同じ月の売上は1件のみ）
            $table->unique(['case_id', 'year', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
