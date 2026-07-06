<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'lab_order_item_id', 'lab_test_parameter_id', 'value', 'unit_snapshot',
        'normal_range_snapshot', 'flag', 'amends_result_id', 'entered_by',
    ];

    public function labOrderItem(): BelongsTo
    {
        return $this->belongsTo(LabOrderItem::class);
    }

    public function labTestParameter(): BelongsTo
    {
        return $this->belongsTo(LabTestParameter::class);
    }

    public function amendsResult(): BelongsTo
    {
        return $this->belongsTo(self::class, 'amends_result_id');
    }

    public function enteredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entered_by');
    }
}
