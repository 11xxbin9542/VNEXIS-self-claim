const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeDocument(
  file: File,
  insuranceInfo?: Record<string, string>
) {
  const formData = new FormData();
  formData.append('file', file);

  if (insuranceInfo) {
    Object.entries(insuranceInfo).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch(`${API_BASE}/api/v1/analyze/document`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: response.statusText }));

      // 한도 초과 특별 처리
      if (response.status === 429) {
        throw new Error(`⚠️ ${err.detail || '분석 한도를 초과했습니다.'}`);
      }

      throw new Error(err.detail || `서버 오류 (${response.status})`);
    }

    return response.json();
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('분석 시간이 초과되었습니다. 다시 시도해 주세요.');
    }
    throw error;
  }
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}
