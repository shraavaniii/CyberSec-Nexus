import { useState, useEffect } from "react"
import axios from "axios"

function SecureReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const [file, setFile] = useState(null)
  const [title, setTitle] = useState("")
  const [uploading, setUploading] = useState(false)

  // YOUR BACKEND URL
  const API_URL = "https://cybersec-nexus-backend.onrender.com/api/reports"

  // FETCH REPORTS
  const fetchReports = async () => {
    try {
      setLoading(true)

      const res = await axios.get(API_URL)

      setReports(res.data)
    } catch (err) {
      console.error("Error fetching reports:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  // FILE SELECT
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    // ALLOWED FILE TYPES
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg"
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF, PNG, JPG, JPEG files are allowed.")
      return
    }

    // MAX SIZE = 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB.")
      return
    }

    setFile(selectedFile)
  }

  // UPLOAD REPORT
  const handleUploadSubmit = async (e) => {
    e.preventDefault()

    if (!title || !file) {
      return alert("Please enter title and select a file.")
    }

    try {
      setUploading(true)

      const formData = new FormData()

      formData.append("title", title)

      // IMPORTANT FIX
      formData.append("file", file)

      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      console.log(response.data)

      alert("Report uploaded successfully!")

      // RESET
      setTitle("")
      setFile(null)

      document.getElementById("fileInput").value = ""

      fetchReports()

    } catch (error) {
      console.error("UPLOAD ERROR:", error)

      if (error.response) {
        alert(error.response.data.message || "Upload failed.")
      } else {
        alert("Server connection failed.")
      }

    } finally {
      setUploading(false)
    }
  }

  // DOWNLOAD FILE
  const handleSecureDownload = (fileUrl) => {
    if (!fileUrl) {
      return alert("Invalid file URL")
    }

    window.open(fileUrl, "_blank")
  }

  return (
    <div className="p-6">

      <h1 className="text-4xl text-green-500 font-bold mb-2">
        🔒 Secure Incident Records
      </h1>

      <p className="text-gray-400 mb-8">
        Access, upload, and manage archived vulnerability reports.
      </p>

      {/* UPLOAD SECTION */}

      <div className="bg-gray-900 p-6 rounded-lg border border-green-500 max-w-4xl mb-8">

        <h2 className="text-2xl text-green-400 font-bold mb-4">
          📤 Upload New Incident Telemetry
        </h2>

        <form
          onSubmit={handleUploadSubmit}
          className="flex flex-col md:flex-row gap-4 items-end"
        >

          {/* TITLE */}

          <div className="flex flex-col flex-1 gap-2 w-full">

            <label className="text-gray-400 text-sm">
              Report Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., XSS Attack Log"
              className="bg-black border border-gray-700 text-white p-2 rounded focus:border-green-500 outline-none text-sm"
            />

          </div>

          {/* FILE */}

          <div className="flex flex-col flex-1 gap-2 w-full">

            <label className="text-gray-400 text-sm">
              Select File
            </label>

            <input
              id="fileInput"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="bg-black border border-gray-700 text-gray-400 p-1.5 rounded focus:border-green-500 outline-none text-sm file:bg-gray-800 file:text-green-400 file:border-0 file:px-3 file:py-1 file:rounded file:mr-2 file:cursor-pointer hover:file:bg-gray-700"
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={uploading}
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded text-sm transition-all cursor-pointer disabled:bg-gray-700 disabled:text-gray-500"
          >
            {uploading ? "Uploading..." : "Upload Report"}
          </button>

        </form>

      </div>

      {/* REPORT LIST */}

      <div className="bg-gray-900 p-6 rounded-lg border border-green-500 max-w-4xl">

        <h2 className="text-2xl text-green-400 font-bold mb-4">
          📄 Repository Archives
        </h2>

        {loading && (
          <p className="text-yellow-400 animate-pulse">
            Loading reports...
          </p>
        )}

        {!loading && reports.length === 0 && (
          <p className="text-gray-400">
            No reports found.
          </p>
        )}

        {!loading && reports.length > 0 && (

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="border-b border-green-500">
                  <th className="py-3 pr-4 text-green-400 font-mono">
                    NODE
                  </th>

                  <th className="py-3 pr-4 text-green-400 font-mono">
                    REPORT TITLE
                  </th>

                  <th className="py-3 text-green-400 font-mono text-right">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>

                {reports.map((report, index) => (

                  <tr
                    key={report.id}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >

                    <td className="py-3 pr-4 text-gray-500 font-mono">
                      #{index + 1}
                    </td>

                    <td className="py-3 pr-4 text-white font-medium">
                      {report.title}
                    </td>

                    <td className="py-3 text-right">

                      <button
                        onClick={() =>
                          handleSecureDownload(report.fileurl)
                        }
                        className="bg-transparent hover:bg-green-500 text-green-400 font-semibold hover:text-black py-1 px-4 border border-green-500 hover:border-transparent rounded text-xs transition-all duration-200 cursor-pointer shadow-sm shadow-green-500/20"
                      >
                        📥 Download
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