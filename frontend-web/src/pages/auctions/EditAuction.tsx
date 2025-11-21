import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

type Auction = {
    id: string;
    title: string;
    description?: string;
    startingBid: number;
    endDate?: string; // ISO string
    // add other fields your API uses
};

export default function EditAuction(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Missing auction id");
            setLoading(false);
            return;
        }

        let canceled = false;
        setLoading(true);
        setError(null);

        axios
            .get<Auction>(`/api/auctions/${id}`)
            .then((res) => {
                if (!canceled) setAuction(res.data);
            })
            .catch((err) => {
                if (!canceled) setError(err?.response?.data?.message ?? err.message ?? "Failed to load auction");
            })
            .finally(() => {
                if (!canceled) setLoading(false);
            });

        return () => {
            canceled = true;
        };
    }, [id]);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (!auction) return;
        const { name, value } = e.target;
        setAuction({ ...auction, [name]: name === "startingBid" ? Number(value) : value });
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!id || !auction) return;

        // basic validation
        if (!auction.title?.trim()) {
            setError("Title is required.");
            return;
        }
        if (isNaN(auction.startingBid) || auction.startingBid < 0) {
            setError("Starting bid must be a non-negative number.");
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            await axios.put(`/api/auctions/${id}`, {
                title: auction.title,
                description: auction.description,
                startingBid: auction.startingBid,
                endDate: auction.endDate,
            });
            // navigate to auction details after successful update
            navigate(`/auctions/${id}`);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? err.message ?? "Failed to update auction");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <div>Loading auction...</div>;
    if (error && !auction) return <div style={{ color: "red" }}>{error}</div>;
    if (!auction) return <div>Auction not found.</div>;

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2>Edit Auction</h2>
            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Title
                        <input
                            name="title"
                            value={auction.title || ""}
                            onChange={handleChange}
                            required
                            style={{ display: "block", width: "100%", padding: 8 }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Description
                        <textarea
                            name="description"
                            value={auction.description || ""}
                            onChange={handleChange}
                            rows={5}
                            style={{ display: "block", width: "100%", padding: 8 }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Starting Bid
                        <input
                            name="startingBid"
                            value={String(auction.startingBid ?? "")}
                            onChange={handleChange}
                            type="number"
                            min={0}
                            step="0.01"
                            required
                            style={{ display: "block", width: 200, padding: 8 }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        End Date (ISO / YYYY-MM-DDTHH:MM)
                        <input
                            name="endDate"
                            value={auction.endDate ? auction.endDate.substring(0, 16) : ""}
                            onChange={handleChange}
                            type="datetime-local"
                            style={{ display: "block", padding: 8 }}
                        />
                    </label>
                </div>

                <div>
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Save changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{ marginLeft: 8 }}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}