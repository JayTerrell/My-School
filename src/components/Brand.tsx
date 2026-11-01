import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="Athenaeum home">
      <span className="brand__mark" aria-hidden>A</span>
      <span>
        <span className="brand__name" style={{ display: "block" }}>Athenaeum</span>
        <span className="brand__sub" style={{ display: "block" }}>Independent Programs of Study</span>
      </span>
    </Link>
  );
}
