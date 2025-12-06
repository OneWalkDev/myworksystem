<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientCaseController;
use App\Http\Controllers\Api\Master\CasePriorityController;
use App\Http\Controllers\Api\Master\CaseStatusController;
use App\Http\Controllers\Api\Master\PaymentTypeController;
use App\Http\Controllers\Api\SaleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ヘルスチェック用のエンドポイント
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// 認証不要のルート
Route::post('/login', [AuthController::class, 'login']);

// 認証が必要なルート
Route::middleware('auth:sanctum')->group(function () {
    // 認証関連
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('/me', [AuthController::class, 'me']);

    // レガシーエンドポイント（互換性のため残す）
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/dashboard', function (Request $request) {
        return response()->json([
            'message' => 'ダッシュボードへようこそ',
            'user' => $request->user(),
            'stats' => [
                'total_users' => 150,
                'active_sessions' => 42,
                'pending_tasks' => 7,
            ],
        ]);
    });

    // 案件管理
    Route::get('/cases/statistics', [ClientCaseController::class, 'statistics']);
    Route::get('/cases/priority', [CasePriorityController::class, 'index']);
    Route::get('/cases/status', [CaseStatusController::class, 'index']);
    Route::get('/cases/payment-type', [PaymentTypeController::class, 'index']);
    Route::get('/cases/all', [ClientCaseController::class, "all"]);
    Route::apiResource('cases', ClientCaseController::class);

    // 売上管理
    Route::apiResource('sales', SaleController::class);
});
