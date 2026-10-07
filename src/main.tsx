import { framer } from "@framer/plugin"
import "@framer/plugin/framer.css"
import React from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: any) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Chatfic Plugin Error Boundary Caught:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        padding: 24,
                        fontFamily: "Inter, system-ui, sans-serif",
                        color: "#ef4444",
                        background: "#141414",
                        minHeight: "100vh",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>⚠️</span>
                        <h3 style={{ color: "#ffffff", margin: 0, fontSize: 16 }}>Plugin Error</h3>
                    </div>
                    <p style={{ color: "#a1a1aa", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                        {this.state.error?.message || "An unexpected error occurred while loading Chatfic."}
                    </p>
                    <button
                        onClick={() => {
                            window.location.reload()
                        }}
                        style={{
                            marginTop: 8,
                            padding: "8px 16px",
                            borderRadius: 8,
                            background: "#0099ff",
                            color: "#ffffff",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 12,
                            width: "fit-content",
                        }}
                    >
                        Reload Plugin
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

// Suppress Framer development unchecked permission warnings
try {
    if ((framer as any).showUncheckedPermissionToasts !== undefined) {
        (framer as any).showUncheckedPermissionToasts = false
    }
    if (typeof (framer as any).isAllowedTo === "function") {
        ;(framer as any).isAllowedTo("setPluginData", "getPluginData", "setCustomCode", "getCustomCode")
    }
} catch {}

framer.showUI({
    position: "top right",
    width: 430,
    height: 760,
    resizable: true,
})

const root = document.getElementById("root")
if (!root) throw new Error("Root element not found")

createRoot(root).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
