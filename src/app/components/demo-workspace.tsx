import { ChatWorkspace } from "@/app/components/chat-workspace";

export function DemoWorkspace() {
  return (
    <section id="demo-workspace" className="bg-slate-100 py-20 px-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10">
          <h2 className="text-4xl font-semibold text-slate-900">
            AI Triage-Driven Case Rooms
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            AI 알림과 임상 액션이 케이스 룸을 활성화하고, 표준화 지표가
            우선순위와 협업 흐름을 직접 구동합니다. 모든 환자가 채팅방이
            되는 구조가 아니라 “임상적으로 의미 있는 순간”에만 케이스가
            활성화됩니다. 데스크톱은 케이스 분석 중심, 팀 알림은 모바일에서
            처리합니다.
          </p>
        </div>
        <ChatWorkspace />
      </div>
    </section>
  );
}
