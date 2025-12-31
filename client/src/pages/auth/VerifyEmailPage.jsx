import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; // Attention: "react-router-dom" ou "react-router"
import api from "../../api/axios";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        await api.get(`/auth/verify/${token}`);

        setStatus("Success! Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        console.error(err);
        setStatus("Invalid or expired token. Please try signing up again.");
      }
    };

    if (token) verifyAccount();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-preset-3 font-bold text-neutral-900">
        Email Verification
      </h2>
      <p className="text-preset-6 text-neutral-600">{status}</p>
    </div>
  );
};

export default VerifyEmailPage;
