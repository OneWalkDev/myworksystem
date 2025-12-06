<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSaleRequest;
use App\Services\SaleService;
use App\UseCases\Sales\StoreSaleUseCase;
use App\UseCases\Sales\UpdateSaleUseCase;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\StoreSaleRequest;

class SaleController extends Controller
{
    protected SaleService $service;
    protected StoreSaleUseCase $storeSaleUseCase;
    protected UpdateSaleUseCase $updateSaleUseCase;

    public function __construct(SaleService $service, StoreSaleUseCase $storeSaleUseCase, UpdateSaleUseCase $updateSaleUseCase)
    {
        $this->service = $service;
        $this->storeSaleUseCase = $storeSaleUseCase;
        $this->updateSaleUseCase = $updateSaleUseCase;
    }

    public function index(Request $request): JsonResponse
    {
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

    public function show(int $id): JsonResponse
    {
        $sale = $this->service->getSaleById($id);

        if (!$sale) {
            return response()->json([
                'message' => 'Sale not found',
            ], 404);
        }

        return response()->json($sale);
    }

    public function destroy(int $id): JsonResponse
    {
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

    public function store(StoreSaleRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $sale = $this->storeSaleUseCase->execute($validated, $request->user()->id);

            return response()->json([
                'message' => 'Sale created successfully',
                'sale' => $sale,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => '関連するデータが見つかりません。',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Sale creation failed', [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => '売上の登録に失敗しました。入力内容を確認してください。',
            ], 500);
        }
    }

    public function update(int $id, UpdateSaleRequest $request): JsonResponse{
        try {
            $validated = $request->validated();

            $sale = $this->updateSaleUseCase->execute($id, $validated);

            return response()->json([
                'message' => 'Sale Update successfully',
                'sale' => $sale,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => '関連するデータが見つかりません。',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Sale creation failed', [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => '売上の登録に失敗しました。入力内容を確認してください。',
            ], 500);
        }
    }

}
