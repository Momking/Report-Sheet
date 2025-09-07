// ConfigureSettings.jsx
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import styled, { css, createGlobalStyle } from "styled-components";
import { useAuth } from "../../Context/AuthContext";
import { storeUserData2 } from "../../Components/storeUserData";
import { db, storage } from "../../config/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  collection,
} from "firebase/firestore";
import { getAuth, deleteUser as deleteFirebaseUser } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import AppTopNav from "../../Components/TopNavbar";
import { useSidebar } from "../../Context/SidebarContext";

/* ---------------------- Global styles (smooth scroll, fonts) ---------------------- */
const Global = createGlobalStyle`
  html, body, #root {
    // height: 100vh;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: "Nunito", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#233142"};
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f0f4fb"};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    line-height: 1.45;
  }

  a { text-decoration: none; color: inherit; }
  button { font-family: inherit; }
`;

/* ---------------------- Main component ---------------------- */
const ConfigureSettings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();
  const [profileImage, setProfileImage] = useState("");
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const user = getAuth().currentUser;
  const { sidebarExpanded } = useSidebar();

  useEffect(() => {
    if (currentUser) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const deleteUser = async () => {
    if (!currentUser) {
      enqueueSnackbar("No user signed in", { variant: "warning" });
      return;
    }

    const imageRef = ref(storage, `profile-images/${currentUser.uid}`);
    const userDocRef = doc(db, "Users", currentUser.uid);
    const subCollectionRef = collection(db, currentUser.uid);
    const snapshot = await getDocs(subCollectionRef);
    const batch = writeBatch(db);

    snapshot.docs.forEach((d) => batch.delete(d.ref));

    try {
      await batch.commit();
      await deleteObject(imageRef).catch((err) => {
        console.warn("deleteObject:", err?.message || err);
        enqueueSnackbar("Failed to delete profile image (maybe not present).", { variant: "info" });
      });
      await deleteDoc(userDocRef);
      await deleteFirebaseUser(user);
      enqueueSnackbar("User account and data deleted successfully.", { variant: "success" });
      navigate("/Login", { replace: true });
    } catch (err) {
      console.error("deleteUser error:", err);
      enqueueSnackbar("Failed to delete user account & data.", { variant: "error" });
    }
  };

  const fetchData = async () => {
    try {
      const userDocRef = doc(db, "Users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userFetchData = userDocSnapshot.data();
        let imgUrl = "";
        try {
          imgUrl = await getDownloadURL(ref(storage, `profile-images/${currentUser.uid}`));
        } catch {
          imgUrl = "";
        }
        setProfileImage(imgUrl ? `url(${imgUrl})` : "");
        setUserData(userFetchData);
      } else {
        setError(true);
        enqueueSnackbar("First save your settings", { variant: "info" });
      }
    } catch (err) {
      console.error("fetchData:", err);
      setError(true);
      enqueueSnackbar("Error fetching data from Firestore", { variant: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get("Image");

    if (file && file.name) {
      const storageRef = ref(storage, `profile-images/${currentUser.uid}`);
      try {
        await uploadBytes(storageRef, file);
      } catch (err) {
        console.error("uploadBytes:", err);
        enqueueSnackbar("Error uploading image", { variant: "error" });
      }
    }

    const exportData = {
      CompanyName: formData.get("Company Name") || "",
      Address1: formData.get("Address1") || "",
      Address2: formData.get("Address2") || "",
      City: formData.get("City") || "",
      State: formData.get("State") || "",
      PinCode: formData.get("Pin Code") || "",
      Phone: formData.get("Phone") || "",
      Image: profileImage,
    };

    await storeUserData2(exportData, currentUser);
    await fetchData();
    enqueueSnackbar("Profile saved", { variant: "success" });
  };

  const handleBlur = (e) => {
    if (e.target.value.trim().length <= 1) {
      enqueueSnackbar("Please enter a valid input", { variant: "info" });
    }
  };

  if (error) {
    return <Navigate to={"doctor_use/InitialSheet"} replace={true} />;
  }

  return (
    <>
      <Global />
      <AppTopNav sidebarExpanded={sidebarExpanded} />
      <Navbar />
      <Page>
        <SettingsArea $sidebarExpanded={sidebarExpanded}>
          <SidebarNav />
          <MainArea>
            <TopTitle>
              <h1>Lab account</h1>
              <PlanBadge>Annual Subscription</PlanBadge>
            </TopTitle>

            <SubscriptionCard />

            <FormCard>
              <h2 style={{ marginTop: 0 }}>Company Information</h2>
              <CompanyForm
                userData={userData}
                profileImage={profileImage}
                onSubmit={handleSubmit}
                onDelete={deleteUser}
                onBlur={handleBlur}
              />
            </FormCard>
          </MainArea>

          <ReviewPanel>
            <Avatar style={{ backgroundImage: profileImage }} />
            <h3>{userData.CompanyName || "Your Company"}</h3>
            <p style={{ margin: "4px 0", color: ({ theme }) => (theme.isDark) ? theme.card :"#54687a", fontSize: "0.95rem" }}>
              {userData.Address1 || "—"}
            </p>
            <p style={{ margin: "4px 0", color: ({ theme }) => (theme.isDark) ? theme.card :"#54687a", fontSize: "0.95rem" }}> 
              {userData.City ? ` ${userData.City}` : ""}
            </p>
            <p style={{ margin: "0", color: ({ theme }) => (theme.isDark) ? theme.card :"#54687a" }}>{userData.Phone || "-"}</p>
          </ReviewPanel>
        </SettingsArea>
      </Page>
    </>
  );
};

/* ---------------------- Small components (UI only) ---------------------- */

const SidebarNav = React.memo(() => {
  return (
    <Sidebar>
      <Brand>LabXpert</Brand>
      <Nav>
        <NavItem active>Subscription</NavItem>
        <NavItem>Billing</NavItem>
        <NavItem>Users</NavItem>
        <NavItem>Security</NavItem>
      </Nav>
    </Sidebar>
  );
});

const SubscriptionCard = () => {
  return (
    <Card>
      <Tabs>
        <Tab active>Subscription details</Tab>
        <Tab>SMS credits</Tab>
        <Tab>Invoices</Tab>
      </Tabs>

      <CardBody>
        <StatusRow>
          <StatusBadge>Trial</StatusBadge>

          <Info>
            <PlanTitle>Pathology Lab Basic</PlanTitle>
            <PlanText>Rs. 5,000 + 18% GST (Rs. 5,900) — Every 12 months</PlanText>
            <ContactLink href="#">Contact sales for addons</ContactLink>
          </Info>

          <RenewInfo>
            <Price>Rs. 5,900</Price>
            <SmallMuted>Renewal price (inc. GST)</SmallMuted>
            <SmallMuted style={{ marginTop: 8 }}>Bill limit • 12,000 bills</SmallMuted>
            <Expiry>Expires on 04 Sep 2025</Expiry>
          </RenewInfo>
        </StatusRow>

        <Divider />

        <BottomRow>
          <Note>
            Your trial ends in <strong>3 days</strong>. Even if you purchase early,
            the remaining trial duration will be included for free.
          </Note>

          <ActionRow>
            <GhostButton>Change plan</GhostButton>
            <PrimaryButton>Buy now</PrimaryButton>
          </ActionRow>
        </BottomRow>
      </CardBody>
    </Card>
  );
};

const CompanyForm = ({ userData, profileImage, onSubmit, onDelete, onBlur }) => {
  return (
    <Form onSubmit={onSubmit} noValidate>
      <Field>
        <Label>Company Name</Label>
        <Input name="Company Name" defaultValue={userData.CompanyName || ""} placeholder="Your company" onBlur={onBlur} />
      </Field>

      <Row2>
        <Field>
          <Label>Address 1</Label>
          <Input name="Address1" defaultValue={userData.Address1 || ""} placeholder="Address line 1" onBlur={onBlur} />
        </Field>
        <Field>
          <Label>Address 2</Label>
          <Input name="Address2" defaultValue={userData.Address2 || ""} placeholder="Address line 2" />
        </Field>
      </Row2>

      <Row2>
        <Field>
          <Label>City</Label>
          <Input name="City" defaultValue={userData.City || ""} placeholder="City" onBlur={onBlur} />
        </Field>
        <Field>
          <Label>State</Label>
          <Input name="State" defaultValue={userData.State || ""} placeholder="State" onBlur={onBlur} />
        </Field>
      </Row2>

      <Row2>
        <Field>
          <Label>Pin Code</Label>
          <Input name="Pin Code" defaultValue={userData.PinCode || ""} placeholder="Pin Code" pattern="\d{6}" onBlur={onBlur} />
        </Field>
        <Field>
          <Label>Phone</Label>
          <Input name="Phone" defaultValue={userData.Phone || ""} placeholder="Phone" pattern="\d{10,}" onBlur={onBlur} />
        </Field>
      </Row2>

      <Field>
        <Label>Profile Image</Label>
        <File name="Image" accept="image/*" />
      </Field>

      <FormActions>
        <DangerButton type="button" onClick={onDelete}>Delete Account</DangerButton>
        <SaveButton type="submit">Save Changes</SaveButton>
      </FormActions>
    </Form>
  );
};

/* ---------------------- Styles ---------------------- */

const Page = styled.div`
  min-height: calc(100vh - 72px);
  padding-top: 16px;
`;

const SettingsArea = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr 300px;
  gap: 22px;
  width: calc(100% - 64px);
  // margin: 18px auto;
  // max-width: 1300px;
  transition: padding-left 160ms ease;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    width: calc(100% - 32px);
    margin: 12px;
  }

  flex: 1;
  min-width: 0;
  padding: 88px 36px 20px ${({ $sidebarExpanded }) => ($sidebarExpanded ? "225px" : "76px")};
  transition: padding-left 0.18s cubic-bezier(.61,-0.01,.51,.99);

  @media (max-width: 1100px) {
    padding-left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "80px" : "41px")};
  }

  @media (max-width: 700px) {
    padding-left: 2vw;
  }
`;

/* Sidebar */
const Sidebar = styled.aside`
  background: ${({ theme }) => (theme.isDark) ? theme.card :"#fff"};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(20,40,80,0.06);
  height: fit-content;
`;

const Brand = styled.div`
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark) ? theme.brand : "#123047"};
  margin-bottom: 12px;
  font-size: 1.05rem;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled.button`
  text-align: left;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${({ active }) => (active ? "#e9f1ff" : "transparent")};
  color: ${({ active }) => (active ? "#123b6b" : "#8894a1ff")};
  font-weight: ${({ active }) => (active ? 700 : 600)};
  transition: background 140ms, color 140ms;
  &:hover { background: #f3f8ff; }
`;

/* Main area */
const MainArea = styled.main`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

/* Title row */
const TopTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: space-between;
  h1 { margin: 0; font-size: 1.3rem; color: ${({ theme }) => (theme.isDark) ? theme.card :"#11263b"}; text-transform: none; }
`;

const PlanBadge = styled.span`
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#faf0f6"};
  color: #b31d6c;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
`;

/* Card / subscription */
const Card = styled.section`
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#fff"};
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(20,40,80,0.05);
  overflow: hidden;
`;

const Tabs = styled.div`
  display: flex;
  gap: 6px;
  padding: 10px 18px;
  border-bottom: 1px solid #eef2f7;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  font-weight: ${({ active }) => (active ? 700 : 600)};
  color: ${({ active }) => (active ? "#2568cd" : "#6e7d97")};
  border-bottom: ${({ active }) => (active ? "3px solid #2568cd" : "none")};
  cursor: pointer;
  border-radius: 6px 6px 0 0;
`;

const CardBody = styled.div`
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 22px;
  @media (max-width: 900px) { flex-direction: column; gap: 12px; }
`;

const StatusBadge = styled.span`
  background: #fff9e6;
  color: #a35f00;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  align-self: flex-start;
`;

const Info = styled.div`
  flex: 1.4;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PlanTitle = styled.div`
  font-weight: 800;
  color: #12263b;
  font-size: 1rem;
`;

const PlanText = styled.div`
  color: #6e8196;
  font-size: 0.9rem;
`;

const ContactLink = styled.a`
  color: #2e71e3;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 6px;
`;

const RenewInfo = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 150px;
`;

const Price = styled.div`
  color: #2568cd;
  font-weight: 800;
  font-size: 1.05rem;
`;

const SmallMuted = styled.div`
  color: #7b8ba3;
  font-size: 0.85rem;
`;

const Expiry = styled.div`
  color: #b47c05;
  font-size: 0.85rem;
  margin-top: 4px;
`;

const Divider = styled.hr`
  margin: 12px 0;
  border: none;
  border-top: 1px solid #eef2f7;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  @media (max-width: 650px) { flex-direction: column; align-items: stretch; }
`;

const Note = styled.div`
  color: #586b82;
  font-size: 0.92rem;
  flex: 1;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
`;

/* Buttons - shared styles */
const btnBase = css`
  padding: 9px 14px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: transform 140ms ease, box-shadow 140ms ease, filter 120ms;
  &:active { transform: translateY(1px); }
`;

/* Ghost / secondary button */
const GhostButton = styled.button`
  ${btnBase}
  background: #eef5ff;
  color: #1f4f8a;
  border: 1px solid #d7e8ff;
`;

/* Primary button gradient */
const PrimaryButton = styled.button`
  ${btnBase}
  background: linear-gradient(90deg,#3a7ef2 0%, #2abdff 100%);
  color: #fff;
  box-shadow: 0 6px 22px rgba(46,122,255,0.18);
`;

/* Form card and form */
const FormCard = styled.section`
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#fff"};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(20,40,80,0.04);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#2f4a63"};
  font-size: 0.92rem;
`;

const Input = styled.input`
  border: 1px solid #d8e3f7;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.96rem;
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#fbfdff"};
  color: ${({ theme }) => (theme.isDark) ? theme.text : "black"};
  outline: none;
  transition: box-shadow 140ms, border-color 140ms;
  &:focus {
    box-shadow: 0 6px 20px rgba(50,120,255,0.08);
    border-color: #7fb3ff;
  }
`;

/* File input */
const File = styled.input.attrs({ type: "file" })`
  padding: 8px 6px;
  font-size: 0.95rem;
  color: #2e71e3;
  &::file-selector-button {
    background: #2f68d7;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
  }
`;

const Row2 = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 900px) { flex-direction: column; }
`;

/* Form actions */
const FormActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 6px;
`;

const SaveButton = styled.button`
  ${btnBase}
  background: #2f68d7;
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 800;
`;

const DangerButton = styled.button`
  ${btnBase}
  background: #fff;
  color: #b33a3a;
  border: 1px solid #f2d1d1;
  padding: 9px 12px;
  border-radius: 8px;
`;

/* Review panel */
const ReviewPanel = styled.aside`
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#f8fbff 0%"};
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 12px 36px rgba(10,40,80,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;

  @media (max-width: 1100px) { display: none; }
`;

const Avatar = styled.div`
  width: 136px;
  height: 136px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 3px solid #d6e6fc;
  box-shadow: 0 6px 18px rgba(100,150,255,0.12);
`;

/* export component */
export default ConfigureSettings;
