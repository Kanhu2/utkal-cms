<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepartmentNewsEvents extends Model
{
    protected $table = 'department_news_events';

    public $timestamps = false;

    protected $fillable = [
        'department_id',
        'title',
        'file',
        'link',
        'image',
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
