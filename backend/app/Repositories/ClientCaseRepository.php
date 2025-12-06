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

    public function getPaginatedByUserId(int $userId, int $perPage, array $filters): array
    {
        $query = ClientCase::where("user_id", $userId)
            ->with(["status", "priority", "paymentType"]);

        // フィルター適用
        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (!empty($filters['client_name'])) {
            $query->where('client_name', 'like', '%' . $filters['client_name'] . '%');
        }

        if (!empty($filters['status_id'])) {
            $query->where('status_id', $filters['status_id']);
        }

        if (!empty($filters['priority_id'])) {
            $query->where('priority_id', $filters['priority_id']);
        }

        if (!empty($filters['start_date_from'])) {
            $query->where('start_date', '>=', $filters['start_date_from']);
        }

        if (!empty($filters['start_date_to'])) {
            $query->where('start_date', '<=', $filters['start_date_to']);
        }

        $query->orderBy("created_at", "desc");

        $paginated = $query->paginate($perPage);

        return [
            'data' => $paginated->items(),
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'per_page' => $paginated->perPage(),
            'total' => $paginated->total(),
            'from' => $paginated->firstItem(),
            'to' => $paginated->lastItem(),
        ];
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

    public function getCasesByUserId(int $userId): Collection
    {
        $cases = ClientCase::where("user_id", $userId)->get();

        return $cases;
    }
}
