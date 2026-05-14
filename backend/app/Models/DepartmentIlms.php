<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentIlms extends Model
{
    protected $table = 'department_ilms';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'title',
        'description',
        'file',
        'updated_by',
        'create_date',
        'updated_at',
        'preview',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
