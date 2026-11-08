import { useEffect, useState } from "react";

const COOKIE_NAME = "rb_notice";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 12 months

type Props = {
  privacyUrl?: string;
  cookieDomain?: string;
};

function hasAcknowledged(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

function setAcknowledged(domain?: string) {
  const parts = [`${COOKIE_NAME}=1`, `Max-Age=${MAX_AGE_SECONDS}`, "Path=/", "SameSite=Lax"];
  if (domain) parts.push(`Domain=${domain}`);
  if (window.location.protocol === "https:") parts.push("Secure");
  document.cookie = parts.join("; ");
}

/** Call this from a footer link to show the notice again. */
export function reopenCookieNotice() {
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/`;
  window.dispatchEvent(new Event("rb-cookie-notice"));
}

export default function CookieBanner({ privacyUrl = "/privacy", cookieDomain }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(!hasAcknowledged());
    sync();
    window.addEventListener("rb-cookie-notice", sync);
    return () => window.removeEventListener("rb-cookie-notice", sync);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
    >
      <p>
        We use one cookie to keep you signed in. No tracking or advertising cookies.{" "}
        <a href={privacyUrl} className="underline">
          Privacy policy
        </a>
      </p>
      <button
        type="button"
        onClick={() => {
          setAcknowledged(cookieDomain);
          setVisible(false);
        }}
        className="shrink-0 rounded-md bg-gray-900 px-3 py-1.5 font-medium text-white dark:bg-gray-100 dark:text-gray-900"
      >
        Got it
      </button>
    </div>
  );
}
