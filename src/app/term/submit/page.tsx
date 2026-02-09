"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Loader2, Sparkles, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MotionButton } from "@/components/ui/motion-button"
import { runConfetti } from "@/lib/confetti"

const categories = [
    "Science",
    "History",
    "Technology",
    "Art",
    "Literature",
    "Philosophy",
    "Society",
    "Daily Life",
    "Nature",
    "Entertainment",
]

const formSchema = z.object({
    word: z.string().min(1, "用語を入力してください").max(50, "用語は50文字以内で入力してください"),
    reading: z.string().min(1, "読みを入力してください").regex(/^[ぁ-んー]+$/, "ひらがなで入力してください"),
    category: z.string().min(1, "カテゴリを選択してください"),
    difficulty: z.enum(["EASY", "NORMAL", "HARD"]),
    officialDef: z.string().min(10, "公式定義は10文字以上で入力してください"),
    ngWords: z.string().min(1, "NGワードを入力してください"),
})

export default function SubmitTermPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            word: "",
            reading: "",
            category: "",
            difficulty: "NORMAL",
            officialDef: "",
            ngWords: "",
        },
    })

    // AIによるメタデータ生成
    const generateMeta = async () => {
        const word = form.getValues("word")
        if (!word) {
            toast({
                title: "用語を入力してください",
                description: "AI生成を行うには、まず用語を入力してください。",
                variant: "destructive",
            })
            return
        }

        setIsGenerating(true)
        try {
            const response = await fetch("/api/term/generate-meta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ word }),
            })

            if (!response.ok) throw new Error("Generation failed")

            const data = await response.json()
            form.setValue("officialDef", data.officialDef)
            form.setValue("ngWords", data.ngWords.join(", ")) // カンマ区切りで表示

            toast({
                title: "AI生成完了",
                description: "公式定義とNGワードを生成しました。必要に応じて修正してください。",
            })
        } catch (error) {
            toast({
                title: "AI生成エラー",
                description: "メタデータの生成に失敗しました。もう一度お試しください。",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    // 送信処理
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)
        try {
            // ngWordsを配列に変換
            const submitData = {
                ...values,
                ngWords: values.ngWords.split(",").map(w => w.trim()).filter(w => w),
            }

            const response = await fetch("/api/term/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Submission failed")
            }

            runConfetti()
            toast({
                title: "投稿完了！",
                description: "新しい用語が登録されました。",
            })

            // 少し待ってからトップへ
            setTimeout(() => {
                router.push("/")
            }, 2000)

        } catch (error) {
            toast({
                title: "投稿エラー",
                description: error instanceof Error ? error.message : "用語の登録に失敗しました。",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        トップに戻る
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        新しい用語を登録
                    </h1>
                    <p className="text-gray-400 mt-2">
                        あなたの知っている「ジレる言葉」をみんなに出題しましょう。
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 用語 */}
                                <FormField
                                    control={form.control}
                                    name="word"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>用語 (Word)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="例: ブラックホール" {...field} className="bg-black/20 border-white/10" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* 読み */}
                                <FormField
                                    control={form.control}
                                    name="reading"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>読み (ひらがな)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="例: ぶらっくほーる" {...field} className="bg-black/20 border-white/10" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* カテゴリ */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>カテゴリ</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-black/20 border-white/10">
                                                        <SelectValue placeholder="カテゴリを選択" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat} value={cat}>
                                                            {cat}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* 難易度 */}
                                <FormField
                                    control={form.control}
                                    name="difficulty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>難易度</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-black/20 border-white/10">
                                                        <SelectValue placeholder="難易度を選択" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="EASY">EASY (簡単)</SelectItem>
                                                    <SelectItem value="NORMAL">NORMAL (普通)</SelectItem>
                                                    <SelectItem value="HARD">HARD (難しい)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* AI生成ボタン */}
                            <div className="py-2">
                                <Button
                                    type="button"
                                    onClick={generateMeta}
                                    disabled={isGenerating || !form.watch("word")}
                                    variant="outline"
                                    className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            AIが生成中...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            定義とNGワードをAIで自動生成
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    用語を入力してから押すと、定義とNGワードの候補を自動入力します。
                                </p>
                            </div>

                            {/* 公式定義 */}
                            <FormField
                                control={form.control}
                                name="officialDef"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>公式定義 (Official Definition)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="辞書的な定義を入力してください..."
                                                className="min-h-[100px] bg-black/20 border-white/10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            AI判定の基準となる「正解」の説明です。
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* NGワード */}
                            <FormField
                                control={form.control}
                                name="ngWords"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NGワード</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="例: 穴, 重力, 宇宙 (カンマ区切り)"
                                                {...field}
                                                className="bg-black/20 border-white/10"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            説明文で使用を禁止する単語をカンマ区切りで入力してください。
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-6">
                                <MotionButton
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-6 rounded-xl shadow-lg shadow-cyan-500/20"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            送信中...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            この用語を登録する
                                        </>
                                    )}
                                </MotionButton>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
