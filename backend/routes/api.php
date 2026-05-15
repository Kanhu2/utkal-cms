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
    Route::post('/edit-notice/{id}', [NoticeController::class, 'update']);
    Route::delete('/delete-notice/{id}', [NoticeController::class, 'destroy']);
    Route::get('/tenders', [TenderController::class, 'index']);
    Route::post('/add-tender', [TenderController::class, 'store']);
    Route::post('/edit-tender/{id}', [TenderController::class, 'update']);
    Route::delete('/delete-tender/{id}', [TenderController::class, 'destroy']);
    Route::get('/news-events', [NewsEventsController::class, 'index']);
    Route::post('/add-news-events', [NewsEventsController::class, 'store']);
    Route::post('/edit-news-events/{id}', [NewsEventsController::class, 'update']);
    Route::delete('/delete-news-events/{id}', [NewsEventsController::class, 'destroy']);
    Route::get('/publications', [PublicationController::class, 'index']);
    Route::post('/add-publication', [PublicationController::class, 'store']);
    Route::post('/edit-publication/{id}', [PublicationController::class, 'update']);
    Route::delete('/delete-publication/{id}', [PublicationController::class, 'destroy']);
    Route::get('/ilms', [IlmsController::class, 'index']);
    Route::post('/add-ilms', [IlmsController::class, 'store']);
    Route::post('/edit-ilms/{id}', [IlmsController::class, 'update']);
    Route::delete('/delete-ilms/{id}', [IlmsController::class, 'destroy']);
    Route::get('/research-projects', [ResearchProjectController::class, 'index']);
    Route::post('/add-research-project', [ResearchProjectController::class, 'store']);
    Route::post('/edit-research-project/{id}', [ResearchProjectController::class, 'update']);
    Route::delete('/delete-research-project/{id}', [ResearchProjectController::class, 'destroy']);
    Route::get('/workshop-seminars', [WorkshopSeminarController::class, 'index']);
    Route::post('/add-workshop-seminar', [WorkshopSeminarController::class, 'store']);
    Route::post('/edit-workshop-seminar/{id}', [WorkshopSeminarController::class, 'update']);
    Route::delete('/delete-workshop-seminar/{id}', [WorkshopSeminarController::class, 'destroy']);
    Route::get('/achievements', [AchievementController::class, 'index']);
    Route::post('/add-achievement', [AchievementController::class, 'store']);
    Route::post('/edit-achievement/{id}', [AchievementController::class, 'update']);
    Route::delete('/delete-achievement/{id}', [AchievementController::class, 'destroy']);
    Route::get('/research-scholars', [ResearchScholarsController::class, 'index']);
    Route::post('/add-research-scholar', [ResearchScholarsController::class, 'store']);
    Route::post('/edit-research-scholar/{id}', [ResearchScholarsController::class, 'update']);
    Route::delete('/delete-research-scholar/{id}', [ResearchScholarsController::class, 'destroy']);
    Route::get('/research-supervisors', [ResearchSupervisorsController::class, 'index']);
    Route::post('/add-research-supervisor', [ResearchSupervisorsController::class, 'store']);
    Route::post('/edit-research-supervisor/{id}', [ResearchSupervisorsController::class, 'update']);
    Route::delete('/delete-research-supervisor/{id}', [ResearchSupervisorsController::class, 'destroy']);
});
