import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Team = {
    id: string;
    name: string;
    membersCount?: number;
    // add more fields as your API returns them
};

type TeamsListProps = {
    auctionId?: string;
};

export default function TeamsList({ auctionId: propAuctionId }: TeamsListProps) {
    // If auctionId is not passed via props, try reading route params (common in pages)
    const params = useParams<{ auctionId?: string }>();
    const auctionId = propAuctionId ?? params.auctionId;

    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!auctionId) return;

        const controller = new AbortController();
        async function loadTeams() {
            setLoading(true);
            setError(null);
            try {
                // Adjust this URL to match your backend route
                const res = await fetch(`/api/auctions/${auctionId}/teams`, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error(`Failed to load teams: ${res.status} ${res.statusText}`);
                }

                // Support APIs that return either { teams: Team[] } or Team[]
                const data = await res.json();
                const loadedTeams: Team[] = Array.isArray(data) ? data : data?.teams ?? [];
                setTeams(loadedTeams);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Unknown error");
                    setTeams([]);
                }
            } finally {
                setLoading(false);
            }
        }

        loadTeams();
        return () => controller.abort();
    }, [auctionId]);

    if (!auctionId) {
        return <div>Please provide an auctionId (prop or route param) to list teams.</div>;
    }

    return (
        <div style={{ padding: 16, maxWidth: 800 }}>
            <h2>Teams in Auction {auctionId}</h2>

            <div style={{ marginBottom: 12 }}>
                <button
                    onClick={() => {
                        // simple way to refresh: trigger effect by changing state
                        // you could instead expose a refresh function that re-fetches
                        setTeams((t) => [...t]);
                    }}
                >
                    Refresh
                </button>
            </div>

            {loading && <div>Loading teams…</div>}
            {error && <div style={{ color: "red" }}>Error: {error}</div>}

            {!loading && !error && (
                <>
                    <div style={{ marginBottom: 8 }}>
                        Total teams: <strong>{teams.length}</strong>
                    </div>

                    {teams.length === 0 ? (
                        <div>No teams found for this auction.</div>
                    ) : (
                        <ul style={{ paddingLeft: 20 }}>
                            {teams.map((team) => (
                                <li key={team.id} style={{ marginBottom: 6 }}>
                                    <div style={{ fontWeight: 600 }}>{team.name}</div>
                                    <div style={{ fontSize: 12, color: "#555" }}>
                                        Members: {team.membersCount ?? "N/A"} — ID: {team.id}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}