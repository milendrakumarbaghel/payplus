import React from "react";
import { Appbar } from "./Appbar";

// Simple page shell: sticky Appbar on top and padded main content
export const Layout = ({ userInitial = "U", onLogout, children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
            {/* Top navigation */}
            <Appbar nameFirstLetter={(userInitial || "U").toUpperCase()} />

            {/* Main content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;
