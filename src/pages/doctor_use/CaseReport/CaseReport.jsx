import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import AppTopNav from "../../../Components/TopNavbar";
import Navbar from "../../../Components/Navbar";
import { useSidebar } from "../../../Context/SidebarContext";
import { FiChevronRight, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

// GlobalStyle & mock data: same as yours or extend/mock more

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
  }
`;

const genders = ["Male", "Female", "Other"];
const statuses = ["Active", "Discharged", "Critical"];
const mockDoctors = [
  "Dr. A. Sen",
  "Dr. S. Patel",
  "Dr. R. Kumar",
  "Dr. J. Chawla",
];

const mockCategories = [
  "Serum Phosphorus",
  "Serum Creatinine",
  "Serum Urea",
  "Fasting Blood Sugar",
  "Blood Sugar PP",
];

const mockLocations = [
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Chennai", state: "Tamil Nadu" },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = [2024, 2025, 2026];


// Include new filter fields in mock data
const mockData = [
  {
    city: "Mumbai", state: "Maharashtra", category: "Serum Phosphorus",
    cases: 120, month: "January", year: 2025, gender: "Male", age: 52, doctor: "Dr. A. Sen",
    date: "2025-01-20", status: "Active"
  },
  {
    city: "Mumbai", state: "Maharashtra", category: "Serum Creatinine",
    cases: 80, month: "February", year: 2025, gender: "Female", age: 61, doctor: "Dr. S. Patel",
    date: "2025-02-11", status: "Discharged"
  },
  // ...add more
];

function getAverage(arr) {
  if (!arr.length) return 0;
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

const CaseReport = () => {
  const { sidebarExpanded } = useSidebar();

  // FILTER STATES
  const [selectedCategory, setSelectedCategory] = useState(mockCategories[0]);
  const [selectedCity, setSelectedCity] = useState(mockLocations[0].city);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [ageRange, setAgeRange] = useState([0, 100]);

  // Derived values
  const filtered = mockData.filter((d) => {
    return (
      d.category === selectedCategory &&
      d.city === selectedCity &&
      d.month === selectedMonth &&
      d.year === selectedYear &&
      (selectedGender === "All" || d.gender === selectedGender) &&
      (selectedStatus === "All" || d.status === selectedStatus) &&
      (selectedDoctor === "All" || d.doctor === selectedDoctor) &&
      d.age >= ageRange[0] &&
      d.age <= ageRange[1]
    );
  });

  // Simple "trend" mock logic to add a rising/falling badge
  const prevMonthCases = 90; // Mock: fetch/calc in real usage
  const currentCases = filtered.reduce((sum, d) => sum + d.cases, 0);
  const trendUp = currentCases > prevMonthCases;

  return (
    <div>
      <GlobalStyle />
      <Page>
        <AppTopNav sidebarExpanded={sidebarExpanded} />
        <Navbar />
        <Container $sidebarExpanded={sidebarExpanded}>
          <StickyBar>
            <BreadCrumb>
              <span className="muted">Reports</span>
              <FiChevronRight />
              <span className="active">Case Report</span>
            </BreadCrumb>
          </StickyBar>

          <Header>
            <Title>Case Report</Title>
            <SectionLabel>Insights and Trends</SectionLabel>
          </Header>

          {/* FILTERS */}
          <FilterBar>
            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} aria-label="Category">
              {mockCategories.map((cat) => (<option key={cat}>{cat}</option>))}
            </Select>
            <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} aria-label="City">
              {mockLocations.map((loc) => (
                <option key={loc.city}>{loc.city}</option>))}
            </Select>
            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} aria-label="Month">
              {months.map((m) => (<option key={m}>{m}</option>))}
            </Select>
            <Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} aria-label="Year">
              {years.map((y) => (<option key={y}>{y}</option>))}
            </Select>
            <Select value={selectedGender} onChange={e => setSelectedGender(e.target.value)} aria-label="Gender">
              <option>All</option>{genders.map((g) => (<option key={g}>{g}</option>))}
            </Select>
            <Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} aria-label="Status">
              <option>All</option>{statuses.map((s) => (<option key={s}>{s}</option>))}
            </Select>
            <Select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} aria-label="Doctor">
              <option>All</option>{mockDoctors.map((d) => (<option key={d}>{d}</option>))}
            </Select>
            <AgeInput type="number" min={0} max={100} placeholder="Min Age" value={ageRange[0]} aria-label="Min age"
              onChange={e => setAgeRange([Math.max(0, +e.target.value), ageRange[1]])}
            />
            <AgeInput type="number" min={0} max={100} placeholder="Max Age" value={ageRange[1]} aria-label="Max age"
              onChange={e => setAgeRange([ageRange[0], Math.max(ageRange[0], +e.target.value)])}
            />
          </FilterBar>

          {/* INSIGHT CARDS */}
          <StatCards>
            <InsightCard>
              <h4>Total Cases</h4>
              <StatValue>
                {currentCases}
                <TrendIcon trendUp={trendUp}>
                  {trendUp ? <FiTrendingUp /> : <FiTrendingDown />}
                </TrendIcon>
              </StatValue>
              <MiniLabel>vs last month: {prevMonthCases}</MiniLabel>
            </InsightCard>
            <InsightCard>
              <h4>Avg Age</h4>
              <StatValue>
                {filtered.length === 0 ? "-" : getAverage(filtered.map(d => d.age))}
              </StatValue>
              <MiniLabel>years</MiniLabel>
            </InsightCard>
            <InsightCard>
              <h4>Active Status</h4>
              <StatValue>
                {filtered.filter(d => d.status === "Active").length}
              </StatValue>
              <MiniLabel>Current in-facility</MiniLabel>
            </InsightCard>
          </StatCards>

          {/* DETAIL TABLE */}
          <Card>
            {filtered.length > 0 ? (
              <ResultTable>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Cases</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => (
                    <tr key={i}>
                      <td>{d.city}, {d.state}</td>
                      <td>{d.doctor}</td>
                      <td>{d.age}</td>
                      <td>{d.gender}</td>
                      <td><StatusTag status={d.status}>{d.status}</StatusTag></td>
                      <td>{d.cases}</td>
                      <td>{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </ResultTable>
            ) : (
              <NoData>No cases found for these filters.</NoData>
            )}
          </Card>
        </Container>
      </Page>
    </div>
  );
};

const Page = styled.div`
  background: ${({ theme }) => (theme.isDark ? theme.bg : "#f7fafd")};
  min-height: 100vh;
  font-size: 14px;
`;

const Container = styled.div`
  flex: 1;
  min-width: 0;
  padding: 88px 316px 20px ${({ $sidebarExpanded }) => ($sidebarExpanded ? "225px" : "76px")};
  transition: padding-left 0.18s cubic-bezier(.61,-0.01,.51,.99);

  @media (max-width: 1100px) {
    padding-right: 0px;
    padding-left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "220px" : "70px")};
  }

  @media (max-width: 700px) {
    padding-left: 2vw;
  }
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
    font-weight: 700;
  }
`;

const Header = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark ? theme.text : "#295986")};
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 8px 14px;
  font-size: 0.95em;
  border-radius: 8px;
  border: 1.2px solid #ccc;
  background: ${({ theme }) => (theme.isDark ? theme.text : "#fff")};
`;

const Card = styled.div`
  background: ${({ theme }) => (theme.isDark ? theme.card : "#fff")};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px #d8e2f233;
`;

const Stats = styled.div`
  h3 {
    font-size: 2rem;
    color: #377cfb;
    margin-bottom: 8px;
  }
  p {
    font-size: 1em;
    color: ${({ theme }) => (theme.isDark ? theme.text : "#444")};
  }
`;

const NoData = styled.div`
  color: ${({ theme }) => (theme.isDark ? theme.text : "#999")};
  font-size: 1em;
`;

const SectionLabel = styled.div`
  font-size: 0.95em;
  color: #879baf;
  font-weight: 600;
  margin-top: 0.1em;
  margin-left: 2px;
`;

const StatCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 17px;
`;

const InsightCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px #dde7f888;
  padding: 1.5em 2em 1.2em;
  min-width: 175px;
  flex: 1;
  min-height: 94px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  h4 {
    color: #3261b1;
    font-size: 1em;
    font-weight: 700;
    margin-bottom: 0.7em;
  }
`;

const StatValue = styled.div`
  font-size: 2.1em;
  font-weight: bold;
  color: #2068b8;
  display: flex;
  align-items: center;
  gap: 7px;
`;
const MiniLabel = styled.span`
  font-size: 0.88em;
  margin-top: 5px;
  color: #748092;
  font-weight: 600;
`;

const TrendIcon = styled.span`
  color: ${({ trendUp }) => (trendUp ? "#23a476" : "#e03f43")};
  font-size: 1.15em;
  margin-left: 4px;
  display: flex;
  align-items: center;
`;

const ResultTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  thead th {
    background: #f3f7fb;
    color: #2a4c66;
    font-size: 0.98em;
    padding: 0.8em 0.7em;
    font-weight: 700;
    border-bottom: 2px solid #e7ecf5;
    text-align: left;
  }
  tbody td {
    padding: 0.72em 0.7em;
    border-bottom: 1px solid #f1f5fa;
    font-size: 0.96em;
    color: #244164;
  }
`;

const StatusTag = styled.span`
  background: ${({ status }) =>
    status === "Critical" ? "#fae1dd" : status === "Active" ? "#e0faf4" : "#f0f1fa"};
  color: ${({ status }) =>
    status === "Critical" ? "#e65946" : status === "Active" ? "#13a688" : "#756fdc"};
  border-radius: 5px;
  padding: 0.28em 0.8em;
  font-weight: 700;
  font-size: 0.91em;
`;

const AgeInput = styled.input`
  width: 65px;
  border-radius: 9px;
  padding: 8px 8px;
  border: 1.1px solid #bfcfe8;
  font-size: .94em;
  outline: none;
  &:focus { border-color: #58a4f0;}
  margin-left: 2px;
`;

export default CaseReport;
