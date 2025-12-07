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

    public function createSale(array $data): Sale
    {
        return $this->repository->create($data);
    }

    public function updateSale(int $id, array $data): ?Sale{
        return $this->repository->update($id, $data);
    }

    public function getMonthlySummary(int $userId, int $year, int $month): array
    {
        return $this->repository->getMonthlySummary($userId, $year, $month);
    }

    public function getYearlySummary(int $userId, int $year): array
    {
        return $this->repository->getYearlySummary($userId, $year);
    }

}
