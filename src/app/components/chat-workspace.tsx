import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Progress } from "@/app/components/ui/progress";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  Archive,
  Bell,
  Brain,
  Clock,
  Database,
  FileText,
  MessageSquare,
  Microscope,
  MonitorCheck,
  Pin,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Wifi,
} from "lucide-react";

type Role = "Doctor" | "Nurse" | "Admin";
type RoomStatus = "auto" | "pinned" | "manual" | "archived";
type RiskLevel = "critical" | "high" | "medium" | "low";
type PatientStatus = "unstable" | "watch" | "stable";
type DomainKey = "ecg" | "imaging" | "icu" | "neuro";

type Patient = {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  bed: string;
  diagnosisTags: string[];
  riskLevel: RiskLevel;
  status: PatientStatus;
  ehrId: string;
  pacsId: string;
};

type Room = {
  id: string;
  label: string;
  sublabel: string;
  patientId?: string;
  patientCode?: string;
  riskLevel?: RiskLevel;
  status?: RoomStatus;
  activation?: string;
  recentDomains?: DomainKey[];
  updatedAt: string;
  unread: number;
};

type AlertFeedItem = {
  id: string;
  roomId: string;
  patientId: string;
  domain: DomainKey;
  title: string;
  detail: string;
  time: string;
  severity: RiskLevel;
  change: string;
};

type Message = {
  id: string;
  sender: string;
  role: string;
  time: string;
  type: "clinician" | "ai" | "alert" | "system";
  content: string;
};

type TimelineEvent = {
  time: string;
  label: string;
  type: "ai" | "clinical" | "lab" | "system";
};

type DomainInsight = {
  key: DomainKey;
  title: string;
  status: "active" | "no-data";
  lastUpdated: string;
  standardized: { label: string; value: string }[];
  drivers?: string[];
  rawOutputs: string[];
  evidence: string[];
  confidence: string;
  quality: "good" | "limited" | "missing";
  note?: string;
};

type LlmSummary = {
  lastUpdated: string;
  structured: { label: string; value: string }[];
  narrative: string;
  evidence: string[];
};

type InsightUpdate = {
  domain: DomainKey;
  lastUpdated: string;
  standardized: { label: string; value: string }[];
  drivers?: string[];
  rawOutputs?: string[];
  evidence?: string[];
  confidence?: string;
  quality?: DomainInsight["quality"];
  status?: DomainInsight["status"];
};

type ActivityLog = {
  time: string;
  label: string;
  actor: string;
};

type SystemStatus = {
  websocket: string;
  lastSync: string;
  dataLatency: string;
  warnings: string[];
};

type IconType = typeof Activity;

const roles: Role[] = ["Doctor", "Nurse", "Admin"];

const riskTone: Record<RiskLevel, { label: string; className: string }> = {
  critical: {
    label: "긴급",
    className: "bg-rose-100 text-rose-700 border-rose-200",
  },
  high: {
    label: "고위험",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  medium: {
    label: "중위험",
    className: "bg-slate-200 text-slate-700 border-slate-300",
  },
  low: {
    label: "저위험",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
};

const statusTone: Record<PatientStatus, { label: string; className: string }> = {
  unstable: {
    label: "불안정",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  watch: {
    label: "관찰",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  stable: {
    label: "안정",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const roomStatusLabel: Record<RoomStatus, string> = {
  auto: "자동 활성",
  pinned: "고정",
  manual: "수동 생성",
  archived: "아카이브",
};

const roomStatusTone: Record<RoomStatus, string> = {
  auto: "bg-slate-100 text-slate-600 border-slate-200",
  pinned: "bg-slate-900 text-white border-slate-900",
  manual: "bg-slate-200 text-slate-700 border-slate-300",
  archived: "bg-slate-50 text-slate-500 border-slate-200",
};

const qualityTone: Record<DomainInsight["quality"], string> = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-200",
  limited: "bg-amber-50 text-amber-700 border-amber-200",
  missing: "bg-slate-100 text-slate-500 border-slate-200",
};

const alertTone: Record<RiskLevel, string> = {
  critical: "border-rose-200 bg-rose-50",
  high: "border-amber-200 bg-amber-50",
  medium: "border-slate-200 bg-slate-50",
  low: "border-emerald-200 bg-emerald-50",
};


const domainIcon: Record<DomainKey, typeof Activity> = {
  ecg: Activity,
  imaging: Microscope,
  icu: AlertTriangle,
  neuro: Brain,
};

const domainLabel: Record<DomainKey, string> = {
  ecg: "ECG",
  imaging: "Imaging",
  icu: "ICU Risk",
  neuro: "Neuro",
};

const patients: Patient[] = [
  {
    id: "pt-001",
    patientId: "MRN-203144",
    name: "김철수",
    age: 67,
    gender: "남",
    location: "CICU",
    bed: "CICU-12",
    diagnosisTags: ["급성 심근경색", "AFib 의심"],
    riskLevel: "critical",
    status: "unstable",
    ehrId: "EHR-203144",
    pacsId: "PACS-88-4321",
  },
  {
    id: "pt-003",
    patientId: "MRN-203845",
    name: "박민수",
    age: 58,
    gender: "남",
    location: "ICU",
    bed: "ICU-03",
    diagnosisTags: ["패혈성 쇼크", "저혈압"],
    riskLevel: "high",
    status: "unstable",
    ehrId: "EHR-203845",
    pacsId: "PACS-77-4029",
  },
  {
    id: "pt-004",
    patientId: "MRN-203772",
    name: "최지원",
    age: 62,
    gender: "여",
    location: "ER",
    bed: "ER-02",
    diagnosisTags: ["뇌졸중 의심", "CTA 진행"],
    riskLevel: "high",
    status: "watch",
    ehrId: "EHR-203772",
    pacsId: "PACS-12-3400",
  },
  {
    id: "pt-002",
    patientId: "MRN-203921",
    name: "이영희",
    age: 73,
    gender: "여",
    location: "NEU",
    bed: "NEU-07",
    diagnosisTags: ["경도인지장애", "MRI 추적"],
    riskLevel: "medium",
    status: "watch",
    ehrId: "EHR-203921",
    pacsId: "PACS-91-1142",
  },
];

const initialCaseRooms: Room[] = [
  {
    id: "room-pt-001",
    label: "김철수",
    sublabel: "CICU-12 · ECG 위험 상승",
    patientId: "pt-001",
    patientCode: "MRN-203144",
    riskLevel: "critical",
    status: "auto",
    activation: "Arrhythmia risk HIGH 감지",
    recentDomains: ["ecg", "icu"],
    updatedAt: "14:18",
    unread: 3,
  },
  {
    id: "room-pt-003",
    label: "박민수",
    sublabel: "ICU-03 · Risk spike",
    patientId: "pt-003",
    patientCode: "MRN-203845",
    riskLevel: "high",
    status: "pinned",
    activation: "ICU risk 78 → 92",
    recentDomains: ["icu"],
    updatedAt: "14:08",
    unread: 1,
  },
  {
    id: "room-pt-004",
    label: "최지원",
    sublabel: "ER-02 · Imaging alert",
    patientId: "pt-004",
    patientCode: "MRN-203772",
    riskLevel: "high",
    status: "auto",
    activation: "New lesion detected",
    recentDomains: ["imaging"],
    updatedAt: "14:05",
    unread: 2,
  },
];

const archivedRooms: Room[] = [
  {
    id: "room-pt-002",
    label: "이영희",
    sublabel: "NEU-07 · Neuro follow-up",
    patientId: "pt-002",
    patientCode: "MRN-203921",
    riskLevel: "medium",
    status: "archived",
    activation: "Neuro follow-up 완료",
    recentDomains: ["neuro", "imaging"],
    updatedAt: "13:20",
    unread: 0,
  },
];

const initialAlerts: AlertFeedItem[] = [
  {
    id: "alert-icu",
    roomId: "room-pt-003",
    patientId: "pt-003",
    domain: "icu",
    title: "ICU risk 급상승",
    detail: "Risk score 78 → 92, MAP drop 감지",
    time: "14:08",
    severity: "critical",
    change: "Risk 78 → 92",
  },
  {
    id: "alert-imaging",
    roomId: "room-pt-004",
    patientId: "pt-004",
    domain: "imaging",
    title: "Imaging 신규 병변",
    detail: "CTA에서 LVO 의심 소견",
    time: "14:05",
    severity: "high",
    change: "Lesion detected",
  },
  {
    id: "alert-ecg",
    roomId: "room-pt-001",
    patientId: "pt-001",
    domain: "ecg",
    title: "ECG 부정맥 확률 증가",
    detail: "Arrhythmia probability 0.87",
    time: "14:04",
    severity: "high",
    change: "Risk LOW → HIGH",
  },
];

const initialMessagesByRoom: Record<string, Message[]> = {
  "room-pt-001": [
    {
      id: "msg-001",
      sender: "MedFlow AI",
      role: "Alert Bot",
      time: "14:04",
      type: "alert",
      content:
        "Arrhythmia risk increased to HIGH (0.87). 자동으로 케이스 룸 활성화.",
    },
    {
      id: "msg-002",
      sender: "김보라",
      role: "중환자실 RN",
      time: "14:12",
      type: "clinician",
      content: "SpO2 91% 지속. 산소요법 재확인했고 ABG 준비 중입니다.",
    },
    {
      id: "msg-003",
      sender: "정현우",
      role: "심장내과",
      time: "14:15",
      type: "clinician",
      content: "ECG 표준화 지표 확인했습니다. 리듬 트렌드 모니터링 중.",
    },
    {
      id: "msg-004",
      sender: "MedFlow AI",
      role: "Risk Monitor",
      time: "14:16",
      type: "ai",
      content: "Risk trend: Worsening. 주요 신호: HR 상승, 변동성 증가.",
    },
  ],
  "room-pt-003": [
    {
      id: "msg-101",
      sender: "MedFlow AI",
      role: "Risk Monitor",
      time: "14:08",
      type: "alert",
      content: "ICU risk increased from 78 → 92. Drivers: MAP drop, lactate 상승.",
    },
    {
      id: "msg-102",
      sender: "장수진",
      role: "중환자실 RN",
      time: "14:10",
      type: "clinician",
      content: "승압제 조정 후 재평가 예정. Lab 결과 업데이트 대기 중.",
    },
  ],
  "room-pt-004": [
    {
      id: "msg-201",
      sender: "MedFlow AI",
      role: "Imaging",
      time: "14:05",
      type: "alert",
      content: "CTA에서 신규 병변 감지. Urgency flag: HIGH.",
    },
    {
      id: "msg-202",
      sender: "김현정",
      role: "응급의학과",
      time: "14:07",
      type: "clinician",
      content: "Stroke Team 호출 완료. PACS 영상 검토 요청했습니다.",
    },
  ],
  "room-pt-002": [
    {
      id: "msg-301",
      sender: "MedFlow AI",
      role: "Neuro AI",
      time: "13:20",
      type: "ai",
      content: "Cognitive decline risk MODERATE. 추적 데이터 기록 완료.",
    },
  ],
};

const initialTimelineByRoom: Record<string, TimelineEvent[]> = {
  "room-pt-001": [
    { time: "12:50", label: "ECG inference update", type: "ai" },
    { time: "13:10", label: "ABG 검사 수행", type: "lab" },
    { time: "14:04", label: "Arrhythmia risk HIGH → 케이스 룸 활성화", type: "system" },
    { time: "14:16", label: "Risk trend worsening 기록", type: "ai" },
  ],
  "room-pt-003": [
    { time: "13:40", label: "Vitals/Labs batch ingest", type: "system" },
    { time: "14:08", label: "ICU risk 78 → 92 업데이트", type: "ai" },
    { time: "14:10", label: "승압제 조정 기록", type: "clinical" },
  ],
  "room-pt-004": [
    { time: "13:20", label: "CTA 촬영 완료", type: "clinical" },
    { time: "14:05", label: "Imaging analysis update", type: "ai" },
    { time: "14:07", label: "Stroke Team 호출 기록", type: "clinical" },
  ],
};

const domainInsightsByPatient: Record<string, DomainInsight[]> = {
  "pt-001": [
    {
      key: "ecg",
      title: "ECG",
      status: "active",
      lastUpdated: "14:10",
      standardized: [
        { label: "Arrhythmia Risk", value: "HIGH" },
        { label: "Rhythm Trend", value: "Worsening" },
        { label: "Key Segments", value: "Lead II 12:40–12:50" },
      ],
      rawOutputs: [
        "Arrhythmia probability 0.87",
        "Rhythm instability index 0.72",
        "Top-k segments: Lead II 12:40–12:50",
      ],
      evidence: ["ECG waveform", "12-lead report v2"],
      confidence: "0.88",
      quality: "good",
    },
    {
      key: "icu",
      title: "ICU Risk",
      status: "active",
      lastUpdated: "14:05",
      standardized: [
        { label: "Risk Score", value: "78 / 100" },
        { label: "Risk Level", value: "HIGH" },
        { label: "Trend (6h)", value: "Rising" },
      ],
      drivers: ["HR 상승", "BP 변동성", "SpO2 하락"],
      rawOutputs: [
        "Deterioration probability 0.78",
        "Feature contribution: HR 0.29, BP 0.21, SpO2 0.17",
      ],
      evidence: ["Vitals 24h", "Lab panel 48h"],
      confidence: "0.82",
      quality: "limited",
    },
    {
      key: "imaging",
      title: "Imaging",
      status: "no-data",
      lastUpdated: "-",
      standardized: [],
      rawOutputs: [],
      evidence: [],
      confidence: "-",
      quality: "missing",
      note: "최근 CT/MRI 데이터가 연결되지 않았습니다.",
    },
    {
      key: "neuro",
      title: "Neuro",
      status: "no-data",
      lastUpdated: "-",
      standardized: [],
      rawOutputs: [],
      evidence: [],
      confidence: "-",
      quality: "missing",
      note: "Neuro 데이터 미연동",
    },
  ],
  "pt-003": [
    {
      key: "icu",
      title: "ICU Risk",
      status: "active",
      lastUpdated: "14:08",
      standardized: [
        { label: "Risk Score", value: "92 / 100" },
        { label: "Risk Level", value: "HIGH" },
        { label: "Trend (6h)", value: "Rapid rise" },
      ],
      drivers: ["MAP drop", "Lactate 상승", "SpO2 변동"],
      rawOutputs: [
        "Deterioration probability 0.92",
        "Feature contribution: MAP 0.31, Lactate 0.24, SpO2 0.18",
      ],
      evidence: ["Vitals 48h", "Lab panel 24h"],
      confidence: "0.86",
      quality: "good",
    },
    {
      key: "ecg",
      title: "ECG",
      status: "active",
      lastUpdated: "13:55",
      standardized: [
        { label: "Arrhythmia Risk", value: "MODERATE" },
        { label: "Rhythm Trend", value: "Stable" },
        { label: "Key Segments", value: "Lead II 13:10–13:20" },
      ],
      rawOutputs: [
        "Arrhythmia probability 0.36",
        "Rhythm instability index 0.41",
      ],
      evidence: ["ECG waveform", "Rhythm summary"],
      confidence: "0.79",
      quality: "limited",
    },
    {
      key: "imaging",
      title: "Imaging",
      status: "no-data",
      lastUpdated: "-",
      standardized: [],
      rawOutputs: [],
      evidence: [],
      confidence: "-",
      quality: "missing",
      note: "Imaging 데이터 없음",
    },
    {
      key: "neuro",
      title: "Neuro",
      status: "no-data",
      lastUpdated: "-",
      standardized: [],
      rawOutputs: [],
      evidence: [],
      confidence: "-",
      quality: "missing",
      note: "Neuro 데이터 없음",
    },
  ],
  "pt-004": [
    {
      key: "imaging",
      title: "Imaging",
      status: "active",
      lastUpdated: "14:05",
      standardized: [
        { label: "Lesion Detected", value: "Yes" },
        { label: "Volume", value: "12.4 ml" },
        { label: "Progression", value: "Worsening" },
        { label: "Urgency Flag", value: "HIGH" },
      ],
      rawOutputs: [
        "Lesion segmentation mask (CTA)",
        "Volume delta +3.1 ml",
      ],
      evidence: ["CTA snapshot", "PACS series 12-3400"],
      confidence: "0.91",
      quality: "good",
    },
    {
      key: "icu",
      title: "ICU Risk",
      status: "active",
      lastUpdated: "13:58",
      standardized: [
        { label: "Risk Score", value: "64 / 100" },
        { label: "Risk Level", value: "MODERATE" },
        { label: "Trend (6h)", value: "Stable" },
      ],
      drivers: ["BP 변동", "Resp rate 상승"],
      rawOutputs: ["Deterioration probability 0.64"],
      evidence: ["Vitals 12h", "Lab panel"],
      confidence: "0.75",
      quality: "limited",
    },
    {
      key: "ecg",
      title: "ECG",
      status: "no-data",
      lastUpdated: "-",
      standardized: [],
      rawOutputs: [],
      evidence: [],
      confidence: "-",
      quality: "missing",
      note: "ECG 연결 없음",
    },
    {
      key: "neuro",
      title: "Neuro",
      status: "no-data",
      lastUpdated: "-",
      standardized: [],
      rawOutputs: [],
      evidence: [],
      confidence: "-",
      quality: "missing",
      note: "Neuro 데이터 없음",
    },
  ],
  "pt-002": [
    {
      key: "neuro",
      title: "Neuro",
      status: "active",
      lastUpdated: "13:20",
      standardized: [
        { label: "Decline Risk Level", value: "MODERATE" },
        { label: "Region Indicators", value: "해마 · 측두엽" },
        { label: "Trend", value: "Gradual decline" },
      ],
      rawOutputs: [
        "Cognitive decline probability 0.64",
        "Atrophy regions: Hippocampus, Temporal",
      ],
      evidence: ["MRI T1 series", "Neuro test summary"],
      confidence: "0.72",
      quality: "limited",
    },
    {
      key: "ecg",
      title: "ECG",
      status: "no-data",
      lastUpdated: "-",
      standardized: [],
      rawOutputs: [],
      evidence: [],
      confidence: "-",
      quality: "missing",
      note: "ECG 데이터 없음",
    },
    {
      key: "imaging",
      title: "Imaging",
      status: "active",
      lastUpdated: "13:15",
      standardized: [
        { label: "Lesion Detected", value: "No" },
        { label: "Progression", value: "Stable" },
      ],
      rawOutputs: ["Segmentation mask baseline (MRI)"],
      evidence: ["MRI baseline snapshot"],
      confidence: "0.81",
      quality: "good",
    },
    {
      key: "icu",
      title: "ICU Risk",
      status: "no-data",
      lastUpdated: "-",
      standardized: [],
      rawOutputs: [],
      evidence: [],
      confidence: "-",
      quality: "missing",
      note: "ICU 데이터 없음",
    },
  ],
};

const summaryByPatient: Record<string, LlmSummary> = {
  "pt-001": {
    lastUpdated: "14:16",
    structured: [
      { label: "Risk Level", value: "HIGH (Arrhythmia)" },
      { label: "Main Findings", value: "AFib 패턴 + SpO2 하락" },
      { label: "Recent Changes", value: "2시간 내 위험도 +12%" },
    ],
    narrative:
      "최근 ECG 표준화 지표에서 리듬 이상이 증가했고, 산소포화도 하락이 동반되었습니다. 위험도 상승 이벤트가 케이스 룸 활성화 기준을 충족했습니다.",
    evidence: ["ECG inference update", "Vitals trend log"],
  },
  "pt-003": {
    lastUpdated: "14:08",
    structured: [
      { label: "Risk Level", value: "HIGH (ICU deterioration)" },
      { label: "Main Findings", value: "MAP drop + lactate 상승" },
      { label: "Recent Changes", value: "Risk 78 → 92" },
    ],
    narrative:
      "ICU 시계열 분석에서 위험도가 급상승했습니다. 주요 드라이버는 MAP 하락과 lactate 상승이며, 관련 이벤트가 타임라인에 기록되었습니다.",
    evidence: ["ICU risk update", "Lab panel log"],
  },
  "pt-004": {
    lastUpdated: "14:05",
    structured: [
      { label: "Risk Level", value: "HIGH (Imaging alert)" },
      { label: "Main Findings", value: "CTA 병변 감지" },
      { label: "Recent Changes", value: "Urgency flag HIGH" },
    ],
    narrative:
      "CTA 영상 분석에서 신규 병변이 감지되어 urgency flag가 상승했습니다. 자동 알림이 발송되어 케이스 룸이 활성화되었습니다.",
    evidence: ["Imaging analysis update", "PACS snapshot"],
  },
  "pt-002": {
    lastUpdated: "13:20",
    structured: [
      { label: "Risk Level", value: "MODERATE (Neuro)" },
      { label: "Main Findings", value: "해마/측두엽 위축 추세" },
      { label: "Recent Changes", value: "MRI 추적 업데이트" },
    ],
    narrative:
      "Neuro 분석에서 완만한 인지 저하 패턴이 관찰됩니다. 최근 추적 MRI 데이터가 요약에 반영되었습니다.",
    evidence: ["Neuro inference update", "MRI baseline"],
  },
};

type ClinicalDocument = {
  id: string;
  title: string;
  source: string;
  updatedAt: string;
  summary: string;
  tags: string[];
};

const documentsByPatient: Record<string, ClinicalDocument[]> = {
  "pt-001": [
    {
      id: "doc-ecg-01",
      title: "CICU Arrhythmia Monitoring Protocol v3",
      source: "Hospital protocol",
      updatedAt: "2024-02",
      summary:
        "부정맥 위험도 분류 기준과 모니터링 체크리스트를 정리한 내부 프로토콜 요약.",
      tags: ["ECG", "Arrhythmia", "Protocol"],
    },
    {
      id: "doc-icu-01",
      title: "CICU Oxygenation Trend Guide",
      source: "ICU guideline",
      updatedAt: "2023-11",
      summary:
        "SpO2 하락 시 기록해야 할 지표와 경과 관찰 항목을 정리한 가이드.",
      tags: ["ICU", "Vitals", "Guide"],
    },
  ],
  "pt-003": [
    {
      id: "doc-icu-02",
      title: "Sepsis Deterioration Indicators",
      source: "Hospital protocol",
      updatedAt: "2024-01",
      summary:
        "MAP, lactate, SpO2 변화 기준과 기록 방식 중심의 악화 지표 요약.",
      tags: ["ICU", "Sepsis", "Indicators"],
    },
    {
      id: "doc-icu-03",
      title: "ICU Trend Documentation Checklist",
      source: "Internal checklist",
      updatedAt: "2023-08",
      summary:
        "최근 6시간 트렌드 요약 시 포함해야 할 지표 및 근거 문서 목록.",
      tags: ["ICU", "Checklist", "Documentation"],
    },
  ],
  "pt-004": [
    {
      id: "doc-img-01",
      title: "Stroke CTA Review Workflow",
      source: "Imaging guideline",
      updatedAt: "2024-03",
      summary:
        "CTA 영상 검토 순서, 병변 확인 항목, 문서화 기준을 정리한 가이드.",
      tags: ["Imaging", "CTA", "Workflow"],
    },
    {
      id: "doc-img-02",
      title: "LVO Suspicion Checklist",
      source: "Hospital protocol",
      updatedAt: "2023-12",
      summary:
        "LVO 의심 시 기록해야 할 체크 항목과 커뮤니케이션 기준 요약.",
      tags: ["Imaging", "Stroke", "Checklist"],
    },
  ],
  "pt-002": [
    {
      id: "doc-neuro-01",
      title: "MCI Follow-up Documentation",
      source: "Neurology guide",
      updatedAt: "2023-10",
      summary:
        "인지 저하 추적 시 필요한 평가 항목과 비교 기록 포맷을 정리.",
      tags: ["Neuro", "MCI", "Follow-up"],
    },
    {
      id: "doc-neuro-02",
      title: "MRI Longitudinal Review Notes",
      source: "Imaging guide",
      updatedAt: "2023-07",
      summary:
        "연속 MRI 비교 시 확인해야 할 영역과 요약 작성 기준.",
      tags: ["Neuro", "MRI", "Guideline"],
    },
  ],
};

const activityLogByPatient: Record<string, ActivityLog[]> = {
  "pt-001": [
    { time: "14:16", label: "LLM 요약 열람", actor: "정현우 (MD)" },
    { time: "14:12", label: "ABG 결과 업로드", actor: "김보라 (RN)" },
    { time: "14:04", label: "케이스 룸 자동 활성화", actor: "MedFlow AI" },
  ],
  "pt-003": [
    { time: "14:10", label: "Risk trend 확인", actor: "장수진 (RN)" },
    { time: "14:08", label: "ICU risk alert 생성", actor: "MedFlow AI" },
  ],
  "pt-004": [
    { time: "14:07", label: "PACS 영상 열람", actor: "Stroke Team" },
    { time: "14:05", label: "Imaging alert 생성", actor: "MedFlow AI" },
  ],
};

const initialSystemStatus: SystemStatus = {
  websocket: "connected",
  lastSync: "2 min ago",
  dataLatency: "2m",
  warnings: ["PACS feed 18m delay", "Neuro data partial"],
};

const websocketMockSnippet = `socket.onopen = () => {
  setTimeout(() => socket.emit('alert', { type: 'IMAGING_NEW_FIND', data }), 5000);
  setTimeout(() => socket.emit('alert', { type: 'ICU_RISK_UP', data }), 12000);
  setTimeout(() => socket.emit('alert', { type: 'ECG_RISK_UP', data }), 20000);
};`;

const messageTone: Record<Message["type"], string> = {
  clinician: "bg-white border-slate-200",
  ai: "bg-slate-50 border-slate-200",
  alert: "bg-rose-50 border-rose-200",
  system: "bg-slate-100 border-slate-200",
};

const riskOrder: Record<RiskLevel, number> = {
  critical: 3,
  high: 2,
  medium: 1,
  low: 0,
};

export function ChatWorkspace() {
  const [activeRoomId, setActiveRoomId] = useState(initialCaseRooms[0].id);
  const [role, setRole] = useState<Role>("Doctor");
  const [patientRoster, setPatientRoster] = useState<Patient[]>(patients);
  const [alertItems, setAlertItems] = useState<AlertFeedItem[]>(initialAlerts);
  const [caseRoomItems, setCaseRoomItems] = useState<Room[]>(initialCaseRooms);
  const [messageMap, setMessageMap] = useState<Record<string, Message[]>>(
    initialMessagesByRoom,
  );
  const [timelineMap, setTimelineMap] = useState<Record<string, TimelineEvent[]>>(
    initialTimelineByRoom,
  );
  const [insightsByPatient, setInsightsByPatient] =
    useState<Record<string, DomainInsight[]>>(domainInsightsByPatient);
  const [summaryByPatientState, setSummaryByPatientState] =
    useState<Record<string, LlmSummary>>(summaryByPatient);
  const [systemStatus, setSystemStatus] = useState(initialSystemStatus);
  const [connectionState, setConnectionState] = useState<
    "connected" | "connecting" | "disconnected"
  >("connecting");

  useEffect(() => {
    setConnectionState("connecting");
    const connectTimer = window.setTimeout(
      () => setConnectionState("connected"),
      600,
    );

    const emitAlert = (payload: {
      alert: AlertFeedItem;
      message: Message;
      timeline: TimelineEvent;
      insightUpdate?: InsightUpdate;
      summaryUpdate?: LlmSummary;
    }) => {
      setAlertItems((prev) => [payload.alert, ...prev]);
      setMessageMap((prev) => ({
        ...prev,
        [payload.alert.roomId]: [
          ...(prev[payload.alert.roomId] ?? []),
          payload.message,
        ],
      }));
      setTimelineMap((prev) => ({
        ...prev,
        [payload.alert.roomId]: [
          ...(prev[payload.alert.roomId] ?? []),
          payload.timeline,
        ],
      }));
      setPatientRoster((prev) =>
        prev.map((patient) =>
          patient.id === payload.alert.patientId
            ? {
                ...patient,
                riskLevel: payload.alert.severity,
                status:
                  payload.alert.severity === "critical" || payload.alert.severity === "high"
                    ? "unstable"
                    : payload.alert.severity === "medium"
                      ? "watch"
                      : "stable",
              }
            : patient,
        ),
      );
      setCaseRoomItems((prev) => {
        const idx = prev.findIndex((room) => room.id === payload.alert.roomId);
        if (idx >= 0) {
          const next = [...prev];
          const current = next[idx];
          const recentDomains = current.recentDomains ?? [];
          const nextDomains = [
            payload.alert.domain,
            ...recentDomains.filter((domain) => domain !== payload.alert.domain),
          ].slice(0, 3);
          next[idx] = {
            ...current,
            updatedAt: payload.alert.time,
            unread: current.unread + 1,
            status: current.status ?? "auto",
            activation: payload.alert.title,
            riskLevel: payload.alert.severity,
            recentDomains: nextDomains,
          };
          return next;
        }
        const patient = patients.find((item) => item.id === payload.alert.patientId);
        return [
          {
            id: payload.alert.roomId,
            label: patient?.name ?? payload.alert.patientId,
            sublabel: patient
              ? `${patient.location}-${patient.bed} · ${payload.alert.title}`
              : payload.alert.title,
            patientId: payload.alert.patientId,
            patientCode: patient?.patientId,
            riskLevel: payload.alert.severity,
            status: "auto",
            activation: payload.alert.title,
            recentDomains: [payload.alert.domain],
            updatedAt: payload.alert.time,
            unread: 1,
          },
          ...prev,
        ];
      });
      if (payload.insightUpdate) {
        setInsightsByPatient((prev) => {
          const current = prev[payload.alert.patientId] ?? [];
          const exists = current.some(
            (insight) => insight.key === payload.insightUpdate?.domain,
          );
          const updated = exists
            ? current.map((insight) =>
                insight.key === payload.insightUpdate?.domain
                  ? {
                      ...insight,
                      status: payload.insightUpdate?.status ?? insight.status,
                      lastUpdated: payload.insightUpdate?.lastUpdated ?? insight.lastUpdated,
                      standardized:
                        payload.insightUpdate?.standardized ?? insight.standardized,
                      drivers: payload.insightUpdate?.drivers ?? insight.drivers,
                      rawOutputs: payload.insightUpdate?.rawOutputs ?? insight.rawOutputs,
                      evidence: payload.insightUpdate?.evidence ?? insight.evidence,
                      confidence: payload.insightUpdate?.confidence ?? insight.confidence,
                      quality: payload.insightUpdate?.quality ?? insight.quality,
                    }
                  : insight,
              )
            : [
                ...current,
                {
                  key: payload.insightUpdate.domain,
                  title: domainLabel[payload.insightUpdate.domain],
                  status: payload.insightUpdate.status ?? "active",
                  lastUpdated: payload.insightUpdate.lastUpdated,
                  standardized: payload.insightUpdate.standardized,
                  drivers: payload.insightUpdate.drivers,
                  rawOutputs: payload.insightUpdate.rawOutputs ?? [],
                  evidence: payload.insightUpdate.evidence ?? [],
                  confidence: payload.insightUpdate.confidence ?? "-",
                  quality: payload.insightUpdate.quality ?? "limited",
                },
              ];
          return {
            ...prev,
            [payload.alert.patientId]: updated,
          };
        });
      }
      if (payload.summaryUpdate) {
        setSummaryByPatientState((prev) => ({
          ...prev,
          [payload.alert.patientId]: payload.summaryUpdate ?? prev[payload.alert.patientId],
        }));
      }
      setSystemStatus((prev) => ({ ...prev, lastSync: "just now" }));
    };

    const timers = [
      window.setTimeout(() => {
        emitAlert({
          alert: {
            id: "alert-imaging-live",
            roomId: "room-pt-004",
            patientId: "pt-004",
            domain: "imaging",
            title: "Imaging result available",
            detail: "CTA 신규 병변 감지, Urgency HIGH",
            time: "14:25",
            severity: "high",
            change: "Lesion detected",
          },
          message: {
            id: "msg-live-001",
            sender: "MedFlow AI",
            role: "Imaging",
            time: "14:25",
            type: "alert",
            content: "Imaging result available. Lesion detected, urgency HIGH.",
          },
          timeline: {
            time: "14:25",
            label: "Imaging result available (Lesion detected)",
            type: "ai",
          },
          insightUpdate: {
            domain: "imaging",
            lastUpdated: "14:25",
            standardized: [
              { label: "Lesion Detected", value: "Yes" },
              { label: "Volume", value: "13.1 ml" },
              { label: "Progression", value: "Worsening" },
              { label: "Urgency Flag", value: "HIGH" },
            ],
            rawOutputs: [
              "Lesion segmentation mask (CTA)",
              "Volume delta +3.4 ml",
            ],
            evidence: ["CTA snapshot 14:25", "PACS series 12-3400"],
            confidence: "0.92",
            quality: "good",
          },
          summaryUpdate: {
            lastUpdated: "14:25",
            structured: [
              { label: "Risk Level", value: "HIGH (Imaging alert)" },
              { label: "Main Findings", value: "CTA 신규 병변 감지" },
              { label: "Recent Changes", value: "Urgency flag HIGH 유지" },
            ],
            narrative:
              "CTA 분석에서 신규 병변이 확인되어 urgency flag가 유지되었습니다. 해당 이벤트가 케이스 룸과 타임라인에 반영되었습니다.",
            evidence: ["Imaging analysis update", "CTA snapshot 14:25"],
          },
        });
      }, 5000),
      window.setTimeout(() => {
        emitAlert({
          alert: {
            id: "alert-icu-live",
            roomId: "room-pt-003",
            patientId: "pt-003",
            domain: "icu",
            title: "ICU risk score changed",
            detail: "Risk 68 → 82, driver: MAP drop",
            time: "14:28",
            severity: "high",
            change: "Risk 68 → 82",
          },
          message: {
            id: "msg-live-002",
            sender: "MedFlow AI",
            role: "Risk Monitor",
            time: "14:28",
            type: "alert",
            content: "ICU risk score changed: 68 → 82 (MAP drop).",
          },
          timeline: {
            time: "14:28",
            label: "ICU risk update 68 → 82",
            type: "ai",
          },
          insightUpdate: {
            domain: "icu",
            lastUpdated: "14:28",
            standardized: [
              { label: "Risk Score", value: "82 / 100" },
              { label: "Risk Level", value: "HIGH" },
              { label: "Trend (6h)", value: "Rising" },
            ],
            drivers: ["MAP drop", "Lactate 상승", "SpO2 변동"],
            rawOutputs: [
              "Deterioration probability 0.82",
              "Feature contribution: MAP 0.27, Lactate 0.22, SpO2 0.16",
            ],
            evidence: ["Vitals 48h", "Lab panel 24h"],
            confidence: "0.84",
            quality: "good",
          },
          summaryUpdate: {
            lastUpdated: "14:28",
            structured: [
              { label: "Risk Level", value: "HIGH (ICU deterioration)" },
              { label: "Main Findings", value: "MAP drop + lactate 상승" },
              { label: "Recent Changes", value: "Risk 68 → 82" },
            ],
            narrative:
              "ICU 시계열 분석에서 위험도가 상승했습니다. 주요 드라이버는 MAP 하락과 lactate 상승이며, 변화가 타임라인에 기록되었습니다.",
            evidence: ["ICU risk update", "Lab panel log"],
          },
        });
      }, 12000),
      window.setTimeout(() => {
        emitAlert({
          alert: {
            id: "alert-ecg-live",
            roomId: "room-pt-001",
            patientId: "pt-001",
            domain: "ecg",
            title: "Arrhythmia probability increased",
            detail: "Arrhythmia probability 0.87",
            time: "14:32",
            severity: "high",
            change: "Risk LOW → HIGH",
          },
          message: {
            id: "msg-live-003",
            sender: "MedFlow AI",
            role: "ECG",
            time: "14:32",
            type: "alert",
            content: "Arrhythmia probability increased to 0.87.",
          },
          timeline: {
            time: "14:32",
            label: "ECG arrhythmia risk increased",
            type: "ai",
          },
          insightUpdate: {
            domain: "ecg",
            lastUpdated: "14:32",
            standardized: [
              { label: "Arrhythmia Risk", value: "HIGH" },
              { label: "Rhythm Trend", value: "Worsening" },
              { label: "Key Segments", value: "Lead II 14:10-14:20" },
            ],
            rawOutputs: [
              "Arrhythmia probability 0.87",
              "Rhythm instability index 0.76",
            ],
            evidence: ["ECG waveform 14:20", "12-lead report v2"],
            confidence: "0.89",
            quality: "good",
          },
          summaryUpdate: {
            lastUpdated: "14:32",
            structured: [
              { label: "Risk Level", value: "HIGH (Arrhythmia)" },
              { label: "Main Findings", value: "리듬 불안정 증가" },
              { label: "Recent Changes", value: "Arrhythmia risk 상승" },
            ],
            narrative:
              "ECG 표준화 지표에서 리듬 불안정이 증가했습니다. 알림 이벤트가 케이스 룸과 타임라인에 반영되었습니다.",
            evidence: ["ECG inference update", "Vitals trend log"],
          },
        });
      }, 20000),
    ];

    return () => {
      window.clearTimeout(connectTimer);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const allRooms = useMemo(
    () => [...caseRoomItems, ...archivedRooms],
    [caseRoomItems],
  );
  const activeRoom = useMemo(
    () => allRooms.find((room) => room.id === activeRoomId) ?? caseRoomItems[0],
    [activeRoomId, allRooms, caseRoomItems],
  );
  const patient = useMemo(
    () =>
      activeRoom.patientId
        ? patientRoster.find((item) => item.id === activeRoom.patientId) ?? null
        : null,
    [activeRoom, patientRoster],
  );

  const sortedCaseRooms = useMemo(
    () =>
      [...caseRoomItems].sort((a, b) => {
        const riskGap =
          riskOrder[b.riskLevel ?? "low"] - riskOrder[a.riskLevel ?? "low"];
        if (riskGap !== 0) return riskGap;
        return a.updatedAt < b.updatedAt ? 1 : -1;
      }),
    [caseRoomItems],
  );

  const messages = messageMap[activeRoom.id] ?? [];
  const timelineEvents = timelineMap[activeRoom.id] ?? [];
  const domainInsights = patient
    ? insightsByPatient[patient.id] ?? []
    : [];
  const summary = patient ? summaryByPatientState[patient.id] : null;
  const activityLog = patient ? activityLogByPatient[patient.id] ?? [] : [];
  const connectionDot =
    connectionState === "connected"
      ? "bg-emerald-500"
      : connectionState === "connecting"
        ? "bg-amber-500"
        : "bg-rose-500";
  const connectionLabel =
    connectionState === "connected"
      ? "연결됨"
      : connectionState === "connecting"
        ? "연결중"
        : "연결 끊김";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            AI Triage + Care Coordination
          </p>
          <h3 className="text-2xl font-semibold text-slate-900">
            Case Room Clinical Workspace
          </h3>
          <p className="text-sm text-slate-600">
            모델 결과 → 표준화 지표 → 알림 → 케이스 룸 → 타임라인 → LLM 요약이
            실제 워크플로우를 구동합니다. 팀 알림은 모바일 앱에서 처리합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${connectionDot}`} />
              <Wifi className="h-3.5 w-3.5" />
              WebSocket {connectionLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              지연 {systemStatus.dataLatency}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
            {roles.map((option) => (
              <Button
                key={option}
                size="sm"
                variant={role === option ? "default" : "ghost"}
                className={
                  role === option
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }
                onClick={() => setRole(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <DemoGuide />

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)_420px]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-500" />
                케이스 룸 리스트
              </h4>
              <Button size="sm" variant="outline">
                새 케이스
              </Button>
            </div>
            <Input placeholder="환자 케이스 검색" className="bg-slate-50" />
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Case room 정책</p>
              <p>AI 알림/의료진 액션/고위험 상태 진입 시 자동 활성화됩니다.</p>
              <p>모든 환자는 케이스 룸으로 유지하지 않습니다.</p>
              <p>수동 생성과 pin이 가능하며, 비활성 24시간 후 자동 아카이빙됩니다.</p>
              <p>팀 단위 커뮤니케이션은 모바일 알림 앱에서 처리합니다.</p>
            </div>
          </div>
          <ScrollArea className="h-[680px]">
            <div className="space-y-6 p-4">
              <AlertFeed
                alerts={alertItems}
                activeRoomId={activeRoom.id}
                onOpen={(roomId) => setActiveRoomId(roomId)}
              />
              <RoomSection
                title="활성 케이스 룸"
                subtitle="위험도/최근 변화 자동 정렬"
                rooms={sortedCaseRooms}
                activeRoomId={activeRoom.id}
                onSelect={setActiveRoomId}
                icon={Stethoscope}
                showStatus
                activeCountLabel="4 active / 24 admitted"
              />
              <MobileAlertCard />
              <RoomSection
                title="아카이브"
                subtitle="최근 24시간 내 비활성"
                rooms={archivedRooms}
                activeRoomId={activeRoom.id}
                onSelect={setActiveRoomId}
                icon={Archive}
                showStatus
              />
            </div>
          </ScrollArea>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CaseHeader room={activeRoom} patient={patient} />
          <div className="px-4 pb-4 space-y-4">
            <ScrollArea className="h-[520px] pr-2">
              <div className="space-y-3">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            </ScrollArea>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <Input
                placeholder="메시지 작성 (데모)"
                className="bg-white"
                disabled
              />
              <Button size="sm" disabled>
                전송
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-slate-200 px-4 py-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Patient panel
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {patient ? `${patient.name} · ${patient.location}` : "환자 케이스 선택"}
                  </p>
                </div>
                {patient && (
                  <Badge
                    variant="outline"
                    className={`border ${riskTone[patient.riskLevel].className}`}
                  >
                    {riskTone[patient.riskLevel].label}
                  </Badge>
                )}
              </div>
              <TabsList className="w-full justify-start bg-slate-100">
                <TabsTrigger value="overview">Patient Overview</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Clinical Documents</TabsTrigger>
              </TabsList>
            </div>
            <div className="p-4">
              <TabsContent value="overview" className="mt-0">
                <PatientOverviewPanel
                  patient={patient}
                  summary={summary}
                  insights={domainInsights}
                  timeline={timelineEvents}
                  systemStatus={systemStatus}
                />
              </TabsContent>
              <TabsContent value="analysis" className="mt-0">
                <AIAnalysisPanel
                  patient={patient}
                  insights={domainInsights}
                  role={role}
                  systemStatus={systemStatus}
                />
              </TabsContent>
              <TabsContent value="timeline" className="mt-0">
                <TimelinePanel
                  patient={patient}
                  timeline={timelineEvents}
                  summary={summary}
                  role={role}
                  activityLog={activityLog}
                />
              </TabsContent>
              <TabsContent value="documents" className="mt-0">
                <ClinicalDocumentsPanel
                  patient={patient}
                  documents={patient ? documentsByPatient[patient.id] ?? [] : []}
                />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

type AlertFeedProps = {
  alerts: AlertFeedItem[];
  activeRoomId: string;
  onOpen: (roomId: string) => void;
};

function AlertFeed({ alerts, activeRoomId, onOpen }: AlertFeedProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <Bell className="h-3.5 w-3.5" />
          AI Alert Feed
        </div>
        <Badge
          variant="outline"
          className="border border-slate-200 bg-slate-50 text-slate-600"
        >
          {alerts.length} alerts
        </Badge>
      </div>
      <div className="space-y-2">
        {alerts.map((alert) => {
          const Icon = domainIcon[alert.domain];
          return (
            <button
              key={alert.id}
              className={`w-full rounded-xl border p-3 text-left transition ${
                alert.roomId === activeRoomId
                  ? "border-slate-400 bg-slate-100"
                  : `hover:bg-slate-50 ${alertTone[alert.severity]}`
              }`}
              onClick={() => onOpen(alert.roomId)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="uppercase tracking-[0.2em]">
                      {domainLabel[alert.domain]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {alert.title}
                  </p>
                  <p className="text-xs text-slate-500">{alert.detail}</p>
                </div>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                <Badge
                  variant="outline"
                  className={`border ${riskTone[alert.severity].className}`}
                >
                  {riskTone[alert.severity].label}
                </Badge>
                <span>{alert.change}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type RoomSectionProps = {
  title: string;
  subtitle?: string;
  activeCountLabel?: string;
  rooms: Room[];
  activeRoomId: string;
  onSelect: (id: string) => void;
  icon?: IconType;
  showStatus?: boolean;
};

function RoomSection({
  title,
  subtitle,
  activeCountLabel,
  rooms,
  activeRoomId,
  onSelect,
  icon: Icon = Stethoscope,
  showStatus = false,
}: RoomSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </div>
        {activeCountLabel && (
          <span className="text-[10px] text-slate-500">{activeCountLabel}</span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      <div className="space-y-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            className={`w-full rounded-xl border p-3 text-left transition ${
              room.id === activeRoomId
                ? "border-slate-400 bg-slate-100"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
            onClick={() => onSelect(room.id)}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {room.label}
                </p>
                {room.patientCode && (
                  <p className="text-[11px] text-slate-400">
                    ID {room.patientCode}
                  </p>
                )}
                <p className="text-xs text-slate-500">{room.sublabel}</p>
                {room.recentDomains && room.recentDomains.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    {room.recentDomains.map((domain) => {
                      const Icon = domainIcon[domain];
                      return (
                        <span
                          key={`${room.id}-${domain}`}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1"
                        >
                          <Icon className="h-3 w-3 text-slate-500" />
                          {domainLabel[domain]}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{room.updatedAt}</p>
                {room.unread > 0 && (
                  <span className="mt-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">
                    {room.unread}
                  </span>
                )}
              </div>
            </div>
            {showStatus && room.status && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <Badge
                  variant="outline"
                  className={`border ${roomStatusTone[room.status]}`}
                >
                  {roomStatusLabel[room.status]}
                </Badge>
                {room.riskLevel && (
                  <Badge
                    variant="outline"
                    className={`border ${riskTone[room.riskLevel].className}`}
                  >
                    {riskTone[room.riskLevel].label}
                  </Badge>
                )}
                {room.activation && (
                  <span className="text-[11px] text-slate-500">
                    {room.activation}
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileAlertCard() {
  return (
    <Card className="border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        <Smartphone className="h-3.5 w-3.5" />
        Mobile Alert App
      </div>
      <p className="mt-2 text-xs text-slate-600">
        팀 단위 알림 수신과 케이스 즉시 진입은 모바일 앱에서 처리합니다.
      </p>
      <div className="mt-3 space-y-2 text-xs text-slate-600">
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
          ICU Team: High risk detected - Patient 123
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
          Stroke Team: New CT finding - review needed
        </div>
      </div>
    </Card>
  );
}

type CaseHeaderProps = {
  room: Room;
  patient: Patient | null;
};

function CaseHeader({ room, patient }: CaseHeaderProps) {
  if (!patient) {
    return (
      <div className="border-b border-slate-200 p-4">
        <p className="text-sm text-slate-600">
          선택된 케이스 룸이 없습니다. 좌측에서 환자 케이스 룸을 선택하세요.
        </p>
      </div>
    );
  }

  const risk = riskTone[patient.riskLevel];
  const status = statusTone[patient.status];

  return (
    <div className="border-b border-slate-200 p-4 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Case Room
          </p>
          <h4 className="text-xl font-semibold text-slate-900">{patient.name}</h4>
          <p className="text-sm text-slate-600">
            {patient.patientId} · {patient.age}세 · {patient.gender}
          </p>
          <p className="text-xs text-slate-500">
            {patient.location} · {patient.bed}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={`border ${risk.className}`}>
            {risk.label}
          </Badge>
          <Badge variant="outline" className={`border ${status.className}`}>
            {status.label}
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {room.status && (
          <Badge
            variant="outline"
            className={`border ${roomStatusTone[room.status]}`}
          >
            {roomStatusLabel[room.status]}
          </Badge>
        )}
        {room.activation && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
            {room.activation}
          </span>
        )}
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
          Last update {room.updatedAt}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Button size="sm" variant="outline" className="text-xs">
          <Pin className="h-3 w-3" />
          케이스 고정
        </Button>
        <Button size="sm" variant="outline" className="text-xs">
          <Archive className="h-3 w-3" />
          아카이브
        </Button>
      </div>
    </div>
  );
}

type PatientOverviewPanelProps = {
  patient: Patient | null;
  summary: LlmSummary | null;
  insights: DomainInsight[];
  timeline: TimelineEvent[];
  systemStatus: SystemStatus;
};

function PatientOverviewPanel({
  patient,
  summary,
  insights,
  timeline,
  systemStatus,
}: PatientOverviewPanelProps) {
  if (!patient) {
    return (
      <Card className="border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        환자 케이스를 선택하면 Patient Overview가 표시됩니다.
      </Card>
    );
  }

  const risk = riskTone[patient.riskLevel];
  const status = statusTone[patient.status];
  const recentEvents = timeline.slice(-3).reverse();
  const findIndicator = (domain: DomainKey, label: string) => {
    const insight = insights.find((item) => item.key === domain);
    if (!insight || insight.status === "no-data") return "No data";
    return (
      insight.standardized.find((item) => item.label === label)?.value ?? "No data"
    );
  };

  const imagingValue =
    findIndicator("imaging", "Urgency Flag") !== "No data"
      ? findIndicator("imaging", "Urgency Flag")
      : findIndicator("imaging", "Lesion Detected");

  const domainSnapshot = [
    { label: "Cardio Risk", value: findIndicator("ecg", "Arrhythmia Risk") },
    { label: "ICU Deterioration", value: findIndicator("icu", "Risk Level") },
    { label: "Imaging Alert", value: imagingValue },
    { label: "Neuro Risk", value: findIndicator("neuro", "Decline Risk Level") },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Patient Overview
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {patient.name}
            </p>
            <p className="text-sm text-slate-600">
              {patient.patientId} · {patient.age}세 · {patient.gender}
            </p>
            <p className="text-xs text-slate-500">
              {patient.location} · {patient.bed}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={`border ${risk.className}`}>
              {risk.label}
            </Badge>
            <Badge variant="outline" className={`border ${status.className}`}>
              {status.label}
            </Badge>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {patient.diagnosisTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-white px-3 py-1"
            >
              {tag}
            </span>
          ))}
          <Badge
            variant="outline"
            className="border border-slate-200 bg-slate-50 text-slate-600"
          >
            Last sync {systemStatus.lastSync}
          </Badge>
        </div>
        <div className="mt-4 grid gap-3 text-xs text-slate-600 md:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-700">Location / Bed</p>
            <p>
              {patient.location} · {patient.bed}
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">연동 시스템</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                <Database className="h-3 w-3" />
                EHR {patient.ehrId}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                <MonitorCheck className="h-3 w-3" />
                PACS {patient.pacsId}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                <Activity className="h-3 w-3" />
                Vitals
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700">
            Risk Summary
          </h4>
          <Badge
            variant="outline"
            className="border border-slate-200 bg-slate-50 text-slate-600"
          >
            Structured
          </Badge>
        </div>
        <div className="mt-3 space-y-2 text-xs text-slate-600">
          {summary ? (
            summary.structured.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">
                  {item.label}
                </span>
                <span>{item.value}</span>
              </div>
            ))
          ) : (
            <p>요약 데이터가 아직 없습니다.</p>
          )}
        </div>
        <div className="mt-4 grid gap-2 text-xs text-slate-600 md:grid-cols-2">
          {domainSnapshot.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700">
            최근 주요 이벤트
          </h4>
          <Badge
            variant="outline"
            className="border border-slate-200 bg-slate-50 text-slate-600"
          >
            Timeline
          </Badge>
        </div>
        <div className="mt-3 space-y-2 text-xs text-slate-600">
          {recentEvents.length > 0 ? (
            recentEvents.map((event) => (
              <div
                key={`${event.time}-${event.label}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <span className="font-semibold text-slate-700">{event.time}</span>
                <span className="flex-1 text-slate-600">{event.label}</span>
                <span className="uppercase tracking-[0.2em] text-[10px] text-slate-400">
                  {event.type}
                </span>
              </div>
            ))
          ) : (
            <p>최근 이벤트가 없습니다.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function CasePipeline() {
  return (
    <Card className="border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Workflow driver
          </p>
          <p className="text-sm font-semibold text-slate-700">
            모델 결과가 케이스 룸을 구동하는 흐름
          </p>
        </div>
        <Badge
          variant="outline"
          className="border border-slate-200 bg-white text-slate-600"
        >
          Live
        </Badge>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-slate-600 md:grid-cols-3">
        {[
          "Raw model output",
          "Clinical standardization",
          "Risk/Trend abstraction",
          "Alert/Triage",
          "Case room activation",
          "Timeline + LLM Summary (timeline 기반)",
        ].map((step) => (
          <div
            key={step}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            {step}
          </div>
        ))}
      </div>
    </Card>
  );
}

function DemoGuide() {
  return (
    <Card className="border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Demo guide
          </p>
          <h4 className="text-lg font-semibold text-slate-900">
            현재 데모 기능과 작동 흐름
          </h4>
        </div>
        <Badge
          variant="outline"
          className="border border-slate-200 bg-slate-50 text-slate-600"
        >
          Help
        </Badge>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 text-sm text-slate-600">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            데모에서 체험 가능한 기능
          </p>
          <ol className="space-y-2 text-sm">
            <li>1. AI 기반 케이스 룸 자동 생성/활성화</li>
            <li>2. 실시간 알림 (WebSocket 모킹)</li>
            <li>3. AI Analysis 탭 (ECG/Imaging/ICU/Neuro)</li>
            <li>4. Timeline 기반 이벤트 기록/요약</li>
            <li>5. Clinical Documents 검색 (VectorDB + LLM)</li>
          </ol>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
            <p className="font-semibold text-slate-700">작동 구조 요약</p>
            <ol className="mt-2 space-y-1">
              <li>1) 데이터 수집 → 모델 분석</li>
              <li>2) Standardization layer → 지표 추출</li>
              <li>3) 알림 생성 → 케이스 룸 활성화</li>
              <li>4) 협업 메시지 + Timeline 기록</li>
              <li>5) LLM 요약 업데이트 (Timeline 기반)</li>
              <li>6) 문헌 검색 + 근거 요약 전달</li>
            </ol>
          </div>
          <CasePipeline />
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
            <p className="font-semibold text-slate-700">디바이스 역할 분리</p>
            <div className="mt-2 space-y-1">
              <p>Desktop: 케이스 분석 + 협업 + AI 해석</p>
              <p>Mobile: 팀 알림 수신 + 케이스 바로 진입</p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
            <p className="font-semibold text-slate-700">LLM/VectorDB 정책</p>
            <p className="mt-2">
              문헌 검색과 근거 요약만 수행하며, 진단/치료 권고는 제공하지 않습니다.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              WebSocket 모킹 구조
            </p>
            <p className="text-sm text-slate-600">
              setTimeout 기반 이벤트로 실시간 알림/채팅 흐름을 시뮬레이션합니다.
            </p>
            <pre className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 whitespace-pre-wrap">
              {websocketMockSnippet}
            </pre>
          </div>
        </div>
      </div>
    </Card>
  );
}

type MessageBubbleProps = {
  message: Message;
};

function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={`rounded-xl border p-3 text-sm text-slate-700 ${messageTone[message.type]}`}
    >
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {message.type === "alert" && (
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          )}
          {message.type === "ai" && (
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
          )}
          <span className="font-semibold text-slate-700">
            {message.sender}
          </span>
          <span>{message.role}</span>
        </div>
        <span>{message.time}</span>
      </div>
      <p className="mt-2 text-slate-700">{message.content}</p>
    </div>
  );
}

type TimelinePanelProps = {
  patient: Patient | null;
  timeline: TimelineEvent[];
  summary: LlmSummary | null;
  role: Role;
  activityLog: ActivityLog[];
};

function TimelinePanel({
  patient,
  timeline,
  summary,
  role,
  activityLog,
}: TimelinePanelProps) {
  if (!patient) {
    return (
      <Card className="border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        선택된 환자 케이스가 없습니다. 환자 케이스 룸을 선택해 타임라인을 확인하세요.
      </Card>
    );
  }

  const tone: Record<TimelineEvent["type"], string> = {
    ai: "bg-amber-50 text-amber-700 border-amber-200",
    clinical: "bg-slate-50 text-slate-700 border-slate-200",
    lab: "bg-sky-50 text-sky-700 border-sky-200",
    system: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            최근 12시간 요약
          </h4>
          <Badge
            variant="outline"
            className="border border-slate-200 bg-slate-50 text-slate-600"
          >
            Timeline 기반
          </Badge>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          모델 업데이트, 의료진 액션, 검사 이벤트가 시간순으로 기록됩니다.
          LLM 요약은 타임라인 이벤트만을 입력으로 사용합니다.
        </p>
      </Card>

      {summary ? (
        <LLMSummaryPanel summary={summary} />
      ) : (
        <Card className="border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          요약 데이터가 아직 없습니다.
        </Card>
      )}

      <Card className="border-slate-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">
          Clinical Timeline
        </h4>
        <div className="space-y-3">
          {timeline.map((event) => (
            <div
              key={`${event.time}-${event.label}`}
              className={`flex items-start justify-between gap-4 rounded-lg border px-3 py-2 text-xs ${tone[event.type]}`}
            >
              <span className="font-semibold">{event.time}</span>
              <span className="flex-1 text-sm text-slate-700">
                {event.label}
              </span>
              <span className="uppercase tracking-[0.2em] text-[10px]">
                {event.type}
              </span>
              <Button size="sm" variant="outline" className="text-[10px]">
                미리보기
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {role === "Admin" ? (
        <AuditLogPanel activityLog={activityLog} />
      ) : (
        <Card className="border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          Audit log는 관리자 권한에서만 조회할 수 있습니다.
        </Card>
      )}
    </div>
  );
}

type AIAnalysisPanelProps = {
  patient: Patient | null;
  insights: DomainInsight[];
  role: Role;
  systemStatus: SystemStatus;
};

function AIAnalysisPanel({
  patient,
  insights,
  role,
  systemStatus,
}: AIAnalysisPanelProps) {
  if (!patient) {
    return (
      <Card className="border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        환자 케이스를 선택하면 AI Analysis 탭이 활성화됩니다.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700">
            Clinical Standardized Indicators
          </h4>
          <Badge
            variant="outline"
            className="border border-slate-200 bg-slate-50 text-slate-600"
          >
            Raw outputs hidden
          </Badge>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          분석은 AI Analysis 탭에서만 노출됩니다. 임상 지표는 표준화된 결과로
          기본 노출되며 근거 데이터는 클릭 시 상세 보기로 확인합니다.
        </p>
      </Card>

      <Card className="border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Data quality
          </p>
          <Badge
            variant="outline"
            className="border border-slate-200 bg-slate-50 text-slate-600"
          >
            Latency {systemStatus.dataLatency}
          </Badge>
        </div>
        <div className="mt-3 space-y-2 text-xs text-slate-600">
          {systemStatus.warnings.map((warning) => (
            <div
              key={warning}
              className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2"
            >
              <span>{warning}</span>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3">
        {insights.map((insight) => (
          <DomainModuleCard
            key={insight.key}
            insight={insight}
            role={role}
          />
        ))}
      </div>
    </div>
  );
}

type ClinicalDocumentsPanelProps = {
  patient: Patient | null;
  documents: ClinicalDocument[];
};

function ClinicalDocumentsPanel({
  patient,
  documents,
}: ClinicalDocumentsPanelProps) {
  const [query, setQuery] = useState("");
  const filteredDocuments = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return documents;
    return documents.filter((doc) => {
      const pool = [doc.title, doc.summary, doc.tags.join(" ")].join(" ").toLowerCase();
      return pool.includes(keyword);
    });
  }, [documents, query]);

  if (!patient) {
    return (
      <Card className="border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        환자 케이스를 선택하면 문헌 검색 탭이 활성화됩니다.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Evidence search
            </p>
            <p className="text-sm font-semibold text-slate-700">
              Clinical Documents (VectorDB)
            </p>
          </div>
          <Badge
            variant="outline"
            className="border border-slate-200 bg-slate-50 text-slate-600"
          >
            Evidence only
          </Badge>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          문헌 검색은 병원 승인 문서/프로토콜/논문 요약본을 기반으로 하며,
          진단/치료 추론은 제공하지 않습니다.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Responses are generated from hospital-approved documents only.
        </p>
      </Card>

      <div className="flex items-center gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="자연어 질의 입력 (데모)"
          className="bg-white"
        />
        <Button size="sm" variant="outline">
          검색
        </Button>
      </div>

      <div className="space-y-3">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {doc.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {doc.source} · Updated {doc.updatedAt}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border border-slate-200 bg-slate-50 text-slate-600"
                >
                  Document
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">{doc.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
                <Button size="sm" variant="outline" className="text-xs">
                  원문 보기
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            검색 결과가 없습니다.
          </Card>
        )}
      </div>
    </div>
  );
}

type DomainModuleCardProps = {
  insight: DomainInsight;
  role: Role;
};

function DomainModuleCard({ insight, role }: DomainModuleCardProps) {
  const Icon = domainIcon[insight.key];
  const canViewRaw = role !== "Nurse";
  const riskScoreValue =
    insight.key === "icu"
      ? Number(
          insight.standardized
            .find((item) => item.label === "Risk Score")
            ?.value.split(" ")[0] ?? 0,
        )
      : 0;

  if (insight.status === "no-data") {
    return (
      <Card className="border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-600">{insight.title}</p>
          </div>
          <Badge
            variant="outline"
            className={`border ${qualityTone[insight.quality]}`}
          >
            Data 없음
          </Badge>
        </div>
        <p className="mt-2 text-xs text-slate-500">{insight.note}</p>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Icon className="h-4 w-4 text-slate-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-800">{insight.title}</p>
            <p className="text-xs text-slate-500">
              Updated {insight.lastUpdated}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs text-slate-500">
          <Badge
            variant="outline"
            className={`border ${qualityTone[insight.quality]}`}
          >
            {insight.quality === "good"
              ? "Quality good"
              : insight.quality === "limited"
                ? "Quality limited"
                : "Quality missing"}
          </Badge>
          <span>Conf. {insight.confidence}</span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs text-slate-600">
        {insight.standardized.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>

      {insight.drivers && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Drivers Top-k</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {insight.drivers.map((driver) => (
              <span
                key={driver}
                className="rounded-full border border-slate-200 bg-white px-2 py-1"
              >
                {driver}
              </span>
            ))}
          </div>
        </div>
      )}

      {insight.key === "icu" && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-500">Risk score</p>
          <Progress value={riskScoreValue} className="mt-2 bg-slate-100" />
        </div>
      )}

      {canViewRaw ? (
        <div className="mt-3 text-xs text-slate-600">
          <details className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <summary className="cursor-pointer font-semibold text-slate-700">
              Evidence links &amp; Raw outputs (hidden by default)
            </summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {insight.evidence.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1"
                >
                  <MonitorCheck className="h-3 w-3" />
                  {item}
                </span>
              ))}
            </div>
            <ul className="mt-2 space-y-1">
              {insight.rawOutputs.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </details>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          Raw outputs 및 근거 데이터는 Doctor/Admin 권한에서만 확인할 수 있습니다.
        </p>
      )}
    </Card>
  );
}

type LLMSummaryPanelProps = {
  summary: LlmSummary;
};

function LLMSummaryPanel({ summary }: LLMSummaryPanelProps) {
  return (
    <Card className="border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            LLM Summary
          </p>
          <p className="text-sm font-semibold text-slate-700">
            Structured + Narrative
          </p>
        </div>
        <Badge
          variant="outline"
          className="border border-slate-200 bg-white text-slate-600"
        >
          RAG
        </Badge>
      </div>
      <div className="mt-3 space-y-2 text-xs text-slate-600">
        {summary.structured.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-700">{summary.narrative}</p>
      <p className="mt-2 text-xs text-slate-500">
        Inputs: structured indicators + timeline events (RAG).
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
        {summary.evidence.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-200 bg-white px-2 py-1"
          >
            {item}
          </span>
        ))}
        <Button size="sm" variant="outline" className="text-xs">
          근거 보기
        </Button>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Summary generated from structured indicators and timeline events. No diagnosis/therapy recommendation provided.
      </p>
    </Card>
  );
}

type AuditLogPanelProps = {
  activityLog: ActivityLog[];
};

function AuditLogPanel({ activityLog }: AuditLogPanelProps) {
  return (
    <Card className="border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Audit & Activity Log
      </p>
      <div className="mt-3 space-y-2 text-xs text-slate-600">
        {activityLog.map((log) => (
          <div
            key={`${log.time}-${log.label}`}
            className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <span className="font-semibold text-slate-700">{log.time}</span>
            <span className="flex-1">{log.label}</span>
            <span className="text-slate-500">{log.actor}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
