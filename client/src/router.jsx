import { createBrowserRouter, Navigate } from "react-router";

import { AuthLayout, DashboardLayout } from "./components/layouts";
import { LoginPage, SignUpPage, OnboardingPage } from "./pages/auth";
import { DashboardPage } from "./pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "sign-up", element: <SignUpPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
]);

export default router;
