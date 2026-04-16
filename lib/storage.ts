import type { SurveyResponse } from '@/types/survey'

const BLOB_PREFIX = 'responses/'

function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

// ---- Vercel Blob (本番) ----

async function blobSave(response: SurveyResponse): Promise<void> {
  const { put } = await import('@vercel/blob')
  // プライベートストアでは access: 'public' を指定しない
  await put(`${BLOB_PREFIX}${response.id}.json`, JSON.stringify(response), {
    contentType: 'application/json',
    addRandomSuffix: false,
  })
}

async function blobGetAll(): Promise<SurveyResponse[]> {
  const { list } = await import('@vercel/blob')
  const token = process.env.BLOB_READ_WRITE_TOKEN!
  const { blobs } = await list({ prefix: BLOB_PREFIX, token })
  if (blobs.length === 0) return []
  const results = await Promise.all(
    blobs.map(async (blob) => {
      // プライベートストアは Authorization ヘッダーで認証して取得
      const res = await fetch(blob.url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.json() as Promise<SurveyResponse>
    })
  )
  return results.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
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
  if (isBlobConfigured()) {
    await blobSave(response)
  } else {
    await fileSave(response)
  }
}

export async function getAllResponses(): Promise<SurveyResponse[]> {
  if (isBlobConfigured()) {
    return blobGetAll()
  }
  return fileGetAll()
}
