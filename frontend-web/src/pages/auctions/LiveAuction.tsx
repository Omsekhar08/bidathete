import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * LiveAuction.tsx
 * - A self-contained React + TypeScript page for a live auction.
 * - Shows auction details, live stream placeholder, current bid, bidder list,
 *   an input to place a new bid, and a "members watching" counter that polls the server.
 *
 * Notes:
 * - This file expects backend endpoints:
 *   GET  /api/auctions/:id            -> { id, title, description, image, currentBid, bids: [{id, user, amount, time}] }
 *   GET  /api/auctions/:id/watchers   -> { count: number }
 *   POST /api/auctions/:id/bid        -> { currentBid, success, bid }
 * - Replace API paths with your concrete endpoints or adapt to WebSocket/SSE if available.
 */

/* Types */
interface Bid {
    id: string;
    user: string;
    amount: number;
    time: string;
}

interface Auction {
    id: string;
    title: string;
    description?: string;
    image?: string;
    currentBid: number;
    bids: Bid[];
}

/* Helper: format currency */
const fmt = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export default function LiveAuction(): JSX.Element {
    const { id: auctionIdParam } = useParams<{ id: string }>();
    const auctionId = auctionIdParam ?? "live";
    const [auction, setAuction] = useState<Auction | null>(null);
    const [watchers, setWatchers] = useState<number>(0);
    const [newBid, setNewBid] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [placing, setPlacing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    // Fetch auction initial data
    useEffect(() => {
        let abort = false;
        setLoading(true);
        fetch(`/api/auctions/${auctionId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load auction");
                return res.json();
            })
            .then((data: Auction) => {
                if (!abort && mounted.current) {
                    setAuction(data);
                    setNewBid((data.currentBid + 1).toString()); // default increment suggestion
                }
            })
            .catch((e) => {
                if (!abort && mounted.current) setError(String(e));
            })
            .finally(() => {
                if (!abort && mounted.current) setLoading(false);
            });
        return () => {
            abort = true;
        };
    }, [auctionId]);

    // Poll watchers count every 3 seconds
    useEffect(() => {
        let isMounted = true;
        const fetchWatchers = () => {
            fetch(`/api/auctions/${auctionId}/watchers`)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch watchers");
                    return res.json();
                })
                .then((data: { count: number }) => {
                    if (isMounted) setWatchers(data.count ?? 0);
                })
                .catch(() => {
                    if (isMounted) setWatchers((v) => v); // keep previous; avoid setting an error state for watchers
                });
        };

        fetchWatchers();
        const t = setInterval(fetchWatchers, 3000);
        return () => {
            isMounted = false;
            clearInterval(t);
        };
    }, [auctionId]);

    const placeBid = async () => {
        if (!auction) return;
        setError(null);
        const amount = Number(newBid);
        if (Number.isNaN(amount) || amount <= auction.currentBid) {
            setError("Enter a valid bid higher than the current bid.");
            return;
        }
        setPlacing(true);

        // Optimistic UI update
        const prevAuction = auction;
        setAuction({ ...auction, currentBid: amount, bids: [{ id: "local", user: "You", amount, time: new Date().toISOString() }, ...auction.bids] });

        try {
            const res = await fetch(`/api/auctions/${auctionId}/bid`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });
            if (!res.ok) {
                throw new Error(`Bid failed: ${res.statusText}`);
            }
            const data = await res.json();
            // Replace auction state with authoritative data if provided
            if (data && data.currentBid !== undefined) {
                setAuction((a) => (a ? { ...a, currentBid: data.currentBid, bids: data.bids ?? a.bids } : a));
            }
        } catch (e) {
            // rollback
            setAuction(prevAuction);
            setError(String(e));
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <h2>Loading auction...</h2>
            </div>
        );
    }

    if (error && !auction) {
        return (
            <div style={styles.container}>
                <h2>Error</h2>
                <div style={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ margin: 0 }}>{auction?.title ?? "Live Auction"}</h1>
                <div style={styles.watchers}>
                    <span style={{ marginRight: 8, fontSize: 18 }}>👀</span>
                    <div>
                        <div style={{ fontWeight: 600 }}>{watchers}</div>
                        <small style={{ color: "#666" }}>members watching</small>
                    </div>
                </div>
            </div>

            <div style={styles.grid}>
                <div style={styles.left}>
                    {/* Stream / Video */}
                    <div style={styles.streamWrapper}>
                        {/* Replace src with your HLS/WebRTC stream endpoint */}
                        <video
                            controls
                            autoPlay
                            playsInline
                            style={styles.video}
                            src={`/api/auctions/${auctionId}/stream`}
                            poster={auction?.image}
                        >
                            {/* Fallback */}
                            Your browser does not support the video element.
                        </video>
                        <div style={styles.streamOverlay}>
                            <div style={styles.currentBid}>
                                <div style={{ fontSize: 12, color: "#ddd" }}>Current bid</div>
                                <div style={{ fontSize: 22, fontWeight: 700 }}>{fmt(auction?.currentBid ?? 0)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bid controls */}
                    <div style={styles.bidPanel}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                type="number"
                                value={newBid}
                                onChange={(e) => setNewBid(e.target.value)}
                                min={(auction?.currentBid ?? 0) + 1}
                                style={styles.bidInput}
                                aria-label="Enter your bid"
                            />
                            <button onClick={placeBid} disabled={placing} style={styles.bidButton}>
                                {placing ? "Placing..." : "Place Bid"}
                            </button>
                        </div>
                        {error && <div style={styles.error}>{error}</div>}
                        <div style={{ marginTop: 8, color: "#555" }}>
                            Minimum required: {fmt((auction?.currentBid ?? 0) + 1)}
                        </div>
                    </div>

                    {/* Recent bids */}
                    <div style={styles.bidsList}>
                        <h3 style={{ marginTop: 0 }}>Recent bids</h3>
                        {auction?.bids.length ? (
                            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                                {auction!.bids.slice(0, 10).map((b) => (
                                    <li key={b.id} style={styles.bidItem}>
                                        <div>
                                            <strong>{b.user}</strong> <small style={{ color: "#666" }}>• {new Date(b.time).toLocaleTimeString()}</small>
                                        </div>
                                        <div style={{ fontWeight: 700 }}>{fmt(b.amount)}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ color: "#666" }}>No bids yet — be the first!</div>
                        )}
                    </div>
                </div>

                <aside style={styles.right}>
                    <div style={styles.card}>
                        <h3>Item details</h3>
                        <p style={{ color: "#444" }}>{auction?.description ?? "No description provided."}</p>
                        {auction?.image && <img src={auction.image} alt="item" style={{ width: "100%", borderRadius: 6 }} />}
                    </div>

                    <div style={styles.card}>
                        <h3>Live chat</h3>
                        <div style={styles.chatPlaceholder}>Live chat would appear here (implement WebSocket/SSE for real-time)</div>
                    </div>

                    <div style={styles.card}>
                        <h3>Watching</h3>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{watchers} members</div>
                        <div style={{ color: "#666", marginTop: 6 }}>Updated every few seconds</div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

/* Inline styles for simplicity */
const styles: { [k: string]: React.CSSProperties } = {
    container: {
        padding: 20,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        color: "#222",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    watchers: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(0,0,0,0.05)",
        padding: "6px 12px",
        borderRadius: 999,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: 20,
    },
    left: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    streamWrapper: {
        position: "relative",
        borderRadius: 8,
        overflow: "hidden",
        background: "#000",
        minHeight: 360,
    },
    video: {
        width: "100%",
        height: "100%",
        display: "block",
        background: "#000",
    },
    streamOverlay: {
        position: "absolute",
        top: 12,
        left: 12,
        right: 12,
        display: "flex",
        justifyContent: "flex-end",
        pointerEvents: "none",
    },
    currentBid: {
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 8,
        textAlign: "right",
        pointerEvents: "auto",
    },
    bidPanel: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-start",
    },
    bidInput: {
        padding: "10px 12px",
        fontSize: 16,
        borderRadius: 6,
        border: "1px solid #ddd",
        width: 160,
    },
    bidButton: {
        padding: "10px 16px",
        background: "#0066ff",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
    },
    bidsList: {
        marginTop: 6,
        padding: 12,
        borderRadius: 8,
        background: "#fafafa",
    },
    bidItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #eee",
    },
    right: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    card: {
        padding: 12,
        background: "#fff",
        borderRadius: 8,
        border: "1px solid #eee",
    },
    chatPlaceholder: {
        height: 200,
        borderRadius: 6,
        background: "#f7f7f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
    },
    error: {
        color: "#a00",
        marginTop: 8,
    },
};