import type { SurveyResponse } from '@/types/survey'

function truncate(str: string | undefined, len: number): string {
  if (!str) return ''
  const chars = Array.from(str)
  if (chars.length <= len) return str
  return chars.slice(0, len).join('') + '…'
}

export function generateMarkdown(responses: SurveyResponse[]): string {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
  const total = responses.length

  // 集計
  const periodCounts: Record<string, number> = {}
  const planCounts: Record<string, number> = {}

  for (const r of responses) {
    const period = r.renovationPeriod === 'その他'
      ? `その他（${truncate(r.renovationPeriodOther, 40)}）`
      : r.renovationPeriod
    periodCounts[period] = (periodCounts[period] ?? 0) + 1

    const plan = r.repairFundPlan === 'その他'
      ? `その他（${truncate(r.repairFundPlanOther, 40)}）`
      : r.repairFundPlan
    planCounts[plan] = (planCounts[plan] ?? 0) + 1
  }

  const lines: string[] = []

  lines.push('# ル・サンク南千里ローレルコート 大規模修繕に関するアンケート結果')
  lines.push('')
  lines.push(`**出力日時：** ${now}`)
  lines.push(`**回答総数：** ${total} 件`)
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push('## 集計結果')
  lines.push('')
  lines.push('### 大規模修繕の周期')
  lines.push('')
  for (const [key, count] of Object.entries(periodCounts)) {
    lines.push(`- ${key}：${count} 票`)
  }
  lines.push('')
  lines.push('### 修繕積立金の案')
  lines.push('')
  for (const [key, count] of Object.entries(planCounts)) {
    lines.push(`- ${key}：${count} 票`)
  }
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push('## 回答一覧')
  lines.push('')

  responses.forEach((r, i) => {
    const dt = new Date(r.timestamp).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    lines.push(`### 回答 ${i + 1}`)
    lines.push('')
    lines.push(`| 項目 | 内容 |`)
    lines.push(`|------|------|`)
    lines.push(`| 回答日時 | ${dt} |`)
    lines.push(`| 部屋番号 | ${r.roomNumber} |`)
    lines.push(`| 氏名 | ${truncate(r.name, 10)} |`)

    const period = r.renovationPeriod === 'その他'
      ? `その他：${truncate(r.renovationPeriodOther, 40)}`
      : r.renovationPeriod
    lines.push(`| 大規模修繕の周期 | ${period} |`)

    const plan = r.repairFundPlan === 'その他'
      ? `その他：${truncate(r.repairFundPlanOther, 40)}`
      : r.repairFundPlan
    lines.push(`| 修繕積立金の案 | ${plan} |`)
    lines.push(`| 自由意見 | ${truncate(r.freeOpinion, 40)} |`)
    lines.push('')
  })

  return lines.join('\n')
}
