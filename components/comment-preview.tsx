"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Trash2 } from "lucide-react"
import { CommentForm } from "@/components/comment-form"
import type { Comment } from "@/app/page"
import type { Language } from "@/lib/languages"

interface CommentPreviewProps {
  comments: Comment[]
  onAddReply: (parentId: string, reply: Omit<Comment, "id" | "replies">) => void
  onDeleteComment: (id: string) => void
  onDeleteReply: (parentId: string, replyId: string) => void
  language: Language
}

export function CommentPreview({
  comments,
  onAddReply,
  onDeleteComment,
  onDeleteReply,
  language,
}: CommentPreviewProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Нет добавленных комментариев</p>
        <p className="text-sm">Используйте форму слева, чтобы добавить комментарий</p>
      </div>
    )
  }

  return (
    <div id="comments-preview" className="space-y-4 bg-white p-4">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-2">
          <CommentItem
            comment={comment}
            onDelete={() => onDeleteComment(comment.id)}
            onReply={() => setReplyingTo(comment.id)}
            language={language}
          />

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="ml-12 space-y-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onDelete={() => onDeleteReply(comment.id, reply.id)}
                  language={language}
                  isReply
                />
              ))}
            </div>
          )}

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="ml-12 mt-4">
              <CommentForm
                key={`reply-${comment.id}-${Date.now()}`}
                onSubmit={(reply) => {
                  onAddReply(comment.id, reply)
                  setReplyingTo(null)
                }}
                buttonText="Добавить ответ"
                language={language}
              />
              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="mt-2">
                Отмена
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  onDelete: () => void
  onReply?: () => void
  isReply?: boolean
  language: Language
}

function CommentItem({ comment, onDelete, onReply, isReply, language }: CommentItemProps) {
  const totalReactions = comment.likes + comment.loves + comment.reactions

  const formattedTimestamp = `${comment.timeValue} ${language.translations[comment.timeUnit]}`

  return (
    <div className="flex gap-2 group">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={comment.avatarUrl || "/placeholder.svg"} alt={comment.userName} />
        <AvatarFallback>{comment.userName[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="bg-[#f0f2f5] rounded-2xl px-3 py-2 inline-block max-w-full">
          <div className="font-semibold text-[13px] text-[#050505]">{comment.userName}</div>
          <div className="text-[15px] text-[#050505] leading-5 whitespace-pre-wrap break-words">{comment.text}</div>
        </div>

        {comment.imageUrl && (
          <div className="mt-1">
            <img
              src={comment.imageUrl || "/placeholder.svg"}
              alt="Comment attachment"
              className="rounded-lg max-w-[300px] h-auto"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mt-1 px-3">
          <span className="text-[13px] text-[#65676b] font-semibold">{formattedTimestamp}</span>

          {totalReactions > 0 && (
            <button className="text-[13px] text-[#65676b] font-semibold hover:underline">
              {language.translations.like}
            </button>
          )}

          {!isReply && onReply && (
            <button onClick={onReply} className="text-[13px] text-[#65676b] font-semibold hover:underline">
              {language.translations.reply}
            </button>
          )}

          <button className="text-[13px] text-[#65676b] font-semibold hover:underline">
            {language.translations.message}
          </button>

          <button onClick={onDelete} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>

        {totalReactions > 0 && (
          <div className="flex items-center gap-1 mt-1 px-3">
            <div className="flex items-center">
              {comment.likes > 0 && (
                <span className="text-[13px] bg-[#1877f2] text-white rounded-full w-[18px] h-[18px] flex items-center justify-center">
                  👍
                </span>
              )}
              {comment.loves > 0 && <span className="text-[13px] -ml-1">❤️</span>}
              {comment.reactions > 0 && <span className="text-[13px] -ml-1">😮</span>}
            </div>
            <span className="text-[13px] text-[#65676b] ml-1">{totalReactions}</span>
          </div>
        )}
      </div>
    </div>
  )
}
