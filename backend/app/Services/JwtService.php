<?php

namespace App\Services;

use InvalidArgumentException;

class JwtService
{
    public function encode(array $payload, ?int $ttlSeconds = null): string
    {
        $now = time();
        $ttlSeconds ??= 60 * 60 * 24;

        $payload = array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $ttlSeconds,
        ]);

        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256',
        ];

        $segments = [
            $this->base64UrlEncode(json_encode($header, JSON_THROW_ON_ERROR)),
            $this->base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR)),
        ];

        $segments[] = $this->signature($segments[0].'.'.$segments[1]);

        return implode('.', $segments);
    }

    public function decode(string $token): array
    {
        $segments = explode('.', $token);

        if (count($segments) !== 3) {
            throw new InvalidArgumentException('Invalid token.');
        }

        [$header, $payload, $signature] = $segments;
        $expectedSignature = $this->signature($header.'.'.$payload);

        if (! hash_equals($expectedSignature, $signature)) {
            throw new InvalidArgumentException('Invalid token signature.');
        }

        $decodedPayload = json_decode($this->base64UrlDecode($payload), true, 512, JSON_THROW_ON_ERROR);

        if (($decodedPayload['exp'] ?? 0) < time()) {
            throw new InvalidArgumentException('Token expired.');
        }

        return $decodedPayload;
    }

    private function signature(string $data): string
    {
        return $this->base64UrlEncode(hash_hmac('sha256', $data, $this->secret(), true));
    }

    private function secret(): string
    {
        $key = config('app.key');

        if (str_starts_with($key, 'base64:')) {
            return base64_decode(substr($key, 7), true) ?: $key;
        }

        return $key;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): string
    {
        return base64_decode(strtr($value, '-_', '+/'), true) ?: '';
    }
}
