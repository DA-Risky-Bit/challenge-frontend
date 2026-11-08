import { useEffect, useState } from "react";

const COOKIE_NAME = "rb_notice";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 12 months
const EVENT_NAME = "rb-cookie-notice";

export function hasAcknowledged(): boolean {
    if (typeof document === "undefined") return false;
    return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

export function setAcknowledged(domain?: string) {
    const parts = [`${COOKIE_NAME}=1`, `Max-Age=${MAX_AGE_SECONDS}`, "Path=/", "SameSite=Lax"];
    if (domain) parts.push(`Domain=${domain}`);
    if (window.location.protocol === "https:") parts.push("Secure");
    document.cookie = parts.join("; ");
    window.dispatchEvent(new Event(EVENT_NAME));
}

/** Call this from a footer link to show the notice again. */
export function reopenCookieNotice() {
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/`;
    window.dispatchEvent(new Event(EVENT_NAME));
}

/** null until the browser has been checked, then true or false; follows the banner live. */
export function useCookieAcknowledged(): boolean | null {
    const [acknowledged, setValue] = useState<boolean | null>(null);
    useEffect(() => {
        const sync = () => setValue(hasAcknowledged());
        sync();
        window.addEventListener(EVENT_NAME, sync);
        return () => window.removeEventListener(EVENT_NAME, sync);
    }, []);
    return acknowledged;
}