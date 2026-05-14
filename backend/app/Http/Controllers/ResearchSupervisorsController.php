<?php

namespace App\Http\Controllers;

use App\Models\DepartmentResearchSupervisors;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ResearchSupervisorsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $researchSupervisors = DepartmentResearchSupervisors::query()
            // ->where('department_id', $request->user()->department_id)
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentResearchSupervisors $researchSupervisor): array => $this->formatResearchSupervisor($researchSupervisor));

        return response()->json($researchSupervisors);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:department_research_supervisor,email'],
            'intake' => ['required', 'integer'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('research_supervisors/files', 'public');
        }

        $researchSupervisor = DepartmentResearchSupervisors::create([
            'department_id' => $request->user()->department_id,
            'name' => $data['name'],
            'email' => $data['email'],
            'intake' => $data['intake'],
            'file' => $filePath,
            'updated_by' => $request->user()->name,
            'create_date' => Carbon::now()->format('d-m-Y'),
            'updated_at' => Carbon::now()->format('d-m-Y'),
            'preview' => 0,
        ]);

        return response()->json($this->formatResearchSupervisor($researchSupervisor), 201);
    }

    private function formatResearchSupervisor(DepartmentResearchSupervisors $researchSupervisor): array
    {
        return [
            'id' => $researchSupervisor->id,
            'department_id' => $researchSupervisor->department_id,
            'user_name' => $researchSupervisor->updated_by,
            'name' => $researchSupervisor->name,
            'email' => $researchSupervisor->email,
            'intake' => $researchSupervisor->intake,
            'file' => $researchSupervisor->file,
            'file_url' => $researchSupervisor->file ? asset('storage/' . $researchSupervisor->file) : null,
            'create_date' => $researchSupervisor->create_date,
            'updated_at' => $researchSupervisor->updated_at,
            'preview' => $researchSupervisor->preview,
        ];
    }
}
