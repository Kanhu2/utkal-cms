<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentTender extends Model
{
    protected $table = 'department_tender';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'title',
        'file',
        'link',
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
