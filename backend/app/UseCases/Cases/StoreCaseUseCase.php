<?php

namespace App\UseCases\Cases;

use App\Models\ClientCase;
use App\Services\ClientCaseService;

class StoreCaseUseCase
{
    public function __construct(
        private ClientCaseService $caseService,
    ) {
    }

    /**
     * 案件登録ユースケース
     *
     * @param array $input validated data
     * @param int $userId authenticated user id
     * @return ClientCase
     */
    public function execute(array $input, int $userId): ClientCase
    {
        $payload = $input;
        $payload['user_id'] = $userId;

        return $this->caseService->createCase($payload);
    }
}
