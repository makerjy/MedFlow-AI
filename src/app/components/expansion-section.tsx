import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Database,
  FileSearch,
  LogIn,
  Smartphone,
  Users,
} from "lucide-react";

export function ExpansionSection() {
  return (
    <section id="expansion" className="bg-white py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-semibold text-slate-900 mb-4">
            확장 가능한 제품 로드맵
          </h2>
          <p className="text-xl text-slate-600">
            병원 내 협업부터 문서 탐색까지 확장 가능한 구조를 제공합니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <LogIn className="h-6 w-6 text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-900">Login &amp; SSO</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              SSO 연동과 역할 기반 access token으로 병원 계정을 통합합니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
              <Badge variant="outline">Role-based token</Badge>
              <Badge variant="outline">기관별 정책</Badge>
              <Badge variant="outline">세션 감사</Badge>
            </div>
          </Card>

          <Card className="border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-900">
                의료진 목록 (친구 탭)
              </h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              온라인 상태, 1:1 메시지, 그룹 초대가 가능한 팀 디렉터리를 제공합니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
              <Badge variant="outline">Presence</Badge>
              <Badge variant="outline">Mentions</Badge>
              <Badge variant="outline">Group invite</Badge>
            </div>
          </Card>

          <Card className="border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Smartphone className="h-6 w-6 text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-900">
                PC–Mobile 연동
              </h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              반응형 UI와 PWA 설치로 모바일에서도 알림/채팅/패널을 이어갑니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
              <Badge variant="outline">Responsive UI</Badge>
              <Badge variant="outline">PWA</Badge>
              <Badge variant="outline">Push alert</Badge>
            </div>
          </Card>

          <Card className="border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FileSearch className="h-6 w-6 text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-900">
                문서 검색 &amp; Vector DB
              </h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              논문/프로토콜/내부 자료를 벡터 검색으로 찾고 LLM/LLQ 질의를 제공합니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
              <Badge variant="outline">Semantic search</Badge>
              <Badge variant="outline">Top-K docs</Badge>
              <Badge variant="outline">Evidence summary</Badge>
            </div>
          </Card>
        </div>

        <Card className="mt-10 border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Vector DB flow
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                자연어 질의 → 근거 기반 요약
              </h3>
            </div>
            <Database className="h-5 w-5 text-slate-500" />
          </div>
          <div className="mt-4 grid gap-3 text-xs text-slate-600 md:grid-cols-4">
            {[
              "User query",
              "Semantic search (Vector DB)",
              "Top-K docs",
              "LLM summary & evidence",
            ].map((step) => (
              <div
                key={step}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center"
              >
                {step}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
