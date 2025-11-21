// import React, { useState } from "react";
// import { Container, Typography, Box } from "@mui/material";
// import JDInput from "./components/JDInput";
// import ResumeUploader from "./components/ResumeUploader";
// import ResultsTable from "./components/ResultsTable";

// function App() {
//   const [jdParsed, setJdParsed] = useState(null);
//   const [jdText, setJdText] = useState("");
//   const [results, setResults] = useState([]);

//   return (
//     <Container sx={{ py: 3 }}>
//       <Typography variant="h4" sx={{ mb: 2 }}>Resume Screening Dashboard</Typography>

//       <JDInput onParsed={(data, rawText) => { setJdParsed(data); setJdText(rawText || JSON.stringify(data)); }} />

//       <ResumeUploader jdText={jdText} onResults={(res) => setResults(res)} />

//       <Box sx={{ mt: 3 }}>
//         <ResultsTable rows={results} />
//       </Box>
//     </Container>
//   );
// }

// export default App;

// import React, { useState } from "react";
// import { Container, Typography, Box } from "@mui/material";
// import JDInput from "./components/JDInput";
// import ResumeUploader from "./components/ResumeUploader";
// import ResultsTable from "./components/ResultsTable";

// /**
//  * Build the final jdText string from parsed sections.
//  * Keeps your downstream flow unchanged by producing a single string.
//  * Example output:
//  *   Primary: React, TypeScript
//  *   Secondary: Node.js, GraphQL
//  *   Other: AWS, Docker
//  */
// function formatJDText(parsed, fallbackRawText = "") {
//   if (!parsed || typeof parsed !== "object") {
//     // If no structured object, fallback to whatever raw text was provided
//     return fallbackRawText || "";
//   }

//   // Normalize either arrays or comma-separated strings
//   const normalize = (v) =>
//     Array.isArray(v)
//       ? v.filter(Boolean).map((s) => s.trim()).filter(Boolean)
//       : String(v || "")
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean);

//   const primary = normalize(parsed.primarySkills);
//   const secondary = normalize(parsed.secondarySkills);
//   const other = normalize(parsed.otherSkills);

//   const lines = [];
//   if (primary.length) lines.push(`Primary: ${primary.join(", ")}`);
//   if (secondary.length) lines.push(`Secondary: ${secondary.join(", ")}`);
//   if (other.length) lines.push(`Other: ${other.join(", ")}`);

//   return lines.length ? lines.join("\n") : fallbackRawText || "";
// }

// function App() {
//   const [jdParsed, setJdParsed] = useState(null); // structured JD from JDInput
//   const [jdText, setJdText] = useState("");       // final combined JD text
//   const [results, setResults] = useState([]);

//   return (
//     <Container maxWidth="lg" sx={{ py: 3 }}>
//       <Typography variant="h4" sx={{ mb: 2 }}>
//         Resume Screening Dashboard
//       </Typography>

//       <JDInput
//         onParsed={(parsed, rawText) => {
//           // Save the structured JD object
//           setJdParsed(parsed);
//           // Compute and store the final combined jdText (single string)
//           const finalJDText = formatJDText(parsed, rawText);
//           setJdText(finalJDText);
//         }}
//       />

//       {/* Keep ResumeUploader unchanged: it still consumes jdText */}
//       <ResumeUploader jdText={jdText} onResults={(res) => setResults(res)} />

//       <Box sx={{ mt: 3 }}>
//         <ResultsTable rows={Array.isArray(results) ? results : []} />
//       </Box>
//     </Container>
//   );
// }

// export default App;

import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import JDInput from "./components/JDInput";
import ResumeUploader from "./components/ResumeUploader";
import ResultsTable from "./components/ResultsTable";

/**
 * Build the final jdText string from parsed sections.
 */
function formatJDText(parsed, fallbackRawText = "") {
  if (!parsed || typeof parsed !== "object") {
    return fallbackRawText || "";
  }

  const normalize = (v) =>
    Array.isArray(v)
      ? v.filter(Boolean).map((s) => s.trim())
      : String(v || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

  const primary = normalize(parsed.primarySkills);
  const secondary = normalize(parsed.secondarySkills);
  const other = normalize(parsed.otherSkills);

  const lines = [];
  if (primary.length) lines.push(`Primary: ${primary.join(", ")}`);
  if (secondary.length) lines.push(`Secondary: ${secondary.join(", ")}`);
  if (other.length) lines.push(`Other: ${other.join(", ")}`);

  return lines.length ? lines.join("\n") : fallbackRawText || "";
}

function App() {
  const [jdParsed, setJdParsed] = useState(null);
  const [jdText, setJdText] = useState("");
  const [results, setResults] = useState([]);

  return (
    <Container maxWidth="lg" sx={{ py: 2}}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Resume Screening Dashboard
      </Typography>

      <JDInput
        onParsed={(parsed, rawText) => {
          setJdParsed(parsed);
          const finalJDText = formatJDText(parsed, rawText);
          setJdText(finalJDText);
        }}
      />

      <ResumeUploader jdText={jdText} onResults={setResults} />

      <Box sx={{ mt: 3 }}>
        <ResultsTable rows={Array.isArray(results) ? results : []} />
      </Box>
    </Container>
  );
}

export default App;
