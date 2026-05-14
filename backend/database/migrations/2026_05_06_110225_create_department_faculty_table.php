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
        Schema::create('department_faculty', function (Blueprint $table) {
            $table->collation = 'utf8mb4_unicode_ci';
            $table->charset = 'utf8mb4';

            $table->integer('id', true);
            $table->integer('department_id');
            $table->string('name');
            $table->string('designation');
            $table->string('email');
            $table->string('phone', 30);
            $table->string('orcid_link');
            $table->text('qualification');
            $table->text('office_address');
            $table->string('room_no');
            $table->string('webpage_link');
            $table->string('image');
            $table->string('bio_sketch');
            $table->string('updated_by');
            $table->string('created_date', 30);
            $table->string('updated_at', 30);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_faculty');
    }
};
