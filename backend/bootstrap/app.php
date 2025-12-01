<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // API用のグローバルエラーハンドラー
        $exceptions->render(function (Throwable $e, $request) {
            // API リクエストの場合のみ
            if ($request->is('api/*')) {
                // バリデーションエラーはそのまま返す
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'message' => 'バリデーションエラーが発生しました。',
                        'errors' => $e->errors(),
                    ], 422);
                }

                // 認証エラー
                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    return response()->json([
                        'message' => '認証が必要です。',
                    ], 401);
                }

                // 認可エラー
                if ($e instanceof \Illuminate\Auth\Access\AuthorizationException) {
                    return response()->json([
                        'message' => 'この操作を実行する権限がありません。',
                    ], 403);
                }

                // NotFoundエラー
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    return response()->json([
                        'message' => 'リソースが見つかりません。',
                    ], 404);
                }

                // データベースエラー
                if ($e instanceof \Illuminate\Database\QueryException) {
                    \Log::error('Database error', [
                        'error' => $e->getMessage(),
                        'sql' => $e->getSql(),
                    ]);

                    return response()->json([
                        'message' => 'データベースエラーが発生しました。管理者にお問い合わせください。',
                    ], 500);
                }

                // その他のエラー（本番環境では詳細を隠す）
                \Log::error('Unhandled exception', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                // 本番環境では詳細を隠す
                if (app()->environment('production')) {
                    return response()->json([
                        'message' => 'サーバーエラーが発生しました。しばらく経ってから再度お試しください。',
                    ], 500);
                }

                // 開発環境では詳細を表示
                return response()->json([
                    'message' => $e->getMessage(),
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTrace(),
                ], 500);
            }
        });
    })->create();
