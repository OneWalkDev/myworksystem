<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Services\Master\CasePriorityService;
use Illuminate\Http\Request;

class CasePriorityController extends Controller
{

    protected CasePriorityService $service;

    public function __construct(CasePriorityService $service){
        $this->service = $service;
    }

    public function index(){
        $priorities = $this->service->getCasePriorityAll();
        return response()->json($priorities);
    }
}
