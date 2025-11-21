import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Category = {
    id: string;
    name: string;
};

export default function CreateAuction(): JSX.Element {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startPrice, setStartPrice] = useState<number | "">("");
    const [reservePrice, setReservePrice] = useState<number | "">("");
    const [startAt, setStartAt] = useState<string>("");
    const [endAt, setEndAt] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [fetchError, setFetchError] = useState<string>("");

    useEffect(() => {
        let mounted = true;
        fetch("/api/categories")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load categories");
                return res.json();
            })
            .then((data: Category[]) => {
                if (mounted) setCategories(data);
            })
            .catch((err) => {
                if (mounted) setFetchError(err.message || "Unable to load categories");
            });
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        // create previews
        const urls = images.map((f) => URL.createObjectURL(f));
        setImagePreviews(urls);
        return () => {
            urls.forEach((u) => URL.revokeObjectURL(u));
        };
    }, [images]);

    function validate(): boolean {
        const e: Record<string, string> = {};
        if (!title.trim()) e.title = "Title is required";
        if (!description.trim()) e.description = "Description is required";
        if (startPrice === "" || Number(startPrice) <= 0) e.startPrice = "Start price must be > 0";
        if (reservePrice !== "" && Number(reservePrice) < Number(startPrice))
            e.reservePrice = "Reserve price cannot be less than start price";
        if (!startAt) e.startAt = "Start date/time is required";
        if (!endAt) e.endAt = "End date/time is required";
        if (startAt && endAt && new Date(startAt) >= new Date(endAt))
            e.endAt = "End time must be after start time";
        if (!categoryId) e.categoryId = "Category is required";
        if (images.length === 0) e.images = "At least one image is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const form = new FormData();
            form.append("title", title);
            form.append("description", description);
            form.append("startPrice", String(startPrice));
            if (reservePrice !== "") form.append("reservePrice", String(reservePrice));
            form.append("startAt", new Date(startAt).toISOString());
            form.append("endAt", new Date(endAt).toISOString());
            form.append("categoryId", categoryId);
            images.forEach((file, idx) => form.append("images", file, file.name));

            const res = await fetch("/api/auctions", {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                throw new Error(payload.message || "Failed to create auction");
            }

            const created = await res.json();
            // if API returns created auction id, navigate to it
            if (created && created.id) {
                navigate(`/auctions/${created.id}`);
            } else {
                navigate("/auctions");
            }
        } catch (err: any) {
            setFetchError(err.message || "Failed to create auction");
        } finally {
            setLoading(false);
        }
    }

    function handleFilesChange(files: FileList | null) {
        if (!files) return setImages([]);
        const arr = Array.from(files).slice(0, 6); // limit to 6 images
        setImages(arr);
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
            <h1>Create Auction</h1>

            {fetchError && (
                <div style={{ color: "crimson", marginBottom: 12 }}>{fetchError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Title
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Item title"
                            disabled={loading}
                            style={{ display: "block", width: "100%" }}
                        />
                    </label>
                    {errors.title && <small style={{ color: "crimson" }}>{errors.title}</small>}
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Description
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the item..."
                            disabled={loading}
                            style={{ display: "block", width: "100%", minHeight: 120 }}
                        />
                    </label>
                    {errors.description && <small style={{ color: "crimson" }}>{errors.description}</small>}
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                        <label>
                            Start price (USD)
                            <input
                                type="number"
                                value={startPrice}
                                onChange={(e) => setStartPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                min={0}
                                step="0.01"
                                disabled={loading}
                                style={{ display: "block", width: "100%" }}
                            />
                        </label>
                        {errors.startPrice && <small style={{ color: "crimson" }}>{errors.startPrice}</small>}
                    </div>

                    <div style={{ flex: 1 }}>
                        <label>
                            Reserve price (optional)
                            <input
                                type="number"
                                value={reservePrice}
                                onChange={(e) => setReservePrice(e.target.value === "" ? "" : Number(e.target.value))}
                                min={0}
                                step="0.01"
                                disabled={loading}
                                style={{ display: "block", width: "100%" }}
                            />
                        </label>
                        {errors.reservePrice && <small style={{ color: "crimson" }}>{errors.reservePrice}</small>}
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                        <label>
                            Start at
                            <input
                                type="datetime-local"
                                value={startAt}
                                onChange={(e) => setStartAt(e.target.value)}
                                disabled={loading}
                                style={{ display: "block", width: "100%" }}
                            />
                        </label>
                        {errors.startAt && <small style={{ color: "crimson" }}>{errors.startAt}</small>}
                    </div>

                    <div style={{ flex: 1 }}>
                        <label>
                            End at
                            <input
                                type="datetime-local"
                                value={endAt}
                                onChange={(e) => setEndAt(e.target.value)}
                                disabled={loading}
                                style={{ display: "block", width: "100%" }}
                            />
                        </label>
                        {errors.endAt && <small style={{ color: "crimson" }}>{errors.endAt}</small>}
                    </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Category
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={loading || categories.length === 0}
                            style={{ display: "block", width: "100%" }}
                        >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    {errors.categoryId && <small style={{ color: "crimson" }}>{errors.categoryId}</small>}
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Images (max 6)
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFilesChange(e.target.files)}
                            disabled={loading}
                            style={{ display: "block", width: "100%" }}
                        />
                    </label>
                    {errors.images && <small style={{ color: "crimson" }}>{errors.images}</small>}
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        {imagePreviews.map((src, idx) => (
                            <div key={idx} style={{ width: 120, height: 80, position: "relative" }}>
                                <img
                                    src={src}
                                    alt={`preview-${idx}`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 16 }}>
                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Auction"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/auctions")}
                        disabled={loading}
                        style={{ marginLeft: 8 }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}