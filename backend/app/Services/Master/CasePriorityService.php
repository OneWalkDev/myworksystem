<?php

namespace App\Services\Master;

use App\Models\Master\CasePriority;
use App\Repositories\Master\CasePriorityRepository;
use Illuminate\Database\Eloquent\Collection;

class CasePriorityService
{

    protected CasePriorityRepository $repository;

    public function __construct(CasePriorityRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getCasePriorityById(int $id): ?CasePriority
    {
        return $this->repository->getById($id);
    }

    public function getCasePriorityAll(): Collection
    {
        return $this->repository->getAll();
    }

}