<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentWorkshopSeminar extends Model
{
    protected $table = 'department_workshop_seminar';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'name',
        'participants',
        'photo',
        'broucher',
        'updated_by',
        'start_date',
        'end_date',
        'preview',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
