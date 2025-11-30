<?php

namespace App\Services\Master;

use App\Models\Master\CaseStatus;
use App\Repositories\Master\CaseStatusRepository;
use Illuminate\Database\Eloquent\Collection;

class CaseStatusService
{
    protected CaseStatusRepository $repository;

    public function __construct(CaseStatusRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getCaseStatusById(int $id): ?CaseStatus
    {
        return $this->repository->getById($id);
    }

    public function getCaseStatusAll(): Collection
    {
        return $this->repository->getAll();
    }
}