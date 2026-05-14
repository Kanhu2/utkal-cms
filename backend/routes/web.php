<?php

use App\Http\Controllers\SwaggerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/docs', [SwaggerController::class, 'ui']);
Route::get('/openapi.json', [SwaggerController::class, 'spec']);
