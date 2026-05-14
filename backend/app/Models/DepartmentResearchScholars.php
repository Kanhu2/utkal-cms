<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentResearchScholars extends Model
{
    protected $table = 'department_research_scholar';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'name',
        'email',
        'mentor_name',
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
