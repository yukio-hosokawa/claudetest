'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TopPage() {
  const router = useRouter()
  const [roomNumber, setRoomNumber] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<{ roomNumber?: string; name?: string }>({})

  const handleRoomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
    setRoomNumber(val)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chars = [...e.target.value]
    if (chars.length <= 20) {
      setName(e.target.value)
    }
  }

  const validate = () => {
    const errs: { roomNumber?: string; name?: string } = {}
    if (!roomNumber) {
      errs.roomNumber = '部屋番号を入力してください。'
    } else if (!/^[0-9]{1,4}$/.test(roomNumber)) {
      errs.roomNumber = '半角数字 4 桁以内で入力してください。'
    }
    if (!name.trim()) {
      errs.name = '氏名を入力してください。'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    sessionStorage.setItem('survey_room', roomNumber)
    sessionStorage.setItem('survey_name', name)
    router.push('/survey')
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-blue-800 text-white px-6 py-6 text-center">
        <h1 className="text-xl font-bold leading-relaxed">
          ル・サンク南千里ローレルコート
          <br />
          大規模修繕に関するアンケート
        </h1>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* 部屋番号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            部屋番号
            <span className="text-red-500 ml-1">*</span>
            <span className="text-gray-400 text-xs ml-2">（半角数字 4 桁以内）</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={roomNumber}
            onChange={handleRoomNumberChange}
            maxLength={4}
            className={`border rounded-md px-3 py-2 w-32 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.roomNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="例：0101"
          />
          {errors.roomNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>
          )}
        </div>

        {/* 氏名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            氏名
            <span className="text-red-500 ml-1">*</span>
            <span className="text-gray-400 text-xs ml-2">（全角 20 文字以内）</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            style={{ width: '20em' }}
            placeholder="例：山田 太郎"
          />
          <p className="text-gray-400 text-xs mt-1">
            入力文字数：{[...name].length} / 20
          </p>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-md px-4 py-3">
          <p className="text-sm text-yellow-800 font-medium">
            大規模修繕計画案を読んでから、ご記入ください。
          </p>
        </div>

        {/* 次へボタン */}
        <div className="pt-2">
          <button
            onClick={handleNext}
            className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold py-3 rounded-lg text-base transition-colors"
          >
            次のページへ
          </button>
        </div>
      </div>
    </div>
  )
}
