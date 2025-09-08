import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../../../Components/Navbar";
import AppTopNav from "../../../Components/TopNavbar";
import { BiSearch } from "react-icons/bi";
import { FiFilter, FiChevronRight } from "react-icons/fi";
import { RiEdit2Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSidebar } from "../../../Context/SidebarContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../../Components/ThemeToggle";

const CATEGORIES = [
  "All", "Biochemistry", "Haematology", "Serology & Immunology", "Clinical Pathology",
  "Cytology", "Microbiology", "Endocrinology", "Histopathology", "Others", "Miscellaneous"
];

const initialTests = [
  { id: "1", order: 1, name: "Serum Phosphorus", short: "", cat: "Biochemistry" },
  { id: "2", order: 2, name: "Serum Creatinine", short: "", cat: "Biochemistry" },
  { id: "3", order: 3, name: "Serum Urea", short: "", cat: "Biochemistry" },
  { id: "4", order: 4, name: "Fasting Blood Sugar", short: "", cat: "Biochemistry" },
  { id: "5", order: 5, name: "Blood Sugar PP", short: "", cat: "Haematology" },
  { id: "6", order: 6, name: "Blood Sugar PP", short: "", cat: "Biochemistry" },
  { id: "7", order: 7, name: "Blood Sugar PP", short: "", cat: "Biochemistry" },
  { id: "8", order: 8, name: "Blood Sugar PP", short: "", cat: "Biochemistry" },
  { id: "9", order: 9, name: "Blood Sugar PP", short: "", cat: "Biochemistry" },
];

const TestMaster = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showHelper, setShowHelper] = useState(false);
  const [tests, setTests] = useState(initialTests);
  const { sidebarExpanded } = useSidebar();
  const navigate = useNavigate();

  // Filter
  const filteredTests = tests
    .filter(
      t =>
        (selectedCategory === "All" || t.cat === selectedCategory) &&
        (search === "" || t.name.toLowerCase().includes(search.toLowerCase()))
    );

  // Drag & Drop Handler
  function handleDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(filteredTests); // Local filtered view
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    // Reconstruct new order for whole list, not just filtered
    const newOrderTests = [...tests];
    // Map old positions to new based on filteredTests' indices
    filteredTests.forEach((test, idx) => {
      const updated = items[idx];
      // Find in whole list and update order
      const findIndex = newOrderTests.findIndex(t => t.id === updated.id);
      if (findIndex !== -1) {
        newOrderTests[findIndex].order = idx + 1;
      }
    });
    // Sort main list by new order
    newOrderTests.sort((a, b) => a.order - b.order);
    setTests(newOrderTests);
  }

  return (
    <Page>
      <AppTopNav sidebarExpanded={sidebarExpanded}/>
      <Navbar />
      <Content $sidebarExpanded={sidebarExpanded}>
        <StickyBar>
          <BreadCrumb>
            <span className="muted">Test Panels</span>
            <FiChevronRight />
            <span className="active">Test Data</span>
          </BreadCrumb>
        </StickyBar>
        <Header>
          <Title>Test Data</Title>
        </Header>
        <BlueStrip>
          <b>Important:</b> It is required that your laboratory <a href="#">proofreads</a> and updates the provided reference range before using it for printing lab reports.
        </BlueStrip>
        <FilterBar>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FiFilter size={16} color="#377cfb" />
            <span style={{ fontWeight: 700, color: "#506fa7" }}>Filter by category:</span>
            <CategoryPillRow>
              {CATEGORIES.map(cat =>
                <CatPill
                  key={cat}
                  active={cat === selectedCategory}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </CatPill>
              )}
            </CategoryPillRow>
          </div>
          
        </FilterBar>
        <TableCard>
          <HelperOpener onClick={() => setShowHelper(v => !v)}>
            <span style={{ marginRight: 6 }}>?</span>
            How to reorder?
            <Arrow show={showHelper}>▼</Arrow>
          </HelperOpener>
          {showHelper && (
            <HelperBox>
              <ul>
                <li>Use the drag icon <span style={{fontWeight:700, color:"#b6b6b6"}}>⋮⋮</span> to move a test row up or down.</li>
                <li>Click and drag to re-arrange test order. Changes auto-update.</li>
                <li>Save to update display order on reports if needed.</li>
              </ul>
            </HelperBox>
          )}
          <TopCardRow>
            <SearchBox>
              <BiSearch style={{ color: "#acd0ea", fontSize: "15px" }} />
              <SearchInput
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search in page"
                autoFocus={false}
              />
            </SearchBox>
            <AddBtn>+ Add new Test</AddBtn>
          </TopCardRow>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tests-droppable" direction="vertical">
              {(provided) => (
                <Table ref={provided.innerRef} {...provided.droppableProps}>
                  <thead>
                    <tr>
                      <th style={{ width: 40, textAlign: "center" }}></th>
                      <th style={{ width: 70, textAlign: "center" }}>ORDER</th>
                      <th>NAME</th>
                      <th>CATEGORY</th>
                      <th>Tests</th>
                      <th style={{ width: 110 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((t, idx) => (
                      <Draggable draggableId={t.id} index={idx} key={t.id}>
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              background: snapshot.isDragging ? "#eaf2ff" : undefined
                            }}
                          >
                            <td
                              style={{
                                textAlign: "center",
                                color: "#bbc4c6",
                                fontSize: 15,
                                cursor: "grab"
                              }}
                              {...provided.dragHandleProps}
                            >
                              ⋮⋮
                            </td>
                            <td style={{ textAlign: "center", color: "#7b8bab", fontWeight: 600 }}>{t.order}.</td>
                            <td>{t.name}</td>
                            <td className="faint">{t.cat}</td>
                            <td className="faint">{t.short}</td>
                            <td>
                              <EditBtn onClick={() => navigate("/doctor_use/EditTestPanel")}>
                                <RiEdit2Line size={16} /> Edit
                              </EditBtn>
                              <ViewBtn>
                                <AiOutlineEye size={16} /> View
                              </ViewBtn>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {filteredTests.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", color: "#8a9bbd", fontSize: "0.98em", padding: 24 }}>No results</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Droppable>
          </DragDropContext>
        </TableCard>
      </Content>
    </Page>
  );
};
// ---- Styled Components ----

const Page = styled.div`
  background: ${({ theme }) => theme.bg};
  min-height: 100vh;
  font-size: 13px;
  color: ${({ theme }) => theme.text};
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Content = styled.div`
  // max-width: 1200px;
  margin: 0 auto;
  padding: 36px 30px 44px 30px;
  @media (max-width: 950px) {
    padding: 36px 10px;
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

const Header = styled.div`
  font-size: 1.22rem;
  font-weight: 700;
  margin-bottom: 7px;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.div`
  font-size: 1.28em;
  font-weight: 700;
`;

const BlueStrip = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#e7f3ff"};
  color: ${({ theme }) => theme.text};
  font-size: 0.96em;
  font-weight: 500;
  border-radius: 8px;
  padding: 10px 21px 10px 18px;
  margin-bottom: 19px;
  a { color: #377cfb; text-decoration: underline }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  border-radius: 10px;
  padding: 8px 22px;
  margin-bottom: 10px;
`;

const CategoryPillRow = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-left: 7px;
`;

const CatPill = styled.button`
  border: none;
  padding: 5px 13px;
  min-width: 68px;
  border-radius: 12px;
  font-size: 0.95em;
  font-weight: 600;
  color: ${p => p.active ? "#fff" : "#377cfb"};
  background: ${({ theme }) => (theme.isDark) ? theme.bg : p => p.active ? "#377cfb" : "#eaf3fe"}; 
  transition: background 0.18s,color 0.16s;
  cursor: pointer;

  &:hover {
    background: ${p => p.active ? "#377cfb" : "#ccdffe"};
  }
`;

const AddBtn = styled.button`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#377cfb"};
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 7px;
  padding: 6px 23px;
  font-size: 0.96em;
  cursor: pointer;
  box-shadow: 0 2px 6px #c6dafe22;
  margin-left: 14px;

  &:hover { background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#235bb9"}; }
`;

const TableCard = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
  border-radius: 14px;
  box-shadow: 0 2px 14px #d8e2f233;
  margin-top: 15px;
`;

const HelperOpener = styled.div`
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#5670a4"};
  font-size: 1em;
  font-weight: 600;
  padding: 12px 24px 4px 26px;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
`;

const Arrow = styled.span`
  font-size: 12px;
  margin-left: 8px;
  display: inline-block;
  transform: ${({ show }) => (show ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.18s;
`;

const HelperBox = styled.div`
  padding: 13px 26px 7px 37px;
  font-size: 0.98em;
  color: #687ca9;
  ul { margin: 0;}
  li { margin-bottom: 3px;}
`;

const TopCardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 26px 10px 24px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f4f8fe"};
  border-radius: 9px;
  border: 1.3px solid #e1e5f2;
  padding: 3px 10px;
  min-width: 195px;
`;

const SearchInput = styled.input`
  border: none;
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "transparent"};
  outline: none;
  font-size: 0.97em;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#3b4d67"};
  margin-left: 7px;
  min-width: 87px;
`;

const Tip = styled.div`
  font-size: 0.93em;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#668cd8"};
  font-weight: 500;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 0;
  border-collapse: separate;
  border-spacing: 0 5px;
  font-size: 13px;

  thead th {
    letter-spacing: 0.01em;
    font-size: 0.98em;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#7b8bab"};
    font-weight: 700;
    padding: 9px 0 8px 0;
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f6fafd"};
    text-align: left;
    border-bottom: 1.5px solid #e5eaf5;
  }
  tbody tr {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f7fafd"};
    border-radius: 7px;
    transition: background 0.17s;
    box-shadow: 0 0.5px 1px #c7e4ff11;
  }
  tbody tr:hover {
    background: ${({ theme }) => (theme.isDark) ? theme.brandSoft: "#eaf2ff"};
  }
  tbody td {
    font-size: 0.98em;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#2e3d5a"};
    border: none;
    padding: 10px 4px;
    .faint {
      color: #acb3c7;
    }
  }
`;

const EditBtn = styled.button`
  color: #3265e4;
  background: transparent;
  border: none;
  font-weight: 600;
  font-size: 0.98em;
  margin-right: 11px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 4px 5px;

  &:hover { color: #123d9c; background: #eaf1ff;}
`;
const ViewBtn = styled.button`
  color: #1ea19c;
  background: transparent;
  border: none;
  font-size: 0.98em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 4px 7px;

  &:hover { color: #168083; background: #e2f7fa;}
`;

export default TestMaster;
