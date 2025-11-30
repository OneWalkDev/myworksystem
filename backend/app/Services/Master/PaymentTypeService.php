<?php

namespace App\Services\Master;

use App\Models\Master\PaymentType;
use App\Repositories\Master\PaymentTypeRepository;
use Illuminate\Database\Eloquent\Collection;

class PaymentTypeService
{
    protected PaymentTypeRepository $repository;

    public function __construct(PaymentTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getPaymentTypeById(int $id): ?PaymentType
    {
        return $this->repository->getById($id);
    }

    public function getPaymentTypeAll(): Collection
    {
        return $this->repository->getAll();
    }
}