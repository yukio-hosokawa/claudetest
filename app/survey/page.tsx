'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type RenovationPeriod = '12年' | '13年' | '14年' | '15年' | 'その他' | ''
type RepairFundPlan = '１案' | '２案' | '３案' | 'その他' | ''

export default function SurveyPage() {
  const router = useRouter()

  const [roomNumber, setRoomNumber] = useState('')
  const [name, setName] = useState('')

  const [renovationPeriod, setRenovationPeriod] = useState<RenovationPeriod>('')
  const [renovationPeriodOther, setRenovationPeriodOther] = useState('')
  const [repairFundPlan, setRepairFundPlan] = useState<RepairFundPlan>('')
  const [repairFundPlanOther, setRepairFundPlanOther] = useState('')
  const [freeOpinion, setFreeOpinion] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const room = sessionStorage.getItem('survey_room')
    const nm = sessionStorage.getItem('survey_name')
    if (!room || !nm) {
      router.replace('/')
      return
    }
    setRoomNumber(room)
    setName(nm)
  }, [router])

  const truncateDisplay = (str: string, len: number) => {
    const chars = Array.from(str)
    if (chars.length <= len) return str
    return chars.slice(0, len).join('') + '…'
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!renovationPeriod) {
      errs.renovationPeriod = '大規模修繕の周期を選択してください。'
    }
    if (renovationPeriod === 'その他' && !renovationPeriodOther.trim()) {
      errs.renovationPeriodOther = '「その他」の内容を入力してください。'
    }
    if (!repairFundPlan) {
      errs.repairFundPlan = '修繕積立金の案を選択してください。'
    }
    if (repairFundPlan === 'その他' && !repairFundPlanOther.trim()) {
      errs.repairFundPlanOther = '「その他」の内容を入力してください。'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmitClick = () => {
    if (!validate()) return
    setShowConfirm(true)
  }

  const handleConfirmOk = async () => {
    setShowConfirm(false)
    setSubmitting(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber,
          name,
          renovationPeriod,
          renovationPeriodOther: renovationPeriod === 'その他' ? renovationPeriodOther : undefined,
          repairFundPlan,
          repairFundPlanOther: repairFundPlan === 'その他' ? repairFundPlanOther : undefined,
          freeOpinion: freeOpinion || undefined,
        }),
      })
      if (!res.ok) throw new Error('送信エラー')
      sessionStorage.removeItem('survey_room')
      sessionStorage.removeItem('survey_name')
      router.push('/complete')
    } catch {
      setSubmitting(false)
      alert('送信に失敗しました。もう一度お試しください。')
    }
  }

  const handleConfirmCancel = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-blue-800 text-white px-6 py-6 text-center">
          <h1 className="text-xl font-bold leading-relaxed">
            ル・サンク南千里ローレルコート
            <br />
            大規模修繕に関するアンケート
          </h1>
          <p className="text-blue-200 text-sm mt-2">
            部屋番号：{roomNumber}　氏名：{truncateDisplay(name, 10)}
          </p>
        </div>

        <div className="px-6 py-8 space-y-8">
          {/* Q1: 大規模修繕の周期 */}
          <fieldset>
            <legend className="text-base font-bold text-gray-800 mb-3">
              <span className="text-blue-700 mr-2">Q1.</span>
              大規模修繕の周期は、下記のどれが望ましいと思いますか？
              <span className="text-red-500 ml-1">*</span>
            </legend>
            <div className="space-y-2 pl-2">
              {(['12年', '13年', '14年', '15年', 'その他'] as const).map((opt) => (
                <label key={opt} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="renovationPeriod"
                    value={opt}
                    checked={renovationPeriod === opt}
                    onChange={() => setRenovationPeriod(opt)}
                    className="mt-1 accent-blue-700"
                  />
                  <span className="text-gray-700">{opt}</span>
                  {opt === 'その他' && renovationPeriod === 'その他' && (
                    <input
                      type="text"
                      value={renovationPeriodOther}
                      onChange={(e) => setRenovationPeriodOther(e.target.value)}
                      placeholder="具体的にご記入ください"
                      className={`border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 ${
                        errors.renovationPeriodOther ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ minWidth: 0, maxWidth: '24em' }}
                    />
                  )}
                </label>
              ))}
            </div>
            {errors.renovationPeriod && (
              <p className="text-red-500 text-xs mt-2 pl-2">{errors.renovationPeriod}</p>
            )}
            {errors.renovationPeriodOther && (
              <p className="text-red-500 text-xs mt-2 pl-2">{errors.renovationPeriodOther}</p>
            )}
          </fieldset>

          <hr className="border-gray-200" />

          {/* Q2: 修繕積立金の案 */}
          <fieldset>
            <legend className="text-base font-bold text-gray-800 mb-3">
              <span className="text-blue-700 mr-2">Q2.</span>
              修繕積立金の案は、どれが望ましいですか？
              <span className="text-red-500 ml-1">*</span>
            </legend>
            <div className="space-y-2 pl-2">
              {(['１案', '２案', '３案', 'その他'] as const).map((opt) => (
                <label key={opt} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="repairFundPlan"
                    value={opt}
                    checked={repairFundPlan === opt}
                    onChange={() => setRepairFundPlan(opt)}
                    className="mt-1 accent-blue-700"
                  />
                  <span className="text-gray-700">{opt}</span>
                  {opt === 'その他' && repairFundPlan === 'その他' && (
                    <input
                      type="text"
                      value={repairFundPlanOther}
                      onChange={(e) => setRepairFundPlanOther(e.target.value)}
                      placeholder="具体的にご記入ください"
                      className={`border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 ${
                        errors.repairFundPlanOther ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ minWidth: 0, maxWidth: '24em' }}
                    />
                  )}
                </label>
              ))}
            </div>
            {errors.repairFundPlan && (
              <p className="text-red-500 text-xs mt-2 pl-2">{errors.repairFundPlan}</p>
            )}
            {errors.repairFundPlanOther && (
              <p className="text-red-500 text-xs mt-2 pl-2">{errors.repairFundPlanOther}</p>
            )}
          </fieldset>

          <hr className="border-gray-200" />

          {/* Q3: 自由意見 */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-3">
              <span className="text-blue-700 mr-2">Q3.</span>
              自由意見
              <span className="text-gray-400 text-xs ml-2 font-normal">（任意）</span>
            </label>
            <textarea
              value={freeOpinion}
              onChange={(e) => setFreeOpinion(e.target.value)}
              rows={4}
              placeholder="ご意見・ご要望等をご自由にお書きください。"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
          </div>

          {/* 登録ボタン */}
          <div className="pt-2">
            <button
              onClick={handleSubmitClick}
              disabled={submitting}
              className="w-full bg-green-700 hover:bg-green-800 active:bg-green-900 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg text-base transition-colors"
            >
              {submitting ? '送信中…' : '登録'}
            </button>
          </div>
        </div>
      </div>

      {/* 確認ダイアログ */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <p className="text-gray-800 font-medium text-center text-base mb-6">
              登録してよろしいですか？
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmOk}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded-lg transition-colors"
              >
                OK
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
