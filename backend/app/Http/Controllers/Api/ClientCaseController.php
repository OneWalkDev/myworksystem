<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ClientCaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientCaseController extends Controller
{
    protected ClientCaseService $service;

    public function __construct(ClientCaseService $service)
    {
        $this->service = $service;
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

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'client_name' => 'nullable|string|max:255',
                'client_email' => 'nullable|email|max:255',
                'client_phone' => 'nullable|string|max:255',
                'client_company' => 'nullable|string|max:255',
                'budget' => 'nullable|numeric',
                'actual_amount' => 'nullable|numeric',
                'payment_type_id' => 'nullable|exists:payment_types,id',
                'hourly_rate' => 'nullable|numeric',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'actual_start_date' => 'nullable|date',
                'actual_end_date' => 'nullable|date',
                'status_id' => 'nullable|exists:case_statuses,id',
                'priority_id' => 'nullable|exists:case_priorities,id',
                'tech_stack' => 'nullable|array',
                'tags' => 'nullable|array',
                'notes' => 'nullable|string',
                'contract_file_path' => 'nullable|string',
            ]);

            $validated['user_id'] = $request->user()->id;
            $case = $this->service->createCase($validated);

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

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'client_name' => 'nullable|string|max:255',
                'client_email' => 'nullable|email|max:255',
                'client_phone' => 'nullable|string|max:255',
                'client_company' => 'nullable|string|max:255',
                'budget' => 'nullable|numeric|max:99999999',
                'actual_amount' => 'nullable|numeric|max:99999999',
                'payment_type_id' => 'nullable|exists:payment_types,id',
                'hourly_rate' => 'nullable|numeric|max:99999999',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'actual_start_date' => 'nullable|date',
                'actual_end_date' => 'nullable|date',
                'status_id' => 'nullable|exists:case_statuses,id',
                'priority_id' => 'nullable|exists:case_priorities,id',
                'tech_stack' => 'nullable|array',
                'tags' => 'nullable|array',
                'notes' => 'nullable|string',
                'contract_file_path' => 'nullable|string',
            ]);

            $success = $this->service->updateCase($id, $validated);

            if (!$success) {
                return response()->json([
                    'message' => '案件が見つかりません。',
                ], 404);
            }

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

    public function destroy(int $id): JsonResponse
    {
        $success = $this->service->deleteCase($id);

        if (!$success) {
            return response()->json([
                'message' => 'Case not found',
            ], 404);
        }

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
}
