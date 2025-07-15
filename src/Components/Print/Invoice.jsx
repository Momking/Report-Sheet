import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import styled from "styled-components";
import { db, storage } from "./../../config/firebase";
import { getDownloadURL, ref as refReg } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";

const Invoice = React.forwardRef(({ printData }, ref) => {
  const { currentUser } = useAuth();
  const [img_url, setImg_url] = useState("");
  const [userData, setUserData] = useState([]);
  const [test, setTest] = useState([]);

  const refresh = () => {
    setTest([]);
  };

  const fetchData = async () => {
    try {
      const userDocRef = doc(db, "Users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userFetchData = userDocSnapshot.data();
        const img_url = await getDownloadURL(
          refReg(storage, `profile-images/${currentUser.uid}`)
        );

        setImg_url(img_url);
        setUserData(userFetchData);
      }
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    }
  };

  const handleAddMultipleTests = (count) => {
    const newTests = [];
    console.log(printData.test);
    for (let i = 0; i < count; i++) {
      newTests.push(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "2vh",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "17px",
              padding: "2px",
              borderRadius: "1px",
              width: "50%",
            }}
          >
            {printData.tests[test.length + i].TestName}
          </p>

          <p
            style={{
              fontSize: "17px",
              padding: "2px",
              borderRadius: "1px",
              width: "20%",
            }}
          >
            {printData.tests[test.length + i].normalValue}
          </p>

          <p
            style={{
              fontSize: "17px",
              padding: "2px",
              borderRadius: "1px",
              width: "15%",
            }}
          >
            {printData.tests[test.length + i].findings}
          </p>

          <p
            style={{
              fontSize: "17px",
              padding: "2px",
              borderRadius: "1px",
              width: "15%",
            }}
          >
            {printData.tests[test.length + i].pf1}
          </p>
        </div>
      );
    }
    setTest((prevTest) => [...prevTest, ...newTests]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    refresh();
    if (printData.tests) {
      handleAddMultipleTests(printData.tests.length);
    }
  }, [printData]);

  const getCurrentDateIST = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata" };
    const date = now.toLocaleDateString("en-CA", options); // 'en-CA' locale formats date as YYYY-MM-DD
    return date;
  };

  return (
    <div ref={ref}>
      <Wrapper>
        <div
          className="head"
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "5px solid blue",
            height: "15vh",
          }}
        >
          <div style={{ width: "70%", display: "flex", flexDirection: "row" }}>
            {img_url && (
              <img
                src={img_url}
                alt="Profile"
                style={{
                  height: "100px",
                  paddingLeft: "20px",
                  marginTop: "3vh",
                }}
              />
            )}
            <div>
              <h1 style={{ marginTop: "5vh" }}>{userData.CompanyName}</h1>
              <p>{userData.Address1}&nbsp;</p>
            </div>
          </div>
          <div style={{ marginTop: "3vh", paddingLeft: "8vw" }}>
            <p>Phone: +91 {userData.Phone} </p>
            {/* <p>smartLabReport@gmail.com </p> */}
          </div>
        </div>
        <div style={{ marginLeft: "1vh", marginRight: "1vh" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "1vh",
              paddingBottom: "1vh",
              borderBottom: "1px solid #4d4d4d",
            }}
          >
            <div
              style={{
                borderRight: "1px solid #4d4d4d",
                width: "30%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2>{printData.PatientName}</h2>
              <p>age: {printData.Age}</p>
              <p>sex: {printData.Sex}</p>
              <p>T-Group: {printData.TGroup}</p>
            </div>
            <div
              style={{
                borderRight: "1px solid #4d4d4d",
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>
                <strong>Test Collection Center:</strong>{" "}
                {printData.TestCollectionCenter}
              </p>
              <p>
                Ref by: <strong>{printData.RefByDr}</strong>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                width: "30%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>
                <strong>Date:</strong> {getCurrentDateIST()}
              </p>
            </div>
          </div>
          <div
            style={{
              paddingTop: "1vh",
              paddingBottom: "1vh",
              borderBottom: "1px solid #4d4d4d",
            }}
          >
            <h1>C.S.F EXAMINATION ROUTINE</h1>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "2vh",
              justifyContent: "space-evenly",
              alignItems: "center",
              borderBottom: "1px solid #4d4d4d",
            }}
          >
            <h4 style={{ width: "50%" }}>Investigation</h4>
            <h4 style={{ width: "20%" }}>Result</h4>
            <h4 style={{ width: "15%" }}>Reference Value</h4>
            <h4 style={{ width: "15%" }}>Unit</h4>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid #4d4d4d",
            }}
          >
            {test}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "2vh",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              borderBottom: "1px solid #4d4d4d",
            }}
          >
            <h4>REMARKS:</h4>
            <p>{printData.Remark}</p>
          </div>
          <h5
            style={{
              textAlign: "center",
            }}
          >
            ****End of Report****
          </h5>
        </div>
        <div
          bgcolor="light"
          className="text-center text-lg-left"
          style={{
            position: "absolute",
            bottom: "0",
            width: "100%",
          }}
        >
          <div
            className="text-center p-3"
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "5px",
              backgroundColor: "yellow",
            }}
          >
            <p>Generated on: &nbsp;</p>
            {new Date().toDateString()}
          </div>
        </div>
      </Wrapper>
    </div>
  );
});

const Wrapper = styled.section`
  .head {
    height: 10vh;
  }
`;

export default Invoice;
