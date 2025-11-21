// import React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { Box, Button } from "@mui/material";
// import { saveAs } from "file-saver";

// export default function ResultsTable({ rows }) {
//   const cols = [
//     { field: "Name", headerName: "Candidate", flex: 1 },
//     { field: "Strengths", headerName: "Strengths", flex: 1.5 },
//     { field: "Missing Primary", headerName: "Missing Primary", flex: 1.2 },
//     { field: "Missing Secondary", headerName: "Missing Secondary", flex: 1.2 },
//     { field: "Years of Experience", headerName: "Years Exp", width: 100 },
//     { field: "Primary Score", headerName: "Primary %", width: 110 },
//     { field: "Secondary Score", headerName: "Secondary %", width: 120 },
//     { field: "Overall Score", headerName: "Overall %", width: 110 },
//     { field: "Status", headerName: "Status", width: 120 }
//   ];

//   const handleExport = () => {
//     const csv = [
//       cols.map(c => c.headerName).join(","),
//       ...rows.map(r => cols.map(c => {
//         const v = r[c.field] === undefined ? "" : String(r[c.field]).replace(/,/g, " ");
//         return `"${v}"`;
//       }).join(","))
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "results.csv");
//   };

//   return (
//     <Box sx={{ height: 400, width: "100%" }}>
//       <Box sx={{ mb: 1 }}>
//         <Button variant="outlined" onClick={handleExport}>Export CSV</Button>
//       </Box>
//       <DataGrid rows={rows.map((r, i) => ({ id: i, ...r }))} columns={cols} pageSize={10} rowsPerPageOptions={[10]} />
//     </Box>
//   );
// }

// // ResultsTable.jsx — Professional UI
// import React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { Box, Button, Card, CardHeader, CardContent } from "@mui/material";
// import { saveAs } from "file-saver";

// export default function ResultsTable({ rows }) {
//   const cols = [
//     { field: "Name", headerName: "Candidate", flex: 1 },
//     { field: "Strengths", headerName: "Strengths", flex: 1.2 },
//     { field: "Missing Primary", headerName: "Missing Primary", flex: 1 },
//     { field: "Missing Secondary", headerName: "Missing Secondary", flex: 1 },
//     { field: "Years of Experience", headerName: "Yrs Exp", width: 90 },
//     { field: "Primary Score", headerName: "Primary %", width: 100 },
//     { field: "Secondary Score", headerName: "Secondary %", width: 110 },
//     { field: "Overall Score", headerName: "Overall %", width: 100 },
//     { field: "Status", headerName: "Status", width: 110 },
//   ];

//   const exportCSV = () => {
//     const csv = [
//       cols.map((c) => c.headerName).join(","),
//       ...rows.map((r) =>
//         cols
//           .map((c) => `"${String(r[c.field] || "").replace(/,/g, " ")}"`)
//           .join(",")
//       ),
//     ].join("\n");

//     saveAs(new Blob([csv], { type: "text/csv" }), "results.csv");
//   };

//   return (
//     <Card sx={{ borderRadius: 2, mt: 3 }}>
//       <CardHeader
//         title="Candidate Match Results"
//         sx={{ background: "#f8f9fb" }}
//       />
//       <CardContent>
//         <Box sx={{ mb: 2 }}>
//           <Button variant="outlined" onClick={exportCSV}>
//             Export CSV
//           </Button>
//         </Box>

//         <Box sx={{ height: 420 }}>
//           <DataGrid
//             rows={rows.map((r, i) => ({ id: i, ...r }))}
//             columns={cols}
//             pageSize={10}
//           />
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// ResultsTable.jsx — Professional UI with candidate name = resume filename
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Card, CardHeader, CardContent } from "@mui/material";
import { saveAs } from "file-saver";

export default function ResultsTable({ rows }) {
  const cols = [
    { field: "Name", headerName: "Candidate", flex: 1 },
    { field: "Strengths", headerName: "Strengths", flex: 1.2 },
    { field: "Missing Primary", headerName: "Missing Primary", flex: 1 },
    { field: "Missing Secondary", headerName: "Missing Secondary", flex: 1 },
    { field: "Years of Experience", headerName: "Yrs Exp", width: 90 },
    { field: "Primary Score", headerName: "Primary %", width: 100 },
    { field: "Secondary Score", headerName: "Secondary %", width: 110 },
    { field: "Overall Score", headerName: "Overall %", width: 100 },
    { field: "Status", headerName: "Status", width: 110 },
  ];

  const exportCSV = () => {
    const csv = [
      cols.map((c) => c.headerName).join(","),
      ...rows.map((r) =>
        cols
          .map((c) => `"${String(r[c.field] || "").replace(/,/g, " ")}"`)
          .join(",")
      ),
    ].join("\n");

    saveAs(new Blob([csv], { type: "text/csv" }), "results.csv");
  };

  return (
    <Card sx={{ borderRadius: 2, mt: 3 }}>
      <CardHeader title="Candidate Match Results" sx={{ background: "#f8f9fb" }} />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={exportCSV}>
            Export CSV
          </Button>
        </Box>

        <Box sx={{ height: 420 }}>
          <DataGrid
            rows={rows.map((r, i) => ({ id: i, ...r }))}
            columns={cols}
            pageSize={10}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

