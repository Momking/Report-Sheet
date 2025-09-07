import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../../../Components/Navbar";
import AppTopNav from "../../../Components/TopNavbar";
import { useSidebar } from "../../../Context/SidebarContext";

import {
  FiSun,
  FiMoon,
  FiChevronRight,
  FiX,
  FiTrash2,
  FiPlusCircle,
  FiMoreVertical,
  FiSave,
  FiRotateCcw,
} from "react-icons/fi";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

// -------------------- Data --------------------
const CATEGORY_OPTIONS = [
  "Biochemistry",
  "Haematology",
  "Serology & Immunology",
  "Clinical Pathology",
  "Cytology",
  "Microbiology",
  "Endocrinology",
  "Histopathology",
  "Others",
  "Miscellaneous",
];

const ALL_TESTS = [
  "Hemoglobin",
  "Total Leukocyte Count",
  "Differential Leucocyte Count",
  "Platelet Count",
  "Total RBC Count",
  "Hematocrit Value, Hct",
  "Mean Corpuscular Volume, MCV",
  "Mean Cell Haemoglobin, MCH",
  "Mean Cell Haemoglobin CON, MCHC",
  "Mean Platelet Volume, MPV",
  "P-LCR",
  "R.D.W - CV",
  "P.D.W.",
  "R.D.W - SD",
  // Feel free to add more…
];

const defaultPanel = {
  name: "Complete Blood Count (CBC)",
  category: "Haematology",
  tests: [
    "Hemoglobin",
    "Total Leukocyte Count",
    "Differential Leucocyte Count",
    "Platelet Count",
    "Total RBC Count",
    "Hematocrit Value, Hct",
    "Mean Corpuscular Volume, MCV",
    "Mean Cell Haemoglobin, MCH",
    "Mean Cell Haemoglobin CON, MCHC",
    "Mean Platelet Volume, MPV",
    "P-LCR",
    "R.D.W - CV",
    "P.D.W.",
    "R.D.W - SD",
  ],
  hideInterpretation: true,
  hideMethod: false,
};

// -------------------- Theme --------------------
// const lightTheme = {
//   mode: "light",
//   bg: "#f6f9fc",
//   card: "#ffffff",
//   soft: "#eff4ff",
//   text: "#1f2a44",
//   textSoft: "#6a7ba0",
//   brand: "#377cfb",
//   brandSoft: "#e8f0ff",
//   border: "#d7e3ff",
//   shadow: "rgba(32, 72, 125, 0.12)",
//   inputBg: "#f7faff",
// };

// const darkTheme = {
//   mode: "dark",
//   bg: "#0f172a",
//   card: "#111827",
//   soft: "#0b1222",
//   text: "#e6eefc",
//   textSoft: "#9fb1db",
//   brand: "#6ea8ff",
//   brandSoft: "#17223a",
//   border: "#1f2d4a",
//   shadow: "rgba(9, 20, 40, 0.6)",
//   inputBg: "#0b1324",
// };

const Global = createGlobalStyle`
  :root { color-scheme: ${({ theme }) => (theme.mode === "dark" ? "dark" : "light")}; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 13px; /* compact & sharp */
  }
  ::selection {
    background: ${({ theme }) => theme.brandSoft};
  }
`;

// -------------------- Component --------------------
const EditTestPanel = () => {
  const { sidebarExpanded } = useSidebar();

  // Theming
  // const [themeMode, setThemeMode] = useState(
  //   () => localStorage.getItem("themeMode") || "light"
  // );
  // useEffect(() => {
  //   localStorage.setItem("themeMode", themeMode);
  // }, [themeMode]);
  // const theme = themeMode === "dark" ? theme.darkTheme : theme.lightTheme;

  // Form state
  const [form, setForm] = useState(defaultPanel);
  const [dirty, setDirty] = useState(false);

  // Autocomplete
  const [testInput, setTestInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSugIndex, setActiveSugIndex] = useState(-1);
  const suggestBoxRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Live preview expand
  const [showPreview, setShowPreview] = useState(true);

  // Derived
  const availableTests = useMemo(
    () =>
      ALL_TESTS.filter(
        (t) => !form.tests.includes(t) // exclude already added
      ),
    [form.tests]
  );

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  function handleCheckbox(field) {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
    setDirty(true);
  }

  // Autocomplete filtering
  function handleTestInput(e) {
    const val = e.target.value;
    setTestInput(val);
    setActiveSugIndex(-1);

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = availableTests
      .filter((t) => t.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 8);
    setSuggestions(filtered);
  }

  function addTest(test) {
    if (!test) return;
    if (!form.tests.includes(test)) {
      setForm((prev) => ({ ...prev, tests: [...prev.tests, test] }));
      setDirty(true);
    }
    setTestInput("");
    setSuggestions([]);
    setActiveSugIndex(-1);
    inputRef.current?.focus();
  }

  function removeTest(test) {
    setForm((prev) => ({
      ...prev,
      tests: prev.tests.filter((t) => t !== test),
    }));
    setDirty(true);
  }

  // Clear all tests
  function clearAll() {
    if (window.confirm("Remove all tests from this panel?")) {
      setForm((prev) => ({ ...prev, tests: [] }));
      setDirty(true);
    }
  }

  // Cancel (revert)
  function cancelChanges() {
    if (!dirty || window.confirm("Discard unsaved changes?")) {
      setForm(defaultPanel);
      setTestInput("");
      setSuggestions([]);
      setActiveSugIndex(-1);
      setDirty(false);
    }
  }

  // Save
  function handleSubmit(e) {
    e.preventDefault();
    // TODO: Integrate with backend
    alert("Panel saved!");
    setDirty(false);
  }

  // Keyboard navigation in suggestions
  function handleInputKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSugIndex((i) =>
        Math.min(i + 1, Math.max(0, suggestions.length - 1))
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSugIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSugIndex >= 0 && suggestions[activeSugIndex]) {
        addTest(suggestions[activeSugIndex]);
      } else {
        // Add typed value only if it's an exact match from ALL_TESTS and not already present
        const typed = ALL_TESTS.find(
          (t) => t.toLowerCase() === testInput.trim().toLowerCase()
        );
        if (typed && !form.tests.includes(typed)) {
          addTest(typed);
        }
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveSugIndex(-1);
    } else if (e.key === "Backspace" && !testInput) {
      // remove last tag quickly
      const last = form.tests[form.tests.length - 1];
      if (last) removeTest(last);
    }
  }

  // DnD reorder
  function onDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(form.tests);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setForm((prev) => ({ ...prev, tests: items }));
    setDirty(true);
  }

  return (
    <div>
      <Global />
      <Page>
        <AppTopNav sidebarExpanded={sidebarExpanded} />
        <Navbar />

        <Content $sidebarExpanded={sidebarExpanded}>
          <StickyBar>
            <BreadCrumb>
              <span onClick={() => {navigate("/doctor_use/TestMaster")}} style={{cursor: "pointer"}} className="muted">Test Panels</span>
              <FiChevronRight />
              <span className="muted">{defaultPanel.name}</span>
              <FiChevronRight />
              <span className="active">Edit</span>
            </BreadCrumb>
          </StickyBar>

          <Layout>
            <MainCol as="form" onSubmit={handleSubmit}>
              <EditCard>
                <HeaderRow>
                  <Header>Edit test panel</Header>
                </HeaderRow>

                <Grid2>
                  <div>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      autoFocus
                      placeholder="Enter panel name"
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      required
                    >
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </div>
                </Grid2>

                <Switches>
                  <CheckItem>
                    <input
                      id="hideInterp"
                      type="checkbox"
                      checked={form.hideInterpretation}
                      onChange={() => handleCheckbox("hideInterpretation")}
                    />
                    <label htmlFor="hideInterp">
                      Hide individual test interpretation, notes, comments from
                      report.
                    </label>
                  </CheckItem>

                  <CheckItem>
                    <input
                      id="hideMethod"
                      type="checkbox"
                      checked={form.hideMethod}
                      onChange={() => handleCheckbox("hideMethod")}
                    />
                    <label htmlFor="hideMethod">
                      Hide individual test method and instrument from report.
                    </label>
                  </CheckItem>
                </Switches>

                <Label>Tests</Label>
                <TagInputWrap>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="tests" direction="horizontal">
                      {(provided) => (
                        <TagsRow
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {form.tests.map((t, idx) => (
                            <Draggable key={t} draggableId={t} index={idx}>
                              {(p, snapshot) => (
                                <Tag
                                  ref={p.innerRef}
                                  {...p.draggableProps}
                                  $dragging={snapshot.isDragging}
                                >
                                  <DragHandle {...p.dragHandleProps}>
                                    <FiMoreVertical />
                                  </DragHandle>
                                  <TagText title={t}>{t}</TagText>
                                  <TagRemove
                                    type="button"
                                    title="Remove"
                                    onClick={() => removeTest(t)}
                                  >
                                    <FiX />
                                  </TagRemove>
                                </Tag>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </TagsRow>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <TagInputRow>
                    <TagInputIcon>
                      <FiPlusCircle />
                    </TagInputIcon>
                    <TagInput
                      ref={inputRef}
                      type="text"
                      value={testInput}
                      onChange={handleTestInput}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Type to search & press Enter to add…"
                      aria-label="Add test"
                    />
                    {testInput && (
                      <InlineClear
                        type="button"
                        onClick={() => {
                          setTestInput("");
                          setSuggestions([]);
                          setActiveSugIndex(-1);
                          inputRef.current?.focus();
                        }}
                        title="Clear"
                      >
                        <FiX />
                      </InlineClear>
                    )}
                  </TagInputRow>

                  {suggestions.length > 0 && (
                    <SuggestBox ref={suggestBoxRef}>
                      {suggestions.map((s, i) => (
                        <SuggestItem
                          key={s}
                          $active={i === activeSugIndex}
                          onMouseEnter={() => setActiveSugIndex(i)}
                          onMouseDown={(e) => {
                            // avoid input blur before click
                            e.preventDefault();
                            addTest(s);
                          }}
                        >
                          {s}
                        </SuggestItem>
                      ))}
                    </SuggestBox>
                  )}
                </TagInputWrap>

                <Tip>
                  Search by typing the **full test name** if short name doesn’t
                  match. Use <kbd>↑</kbd>/<kbd>↓</kbd> and <kbd>Enter</kbd> to pick
                  suggestions. Press <kbd>Backspace</kbd> to quickly remove last
                  test.
                </Tip>

                <ActionsBar>
                  <LeftActions>
                    <DangerGhost type="button" onClick={clearAll} title="Clear all tests">
                      <FiTrash2 />
                      Clear all
                    </DangerGhost>
                  </LeftActions>

                  <RightActions>
                    <Ghost type="button" onClick={cancelChanges} title="Discard changes">
                      <FiRotateCcw />
                      Cancel
                    </Ghost>
                    <Primary type="submit" title="Save panel">
                      <FiSave />
                      Save
                    </Primary>
                  </RightActions>
                </ActionsBar>
              </EditCard>
            </MainCol>

            <AsideCol>
              <PreviewCard>
                <PreviewHeader onClick={() => setShowPreview((v) => !v)}>
                  <h4>Live Preview</h4>
                  <PreviewToggle $open={showPreview}>
                    <FiChevronRight />
                  </PreviewToggle>
                </PreviewHeader>

                {showPreview && (
                  <PreviewBody>
                    <Row>
                      <LabelSm>Panel Name</LabelSm>
                      <Value>{form.name || "—"}</Value>
                    </Row>

                    <Row>
                      <LabelSm>Category</LabelSm>
                      <Value>{form.category}</Value>
                    </Row>

                    <Row>
                      <LabelSm>Visibility</LabelSm>
                      <Value>
                        {form.hideInterpretation ? "Interpretation Hidden" : "Interpretation Shown"}
                        {" • "}
                        {form.hideMethod ? "Method Hidden" : "Method Shown"}
                      </Value>
                    </Row>

                    <Divider />

                    <TestsList>
                      <ListHeader>
                        Tests ({form.tests.length})
                      </ListHeader>
                      {form.tests.length ? (
                        <ol>
                          {form.tests.map((t) => (
                            <li key={t} title={t}>{t}</li>
                          ))}
                        </ol>
                      ) : (
                        <EmptyState>— No tests added —</EmptyState>
                      )}
                    </TestsList>
                  </PreviewBody>
                )}
              </PreviewCard>
            </AsideCol>
          </Layout>
        </Content>
      </Page>
    </div>
  );
};

// -------------------- Styled --------------------
const Page = styled.div`
  min-height: 100vh;
`;

const Content = styled.div`
  margin: 0 auto;
  padding: 88px 36px 24px
    ${({ $sidebarExpanded }) => ($sidebarExpanded ? "225px" : "76px")};
  transition: padding-left 0.18s cubic-bezier(.61,-0.01,.51,.99);

  @media (max-width: 1100px) {
    padding-left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "80px" : "41px")};
    padding-right: 16px;
  }

  @media (max-width: 700px) {
    padding-left: 2vw;
    padding-right: 2vw;
  }
`;

const StickyBar = styled.div`
  position: sticky;
  top: 58px; /* below your navs */
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

  svg {
    color: ${({ theme }) => theme.textSoft};
    font-size: 1.1em;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(520px, 1.2fr) minmax(280px, 0.8fr);
  gap: 22px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const MainCol = styled.div`
  min-width: 0;
`;

const AsideCol = styled.aside`
  min-width: 0;
`;

const EditCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  box-shadow: 0 10px 30px ${({ theme }) => theme.shadow};
  padding: 18px 18px 16px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.h1`
  font-size: 1.05rem;
  font-weight: 800;
  margin: 6px 0 2px;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  margin-top: 10px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.9em;
  font-weight: 700;
  color: ${({ theme }) => theme.textSoft};
  margin: 8px 0 6px;
`;

const LabelSm = styled(Label)`
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 0.85em;
`;

const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.95em;
  outline: none;
  transition: 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.brand};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brandSoft};
  }
`;

const Select = styled.select`
  width: 100%;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.95em;
  outline: none;
  transition: 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.brand};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brandSoft};
  }
`;

const Switches = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin: 8px 0 10px;
`;

const CheckItem = styled.div`
  display: flex;
  align-items: start;
  gap: 10px;

  input[type="checkbox"] {
    margin-top: 2px;
    accent-color: ${({ theme }) => theme.brand};
    cursor: pointer;
  }
  label {
    cursor: pointer;
    color: ${({ theme }) => theme.textSoft};
    font-weight: 600;
    line-height: 1.35;
  }
`;

const TagInputWrap = styled.div`
  position: relative;
  background: ${({ theme }) => theme.soft};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 12px;
  margin-top: 4px;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 38px;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.isDark ? "#0f203f" : "#e9f1ff"};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  padding: 6px 8px 6px 6px;
  box-shadow: ${({ $dragging, theme }) =>
    $dragging ? `0 10px 24px ${theme.shadow}` : "none"};
  transition: box-shadow .15s ease, transform .15s ease;
`;

const DragHandle = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.textSoft};
  display: inline-flex;
  align-items: center;
  cursor: grab;
  padding: 0 2px;
`;

const TagText = styled.span`
  max-width: 240px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 600;
  font-size: 0.92em;
`;

const TagRemove = styled.button`
  border: none;
  background: transparent;
  color: #f05e5e;
  border-left: 1px solid ${({ theme }) => theme.border};
  padding-left: 6px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }
`;

const TagInputRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 8px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 6px 10px;
`;

const TagInputIcon = styled.div`
  color: ${({ theme }) => theme.brand};
  display: inline-flex;
  align-items: center;
  font-size: 1.05rem;
`;

const TagInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 0.95em;
  flex: 1;
  padding: 6px 2px;
`;

const InlineClear = styled.button`
  border: none;
  background: ${({ theme }) => theme.brandSoft};
  color: ${({ theme }) => theme.text};
  border-radius: 6px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const SuggestBox = styled.div`
  position: absolute;
  left: 12px;
  right: 12px;
  top: 100%;
  margin-top: 8px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  box-shadow: 0 12px 32px ${({ theme }) => theme.shadow};
  overflow: hidden;
  z-index: 20;
`;

const SuggestItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  background: ${({ $active, theme }) => ($active ? theme.brandSoft : "transparent")};

  &:hover {
    background: ${({ theme }) => theme.brandSoft};
  }
`;

const Tip = styled.p`
  color: ${({ theme }) => theme.textSoft};
  font-size: 0.9em;
  margin: 8px 2px 2px;
  kbd {
    background: ${({ theme }) => theme.card};
    border: 1px solid ${({ theme }) => theme.border};
    border-bottom-width: 2px;
    border-radius: 6px;
    padding: 1px 5px;
    font-weight: 700;
  }
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  gap: 8px;
`;

const LeftActions = styled.div`
  display: inline-flex;
  gap: 8px;
`;

const RightActions = styled.div`
  display: inline-flex;
  gap: 8px;
`;

const Btn = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 800;
  font-size: 0.92em;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: .15s ease;
  box-shadow: 0 8px 20px ${({ theme }) => theme.shadow};

  &:hover {
    border-color: ${({ theme }) => theme.brand};
    background: ${({ theme }) => theme.brandSoft};
  }
`;

const Ghost = styled(Btn)``;

const DangerGhost = styled(Btn)`
  color: #f05e5e;
  border-color: #f05e5e33;

  &:hover {
    background: #f05e5e22;
    border-color: #f05e5e66;
  }
`;

const Primary = styled(Btn)`
  background: ${({ theme }) => theme.brand};
  color: #fff;
  border-color: transparent;

  &:hover {
    filter: brightness(0.95);
  }
`;

const PreviewCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  box-shadow: 0 10px 30px ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.brandSoft};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;

  h4 {
    margin: 0;
    font-size: 0.98rem;
    font-weight: 800;
  }
`;

const PreviewToggle = styled.div`
  display: inline-flex;
  transform: rotate(${({ $open }) => ($open ? "90deg" : "0deg")});
  transition: transform .18s ease;
`;

const PreviewBody = styled.div`
  padding: 12px 14px 16px;
`;

const Row = styled.div`
  margin: 8px 0;
`;

const Value = styled.div`
  font-weight: 800;
  font-size: 0.98em;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed ${({ theme }) => theme.border};
  margin: 10px 0 12px;
`;

const TestsList = styled.div`
  ol {
    margin: 8px 0 0 1.2em;
    padding: 0;
    display: grid;
    gap: 6px;
  }
  li {
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ListHeader = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #34508b;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmptyState = styled.div`
  color: ${({ theme }) => theme.textSoft};
  font-weight: 700;
  text-align: center;
  padding: 18px 8px;
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.soft};
`;

export default EditTestPanel;
