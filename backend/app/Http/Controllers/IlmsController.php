<?php

namespace App\Http\Controllers;

use App\Models\DepartmentIlms;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class IlmsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $ilms = DepartmentIlms::query()
            // ->where('department_id', $request->user()->department_id)
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentIlms $ilm): array => $this->formatIlms($ilm));

        return response()->json($ilms);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string'],
            'description' => ['required', 'string'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx,mp4', 'max:102400'],
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('ilms', 'public');
        }

        $ilms = DepartmentIlms::create([
            'department_id' => $request->user()->department_id,
            'title' => $data['title'],
            'description' => $data['description'],
            'file' => $filePath,
            'updated_by' => $request->user()->name,
            'create_date' => Carbon::now()->format('d-m-Y'),
            'updated_at' => Carbon::now()->format('d-m-Y'),
            'preview' => 0,
        ]);

        return response()->json($this->formatIlms($ilms), 201);
    }

    private function formatIlms(DepartmentIlms $ilms): array
    {
        return [
            'id' => $ilms->id,
            'department_id' => $ilms->department_id,
            'updated_by' => $ilms->updated_by,
            'title' => $ilms->title,
            'description' => $ilms->description,
            'file' => $ilms->file,
            'file_url' => $ilms->file ? asset('storage/' . $ilms->file) : null,
            'create_date' => $ilms->create_date,
            'updated_at' => $ilms->updated_at,
            'preview' => $ilms->preview,
        ];
    }
}
