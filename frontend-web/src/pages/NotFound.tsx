import React from "react";
import { Link, useNavigate } from "react-router-dom";

const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    boxSizing: "border-box",
    background: "linear-gradient(180deg,#f7f9fc,#ffffff)",
    color: "#111827",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
};

const cardStyle: React.CSSProperties = {
    maxWidth: 760,
    width: "100%",
    textAlign: "center",
    borderRadius: 12,
    padding: "3rem",
    boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
    background: "white",
};

const codeStyle: React.CSSProperties = {
    fontSize: 96,
    lineHeight: 1,
    fontWeight: 700,
    margin: 0,
    color: "#0f172a",
};

const titleStyle: React.CSSProperties = {
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
    fontSize: 20,
    fontWeight: 600,
};

const textStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    color: "#475569",
};

const actionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
};

const buttonStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.6rem 1.1rem",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    color: "white",
    background: "#2563eb",
    textDecoration: "none",
};

const secondaryStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "transparent",
    color: "#374151",
    border: "1px solid #e6e9ee",
};

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={containerStyle} role="main">
            <div style={cardStyle} aria-labelledby="notfound-heading">
                <p style={codeStyle} aria-hidden>
                    404
                </p>

                <h1 id="notfound-heading" style={titleStyle}>
                    Page not found
                </h1>

                <p style={textStyle}>
                    The page you're looking for doesn't exist or has been moved. Check the URL or return to the homepage.
                </p>

                <div style={actionsStyle}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={secondaryStyle}
                        aria-label="Go back"
                    >
                        Go back
                    </button>

                    <Link to="/" style={buttonStyle} aria-label="Go to homepage">
                        Go to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;