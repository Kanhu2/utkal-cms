<?php

namespace App\Http\Controllers;

use App\Models\DepartmentNotice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NoticeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notices = DepartmentNotice::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentNotice $notice): array => $this->formatNotice($notice));

        return response()->json($notices);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'file' => ['nullable', 'required_without:link', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'link' => ['nullable', 'required_without:file', 'url'],
            'publish_date' => ['required', 'date', 'after_or_equal:today'],
            'last_date' => ['required', 'date', 'after_or_equal:publish_date'],
        ]);

        $filePath = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('notices', 'public');
        }

        if ($request->hasFile('file') && $request->filled('link')) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'file' => ['You cannot upload a file and provide a link together.'],
                ]
            ], 422);
        }

        $notice = DepartmentNotice::create([
            'department_id' => $request->user()->department_id ?? 0,
            'title' => $data['title'],
            'category' => $data['category'],
            'file' => $filePath,
            'link' => $data['link'] ?? null,
            'updated_by' => $request->user()->name,
            'publish_date' => $data['publish_date'],
            'last_date' => $data['last_date'],
            'preview' => 0,
        ]);

        return response()->json($this->formatNotice($notice), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $notice = DepartmentNotice::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $data = $request->validate([
            'title' => ['required', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'link' => ['nullable', 'url'],
            'publish_date' => ['required', 'date'],
            'last_date' => ['required', 'date', 'after_or_equal:publish_date'],
        ]);

        if ($request->hasFile('file') && $request->filled('link')) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'file' => ['You cannot upload a file and provide a link together.'],
                ]
            ], 422);
        }

        $oldFilePath = $notice->file;
        $filePath = $notice->file;
        $link = $data['link'] ?? $notice->link;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('notices', 'public');
            $link = null;
        } elseif ($request->filled('link')) {
            $filePath = null;
        }

        if (!$filePath && !$link) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'file' => ['Please upload a file or provide a link.'],
                ]
            ], 422);
        }

        $notice->update([
            'title' => $data['title'],
            'category' => $data['category'],
            'file' => $filePath,
            'link' => $link,
            'updated_by' => $request->user()->name,
            'publish_date' => $data['publish_date'],
            'last_date' => $data['last_date'],
        ]);

        if ($oldFilePath && $oldFilePath !== $filePath) {
            $this->deletePublicFile($oldFilePath);
        }

        return response()->json($this->formatNotice($notice));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $notice = DepartmentNotice::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $this->deletePublicFile($notice->file);
        $notice->delete();

        return response()->json(['message' => 'Notice deleted successfully.']);
    }

    private function formatNotice(DepartmentNotice $notice): array
    {
        return [
            'id' => $notice->id,
            'department_id' => $notice->department_id,
            'updated_by' => $notice->updated_by,
            'title' => $notice->title,
            'category' => $notice->category,
            'file' => $notice->file,
            'file_url' => $notice->file ? asset('storage/' . $notice->file) : null,
            'link' => $notice->link,
            'publish_date' => $notice->publish_date,
            'last_date' => $notice->last_date,
            'preview' => $notice->preview,
        ];
    }
}
