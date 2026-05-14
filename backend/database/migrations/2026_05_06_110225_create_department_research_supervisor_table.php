<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('department_research_supervisor', function (Blueprint $table) {
            $table->collation = 'utf8mb4_unicode_ci';
            $table->charset = 'utf8mb4';

            $table->integer('id', true);
            $table->integer('department_id');
            $table->string('name', 255);
            $table->integer('intake');
            $table->text('file');
            $table->string('updated_by', 100);
            $table->string('create_date', 100);
            $table->string('updated_at', 30);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_research_supervisor');
    }
};
