<?php

namespace App\Services;

use App\Models\Log;
use Illuminate\Http\Request;

class LogService
{
    public function record(
        int $userId,
        string $action,
        ?string $description = null,
        array $meta = [],
        ?string $ipAddress = null
    ): Log {
        return Log::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'meta' => empty($meta) ? null : $meta,
            'ip_address' => $ipAddress,
        ]);
    }

    public function recordFromRequest(
        Request $request,
        string $action,
        ?string $description = null,
        array $meta = []
    ): Log {
        $userId = $request->user()?->id ?? 0;
        $ip = $request->ip();

        return $this->record($userId, $action, $description, $meta, $ip);
    }

    public function getRecentLogs(int $userId, int $limit = 20)
    {
        return Log::where('user_id', $userId)
            ->latest()
            ->limit($limit)
            ->get();
    }
}
