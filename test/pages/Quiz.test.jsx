import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Quiz from "../../src/pages/Quiz";

vi.mock("../../src/components/navbar/Navbar", () => ({
  default: () => <nav>Navigation Bar</nav>,
}));

describe("Quiz page", () => {
  it("renders the navigation bar", () => {
    render(<Quiz />);

    expect(screen.getByText("Navigation Bar")).toBeInTheDocument();
  });

  it("renders the quiz heading", () => {
    render(<Quiz />);

    expect(screen.getByRole("heading", { name: "Quiz Page" }))
      .toBeInTheDocument();
  });

  it("renders the coming soon message", () => {
    render(<Quiz />);

    expect(
      screen.getByText("Engagement Quiz Coming Soon...")
    ).toBeInTheDocument();
  });
});