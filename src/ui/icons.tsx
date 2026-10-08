import React from "react"

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number
}

export function IconCheck({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
        </svg>
    )
}

export function IconGear({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    )
}

export function IconX({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
    )
}

export function IconCamera({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h1.5l1-1.5h3l1 1.5H12a1.5 1.5 0 0 1 1.5 1.5v6.5a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5V5.5z" />
            <circle cx="8" cy="8.7" r="2.2" />
        </svg>
    )
}

export function IconUpload({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M8 10V2M5 5l3-3 3 3" />
            <path d="M2.5 10v3a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3" />
        </svg>
    )
}

export function IconUser({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="8" cy="5" r="3" />
            <path d="M2.5 14a5.5 5.5 0 0 1 11 0" />
        </svg>
    )
}

export function IconLink({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M6.5 9.5l3-3" />
            <path d="M9 5l1.5-1.5a2.5 2.5 0 0 1 3.5 3.5L12.5 8.5a2.5 2.5 0 0 1-3.5 0" />
            <path d="M7 11l-1.5 1.5a2.5 2.5 0 0 1-3.5-3.5L3.5 7.5a2.5 2.5 0 0 1 3.5 0" />
        </svg>
    )
}

export function IconRefresh({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M2 7.5A6 6 0 1 1 3.8 12" />
            <path d="M2 3.5v4h4" />
        </svg>
    )
}

export function IconClock({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v3.2l2.2 1.3" />
        </svg>
    )
}

export function IconArrowLeft({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M10.5 3.5L6 8l4.5 4.5" />
        </svg>
    )
}

export function IconArrowRight({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M5.5 3.5L10 8l-4.5 4.5" />
        </svg>
    )
}

export function IconChevronRight({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M6 3.5L10.5 8L6 12.5" />
        </svg>
    )
}

export function IconSpinner({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cf-spinner"
            {...props}
        >
            <path d="M8 2a6 6 0 1 0 6 6" strokeOpacity="0.3" />
            <path d="M14 8a6 6 0 0 0-6-6" />
        </svg>
    )
}

export function IconLayoutModal({ size = 16, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <rect x="2" y="2" width="12" height="12" rx="2.5" />
            <path d="M2 6h12M10.5 4h1" />
        </svg>
    )
}

export function IconLayoutButtons({ size = 16, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="4" cy="4" r="2" />
            <circle cx="4" cy="9" r="2" />
            <circle cx="4" cy="14" r="2" />
            <path d="M8 4h6M8 9h6M8 14h4" />
        </svg>
    )
}

export function IconPlus({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M8 3v10M3 8h10" />
        </svg>
    )
}

export function IconSun({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
        </svg>
    )
}

export function IconMoon({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M13.5 9.8A6 6 0 1 1 6.2 2.5a4.8 4.8 0 0 0 7.3 7.3z" />
        </svg>
    )
}
