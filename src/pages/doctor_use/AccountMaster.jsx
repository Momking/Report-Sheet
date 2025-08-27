import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import styled from "styled-components";
import { useAuth } from "../../Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const AccountMaster = () => {
    const [data, setData] = useState([]);
    const [dayAmount, setDayAmount] = useState([]);
    const [monthAmount, setMonthAmount] = useState([]);
    const [yearAmount, setYearAmount] = useState([]);
    const [error, setError] = useState();
    const {currentUser} = useAuth();

    const fetchAccountMaster = async () => {
        try {
            if (currentUser?.uid) {
              const userDocRef = doc(db, currentUser.uid, "Account Master");
              const docSnap = await getDoc(userDocRef);
              if (docSnap.exists()) {
                const useData = docSnap.data();
                extractData(useData);
                setData(useData);
              } else {
                setError("No data found.");
              }
            }
          } catch (error) {
            console.error("Error fetching data from Firestore: ", error);
            setError("Error fetching data.");
          }
    }

    const extractData = (useData) => {
        const date = getCurrentDateIST();
        const [year, month, day] = date.split("-");

        let yearVal = {
          GrandAmount: 0,
          AdvanceAmount: 0,
          Discount: 0,
          BalanceAmount: 0
        };
        for(let months in useData[year]){

          let monthVal = {
            GrandAmount: 0,
            AdvanceAmount: 0,
            Discount: 0,
            BalanceAmount: 0
          };

          for(const day in useData[year][months]){
            monthVal.GrandAmount += parseFloat(useData[year][months][day].GrandAmount);
            monthVal.AdvanceAmount += parseFloat(useData[year][months][day].AdvanceAmount);
            monthVal.Discount += parseFloat(useData[year][months][day].Discount);
            monthVal.BalanceAmount += parseFloat(useData[year][months][day].BalanceAmount);
          }
          if(month == months.split(" ")[1]){
            setDayAmount(useData[year][months][date]);
            setMonthAmount(monthVal);
          }
          yearVal.GrandAmount += parseFloat(monthVal.GrandAmount);
          yearVal.AdvanceAmount += parseFloat(monthVal.AdvanceAmount);
          yearVal.Discount += parseFloat(monthVal.Discount);
          yearVal.BalanceAmount += parseFloat(monthVal.BalanceAmount);
        }
        setYearAmount(yearVal);
    }

    const getCurrentDateIST = () => {
      const now = new Date();
      const options = { timeZone: "Asia/Kolkata" };
      const date = now.toLocaleDateString("en-CA", options); // 'en-CA' locale formats date as YYYY-MM-DD
      return date;
    };

    const treeData = [
      {
        name: "Account Master",
        children: [
          {
            name: "Transaction Account",
            children: [
              { name: "Pathology A/C", children: [] },
            ],
          },
          {
            name: "Doctor",
            children: [
              { name: "RAVI SHANKAR.MD" },
              { name: "DR.RAJEEV RANJAN.(MD)" },
              { name: "SELF" },
            ],
          },
          {
            name: "Consulting Pathologists",
            children: [
              { name: "NISHANT DIAGNOSTIC" },
            ],
          },
          {
            name: "Commission Agent",
            children: [
              { name: "NISHANT JI" },
            ],
          },
        ],
      },
    ];
    

    const renderTree = (nodes, level = 0) => (
      <ul style={{ listStyle: "none", paddingLeft: level * 30, textAlign: "left" }}>
        {nodes.map(node => (
          <li key={node.name}>
            <div style={{
              fontWeight: level === 0 ? "bold" : "normal",
              fontSize: level === 0 ? "16px" : "15px",
              padding: "3px 10px",
              color: level === 0 ? "#204020" : "#222"
            }}>
              {node.name}
            </div>
            {node.children && node.children.length > 0 && renderTree(node.children, level + 1)}
          </li>
        ))}
      </ul>
    );
    

    useEffect(() => {
      fetchAccountMaster();
    }, [])

    return (
        <div style={{ backgroundColor: "#efedee", width: "100%", height: "100vh" }}>
            <Navbar destination={"/doctor_use/TestAdmission"} />
            <Wrapper>
              <div className="container">
                <div className="modal">
                  <div className="modal-container">
                  <div className="modal-left">
                  <div style={{
                    display: "flex",
                    height: "85vh",
                    borderRadius: "10px",
                    background: "#c4d2b7",
                    boxShadow: "0 2px 8px #b4bbad52"
                  }}>
                    <div style={{
                      width: "35%",
                      background: "#f7f7f7",
                      borderRight: "2px solid #819182",
                      padding: "24px"
                    }}>
                      {renderTree(treeData)}
                    </div>
                    <div style={{
                      flex: 1,
                      background: "#cad8b6",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px #b4bbad52",
                      margin: "12px",
                      padding: "22px",
                      color: "#204020",
                    }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                        {["🔄", "🖨️", "💻", "🗑️"].map(icon => (
                          <button key={icon} style={{
                            fontSize: "18px", padding: "5px 14px", background: "#ecf0e2",
                            border: "1px solid #bcd2ae", borderRadius: "4px", cursor: "pointer"
                          }}>{icon}</button>
                        ))}
                      </div>
                      <div style={{ marginBottom: "12px" }}>
                        <label style={{ fontWeight: 500, color: "#204020" }}>
                          Search:&nbsp;
                          <input type="text" style={{
                            padding: "7px 12px", border: "1px solid #bcd2ae", borderRadius: "4px", background: "#fff"
                          }} />
                        </label>
                      </div>
                      <form style={{
                        border: "2px solid #bcd2ae", borderRadius: "7px", padding: "20px", background: "#e6f0d2"
                      }}>
                        <div style={{ marginBottom: "15px" }}>
                          <label style={{ fontWeight: 500, width: "230px", display: "inline-block" }}>Group:</label>
                          <input value="Account Master" readOnly style={{
                            padding: "6px", width: "180px", borderRadius: "4px", border: "1px solid #bcd2ae",
                            background: "#f9fbf5", color: "#386030"
                          }} />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                          <label style={{ fontWeight: 500, width: "230px", display: "inline-block" }}>Account:</label>
                          <input type="text" style={{
                            padding: "6px", width: "180px", borderRadius: "4px", border: "1px solid #bcd2ae",
                            background: "#fff"
                          }} />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                          <label style={{ fontWeight: 500, width: "230px", display: "inline-block" }}>Opening Balance:</label>
                          <input type="number" style={{
                            padding: "6px", width: "180px", borderRadius: "4px", border: "1px solid #bcd2ae",
                            background: "#fff"
                          }} />
                        </div>
                        <div style={{ marginBottom: "15px", fontWeight: "500" }}>
                          <span style={{ width: "230px", display: "inline-block" }}>Commission:</span>
                          <input type="radio" name="commType" id="flat" />
                          <label htmlFor="flat" style={{ marginRight: "14px", color: "#204020" }}>Flat Rate</label>
                          <input type="radio" name="commType" id="percent" />
                          <label htmlFor="percent" style={{ color: "#204020" }}>% Rate</label>
                        </div>
                        <div>
                          <label style={{ fontWeight: 500, width: "230px", display: "inline-block" }}>Rate:</label>
                          <input type="number" style={{
                            padding: "6px", width: "80px", borderRadius: "4px", border: "1px solid #bcd2ae",
                            background: "#fff"
                          }} />
                        </div>
                      </form>
                    </div>
                  </div>
                  </div>
                  </div>
                </div>
              </div>
            </Wrapper>
        </div>
    );
}

const Wrapper = styled.section`
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #edf7f9;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    width: 100%;
    background: rgba(51, 51, 51, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.4s;
  }
  .modal-container {
    display: flex;
    max-width: 95vw;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    position: absolute;

    transition-duration: 0.3s;
    background: #fff;
  }
  .modal-title {
    margin: 0;
    font-weight: 400;
    color: #023656;
  }
  .form-error {
    font-size: 1.4rem;
    color: #b22b27;
  }
  .modal-desc {
    margin: 6px 0 30px 0;
  }
  .modal-left {
    padding: 5px 30px 20px;
    background: #e2eff5;
    flex: 1.5;
    transition-duration: 0.5s;
    opacity: 1;
  }

  .cards {
    width: 50vh;
    height: 40vh;
    border-radius: 10px;
    background: #e2eff5;
  }

  .modal.is-open .modal-left {
    transform: translateY(0);
    opacity: 1;
    transition-delay: 0.1s;
  }
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-buttons a {
    color: rgba(51, 51, 51, 0.6);
    font-size: 14px;
  }

  .input-button {
    // padding: 1.2rem 3.2rem;
    outline: none;
    text-transform: uppercase;
    border: 0;
    color: #fff;
    border-radius: 4px;
    background: #8c7569;
    transition: 0.3s;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
  }
  .input-button:hover {
    background: #55311c;
  }

  .input-label {
    font-size: 13px;
    // text-transform: uppercase;
    margin-left: 5vh;
    font-weight: 600;
    letter-spacing: 0.7px;
    color: black;
    transition: 0.3s;
  }

  .input-block {
    display: flex;
    flex-direction: row;
    padding: 2vh 2vh .5vh;
    margin-bottom: 10px;
    transition: 0.3s;
    }
    
  .input-block input {
    color: black;
    outline: 0;
    border: 0;
    padding: 4px 4px 1px;
    border-radius: 3px;
    align: center;
    background: #ffffff;
    font-size: 15px;
  }

  .input-block input::-moz-placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block input:-ms-input-placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block input::placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block:focus-within {
    border-color: #8c7569;
  }
  .input-block:focus-within .input-label {
    color: rgba(140, 117, 105, 0.8);
  }

  @media (max-width: 750px) {
    .modal-container {
      max-width: 90vw;
    }
    .flexChange {
      flex-direction: column;
    }
  }

  @media (max-height: 750px){
    .input-label {
      font-size: 11px;
    }
  }
`;

export default AccountMaster;