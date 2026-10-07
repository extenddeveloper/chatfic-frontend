// Test script to verify sanitization logic
import {
    sanitizeText,
    sanitizeMultilineText,
    sanitizeUrl,
    sanitizeAvatarUrl,
    sanitizePhone,
    sanitizeHandle,
    sanitizeEmail,
    sanitizeColor,
    sanitizeCssGradient,
    safeJsonStringify,
    resolveSafeChannelUrl,
    sanitizeConfig,
} from "../src/core/sanitize.ts"

console.log("Running sanitization security verification...")

// 1. Text & HTML stripping
const xss1 = "<script>alert('xss')</script>Hello <b>World</b>"
const cleanText1 = sanitizeText(xss1)
if (cleanText1.includes("<script>") || cleanText1.includes("<b>")) {
    throw new Error("sanitizeText did not strip HTML tags: " + cleanText1)
}
console.log("✓ HTML tags stripped properly:", cleanText1)

// 2. Script Tag Breakout Prevention
const payload = { title: "</script><script>alert('pwned')</script>" }
const json = safeJsonStringify(payload)
if (json.includes("</script>")) {
    throw new Error("safeJsonStringify failed! Found unescaped </script>")
}
if (!json.includes("\\u003c/script\\u003e")) {
    throw new Error("safeJsonStringify missing \\u003c: " + json)
}
console.log("✓ Script tag breakout prevented safely:", json)

// 3. Protocol Injection Protection
const evilUrls = [
    "javascript:alert(1)",
    "JAVASCRIPT:alert(document.cookie)",
    "  javascript :alert(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
]
for (const u of evilUrls) {
    const res = sanitizeUrl(u)
    if (res !== "") {
        throw new Error("sanitizeUrl failed to reject dangerous protocol: " + u + " -> " + res)
    }
}
console.log("✓ All dangerous URL protocols rejected")

// 4. Safe URLs allowed
const safeUrls = [
    "https://example.com/contact",
    "http://example.com/chat",
    "example.com/help",
]
for (const u of safeUrls) {
    const res = sanitizeUrl(u)
    if (!res.startsWith("http")) {
        throw new Error("sanitizeUrl failed on safe url: " + u + " -> " + res)
    }
}
console.log("✓ Safe URLs parsed and preserved")

// 5. Handle Sanitization
const dirtyHandle = "@bad_user<script>!@#"
const cleanHandle = sanitizeHandle(dirtyHandle)
if (cleanHandle !== "bad_user") {
    throw new Error("sanitizeHandle failed: " + cleanHandle)
}
console.log("✓ Social handles cleaned:", cleanHandle)

// 6. Phone Sanitization
const dirtyPhone = "+1 (800) 123-4567 <script>evil</script>"
const cleanPhone = sanitizePhone(dirtyPhone)
if (cleanPhone !== "+1 (800) 123-4567") {
    throw new Error("sanitizePhone failed: " + cleanPhone)
}
console.log("✓ Phone numbers sanitized:", cleanPhone)

// 7. CSS Gradient Injection
const evilGradient = "linear-gradient(to right, red); background: url('javascript:alert(1)')"
const cleanGrad = sanitizeCssGradient(evilGradient)
if (cleanGrad.includes("javascript") || cleanGrad.includes(";")) {
    throw new Error("sanitizeCssGradient failed to block CSS injection: " + cleanGrad)
}
console.log("✓ CSS gradients secured against injection")

// 8. Safe Channel Resolution
const customXss = resolveSafeChannelUrl("custom", "javascript:alert(1)")
if (customXss !== "") {
    throw new Error("resolveSafeChannelUrl failed to block javascript: on custom channel: " + customXss)
}
const waUrl = resolveSafeChannelUrl("whatsapp", "+1-234-567-8900", "<script>Hello!</script>")
if (waUrl.includes("<script>") || !waUrl.includes("https://wa.me/1234567890")) {
    throw new Error("resolveSafeChannelUrl failed for WhatsApp: " + waUrl)
}
console.log("✓ Channels resolved securely:", waUrl)

console.log("ALL 8 SECURITY TESTS PASSED WITH 100% SUCCESS!")
