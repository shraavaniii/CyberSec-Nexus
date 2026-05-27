import { useState, useEffect } from "react"
import axios from "axios"

function SecureReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch reports uploaded by users
  useEffect(() => {
    axios
      .get("https://onrender.com")
      .then((res) => {
        setReports(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching secure reports:", err)
        setLoading(false)
      })
  }, [])

  // SECURE FILE DOWNLOAD LOGIC
  const handleSecureDownload = async (fileUrl, fileName) => {
    try {
      if (!fileUrl) return alert("Download error: Invalid file link.")

      // 1. Fetch file directly as text content to prevent standard HTML fallback bugs
      const response = await axios.get(fileUrl, { responseType: "text" })

      // 2. Build a local clean file attachment from text data strings
      const element = document.createElement("a")
      const file = new Blob([response.data], { type: "text/plain;charset=utf-8" })
      element.href = URL.createObjectURL(file)
      element.download = fileName || "Incident_Report.txt"
      
      // 3. Append, auto-trigger, and destroy the dynamic node link
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (error) {
      console.error("Secure fetch download block intercept:", error)
      // Hard Fallback: Force direct windows location navigation bypass
      window.open(fileUrl, "_blank")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl text-green-500 font-bold mb-2">🔒 Secure Incident Records</h1>
      <p className="text-gray-400 mb-8">Access and manage your historically archived vulnerability data streams.</p>

      <div className="bg-gray-900 p-6 rounded-lg border border-green-500 max-w-4xl">
        <h2 className="text-2xl text-green-400 font-bold mb-4">📄 Repository Archives</h2>
        
        {loading && <p className="text-yellow-400 animate-pulse">Scanning server database nodes...</p>}
        {!loading && reports.length === 0 && (
          <p className="text-gray-400">No authenticated telemetry recordings discovered.</p>
        )}
        
        {!loading && reports.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-green-500">
                  <th className="py-3 pr-4 text-green-400 font-mono w-16">NODE</th>
                  <th className="py-3 pr-4 text-green-400 font-mono">RECORD TITLE</th>
                  <th className="py-3 text-green-400 font-mono text-right">METADATA INTERACTION</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={report.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 pr-4 text-gray-500 font-mono">#{index + 1}</td>
                    <td className="py-3 pr-4 text-white font-medium">{report.title}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleSecureDownload(report.fileurl, report.filename)}
                        className="bg-transparent hover:bg-green-500 text-green-400 font-semibold hover:text-black py-1 px-4 border border-green-500 hover:border-transparent rounded text-xs transition-all duration-200 cursor-pointer shadow-sm shadow-green-500/20"
                      >
                        📥 Download Record
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
  )
}

export default SecureReports
