<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kills', function (Blueprint $table): void {
            $table->text('contest_reason')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('kills', function (Blueprint $table): void {
            $table->string('contest_reason')->nullable()->change();
        });
    }
};
