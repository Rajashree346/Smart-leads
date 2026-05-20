import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, AlertCircle } from "lucide-react";
import { usePutApiV1AuthLeadsId } from "../../api/generated/leads/leads";
import { PostApiV1AuthLeadsBody } from "../../api/generated/zod/leads/leads"; // we validate edit using full body for strict UI input checks
import type { LeadResponse } from "../../api/generated/model/leadResponse";
import type { LeadRequest } from "../../api/generated/model/leadRequest";

interface EditLeadModalProps {
  isOpen: boolean;
  lead: LeadResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditLeadModal({ isOpen, lead, onClose, onSuccess }: EditLeadModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadRequest>({
    resolver: zodResolver(PostApiV1AuthLeadsBody),
  });

  const { mutate: updateLead, isPending, error: apiError } = usePutApiV1AuthLeadsId();

  // Reset form with current lead details when lead or isOpen changes
  useEffect(() => {
    if (isOpen && lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    }
  }, [isOpen, lead, reset]);

  if (!isOpen || !lead) return null;

  const onSubmit = (formData: LeadRequest) => {
    updateLead(
      { 
        id: lead._id, 
        data: formData 
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (err) => {
          console.error("Failed to update lead:", err);
        },
      }
    );
  };

  const getApiErrorMessage = (error: any) => {
    return error?.response?.data?.message || error?.message || "An error occurred while updating the lead.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Lead</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!!apiError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <span className="font-semibold">Error:</span> {getApiErrorMessage(apiError)}
              </div>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="edit-name" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              id="edit-name"
              type="text"
              placeholder="e.g. Sarah Connor"
              disabled={isPending}
              {...register("name")}
              className={`block w-full rounded-xl border bg-white dark:bg-slate-950 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                errors.name 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-slate-200 dark:border-slate-800 focus:ring-purple-600"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="edit-email" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              id="edit-email"
              type="email"
              placeholder="e.g. sarah@example.com"
              disabled={isPending}
              {...register("email")}
              className={`block w-full rounded-xl border bg-white dark:bg-slate-950 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                errors.email 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-slate-200 dark:border-slate-800 focus:ring-purple-600"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Grid for Status and Source */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="edit-status" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                id="edit-status"
                disabled={isPending}
                {...register("status")}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all cursor-pointer"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label htmlFor="edit-source" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Source
              </label>
              <select
                id="edit-source"
                disabled={isPending}
                {...register("source")}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all cursor-pointer"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/40">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
