<?php

namespace App\Http\Controllers;

use App\Models\DepartmentResearchProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResearchProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $researchProjects = DepartmentResearchProject::query()
            // ->where('department_id', $request->user()->department_id)
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentResearchProject $researchProject): array => $this->formatResearchProject($researchProject));

        return response()->json($researchProjects);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string'],
            'funding_agency' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'string'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'coordinator_name' => ['required', 'string'],
            'sanctioned_letter' => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ]);

        $sanctionedLetterPath = $request->file('sanctioned_letter')->store('researchProject', 'public');

        $researchProject = DepartmentResearchProject::create([
            'department_id' => $request->user()->department_id,
            'title' => $data['title'],
            'funding_agency' => $data['funding_agency'],
            'amount' => $data['amount'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'coordinator_name' => $data['coordinator_name'],
            'sanctioned_letter' => $sanctionedLetterPath,
            'updated_by' => $request->user()->name,
            'preview' => 0,
        ]);

        return response()->json($this->formatResearchProject($researchProject), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $researchProject = DepartmentResearchProject::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $data = $request->validate([
            'title' => ['required', 'string'],
            'funding_agency' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'coordinator_name' => ['required', 'string'],
            'sanctioned_letter' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
        ]);

        $oldSanctionedLetterPath = $researchProject->sanctioned_letter;
        $sanctionedLetterPath = $researchProject->sanctioned_letter;
        if ($request->hasFile('sanctioned_letter')) {
            $sanctionedLetterPath = $request->file('sanctioned_letter')->store('researchProject', 'public');
        }

        $researchProject->update([
            'title' => $data['title'],
            'funding_agency' => $data['funding_agency'],
            'amount' => $data['amount'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'coordinator_name' => $data['coordinator_name'],
            'sanctioned_letter' => $sanctionedLetterPath,
            'updated_by' => $request->user()->name,
        ]);

        if ($oldSanctionedLetterPath && $oldSanctionedLetterPath !== $sanctionedLetterPath) {
            $this->deletePublicFile($oldSanctionedLetterPath);
        }

        return response()->json($this->formatResearchProject($researchProject));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $researchProject = DepartmentResearchProject::query()
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->findOrFail($id);

        $this->deletePublicFile($researchProject->sanctioned_letter);
        $researchProject->delete();

        return response()->json(['message' => 'Research project deleted successfully.']);
    }

    private function formatResearchProject(DepartmentResearchProject $researchProject): array
    {
        return [
            'id' => $researchProject->id,
            'department_id' => $researchProject->department_id,
            'user_name' => $researchProject->updated_by,
            'title' => $researchProject->title,
            'funding_agency' => $researchProject->funding_agency,
            'amount' => $researchProject->amount,
            'start_date' => $researchProject->start_date,
            'end_date' => $researchProject->end_date,
            'coordinator_name' => $researchProject->coordinator_name,
            'sanctioned_letter' => $researchProject->sanctioned_letter,
            'sanctioned_letter_url' => $researchProject->sanctioned_letter
                ? asset('storage/' . $researchProject->sanctioned_letter)
                : null,
            'preview' => $researchProject->preview,
        ];
    }
}
