<?php

namespace App\Repositories\Master;

use App\Models\Master\PaymentType;
use Illuminate\Database\Eloquent\Collection;

class PaymentTypeRepository
{
    public function getById(int $id): ?PaymentType
    {
        return PaymentType::find("id", $id);
    }

    public function getAll(): Collection
    {
        return PaymentType::all();
    }
}