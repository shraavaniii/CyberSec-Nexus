import { useState, useEffect } from "react"
import axios from "axios"
import BASE_URL from "../api/config"

const NEWS_API_KEY = "pub_88ed07b232f2408b8835604828b21a3c"

function AnalystPortal() {
  const [reports, setReports] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [auditLoading, setAuditLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(true)

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const role = localStorage.getItem("role")
  const username = localStorage.getItem("username")
  const isAdmin = role === "admin"

  // FETCH REPORTS (admin only)
  useEffect(() => {
    if (!isAdmin) { setReportsLoading(false); return }
    axios.get(`${BASE_URL}/api/reports`)
      .then((res) => { setReports(res.data); setReportsLoading(false) })
      .catch(() => setReportsLoading(false))
  }, [])

  // FETCH AUDIT LOGS (admin only)
  useEffect(() => {
    if (!isAdmin) { setAuditLoading(false); return }
    axios.get(`${BASE_URL}/api/audit`)
      .then((res) => { setAuditLogs(res.data); setAuditLoading(false) })
      .catch(() => setAuditLoading(false))
  }, [])

  // FETCH CYBER NEWS (everyone)
  useEffect(() => {
    axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=cybersecurity&language=en&size=6`
    )
      .then((res) => { setNews(res.data.results || []); setNewsLoading(false) })
      .catch(() => setNewsLoading(false))
  }, [])

  const formatTime = (timestamp) => new Date(timestamp).toLocaleString()

  const getActionColor = (action) => {
    if (action === "Threat Scan") return "text-yellow-400"
    if (action === "Report Uploaded") return "text-green-400"
    if (action === "Log Check") return "text-blue-300"
    return "text-white"
  }

  const getActionIcon = (action) => {
    if (action === "Threat Scan") return "🔍"
    if (action === "Report Uploaded") return "📄"
    if (action === "Log Check") return "📋"
    return "🔔"
  }

  return (
    <div className="p-2">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-white mb-2">Analyst Portal</h1>
      <p className="text-blue-300 text-sm mb-8 opacity-70">
        Session:{" "}
        <span className={isLoggedIn ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
          {isLoggedIn ? `✔ Authenticated as ${username}` : "✘ Not Logged In"}
        </span>
        {isAdmin && (
          <span className="ml-3 text-xs bg-blue-900 bg-opacity-60 border border-blue-500 text-blue-300 px-2 py-0.5 rounded-full font-bold">
            🔑 ADMIN
          </span>
        )}
      </p>

      {/* ADMIN ONLY SECTION */}
      {isAdmin ? (
        <>
          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl p-6 card-hover"
              style={{ background: "rgba(0,150,255,0.12)", border: "1px solid rgba(0,150,255,0.3)" }}>
              <h2 className="text-blue-300 text-sm mb-1">Total Reports</h2>
              <p className="text-4xl font-bold text-white">
                {reportsLoading ? "..." : reports.length}
              </p>
            </div>
            <div className="rounded-2xl p-6 card-hover"
              style={{ background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.3)" }}>
              <h2 className="text-blue-300 text-sm mb-1">Total Activities</h2>
              <p className="text-4xl font-bold text-white">
                {auditLoading ? "..." : auditLogs.length}
              </p>
            </div>
            <div className="rounded-2xl p-6 card-hover"
              style={{ background: "rgba(150,0,255,0.1)", border: "1px solid rgba(150,0,255,0.3)" }}>
              <h2 className="text-blue-300 text-sm mb-1">Threat Engine</h2>
              <p className="text-green-400 text-lg font-bold mt-2">✔ Online</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

            {/* ACTIVITY TIMELINE */}
            <div className="glass rounded-2xl p-6"
              style={{ border: "1px solid rgba(0,150,255,0.2)" }}>
              <h2 className="text-xl font-bold text-white mb-4">🕐 Activity Timeline</h2>
              {auditLoading && <p className="text-blue-300 animate-pulse">Loading activity...</p>}
              {!auditLoading && auditLogs.length === 0 && (
                <p className="text-blue-400 opacity-60 text-sm">
                  No activity yet. Run a scan or upload a report.
                </p>
              )}
              {!auditLoading && auditLogs.length > 0 && (
                <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border-l-2 border-blue-500 pl-4">
                      <p className={`font-bold text-sm ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)} {log.action}
                      </p>
                      <p className="text-blue-200 text-xs mt-1 opacity-80">{log.detail}</p>
                      <p className="text-gray-500 text-xs mt-1">{formatTime(log.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* UPLOADED REPORTS TABLE */}
            <div className="glass rounded-2xl p-6"
              style={{ border: "1px solid rgba(0,150,255,0.2)" }}>
              <h2 className="text-xl font-bold text-white mb-4">📁 Uploaded Reports</h2>
              {reportsLoading && <p className="text-blue-300 animate-pulse">Loading reports...</p>}
              {!reportsLoading && reports.length === 0 && (
                <p className="text-blue-400 opacity-60 text-sm">No reports uploaded yet.</p>
              )}
              {!reportsLoading && reports.length > 0 && (
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(0,150,255,0.3)" }}>
                        <th className="py-2 pr-4 text-blue-400 text-sm">#</th>
                        <th className="py-2 pr-4 text-blue-400 text-sm">Title</th>
                        <th className="py-2 text-blue-400 text-sm">File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report, index) => (
                        <tr key={report.id}
                          style={{ borderBottom: "1px solid rgba(0,150,255,0.1)" }}
                          className="hover:bg-blue-900 hover:bg-opacity-20 transition-colors">
                          <td className="py-2 pr-4 text-gray-400 text-sm">{index + 1}</td>
                          <td className="py-2 pr-4 text-white text-sm">{report.title}</td>
                          <td className="py-2 text-blue-300 text-xs">{report.filename}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* NON-ADMIN — RESTRICTED MESSAGE */
        <div className="glass rounded-2xl p-6 mb-8 flex items-start gap-4"
          style={{ border: "1px solid rgba(255,150,0,0.3)", background: "rgba(255,150,0,0.06)" }}>
          <span className="text-3xl">🔒</span>
          <div>
            <h2 className="text-yellow-400 font-bold text-lg mb-1">Admin Access Required</h2>
            <p className="text-blue-200 text-sm opacity-80">
              The Activity Timeline and Uploaded Reports sections are restricted to admins only.
              You can still view the Live Cyber Threat Intelligence news feed below.
            </p>
          </div>
        </div>
      )}

      {/* LIVE CYBER THREAT NEWS — visible to everyone */}
      <div className="glass rounded-2xl p-6"
        style={{ border: "1px solid rgba(0,150,255,0.2)" }}>
        <h2 className="text-xl font-bold text-white mb-6">
          📡 Live Cyber Threat Intelligence
        </h2>
        {newsLoading && (
          <p className="text-blue-300 animate-pulse">Fetching latest threat news...</p>
        )}
        {!newsLoading && news.length === 0 && (
          <p className="text-blue-400 opacity-60 text-sm">Could not load news. Try again later.</p>
        )}
        {!newsLoading && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((article, index) => (
              <a key={index} href={article.link} target="_blank" rel="noreferrer"
                className="block rounded-xl p-4 transition-all duration-300 hover:-translate-y-2 card-hover"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,150,255,0.2)" }}>
                {article.image_url && (
                  <img src={article.image_url} alt="news"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => (e.target.style.display = "none")} />
                )}
                <p className="text-blue-400 text-xs mb-2 uppercase font-bold">
                  {article.source_id || "Cybersecurity News"}
                </p>
                <p className="text-white text-sm font-semibold leading-snug">{article.title}</p>
                <p className="text-gray-500 text-xs mt-2">
                  {article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ""}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default AnalystPortal
