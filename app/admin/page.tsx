"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Users,
  DollarSign,
  Activity,
  Cpu,
  ShieldCheck,
  Search,
  Check,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Plus,
  Lock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useToast } from "@/components/ui/toast";
import { formatNumber, formatDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [statsData, setStatsData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [creditToAdd, setCreditToAdd] = useState(1000);
  const [newPlan, setNewPlan] = useState("PRO");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || (session?.user as any)?.role !== "ADMIN") {
      toast({
        title: "Access Denied",
        description: "Admin privileges are required to access this console.",
        type: "error",
      });
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(`/api/admin/users?query=${encodeURIComponent(searchQuery)}`),
      ]);

      const stats = await statsRes.json();
      const userList = await usersRes.json();

      if (stats.success) setStatsData(stats.data);
      if (userList.success) setUsers(userList.data);
    } catch {
      toast({ title: "Failed to load admin stats", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [searchQuery]);

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          planId: newPlan,
          addBonusCredits: Number(creditToAdd),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "User updated successfully", type: "success" });
        setSelectedUser(null);
        fetchAdminData();
      }
    } catch {
      toast({ title: "Update failed", type: "error" });
    }
  };

  const toolColors = ["#6366F1", "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4"];

  return (
    <AppShell
      title="Admin Super Console"
      description="System analytics, user directory management, server quotas, and credit adjustments."
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-semibold uppercase tracking-wider">Total Registered</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {statsData?.stats?.totalUsers ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsData?.stats?.activeUsersMonthly ?? 0} active users
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-semibold uppercase tracking-wider">Estimated MRR</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              ${statsData?.stats?.estimatedMRR ?? 0}
            </div>
            <p className="text-xs text-emerald-600 font-medium">From active subscriptions</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-semibold uppercase tracking-wider">Total Words Processed</span>
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {formatNumber(statsData?.stats?.totalWordsProcessed ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all AI tools</p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="font-semibold uppercase tracking-wider">Service Health</span>
              <ShieldCheck className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {statsData?.stats?.systemUptime || "99.98%"}
            </div>
            <p className="text-xs text-muted-foreground">
              Error rate: {statsData?.stats?.errorRate || "0.00%"}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tool Volume Distribution */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground">Tool Executions Breakdown</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData?.toolBreakdown || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                  <XAxis dataKey="tool" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="executions" name="Runs" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent System Tool Activity */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-foreground">Live Execution Audit Logs</h3>
            <div className="overflow-y-auto max-h-64 space-y-2 text-xs">
              {statsData?.recentActivity?.map((act: any) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-foreground">{act.tool}</span>
                    <p className="text-[11px] text-muted-foreground">{act.user}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-foreground">{act.words} words</span>
                    <p className="text-[10px] text-muted-foreground">{act.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground">User Directory</h3>
              <p className="text-xs text-muted-foreground">
                Inspect accounts, assign roles, upgrade plans, or add bonus credits.
              </p>
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/30 border border-border text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Plan</th>
                  <th className="py-3 px-4 font-semibold">Credits</th>
                  <th className="py-3 px-4 font-semibold">Docs</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium">
                      <div>{u.name || "User"}</div>
                      <div className="text-[11px] text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                      {u.subscription?.planId || "FREE"}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {(u.creditBalance?.monthlyCredits || 1000) + (u.creditBalance?.bonusCredits || 0) - (u.creditBalance?.usedCredits || 0)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{u._count?.documents || 0}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setNewPlan(u.subscription?.planId || "PRO");
                        }}
                        className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted font-semibold text-foreground text-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-foreground">
                Manage User: {selectedUser.name || selectedUser.email}
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground block mb-1">Change Tier Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full p-2 rounded-xl bg-muted/30 border border-border"
                  >
                    <option value="FREE">FREE (1,000 words)</option>
                    <option value="PRO">PRO (50,000 words)</option>
                    <option value="BUSINESS">BUSINESS (250,000 words)</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Add Bonus Credits</label>
                  <input
                    type="number"
                    value={creditToAdd}
                    onChange={(e) => setCreditToAdd(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-muted/30 border border-border"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
