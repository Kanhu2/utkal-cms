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
