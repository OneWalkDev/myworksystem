<?php

namespace App\Repositories;

use App\Models\Sale;
use Illuminate\Support\Facades\Log;

class SaleRepository
{
    public function getByUserId(int $user_id)
    {
        return Sale::where("user_id", $user_id)
            ->with("user", "clientCase")
            ->orderBy("created_at", "desc")
            ->get();
    }

    public function getPaginatedByUserId(int $userId, int $perPage, array $filters): array
    {
        $query = Sale::where("user_id", $userId)
            ->with(["user", "clientCase"]);

        // フィルター適用
        if (!empty($filters['name'])) {
            $query->whereHas("clientCase", function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['name'] . '%');
            });
        }

        if (!empty($filters['sale_date_from'])) {
            $query->where('sale_date', '>=', $filters['sale_date_from']);
        }

        if (!empty($filters['sale_date_to'])) {
            $query->where('sale_date', '<=', $filters['sale_date_to']);
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

    public function findById(int $id): Sale
    {
        return Sale::with(["user", "clientCase"])->find($id);
    }

    public function delete(int $id): bool
    {
        $sale = Sale::find($id);
        if (!$sale) {
            return false;
        }

        return $sale->delete();
    }

}