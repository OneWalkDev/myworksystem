<?php

namespace App\UseCases\Sales;

use App\Models\Sale;
use App\Services\SaleService;
use Carbon\Carbon;

class StoreSaleUseCase
{
    public function __construct(
        private SaleService $saleService,
    ) {
    }

    /**
     * 売上登録ユースケース
     *
     * @param array $input validated data
     * @param int $userId authenticated user id
     * @return Sale
     */
    public function execute(array $input, int $userId): Sale
    {
        $payload = $input;
        $payload['user_id'] = $userId;

        // sale_date を基に年・月を補完
        $saleDate = Carbon::parse($payload['sale_date']);
        $payload['year'] = $saleDate->year;
        $payload['month'] = $saleDate->month;

        return $this->saleService->createSale($payload);
    }
}
