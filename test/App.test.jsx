import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "../src/App";

describe("App - routing", () => {
  beforeEach(() => {
    window.location.hash = "#/";
  });

  it("renders the Home page at /", () => {
    window.location.hash = "#/";
    render(<App />);

    expect(screen.getByText("Welcome to the Manifesto Summarisation Project")).toBeInTheDocument();
  });

  it("renders the Summaries page at /Summaries", () => {
    window.location.hash = "#/Summaries";
    render(<App />);

    expect(screen.getByText("Select Party")).toBeInTheDocument();
  });

  it("renders the Data page at /Data", () => {
    window.location.hash = "#/Data";
    render(<App />);

    expect(screen.getByText("Data Sources")).toBeInTheDocument();
  });

  it("renders the About page at /About", () => {
    window.location.hash = "#/About";
    render(<App />);

    expect(screen.getByText("About The Manifesto Summarisation Project")).toBeInTheDocument();
  });

  it("renders the Quiz page at /Quiz", () => {
    window.location.hash = "#/Quiz";
    render(<App />);

    expect(screen.getByText("Quiz Page")).toBeInTheDocument();
  });
});