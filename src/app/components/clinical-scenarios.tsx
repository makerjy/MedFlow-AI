import { Card } from "@/app/components/ui/card";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  FileText,
  FileSearch,
  MessageSquare,
  ShieldCheck,
  Wifi,
} from "lucide-react";

export function ClinicalScenarios() {
  const coreModules = [
    {
      title: "AI Alert Feed",
      description: "모델 변화 기반 알림이 케이스 룸을 자동 활성화",
      icon: Bell,
      points: ["위험도 변화 트리거", "우선순위 자동 정렬", "알림 클릭 시 케이스 오픈"],
    },
    {
      title: "Case Room Lifecycle",
      description: "협업, 타임라인, 데이터 탭을 한 흐름으로 통합",
      icon: MessageSquare,
      points: ["자동 활성/핀/아카이브", "Chat + Overview/Analysis/Timeline", "모바일 알림 연계"],
    },
    {
      title: "Clinical Standardization",
      description: "Raw output → 임상 지표로 변환 후 기본 노출",
      icon: ShieldCheck,
      points: ["근거 데이터 링크", "Confidence/품질 표기", "Raw output 기본 숨김"],
    },
    {
      title: "Role & Audit",
      description: "역할 기반 접근과 감사 로그로 상용화 수준 강화",
      icon: ClipboardList,
      points: ["Doctor/Nurse/Admin", "Audit log 추적", "다운로드 권한 분리"],
    },
    {
      title: "LLM Summary",
      description: "타임라인 기반 안전 요약과 질문 응답",
      icon: FileText,
      points: ["Structured summary", "Evidence links", "No diagnosis"],
    },
    {
      title: "Real-time WebSocket",
      description: "알림과 메시지를 실시간 스트림으로 전달",
      icon: Wifi,
      points: ["연결 상태 표시", "지연/누락 경고", "실시간 알림 스트림"],
    },
    {
      title: "Document Search",
      description: "Vector DB 기반 문서 검색 + LLM/LLQ 질의",
      icon: FileSearch,
      points: ["자연어 질의", "Top-K 문서 요약", "원문 링크"],
    },
  ];

  const scenarios = [
    {
      title: "ICU Risk 급상승 시나리오",
      tag: "Critical Care",
      description: "Vital/Lab 시계열 모델이 악화 위험도 급상승을 감지하면 AI 알림이 생성되고 케이스 룸이 자동 활성화됩니다.",
      features: [
        "Risk 78 → 92 변화 기반 알림 생성",
        "환자 리스트 우선순위 자동 재정렬",
        "케이스 룸 타임라인에 Risk update 기록",
        "LLM 요약이 Timeline 이벤트를 근거로 생성"
      ],
      tone: "border-l-rose-500"
    },
    {
      title: "Imaging 신규 병변 감지",
      tag: "Imaging Triage",
      description: "CT/MRI 분석에서 병변이 감지되면 Urgency flag가 부여되고 케이스 룸에 자동 이벤트가 생성됩니다.",
      features: [
        "Lesion detected + Progression 업데이트",
        "Imaging 패널에 스냅샷/오버레이 제공",
        "Chat 메시지로 “review recommended” 알림",
        "Timeline에 imaging update 기록"
      ],
      tone: "border-l-amber-500"
    },
    {
      title: "ECG 부정맥 확률 증가",
      tag: "Cardio AI",
      description: "ECG 모델이 부정맥 확률 상승을 감지하면 표준화 지표가 업데이트되고 케이스 룸이 활성화됩니다.",
      features: [
        "Arrhythmia Risk: LOW → HIGH 변경",
        "채팅 메시지로 risk 상승 이벤트 공유",
        "ECG 트렌드 카드 업데이트",
        "Timeline에 inference update 기록"
      ],
      tone: "border-l-sky-500"
    }
  ];

  return (
    <section id="capabilities" className="bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-semibold text-slate-900 mb-4">
            AI triage 기반 워크플로우
          </h2>
          <p className="text-xl text-slate-600">
            모델 결과가 케이스 룸과 협업 흐름을 실제로 구동합니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {coreModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.title}
                className="border border-slate-200 bg-white/80 p-6 shadow-sm"
              >
                <Icon className="h-6 w-6 text-slate-700" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {module.description}
                </p>
                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  {module.points.map((point) => (
                    <div key={point} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Market reference
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                viz.ai 모방 + 차별점
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                viz.ai의 트리아지/알림 경험을 참고하되, 멀티모달 통합과
                표준화 레이어, 케이스 룸 중심 협업으로 확장합니다.
              </p>
            </div>
            <div className="grid gap-2 text-xs text-slate-600 md:w-[260px]">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-700">모방</p>
                <p>AI triage · 자동 알림 · 협업</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                <p className="font-semibold text-slate-700">차별</p>
                <p>멀티모달 통합 + 표준화 레이어 + 케이스 룸 UX</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Safety stance</h3>
            <p className="text-sm text-slate-600">
              No diagnosis/therapy recommendations. Explainable indicators and evidence links are required,
              and all access is auditable.
            </p>
          </Card>
          <Card className="border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Why it matters</h3>
            <p className="text-sm text-slate-600">
              Reduce time-to-action during acute events and improve coordination with structured AI insights
              embedded in clinical workflows.
            </p>
          </Card>
        </div>

        <div id="scenarios" className="mt-16">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-semibold text-slate-900 mb-3">
              임상 활용 시나리오
            </h3>
            <p className="text-lg text-slate-600">
              실제 병원 환경에서 MedFlow AI가 적용되는 대표 사례
            </p>
          </div>

          <div className="space-y-8">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.title}
                className={`border border-slate-200 bg-white/90 p-8 shadow-sm border-l-4 ${scenario.tone}`}
              >
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      {scenario.tag}
                    </p>
                    <h4 className="text-2xl font-semibold text-slate-900">
                      {scenario.title}
                    </h4>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    <Bell className="h-3.5 w-3.5" />
                    실시간 알림 연계
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  {scenario.description}
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {scenario.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-teal-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
