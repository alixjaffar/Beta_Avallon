"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url?: string
  icon?: LucideIcon
  onClick?: () => void
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  activeTab?: string
  onTabChange?: (name: string) => void
  logo?: string
  ctaLabel?: string
  ctaOnClick?: () => void
}

export function NavBar({ 
  items, 
  className, 
  activeTab: controlledActiveTab, 
  onTabChange,
  logo = "Avallon",
  ctaLabel = "Login",
  ctaOnClick
}: NavBarProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(items[0]?.name || "")
  const [isMobile, setIsMobile] = useState(false)

  const activeTab = controlledActiveTab ?? internalActiveTab

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleClick = (item: NavItem) => {
    if (onTabChange) {
      onTabChange(item.name)
    } else {
      setInternalActiveTab(item.name)
    }
    if (item.onClick) {
      item.onClick()
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold tracking-tight text-zinc-100">{logo}</span>
          </div>

          {/* Nav Items - Center */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/50 backdrop-blur-sm py-1 px-1 rounded-full">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <button
                    key={item.name}
                    onClick={() => handleClick(item)}
                    className={cn(
                      "relative cursor-pointer text-sm font-medium px-5 py-2 rounded-full transition-all duration-300",
                      "text-zinc-400 hover:text-zinc-100",
                      isActive && "text-zinc-100",
                    )}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="tubelight"
                        className="absolute inset-0 w-full bg-zinc-800 rounded-full -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-400 rounded-t-full">
                          <div className="absolute w-12 h-6 bg-zinc-400/20 rounded-full blur-md -top-2 -left-2" />
                          <div className="absolute w-8 h-6 bg-zinc-400/30 rounded-full blur-md -top-1" />
                          <div className="absolute w-4 h-4 bg-zinc-400/20 rounded-full blur-sm top-0 left-2" />
                        </div>
                      </motion.div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* CTA Button - Right */}
          <div className="flex items-center gap-4">
            <button
              onClick={ctaOnClick}
              className="px-5 py-2 text-sm font-medium rounded-full bg-zinc-100 text-zinc-900 hover:bg-white transition-all duration-300"
            >
              {ctaLabel}
            </button>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name

              return Icon ? (
                <button
                  key={item.name}
                  onClick={() => handleClick(item)}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    isActive ? "text-zinc-100 bg-zinc-800" : "text-zinc-400",
                  )}
                >
                  <Icon size={18} strokeWidth={2.5} />
                </button>
              ) : null
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
