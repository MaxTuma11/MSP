import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Summaries from "../../src/pages/Summaries";

vi.mock("../../src/components/navbar/Navbar", () => ({
  default: () => <nav>Navigation Bar</nav>,
}));

vi.mock("../../src/components/searchbar/Searchbar", () => ({
  default: () => <div>Searchbar</div>,
}));

describe("Summaries page", () => {
  it("renders the navigation bar", () => {
    render(<Summaries />);

    expect(screen.getByText("Navigation Bar")).toBeInTheDocument();
  });

  it("renders the searchbar", () => {
    render(<Summaries />);

    expect(screen.getByText("Searchbar")).toBeInTheDocument();
  });
});