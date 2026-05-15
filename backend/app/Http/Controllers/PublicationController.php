<?php

namespace App\Http\Controllers;

use App\Models\DepartmentPublication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Mews\Purifier\Facades\Purifier;
use Carbon\Carbon;


class PublicationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $publications = DepartmentPublication::query()
            // ->where('department_id', $request->user()->department_id)
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentPublication $publication): array => $this->formatPublication($publication));

        return response()->json($publications);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'content' => ['required', 'string'],
        ]);

        // ✅ sanitize HTML (IMPORTANT)
        $cleanContent = Purifier::clean($data['content']);

        $publication = DepartmentPublication::create([
            'department_id' => $request->user()->department_id,
            'publication_details' => $cleanContent,
            'updated_by' => $request->user()->name,
            'create_date' => Carbon::now()->format('d-m-Y'),
            'updated_at' => Carbon::now()->format('d-m-Y'),
            'preview' => 0,
        ]);

        return response()->json($this->formatPublication($publication), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $publication = DepartmentPublication::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $data = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $publication->update([
            'publication_details' => Purifier::clean($data['content']),
            'updated_by' => $request->user()->name,
            'updated_at' => Carbon::now()->format('d-m-Y'),
        ]);

        return response()->json($this->formatPublication($publication));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $publication = DepartmentPublication::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $publication->delete();

        return response()->json(['message' => 'Publication deleted successfully.']);
    }

    private function formatPublication(DepartmentPublication $publication): array
    {
        return [
            'id' => $publication->id,
            'publication_details' => $publication->publication_details,
            // 'user_name' => $publication->updated_by,
            'updated_by' => $publication->updated_by,
            'create_date' => $publication->create_date,
            'updated_at' => $publication->updated_at,
            'preview' => $publication->preview,
        ];
    }
}
