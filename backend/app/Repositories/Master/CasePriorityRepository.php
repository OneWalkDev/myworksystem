<?php

namespace App\Repositories\Master;

use App\Models\Master\CasePriority;
use Illuminate\Database\Eloquent\Collection;

class CasePriorityRepository
{
    public function getById(int $id): ?CasePriority
    {
        return CasePriority::find($id);
    }

    public function getAll(): Collection
    {
        return CasePriority::active()->ordered()->get();
    }
}