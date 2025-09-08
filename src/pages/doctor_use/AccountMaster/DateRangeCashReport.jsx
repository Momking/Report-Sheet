import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../../../Components/Navbar";
import AppNav from "../../../Components/TopNavbar";
import { BiSearch } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LineChart, CartesianGrid, ResponsiveContainer, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useSidebar } from "../../../Context/SidebarContext";
import { FiChevronRight } from "react-icons/fi";

// --- MOCK DATA ---
const sampleData = [
  { date: "2025-09-01", amount: 1200 },
  { date: "2025-09-02", amount: 800 },
  { date: "2025-09-03", amount: 950 },
  { date: "2025-09-04", amount: 1600 },
  { date: "2025-09-05", amount: 1200 },
  { date: "2025-09-06", amount: 0 },
  { date: "2025-09-07", amount: 600 },
  { date: "2025-09-08", amount: 1450 },
];

const DateRangeCashReport = () => {
  const [fromDate, setFromDate] = useState("2025-09-01");
  const [toDate, setToDate] = useState("2025-09-08");
  const [search, setSearch] = useState("");
  const { sidebarExpanded } = useSidebar();


  const ACCOUNT_TYPES = [
    { name: "Pathology Lab Cash", subAccounts: ["Front Desk", "Sample Collection"] },
    { name: "Doctor Cash", subAccounts: ["Dr. Ravi", "Dr. Rajeev"] },
    { name: "Self", subAccounts: [] },
  ];
  
    const [accountType, setAccountType] = useState(ACCOUNT_TYPES.name);
    const [subAccount, setSubAccount] = useState("");

    const currentType = ACCOUNT_TYPES.find((t) => t.name === accountType);
  
    useEffect(() => {
      setSubAccount("");
    }, [accountType]);

  // Filter data based on date range
  const filteredData = useMemo(() => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return sampleData.filter(d => {
      const current = new Date(d.date);
      return current >= from && current <= to && d.date.includes(search);
    });
  }, [fromDate, toDate, search]);

  const totalCollected = filteredData.reduce((sum, d) => sum + d.amount, 0);

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
              <FiChevronRight />
              <span className="active">Cash Report</span>
            </BreadCrumb>
          </StickyBar>
          <H2>
            <FaRegCalendarAlt style={{ marginRight: "9px", color: "#377cfb" }} />
            Cash Report
          </H2>

          {/* Stats */}
          <StatsRow>
            <StatCard color="#377cfb1a" border="#377cfb">
              <Circle color="#377cfb">
                <MdOutlineAttachMoney size={18} />
              </Circle>
              <div>
                <span className="stat-label" style={{color: "#819cc3"}}>Total Cash Collected</span>
                <div className="stat-value" style={{ color: "#377cfb" }}>Rs. {totalCollected.toLocaleString()}</div>
              </div>
            </StatCard>
            <StatCard color="#e6edff" border="#7b7fff" compact>
              <CalendarBox>
                From:
                <DateInput
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </CalendarBox>
            </StatCard>
            <StatCard color="#e6edff" border="#7b7fff" compact>
              <CalendarBox>
                To:
                <DateInput
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </CalendarBox>
            </StatCard>
            <StatCard color="#fde2d7" border="#f56642">
              <Circle color="#f56642">
                <HiOutlineDownload size={16} />
              </Circle>
              <div>
                <span className="stat-label" style={{color: "#85a1c9"}}>Download Report</span>
                <DownloadBtn>
                  <HiOutlineDownload size={14} /> Report
                </DownloadBtn>
              </div>
            </StatCard>
          </StatsRow>

          {/* Chart */}
          <ChartCard>
            <LineChartTitle>Cash Trend</LineChartTitle>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={filteredData} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                <CartesianGrid stroke="#f1f4fa" strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={11} stroke="#aec1e9" tick={{ fill: '#657d96' }} />
                <YAxis fontSize={10} stroke="#aec1e9" tick={{ fill: '#657d96' }} width={38}/>
                <Tooltip contentStyle={{ fontSize: 10 }} cursor={{ fill: "#eaf3ff" }}/>
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2.2} dot={{ r: 2.5 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Table */}
          <Card>
            <TableHeader>
              Transactions
              <Chip>{filteredData.length}</Chip>
            </TableHeader>
            <FlexTableWrap>
              <TableSearchWrap>
                <BiSearch style={{ color: "#aec2e3", fontSize: 15 }} />
                <SearchField
                  placeholder="Search date"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                />
              </TableSearchWrap>
            </FlexTableWrap>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length ? (
                  filteredData.map(d => (
                    <tr key={d.date}>
                      <td>{d.date}</td>
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
  margin: 0 auto;
  transition: padding-left 0.18s;
    
  flex: 1;
  min-width: 0;
  padding: 88px 36px 20px ${({ $sidebarExpanded }) => ($sidebarExpanded ? "225px" : "76px")};
  transition: padding-left 0.18s cubic-bezier(.61,-0.01,.51,.99);

  @media (max-width: 1100px) {
    flex-direction: column;
    gap: 22px;
    padding-left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "220px" : "70px")};
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
  }

  .active {
    font-weight: 800;
  }
`;

const H2 = styled.h2`
  font-size: 1.23rem;
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#153060"};
  margin-bottom: 22px;
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
  background: ${({ color }) => color};
  border-radius: 13px;
  min-width: 185px;
  border: 1.6px solid ${({ border }) => border};
  padding: 13px 22px;
  display: flex;
  align-items: center;
  gap: 13px;
  flex: 1;

  ${({ compact }) => compact && `
    justify-content: center;
  `}
`;

const Circle = styled.div`
  background: ${({ color }) => color}20;
  border-radius: 100%;
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
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

  &:hover {
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
  font-weight: 700;
  margin-bottom: 12px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#566a92ff"};
`;

const Card = styled.div`
  margin-top: 5px;
  padding: 0 0 10px 0;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#566a92ff"};
  border-radius: 13px;
  box-shadow: 0 1.5px 12px #e6eefa22;
`;

const TableHeader = styled.div`
  font-size: 1.02rem;
  font-weight: 700;
  padding: 23px 23px 0 23px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Chip = styled.span`
  font-size: .96em;
  font-weight: bold;
  margin-left: 8px;
  background: ${({ theme }) => (theme.isDark) ? theme.brand : "#e6edff"};
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#7b8bab"};
  padding: 2px 11px;
  border-radius: 12px;
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
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "transparent"};
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
    font-size: .99em;
    font-weight: 700;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#7b8bab"};
    padding: 12px 18px 8px 23px;
    text-align: left;
  }

  tbody tr {
    background: ${({ theme }) => (theme.isDark) ? theme.card : "#f8fafd"};
    color: ${({ theme }) => (theme.isDark) ? theme.text : "black"};
    transition: background .16s;
  }

  tbody tr:hover {
    background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#eaf3ff"};
  }

  tbody td {
    padding: 11px 18px 8px 23px;
    font-size: .98em;
  }
`;

const Right = styled.div`
  flex: 1;
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
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#253064"};
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


export default DateRangeCashReport;
