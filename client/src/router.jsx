import { createBrowserRouter, Navigate } from "react-router";
import { AuthLayout, DashboardLayout } from "./components/layouts";
import {
  LoginPage,
  SignUpPage,
  OnboardingPage,
  VerifyEmailPage,
} from "./pages/auth";
import { DashboardPage } from "./pages/dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "sign-up", element: <SignUpPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
      { path: "verify-email/:token", element: <VerifyEmailPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [{ index: true, element: <DashboardPage /> }],
      },
    ],
  },
]);

export default router;
