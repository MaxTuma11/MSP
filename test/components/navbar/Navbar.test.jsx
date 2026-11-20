
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../../src/components/navbar/Navbar"; // Adjust path as needed

describe("Navbar Component", () => {

  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderNavbar = () => {
    return render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  };

  it("renders the navbar with all navigation links", () => {
    renderNavbar();

    const navbar = screen.getByRole("navigation");

    expect(navbar).toBeInTheDocument();

    const links = [
      "Home",
      "Manifesto Summaries",
      "Engagement Quiz",
      "Raw Data",
      "About Us",
    ];

    links.forEach((link) => {
      expect(
        within(navbar).getByRole("link", { name: link })
      ).toBeInTheDocument();
    });
  });

  it("renders the navbar logo", () => {
    const { container } = renderNavbar();

    const logo = container.querySelector(".logo");

    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe("IMG");

    // Logo links back to the homepage
    expect(logo.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders navigation links with correct routes", () => {
    renderNavbar();

    const routes = [
      { name: "Home", path: "/" },
      { name: "Manifesto Summaries", path: "/Summaries" },
      { name: "Engagement Quiz", path: "/Quiz" },
      { name: "Raw Data", path: "/Data" },
      { name: "About Us", path: "/About" },
    ];

    routes.forEach(({ name, path }) => {
      expect(
        screen.getByRole("link", { name })
      ).toHaveAttribute("href", path);
    });
  });

  it("initially renders the navbar as unsticky", () => {
    renderNavbar();

    const navbar = screen.getByRole("navigation");

    expect(navbar).toHaveClass("unshow-nav");
    expect(navbar).not.toHaveClass("show-nav");
  });

  it("makes the navbar sticky when scrolling past 100px", () => {
    renderNavbar();

    const navbar = screen.getByRole("navigation");

    window.scrollY = 150;
    fireEvent.scroll(window);

    expect(navbar).toHaveClass("show-nav");
    expect(navbar).not.toHaveClass("unshow-nav");
  });

  it("removes sticky styling when scrolling back up", () => {
    renderNavbar();

    const navbar = screen.getByRole("navigation");

    window.scrollY = 150;
    fireEvent.scroll(window);

    expect(navbar).toHaveClass("show-nav");

    window.scrollY = 50;
    fireEvent.scroll(window);

    expect(navbar).toHaveClass("unshow-nav");
    expect(navbar).not.toHaveClass("show-nav");
  });

  it("opens and closes the mobile menu", () => {
    renderNavbar();

    const menuButton = screen.getByRole("button", {
      name: "Toggle menu",
    });

    const menu = screen.getByRole("list");

    // Initially closed
    expect(menu).not.toHaveClass("mobile-menu-open");

    // Open menu
    fireEvent.click(menuButton);

    expect(menu).toHaveClass("mobile-menu-open");

    // Close menu
    fireEvent.click(menuButton);

    expect(menu).not.toHaveClass("mobile-menu-open");
  });

  it("closes the mobile menu when a navigation link is clicked", () => {
    renderNavbar();

    const menuButton = screen.getByRole("button", {
      name: "Toggle menu",
    });

    const menu = screen.getByRole("list");

    // Open menu
    fireEvent.click(menuButton);

    expect(menu).toHaveClass("mobile-menu-open");

    // Click navigation link
    fireEvent.click(
      screen.getByRole("link", { name: "Manifesto Summaries" })
    );

    // Menu should close
    expect(menu).not.toHaveClass("mobile-menu-open");
  });

});
