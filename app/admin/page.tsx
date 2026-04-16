'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDownload = async () => {
    if (!password.trim()) {
      setError('パスワードを入力してください。')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/results?key=${encodeURIComponent(password)}`)
      if (res.status === 401) {
        setError('パスワードが正しくありません。')
        setLoading(false)
        return
      }
      if (!res.ok) {
        setError('エラーが発生しました。')
        setLoading(false)
        return
      }
      const text = await res.text()
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const now = new Date()
      const stamp = now.toISOString().replace(/[^0-9]/g, '').slice(0, 14)
      a.href = url
      a.download = `アンケート結果_${stamp}.md`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('通信エラーが発生しました。')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gray-800 text-white px-6 py-6 text-center">
        <h1 className="text-xl font-bold">管理者ページ</h1>
        <p className="text-gray-300 text-sm mt-1">アンケート結果のダウンロード</p>
      </div>

      <div className="px-6 py-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            管理者パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
            className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="パスワードを入力"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg text-base transition-colors"
        >
          {loading ? 'ダウンロード中…' : 'Markdown でダウンロード'}
        </button>

        <p className="text-gray-400 text-xs text-center">
          アンケート結果を Markdown 形式（.md）でダウンロードします。
        </p>
      </div>
    </div>
  )
}
