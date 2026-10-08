import React from "react"
import { IconExternalLink } from "../icons"

interface FrameficCardProps {
    name: string
    description: string
    logoIcon: React.ReactNode
    marketplaceUrl: string
}

export function FrameficCard({
    name,
    description,
    logoIcon,
    marketplaceUrl,
}: FrameficCardProps) {
    return (
        <a
            href={marketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cf-marketplace-card"
            aria-label={`Open ${name} on Framer Marketplace`}
        >
            <div className="cf-marketplace-card-logo">{logoIcon}</div>
            <div className="cf-marketplace-card-info">
                <h4 className="cf-marketplace-card-name">{name}</h4>
                <p className="cf-marketplace-card-desc">{description}</p>
            </div>
            <div className="cf-marketplace-card-open">
                <IconExternalLink size={14} />
            </div>
        </a>
    )
}
