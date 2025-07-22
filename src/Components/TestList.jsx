import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../Context/AuthContext";

const TestList = ({onTestNameSelect}) => {
  const [testName, setTestName] = useState([]);
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    handleFind();
  }, []);

  const handleFind = async (e) => {
    try {
      const userDocRef = doc(db, currentUser.uid, "TestName");
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userFetchData = userDocSnapshot.data();
        setTestName(userFetchData.TestName);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error("Error fetching data from Firestore: ", error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "10px",
        }}
      >
        <h4 style={{ padding: "10px" }}>Test Name</h4>
        <h4 style={{ padding: "10px" }}>Rate</h4>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {testName.length > 0 ? (
          testName.map((data, index) => (
            <button
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "17px",
                padding: "10px",
                borderRadius: "2px",
                border: "1px solid #ddd",
                background: "#fff",
                color: "black",
              }}
              type="text"
              className="button1"
              onClick={() => onTestNameSelect(data)}
            >
              <h4>{data["TEST NAME"]}</h4>
              <h4>{data["RATE"]}</h4>
            </button>
          ))
        ) : (
          <p>No Test Name found...</p>
        )}
        {error && (
          <p style={{ color: "red" }}>
            Error fetching data. Please check your internet connection.
          </p>
        )}
      </div>
    </>
  );
};

export default TestList;
