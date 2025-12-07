<?php

namespace App\Repositories;

use App\Models\Sale;
use Carbon\Carbon;
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

    public function create(array $data): Sale
    {
        return Sale::create($data);
    }

    public function update(int $id, array $data): ?Sale{
        $sale = Sale::find($id);
        if(!$sale){
            return null;
        }

        $sale->update($data);

        return $sale->refresh();
    }

    /**
     * 指定した年月の売上集計を取得
     */
    public function getMonthlySummary(int $userId, int $year, int $month): array
    {
        $start = Carbon::create($year, $month, 1)->startOfDay();
        $end = (clone $start)->endOfMonth();

        $baseQuery = Sale::where("sales.user_id", $userId)
            ->whereBetween("sale_date", [$start->toDateString(), $end->toDateString()])
            ->where("is_paid", true);

        $totalAmount = (clone $baseQuery)->sum("total_amount");
        $taxAmount = (clone $baseQuery)->sum("tax_amount");
        $saleCount = (clone $baseQuery)->count();

        $caseBreakdown = (clone $baseQuery)
            ->leftJoin("cases", "sales.case_id", "=", "cases.id")
            ->selectRaw('sales.case_id, COALESCE(cases.name, "未設定案件") as case_name, SUM(sales.total_amount) as total_amount, COUNT(*) as sale_count')
            ->groupBy("sales.case_id", "cases.name")
            ->orderByDesc("total_amount")
            ->get()
            ->map(function ($row) use ($totalAmount) {
                $amount = (float) $row->total_amount;
                return [
                    "case_id" => $row->case_id,
                    "case_name" => $row->case_name,
                    "total_amount" => $amount,
                    "sale_count" => (int) $row->sale_count,
                    "ratio" => $totalAmount > 0 ? $amount / (float) $totalAmount : 0,
                ];
            })
            ->values()
            ->toArray();

        return [
            "period" => [
                "year" => $year,
                "month" => $month,
                "start_date" => $start->toDateString(),
                "end_date" => $end->toDateString(),
            ],
            "totals" => [
                "amount" => (float) $totalAmount,
                "tax_amount" => (float) $taxAmount,
                "count" => $saleCount,
            ],
            "case_breakdown" => $caseBreakdown,
        ];
    }

    /**
     * 指定した年の売上集計を取得
     */
    public function getYearlySummary(int $userId, int $year): array
    {
        $start = Carbon::create($year, 1, 1)->startOfDay();
        $end = (clone $start)->endOfYear();

        $baseQuery = Sale::where("sales.user_id", $userId)
            ->whereBetween("sale_date", [$start->toDateString(), $end->toDateString()])
            ->where("is_paid", true);

        $totalAmount = (clone $baseQuery)->sum("total_amount");
        $taxAmount = (clone $baseQuery)->sum("tax_amount");
        $saleCount = (clone $baseQuery)->count();

        $caseBreakdown = (clone $baseQuery)
            ->leftJoin("cases", "sales.case_id", "=", "cases.id")
            ->selectRaw('sales.case_id, COALESCE(cases.name, "未設定案件") as case_name, SUM(sales.total_amount) as total_amount, COUNT(*) as sale_count')
            ->groupBy("sales.case_id", "cases.name")
            ->orderByDesc("total_amount")
            ->get()
            ->map(function ($row) use ($totalAmount) {
                $amount = (float) $row->total_amount;
                return [
                    "case_id" => $row->case_id,
                    "case_name" => $row->case_name,
                    "total_amount" => $amount,
                    "sale_count" => (int) $row->sale_count,
                    "ratio" => $totalAmount > 0 ? $amount / (float) $totalAmount : 0,
                ];
            })
            ->values();

        $monthlyTotals = collect(range(1, 12))
            ->map(fn ($month) => [
                "month" => $month,
                "total_amount" => 0.0,
                "sale_count" => 0,
            ])
            ->keyBy("month");

        (clone $baseQuery)
            ->selectRaw("MONTH(sale_date) as month, SUM(total_amount) as total_amount, COUNT(*) as sale_count")
            ->groupByRaw("MONTH(sale_date)")
            ->orderBy("month")
            ->get()
            ->each(function ($row) use ($monthlyTotals) {
                $monthlyTotals[$row->month] = [
                    "month" => (int) $row->month,
                    "total_amount" => (float) $row->total_amount,
                    "sale_count" => (int) $row->sale_count,
                ];
            });

        return [
            "period" => [
                "year" => $year,
                "start_date" => $start->toDateString(),
                "end_date" => $end->toDateString(),
            ],
            "totals" => [
                "amount" => (float) $totalAmount,
                "tax_amount" => (float) $taxAmount,
                "count" => $saleCount,
            ],
            "case_breakdown" => $caseBreakdown->values()->toArray(),
            "monthly_totals" => $monthlyTotals->values()->toArray(),
        ];
    }

}
