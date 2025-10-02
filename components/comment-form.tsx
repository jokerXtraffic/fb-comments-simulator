"use client"

import type React from "react"

import { useState, useId } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, X, Upload, ImageIcon } from "lucide-react"
import type { Comment } from "@/app/page"
import type { Language } from "@/lib/languages"

interface CommentFormProps {
  onSubmit: (comment: Omit<Comment, "id" | "replies">) => void
  parentId?: string
  buttonText?: string
  language?: Language
}

export function CommentForm({ onSubmit, buttonText = "Добавить комментарий", language }: CommentFormProps) {
  const formId = useId()
  const avatarInputId = `avatarUpload-${formId}`
  const imageInputId = `imageUpload-${formId}`

  const [userName, setUserName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [text, setText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [timeValue, setTimeValue] = useState(15)
  const [timeUnit, setTimeUnit] = useState<"min" | "hour" | "day" | "week" | "month" | "year">("min")
  const [likes, setLikes] = useState(0)
  const [loves, setLoves] = useState(0)
  const [reactions, setReactions] = useState(0)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName || !text) return

    onSubmit({
      userName,
      avatarUrl: avatarUrl || "/diverse-user-avatars.png",
      text,
      imageUrl: imageUrl || undefined,
      timeValue,
      timeUnit,
      likes,
      loves,
      reactions,
    })

    // Reset form
    setUserName("")
    setAvatarUrl("")
    setText("")
    setImageUrl("")
    setTimeValue(15)
    setTimeUnit("min")
    setLikes(0)
    setLoves(0)
    setReactions(0)
  }

  const getTimeUnitLabel = (unit: string) => {
    if (!language) {
      const labels: Record<string, string> = {
        min: "Минуты",
        hour: "Часы",
        day: "Дни",
        week: "Недели",
        month: "Месяцы",
        year: "Годы",
      }
      return labels[unit] || unit
    }
    return language.translations[unit as keyof typeof language.translations]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Новый комментарий
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Имя пользователя *</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Мария Петкова"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={avatarInputId}>Аватар</Label>
            <div className="flex gap-2">
              <input id={avatarInputId} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => document.getElementById(avatarInputId)?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Загрузить аватар
              </Button>
              {avatarUrl && avatarUrl !== "/diverse-user-avatars.png" && (
                <Button type="button" variant="outline" size="icon" onClick={() => setAvatarUrl("")} title="Удалить">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {avatarUrl && avatarUrl !== "/diverse-user-avatars.png" && (
              <div className="mt-2">
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-border"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Загрузите фото или оставьте пустым для автоматического аватара
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Текст комментария *</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Очень довольна имела страшные боли в коленях..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={imageInputId}>Фото в комментарии</Label>
            <div className="flex gap-2">
              <input id={imageInputId} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => document.getElementById(imageInputId)?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Загрузить фото
              </Button>
              {imageUrl && (
                <Button type="button" variant="outline" size="icon" onClick={() => setImageUrl("")} title="Удалить">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-[200px] h-auto rounded-lg border-2 border-border"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Время</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                min="1"
                value={timeValue}
                onChange={(e) => setTimeValue(Number.parseInt(e.target.value) || 1)}
                placeholder="15"
              />
              <Select value={timeUnit} onValueChange={(value: any) => setTimeUnit(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="min">{getTimeUnitLabel("min")}</SelectItem>
                  <SelectItem value="hour">{getTimeUnitLabel("hour")}</SelectItem>
                  <SelectItem value="day">{getTimeUnitLabel("day")}</SelectItem>
                  <SelectItem value="week">{getTimeUnitLabel("week")}</SelectItem>
                  <SelectItem value="month">{getTimeUnitLabel("month")}</SelectItem>
                  <SelectItem value="year">{getTimeUnitLabel("year")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="likes">👍 Лайки</Label>
              <Input
                id="likes"
                type="number"
                min="0"
                value={likes}
                onChange={(e) => setLikes(Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loves">❤️ Сердечки</Label>
              <Input
                id="loves"
                type="number"
                min="0"
                value={loves}
                onChange={(e) => setLoves(Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reactions">😮 Другие реакции</Label>
            <Input
              id="reactions"
              type="number"
              min="0"
              value={reactions}
              onChange={(e) => setReactions(Number.parseInt(e.target.value) || 0)}
            />
          </div>

          <Button type="submit" className="w-full">
            {buttonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
