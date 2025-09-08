import React, { useState, useMemo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import AppTopNav from "../../../Components/TopNavbar";
import Navbar from "../../../Components/Navbar";
import { useSidebar } from "../../../Context/SidebarContext";
import { FiChevronRight, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => (theme.isDark) ? theme.bg: "#fff"};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
  }
`;

const genders = ["Male", "Female", "Other"];
const statuses = ["Active", "Discharged", "Critical"];
const mockCategories = ["Serum Phosphorus", "Serum Creatinine", "Serum Urea", "Fasting Blood Sugar", "Blood Sugar PP"];
const mockLocations = [
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Chennai", state: "Tamil Nadu" },
];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = [2024, 2025, 2026];

const mockGlobalData = [
  { city: "Mumbai", state: "Maharashtra", category: "Serum Phosphorus", cases: 210, month: "January", year: 2025, gender: "Male", age: 52, date: "2025-01-20", status: "Active" },
  { city: "Delhi", state: "Delhi", category: "Serum Creatinine", cases: 130, month: "February", year: 2025, gender: "Female", age: 61, date: "2025-02-11", status: "Discharged" },
  { city: "Kolkata", state: "West Bengal", category: "Serum Urea", cases: 90, month: "March", year: 2025, gender: "Male", age: 45, date: "2025-03-10", status: "Active" },
  { city: "Chennai", state: "Tamil Nadu", category: "Fasting Blood Sugar", cases: 150, month: "January", year: 2025, gender: "Other", age: 28, date: "2025-01-15", status: "Critical" },
  { city: "Bangalore", state: "Karnataka", category: "Blood Sugar PP", cases: 175, month: "March", year: 2025, gender: "Female", age: 36, date: "2025-03-22", status: "Active" },
];

const COLORS = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc948"];

function getAverage(arr) {
  if (!arr.length) return 0;
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

const TotalCasesReported = () => {
  const { sidebarExpanded } = useSidebar();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [ageRange, setAgeRange] = useState([0, 100]);

  const filtered = mockGlobalData.filter((d) => {
    return (
      (selectedCategory === "All" || d.category === selectedCategory) &&
      (selectedCity === "All" || d.city === selectedCity) &&
      (selectedMonth === "All" || d.month === selectedMonth) &&
      (selectedYear === "All" || d.year === selectedYear) &&
      (selectedGender === "All" || d.gender === selectedGender) &&
      (selectedStatus === "All" || d.status === selectedStatus) &&
      d.age >= ageRange[0] &&
      d.age <= ageRange[1]
    );
  });

  const prevMonthCases = 300; // Mock value
  const currentCases = filtered.reduce((sum, d) => sum + d.cases, 0);
  const trendUp = currentCases > prevMonthCases;

  // ✅ Analytics Data for Charts
  const genderData = useMemo(() => {
    const counts = genders.map((g) => ({
      name: g,
      value: filtered.filter((d) => d.gender === g).reduce((sum, d) => sum + d.cases, 0),
    }));
    return counts.filter((d) => d.value > 0);
  }, [filtered]);

  const statusData = useMemo(() => {
    return statuses.map((s) => ({
      name: s,
      value: filtered.filter((d) => d.status === s).reduce((sum, d) => sum + d.cases, 0),
    })).filter((d) => d.value > 0);
  }, [filtered]);

  const ageGroupData = useMemo(() => {
    const groups = [
      { range: "0-18", min: 0, max: 18 },
      { range: "19-35", min: 19, max: 35 },
      { range: "36-60", min: 36, max: 60 },
      { range: "60+", min: 61, max: 120 },
    ];
    return groups.map((g) => ({
      name: g.range,
      value: filtered.filter((d) => d.age >= g.min && d.age <= g.max).reduce((sum, d) => sum + d.cases, 0),
    })).filter((d) => d.value > 0);
  }, [filtered]);

  const categoryData = useMemo(() => {
    return mockCategories.map((c) => ({
      name: c,
      value: filtered.filter((d) => d.category === c).reduce((sum, d) => sum + d.cases, 0),
    })).filter((d) => d.value > 0);
  }, [filtered]);

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
              <span className="active">Global Cases Report</span>
            </BreadCrumb>
          </StickyBar>

          <Header>
            <Title>Global Cases Report</Title>
            <SectionLabel>Overall cases data, trends & analytics</SectionLabel>
          </Header>

          {/* Filters */}
          <FilterBar>
            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option>All</option>
              {mockCategories.map((cat) => (<option key={cat}>{cat}</option>))}
            </Select>
            <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              <option>All</option>
              {mockLocations.map((loc) => (<option key={loc.city}>{loc.city}</option>))}
            </Select>
            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option>All</option>
              {months.map((m) => (<option key={m}>{m}</option>))}
            </Select>
            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option>All</option>
              {years.map((y) => (<option key={y}>{y}</option>))}
            </Select>
            <Select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
              <option>All</option>
              {genders.map((g) => (<option key={g}>{g}</option>))}
            </Select>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option>All</option>
              {statuses.map((s) => (<option key={s}>{s}</option>))}
            </Select>
            <AgeInput type="number" min={0} max={100} placeholder="Min Age" value={ageRange[0]} onChange={e => setAgeRange([Math.max(0, +e.target.value), ageRange[1]])} />
            <AgeInput type="number" min={0} max={100} placeholder="Max Age" value={ageRange[1]} onChange={e => setAgeRange([ageRange[0], Math.max(ageRange[0], +e.target.value)])} />
          </FilterBar>

          {/* Stat Cards */}
          <StatCards>
            <InsightCard>
              <h4>Total Cases</h4>
              <StatValue>
                {currentCases}
                <TrendIcon trendUp={trendUp}>{trendUp ? <FiTrendingUp /> : <FiTrendingDown />}</TrendIcon>
              </StatValue>
              <MiniLabel>vs last month: {prevMonthCases}</MiniLabel>
            </InsightCard>
            <InsightCard>
              <h4>Avg Age</h4>
              <StatValue>{filtered.length === 0 ? "-" : getAverage(filtered.map(d => d.age))}</StatValue>
              <MiniLabel>years</MiniLabel>
            </InsightCard>
            <InsightCard>
              <h4>Active Status</h4>
              <StatValue>{filtered.filter(d => d.status === "Active").length}</StatValue>
              <MiniLabel>Currently Active</MiniLabel>
            </InsightCard>
          </StatCards>

          {/* ✅ Charts for Analytics */}
          <AnalyticsSection>
            <ChartCard>
              <h4>Gender Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={90}>
                    {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard>
              <h4>Status Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard>
              <h4>Age Group Cases</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageGroupData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4e79a7" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard>
              <h4>Category-wise Cases</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#f28e2c" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </AnalyticsSection>

          {/* Table */}
          <Card>
            {filtered.length > 0 ? (
              <ResultTable>
                <thead>
                  <tr>
                    <th>City</th>
                    <th>State</th>
                    <th>Category</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Cases</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => (
                    <tr key={i}>
                      <td>{d.city}</td>
                      <td>{d.state}</td>
                      <td>{d.category}</td>
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

const AnalyticsSection = styled.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
    gap: 20px; margin: 20px 0;`
;

const ChartCard = styled.div`
    background: #fff; 
    border-radius: 12px; 
    padding: 16px; 
    box-shadow: 0 2px 10px #dde7f888; 
    text-align: center; 
    h4 { margin-bottom: 12px; color: #3261b1; font-size: 1em;}`
;

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

export default TotalCasesReported;
