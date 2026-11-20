import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../../src/pages/Home";

vi.mock("../../src/components/navbar/Navbar", () => ({
  default: () => <nav>Navigation Bar</nav>,
}));

vi.mock("../../src/components/hero/Hero", () => ({
  default: () => <div>Hero Section</div>,
}));

vi.mock("../../src/components/charts/PollingChart", () => ({
  default: () => <div>Polling Chart</div>,
}));

describe("Home page", () => {
  it("renders the navigation bar", () => {
    render(<Home />);

    expect(screen.getByText("Navigation Bar")).toBeInTheDocument();
  });

  it("renders the hero section", () => {
    render(<Home />);

    expect(screen.getByText("Hero Section")).toBeInTheDocument();
  });

  it("renders the polling chart", () => {
    render(<Home />);

    expect(screen.getByText("Polling Chart")).toBeInTheDocument();
  });
});