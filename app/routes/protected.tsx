import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useApp } from "~/context/AppContext";

export default function Protected() {
  const { isLoggedIn, authChecked } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const redirect = authChecked && !isLoggedIn;

  // runs once when the login state turns out to be missing
  useEffect(() => {
    if (redirect) navigate("/", { replace: true, state: { from: location } });
  }, [redirect]);

  if (!authChecked || redirect) return null;
  return <Outlet />;
}
