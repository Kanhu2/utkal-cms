<?php

namespace App\Http\Controllers;

use App\Models\DepartmentAchievement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class AchievementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $achievements = DepartmentAchievement::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentAchievement $achievement): array => $this->formatAchievement($achievement));

        return response()->json($achievements);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'regd_no' => ['required', 'string'],
            'guide' => ['required', 'string'],
            'date_of_award' => ['required', 'date_format:d-m-Y'],
            'subject' => ['required', 'string'],
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('achievements/documents', 'public');
        }

        $achievement = DepartmentAchievement::create([
            'department_id' => $request->user()->department_id,
            'name' => $data['name'],
            'regd_no' => $data['regd_no'],
            'guide' => $data['guide'],
            'date_of_award' => $data['date_of_award'],
            'subject' => $data['subject'],
            'document' => $documentPath,
            'updated_by' => $request->user()->name,
            'create_date' => Carbon::now()->format('d-m-Y'),
            'updated_at' => Carbon::now()->format('d-m-Y'),
            'preview' => 0,
        ]);

        return response()->json($this->formatAchievement($achievement), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $achievement = DepartmentAchievement::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $data = $request->validate([
            'name' => ['required', 'string'],
            'regd_no' => ['required', 'string'],
            'guide' => ['required', 'string'],
            'date_of_award' => ['required', 'date_format:d-m-Y'],
            'subject' => ['required', 'string'],
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $oldDocumentPath = $achievement->document;
        $documentPath = $achievement->document;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('achievements/documents', 'public');
        }

        $achievement->update([
            'name' => $data['name'],
            'regd_no' => $data['regd_no'],
            'guide' => $data['guide'],
            'date_of_award' => $data['date_of_award'],
            'subject' => $data['subject'],
            'document' => $documentPath,
            'updated_by' => $request->user()->name,
            'updated_at' => Carbon::now()->format('d-m-Y'),
        ]);

        if ($oldDocumentPath && $oldDocumentPath !== $documentPath) {
            $this->deletePublicFile($oldDocumentPath);
        }

        return response()->json($this->formatAchievement($achievement));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $achievement = DepartmentAchievement::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $this->deletePublicFile($achievement->document);
        $achievement->delete();

        return response()->json(['message' => 'Achievement deleted successfully.']);
    }

    private function formatAchievement(DepartmentAchievement $achievement): array
    {
        return [
            'id' => $achievement->id,
            'department_id' => $achievement->department_id,
            'updated_by' => $achievement->updated_by,
            'name' => $achievement->name,
            'regd_no' => $achievement->regd_no,
            'guide' => $achievement->guide,
            'date_of_award' => $achievement->date_of_award,
            'subject' => $achievement->subject,
            'document' => $achievement->document,
            'document_url' => $achievement->document ? asset('storage/' . $achievement->document) : null,
            'create_date' => $achievement->create_date,
            'updated_at' => $achievement->updated_at,
            'preview' => $achievement->preview,
        ];
    }
}
