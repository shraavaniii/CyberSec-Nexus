import { useState, useEffect } from "react"
import axios from "axios"

const BASE_URL = "https://cybersec-nexus-backend.onrender.com"

function SecureReports() {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)

  // FETCH ALL REPORTS ON LOAD
  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/reports`)
      setReports(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setReportsLoading(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setSuccess(false)
      setMessage("Please enter a report title")
      return
    }
    if (!file) {
      setSuccess(false)
      setMessage("Please select a file")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)

    try {
      setLoading(true)
      const res = await axios.post(`${BASE_URL}/api/reports`, formData)

      setSuccess(true)
      setMessage(res.data.message || "Report Uploaded Successfully")

      // LOG TO AUDIT
      await axios.post(`${BASE_URL}/api/audit`, {
        action: "Report Uploaded",
        detail: `Report "${title}" uploaded (${file.name})`
      })

      // CLEAR FORM
      setTitle("")
      setFile(null)
      e.target.reset()

      // REFRESH REPORTS LIST
      fetchReports()

    } catch (error) {
      console.log(error)
      setSuccess(false)
      setMessage(error.response?.data?.message || "Upload Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-2">
      <h1 className="text-4xl font-bold text-white mb-2">Secure Reports</h1>
      <p className="text-blue-300 text-sm mb-8 opacity-70">
        Upload, store and access your security reports and investigation files
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* UPLOAD FORM */}
        <div className="glass rounded-2xl p-8"
          style={{ border: "1px solid rgba(0,150,255,0.2)" }}>
          <h2 className="text-xl font-bold text-white mb-6">📤 Upload Report</h2>

          <form onSubmit={handleUpload} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-blue-300 text-xs uppercase tracking-widest">
                Report Title
              </label>
              <input
                type="text"
                placeholder="Enter Report Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 text-sm"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-blue-300 text-xs uppercase tracking-widest">
                Select File
              </label>
              <div className="p-3 rounded-xl text-sm text-blue-200"
                style={{ border: "1px solid rgba(0,150,255,0.3)", background: "rgba(5,15,40,0.8)" }}>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="text-blue-200 w-full"
                  disabled={loading}
                />
              </div>
              {file && (
                <p className="text-blue-400 text-xs mt-1 opacity-70">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <button
              className="btn-glow p-3 rounded-xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                "Upload Report"
              )}
            </button>
          </form>

          {message && (
            <div className="mt-6 rounded-xl p-4 animate-fade-up"
              style={{
                background: success ? "rgba(0,200,100,0.1)" : "rgba(255,50,50,0.1)",
                border: `1px solid ${success ? "rgba(0,200,100,0.3)" : "rgba(255,50,50,0.3)"}`
              }}>
              <p className={`font-bold text-sm ${success ? "text-green-400" : "text-red-400"}`}>
                {success ? "✅" : "❌"} {message}
              </p>
            </div>
          )}
        </div>

        {/* REPORTS LIST */}
        <div className="glass rounded-2xl p-8"
          style={{ border: "1px solid rgba(0,150,255,0.2)" }}>
          <h2 className="text-xl font-bold text-white mb-6">📁 My Reports</h2>

          {reportsLoading && (
            <p className="text-blue-300 animate-pulse">Loading reports...</p>
          )}

          {!reportsLoading && reports.length === 0 && (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-blue-400 opacity-60 text-sm">
                No reports uploaded yet.
              </p>
            </div>
          )}

          {!reportsLoading && reports.length > 0 && (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
              {reports.map((report, index) => (
                <div key={report.id}
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: "rgba(0,100,255,0.08)", border: "1px solid rgba(0,150,255,0.15)" }}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">📄</span>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-bold truncate">{report.title}</p>
                      <p className="text-blue-400 text-xs opacity-60 truncate">{report.filename}</p>
                    </div>
                  </div>
                  {report.fileurl && (
                    <a
                      href={report.fileurl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-3 flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #0078ff, #00c8ff)" }}
                    >
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default SecureReports
