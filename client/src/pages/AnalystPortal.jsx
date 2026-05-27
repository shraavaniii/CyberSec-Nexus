import { useState, useEffect } from "react"
import axios from "ajax" // Note: ensure this matches your existing project import, e.g. "axios"

const NEWS_API_KEY = "pub_88ed07b232f2408b8835604828b21a3c"

// Binary blob handler to download securely from Cloudinary without 401/CORS restrictions
const handleDownloadFile = async (fileUrl, fileName) => {
  try {
    // 1. Fetch the file data seamlessly as a blob
    const response = await axios.get(fileUrl, { responseType: "blob" });
    
    // 2. Generate an internal temporary browser link
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = blobUrl;
    
    // 3. Set structural file name metadata and click it programmatically
    link.setAttribute("download", fileName || "download");
    document.body.appendChild(link);
    link.click();
    
    // 4. Garbage collection cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("File download failed:", error);
    // Fallback safety valve: opens asset in a separate window context if security layers intercept blob
    window.open(fileUrl, "_blank");
  }
};

function AnalystPortal() {
  const [reports, setReports] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [auditLoading, setAuditLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(true)

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  // FETCH REPORTS
  useEffect(() => {
    axios
      .get("https://cybersec-nexus-backend.onrender.com/api/reports")
      .then((res) => {
        setReports(res.data)
        setReportsLoading(false)
      })
      .catch(() => setReportsLoading(false))
  }, [])

  // FETCH AUDIT LOGS
  useEffect(() => {
    axios
      .get("https://cybersec-nexus-backend.onrender.com/api/audit")
      .then((res) => {
        setAuditLogs(res.data)
        setAuditLoading(false)
      })
      .catch(() => setAuditLoading(false))
  }, [])

  // FETCH CYBER NEWS
  useEffect(() => {
    axios
      .get(
        `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=cybersecurity&language=en&size=6`
      )
      .then((res) => {
        setNews(res.data.results || [])
        setNewsLoading(false)
      })
      .catch(() => setNewsLoading(false))
  }, [])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getActionColor = (action) => {
    if (action === "Threat Scan") return "text-yellow-400"
    if (action === "Report Uploaded") return "text-green-400"
    return "text-blue-400"
  }

  const getActionIcon = (action) => {
    if (action === "Threat Scan") return "🔍"
    if (action === "Report Uploaded") return "📄"
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
        <span className={isLoggedIn ? "text-green-400" : "text-red-400"}>
          {isLoggedIn ? "✔ Authenticated" : "✘ Not Logged In — Please Login First"}
        </span>
      </p>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">
          <h2 className="text-green-400 text-lg mb-1">Total Reports</h2>
          <p className="text-4xl font-bold">
            {reportsLoading ? "..." : reports.length}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">
          <h2 className="text-green-400 text-lg mb-1">Total Activities</h2>
          <p className="text-4xl font-bold">
            {auditLoading ? "..." : auditLogs.length}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">
          <h2 className="text-green-400 text-lg mb-1">Threat Engine</h2>
          <p className="text-green-300 text-lg font-semibold mt-2">✔ Online</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

        {/* AUDIT ACTIVITY TIMELINE */}
        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">
          <h2 className="text-2xl text-green-400 font-bold mb-4">
            🕐 Activity Timeline
          </h2>
          {auditLoading && (
            <p className="text-yellow-400">Loading activity...</p>
          )}
          {!auditLoading && auditLogs.length === 0 && (
            <p className="text-gray-400">
              No activity yet. Run a scan or upload a report.
            </p>
          )}
          {!auditLoading && auditLogs.length > 0 && (
            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="border-l-2 border-green-500 pl-4"
                >
                  <p className={`font-bold ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)} {log.action}
                  </p>
                  <p className="text-white text-sm mt-1">{log.detail}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatTime(log.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UPLOADED REPORTS TABLE */}
        <div className="bg-gray-900 p-6 rounded-lg border border-green-500">
          <h2 className="text-2xl text-green-400 font-bold mb-4">
            📁 Uploaded Reports
          </h2>
          {reportsLoading && (
            <p className="text-yellow-400">Loading reports...</p>
          )}
          {!reportsLoading && reports.length === 0 && (
            <p className="text-gray-400">No reports uploaded yet.</p>
          )}
          {!reportsLoading && reports.length > 0 && (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-green-500">
                    <th className="py-2 pr-4 text-green-400">#</th>
                    <th className="py-2 pr-4 text-green-400">Title</th>
                    <th className="py-2 text-green-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr
                      key={report.id}
                      className="border-b border-gray-800 hover:bg-gray-800"
                    >
                      <td className="py-2 pr-4 text-gray-400">{index + 1}</td>
                      <td className="py-2 pr-4 text-white">{report.title}</td>
                      {/* FIX: Converted the faulty <a> tag into a stable click-event button */}
                      <td className="py-2">
                        <button 
                          onClick={() => handleDownloadFile(report.fileurl, report.filename)}
                          className="inline-block bg-black border border-green-500 text-green-400 text-xs px-3 py-1 rounded hover:bg-green-500 hover:text-black transition-colors cursor-pointer"
                        >
                          📥 Download ({report.filename})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* LIVE CYBER THREAT NEWS */}
      <div className="bg-gray-900 p-6 rounded-lg border border-green-500">
        <h2 className="text-2xl text-green-400 font-bold mb-6">
          📡 Live Cyber Threat Intelligence
        </h2>
        {newsLoading && (
          <p className="text-yellow-400">Fetching latest threat news...</p>
        )}
        {!newsLoading && news.length === 0 && (
          <p className="text-gray-400">Could not load news. Try again later.</p>
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
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                <p className="text-green-400 text-xs mb-2 uppercase">
                  {article.source_id || "Cybersecurity News"}
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
