interface CaseFormProps {
  initialData?: ClientCase;  // 編集時のみ渡す
  onSubmit: (data: FormData) => void;
}

export function CaseForm({ initialData, onSubmit }: CaseFormProps) {
  // フォームロジック
}