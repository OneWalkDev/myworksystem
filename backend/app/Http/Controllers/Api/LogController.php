<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function __construct(protected LogService $logService)
    {
    }

    public function recent(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 10);
        $user = $request->user();
        $logs = $this->logService->getRecentLogs($user->id, max(1, min($limit, 50)));

        return response()->json([
            'data' => $logs,
        ]);
    }
}
