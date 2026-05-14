<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentPublication extends Model
{
    protected $table = 'department_publication';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'publication_details',
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
