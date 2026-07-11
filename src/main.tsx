import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <main>
      <h1>TryTat</h1>
      <p>Virtual tattoo try-on workspace coming next.</p>
    </main>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("React needs the #root element from index.html to start.");
}

// React renders the App component inside the empty div from index.html.
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
