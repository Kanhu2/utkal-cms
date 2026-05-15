<?php

use App\Http\Middleware\JwtAuthMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'jwt.auth' => JwtAuthMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function (Request $request, \Throwable $e): bool {
            return $request->is('api/*') || $request->expectsJson();
        });

        $exceptions->render(function (\Throwable $e, Request $request) {
            if (!($request->is('api/*') || $request->expectsJson())) {
                return null;
            }

            $status = Response::HTTP_INTERNAL_SERVER_ERROR;
            $payload = [
                'message' => $e->getMessage() ?: 'Server Error',
                'exception' => get_class($e),
            ];

            if ($e instanceof ValidationException) {
                $status = Response::HTTP_UNPROCESSABLE_ENTITY;
                $payload['message'] = collect($e->errors())->flatten()->first() ?: 'Validation error';
                $payload['errors'] = $e->errors();
            } elseif ($e instanceof ModelNotFoundException) {
                $status = Response::HTTP_NOT_FOUND;
                $payload['message'] = 'Record not found.';
                $payload['model'] = $e->getModel();
                $payload['ids'] = $e->getIds();
            } elseif ($e instanceof AuthenticationException) {
                $status = Response::HTTP_UNAUTHORIZED;
                $payload['message'] = $e->getMessage() ?: 'Unauthenticated.';
            } elseif ($e instanceof AuthorizationException) {
                $status = Response::HTTP_FORBIDDEN;
                $payload['message'] = $e->getMessage() ?: 'This action is unauthorized.';
            } elseif ($e instanceof MethodNotAllowedHttpException) {
                $status = Response::HTTP_METHOD_NOT_ALLOWED;
                $payload['message'] = 'Method not allowed for this endpoint.';
                $payload['allowed_methods'] = $e->getHeaders()['Allow'] ?? null;
            } elseif ($e instanceof NotFoundHttpException) {
                $status = Response::HTTP_NOT_FOUND;
                $payload['message'] = $e->getMessage() ?: 'Endpoint not found.';
            } elseif ($e instanceof HttpExceptionInterface) {
                $status = $e->getStatusCode();
            }

            if (config('app.debug')) {
                $payload['file'] = $e->getFile();
                $payload['line'] = $e->getLine();
                $payload['trace'] = collect($e->getTrace())->take(5)->values();
            }

            return response()->json($payload, $status);
        });
    })->create();
