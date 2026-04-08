import React from "react";
import Head from "@docusaurus/Head";
import { commands } from "@site/src/tableHome/commands.table";
import styles from "./index.module.css";

const ASCII_LOGO = `
 ███████╗███╗   ███╗██████╗    ███╗   ███╗███████╗
██╔════╝████╗ ████║██╔══██╗   ████╗ ████║██╔════╝
██║     ██╔████╔██║██║  ██║   ██╔████╔██║███████╗
██║     ██║╚██╔╝██║██║  ██║   ██║╚██╔╝██║╚════██║
╚██████╗██║ ╚═╝ ██║██████╔╝██╗██║ ╚═╝ ██║███████║
 ╚═════╝╚═╝     ╚═╝╚═════╝ ╚═╝╚═╝     ╚═╝╚══════╝`.trimStart();

// Column widths for the ASCII table — use a single-character column separator
const COL_CMD = 22;
const COL_NAME = 42;
const COL_ALIAS = 22;
const COL_GAP = "   ";

// Priority order for categories (lower = shown first)
const CATEGORY_ORDER = [
  "Entra",
  "Intune",
  "Defender",
  "XDR Sentinel",
  "Purview",
  "Microsoft 365",
  "Azure",
  "My Pages",
  "General",
];

// Pin these commands to the very top (in this order)
const PINNED_COMMANDS = [
  "enpim", "en", "enusers", "engroups", "enca", "enapps", "enappreg",
  "in", "indevices", "inapps",
  "defender", "sp", "teams",
];

// Build a pre-sorted command list
const sortedCommands = (() => {
  const pinSet = new Set(PINNED_COMMANDS);
  const pinOrder = Object.fromEntries(PINNED_COMMANDS.map((c, i) => [c, i]));
  const catOrder = Object.fromEntries(CATEGORY_ORDER.map((c, i) => [c, i]));

  const pinned = [];
  const rest = [];
  for (const cmd of commands) {
    if (pinSet.has(cmd.command)) {
      pinned.push(cmd);
    } else {
      rest.push(cmd);
    }
  }
  pinned.sort((a, b) => pinOrder[a.command] - pinOrder[b.command]);
  rest.sort((a, b) => {
    const ca = catOrder[a.category] ?? 999;
    const cb = catOrder[b.category] ?? 999;
    if (ca !== cb) return ca - cb;
    return a.description.localeCompare(b.description);
  });
  return [...pinned, ...rest];
})();

function pad(str, len) {
  if (!str) str = "";
  if (str.length > len) str = str.slice(0, len - 1) + "…";
  return str + " ".repeat(Math.max(0, len - str.length));
}

// Render a table row using spaces + dim separators (no box-drawing for data rows)
function formatRow(cmd, name, alias) {
  return " " + pad(cmd, COL_CMD) + COL_GAP + pad(name, COL_NAME) + COL_GAP + pad(alias, COL_ALIAS);
}

const NAV_LINKS = [
  { label: "merill.net", href: "https://merill.net" },
  { label: "Entra News", href: "https://entra.news" },
  { label: "Entra Chat", href: "https://entra.chat" },
  { label: "Graph X-Ray", href: "https://graphxray.merill.net" },
  { label: "Maester", href: "https://maester.dev" },
  { label: "Lokka", href: "https://lokka.dev" },
  { label: "GitHub", href: "https://github.com/merill/cmd" },
];

export default function TuiHome() {
  const [search, setSearch] = React.useState("");
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [showShortcuts, setShowShortcuts] = React.useState(false);
  const [hoveredIdx, setHoveredIdx] = React.useState(-1);
  const [theme, setTheme] = React.useState("dark");
  const [sortCol, setSortCol] = React.useState(null); // null | "command" | "name" | "alias"
  const [sortDir, setSortDir] = React.useState("asc"); // "asc" | "desc"
  const inputRef = React.useRef(null);
  const tableRef = React.useRef(null);
  const rowRefs = React.useRef([]);

  const toggleSort = (col) => {
    if (sortCol === col) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortCol(null); setSortDir("asc"); } // third click resets
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const sortIndicator = (col) => {
    if (sortCol !== col) return " ·";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  // Filter and sort commands
  const filtered = React.useMemo(() => {
    let list = sortedCommands;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.command.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.alias && c.alias.toLowerCase().includes(q)) ||
          (c.keywords && c.keywords.toLowerCase().includes(q)) ||
          (c.category && c.category.toLowerCase().includes(q))
      );
    }
    if (sortCol) {
      const key = sortCol === "command" ? "command" : sortCol === "name" ? "description" : "alias";
      list = [...list].sort((a, b) => {
        const va = (a[key] || "").toLowerCase();
        const vb = (b[key] || "").toLowerCase();
        const cmp = va.localeCompare(vb);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [search, sortCol, sortDir]);

  // Reset selection when filter changes
  React.useEffect(() => {
    setSelectedIdx(0);
  }, [filtered.length, search]);

  // Scroll selected row into view
  React.useEffect(() => {
    if (selectedIdx >= 0 && rowRefs.current[selectedIdx]) {
      rowRefs.current[selectedIdx].scrollIntoView({ block: "nearest" });
    }
  }, [selectedIdx]);

  // Focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Global keyboard handler
  React.useEffect(() => {
    const handler = (e) => {
      // ` — toggle dark/light mode (works everywhere including input)
      if (e.key === "`" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setTheme((t) => (t === "dark" ? "light" : "dark"));
        return;
      }

      // ? — toggle shortcuts overlay (works everywhere including input)
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      // Esc
      if (e.key === "Escape") {
        if (showShortcuts) {
          setShowShortcuts(false);
          return;
        }
        setSearch("");
        if (inputRef.current) inputRef.current.value = "";
        inputRef.current?.focus();
        setSelectedIdx(0);
        return;
      }

      // ArrowDown
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, filtered.length - 1));
        return;
      }

      // ArrowUp
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => {
          if (prev <= 0) {
            inputRef.current?.focus();
            return 0;
          }
          return prev - 1;
        });
        return;
      }

      // Enter — open selected
      if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIdx >= 0 && selectedIdx < filtered.length) {
          const url = filtered[selectedIdx].url;
          if (url) window.open(url, "_blank", "noopener,noreferrer");
        }
        return;
      }

      // / — focus search (when not already in input)
      const tag = document.activeElement?.tagName;
      if (
        e.key === "/" &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        tag !== "INPUT" &&
        tag !== "TEXTAREA" &&
        tag !== "SELECT"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      // Any printable char — focus input
      if (
        e.key.length === 1 &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        tag !== "INPUT" &&
        tag !== "TEXTAREA" &&
        tag !== "SELECT"
      ) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [filtered, selectedIdx, showShortcuts]);

  const handleRowClick = (idx) => {
    setSelectedIdx(idx);
    const url = filtered[idx]?.url;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const separator = " " + "─".repeat(COL_CMD) + COL_GAP + "─".repeat(COL_NAME) + COL_GAP + "─".repeat(COL_ALIAS);

  return (
    <>
      <Head>
        <title>[cmd.ms] — The Microsoft Cloud Command Line</title>
        <meta
          name="description"
          content="cmd.ms: The Microsoft cloud command line for Microsoft 365, Azure, Entra, Intune, Defender, and more. Type a command to jump straight to any Microsoft portal."
        />
        <meta name="theme-color" content={theme === "dark" ? "#0a0a0a" : "#f5f5f5"} />
        <link rel="search" type="application/opensearchdescription+xml" title="[cmd.ms] Search" href="/opensearch.xml" />
        <style>{`
          html, body, #__docusaurus, [class*="docMainContainer"], [class*="docPage"], main, .main-wrapper {
            background: ${theme === "dark" ? "#0a0a0a" : "#f5f5f5"} !important;
            margin: 0;
            padding: 0;
          }
          .navbar, .footer, nav[class*="navbar"], footer[class*="footer"] {
            display: none !important;
          }
          pre, code {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
            font-family: inherit !important;
          }
          input, input:focus, input:focus-visible {
            outline: none !important;
            box-shadow: none !important;
            border: none !important;
            --tw-ring-shadow: none !important;
            --tw-ring-color: transparent !important;
          }
        `}</style>
      </Head>

      <div className={`${styles.terminal} ${theme === "light" ? styles.terminalLight : ""}`}>
        {/* Top nav bar */}
        <div className={styles.topNav}>
          <div className={styles.topNavLeft}>
            <a href="/docs" className={styles.topNavLink}>Docs</a>
            <a href="/docs/docs/tips" className={styles.topNavLink}>Power User Tips</a>
          </div>
          <div className={styles.topNavRight}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.topNavLink}
              >
                {link.label}
              </a>
            ))}
            <button
              className={styles.themeToggle}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle light/dark mode"
              title="Toggle light/dark mode"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* ASCII Logo */}
        <pre className={styles.logo}>{ASCII_LOGO}</pre>
        <div className={styles.subtitle}>The Microsoft Cloud command line</div>
        <div className={styles.tagline}>
          Type a command to jump to any Microsoft portal — or use <span className={styles.highlight}>[command].cmd.ms</span> in your browser address bar.
        </div>
        <div className={styles.tagline}>
          🚀 Use the power of your browser's address bar, check out the <a href="/docs/docs/tips" className={styles.taglineLink}>Power User Tips</a>
        </div>

        {/* Search box */}
        <div className={styles.searchArea}>
          <span className={styles.searchPrefix}>C:\cmd.ms&gt;</span>
          <div className={styles.searchInputWrap}>
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands..."
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
            <span className={styles.blockCursor} style={{ left: `${search.length}ch` }} />
          </div>
        </div>

        {/* Results count */}
        <div className={styles.resultCount}>
          {filtered.length} command{filtered.length !== 1 ? "s" : ""} found
          {search && <span> matching <span className={styles.highlightYellow}>"{search}"</span></span>}
        </div>

        {/* Table */}
        <div className={styles.tableContainer} ref={tableRef}>
          {/* Header */}
          <div className={styles.tableHeader}>
            <span className={styles.sortable} onClick={() => toggleSort("command")}>{" " + pad("COMMAND" + sortIndicator("command"), COL_CMD)}</span>
            <span>{COL_GAP + " "}</span>
            <span className={styles.sortable} onClick={() => toggleSort("name")}>{pad("NAME" + sortIndicator("name"), COL_NAME)}</span>
            <span>{COL_GAP + " "}</span>
            <span className={styles.sortable} onClick={() => toggleSort("alias")}>{pad("ALIAS" + sortIndicator("alias"), COL_ALIAS)}</span>
          </div>

          {/* Separator */}
          <div className={styles.tableSeparator}>{separator}</div>

          {/* Data rows */}
          {filtered.length === 0 ? (
            <div className={styles.noResults}>
              <div>Command not found.</div>
              <div className={styles.noResultsSub}>
                Want to add a new command to cmd.ms? <a href="/docs/docs/contributing" className={styles.noResultsLink}>Learn how to contribute →</a>
              </div>
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <div
                key={cmd.command + i}
                ref={(el) => (rowRefs.current[i] = el)}
                className={`${styles.tableRow} ${
                  i === selectedIdx
                    ? styles.rowSelected
                    : i === hoveredIdx
                    ? styles.rowHover
                    : ""
                }`}
                onClick={() => handleRowClick(i)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
              >
                <span className={styles.colCmd}>{" " + cmd.command}<span className={styles.colCmdSuffix}>{pad(".cmd.ms", COL_CMD - cmd.command.length)}</span></span>
                <span className={styles.colGap}>{COL_GAP}</span>
                <span className={styles.colName}>{pad(cmd.description, COL_NAME)}</span>
                <span className={styles.colGap}>{COL_GAP}</span>
                <span className={styles.colAlias}>{pad(cmd.alias || "", COL_ALIAS)}</span>
              </div>
            ))
          )}
        </div>

        {/* Footer bar */}
        <div className={styles.footerBar}>
          <div className={styles.footerLeft}>
            <span><kbd>↑↓</kbd> Navigate</span>
            <span><kbd>Enter</kbd> Open</span>
            <span><kbd>/</kbd> Search</span>
            <span><kbd>Esc</kbd> Clear</span>
            <span><kbd>`</kbd> Theme</span>
            <span><kbd>?</kbd> Help</span>
          </div>
          <div className={styles.footerRight}>
            Made in 🦘 Australia with ❤️
          </div>
        </div>

        {/* Shortcuts overlay */}
        {showShortcuts && (
          <div
            className={styles.shortcutsOverlay}
            onClick={() => setShowShortcuts(false)}
          >
            <div
              className={styles.shortcutsDialog}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.shortcutsHeader}>
                <h2>⌨️ Keyboard Shortcuts</h2>
                <button
                  className={styles.shortcutsClose}
                  onClick={() => setShowShortcuts(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <div className={styles.shortcutsGrid}>
                <div className={styles.shortcutCard}>
                  <span className={styles.shortcutKeys}><kbd>/</kbd></span>
                  <span className={styles.shortcutLabel}>Focus search</span>
                </div>
                <div className={styles.shortcutCard}>
                  <span className={styles.shortcutKeys}><kbd>↑</kbd> <kbd>↓</kbd></span>
                  <span className={styles.shortcutLabel}>Navigate rows</span>
                </div>
                <div className={styles.shortcutCard}>
                  <span className={styles.shortcutKeys}><kbd>↵</kbd></span>
                  <span className={styles.shortcutLabel}>Open selected</span>
                </div>
                <div className={styles.shortcutCard}>
                  <span className={styles.shortcutKeys}><kbd>Esc</kbd></span>
                  <span className={styles.shortcutLabel}>Clear search</span>
                </div>
                <div className={styles.shortcutCard}>
                  <span className={styles.shortcutKeys}><kbd>`</kbd></span>
                  <span className={styles.shortcutLabel}>Toggle theme</span>
                </div>
                <div className={styles.shortcutCard}>
                  <span className={styles.shortcutKeys}><kbd>?</kbd></span>
                  <span className={styles.shortcutLabel}>This help</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
