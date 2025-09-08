import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../../../Components/Navbar";
import AppTopNav from "../../../Components/TopNavbar";
import { BiSearch } from "react-icons/bi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { BsFillPeopleFill, BsPrinter } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useSidebar } from "../../../Context/SidebarContext";

// Demo rows for your patient table
const sampleRows = [
  { id: 1, name: "RAHUL VERMA", date: "2025-09-04", amount: 1200, method: "Cash" },
  { id: 2, name: "PRIYA SINGH", date: "2025-09-04", amount: 800, method: "UPI" },
];

const ACCOUNT_TYPES = [
  {
    name: "Pathology Lab Cash",
    subAccounts: ["Front Office", "Sample Collection"]
  },
  {
    name: "Doctor Cash",
    subAccounts: ["Dr. Ravi Shankar", "Dr. Rajeev Ranjan"]
  },
  {
    name: "Self",
    subAccounts: []
  }
];

const DailyCashReport = () => {
  const [date, setDate] = useState("2025-09-04");
  const [search, setSearch] = useState("");
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES[0].name);
  const [subAccount, setSubAccount] = useState("");
  const { sidebarExpanded } = useSidebar();

  // Account Type logic
  const currentType = ACCOUNT_TYPES.find(type => type.name === accountType);

  // Reset subaccount when changing account type
  React.useEffect(() => { setSubAccount(""); }, [accountType]);

  return (
    <Page>
      <AppTopNav sidebarExpanded={sidebarExpanded} />
      <Navbar />
      <MainContent $sidebarExpanded={sidebarExpanded}>
        <Main>
        <StickyBar>
          <BreadCrumb>
            <span className="muted">Account</span>
            <FiChevronRight />
            <span className="active">Daily Cash Report</span>
          </BreadCrumb>
        </StickyBar>
          <HeaderRow>
            <H1>
              <FaRegCalendarAlt style={{marginBottom:"-2px"}} /> Daily Cash Report
            </H1>
            <DateSelect>
              <label>Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </DateSelect>
          </HeaderRow>

          <StatsRow>
            <StatCard accent="#167cf4" accentbg="#f0f5fd">
              <span className="icon"><MdOutlineAttachMoney /></span>
              <div>
                <small>Total Cash Collected</small>
                <div className="primary">
                  Rs. {sampleRows.reduce((sum, r) => sum + r.amount, 0)}
                </div>
              </div>
            </StatCard>
            <StatCard accent="#4bc27d" accentbg="#e8f8f1">
              <span className="icon"><BsFillPeopleFill /></span>
              <div>
                <small>No. of Patients</small>
                <div className="primary">{sampleRows.length}</div>
              </div>
            </StatCard>
            <StatCard accent="#ed6a5a" accentbg="#fff1ee">
              <span className="icon"><BsPrinter /></span>
              <div>
                <small>Download Report</small>
                <IconBtn><HiOutlineDocumentDownload /></IconBtn>
              </div>
            </StatCard>
          </StatsRow>

          <TableCard>
            <TableHead>
              <div>
                <b>Patient Cash Transactions</b>
                <span className="badge">{sampleRows.length}</span>
              </div>
              <SearchWrapper>
                <BiSearch />
                <SearchInput
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search patient name"
                />
              </SearchWrapper>
            </TableHead>
            <ResponsiveTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Amount Paid</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {sampleRows
                  .filter(row => row.name.toLowerCase().includes(search.toLowerCase()))
                  .map(row => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.date}</td>
                    <td>
                      <b style={{color:"#2566ae"}}>
                        Rs.{row.amount}
                      </b>
                    </td>
                    <td>
                      <span className={`method method--${row.method.toLowerCase()}`}>{row.method}</span>
                    </td>
                  </tr>
                ))}
                {sampleRows.filter(row => row.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                  <tr>
                    <td colSpan={5} style={{textAlign:"center",color:"#9da9bb",fontWeight:500,fontSize:"1em"}}>
                      No data for this date/search.
                    </td>
                  </tr>
                )}
              </tbody>
            </ResponsiveTable>
          </TableCard>
        </Main>
        <RightSidebar>
          <SidebarHead>
            <label htmlFor="accountType">Account Type</label>
            <Select
              id="accountType"
              value={accountType}
              onChange={e => setAccountType(e.target.value)}
            >
              {ACCOUNT_TYPES.map(t =>
                <option key={t.name} value={t.name}>{t.name}</option>
              )}
            </Select>
          </SidebarHead>
          {currentType?.subAccounts?.length > 0 && (
            <SidebarHead>
              <label htmlFor="subAccount">Sub Account</label>
              <Select
                id="subAccount"
                value={subAccount}
                onChange={e => setSubAccount(e.target.value)}
              >
                <option value="">All</option>
                {currentType.subAccounts.map(s => (
                  <option value={s} key={s}>{s}</option>
                ))}
              </Select>
            </SidebarHead>
          )}
          <HelpBox>
            <h5>How to use:</h5>
            <ul>
              <li>Change the account type to see specific data.</li>
              <li>Select sub-accounts for filtered results.</li>
              <li>Use the search to find patients quickly.</li>
              <li>Date picker helps get daily data.</li>
            </ul>
          </HelpBox>
        </RightSidebar>
      </MainContent>
    </Page>
  );
};

// Styles
const Page = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f3f7fa"};
  min-height: 100vh;
  font-size: 14px;
`;

// Main layout: main + sidebar
const MainContent = styled.div`
  display: flex;
  // max-width: 1180px;
  margin: 0 auto;
  padding: 28px 15px 30px 15px;
  gap: 32px;

  @media (max-width: 950px) {
    flex-direction: column;
    gap: 22px;
  }

  flex: 1;
  min-width: 0;
  padding: 88px 36px 20px ${({ $sidebarExpanded }) => ($sidebarExpanded ? "225px" : "76px")};
  transition: padding-left 0.18s cubic-bezier(.61,-0.01,.51,.99);

  @media (max-width: 1100px) {
    padding-left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "220px" : "70px")};
  }

  @media (max-width: 700px) {
    padding-left: 2vw;
  }
`;

// Main panel (left)
const Main = styled.div`
  flex: 3 1 0;
  min-width: 0;
  transition: padding-left 0.18s cubic-bezier(.61,-0.01,.51,.99);
`;

const StickyBar = styled.div`
  position: sticky;
  top: 58px;
  z-index: 50;
  background: ${({ theme }) => theme.bg};
  padding: 8px 2px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BreadCrumb = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 0.92em;

  .muted {
    color: ${({ theme }) => theme.textSoft};
    font-weight: 500;
  }

  .active {
    color: ${({ theme }) => theme.text};
    font-weight: 800;
  }

  svg {
    color: ${({ theme }) => theme.textSoft};
    font-size: 1.1em;
  }
`;

const RightSidebar = styled.aside`
  flex: 1 0 20px;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fbfcfd"};
  border: 1.5px solid #e5ecf4;
  border-radius: 11px;
  box-shadow: 0 2px 11px #e3eaf6aa;
  padding: 20px 22px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 225px;

  @media (max-width: 950px) {
    min-width: unset;
    width: 100%;
    padding: 18px 11px;
    flex: none;
  }
`;

const SidebarHead = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  label {
    font-size: 1em;
    font-weight: 550;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#246ebb"};
    margin-bottom: 4px;
  }
`;

const Select = styled.select`
  font-size: 14px;
  border-radius: 5px;
  border: 1.3px solid #d7e7fa;
  padding: 7px 11px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#283f60"};
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f6fafd"};
  font-weight: 600;
  outline: none;
`;

// Sidebar helper content styling:
const HelpBox = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f6fafd"};
  font-size: 13px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#546478"};
  border: 1px solid #e1e9f2;
  border-radius: 7px;
  padding: 12px 10px 10px 13px;

  h5 {
    margin: 0 0 8px 0;
    font-weight: 700;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#0c3866"};
    font-size: 1em;
  }
  ul {
    margin: 0 0 0 1.2em; padding: 0;
    li { margin-bottom: 4px; }
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
  @media (max-width: 600px) { flex-direction: column; align-items: flex-start; }
`;

const H1 = styled.h1`
  font-weight: 800;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#1d3557"};
  font-size: 1.47em;
  margin: 0;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DateSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  label { font-size: 1em; font-weight: 500; color: ${({ theme }) => (theme.isDark) ? theme.text : "#4771b6"}}
  input[type="date"] {
    border: 1.5px solid #d7e7fa;
    border-radius: 5px;
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f6fafd"};
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#1748a5"};
    padding: 7px 12px;
    font-size: 1.03em;
    font-weight: 550;
    outline: none;
    margin-left: 4px;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 19px;
  margin-bottom: 24px;
  @media (max-width: 600px) { flex-direction: column; }
`;

const StatCard = styled.div`
  flex: 1;
  background: ${({ accentbg }) => accentbg || "#fff"};
  border-radius: 10px;
  box-shadow: 0 1.5px 8px #e6eeff4c;
  display: flex;
  align-items: center;
  gap: 17px;
  padding: 21px 21px;
  min-width: 0;
  .icon {
    font-size: 1.7em;
    color: ${({ accent }) => accent};
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 12px #dff3ff18;
    padding: 7px 12px 6px 10px;
    display: flex;
    align-items: center;
  }
  small { color: #6586b6; font-size: 0.99em;}
  .primary { font-weight: 720; font-size: 1.21em; color: #26377e; margin-top: 2px; }
`;

const IconBtn = styled.button`
  background: "#f6fafd";
  border: 1px solid #ccd9ef;
  border-radius: 6px;
  // color: ${({ theme }) => (theme.isDark) ? theme.text : "#223e86"};
  font-size: 1.2em;
  padding: 4px 10px;
  cursor: pointer;
  transition: background 0.18s;
  &:hover { background: #d1ebff; }
`;

const TableCard = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  border-radius: 12px;
  box-shadow: 0 2px 16px #e3eaf6bb;
  border: 1px solid #e3e8f2;
  margin-top: 8px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "black"};
`;

const TableHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 8px 18px;
  @media (max-width: 600px) { flex-direction: column; gap: 9px; align-items: flex-start; }
  .badge {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#e8f2ff"}; color: ${({ theme }) => (theme.isDark) ? theme.text : "#2783e6"}; font-weight: 700; font-size: 0.96em;
    padding: 2px 9px; border-radius: 10px; margin-left: 10px;
  }
`;

const ResponsiveTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 10px;
  th, td {
    border: none;
    padding: 10px 8px;
    text-align: left;
    font-family: inherit;
  }
  th {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f7fafd"};
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#5a6e92"};
    font-weight: 700;
    border-bottom: 1px solid #e3e8f2;
  }
  tr { border-bottom: 1.1px solid #e9eef5; }
  .method {
    font-size: 0.97em;
    font-weight: 600;
    border-radius: 5px;
    padding: 2px 11px;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#fff"};
    &--cash { background: #2778e6; }
    &--upi { background: #00bb72; }
    &--card { background: #9742c4; }
    &--insurance { background: #fba81c; }
  }
`;

const SearchWrapper = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f8fafd"};
  padding: 6px 13px;
  margin-left: 16px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  border: 1px solid #e6eaf0;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#2c3a57"};
  min-width: 130px;
  margin-left: 5px;
`;

export default DailyCashReport;
