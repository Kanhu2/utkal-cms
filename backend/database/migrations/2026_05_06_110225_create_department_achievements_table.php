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
        Schema::create('department_achievements', function (Blueprint $table) {
            $table->collation = 'utf8mb4_unicode_ci';
            $table->charset = 'utf8mb4';

            $table->integer('id', true);
            $table->integer('department_id');
            $table->string('name');
            $table->string('regd_no');
            $table->string('guide');
            $table->string('date_of_award', 30);
            $table->string('subject');
            $table->string('document');
            $table->string('updated_by');
            $table->string('create_date', 30);
            $table->string('updated_at', 30);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_achievements');
    }
};
