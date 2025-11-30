<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * ログイン
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            $result = $this->authService->login(
                $request->input('email'),
                $request->input('password')
            );

            return response()->json($result);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'ログインに失敗しました',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * ログアウト
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $result = $this->authService->logout($request->user());

        return response()->json($result);
    }

    /**
     * 全てのデバイスからログアウト
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $result = $this->authService->logoutAll($request->user());

        return response()->json($result);
    }

    /**
     * 認証済みユーザー情報を取得
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        $userInfo = $this->authService->getUserInfo($request->user());

        return response()->json([
            'success' => true,
            'user' => $userInfo,
        ]);
    }
}
