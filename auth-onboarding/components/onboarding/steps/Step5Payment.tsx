"use client";

import React, { useState, useEffect } from "react";
import { Check, Smartphone, CreditCard, Sparkles, Crown, Layers, Copy, Upload, AlertCircle, Info, Landmark, HelpCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField, inputClasses } from "../primitives/FormField";
import { ActionButton } from "../primitives/ActionButton";
import { PlanTier, PaymentMethod, type Theme, type Step5Payload, type FieldError } from "../types";
import type { TranslationDict } from "../translations";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface Step5Props {
  data: Step5Payload;
  onChange: (data: Step5Payload) => void;
  onSubmit: () => void;
  onBack: () => void;
  theme: Theme;
  isRtl: boolean;
  t: TranslationDict;
  isLoading?: boolean;
}

const PLAN_DETAILS = {
  [PlanTier.Basic]: {
    nameEn: "Standard Plan",
    nameAr: "الباقة الأساسية (Standard)",
    icon: Layers,
    popular: false,
    price: {
      month: 99,
      "3months": 249,
      year: 699,
    },
    featuresAr: [
      "عمل 2 Splits مخصصة وتعديلها",
      "اختيار وتصفح كافة التمارين الرياضية",
      "الوصول لمؤشرات وإحصائيات تقدمك",
      "حساب السعرات الحرارية والوجبات اليومية",
      "وصول محدود للمجتمع (تفاعل وتعليق فقط)",
      "لا يمكن تنزيل منشورات أو بوستات خاصة بك",
      "لا يوجد وصول لمساعد الذكاء الاصطناعي الخاص بالتمارين والتغذية",
      "الانضمام للدوريات والبطولات (ولكن لا يمكن إنشاء دوري)"
    ],
    featuresEn: [
      "Create and edit up to 2 custom splits",
      "Select and browse all exercises",
      "Access to metrics and progress analytics",
      "Daily calorie tracking & meal logging",
      "Limited community access (interact and comment only)",
      "Cannot publish your own community posts",
      "No AI Assistant for workout or diet plans",
      "Join leagues and tournaments (cannot create leagues)"
    ],
  },
  [PlanTier.Pro]: {
    nameEn: "Pro Plan",
    nameAr: "الباقة المتقدمة (Pro)",
    icon: Sparkles,
    popular: true,
    price: {
      month: 199,
      "3months": 499,
      year: 1399,
    },
    featuresAr: [
      "إنشاء عدد غير محدود من الـ Splits المخصصة",
      "الوصول للذكاء الاصطناعي الخاص بنظام التمرين والغذائي (بشكل محدود)",
      "وصول كامل للمجتمع (تفاعل ونشر بوستات خاصة بك)",
      "إمكانية إنشاء دوريات ومسابقات مخصصة ودعوة اللاعبين"
    ],
    featuresEn: [
      "Create unlimited custom Splits",
      "Access to workout & nutrition AI Assistant (limited usage)",
      "Full community access (post, share & interact)",
      "Create custom leagues & invite other players"
    ],
  },
  [PlanTier.Ultimate]: {
    nameEn: "VIP Plan",
    nameAr: "باقة النخبة (VIP)",
    icon: Crown,
    popular: false,
    price: {
      month: 399,
      "3months": 999,
      year: 2799,
    },
    featuresAr: [
      "وصول غير محدود وذكي للذكاء الاصطناعي طوال اليوم",
      "الوصول الكامل والحصري لكتاب الوصفات الغذائية والوجبات الصحية",
      "إنشاء عدد غير محدود من الدوريات والمسابقات",
      "أولوية قصوى ودعم فني مخصص لحل كافة استفساراتك",
      "إمكانية تصدير خطتك وجدول تمارينك كملف PDF بلمسة واحدة"
    ],
    featuresEn: [
      "Unlimited 24/7 access to advanced AI fitness advisor",
      "Full exclusive access to our premium cookbook and recipes",
      "Create unlimited leagues and tournaments",
      "Highest priority VIP technical support",
      "Export your workout plans and schedules as polished PDFs"
    ],
  }
};

export function Step5Payment({
  data,
  onChange,
  onSubmit,
  onBack,
  theme,
  isRtl,
  t,
  isLoading = false,
}: Step5Props) {
  const isDark = theme === "dark";
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [copied, setCopied] = useState(false);
  const [isEgypt, setIsEgypt] = useState(true); // Default to Egypt prices
  const [paypalSimulating, setPaypalSimulating] = useState(false);
  const [paypalSuccess, setPaypalSuccess] = useState(false);

  // Auto-detect country via IP API on mount
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_code === "EG" || data.country === "Egypt") {
          setIsEgypt(true);
        } else {
          // If not in Egypt, they can still toggle but default to Egypt for easy testing
          setIsEgypt(true);
        }
      })
      .catch(() => {
        // Fallback to Egypt
        setIsEgypt(true);
      });
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText("01555834442");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Handle Drag & Drop / manual screenshot file selection
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function processFile(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({
        ...data,
        vodafoneScreenshot: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }

  function validateForm(): FieldError[] {
    const errs: FieldError[] = [];
    if (!data.selectedPlan) {
      errs.push({ field: "selectedPlan", message: isRtl ? "برجاء اختيار باقة للاشتراك." : "Please select a subscription plan." });
    }
    if (!data.paymentMethod) {
      errs.push({ field: "paymentMethod", message: isRtl ? "برجاء اختيار طريقة الدفع." : "Please select a payment method." });
    } else if (data.paymentMethod === PaymentMethod.VodafoneCash) {
      if (!/^01[0125][0-9]{8}$/.test(data.vodafoneSenderNumber.trim())) {
        errs.push({ field: "vodafoneSenderNumber", message: isRtl ? "أدخل رقم فودافون كاش مصري صحيح مكون من 11 رقم." : "Enter a valid 11-digit Vodafone Cash number." });
      }
      if (!data.vodafoneWhatsApp.trim()) {
        errs.push({ field: "vodafoneWhatsApp", message: isRtl ? "برجاء إدخال رقم تواصل واتساب." : "WhatsApp number is required." });
      }
      if (!data.vodafoneAmount.trim() || isNaN(parseFloat(data.vodafoneAmount)) || parseFloat(data.vodafoneAmount) <= 0) {
        errs.push({ field: "vodafoneAmount", message: isRtl ? "برجاء إدخال قيمة المبلغ المحول بشكل صحيح." : "Enter a valid amount transferred." });
      }
      if (!data.vodafoneScreenshot) {
        errs.push({ field: "vodafoneScreenshot", message: isRtl ? "برجاء رفع صورة إيصال التحويل لتأكيد العملية." : "Please upload transfer receipt screenshot." });
      }
    }
    return errs;
  }

  function handleSubmit() {
    const formErrors = validateForm();
    setErrors(formErrors);
    if (formErrors.length === 0) {
      // Save payment details to localStorage for admin review
      const pendingUser = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: localStorage.getItem("vh_temp_fullName") || "رياضي جديد",
        username: localStorage.getItem("vh_temp_username") || "user",
        email: localStorage.getItem("vh_temp_email") || "",
        phone: localStorage.getItem("vh_temp_phone") || "",
        password: localStorage.getItem("vh_temp_password") || "",
        gender: localStorage.getItem("vh_temp_gender") || "Male",
        age: parseInt(localStorage.getItem("vh_temp_age") || "24"),
        height: parseFloat(localStorage.getItem("vh_temp_height") || "175"),
        weight: parseFloat(localStorage.getItem("vh_temp_weight") || "70"),
        goal: localStorage.getItem("vh_temp_goal") || "MuscleGain",
        plan: data.selectedPlan,
        billingCycle: data.billingCycle,
        paymentMethod: data.paymentMethod,
        priceEGP: getSelectedPrice(),
        status: data.paymentMethod === PaymentMethod.VodafoneCash ? "pending" : "approved",
        vodafoneSenderNumber: data.vodafoneSenderNumber,
        vodafoneWhatsApp: data.vodafoneWhatsApp,
        vodafoneAmount: data.vodafoneAmount,
        vodafoneScreenshot: data.vodafoneScreenshot,
        createdAt: new Date().toISOString(),
      };

      // Store in list of registered users
      const currentUsers = JSON.parse(localStorage.getItem("vigorhub_users") || "[]");
      currentUsers.push(pendingUser);
      localStorage.setItem("vigorhub_users", JSON.stringify(currentUsers));

      // Save current active session
      localStorage.setItem("vigorhub_current_user", JSON.stringify(pendingUser));

      onSubmit();
    }
  }

  // Simulate PayPal Checkout flow
  function startPaypalSimulation() {
    if (!data.selectedPlan) {
      setErrors([{ field: "selectedPlan", message: isRtl ? "اختر الباقة أولاً قبل الدفع بباي بال" : "Select a plan first before paying with PayPal" }]);
      return;
    }
    setPaypalSimulating(true);
    setPaypalSuccess(false);

    // Simulate standard 2-second payment processing popup
    setTimeout(() => {
      setPaypalSimulating(false);
      setPaypalSuccess(true);
      // Automatically select PayPal payment method and fill mock approval
      onChange({
        ...data,
        paymentMethod: PaymentMethod.PayPal,
      });
    }, 2200);
  }

  function getError(field: string) {
    return errors.find((e) => e.field === field)?.message;
  }

  const selectedTier = data.selectedPlan;
  const currentPlanInfo = selectedTier ? PLAN_DETAILS[selectedTier] : null;

  // Auto-fill amount when plan/cycle changes
  useEffect(() => {
    if (selectedTier && data.paymentMethod === PaymentMethod.VodafoneCash) {
      const priceVal = PLAN_DETAILS[selectedTier].price[data.billingCycle];
      onChange({
        ...data,
        vodafoneAmount: priceVal.toString(),
      });
    }
  }, [selectedTier, data.billingCycle, data.paymentMethod]);

  function getSelectedPrice() {
    if (!selectedTier) return 0;
    return PLAN_DETAILS[selectedTier].price[data.billingCycle];
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Country/Currency Manual Toggle Alert */}
      <div className={cn(
        "rounded-2xl border p-4 flex items-center justify-between gap-3 text-xs",
        isDark ? "bg-slate-800/40 border-slate-700/50 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
      )}>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isRtl
              ? `تم رصد موقعك تلقائياً: مصر (العملة: ج.م)`
              : `Location detected: Egypt (Currency: EGP)`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsEgypt(!isEgypt)}
          className="font-bold text-emerald-400 hover:underline transition-all"
        >
          {isRtl ? "تغيير البلد" : "Change Country"}
        </button>
      </div>

      {/* Step header */}
      <div className={cn("flex flex-col gap-1", isRtl ? "text-right" : "text-left")}>
        <h2 className={cn("text-2xl font-bold tracking-tight", isDark ? "text-slate-50" : "text-slate-900")}>
          {isRtl ? "اختر باقتك وبدء تفعيل حسابك" : "Select Your Plan & Activate"}
        </h2>
        <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
          {isRtl
            ? "بوابات دفع آمنة وسهلة لبدء تمرينك وتغذيتك معنا فوراً!"
            : "Secure and instant checkouts to unlock your ultimate fitness regime!"}
        </p>
      </div>

      {/* Billing Cycle Tabs */}
      <div className={cn(
        "p-1.5 rounded-2xl flex gap-1 border",
        isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
      )}>
        {(["month", "3months", "year"] as const).map((cycle) => {
          const isActive = data.billingCycle === cycle;
          let label = "";
          if (cycle === "month") label = isRtl ? "شهري" : "Monthly";
          if (cycle === "3months") label = isRtl ? "3 شهور (توفير)" : "3 Months (Save)";
          if (cycle === "year") label = isRtl ? "سنوي (أكبر توفير)" : "Yearly (Best Value)";

          return (
            <button
              key={cycle}
              type="button"
              onClick={() => onChange({ ...data, billingCycle: cycle })}
              className={cn(
                "flex-1 text-center py-2.5 rounded-xl font-bold text-xs transition-all duration-200",
                isActive
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Plan Cards */}
      <div className="flex flex-col gap-4">
        {(Object.keys(PLAN_DETAILS) as PlanTier[]).map((tier) => {
          const plan = PLAN_DETAILS[tier];
          const isSelected = data.selectedPlan === tier;
          const price = plan.price[data.billingCycle];
          const IconComponent = plan.icon;

          return (
            <div
              key={tier}
              onClick={() => onChange({ ...data, selectedPlan: tier })}
              className={cn(
                "relative rounded-2xl border p-5 transition-all duration-300 cursor-pointer overflow-hidden",
                isDark ? "bg-slate-900/50 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300",
                isSelected && (isDark ? "border-emerald-500/80 bg-emerald-950/20 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5" : "border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500/20")
              )}
            >
              {plan.popular && (
                <div className={cn(
                  "absolute top-0 text-[9px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider uppercase bg-emerald-500 text-white",
                  isRtl ? "left-0 rounded-br-xl rounded-bl-none" : "right-0 rounded-bl-xl rounded-br-none"
                )}>
                  {isRtl ? "الأكثر مبيعاً" : "BEST SELLER"}
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex items-center justify-center shrink-0 w-12 h-12 rounded-xl transition-all",
                  isSelected
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : isDark
                    ? "bg-slate-800 text-slate-400"
                    : "bg-slate-100 text-slate-500"
                )}>
                  <IconComponent className="w-6 h-6" strokeWidth={1.8} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <h3 className={cn(
                      "font-black text-base",
                      isDark ? "text-slate-100" : "text-slate-800"
                    )}>
                      {isRtl ? plan.nameAr : plan.nameEn}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-black text-xl text-emerald-400">
                        {price}
                      </span>
                      <span className={cn("text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>
                        {isEgypt ? (isRtl ? "ج.م" : "EGP") : "$"} / {data.billingCycle === "month" ? (isRtl ? "شهر" : "mo") : data.billingCycle === "3months" ? (isRtl ? "3 شهور" : "3mo") : (isRtl ? "سنة" : "yr")}
                      </span>
                    </div>
                  </div>

                  {/* Bullet Features (Sleek collapse or nice visual dots) */}
                  <div className="mt-4 space-y-2 border-t pt-3 border-dashed border-slate-700/50">
                    {(isRtl ? plan.featuresAr : plan.featuresEn).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={3} />
                        <span className={cn(
                          "leading-relaxed",
                          isDark ? "text-slate-300" : "text-slate-600"
                        )}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {getError("selectedPlan") && (
        <p className={cn("text-xs font-semibold text-red-400 -mt-2", isRtl ? "text-right" : "text-left")}>
          {getError("selectedPlan")}
        </p>
      )}

      {/* Payment methods container */}
      <div className="flex flex-col gap-4 border-t pt-6 border-slate-800/50">
        <h3 className={cn("text-sm font-bold tracking-wider uppercase", isDark ? "text-slate-400" : "text-slate-500")}>
          {isRtl ? "اختر وسيلة الدفع لتنشيط حسابك" : "Select Your Payment Method"}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Vodafone Cash */}
          <button
            type="button"
            onClick={() => onChange({ ...data, paymentMethod: PaymentMethod.VodafoneCash })}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-2xl border p-5 transition-all duration-300 text-center relative",
              isDark ? "bg-slate-900/50 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300",
              data.paymentMethod === PaymentMethod.VodafoneCash && (isDark ? "border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/25" : "border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500/25")
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              data.paymentMethod === PaymentMethod.VodafoneCash
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
            )}>
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className={cn("block font-black text-sm", isDark ? "text-slate-100" : "text-slate-800")}>
                {isRtl ? "فودافون كاش" : "Vodafone Cash"}
              </span>
              <span className="block text-[10px] text-emerald-400 font-bold mt-1">
                {isRtl ? "تفعيل فوري للمصريين" : "Instant Activation"}
              </span>
            </div>
          </button>

          {/* PayPal */}
          <button
            type="button"
            onClick={() => {
              // Highlight that PayPal can be simulated easily
              onChange({ ...data, paymentMethod: PaymentMethod.PayPal });
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-2xl border p-5 transition-all duration-300 text-center relative overflow-hidden",
              isDark ? "bg-slate-900/50 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300",
              data.paymentMethod === PaymentMethod.PayPal && (isDark ? "border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/25" : "border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500/25")
            )}
          >
            {/* Tag saying Coming Soon / Simulates */}
            <div className={cn(
              "absolute top-0 text-[8px] font-black tracking-widest px-2.5 py-0.5 uppercase",
              isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"
            )}>
              {isRtl ? "تفعيل لاحقاً" : "MOCK/TEST"}
            </div>

            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              data.paymentMethod === PaymentMethod.PayPal
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
            )}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className={cn("block font-black text-sm", isDark ? "text-slate-100" : "text-slate-800")}>
                {isRtl ? "باي بال" : "PayPal"}
              </span>
              <span className="block text-[10px] text-slate-400 font-semibold mt-1">
                {isRtl ? "تجريبي / بطاقة بنك" : "Simulated Checkout"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Vodafone Cash Interactive Form */}
      {data.paymentMethod === PaymentMethod.VodafoneCash && (
        <div className={cn(
          "rounded-3xl border p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 duration-300",
          isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
        )}>
          {/* Transfer Alert Instructions */}
          <div className={cn(
            "rounded-2xl border p-4 flex flex-col gap-3",
            isDark ? "bg-emerald-950/10 border-emerald-500/20" : "bg-emerald-50/50 border-emerald-200"
          )}>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <h4 className={cn("text-xs font-bold", isDark ? "text-slate-200" : "text-slate-800")}>
                {isRtl ? "تعليمات إرسال التحويل" : "Transfer Instructions"}
              </h4>
            </div>
            <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
              {isRtl
                ? `برجاء تحويل مبلغ ${getSelectedPrice()} ج.م بالكامل إلى رقم فودافون كاش التالي، ثم قم بملئ فورم التأكيد في الأسفل مع إرفاق صورة إيصال التحويل للتفعيل الفوري لحسابك.`
                : `Please transfer exactly ${getSelectedPrice()} EGP to the following Vodafone Cash number and complete the form below with the receipt screenshot.`}
            </p>

            {/* Target Transfer Number Box */}
            <div className={cn(
              "flex items-center justify-between gap-3 p-3 rounded-xl border border-dashed text-sm",
              isDark ? "bg-slate-900/50 border-slate-700/60" : "bg-white border-slate-300"
            )}>
              <span className="font-mono font-bold tracking-wider text-emerald-400 text-base">
                01555834442
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all",
                  copied
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                    : isDark
                    ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                    : "border-slate-200 hover:bg-slate-100 text-slate-700"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isRtl ? "تم النسخ" : "Copied"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isRtl ? "نسخ الرقم" : "Copy"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sender Number */}
            <FormField
              id="vodafoneSenderNumber"
              label={isRtl ? "الرقم المحول منه (فودافون كاش)" : "Sender Phone Number"}
              error={getError("vodafoneSenderNumber")}
              theme={theme}
              isRtl={isRtl}
            >
              <input
                id="vodafoneSenderNumber"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={data.vodafoneSenderNumber}
                onChange={(e) => onChange({ ...data, vodafoneSenderNumber: e.target.value.replace(/[^0-9]/g, "") })}
                placeholder={isRtl ? "01XXXXXXXXX" : "e.g. 01012345678"}
                className={cn(inputClasses(theme, !!getError("vodafoneSenderNumber")), "font-mono tracking-widest text-center")}
                dir="ltr"
              />
            </FormField>

            {/* WhatsApp Contact */}
            <FormField
              id="vodafoneWhatsApp"
              label={isRtl ? "رقم تواصل واتساب" : "WhatsApp Contact Number"}
              error={getError("vodafoneWhatsApp")}
              theme={theme}
              isRtl={isRtl}
            >
              <input
                id="vodafoneWhatsApp"
                type="tel"
                value={data.vodafoneWhatsApp}
                onChange={(e) => onChange({ ...data, vodafoneWhatsApp: e.target.value })}
                placeholder={isRtl ? "مثال: +201555834442" : "e.g. +201555834442"}
                className={inputClasses(theme, !!getError("vodafoneWhatsApp"))}
              />
            </FormField>
          </div>

          {/* Amount Transferred */}
          <FormField
            id="vodafoneAmount"
            label={isRtl ? "المبلغ الذي تم تحويله بالـ ج.م" : "Amount Transferred (EGP)"}
            error={getError("vodafoneAmount")}
            theme={theme}
            isRtl={isRtl}
          >
            <input
              id="vodafoneAmount"
              type="text"
              inputMode="numeric"
              value={data.vodafoneAmount}
              onChange={(e) => onChange({ ...data, vodafoneAmount: e.target.value })}
              placeholder={isRtl ? "المبلغ المحول" : "Amount in EGP"}
              className={inputClasses(theme, !!getError("vodafoneAmount"))}
            />
          </FormField>

          {/* Receipt Screenshot Upload (Drag & Drop + Input File) */}
          <FormField
            id="vodafoneScreenshot"
            label={isRtl ? "صورة إيصال التحويل (لقطة شاشة)" : "Receipt Screenshot"}
            error={getError("vodafoneScreenshot")}
            theme={theme}
            isRtl={isRtl}
          >
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 transition-all duration-200 text-center cursor-pointer relative flex flex-col items-center justify-center gap-3 min-h-[140px]",
                isDark
                  ? "border-slate-800 hover:border-emerald-500/50 bg-slate-900/30"
                  : "border-slate-300 hover:border-emerald-500 bg-white",
                data.vodafoneScreenshot && "border-emerald-500/60 bg-emerald-500/5",
                getError("vodafoneScreenshot") && "border-red-500/50"
              )}
            >
              {data.vodafoneScreenshot ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-500/40 relative">
                    <img
                      src={data.vodafoneScreenshot}
                      alt="Receipt preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-extrabold">
                    {isRtl ? "تم تحميل إيصال التحويل بنجاح! ✓" : "Receipt uploaded successfully! ✓"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange({ ...data, vodafoneScreenshot: "" });
                    }}
                    className="text-[10px] text-red-400 hover:underline mt-1 font-bold"
                  >
                    {isRtl ? "إزالة الإيصال والرفع من جديد" : "Remove & re-upload"}
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-500" />
                  <div>
                    <span className={cn("block font-bold text-xs", isDark ? "text-slate-300" : "text-slate-700")}>
                      {isRtl ? "اسحب وأفلت صورة التحويل هنا" : "Drag & drop screenshot here"}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">
                      {isRtl ? "أو اضغط للتصفح من جهازك" : "or click to browse"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </FormField>
        </div>
      )}

      {/* PayPal Live / Sandbox Flow Form */}
      {data.paymentMethod === PaymentMethod.PayPal && (
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "Abbo_9yQS5bJRExYO4Wxq6-A1CTeU-smkV2oLMSdvQIgAJ9pK9A5iaQbAdvk77hP5lj1MvNmNK_LtKqY",
            currency: "USD",
            intent: "capture",
          }}
        >
          <div className={cn(
            "rounded-3xl border p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 duration-300",
            isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
          )}>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h4 className={cn("text-sm font-bold", isDark ? "text-slate-200" : "text-slate-800")}>
                {isRtl ? "بوابة الدفع الآمنة PayPal" : "Secure PayPal Checkout"}
              </h4>
            </div>

            <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
              {isRtl
                ? "الدفع آمن ومؤمن بالكامل. بمجرد إتمام الدفع، سيتم تنشيط حسابك الرياضي فوراً والوصول للوحة التحكم الكاملة. (يتم تحويل قيمة الباقة تلقائياً إلى الدولار بسعر عادل لتجنب قيود العملة لباي بال)"
                : "Your payment is fully secured. Once the payment is complete, your athlete account will be instantly activated. (EGP is automatically converted to USD on our secure servers to support PayPal processing)"}
            </p>

            {getError("paypal") && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                {getError("paypal")}
              </div>
            )}

            {paypalSuccess ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold justify-center">
                <Check className="w-4 h-4" />
                <span>
                  {isRtl ? "تم تأكيد الدفع والاشتراك بنجاح! جاري توجيهك..." : "Payment completed successfully! Redirecting..."}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Real PayPal Buttons Integration */}
                <div className="relative z-10">
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      color: "gold",
                      shape: "rect",
                      label: "pay",
                    }}
                    createOrder={async () => {
                      try {
                        const res = await fetch("/api/paypal/create-order", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            amount: getSelectedPrice().toString(),
                            currency: "EGP",
                            planId: data.selectedPlan,
                            billingCycle: data.billingCycle,
                          }),
                        });
                        const orderData = await res.json();
                        if (orderData.orderId) {
                          return orderData.orderId;
                        } else {
                          throw new Error(orderData.error || "Failed to create PayPal Order");
                        }
                      } catch (err: any) {
                        console.error("[PayPal Client Error]", err);
                        setErrors([{ field: "paypal", message: err.message || "Could not start PayPal transaction." }]);
                        throw err;
                      }
                    }}
                    onApprove={async (btnData) => {
                      try {
                        setPaypalSimulating(true);
                        const res = await fetch("/api/paypal/capture-order", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            orderId: btnData.orderID,
                          }),
                        });
                        const captureData = await res.json();
                        if (captureData.success) {
                          setPaypalSuccess(true);
                          onChange({
                            ...data,
                            paymentMethod: PaymentMethod.PayPal,
                          });

                          // Create active athlete user
                          const registeredUser = {
                            id: "user_" + Math.random().toString(36).substr(2, 9),
                            fullName: localStorage.getItem("vh_temp_fullName") || "رياضي جديد",
                            username: localStorage.getItem("vh_temp_username") || "user",
                            email: localStorage.getItem("vh_temp_email") || "",
                            phone: localStorage.getItem("vh_temp_phone") || "",
                            password: localStorage.getItem("vh_temp_password") || "",
                            gender: localStorage.getItem("vh_temp_gender") || "Male",
                            age: parseInt(localStorage.getItem("vh_temp_age") || "24"),
                            height: parseFloat(localStorage.getItem("vh_temp_height") || "175"),
                            weight: parseFloat(localStorage.getItem("vh_temp_weight") || "70"),
                            goal: localStorage.getItem("vh_temp_goal") || "MuscleGain",
                            plan: data.selectedPlan,
                            billingCycle: data.billingCycle,
                            paymentMethod: PaymentMethod.PayPal,
                            priceEGP: getSelectedPrice(),
                            status: "approved",
                            createdAt: new Date().toISOString(),
                          };

                          const currentUsers = JSON.parse(localStorage.getItem("vigorhub_users") || "[]");
                          const filtered = currentUsers.filter((u: any) => u.username !== registeredUser.username);
                          filtered.push(registeredUser);
                          localStorage.setItem("vigorhub_users", JSON.stringify(filtered));
                          localStorage.setItem("vigorhub_current_user", JSON.stringify(registeredUser));

                          onSubmit();
                        } else {
                          throw new Error(captureData.message || "Failed to capture PayPal transaction.");
                        }
                      } catch (err: any) {
                        console.error("[PayPal Capture Error]", err);
                        setErrors([{ field: "paypal", message: err.message || "Error finalizing your payment." }]);
                      } finally {
                        setPaypalSimulating(false);
                      }
                    }}
                    onError={(err) => {
                      console.error("[PayPal SDK Error]", err);
                      setErrors([{ field: "paypal", message: isRtl ? "حدث خطأ أثناء تشغيل نافذة PayPal. يرجى مراجعة بياناتك." : "An error occurred with PayPal SDK. Please verify details." }]);
                    }}
                  />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className={cn("flex-1 h-px", isDark ? "bg-slate-800" : "bg-slate-200")} />
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
                    {isRtl ? "أو للتجربة الفورية" : "OR FOR TESTING"}
                  </span>
                  <div className={cn("flex-1 h-px", isDark ? "bg-slate-800" : "bg-slate-200")} />
                </div>

                {/* Simulation button */}
                <button
                  type="button"
                  disabled={paypalSimulating}
                  onClick={startPaypalSimulation}
                  className={cn(
                    "w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs font-bold border border-dashed",
                    isDark
                      ? "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isRtl ? "تفعيل تجريبي فوري وسريع (تخطي الدفع)" : "Instant Demo Bypass (Skip Payment)"}</span>
                </button>
              </div>
            )}
          </div>
        </PayPalScriptProvider>
      )}

      {/* Navigation Buttons */}
      <div className={cn("flex gap-4 mt-4", isRtl ? "flex-row-reverse" : "flex-row")}>
        <ActionButton
          variant="secondary"
          theme={theme}
          isRtl={isRtl}
          onClick={onBack}
          className="flex-1"
          disabled={isLoading || paypalSimulating}
        >
          {t.back}
        </ActionButton>
        <ActionButton
          variant="primary"
          theme={theme}
          isRtl={isRtl}
          onClick={handleSubmit}
          className="flex-[2]"
          isLoading={isLoading || paypalSimulating}
          loadingText={isRtl ? "جاري الإرسال للتأكيد..." : "Submitting for review..."}
        >
          {isRtl ? "إرسال وتأكيد الطلب" : "Submit Request"}
        </ActionButton>
      </div>
    </div>
  );
}
