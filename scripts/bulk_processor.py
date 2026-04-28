#!/usr/bin/env python3
"""
VNEXIS Bulk Processor
back_data 폴더의 PDF를 일괄 분석 → Supabase 저장

사용법:
  python bulk_processor.py --folder ./back_data --dry-run   # 그룹핑 확인
  python bulk_processor.py --folder ./back_data             # 실제 분석 + 저장
"""

import argparse
import os
import re
import sys
import json
from datetime import datetime, timezone
from pathlib import Path

# ── 이름 추출 헬퍼 ──────────────────────────────────────────────────────────

_NON_NAME_WORDS = {
    '손보', '손해', '생명', '화재', '병원', '센터', '대학', '보험', '자문',
    '회신', '보고서', '결과지', '검진', '진단', '악성', '인정', '면책', '부책',
    '종결', '의무', '관계', '질환', '뇌혈관', '뇌경색', '뇌종양', '암센터',
    '종합', '결과', '인과', '고지', '회신원', '유방암', '간암', '대장암',
    '뇌동맥류', '양성뇌', '유방피', '자궁경', '상피내', '사정',
}

# 흔한 한국 성씨 (첫 글자 필터)
_KOREAN_SURNAMES = set('김이박최정강조윤장임한오서신권황안송유전홍고문양손배조백허남심노하곽성차주우구')


def _looks_like_name(s: str) -> bool:
    if not s or not (2 <= len(s) <= 4):
        return False
    if not re.fullmatch(r'[가-힣]+', s):
        return False
    if s in _NON_NAME_WORDS:
        return False
    if s[0] not in _KOREAN_SURNAMES:
        return False
    return True


def _name_from_segment(segment: str) -> str | None:
    """세그먼트에서 이름 추출.
    순수 한글 2-4자인 세그먼트만 이름으로 인정.
    혼합 세그먼트(예: '김진희-회신서')는 비한글로 재분리 후 재시도.
    '양성뇌종양' 같은 긴 의학어 서브시퀀스는 거부.
    """
    korean_only = re.sub(r'[^가-힣]', '', segment)
    if _looks_like_name(korean_only):
        return korean_only
    # 비한글 구분자로 재분리 (예: 하이픈, 괄호)
    if not re.fullmatch(r'[가-힣]+', segment):
        for part in re.split(r'[^가-힣]+', segment):
            if _looks_like_name(part):
                return part
    return None


def extract_person_name(stem: str) -> str | None:
    """파일명 스템에서 피보험자 이름 추출"""
    # 패턴 1: (회사_이름) 괄호 형식
    m = re.match(r'\(([^)]+)\)', stem)
    if m:
        inner = m.group(1)
        parts = inner.split('_')
        if len(parts) >= 2:
            candidate = ''.join(parts[1:])
            if _looks_like_name(candidate):
                return candidate

    # 패턴 2: 언더스코어 세그먼트 2~3번째 (첫 번째는 기관명)
    for segment in stem.split('_')[1:3]:
        name = _name_from_segment(segment)
        if name:
            return name

    # 패턴 3: "기관명 이름_" 형식 (공백 뒤 한글 이름)
    m = re.match(r'^[\w가-힣]+\s([가-힣]{2,4})[_\s]', stem)
    if m and _looks_like_name(m.group(1)):
        return m.group(1)

    # 패턴 4: 하이픈 분리 (DB생명-이선아-회신서)
    for seg in stem.split('-')[1:3]:
        name = _name_from_segment(seg)
        if name:
            return name

    return None


def extract_institution(stem: str) -> str:
    """보험사/기관명 추출 (첫 번째 주요 토큰)"""
    # 괄호 형식: (회사_이름) → 회사
    m = re.match(r'\(([^_)]+)', stem)
    if m:
        return m.group(1)
    # 공백/언더스코어/하이픈 앞 첫 토큰
    first = re.split(r'[\s_\-]', stem)[0]
    return first if first else ''


# ── 그룹핑 ──────────────────────────────────────────────────────────────────

def build_groups(folder: Path) -> tuple[dict, list]:
    """
    PDF 파일들을 피보험자별로 그룹화.
    반환: (groups: {person_name: [Path, ...]}, unknown: [Path, ...])
    """
    pdf_files = sorted(folder.glob('*.pdf'))
    groups: dict[str, list[Path]] = {}
    unknown: list[Path] = []

    for f in pdf_files:
        name = extract_person_name(f.stem)
        if name:
            groups.setdefault(name, []).append(f)
        else:
            unknown.append(f)

    return groups, unknown


# ── Dry-run 출력 ─────────────────────────────────────────────────────────────

def print_dry_run(groups: dict, unknown: list) -> None:
    total_files = sum(len(v) for v in groups.values()) + len(unknown)
    print()
    print('=' * 60)
    print(f'  VNEXIS Bulk Processor - Dry-run 결과')
    print(f'  총 파일: {total_files}개  |  인식된 피보험자: {len(groups)}명')
    print('=' * 60)

    for person, files in sorted(groups.items()):
        print(f'\n  [피보험자] {person}  ({len(files)}개 파일)')
        for f in files:
            institution = extract_institution(f.stem)
            print(f'     OK [{institution}]  {f.name}')

    if unknown:
        print(f'\n  [?] 이름 미인식 파일  ({len(unknown)}개) - API 호출 시 건너뜀')
        for f in unknown:
            print(f'     - {f.name}')

    print()
    print('  → 실제 분석 실행: python bulk_processor.py --folder ./back_data')
    print('     (Supabase 연동: .env 파일에 SUPABASE_URL, SUPABASE_KEY 필요)')
    print()


# ── API 호출 ─────────────────────────────────────────────────────────────────

def analyze_pdf(file_path: Path, api_base: str, timeout: int = 180) -> dict:
    import requests  # lazy import (dry-run에서 불필요)
    with open(file_path, 'rb') as f:
        resp = requests.post(
            f'{api_base}/api/vnexis/analyze',
            files={'file': (file_path.name, f, 'application/pdf')},
            timeout=timeout,
        )
    resp.raise_for_status()
    return resp.json()


# ── Supabase 저장 ─────────────────────────────────────────────────────────────

def save_to_supabase(client, person: str, file_path: Path, result: dict) -> None:
    institution = extract_institution(file_path.stem)
    ps = result.get('Patient_Summary', {})
    mo = result.get('Medical_Opinion', {})
    cs = result.get('Coding_Standard', {})
    ic = result.get('Insurance_Coverage', {})
    fg = result.get('Final_Grade', {})
    ct = result.get('CTA_Logic', {})

    meets = ic.get('Meets_Definition')
    if isinstance(meets, str):
        meets = meets.lower() == 'yes'

    prob_raw = fg.get('Probability', '')
    try:
        probability = float(str(prob_raw).replace('%', '').strip()) if prob_raw else None
    except ValueError:
        probability = None

    record = {
        'case_group':        person,
        'person_name':       person,
        'file_name':         file_path.name,
        'insurance_company': institution,
        'analysis_id':       result.get('Analysis_ID'),
        'analysis_ts':       result.get('Timestamp'),
        'patient_age':       ps.get('Age'),
        'patient_gender':    ps.get('Gender'),
        'kcd_version':       ps.get('KCD_Version'),
        'raw_diagnosis':     mo.get('Raw_Diagnosis'),
        'clinical_finding':  mo.get('Clinical_Finding'),
        'expert_assessment': mo.get('Expert_Assessment'),
        'confidence':        str(mo.get('Confidence', '')),
        'kcd_code':          cs.get('KCD_Code'),
        'kcd_name':          cs.get('KCD_Name'),
        'icd_code':          cs.get('ICD_Code'),
        'coverage_type':     ic.get('Coverage_Type'),
        'meets_definition':  meets,
        'gap_analysis':      ic.get('Gap_Analysis'),
        'final_grade':       fg.get('Determination'),
        'probability':       probability,
        'recommended_action': ct.get('Recommended_Action'),
        'expected_gain':     ct.get('Expected_Gain'),
        'raw_response':      result,
        'status':            'success',
        'processed_at':      datetime.now(timezone.utc).isoformat(),
    }

    client.table('vnexis_bulk_cases').insert(record).execute()


# ── 메인 ─────────────────────────────────────────────────────────────────────

def main() -> None:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    parser = argparse.ArgumentParser(description='VNEXIS 벌크 PDF 분석기')
    parser.add_argument('--folder', required=True, help='PDF 폴더 경로')
    parser.add_argument('--dry-run', action='store_true', help='그룹핑만 확인 (API/DB 호출 없음)')
    parser.add_argument('--api-url', default='https://vnexis-backend-production.up.railway.app',
                        help='백엔드 API URL (기본: Railway 운영서버)')
    parser.add_argument('--limit', type=int, default=None, help='처리할 최대 파일 수')
    args = parser.parse_args()

    folder = Path(args.folder)
    if not folder.is_dir():
        print(f'[오류] 폴더를 찾을 수 없습니다: {folder}')
        sys.exit(1)

    groups, unknown = build_groups(folder)

    if args.dry_run:
        print_dry_run(groups, unknown)
        return

    # ── 실제 분석 모드 ──
    from dotenv import load_dotenv
    load_dotenv()

    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    if not supabase_url or not supabase_key:
        print('[오류] .env 파일에 SUPABASE_URL, SUPABASE_KEY를 설정하세요.')
        sys.exit(1)

    from supabase import create_client
    from tqdm import tqdm

    client = create_client(supabase_url, supabase_key)

    all_files: list[tuple[str, Path]] = []
    for person, files in groups.items():
        for f in files:
            all_files.append((person, f))

    if args.limit:
        all_files = all_files[:args.limit]

    print(f'\n분석 시작: {len(all_files)}개 파일 / {len(groups)}명\n')
    success = failed = skipped = 0

    for person, file_path in tqdm(all_files, unit='file'):
        tqdm.write(f'→ [{person}] {file_path.name}')
        try:
            result = analyze_pdf(file_path, args.api_url)
            save_to_supabase(client, person, file_path, result)
            success += 1
        except Exception as e:
            tqdm.write(f'   [실패] {e}')
            failed += 1
            try:
                client.table('vnexis_bulk_cases').insert({
                    'case_group':    person,
                    'person_name':   person,
                    'file_name':     file_path.name,
                    'status':        'failed',
                    'error_message': str(e),
                    'processed_at':  datetime.now(timezone.utc).isoformat(),
                }).execute()
            except Exception:
                pass

    print(f'\n완료 — 성공: {success}  실패: {failed}  건너뜀: {skipped}')


if __name__ == '__main__':
    main()
