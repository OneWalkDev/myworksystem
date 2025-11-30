<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * ユーザーをログインさせる
     *
     * @param string $email
     * @param string $password
     * @return array
     * @throws ValidationException
     */
    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['メールアドレスまたはパスワードが正しくありません'],
            ]);
        }

        // Sanctumトークンを生成
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'success' => true,
            'message' => 'ログインに成功しました',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
        ];
    }

    /**
     * ユーザーをログアウトさせる
     *
     * @param User $user
     * @return array
     */
    public function logout(User $user): array
    {
        // 現在のトークンを削除
        $user->currentAccessToken()->delete();

        return [
            'success' => true,
            'message' => 'ログアウトしました',
        ];
    }

    /**
     * 全てのトークンを削除
     *
     * @param User $user
     * @return array
     */
    public function logoutAll(User $user): array
    {
        // 全てのトークンを削除
        $user->tokens()->delete();

        return [
            'success' => true,
            'message' => '全てのデバイスからログアウトしました',
        ];
    }

    /**
     * ユーザー情報を取得
     *
     * @param User $user
     * @return array
     */
    public function getUserInfo(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
        ];
    }
}
