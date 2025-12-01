<?php

return [
    'required' => ':attributeは必須です。',
    'email' => ':attributeは有効なメールアドレスではありません。',
    'max' => [
        'string' => ':attributeは:max文字以内で入力してください。',
        'numeric' => ':attributeは:max以下で入力してください。',
    ],
    'numeric' => ':attributeは数値で入力してください。',
    'date' => ':attributeは有効な日付ではありません。',
    'exists' => '選択された:attributeは無効です。',
    'string' => ':attributeは文字列で入力してください。',
    'array' => ':attributeは配列である必要があります。',

    'attributes' => [
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
    ],
];
