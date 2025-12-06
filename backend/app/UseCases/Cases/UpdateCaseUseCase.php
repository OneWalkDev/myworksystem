<?php

namespace App\UseCases\Cases;

use App\Services\ClientCaseService;

class UpdateCaseUseCase
{
    public function __construct(
        private ClientCaseService $caseService,
    ) {
    }

    /**
     * 案件更新ユースケース
     *
     * @param int $caseId target case id
     * @param array $input validated data
     * @return bool
     */
    public function execute(int $caseId, array $input): bool
    {
        return $this->caseService->updateCase($caseId, $input);
    }
}
