import { framer } from "@framer/plugin"
import type { ChatConfig } from "../types"
import { buildWidgetCode } from "../widget/widget-template"

const LOCATION = "bodyEnd" as const

async function ensurePermission(method: string): Promise<void> {
    try {
        if (typeof (framer as any).isAllowedTo === "function") {
            await (framer as any).isAllowedTo(method)
        }
    } catch {
        // Ignore
    }
}

export async function installWidget(config: ChatConfig): Promise<void> {
    await ensurePermission("setCustomCode")
    const html = buildWidgetCode(config)
    await framer.setCustomCode({
        html,
        location: LOCATION,
    })
}

export async function removeWidget(): Promise<void> {
    await ensurePermission("setCustomCode")
    await framer.setCustomCode({
        html: null,
        location: LOCATION,
    })
}

export async function getWidgetStatus(): Promise<{ installed: boolean; disabled: boolean }> {
    await ensurePermission("getCustomCode")
    const customCode = await framer.getCustomCode()
    return {
        installed: Boolean(customCode.bodyEnd.html),
        disabled: Boolean(customCode.bodyEnd.disabled),
    }
}
