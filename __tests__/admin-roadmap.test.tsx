import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoadmapBoard } from "../src/components/admin/RoadmapBoard";

test("renders Now/Next/Later columns with roadmap items", () => {
  render(<RoadmapBoard />);

  expect(screen.getByText("Now")).toBeInTheDocument();
  expect(screen.getByText("Next")).toBeInTheDocument();
  expect(screen.getByText("Later")).toBeInTheDocument();

  expect(screen.getByText("Baza podataka za oglase")).toBeInTheDocument();
  expect(screen.getByText("Upload pravih fotografija")).toBeInTheDocument();
  expect(screen.getByText("Plaćeno isticanje oglasa")).toBeInTheDocument();
});
