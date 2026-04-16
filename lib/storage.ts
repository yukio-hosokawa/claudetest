import type { SurveyResponse } from '@/types/survey'

const RESPONSES_KEY = 'survey_responses'

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

// ---- Vercel KV (本番) ----

async function kvSave(response: SurveyResponse): Promise<void> {
  const { kv } = await import('@vercel/kv')
  await kv.rpush(RESPONSES_KEY, JSON.stringify(response))
}

async function kvGetAll(): Promise<SurveyResponse[]> {
  const { kv } = await import('@vercel/kv')
  const raw = await kv.lrange<string>(RESPONSES_KEY, 0, -1)
  return raw.map((item) => {
    if (typeof item === 'string') return JSON.parse(item) as SurveyResponse
    return item as unknown as SurveyResponse
  })
}

// ---- ローカルファイル (開発用フォールバック) ----

const DATA_DIR = process.cwd()
const DATA_FILE = `${DATA_DIR}/data/responses.json`

async function fileSave(response: SurveyResponse): Promise<void> {
  const { mkdir, readFile, writeFile } = await import('fs/promises')
  await mkdir(`${DATA_DIR}/data`, { recursive: true })
  let list: SurveyResponse[] = []
  try {
    const raw = await readFile(DATA_FILE, 'utf-8')
    list = JSON.parse(raw) as SurveyResponse[]
  } catch {
    // ファイルが存在しない場合は空配列から開始
  }
  list.push(response)
  await writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8')
}

async function fileGetAll(): Promise<SurveyResponse[]> {
  const { readFile } = await import('fs/promises')
  try {
    const raw = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as SurveyResponse[]
  } catch {
    return []
  }
}

// ---- 公開 API ----

export async function saveResponse(response: SurveyResponse): Promise<void> {
  if (isKvConfigured()) {
    await kvSave(response)
  } else {
    await fileSave(response)
  }
}

export async function getAllResponses(): Promise<SurveyResponse[]> {
  if (isKvConfigured()) {
    return kvGetAll()
  }
  return fileGetAll()
}
