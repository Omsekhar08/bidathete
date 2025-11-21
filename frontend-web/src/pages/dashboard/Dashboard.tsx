import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Gavel, Users, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import '../../index.css';

// Mock API service - replace with your actual API
const api = {
  get: async (endpoint: string) => {
    // Simulate API call
    return {
      data: {
        totalAuctions: 24,
        liveAuctions: 5,
        totalTeams: 12,
        totalRevenue: 250000,
      }
    };
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAuctions: 0,
    liveAuctions: 0,
    totalTeams: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  const statCards = [
    {
      title: 'Total Auctions',
      value: stats.totalAuctions,
      icon: Gavel,
      gradient: 'bg-gradient-to-br from-primary to-[hsl(230_91%_65%)]',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      change: '+12.5%',
    },
    {
      title: 'Live Auctions',
      value: stats.liveAuctions,
      icon: Activity,
      gradient: 'bg-gradient-to-br from-success to-[hsl(158_71%_50%)]',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      change: '+8.2%',
    },
    {
      title: 'Total Teams',
      value: stats.totalTeams,
      icon: Users,
      gradient: 'bg-gradient-to-br from-[hsl(271_91%_65%)] to-[hsl(286_91%_70%)]',
      iconBg: 'bg-[hsl(271_91%_65%)]/10',
      iconColor: 'text-[hsl(271_91%_65%)]',
      change: '+5.4%',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-warning to-[hsl(25_92%_55%)]',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      change: '+18.9%',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Auction',
      description: 'Start a new auction event',
      to: '/auctions/create',
      icon: Plus,
    },
    {
      title: 'Manage Teams',
      description: 'View and edit team details',
      to: '/teams',
      icon: Users,
    },
    {
      title: 'View Reports',
      description: 'Analytics and insights',
      to: '/reports',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back! Here's your overview
          </p>
        </div>
        <Link
          to="/auctions/create"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          Create Auction
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5 ${stat.gradient}`} />
            
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-success">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-card-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Auctions */}
        <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
          <div className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent p-6">
            <h2 className="text-xl font-bold text-card-foreground">
              Recent Auctions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your latest auction activity
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Gavel className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No recent auctions
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Create your first auction to get started
              </p>
              <Link
                to="/auctions/create"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Create Auction
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
          <div className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent p-6">
            <h2 className="text-xl font-bold text-card-foreground">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Common tasks at your fingertips
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
                >
                  <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground group-hover:text-primary">
                      {action.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:translate-y-[-4px] group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframe animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
