import { framer } from "@framer/plugin"
import type { ChatConfig } from "../types"
import { ICONS } from "../widget/icons"
import { MODAL_THEME_GRADIENTS } from "../core/config"

export function generateComponentCode(config: ChatConfig): string {
    const iconEntries = Object.entries(ICONS)
        .map(([key, svg]) => `  ${JSON.stringify(key)}: ${JSON.stringify(svg)},`)
        .join("\n")

    const gradient = config.modalTheme === "custom" && config.modalCustomGradient
        ? config.modalCustomGradient
        : MODAL_THEME_GRADIENTS[config.modalTheme] || MODAL_THEME_GRADIENTS.whatsapp

    const defaultAgentsJson = JSON.stringify(
        config.agents && config.agents.length > 0
            ? config.agents
            : [
                  {
                      id: "agent-1",
                      name: "Alex",
                      role: "Support Manager",
                      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
                      channelId: "whatsapp",
                  },
                  {
                      id: "agent-2",
                      name: "Sarah",
                      role: "Customer Support",
                      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
                      channelId: "messenger",
                  },
                  {
                      id: "agent-3",
                      name: "David",
                      role: "Technical Team",
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
                      channelId: "telegram",
                  },
              ]
    )

    return `import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

const ICONS: Record<string, string> = {
${iconEntries}
}

const GRADIENTS: Record<string, string> = {
  whatsapp: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
  messenger: "linear-gradient(135deg, #0084FF 0%, #00C6FF 100%)",
  telegram: "linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)",
  instagram: "linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)",
  tiktok: "linear-gradient(135deg, #111111 0%, #1f2937 60%, #FE2C55 100%)",
  wechat: "linear-gradient(135deg, #07C160 0%, #048843 100%)",
  dark: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
  custom: ${JSON.stringify(gradient)},
}

const LAUNCHER_ICONS: Record<string, string> = {
  chat: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 14H5.2L4 17.2V4h16v12Z"/><circle cx="8" cy="10" r="1.5"/><circle cx="12" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.5 3.5A11.7 11.7 0 0 0 12.1 0C5.7 0 .5 5.2.5 11.6c0 2 .5 4 1.5 5.7L.4 23.9l6.8-1.8a11.6 11.6 0 0 0 4.9 1.1h.1c6.4 0 11.6-5.2 11.6-11.6 0-3.1-1.2-6-3.3-8.1Zm-8.4 17.7h-.1c-1.5 0-3-.4-4.3-1.1l-.3-.2-4 1 1.1-3.9-.2-.3a9.6 9.6 0 0 1-1.5-5.1C2.8 6.3 7 2 12.2 2c2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7 0 5.3-4.3 9.7-9.6 9.7Zm5.3-7.2c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.8-2.1-.2-.3 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.3 3.6 5.7 5 .8.3 1.4.5 1.9.6.8.3 1.5.2 2.1.1.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg>',
  messenger: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 1C5.8 1 1 5.5 1 11.4c0 3.3 1.6 6.2 4.2 8.1V23l3.9-2.1c.9.2 1.9.3 2.9.3 6.2 0 11-4.5 11-10.4S18.2 1 12 1Zm1.1 13.9-2.8-3-5.5 3 6.1-6.5 2.8 3 5.4-3-6 6.5Z"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="m21.5 3.5-3.2 16.1c-.2 1.1-.8 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.7-7.9c.4-.4-.1-.6-.6-.2L6.3 13.7 1.7 12.2c-1-.3-1-1 .2-1.5L20 3.2c.8-.3 1.8.2 1.5.3Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.3 6.2a1.1 1.1 0 1 1-1.1 1.1 1.1 0 0 1 1.1-1.1Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6.7 2.2 9 1.7c.6-.1 1.1.2 1.3.7l1.1 2.7c.2.5.1 1-.3 1.4L9.7 7.9c1.1 2.2 2.7 3.9 4.9 4.9l1.4-1.4c.4-.4.9-.5 1.4-.3l2.7 1.1c.5.2.8.7.7 1.3l-.5 2.3c-.1.6-.7 1-1.3 1-8.1-.2-14.5-6.6-14.7-14.7 0-.6.4-1.2 1-1.3Z"/></svg>',
  email: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 4h18c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 3.1v.3l9 5.6 9-5.6v-.3H3Zm18 2.6-8.5 5.3a1 1 0 0 1-1 0L3 9.7V18h18V9.7Z"/></svg>',
  support: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h1v-6H5v-1a7 7 0 1 1 14 0v1h-2v6h1a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9Zm-5 13v3H6a1 1 0 0 1-1-1v-2h2Zm12 2a1 1 0 0 1-1 1h-1v-3h2v2Z"/></svg>',
}

interface ChatficProps {
    style?: React.CSSProperties
    canvasPreview?: "modal" | "chat" | "closed"
    widgetMode?: "modal" | "buttons"
    modalTheme?: "whatsapp" | "messenger" | "telegram" | "instagram" | "tiktok" | "wechat" | "dark" | "custom"
    modalCustomGradient?: string
    modalTitle?: string
    modalSubtitle?: string
    modalResponseTime?: string
    modalChatBubble?: string
    modalStartChatText?: string
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
    layout?: "stack" | "grid" | "horizontal"
    animation?: "pop" | "bounce" | "slide" | "pulse" | "none"
    buttonColor?: string
    buttonShape?: "circle" | "rounded" | "pill"
    launcherText?: string
    launcherIcon?: "chat" | "whatsapp" | "messenger" | "telegram" | "instagram" | "phone" | "email" | "support"
    showLabels?: boolean
    mobileShowLabels?: boolean
    mobileOffsetX?: number
    mobileOffsetY?: number
    closeOnOutsideClick?: boolean
    closeOnEscape?: boolean
    closeAfterClick?: boolean
    autoOpen?: boolean
    autoOpenDelay?: number
    ariaLabel?: string
    greetingEnabled?: boolean
    greetingText?: string
    showBadge?: boolean
    badgeText?: string
    whatsapp?: string
    whatsappMessage?: string
    messenger?: string
    telegram?: string
    telegramMessage?: string
    instagram?: string
    tiktok?: string
    wechat?: string
    viber?: string
    line?: string
    signal?: string
    phone?: string
    email?: string
    custom?: string
}

export default function Chatfic(props: ChatficProps) {
    const {
        style,
        canvasPreview = "modal",
        widgetMode = ${JSON.stringify(config.widgetMode || "modal")},
        modalTheme = ${JSON.stringify(config.modalTheme || "whatsapp")},
        modalCustomGradient = ${JSON.stringify(config.modalCustomGradient || "")},
        modalTitle = ${JSON.stringify(config.modalTitle || "Hi there!")},
        modalSubtitle = ${JSON.stringify(config.modalSubtitle || "Welcome to our live chat! Feel free to ask any questions.")},
        modalResponseTime = ${JSON.stringify(config.modalResponseTime || "We typically reply within a few minutes")},
        modalChatBubble = ${JSON.stringify(config.modalChatBubble || "We typically reply within a few minutes. How can we help you today?")},
        modalStartChatText = ${JSON.stringify(config.modalStartChatText || "Start chat")},
        position = ${JSON.stringify(config.position || "bottom-right")},
        layout = ${JSON.stringify(config.layout || "stack")},
        animation = ${JSON.stringify(config.animation || "pop")},
        buttonColor = ${JSON.stringify(config.buttonColor || "#25D366")},
        buttonShape = ${JSON.stringify(config.buttonShape || "circle")},
        launcherText = "Chat",
        launcherIcon = ${JSON.stringify(config.launcherIcon || "chat")},
        showLabels = ${Boolean(config.showLabels)},
        mobileShowLabels = ${Boolean(config.mobileShowLabels ?? false)},
        mobileOffsetX = ${Number(config.mobileOffsetX ?? 16)},
        mobileOffsetY = ${Number(config.mobileOffsetY ?? 16)},
        closeOnOutsideClick = ${Boolean(config.closeOnOutsideClick ?? true)},
        closeOnEscape = ${Boolean(config.closeOnEscape ?? true)},
        closeAfterClick = ${Boolean(config.closeAfterClick ?? true)},
        autoOpen = ${Boolean(config.autoOpen)},
        autoOpenDelay = ${Number(config.autoOpenDelay ?? 1200)},
        ariaLabel = ${JSON.stringify(config.ariaLabel || "Open chat options")},
        greetingEnabled = ${Boolean(config.greetingEnabled)},
        greetingText = ${JSON.stringify(config.greetingText || "Need help? Chat with us.")},
        showBadge = ${Boolean(config.showBadge)},
        badgeText = ${JSON.stringify(config.badgeText || "1")},
        whatsapp = ${JSON.stringify(config.channels.find((c) => c.id === "whatsapp")?.value || "")},
        whatsappMessage = ${JSON.stringify(config.channels.find((c) => c.id === "whatsapp")?.message || "Hello! I would like to know more.")},
        messenger = ${JSON.stringify(config.channels.find((c) => c.id === "messenger")?.value || "")},
        telegram = ${JSON.stringify(config.channels.find((c) => c.id === "telegram")?.value || "")},
        telegramMessage = ${JSON.stringify(config.channels.find((c) => c.id === "telegram")?.message || "Hello!")},
        instagram = ${JSON.stringify(config.channels.find((c) => c.id === "instagram")?.value || "")},
        tiktok = ${JSON.stringify(config.channels.find((c) => c.id === "tiktok")?.value || "")},
        wechat = ${JSON.stringify(config.channels.find((c) => c.id === "wechat")?.value || "")},
        viber = ${JSON.stringify(config.channels.find((c) => c.id === "viber")?.value || "")},
        line = ${JSON.stringify(config.channels.find((c) => c.id === "line")?.value || "")},
        signal = ${JSON.stringify(config.channels.find((c) => c.id === "signal")?.value || "")},
        phone = ${JSON.stringify(config.channels.find((c) => c.id === "phone")?.value || "")},
        email = ${JSON.stringify(config.channels.find((c) => c.id === "email")?.value || "")},
        custom = ${JSON.stringify(config.channels.find((c) => c.id === "custom")?.value || "")},
    } = props

    const isCanvas = typeof RenderTarget !== "undefined" && typeof RenderTarget.current === "function" && RenderTarget.current() === RenderTarget.canvas
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = React.useState(isCanvas ? canvasPreview !== "closed" : false)
    const [greetingDismissed, setGreetingDismissed] = React.useState(false)
    const [selectedAgent, setSelectedAgent] = React.useState<any | null>(null)
    const [customMessage, setCustomMessage] = React.useState("")

    React.useEffect(() => {
        if (!isCanvas && autoOpen) {
            const timer = setTimeout(() => {
                setIsOpen(true)
            }, autoOpenDelay)
            return () => clearTimeout(timer)
        }
    }, [isCanvas, autoOpen, autoOpenDelay])

    React.useEffect(() => {
        if (!isOpen) return
        if (isCanvas) return
        function handleKeyDown(e: KeyboardEvent) {
            if (closeOnEscape && e.key === "Escape") {
                setIsOpen(false)
                setSelectedAgent(null)
            }
        }
        function handleClickOutside(e: MouseEvent) {
            if (!containerRef.current) return
            const path = typeof e.composedPath === "function" ? e.composedPath() : []
            if (path.length > 0) {
                if (path.includes(containerRef.current)) return
            } else {
                const target = e.target as Node | null
                if (target && (containerRef.current.contains(target) || !document.contains(target))) return
            }
            if (closeOnOutsideClick) {
                setIsOpen(false)
                setSelectedAgent(null)
            }
        }

        const timer = setTimeout(() => {
            window.addEventListener("click", handleClickOutside)
        }, 0)
        window.addEventListener("keydown", handleKeyDown)

        return () => {
            clearTimeout(timer)
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("click", handleClickOutside)
        }
    }, [isOpen, closeOnEscape, closeOnOutsideClick])

    const rawAgents = React.useMemo(() => ${defaultAgentsJson}, [])

    // Synchronize canvas preview state in Framer design canvas mode
    React.useEffect(() => {
        if (isCanvas) {
            setIsOpen(canvasPreview !== "closed")
            if (canvasPreview === "chat" && rawAgents.length > 0) {
                setSelectedAgent(rawAgents[0])
            } else if (canvasPreview !== "chat") {
                setSelectedAgent(null)
            }
        }
    }, [isCanvas, canvasPreview, rawAgents])

    const channels = React.useMemo(() => {
        const list: Array<{ id: string; label: string; url: string; color: string; value: string; message: string }> = []
        if (whatsapp && whatsapp.trim()) {
            const clean = whatsapp.replace(/[^0-9]/g, "")
            const msg = whatsappMessage ? "?text=" + encodeURIComponent(whatsappMessage) : ""
            list.push({ id: "whatsapp", label: "WhatsApp", url: "https://wa.me/" + clean + msg, color: "#25D366", value: whatsapp, message: whatsappMessage })
        }
        if (messenger && messenger.trim()) {
            const handle = messenger.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
            list.push({ id: "messenger", label: "Messenger", url: "https://m.me/" + handle, color: "#0084FF", value: messenger, message: "" })
        }
        if (telegram && telegram.trim()) {
            const handle = telegram.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
            const msg = telegramMessage ? "?text=" + encodeURIComponent(telegramMessage) : ""
            list.push({ id: "telegram", label: "Telegram", url: "https://t.me/" + handle + msg, color: "#229ED9", value: telegram, message: telegramMessage })
        }
        if (instagram && instagram.trim()) {
            const handle = instagram.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
            list.push({ id: "instagram", label: "Instagram", url: "https://instagram.com/" + handle, color: "#E1306C", value: instagram, message: "" })
        }
        if (tiktok && tiktok.trim()) {
            const handle = tiktok.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
            list.push({ id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@" + handle, color: "#111111", value: tiktok, message: "" })
        }
        if (wechat && wechat.trim()) {
            const url = (wechat.startsWith("http://") || wechat.startsWith("https://")) ? wechat : "https://u.wechat.com/" + wechat.replace(/[^a-zA-Z0-9._-]/g, "")
            list.push({ id: "wechat", label: "WeChat", url, color: "#07C160", value: wechat, message: "" })
        }
        if (viber && viber.trim()) {
            const clean = viber.replace(/[^0-9+]/g, "")
            list.push({ id: "viber", label: "Viber", url: "viber://chat?number=" + encodeURIComponent(clean), color: "#7360F2", value: viber, message: "" })
        }
        if (line && line.trim()) {
            const handle = line.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
            list.push({ id: "line", label: "LINE", url: "https://line.me/R/ti/p/~" + handle, color: "#06C755", value: line, message: "" })
        }
        if (signal && signal.trim()) {
            const url = (signal.startsWith("http://") || signal.startsWith("https://")) ? signal : "https://signal.me/#p/" + encodeURIComponent(signal)
            list.push({ id: "signal", label: "Signal", url, color: "#3A76F0", value: signal, message: "" })
        }
        if (phone && phone.trim()) {
            list.push({ id: "phone", label: "Phone", url: "tel:" + phone.replace(/[^0-9+]/g, ""), color: "#111827", value: phone, message: "" })
        }
        if (email && email.trim()) {
            const cleanEmail = email.replace(/[^a-zA-Z0-9._%+\-@]/g, "")
            list.push({ id: "email", label: "Email", url: "mailto:" + cleanEmail, color: "#EA4335", value: email, message: "" })
        }
        if (custom && custom.trim()) {
            list.push({ id: "custom", label: "Custom", url: custom, color: "#111827", value: custom, message: "" })
        }
        if (list.length === 0) {
            list.push({ id: "whatsapp", label: "WhatsApp", url: "https://wa.me/", color: "#25D366", value: "", message: "Hello!" })
        }
        return list
    }, [whatsapp, whatsappMessage, messenger, telegram, telegramMessage, instagram, tiktok, wechat, viber, line, signal, phone, email, custom])

    const agents = React.useMemo(() => {
        return rawAgents.map((ag: any) => {
            const ch = channels.find((c) => c.id === ag.channelId) || channels[0]
            const rawAv = ag.avatar || ""
            const safeAvatar = (rawAv.startsWith("http://") || rawAv.startsWith("https://") || rawAv.startsWith("data:image/"))
                ? rawAv
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
            const rawVal = ag.value || (ch ? ch.value : "")
            const rawMsg = ag.message || (ch ? ch.message : "")
            let directUrl = ch ? ch.url : "https://wa.me/"
            if (ag.channelId === "whatsapp") {
                const clean = rawVal.replace(/[^0-9]/g, "")
                directUrl = clean ? "https://wa.me/" + clean + (rawMsg ? "?text=" + encodeURIComponent(rawMsg) : "") : "https://wa.me/"
            } else if (ag.channelId === "telegram") {
                const handle = rawVal.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
                directUrl = handle ? "https://t.me/" + handle + (rawMsg ? "?text=" + encodeURIComponent(rawMsg) : "") : "https://t.me/"
            } else if (ag.channelId === "messenger") {
                const handle = rawVal.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
                directUrl = handle ? "https://m.me/" + handle : "https://m.me/"
            } else if (ag.channelId === "instagram") {
                const handle = rawVal.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
                directUrl = handle ? "https://instagram.com/" + handle : "https://instagram.com/"
            } else if (ag.channelId === "tiktok") {
                const handle = rawVal.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
                directUrl = handle ? "https://www.tiktok.com/@" + handle : "https://www.tiktok.com/"
            } else if (ag.channelId === "wechat") {
                directUrl = (rawVal.startsWith("http://") || rawVal.startsWith("https://")) ? rawVal : "https://u.wechat.com/" + rawVal.replace(/[^a-zA-Z0-9._-]/g, "")
            } else if (ag.channelId === "viber") {
                directUrl = "viber://chat?number=" + encodeURIComponent(rawVal.replace(/[^0-9+]/g, ""))
            } else if (ag.channelId === "line") {
                directUrl = "https://line.me/R/ti/p/~" + rawVal.replace(/^@/, "")
            } else if (ag.channelId === "signal") {
                directUrl = (rawVal.startsWith("http://") || rawVal.startsWith("https://")) ? rawVal : "https://signal.me/#p/" + encodeURIComponent(rawVal)
            } else if (ag.channelId === "phone") {
                directUrl = "tel:" + rawVal.replace(/[^0-9+]/g, "")
            } else if (ag.channelId === "email") {
                directUrl = "mailto:" + rawVal.replace(/[^a-zA-Z0-9._%+\-@]/g, "") + (rawMsg ? "?body=" + encodeURIComponent(rawMsg) : "")
            } else if (ag.channelId === "custom") {
                directUrl = (rawVal && !/^\s*(javascript|data|vbscript):/i.test(rawVal)) ? rawVal : "#"
            }
            return {
                ...ag,
                avatar: safeAvatar,
                color: ch ? ch.color : "#25D366",
                url: directUrl,
                value: rawVal,
                message: rawMsg,
                channelLabel: ch ? ch.label : "WhatsApp",
            }
        })
    }, [rawAgents, channels])

    const isPill = buttonShape === "pill"
    const isRounded = buttonShape === "rounded"
    const radius = isPill ? "999px" : isRounded ? "16px" : "50%"
    const hasPillLabel = isPill && Boolean(launcherText && launcherText.trim())
    const btnWidth = isPill ? (hasPillLabel ? "auto" : 84) : 58
    const btnHeight = 58
    const isBottom = position.startsWith("bottom")
    const isRight = position.endsWith("right")
    const headerGradient = modalTheme === "custom" && modalCustomGradient
        ? modalCustomGradient
        : (GRADIENTS[modalTheme] || GRADIENTS.whatsapp)
    const activeLauncherIconSvg = LAUNCHER_ICONS[launcherIcon] || LAUNCHER_ICONS.chat

    const btnAnimation = animation === "bounce"
        ? "cfBounce 1.6s ease infinite"
        : animation === "pulse"
        ? "cfPulse 2s ease infinite"
        : animation === "pop"
        ? "cfPopIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both"
        : animation === "slide"
        ? "cfSlideUp 0.35s ease both"
        : "none"

    const containerStyle: React.CSSProperties = {
        ...style,
        width: btnWidth,
        height: btnHeight,
        position: "relative",
        overflow: "visible",
        display: "inline-flex",
        alignItems: isBottom ? "flex-end" : "flex-start",
        justifyContent: isRight ? "flex-end" : "flex-start",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
    }

    const mainBtnStyle: React.CSSProperties = {
        width: btnWidth,
        minWidth: isPill ? (hasPillLabel ? 92 : 84) : 58,
        height: btnHeight,
        borderRadius: radius,
        backgroundColor: buttonColor,
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: hasPillLabel ? "0 18px" : 0,
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
        position: "relative",
        flexShrink: 0,
        zIndex: 50,
        outline: "none",
        animation: isOpen ? "none" : btnAnimation,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 14,
        fontWeight: 600,
    }

    const modalStyle: React.CSSProperties = {
        position: "absolute",
        bottom: isBottom ? 70 : "auto",
        top: !isBottom ? 70 : "auto",
        right: isRight ? 0 : "auto",
        left: !isRight ? 0 : "auto",
        width: 350,
        maxWidth: "calc(100vw - 32px)",
        maxHeight: "calc(100vh - 120px)",
        backgroundColor: "#ffffff",
        borderRadius: 24,
        boxShadow: "0 24px 60px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        animation: "cfFadeIn .22s ease both",
    }

    return (
        <div ref={containerRef} style={containerStyle}>
            <style>{\`
              @keyframes cfFadeIn { from { opacity: 0; transform: translateY(10px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
              @keyframes cfPopIn { 0% { transform: scale(0.7); opacity: 0; } 70% { transform: scale(1.06); } 100% { transform: scale(1); opacity: 1; } }
              @keyframes cfBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
              @keyframes cfPulse { 0%, 100% { transform: scale(1); box-shadow: 0 12px 30px rgba(0,0,0,0.25); } 50% { transform: scale(1.05); box-shadow: 0 16px 36px rgba(0,0,0,0.35); } }
              @keyframes cfSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

              a.cf-channel-btn, .cf-channel-btn {
                width: 44px !important;
                height: 44px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
              }
              a.cf-channel-btn svg, .cf-channel-btn svg, a svg {
                width: 22px !important;
                height: 22px !important;
                max-width: 22px !important;
                max-height: 22px !important;
                min-width: 22px !important;
                min-height: 22px !important;
                display: block !important;
                margin: auto !important;
              }
              button.cf-main-btn svg {
                width: 24px !important;
                height: 24px !important;
                max-width: 24px !important;
                max-height: 24px !important;
                display: block !important;
                margin: auto !important;
              }

              button.cf-header-btn {
                width: 28px !important;
                height: 28px !important;
                min-width: 28px !important;
                min-height: 28px !important;
                border-radius: 50% !important;
                background: rgba(255, 255, 255, 0.22) !important;
                border: none !important;
                color: #ffffff !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0 !important;
                margin: 0 !important;
                line-height: 0 !important;
                box-sizing: border-box !important;
                transition: background 0.15s ease !important;
              }
              button.cf-header-btn:hover {
                background: rgba(255, 255, 255, 0.35) !important;
              }
              button.cf-header-btn svg {
                width: 11px !important;
                height: 11px !important;
                max-width: 11px !important;
                max-height: 11px !important;
                min-width: 11px !important;
                min-height: 11px !important;
                display: block !important;
                margin: 0 !important;
              }
            \`}</style>
            <button
                type="button"
                className="cf-main-btn"
                style={mainBtnStyle}
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                    if (isOpen) setSelectedAgent(null)
                }}
                aria-label={ariaLabel}
                aria-expanded={isOpen}
            >
                <div
                    style={{
                        width: 24,
                        height: 24,
                        display: "grid",
                        placeItems: "center",
                        transition: "transform 0.25s ease",
                        transform: isOpen ? "rotate(45deg)" : "none",
                        flexShrink: 0,
                    }}
                    dangerouslySetInnerHTML={{
                        __html: isOpen
                            ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
                            : activeLauncherIconSvg,
                    }}
                />
                {hasPillLabel ? (
                    <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
                        {isOpen ? "Close" : launcherText}
                    </span>
                ) : null}
                {showBadge && !isOpen ? (
                    <span
                        style={{
                            position: "absolute",
                            top: -2,
                            right: -2,
                            minWidth: 18,
                            height: 18,
                            padding: "0 4px",
                            borderRadius: 999,
                            background: "#ef4444",
                            color: "#ffffff",
                            border: "2px solid #ffffff",
                            fontSize: 10,
                            fontWeight: 700,
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        {badgeText}
                    </span>
                ) : null}
            </button>

            {greetingEnabled && !greetingDismissed && !isOpen ? (
                <div
                    style={{
                        position: "absolute",
                        bottom: isBottom ? 70 : "auto",
                        top: !isBottom ? 70 : "auto",
                        right: isRight ? 0 : "auto",
                        left: !isRight ? 0 : "auto",
                        backgroundColor: "#ffffff",
                        color: "#111827",
                        padding: "10px 14px",
                        borderRadius: 14,
                        fontSize: 13,
                        fontWeight: 500,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        whiteSpace: "nowrap",
                        width: "max-content",
                        maxWidth: 320,
                        zIndex: 100,
                    }}
                >
                    <span>{greetingText}</span>
                    <button
                        type="button"
                        onClick={() => setGreetingDismissed(true)}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: 16,
                            lineHeight: 1,
                            color: "#9ca3af",
                            padding: 0,
                        }}
                    >
                        x
                    </button>
                </div>
            ) : null}

            {isOpen && widgetMode === "modal" ? (
                <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                    <div
                        style={{
                            background: headerGradient,
                            color: "#ffffff",
                            padding: "20px 18px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {selectedAgent ? (
                                <button
                                    type="button"
                                    className="cf-header-btn"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedAgent(null)
                                    }}
                                    aria-label="Back to agent list"
                                    style={{
                                        background: "rgba(255,255,255,0.22)",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 28,
                                        height: 28,
                                        minWidth: 28,
                                        minHeight: 28,
                                        color: "#ffffff",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 0,
                                        margin: 0,
                                        boxSizing: "border-box",
                                    }}
                                >
                                    <svg
                                        width="11"
                                        height="11"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ display: "block" }}
                                    >
                                        <path d="M9.5 4L5.5 8l4 4" />
                                    </svg>
                                </button>
                            ) : null}
                            <button
                                type="button"
                                className="cf-header-btn"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsOpen(false)
                                    setSelectedAgent(null)
                                }}
                                aria-label="Close chat"
                                style={{
                                    background: "rgba(255,255,255,0.22)",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: 28,
                                    height: 28,
                                    minWidth: 28,
                                    minHeight: 28,
                                    color: "#ffffff",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 0,
                                    margin: 0,
                                    marginLeft: "auto",
                                    boxSizing: "border-box",
                                }}
                            >
                                <svg
                                    width="11"
                                    height="11"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ display: "block" }}
                                >
                                    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
                                </svg>
                            </button>
                        </div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
                            {selectedAgent ? selectedAgent.name : modalTitle}
                        </h3>
                        <p style={{ margin: 0, fontSize: 13, opacity: 0.92, lineHeight: 1.4 }}>
                            {selectedAgent ? selectedAgent.role : modalSubtitle}
                        </p>
                        {!selectedAgent && modalResponseTime ? (
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    background: "rgba(255,255,255,0.22)",
                                    padding: "3px 10px",
                                    borderRadius: 999,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    width: "max-content",
                                    marginTop: 4,
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3.2l2.2 1.3"/></svg>
                                <span>{modalResponseTime}</span>
                            </span>
                        ) : null}
                    </div>

                    {!selectedAgent ? (
                        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
                            {agents.map((agent: any) => (
                                <div
                                    key={agent.id}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedAgent(agent)
                                        setCustomMessage(agent.message || "")
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "10px 12px",
                                        borderRadius: 14,
                                        backgroundColor: "#f9fafb",
                                        border: "1px solid #f3f4f6",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ position: "relative", width: 42, height: 42, flexShrink: 0 }}>
                                        <img
                                            src={agent.avatar}
                                            alt={agent.name}
                                            style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }}
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                bottom: -2,
                                                right: -2,
                                                width: 17,
                                                height: 17,
                                                borderRadius: "50%",
                                                background: agent.color,
                                                display: "grid",
                                                placeItems: "center",
                                                border: "2px solid #ffffff",
                                                color: "#ffffff",
                                            }}
                                            dangerouslySetInnerHTML={{ __html: ICONS[agent.channelId] || "" }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{agent.name}</div>
                                        <div style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {agent.role}
                                        </div>
                                    </div>
                                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3.5L10.5 8L6 12.5"/></svg>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                            <div
                                style={{
                                    backgroundColor: "#f3f4f6",
                                    color: "#1f2937",
                                    padding: "12px 14px",
                                    borderRadius: "16px 16px 16px 4px",
                                    fontSize: 13,
                                    lineHeight: 1.45,
                                }}
                            >
                                {modalChatBubble || selectedAgent.message || "We typically reply within a few minutes. How can we help you today?"}
                            </div>
                            <input
                                type="text"
                                placeholder={selectedAgent.message ? selectedAgent.message : "Type your message..."}
                                maxLength={500}
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                            <a
                                href={(() => {
                                    const msg = customMessage.trim() || (selectedAgent.message || "").trim()
                                    const rawVal = String(selectedAgent.value || "").trim()
                                    if (selectedAgent.channelId === "whatsapp") {
                                        const clean = rawVal.replace(/[^0-9]/g, "")
                                        return clean ? "https://wa.me/" + clean + (msg ? "?text=" + encodeURIComponent(msg) : "") : "https://wa.me/"
                                    }
                                    if (selectedAgent.channelId === "telegram") {
                                        const handle = rawVal.replace(/^@/, "").replace(/[^a-zA-Z0-9._-]/g, "")
                                        return handle ? "https://t.me/" + handle + (msg ? "?text=" + encodeURIComponent(msg) : "") : "https://t.me/"
                                    }
                                    if (selectedAgent.channelId === "email") {
                                        const cleanEmail = rawVal.replace(/[^a-zA-Z0-9._%+\-@]/g, "")
                                        return cleanEmail ? "mailto:" + cleanEmail + (msg ? "?body=" + encodeURIComponent(msg) : "") : "mailto:"
                                    }
                                    return selectedAgent.url || "#"
                                })()}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (closeAfterClick) {
                                        setIsOpen(false)
                                        setSelectedAgent(null)
                                    }
                                }}
                                style={{
                                    background: headerGradient,
                                    color: "#ffffff",
                                    borderRadius: 999,
                                    padding: "12px 20px",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    textAlign: "center",
                                    textDecoration: "none",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.16)",
                                    display: "block",
                                }}
                            >
                                {modalStartChatText}
                            </a>
                        </div>
                    )}
                </div>
            ) : null}

            {isOpen && widgetMode === "buttons" ? (
                <div
                    style={{
                        position: "absolute",
                        bottom: isBottom ? 68 : "auto",
                        top: !isBottom ? 68 : "auto",
                        right: isRight ? 0 : "auto",
                        left: !isRight ? 0 : "auto",
                        zIndex: 90,
                        gap: 10,
                        ...(layout === "grid"
                            ? {
                                  display: "grid",
                                  gridTemplateColumns: "repeat(2, auto)",
                                  alignItems: "center",
                              }
                            : layout === "horizontal"
                            ? {
                                  display: "flex",
                                  flexDirection: isRight ? "row-reverse" : "row",
                                  alignItems: "center",
                              }
                            : {
                                  display: "flex",
                                  flexDirection: isBottom ? "column-reverse" : "column",
                                  alignItems: isRight ? "flex-end" : "flex-start",
                              }),
                    }}
                >
                    {channels.map((channel) => (
                        <div
                            key={channel.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                flexDirection: isRight ? "row-reverse" : "row",
                            }}
                        >
                            <a
                                href={channel.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    if (closeAfterClick) setIsOpen(false)
                                }}
                                className="cf-channel-btn"
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: radius,
                                    backgroundColor: channel.color,
                                    color: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                                    textDecoration: "none",
                                    flexShrink: 0,
                                    overflow: "hidden",
                                    padding: 0,
                                }}
                            >
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        overflow: "hidden",
                                    }}
                                    dangerouslySetInnerHTML={{ __html: ICONS[channel.id] || "" }}
                                />
                            </a>
                            {showLabels ? (
                                <span
                                    style={{
                                        backgroundColor: "#ffffff",
                                        color: "#111827",
                                        padding: "4px 9px",
                                        borderRadius: 6,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {channel.label}
                                </span>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

Chatfic.defaultProps = {
    width: 60,
    height: 60,
    canvasPreview: "modal",
    widgetMode: ${JSON.stringify(config.widgetMode || "modal")},
}

addPropertyControls(Chatfic, {
    canvasPreview: {
        type: ControlType.Enum,
        title: "Canvas State",
        options: ["modal", "chat", "closed"],
        optionTitles: ["Open Modal", "Agent Chat", "Launcher Button"],
        defaultValue: "modal",
    },
    widgetMode: {
        type: ControlType.Enum,
        title: "Widget Mode",
        options: ["modal", "buttons"],
        optionTitles: ["Live Chat Modal", "Icon Buttons"],
        defaultValue: ${JSON.stringify(config.widgetMode || "modal")},
    },
    modalTheme: {
        type: ControlType.Enum,
        title: "Modal Theme",
        options: ["whatsapp", "messenger", "telegram", "instagram", "tiktok", "wechat", "dark", "custom"],
        optionTitles: ["WhatsApp Green", "Messenger Blue", "Telegram Sky", "Instagram Gradient", "TikTok Dark", "WeChat Green", "Modern Dark", "Custom"],
        defaultValue: ${JSON.stringify(config.modalTheme || "whatsapp")},
        hidden(props: any) {
            return props.widgetMode === "buttons"
        },
    },
    modalCustomGradient: {
        type: ControlType.String,
        title: "Custom Gradient",
        defaultValue: ${JSON.stringify(config.modalCustomGradient || "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)")},
        hidden(props: any) {
            return props.widgetMode === "buttons" || props.modalTheme !== "custom"
        },
    },
    modalTitle: {
        type: ControlType.String,
        title: "Modal Title",
        defaultValue: ${JSON.stringify(config.modalTitle || "Hi there!")},
        hidden(props: any) {
            return props.widgetMode === "buttons"
        },
    },
    modalSubtitle: {
        type: ControlType.String,
        title: "Subtitle",
        defaultValue: ${JSON.stringify(config.modalSubtitle || "Welcome to our live chat! Feel free to ask any questions.")},
        hidden(props: any) {
            return props.widgetMode === "buttons"
        },
    },
    modalResponseTime: {
        type: ControlType.String,
        title: "Response Tag",
        defaultValue: ${JSON.stringify(config.modalResponseTime || "We typically reply within a few minutes")},
        hidden(props: any) {
            return props.widgetMode === "buttons"
        },
    },
    modalChatBubble: {
        type: ControlType.String,
        title: "Greeting Msg",
        defaultValue: ${JSON.stringify(config.modalChatBubble || "We typically reply within a few minutes. How can we help you today?")},
        hidden(props: any) {
            return props.widgetMode === "buttons"
        },
    },
    modalStartChatText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: ${JSON.stringify(config.modalStartChatText || "Start chat")},
        hidden(props: any) {
            return props.widgetMode === "buttons"
        },
    },
    position: {
        type: ControlType.Enum,
        title: "Position",
        options: ["bottom-right", "bottom-left", "top-right", "top-left"],
        optionTitles: ["Bottom Right", "Bottom Left", "Top Right", "Top Left"],
        defaultValue: ${JSON.stringify(config.position || "bottom-right")},
    },
    layout: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["stack", "grid", "horizontal"],
        optionTitles: ["Stack (Vertical)", "Grid (2 Columns)", "Horizontal"],
        defaultValue: ${JSON.stringify(config.layout || "stack")},
        hidden(props: any) {
            return props.widgetMode === "modal"
        },
    },
    animation: {
        type: ControlType.Enum,
        title: "Animation",
        options: ["pop", "bounce", "slide", "pulse", "none"],
        optionTitles: ["Pop In", "Bounce", "Slide Up", "Pulse Glow", "None"],
        defaultValue: ${JSON.stringify(config.animation || "pop")},
    },
    buttonColor: {
        type: ControlType.Color,
        title: "Launcher Color",
        defaultValue: ${JSON.stringify(config.buttonColor || "#25D366")},
    },
    buttonShape: {
        type: ControlType.Enum,
        title: "Button Shape",
        options: ["circle", "rounded", "pill"],
        optionTitles: ["Circle", "Rounded", "Pill"],
        defaultValue: ${JSON.stringify(config.buttonShape || "circle")},
    },
    launcherText: {
        type: ControlType.String,
        title: "Button Label",
        defaultValue: "Chat",
        hidden(props: any) {
            return props.buttonShape !== "pill"
        },
    },
    launcherIcon: {
        type: ControlType.Enum,
        title: "Button Icon",
        options: ["chat", "whatsapp", "messenger", "telegram", "instagram", "phone", "email", "support"],
        optionTitles: ["Live Chat", "WhatsApp", "Messenger", "Telegram", "Instagram", "Phone", "Email", "Headset Support"],
        defaultValue: ${JSON.stringify(config.launcherIcon || "chat")},
    },
    showLabels: {
        type: ControlType.Boolean,
        title: "Show Labels",
        defaultValue: ${Boolean(config.showLabels)},
        hidden(props: any) {
            return props.widgetMode === "modal"
        },
    },
    closeOnOutsideClick: {
        type: ControlType.Boolean,
        title: "Outside Click",
        defaultValue: ${Boolean(config.closeOnOutsideClick ?? true)},
    },
    closeOnEscape: {
        type: ControlType.Boolean,
        title: "Escape Key",
        defaultValue: ${Boolean(config.closeOnEscape ?? true)},
    },
    closeAfterClick: {
        type: ControlType.Boolean,
        title: "Close on Click",
        defaultValue: ${Boolean(config.closeAfterClick ?? true)},
    },
    autoOpen: {
        type: ControlType.Boolean,
        title: "Auto Open",
        defaultValue: ${Boolean(config.autoOpen)},
    },
    autoOpenDelay: {
        type: ControlType.Number,
        title: "Auto Open Delay (ms)",
        defaultValue: ${Number(config.autoOpenDelay ?? 1200)},
        min: 0,
        max: 30000,
        step: 500,
        hidden(props: any) {
            return !props.autoOpen
        },
    },
    ariaLabel: {
        type: ControlType.String,
        title: "Aria Label",
        defaultValue: ${JSON.stringify(config.ariaLabel || "Open chat options")},
    },
    showBadge: {
        type: ControlType.Boolean,
        title: "Badge",
        defaultValue: ${Boolean(config.showBadge)},
    },
    badgeText: {
        type: ControlType.String,
        title: "Badge Text",
        defaultValue: ${JSON.stringify(config.badgeText || "1")},
    },
    greetingEnabled: {
        type: ControlType.Boolean,
        title: "Greeting Bubble",
        defaultValue: ${Boolean(config.greetingEnabled)},
    },
    greetingText: {
        type: ControlType.String,
        title: "Greeting Text",
        defaultValue: ${JSON.stringify(config.greetingText || "Need help? Chat with us.")},
    },
    whatsapp: {
        type: ControlType.String,
        title: "WhatsApp",
        placeholder: "+1234567890",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "whatsapp")?.value || "")},
    },
    whatsappMessage: {
        type: ControlType.String,
        title: "WA Message",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "whatsapp")?.message || "Hello! I would like to know more.")},
    },
    messenger: {
        type: ControlType.String,
        title: "Messenger",
        placeholder: "username",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "messenger")?.value || "")},
    },
    telegram: {
        type: ControlType.String,
        title: "Telegram",
        placeholder: "username",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "telegram")?.value || "")},
    },
    telegramMessage: {
        type: ControlType.String,
        title: "TG Message",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "telegram")?.message || "Hello!")},
    },
    instagram: {
        type: ControlType.String,
        title: "Instagram",
        placeholder: "username",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "instagram")?.value || "")},
    },
    tiktok: {
        type: ControlType.String,
        title: "TikTok",
        placeholder: "username",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "tiktok")?.value || "")},
    },
    wechat: {
        type: ControlType.String,
        title: "WeChat",
        placeholder: "wechat_id",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "wechat")?.value || "")},
    },
    viber: {
        type: ControlType.String,
        title: "Viber",
        placeholder: "+1234567890",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "viber")?.value || "")},
    },
    line: {
        type: ControlType.String,
        title: "LINE",
        placeholder: "line_id",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "line")?.value || "")},
    },
    signal: {
        type: ControlType.String,
        title: "Signal",
        placeholder: "username or link",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "signal")?.value || "")},
    },
    phone: {
        type: ControlType.String,
        title: "Phone",
        placeholder: "+1234567890",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "phone")?.value || "")},
    },
    email: {
        type: ControlType.String,
        title: "Email",
        placeholder: "hello@example.com",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "email")?.value || "")},
    },
    custom: {
        type: ControlType.String,
        title: "Custom URL",
        placeholder: "https://example.com/chat",
        defaultValue: ${JSON.stringify(config.channels.find((c) => c.id === "custom")?.value || "")},
    },
})
`
}

export async function insertCanvasComponent(config: ChatConfig): Promise<{ success: boolean; message: string }> {
    const code = generateComponentCode(config)
    const fileName = "Chatfic.tsx"

    try {
        if (typeof (framer as any).isAllowedTo === "function") {
            try {
                await (framer as any).isAllowedTo("createCodeFile", "addComponentInstance", "setSelection")
            } catch {}
        }
        const files = await framer.getCodeFiles()
        let file = files.find((f) => f.name === fileName || f.name === "Chatfic")

        if (file) {
            await file.setFileContent(code)
        } else {
            file = await framer.createCodeFile(fileName, code, { editViaPlugin: true })
        }

        const componentExport = file.exports.find((exp) => exp.type === "component")
        if (componentExport && "insertURL" in componentExport) {
            // Insert component onto the canvas root using Framer's default insertion behavior with default Open Modal state
            const instance = (await framer.addComponentInstance({
                url: componentExport.insertURL,
                attributes: {
                    controls: {
                        canvasPreview: "modal",
                        widgetMode: config.widgetMode || "modal",
                    },
                },
            })) as any

            if (instance?.id) {
                try {
                    await framer.setSelection([instance.id])
                } catch {
                    // Ignore selection error
                }
            }

            return {
                success: true,
                message: "Chatfic component inserted onto the canvas! Customize it in the property panel and drag it into your frame as needed.",
            }
        }

        return {
            success: true,
            message: "Chatfic component created in your Code Assets! You can drag it onto any page.",
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to insert component onto canvas.",
        }
    }
}

export function isChatficInstance(node: any): boolean {
    if (!node) return false
    if (node.componentName === "Chatfic") return true
    if (typeof node.name === "string" && node.name.includes("Chatfic")) return true
    if (typeof node.insertURL === "string" && node.insertURL.includes("Chatfic")) return true
    if (typeof node.componentIdentifier === "string" && node.componentIdentifier.includes("Chatfic")) return true
    return false
}

export async function getCanvasInstancesCount(): Promise<number> {
    try {
        const instances = (await framer.getNodesWithType("ComponentInstanceNode")) as any[]
        if (!instances) return 0
        return instances.filter(isChatficInstance).length
    } catch {
        return 0
    }
}

export async function removeAllCanvasInstances(): Promise<number> {
    try {
        const instances = (await framer.getNodesWithType("ComponentInstanceNode")) as any[]
        if (!instances || instances.length === 0) return 0
        let removed = 0
        for (const inst of instances) {
            if (isChatficInstance(inst)) {
                if (typeof inst.remove === "function") {
                    await inst.remove()
                    removed++
                }
            }
        }
        return removed
    } catch (e) {
        console.warn("Failed to remove canvas instances:", e)
        return 0
    }
}

export { removeAllCanvasInstances as removeCanvasInstances }
