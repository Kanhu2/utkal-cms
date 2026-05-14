<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\TenderController;
use App\Http\Controllers\NewsEventsController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\IlmsController;
use App\Http\Controllers\ResearchProjectController;
use App\Http\Controllers\WorkshopSeminarController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\ResearchScholarsController;
use App\Http\Controllers\ResearchSupervisorsController;
use Illuminate\Support\Facades\Route;

Route::post('/create_admin', [AuthController::class, 'createAdmin']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/users', [AuthController::class, 'users']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);

Route::middleware('jwt.auth')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/notices', [NoticeController::class, 'index']);
    Route::post('/add-notice', [NoticeController::class, 'store']);
    Route::get('/tenders', [TenderController::class, 'index']);
    Route::post('/add-tender', [TenderController::class, 'store']);
    Route::get('/news-events', [NewsEventsController::class, 'index']);
    Route::post('/add-news-events', [NewsEventsController::class, 'store']);
    Route::get('/publications', [PublicationController::class, 'index']);
    Route::post('/add-publication', [PublicationController::class, 'store']);
    Route::get('/ilms', [IlmsController::class, 'index']);
    Route::post('/add-ilms', [IlmsController::class, 'store']);
    Route::get('/research-projects', [ResearchProjectController::class, 'index']);
    Route::post('/add-research-project', [ResearchProjectController::class, 'store']);
    Route::get('/workshop-seminars', [WorkshopSeminarController::class, 'index']);
    Route::post('/add-workshop-seminar', [WorkshopSeminarController::class, 'store']);
    Route::get('/achievements', [AchievementController::class, 'index']);
    Route::post('/add-achievement', [AchievementController::class, 'store']);
    Route::get('/research-scholars', [ResearchScholarsController::class, 'index']);
    Route::post('/add-research-scholar', [ResearchScholarsController::class, 'store']);
    Route::get('/research-supervisors', [ResearchSupervisorsController::class, 'index']);
    Route::post('/add-research-supervisor', [ResearchSupervisorsController::class, 'store']);
});
