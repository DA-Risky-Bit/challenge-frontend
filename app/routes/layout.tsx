import { Outlet, useLocation } from "react-router";
import Background from "~/components/Background";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

export default function Layout() {
  const { pathname } = useLocation();
  const route = pathname === "/" ? "login" : pathname.split("/")[1];

  return (
    <>
      <Background dim={route !== "login"} />
      <div className="app" data-route={route}>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
