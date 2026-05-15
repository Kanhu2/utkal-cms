<?php

namespace App\Http\Controllers;

use App\Models\DepartmentResearchScholars;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ResearchScholarsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $researchScholars = DepartmentResearchScholars::query()
            // ->where('department_id', $request->user()->department_id)
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentResearchScholars $researchScholar): array => $this->formatResearchScholar($researchScholar));

        return response()->json($researchScholars);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:department_research_scholar,email'],
            'mentor_name' => ['required', 'string'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('research_scholars/files', 'public');
        }

        $researchScholar = DepartmentResearchScholars::create([
            'department_id' => $request->user()->department_id,
            'name' => $data['name'],
            'email' => $data['email'],
            'mentor_name' => $data['mentor_name'],
            'file' => $filePath,
            'updated_by' => $request->user()->name,
            'create_date' => Carbon::now()->format('d-m-Y'),
            'updated_at' => Carbon::now()->format('d-m-Y'),
            'preview' => 0,
        ]);

        return response()->json($this->formatResearchScholar($researchScholar), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $researchScholar = DepartmentResearchScholars::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:department_research_scholar,email,' . $researchScholar->id],
            'mentor_name' => ['required', 'string'],
            'file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $oldFilePath = $researchScholar->file;
        $filePath = $researchScholar->file;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('research_scholars/files', 'public');
        }

        $researchScholar->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'mentor_name' => $data['mentor_name'],
            'file' => $filePath,
            'updated_by' => $request->user()->name,
            'updated_at' => Carbon::now()->format('d-m-Y'),
        ]);

        if ($oldFilePath && $oldFilePath !== $filePath) {
            $this->deletePublicFile($oldFilePath);
        }

        return response()->json($this->formatResearchScholar($researchScholar));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $researchScholar = DepartmentResearchScholars::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $this->deletePublicFile($researchScholar->file);
        $researchScholar->delete();

        return response()->json(['message' => 'Research scholar deleted successfully.']);
    }

    private function formatResearchScholar(DepartmentResearchScholars $researchScholar): array
    {
        return [
            'id' => $researchScholar->id,
            'department_id' => $researchScholar->department_id,
            'user_name' => $researchScholar->updated_by,
            'name' => $researchScholar->name,
            'email' => $researchScholar->email,
            'mentor_name' => $researchScholar->mentor_name,
            'file' => $researchScholar->file,
            'file_url' => $researchScholar->file ? asset('storage/' . $researchScholar->file) : null,
            'create_date' => $researchScholar->create_date,
            'updated_at' => $researchScholar->updated_at,
            'preview' => $researchScholar->preview,
        ];
    }
}
