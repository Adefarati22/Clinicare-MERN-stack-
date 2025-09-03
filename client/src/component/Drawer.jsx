import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ErrorAlert from "./ErrorAlert";
import Header from "./Header";
import Logo from "./Logo";

export default function Drawer({ error, loading, user }) {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  return (
    <div className="lg:hidden">
      {/* Top bar with menu button */}
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <Logo />
        <button onClick={toggleDrawer}>
          <RiMenuLine size={28} />
        </button>
      </div>
      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        style={{ background: open ? "rgba(0,0,0,0.3)" : "transparent" }}
        onClick={toggleDrawer}
      />
      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-4/5 bg-white shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Header user={user} />
          <button onClick={toggleDrawer} className="ml-2">
            <RiCloseLine size={28} />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)] p-2">
          {error && <ErrorAlert error={error} />}
          {loading ? (
            <p className="text-center text-sm">Loading...</p>
          ) : (
            <Sidebar user={user} />
          )}
        </div>
      </div>
    </div>
  );
}