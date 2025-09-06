import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../Context/AuthContext";

function groupTests(testNameArray) {
  const groups = {};
  for (const test of testNameArray) {
    const group = test["GROUP -NAME "]?.trim() || "Unknown";
    if (!groups[group]) groups[group] = [];
    groups[group].push(test);
  }
  return groups;
}

const TestMaster = () => {
  const [testName, setTestName] = useState([]);
  const [error, setError] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const userDocRef = doc(db, currentUser.uid, "TestName");
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userFetchData = userDocSnapshot.data();
          setTestName(userFetchData.TestName || []);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
        console.error("Error fetching data from Firestore: ", error);
      }
    };
    fetchTests();
  }, [currentUser]);

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const grouped = groupTests(testName);
  const groupNames = Object.keys(grouped);

  useEffect(() => {
    if (groupNames.length && !selectedGroup) setSelectedGroup(groupNames[0]);
  }, [groupNames, selectedGroup]);

  return (
    <div style={{ display: "flex", height: "80vh", fontFamily: "Segoe UI", background: "#c4d2b7", }}>
      <div style={{
        width: "40%",
        background: "#f7f7f7",
        borderRight: "2px solid #819182",
        overflowY: "auto",
        padding: "12px",
        textAlign: "left",
      }}>

        {/* Render only group names as clickable */}
        {groupNames.map((group) => {
          const isExpanded = expandedGroups.has(group);
          return (
            <div key={group} style={{ marginBottom: "12px" }}>
              {/* Group header with toggle */}
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
                  color: "#142c15",
                  cursor: "pointer",
                  background: selectedGroup === group ? "#e2e6de" : "transparent",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onClick={() => {
                  toggleGroup(group);
                  setSelectedGroup(group);
                }}
              >
                {/* Folder icon */}
                <span>{isExpanded ? "📂" : "📁"}</span>
                <span>{group}</span>
                {/* Optional: arrow icon */}
                <span style={{ marginLeft: "auto" }}>{isExpanded ? "▼" : "▶"}</span>
              </div>

              {/* Conditionally render tests if expanded */}
              {isExpanded && (
                <ul style={{ listStyle: "none", margin: 0, paddingLeft: "28px" }}>
                  {grouped[group].map((test) => (
                    <li
                      key={test["SO.NO"]}
                      style={{
                        cursor: "pointer",
                        color: selectedTest === test ? "#0c5810" : "#333",
                        background: selectedTest === test ? "#dcf3de" : "transparent",
                        borderRadius: "4px",
                        marginBottom: "6px",
                        padding: "3px 8px",
                        fontSize: "14px",
                      }}
                      onClick={() => setSelectedTest(test)}
                    >
                      {/* Indent with "file" icon or bullet */}
                      <span style={{ marginRight: "6px" }}>📄</span>
                      {test["TEST NAME"]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {error && (
                <p style={{ color: "red", marginTop: "10px" }}>
                  Error fetching data. Check connection.
                </p>
              )}
      </div>
      <div style={{
        flex: 1,
        background: "#b9ccb3",
        padding: "20px 30px",
        overflowY: "auto",
        borderLeft: "2px solid #819182",
        color: "black",
      }}>
      <div style={formSectionStyle}>
        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>Test Group:</label>
          <select
            value={selectedGroup}
            style={{ padding: "8px", fontSize: "15px", borderRadius: "5px" }}
            onChange={e => setSelectedGroup(e.target.value)}
          >
            {groupNames.map(group => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
        {selectedTest ? (
          <form>
            <div style={{display: "flex", flexDirection: "row"}}>
              <div style={gridStyle}>
                <label style={labelStyle}>Test Name</label>
                <input type="text" readOnly value={selectedTest["TEST NAME"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Branch Name</label>
                <input type="text" readOnly value={selectedTest["BRANCH NAME"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Normal Value</label>
                <input type="text" readOnly value={selectedTest["NORMAL  VALUE"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Min Value</label>
                <input type="number" readOnly value={selectedTest["MIN - VALUE"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Max Value</label>
                <input type="number" readOnly value={selectedTest["MAX VALUE"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Unit</label>
                <input type="text" readOnly value={selectedTest["UNIT"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Clinical Rate</label>
                <input type="number" readOnly value={selectedTest["RATE"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Special Reb. Rate</label>
                <input type="number" readOnly value={selectedTest["RATE(DISC)"] || ""} style={readOnlyInputStyle} />
              </div>
              <div style={gridStyle}>
                <label style={labelStyle}>Description</label>
                <input type="text" readOnly value={selectedTest["DESCRIPTION"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Doctor Name</label>
                <input type="text" readOnly value={selectedTest["DOCTOR NAME"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Dr. Commission Rate</label>
                <input type="number" readOnly value={selectedTest["DR. COMMISSION RATE"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Rate (%)</label>
                <input type="number" readOnly value={selectedTest["RATE (%)"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Rate (Rs.)</label>
                <input type="number" readOnly value={selectedTest["RATE (RS.)"] || ""} style={readOnlyInputStyle} />

                <label style={labelStyle}>Test Index</label>
                <input type="text" readOnly value={selectedTest["TEST INDEX"] || ""} style={readOnlyInputStyle} />
              </div>
            </div>
            <div>
              <div style={checkboxContainerStyle}>
                <input type="checkbox" checked={!!selectedTest["CONTINUED ADD"]} readOnly />
                <label style={{ fontSize: "15px", userSelect: "none" }}>Continued Add</label>
              </div>
              <div style={checkboxContainerStyle}>
                <input type="checkbox" checked={!!selectedTest["CULT"]} readOnly />
                <label style={{ fontSize: "15px", userSelect: "none" }}>Cult</label>
              </div>
              <div style={checkboxContainerStyle}>
                <input type="checkbox" checked={!!selectedTest["ADJUST DISPLAY SETTINGS"]} readOnly />
                <label style={{ fontSize: "15px", userSelect: "none" }}>Adjust Display Settings</label>
              </div>

              <label style={labelStyle}>Remarks</label>
              <input type="text" readOnly value={selectedTest["REMARKS"] || ""} style={readOnlyInputStyle} />
            </div>
          </form>
        ) : (
          <div style={{ color: "#555", marginTop: "40px", fontSize: "16px" }}>
            Select a test from left panel to view details.
          </div>
        )}
        </div>
      </div>
    </div>
  );
};


const inputStyle = {
  padding: "4px 10px",
  fontSize: "14px",
  border: "1px solid #b1beb3",
  borderRadius: "4px",
  background: "#fff",
  color: "black",
};

const formSectionStyle = {
  background: "#f9faf8",
  padding: "10px 24px 8px",
  borderRadius: "8px",
  boxShadow: "rgba(0, 0, 0, 0.05) 0 2px 8px",
  margin: "auto",
  color: "#2f3b26",
};

const labelStyle = {
  fontWeight: "600",
  fontSize: "15px",
  color: "#4a5a3c",
  marginBottom: "2px",
  display: "block",
};

const readOnlyInputStyle = {
  width: "100%",
  padding: "5px 10px",
  fontSize: "15px",
  borderRadius: "5px",
  border: "1px solid #b3c0a6",
  backgroundColor: "#edf1e7",
  color: "#5a6a44",
  cursor: "not-allowed",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "140px 1fr",
  rowGap: "10px",
  columnGap: "20px",
  alignItems: "center",
};

const checkboxContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "12px",
  marginBottom: "6px",
};

export default TestMaster;

