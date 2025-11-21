// import React, { useState } from "react";
// import { Box, Button, List, ListItem, Typography } from "@mui/material";
// import { analyzeResumes } from "../api/api";

// export default function ResumeUploader({ jdText, onResults }) {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleFiles = (e) => setFiles(Array.from(e.target.files));

//   const handleAnalyze = async () => {
//     if (!jdText) return alert("Provide JD first");
//     setLoading(true);
//     try {
//       const { results } = await analyzeResumes(jdText, files);
//       onResults(results);
//     } catch (e) {
//       console.error(e);
//       alert("Analysis failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6">Resumes</Typography>
//       <input type="file" multiple onChange={handleFiles} />
//       <List>
//         {files.map((f, idx) => <ListItem key={idx}>{f.name}</ListItem>)}
//       </List>
//       <Button variant="contained" onClick={handleAnalyze} disabled={loading || files.length === 0}>Analyze</Button>
//     </Box>
//   );
// }

// // ResumeUploader.jsx — Professional UI
// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   List,
//   ListItem,
//   Typography,
//   Card,
//   CardContent,
//   CardHeader,
// } from "@mui/material";
// import { analyzeResumes } from "../api/api";

// export default function ResumeUploader({ jdText, onResults }) {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleFiles = (e) => setFiles([...e.target.files]);

//   const analyze = async () => {
//     if (!jdText) return alert("Please parse JD first");
//     setLoading(true);
//     try {
//       const { results } = await analyzeResumes(jdText, files);
//       onResults(results);
//     } catch {
//       alert("Analysis failed");
//     }
//     setLoading(false);
//   };

//   return (
//     <Card sx={{ mb: 3, borderRadius: 2 }}>
//       <CardHeader
//         title="Resume Upload"
//         subheader="Upload candidate resumes"
//         sx={{ background: "#f8f9fb" }}
//       />
//       <CardContent>
//         <Box
//           sx={{
//             border: "2px dashed #c4c4c4",
//             borderRadius: 2,
//             p: 3,
//             textAlign: "center",
//             background: "#fafafa",
//             cursor: "pointer",
//           }}
//         >
//           <input
//             type="file"
//             multiple
//             onChange={handleFiles}
//             style={{ width: "100%" }}
//           />
//         </Box>

//         <List dense sx={{ mt: 2 }}>
//           {files.map((f, i) => (
//             <ListItem key={i}>{f.name}</ListItem>
//           ))}
//         </List>

//         <Button
//           variant="contained"
//           disabled={loading || files.length === 0}
//           onClick={analyze}
//         >
//           Analyze Resumes
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

// ResumeUploader.jsx — supports immediate row display + correct result mapping
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { analyzeResumes } from "../api/api";

export default function ResumeUploader({ jdText, onResults }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Immediately reflect filenames in results table
  const handleFiles = (e) => {
    const selected = [...e.target.files];
    setFiles(selected);

    const initialRows = selected.map((f) => ({
      Name: f.name,
      Strengths: "",
      "Missing Primary": "",
      "Missing Secondary": "",
      "Years of Experience": "",
      "Primary Score": "",
      "Secondary Score": "",
      "Overall Score": "",
      Status: "",
    }));

    onResults(initialRows);
  };

  const analyze = async () => {
    if (!jdText) return alert("Please parse JD first");
    if (files.length === 0) return;

    setLoading(true);

    try {
      const { results } = await analyzeResumes(jdText, files);

      // Merge backend result into existing rows
      const merged = results.map((r, i) => ({
        Name: files[i]?.name || `Candidate ${i + 1}`,
        Strengths: r.Strengths || "",
        "Missing Primary": r["Missing Primary"] || "",
        "Missing Secondary": r["Missing Secondary"] || "",
        "Years of Experience": r["Years of Experience"] || "",
        "Primary Score": r["Primary Score"] || "",
        "Secondary Score": r["Secondary Score"] || "",
        "Overall Score": r["Overall Score"] || "",
        Status: r.Status || "",
      }));

      onResults(merged);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    }

    setLoading(false);
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <CardHeader
        title="Resume Upload"
        subheader="Upload candidate resumes"
        sx={{ background: "#f8f9fb" }}
      />
      <CardContent>
        <Box
          sx={{
            border: "2px dashed #c4c4c4",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            background: "#fafafa",
            cursor: "pointer",
          }}
        >
          <input
            type="file"
            multiple
            onChange={handleFiles}
            style={{ width: "100%" }}
          />
        </Box>

        <Button
          variant="contained"
          disabled={loading || files.length === 0}
          onClick={analyze}
          sx={{ mt: 2 }}
        >
          Analyze Resumes
        </Button>
      </CardContent>
    </Card>
  );
}
