"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  FileText,
  Search,
  Filter,
  Trash2,
  Copy,
  ExternalLink,
  Edit2,
  Check,
  X,
  Clock,
  Sparkles,
  Download,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatNumber } from "@/lib/utils";

interface DocItem {
  id: string;
  title: string;
  content: string;
  toolType: string;
  wordCount: number;
  charCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function HistoryPage() {
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [selectedTool, setSelectedTool] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/documents", window.location.origin);
      if (selectedTool !== "ALL") url.searchParams.set("tool", selectedTool);
      if (searchQuery) url.searchParams.set("search", searchQuery);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success && data.data) {
        setDocs(data.data);
      }
    } catch {
      toast({ title: "Failed to load documents", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [selectedTool]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDocs((prev) => prev.filter((d) => d.id !== id));
        if (previewDoc?.id === id) setPreviewDoc(null);
        toast({ title: "Document deleted", type: "success" });
      }
    } catch {
      toast({ title: "Delete failed", type: "error" });
    }
  };

  const handleDuplicate = async (doc: DocItem) => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${doc.title} (Copy)`,
          content: doc.content,
          toolType: doc.toolType,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDocs((prev) => [data.data, ...prev]);
        toast({ title: "Document duplicated", type: "success" });
      }
    } catch {
      toast({ title: "Duplicate failed", type: "error" });
    }
  };

  const handleRename = async (id: string) => {
    if (!editingTitle.trim()) return;
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle }),
      });
      const data = await res.json();
      if (data.success) {
        setDocs((prev) =>
          prev.map((d) => (d.id === id ? { ...d, title: editingTitle } : d))
        );
        setEditingId(null);
        toast({ title: "Renamed successfully", type: "success" });
      }
    } catch {
      toast({ title: "Rename failed", type: "error" });
    }
  };

  const handleDownload = (doc: DocItem) => {
    const blob = new Blob([doc.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded document", type: "success" });
  };

  const tools = [
    { id: "ALL", label: "All Tools" },
    { id: "HUMANIZER", label: "Humanizer" },
    { id: "DETECTOR", label: "Detector" },
    { id: "WRITER", label: "AI Writer" },
    { id: "PARAPHRASER", label: "Paraphraser" },
    { id: "GRAMMAR", label: "Grammar" },
    { id: "SUMMARIZER", label: "Summarizer" },
    { id: "TONE", label: "Tone" },
  ];

  return (
    <AppShell
      title="Document History"
      description="Manage, duplicate, search, and export all your saved documents and rewrites."
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search & Tool Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-card border border-border/80 shadow-sm">
          {/* Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchDocs();
            }}
            className="w-full sm:w-80 relative"
          >
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by title or text..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-muted/30 border border-border focus:outline-none focus:border-indigo-500"
            />
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTool(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedTool === t.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-muted/40 border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="rounded-3xl bg-card border border-border/80 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading document history...
            </div>
          ) : docs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                    <th className="py-3.5 px-5 font-semibold">Title</th>
                    <th className="py-3.5 px-4 font-semibold">Tool</th>
                    <th className="py-3.5 px-4 font-semibold">Words</th>
                    <th className="py-3.5 px-4 font-semibold">Updated</th>
                    <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {docs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-foreground max-w-xs">
                        {editingId === doc.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="px-2 py-1 rounded-md border border-indigo-500 bg-background text-xs w-full"
                              autoFocus
                            />
                            <button
                              onClick={() => handleRename(doc.id)}
                              className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 text-muted-foreground hover:bg-muted rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => setPreviewDoc(doc)}
                            className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold truncate"
                          >
                            {doc.title}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {doc.toolType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{doc.wordCount}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {formatDate(doc.updatedAt)}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-1">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Preview Document"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(doc.id);
                            setEditingTitle(doc.title);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(doc)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Download TXT"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto" />
              <p className="text-sm font-semibold text-foreground">No documents found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Documents created in the AI Humanizer, Writer, or other tools will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Document Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-foreground">{previewDoc.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {previewDoc.toolType} • {previewDoc.wordCount} words • {formatDate(previewDoc.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-4 rounded-2xl bg-muted/30 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/20">
                {previewDoc.content}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewDoc.content);
                    toast({ title: "Copied to clipboard", type: "success" });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Text
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
