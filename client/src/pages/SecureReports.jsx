import { useState } from "react"
import axios from "axios"

function SecureReports() {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")

  const handleUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reports`,
        formData
      )
      setMessage(res.data)

      // LOG TO AUDIT
      await axios.post(`${import.meta.env.VITE_API_URL}/api/audit`, {
        action: "Report Uploaded",
        detail: `Report "${title}" uploaded (${file.name})`
      })

    } catch (error) {
      console.log(error)
      setMessage("Upload Failed")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl text-green-500 font-bold mb-6">
        Secure Reports
      </h1>
      <div className="bg-gray-900 p-8 rounded-lg max-w-2xl">
        <form
          onSubmit={handleUpload}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Enter Report Title"
            onChange={(e) => setTitle(e.target.value)}
            className="p-4 rounded bg-black border border-green-500 text-white"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-white"
          />
          <button
            className="bg-green-500 text-black px-6 py-3 rounded font-bold hover:bg-green-400"
          >
            Upload Report
          </button>
        </form>
        {message && (
          <div className="mt-6 bg-black border border-green-500 p-4 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default SecureReports
