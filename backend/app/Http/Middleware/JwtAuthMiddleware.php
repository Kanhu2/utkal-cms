<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response|JsonResponse
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        try {
            $payload = app(JwtService::class)->decode($token);
            $user = User::query()->find($payload['sub'] ?? null);
        } catch (Throwable) {
            $user = null;
        }

        if (! $user) {
            return response()->json([
                'message' => 'Invalid or expired token.',
            ], 401);
        }

        Auth::setUser($user);
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
