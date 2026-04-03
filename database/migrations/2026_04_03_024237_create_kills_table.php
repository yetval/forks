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
        Schema::create('kills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('killer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('victim_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('victim_prev_target_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->boolean('approved')->default(false);
            $table->boolean('is_ffa')->default(false);
            $table->boolean('contested')->default(false);
            $table->string('contest_reason')->nullable()->after('contested');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kills');
    }
};
