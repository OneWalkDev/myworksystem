<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\ClientCase;

/**
 * @property int $id
 * @property string $name 表示名
 * @property int $display_order 表示順序
 * @property string|null $color UI表示用カラーコード
 * @property string|null $description 説明
 * @property bool $is_active 有効/無効
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, ClientCase> $cases
 * @property-read int|null $cases_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus ordered()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus whereDisplayOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CaseStatus whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class CaseStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_order',
        'color',
        'description',
        'is_active',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function cases(): HasMany
    {
        return $this->hasMany(ClientCase::class, 'status_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
