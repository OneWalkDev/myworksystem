<?php

namespace App\Repositories\Master;

use App\Models\Master\CaseStatus;
use Illuminate\Database\Eloquent\Collection;

class CaseStatusRepository
{
    public function getById(int $id): ?CaseStatus
    {
        return CaseStatus::find("id", $id);
    }

    public function getAll(): Collection
    {
        return CaseStatus::all();
    }
}