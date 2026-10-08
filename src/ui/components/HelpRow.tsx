import React from "react"
import { IconFileText, IconMail, IconList } from "../icons"

interface HelpTileProps {
    label: string
    icon: React.ReactNode
    onClick?: () => void
    href?: string
    hasDot?: boolean
}

export function HelpTile({ label, icon, onClick, href, hasDot = false }: HelpTileProps) {
    const content = (
        <>
            <div className="cf-help-tile-icon-box">
                {icon}
                {hasDot ? <span className="cf-help-tile-dot" /> : null}
            </div>
            <span className="cf-help-tile-label">{label}</span>
        </>
    )

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="cf-help-tile">
                {content}
            </a>
        )
    }

    return (
        <button type="button" className="cf-help-tile" onClick={onClick}>
            {content}
        </button>
    )
}

export function HelpRow({
    onOpenGuide,
    onContactUs,
    onOpenChangelog,
    hasNewUpdate = false,
}: {
    onOpenGuide?: () => void
    onContactUs?: () => void
    onOpenChangelog?: () => void
    hasNewUpdate?: boolean
}) {
    return (
        <div className="cf-help-tile-row">
            <HelpTile
                label="Guide"
                icon={<IconFileText size={16} />}
                onClick={onOpenGuide}
                href="https://framefic.com/docs/"
            />
            <HelpTile
                label="Contact us"
                icon={<IconMail size={16} />}
                onClick={onContactUs}
                href="https://framefic.com/contact/"
            />
            <HelpTile
                label="Changelog"
                icon={<IconList size={16} />}
                onClick={onOpenChangelog}
                hasDot={hasNewUpdate}
            />
        </div>
    )
}
