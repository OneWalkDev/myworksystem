<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'case_id' => 'required|exists:cases,id',
            'sale_date' => 'required|date',
            'year' => 'nullable|integer|min:1900|max:2100',
            'month' => 'nullable|integer|between:1,12',
            'amount' => 'required|numeric',
            'tax_amount' => 'nullable|numeric',
            'total_amount' => 'required|numeric',
            'working_hours' => 'nullable|numeric',
            'hourly_rate' => 'nullable|numeric',
            'payment_due_date' => 'nullable|date',
            'payment_date' => 'nullable|date',
            'is_paid' => 'boolean',
            'notes' => 'nullable|string',
        ];
    }

    public function attributes(): array
    {
        return [
            'case_id' => '案件',
            'sale_date' => '売上日',
            'year' => '年',
            'month' => '月',
            'amount' => '売上金額',
            'tax_amount' => '消費税額',
            'total_amount' => '合計金額',
            'working_hours' => '稼働時間',
            'hourly_rate' => '時給',
            'payment_due_date' => '支払期日',
            'payment_date' => '実入金日',
            'is_paid' => '入金済みフラグ',
            'notes' => 'メモ',
        ];
    }
}
