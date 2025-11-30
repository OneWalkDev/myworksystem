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
        Schema::create('case_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->comment('表示名');
            $table->integer('display_order')->default(0)->comment('表示順序');
            $table->string('color', 20)->nullable()->comment('UI表示用カラーコード');
            $table->text('description')->nullable()->comment('説明');
            $table->boolean('is_active')->default(true)->comment('有効/無効');
            $table->timestamps();

            // インデックス
            $table->index('is_active');
            $table->index('display_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_statuses');
    }
};
