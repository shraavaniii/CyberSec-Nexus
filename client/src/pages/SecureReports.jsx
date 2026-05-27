import { useState, useEffect } from "react"
import axios from "axios"

function SecureReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  
  // New states for handling uploads
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState("")
  const [uploading, setUploading] = useState(false)

  // 1. FETCH HISTORICAL REPORTS ON MOUNT
  const fetchReports = () => {
    setLoading(true)
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
  }

  useEffect(() => {
    fetchReports()
  }, [])

  // 2. FILE UPLOAD LOGIC HANDLER
  // UPDATE this function to grab the first index element explicitly
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]); // 🟢 FIXED: Added [0] to select the actual PDF file binary
    }
  };


  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!file || !title) return alert("Please provide a report title and select a file.")

    setUploading(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file[0]);

    try {
      await axios.post("https://onrender.com", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      alert("Report uploaded successfully to SecureVault!")
      setTitle("")
      setFile(null)
      // Reset the file input element visually
      document.getElementById("fileInput").value = ""
      fetchReports() // Refresh list automatically
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Check your file extension or size constraints.")
    } finally {
      setUploading(false)
    }
  };

  // 3. SECURE FILE DOWNLOAD LOGIC HANDLER
  const handleSecureDownload = async (fileUrl, fileName) => {
    try {
      if (!fileUrl) return alert("Download error: Invalid file link.")
      const response = await axios.get(fileUrl, { responseType: "text" })
      
      const element = document.createElement("a")
      const blobFile = new Blob([response.data], { type: "text/plain;charset=utf-8" })
      element.href = URL.createObjectURL(blobFile)
      element.download = fileName || "Incident_Report.txt"
      
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (error) {
      console.error("Secure fetch download block intercept:", error)
      window.open(fileUrl, "_blank")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl text-green-500 font-bold mb-2">🔒 Secure Incident Records</h1>
      <p className="text-gray-400 mb-8">Access, upload, and manage your historically archived vulnerability data streams.</p>

      {/* FIXED MODULE: Added back the Browse and Upload form layout section */}
      <div className="bg-gray-900 p-6 rounded-lg border border-green-500 max-w-4xl mb-8">
        <h2 className="text-2xl text-green-400 font-bold mb-4">📤 Upload New Incident Telemetry</h2>
        <form onSubmit={handleUploadSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex flex-col flex-1 gap-2 w-full">
            <label className="text-gray-400 text-sm">Report Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., XSS Attack Log" 
              className="bg-black border border-gray-700 text-white p-2 rounded focus:border-green-500 outline-none text-sm"
            />
          </div>
          <div className="flex flex-col flex-1 gap-2 w-full">
            <label className="text-gray-400 text-sm">Select Document File</label>
            <input 
              id="fileInput"
              type="file" 
              onChange={handleFileChange}
              className="bg-black border border-gray-700 text-gray-400 p-1.5 rounded focus:border-green-500 outline-none text-sm file:bg-gray-800 file:text-green-400 file:border-0 file:px-3 file:py-1 file:rounded file:mr-2 file:cursor-pointer hover:file:bg-gray-700"
            />
          </div>
          <button 
            type="submit"
            disabled={uploading}
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded text-sm transition-all cursor-pointer disabled:bg-gray-700 disabled:text-gray-500"
          >
            {uploading ? "Uploading..." : "Upload Report"}
          </button>
        </form>
      </div>

      {/* REPOSITORY ARCHIVES LIST MODULE */}
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
