import type { Paragraph } from "~/types";

// A paragraph is either a plain string or a list of segments.
// A segment is a string or { text, href? }; with an href it becomes an external link in a new tab.
export default function RichParagraph({ content }: { content: Paragraph }) {
  if (typeof content === "string") return <p>{content}</p>;

  return (
    <p>
      {content.map((seg, i) =>
        typeof seg === "string" ? (
          <span key={i}>{seg}</span>
        ) : seg.href ? (
          <a key={i} className="ext" href={seg.href} target="_blank" rel="noopener noreferrer">{seg.text}</a>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </p>
  );
}
