<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCaseRequest;
use App\Http\Requests\UpdateCaseRequest;
use App\Services\ClientCaseService;
use App\Services\LogService;
use App\UseCases\Cases\StoreCaseUseCase;
use App\UseCases\Cases\UpdateCaseUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientCaseController extends Controller
{
    protected ClientCaseService $service;
    protected StoreCaseUseCase $storeCaseUseCase;
    protected UpdateCaseUseCase $updateCaseUseCase;
    protected LogService $logService;

    public function __construct(
        ClientCaseService $service,
        StoreCaseUseCase $storeCaseUseCase,
        UpdateCaseUseCase $updateCaseUseCase,
        LogService $logService,
    )
    {
        $this->service = $service;
        $this->storeCaseUseCase = $storeCaseUseCase;
        $this->updateCaseUseCase = $updateCaseUseCase;
        $this->logService = $logService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // クエリパラメータを取得
        $perPage = (int) $request->input('per_page', 10);
        $filters = [
            'name' => $request->input('name'),
            'client_name' => $request->input('client_name'),
            'status_id' => $request->input('status_id'),
            'priority_id' => $request->input('priority_id'),
            'start_date_from' => $request->input('start_date_from'),
            'start_date_to' => $request->input('start_date_to'),
        ];

        $result = $this->service->getUserCasesPaginated($user->id, $perPage, $filters);

        return response()->json($result);
    }

    public function show(int $id): JsonResponse
    {
        $case = $this->service->getCaseById($id);

        if (!$case) {
            return response()->json([
                'message' => 'Case not found',
            ], 404);
        }

        return response()->json($case);
    }

    public function store(StoreCaseRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $case = $this->storeCaseUseCase->execute($validated, $request->user()->id);

            $this->logService->recordFromRequest(
                $request,
                'case_created',
                '案件を作成しました',
                [
                    'case_id' => $case->id,
                    'name' => $case->name,
                ]
            );

            return response()->json([
                'message' => 'Case created successfully',
                'case' => $case,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Case creation failed', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => '案件の登録に失敗しました。入力内容を確認してください。',
            ], 500);
        }
    }

    public function update(UpdateCaseRequest $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validated();

            $success = $this->updateCaseUseCase->execute($id, $validated);

            if (!$success) {
                return response()->json([
                    'message' => '案件が見つかりません。',
                ], 404);
            }

            $this->logService->recordFromRequest(
                $request,
                'case_updated',
                '案件を更新しました',
                [
                    'case_id' => $id,
                    'name' => $validated['name'] ?? null,
                ]
            );

            return response()->json([
                'message' => 'Case updated successfully',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Case update failed', [
                'user_id' => $request->user()->id,
                'case_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => '案件の更新に失敗しました。入力内容を確認してください。',
            ], 500);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $success = $this->service->deleteCase($id);

        if (!$success) {
            return response()->json([
                'message' => 'Case not found',
            ], 404);
        }

        $this->logService->recordFromRequest(
            $request,
            'case_deleted',
            '案件を削除しました',
            ['case_id' => $id]
        );

        return response()->json([
            'message' => 'Case deleted successfully',
        ]);
    }

    public function statistics(Request $request): JsonResponse
    {
        $user = $request->user();
        $stats = $this->service->getUserStatistics($user->id);

        return response()->json($stats);
    }

    public function all(Request $request): JsonResponse
    {
        $user = $request->user();
        $cases = $this->service->getCasesByUserId($user->id);

        return response()->json($cases);
    }
}
