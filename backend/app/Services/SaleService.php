<?php

namespace App\Services;

use App\Models\Sale;
use App\Repositories\SaleRepository;
use Illuminate\Database\Eloquent\Collection;

class SaleService
{

    protected SaleRepository $repository;

    public function __construct(SaleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getUserSales(int $userId): Collection
    {
        return $this->repository->getByUserId($userId);
    }

    public function getUserSalePaginated(int $userId, int $perPage, array $filters): array
    {
        return $this->repository->getPaginatedByUserId($userId, $perPage, $filters);
    }

    public function getSaleById(int $id): ?Sale{
        return $this->repository->findById($id);
    }

    public function deleteSale(int $id): bool{
        return $this->repository->delete($id);
    }

}