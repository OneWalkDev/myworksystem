# KUWork - フリーランス案件管理システム

フリーランサー向けの案件管理Webアプリケーション。Laravel + Next.js + Docker構成。

## 技術スタック

### バックエンド
- **PHP**: 8.2
- **Laravel**: 11.x
- **データベース**: MySQL 8.0
- **認証**: Laravel Sanctum (トークンベース認証)
- **キャッシュ**: Redis

### フロントエンド
- **Next.js**: 14.x (App Router)
- **React**: 18.x
- **TypeScript**: 5.x
- **スタイリング**: Tailwind CSS
- **通知**: react-hot-toast

### インフラ
- **Docker & Docker Compose**
- **phpMyAdmin**: データベース管理UI

## プロジェクト構造

```
KUWork/
├── backend/              # Laravel バックエンド
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/
│   │   │           ├── AuthController.php           # 認証API
│   │   │           ├── ClientCaseController.php     # 案件CRUD API
│   │   │           └── Master/                      # マスターデータAPI
│   │   │               ├── CasePriorityController.php
│   │   │               ├── CaseStatusController.php
│   │   │               └── PaymentTypeController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── ClientCase.php                       # 案件モデル
│   │   │   └── Master/                              # マスターデータモデル
│   │   │       ├── CaseStatus.php                   # 案件ステータス
│   │   │       ├── CasePriority.php                 # 優先度
│   │   │       └── PaymentType.php                  # 支払いタイプ
│   │   ├── Repositories/                            # データアクセス層
│   │   │   ├── ClientCaseRepository.php
│   │   │   └── Master/
│   │   │       └── CasePriorityRepository.php
│   │   └── Services/                                # ビジネスロジック層
│   │       ├── ClientCaseService.php
│   │       └── Master/
│   │           └── CasePriorityService.php
│   ├── database/
│   │   ├── migrations/                              # マイグレーションファイル
│   │   │   ├── 2025_11_30_090900_create_case_statuses_table.php
│   │   │   ├── 2025_11_30_090910_create_case_priorities_table.php
│   │   │   ├── 2025_11_30_090920_create_payment_types_table.php
│   │   │   └── 2025_11_30_090937_create_cases_table.php
│   │   └── seeders/                                 # 初期データ
│   │       ├── CaseStatusSeeder.php
│   │       ├── CasePrioritySeeder.php
│   │       └── PaymentTypeSeeder.php
│   └── routes/
│       └── api.php                                  # APIルート定義
│
├── frontend/             # Next.js フロントエンド
│   ├── app/
│   │   ├── types/                                   # TypeScript型定義
│   │   │   ├── index.ts                            # 型のエントリーポイント
│   │   │   ├── case.ts                             # 案件関連の型
│   │   │   └── master.ts                           # マスターデータの型
│   │   ├── lib/
│   │   │   └── api.ts                              # API クライアント
│   │   ├── hooks/
│   │   │   └── useAuth.ts                          # 認証カスタムフック
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── AppHeader.tsx                   # アプリヘッダー
│   │   │   └── cases/
│   │   │       ├── CaseForm.tsx                    # 案件フォーム
│   │   │       └── CaseTable.tsx                   # 案件一覧テーブル
│   │   ├── login/
│   │   │   └── page.tsx                            # ログインページ
│   │   ├── dashboard/
│   │   │   └── page.tsx                            # ダッシュボード
│   │   └── cases/
│   │       ├── page.tsx                            # 案件一覧
│   │       ├── new/
│   │       │   └── page.tsx                        # 案件新規登録
│   │       └── [id]/
│   │           ├── page.tsx                        # 案件詳細
│   │           └── edit/
│   │               └── page.tsx                    # 案件編集
│   └── package.json
│
└── docker-compose.yml    # Docker構成ファイル
```

## アーキテクチャパターン

### バックエンド: Repository-Service-Controller パターン

```
Controller → Service → Repository → Model → Database
```

- **Controller**: HTTPリクエストの処理、バリデーション、レスポンス返却
- **Service**: ビジネスロジックの実装
- **Repository**: データアクセス層、Eloquentクエリのカプセル化
- **Model**: Eloquentモデル、リレーション定義、スコープ

### フロントエンド: コンポーネントベースアーキテクチャ

- **Pages**: Next.js App Routerによるファイルベースルーティング
- **Components**: 再利用可能なUIコンポーネント
- **Hooks**: カスタムフック（認証など）
- **Types**: TypeScriptの型定義を集約
- **Lib**: APIクライアントなどのユーティリティ

## データベース設計

### マスターテーブル

#### case_statuses (案件ステータス)
- 問い合わせ、見積もり中、契約中、進行中、完了、保留、キャンセル

#### case_priorities (優先度)
- 低、中、高、緊急

#### payment_types (支払いタイプ)
- 固定報酬、時給制、月額契約

### メインテーブル

#### cases (案件)
- 基本情報: 案件名、説明
- クライアント情報: 名前、メール、電話、会社名
- 契約情報: 予算、実際の金額、支払いタイプ、時給
- 期間: 開始予定日、終了予定日、実際の開始日、終了日
- ステータス: 案件ステータス、優先度
- その他: 技術スタック、タグ、メモ、契約書パス

## セットアップ

### 必要な環境
- Docker Desktop
- Node.js 18+ (ローカル開発の場合)

### 初回セットアップ

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd KUWork
```

2. **環境変数の設定**
```bash
# バックエンド
cp backend/.env.example backend/.env
```

3. **Dockerコンテナの起動**
```bash
docker-compose up -d
```

4. **バックエンドのセットアップ**
```bash
# Composerの依存関係インストール
docker-compose exec backend composer install

# アプリケーションキーの生成
docker-compose exec backend php artisan key:generate

# データベースマイグレーション & シーダー実行
docker-compose exec backend php artisan migrate:fresh --seed
```

5. **フロントエンドのセットアップ**
```bash
cd frontend
npm install
npm run dev
```

### アクセスURL

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8001/api
- **phpMyAdmin**: http://localhost:8080

### デフォルトユーザー

シーダーで作成されるデフォルトユーザー（該当する場合）:
```
Email: test@example.com
Password: password
```

## API エンドポイント

### 認証
- `POST /api/register` - ユーザー登録
- `POST /api/login` - ログイン
- `POST /api/logout` - ログアウト

### 案件管理
- `GET /api/cases` - 案件一覧（ページネーション、フィルタリング対応）
- `GET /api/cases/{id}` - 案件詳細
- `POST /api/cases` - 案件作成
- `PATCH /api/cases/{id}` - 案件更新
- `DELETE /api/cases/{id}` - 案件削除
- `GET /api/cases/statistics` - ダッシュボード統計

### マスターデータ
- `GET /api/cases/status` - 案件ステータス一覧
- `GET /api/cases/priority` - 優先度一覧
- `GET /api/cases/payment-type` - 支払いタイプ一覧

## 主な機能

### 実装済み機能

1. **認証機能**
   - ユーザー登録・ログイン
   - トークンベース認証（Laravel Sanctum）
   - 認証状態の管理

2. **ダッシュボード**
   - 案件数の統計表示
   - ステータス別集計
   - 進行中・完了案件の集計

3. **案件管理**
   - 案件の一覧表示（ページネーション対応）
   - フィルタリング機能（案件名、クライアント名、ステータス、優先度、期間）
   - 案件の新規登録
   - 案件の詳細表示
   - 案件の編集
   - 案件の削除

4. **マスターデータ管理**
   - 案件ステータス（色付きバッジ表示）
   - 優先度（色付きバッジ表示）
   - 支払いタイプ

### TypeScript型定義

すべてのエンティティに対して型安全性を確保:

```typescript
// インポート例
import type { ClientCase, CaseStatus, CasePriority, PaymentType } from "@/app/types";
```

## 開発ガイドライン

### コーディング規約

#### バックエンド（Laravel）
- PSR-12準拠
- Repository-Service-Controllerパターンの遵守
- Eloquentのスコープを活用
- マスターデータは`is_active`と`display_order`を実装

#### フロントエンド（Next.js/TypeScript）
- TypeScript strictモード
- 関数型コンポーネントの使用
- カスタムフックでロジックを分離
- 型定義は`app/types`ディレクトリに集約

### Git ワークフロー
- mainブランチ: 本番環境
- 機能開発はfeatureブランチで実施
- コミットメッセージは簡潔かつ明確に

## トラブルシューティング

### マイグレーションエラー
```bash
# マイグレーションをリセット
docker-compose exec backend php artisan migrate:fresh --seed
```

### フロントエンドのビルドエラー
```bash
# node_modulesを削除して再インストール
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Dockerコンテナが起動しない
```bash
# コンテナを停止して再起動
docker-compose down
docker-compose up -d --build
```

## 今後の拡張予定

- [ ] ファイルアップロード機能（契約書など）
- [ ] 案件の検索機能強化
- [ ] エクスポート機能（CSV/PDF）
- [ ] メール通知機能
- [ ] カレンダー表示
- [ ] 収支管理機能
- [ ] レポート・分析機能

## ライセンス

このプロジェクトはプライベート使用のために開発されています。

## 作成者

開発者: KUWork Team
