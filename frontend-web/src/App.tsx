import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Homepage from './pages/dashboard/Homepage';
import AuctionsList from './pages/auctions/AuctionsList';
import CreateAuction from './pages/auctions/CreateAuction';
import EditAuction from './pages/auctions/EditAuction';
import LiveAuction from './pages/auctions/LiveAuction';
import TeamsList from './pages/teams/TeamsList';
import PlayersList from './pages/players/PlayersList';
import Reports from './pages/reports/Reports';
import NotFound from './pages/NotFound';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={<PrivateRoute> <Layout /> </PrivateRoute>}
      >
        <Route index element={<Dashboard />} />
        <Route path="homepage" element={<Homepage />} />
        <Route path="auctions" element={<AuctionsList />} />
        <Route path="auctions/create" element={<CreateAuction />} />
        <Route path="auctions/:id/edit" element={<EditAuction />} />
        <Route path="auctions/:id/live" element={<LiveAuction />} />
        <Route path="auctions/:auctionId/teams" element={<TeamsList />} />
        <Route path="auctions/:auctionId/players" element={<PlayersList />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;