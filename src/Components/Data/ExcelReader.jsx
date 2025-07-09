import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Navbar from "../Navbar";

const ExcelReader = () => {
  const [jsonData, setJsonData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet is the one we want to read
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON format
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // You can now process the JSON data as needed
        setJsonData(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const saveJsonToFile = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "TestName.json");
  };

  return (
    <div
      style={{
        backgroundColor: "#efedee",
        color: "black",
        height: "100%",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Navbar destination={"/doctor_use/TestAdmission"} />
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{ paddingTop: "12vh" }}
      />
      {jsonData.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                {jsonData[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jsonData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={saveJsonToFile}>Save as JSON</button>
        </>
      )}
    </div>
  );
};

export default ExcelReader;
