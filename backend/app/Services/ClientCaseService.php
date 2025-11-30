<?php

namespace App\Services;

use App\Repositories\ClientCaseRepository;
use App\Models\ClientCase;
use Illuminate\Database\Eloquent\Collection;

class ClientCaseService
{
    protected ClientCaseRepository $repository;

    public function __construct(ClientCaseRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getUserCases(int $userId): Collection
    {
        return $this->repository->getByUserId($userId);
    }

    public function getCaseById(int $id): ?ClientCase
    {
        return $this->repository->findById($id);
    }

    public function createCase(array $data): ClientCase
    {
        return $this->repository->create($data);
    }

    public function updateCase(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    public function deleteCase(int $id): bool
    {
        return $this->repository->delete($id);
    }

    public function getUserStatistics(int $userId): array
    {
        return $this->repository->getStatisticsByUserId($userId);
    }
}
