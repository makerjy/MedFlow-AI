import { Button } from "@/app/components/ui/button";
import {
  Bell,
  Brain,
  ClipboardList,
  FileText,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

const capabilityCards = [
  {
    title: "AI Alert Feed",
    description: "모델 변화 기반 알림과 우선순위 자동 재정렬",
    icon: Bell,
  },
  {
    title: "Case Room Workflow",
    description: "자동 활성/핀/아카이브로 케이스 중심 협업",
    icon: MessageSquare,
  },
  {
    title: "Standardization Layer",
    description: "Raw → 임상 지표 변환 + 근거 데이터 연결",
    icon: ShieldCheck,
  },
  {
    title: "Audit & Safety",
    description: "Role 기반 접근 제어와 감사 로그",
    icon: ClipboardList,
  },
];

export function HeroSection() {
  const scrollToDemo = () => {
    document
      .getElementById("demo-workspace")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-ambient px-6 pb-24 pt-10 lg:pb-32">
      <div
        className="absolute inset-0 bg-grid opacity-[0.18]"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl animate-glow"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                MedFlow AI
              </p>
              <p className="text-lg font-semibold text-slate-900">
                병원 중심 멀티모달 임상 플랫폼
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 lg:flex">
            <a className="transition hover:text-slate-900" href="#capabilities">
              핵심 기능
            </a>
            <a className="transition hover:text-slate-900" href="#scenarios">
              임상 시나리오
            </a>
            <a className="transition hover:text-slate-900" href="#demo-workspace">
              데모
            </a>
            <a className="transition hover:text-slate-900" href="#architecture">
              아키텍처
            </a>
          </nav>
          <Button
            variant="outline"
            size="sm"
            className="hidden border-slate-300 text-slate-700 lg:inline-flex"
          >
            팀 브리프 요청
          </Button>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              AI triage workflow
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold text-slate-900 sm:text-6xl">
                AI-powered Clinical Case Workspace
              </h1>
              <p className="text-lg text-slate-600 text-balance">
                Automated triage, real-time alerts, and structured clinical insights
                that speed up collaboration and reduce cognitive burden in acute care settings.
              </p>
              <p className="text-sm text-slate-500 text-balance">
                모델 결과를 임상 표준화 지표로 변환해 케이스 룸을 자동 활성화하고,
                우선순위/협업/타임라인/요약까지 연결합니다.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/70 p-4">
                <Bell className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-semibold text-slate-900">AI Triage Feed</p>
                  <p>알림 기준으로 케이스 룸 자동 활성화</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/70 p-4">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-semibold text-slate-900">Case Room 협업</p>
                  <p>환자 케이스 중심 채팅/타임라인</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/70 p-4">
                <ShieldCheck className="h-5 w-5 text-sky-600" />
                <div>
                  <p className="font-semibold text-slate-900">표준화 지표</p>
                  <p>Raw output은 숨기고 근거만 노출</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/70 p-4">
                <FileText className="h-5 w-5 text-slate-700" />
                <div>
                  <p className="font-semibold text-slate-900">안전한 요약</p>
                  <p>Structured data 기반, 진단/치료 권고 없음</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={scrollToDemo} size="lg" className="px-8">
                데모 워크스페이스 보기
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 px-8 text-slate-700"
                onClick={() =>
                  document
                    .getElementById("architecture")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                기술 아키텍처 보기
              </Button>
            </div>

            <p className="text-sm text-slate-500 text-balance">
              레퍼런스: viz.ai의 실시간 영상 알림 워크플로우에서 영감을
              받았습니다. MedFlow AI는 멀티모달 통합과 표준화 레이어,
              케이스 룸 협업 UX로 확장합니다.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-white/40 blur-2xl" aria-hidden="true" />
            <div className="relative grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-float backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Clinical Command Center
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      실시간 워크플로우 스냅샷
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Live
                  </span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {capabilityCards.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm animate-rise"
                        style={{ animationDelay: `${index * 120}ms` }}
                      >
                        <Icon className="mb-3 h-5 w-5 text-slate-700" />
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Multi-domain AI
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    심장 · 영상 · ICU · Neuro
                  </p>
                  <p className="mt-1 text-xs">
                    각 모델은 독립 배포되며 임상 워크플로우는 동일하게 유지됩니다.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Secure by Design
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    임상 안전성 중심 설계
                  </p>
                  <p className="mt-1 text-xs">
                    백엔드는 오케스트레이션만 수행하고 모든 추론은 AI 서비스로 분리됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
