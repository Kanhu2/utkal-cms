<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{
    protected $levels = [];
    protected $dontReport = [];
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        //
    }

    public function render($request, Throwable $exception)
    {
        if ($exception instanceof ValidationException) {

            $errors = $exception->errors();

            $firstError = collect($errors)
                ->flatten()
                ->first();

            return response()->json([
                'message' => $firstError
            ], 422);
        }

        return parent::render($request, $exception);
    }
}
