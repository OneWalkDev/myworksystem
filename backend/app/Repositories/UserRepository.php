<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    /**
     * メールアドレスでユーザーを検索
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * IDでユーザーを検索
     *
     * @param int $id
     * @return User|null
     */
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    /**
     * 新しいユーザーを作成
     *
     * @param array $data
     * @return User
     */
    public function create(array $data): User
    {
        return User::create($data);
    }

    /**
     * ユーザーを更新
     *
     * @param User $user
     * @param array $data
     * @return bool
     */
    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    /**
     * 全ユーザーを取得
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return User::all();
    }

    /**
     * ユーザーを削除
     *
     * @param User $user
     * @return bool|null
     */
    public function delete(User $user): ?bool
    {
        return $user->delete();
    }
}
