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
  Stethoscope,
  Users,
  Wifi,
} from "lucide-react";

type Role = "Doctor" | "Nurse" | "Admin";
type RoomType = "case" | "team";
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
  type: RoomType;
  label: string;
  sublabel: string;
  patientId?: string;
  riskLevel?: RiskLevel;
  status?: RoomStatus;
  activation?: string;
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

type ActivityLog = {
  time: string;
  label: string;
  actor: string;
};

type ClinicianStatus = "online" | "busy" | "offline";

type Clinician = {
  id: string;
  name: string;
  role: string;
  team: string;
  status: ClinicianStatus;
};

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

const clinicianStatusTone: Record<ClinicianStatus, string> = {
  online: "bg-emerald-500",
  busy: "bg-amber-500",
  offline: "bg-slate-400",
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

const clinicians: Clinician[] = [
  {
    id: "cl-001",
    name: "정현우",
    role: "Cardiology MD",
    team: "CICU",
    status: "online",
  },
  {
    id: "cl-002",
    name: "김보라",
    role: "ICU RN",
    team: "ICU",
    status: "busy",
  },
  {
    id: "cl-003",
    name: "서지훈",
    role: "Neurology MD",
    team: "Neuro",
    status: "online",
  },
  {
    id: "cl-004",
    name: "박은지",
    role: "ER RN",
    team: "ER",
    status: "online",
  },
  {
    id: "cl-005",
    name: "조현석",
    role: "Radiology",
    team: "Imaging",
    status: "offline",
  },
];

const initialCaseRooms: Room[] = [
  {
    id: "room-pt-001",
    type: "case",
    label: "김철수",
    sublabel: "CICU-12 · ECG 위험 상승",
    patientId: "pt-001",
    riskLevel: "critical",
    status: "auto",
    activation: "Arrhythmia risk HIGH 감지",
    updatedAt: "14:18",
    unread: 3,
  },
  {
    id: "room-pt-003",
    type: "case",
    label: "박민수",
    sublabel: "ICU-03 · Risk spike",
    patientId: "pt-003",
    riskLevel: "high",
    status: "pinned",
    activation: "ICU risk 78 → 92",
    updatedAt: "14:08",
    unread: 1,
  },
  {
    id: "room-pt-004",
    type: "case",
    label: "최지원",
    sublabel: "ER-02 · Imaging alert",
    patientId: "pt-004",
    riskLevel: "high",
    status: "auto",
    activation: "New lesion detected",
    updatedAt: "14:05",
    unread: 2,
  },
];

const archivedRooms: Room[] = [
  {
    id: "room-pt-002",
    type: "case",
    label: "이영희",
    sublabel: "NEU-07 · Neuro follow-up",
    patientId: "pt-002",
    riskLevel: "medium",
    status: "archived",
    activation: "Neuro follow-up 완료",
    updatedAt: "13:20",
    unread: 0,
  },
];

const teamRooms: Room[] = [
  {
    id: "room-team-stroke",
    type: "team",
    label: "Stroke Team",
    sublabel: "응급 뇌졸중 대응",
    updatedAt: "14:20",
    unread: 4,
  },
  {
    id: "room-team-icu",
    type: "team",
    label: "ICU Team",
    sublabel: "중환자실 야간 협업",
    updatedAt: "14:08",
    unread: 1,
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
  "room-team-stroke": [
    {
      id: "msg-401",
      sender: "Stroke Team",
      role: "Coordinator",
      time: "14:14",
      type: "system",
      content: "ER-02 케이스 활성화. 영상 검토 진행 중.",
    },
  ],
  "room-team-icu": [
    {
      id: "msg-501",
      sender: "ICU Team",
      role: "Charge Nurse",
      time: "14:06",
      type: "system",
      content: "위험 환자 2명 pin 처리 완료. 상태 공유 바랍니다.",
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

const initialSystemStatus = {
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
  const [alertItems, setAlertItems] = useState<AlertFeedItem[]>(initialAlerts);
  const [caseRoomItems, setCaseRoomItems] = useState<Room[]>(initialCaseRooms);
  const [messageMap, setMessageMap] = useState<Record<string, Message[]>>(
    initialMessagesByRoom,
  );
  const [timelineMap, setTimelineMap] = useState<Record<string, TimelineEvent[]>>(
    initialTimelineByRoom,
  );
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
      setCaseRoomItems((prev) => {
        const idx = prev.findIndex((room) => room.id === payload.alert.roomId);
        if (idx >= 0) {
          const next = [...prev];
          const current = next[idx];
          next[idx] = {
            ...current,
            updatedAt: payload.alert.time,
            unread: current.unread + 1,
            status: current.status ?? "auto",
            activation: payload.alert.title,
            riskLevel: payload.alert.severity,
          };
          return next;
        }
        const patient = patients.find((item) => item.id === payload.alert.patientId);
        return [
          {
            id: payload.alert.roomId,
            type: "case",
            label: patient?.name ?? payload.alert.patientId,
            sublabel: patient
              ? `${patient.location}-${patient.bed} · ${payload.alert.title}`
              : payload.alert.title,
            patientId: payload.alert.patientId,
            riskLevel: payload.alert.severity,
            status: "auto",
            activation: payload.alert.title,
            updatedAt: payload.alert.time,
            unread: 1,
          },
          ...prev,
        ];
      });
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
        });
      }, 20000),
    ];

    return () => {
      window.clearTimeout(connectTimer);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const allRooms = useMemo(
    () => [...caseRoomItems, ...teamRooms, ...archivedRooms],
    [caseRoomItems],
  );
  const activeRoom = useMemo(
    () => allRooms.find((room) => room.id === activeRoomId) ?? caseRoomItems[0],
    [activeRoomId, allRooms, caseRoomItems],
  );
  const patient = useMemo(
    () =>
      activeRoom.patientId
        ? patients.find((item) => item.id === activeRoom.patientId) ?? null
        : null,
    [activeRoom],
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
    ? domainInsightsByPatient[patient.id] ?? []
    : [];
  const summary = patient ? summaryByPatient[patient.id] : null;
  const patientModelSummary = summary
    ? summary.structured
        .slice(0, 2)
        .map((item) => `${item.label}: ${item.value}`)
        .join(" · ")
    : "최근 모델 요약 없음";
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
            실제 워크플로우를 구동합니다.
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

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)_360px]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-500" />
                케이스 룸 네비게이션
              </h4>
              <Button size="sm" variant="outline">
                새 케이스
              </Button>
            </div>
            <Input placeholder="환자/채널 검색" className="bg-slate-50" />
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Case room 정책</p>
              <p>AI 알림/의료진 액션/고위험 상태 진입 시 자동 활성화됩니다.</p>
              <p>수동 생성과 pin이 가능하며, 비활성 24시간 후 자동 아카이빙됩니다.</p>
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
              <RoomSection
                title="팀 채널"
                rooms={teamRooms}
                activeRoomId={activeRoom.id}
                onSelect={setActiveRoomId}
                icon={Users}
              />
              <ClinicianDirectory clinicians={clinicians} />
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
          <PatientHeader
            room={activeRoom}
            patient={patient}
            role={role}
            modelSummary={patientModelSummary}
          />

          <div className="px-4 pb-4 space-y-4">
            <CasePipeline />
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="w-full justify-start bg-slate-100">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-4 space-y-4">
                <ScrollArea className="h-[420px] pr-2">
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
              </TabsContent>
              <TabsContent value="timeline" className="mt-4">
                <TimelinePanel patient={patient} timeline={timelineEvents} />
              </TabsContent>
              <TabsContent value="data" className="mt-4">
                <DataPanel patient={patient} insights={domainInsights} role={role} />
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Data health
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  실시간 데이터 상태
                </p>
              </div>
              <Badge
                variant="outline"
                className="border border-slate-200 bg-slate-50 text-slate-600"
              >
                Sync {systemStatus.lastSync}
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

          <Card className="border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Clinical standardization
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  Feature Standardization Layer
                </p>
              </div>
              <ShieldCheck className="h-4 w-4 text-slate-500" />
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-600">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span>Raw model outputs</span>
                <span className="font-semibold text-slate-700">Hidden</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span>Clinical indicators</span>
                <span className="font-semibold text-slate-700">Visible</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span>Alert trigger</span>
                <span className="font-semibold text-slate-700">On change</span>
              </div>
            </div>
          </Card>

          <AIInsightPanel
            patient={patient}
            insights={domainInsights}
            summary={summary}
            role={role}
            activityLog={activityLog}
          />
        </div>
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
  icon?: typeof Users;
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
                <p className="text-xs text-slate-500">{room.sublabel}</p>
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

type ClinicianDirectoryProps = {
  clinicians: Clinician[];
};

function ClinicianDirectory({ clinicians }: ClinicianDirectoryProps) {
  const onlineCount = clinicians.filter((clinician) => clinician.status !== "offline").length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <Users className="h-3.5 w-3.5" />
          의료진 목록
        </div>
        <Badge
          variant="outline"
          className="border border-slate-200 bg-slate-50 text-slate-600"
        >
          {onlineCount} online
        </Badge>
      </div>
      <p className="text-xs text-slate-500">
        빠른 멘션/1:1 메시지/그룹 초대를 지원합니다.
      </p>
      <div className="space-y-2">
        {clinicians.map((clinician) => (
          <div
            key={clinician.id}
            className="rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {clinician.name.slice(0, 1)}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white ${clinicianStatusTone[clinician.status]}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {clinician.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {clinician.role} · {clinician.team}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Button size="sm" variant="outline" className="text-xs">
                  @멘션
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  1:1
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  초대
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type PatientHeaderProps = {
  room: Room;
  patient: Patient | null;
  role: Role;
  modelSummary?: string;
};

export function PatientHeader({
  room,
  patient,
  role,
  modelSummary,
}: PatientHeaderProps) {
  if (!patient) {
    return (
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Team Channel
            </p>
            <h4 className="text-lg font-semibold text-slate-900">{room.label}</h4>
            <p className="text-sm text-slate-600">{room.sublabel}</p>
          </div>
          <Badge
            variant="outline"
            className="border border-slate-200 bg-slate-50 text-slate-600"
          >
            팀 협업
          </Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
            케이스 룸 연결 필요
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
            AI 알림 공유 전용
          </span>
        </div>
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
          <h4 className="text-xl font-semibold text-slate-900">
            {patient.name}
          </h4>
          <p className="text-sm text-slate-600">
            {patient.age}세 · {patient.gender} · {patient.location}
          </p>
          <p className="text-xs text-slate-500">Patient ID {patient.patientId}</p>
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
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
        {patient.diagnosisTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-white px-3 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        최근 모델 요약: {modelSummary}
      </p>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 md:grid-cols-2">
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
          Last sync 2 min ago
        </span>
        {role !== "Nurse" && (
          <Button size="sm" variant="outline" className="text-xs">
            데이터 내보내기
          </Button>
        )}
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
          "Case room update",
          "Timeline + LLM Summary",
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
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            제공 기능
          </p>
          <ol className="space-y-2 text-sm">
            <li>1. 실시간 채팅 (의료진 메시지 + AI 이벤트 메시지)</li>
            <li>2. AI 경고/알림 (모델 변화 기반 자동 삽입)</li>
            <li>3. AI 분석 결과 표시 (ECG/Imaging/ICU/Neuro)</li>
            <li>4. 케이스 Timeline (검사/추론/액션 기록)</li>
            <li>5. LLM 요약 (구조화 지표 + 근거 링크)</li>
          </ol>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
            <p className="font-semibold text-slate-700">작동 흐름 예시</p>
            <ol className="mt-2 space-y-1">
              <li>1) ECG/시계열 데이터 도착 → 모델 분석</li>
              <li>2) Standardization layer → Risk/Trend 추출</li>
              <li>3) WebSocket 모킹 → 알림 생성</li>
              <li>4) 케이스 룸 자동 생성/갱신</li>
              <li>5) 의료진 협업 + Timeline 기록</li>
              <li>6) LLM 요약 업데이트</li>
            </ol>
          </div>
        </div>
        <div className="space-y-3">
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
};

export function TimelinePanel({ patient, timeline }: TimelinePanelProps) {
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
          최근 12시간 동안 모델 업데이트와 의료진 액션 로그가 기록되었습니다.
          요약은 타임라인 이벤트를 기반으로 생성됩니다.
        </p>
      </Card>

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
    </div>
  );
}

type DataPanelProps = {
  patient: Patient | null;
  insights: DomainInsight[];
  role: Role;
};

function DataPanel({ patient, insights, role }: DataPanelProps) {
  if (!patient) {
    return (
      <Card className="border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        환자 케이스를 선택하면 데이터 탭이 활성화됩니다.
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
          임상 지표는 표준화된 결과로 기본 노출됩니다. 근거 데이터는 클릭 시 상세
          보기로 제공됩니다.
        </p>
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

type AIInsightPanelProps = {
  patient: Patient | null;
  insights: DomainInsight[];
  summary: LlmSummary | null;
  role: Role;
  activityLog: ActivityLog[];
};

export function AIInsightPanel({
  patient,
  insights,
  summary,
  role,
  activityLog,
}: AIInsightPanelProps) {
  if (!patient || !summary) {
    return (
      <Card className="border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          환자 케이스를 선택하면 AI 분석 패널이 표시됩니다.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          AI Insight Panel
        </p>
        <h4 className="text-lg font-semibold text-slate-900">
          {patient.name} · {patient.location}
        </h4>
        <p className="text-xs text-slate-500">Last updated {summary.lastUpdated}</p>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <DomainModuleCard
            key={insight.key}
            insight={insight}
            role={role}
          />
        ))}
      </div>

      <LLMSummaryPanel summary={summary} />

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Clinician Questions
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            위험 증가 원인
          </Button>
          <Button size="sm" variant="outline">
            주요 신호 요약
          </Button>
          <Button size="sm" variant="outline">
            최근 6시간 변화
          </Button>
        </div>
      </div>

      {role === "Admin" ? (
        <AuditLogPanel activityLog={activityLog} />
      ) : (
        <Card className="border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          Audit log는 관리자 권한에서만 조회할 수 있습니다.
        </Card>
      )}
    </Card>
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
