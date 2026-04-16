import Link from 'next/link'

export default function CompletePage() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-blue-800 text-white px-6 py-6 text-center">
        <h1 className="text-xl font-bold leading-relaxed">
          ル・サンク南千里ローレルコート
          <br />
          大規模修繕に関するアンケート
        </h1>
      </div>

      <div className="px-6 py-12 text-center space-y-4">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-800">ご回答ありがとうございました</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          アンケートの回答を登録しました。<br />
          ご協力いただきありがとうございます。
        </p>
        <div className="pt-6">
          <Link
            href="/"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
