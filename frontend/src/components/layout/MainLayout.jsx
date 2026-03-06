import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../styles/layout.css";

export default function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-content">
        <Header />

        <main className="main-content">
          <div className="page-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}