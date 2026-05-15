<?php

namespace App\Http\Controllers;

use App\Models\DepartmentTender;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tenders = DepartmentTender::query()
            // ->where('department_id', $request->user()->department_id)
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentTender $tender): array => $this->formatTender($tender));

        return response()->json($tenders);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string'],
            'file' => ['nullable', 'required_without:link', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'link' => ['nullable', 'required_without:file', 'url'],
            'start_date' => ['required', 'date_format:d-m-Y', 'after_or_equal:today'],
            'end_date' => ['required', 'date_format:d-m-Y', 'after_or_equal:start_date'],
        ]);

        $filePath = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('tenders', 'public');
        }

        if ($request->hasFile('file') && $request->filled('link')) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'file' => ['You cannot upload a file and provide a link together.'],
                ]
            ], 422);
        }

        $tender = DepartmentTender::create([
            'department_id' => $request->user()->department_id ?? 0,
            'title' => $data['title'],
            'file' => $filePath,
            'link' => $data['link'] ?? null,
            'updated_by' => $request->user()->name,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'preview' => 0,
        ]);

        return response()->json($this->formatTender($tender), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $tender = DepartmentTender::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $data = $request->validate([
            'title' => ['required', 'string'],
            'file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'link' => ['nullable', 'url'],
            'start_date' => ['required', 'date_format:d-m-Y'],
            'end_date' => ['required', 'date_format:d-m-Y', 'after_or_equal:start_date'],
        ]);

        if ($request->hasFile('file') && $request->filled('link')) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'file' => ['You cannot upload a file and provide a link together.'],
                ]
            ], 422);
        }

        $oldFilePath = $tender->file;
        $filePath = $tender->file;
        $link = $data['link'] ?? $tender->link;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('tenders', 'public');
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

        $tender->update([
            'title' => $data['title'],
            'file' => $filePath,
            'link' => $link,
            'updated_by' => $request->user()->name,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
        ]);

        if ($oldFilePath && $oldFilePath !== $filePath) {
            $this->deletePublicFile($oldFilePath);
        }

        return response()->json($this->formatTender($tender));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $tender = DepartmentTender::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $this->deletePublicFile($tender->file);
        $tender->delete();

        return response()->json(['message' => 'Tender deleted successfully.']);
    }

    private function formatTender(DepartmentTender $tender): array
    {
        return [
            'id' => $tender->id,
            'department_id' => $tender->department_id,
            'updated_by' => $tender->updated_by,
            'title' => $tender->title,
            'file' => $tender->file,
            'file_url' => $tender->file ? asset('storage/' . $tender->file) : null,
            'link' => $tender->link,
            'start_date' => $tender->start_date,
            'end_date' => $tender->end_date,
            'preview' => $tender->preview,
        ];
    }
}
