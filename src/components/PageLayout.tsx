import type { PropsWithChildren } from "react";

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <main className="app-shell">
      <header className="masthead">
        <a className="brand" href="#top" aria-label="TryTat home">
          Try<span>Tat</span>
        </a>
        <p>
          Private by design <i aria-hidden="true" />
          Images never leave your browser
        </p>
      </header>

      <section className="intro" id="top">
        <p className="eyebrow">A quick placement study</p>
        <h1>See the idea <em>before</em> the ink.</h1>
        <p>
          Layer a transparent tattoo design over your own photo. Adjust it until
          the placement feels right, then take a screenshot.
        </p>
      </section>

      {children}

      <footer>
        <span>TryTat / Placement study</span>
        <span>No uploads. No accounts. No trace.</span>
      </footer>
    </main>
  );
}
