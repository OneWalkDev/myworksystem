<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SaleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    protected SaleService $service;

    public function __construct(SaleService $service){
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse{
      $user = $request->user();

        // クエリパラメータを取得
        $perPage = (int) $request->input('per_page', 10);
        $filters = [
            'name' => $request->input('name'),
            'sale_date_from' => $request->input('sale_date_from'),
            'sale_date_to' => $request->input('sale_date_to'),
        ];

        $result = $this->service->getUserSalePaginated($user->id, $perPage, $filters);

        return response()->json($result);
    }

    public function show(int $id): JsonResponse{
        $sale = $this->service->getSaleById($id);

        if (!$sale) {
            return response()->json([
                'message' => 'Sale not found',
            ], 404);
        }

        return response()->json($sale);
    }

        public function destroy(int $id): JsonResponse{
        $success = $this->service->deleteSale($id);

        if (!$success) {
            return response()->json([
                'message' => 'Sale not found',
            ], 404);
        }

        return response()->json([
            'message' => 'Sale deleted successfully',
        ]);
    }

}
