import React, { useEffect, useState } from "react";
import { useApiMutation } from "@/hooks/useApiMutation";
import { DASHBOARD_API } from "@/constants/apiConstants";
import Loader from "@/components/loader/loader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserX,
  IndianRupee,
  TrendingUp,
  Calendar,
  Handshake,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* ---------------- CARD ---------------- */
function StatCard({ title, value, icon: Icon, color, clickable, onClick  }) {
  return (
    <div onClick={clickable ? onClick : undefined}  className={`
        p-5 rounded-2xl shadow-sm border bg-white transition-all
        ${
          clickable
            ? "cursor-pointer hover:shadow-md hover:-translate-y-1"
            : "cursor-default"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value ?? 0}</h2>
        </div>

        <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- PAGE ---------------- */
function Home() {
  const { trigger: fetchDashboard } = useApiMutation();

  const [dashboard, setDashboard] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const canNavigate =
  user?.details_view === 1 &&
  user?.admin_type !== "user" &&
  user?.user_type === 2;
  const loadDashboard = async () => {
    try {
      setIsFetching(true);
      setError(null);

      const res = await fetchDashboard({
        url: DASHBOARD_API.list,
        method: "get",
      });

      setDashboard(res);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data",
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ---------------- LOADER ---------------- */
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <Card className="max-w-8xl mx-auto shadow-lg border-t-4 border-t-primary bg-white">
        <CardContent>
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b py-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-primary uppercase">
                Dashboard Overview
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back 👋 Here’s your business summary
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={loadDashboard}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* ERROR UI */}
          {error ? (
            <div className="flex flex-col justify-center items-center py-20 text-center px-4">
              <h2 className="text-xl font-bold text-red-500">
                Failed to load dashboard
              </h2>
              <p className="text-gray-600 mt-2 mb-6">{error}</p>
              <Button onClick={loadDashboard} className="bg-primary text-white">
                Retry
              </Button>
            </div>
          ) : (
            /* STATS GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              <StatCard
                title="Active Members"
                value={dashboard?.total_active}
                icon={Users}
                color="bg-green-500"
                clickable={canNavigate}
                onClick={() => navigate("/active-user")}
              />

              <StatCard
                title="Inactive Members"
                value={dashboard?.total_inactive}
                icon={UserX}
                color="bg-red-500"
                clickable={canNavigate}
                onClick={() => navigate("/inactive-user")}
              />

              <StatCard
                title="Leads Exchange"
                value={dashboard?.total_amount}
                icon={IndianRupee}
                color="bg-purple-500"
                clickable={canNavigate}
                onClick={() => navigate("/lead")}
              />

              <StatCard
                title="Total Leads"
                value={dashboard?.total_leads}
                icon={TrendingUp}
                color="bg-blue-500"
                clickable={canNavigate}
                onClick={() => navigate("/lead")}
              />

              <StatCard
                title="Meetings"
                value={dashboard?.total_meeting}
                icon={Calendar}
                color="bg-yellow-500"
                clickable={canNavigate}
                onClick={() => navigate("/inactive-meetings")}
              />

              <StatCard
                title="One to One"
                value={dashboard?.total_onetoone}
                icon={Handshake}
                color="bg-indigo-500"
                clickable={canNavigate}
                onClick={() => navigate("/one-to-one")}
              />

              <StatCard
                title="Visitors"
                value={dashboard?.total_visitor}
                icon={Eye}
                color="bg-pink-500"
                clickable={canNavigate}
                onClick={() => navigate("/visitor-guest")}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;
