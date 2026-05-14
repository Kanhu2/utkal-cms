<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentAchievement extends Model
{
    protected $table = 'department_achievements';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'name',
        'regd_no',
        'guide',
        'date_of_award',
        'subject',
        'document',
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
