# AI-powered Clinical Case Workspace (Demo)
임상 워크플로우를 환자 케이스 중심으로 재구성하고, 모델 결과가 실제 협업과 우선순위를 구동하는 구조를 보여주는 데모입니다.  
LLM/VectorDB는 근거 문헌 검색과 요약 전달 용도로만 사용하며, 진단/치료 권고는 하지 않습니다.

## 핵심 메시지
- 환자 케이스 중심 워크플로우로 업무가 자동 정렬된다.
- 모델 결과 변화가 알림과 협업 흐름을 직접 촉발한다.
- 임상 지표 표준화로 해석 가능한 정보를 우선 제공한다.
- 문헌 검색은 근거 기반 요약만 제공한다.

## 범위와 비범위
- 범위: 케이스 룸 생성, 알림, 협업 메시지, AI 요약, 타임라인, 문헌 검색 데모
- 비범위: 실제 EMR/PACS 연동, 진단/치료 권고, 추측성 생성

## 디바이스 역할 분리
Desktop(Web)
- 환자 케이스 분석, AI 결과 해석, 협업 중심
- 팀/병동 전체 채팅은 배치하지 않음

Mobile(App/PWA 컨셉)
- 팀 단위 알림 수신, 케이스 즉시 진입, 긴급 대응 중심
- 상세 분석은 데스크톱에서 수행

## 데스크톱 IA 요약
Left
- AI 알림 기반 활성 케이스 룸 리스트
- 의료진 pin 케이스
- 최근 활동/위험도 기준 자동 정렬

Center
- 의료진 메시지
- AI 이벤트 메시지 스트림

Right (탭)
- Patient Overview
- AI Analysis
- Timeline
- Clinical Documents (VectorDB)

## 케이스 룸 라이프사이클
1. 모델 결과 변화 감지
2. Alert 생성
3. 해당 환자 케이스 룸 자동 활성화
4. 채팅 스트림에 AI 이벤트 메시지 삽입
5. Timeline 기록
6. LLM 요약에 반영

## Patient Overview 탭
목적: 지금 중요한 상태를 한눈에 파악
- 기본 정보: 나이, 성별, 위치
- Risk Summary: Cardio/ICU/Neuro
- 최근 주요 이벤트 3건

## AI Analysis 탭
원칙: Raw output 숨김, 표준화 지표 우선 노출, 데이터 부족 시 명시

ECG (Cardio AI)
- Arrhythmia Risk (LOW/MOD/HIGH)
- Rhythm Trend (Improving/Stable/Worsening)
- Trend 그래프
- 근거 신호 세그먼트 표시

Imaging AI
- Lesion Detected
- Volume
- Progression
- Urgency Flag
- Snapshot + Overlay 토글

ICU Risk AI
- Risk Score (0–100)
- Risk Level
- Drivers Top-k
- Last 6h trend

Neuro AI
- Cognitive Decline Risk
- Atrophy Regions
- Confidence

## Timeline 탭
목적: 환자 상태 변화, 모델 업데이트, 협업 흐름을 시간순 파악
포함 항목
- 검사 발생
- 모델 추론 업데이트
- AI Alert 생성
- 의료진 주요 액션
LLM Summary는 Timeline 기반으로만 생성

## Clinical Documents 탭 (VectorDB + LLQ)
목적: 문헌 검색 + 근거 기반 요약 전달
동작 구조
1. 사용자 질문 입력
2. VectorDB semantic search
3. Top-K 문서 추출
4. LLM 요약 및 근거 링크 제공
정책
- 진단/치료 추론 금지
- 근거 없는 생성 금지
- 항상 출처 문서 표시

UI 문구
“Responses are generated from hospital-approved documents only.”

## 모델 결과 → 워크플로우 구동 구조
Raw model output  
→ Clinical feature standardization  
→ Risk/Trend/Urgency abstraction  
→ Alert 생성  
→ Case room 활성화  
→ Timeline 기록  
→ LLM 요약 입력

## WebSocket 실시간 흐름 (모킹)
목적: 실제 실시간처럼 보이게 데모
필수 표시
- 연결 상태 UI (Connected/Degraded/Offline)
- 일정 시간마다 이벤트 발생

이벤트 예시
1. ICU risk 상승
2. Imaging 결과 도착
3. ECG abnormality

각 이벤트는 알림, 채팅 메시지, Patient Overview 업데이트, Timeline 기록을 동시에 발생

모킹 예시
```js
socket.onopen = () => {
  setTimeout(() => socket.emit("alert", { type: "ICU_RISK_UP" }), 5000);
  setTimeout(() => socket.emit("alert", { type: "IMAGING_NEW_FIND" }), 12000);
  setTimeout(() => socket.emit("alert", { type: "ECG_RISK_UP" }), 20000);
};
