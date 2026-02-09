import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export interface JudgementResult {
  aiGuess: string
  confidence: number
  reasoning: string
  success: boolean
}

function createJudgementPrompt(explanation: string): string {
  return `あなたは用語推測AIです。以下の説明文が何の用語を説明しているか推測してください。

説明文: ${explanation}

以下の形式で回答してください（JSON形式で）:
{
  "guess": "推測した用語名",
  "confidence": 確信度（0-100の数値）,
  "reasoning": "なぜそう推測したかの理由"
}

重要: 回答は必ずJSON形式のみで、説明文や追加のテキストは含めないでください。`
}

export async function judgeWithGemini(
  explanation: string,
  correctAnswer: string
): Promise<JudgementResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  const result = await model.generateContent(createJudgementPrompt(explanation))
  const text = result.response.text()

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("Failed to parse AI response")

  const parsed = JSON.parse(jsonMatch[0])
  const success = parsed.guess.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

  return {
    aiGuess: parsed.guess,
    confidence: parsed.confidence,
    reasoning: parsed.reasoning,
    success,
  }
}

export async function judgeWithGroq(
  explanation: string,
  correctAnswer: string,
  modelId: "llama-3.1-8b-instant" | "llama-3-70b-8192"
): Promise<JudgementResult> {
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: createJudgementPrompt(explanation) }],
    model: modelId,
    temperature: 0.3,
    max_tokens: 500,
  })

  const text = completion.choices[0]?.message?.content
  if (!text) throw new Error("No response from AI")

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("Failed to parse AI response")

  const parsed = JSON.parse(jsonMatch[0])
  const success = parsed.guess.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

  return {
    aiGuess: parsed.guess,
    confidence: parsed.confidence,
    reasoning: parsed.reasoning,
    success,
  }
}

export interface NGCheckResult {
  isNG: boolean
  reason: string
}

function createNGCheckPrompt(explanation: string, word: string): string {
  return `あなたはクイズの公平性を判定するAI審判です。
ユーザーが「${word}」という言葉を説明しようとしています。
以下の説明文が、クイズとして適切か（答えを直接言っていないか、安易な翻訳でないか）を判定してください。

説明文: ${explanation}

判定基準:
1. 答えの単語「${word}」そのものが含まれている場合はNG。
2. 答えの単語の漢字違い、読み仮名、英語訳などがそのまま含まれている場合はNG。
3. "It is..." のように、単にその単語を翻訳しただけの文章はNG。
4. それ以外はOK。

以下の形式で回答してください（JSON形式のみ）:
{
  "isNG": true または false,
  "reason": "NGの場合の理由（OKの場合は空文字）"
}
`
}

export async function checkNGWithAI(
  explanation: string,
  word: string
): Promise<NGCheckResult> {
  // Use Gemini Flash for speed and cost effectiveness
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  try {
    const result = await model.generateContent(createNGCheckPrompt(explanation, word))
    const text = result.response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { isNG: false, reason: "" } // Fallback to safe if parse fails

    const parsed = JSON.parse(jsonMatch[0])
    return {
      isNG: parsed.isNG,
      reason: parsed.reason,
    }
  } catch (error) {
    console.error("AI NG Check failed:", error)
    // On error, let it pass (fail open) to avoid blocking users unnecessarily,
    // or you could choose to fail closed depending on requirements.
    return { isNG: false, reason: "" }
  }
}

// 用語のメタデータ（定義、NGワード）を生成
export async function generateTermMeta(word: string, category?: string) {
  const prompt = `
あなたは辞書編集者です。
用語「${word}」${category ? `（カテゴリ: ${category}）` : ""}について、以下の情報を生成してください。

1. **officialDef**: 辞書的な簡潔で正確な定義（100文字以内）。
2. **ngWords**: この用語を説明するゲームにおいて、使用を禁止すべき単語（その単語自体や、答えがすぐに分かってしまう重要なキーワード）を5つ程度。

出力は以下のJSON形式のみでお願いします。余計な文字列は含めないでください。
{
  "officialDef": "...",
  "ngWords": ["...", "..."]
}
`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // JSON部分を抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Invalid AI response format")

    const data = JSON.parse(jsonMatch[0])
    return {
      officialDef: data.officialDef,
      ngWords: data.ngWords
    }
  } catch (error) {
    console.error("AI Generation Error:", error)
    // フォールバック
    return {
      officialDef: `${word}とは...（AI生成に失敗しました）`,
      ngWords: [word]
    }
  }
}
