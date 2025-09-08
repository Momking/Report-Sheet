import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../../../Components/Navbar";
import AppTopNav from "../../../Components/TopNavbar";
import { BiSearch } from "react-icons/bi";
import { RiEdit2Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { FiChevronRight } from "react-icons/fi";
import { useSidebar } from "../../../Context/SidebarContext";

const CATEGORIES = [
  "All", "Biochemistry", "Haematology", "Serology & Immunology",
  "Clinical Pathology", "Cytology", "Microbiology", "Endocrinology"
];
const TESTS = [
  "All", "Liver Function", "Renal Panel", "CBC", "Viral Panel", "Diabetic Profile"
];

// Mock subtests
const mockSubtests = [
  {
    subtest: "Sodium",
    category: "Biochemistry",
    usedIn: ["Renal Panel", "Liver Function"],
    active: true
  },
  {
    subtest: "Potassium",
    category: "Biochemistry",
    usedIn: ["Renal Panel"],
    active: false
  },
  {
    subtest: "HIV Antibody",
    category: "Serology & Immunology",
    usedIn: ["Viral Panel"],
    active: true
  },
  {
    subtest: "Platelet Count",
    category: "Haematology",
    usedIn: ["CBC"],
    active: true
  }
];

const SubtestsCategories = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [usedInTest, setUsedInTest] = useState("All");
  const [selected, setSelected] = useState(null);
  const { sidebarExpanded } = useSidebar();

  const filtered = mockSubtests.filter(
    s =>
      (category === "All" || s.category === category) &&
      (usedInTest === "All" || s.usedIn.includes(usedInTest)) &&
      (search === "" || s.subtest.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Page>
      <AppTopNav sidebarExpanded={sidebarExpanded}/>
      <Navbar />
      <Container $sidebarExpanded={sidebarExpanded}>
        <StickyBar>
          <BreadCrumb>
            <span className="muted">Test Panels</span>
            <FiChevronRight />
            <span className="active">Test SubCategories</span>
          </BreadCrumb>
        </StickyBar>
        <HeaderRow>
          <Title>Subtests</Title>
          <AddBtn>+ Add new subtest</AddBtn>
        </HeaderRow>

        <Card>
          <FiltersRow>
            <Select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select value={usedInTest} onChange={e => setUsedInTest(e.target.value)}>
              {TESTS.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <SearchBox>
              <SearchInput
                type="text"
                placeholder="Search subtest..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </SearchBox>
          </FiltersRow>
          
          <Table>
            <thead>
              <tr>
                <th style={{width:"60px", paddingLeft: "1.5vw"}}>#</th>
                <th>Subtest Name</th>
                <th>Category</th>
                <th>Used In Test(s)</th>
                <th style={{textAlign:"center",width:"70px"}}>Active</th>
                <th style={{width:"120px"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((s, idx) => (
                <tr key={s.subtest}
                  style={{
                    background: selected === s.subtest ? ({ theme }) => (theme.isDark) ? theme.brandSoft: "#e6efff" : undefined,
                    opacity: s.active ? 1 : 0.6
                  }}
                  onClick={()=>setSelected(s.subtest)}
                >
                  <td style={{ textAlign: "center" }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600, fontSize: ".96em" }}>
                    {s.subtest}
                  </td>
                  <td className="faint">{s.category}</td>
                  <td>
                    {s.usedIn.map(t=>(
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </td>
                  <td style={{ textAlign:"center" }}>
                    {s.active
                      ? <IoMdCheckmarkCircle color="#3fd470" size={18} title="Active" />
                      : <IoMdCloseCircle color="#f77d7d" size={18} title="Inactive" />
                    }
                  </td>
                  <td>
                    <EditBtn><RiEdit2Line size={15} /> Edit</EditBtn>
                    <ViewBtn><AiOutlineEye size={15} /> View</ViewBtn>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{textAlign:"center",color: "#8b9bbd", fontSize: "0.98em", padding: 20}}>
                    No subtests found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Container>
    </Page>
  );
};

// ---- Styled Components ----

const Page = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f7fafd"};
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
`;

const Container = styled.div`
//   max-width: 880px;
  margin: 0 auto;
  padding: 44px 0 38px 0;

  flex: 1;
  min-width: 0;
  padding: 78px 316px 20px ${({ $sidebarExpanded }) => ($sidebarExpanded ? "225px" : "76px")};
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
    font-weight: 800;
  }

  svg {
    color: ${({ theme }) => theme.textSoft};
    font-size: 1.1em;
  }
`;

const RightTools = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 1.07rem;
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#295986"};
  margin-bottom: 2px;
`;

const AddBtn = styled.button`
  font-size: 0.95em;
  font-weight: 700;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#377cfb"};
  border-radius: 7px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#fff"};
  border: none;
  padding: 6px 18px;
  cursor: pointer;
  box-shadow: 0 2px 6px #c6dafe22;
  &:hover { background: #235bb9; }
`;

const Card = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  border-radius: 15px;
  box-shadow: 0 2px 14px #d8e2f233;
  margin-top: 10px;
  padding: 17px 0 0 0;
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 28px 12px 26px;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 7px;
  }
`;
const Select = styled.select`
  border-radius: 7px;
  border: 1.5px solid #cee0f7;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f4f8ff"};
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#3662a9"};
  padding: 7px 17px;
  font-size: 0.97em;
  font-weight: 600;
  outline: none;
  &:focus { border-color: #7babef; }
`;

const SearchBox = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f4f8fe"};
  border-radius: 9px;
  border: 1.3px solid #e1e5f2;
  padding: 5px 13px;
  min-width: 130px;
`;

const SearchInput = styled.input`
  border: none;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "transparent"};
  outline: none;
  font-size: 0.96em;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#4761a6"};
  min-width: 85px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 0;
  border-collapse: separate;
  border-spacing: 0 4px;
  font-size: 13px;
  thead th {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f6fafd"};
    text-align: left;
    font-size: 0.955em;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#7b8bab"};
    font-weight: 700;
    padding: 8px 0 6px 0;
    border-bottom: 1.3px solid #e5eaf5;
  }
  tbody tr {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f7fafd"};
    border-radius: 7px;
    transition: background 0.16s;
    box-shadow: 0 0.5px 1px #c7e4ff11;
    cursor: pointer;
  }
  tbody tr:hover {
    background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#eaf2ff"};
  }
  tbody td {
    font-size: 0.95em;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#35508c"};
    border: none;
    padding: 8px 6px;
  }
`;

const Badge = styled.span`
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#e9f3ff"};
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#346db2"};
  font-weight: 700;
  font-size: 0.93em;
  border-radius: 13px;
  padding: 3px 10px;
  margin-right: 6px;
  display: inline-block;
  margin-bottom: 2px;
`;

const EditBtn = styled.button`
  color: #3265e4;
  background: transparent;
  border: none;
  font-weight: 600;
  font-size: 0.96em;
  margin-right: 7px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 4px 4px;
  &:hover { color: #123d9c; background: #eaf1ff;}
`;
const ViewBtn = styled.button`
  color: #1ea19c;
  background: transparent;
  border: none;
  font-size: 0.96em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 4px 6px;
  &:hover { color: #168083; background: #e2f7fa;}
`;

export default SubtestsCategories;
