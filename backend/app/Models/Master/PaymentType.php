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
 * @property string|null $description 説明
 * @property bool $is_active 有効/無効
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, ClientCase> $cases
 * @property-read int|null $cases_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType ordered()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType whereDisplayOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentType whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PaymentType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_order',
        'description',
        'is_active',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function cases(): HasMany
    {
        return $this->hasMany(ClientCase::class, 'payment_type_id');
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
