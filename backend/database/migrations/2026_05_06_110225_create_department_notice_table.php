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
        Schema::create('department_notice', function (Blueprint $table) {
            $table->collation = 'utf8mb4_unicode_ci';
            $table->charset = 'utf8mb4';

            $table->integer('id', true);
            $table->integer('department_id');
            $table->text('title');
            $table->string('category', 100);
            $table->text('file')->nullable();
            $table->text('link')->nullable();
            $table->string('updated_by', 100);
            $table->string('publish_date', 100);
            $table->string('last_date', 100);
            $table->string('preview', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_notice');
    }
};
