import React, { useEffect, useState } from 'react';

type Team = { id: string; name: string; description?: string };

export default function Sample() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/teams')
      .then((r) => r.json())
      .then((data) => {
        setTeams(data ?? []);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading teams...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sample Teams</h1>
      <ul>
        {teams.map((t) => (
          <li key={t.id} className="mb-2">
            <strong>{t.name}</strong> — {t.description ?? 'No description'}
          </li>
        ))}
      </ul>
    </div>
  );
}