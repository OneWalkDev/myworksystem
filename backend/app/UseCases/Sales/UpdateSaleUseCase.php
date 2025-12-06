<?php

namespace App\UseCases\Sales;

use App\Models\Sale;
use App\Services\SaleService;
use Carbon\Carbon;

class UpdateSaleUseCase
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
    public function execute(int $saleId, array $input): bool
    {

        $payload = $input;
        // sale_date を基に年・月を補完
        $saleDate = Carbon::parse($payload['sale_date']);
        $payload['year'] = $saleDate->year;
        $payload['month'] = $saleDate->month;

        return $this->saleService->updateSale($saleId, $payload);
    }
}
