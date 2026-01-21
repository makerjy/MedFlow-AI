import type { ReactNode } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import {
  ArrowDown,
  Bell,
  CheckCircle2,
  ClipboardList,
  FileText,
  MessageSquare,
  PhoneCall,
  Search,
  Smartphone,
  User,
  Users,
  Wifi,
} from "lucide-react";

const alertFlow = [
  {
    title: "Alerts (Default)",
    details: ["AI alert feed", "Team routing"],
  },
  {
    title: "Alert Detail",
    details: ["Model change summary", "Urgency badge"],
  },
  {
    title: "Quick Actions",
    details: ["Acknowledge", "Assign/Escalate", "Call team"],
  },
  {
    title: "Case Summary (Mobile)",
    details: ["Risk summary", "Recent timeline", "Quick actions"],
  },
  {
    title: "Open Desktop Workspace",
    details: ["Deep analysis on desktop"],
  },
];

const caseFlow = [
  {
    title: "Cases Tab",
    details: ["Active / pinned / assigned"],
  },
  {
    title: "Case List",
    details: ["Priority ordering", "Alert badges"],
  },
  {
    title: "Case Summary (Mobile)",
    details: ["Short summary only"],
  },
  {
    title: "Handoff Note",
    details: ["Shift summary", "Owner handoff"],
  },
  {
    title: "Checklist",
    details: ["Task checklist", "Follow-up items"],
  },
];

const teamFlow = [
  {
    title: "Team On-call",
    details: ["Roster status", "Coverage map"],
  },
  {
    title: "Escalation Tree",
    details: ["Call chain", "Auto paging"],
  },
  {
    title: "Broadcast Update",
    details: ["Shift update", "Alert recap"],
  },
];

const toolsFlow = [
  {
    title: "Quick Tools",
    details: ["Protocol lookup", "Saved snippets"],
  },
  {
    title: "Document Search",
    details: ["Evidence only", "Top documents"],
  },
  {
    title: "Notification Rules",
    details: ["Team routing", "Quiet hours"],
  },
  {
    title: "Device Status",
    details: ["WebSocket health", "Security status"],
  },
];

export function MobileAppSection() {
  return (
    <section id="mobile-app" className="bg-white py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-semibold text-slate-900 mb-4">
            Mobile App Demo Structure
          </h2>
          <p className="text-xl text-slate-600">
            알림, 케이스 요약, 핸드오프, 온콜 로스터, 프로토콜 조회까지 포함한
            모바일 데모 플로우를 제안합니다. 상세 분석은 데스크톱에서 수행합니다.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1.4fr]">
          <Card className="border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Mobile preview
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Mobile demo screens
                </p>
              </div>
              <Badge
                variant="outline"
                className="border border-slate-200 bg-white text-slate-600"
              >
                PWA ready
              </Badge>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MobileFrame
                label="Alerts"
                subtitle="ICU Team Feed"
                headerRight={
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Wifi className="h-3.5 w-3.5" />
                    Live
                  </div>
                }
                activeTab="alerts"
              >
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">ICU risk spike</span>
                    <Badge className="bg-rose-100 text-rose-700">Critical</Badge>
                  </div>
                  <p className="mt-2 text-rose-600">Patient 123 - Risk 68 → 82</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Imaging update</span>
                    <Badge className="bg-amber-100 text-amber-700">Review</Badge>
                  </div>
                  <p className="mt-2 text-amber-600">New lesion detected - CTA</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Quick actions
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" className="h-7 px-3 text-[10px]">
                      Ack
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-3 text-[10px]">
                      Assign
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-3 text-[10px]">
                      <PhoneCall className="h-3 w-3" />
                      Call
                    </Button>
                  </div>
                </div>
              </MobileFrame>

              <MobileFrame
                label="Case Summary"
                subtitle="Patient 123"
                headerRight={
                  <Badge className="bg-rose-100 text-rose-700">HIGH</Badge>
                }
                activeTab="cases"
              >
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Risk summary
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>ICU Risk</span>
                      <span className="font-semibold text-slate-700">82 / 100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Trend</span>
                      <span className="font-semibold text-slate-700">Rising</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Recent timeline
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>14:28 ICU risk update</span>
                      <span className="text-slate-400">AI</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>14:30 Handoff note added</span>
                      <span className="text-slate-400">RN</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-3.5 w-3.5 text-slate-500" />
                    <p className="font-semibold text-slate-700">Handoff note</p>
                  </div>
                  <p className="mt-2 text-slate-500">
                    MAP drop, labs pending. Monitor trend and update ICU team.
                  </p>
                </div>
                <Button size="sm" className="h-7 px-3 text-[10px]">
                  Open Desktop
                </Button>
              </MobileFrame>

              <MobileFrame
                label="Team & Tools"
                subtitle="Day Shift"
                headerRight={
                  <Badge
                    variant="outline"
                    className="border border-slate-200 bg-slate-50 text-slate-600"
                  >
                    On-call
                  </Badge>
                }
                activeTab="tools"
              >
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-700">Roster</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>ICU MD · 정현우</span>
                      <span className="text-emerald-600">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>ER RN · 박은지</span>
                      <span className="text-amber-600">Busy</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Protocol lookup
                  </p>
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-500">
                    <Search className="h-3 w-3" />
                    Sepsis bundle, stroke CTA...
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Recent: ICU deterioration checklist
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="h-7 px-3 text-[10px]">
                    Broadcast
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-3 text-[10px]">
                    Escalate
                  </Button>
                </div>
              </MobileFrame>
            </div>

            <div className="mt-6 grid gap-3 text-xs text-slate-600 md:grid-cols-2">
              {[
                "팀 알림 수신과 빠른 케이스 진입 중심",
                "핸드오프 노트와 체크리스트 지원",
                "온콜 로스터/에스컬레이션 트리 제공",
                "프로토콜/문헌 빠른 조회 (evidence only)",
                "상세 분석은 데스크톱에서 수행",
                "진단/치료 권고 없음",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    IA diagram
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    Mobile App Structure
                  </p>
                </div>
                <Smartphone className="h-5 w-5 text-slate-500" />
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <FlowColumn title="Alerts Flow" steps={alertFlow} />
                <FlowColumn title="Cases Flow" steps={caseFlow} />
                <FlowColumn title="Team Flow" steps={teamFlow} />
                <FlowColumn title="Tools & Settings" steps={toolsFlow} />
              </div>
            </Card>

            <Card className="border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <FileText className="h-4 w-4 text-slate-500" />
                Mobile policy
              </div>
              <p className="mt-2 text-sm text-slate-600">
                모바일은 알림 대응, 케이스 요약, 핸드오프/온콜/프로토콜 조회에
                집중하며, 모델 결과의 상세 해석과 근거 확인은 데스크톱에서 진행합니다.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

type FlowStep = {
  title: string;
  details: string[];
};

type FlowColumnProps = {
  title: string;
  steps: FlowStep[];
};

function FlowColumn({ title, steps }: FlowColumnProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </p>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.title} className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">{step.title}</p>
              <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                {step.details.map((detail) => (
                  <div key={detail} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-slate-400" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex justify-center text-slate-300">
                <ArrowDown className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type MobileTab = "alerts" | "cases" | "tools" | "profile";

type MobileFrameProps = {
  label: string;
  subtitle: string;
  headerRight?: ReactNode;
  activeTab: MobileTab;
  children: ReactNode;
};

const mobileNavItems: Array<{ key: MobileTab; label: string; icon: typeof Bell }> =
  [
    { key: "alerts", label: "Alerts", icon: Bell },
    { key: "cases", label: "Cases", icon: MessageSquare },
    { key: "tools", label: "Tools", icon: Search },
    { key: "profile", label: "Profile", icon: User },
  ];

function MobileFrame({
  label,
  subtitle,
  headerRight,
  activeTab,
  children,
}: MobileFrameProps) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[260px] rounded-[32px] border border-slate-200 bg-slate-900 p-2 shadow-xl">
        <div className="rounded-[26px] bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {label}
              </p>
              <p className="text-sm font-semibold text-slate-900">{subtitle}</p>
            </div>
            {headerRight && <div>{headerRight}</div>}
          </div>
          <div className="space-y-3 p-4">{children}</div>
          <MobileNav activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}

type MobileNavProps = {
  activeTab: MobileTab;
};

function MobileNav({ activeTab }: MobileNavProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-[11px] text-slate-500">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === activeTab;
        return (
          <div
            key={item.key}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-slate-900" : "text-slate-400"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
