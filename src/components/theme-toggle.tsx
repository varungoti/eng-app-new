"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons"
import { themes } from "@/lib/themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const currentTheme = themes[theme as keyof typeof themes] || themes.light

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`fixed top-4 right-4 z-50 rounded-full w-10 h-10 ${currentTheme.background} ${currentTheme.text}`}
        >
        {theme === 'dark' ? (
            <Icon 
            type="phosphor"
            name="SUN"
            className="h-5 w-5"
            />
        ) : (
            <Icon 
            type="phosphor"
            name="MOON"
            className="h-5 w-5"
            />
        )}
        <span className="sr-only">Toggle theme</span>
        </Button>
    )
    } 