<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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
        if ($request->is('api/*') || $request->expectsJson()) {
            return $this->renderApiException($exception);
        }

        return parent::render($request, $exception);
    }

    private function renderApiException(Throwable $exception)
    {
        $status = Response::HTTP_INTERNAL_SERVER_ERROR;
        $payload = [
            'message' => $exception->getMessage() ?: 'Server Error',
            'exception' => get_class($exception),
        ];

        if ($exception instanceof ValidationException) {
            $status = Response::HTTP_UNPROCESSABLE_ENTITY;
            $payload['message'] = collect($exception->errors())->flatten()->first() ?: 'Validation error';
            $payload['errors'] = $exception->errors();
        } elseif ($exception instanceof ModelNotFoundException) {
            $status = Response::HTTP_NOT_FOUND;
            $payload['message'] = 'Record not found.';
            $payload['model'] = $exception->getModel();
            $payload['ids'] = $exception->getIds();
        } elseif ($exception instanceof AuthenticationException) {
            $status = Response::HTTP_UNAUTHORIZED;
            $payload['message'] = $exception->getMessage() ?: 'Unauthenticated.';
        } elseif ($exception instanceof AuthorizationException) {
            $status = Response::HTTP_FORBIDDEN;
            $payload['message'] = $exception->getMessage() ?: 'This action is unauthorized.';
        } elseif ($exception instanceof MethodNotAllowedHttpException) {
            $status = Response::HTTP_METHOD_NOT_ALLOWED;
            $payload['message'] = 'Method not allowed for this endpoint.';
            $payload['allowed_methods'] = $exception->getHeaders()['Allow'] ?? null;
        } elseif ($exception instanceof NotFoundHttpException) {
            $status = Response::HTTP_NOT_FOUND;
            $payload['message'] = $exception->getMessage() ?: 'Endpoint not found.';
        } elseif ($exception instanceof HttpExceptionInterface) {
            $status = $exception->getStatusCode();
        }

        if (config('app.debug')) {
            $payload['file'] = $exception->getFile();
            $payload['line'] = $exception->getLine();
            $payload['trace'] = collect($exception->getTrace())->take(5)->values();
        }

        return response()->json($payload, $status);
    }
}
