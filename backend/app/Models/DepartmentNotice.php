<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentNotice extends Model
{
    protected $table = 'department_notice';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'title',
        'category',
        'file',
        'link',
        'updated_by',
        'publish_date',
        'last_date',
        'preview',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
