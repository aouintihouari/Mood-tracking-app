import { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router";
import Header from "../header/Header";
import api from "../../api/axios";

const DashboardLayout = () => {
  const [user, setUser] = useState(null);

  // Définition de la fonction de fetch avec useCallback pour la stabilité
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="min-h-screen w-full bg-(image:--image-light-gradient) px-4 py-6 md:px-8 md:py-8 lg:px-20 lg:py-10">
      <div className="mx-auto w-full">
        <Header user={user} onUpdateSuccess={fetchUser} />

        <div className="mt-8 md:mt-12">
          <Outlet context={{ user, refreshUser: fetchUser }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
