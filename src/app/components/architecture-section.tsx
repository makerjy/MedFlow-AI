import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { 
  Server, 
  Database, 
  Brain, 
  Network, 
  Shield, 
  Zap,
  Layers,
  GitBranch,
  Box,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4">AI Triage 아키텍처</h2>
          <p className="text-xl text-slate-600">
            모델 결과가 케이스 룸과 협업 흐름을 실제로 구동하는 구조
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 border border-slate-200 bg-white">
            <TabsTrigger value="overview">전체 구조</TabsTrigger>
            <TabsTrigger value="ai-models">AI 모델</TabsTrigger>
            <TabsTrigger value="pipeline">데이터 파이프라인</TabsTrigger>
            <TabsTrigger value="tech-stack">기술 스택</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8 space-y-8">
            {/* 계층 구조 다이어그램 */}
            <Card className="p-8 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-center">Layered Architecture</h3>
              
              <div className="space-y-6">
                {/* Layer 1: Frontend */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-sky-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Layers className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="text-xl font-bold">Frontend Layer</h4>
                      <p className="text-sm text-slate-600">Case room 기반 Clinical Workspace</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React + TypeScript</Badge>
                    <Badge variant="outline">Next.js (App Router)</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">WebSocket</Badge>
                    <Badge variant="outline">Recharts</Badge>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
                </div>

                {/* Layer 2: Backend API */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Server className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="text-xl font-bold">Backend API Layer</h4>
                      <p className="text-sm text-slate-600">Case lifecycle &amp; routing control</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Node.js + NestJS</Badge>
                    <Badge variant="outline">REST + WebSocket</Badge>
                    <Badge variant="outline">JWT Auth</Badge>
                    <Badge variant="outline">RBAC</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-800">케이스 라이프사이클</p>
                      <p className="text-xs text-slate-600">자동 활성/핀/아카이브</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-800">알림 라우팅</p>
                      <p className="text-xs text-slate-600">Alert feed, 팀 채널</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-800">권한/감사</p>
                      <p className="text-xs text-slate-600">RBAC, Audit log</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
                </div>

                {/* Layer 3: AI Microservices */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-indigo-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-8 h-8 text-purple-600" />
                    <div>
                      <h4 className="text-xl font-bold">AI Microservices Layer</h4>
                      <p className="text-sm text-slate-600">Domain-Specific Analysis Engines</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <Card className="bg-slate-50 border-slate-200 p-4">
                      <p className="font-semibold text-slate-800 mb-2">ECG Service</p>
                      <p className="text-xs text-slate-600 mb-3">CNN+Transformer</p>
                      <div className="space-y-1 text-xs">
                        <p>• 부정맥 감지</p>
                        <p>• HRV 분석</p>
                        <p>• 리듬 분류</p>
                      </div>
                    </Card>
                    <Card className="bg-slate-50 border-slate-200 p-4">
                      <p className="font-semibold text-slate-800 mb-2">Imaging Service</p>
                      <p className="text-xs text-slate-600 mb-3">U-Net/Swin-UNet</p>
                      <div className="space-y-1 text-xs">
                        <p>• 병변 세그멘테이션</p>
                        <p>• 진행도 추적</p>
                        <p>• 용적 측정</p>
                      </div>
                    </Card>
                    <Card className="bg-slate-50 border-slate-200 p-4">
                      <p className="font-semibold text-slate-800 mb-2">ICU Service</p>
                      <p className="text-xs text-slate-600 mb-3">Temporal Transformer</p>
                      <div className="space-y-1 text-xs">
                        <p>• 악화 위험 예측</p>
                        <p>• 요인 설명</p>
                        <p>• 재원 기간 예측</p>
                      </div>
                    </Card>
                    <Card className="bg-slate-50 border-slate-200 p-4">
                      <p className="font-semibold text-slate-800 mb-2">Neuro Service</p>
                      <p className="text-xs text-slate-600 mb-3">3D-CNN/Multimodal</p>
                      <div className="space-y-1 text-xs">
                        <p>• 인지 저하 예측</p>
                        <p>• 위축 매핑</p>
                        <p>• 진행 시뮬레이션</p>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
                </div>

                {/* Layer 4: Clinical Feature Abstraction */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
                  <div className="flex items-center gap-3 mb-4">
                    <GitBranch className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h4 className="text-xl font-bold">Clinical Feature Abstraction</h4>
                      <p className="text-sm text-slate-600">Standardized Indicators + Evidence</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-800">위험도 레벨</p>
                      <p className="text-xs text-slate-600">저/중/고위험 분류</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-800">추세 분석</p>
                      <p className="text-xs text-slate-600">상승/하강/안정</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-800">근거/품질</p>
                      <p className="text-xs text-slate-600">Evidence &amp; Quality flag</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
                </div>

                {/* Layer 5: LLM Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-rose-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-8 h-8 text-pink-600" />
                    <div>
                      <h4 className="text-xl font-bold">LLM Clinical Summary</h4>
                      <p className="text-sm text-slate-600">RAG-based Natural Language Interface</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-rose-600 mt-0.5" />
                        <span>구조화된 AI 결과 통합 및 요약</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-rose-600 mt-0.5" />
                        <span>환자 변화 추세 자연어 설명</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-rose-600 mt-0.5" />
                        <span>진단/치료 권고 없이 질문 응답</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
                </div>

                {/* Layer 6: Data Search */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-slate-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-8 h-8 text-slate-600" />
                    <div>
                      <h4 className="text-xl font-bold">Data Search &amp; Vector DB</h4>
                      <p className="text-sm text-slate-600">Clinical Document Retrieval</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-800">Semantic Search</p>
                      <p className="text-xs text-slate-600">Vector DB 기반 문서 검색</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-800">LLM/LLQ</p>
                      <p className="text-xs text-slate-600">질의 응답 및 근거 요약</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4">UI 기능 ↔ 아키텍처 매핑</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">Frontend</p>
                  <p className="text-xs">
                    Case room UI, Alert Feed, Chat/Timeline/Data 탭, Role-based view
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">Real-time Workspace</p>
                  <p className="text-xs">
                    WebSocket 기반 알림/메시지 스트림, 연결 상태 모니터링
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">Backend</p>
                  <p className="text-xs">
                    케이스 룸 활성화 규칙, 알림 라우팅, RBAC, Audit logging
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">AI Microservices</p>
                  <p className="text-xs">
                    ECG/Imaging/ICU/Neuro 분석 결과 생성 → 표준화 레이어로 전달
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">LLM Summary</p>
                  <p className="text-xs">
                    표준화 지표 + 타임라인 이벤트 기반 요약/질문 응답
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">Data Search</p>
                  <p className="text-xs">
                    Vector DB 문서 검색 + 근거 기반 요약/질의 응답
                  </p>
                </div>
              </div>
            </Card>

            {/* 핵심 설계 원칙 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <Shield className="w-10 h-10 text-blue-600 mb-4" />
                <h4 className="font-bold text-lg mb-2">안전성 우선</h4>
                <p className="text-sm text-slate-700">
                  의료 추론은 전담 AI 서비스에서만 수행. 백엔드는 오케스트레이션만 담당하여 책임 명확화
                </p>
              </Card>
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <Box className="w-10 h-10 text-green-600 mb-4" />
                <h4 className="font-bold text-lg mb-2">모듈화</h4>
                <p className="text-sm text-slate-700">
                  각 임상 도메인이 독립적으로 진화 가능. 새로운 모델 추가/교체가 타 시스템에 영향 없음
                </p>
              </Card>
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <Network className="w-10 h-10 text-purple-600 mb-4" />
                <h4 className="font-bold text-lg mb-2">확장성</h4>
                <p className="text-sm text-slate-700">
                  마이크로서비스 아키텍처로 독립적 스케일링 가능. 부하 분산 및 무중단 업데이트 지원
                </p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-models" className="mt-8 space-y-6">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">도메인별 AI 모델 상세</h3>
              
              <div className="space-y-8">
                {/* ECG Models */}
                <div className="border-l-4 border-red-500 pl-6">
                  <h4 className="text-xl font-bold mb-3 text-red-700">ECG 분석 모델</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">CNN + Transformer Hybrid</p>
                      <p className="text-sm text-slate-700 mb-3">
                        1D-CNN으로 로컬 패턴 추출 후 Transformer로 장기 의존성 학습
                      </p>
                      <div className="text-xs space-y-1">
                        <p>• 입력: 12-lead ECG (10초, 500Hz)</p>
                        <p>• 출력: 부정맥 분류 (17개 클래스)</p>
                        <p>• 공개 데이터셋 기반 내부 검증 (임상 검증 로드맵)</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">CRNN (HRV Analysis)</p>
                      <p className="text-sm text-slate-700 mb-3">
                        CNN + RNN 조합으로 심박 변이도 시계열 분석
                      </p>
                      <div className="text-xs space-y-1">
                        <p>• 입력: RR interval 시퀀스 (5분)</p>
                        <p>• 출력: SDNN, RMSSD, LF/HF ratio</p>
                        <p>• 활용: 자율신경계 기능 평가</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Imaging Models */}
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-xl font-bold mb-3 text-blue-700">의료영상 분석 모델</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">U-Net (2D Segmentation)</p>
                      <p className="text-sm text-slate-700 mb-3">
                        병변 영역 자동 세그멘테이션 및 경계 검출
                      </p>
                      <div className="text-xs space-y-1">
                        <p>• 입력: CT/MRI 2D 슬라이스</p>
                        <p>• 출력: Pixel-wise 세그멘테이션 마스크</p>
                        <p>• 성능: Dice Coefficient 0.89</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">3D Swin-UNet (Volumetric)</p>
                      <p className="text-sm text-slate-700 mb-3">
                        Transformer 기반 3D 볼륨 분석 및 위축도 측정
                      </p>
                      <div className="text-xs space-y-1">
                        <p>• 입력: 3D MRI 볼륨 (T1-weighted)</p>
                        <p>• 출력: 영역별 용적, 위축률</p>
                        <p>• 데이터: ADNI, OASIS-3</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ICU Models */}
                <div className="border-l-4 border-orange-500 pl-6">
                  <h4 className="text-xl font-bold mb-3 text-orange-700">중환자실 예측 모델</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">Temporal Transformer</p>
                      <p className="text-sm text-slate-700 mb-3">
                        불규칙한 시계열 바이탈 데이터에서 악화 패턴 학습
                      </p>
                      <div className="text-xs space-y-1">
                        <p>• 입력: 48시간 바이탈 + 검사 결과</p>
                        <p>• 출력: 24시간 내 악화 확률</p>
                        <p>• 공개 데이터셋 기반 내부 검증 (임상 검증 로드맵)</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">GNN (Graph Neural Network)</p>
                      <p className="text-sm text-slate-700 mb-3">
                        장기-장기 상호작용을 그래프로 모델링
                      </p>
                      <div className="text-xs space-y-1">
                        <p>• 입력: 다장기 기능 지표</p>
                        <p>• 출력: 장기 부전 예측</p>
                        <p>• 활용: 패혈증, MODS 조기 감지</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Neuro Models */}
                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="text-xl font-bold mb-3 text-purple-700">신경퇴행성 질환 모델</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">3D-CNN (Structural Analysis)</p>
                      <p className="text-sm text-slate-700 mb-3">
                        뇌 MRI에서 알츠하이머 관련 구조 변화 탐지
                      </p>
                      <div className="text-xs space-y-1">
                        <p>• 입력: T1 MRI (1mm 해상도)</p>
                        <p>• 출력: AD/MCI/CN 분류</p>
                        <p>• 공개 데이터셋 기반 내부 검증 (임상 검증 로드맵)</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">Multimodal Fusion Network</p>
                      <p className="text-sm text-slate-700 mb-3">
                        MRI + 인지검사 + 유전자 + 임상변수 통합 분석
                      </p>
                      <div className="text-xs space-y-1">
                        <p>• 입력: 4가지 모달리티 데이터</p>
                        <p>• 출력: 2년 내 치매 전환 확률</p>
                        <p>• 공개 데이터셋 기반 내부 검증 (임상 검증 로드맵)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="mt-8 space-y-6">
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">데이터 파이프라인 워크플로우</h3>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">데이터 수집 및 전처리</h4>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-slate-700 mb-3">
                        병원 EMR/PACS에서 원시 데이터 수집 → 표준화 → 익명화 → 품질 검증
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="font-semibold">ECG: WFDB 형식</p>
                          <p className="text-slate-600">Baseline 제거, 노이즈 필터링</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="font-semibold">영상: DICOM</p>
                          <p className="text-slate-600">정규화, 리샘플링</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="font-semibold">바이탈: HL7 FHIR</p>
                          <p className="text-slate-600">시간 정렬, 결측치 처리</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">AI 모델 추론 (병렬 실행)</h4>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-slate-700 mb-3">
                        각 도메인별 마이크로서비스에서 독립적으로 추론 수행 (Raw output 생성)
                      </p>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        <Badge className="bg-slate-500">ECG Service</Badge>
                        <ArrowRight className="w-4 h-4" />
                        <Badge className="bg-slate-500">Imaging Service</Badge>
                        <ArrowRight className="w-4 h-4" />
                        <Badge className="bg-slate-500">ICU Service</Badge>
                        <ArrowRight className="w-4 h-4" />
                        <Badge className="bg-slate-500">Neuro Service</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Clinical Feature Standardization</h4>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-slate-700 mb-3">
                        Raw output을 위험도/추세/긴급도 등 임상 지표로 표준화
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                          <p className="font-semibold mb-1">Risk/Trend</p>
                          <p className="text-slate-600">저/중/고위험 + 추세</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                          <p className="font-semibold mb-1">Evidence/Quality</p>
                          <p className="text-slate-600">근거 링크 + 품질 표기</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Alert/Triage &amp; Case Room Activation</h4>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-slate-700 mb-3">
                        표준화 지표 변화가 알림을 생성하고 케이스 룸을 자동 활성화
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                          <p className="font-semibold mb-1">Alert Feed</p>
                          <p className="text-slate-600">모델 변화 기반 알림 생성</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                          <p className="font-semibold mb-1">Case Room</p>
                          <p className="text-slate-600">자동 활성/우선순위 변경</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-start gap-4">
                  <div className="bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Timeline &amp; LLM Summary</h4>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-slate-700 mb-3">
                        케이스 룸 타임라인과 LLM 요약이 표준화 지표와 이벤트 로그를 기반으로 갱신
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">Timeline 기록</Badge>
                        <Badge variant="outline">Structured Summary</Badge>
                        <Badge variant="outline">Evidence 링크</Badge>
                        <Badge variant="outline">WebSocket 업데이트</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                    6
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">Document Search &amp; Vector DB</h4>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-slate-700 mb-3">
                        문서/프로토콜을 Vector DB로 검색하고 LLM/LLQ 질의를 지원
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">Semantic Search</Badge>
                        <Badge variant="outline">Top-K Docs</Badge>
                        <Badge variant="outline">Evidence Summary</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 데이터 소스 */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">모델 학습 데이터 소스</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">ECG</p>
                  <ul className="text-xs space-y-1 text-slate-600">
                    <li>• MIT-BIH</li>
                    <li>• PTB-XL</li>
                    <li>• PhysioNet</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">뇌영상</p>
                  <ul className="text-xs space-y-1 text-slate-600">
                    <li>• ADNI</li>
                    <li>• OASIS-3</li>
                    <li>• AIBL</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">중환자</p>
                  <ul className="text-xs space-y-1 text-slate-600">
                    <li>• MIMIC-IV</li>
                    <li>• eICU</li>
                    <li>• HiRID</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">검증</p>
                  <ul className="text-xs space-y-1 text-slate-600">
                    <li>• Cross-validation</li>
                    <li>• External cohort</li>
                    <li>• Clinical review</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tech-stack" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frontend */}
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-blue-600" />
                  Frontend Stack
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Core Framework</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>React 18</Badge>
                      <Badge>TypeScript</Badge>
                      <Badge>Next.js 14</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Styling</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>Tailwind CSS</Badge>
                      <Badge>Radix UI</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Data Visualization</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>Recharts</Badge>
                      <Badge>D3.js</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Real-time</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>Socket.io Client</Badge>
                      <Badge>React Query</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Backend */}
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Server className="w-6 h-6 text-green-600" />
                  Backend Stack
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Framework</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>Node.js</Badge>
                      <Badge>NestJS</Badge>
                      <Badge>TypeScript</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Database</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>PostgreSQL</Badge>
                      <Badge>Redis</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Authentication</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>JWT</Badge>
                      <Badge>Passport.js</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Communication</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>REST API</Badge>
                      <Badge>Socket.io</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* AI Services */}
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  AI Services Stack
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Framework</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>Python 3.11+</Badge>
                      <Badge>FastAPI</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Deep Learning</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>PyTorch</Badge>
                      <Badge>Transformers</Badge>
                      <Badge>MONAI</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Medical Imaging</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>SimpleITK</Badge>
                      <Badge>NiBabel</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Signal Processing</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>NumPy</Badge>
                      <Badge>SciPy</Badge>
                      <Badge>WFDB</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Infrastructure */}
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6 text-orange-600" />
                  Infrastructure
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Containerization</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>Docker</Badge>
                      <Badge>Kubernetes</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Monitoring</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>Prometheus</Badge>
                      <Badge>Grafana</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Message Queue</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>RabbitMQ</Badge>
                      <Badge>Kafka</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">CI/CD</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>GitHub Actions</Badge>
                      <Badge>ArgoCD</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 개발 로드맵 */}
        <Card className="p-8 bg-white border border-slate-200 shadow-sm mt-12">
          <h3 className="text-2xl font-bold mb-6 text-center">개발 팀 역할 분담</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">Frontend Team</h4>
              <p className="text-sm text-slate-600">임상 워크스페이스 UI/UX, 실시간 데이터 시각화</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Server className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">Backend Team</h4>
              <p className="text-sm text-slate-600">API 설계, 보안, AI 오케스트레이션</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">AI Team</h4>
              <p className="text-sm text-slate-600">도메인별 모델 개발, 학습, 검증</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">LLM Team</h4>
              <p className="text-sm text-slate-600">RAG 파이프라인, 임상 요약 생성</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
