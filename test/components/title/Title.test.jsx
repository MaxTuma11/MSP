
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Title from "../../../src/components/title/Title"; // Adjust path as needed

describe("Title Component", () => {

  it("renders the title container", () => {
    const { container } = render(<Title />);

    expect(
      container.querySelector(".title")
    ).toBeInTheDocument();
  });

  it("renders the User Guide text", () => {
    render(<Title />);

    expect(
      screen.getByText("User Guide")
    ).toBeInTheDocument();
  });

  it("renders the correct heading", () => {
    render(<Title />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "How to Use The Summarisation Page",
      })
    ).toBeInTheDocument();
  });

});
