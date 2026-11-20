import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../../src/pages/About";

vi.mock("../../src/components/navbar/Navbar", () => ({
  default: () => <nav>Navigation Bar</nav>,
}));

describe("About page", () => {
  it("renders the navigation bar", () => {
    render(<About />);

    expect(screen.getByText("Navigation Bar")).toBeInTheDocument();
  });

  it("renders the main project heading", () => {
    render(<About />);

    expect(
      screen.getByText("About The Manifesto Summarisation Project")
    ).toBeInTheDocument();
  });

  it("renders the project goals section", () => {
    render(<About />);

    expect(screen.getByText("The goals of the project:")).toBeInTheDocument();
  });

  it("renders the purpose section", () => {
    render(<About />);

    expect(screen.getByText("What is its purpose?")).toBeInTheDocument();
  });

  it("renders the summarisation section", () => {
    render(<About />);

    expect(screen.getByText("Does summarisation help?")).toBeInTheDocument();
  });

  it("renders the funding section", () => {
    render(<About />);

    expect(
      screen.getByText("Does this project receive any funding?")
    ).toBeInTheDocument();
  });

  it("renders the personal data section", () => {
    render(<About />);

    expect(
      screen.getByText("Does this project use any personal data?")
    ).toBeInTheDocument();
  });

  it("renders the FAQs section", () => {
    render(<About />);

    expect(screen.getByText("FAQs")).toBeInTheDocument();
  });

  it("renders the data source FAQ", () => {
    render(<About />);

    expect(screen.getByText("Where is the data from?")).toBeInTheDocument();
  });
});