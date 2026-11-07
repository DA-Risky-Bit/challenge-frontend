export default function Dots({ count }: { count: number }) {
  return (
    <span className="dots" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= count ? "on" : undefined} />
      ))}
    </span>
  );
}
