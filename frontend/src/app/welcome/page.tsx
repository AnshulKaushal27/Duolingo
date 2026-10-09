"use client";

import React, { useState, useEffect, Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnboarding } from "@/lib/onboarding-context";
import { playClickSound } from "@/lib/sound";
import DuoWelcomeMascot from "@/components/welcome/DuoWelcomeMascot";
import DuoClipboardMascot from "@/components/welcome/DuoClipboardMascot";
import TypewriterBubble from "@/components/welcome/TypewriterBubble";
import OnboardingOptionCard from "@/components/welcome/OnboardingOptionCard";
import OnboardingHeaderBar from "@/components/welcome/OnboardingHeaderBar";

// Step Keys
type WelcomeStep =
  | "intro"
  | "hdyhau"
  | "learningReason"
  | "proficiency"
  | "courseOverview"
  | "dailyGoal"
  | "choosePath";

const STEP_ORDER: WelcomeStep[] = [
  "intro",
  "hdyhau",
  "learningReason",
  "proficiency",
  "courseOverview",
  "dailyGoal",
  "choosePath",
];

const STEP_PROGRESS: Record<WelcomeStep, number> = {
  intro: 0,
  hdyhau: 15,
  learningReason: 30,
  proficiency: 45,
  courseOverview: 60,
  dailyGoal: 75,
  choosePath: 90,
};

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const {
    state,
    setReferralSource,
    setMotivation,
    setProficiencyLevel,
    setDailyGoalXp,
    setStartChoice,
  } = useOnboarding();

  const stepParam = (searchParams.get("welcomeStep") as WelcomeStep) || "intro";
  const currentStep: WelcomeStep = STEP_ORDER.includes(stepParam) ? stepParam : "intro";

  const languageName = state.targetLanguageName || "Spanish";

  // Selections state
  const [selectedHdyhau, setSelectedHdyhau] = useState<string>(state.referralSource || "");
  const [selectedReason, setSelectedReason] = useState<string>(state.motivation || "");
  const [selectedProficiency, setSelectedProficiency] = useState<number>(state.proficiencyLevel || 1);
  const [selectedGoal, setSelectedGoal] = useState<number>(state.dailyGoalXp || 20);
  const [selectedPath, setSelectedPath] = useState<"scratch" | "placement">(state.startChoice || "scratch");

  // Determine if Continue should be enabled
  const isContinueEnabled = (() => {
    switch (currentStep) {
      case "intro":
        return true;
      case "hdyhau":
        return Boolean(selectedHdyhau);
      case "learningReason":
        return Boolean(selectedReason);
      case "proficiency":
        return Boolean(selectedProficiency);
      case "courseOverview":
        return true;
      case "dailyGoal":
        return Boolean(selectedGoal);
      case "choosePath":
        return Boolean(selectedPath);
      default:
        return true;
    }
  })();

  const goToStep = (step: WelcomeStep) => {
    startTransition(() => {
      if (step === "intro") {
        router.push("/welcome");
      } else {
        router.push(`/welcome?welcomeStep=${step}`);
      }
    });
  };

  const handleBack = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      goToStep(STEP_ORDER[currentIndex - 1]);
    } else {
      router.push("/onboarding/language");
    }
  };

  const handleContinue = () => {
    if (!isContinueEnabled) return;
    playClickSound();

    switch (currentStep) {
      case "intro":
        goToStep("hdyhau");
        break;

      case "hdyhau":
        setReferralSource(selectedHdyhau);
        goToStep("learningReason");
        break;

      case "learningReason":
        setMotivation(selectedReason);
        goToStep("proficiency");
        break;

      case "proficiency":
        setProficiencyLevel(selectedProficiency);
        goToStep("courseOverview");
        break;

      case "courseOverview":
        goToStep("dailyGoal");
        break;

      case "dailyGoal":
        setDailyGoalXp(selectedGoal);
        goToStep("choosePath");
        break;

      case "choosePath":
        setStartChoice(selectedPath);
        if (selectedPath === "scratch") {
          router.push("/lesson/1");
        } else {
          router.push("/onboarding/placement");
        }
        break;
    }
  };

  // Keyboard navigation: Enter triggers CONTINUE
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isContinueEnabled) {
        e.preventDefault();
        handleContinue();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, isContinueEnabled, selectedHdyhau, selectedReason, selectedProficiency, selectedGoal, selectedPath]);

  return (
    <div
      style={{
        backgroundColor: "rgb(19, 31, 36)",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        fontFamily: 'var(--duo-font, "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: "none",
      }}
    >
      {/* Top Progress Header (shown on all question steps after intro) */}
      {currentStep !== "intro" && (
        <OnboardingHeaderBar
          progressPercent={STEP_PROGRESS[currentStep]}
          onBack={handleBack}
        />
      )}

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          maxWidth: currentStep === "intro" ? "680px" : "600px",
          width: "100%",
          margin: "0 auto",
          padding: "20px 24px 110px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: currentStep === "intro" ? "center" : "flex-start",
        }}
      >
        {/* ===================================================================
            STEP 0: INTRO ("Hi there! I'm Duo!")
            =================================================================== */}
        {currentStep === "intro" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeIn 0.3s ease",
            }}
          >
            {/* Speech Bubble */}
            <div
              style={{
                position: "relative",
                marginBottom: "24px",
                animation: "duoBubbleFloat 3s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  backgroundColor: "#202f36",
                  border: "2px solid #37464f",
                  borderRadius: "16px",
                  padding: "14px 26px",
                  fontSize: "19px",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.2px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                  position: "relative",
                  whiteSpace: "nowrap",
                }}
              >
                Hi there! I&apos;m Duo!

                <div
                  style={{
                    position: "absolute",
                    bottom: "-11px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: "10px solid #37464f",
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderTop: "8px solid #202f36",
                    zIndex: 2,
                  }}
                />
              </div>
            </div>

            {/* Duo Welcome Looking-Up Mascot */}
            <div
              style={{
                width: "260px",
                height: "240px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "duoFloat 3s ease-in-out infinite",
              }}
            >
              <DuoWelcomeMascot />
            </div>
          </div>
        )}

        {/* ===================================================================
            QUESTION STEPS: Shared Duo Mascot Header (Duo + Speech Bubble)
            =================================================================== */}
        {currentStep !== "intro" && currentStep !== "courseOverview" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "32px",
              animation: "fadeIn 0.25s ease",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "105px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DuoClipboardMascot />
            </div>

            <div style={{ flex: 1 }}>
              {currentStep === "hdyhau" && (
                <TypewriterBubble text="How did you hear about Duolingo?" arrowDirection="left" />
              )}
              {currentStep === "learningReason" && (
                <TypewriterBubble
                  text={`Why are you learning ${languageName}?`}
                  arrowDirection="left"
                />
              )}
              {currentStep === "proficiency" && (
                <TypewriterBubble
                  text={`How much ${languageName} do you know?`}
                  arrowDirection="left"
                />
              )}
              {currentStep === "dailyGoal" && (
                <TypewriterBubble
                  text="What's your daily learning goal?"
                  arrowDirection="left"
                />
              )}
              {currentStep === "choosePath" && (
                <TypewriterBubble
                  text="Now let's find the best place to start!"
                  arrowDirection="left"
                />
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 1: HDYHAU (How did you hear about Duolingo?)
            =================================================================== */}
        {currentStep === "hdyhau" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "12px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            {[
              { id: "google", label: "Google Search", icon: "🔍", key: 1 },
              { id: "youtube", label: "YouTube", icon: "▶️", key: 2 },
              { id: "tiktok", label: "TikTok", icon: "📱", key: 3 },
              { id: "social", label: "Facebook / Instagram", icon: "📸", key: 4 },
              { id: "friends", label: "Friends or family", icon: "👥", key: 5 },
              { id: "news", label: "News / article / blog", icon: "📰", key: 6 },
              { id: "tv", label: "TV", icon: "📺", key: 7 },
              { id: "store", label: "App Store / Play Store", icon: "🏪", key: 8 },
              { id: "other", label: "Other", icon: "💬", key: 9 },
            ].map((opt) => (
              <OnboardingOptionCard
                key={opt.id}
                id={opt.id}
                label={opt.label}
                icon={opt.icon}
                selected={selectedHdyhau === opt.id}
                shortcutKey={opt.key}
                onSelect={() => setSelectedHdyhau(opt.id)}
              />
            ))}
          </div>
        )}

        {/* ===================================================================
            STEP 2: LEARNING REASON (Motivation)
            =================================================================== */}
        {currentStep === "learningReason" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            {[
              { id: "people", label: "Connect with people", icon: "💬", key: 1 },
              { id: "career", label: "Boost my career", icon: "💼", key: 2 },
              { id: "education", label: "Support my education", icon: "🎓", key: 3 },
              { id: "travel", label: "Prepare for travel", icon: "✈️", key: 4 },
              { id: "fun", label: "Just for fun", icon: "🎉", key: 5 },
              { id: "productive", label: "Spend time productively", icon: "⏱️", key: 6 },
              { id: "other", label: "Other", icon: "🧠", key: 7 },
            ].map((opt) => (
              <OnboardingOptionCard
                key={opt.id}
                id={opt.id}
                label={opt.label}
                icon={opt.icon}
                selected={selectedReason === opt.id}
                shortcutKey={opt.key}
                onSelect={() => setSelectedReason(opt.id)}
              />
            ))}
          </div>
        )}

        {/* ===================================================================
            STEP 3: PROFICIENCY LEVEL
            =================================================================== */}
        {currentStep === "proficiency" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            {[
              {
                id: 1,
                label: `I'm new to ${languageName}`,
                subtitle: "Start right from the basics",
                icon: "🌱",
                key: 1,
              },
              {
                id: 2,
                label: "I know some common words",
                subtitle: "Know simple vocabulary & greetings",
                icon: "🌿",
                key: 2,
              },
              {
                id: 3,
                label: "I can have basic conversations",
                subtitle: "Introduce yourself, order food, chat",
                icon: "💬",
                key: 3,
              },
              {
                id: 4,
                label: "I can talk about various topics",
                subtitle: "Intermediate or advanced learner",
                icon: "🌟",
                key: 4,
              },
            ].map((opt) => (
              <OnboardingOptionCard
                key={opt.id}
                id={String(opt.id)}
                label={opt.label}
                subtitle={opt.subtitle}
                icon={opt.icon}
                selected={selectedProficiency === opt.id}
                shortcutKey={opt.key}
                onSelect={() => setSelectedProficiency(opt.id)}
              />
            ))}
          </div>
        )}

        {/* ===================================================================
            STEP 4: COURSE OVERVIEW & MILESTONES INTERSTITIAL
            =================================================================== */}
        {currentStep === "courseOverview" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "28px",
              animation: "fadeIn 0.3s ease",
              textAlign: "center",
            }}
          >
            {/* Mascot */}
            <div
              style={{
                width: "120px",
                height: "120px",
                animation: "duoFloat 3s ease-in-out infinite",
              }}
            >
              <DuoWelcomeMascot />
            </div>

            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "8px",
                  color: "#ffffff",
                }}
              >
                Here&apos;s what you can achieve in {languageName}!
              </h2>
              <p style={{ fontSize: "15px", color: "#8599a6" }}>
                Duolingo courses are designed to help you build real-world confidence.
              </p>
            </div>

            {/* Achievement Highlights */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  backgroundColor: "#202f36",
                  border: "2px solid #37464f",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "28px" }}>🗣️</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
                    1,500+ Words &amp; Phrases
                  </div>
                  <div style={{ fontSize: "13px", color: "#8599a6" }}>
                    Build practical, everyday conversational vocabulary
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#202f36",
                  border: "2px solid #37464f",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "28px" }}>⚡</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
                    Speak with Confidence
                  </div>
                  <div style={{ fontSize: "13px", color: "#8599a6" }}>
                    Interactive listening and speaking practice from Day 1
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#202f36",
                  border: "2px solid #37464f",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "28px" }}>🔥</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
                    Build a Lasting Habit
                  </div>
                  <div style={{ fontSize: "13px", color: "#8599a6" }}>
                    Smart notifications and streaks keep you motivated
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 5: DAILY GOAL
            =================================================================== */}
        {currentStep === "dailyGoal" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            {[
              { id: 10, label: "5 min / day", subtitle: "Casual", icon: "☕", key: 1 },
              { id: 20, label: "10 min / day", subtitle: "Regular (Recommended)", icon: "🎯", key: 2 },
              { id: 30, label: "15 min / day", subtitle: "Serious", icon: "🚀", key: 3 },
              { id: 50, label: "20 min / day", subtitle: "Intense", icon: "🔥", key: 4 },
            ].map((opt) => (
              <OnboardingOptionCard
                key={opt.id}
                id={String(opt.id)}
                label={opt.label}
                subtitle={opt.subtitle}
                icon={opt.icon}
                selected={selectedGoal === opt.id}
                shortcutKey={opt.key}
                onSelect={() => setSelectedGoal(opt.id)}
              />
            ))}
          </div>
        )}

        {/* ===================================================================
            STEP 6: CHOOSE PATH (Start from scratch vs Placement test)
            =================================================================== */}
        {currentStep === "choosePath" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <OnboardingOptionCard
              id="scratch"
              label={`Start from scratch`}
              subtitle={`Take the easiest lesson of the ${languageName} course`}
              icon="📖"
              selected={selectedPath === "scratch"}
              shortcutKey={1}
              onSelect={() => setSelectedPath("scratch")}
            />

            <OnboardingOptionCard
              id="placement"
              label="Find my level"
              subtitle="Let Duo recommend where you should start learning"
              icon="🧭"
              selected={selectedPath === "placement"}
              shortcutKey={2}
              onSelect={() => setSelectedPath("placement")}
            />
          </div>
        )}
      </main>

      {/* ===================================================================
          FIXED BOTTOM FOOTER BAR (1:1 Duolingo Production Bar)
          =================================================================== */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "96px",
          backgroundColor: "rgb(19, 31, 36)",
          borderTop: "2px solid #28373e",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1040px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            id="welcome-continue-btn"
            data-test="funboarding-continue-button"
            disabled={!isContinueEnabled}
            onClick={handleContinue}
            style={{
              backgroundColor: isContinueEnabled ? "#58cc02" : "#37464f",
              color: isContinueEnabled ? "#131f24" : "#6c7f8a",
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "0 36px",
              height: "50px",
              minWidth: "150px",
              borderRadius: "16px",
              border: "none",
              borderBottom: isContinueEnabled ? "4px solid #46a302" : "4px solid #28373e",
              cursor: isContinueEnabled ? "pointer" : "not-allowed",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              fontFamily: "inherit",
              outline: "none",
              opacity: isContinueEnabled ? 1 : 0.7,
            }}
            onMouseEnter={(e) => {
              if (isContinueEnabled) {
                e.currentTarget.style.filter = "brightness(1.06)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.borderBottomWidth = "4px";
            }}
            onMouseDown={(e) => {
              if (isContinueEnabled) {
                e.currentTarget.style.transform = "translateY(2px)";
                e.currentTarget.style.borderBottomWidth = "2px";
              }
            }}
            onMouseUp={(e) => {
              if (isContinueEnabled) {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderBottomWidth = "4px";
              }
            }}
          >
            CONTINUE
          </button>
        </div>
      </footer>

      {/* Global CSS keyframes for floating animations */}
      <style jsx global>{`
        @keyframes duoFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes duoBubbleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "rgb(19, 31, 36)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
          }}
        >
          Loading...
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
