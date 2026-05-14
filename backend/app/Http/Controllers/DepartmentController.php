<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DepartmentController extends Controller
{
    public function index(): JsonResponse
    {
        $departments = Department::query()
            ->select(['id', 'name'])
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($departments);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $department = Department::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ]);

        return response()->json([
            'id' => $department->id,
            'name' => $department->name,
        ], 201);
    }
}
