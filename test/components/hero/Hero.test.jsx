
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Hero from "../../../src/components/hero/Hero"; // Adjust path as needed

describe("Hero Component", () => {

  const renderHero = () => {
    return render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
  };

  it("renders the hero container", () => {
    const { container } = renderHero();

    expect(
      container.querySelector(".hero")
    ).toBeInTheDocument();

    expect(
      container.querySelector(".hero-text")
    ).toBeInTheDocument();
  });

  it("renders the correct heading", () => {
    renderHero();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Welcome to the Manifesto Summarisation Project",
      })
    ).toBeInTheDocument();
  });

  it("renders the introductory text", () => {
    renderHero();

    expect(
      screen.getByText(/This website is for anyone to use/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/create a more readable and understandable manifesto/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Click the button below to visit the Manifesto Summaries/i)
    ).toBeInTheDocument();
  });

  it("renders a link to the Manifesto Summaries page", () => {
    renderHero();

    const summariesLink = screen.getByRole("link", {
      name: "Manifesto Summaries",
    });

    expect(summariesLink).toBeInTheDocument();

    expect(summariesLink).toHaveAttribute(
      "href",
      "/Summaries"
    );

    expect(summariesLink).toHaveClass("btn");
  });

});
