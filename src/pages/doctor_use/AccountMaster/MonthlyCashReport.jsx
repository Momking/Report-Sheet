import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../../../Components/Navbar";
import AppNav from "../../../Components/TopNavbar";
import { BiSearch } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LineChart, CartesianGrid, ResponsiveContainer, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useSidebar } from "../../../Context/SidebarContext";
import { FiChevronsRight } from "react-icons/fi";

// --- MOCK DATA ---
const sampleMonthlyData = [
  { day: "01", amount: 1200 },
  { day: "02", amount: 800 },
  { day: "03", amount: 950 },
  { day: "04", amount: 1600 },
  { day: "05", amount: 1200 },
  { day: "06", amount: 0 },
  // ...add as many days as the month needs
];

const ACCOUNT_TYPES = [
  { name: "Pathology Lab Cash", subAccounts: ["Front Desk", "Sample Collection"] },
  { name: "Doctor Cash", subAccounts: ["Dr. Ravi", "Dr. Rajeev"] },
  { name: "Self", subAccounts: [] },
];

const MonthlyCashReport = () => {
  const [month, setMonth] = useState("2025-09");
  const [search, setSearch] = useState("");
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES.name);
  const [subAccount, setSubAccount] = useState("");
  const { sidebarExpanded } = useSidebar();

  const currentType = ACCOUNT_TYPES.find((t) => t.name === accountType);

  useEffect(() => {
    setSubAccount("");
  }, [accountType]);

  const filteredData = sampleMonthlyData.filter((d) =>
    d.day.includes(search)
  );
  const totalCollected = sampleMonthlyData.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Page>
      <AppWrapper>
        <AppNav sidebarExpanded={sidebarExpanded} />
        <Navbar />
      </AppWrapper>
      <Body $sidebarExpanded={sidebarExpanded}>
        <Left>
          <StickyBar>
            <BreadCrumb>
              <span className="muted">Account</span>
              <FiChevronsRight />
              <span className="active">Monthly Cash Report</span>
            </BreadCrumb>
          </StickyBar>
          <H2>
            <FaRegCalendarAlt style={{ marginRight: "9px", color: "#377cfb" }} />
            Monthly Cash Report
          </H2>
          <StatsRow>
            <StatCard color="#377cfb1a" border="#377cfb">
              <Circle color="#377cfb">
                <MdOutlineAttachMoney size={18} />
              </Circle>
              <div>
                <span className="stat-label">Total Cash Collected</span>
                <div className="stat-value" style={{ color: "#377cfb" }}>Rs. {totalCollected.toLocaleString()}</div>
              </div>
            </StatCard>
            <StatCard color="#5ee6641a" border="#29b84f">
              <Circle color="#29b84f">
                <svg height="16" width="16" fill="#29b84f" viewBox="0 0 20 20"><path d="M10 2a8 8 0 108 8 8.009 8.009 0 00-8-8zm0 14a6 6 0 116-6 6.006 6.006 0 01-6 6zm0-11a5 5 0 105 5 5.006 5.006 0 00-5-5zm0 7a2 2 0 112-2 2.003 2.003 0 01-2 2z"></path></svg>
              </Circle>
              <div>
                <span className="stat-label">No. of Days</span>
                <div className="stat-value" style={{ color: "#29b84f" }}>{sampleMonthlyData.length}</div>
              </div>
            </StatCard>
            <StatCard color="#fde2d7" border="#f56642">
              <Circle color="#f56642">
                <HiOutlineDownload size={16} />
              </Circle>
              <div>
                <span className="stat-label">Download Report</span>
                <DownloadBtn>
                  <HiOutlineDownload size={14} style={{ marginRight: 4 }} /> Report
                </DownloadBtn>
              </div>
            </StatCard>
            <StatCard color="#e6edff" border="#7b7fff" compact>
              <CalendarBox>
                Date:
                <DateInput
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  aria-label="Select month"
                />
              </CalendarBox>
            </StatCard>
          </StatsRow>

          <ChartCard>
            <LineChartTitle>Daily Cash Pattern</LineChartTitle>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={sampleMonthlyData} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                <CartesianGrid stroke="#f1f4fa" strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={11} stroke="#aec1e9" tick={{ fill: '#657d96' }} />
                <YAxis fontSize={10} stroke="#aec1e9" tick={{ fill: '#657d96' }} width={38}/>
                <Tooltip contentStyle={{ fontSize: 10 }} cursor={{ fill: "#eaf3ff" }}/>
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2.2} dot={{ r: 2.5 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <Card>
            <TableHeader>
              Patient Cash Transactions
              <Chip>{filteredData.length}</Chip>
            </TableHeader>
            <FlexTableWrap>
              <TableSearchWrap>
                <BiSearch style={{ color: "#aec2e3", fontSize: 15 }} />
                <SearchField
                  placeholder="Search day"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                />
              </TableSearchWrap>
            </FlexTableWrap>
            <Table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length ? (
                  filteredData.map(d => (
                    <tr key={d.day}>
                      <td>{d.day}</td>
                      <td style={{ fontWeight: 700, color: "#1c4dc2" }}>Rs.{d.amount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center", color: "#b3b6c9", fontWeight: 500, fontSize:".93em" }}>No data found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Left>

        <Right>
          <SidebarCard>
            <SidebarLabel>Account Type</SidebarLabel>
            <SidebarSelect
              value={accountType}
              onChange={e => setAccountType(e.target.value)}
            >
              {ACCOUNT_TYPES.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
            </SidebarSelect>
            {currentType?.subAccounts?.length > 0 && (
              <>
                <SidebarLabel htmlFor="subAccount">Sub Account</SidebarLabel>
                <SidebarSelect
                  id="subAccount"
                  value={subAccount}
                  onChange={e => setSubAccount(e.target.value)}
                >
                  <option value="">All</option>
                  {currentType.subAccounts.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </SidebarSelect>
              </>
            )}
            <SidebarSub>
              <b>How to use:</b>
              <ul>
                <li>Change the account type to see specific data.</li>
                <li>Select sub-accounts for filtered results.</li>
                <li>Search by day for details quickly.</li>
                <li>Date picker helps get monthly data.</li>
              </ul>
            </SidebarSub>
          </SidebarCard>
        </Right>
      </Body>
    </Page>
  );
};

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f6f9fc"};
`;

const AppWrapper = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  position: sticky;
  top: 0;
  z-index: 200;
`;

const Body = styled.div`
  display: flex;
  gap: 26px;
  // max-width: 1300px;
  margin: 0 auto;
  padding: 23px 14px 35px 14px;

  @media (max-width: 1100px) {
    flex-direction: column;
    gap: 22px;
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

const Left = styled.div`
  flex: 3;
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

  svg {
    color: ${({ theme }) => theme.textSoft};
    font-size: 1.1em;
  }
`;

const Right = styled.div`
  flex: 1;
`;

const H2 = styled.h2`
  font-size: 1.23rem;
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#153060"};
  margin-bottom: 22px;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 9px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const StatCard = styled.div`
  background: ${({ color }) => color || "#f1f4fa"};
  border-radius: 13px;
  min-width: 185px;
  border: 1.6px solid ${({ border }) => border || "#e4e8ee"};
  padding: 13px 22px;
  display: flex;
  align-items: center;
  gap: 13px;
  font-size: 14.2px;
  box-shadow: 0 1.5px 8px #e4eefa44;
  flex: 1;
  ${({ compact }) => compact && `
    justify-content: center;
    min-width: 140px;
  `}
  .stat-label {
    font-size: .95em;
    color: #85a1c9;
    font-weight: 600;
  }
  .stat-value {
    font-size: 1.16em;
    font-weight: 700;
    margin-top: 1px;
  }
`;

const Circle = styled.div`
  background: ${({ color }) => color}20;
  border-radius: 100%;
  width: 37px;
  height: 37px;
  min-width: 37px;
  min-height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  font-size: 19px;
`;

const DownloadBtn = styled.button`
  font-size: .98em;
  border: none;
  background: #f8faff;
  color: #fa6a4b;
  font-weight: 600;
  margin-top: 4px;
  padding: 6px 13px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.12s;
  svg { margin-right: 2px;}
  &:hover{
    background: #fff4f1;
  }
`;

const CalendarBox = styled.div`
  font-size: 1em;
  color: #556889;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
const DateInput = styled.input`
  border: 1.2px solid #b6caef;
  border-radius: 7px;
  background: #f4faff;
  padding: 5px 10px;
  font-size: 0.98em;
  color: #377cfb;
  font-weight: 600;
  outline: none;
`;

const ChartCard = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  border-radius: 13px;
  box-shadow: 0 2px 24px #e6eefc66;
  margin-bottom: 19px;
  padding: 17px 27px;
`;

const LineChartTitle = styled.div`
  font-size: 0.99em;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#364968"};
  font-weight: 700;
  margin-bottom: 12px;
`;

const Card = styled.div`
  margin-top: 5px;
  padding: 0 0 10px 0;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  border-radius: 13px;
  box-shadow: 0 1.5px 12px #e6eefa22;
`;

const TableHeader = styled.div`
  font-size: 1.02rem;
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#162850"};
  background: none;
  padding: 23px 23px 0 23px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Chip = styled.span`
  font-size: .96em;
  font-weight: bold;
  margin-left: 8px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#3b60e4"};
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#e6edff"};
  padding: 2px 11px;
  border-radius: 12px;
  display: inline-block;
`;

const FlexTableWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 9px 15px 0 0;
`;
const TableSearchWrap = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f5faff"};
  border-radius: 17px;
  border: 1px solid #e3e6f5;
  padding: 4px 11px;
  min-width: 230px;
  gap: 7px;
`;
const SearchField = styled.input`
  border: none;
  background: transparent;
  outline: none;
  padding: 3px 4px;
  width: 100%;
  font-size: .95em;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#3d496a"};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-top: 0;
  thead th {
    background: none;
    font-size: 0.99em;
    font-weight: 700;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#7b8bab"};
    border-bottom: none;
    padding: 12px 18px 8px 23px;
    text-align: left;
  }
  tbody tr {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f8fafd"};
    box-shadow: 0 0 0.5px #e0e5ef;
    border-radius: 10px;
    transition: background 0.16s;
  }
  tbody tr:hover {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#eaf3ff"};
  }
  tbody td {
    padding: 11px 18px 8px 23px;
    border: none;
    font-size: 0.98em;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#32426a"};
  }
`;

const SidebarCard = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};  
  border-radius: 13px;
  box-shadow: 0 2px 18px #e2eefa11;
  padding: 24px 19px;
  margin-top: 3px;
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const SidebarLabel = styled.label`
  font-size: 0.96em;
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#4460a9"};
  margin: 7px 0 6px 0;
`;

const SidebarSelect = styled.select`
  width: 100%;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f4f8ff"};
  border: 1px solid #c5d8f8;
  padding: 7px 13px;
  font-size: 0.99em;
  font-weight: 600;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#31416d"};
  border-radius: 8px;
  outline: none;
  margin-bottom: 5px;
`;

const SidebarSub = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f9fbff"};
  border-radius: 9px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#38528f"};
  font-size: 0.95em;
  padding: 13px;
  margin: 10px 0 0 0;
  b {
    display:block;
    margin-bottom: 5px;
    font-weight: 700;
    color: #253064;
  }
  ul {
    margin:0 0 0 1.21em;
    padding:0;
    font-size:.96em;
  }
  li {
    margin-bottom: 4px;
  }
`;

export default MonthlyCashReport;
