import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-teal-300" />
            <div>
              <h3 className="text-xl font-semibold">MedFlow AI</h3>
              <p className="text-sm text-slate-400">병원 중심 멀티모달 AI 임상 플랫폼</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-slate-400 mb-2">
              본 프레젠테이션은 팀 설득 및 기술 아키텍처 공유 목적으로 제작되었습니다
            </p>
            <p className="text-xs text-slate-500">
              © 2026 MedFlow AI Team. All rights reserved.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>
            실제 임상 배치를 위해서는 별도의 규제 검토, 임상 시험, 인허가 절차가 필요합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
