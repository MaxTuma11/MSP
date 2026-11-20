import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import Searchbar from "../../../src/components/searchbar/Searchbar.jsx";

// Deliberately small, hand-crafted fixtures rather than the real data files —
// real manifesto text changes over time and would make these tests brittle.
// Note: "Restore UK" is intentionally OMITTED here even though it appears in
// the component's hardcoded `parties` dropdown list, to mirror a real risk:
// the dropdown list and the JSON data are two separate sources of truth that
// can drift out of sync.
vi.mock("../../../src/data/summarised_manifestos.json", () => ({
  default: {
    "Labour Party": {
      "entire manifesto": "Labour entire manifesto summary.",
      "economy": "Labour economy summary.",
    },
    "Conservative and Unionist Party": {
      "entire manifesto": "Conservative entire manifesto summary.",
      // "economy" deliberately missing, to trigger the "Topic not found" path
    },
  },
}));

vi.mock("../../../src/data/summarised_manifestos_detail.json", () => ({
  default: {
    "Labour Party": {
      "entire manifesto": "Labour DETAILED entire manifesto summary.",
    },
  },
}));

// Mock the formatting helper so these tests are about Searchbar's own logic,
// not about how manifesto_layout happens to render headings/lists/etc —
// that belongs in text_format's own test file.
vi.mock("../../../src/components/searchbar/text_format.jsx", () => ({
  manifesto_layout: text => [{ type: "paragraph", text }],
}));

// Helper: selects are unlabeled, so we rely on consistent DOM order:
// [party select, (party-two select if compare mode is on), topic select]
function getSelects() {
  return screen.getAllByRole("combobox");
}

function clickSearch(container) {
  fireEvent.click(container.querySelector(".search-icon-holder"));
}

// The component hides its (already-computed) result behind an artificial
// 2-4 second setTimeout before flipping `loading` to false. Fake timers let
// us skip that wait instead of slowing the test suite down for no reason.
function finishLoading() {
  act(() => {
    vi.advanceTimersByTime(4000); // covers the full 2000-4000ms random range
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Searchbar - initial render", () => {
  it("shows the party and topic dropdowns, but not a second party dropdown", () => {
    render(<Searchbar />);

    expect(screen.getByDisplayValue("Select Party")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Select Topic")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Select Party Two")).not.toBeInTheDocument();
  });

  it("does not show the help popup by default", () => {
    render(<Searchbar />);
    expect(screen.queryByText(/How to Use the Searchbar/i)).not.toBeInTheDocument();
  });

  it("shows no result section before a search is run", () => {
    render(<Searchbar />);
    expect(screen.queryByText(/summary/i)).not.toBeInTheDocument();
  });
});

describe("Searchbar - help popup", () => {
  it("toggles the help popup open and closed", () => {
    const { container } = render(<Searchbar />);

    fireEvent.click(container.querySelector(".help-button-desktop"));
    expect(screen.getByText(/How to Use the Searchbar/i)).toBeInTheDocument();

    fireEvent.click(container.querySelector(".close-button"));
    expect(screen.queryByText(/How to Use the Searchbar/i)).not.toBeInTheDocument();
  });
});

describe("Searchbar - compare mode toggle", () => {
  it("reveals a second party dropdown when compare mode is switched on", () => {
    render(<Searchbar />);

    expect(getSelects()).toHaveLength(2); // party, topic

    fireEvent.click(screen.getByRole("switch", { name: /Compare Summaries/i }));

    expect(getSelects()).toHaveLength(3); // party, party-two, topic
    expect(screen.getByDisplayValue("Select Party Two")).toBeInTheDocument();
  });
});

describe("Searchbar - fetching a summary (happy path)", () => {
  it("shows a loading state immediately, then the result once loading finishes", () => {
    const { container } = render(<Searchbar />);
    const [partySelect, topicSelect] = getSelects();

    fireEvent.change(partySelect, { target: { value: "Labour Party" } });
    fireEvent.change(topicSelect, { target: { value: "Entire Manifesto" } });
    clickSearch(container);

    expect(screen.getByText(/Summarising Manifesto/i)).toBeInTheDocument();
    expect(screen.queryByText("Labour entire manifesto summary.")).not.toBeInTheDocument();

    finishLoading();

    expect(screen.queryByText(/Summarising Manifesto/i)).not.toBeInTheDocument();
    expect(screen.getByText("Labour entire manifesto summary.")).toBeInTheDocument();
    expect(screen.getByText("Entire Manifesto: Labour Party")).toBeInTheDocument();
  });
});

describe("Searchbar - error states", () => {
  it('shows "Party not found" for a party missing from the data (dropdown/data mismatch)', () => {
    const { container } = render(<Searchbar />);
    const [partySelect, topicSelect] = getSelects();

    // "Restore UK" is a valid dropdown option but absent from our mocked data,
    // exactly the drift scenario flagged in the fixture comment above.
    fireEvent.change(partySelect, { target: { value: "Restore UK" } });
    fireEvent.change(topicSelect, { target: { value: "Entire Manifesto" } });
    clickSearch(container);
    finishLoading();

    expect(screen.getByText(/Party not found/i)).toBeInTheDocument();
  });

  it('shows "Topic not found" when the selected party has no data for that topic', () => {
    const { container } = render(<Searchbar />);
    const [partySelect, topicSelect] = getSelects();

    fireEvent.change(partySelect, { target: { value: "Conservative and Unionist Party" } });
    fireEvent.change(topicSelect, { target: { value: "Economy" } });
    clickSearch(container);
    finishLoading();

    expect(screen.getByText(/Topic not found/i)).toBeInTheDocument();
  });
});

describe("Searchbar - compare mode results", () => {
  it("shows a two-column comparison when both parties are selected", () => {
    const { container } = render(<Searchbar />);

    fireEvent.click(screen.getByRole("switch", { name: /Compare Summaries/i }));
    const [partySelect, partyTwoSelect, topicSelect] = getSelects();

    fireEvent.change(partySelect, { target: { value: "Labour Party" } });
    fireEvent.change(partyTwoSelect, { target: { value: "Conservative and Unionist Party" } });
    fireEvent.change(topicSelect, { target: { value: "Entire Manifesto" } });
    clickSearch(container);
    finishLoading();

    expect(screen.getByText("Entire Manifesto: Labour Party")).toBeInTheDocument();
    expect(screen.getByText("Entire Manifesto: Conservative and Unionist Party")).toBeInTheDocument();
    expect(screen.getByText("Labour entire manifesto summary.")).toBeInTheDocument();
    expect(screen.getByText("Conservative entire manifesto summary.")).toBeInTheDocument();
  });

  it("prompts for a second party if compare mode is on but none is selected", () => {
    const { container } = render(<Searchbar />);

    fireEvent.click(screen.getByRole("switch", { name: /Compare Summaries/i }));
    const [partySelect, , topicSelect] = getSelects();

    fireEvent.change(partySelect, { target: { value: "Labour Party" } });
    fireEvent.change(topicSelect, { target: { value: "Entire Manifesto" } });
    clickSearch(container);
    finishLoading();

    expect(
      screen.getByText(/Please select a party to display the summarised manifesto/i)
    ).toBeInTheDocument();
  });
});

describe("Searchbar - detail mode", () => {
  it("pulls from the detailed dataset instead of the standard one when Detail View is on", () => {
    const { container } = render(<Searchbar />);

    fireEvent.click(screen.getByRole("switch", { name: /Detail View/i }));
    const [partySelect, topicSelect] = getSelects();

    fireEvent.change(partySelect, { target: { value: "Labour Party" } });
    fireEvent.change(topicSelect, { target: { value: "Entire Manifesto" } });
    clickSearch(container);
    finishLoading();

    expect(screen.getByText("Labour DETAILED entire manifesto summary.")).toBeInTheDocument();
    expect(screen.queryByText("Labour entire manifesto summary.")).not.toBeInTheDocument();
  });
});