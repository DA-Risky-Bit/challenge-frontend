import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const COOKIE_NAME = "rb_notice";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 12 months

type Props = {
  /** Where your privacy policy lives. */
  privacyUrl?: string;
  /** Leave undefined for a host-only cookie (recommended). */
  cookieDomain?: string;
};

function hasAcknowledged(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

function setAcknowledged(domain?: string) {
  const parts = [
    `${COOKIE_NAME}=1`,
    `Max-Age=${MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax",
  ];
  if (domain) parts.push(`Domain=${domain}`);
  if (window.location.protocol === "https:") parts.push("Secure");
  document.cookie = parts.join("; ");
}

/** Call this from a footer link to show the notice again. */
export function reopenCookieNotice() {
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/`;
  window.dispatchEvent(new Event("rb-cookie-notice"));
}

export default function CookieBanner({
  privacyUrl = "/privacy",
  cookieDomain,
}: Props) {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Runs only in the browser, so it is safe with SSR.
  useEffect(() => {
    const sync = () => setVisible(!hasAcknowledged());
    sync();
    window.addEventListener("rb-cookie-notice", sync);
    return () => window.removeEventListener("rb-cookie-notice", sync);
  }, []);

  // While visible: lock scroll, make the rest of the page inert, trap focus.
  useEffect(() => {
    if (!visible) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inerted: Element[] = [];
    Array.from(document.body.children).forEach((el) => {
      if (el.hasAttribute("data-rb-cookie-root")) return;
      if (el.tagName === "SCRIPT" || el.tagName === "STYLE") return;
      if (!el.hasAttribute("inert")) {
        el.setAttribute("inert", "");
        inerted.push(el);
      }
    });

    buttonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      inerted.forEach((el) => el.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [visible]);

  if (!visible) return null;

  const dismiss = () => {
    setAcknowledged(cookieDomain);
    setVisible(false);
  };

  return createPortal(
    <div data-rb-cookie-root>
      <div className="fixed inset-0 `z-2147483000 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rb-cookie-title"
          aria-describedby="rb-cookie-text"
          className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        >
          <h2 id="rb-cookie-title" className="mb-2 text-lg font-semibold">
            Cookies on this site
          </h2>
          <p id="rb-cookie-text" className="mb-5 text-[15px] leading-relaxed">
            We use one cookie to keep you signed in, and our analytics don't
            store anything on your device. No advertising or tracking cookies.{" "}
            <a
              href={privacyUrl}
              className="rounded-sm underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              Privacy policy
            </a>
          </p>
          <button
            ref={buttonRef}
            type="button"
            onClick={dismiss}
            className="w-full cursor-pointer rounded-lg bg-gray-900 px-4 py-2.5 font-semibold text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus-visible:outline-gray-100"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
