"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Sun,
  Moon,
  Laptop,
  User,
  Palette,
  PenTool,
  Cpu,
  Bell,
  Lock,
  BarChart3,
  ShieldCheck,
  Globe,
  HelpCircle,
  Save,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Zap,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useSession, signOut } from "next-auth/react";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";

type TabId =
  | "profile"
  | "appearance"
  | "writing"
  | "ai"
  | "notifications"
  | "security"
  | "usage"
  | "privacy"
  | "region"
  | "support";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Writing & AI Preferences
  const [preferredTone, setPreferredTone] = useState("Natural");
  const [preferredStyle, setPreferredStyle] = useState("Standard");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [creativity, setCreativity] = useState(3);
  const [defaultLength, setDefaultLength] = useState("medium");

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Region
  const [timezone, setTimezone] = useState("UTC");

  // Usage & Subscription
  const [subscription, setSubscription] = useState<any>(null);
  const [creditBalance, setCreditBalance] = useState<any>(null);

  // Security (Password Change)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Privacy (Delete Account)
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/user/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setName(data.data.user.name || "");
          setEmail(data.data.user.email || "");
          setSubscription(data.data.subscription);
          setCreditBalance(data.data.creditBalance);

          if (data.data.preference) {
            setPreferredTone(data.data.preference.preferredTone || "Natural");
            setPreferredStyle(data.data.preference.preferredStyle || "Standard");
            setPreferredLanguage(data.data.preference.preferredLanguage || "en");
            setEmailAlerts(data.data.preference.emailAlerts ?? true);
            setProductUpdates(data.data.preference.productUpdates ?? true);
            setSecurityAlerts(data.data.preference.securityAlerts ?? true);
            setTimezone(data.data.preference.timezone || "UTC");
          }
        }
      })
      .catch(() => {
        toast({ title: "Failed to load preferences", type: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast]);

  // Save Preferences
  const handleSavePreferences = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          preferredTone,
          preferredStyle,
          preferredLanguage,
          emailAlerts,
          productUpdates,
          securityAlerts,
          timezone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Settings Saved", description: "Your preferences have been persisted.", type: "success" });
      } else {
        toast({ title: "Save Failed", description: data.error || "Could not save.", type: "error" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to connect to the server.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "Invalid Password", description: "New password must be at least 6 characters.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "New passwords do not match.", type: "error" });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Password Changed", description: "Your password has been securely updated.", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({ title: "Update Failed", description: data.error || "Incorrect current password.", type: "error" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update password.", type: "error" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Export User Data
  const handleExportData = () => {
    window.open("/api/user/export", "_blank");
    toast({ title: "Export Started", description: "Downloading your account archive in JSON format.", type: "info" });
  };

  // Delete Account
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation !== "DELETE MY ACCOUNT") {
      toast({ title: "Confirmation Error", description: 'Please type "DELETE MY ACCOUNT" exactly.', type: "error" });
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: deleteConfirmation, password: deletePassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Account Deleted", description: "Signing out...", type: "success" });
        signOut({ callbackUrl: "/" });
      } else {
        toast({ title: "Deletion Failed", description: data.error || "Could not delete account.", type: "error" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete account.", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const navTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "writing", label: "Writing Preferences", icon: PenTool },
    { id: "ai", label: "AI Preferences", icon: Cpu },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Passwords", icon: Lock },
    { id: "usage", label: "Usage & Limits", icon: BarChart3 },
    { id: "privacy", label: "Data & Privacy", icon: ShieldCheck },
    { id: "region", label: "Language & Region", icon: Globe },
    { id: "support", label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <AppShell
      title="Settings & Preferences"
      description="Customize your profile, writing styles, appearance, security, and usage preferences."
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <aside className="space-y-1 lg:col-span-1">
          <div className="p-2 rounded-2xl bg-card border border-border shadow-xs space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Pane */}
        <main className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="p-12 text-center rounded-3xl bg-card border border-border flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <p className="text-xs font-medium">Loading preferences...</p>
            </div>
          ) : (
            <>
              {/* 1. PROFILE */}
              {activeTab === "profile" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <User className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">User Profile</h3>
                      <p className="text-xs text-muted-foreground">Update your display name and review account details.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Email Address (Read-only)</label>
                        <input
                          type="email"
                          disabled
                          value={email}
                          className="w-full p-2.5 rounded-xl bg-muted/20 border border-border text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-primary text-xs flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Profile Changes</span>
                    </button>
                  </form>
                </div>
              )}

              {/* 2. APPEARANCE */}
              {activeTab === "appearance" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Palette className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Appearance & Theme</h3>
                      <p className="text-xs text-muted-foreground">Select your interface color scheme preference.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Laptop },
                    ].map((t) => {
                      const Icon = t.icon;
                      const isSelected = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id as any)}
                          className={`p-4 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-2 transition-all ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. WRITING PREFERENCES */}
              {activeTab === "writing" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <PenTool className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Default Writing Preferences</h3>
                      <p className="text-xs text-muted-foreground">Preset defaults for the AI Humanizer and Paraphraser.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Default Humanizing Mode</label>
                        <select
                          value={preferredTone}
                          onChange={(e) => setPreferredTone(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none"
                        >
                          <option value="Natural">Natural (Recommended)</option>
                          <option value="Standard">Standard</option>
                          <option value="Professional">Professional</option>
                          <option value="Academic">Academic</option>
                          <option value="Casual">Casual</option>
                          <option value="Creative">Creative</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Default Rewriting Style</label>
                        <select
                          value={preferredStyle}
                          onChange={(e) => setPreferredStyle(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none"
                        >
                          <option value="Standard">Standard Balanced</option>
                          <option value="Fluency">High Fluency</option>
                          <option value="Formal">Formal & Academic</option>
                          <option value="Simple">Simple & Clear</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-primary text-xs flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Writing Preferences</span>
                    </button>
                  </form>
                </div>
              )}

              {/* 4. AI PREFERENCES */}
              {activeTab === "ai" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Cpu className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">AI Generation Settings</h3>
                      <p className="text-xs text-muted-foreground">Configure default creativity and length for AI Writer.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-muted-foreground">Creativity Temperature:</span>
                        <span className="font-bold text-foreground">{creativity} / 5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={creativity}
                        onChange={(e) => setCreativity(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Higher values produce more creative phrasing; lower values adhere strictly to structured facts.
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="font-semibold text-muted-foreground">Default Output Length</label>
                      <select
                        value={defaultLength}
                        onChange={(e) => setDefaultLength(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none"
                      >
                        <option value="short">Short (~150 words)</option>
                        <option value="medium">Medium (~350 words)</option>
                        <option value="long">Long (~700 words)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-primary text-xs flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save AI Preferences</span>
                    </button>
                  </form>
                </div>
              )}

              {/* 5. NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Bell className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Notification Preferences</h3>
                      <p className="text-xs text-muted-foreground">Select which communications you want to receive.</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20 cursor-pointer">
                      <div>
                        <div className="font-semibold text-foreground">Usage & Refill Alerts</div>
                        <div className="text-[11px] text-muted-foreground">Notifies you when your monthly credit balance renews.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20 cursor-pointer">
                      <div>
                        <div className="font-semibold text-foreground">Product Updates & Features</div>
                        <div className="text-[11px] text-muted-foreground">Announcements about new AI writing tools and model updates.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={productUpdates}
                        onChange={(e) => setProductUpdates(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20 cursor-pointer">
                      <div>
                        <div className="font-semibold text-foreground">Critical Security Notices</div>
                        <div className="text-[11px] text-muted-foreground">Alerts on password changes, new logins, or security events.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={securityAlerts}
                        onChange={(e) => setSecurityAlerts(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600"
                      />
                    </label>
                  </div>

                  <button
                    onClick={() => handleSavePreferences()}
                    disabled={isSaving}
                    className="btn-primary text-xs flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Notification Settings</span>
                  </button>
                </div>
              )}

              {/* 6. SECURITY */}
              {activeTab === "security" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Security & Password</h3>
                      <p className="text-xs text-muted-foreground">Keep your account secure by updating your password.</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs max-w-md">
                    <div className="space-y-1">
                      <label className="font-semibold text-muted-foreground">Current Password</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-muted-foreground">New Password (min. 6 characters)</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-muted-foreground">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isChangingPassword || !currentPassword || !newPassword}
                      className="btn-primary text-xs flex items-center gap-2"
                    >
                      {isChangingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>Update Password</span>
                    </button>
                  </form>
                </div>
              )}

              {/* 7. USAGE & LIMITS */}
              {activeTab === "usage" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Usage, Plan & Quota</h3>
                      <p className="text-xs text-muted-foreground">Review your active subscription tier and credit balances.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1">
                      <span className="text-muted-foreground font-semibold">Active Plan</span>
                      <div className="text-lg font-extrabold text-foreground">{subscription?.planId || "FREE"}</div>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">{subscription?.status || "ACTIVE"}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1">
                      <span className="text-muted-foreground font-semibold">Remaining Credits</span>
                      <div className="text-lg font-extrabold text-indigo-600">
                        {((creditBalance?.monthlyCredits || 1000) + (creditBalance?.bonusCredits || 0) - (creditBalance?.usedCredits || 0)).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-muted-foreground">Used: {(creditBalance?.usedCredits || 0).toLocaleString()}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1">
                      <span className="text-muted-foreground font-semibold">Next Refill Date</span>
                      <div className="text-xs font-bold text-foreground mt-1">
                        {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "Next Month"}
                      </div>
                      <span className="text-[10px] text-muted-foreground">Auto-refreshes monthly</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/billing" className="btn-primary text-xs inline-flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Manage Plans & Upgrade</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* 8. DATA & PRIVACY */}
              {activeTab === "privacy" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Data Management & Privacy</h3>
                      <p className="text-xs text-muted-foreground">Download your archive or permanently delete your account.</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Export */}
                    <div className="p-4 rounded-2xl border border-border bg-muted/20 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-bold text-foreground">Export Account Archive</div>
                        <div className="text-[11px] text-muted-foreground">Download a complete JSON export of your saved documents and generation logs.</div>
                      </div>
                      <button onClick={handleExportData} className="btn-secondary text-xs flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Data</span>
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-3">
                      <div className="space-y-0.5">
                        <div className="font-bold text-rose-600 dark:text-rose-400">Danger Zone: Delete Account</div>
                        <div className="text-[11px] text-muted-foreground">
                          This will permanently delete your account, saved documents, and generations. This action cannot be undone.
                        </div>
                      </div>

                      <form onSubmit={handleDeleteAccount} className="space-y-3 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder='Type "DELETE MY ACCOUNT"'
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            className="p-2 rounded-xl bg-background border border-border text-foreground text-xs"
                          />
                          <input
                            type="password"
                            placeholder="Current Password (if set)"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="p-2 rounded-xl bg-background border border-border text-foreground text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isDeleting || deleteConfirmation !== "DELETE MY ACCOUNT"}
                          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          <span>Permanently Delete My Account</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. LANGUAGE & REGION */}
              {activeTab === "region" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Language & Regional Settings</h3>
                      <p className="text-xs text-muted-foreground">Configure preferred language and timezone for timestamp formatting.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Interface Language</label>
                        <select
                          value={preferredLanguage}
                          onChange={(e) => setPreferredLanguage(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none"
                        >
                          <option value="en">English (US)</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="it">Italiano</option>
                          <option value="pt">Português</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Timezone</label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-muted/30 border border-border text-foreground focus:outline-none"
                        >
                          <option value="UTC">UTC (Coordinated Universal Time)</option>
                          <option value="America/New_York">Eastern Time (US & Canada)</option>
                          <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="Europe/Paris">Central European Time (CET)</option>
                          <option value="Asia/Kolkata">India Standard Time (IST)</option>
                          <option value="Asia/Tokyo">Tokyo (JST)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-primary text-xs flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Regional Settings</span>
                    </button>
                  </form>
                </div>
              )}

              {/* 10. HELP & SUPPORT */}
              {activeTab === "support" && (
                <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Help & Technical Support</h3>
                      <p className="text-xs text-muted-foreground">Documentation, support contact, and common FAQs.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-2">
                      <div className="font-bold text-foreground">Contact Direct Support</div>
                      <p className="text-muted-foreground text-[11px]">
                        Need help or experiencing an issue? Our engineering support team is available 24/7.
                      </p>
                      <a
                        href="mailto:support@humanizeai.com"
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                      >
                        <span>support@humanizeai.com</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-2">
                      <div className="font-bold text-foreground">Platform Documentation & FAQ</div>
                      <p className="text-muted-foreground text-[11px]">
                        Review detection accuracy benchmarks, anti-detection tips, and API integration guides.
                      </p>
                      <Link
                        href="/#faq"
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                      >
                        <span>Visit FAQ Section</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </AppShell>
  );
}
