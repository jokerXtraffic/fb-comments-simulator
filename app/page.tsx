"use client"

import { useState } from "react"
import { CommentForm } from "@/components/comment-form"
import { CommentPreview } from "@/components/comment-preview"
import { LanguageSelector } from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Globe } from "lucide-react"
import html2canvas from "html2canvas"
import { languages, type Language } from "@/lib/languages"

export interface Comment {
  id: string
  userName: string
  avatarUrl: string
  text: string
  imageUrl?: string
  timeValue: number
  timeUnit: "min" | "hour" | "day" | "week" | "month" | "year"
  likes: number
  loves: number
  reactions: number
  replies: Comment[]
}

export default function Home() {
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])

  const addComment = (comment: Omit<Comment, "id" | "replies">) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      replies: [],
    }
    setComments([...comments, newComment])
  }

  const addReply = (parentId: string, reply: Omit<Comment, "id" | "replies">) => {
    const newReply: Comment = {
      ...reply,
      id: Date.now().toString(),
      replies: [],
    }

    setComments(
      comments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...comment.replies, newReply] } : comment,
      ),
    )
  }

  const deleteComment = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id))
  }

  const deleteReply = (parentId: string, replyId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === parentId
          ? {
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== replyId),
            }
          : comment,
      ),
    )
  }

  const exportToPNG = async () => {
    const element = document.getElementById("comments-preview")
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
      })
      const link = document.createElement("a")
      link.download = "facebook-comments.png"
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("[v0] Error exporting to PNG:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Симулятор комментариев - IgnisAeterna💎</h1>
          <p className="text-muted-foreground">Создавайте реалистичные комментарии</p>
        </div>

        <div className="mb-6 max-w-md mx-auto">
          <Label htmlFor="language" className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4" />
            Язык интерфейса комментариев
          </Label>
          <LanguageSelector value={selectedLanguage.code} onChange={setSelectedLanguage} />
          <p className="text-xs text-muted-foreground mt-1">
            Выберите язык для кнопок "Нравится", "Ответить", "Сообщение"
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div className="space-y-6">
            <CommentForm onSubmit={addComment} language={selectedLanguage} />
          </div>

          {/* Right side - Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Предпросмотр</h2>
              {comments.length > 0 && (
                <Button onClick={exportToPNG} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Скачать PNG
                </Button>
              )}
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-4">
              <CommentPreview
                comments={comments}
                onAddReply={addReply}
                onDeleteComment={deleteComment}
                onDeleteReply={deleteReply}
                language={selectedLanguage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
