"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { languages, type Language } from "@/lib/languages"
import { cn } from "@/lib/utils"

interface LanguageSelectorProps {
  value: string
  onChange: (language: Language) => void
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selectedLanguage = languages.find((lang) => lang.code === value)

  const filteredLanguages = useMemo(() => {
    if (!search) return languages

    const searchLower = search.toLowerCase()
    return languages.filter(
      (lang) =>
        lang.code.toLowerCase().includes(searchLower) ||
        lang.name.toLowerCase().includes(searchLower) ||
        lang.nativeName.toLowerCase().includes(searchLower),
    )
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedLanguage ? (
            <span>
              {selectedLanguage.code} - {selectedLanguage.nativeName}
            </span>
          ) : (
            "Выберите язык..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Поиск языка... (например: GB, Bulgarian)"
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CommandList>
            <CommandEmpty>Язык не найден.</CommandEmpty>
            <CommandGroup>
              {filteredLanguages.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.code}
                  onSelect={() => {
                    onChange(language)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === language.code ? "opacity-100" : "opacity-0")} />
                  <span className="font-mono font-semibold mr-2">{language.code}</span>
                  <span className="text-muted-foreground mr-2">-</span>
                  <span>{language.nativeName}</span>
                  <span className="text-muted-foreground ml-2">({language.name})</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
