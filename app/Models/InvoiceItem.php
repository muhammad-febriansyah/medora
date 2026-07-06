<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id', 'category', 'item_name_snapshot', 'unit_price_snapshot',
        'quantity', 'line_total', 'reference_type', 'reference_id',
    ];

    protected $casts = [
        'unit_price_snapshot' => 'integer',
        'quantity' => 'integer',
        'line_total' => 'integer',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
