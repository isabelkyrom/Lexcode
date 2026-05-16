'use client'
import Navbar from "./NavBarUser";

export default function AppShell({ children }) {
  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar /> 
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}