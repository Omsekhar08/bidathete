import React, { useEffect, useState, useCallback } from "react";

type Auction = {
    id: string;
    name: string;
    startsAt?: string;
    endsAt?: string;
};

type Player = {
    id: string;
    name: string;
    team?: string;
    position?: string;
    price?: number;
};

type PlayersMap = Record<string, Player[]>;

export default function PlayersList(): JSX.Element {
    const [auctions, setAuctions] = useState<Auction[] | null>(null);
    const [playersByAuction, setPlayersByAuction] = useState<PlayersMap>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAuctions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auctions");
            if (!res.ok) throw new Error(`Failed to load auctions: ${res.status}`);
            const data: Auction[] = await res.json();
            setAuctions(data);
            return data;
        } catch (err: any) {
            setError(err?.message ?? "Unknown error");
            setAuctions([]);
            return [];
        }
    }, []);

    const fetchPlayersForAuction = useCallback(async (auctionId: string) => {
        try {
            const res = await fetch(`/api/auctions/${auctionId}/players`);
            if (!res.ok) throw new Error(`Failed to load players for ${auctionId}`);
            const data: Player[] = await res.json();
            return data;
        } catch {
            return [];
        }
    }, []);

    const loadAll = useCallback(async () => {
        setPlayersByAuction({});
        const auctionsList = await fetchAuctions();
        if (!auctionsList?.length) {
            setLoading(false);
            return;
        }

        // Fetch players for each auction in parallel
        const fetches = auctionsList.map(async (a) => {
            const players = await fetchPlayersForAuction(a.id);
            return { id: a.id, players };
        });

        const results = await Promise.all(fetches);
        const map: PlayersMap = {};
        for (const r of results) {
            map[r.id] = r.players;
        }
        setPlayersByAuction(map);
        setLoading(false);
    }, [fetchAuctions, fetchPlayersForAuction]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    if (loading) {
        return <div style={{ padding: 16 }}>Loading auctions and players…</div>;
    }

    if (error) {
        return (
            <div style={{ padding: 16 }}>
                <div style={{ color: "red", marginBottom: 8 }}>Error: {error}</div>
                <button onClick={loadAll}>Retry</button>
            </div>
        );
    }

    if (!auctions || auctions.length === 0) {
        return (
            <div style={{ padding: 16 }}>
                No auctions available.
                <div style={{ marginTop: 8 }}>
                    <button onClick={loadAll}>Reload</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>Auctions & Players</h2>
                <button onClick={loadAll}>Refresh</button>
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 16 }}>
                {auctions.map((auction) => {
                    const players = playersByAuction[auction.id] ?? [];
                    return (
                        <section
                            key={auction.id}
                            style={{
                                border: "1px solid #e3e3e3",
                                borderRadius: 8,
                                padding: 12,
                                background: "#fff",
                            }}
                        >
                            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <div>
                                    <strong>{auction.name}</strong>
                                    <div style={{ fontSize: 12, color: "#666" }}>
                                        {auction.startsAt ? new Date(auction.startsAt).toLocaleString() : null}
                                        {auction.endsAt ? ` — ${new Date(auction.endsAt).toLocaleString()}` : null}
                                    </div>
                                </div>
                                <div style={{ fontSize: 12, color: "#888" }}>{players.length} players</div>
                            </header>

                            <div style={{ marginTop: 10 }}>
                                {players.length === 0 ? (
                                    <div style={{ color: "#666", fontSize: 13 }}>No players in this auction.</div>
                                ) : (
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {players.map((p) => (
                                            <li
                                                key={p.id}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    padding: "8px 6px",
                                                    borderBottom: "1px dashed #f0f0f0",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                    <div style={{ fontSize: 12, color: "#666" }}>
                                                        {p.position ?? "—"} {p.team ? `· ${p.team}` : ""}
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: 700 }}>{p.price != null ? `$${p.price}` : "—"}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}const styles = {
    auctionCard: {
        border: "1px solid #e3e3e3",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
    },
    playerItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 6px",
        borderBottom: "1px dashed #f0f0f0",
        alignItems: "center",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
    },
    playerName: {
        fontWeight: 600,
    },
    playerDetails: {
        fontSize: 12,
        color: "#666",
    },
    playerPrice: {
        fontWeight: 700,
    },
};