import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
4
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar showSidebarToggle onToggleSidebar={() => setSidebarOpen((o) => !o)} />
      <div className="d-flex flex-grow-1 bdms-dashboard-shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-grow-1 p-3 p-md-4 bg-light">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
