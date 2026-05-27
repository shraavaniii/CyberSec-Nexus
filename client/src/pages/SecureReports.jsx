import { useState } from "react"
import axios from "axios"

const BASE_URL = "https://cybersec-nexus-backend.onrender.com"

function SecureReports() {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

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
        Upload and store security reports, logs, and investigation files
      </p>

      <div className="glass rounded-2xl p-8 max-w-2xl"
        style={{ border: "1px solid rgba(0,150,255,0.2)" }}>

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

        {/* MESSAGE */}
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
    </div>
  )
}

export default SecureReports
import { useState } from "react"
import axios from "axios"

const BASE_URL = "https://cybersec-nexus-backend.onrender.com"

function SecureReports() {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

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
        Upload and store security reports, logs, and investigation files
      </p>

      <div className="glass rounded-2xl p-8 max-w-2xl"
        style={{ border: "1px solid rgba(0,150,255,0.2)" }}>

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

        {/* MESSAGE */}
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
    </div>
  )
}

export default SecureReports
