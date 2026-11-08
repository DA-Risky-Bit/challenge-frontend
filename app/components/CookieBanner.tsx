import { reopenCookieNotice, setAcknowledged, useCookieAcknowledged } from "~/utils/cookies";

type Props = {
  privacyUrl?: string;
  cookieDomain?: string;
};

export { reopenCookieNotice };

export default function CookieBanner({ privacyUrl = "/privacy", cookieDomain }: Props) {
  const acknowledged = useCookieAcknowledged();

  if (acknowledged !== false) return null;

  return (
      <div
          role="region"
          aria-label="Cookie notice"
          className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t border-gray-300 bg-white px-4 py-3 text-sm text-black"
      >
        <p>
          We use one cookie to keep you signed in. No tracking or advertising cookies.{" "}
          <a href={privacyUrl} className="underline">
            Privacy policy
          </a>
        </p>
        <button
            type="button"
            onClick={() => setAcknowledged(cookieDomain)}
            className="shrink-0 rounded-md bg-black px-3 py-1.5 font-medium! text-white!"
        >
          Got it
        </button>
      </div>
  );
}