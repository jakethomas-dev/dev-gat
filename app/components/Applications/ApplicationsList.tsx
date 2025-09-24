"use client";
import { useState, useEffect, useCallback } from "react";
import { Pen, Trash, RefreshCw, Plus } from "lucide-react";
import applicationTypes from "@/app/data/applicationTypes.json";
import { useRouter } from "next/navigation";

interface AppRecord {
  id: string;
  applicationName: string;
  siteLocation: string;
  applicationType: string;
  proposal: string;
  createdAt: string;
  statusOf: string;
}

export default function ApplicationsList() {
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // filter state
  const [status, setStatus] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const router = useRouter();

  const fetchApplications = useCallback(() => {
    fetch("/api/applications", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load applications");
        return res.json();
      })
      .then((data: AppRecord[]) => setApps(data))
      .catch((e) => {
        console.error(e);
        setApps([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // fetch on initial mount
  useEffect(() => {
    setLoading(true);
     fetchApplications();
  }, [fetchApplications]);

  let filtered = apps.filter((app) => {
    const matchesStatus = status === "All" || app.statusOf === status;
    const matchesKeyword =
      !keyword ||
      app.applicationName.toLowerCase().includes(keyword.toLowerCase()) ||
      app.siteLocation.toLowerCase().includes(keyword.toLowerCase()) ||
      app.proposal.toLowerCase().includes(keyword.toLowerCase());
    return matchesStatus && matchesKeyword;
  });

  filtered = filtered.sort((a, b) =>
    sortOrder === "desc"
      ? b.createdAt.localeCompare(a.createdAt)
      : a.createdAt.localeCompare(b.createdAt)
  );

  const handleDelete = async (id: string) => {
  await fetch(`/api/applications/${id}`, { method: "DELETE" });
  setApps(apps.filter((a) => a.id !== id));
  };

  const handleEdit = (id: string) => {
  router.push(`/dashboard/applications/view-full/${id}`);
  };

  return (
    <div className="bg-white rounded-xl px-8 py-6 border rounded-xl shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Applications</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchApplications();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:cursor-pointer hover:shadow-lg hover:border-black hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition all duration-300"
            aria-label="Create new application"
          >
            <Plus className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchApplications();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:cursor-pointer hover:shadow-lg hover:border-black hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition all duration-300"
            aria-label="Refresh applications"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
      <div className="text-center hidden md:grid grid-cols-6 px-2 py-2 font-semibold text-gray-700">
        <div>Name</div>
        <div>Location</div>
        <div>Type</div>
        <div>Date Created</div>
        <div>Status</div>
        <div className="text-center">Actions</div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {loading ? (
          <div className="rounded-xl p-6 bg-white text-center text-gray-400 border border-gray-200">
            Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl p-6 bg-white text-center text-gray-400 border border-gray-200">
            No applications found.
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className="text-sm flex flex-col md:flex-row md:items-center md:gap-0 border border-gray-200 rounded-xl p-4 bg-white hover:border-gray-400 hover:shadow-lg transition-all duration-300 ease-in-out min-h-[64px] text-center"
            >
              <div className="flex-1 md:w-1/6">{app.applicationName}</div>
              <div className="flex-1 md:w-1/6">{app.siteLocation}</div>
              <div className="flex-1 md:w-1/6">
                {applicationTypes.find((t) => t.value === app.applicationType)?.label ||
                  app.applicationType}
              </div>
              <div className="flex-1 md:w-1/6">
                {new Date(app.createdAt).toLocaleDateString()}
              </div>
              <div className="flex-1 md:w-1/6">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    app.statusOf === "Submitted"
                      ? "bg-green-100 text-green-700"
                      : app.statusOf === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.statusOf}
                </span>
              </div>
              <div className="flex gap-2 justify-center md:w-1/6">
                <button
                  onClick={() => handleEdit(app.id)}
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold"
                >
                  <Pen className="inline" size={18} />
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold"
                >
                  <Trash className="inline" size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}