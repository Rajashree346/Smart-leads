import Header from "../components/Header";
import LeadClient from "../components/leads/LeadClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Refactored Header */}
      <Header />

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Refactored Leads Client */}
        <LeadClient />
      </main>
    </div>
  );
}