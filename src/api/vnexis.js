const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TIMEOUT_MS = 120000;

function humanizeError(err, status) {
  if (err.name === 'AbortError') return '분석 시간이 초과되었습니다. 다시 시도해 주세요.';
  if (err instanceof TypeError) return '인터넷 연결을 확인하고 다시 시도해 주세요.';
  if (status === 400) return '파일 형식을 확인해 주세요. PDF만 업로드 가능합니다.';
  if (status === 413) return '파일이 너무 큽니다. 50MB 이하 파일을 사용해 주세요.';
  if (status === 502) return 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  const msg = err.message || '';
  if (msg.includes('LLM')) return 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  return msg || `서버 오류 (${status ?? '알 수 없음'})`;
}

export async function analyzeDocument(file) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/vnexis/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: '' }));
      const raw = new Error(err.detail || '');
      raw.status = response.status;
      throw Object.assign(raw, { status: response.status });
    }

    return response.json();
  } catch (err) {
    throw new Error(humanizeError(err, err.status));
  } finally {
    clearTimeout(timer);
  }
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}
