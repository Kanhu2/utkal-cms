<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function createAdmin(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $admin = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'admin',
        ]);

        return response()->json([
            'message' => 'Admin user created successfully.',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
            ],
        ], 201);
    }
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', 'string', 'in:admin,employee'],
            'assigned_modules' => ['required', 'array', 'min:1'],
            'assigned_modules.*' => ['string'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
        ]);

        $modules = $data['assigned_modules'];

        if (!is_array($modules)) {
            $modules = explode(',', $modules);
        }

        $modules = array_map(function ($module) {
            return trim($module, '"');
        }, $modules);

        $assignedModules = trim(implode(',', $modules), '"');

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'employee',
            'assigned_modules' => $assignedModules,
            'department_id' => $data['department_id'],
        ]);


        return response()->json([
            'message' => 'User registered successfully.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'assigned_modules' => $user->assigned_modules,
                'department_id' => $user->department_id,
            ],
        ], 201);
    }

    public function users(): JsonResponse
    {
        $users = User::with('department:id,name')
            ->select([
                'id',
                'name',
                'email',
                'assigned_modules',
                'department_id'
            ])
            ->where('role', 'employee')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($users);
    }

    public function login(Request $request, JwtService $jwt): JsonResponse
    {
        $credentials = $request->validate([
            // 'department_id' => ['required', 'integer', 'exists:departments,id'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()
            // ->where('department_id', $credentials['department_id'])
            ->where('email', $credentials['email'])
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid login details.',
            ], 401);
        }

        $token = $jwt->encode([
            'sub' => $user->id,
            'department_id' => $user->department_id,
            'email' => $user->email,
        ]);

        return response()->json([
            'message' => 'Login successful.',
            'token_type' => 'Bearer',
            'access_token' => $token,
            'expires_in' => 86400,
            'dashboard_url' => '/api/dashboard',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'assigned_modules' => $user->assigned_modules,
                'department_id' => $user->department_id,
            ],
        ]);
    }
}
