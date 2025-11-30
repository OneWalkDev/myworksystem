<?php

namespace App\Repositories;

use App\Models\ClientCase;
use Illuminate\Database\Eloquent\Collection;

class ClientCaseRepository
{
    public function getByUserId(int $userId): Collection
    {
        return ClientCase::where("user_id", $userId)
            ->with(["status", "priority", "paymentType"])
            ->orderBy("created_at", "desc")
            ->get();
    }

    public function findById(int $id): ?ClientCase
    {
        return ClientCase::with(["status", "priority", "paymentType", "user"])
            ->find($id);
    }

    public function create(array $data): ClientCase
    {
        return ClientCase::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $case = ClientCase::find($id);
        if (!$case) {
            return false;
        }
        return $case->update($data);
    }

    public function delete(int $id): bool
    {
        $case = ClientCase::find($id);
        if (!$case) {
            return false;
        }
        return $case->delete();
    }

    public function getStatisticsByUserId(int $userId): array
    {
        $cases = ClientCase::where("user_id", $userId)->get();

        return [
            "total" => $cases->count(),
            "by_status" => $cases->groupBy("status_id")->map(fn($group) => $group->count())->toArray(),
            "in_progress" => $cases->whereIn("status_id", [3, 4])->count(),
            "completed" => $cases->where("status_id", 6)->count(),
        ];
    }
}
