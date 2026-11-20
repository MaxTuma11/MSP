import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Data from "../../src/pages/Data";

vi.mock("../../src/components/navbar/Navbar", () => ({
  default: () => <nav>Navigation Bar</nav>,
}));

vi.mock("../../src/components/datatable/Datatable", () => ({
  default: () => <div>Data Table</div>,
}));

describe("Data page", () => {
  it("renders the navigation bar", () => {
    render(<Data />);

    expect(screen.getByText("Navigation Bar")).toBeInTheDocument();
  });

  it("renders the data table", () => {
    render(<Data />);

    expect(screen.getByText("Data Table")).toBeInTheDocument();
  });
});