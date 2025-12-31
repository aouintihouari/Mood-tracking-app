import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";

import {
  GreetingSection,
  EmptyStateCard,
  EmptyTrendChart,
  StatCard,
  TrendChart,
} from "../../components/dashboard";
import DailyMoodSection from "../../components/dashboard/DailyMoodSection";
import { CheckInModal } from "../../components/checkin";
import api from "../../api/axios";

const DashboardPage = () => {
  // On récupère user et refreshUser du parent (DashboardLayout)
  const { user, refreshUser } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [averages, setAverages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // On ne fetch plus /users/me ici, le Layout s'en occupe
      const statsRes = await api.get("/users/dashboard-stats");

      const { stats: fetchedStats, averages: fetchedAverages } =
        statsRes.data.data;

      setStats(fetchedStats || []);
      setAverages(fetchedAverages);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const hasLoggedToday = () => {
    if (stats.length === 0) return false;
    const lastCheckIn = stats[stats.length - 1];
    const lastDate = new Date(lastCheckIn.checkInDate).toDateString();
    const today = new Date().toDateString();
    return lastDate === today;
  };

  const isCheckInDone = hasLoggedToday();
  const hasEnoughData = stats.length >= 5;
  const todayData = isCheckInDone ? stats[stats.length - 1] : null;

  if (isLoading)
    return (
      <div className="text-preset-4 p-10 text-center text-neutral-600">
        Loading Dashboard...
      </div>
    );

  return (
    <main className="mx-auto flex w-full flex-col gap-8 pb-20">
      <div className="flex flex-col items-center gap-8">
        <GreetingSection user={user} />

        {!isCheckInDone ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-preset-5 text-neutral-0 rounded-16 cursor-pointer bg-blue-600 px-8 py-4 shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95"
          >
            Log today's mood
          </button>
        ) : (
          <div className="w-full">
            <DailyMoodSection todayData={todayData} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-1">
          {!hasEnoughData ? (
            <EmptyStateCard
              title="Average Mood"
              message="Log 5 check-ins to see your average mood."
              icon="chart"
            />
          ) : (
            <StatCard
              type="mood"
              averageValue={averages?.mood?.value}
              trendDirection={averages?.mood?.direction}
              trendLabel={averages?.mood?.label}
            />
          )}

          {!hasEnoughData ? (
            <EmptyStateCard
              title="Average Sleep"
              message="Track 5 nights to view average sleep."
              icon="sleep"
            />
          ) : (
            <StatCard
              type="sleep"
              averageValue={averages?.sleep?.value}
              trendDirection={averages?.sleep?.direction}
              trendLabel={averages?.sleep?.label}
            />
          )}
        </div>

        <div className="flex h-full min-h-[400px] flex-col lg:col-span-2">
          {stats.length === 0 ? (
            <EmptyTrendChart />
          ) : (
            <TrendChart data={stats} />
          )}
        </div>
      </div>

      <CheckInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchDashboardData();
          refreshUser(); // Optionnel : rafraîchir l'user si nécessaire
        }}
      />
    </main>
  );
};

export default DashboardPage;
