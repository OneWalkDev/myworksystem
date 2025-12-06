<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_name' => 'nullable|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_phone' => 'nullable|string|max:255',
            'client_company' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|max:99999999',
            'actual_amount' => 'nullable|numeric|max:99999999',
            'payment_type_id' => 'nullable|exists:payment_types,id',
            'hourly_rate' => 'nullable|numeric|max:99999999',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'actual_start_date' => 'nullable|date',
            'actual_end_date' => 'nullable|date',
            'status_id' => 'nullable|exists:case_statuses,id',
            'priority_id' => 'nullable|exists:case_priorities,id',
            'tech_stack' => 'nullable|array',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
            'contract_file_path' => 'nullable|string',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '案件名',
            'description' => '説明',
            'client_name' => 'クライアント名',
            'client_email' => 'メールアドレス',
            'client_phone' => '電話番号',
            'client_company' => '会社名',
            'budget' => '予算',
            'actual_amount' => '実際の金額',
            'payment_type_id' => '支払いタイプ',
            'hourly_rate' => '時給',
            'start_date' => '開始予定日',
            'end_date' => '終了予定日',
            'actual_start_date' => '実際の開始日',
            'actual_end_date' => '実際の終了日',
            'status_id' => 'ステータス',
            'priority_id' => '優先度',
            'tech_stack' => '技術スタック',
            'tags' => 'タグ',
            'notes' => 'メモ',
            'contract_file_path' => '契約書',
        ];
    }
}
