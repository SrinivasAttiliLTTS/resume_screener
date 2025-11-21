// import React, { useState } from "react";
// import { Box, Button, TextField, Typography } from "@mui/material";
// import { uploadJD } from "../api/api";

// export default function JDInput({ onParsed }) {
//   const [jdText, setJdText] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     setLoading(true);
//     try {
//       const data = await uploadJD(file, jdText);
//       // pass parsed data and raw text (prefer rawText if provided)
//       onParsed(data, jdText || (file ? "uploaded_file" : ""));
//     } catch (e) {
//       console.error(e);
//       alert("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6">Job Description</Typography>
//       <TextField fullWidth multiline minRows={4} value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste JD text here" sx={{ mb: 1 }} />
//       <input type="file" onChange={e => setFile(e.target.files[0])} />
//       <Box sx={{ mt: 1 }}>
//         <Button variant="contained" onClick={handleUpload} disabled={loading}>Parse JD</Button>
//       </Box>
//     </Box>
//   );
// }

// import React, { useState } from "react";
// import { Box, Button, TextField, Typography, Stack } from "@mui/material";
// import { uploadJD } from "../api/api";

// export default function JDInput({ onParsed }) {
//   // Three inputs for skills
//   const [primary, setPrimary] = useState("");
//   const [secondary, setSecondary] = useState("");
//   const [other, setOther] = useState("");

//   // Optional file upload (unchanged)
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Build the single jdText string that the rest of the app expects
//   const buildCombinedJDText = () => {
//     const lines = [];
//     if (primary.trim())   lines.push(`Primary: ${primary.trim()}`);
//     if (secondary.trim()) lines.push(`Secondary: ${secondary.trim()}`);
//     if (other.trim())     lines.push(`Other: ${other.trim()}`);
//     return lines.join("\n"); // newline-separated sections
//   };

//   const hasAnySkill =
//     primary.trim().length > 0 ||
//     secondary.trim().length > 0 ||
//     other.trim().length > 0;

//   const handleUpload = async () => {
//     if (!hasAnySkill && !file) {
//       // Require at least one skills section or a file
//       return;
//     }
//     setLoading(true);
//     try {
//       const jdTextCombined = buildCombinedJDText();

//       // Keep your existing API contract: jdText as a single string
//       const data = await uploadJD(file, jdTextCombined);

//       // Keep your existing onParsed contract: (parsedData, rawText)
//       // We pass parsed data (whatever server returned) and the combined jdText
//       onParsed(
//         // If API returns a structured object in data.parsed, use it; else send a client-built one
//         data?.parsed ?? {
//           primarySkills: primary,
//           secondarySkills: secondary,
//           otherSkills: other,
//         },
//         jdTextCombined
//       );
//     } catch (e) {
//       console.error(e);
//       alert("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" sx={{ mb: 1 }}>
//         Job Description — Skills
//       </Typography>

//       <Stack spacing={2}>
//               <Stack direction={'row'} spacing={2}>

//         <TextField
//          fullWidth multiline minRows={4}
//           label="Primary skills (comma-separated)"
//           placeholder="e.g., React, TypeScript, Redux"
//           value={primary}
//           onChange={(e) => setPrimary(e.target.value)}
          
//         />
//         <TextField
//           label="Secondary skills (comma-separated)"
//           placeholder="e.g., Node.js, GraphQL, Jest"
//           value={secondary}
//           onChange={(e) => setSecondary(e.target.value)}
//           fullWidth multiline minRows={4}
//         />
//         <TextField
//           label="Other skills (comma-separated)"
//           placeholder="e.g., Docker, AWS, CI/CD"
//           value={other}
//           onChange={(e) => setOther(e.target.value)}
//           fullWidth multiline minRows={4}
//         />
//       </Stack>

//         {/* File upload unchanged */}
//         <div>
//           <input
//             type="file"
//             accept=".txt,.pdf,.doc,.docx"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//           {file && (
//             <Typography variant="caption" sx={{ ml: 1 }}>
//               Selected: {file.name}
//             </Typography>
//           )}
//         </div>

//         <Box>
//           <Button
//             variant="contained"
//             onClick={handleUpload}
//             disabled={loading || (!hasAnySkill && !file)}
//           >
//             Parse JD
//           </Button>
//         </Box>
//       </Stack>
//     </Box>
//   );
// }


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Grid,
//   Card,
//   CardHeader,
//   CardContent,
//   CardActions,
//   Chip,
//   IconButton,
//   Divider,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SaveIcon from "@mui/icons-material/Save";
// import UploadIcon from "@mui/icons-material/UploadFile";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import { uploadJD } from "../api/api";

// // ----- Local storage helpers -----
// const STORAGE_KEY = "jd_store_v1";

// function loadStore() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }
// function saveStore(items) {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
// }

// // Parse combined JD text (section headers) back to structured fields
// function parseCombinedJDText(jdText) {
//   const pick = (label) => {
//     const m = jdText.match(new RegExp(`^${label}\\s*:\\s*(.*)$`, "mi"));
//     return m ? m[1] : "";
//   };
//   const primary = pick("Primary");
//   const secondary = pick("Secondary");
//   const other = pick("Other");

//   const toArray = (s) =>
//     String(s || "")
//       .split(",")
//       .map((x) => x.trim())
//       .filter(Boolean);

//   return {
//     primarySkills: toArray(primary),
//     secondarySkills: toArray(secondary),
//     otherSkills: toArray(other),
//   };
// }

// function formatDate(ts) {
//   try {
//     return new Date(ts).toLocaleString();
//   } catch {
//     return "";
//   }
// }

// export default function JDInput({ onParsed }) {
//   // Skills inputs
//   const [primary, setPrimary] = useState("");
//   const [secondary, setSecondary] = useState("");
//   const [other, setOther] = useState("");

//   // Optional file upload
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // JD library state
//   const [jdName, setJdName] = useState("");      // e.g., skill_role_client
//   const [library, setLibrary] = useState([]);    // [{ name, jdText, createdAt }]
//   const [filter, setFilter] = useState("");

//   useEffect(() => {
//     setLibrary(loadStore());
//   }, []);

//   const buildCombinedJDText = () => {
//     const lines = [];
//     if (primary.trim())   lines.push(`Primary: ${primary.trim()}`);
//     if (secondary.trim()) lines.push(`Secondary: ${secondary.trim()}`);
//     if (other.trim())     lines.push(`Other: ${other.trim()}`);
//     return lines.join("\n");
//   };

//   const hasAnySkill =
//     primary.trim().length > 0 ||
//     secondary.trim().length > 0 ||
//     other.trim().length > 0;

//   const handleUpload = async () => {
//     if (!hasAnySkill && !file) return;
//     setLoading(true);
//     try {
//       const jdTextCombined = buildCombinedJDText();
//       const data = await uploadJD(file, jdTextCombined);

//       // Push up to App.jsx (unchanged)
//       onParsed(
//         data?.parsed ?? {
//           primarySkills: primary.split(",").map((s) => s.trim()).filter(Boolean),
//           secondarySkills: secondary.split(",").map((s) => s.trim()).filter(Boolean),
//           otherSkills: other.split(",").map((s) => s.trim()).filter(Boolean),
//         },
//         jdTextCombined
//       );

//       // Auto-save if a name is present
//       if (jdName.trim()) saveCurrentJD();
//     } catch (e) {
//       console.error(e);
//       alert("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----- Save / Load / Delete -----
//   const saveCurrentJD = () => {
//     const name = jdName.trim();
//     if (!name) {
//       alert("Please provide a JD name (e.g., skill_role_client).");
//       return;
//     }
//     const jdTextCombined = buildCombinedJDText();
//     if (!jdTextCombined) {
//       alert("Please enter at least one skills section to save.");
//       return;
//     }

//     const items = loadStore();
//     const existingIdx = items.findIndex((x) => x.name.toLowerCase() === name.toLowerCase());
//     const entry = { name, jdText: jdTextCombined, createdAt: Date.now() };

//     if (existingIdx >= 0) {
//       const ok = window.confirm(`A JD named "${name}" exists. Overwrite?`);
//       if (!ok) return;
//       items[existingIdx] = entry;
//     } else {
//       items.unshift(entry);
//     }

//     saveStore(items);
//     setLibrary(items);
//   };

//   const handleLoad = (entry) => {
//     const parsed = parseCombinedJDText(entry.jdText);
//     setPrimary(parsed.primarySkills.join(", "));
//     setSecondary(parsed.secondarySkills.join(", "));
//     setOther(parsed.otherSkills.join(", "));
//     setJdName(entry.name);
//     onParsed(parsed, entry.jdText);
//   };

//   const handleDelete = (name) => {
//     const items = loadStore().filter((x) => x.name !== name);
//     saveStore(items);
//     setLibrary(items);
//   };

//   const filtered = library.filter((x) =>
//     x.name.toLowerCase().includes(filter.toLowerCase())
//   );

//   // ----- UI -----
//   return (
//     <Box sx={{ mb: 3 }}>
//       <Grid container spacing={2}>
//         {/* LEFT: Skills editor (70%) */}
//         <Grid item xs={12} md={8}>
//           <Card variant="outlined" sx={{ height: "100%" }}>
//             <CardHeader
//               title="Job Description — Skills"
//               subheader="Enter comma-separated skills for each section"
//             />
//             <CardContent>
//               <Stack spacing={2}>
//                 <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
//                   <TextField
//                     fullWidth
//                     multiline
//                     minRows={3}
//                     label="Primary skills"
//                     placeholder="e.g., React, TypeScript, Redux"
//                     value={primary}
//                     onChange={(e) => setPrimary(e.target.value)}
//                   />
//                   <TextField
//                     fullWidth
//                     multiline
//                     minRows={3}
//                     label="Secondary skills"
//                     placeholder="e.g., Node.js, GraphQL, Jest"
//                     value={secondary}
//                     onChange={(e) => setSecondary(e.target.value)}
//                   />
//                   <TextField
//                     fullWidth
//                     multiline
//                     minRows={3}
//                     label="Other skills"
//                     placeholder="e.g., Docker, AWS, CI/CD"
//                     value={other}
//                     onChange={(e) => setOther(e.target.value)}
//                   />
//                 </Stack>

//                 <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
//                   <TextField
//                     fullWidth
//                     label="JD name (e.g., skill_role_client)"
//                     placeholder="e.g., react_fe_acme"
//                     value={jdName}
//                     onChange={(e) => setJdName(e.target.value)}
//                   />
//                   <Button
//                     startIcon={<SaveIcon />}
//                     variant="outlined"
//                     onClick={saveCurrentJD}
//                     disabled={!hasAnySkill}
//                   >
//                     Save JD
//                   </Button>
//                 </Stack>

//                 <Divider />

//                 <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
//                   <Box>
//                     <input
//                       type="file"
//                       accept=".txt,.pdf,.doc,.docx"
//                       onChange={(e) => setFile(e.target.files[0])}
//                     />
//                     {file && (
//                       <Typography variant="caption" sx={{ ml: 1 }}>
//                         Selected: {file.name}
//                       </Typography>
//                     )}
//                   </Box>

//                   <Box sx={{ flexGrow: 1 }} />

//                   <Button
//                     startIcon={<UploadIcon />}
//                     variant="contained"
//                     onClick={handleUpload}
//                     disabled={loading || (!hasAnySkill && !file)}
//                   >
//                     Parse JD
//                   </Button>
//                 </Stack>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* RIGHT: Saved JDs (30%) */}
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//             <CardHeader
//               title="Saved JDs"
//               subheader="Quickly load previously used JDs"
//             />
//             <CardContent sx={{ pt: 0 }}>
//               {/* Search bar */}
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Search by name"
//                 placeholder="Type to filter…"
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 sx={{ mb: 2 }}
//               />

//               {/* Tile list */}
//               <Stack
//                 spacing={2}
//                 sx={{
//                   maxHeight: 250,
//                   overflow: "auto",
//                   pr: 1,
//                 }}
//               >
//                 <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 1 }}>
//   {filtered.length === 0 ? (
//     <Typography variant="body2" color="text.secondary">
//       No saved JDs yet. Save one using the field on the left.
//     </Typography>
//   ) : (
//     // tighter spacing between tiles
//     <Stack spacing={1}>
//       {filtered.map((entry) => {
//         const parsed = parseCombinedJDText(entry.jdText);

//         // compact chip renderer with a cap and "+X more"
//         const renderChips = (arr = [], max = 4) => {
//           const shown = arr.slice(0, max);
//           const hiddenCount = Math.max(0, arr.length - shown.length);
//           return (
//             <>
//               {shown.map((s, i) => (
//                 <Chip
//                   key={`${s}-${i}`}
//                   label={s}
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     mr: 0.75,
//                     mb: 0.5,
//                     fontSize: "0.72rem",
//                     height: 22,
//                   }}
//                 />
//               ))}
//               {hiddenCount > 0 && (
//                 <Chip
//                   label={`+${hiddenCount} more`}
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     mr: 0.75,
//                     mb: 0.5,
//                     fontStyle: "italic",
//                     fontSize: "0.72rem",
//                     height: 22,
//                   }}
//                 />
//               )}
//             </>
//           );
//         };

//         return (
//           <Card
//             key={entry.name}
//             variant="outlined"
//             sx={{
//               borderRadius: 1,
//               // keep tiles short; horizontal rectangle feel
//               // use a min-height rather than fixed to allow two/three chip rows
//               py: 0.5,
//               px: 1,
//             }}
//           >
//             <Grid container alignItems="center" spacing={1}>
//               {/* LEFT: Name + date (fixed width) */}
//               <Grid item xs={12} md={3}>
//                 <Typography
//                   variant="subtitle2"
//                   noWrap
//                   sx={{ lineHeight: 1.2 }}
//                   title={entry.name}
//                 >
//                   {entry.name}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {formatDate(entry.createdAt)}
//                 </Typography>
//               </Grid>

//               {/* CENTER: Compact chip lanes (grow) */}
//               <Grid item xs={12} md={7}>
//                 {/* Primary */}
//                 {parsed.primarySkills?.length ? (
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 0.25 }}>
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       sx={{ minWidth: 68 }}
//                     >
//                       Primary
//                     </Typography>
//                     <Box sx={{ ml: 1, flexWrap: "wrap", display: "flex" }}>
//                       {renderChips(parsed.primarySkills, 4)}
//                     </Box>
//                   </Box>
//                 ) : null}

//                 {/* Secondary */}
//                 {parsed.secondarySkills?.length ? (
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 0.25 }}>
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       sx={{ minWidth: 68 }}
//                     >
//                       Secondary
//                     </Typography>
//                     <Box sx={{ ml: 1, flexWrap: "wrap", display: "flex" }}>
//                       {renderChips(parsed.secondarySkills, 4)}
//                     </Box>
//                   </Box>
//                 ) : null}

//                 {/* Other */}
//                 {parsed.otherSkills?.length ? (
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       sx={{ minWidth: 68 }}
//                     >
//                       Other
//                     </Typography>
//                     <Box sx={{ ml: 1, flexWrap: "wrap", display: "flex" }}>
//                       {renderChips(parsed.otherSkills, 4)}
//                     </Box>
//                   </Box>
//                 ) : null}
//               </Grid>

//               {/* RIGHT: Actions (Load / Delete) */}
//               <Grid
//                 item
//                 xs={12}
//                 md={2}
//                 sx={{
//                   display: "flex",
//                   justifyContent: { xs: "flex-start", md: "flex-end" },
//                   alignItems: "center",
//                   gap: 1,
//                 }}
//               >
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<FolderOpenIcon />}
//                   onClick={() => handleLoad(entry)}
//                   sx={{ height: 28, fontSize: "0.75rem" }}
//                 >
//                   Load
//                 </Button>
//                 <IconButton
//                   size="small"
//                   color="error"
//                   onClick={() => handleDelete(entry.name)}
//                   aria-label={`Delete ${entry.name}`}
//                   sx={{ height: 28, width: 28 }}
//                 >
//                   <DeleteIcon fontSize="small" />
//                 </IconButton>
//               </Grid>
//             </Grid>
//           </Card>
//         );
//       })}
//     </Stack>
//   )}
// </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// JDInput.jsx — Professional Dashboard UI (FULL FILE)

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Chip,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/UploadFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { uploadJD } from "../api/api";

// -------------------------
// Local Storage Helpers
// -------------------------
const STORAGE_KEY = "jd_store_v1";

const loadStore = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveStore = (items) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

// -------------------------
// JD Text Parser
// -------------------------
const parseCombinedJDText = (text) => {
  const pick = (label) => {
    const m = text.match(new RegExp(`^${label}\\s*:\\s*(.*)$`, "mi"));
    return m ? m[1] : "";
  };

  const arr = (s) =>
    (s || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  return {
    primarySkills: arr(pick("Primary")),
    secondarySkills: arr(pick("Secondary")),
    otherSkills: arr(pick("Other")),
  };
};

// ==========================================================
// COMPONENT
// ==========================================================

export default function JDInput({ onParsed }) {
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [other, setOther] = useState("");

  const [jdName, setJdName] = useState("");

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLibrary(loadStore());
  }, []);

  const buildCombinedJDText = () => {
    const lines = [];
    if (primary) lines.push(`Primary: ${primary}`);
    if (secondary) lines.push(`Secondary: ${secondary}`);
    if (other) lines.push(`Other: ${other}`);
    return lines.join("\n");
  };

  const handleSave = () => {
    if (!jdName.trim()) return alert("Please enter a JD name.");

    const jdText = buildCombinedJDText();
    if (!jdText) return alert("Enter at least one skill before saving.");

    const list = loadStore();
    const exists = list.findIndex((x) => x.name === jdName.trim());

    const entry = {
      name: jdName.trim(),
      jdText,
      createdAt: Date.now(),
    };

    if (exists >= 0) list[exists] = entry;
    else list.unshift(entry);

    saveStore(list);
    setLibrary(list);
  };

  const handleUpload = async () => {
    const jdText = buildCombinedJDText();
    if (!jdText && !file) return;

    setLoading(true);

    try {
      const data = await uploadJD(file, jdText);

      onParsed(
        data?.parsed ?? {
          primarySkills: primary.split(",").map((x) => x.trim()).filter(Boolean),
          secondarySkills: secondary
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          otherSkills: other.split(",").map((x) => x.trim()).filter(Boolean),
        },
        jdText
      );

      if (jdName.trim()) handleSave();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
    setLoading(false);
  };

  const handleLoad = (item) => {
    const parsed = parseCombinedJDText(item.jdText);

    setPrimary(parsed.primarySkills.join(", "));
    setSecondary(parsed.secondarySkills.join(", "));
    setOther(parsed.otherSkills.join(", "));

    setJdName(item.name);

    onParsed(parsed, item.jdText);
  };

  const handleDelete = (name) => {
    const list = loadStore().filter((x) => x.name !== name);
    saveStore(list);
    setLibrary(list);
  };

  const filtered = library.filter((x) =>
    x.name.toLowerCase().includes(filter.toLowerCase())
  );

  // ==========================================================
  // UI
  // ==========================================================
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>

        {/* LEFT: JD INPUT */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "500px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              title="Job Description — Skills"
              subheader="Enter comma-separated skills for each section"
              sx={{ background: "#f8f9fb" }}
            />

            <CardContent sx={{ overflowY: "auto" }}>
              <Stack spacing={3}>
                {/* SKILL INPUT FIELDS */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Primary Skills"
                      placeholder="React, TypeScript, ..."
                      value={primary}
                      onChange={(e) => setPrimary(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Secondary Skills"
                      placeholder="Node, GraphQL, ..."
                      value={secondary}
                      onChange={(e) => setSecondary(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Other Skills"
                      placeholder="AWS, Docker, ..."
                      value={other}
                      onChange={(e) => setOther(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Divider />

                {/* JD NAME */}
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      label="JD Name"
                      placeholder="react_fe_acme"
                      value={jdName}
                      onChange={(e) => setJdName(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>

                <Divider />

                {/* FILE + PARSE BUTTON */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Box sx={{ flexGrow: 1 }} />

                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    disabled={loading}
                    onClick={handleUpload}
                  >
                    Parse JD
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT: SAVED JDs */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              height: "500px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <CardHeader
              title="Saved JDs"
              subheader="Click ‘Load’ to reuse"
              sx={{ background: "#f8f9fb" }}
            />

            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                minHeight: 0,
              }}
            >
              {/* Search bar */}
              <TextField
                size="small"
                fullWidth
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Scrollable JD List */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  pr: 1,
                  minHeight: 0,
                }}
              >
                {filtered.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No saved JDs yet.
                  </Typography>
                ) : (
                  filtered.map((entry) => {
                    const parsed = parseCombinedJDText(entry.jdText);

                    return (
                      <Box
                        key={entry.name}
                        sx={{
                          mb: 1.5,
                          p: 1.5,
                          borderRadius: 1.5,
                          background: "#fafafa",
                          border: "1px solid #e5e5e5",
                        }}
                      >
                        {/* Header Row */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.6,
                          }}
                        >
                          <Typography
                            noWrap
                            sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                            title={entry.name}
                          >
                            {entry.name}
                          </Typography>

                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem" }}
                              onClick={() => handleLoad(entry)}
                            >
                              Load
                            </Button>

                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(entry.name)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Date */}
                        <Typography variant="caption" color="text.secondary">
                          {new Date(entry.createdAt).toLocaleString()}
                        </Typography>

                        {/* Skill chips */}
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.6,
                          }}
                        >
                          {[...parsed.primarySkills, ...parsed.secondarySkills]
                            .slice(0, 5)
                            .map((skill, idx) => (
                              <Chip
                                key={idx}
                                label={skill}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.65rem", height: 20 }}
                              />
                            ))}

                          {parsed.primarySkills.length +
                            parsed.secondarySkills.length >
                            5 && (
                            <Chip
                              label="+ more"
                              size="small"
                              sx={{
                                fontSize: "0.65rem",
                                height: 20,
                                background: "#eee",
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
