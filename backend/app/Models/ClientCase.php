<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Master\CaseStatus;
use App\Models\Master\CasePriority;
use App\Models\Master\PaymentType;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $description
 * @property string|null $client_name
 * @property string|null $client_email
 * @property string|null $client_phone
 * @property string|null $client_company
 * @property numeric|null $budget 予算（円）
 * @property numeric|null $actual_amount 実際の金額
 * @property int|null $payment_type_id 支払いタイプ
 * @property numeric|null $hourly_rate 時給
 * @property string|null $min_working_hours 最低稼働時間（時間/月）
 * @property string|null $max_working_hours 最高稼働時間（時間/月）
 * @property \Illuminate\Support\Carbon|null $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property \Illuminate\Support\Carbon|null $actual_start_date
 * @property \Illuminate\Support\Carbon|null $actual_end_date
 * @property int|null $status_id 案件ステータス
 * @property int|null $priority_id 優先度
 * @property string|null $notes
 * @property string|null $contract_file_path
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read PaymentType|null $paymentType
 * @property-read CasePriority|null $priority
 * @property-read CaseStatus|null $status
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase byPriority(int $priorityId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase byStatus(int $statusId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase inProgress()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereActualAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereActualEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereActualStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereBudget($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereClientCompany($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereClientEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereClientName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereClientPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereContractFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereHourlyRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereMaxWorkingHours($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereMinWorkingHours($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase wherePaymentTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase wherePriorityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ClientCase withoutTrashed()
 * @mixin \Eloquent
 */
class ClientCase extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'cases';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'client_name',
        'client_email',
        'client_phone',
        'client_company',
        'budget',
        'actual_amount',
        'payment_type_id',
        'hourly_rate',
        'start_date',
        'end_date',
        'actual_start_date',
        'actual_end_date',
        'status_id',
        'priority_id',
        'tech_stack',
        'tags',
        'notes',
        'contract_file_path',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'actual_amount' => 'decimal:2',
        'hourly_rate' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'actual_start_date' => 'date',
        'actual_end_date' => 'date',
        'tech_stack' => 'array',
        'tags' => 'array',
        'is_active' => 'boolean',
    ];

    // リレーション

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(CaseStatus::class, 'status_id');
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(CasePriority::class, 'priority_id');
    }

    public function paymentType(): BelongsTo
    {
        return $this->belongsTo(PaymentType::class, 'payment_type_id');
    }

    /**
     * 関連する売上（ソフトデリート含む）
     */
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class, 'case_id');
    }

    protected static function booted(): void
    {
        // 案件を削除したら関連する売上もソフトデリート
        static::deleting(function (ClientCase $case) {
            if ($case->isForceDeleting()) {
                $case->sales()->withTrashed()->forceDelete();
            } else {
                $case->sales()->delete();
            }
        });

        // 案件を復元したら売上も復元
        static::restoring(function (ClientCase $case) {
            $case->sales()->withTrashed()->restore();
        });
    }

    // スコープ

    public function scopeActive($query)
    {
        return $query->whereHas('status', function ($q) {
            $q->where('is_active', true);
        });
    }

    public function scopeByStatus($query, int $statusId)
    {
        return $query->where('status_id', $statusId);
    }

    public function scopeByPriority($query, int $priorityId)
    {
        return $query->where('priority_id', $priorityId);
    }

    public function scopeInProgress($query)
    {
        return $query->whereHas('status', function ($q) {
            $q->where('name', '進行中');
        });
    }

    public function scopeCompleted($query)
    {
        return $query->whereHas('status', function ($q) {
            $q->where('name', '完了');
        });
    }
}
