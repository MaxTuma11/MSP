
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Datatable from "../../../src/components/datatable/Datatable"; // Adjust path as needed

describe("Datatable Component", () => {

  it("renders the heading and explanatory text", () => {
    render(<Datatable />);

    expect(
      screen.getByRole("heading", { name: "Data Sources" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/This project aims to be as transparent as possible/i)
    ).toBeInTheDocument();
  });

  it("renders the table with the correct headers", () => {
    render(<Datatable />);

    expect(
      screen.getByRole("columnheader", {
        name: "Manifesto/Dataset Name"
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: "Data URL" })
    ).toBeInTheDocument();
  });

  it("renders all 15 data sources", () => {
    render(<Datatable />);

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    // 15 data rows + 1 header row
    expect(rows).toHaveLength(16);

    const links = within(table).getAllByRole("link", {
      name: "View Data Source"
    });

    expect(links).toHaveLength(15);
  });

  it("renders the expected data source names", () => {
    render(<Datatable />);

    const sources = [
      "Labour Party",
      "Conservative Party",
      "Liberal Democrat Party",
      "Scottish National Party",
      "Green Party",
      "Reform UK",
      "Plaid Cymru",
      "Sinn Fein",
      "Alliance Party",
      "Democratic Unionist Party",
      "Ulster Unionist Party",
      "Social Democratic and Labour Party",
      "Traditional Unionist Voice",
      "Public Whip Dataset",
      "electiondatavault Dataset"
    ];

    sources.forEach((source) => {
      expect(screen.getByText(source)).toBeInTheDocument();
    });
  });

  it("renders the correct URLs for data sources", () => {
    render(<Datatable />);

    const labourRow = screen.getByText("Labour Party").closest("tr");
    const labourLink = within(labourRow).getByRole("link");

    expect(labourLink).toHaveAttribute(
      "href",
      "https://labour.org.uk/wp-content/uploads/2024/06/Change-Labour-Party-Manifesto-2024-large-print.pdf"
    );

    const publicWhipRow = screen
      .getByText("Public Whip Dataset")
      .closest("tr");

    const publicWhipLink = within(publicWhipRow).getByRole("link");

    expect(publicWhipLink).toHaveAttribute(
      "href",
      "https://www.publicwhip.org.uk/project/data.php"
    );
  });

  it("opens all links in a new tab securely", () => {
    render(<Datatable />);

    const links = screen.getAllByRole("link", {
      name: "View Data Source"
    });

    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute(
        "rel",
        "noopener noreferrer"
      );
    });
  });

});
