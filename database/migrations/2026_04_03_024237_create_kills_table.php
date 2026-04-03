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
            $table->boolean('approved')->default(false);
            $table->boolean('contested')->default(false);
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
