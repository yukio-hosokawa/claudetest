# セットアップ手順

## ローカル開発

```bash
npm install
```

`.env.example` をコピーして `.env.local` を作成し、必要な値を設定します：

```bash
cp .env.example .env.local
```

`.env.local` に以下を設定：

```
KV_REST_API_URL=<Vercel KV の REST API URL>
KV_REST_API_TOKEN=<Vercel KV の REST API Token>
ADMIN_PASSWORD=<管理者ページのパスワード>
```

開発サーバーを起動：

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く。

---

## Vercel へのデプロイ手順

### 1. GitHub リポジトリを作成してプッシュ

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### 2. Vercel にデプロイ

1. [vercel.com](https://vercel.com) にログイン
2. 「Add New Project」→ GitHub リポジトリを選択してインポート
3. デプロイ完了後、プロジェクトの **Storage** タブへ進む

### 3. Vercel KV ストアを追加

1. Vercel ダッシュボードの Storage タブ → 「Create Database」
2. **KV** を選択 → データベース名を入力して作成
3. 作成されたら「Connect to Project」でプロジェクトに接続
4. 環境変数 `KV_REST_API_URL` と `KV_REST_API_TOKEN` が自動で設定される

### 4. 管理者パスワードを設定

1. Vercel ダッシュボードの Settings → Environment Variables
2. 「ADMIN_PASSWORD」を追加し、任意のパスワードを設定
3. 「Save」後、プロジェクトを再デプロイ（Deployments → 最新のデプロイ → Redeploy）

---

## 管理者ページ

`https://<your-domain>/admin` にアクセスし、設定したパスワードを入力して
「Markdown でダウンロード」ボタンを押すとアンケート結果をダウンロードできます。
