import { useState, useEffect } from "react"
import axios from "axios"

const NEWS_API_KEY = "pub_88ed07b232f2408b8835604828b21a3c"

function AnalystPortal() {

  const [reports, setReports] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [news, setNews] = useState([])

  const [newsLoading, setNewsLoading] = useState(true)
  const [auditLoading, setAuditLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(true)

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true"

  // REAL BACKEND URL
  const BACKEND_URL =
    "https://cybersec-nexus-backend.onrender.com"

  // ===============================
  // FETCH REPORTS
  // ===============================

  useEffect(() => {

    axios
      .get(`${BACKEND_URL}/api/reports`)
      .then((res) => {

        setReports(res.data)

      })
      .catch((err) => {

        console.error("Reports Error:", err)

      })
      .finally(() => {

        setReportsLoading(false)

      })

  }, [])

  // ===============================
  // FETCH AUDIT LOGS
  // ===============================

  useEffect(() => {

    axios
      .get(`${BACKEND_URL}/api/audit`)
      .then((res) => {

        setAuditLogs(res.data)

      })
      .catch((err) => {

        console.error("Audit Error:", err)

      })
      .finally(() => {

        setAuditLoading(false)

      })

  }, [])

  // ===============================
  // FETCH CYBER NEWS
  // ===============================

  useEffect(() => {

    axios
      .get(
        `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=cybersecurity&language=en&size=6`
      )
      .then((res) => {

        setNews(res.data.results || [])

      })
      .catch((err) => {

        console.error("News API Error:", err)

      })
      .finally(() => {

        setNewsLoading(false)

      })

  }, [])

  // ===============================
  // FORMAT TIME
  // ===============================

  const formatTime = (timestamp) => {

    const date = new Date(timestamp)

    return date.toLocaleString()

  }

  // ===============================
  // ACTION COLORS
  // ===============================

  const getActionColor = (action) => {

    if (action === "Threat Scan")
      return "text-yellow-400"

    if (action === "Report Uploaded")
      return "text-green-400"

    return "text-blue-400"

  }

  // ===============================
  // ACTION ICONS
  // ===============================

  const getActionIcon = (action) => {

    if (action === "Threat Scan")
      return "🔍"

    if (action === "Report Uploaded")
      return "📄"

    return "📋"

  }

  return (

    <div className="p-6">

      {/* HEADER */}

      <h1 className="text-4xl text-green-500 font-bold mb-2">
        Analyst Portal
      </h1>

      <p className="text-gray-400 mb-8">

        Session Status:{" "}

        <span
          className={
            isLoggedIn
              ? "text-green-400"
              : "text-red-400"
          }
        >

          {isLoggedIn
            ? "✔ Authenticated"
            : "✘ Not Logged In — Please Login First"}

        </span>

      </p>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">

          <h2 className="text-green-400 text-lg mb-1">
            Total Reports
          </h2>

          <p className="text-4xl font-bold">
            {reportsLoading ? "..." : reports.length}
          </p>

        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">

          <h2 className="text-green-400 text-lg mb-1">
            Total Activities
          </h2>

          <p className="text-4xl font-bold">
            {auditLoading ? "..." : auditLogs.length}
          </p>

        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">

          <h2 className="text-green-400 text-lg mb-1">
            Threat Engine
          </h2>

          <p className="text-green-300 text-lg font-semibold mt-2">
            ✔ Online
          </p>

        </div>

      </div>

      {/* MAIN SECTION */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

        {/* AUDIT LOGS */}

        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">

          <h2 className="text-2xl text-green-400 font-bold mb-4">
            🕐 Activity Timeline
          </h2>

          {auditLoading && (
            <p className="text-yellow-400">
              Loading activity...
            </p>
          )}

          {!auditLoading && auditLogs.length === 0 && (
            <p className="text-gray-400">
              No activity yet.
            </p>
          )}

          {!auditLoading && auditLogs.length > 0 && (

            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">

              {auditLogs.map((log) => (

                <div
                  key={log.id}
                  className="border-l-2 border-green-500 pl-4"
                >

                  <p
                    className={`font-bold ${getActionColor(log.action)}`}
                  >

                    {getActionIcon(log.action)} {log.action}

                  </p>

                  <p className="text-white text-sm mt-1">
                    {log.detail}
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    {formatTime(log.created_at)}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* REPORTS */}

        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">

          <h2 className="text-2xl text-green-400 font-bold mb-4">
            📁 Uploaded Reports
          </h2>

          {reportsLoading && (
            <p className="text-yellow-400">
              Loading reports...
            </p>
          )}

          {!reportsLoading && reports.length === 0 && (
            <p className="text-gray-400">
              No reports uploaded yet.
            </p>
          )}

          {!reportsLoading && reports.length > 0 && (

            <div className="overflow-x-auto max-h-96 overflow-y-auto">

              <table className="w-full text-left border-collapse">

                <thead>

                  <tr className="border-b border-green-500">

                    <th className="py-2 pr-4 text-green-400">
                      #
                    </th>

                    <th className="py-2 pr-4 text-green-400">
                      Title
                    </th>

                    <th className="py-2 text-green-400">
                      File
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {reports.map((report, index) => (

                    <tr
                      key={report.id}
                      className="border-b border-gray-800 hover:bg-gray-800"
                    >

                      <td className="py-2 pr-4 text-gray-400">
                        {index + 1}
                      </td>

                      <td className="py-2 pr-4 text-white">
                        {report.title}
                      </td>

                      <td className="py-2 text-green-300 text-sm">
                        {report.filename}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* CYBER NEWS */}

      <div className="bg-gray-900 p-6 rounded-lg border border-green-500">

        <h2 className="text-2xl text-green-400 font-bold mb-6">
          📡 Live Cyber Threat Intelligence
        </h2>

        {newsLoading && (
          <p className="text-yellow-400">
            Fetching latest threat news...
          </p>
        )}

        {!newsLoading && news.length === 0 && (
          <p className="text-gray-400">
            Could not load news.
          </p>
        )}

        {!newsLoading && news.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {news.map((article, index) => (

              <a
                key={index}
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="block bg-black border border-green-500 p-4 rounded-lg hover:border-green-300 transition-colors"
              >

                {article.image_url && (

                  <img
                    src={article.image_url}
                    alt="news"
                    className="w-full h-32 object-cover rounded mb-3"
                  />

                )}

                <p className="text-green-400 text-xs mb-2 uppercase">
                  {article.source_id || "Cyber News"}
                </p>

                <p className="text-white text-sm font-semibold leading-snug">
                  {article.title}
                </p>

                <p className="text-gray-500 text-xs mt-2">

                  {article.pubDate
                    ? new Date(article.pubDate).toLocaleDateString()
                    : ""}

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