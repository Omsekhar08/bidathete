import React, { useState } from "react";

type ReportType = "player" | "auction" | "team";

type PlayerReport = {
    id: string;
    name: string;
    age?: number;
    position?: string;
    stats?: Record<string, number | string>;
};

type AuctionReport = {
    id: string;
    item: string;
    highestBid: number;
    biddersCount?: number;
    date?: string;
};

type TeamReport = {
    id: string;
    name: string;
    wins?: number;
    losses?: number;
    players?: Array<{ id: string; name: string }>;
};

type ReportsResult = {
    players?: PlayerReport[];
    auctions?: AuctionReport[];
    teams?: TeamReport[];
};

export default function Reports(): JSX.Element {
    const [type, setType] = useState<ReportType>("player");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ReportsResult | null>(null);

    async function loadReports() {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Example API shape: GET /api/reports/{type}?q={query}
            const res = await fetch(`/api/reports/${type}?q=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: { "Accept": "application/json" },
            });

            if (!res.ok) {
                // try to read error message if available
                const text = await res.text();
                throw new Error(text || `Request failed: ${res.status}`);
            }

            const data = (await res.json()) as ReportsResult;
            setResult(data);
        } catch (err: any) {
            // Fallback mock data for development or when backend is not available
            if ((globalThis as any).process?.env?.NODE_ENV === "development") {
                setResult(getMockData(type));
            } else {
                setError(err?.message ?? "Unknown error");
            }
        } finally {
            setLoading(false);
        }
    }

    function getMockData(t: ReportType): ReportsResult {
        if (t === "player") {
            return {
                players: [
                    { id: "p1", name: "Alice Athlete", age: 24, position: "Striker", stats: { goals: 12, assists: 5 } },
                    { id: "p2", name: "Bob Runner", age: 29, position: "Mid", stats: { goals: 6, assists: 8 } },
                ],
            };
        } else if (t === "auction") {
            return {
                auctions: [
                    { id: "a1", item: "Signed Jersey", highestBid: 1200, biddersCount: 8, date: "2025-11-01" },
                    { id: "a2", item: "Match Ball", highestBid: 300, biddersCount: 3, date: "2025-10-15" },
                ],
            };
        } else {
            return {
                teams: [
                    { id: "t1", name: "Red Raptors", wins: 10, losses: 2, players: [{ id: "p1", name: "Alice Athlete" }] },
                    { id: "t2", name: "Blue Bulls", wins: 8, losses: 4, players: [{ id: "p2", name: "Bob Runner" }] },
                ],
            };
        }
    }

    return (
        <div style={{ padding: 20, fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
            <h2>Reports</h2>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <label>
                    Type:
                    <select value={type} onChange={(e) => setType(e.target.value as ReportType)} style={{ marginLeft: 8 }}>
                        <option value="player">Player</option>
                        <option value="auction">Auction</option>
                        <option value="team">Team</option>
                    </select>
                </label>

                <label>
                    Query:
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="enter id, name or keyword"
                        style={{ marginLeft: 8 }}
                    />
                </label>

                <button onClick={loadReports} disabled={loading} style={{ padding: "6px 12px" }}>
                    {loading ? "Loading..." : "Run"}
                </button>
            </div>

            {error && <div style={{ color: "crimson", marginBottom: 12 }}>Error: {error}</div>}

            <div>
                {type === "player" && result?.players && (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Age</th>
                                <th style={thStyle}>Position</th>
                                <th style={thStyle}>Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.players.map((p) => (
                                <tr key={p.id}>
                                    <td style={tdStyle}>{p.id}</td>
                                    <td style={tdStyle}>{p.name}</td>
                                    <td style={tdStyle}>{p.age ?? "-"}</td>
                                    <td style={tdStyle}>{p.position ?? "-"}</td>
                                    <td style={tdStyle}>
                                        {p.stats ? Object.entries(p.stats).map(([k, v]) => `${k}: ${v}`).join(", ") : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {type === "auction" && result?.auctions && (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Item</th>
                                <th style={thStyle}>Highest Bid</th>
                                <th style={thStyle}>Bidders</th>
                                <th style={thStyle}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.auctions.map((a) => (
                                <tr key={a.id}>
                                    <td style={tdStyle}>{a.id}</td>
                                    <td style={tdStyle}>{a.item}</td>
                                    <td style={tdStyle}>{a.highestBid}</td>
                                    <td style={tdStyle}>{a.biddersCount ?? "-"}</td>
                                    <td style={tdStyle}>{a.date ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {type === "team" && result?.teams && (
                    <div>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>W</th>
                                    <th style={thStyle}>L</th>
                                    <th style={thStyle}>Players</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.teams.map((t) => (
                                    <tr key={t.id}>
                                        <td style={tdStyle}>{t.id}</td>
                                        <td style={tdStyle}>{t.name}</td>
                                        <td style={tdStyle}>{t.wins ?? "-"}</td>
                                        <td style={tdStyle}>{t.losses ?? "-"}</td>
                                        <td style={tdStyle}>{t.players?.map((p) => p.name).join(", ") ?? "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !result && !error && <div style={{ color: "#666" }}>Run a report to see results.</div>}
            </div>
        </div>
    );
}

const thStyle: React.CSSProperties = {
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    padding: "8px 6px",
    background: "#fafafa",
};

const tdStyle: React.CSSProperties = {
    padding: "8px 6px",
    borderBottom: "1px solid #f0f0f0",
};