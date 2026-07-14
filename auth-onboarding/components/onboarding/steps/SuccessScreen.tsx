"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Mail, ArrowRight, Clock, Smartphone, Send, Check, Trash2, Settings, RefreshCw, AlertTriangle, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionButton } from "../primitives/ActionButton";
import { PaymentMethod, PlanTier, type Theme, type PersonaType } from "../types";
import type { TranslationDict } from "../translations";

interface SuccessScreenProps {
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
  personaType: PersonaType | null;
  username: string;
  onEnterPlatform: () => void;
}

export function SuccessScreen({
  theme,
  isRtl,
  t,
  username,
  onEnterPlatform,
}: SuccessScreenProps) {
  const isDark = theme === "dark";
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Sync with localStorage
  const loadData = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("vigorhub_current_user");
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {}
      }
      const usersStr = localStorage.getItem("vigorhub_users");
      if (usersStr) {
        try {
          setAllUsers(JSON.parse(usersStr));
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckStatus = () => {
    loadData();
  };

  // Admin approvals
  const handleApproveUser = (userId: string) => {
    const updatedUsers = allUsers.map((u) => {
      if (u.id === userId) {
        return { ...u, status: "approved" };
      }
      return u;
    });
    localStorage.setItem("vigorhub_users", JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);

    // If it's the current user, update their active session too
    if (currentUser && currentUser.id === userId) {
      const updatedCurrent = { ...currentUser, status: "approved" };
      localStorage.setItem("vigorhub_current_user", JSON.stringify(updatedCurrent));
      setCurrentUser(updatedCurrent);
    }
  };

  const handleDeclineUser = (userId: string) => {
    const updatedUsers = allUsers.map((u) => {
      if (u.id === userId) {
        return { ...u, status: "declined" };
      }
      return u;
    });
    localStorage.setItem("vigorhub_users", JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);

    if (currentUser && currentUser.id === userId) {
      const updatedCurrent = { ...currentUser, status: "declined" };
      localStorage.setItem("vigorhub_current_user", JSON.stringify(updatedCurrent));
      setCurrentUser(updatedCurrent);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = allUsers.filter((u) => u.id !== userId);
    localStorage.setItem("vigorhub_users", JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);

    if (currentUser && currentUser.id === userId) {
      localStorage.removeItem("vigorhub_current_user");
      setCurrentUser(null);
    }
  };

  const getPlanLabel = (plan: string, cycle: string) => {
    const pLabel = plan === "basic" ? (isRtl ? "الباقة الأساسية" : "Standard Plan") : plan === "pro" ? (isRtl ? "الباقة المتقدمة" : "Pro Plan") : (isRtl ? "باقة النخبة VIP" : "VIP Plan");
    const cLabel = cycle === "month" ? (isRtl ? "شهري" : "Monthly") : cycle === "3months" ? (isRtl ? "3 شهور" : "3 Months") : (isRtl ? "سنوي" : "Yearly");
    return `${pLabel} (${cLabel})`;
  };

  // Construct WhatsApp Link
  const getWhatsAppLink = (user: any) => {
    const planName = user.plan === "basic" ? "الأساسية (Standard)" : user.plan === "pro" ? "المتقدمة (Pro)" : "النخبة (VIP)";
    const duration = user.billingCycle === "month" ? "لمدة شهر" : user.billingCycle === "3months" ? "لمدة 3 أشهر" : "لمدة سنة كاملة";
    const rawNum = user.vodafoneWhatsApp || user.phone || "";
    // Sanitize phone number (strip leading + or 00)
    let cleanPhone = rawNum.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("01")) {
      cleanPhone = "2" + cleanPhone; // Egypt country code prefix
    }
    const message = `مرحباً ${user.fullName}، تم مراجعة وتأكيد عملية التحويل الخاصة بك على VigorHub بنجاح! 🎉\n\nلقد تم تفعيل حسابك الآن على باقة *${planName}* (${duration}).\n\nنتمنى لك رحلة رياضية ممتعة وموفقة معنا! 💪🏋️‍♂️`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const isPending = currentUser && currentUser.paymentMethod === PaymentMethod.VodafoneCash && currentUser.status === "pending";
  const isDeclined = currentUser && currentUser.status === "declined";

  // State: Standard Success View
  if (!currentUser || currentUser.status === "approved") {
    return (
      <div className="flex flex-col items-center gap-8 py-6 text-center">
        {/* Animated success badge */}
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Outer glow ring */}
          <div
            className={cn("absolute inset-0 rounded-full animate-ping", isDark ? "bg-emerald-500/20" : "bg-emerald-400/20")}
            style={{ animationDuration: "2.2s" }}
            aria-hidden="true"
          />
          {/* Middle ring */}
          <div
            className={cn(
              "absolute w-28 h-28 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              isDark ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : "bg-emerald-100 ring-1 ring-emerald-400/40"
            )}
            aria-hidden="true"
          />
          {/* Icon container */}
          <div
            className={cn(
              "relative flex items-center justify-center w-24 h-24 rounded-full",
              isDark ? "bg-emerald-950/60 ring-2 ring-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]" : "bg-emerald-50 ring-2 ring-emerald-400/60 shadow-[0_0_24px_rgba(16,185,129,0.15)]"
            )}
          >
            <CheckCircle2
              className="w-12 h-12 text-emerald-400"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <h2 className={cn("text-3xl font-black tracking-tight text-balance", isDark ? "text-slate-50" : "text-slate-900")}>
            {isRtl ? "تم تفعيل حسابك بنجاح! 🎉" : t.successTitle}
          </h2>
          {currentUser && (
            <p className={cn("text-xs font-bold tracking-widest text-emerald-400 uppercase font-mono")}>
              {getPlanLabel(currentUser.plan, currentUser.billingCycle)}
            </p>
          )}
          {username && (
            <p className={cn("text-sm font-mono tracking-widest", isDark ? "text-emerald-400" : "text-emerald-600")}>
              @{username}
            </p>
          )}
          <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
            {isRtl
              ? "مرحباً بك في عالم الرياضة الذكي. حسابك مفعل بالكامل وبأقصى سرعة. تصفح خطط تمارينك الحصرية وتابع سعراتك اليوم."
              : t.successSubtitle}
          </p>
        </div>

        {/* Verification note */}
        <div
          className={cn(
            "flex items-start gap-3 rounded-2xl border px-5 py-4 max-w-sm w-full",
            isRtl ? "flex-row-reverse text-right" : "flex-row text-left",
            isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200"
          )}
          role="note"
        >
          <Mail
            className={cn("w-5 h-5 shrink-0 mt-0.5", isDark ? "text-cyan-400" : "text-cyan-500")}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
            {isRtl ? "تفقد حسابك باستمرار، لقد أرسلنا دليلاً كاملاً للتغذية السليمة إلى بريدك الإلكتروني المسجل لدينا لتستعين به." : t.successNote}
          </p>
        </div>

        {/* CTA button */}
        <ActionButton
          variant="primary"
          theme={theme}
          isRtl={isRtl}
          onClick={onEnterPlatform}
          trailingIcon={isRtl ? undefined : ArrowRight}
          className="px-10 py-4 text-base font-black shadow-lg shadow-emerald-500/25"
        >
          {isRtl ? "دخول لوحة الرياضي" : t.successCta}
        </ActionButton>

        {/* Optional: Show simulation portal link */}
        <button
          type="button"
          onClick={() => setShowAdminPortal(!showAdminPortal)}
          className="text-xs text-slate-500 hover:text-emerald-400 flex items-center gap-1.5 transition-all mt-4 font-bold border border-slate-800 px-3 py-1.5 rounded-xl"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{isRtl ? "لوحة الإدارة التجريبية" : "Demo Admin Dashboard"}</span>
        </button>

        {/* Floating Admin Panel */}
        {showAdminPortal && (
          <AdminPanelSection
            allUsers={allUsers}
            currentUser={currentUser}
            isDark={isDark}
            isRtl={isRtl}
            copiedIndex={copiedIndex}
            setCopiedIndex={setCopiedIndex}
            getPlanLabel={getPlanLabel}
            getWhatsAppLink={getWhatsAppLink}
            handleApproveUser={handleApproveUser}
            handleDeclineUser={handleDeclineUser}
            handleDeleteUser={handleDeleteUser}
            onClose={() => setShowAdminPortal(false)}
          />
        )}
      </div>
    );
  }

  // State: Request Pending Review (Vodafone Cash)
  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center">
        {/* Animated clock / pending badge */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className={cn("absolute inset-0 rounded-full animate-ping bg-amber-500/10")} style={{ animationDuration: "3s" }} />
          <div className={cn(
            "relative flex items-center justify-center w-20 h-20 rounded-full",
            isDark ? "bg-amber-950/60 ring-2 ring-amber-500/40" : "bg-amber-50 ring-2 ring-amber-500/40"
          )}>
            <Clock className="w-10 h-10 text-amber-500 animate-pulse" strokeWidth={2} />
          </div>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2 max-w-sm mx-auto">
          <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-amber-500/15 text-amber-500 rounded-full w-max mx-auto tracking-widest border border-amber-500/20">
            {isRtl ? "طلبك قيد المراجعة حالياً" : "PENDING REVIEW"}
          </span>
          <h2 className={cn("text-2xl font-black tracking-tight", isDark ? "text-slate-50" : "text-slate-900")}>
            {isRtl ? "جاري مراجعة طلب التحويل" : "We are reviewing your transfer"}
          </h2>
          <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
            {isRtl
              ? "يقوم كابتن الدعم الفني بمطابقة رقم التحويل الذي أدخلته بإيصال فودافون كاش ومراجعته. سنقوم بتفعيل حسابك فوراً والتواصل معك عبر الواتساب للتبليغ."
              : "Our administrators are matching the transfer with the receipt. Once confirmed, your account will be fully activated instantly."}
          </p>
        </div>

        {/* Submitted Information Summary */}
        <div className={cn(
          "w-full rounded-2xl border p-5 text-xs text-right space-y-3.5",
          isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
        )}>
          <h3 className={cn("font-extrabold pb-2 border-b border-dashed border-slate-800 text-slate-300 flex items-center gap-1.5 justify-end")}>
            <span>{isRtl ? "تفاصيل عملية التحويل الخاصة بك:" : "Your Submitted Details:"}</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </h3>

          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-slate-300">{currentUser.fullName}</span>
            <span className="text-slate-500">{isRtl ? "الاسم" : "Name"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-emerald-400">{getPlanLabel(currentUser.plan, currentUser.billingCycle)}</span>
            <span className="text-slate-500">{isRtl ? "باقة الاشتراك" : "Plan Package"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-slate-300">{currentUser.vodafoneSenderNumber}</span>
            <span className="text-slate-500">{isRtl ? "الرقم المحول منه" : "Sender Phone"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-slate-300">{currentUser.vodafoneWhatsApp}</span>
            <span className="text-slate-500">{isRtl ? "رقم الواتساب" : "WhatsApp Phone"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-emerald-400">{currentUser.vodafoneAmount} {isRtl ? "ج.م" : "EGP"}</span>
            <span className="text-slate-500">{isRtl ? "المبلغ المحول" : "Amount Paid"}</span>
          </div>

          {/* Screenshot Preview thumbnail */}
          {currentUser.vodafoneScreenshot && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/50">
              <span className="text-slate-500 block">{isRtl ? "صورة إيصال التحويل المرفقة:" : "Attached Receipt Screenshot:"}</span>
              <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900 flex items-center justify-center">
                <img
                  src={currentUser.vodafoneScreenshot}
                  alt="Receipt Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          <ActionButton
            variant="primary"
            theme={theme}
            isRtl={isRtl}
            onClick={handleCheckStatus}
            className="w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 bg-amber-500 text-slate-950 hover:bg-amber-400"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>{isRtl ? "تحديث والتحقق من التفعيل" : "Refresh & Check Status"}</span>
          </ActionButton>

          {/* Test portal warning alert */}
          <div className={cn(
            "rounded-xl border p-3 flex items-center gap-2 text-[10px] leading-relaxed text-slate-400 text-right justify-end bg-slate-900/30 border-slate-800"
          )}>
            <p>
              {isRtl
                ? "لتسهيل تجربة وتقييم النظام بالكامل، يمكنك النقر على بوابة الإدارة التجريبية أدناه وتفعيل الطلب بنفسك لتشاهد دورة العمل كاملة!"
                : "To easily test the flow, open the admin simulation panel below, click approve, then hit Refresh above!"}
            </p>
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          </div>

          <button
            type="button"
            onClick={() => setShowAdminPortal(!showAdminPortal)}
            className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1.5 justify-center transition-all mt-1 font-bold border border-amber-500/20 px-3 py-2 rounded-xl"
          >
            <Settings className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{isRtl ? "افتح لوحة مراجعة التحويلات (لوحة الإدارة)" : "Open Admin Review Portal"}</span>
          </button>
        </div>

        {/* Floating Admin Panel */}
        {showAdminPortal && (
          <AdminPanelSection
            allUsers={allUsers}
            currentUser={currentUser}
            isDark={isDark}
            isRtl={isRtl}
            copiedIndex={copiedIndex}
            setCopiedIndex={setCopiedIndex}
            getPlanLabel={getPlanLabel}
            getWhatsAppLink={getWhatsAppLink}
            handleApproveUser={handleApproveUser}
            handleDeclineUser={handleDeclineUser}
            handleDeleteUser={handleDeleteUser}
            onClose={() => setShowAdminPortal(false)}
          />
        )}
      </div>
    );
  }

  // State: Request Declined
  if (isDeclined) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 ring-2 ring-red-500/30">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-sm mx-auto">
          <h2 className={cn("text-2xl font-black tracking-tight", isDark ? "text-slate-50" : "text-slate-900")}>
            {isRtl ? "تم رفض تأكيد عملية التحويل" : "Transfer Verification Failed"}
          </h2>
          <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
            {isRtl
              ? "لم نتمكن من مطابقة بيانات التحويل التي أدخلتها مع الإيصالات المستلمة لدينا. يرجى التواصل مع الدعم الفني أو إعادة تعبئة وتصحيح تفاصيل التحويل."
              : "We could not match the transfer details with our records. Please verify the sender number and upload a correct screenshot."}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              // Reset status back to pending / allow resubmitting
              if (currentUser) {
                const updated = { ...currentUser, status: "pending" };
                localStorage.setItem("vigorhub_current_user", JSON.stringify(updated));
                setCurrentUser(updated);
              }
            }}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-xs transition-all"
          >
            {isRtl ? "إعادة محاولة المراجعة / تصحيح البيانات" : "Retry/Correct Details"}
          </button>

          <button
            type="button"
            onClick={() => setShowAdminPortal(!showAdminPortal)}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 justify-center transition-all mt-1 font-bold border border-red-500/20 px-3 py-2 rounded-xl"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{isRtl ? "افتح لوحة الإدارة لإصلاح الطلب" : "Open Admin Portal to Approve"}</span>
          </button>
        </div>

        {/* Floating Admin Panel */}
        {showAdminPortal && (
          <AdminPanelSection
            allUsers={allUsers}
            currentUser={currentUser}
            isDark={isDark}
            isRtl={isRtl}
            copiedIndex={copiedIndex}
            setCopiedIndex={setCopiedIndex}
            getPlanLabel={getPlanLabel}
            getWhatsAppLink={getWhatsAppLink}
            handleApproveUser={handleApproveUser}
            handleDeclineUser={handleDeclineUser}
            handleDeleteUser={handleDeleteUser}
            onClose={() => setShowAdminPortal(false)}
          />
        )}
      </div>
    );
  }

  // Fallback
  return null;
}

// ─── Sub-Component: Interactive Admin Portal Section ─────────────────────────
function AdminPanelSection({
  allUsers,
  currentUser,
  isDark,
  isRtl,
  copiedIndex,
  setCopiedIndex,
  getPlanLabel,
  getWhatsAppLink,
  handleApproveUser,
  handleDeclineUser,
  handleDeleteUser,
  onClose,
}: any) {
  return (
    <div className={cn(
      "w-full rounded-3xl border p-5 mt-6 text-right relative overflow-hidden animate-in zoom-in-95 duration-200",
      isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-300"
    )}>
      {/* Glow Header */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-400" />

      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-red-400 hover:underline"
        >
          {isRtl ? "إغلاق اللوحة" : "Close"}
        </button>
        <div className="flex items-center gap-1.5">
          <span className={cn("text-xs font-black", isDark ? "text-slate-100" : "text-slate-800")}>
            {isRtl ? "لوحة الإدارة والمراجعة (محاكاة تجريبية)" : "Admin Verification Panel"}
          </span>
          <Settings className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {allUsers.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-4">
            {isRtl ? "لا توجد حسابات مسجلة حالياً." : "No registered accounts yet."}
          </p>
        ) : (
          <div className="max-h-[360px] overflow-y-auto space-y-4 pr-1">
            {allUsers.map((user: any, index: number) => {
              const waLink = getWhatsAppLink(user);
              return (
                <div
                  key={user.id}
                  className={cn(
                    "p-4 rounded-2xl border flex flex-col gap-3 text-xs",
                    currentUser && currentUser.id === user.id
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-100 border-slate-200"
                  )}
                >
                  {/* User meta info */}
                  <div className="flex items-start justify-between gap-2">
                    {/* Status badge */}
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase",
                      user.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : user.status === "declined" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {user.status === "approved" ? (isRtl ? "مقبول ومفعّل" : "Approved") : user.status === "declined" ? (isRtl ? "مرفوض" : "Declined") : (isRtl ? "قيد المراجعة" : "Pending")}
                    </span>

                    <div className="text-right">
                      <p className={cn("font-bold", isDark ? "text-slate-200" : "text-slate-800")}>
                        {user.fullName} (@{user.username})
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {isRtl ? "مسجل بتاريخ" : "Registered"}: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Payment details to verify */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-900/40 text-[10px] text-right">
                    <div>
                      <span className="text-slate-500 block">{isRtl ? "الباقة المطلوبة" : "Requested Plan"}</span>
                      <span className="font-bold text-emerald-400">{getPlanLabel(user.plan, user.billingCycle)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{isRtl ? "رقم المحوّل" : "Sender Phone"}</span>
                      <span className="font-bold text-slate-200">{user.vodafoneSenderNumber || "-"}</span>
                    </div>
                    <div className="mt-1.5">
                      <span className="text-slate-500 block">{isRtl ? "رقم الواتساب" : "WhatsApp"}</span>
                      <span className="font-bold text-slate-200">{user.vodafoneWhatsApp || user.phone || "-"}</span>
                    </div>
                    <div className="mt-1.5">
                      <span className="text-slate-500 block">{isRtl ? "المبلغ المستلم" : "Amount Paid"}</span>
                      <span className="font-bold text-emerald-400">{user.vodafoneAmount || user.priceEGP || "-"} {isRtl ? "ج.م" : "EGP"}</span>
                    </div>
                  </div>

                  {/* Screenshot Thumbnail trigger / view */}
                  {user.vodafoneScreenshot && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-slate-500 font-bold block">{isRtl ? "صورة التحويل المرفقة للتحقق:" : "Attached Screenshot:"}</span>
                      <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900 flex items-center justify-center">
                        <img
                          src={user.vodafoneScreenshot}
                          alt="Receipt Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions for admin */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                    {user.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1 transition-all"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{isRtl ? "موافقة وتنشيط" : "Approve & Activate"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineUser(user.id)}
                          className="bg-red-950/40 border border-red-500/20 hover:bg-red-900/20 text-red-400 px-3 py-1.5 rounded-lg font-bold transition-all"
                        >
                          {isRtl ? "رفض الطلب" : "Decline"}
                        </button>
                      </>
                    )}

                    {user.status === "approved" && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 transition-all text-center"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isRtl ? "أرسل رسالة تفعيل واتساب" : "Send WhatsApp Notification"}</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg border border-transparent hover:border-red-500/20 transition-all mr-auto"
                      title={isRtl ? "حذف الحساب تماماً" : "Delete User"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
