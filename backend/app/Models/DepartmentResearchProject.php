<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentResearchProject extends Model
{
    protected $table = 'department_research_project';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'title',
        'funding_agency',
        'amount',
        'start_date',
        'end_date',
        'coordinator_name',
        'sanctioned_letter',
        'updated_by',
        'preview',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
