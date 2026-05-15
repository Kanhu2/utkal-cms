<?php

namespace App\Http\Controllers;

use App\Models\DepartmentNewsEvents;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class NewsEventsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $newsEvents = DepartmentNewsEvents::query()
            // ->where('department_id', $request->user()->department_id)
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentNewsEvents $newsEvent): array => $this->formatNewsEvent($newsEvent));

        return response()->json($newsEvents);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string'],
            'file' => ['nullable', 'required_without:link', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'link' => ['nullable', 'required_without:file', 'url'],
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
        ]);

        $filePath = null;
        $imagePath = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('news-events/files', 'public');
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news-events/images', 'public');
        }

        if ($request->hasFile('file') && $request->filled('link')) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'file' => ['You cannot upload a file and provide a link together.'],
                ]
            ], 422);
        }

        $newsEvent = DepartmentNewsEvents::create([
            'department_id' => $request->user()->department_id,
            'title' => $data['title'],
            'file' => $filePath,
            'link' => $data['link'] ?? null,
            'image' => $imagePath,
            'updated_by' => $request->user()->name,
            'create_date' => Carbon::now()->format('d-m-Y'),
            'updated_at' => Carbon::now()->format('d-m-Y'),
            'preview' => 0,
        ]);

        return response()->json($this->formatNewsEvent($newsEvent), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $newsEvent = DepartmentNewsEvents::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $data = $request->validate([
            'title' => ['required', 'string'],
            'file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'link' => ['nullable', 'url'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
        ]);

        if ($request->hasFile('file') && $request->filled('link')) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'file' => ['You cannot upload a file and provide a link together.'],
                ]
            ], 422);
        }

        $oldFilePath = $newsEvent->file;
        $oldImagePath = $newsEvent->image;
        $filePath = $newsEvent->file;
        $imagePath = $newsEvent->image;
        $link = $data['link'] ?? $newsEvent->link;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('news-events/files', 'public');
            $link = null;
        } elseif ($request->filled('link')) {
            $filePath = null;
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news-events/images', 'public');
        }

        if (!$filePath && !$link) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => [
                    'file' => ['Please upload a file or provide a link.'],
                ]
            ], 422);
        }

        $newsEvent->update([
            'title' => $data['title'],
            'file' => $filePath,
            'link' => $link,
            'image' => $imagePath,
            'updated_by' => $request->user()->name,
            'updated_at' => Carbon::now()->format('d-m-Y'),
        ]);

        if ($oldFilePath && $oldFilePath !== $filePath) {
            $this->deletePublicFile($oldFilePath);
        }

        if ($oldImagePath && $oldImagePath !== $imagePath) {
            $this->deletePublicFile($oldImagePath);
        }

        return response()->json($this->formatNewsEvent($newsEvent));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $newsEvent = DepartmentNewsEvents::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $this->deletePublicFile($newsEvent->file);
        $this->deletePublicFile($newsEvent->image);
        $newsEvent->delete();

        return response()->json(['message' => 'News & event deleted successfully.']);
    }

    private function formatNewsEvent(DepartmentNewsEvents $newsEvent): array
    {
        return [
            'id' => $newsEvent->id,
            'department_id' => $newsEvent->department_id,
            'updated_by' => $newsEvent->updated_by,
            'title' => $newsEvent->title,
            'file' => $newsEvent->file,
            'file_url' => $newsEvent->file ? asset('storage/' . $newsEvent->file) : null,
            'link' => $newsEvent->link,
            'image' => $newsEvent->image,
            'image_url' => $newsEvent->image ? asset('storage/' . $newsEvent->image) : null,
            'create_date' => $newsEvent->create_date,
            'updated_at' => $newsEvent->updated_at,
            'preview' => $newsEvent->preview,
        ];
    }
}
