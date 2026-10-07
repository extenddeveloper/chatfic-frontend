export function Switch({
    checked,
    onChange,
    id,
    disabled = false,
}: {
    checked: boolean
    onChange: (value: boolean) => void
    id?: string
    disabled?: boolean
}) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            className={`cf-switch ${checked ? "is-on" : ""}`}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!disabled) onChange(!checked)
            }}
        >
            <span className="cf-switch-thumb" />
        </button>
    )
}
