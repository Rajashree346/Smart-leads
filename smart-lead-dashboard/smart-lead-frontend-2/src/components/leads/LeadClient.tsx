import { useState, useEffect } from "react";
import { Search, Plus, Filter, ArrowUpDown, ChevronLeft, ChevronRight, X, AlertCircle, ChevronDown } from "lucide-react";
import { useGetApiV1AuthLeads } from "../../api/generated/leads/leads";
import LeadCard from "./LeadCard";
import CreateLeadModal from "./CreateLeadModal";
import EditLeadModal from "./EditLeadModal";
import type { GetApiV1AuthLeadsStatus } from "../../api/generated/model/getApiV1AuthLeadsStatus";
import type { GetApiV1AuthLeadsSource } from "../../api/generated/model/getApiV1AuthLeadsSource";
import type { GetApiV1AuthLeadsSort } from "../../api/generated/model/getApiV1AuthLeadsSort";
import type { LeadResponse } from "../../api/generated/model/leadResponse";

export default function LeadClient() {
  // Query States
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<GetApiV1AuthLeadsStatus | "">("");
  const [source, setSource] = useState<GetApiV1AuthLeadsSource | "">("");
  const [sort, setSort] = useState<GetApiV1AuthLeadsSort>("Latest");
  const [page, setPage] = useState("1");
  const limit = "9"; // 9 per page is a nice grid number (3x3)

  // Modals States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadResponse | null>(null);

  // Debounce search text input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage("1"); // Reset to page 1 on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch Leads data using generated hook
  const { data, isLoading, isError, refetch } = useGetApiV1AuthLeads({
    search: debouncedSearch || undefined,
    status: status || undefined,
    source: source || undefined,
    sort,
    page,
    limit,
  });

  const handleResetFilters = () => {
    setSearchText("");
    setStatus("");
    setSource("");
    setSort("Latest");
    setPage("1");
  };

  const handlePageChange = (newPage: number) => {
    setPage(String(newPage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const leads = data?.data?.leads || [];
  const pagination = data?.data?.pagination;
  const totalCount = pagination?.totalCount || 0;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.page || 1;

  // Determine showing counts
  const startCount = (currentPage - 1) * Number(limit) + 1;
  const endCount = Math.min(currentPage * Number(limit), totalCount);

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search leads by name or email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="block w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Status Filter */}
          <div className="relative min-w-[130px] flex-1 sm:flex-none">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Filter className="h-4 w-4" />
            </div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as GetApiV1AuthLeadsStatus | "");
                setPage("1");
              }}
              className="block w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-10 text-sm text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none cursor-pointer transition-all"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          {/* Source Filter */}
          <div className="relative min-w-[130px] flex-1 sm:flex-none">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Filter className="h-4 w-4" />
            </div>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value as GetApiV1AuthLeadsSource | "");
                setPage("1");
              }}
              className="block w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-10 text-sm text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none cursor-pointer transition-all"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="relative min-w-[145px] flex-1 sm:flex-none">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <ArrowUpDown className="h-4 w-4" />
            </div>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as GetApiV1AuthLeadsSort);
                setPage("1");
              }}
              className="block w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-10 text-sm text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none cursor-pointer transition-all"
            >
              <option value="Latest">Newest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex h-11 items-center justify-center gap-1.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white shadow-sm hover:shadow transition-all cursor-pointer grow sm:grow-0"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>

        </div>
      </div>

      {/* Grid / Content States */}
      {isLoading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 animate-pulse shadow-sm">
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-md w-1/2" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
              </div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800/40 rounded w-1/3 pt-2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        /* Error State */
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center text-red-800 dark:text-red-400">
          <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-1">Failed to fetch leads</h3>
          <p className="text-sm mb-4">There was an issue retrieving your lead records. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : leads.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[350px]">
          <div className="h-14 w-14 bg-slate-100 dark:bg-slate-800/60 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">No leads found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm text-center mb-6">
            We couldn't find any leads matching your criteria. Try adjusting your search queries or adding a new record.
          </p>
          <div className="flex items-center justify-center gap-3">
            {(searchText || status || source) && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white shadow-md hover:shadow transition-all cursor-pointer"
            >
              Add Your First Lead
            </button>
          </div>
        </div>
      ) : (
        /* Lead Cards List */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onEdit={(l) => {
                  setSelectedLead(l);
                  setIsEditOpen(true);
                }}
                onDeleteSuccess={refetch}
              />
            ))}
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{startCount}</span> to{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">{endCount}</span> of{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">{totalCount}</span> leads
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 text-sm font-semibold rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-purple-600 text-white shadow"
                          : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Containers */}
      <CreateLeadModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refetch}
      />

      <EditLeadModal
        isOpen={isEditOpen}
        lead={selectedLead}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedLead(null);
        }}
        onSuccess={refetch}
      />

    </div>
  );
}
