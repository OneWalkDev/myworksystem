<?php

namespace App\Repositories\Master;

use App\Models\Master\CasePriority;
use Illuminate\Database\Eloquent\Collection;

class CasePriorityRepository
{
    public function getById(int $id): ?CasePriority
    {
        return CasePriority::find("id", $id);
    }

    public function getAll(): Collection
    {
        return CasePriority::all();
    }
}