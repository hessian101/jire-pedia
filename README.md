# Jire-pedia (ジレペディア) 🧠

「説明できそうでできない」言葉を自分の言葉で定義する、新感覚の**共創型辞書ゲーム**です。
あなたの説明力と語彙力を試してみませんか？

![Jire-pedia Banner](public/og-image.png)

## 🎮 主な機能

- **デイリーチャレンジ**: 毎日出題される「お題」を説明し、AIによる採点に挑戦。
- **AI判定ロジック**: Gemini/Groq を活用し、あなたの説明が「正確か」「禁止ワードを使っていないか」を瞬時に判定。
- **みんなの辞書**: 他のユーザーが作った説明文を閲覧・評価・改善提案が可能。
- **ランキング**: XP（経験値）を競い合い、リーグ昇格を目指す。
- **美しいUI**: ダークモードを基調とした、没入感のあるモダンなインターフェース。

## 🛠 技術スタック

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Database**: PostgreSQL (Neon), Prisma
- **AI Integration**: Google Gemini Pro, Groq (Llama 3)
- **Auth**: NextAuth.js v5
- **3D Graphics**: React Three Fiber

## 🚀 ローカルでの実行方法

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/hessian101/jire-pedia.git
   cd jire-pedia
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   `.env.local` ファイルを作成し、必要な環境変数（DB接続先、APIキー等）を設定してください。
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-key"
   GROQ_API_KEY="your-groq-key"
   ```

4. **データベースのセットアップ**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   http://localhost:3000 にアクセスして確認できます。

## 📦 デプロイ

このプロジェクトは [Vercel](https://vercel.com/) へのデプロイに最適化されています。
詳細な手順は `deployment_plan.md` を参照してください。

## 📝 ライセンス

MIT License