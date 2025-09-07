import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import { storeUserData2 } from "../../Components/storeUserData";
import { useAuth } from "../../Context/AuthContext";
import { storage, db } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import WaitBar from "../../Components/WaitBar";
import TestList from "../../Components/Data/TestList.json";
import { doSignOut } from "../../config/auth";

const InitialSheet = () => {
  const { currentUser, setInitialSettingsSet } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [correct, setCorrect] = useState(false);
  const [waitBar, setWaitBar] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setWaitBar("Loading your settings...");
    try {
      const userDocRef = doc(db, "Users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const img_url = await getDownloadURL(
          ref(storage, `profile-images/${currentUser.uid}`)
        );
        setPreviewImage(img_url);
        setInitialSettingsSet(true);
        setCorrect(true);
      } else {
        setWaitBar("");
        enqueueSnackbar("Please fill your initial settings", { variant: "info" });
      }
    } catch (error) {
      setWaitBar("");
      enqueueSnackbar("Failed to load settings", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get("Image");

    try {
      setWaitBar("Saving your settings...");
      const storageRef = ref(storage, `profile-images/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const exportData = {
        CompanyName: formData.get("CompanyName"),
        Address1: formData.get("Address1"),
        Address2: formData.get("Address2"),
        City: formData.get("City"),
        State: formData.get("State"),
        PinCode: formData.get("PinCode"),
        Phone: formData.get("Phone"),
        VID: 0,
        Image: downloadURL,
      };

      await storeUserData2(exportData, currentUser);
      await setDoc(doc(db, currentUser.uid, "TestName"), TestList);
      setInitialSettingsSet(true);
      setCorrect(true);
    } catch (error) {
      enqueueSnackbar("Error saving settings", { variant: "error" });
    } finally {
      setWaitBar("");
    }
  };

  if (correct) return <Navigate to="/" replace />;

  return (
    <PageWrapper>
      {waitBar && <WaitBar message={waitBar} />}
      <Card>
        <Header>
          <h2>Initial Settings</h2>
          <button
            onClick={() => {
              doSignOut().then(() => navigate("/login"));
            }}
            className="logout-btn"
          >
            Logout
          </button>
        </Header>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" name="CompanyName" placeholder="Enter company name" required />
          </div>

          <div className="form-group">
            <label>Address 1</label>
            <input type="text" name="Address1" placeholder="Address line 1" />
          </div>

          <div className="form-group">
            <label>Address 2</label>
            <input type="text" name="Address2" placeholder="Address line 2" />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="City" placeholder="City" />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="State" placeholder="State" />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Pin Code</label>
              <input type="text" name="PinCode" placeholder="Pin Code" pattern="\d{6}" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="Phone" placeholder="Phone" pattern="\d{10}" />
            </div>
          </div>

          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" accept="image/*" name="Image" onChange={handleImagePreview} />
            {previewImage && <img src={previewImage} alt="Preview" className="image-preview" />}
          </div>

          <button type="submit" className="primary-btn">
            Save Settings
          </button>
        </form>
      </Card>
    </PageWrapper>
  );
};

export default InitialSheet;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #fff;
  width: 90%;
  max-width: 550px;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    .form-group {
      flex: 1;
    }
  }

  label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }

  input[type="text"],
  input[type="file"] {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    outline: none;
  }

  input[type="text"]:focus {
    border-color: #007bff;
  }

  .image-preview {
    width: 80px;
    height: 80px;
    margin-top: 8px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #007bff;
  }

  .primary-btn {
    background: #007bff;
    color: #fff;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s;
  }

  .primary-btn:hover {
    background: #0056b3;
  }

  .logout-btn {
    background: #ff4d4f;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .logout-btn:hover {
    background: #d9363e;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 22px;
    font-weight: bold;
    color: #333;
  }
`;
