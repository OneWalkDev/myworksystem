<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Services\Master\CaseStatusService;


class CaseStatusController extends Controller
{
    protected CaseStatusService $service;

    public function __construct(CaseStatusService $service){
        $this->service = $service;
    }

    public function index(){
        $priorities = $this->service->getCaseStatusAll();
        return response()->json($priorities);
    }
}
