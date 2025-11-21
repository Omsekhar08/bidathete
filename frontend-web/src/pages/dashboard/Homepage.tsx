import React, { useEffect, useMemo, useState } from "react";

type ContentItem = {
    id: string;
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    createdAt?: string;
};

const SAMPLE_DATA: ContentItem[] = [
    {
        id: "1",
        title: "Welcome to BidAthlete",
        description: "Overview of your dashboard and latest activity.",
        category: "General",
        tags: ["intro", "overview"],
        createdAt: "2025-01-10",
    },
    {
        id: "2",
        title: "Active Bids",
        description: "See all items you have placed bids on.",
        category: "Bids",
        tags: ["bids", "activity"],
        createdAt: "2025-02-02",
    },
    {
        id: "3",
        title: "Saved Items",
        description: "Items you've saved for later.",
        category: "Saved",
        tags: ["saved", "watchlist"],
        createdAt: "2025-02-20",
    },
    // add more sample items or leave as-is for fallback
];

export default function Homepage(): JSX.Element {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [sortKey, setSortKey] = useState<"newest" | "oldest" | "title">(
        "newest"
    );
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 8;

    useEffect(() => {
        // Attempt to fetch real data from an API endpoint; fallback to sample data.
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/contents", { signal: controller.signal });
                if (!res.ok) {
                    throw new Error(`API error ${res.status}`);
                }
                const data = (await res.json()) as ContentItem[];
                setItems(Array.isArray(data) ? data : SAMPLE_DATA);
            } catch (e) {
                // keep UX friendly: log and show sample data
                console.warn("Could not load /api/contents, using sample data.", e);
                setItems(SAMPLE_DATA);
                setError(null); // not showing a hard error; remove if you want visible error
            } finally {
                setLoading(false);
            }
        }

        load();

        return () => controller.abort();
    }, []);

    // derive categories
    const categories = useMemo(() => {
        const set = new Set<string>(items.map((i) => i.category || "Uncategorized"));
        return ["All", ...Array.from(set)];
    }, [items]);

    // filtered + sorted
    const filtered = useMemo(() => {
        let list = items.slice();
        if (query.trim() !== "") {
            const q = query.toLowerCase();
            list = list.filter(
                (it) =>
                    it.title.toLowerCase().includes(q) ||
                    (it.description || "").toLowerCase().includes(q) ||
                    (it.tags || []).some((t) => t.toLowerCase().includes(q))
            );
        }
        if (categoryFilter !== "All") {
            list = list.filter((it) => (it.category || "Uncategorized") === categoryFilter);
        }
        if (sortKey === "newest") {
            list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        } else if (sortKey === "oldest") {
            list.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
        } else {
            list.sort((a, b) => a.title.localeCompare(b.title));
        }
        return list;
    }, [items, query, categoryFilter, sortKey]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ margin: 0 }}>Dashboard</h1>
                <div style={styles.headerRight}>
                    <button
                        onClick={() => {
                            // placeholder for "Create" action
                            alert("Create new content - implement action");
                        }}
                        style={styles.primaryButton}
                    >
                        + Create
                    </button>
                </div>
            </header>

            <section style={styles.controls}>
                <input
                    aria-label="Search content"
                    placeholder="Search title, description, tags..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                    style={styles.input}
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setPage(1);
                    }}
                    style={styles.select}
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as any)}
                    style={styles.select}
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title (A–Z)</option>
                </select>
            </section>

            <main style={styles.main}>
                {loading ? (
                    <div style={styles.message}>Loading...</div>
                ) : filtered.length === 0 ? (
                    <div style={styles.message}>No content found. Try a different search.</div>
                ) : (
                    <>
                        <div style={styles.grid}>
                            {pageItems.map((item) => (
                                <article key={item.id} style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <h3 style={{ margin: 0 }}>{item.title}</h3>
                                        <small style={styles.category}>{item.category || "Uncategorized"}</small>
                                    </div>
                                    <p style={styles.description}>{item.description}</p>
                                    <div style={styles.tags}>
                                        {(item.tags || []).map((t) => (
                                            <span key={t} style={styles.tag}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={styles.cardFooter}>
                                        <small>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</small>
                                        <div>
                                            <button
                                                onClick={() => alert(`View ${item.title}`)}
                                                style={styles.ghostButton}
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => alert(`Edit ${item.title}`)}
                                                style={styles.ghostButton}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Delete "${item.title}"?`)) {
                                                        setItems((prev) => prev.filter((p) => p.id !== item.id));
                                                    }
                                                }}
                                                style={styles.dangerButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <footer style={styles.pagination}>
                            <div>
                                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}-
                                {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                            </div>
                            <div>
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={styles.pageButton}
                                >
                                    Prev
                                </button>
                                <span style={{ margin: "0 8px" }}>
                                    Page {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    style={styles.pageButton}
                                >
                                    Next
                                </button>
                            </div>
                        </footer>
                    </>
                )}

                {error && <div style={{ color: "crimson" }}>{error}</div>}
            </main>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    container: {
        padding: 20,
        fontFamily: "Inter, Roboto, system-ui, -apple-system, Segoe UI, sans-serif",
        color: "#111827",
        minHeight: "100vh",
        boxSizing: "border-box",
        background: "#f7fafc",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    headerRight: {
        display: "flex",
        gap: 8,
        alignItems: "center",
    },
    primaryButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: 6,
        cursor: "pointer",
    },
    controls: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
    },
    input: {
        flex: 1,
        minWidth: 220,
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
    },
    select: {
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        background: "white",
    },
    main: {
        background: "white",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    message: {
        padding: 40,
        textAlign: "center",
        color: "#6b7280",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 12,
    },
    card: {
        borderRadius: 8,
        border: "1px solid #e6e9ee",
        padding: 12,
        background: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 160,
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 8,
        marginBottom: 8,
    },
    category: {
        color: "#6b7280",
        fontSize: 12,
    },
    description: {
        color: "#374151",
        fontSize: 14,
        margin: "8px 0",
        flex: 1,
    },
    tags: {
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: 8,
    },
    tag: {
        background: "#eef2ff",
        color: "#3730a3",
        padding: "4px 8px",
        borderRadius: 999,
        fontSize: 12,
    },
    cardFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    ghostButton: {
        background: "transparent",
        border: "1px solid #e5e7eb",
        padding: "6px 8px",
        borderRadius: 6,
        cursor: "pointer",
        marginLeft: 6,
    },
    dangerButton: {
        background: "#fee2e2",
        border: "1px solid #fecaca",
        color: "#991b1b",
        padding: "6px 8px",
        borderRadius: 6,
        cursor: "pointer",
        marginLeft: 6,
    },
    pagination: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        paddingTop: 12,
        borderTop: "1px solid #f3f4f6",
    },
    pageButton: {
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        background: "white",
        cursor: "pointer",
    },
};