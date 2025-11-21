import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:10000";
// const API_BASE = process.env.REACT_APP_API_BASE || "https://ai-resume-screen-backend.onrender.com";
export async function uploadJD(jdFile, jdText) {
  const fd = new FormData();
  if (jdFile) fd.append("jd_file", jdFile);
  if (jdText) fd.append("jd_text", jdText);
  const res = await axios.post(`${API_BASE}/upload-jd`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}

export async function analyzeResumes(jdText, files) {
  const fd = new FormData();
  fd.append("jd_text", jdText);
  for (let i = 0; i < files.length; i++) fd.append("resumes", files[i], files[i].name);
  const res = await axios.post(`${API_BASE}/analyze-resumes`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}

export async function exportExcel(results) {
  const res = await axios.post(`${API_BASE}/export-excel`, results, { responseType: "blob" });
  return res.data;
}
