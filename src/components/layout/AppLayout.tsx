import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <Sidebar />
    <main
      style={{
        marginLeft: "var(--sidebar-width)",
        flex: 1,
        minHeight: "100vh",
        background: "var(--bg)",
        overflowY: "auto",
      }}
    >
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
