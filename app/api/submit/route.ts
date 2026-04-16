import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { saveResponse } from '@/lib/storage'
import type { SurveyResponse } from '@/types/survey'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { roomNumber, name, renovationPeriod, renovationPeriodOther, repairFundPlan, repairFundPlanOther, freeOpinion } = body

    if (!roomNumber || !name || !renovationPeriod || !repairFundPlan) {
      return NextResponse.json({ error: '必須項目が未入力です。' }, { status: 400 })
    }

    if (!/^[0-9]{1,4}$/.test(roomNumber)) {
      return NextResponse.json({ error: '部屋番号の形式が不正です。' }, { status: 400 })
    }

    const response: SurveyResponse = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      roomNumber: String(roomNumber).slice(0, 4),
      name: Array.from(String(name)).slice(0, 20).join(''),
      renovationPeriod: String(renovationPeriod),
      renovationPeriodOther: renovationPeriodOther ? String(renovationPeriodOther) : undefined,
      repairFundPlan: String(repairFundPlan),
      repairFundPlanOther: repairFundPlanOther ? String(repairFundPlanOther) : undefined,
      freeOpinion: freeOpinion ? String(freeOpinion) : undefined,
    }

    await saveResponse(response)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('submit error:', err)
    return NextResponse.json({ error: 'サーバーエラーが発生しました。' }, { status: 500 })
  }
}
