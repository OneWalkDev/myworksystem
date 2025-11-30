<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\PaymentType;
use App\Services\Master\PaymentTypeService;
use Illuminate\Http\JsonResponse;

class PaymentTypeController extends Controller
{
    protected PaymentTypeService $service;

    public function __construct(PaymentTypeService $service){
        $this->service = $service;
    }

    public function index(){
        $priorities = $this->service->getPaymentTypeAll();
        return response()->json($priorities);
    }
}
