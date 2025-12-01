# 確認ダイアログコンポーネント

フロート表示される確認ダイアログのコンポーネントとカスタムフック。

## ファイル構成

- `ConfirmDialog.tsx` - ダイアログUIコンポーネント
- `useConfirm.ts` (hooks/) - ダイアログ制御用カスタムフック
- `ConfirmDialogExample.tsx` - 使用例サンプル

## 基本的な使い方

### 1. カスタムフックを使う方法（推奨）

```typescript
"use client";

import { ConfirmDialog } from "@/app/components/common/ConfirmDialog";
import { useConfirm } from "@/app/hooks/useConfirm";
import toast from "react-hot-toast";

export function MyComponent() {
  const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirm();

  const handleDelete = async () => {
    const result = await confirm({
      title: "本当によろしいですか？",
      message: "この案件を削除すると元に戻すことはできません。",
      confirmText: "はい",
      cancelText: "いいえ",
      variant: "danger",
    });

    if (result) {
      // 削除処理
      toast.success("削除しました");
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>削除</button>

      <ConfirmDialog
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
```

### 2. 直接使う方法

```typescript
"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/app/components/common/ConfirmDialog";

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    setIsOpen(false);
    // 確認後の処理
    console.log("確認されました");
  };

  const handleCancel = () => {
    setIsOpen(false);
    // キャンセル後の処理
    console.log("キャンセルされました");
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>確認</button>

      <ConfirmDialog
        isOpen={isOpen}
        title="本当によろしいですか？"
        message="この操作を実行しますか？"
        confirmText="はい"
        cancelText="いいえ"
        variant="warning"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
```

## Props

### ConfirmDialog

| Prop | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| isOpen | boolean | ✓ | - | ダイアログの表示状態 |
| title | string | ✓ | - | ダイアログのタイトル |
| message | string | ✓ | - | ダイアログのメッセージ |
| confirmText | string |  | "はい" | 確認ボタンのテキスト |
| cancelText | string |  | "いいえ" | キャンセルボタンのテキスト |
| onConfirm | () => void | ✓ | - | 確認ボタン押下時のコールバック |
| onCancel | () => void | ✓ | - | キャンセルボタン押下時のコールバック |
| variant | "danger" \| "warning" \| "info" |  | "warning" | ダイアログの種類 |

### variant の種類

- `danger` (赤): 削除など危険な操作
- `warning` (黄): 注意が必要な操作
- `info` (青): 情報確認や保存など

## 使用例

### 削除確認

```typescript
const handleDelete = async () => {
  const result = await confirm({
    title: "削除確認",
    message: "この案件を削除してもよろしいですか？削除すると元に戻せません。",
    confirmText: "削除する",
    cancelText: "キャンセル",
    variant: "danger",
  });

  if (result) {
    await api.deleteCase(token, id);
    toast.success("削除しました");
  }
};
```

### 保存確認

```typescript
const handleSave = async () => {
  const result = await confirm({
    title: "保存確認",
    message: "変更内容を保存しますか？",
    confirmText: "保存する",
    cancelText: "キャンセル",
    variant: "info",
  });

  if (result) {
    await api.updateCase(token, data, id);
    toast.success("保存しました");
  }
};
```

### 送信確認

```typescript
const handleSubmit = async () => {
  const result = await confirm({
    title: "送信確認",
    message: "この内容で送信してもよろしいですか？",
    confirmText: "送信する",
    cancelText: "戻る",
    variant: "warning",
  });

  if (result) {
    await api.submitForm(token, formData);
    toast.success("送信しました");
  }
};
```

### ログアウト確認

```typescript
const handleLogout = async () => {
  const result = await confirm({
    title: "ログアウト",
    message: "ログアウトしてもよろしいですか？",
    confirmText: "ログアウト",
    cancelText: "キャンセル",
    variant: "info",
  });

  if (result) {
    await logout();
    router.push("/login");
  }
};
```

## スタイリング

Tailwind CSSを使用してスタイリングされています。ダイアログは以下の特徴があります：

- **バックドロップ**: 半透明の黒背景
- **中央配置**: 画面中央にフロート表示
- **レスポンシブ**: モバイルでも適切に表示
- **ダークモード対応**: dark:クラスで自動切替
- **アニメーション**: スムーズな表示/非表示

## カスタマイズ

### ボタンの色を変更

`ConfirmDialog.tsx`の`variantStyles`を編集：

```typescript
const variantStyles = {
  danger: {
    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    icon: "text-red-600",
  },
  // 他のvariantを追加...
};
```

### アイコンを変更

`ConfirmDialog.tsx`のSVGパスを編集して別のアイコンに変更可能。

## 注意事項

- ダイアログは`z-50`で表示されるため、他の要素より前面に表示されます
- バックドロップをクリックするとキャンセル扱いになります
- ESCキーでの閉じる機能は未実装（必要に応じて追加可能）

## 今後の拡張案

- [ ] ESCキーでの閉じる機能
- [ ] カスタムアイコンのサポート
- [ ] アニメーションのカスタマイズ
- [ ] 複数のダイアログを同時表示
- [ ] 入力フィールド付きダイアログ
