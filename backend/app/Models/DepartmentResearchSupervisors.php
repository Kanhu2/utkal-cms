<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentResearchSupervisors extends Model
{
    protected $table = 'department_research_supervisor';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'name',
        'email',
        'intake',
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
