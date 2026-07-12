import type { PropsWithChildren } from "react";

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <main className="app-shell">
      <header className="masthead">
        <a className="brand" href="#top" aria-label="TryTat home">
          Try<span>Tat</span>
        </a>
        <p>
          Quick and easy <i aria-hidden="true" />
          No sign-up
        </p>
      </header>

      <section className="intro" id="top">
        <h1>Tattoos are <em>forever.</em> Try it first.</h1>
        <p>
          Layer a transparent tattoo design over your own photo. Adjust it until
          the placement feels right, then download your preview.
        </p>
      </section>

      {children}

      <footer>
        <span>TryTat™</span>
      </footer>
    </main>
  );
}
