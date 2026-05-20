import { Trash2, Edit, Mail, Calendar, Loader2 } from "lucide-react";
import { useDeleteApiV1AuthLeadsId } from "../../api/generated/leads/leads";
import type { LeadResponse } from "../../api/generated/model/leadResponse";

interface LeadCardProps {
  lead: LeadResponse;
  onEdit: (lead: LeadResponse) => void;
  onDeleteSuccess: () => void;
}

export default function LeadCard({ lead, onEdit, onDeleteSuccess }: LeadCardProps) {
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteApiV1AuthLeadsId();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete lead ${lead.name}?`)) {
      deleteLead(
        { id: lead._id },
        {
          onSuccess: () => {
            onDeleteSuccess();
          },
          onError: (error) => {
            console.error("Failed to delete lead:", error);
            alert("Error deleting lead. Please try again.");
          },
        }
      );
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50";
      case "Contacted":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
      case "Qualified":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50";
      case "Lost":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800";
    }
  };

  const getSourceStyles = (source: string) => {
    switch (source) {
      case "Website":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50";
      case "Instagram":
        return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/50";
      case "Referral":
        return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/50";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800";
    }
  };

  const formattedDate = new Date(lead.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group">
      
      {/* Top Section: Lead Info and Action Buttons */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-lg">
              {lead.name}
            </h3>
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{lead.email}</span>
            </a>
          </div>

          {/* Action buttons (Visible on hover on desktop, always visible on mobile) */}
          <div className="flex items-center gap-1 opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(lead)}
              disabled={isDeleting}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Lead"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
              title="Delete Lead"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-600" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Badges Section */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(lead.status)}`}>
            {lead.status}
          </span>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getSourceStyles(lead.source)}`}>
            {lead.source}
          </span>
        </div>
      </div>

      {/* Footer Section: Date Created */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/40">
        <Calendar className="h-3.5 w-3.5" />
        <span>Added on {formattedDate}</span>
      </div>

    </div>
  );
}
