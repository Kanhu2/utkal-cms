<?php

namespace App\Http\Controllers;

use App\Models\DepartmentWorkshopSeminar;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WorkshopSeminarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $workshopSeminars = DepartmentWorkshopSeminar::query()
            // ->where('department_id', $request->user()->department_id)
            ->when(
                $request->user()->department_id,
                fn($query, $departmentId) => $query->where('department_id', $departmentId)
            )
            ->orderByDesc('id')
            ->get()
            ->map(fn(DepartmentWorkshopSeminar $workshopSeminar): array => $this->formatWorkshopSeminar($workshopSeminar));

        return response()->json($workshopSeminars);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'participants' => ['required', 'integer'],
            'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
            'broucher' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'start_date' => ['required', 'date_format:d-m-Y', 'after_or_equal:today'],
            'end_date' => ['required', 'date_format:d-m-Y', 'after_or_equal:start_date'],
        ]);

        $photoPath = null;
        $broucherPath = null;

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('workshop-seminars/photos', 'public');
        }

        if ($request->hasFile('broucher')) {
            $broucherPath = $request->file('broucher')->store('workshop-seminars/brouchers', 'public');
        }

        $workshopSeminar = DepartmentWorkshopSeminar::create([
            'department_id' => $request->user()->department_id,
            'name' => $data['name'],
            'participants' => $data['participants'],
            'photo' => $photoPath,
            'broucher' => $broucherPath,
            'updated_by' => $request->user()->name,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'preview' => 0,
        ]);

        return response()->json($this->formatWorkshopSeminar($workshopSeminar), 201);
    }

    private function formatWorkshopSeminar(DepartmentWorkshopSeminar $workshopSeminar): array
    {
        return [
            'id' => $workshopSeminar->id,
            'department_id' => $workshopSeminar->department_id,
            'user_name' => $workshopSeminar->updated_by,
            'name' => $workshopSeminar->name,
            'participants' => $workshopSeminar->participants,
            'photo' => $workshopSeminar->photo,
            'photo_url' => $workshopSeminar->photo ? asset('storage/' . $workshopSeminar->photo) : null,
            'broucher' => $workshopSeminar->broucher,
            'broucher_url' => $workshopSeminar->broucher ? asset('storage/' . $workshopSeminar->broucher) : null,
            'start_date' => $workshopSeminar->start_date,
            'end_date' => $workshopSeminar->end_date,
            'preview' => $workshopSeminar->preview,
        ];
    }
}
