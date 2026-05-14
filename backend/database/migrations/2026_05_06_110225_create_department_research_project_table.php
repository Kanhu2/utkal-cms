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
        Schema::create('department_research_project', function (Blueprint $table) {
            $table->collation = 'utf8mb4_unicode_ci';
            $table->charset = 'utf8mb4';

            $table->integer('id', true);
            $table->integer('department_id');
            $table->text('title');
            $table->string('funding_agency', 100);
            $table->string('amount');
            $table->string('start_date', 30);
            $table->string('end_date', 30);
            $table->string('coordinator_name');
            $table->string('sanctioned_letter');
            $table->string('updated_by', 100);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_research_project');
    }
};
