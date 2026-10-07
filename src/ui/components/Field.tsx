import type { ReactNode } from "react"

export function Field({
    label,
    hint,
    children,
    full = false,
}: {
    label: string
    hint?: string
    children: ReactNode
    full?: boolean
}) {
    return (
        <div className={`cf-field ${full ? "full" : ""}`}>
            <label className="cf-field-label">{label}</label>
            <div className="cf-field-control">{children}</div>
            {hint ? <span className="cf-field-hint">{hint}</span> : null}
        </div>
    )
}
