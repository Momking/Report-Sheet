import React, { useEffect, useState } from "react";
import { getDownloadURL, ref as refReg } from "firebase/storage";
import { useAuth } from "../../Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebase";

// Utility: get amount in words (add your implementation or import a library)
function numberToWords(n) {
  // For demo purposes; you can use a better NPM package for this!
  return n === 350 ? "Three hundred fifty rupees only" : `${n} rupees only`;
}

const Receipt = React.forwardRef(({ printData, printVisible }, ref) => {
  const { currentUser } = useAuth();
  const [img_url, setImgUrl] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          let url = "";
          try {
            url = await getDownloadURL(refReg(storage, `profile-images/${currentUser.uid}`));
          } catch {}
          setUserData(data);
          setImgUrl(url);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, [currentUser]);

  if (!printVisible) return null;

  // --- Print-friendly styling ---
  return (
    <div
      ref={ref}
      style={{
        background: "#fff",
        maxWidth: 840,
        margin: "40px auto",
        boxShadow: "0 0 16px #dce4eb66",
        fontFamily: "Roboto, Lato, Arial, sans-serif",
        color: "#333",
        fontSize: 14,
        padding: 24,
        borderRadius: 9
      }}
    >
      <style>{`
        .receipt-title { font-size: 1.2rem; font-weight: 700; }
        .receipt-title-bar { font-size: 0.93rem; color: #575b65; }
        .receipt-table { width: 100%; border-collapse: collapse; margin-top: 14px;}
        .receipt-table th, .receipt-table td { border: 1px solid #abb9c4; padding: 8px 10px; font-size: 13px; }
        .receipt-table th {
          background: #95a4b8; color: #fff; font-size: 13px; font-weight: 700; letter-spacing: 0.03em;
        }
        .receipt-table .right { text-align: right; }
        .receipt-meta { margin: 10px 0 0 0; }
        .receipt-meta span { display: inline-block; min-width: 115px; }
        .footer { text-align: center; color: #8b98a4; font-size: 1em; margin-top: 28px; letter-spacing: 0.07em;}
        .inv-amount-desc { font-size: 12px; color: #525a5a; }
        .barcode, .qr { height: 34px; }
        @media print {
          body { background: #fff !important; }
          .receipt-root { box-shadow: none !important; }
        }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="receipt-title">{userData.CompanyName || "Vikash Diagnostic"}</div>
          <div className="receipt-title-bar">Phone no.: {userData.Phone || ""}</div>
          <div className="receipt-title-bar" style={{ margin: "4px 0" }}>{userData.Address1 || ""}</div>
        </div>
        {img_url && (
          <img
            src={img_url}
            alt="Logo"
            style={{ height: 44, width: "auto", borderRadius: 5, marginLeft: 10 }}
          />
        )}
      </div>
      <hr style={{ margin: "12px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 0 }}>
        <div style={{ flex: 1 }}>
          <div>Bill / Reg. no {printData?.PatientID || ""}</div>
          {/* barcode or image if any */}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "600", fontSize: 13 }}>L1</div>
          {/* QR code image or download link, leave blank or insert here */}
        </div>
      </div>

      <div style={{ margin: "10px 0 0 0", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div>Name : <b>{printData?.PatientName}</b></div>
          <div>
            Age / Sex : <b>{printData?.Age}</b> / <b>{printData?.Sex}</b>
          </div>
          <div>Mobile number : <b>{printData?.Phone || "1234567890"}</b></div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div>
            Referred by : <b>{printData?.RefByDr || "-"}</b>
          </div>
          <div>
            Date : <b>{printData?.Date || new Date().toLocaleDateString("en-IN")}</b>
          </div>
          <div>
            Received by : <b>{printData?.ReceivedBy || "Vikash Kumar"}</b>
          </div>
        </div>
      </div>

      {/* Investigation Table */}
      <table className="receipt-table" style={{ marginTop: 18 }}>
        <thead>
          <tr>
            <th>S. NO.</th>
            <th>INVESTIGATIONS</th>
            <th className="right">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {printData?.tests?.map((test, i) => (
            <tr key={i}>
              <td className="right">{i + 1}.</td>
              <td>{test.TestName || "-"}</td>
              <td className="right">
                {typeof test.Rate === "number" ? `Rs.${test.Rate}` : test.Rate ? test.Rate : "—"}
              </td>
            </tr>
          ))}
          {/* Summary rows */}
          <tr>
            <td colSpan={2} className="right">Total amount</td>
            <td className="right">Rs.{printData.GrandAmount || 0}</td>
          </tr>
          <tr>
            <td colSpan={2} className="right">Collection charge</td>
            <td className="right">{printData.CollectionCharge ? `Rs.${printData.CollectionCharge}` : "Rs.100"}</td>
          </tr>
          <tr>
            <td colSpan={2} className="right">Discount</td>
            <td className="right">{printData.Discount ? `Rs.${printData.Discount}` : "Rs.0"}</td>
          </tr>
          <tr>
            <td colSpan={2} className="right"><b>Amount paid</b></td>
            <td className="right"><b>Rs.{printData.AdvanceAmount || printData.AmountPaid || 0}</b></td>
          </tr>
          <tr>
            <td colSpan={3} className="inv-amount-desc">
              Amount Paid (In words): <b>{numberToWords(printData.AdvanceAmount || printData.AmountPaid || 0)}</b>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="footer">
        ~~~ Thank You ~~~
      </div>
    </div>
  );
});

export default Receipt;
