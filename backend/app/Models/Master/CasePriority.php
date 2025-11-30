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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority ordered()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority whereDisplayOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CasePriority whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class CasePriority extends Model
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
        return $this->hasMany(ClientCase::class, 'priority_id');
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
