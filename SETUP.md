# Jire-pedia セットアップ手順

## 前提条件
- Docker と Docker Compose がインストールされていること
- Google Gemini API キー
- Groq API キー

## セットアップ手順

### 1. 環境変数の設定

`.env.local` ファイルを編集して、APIキーを設定します：

```bash
# jire-pediaディレクトリで実行
cd jire-pedia

# .env.localを編集
# NEXTAUTH_SECRET: ランダムな文字列（下記コマンドで生成可能）
# GOOGLE_GENERATIVE_AI_API_KEY: Google Gemini APIキー
# GROQ_API_KEY: Groq APIキー
```

NEXTAUTH_SECRETの生成:
```bash
# Bashがある環境で
openssl rand -base64 32

# または
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Dockerコンテナの起動

```bash
# jire-pediaディレクトリで実行
docker-compose up -d
```

これにより、以下が自動的に実行されます：
- PostgreSQLデータベースの起動
- Next.jsアプリケーションのビルドと起動
- 依存関係のインストール
- Prismaクライアントの生成

### 3. データベースのセットアップ

```bash
# Prismaマイグレーションの実行
docker-compose exec app npx prisma db push

# シードデータの投入
docker-compose exec app npm run prisma:seed
```

### 4. アプリケーションへのアクセス

ブラウザで以下のURLにアクセス：
```
http://localhost:3000
```

## 使用方法

### 1. ユーザー登録
- トップページの「無料で始める」ボタンをクリック
- 名前、メールアドレス、パスワードを入力して登録

### 2. ログイン
- 登録したメールアドレスとパスワードでログイン

### 3. ゲームをプレイ
- 「プレイ」ボタンをクリック
- ランダムに選ばれた用語に挑戦
- NGワードを避けながら説明文を入力
- 難易度を選択（簡単/普通/難しい）
- AIに挑戦して結果を確認

### 4. 辞書を閲覧
- 「辞書」ボタンをクリック
- 用語一覧を閲覧
- 各用語の詳細ページで、クラウン説明や他のユーザーの説明を確認

### 5. プロフィールを確認
- 「プロフィール」ボタンをクリック
- レベル、ランク、XPを確認
- 過去の挑戦履歴や投稿したエントリーを閲覧

## トラブルシューティング

### コンテナが起動しない場合
```bash
# ログを確認
docker-compose logs app
docker-compose logs db

# コンテナを再起動
docker-compose down
docker-compose up -d
```

### データベース接続エラー
```bash
# データベースの状態を確認
docker-compose ps

# データベースを再起動
docker-compose restart db
```

### Prismaエラー
```bash
# Prismaクライアントを再生成
docker-compose exec app npx prisma generate

# データベーススキーマをリセット
docker-compose exec app npx prisma db push --force-reset
docker-compose exec app npm run prisma:seed
```

## 開発時のコマンド

```bash
# ログを表示
docker-compose logs -f app

# コンテナ内でコマンドを実行
docker-compose exec app <command>

# 依存関係を追加
docker-compose exec app npm install <package>

# Prismaスキーマを更新した後
docker-compose exec app npx prisma generate
docker-compose exec app npx prisma db push

# コンテナを停止
docker-compose down

# コンテナとボリュームを削除（データベースもクリア）
docker-compose down -v
```

## APIキーの取得方法

### Google Gemini API
1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. 「Get API Key」をクリック
3. APIキーをコピー

### Groq API
1. [Groq Console](https://console.groq.com/) にアクセス
2. アカウントを作成
3. API Keysセクションでキーを生成

## 注意事項

- 本番環境で使用する場合は、必ず`.env.local`の値を変更してください
- NEXTAUTH_SECRETは十分に長いランダムな文字列を使用してください
- APIキーは第三者に公開しないでください
