import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../src/app/page";

test("renders the hero heading and featured listings", () => {
  render(<Page />);
  expect(
    screen.getByRole("heading", { level: 1, name: /pronađi dom koji ti sedne/i }),
  ).toBeInTheDocument();
  expect(screen.getByText("Svetao dvosoban stan")).toBeInTheDocument();
});
