import Link from "next/link";
import { Brand } from "./Brand";

export function PublicHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Brand />
        <div className="spacer" />
        <nav className="public-nav" aria-label="Site">
          <Link href="/#programs">Programs</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/dashboard">Student sign in</Link>
          <Link href="/apply" className="btn btn--primary btn--sm">Apply</Link>
        </nav>
      </div>
    </header>
  );
}
