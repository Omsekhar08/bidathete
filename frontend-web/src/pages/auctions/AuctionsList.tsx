import React, { useEffect, useMemo, useState } from "react";

type AuctionStatus = "upcoming" | "live" | "closed";

interface Auction {
    id: string;
    title: string;
    description?: string;
    image?: string;
    currentBid: number;
    currency?: string;
    endsAt: string; // ISO date
    status: AuctionStatus;
    seller?: string;
}

const SAMPLE_AUCTIONS: Auction[] = [
    {
        id: "1",
        title: "Signed Football Jersey",
        description: "Official match-worn jersey signed by the team",
        currentBid: 450,
        currency: "USD",
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
        status: "live",
        seller: "TeamMemorabilia",
    },
    {
        id: "2",
        title: "Vintage Running Shoes",
        description: "Rare vintage shoes in good condition",
        currentBid: 120,
        currency: "USD",
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
        status: "upcoming",
        seller: "RetroSneaks",
    },
    {
        id: "3",
        title: "Olympic Medal Replica",
        description: "Collector replica medal",
        currentBid: 300,
        currency: "USD",
        endsAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: "closed",
        seller: "CollectiblesInc",
    },
];

function formatCurrency(value: number, currency = "USD") {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}

function timeLeft(isoDate: string) {
    const diff = new Date(isoDate).getTime() - Date.now();
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

const pageSizeOptions = [6, 12, 24];

export default function AuctionsList(): JSX.Element {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<"all" | AuctionStatus>("all");
    const [sortBy, setSortBy] = useState<"endsSoon" | "highestBid" | "newest">(
        "endsSoon"
    );

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);

    useEffect(() => {
        let mounted = true;
        async function fetchAuctions() {
            setLoading(true);
            setError(null);
            try {
                // Try to fetch real data; if endpoint not present, fallback to sample data.
                const res = await fetch("/api/auctions");
                if (!res.ok) throw new Error("Network response not ok");
                const data = (await res.json()) as Auction[];
                if (mounted) setAuctions(data);
            } catch {
                // fallback
                if (mounted) setAuctions(SAMPLE_AUCTIONS);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchAuctions();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        setPage(1);
    }, [query, statusFilter, pageSize, sortBy]);

    const filtered = useMemo(() => {
        let list = auctions.slice();

        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    (a.description || "").toLowerCase().includes(q) ||
                    (a.seller || "").toLowerCase().includes(q)
            );
        }

        if (statusFilter !== "all") {
            list = list.filter((a) => a.status === statusFilter);
        }

        if (sortBy === "endsSoon") {
            list.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
        } else if (sortBy === "highestBid") {
            list.sort((a, b) => b.currentBid - a.currentBid);
        } else if (sortBy === "newest") {
            list.sort((a, b) => b.id.localeCompare(a.id));
        }

        return list;
    }, [auctions, query, statusFilter, sortBy]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ margin: 0 }}>Auctions</h1>
                <div style={styles.controls}>
                    <input
                        placeholder="Search auctions..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={styles.search}
                        aria-label="Search auctions"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        style={styles.select}
                        aria-label="Filter by status"
                    >
                        <option value="all">All statuses</option>
                        <option value="live">Live</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={styles.select}
                        aria-label="Sort auctions"
                    >
                        <option value="endsSoon">Ending soon</option>
                        <option value="highestBid">Highest bid</option>
                        <option value="newest">Newest</option>
                    </select>

                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        style={styles.select}
                        aria-label="Page size"
                    >
                        {pageSizeOptions.map((p) => (
                            <option key={p} value={p}>
                                {p} / page
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {loading ? (
                <p>Loading auctions...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : total === 0 ? (
                <p>No auctions found.</p>
            ) : (
                <>
                    <div style={styles.grid}>
                        {paged.map((a) => (
                            <article key={a.id} style={styles.card}>
                                <div style={styles.imageWrap}>
                                    {a.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={a.image} alt={a.title} style={styles.image} />
                                    ) : (
                                        <div style={styles.placeholder}>
                                            <span style={{ fontSize: 14, color: "#555" }}>No image</span>
                                        </div>
                                    )}
                                </div>

                                <div style={styles.cardBody}>
                                    <div style={styles.rowBetween}>
                                        <h3 style={{ margin: 0 }}>{a.title}</h3>
                                        <span style={styles.status(a.status)}>{a.status.toUpperCase()}</span>
                                    </div>

                                    <p style={styles.description}>{a.description}</p>

                                    <div style={styles.rowBetween}>
                                        <div>
                                            <div style={styles.smallLabel}>Current bid</div>
                                            <div style={styles.bid}>{formatCurrency(a.currentBid, a.currency)}</div>
                                        </div>

                                        <div style={{ textAlign: "right" }}>
                                            <div style={styles.smallLabel}>Ends in</div>
                                            <div style={styles.ends}>{timeLeft(a.endsAt)}</div>
                                        </div>
                                    </div>

                                    <div style={styles.actions}>
                                        <button style={styles.buttonPrimary} onClick={() => alert(`View ${a.id}`)}>
                                            View
                                        </button>
                                        <button style={styles.buttonOutline} onClick={() => alert(`Bid ${a.id}`)}>
                                            Bid
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <footer style={styles.footer}>
                        <div>
                            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
                        </div>
                        <div style={styles.pagination}>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={styles.pageBtn}
                            >
                                ← Prev
                            </button>
                            <span style={{ padding: "0 8px" }}>
                                Page {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                style={styles.pageBtn}
                            >
                                Next →
                            </button>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
}

const styles: Record<string, any> = {
    container: {
        padding: 20,
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
        color: "#111827",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        gap: 12,
        flexWrap: "wrap",
    },
    controls: {
        display: "flex",
        gap: 8,
        alignItems: "center",
    },
    search: {
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        minWidth: 200,
    },
    select: {
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        background: "#fff",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
    },
    card: {
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        minHeight: 220,
    },
    imageWrap: {
        height: 140,
        background: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "cover",
    },
    placeholder: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    cardBody: {
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        flex: 1,
    },
    rowBetween: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    status: (status: AuctionStatus) => ({
        padding: "4px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color: status === "live" ? "#052c65" : status === "upcoming" ? "#0f5132" : "#5b21b6",
        background:
            status === "live"
                ? "#dbeafe"
                : status === "upcoming"
                ? "#dcfce7"
                : "#ede9fe",
    }),
    description: {
        margin: 0,
        fontSize: 13,
        color: "#4b5563",
        minHeight: 36,
    },
    smallLabel: {
        fontSize: 12,
        color: "#6b7280",
    },
    bid: {
        fontWeight: 700,
    },
    ends: {
        fontWeight: 600,
    },
    actions: {
        display: "flex",
        gap: 8,
        marginTop: 4,
    },
    buttonPrimary: {
        padding: "8px 12px",
        background: "#111827",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
    },
    buttonOutline: {
        padding: "8px 12px",
        background: "transparent",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        cursor: "pointer",
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        gap: 12,
        flexWrap: "wrap",
    },
    pagination: {
        display: "flex",
        alignItems: "center",
    },
    pageBtn: {
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        background: "#fff",
        cursor: "pointer",
    },
};