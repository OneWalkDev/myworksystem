<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $user_id ユーザーID
 * @property int $case_id 案件ID
 * @property string $sale_date 売上日（通常は月末日）
 * @property int $year 年
 * @property int $month 月
 * @property string $amount 売上金額（円）
 * @property string|null $tax_amount 消費税額（円）
 * @property string $total_amount 合計金額（税込）
 * @property string|null $working_hours 稼働時間（時間）
 * @property string|null $hourly_rate 時給（その月の時給）
 * @property string|null $payment_due_date 支払期日
 * @property string|null $payment_date 実際の入金日
 * @property int $is_paid 入金済みフラグ
 * @property string|null $notes 備考
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereCaseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereHourlyRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereIsPaid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale wherePaymentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale wherePaymentDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereSaleDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereWorkingHours($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale whereYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sale withoutTrashed()
 * @mixin \Eloquent
 */
class Sale extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sales';

    protected $fillable = [
        "user_id",
        "case_id",
        "sale_date",
        "year",
        "month",
        "amount",
        "tax_amount",
        "total_amount",
        "working_hours",
        "hourly_rate",
        "payment_due_date",
        "payment_date",
        "is_paid",
        "notes"
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function clientCase():BelongsTo
    {
        return $this->belongsTo(ClientCase::class, "case_id");
    }

}
