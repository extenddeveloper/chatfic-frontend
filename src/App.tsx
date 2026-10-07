import { useEffect, useMemo, useRef, useState } from "react"
import { framer } from "@framer/plugin"
import { cloneDefaultConfig, MODAL_THEME_GRADIENTS, normalizeConfig } from "./core/config"
import { loadConfig, saveConfig } from "./core/storage"
import { getCanvasInstancesCount, insertCanvasComponent } from "./framer/canvas-component-service"
import type { ChannelId, ChatAgent, ChatChannel, ChatConfig, ModalTheme } from "./types"
import { Field } from "./ui/components/Field"
import { Section } from "./ui/components/Section"
import { Switch } from "./ui/components/Switch"
import { ICONS, LAUNCHER_ICONS } from "./widget/icons"
import { sanitizeAgent, sanitizeAvatarUrl, sanitizeChannel, sanitizeMultilineText, sanitizeText } from "./core/sanitize"
import {
    IconCamera,
    IconGear,
    IconX,
    IconUpload,
    IconUser,
    IconLink,
    IconRefresh,
    IconArrowLeft,
    IconArrowRight,
    IconSpinner,
    IconLayoutModal,
    IconLayoutButtons,
    IconPlus,
    IconSun,
    IconMoon,
} from "./ui/icons"
import "./ui/styles.css"

type Tab = "overview" | "modal" | "channels" | "design" | "behavior"

const AVATAR_PRESETS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
]

const channelMeta: Record<ChannelId, { label: string; placeholder: string; hint: string }> = {
    whatsapp: {
        label: "WhatsApp Number",
        placeholder: "+1 234 567 8900",
        hint: "Include country code (e.g. +1 for US).",
    },
    messenger: {
        label: "Messenger Username / Page",
        placeholder: "username or page name",
        hint: "Facebook page username or profile handle without @.",
    },
    instagram: {
        label: "Instagram Username",
        placeholder: "username",
        hint: "Instagram account handle without @.",
    },
    telegram: {
        label: "Telegram Username",
        placeholder: "username",
        hint: "Telegram handle or public channel without @.",
    },
    tiktok: {
        label: "TikTok Username",
        placeholder: "username",
        hint: "TikTok handle without @.",
    },
    wechat: {
        label: "WeChat ID / QR URL",
        placeholder: "wechat_id or https://...",
        hint: "WeChat ID or full profile URL.",
    },
    viber: {
        label: "Viber Number",
        placeholder: "+1 234 567 8900",
        hint: "Phone number with country code.",
    },
    line: {
        label: "LINE ID",
        placeholder: "line_id",
        hint: "Official or personal LINE ID.",
    },
    signal: {
        label: "Signal ID / Link",
        placeholder: "username or link",
        hint: "Signal profile URL or identifier.",
    },
    phone: {
        label: "Phone Number",
        placeholder: "+1 234 567 8900",
        hint: "Direct dial phone number.",
    },
    email: {
        label: "Email Address",
        placeholder: "hello@yourcompany.com",
        hint: "Contact email for visitors.",
    },
    custom: {
        label: "Custom URL Link",
        placeholder: "https://yourwebsite.com/chat",
        hint: "Any valid web URL or custom protocol.",
    },
}

export function App() {
    const [config, setConfig] = useState<ChatConfig>(cloneDefaultConfig())
    const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
        if (typeof document !== "undefined") {
            const bodyTheme = document.body?.dataset?.framerTheme
            const htmlTheme = document.documentElement?.dataset?.framerTheme
            if (bodyTheme === "light" || htmlTheme === "light") return "light"
        }
        return "dark"
    })
    const [tab, setTab] = useState<Tab>("overview")
    const [inserting, setInserting] = useState(false)
    const [canvasCount, setCanvasCount] = useState(0)
    const [previewOpen, setPreviewOpen] = useState(true)
    const [previewSelectedAgent, setPreviewSelectedAgent] = useState<ChatAgent | null>(null)
    const [message, setMessage] = useState<{ type: "info" | "success" | "error"; text: string } | null>(null)

    // Agent creation & configuration state
    const [showAddAgent, setShowAddAgent] = useState(false)
    const [newAgentName, setNewAgentName] = useState("")
    const [newAgentRole, setNewAgentRole] = useState("")
    const [newAgentAvatar, setNewAgentAvatar] = useState(AVATAR_PRESETS[0])
    const [newAgentChannel, setNewAgentChannel] = useState<ChannelId>("whatsapp")
    const [newAgentValue, setNewAgentValue] = useState("")
    const [newAgentMessage, setNewAgentMessage] = useState("")
    const [newAvatarMode, setNewAvatarMode] = useState<"upload" | "presets" | "url">("upload")
    const [isUploadingNewAvatar, setIsUploadingNewAvatar] = useState(false)
    const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null)
    const [uploadingAgentId, setUploadingAgentId] = useState<string | null>(null)

    // Automatic Canvas Theme Sync + Subscription (Read-only observer to prevent infinite mutation loops)
    useEffect(() => {
        function readCanvasTheme() {
            const bodyTheme = document.body.getAttribute("data-framer-theme")
            const htmlTheme = document.documentElement.getAttribute("data-framer-theme")
            if (bodyTheme === "light" || htmlTheme === "light") {
                setThemeMode("light")
            } else if (bodyTheme === "dark" || htmlTheme === "dark") {
                setThemeMode("dark")
            }
        }

        readCanvasTheme()

        let unsubscribe: (() => void) | undefined
        try {
            if (typeof (framer as any).subscribe === "function") {
                unsubscribe = (framer as any).subscribe("theme", (themeData: any) => {
                    if (themeData && (themeData.mode === "light" || themeData.mode === "dark")) {
                        setThemeMode(themeData.mode)
                    }
                })
            }
        } catch {
            // Subscription not available
        }

        const observer = new MutationObserver(() => {
            readCanvasTheme()
        })
        observer.observe(document.body, { attributes: true, attributeFilter: ["data-framer-theme"] })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-framer-theme"] })

        return () => {
            if (unsubscribe) unsubscribe()
            observer.disconnect()
        }
    }, [])

    function toggleTheme() {
        const next = themeMode === "dark" ? "light" : "dark"
        setThemeMode(next)
        document.documentElement.setAttribute("data-framer-theme", next)
        document.body.setAttribute("data-framer-theme", next)
    }

    useEffect(() => {
        Promise.all([loadConfig(), getCanvasInstancesCount()])
            .then(([saved, count]) => {
                setConfig(saved)
                setCanvasCount(count)
            })
            .catch(() => setMessage({ type: "error", text: "Unable to load plugin data." }))
    }, [])

    const isFirstLoad = useRef(true)
    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false
            return
        }

        const timer = setTimeout(async () => {
            try {
                const normalized = normalizeConfig(config)
                await saveConfig(normalized)
            } catch (err) {
                console.warn("Auto-save config failed:", err)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [config])

    const enabledChannels = useMemo(
        () => config.channels.filter((channel) => channel.enabled && channel.value.trim()),
        [config.channels],
    )

    const resolvedGradient = useMemo(() => {
        if (config.modalTheme === "custom" && config.modalCustomGradient) {
            return config.modalCustomGradient
        }
        return MODAL_THEME_GRADIENTS[config.modalTheme] || MODAL_THEME_GRADIENTS.whatsapp
    }, [config.modalTheme, config.modalCustomGradient])

    function updateConfig(patch: Partial<ChatConfig>) {
        setConfig((current) => normalizeConfig({ ...current, ...patch }))
        setMessage(null)
    }

    function updateChannel(id: ChannelId, patch: Partial<ChatChannel>) {
        setConfig((current) => ({
            ...current,
            channels: current.channels.map((channel) =>
                channel.id === id ? sanitizeChannel({ ...channel, ...patch }) : channel,
            ),
        }))
        setMessage(null)
    }

    function updateAgent(id: string, patch: Partial<ChatAgent>) {
        setConfig((current) => ({
            ...current,
            agents: current.agents.map((ag) => (ag.id === id ? sanitizeAgent({ ...ag, ...patch }) : ag)),
        }))
        setMessage(null)
    }

    function deleteAgent(id: string) {
        setConfig((current) => ({
            ...current,
            agents: current.agents.filter((ag) => ag.id !== id),
        }))
        if (previewSelectedAgent?.id === id) {
            setPreviewSelectedAgent(null)
        }
    }

    async function uploadAvatarFile(file: File): Promise<string> {
        if (!file.type.startsWith("image/")) {
            throw new Error("Please select an image file (PNG, JPG, SVG, WebP, etc.).")
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new Error("Image size should be less than 5MB.")
        }

        // Try Framer Plugin API first
        if (typeof framer?.uploadImage === "function") {
            try {
                const asset = await framer.uploadImage(file)
                if (asset && asset.url) {
                    return asset.url
                }
            } catch (framerErr) {
                console.warn("framer.uploadImage unavailable in current context:", framerErr)
            }
        }

        // Fallback to data URL
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = () => reject(new Error("Failed to read image file."))
            reader.readAsDataURL(file)
        })
    }

    async function handleNewAgentFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploadingNewAvatar(true)
        try {
            const url = await uploadAvatarFile(file)
            setNewAgentAvatar(url)
            setMessage({ type: "success", text: "Avatar image uploaded successfully!" })
        } catch (err) {
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to upload image." })
        } finally {
            setIsUploadingNewAvatar(false)
            e.target.value = ""
        }
    }

    async function handleExistingAgentFileUpload(agentId: string, e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingAgentId(agentId)
        try {
            const url = await uploadAvatarFile(file)
            updateAgent(agentId, { avatar: url })
            setMessage({ type: "success", text: "Agent avatar updated!" })
        } catch (err) {
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to upload image." })
        } finally {
            setUploadingAgentId(null)
            e.target.value = ""
        }
    }

    function addAgent() {
        const cleanName = sanitizeText(newAgentName, 60)
        if (!cleanName) return
        const newAgent: ChatAgent = {
            id: "agent-" + Date.now(),
            name: cleanName,
            role: sanitizeText(newAgentRole, 80, "Customer Support"),
            avatar: sanitizeAvatarUrl(newAgentAvatar),
            channelId: newAgentChannel,
            value: sanitizeText(newAgentValue, 150, "") || undefined,
            message: sanitizeMultilineText(newAgentMessage, 300, "") || undefined,
            online: true,
        }
        setConfig((current) => ({
            ...current,
            agents: [...current.agents, newAgent],
        }))
        setNewAgentName("")
        setNewAgentRole("")
        setNewAgentValue("")
        setNewAgentMessage("")
        setNewAgentAvatar(AVATAR_PRESETS[0])
        setShowAddAgent(false)
        setMessage({ type: "success", text: "Added " + newAgent.name + " to chat team." })
    }

    async function handleInsertToCanvas() {
        setInserting(true)
        setMessage(null)
        try {
            const normalized = normalizeConfig(config)
            await saveConfig(normalized)
            const result = await insertCanvasComponent(normalized)
            const count = await getCanvasInstancesCount()
            setCanvasCount(count)
            setMessage({
                type: result.success ? "success" : "error",
                text: result.message,
            })
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Failed to insert component onto canvas.",
            })
        } finally {
            setInserting(false)
        }
    }

    async function reset() {
        const next = cloneDefaultConfig()
        setConfig(next)
        await saveConfig(next)
        setMessage({ type: "info", text: "Settings restored to defaults." })
    }

    const primaryColor = enabledChannels[0]?.color || config.buttonColor || "#25D366"

    return (
        <div className={"app " + themeMode}>
            <header className="header">
                <div className="app-brand">
                    <div className="app-logo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2a10 10 0 0 0-8.9 14.6L2 22l5.4-1.1A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4-1.1l-.4-.2-3.2.7.7-3.1-.2-.4A8 8 0 1 1 12 20Z" />
                        </svg>
                    </div>
                    <div className="app-brand-info">
                        <h1>Chatfic</h1>
                        <p>Live Social Chat &amp; Contact Widgets</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        type="button"
                        className="cf-theme-toggle"
                        onClick={toggleTheme}
                        title={"Theme: " + themeMode + ". Click to switch."}
                    >
                        {themeMode === "dark" ? (
                            <>
                                <IconMoon size={12} />
                                <span>Dark</span>
                            </>
                        ) : (
                            <>
                                <IconSun size={12} />
                                <span>Light</span>
                            </>
                        )}
                    </button>
                    <div className={"status-badge " + (canvasCount > 0 ? "ok" : "")}>
                        <span className="status-dot" />
                        {canvasCount > 0 ? `${canvasCount} on Canvas` : "Ready"}
                    </div>
                </div>
            </header>

            <nav className="cf-tabs">
                <button
                    type="button"
                    className={"cf-tab " + (tab === "overview" ? "active" : "")}
                    onClick={() => setTab("overview")}
                >
                    Overview
                </button>
                <button
                    type="button"
                    className={"cf-tab " + (tab === "modal" ? "active" : "")}
                    onClick={() => setTab("modal")}
                >
                    Chat Modal
                </button>
                <button
                    type="button"
                    className={"cf-tab " + (tab === "channels" ? "active" : "")}
                    onClick={() => setTab("channels")}
                >
                    Channels
                </button>
                <button
                    type="button"
                    className={"cf-tab " + (tab === "design" ? "active" : "")}
                    onClick={() => setTab("design")}
                >
                    Design
                </button>
                <button
                    type="button"
                    className={"cf-tab " + (tab === "behavior" ? "active" : "")}
                    onClick={() => setTab("behavior")}
                >
                    Behavior
                </button>
            </nav>

            <main className="content">
                {message && (
                    <div className={"cf-notice " + message.type}>
                        <span>{message.text}</span>
                    </div>
                )}

                {tab === "overview" ? (
                    <>
                        <Section
                            title="Widget Experience Mode"
                            description="Choose how visitors interact when clicking your chat button."
                        >
                            <div className="cf-field-grid">
                                 <div
                                     className={"cf-theme-card " + (config.widgetMode === "modal" ? "active" : "")}
                                     onClick={() => updateConfig({ widgetMode: "modal" })}
                                     style={{ cursor: "pointer", textAlign: "left", padding: 12 }}
                                 >
                                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                         <span style={{ display: "inline-flex", alignItems: "center", color: "var(--cf-tint)" }}>
                                             <IconLayoutModal size={16} />
                                         </span>
                                         <strong style={{ fontSize: 12 }}>Live Chat Modal</strong>
                                     </div>
                                     <span style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                         Webflow-style popup window with team agents, response times &amp; chat preview.
                                     </span>
                                 </div>
                                 <div
                                     className={"cf-theme-card " + (config.widgetMode === "buttons" ? "active" : "")}
                                     onClick={() => updateConfig({ widgetMode: "buttons" })}
                                     style={{ cursor: "pointer", textAlign: "left", padding: 12 }}
                                 >
                                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                         <span style={{ display: "inline-flex", alignItems: "center", color: "var(--cf-tint)" }}>
                                             <IconLayoutButtons size={16} />
                                         </span>
                                         <strong style={{ fontSize: 12 }}>Icon Buttons</strong>
                                     </div>
                                     <span style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                         Classic floating icon list opening direct channel URLs.
                                     </span>
                                 </div>
                             </div>
                        </Section>

                        <Section
                            title="Interactive Live Preview"
                            description="Test the interactive widget live. Click the button to toggle the window."
                        >
                            <div className="preview-container">
                                <div className="preview-toolbar">
                                    <span className="preview-pill">Live Simulation</span>
                                    <div className="preview-mode-switch">
                                        <button
                                            type="button"
                                            className={"preview-mode-btn " + (config.widgetMode === "modal" && previewOpen ? "active" : "")}
                                            onClick={() => {
                                                updateConfig({ widgetMode: "modal" })
                                                setPreviewOpen(true)
                                                setPreviewSelectedAgent(null)
                                            }}
                                        >
                                            Modal View
                                        </button>
                                        <button
                                            type="button"
                                            className={"preview-mode-btn " + (config.widgetMode === "buttons" && previewOpen ? "active" : "")}
                                            onClick={() => {
                                                updateConfig({ widgetMode: "buttons" })
                                                setPreviewOpen(true)
                                            }}
                                        >
                                            Button View
                                        </button>
                                    </div>
                                </div>

                                <div className="preview-viewport">
                                    <div className="preview-mock-page">
                                        <div className="preview-mock-line short" />
                                        <div className="preview-mock-line long" />
                                        <div className="preview-mock-line" />
                                        <div className="preview-mock-line short" />
                                    </div>

                                    <div className="preview-launcher-wrap">
                                        {config.widgetMode === "modal" && previewOpen ? (
                                            <div className="preview-modal-card">
                                                <div className="preview-modal-header" style={{ background: resolvedGradient }}>
                                                    <div className="preview-modal-header-top">
                                                        <h4 className="preview-modal-title">{config.modalTitle || "Hi there!"}</h4>
                                                        <button
                                                            type="button"
                                                            className="preview-modal-close-btn"
                                                            onClick={() => setPreviewOpen(false)}
                                                        >
                                                            <IconX size={12} />
                                                        </button>
                                                    </div>
                                                    <p className="preview-modal-subtitle">
                                                        {config.modalSubtitle || "Welcome to our live chat! Feel free to ask any questions."}
                                                    </p>
                                                    <div className="preview-modal-badge">
                                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                                                        {config.modalResponseTime || "Typically replies in minutes"}
                                                    </div>
                                                </div>

                                                <div className="preview-modal-body">
                                                    {previewSelectedAgent ? (
                                                        <div className="preview-chat-view">
                                                            <button
                                                                type="button"
                                                                className="preview-chat-back"
                                                                onClick={() => setPreviewSelectedAgent(null)}
                                                                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                                                            >
                                                                <IconArrowLeft size={12} />
                                                                <span>All Team Members</span>
                                                            </button>
                                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                                <img
                                                                    src={previewSelectedAgent.avatar}
                                                                    alt={previewSelectedAgent.name}
                                                                    style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                                                                />
                                                                <div>
                                                                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--cf-text)" }}>
                                                                        {previewSelectedAgent.name}
                                                                    </div>
                                                                    <div style={{ fontSize: 10, color: "var(--cf-text-secondary)" }}>
                                                                        {previewSelectedAgent.role}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="preview-chat-bubble">
                                                                {previewSelectedAgent.message || config.modalChatBubble || "We typically reply within a few minutes. How can we help you today?"}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="preview-start-btn"
                                                                style={{
                                                                    background: resolvedGradient,
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    gap: 6,
                                                                }}
                                                                onClick={() => {
                                                                    const ch = config.channels.find((c) => c.id === previewSelectedAgent.channelId)
                                                                    const targetVal = previewSelectedAgent.value || ch?.value || "(Not configured)"
                                                                    setMessage({
                                                                        type: "info",
                                                                        text: `Simulated chat with ${previewSelectedAgent.name} via ${previewSelectedAgent.channelId} (${targetVal})!`,
                                                                    })
                                                                }}
                                                            >
                                                                <span>{config.modalStartChatText || "Start chat"}</span>
                                                                <IconArrowRight size={13} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--cf-text-tertiary)", letterSpacing: "0.05em" }}>
                                                                Support Team
                                                            </span>
                                                            {config.agents.map((agent) => {
                                                                const ch = config.channels.find((c) => c.id === agent.channelId)
                                                                return (
                                                                    <div
                                                                        key={agent.id}
                                                                        className="preview-agent-card"
                                                                        onClick={() => setPreviewSelectedAgent(agent)}
                                                                        title="Click to preview agent chat screen"
                                                                    >
                                                                        <div className="preview-agent-avatar-wrap">
                                                                            <img src={agent.avatar} alt={agent.name} />
                                                                            {agent.online !== false && <span className="preview-agent-online-dot" />}
                                                                        </div>
                                                                        <div className="preview-agent-details">
                                                                            <span className="preview-agent-name">{agent.name}</span>
                                                                            <span className="preview-agent-role">
                                                                                {agent.role}
                                                                                {agent.value ? ` • ${agent.value}` : ""}
                                                                            </span>
                                                                        </div>
                                                                        <span
                                                                            className="preview-agent-channel-badge"
                                                                            style={{ background: ch?.color || "#25D366" }}
                                                                            dangerouslySetInnerHTML={{ __html: ICONS[agent.channelId] || "" }}
                                                                        />
                                                                    </div>
                                                                )
                                                            })}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}

                                        {config.widgetMode === "buttons" && previewOpen ? (
                                            <div className={`preview-buttons-list layout-${config.layout}`}>
                                                {enabledChannels.map((channel) => (
                                                    <div key={channel.id} className="preview-channel-button-item">
                                                        {config.showLabels && (
                                                            <span className="preview-channel-label">{channel.label}</span>
                                                        )}
                                                        <div
                                                            className={`preview-channel-btn shape-${config.buttonShape}`}
                                                            style={{
                                                                background: channel.color,
                                                                width: config.buttonShape === "pill" ? "auto" : Math.max(38, Math.round((config.buttonSize || 56) * 0.75)),
                                                                height: Math.max(38, Math.round((config.buttonSize || 56) * 0.75)),
                                                            }}
                                                            title={channel.label}
                                                            onClick={() => {
                                                                setMessage({
                                                                    type: "info",
                                                                    text: `Opened ${channel.label} directly (${channel.value || "Configured"})!`,
                                                                })
                                                            }}
                                                        >
                                                            <span dangerouslySetInnerHTML={{ __html: ICONS[channel.id] || "" }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}

                                        {!previewOpen && config.greetingEnabled && (
                                            <div className="preview-greeting-pill">
                                                {config.greetingText || "Need help? Chat with us."}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="preview-main-btn"
                                            style={{
                                                background: primaryColor,
                                                width: config.buttonSize || 56,
                                                height: config.buttonSize || 56,
                                                borderRadius: config.buttonShape === "circle" ? "50%" : config.buttonShape === "pill" ? "999px" : "14px",
                                            }}
                                            onClick={() => setPreviewOpen(!previewOpen)}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: LAUNCHER_ICONS[config.launcherIcon || "chat"] || LAUNCHER_ICONS.chat }} />
                                            {config.showBadge && (
                                                <span className="preview-badge-pill">{config.badgeText || "1"}</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </>
                ) : null}

                {tab === "modal" ? (
                    <>
                        <Section
                            title="Chat Window Header &amp; Theme"
                            description="Customize the top header gradient, greeting, and response time."
                        >
                            <Field label="Header Theme Gradient">
                                <div className="cf-theme-grid">
                                    {(
                                        [
                                            ["whatsapp", "WhatsApp", MODAL_THEME_GRADIENTS.whatsapp],
                                            ["messenger", "Messenger", MODAL_THEME_GRADIENTS.messenger],
                                            ["telegram", "Telegram", MODAL_THEME_GRADIENTS.telegram],
                                            ["instagram", "Instagram", MODAL_THEME_GRADIENTS.instagram],
                                            ["tiktok", "TikTok", MODAL_THEME_GRADIENTS.tiktok],
                                            ["wechat", "WeChat", MODAL_THEME_GRADIENTS.wechat],
                                            ["dark", "Modern Dark", MODAL_THEME_GRADIENTS.dark],
                                            ["custom", "Custom", config.modalCustomGradient || MODAL_THEME_GRADIENTS.whatsapp],
                                        ] as const
                                    ).map(([themeId, label, grad]) => (
                                        <div
                                            key={themeId}
                                            className={"cf-theme-card " + (config.modalTheme === themeId ? "active" : "")}
                                            onClick={() => updateConfig({ modalTheme: themeId as ModalTheme })}
                                        >
                                            <div className="cf-theme-swatch" style={{ background: grad }} />
                                            <span className="cf-theme-name">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </Field>

                            {config.modalTheme === "custom" && (
                                <Field label="Custom CSS Gradient" hint="e.g. linear-gradient(135deg, #6366f1, #a855f7)">
                                    <input
                                        className="cf-input"
                                        maxLength={200}
                                        value={config.modalCustomGradient || ""}
                                        onChange={(e) => updateConfig({ modalCustomGradient: e.target.value })}
                                        placeholder="linear-gradient(135deg, #6366f1, #a855f7)"
                                    />
                                </Field>
                            )}

                            <div className="cf-field-grid">
                                <Field label="Header Title">
                                    <input
                                        className="cf-input"
                                        maxLength={100}
                                        value={config.modalTitle}
                                        onChange={(e) => updateConfig({ modalTitle: e.target.value })}
                                        placeholder="Hi there!"
                                    />
                                </Field>
                                <Field label="Response Time Badge">
                                    <input
                                        className="cf-input"
                                        maxLength={60}
                                        value={config.modalResponseTime}
                                        onChange={(e) => updateConfig({ modalResponseTime: e.target.value })}
                                        placeholder="Typically replies in minutes"
                                    />
                                </Field>
                            </div>

                            <Field label="Header Subtitle">
                                <input
                                    className="cf-input"
                                    maxLength={250}
                                    value={config.modalSubtitle}
                                    onChange={(e) => updateConfig({ modalSubtitle: e.target.value })}
                                    placeholder="Welcome to our live chat! Feel free to ask any questions."
                                />
                            </Field>
                        </Section>

                        <Section
                            title="Chat Preview &amp; Start CTA"
                            description="Configure the simulated incoming message and the action button."
                        >
                            <Field label="Welcome Chat Bubble Message">
                                <textarea
                                    className="cf-input"
                                    rows={2}
                                    maxLength={500}
                                    value={config.modalChatBubble}
                                    onChange={(e) => updateConfig({ modalChatBubble: e.target.value })}
                                    placeholder="We typically reply within a few minutes. How can we help you today?"
                                />
                            </Field>
                            <Field label="CTA Button Text">
                                <input
                                    className="cf-input"
                                    maxLength={50}
                                    value={config.modalStartChatText}
                                    onChange={(e) => updateConfig({ modalStartChatText: e.target.value })}
                                    placeholder="Start chat"
                                />
                            </Field>
                        </Section>

                        <Section
                            title="Support Team / Agents"
                            description="Add team members visitors can chat with. Each agent can have their own direct number or custom message."
                        >
                            <div className="cf-agents-list">
                                {config.agents.map((agent) => {
                                    const channel = config.channels.find((c) => c.id === agent.channelId) || config.channels[0]
                                    const isExpanded = expandedAgentId === agent.id
                                    const isUploading = uploadingAgentId === agent.id
                                    const currentChannelMeta = channelMeta[agent.channelId]
                                    const hasCustomValue = Boolean(agent.value && agent.value.trim())

                                    return (
                                        <div key={agent.id} className={"cf-agent-manage-item " + (isExpanded ? "is-expanded" : "")}>
                                            <div className="cf-agent-manage-header">
                                                <div
                                                    className="cf-agent-avatar-wrap"
                                                    title="Click to upload/change photo"
                                                    onClick={() => {
                                                        document.getElementById(`cf-agent-file-${agent.id}`)?.click()
                                                    }}
                                                >
                                                    <img src={agent.avatar} alt={agent.name} className="cf-agent-manage-avatar" />
                                                    <div className="cf-agent-avatar-hover-icon">
                                                        {isUploading ? <IconSpinner size={14} /> : <IconCamera size={14} />}
                                                    </div>
                                                    <input
                                                        id={`cf-agent-file-${agent.id}`}
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: "none" }}
                                                        onChange={(e) => handleExistingAgentFileUpload(agent.id, e)}
                                                    />
                                                </div>

                                                <div className="cf-agent-manage-fields">
                                                    <input
                                                        className="cf-input"
                                                        maxLength={60}
                                                        value={agent.name}
                                                        onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
                                                        placeholder="Agent Name"
                                                    />
                                                    <input
                                                        className="cf-input"
                                                        maxLength={80}
                                                        value={agent.role}
                                                        onChange={(e) => updateAgent(agent.id, { role: e.target.value })}
                                                        placeholder="Role / Department"
                                                    />
                                                </div>

                                                <div className="cf-agent-meta-badge-wrap">
                                                    <span
                                                        className="cf-agent-channel-tag"
                                                        style={{ background: channel?.color || "#25D366" }}
                                                    >
                                                        {channel?.label || "Chat"}
                                                    </span>
                                                    {hasCustomValue && (
                                                        <span className="cf-agent-custom-tag" title={"Direct value: " + agent.value}>
                                                            Custom #
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    className={"cf-agent-btn-configure " + (isExpanded ? "active" : "")}
                                                    onClick={() => setExpandedAgentId(isExpanded ? null : agent.id)}
                                                    title={isExpanded ? "Collapse settings" : "Configure direct number, message & photo"}
                                                >
                                                    <IconGear size={13} />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cf-agent-del-btn"
                                                    onClick={() => deleteAgent(agent.id)}
                                                    title="Remove agent"
                                                >
                                                    <IconX size={12} />
                                                </button>
                                            </div>                                             {isExpanded && (
                                                <div className="cf-agent-expanded-body">
                                                    <Field
                                                        label="Assigned Channel"
                                                        hint="Only channels enabled in the Channels tab appear here."
                                                    >
                                                        <select
                                                            className="cf-input"
                                                            value={agent.channelId}
                                                            onChange={(e) => updateAgent(agent.id, { channelId: e.target.value as ChannelId })}
                                                        >
                                                            {(() => {
                                                                const eligible = config.channels.filter((c) => c.enabled || c.id === agent.channelId)
                                                                const list = eligible.length > 0 ? eligible : config.channels
                                                                return list.map((c) => (
                                                                    <option key={c.id} value={c.id}>
                                                                        {c.label}
                                                                        {!c.enabled
                                                                            ? " (Disabled in Channels)"
                                                                            : c.value
                                                                            ? ` (${c.value})`
                                                                            : " (Active, no default)"}
                                                                    </option>
                                                                ))
                                                            })()}
                                                        </select>
                                                    </Field>

                                                    <Field
                                                        label={`Direct ${channel?.label || "Channel"} ${agent.channelId === "email" ? "Email" : agent.channelId === "phone" || agent.channelId === "whatsapp" || agent.channelId === "viber" ? "Number" : "Handle"} (Optional)`}
                                                        hint={
                                                            channel?.value
                                                                ? `Default: ${channel.value}. Leave blank to use default.`
                                                                : "Leave blank to use channel default."
                                                        }
                                                    >
                                                        <input
                                                            className="cf-input"
                                                            maxLength={150}
                                                            value={agent.value || ""}
                                                            onChange={(e) => updateAgent(agent.id, { value: e.target.value })}
                                                            placeholder={currentChannelMeta?.placeholder || "Direct contact value"}
                                                        />
                                                    </Field>

                                                    <Field
                                                        label="Direct Pre-filled Message (Optional)"
                                                        hint={
                                                            channel?.message
                                                                ? `Default: "${channel.message}". Leave blank to use default.`
                                                                : "Leave blank to use welcome chat bubble."
                                                        }
                                                    >
                                                        <textarea
                                                            className="cf-input"
                                                            rows={2}
                                                            maxLength={300}
                                                            value={agent.message || ""}
                                                            onChange={(e) => updateAgent(agent.id, { message: e.target.value })}
                                                            placeholder="e.g. Hi there! Emma here from billing. How can I help you today?"
                                                        />
                                                    </Field>

                                                    <Field label="Avatar Photo">
                                                        <div className="cf-avatar-edit-row">
                                                            <button
                                                                type="button"
                                                                className="cf-btn secondary cf-avatar-upload-trigger"
                                                                onClick={() => {
                                                                    document.getElementById(`cf-agent-file-${agent.id}`)?.click()
                                                                }}
                                                                disabled={isUploading}
                                                                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                                                            >
                                                                {isUploading ? (
                                                                    <>
                                                                        <IconSpinner size={12} />
                                                                        <span>Uploading photo...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <IconUpload size={12} />
                                                                        <span>Upload New Photo</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                            <div className="cf-avatar-presets-mini">
                                                                {AVATAR_PRESETS.map((preset, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        type="button"
                                                                        className={"cf-avatar-preset-btn " + (agent.avatar === preset ? "active" : "")}
                                                                        onClick={() => updateAgent(agent.id, { avatar: preset })}
                                                                        title={"Preset " + (idx + 1)}
                                                                    >
                                                                        <img src={preset} alt={"Preset " + (idx + 1)} />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <input
                                                            className="cf-input"
                                                            style={{ marginTop: 6 }}
                                                            maxLength={500}
                                                            value={agent.avatar}
                                                            onChange={(e) => updateAgent(agent.id, { avatar: e.target.value })}
                                                            placeholder="Or paste image URL..."
                                                        />
                                                    </Field>

                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <Switch
                                                                checked={agent.online !== false}
                                                                onChange={(online) => updateAgent(agent.id, { online })}
                                                            />
                                                            <span style={{ fontSize: 11, color: "var(--cf-text)" }}>
                                                                {agent.online !== false ? "Active / Online (shows green dot)" : "Away / Offline"}
                                                            </span>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="cf-btn secondary"
                                                            onClick={() => setExpandedAgentId(null)}
                                                            style={{ fontSize: 11, padding: "3px 10px" }}
                                                        >
                                                            Done
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {showAddAgent ? (
                                <div className="cf-add-agent-box">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--cf-text)" }}>Add New Team Member</span>
                                        <button
                                            type="button"
                                            className="cf-agent-del-btn"
                                            onClick={() => setShowAddAgent(false)}
                                            title="Close"
                                        >
                                            <IconX size={12} />
                                        </button>
                                    </div>

                                    <div className="cf-field-grid">
                                        <Field label="Agent Name *">
                                            <input
                                                className="cf-input"
                                                maxLength={60}
                                                value={newAgentName}
                                                onChange={(e) => setNewAgentName(e.target.value)}
                                                placeholder="e.g. Emma Watson"
                                                autoFocus
                                            />
                                        </Field>
                                        <Field label="Role / Department">
                                            <input
                                                className="cf-input"
                                                maxLength={80}
                                                value={newAgentRole}
                                                onChange={(e) => setNewAgentRole(e.target.value)}
                                                placeholder="e.g. Sales Specialist"
                                            />
                                        </Field>
                                    </div>

                                    <Field
                                        label="Assigned Channel"
                                        hint="Only channels enabled in the Channels tab appear here."
                                    >
                                        <select
                                            className="cf-input"
                                            value={newAgentChannel}
                                            onChange={(e) => setNewAgentChannel(e.target.value as ChannelId)}
                                        >
                                            {(() => {
                                                const eligible = config.channels.filter((c) => c.enabled)
                                                const list = eligible.length > 0 ? eligible : config.channels
                                                return list.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.label} {c.value ? `(${c.value})` : "(Active, no default)"}
                                                    </option>
                                                ))
                                            })()}
                                        </select>
                                    </Field>

                                    <Field
                                        label={`Direct ${config.channels.find((c) => c.id === newAgentChannel)?.label || "Channel"} ${newAgentChannel === "email" ? "Email" : newAgentChannel === "phone" || newAgentChannel === "whatsapp" || newAgentChannel === "viber" ? "Number" : "Handle"} (Optional)`}
                                        hint={(() => {
                                            const c = config.channels.find((c) => c.id === newAgentChannel)
                                            return c?.value
                                                ? `Default: ${c.value}. Leave blank to inherit default.`
                                                : "Leave blank to inherit channel default."
                                        })()}
                                    >
                                        <input
                                            className="cf-input"
                                            maxLength={150}
                                            value={newAgentValue}
                                            onChange={(e) => setNewAgentValue(e.target.value)}
                                            placeholder={channelMeta[newAgentChannel]?.placeholder || "Custom number or handle"}
                                        />
                                    </Field>

                                    <Field
                                        label="Direct Welcome Message (Optional)"
                                        hint={(() => {
                                            const c = config.channels.find((c) => c.id === newAgentChannel)
                                            return c?.message
                                                ? `Default: "${c.message}". Leave blank to inherit.`
                                                : "Leave blank to use general chat bubble."
                                        })()}
                                    >
                                        <textarea
                                            className="cf-input"
                                            rows={2}
                                            maxLength={300}
                                            value={newAgentMessage}
                                            onChange={(e) => setNewAgentMessage(e.target.value)}
                                            placeholder="e.g. Hi there! Emma here from billing. How can I help you today?"
                                        />
                                    </Field>

                                    <Field label="Avatar Photo">
                                        <div className="cf-avatar-picker-tabs">
                                            <button
                                                type="button"
                                                className={"cf-avatar-picker-tab " + (newAvatarMode === "upload" ? "active" : "")}
                                                onClick={() => setNewAvatarMode("upload")}
                                            >
                                                <IconUpload size={12} />
                                                <span>Upload Image</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={"cf-avatar-picker-tab " + (newAvatarMode === "presets" ? "active" : "")}
                                                onClick={() => setNewAvatarMode("presets")}
                                            >
                                                <IconUser size={12} />
                                                <span>Presets</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={"cf-avatar-picker-tab " + (newAvatarMode === "url" ? "active" : "")}
                                                onClick={() => setNewAvatarMode("url")}
                                            >
                                                <IconLink size={12} />
                                                <span>Image URL</span>
                                            </button>
                                        </div>

                                        <div className="cf-avatar-picker-content">
                                            <div className="cf-avatar-picker-preview-wrap">
                                                <img src={newAgentAvatar} alt="New agent avatar" className="cf-avatar-picker-preview" />
                                            </div>

                                            <div className="cf-avatar-picker-controls">
                                                {newAvatarMode === "upload" && (
                                                    <div className="cf-avatar-upload-zone">
                                                        <label className="cf-btn secondary cf-avatar-upload-button">
                                                            {isUploadingNewAvatar ? (
                                                                <>
                                                                    <IconSpinner size={13} />
                                                                    <span>Uploading photo...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <IconUpload size={13} />
                                                                    <span>Choose Image File</span>
                                                                </>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: "none" }}
                                                                onChange={handleNewAgentFileUpload}
                                                                disabled={isUploadingNewAvatar}
                                                            />
                                                        </label>
                                                        <span className="cf-avatar-upload-hint">
                                                            JPG, PNG, WebP or SVG. Uploads to Framer CDN.
                                                        </span>
                                                    </div>
                                                )}

                                                {newAvatarMode === "presets" && (
                                                    <div className="cf-avatar-presets-grid">
                                                        {AVATAR_PRESETS.map((preset, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                className={"cf-avatar-preset-btn " + (newAgentAvatar === preset ? "active" : "")}
                                                                onClick={() => setNewAgentAvatar(preset)}
                                                                title={"Preset " + (idx + 1)}
                                                            >
                                                                <img src={preset} alt={"Preset " + (idx + 1)} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {newAvatarMode === "url" && (
                                                    <input
                                                        className="cf-input"
                                                        maxLength={500}
                                                        value={newAgentAvatar}
                                                        onChange={(e) => setNewAgentAvatar(e.target.value)}
                                                        placeholder="Paste image URL (https://...)"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Field>

                                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                                        <button
                                            type="button"
                                            className="cf-btn secondary"
                                            onClick={() => setShowAddAgent(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="cf-btn primary"
                                            onClick={addAgent}
                                            disabled={!newAgentName.trim() || isUploadingNewAvatar}
                                        >
                                            {isUploadingNewAvatar ? "Uploading..." : "Add to Team"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="cf-btn secondary full-col"
                                    onClick={() => {
                                        const firstActive = config.channels.find((c) => c.enabled)?.id || "whatsapp"
                                        setNewAgentChannel(firstActive)
                                        setShowAddAgent(true)
                                    }}
                                    style={{ marginTop: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                                >
                                    <IconPlus size={13} />
                                    <span>Add Team Member</span>
                                </button>
                            )}
                        </Section>
                    </>
                ) : null}

                {tab === "channels" ? (
                    <Section
                        title="Messaging Channels (12 Platforms Supported)"
                        description="Configure your handles, phone numbers, and pre-filled messages. Enable any combination of channels for your visitors."
                    >
                        {config.channels.map((channel) => {
                            const meta = channelMeta[channel.id]
                            return (
                                <div key={channel.id} className={"cf-channel-card " + (channel.enabled ? "is-active" : "")}>
                                    <div className="cf-channel-header">
                                        <div className="cf-channel-info">
                                            <span
                                                className="cf-channel-icon-badge"
                                                style={{ background: channel.color }}
                                                dangerouslySetInnerHTML={{ __html: ICONS[channel.id] || "" }}
                                            />
                                            <div className="cf-channel-meta">
                                                <div className="cf-channel-meta-title">
                                                    {channel.label}
                                                    {channel.enabled && channel.value.trim() ? (
                                                        <span className="cf-channel-pill live">Active</span>
                                                    ) : null}
                                                </div>
                                                <div className="cf-channel-meta-hint">{meta?.hint || ""}</div>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={channel.enabled}
                                            onChange={(enabled) => updateChannel(channel.id, { enabled })}
                                        />
                                    </div>

                                    {channel.enabled && (
                                        <div className="cf-channel-body">
                                            <div className="cf-field-grid">
                                                <Field label={meta?.label || "Handle / ID"}>
                                                    <input
                                                        className="cf-input"
                                                        maxLength={150}
                                                        value={channel.value}
                                                        onChange={(e) => updateChannel(channel.id, { value: e.target.value })}
                                                        placeholder={meta?.placeholder}
                                                    />
                                                </Field>
                                                <Field label="Button Color">
                                                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                                        <input
                                                            type="color"
                                                            className="cf-color-picker"
                                                            value={channel.color}
                                                            onChange={(e) => updateChannel(channel.id, { color: e.target.value })}
                                                        />
                                                        <input
                                                            className="cf-input"
                                                            style={{ width: 80 }}
                                                            maxLength={30}
                                                            value={channel.color}
                                                            onChange={(e) => updateChannel(channel.id, { color: e.target.value })}
                                                        />
                                                    </div>
                                                </Field>
                                            </div>
                                            {["whatsapp", "telegram"].includes(channel.id) && (
                                                <Field
                                                    label="Pre-filled Welcome Message"
                                                    hint="Automatically fills visitor's chat input."
                                                >
                                                    <input
                                                        className="cf-input"
                                                        maxLength={300}
                                                        value={channel.message || ""}
                                                        onChange={(e) => updateChannel(channel.id, { message: e.target.value })}
                                                        placeholder="Hello! I'd like to know more."
                                                    />
                                                </Field>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </Section>
                ) : null}

                {tab === "design" ? (
                    <Section
                        title="Floating Launcher Design"
                        description="Customize the floating button position, shape, size, layout, animation, and responsive offsets."
                    >
                        <div className="cf-field-grid">
                            <Field label="Position">
                                <select
                                    className="cf-input"
                                    value={config.position}
                                    onChange={(e) => updateConfig({ position: e.target.value as any })}
                                >
                                    <option value="bottom-right">Bottom Right</option>
                                    <option value="bottom-left">Bottom Left</option>
                                    <option value="top-right">Top Right</option>
                                    <option value="top-left">Top Left</option>
                                </select>
                            </Field>
                            <Field label="Toggle Button Icon" hint="Icon displayed on the main floating toggle button">
                                <select
                                    className="cf-input"
                                    value={config.launcherIcon || "chat"}
                                    onChange={(e) => updateConfig({ launcherIcon: e.target.value as any })}
                                >
                                    <option value="chat">Live Chat (Speech Bubble)</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="messenger">Messenger</option>
                                    <option value="telegram">Telegram</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="phone">Phone Call</option>
                                    <option value="email">Email</option>
                                    <option value="support">Customer Support (Headset)</option>
                                </select>
                            </Field>
                        </div>

                        <div className="cf-field-grid">
                            <Field label="Button Shape">
                                <select
                                    className="cf-input"
                                    value={config.buttonShape}
                                    onChange={(e) => updateConfig({ buttonShape: e.target.value as any })}
                                >
                                    <option value="circle">Circle</option>
                                    <option value="rounded">Rounded Square</option>
                                    <option value="pill">Pill</option>
                                </select>
                            </Field>
                        </div>

                        <div className="cf-field-grid">
                            <Field label="Button Menu Layout" hint="Arrange channel buttons in vertical stack, 2-column grid, or horizontal row">
                                <select
                                    className="cf-input"
                                    value={config.layout}
                                    onChange={(e) => updateConfig({ layout: e.target.value as any })}
                                >
                                    <option value="stack">Stack (Vertical)</option>
                                    <option value="grid">Grid (2 Columns)</option>
                                    <option value="horizontal">Horizontal Row</option>
                                </select>
                            </Field>
                            <Field label="Entrance Animation" hint="Motion preset when launcher/window opens">
                                <select
                                    className="cf-input"
                                    value={config.animation}
                                    onChange={(e) => updateConfig({ animation: e.target.value as any })}
                                >
                                    <option value="pop">Pop In</option>
                                    <option value="bounce">Playful Bounce</option>
                                    <option value="slide">Slide Up</option>
                                    <option value="pulse">Pulse Glow</option>
                                    <option value="none">None (Instant)</option>
                                </select>
                            </Field>
                        </div>

                        <div className="cf-field-grid">
                            <Field label="Button Size">
                                <select
                                    className="cf-input"
                                    value={config.buttonSize}
                                    onChange={(e) => updateConfig({ buttonSize: Number(e.target.value) })}
                                >
                                    <option value={46}>Small (46px)</option>
                                    <option value={56}>Medium (56px)</option>
                                    <option value={64}>Large (64px)</option>
                                </select>
                            </Field>
                            <Field label="Launcher Default Color">
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    <input
                                        type="color"
                                        className="cf-color-picker"
                                        value={config.buttonColor}
                                        onChange={(e) => updateConfig({ buttonColor: e.target.value })}
                                    />
                                    <input
                                        className="cf-input"
                                        style={{ width: 80 }}
                                        maxLength={30}
                                        value={config.buttonColor}
                                        onChange={(e) => updateConfig({ buttonColor: e.target.value })}
                                    />
                                </div>
                            </Field>
                        </div>

                        <div className="cf-field-grid">
                            <Field label="Show Channel Labels" hint="Display text labels alongside channel buttons">
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                                    <Switch
                                        checked={config.showLabels}
                                        onChange={(showLabels) => updateConfig({ showLabels })}
                                    />
                                    <span style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                        {config.showLabels ? "Visible" : "Hidden"}
                                    </span>
                                </div>
                            </Field>

                            <Field label="Labels on Mobile" hint="Keep labels visible on smaller screens (<640px)">
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                                    <Switch
                                        checked={config.mobileShowLabels}
                                        onChange={(mobileShowLabels) => updateConfig({ mobileShowLabels })}
                                    />
                                    <span style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                        {config.mobileShowLabels ? "Visible" : "Hidden"}
                                    </span>
                                </div>
                            </Field>
                        </div>

                        <div className="cf-field-grid">
                            <Field label="Desktop Offset X (px)">
                                <input
                                    type="number"
                                    className="cf-input"
                                    min={0}
                                    max={300}
                                    value={config.offsetX}
                                    onChange={(e) => updateConfig({ offsetX: Number(e.target.value) || 0 })}
                                />
                            </Field>
                            <Field label="Desktop Offset Y (px)">
                                <input
                                    type="number"
                                    className="cf-input"
                                    min={0}
                                    max={300}
                                    value={config.offsetY}
                                    onChange={(e) => updateConfig({ offsetY: Number(e.target.value) || 0 })}
                                />
                            </Field>
                        </div>

                        <div className="cf-field-grid">
                            <Field label="Mobile Offset X (px)" hint="Distance from screen edge on mobile (<640px)">
                                <input
                                    type="number"
                                    className="cf-input"
                                    min={0}
                                    max={200}
                                    value={config.mobileOffsetX}
                                    onChange={(e) => updateConfig({ mobileOffsetX: Number(e.target.value) || 0 })}
                                />
                            </Field>
                            <Field label="Mobile Offset Y (px)" hint="Distance from screen edge on mobile (<640px)">
                                <input
                                    type="number"
                                    className="cf-input"
                                    min={0}
                                    max={200}
                                    value={config.mobileOffsetY}
                                    onChange={(e) => updateConfig({ mobileOffsetY: Number(e.target.value) || 0 })}
                                />
                            </Field>
                        </div>

                        <Field label="Accessibility ARIA Label" hint="Screen reader text describing the floating launcher button">
                            <input
                                className="cf-input"
                                maxLength={80}
                                value={config.ariaLabel}
                                onChange={(e) => updateConfig({ ariaLabel: e.target.value })}
                                placeholder="Open chat options"
                            />
                        </Field>

                        <div className="cf-field-grid">
                            <Field label="Unread Notification Badge">
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                                    <Switch
                                        checked={config.showBadge}
                                        onChange={(showBadge) => updateConfig({ showBadge })}
                                    />
                                    {config.showBadge && (
                                        <input
                                            className="cf-input"
                                            style={{ width: 60 }}
                                            maxLength={10}
                                            value={config.badgeText}
                                            onChange={(e) => updateConfig({ badgeText: e.target.value })}
                                            placeholder="1"
                                        />
                                    )}
                                </div>
                            </Field>

                            <Field label="Greeting Bubble Preview">
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                                    <Switch
                                        checked={config.greetingEnabled}
                                        onChange={(greetingEnabled) => updateConfig({ greetingEnabled })}
                                    />
                                    <span style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                        {config.greetingEnabled ? "Visible" : "Hidden"}
                                    </span>
                                </div>
                            </Field>
                        </div>

                        {config.greetingEnabled && (
                            <Field label="Greeting Bubble Text">
                                <input
                                    className="cf-input"
                                    maxLength={200}
                                    value={config.greetingText}
                                    onChange={(e) => updateConfig({ greetingText: e.target.value })}
                                    placeholder="Need help? Chat with us."
                                />
                            </Field>
                        )}
                    </Section>
                ) : null}

                {tab === "behavior" ? (
                    <Section
                        title="Interaction &amp; Behavior"
                        description="Configure how and when the chat button triggers, auto-opens, and closes for site visitors."
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cf-text)" }}>
                                        Auto-open on Load
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                        Automatically pop open the chat modal or channel menu for visitors.
                                    </div>
                                </div>
                                <Switch
                                    checked={config.autoOpen || false}
                                    onChange={(autoOpen) => updateConfig({ autoOpen })}
                                />
                            </div>

                            {config.autoOpen && (
                                <Field label="Auto-open Delay (Seconds)" hint="How long to wait after page load before opening">
                                    <input
                                        type="number"
                                        className="cf-input"
                                        min={0}
                                        max={60}
                                        value={Math.round((config.autoOpenDelay || 1200) / 1000)}
                                        onChange={(e) => updateConfig({ autoOpenDelay: (Number(e.target.value) || 0) * 1000 })}
                                    />
                                </Field>
                            )}

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cf-text)" }}>
                                        Close on Outside Click
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                        Dismiss the menu or modal when visitor clicks elsewhere on the page.
                                    </div>
                                </div>
                                <Switch
                                    checked={config.closeOnOutsideClick ?? true}
                                    onChange={(closeOnOutsideClick) => updateConfig({ closeOnOutsideClick })}
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cf-text)" }}>
                                        Close on Escape Key
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                        Press Escape to dismiss chat and return keyboard focus to the launcher.
                                    </div>
                                </div>
                                <Switch
                                    checked={config.closeOnEscape ?? true}
                                    onChange={(closeOnEscape) => updateConfig({ closeOnEscape })}
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cf-text)" }}>
                                        Close After Clicking Channel
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                        Collapse the menu after a visitor selects and opens a channel.
                                    </div>
                                </div>
                                <Switch
                                    checked={config.closeAfterClick ?? true}
                                    onChange={(closeAfterClick) => updateConfig({ closeAfterClick })}
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cf-text)" }}>
                                        Open Channels in New Tab
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                        Launch chat app in a fresh browser tab so users keep your site open.
                                    </div>
                                </div>
                                <Switch
                                    checked={config.openInNewTab ?? true}
                                    onChange={(openInNewTab) => updateConfig({ openInNewTab })}
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cf-text)" }}>
                                        Greeting Bubble Sound
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--cf-text-secondary)" }}>
                                        Play a subtle notification chime when the bubble pops up.
                                    </div>
                                </div>
                                <Switch
                                    checked={config.enableSound ?? false}
                                    onChange={(enableSound) => updateConfig({ enableSound })}
                                />
                            </div>

                            <Field label="Greeting Appearance Delay (Seconds)">
                                <input
                                    type="number"
                                    className="cf-input"
                                    min={0}
                                    max={60}
                                    value={Math.round(config.greetingDelay / 1000)}
                                    onChange={(e) => updateConfig({ greetingDelay: (Number(e.target.value) || 0) * 1000 })}
                                />
                            </Field>
                        </div>
                    </Section>
                ) : null}
            </main>

            <footer className="actions" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                <button
                    type="button"
                    className="cf-btn primary"
                    onClick={handleInsertToCanvas}
                    disabled={inserting}
                    title="Insert reusable Chatfic component onto the Framer canvas"
                >
                    {inserting ? "Inserting..." : "Insert into Canvas"}
                </button>
                <button
                    type="button"
                    className="cf-btn secondary"
                    onClick={reset}
                    disabled={inserting}
                    title="Restore default settings"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                    <IconRefresh size={13} />
                    <span>Reset</span>
                </button>
            </footer>
        </div>
    )
}
