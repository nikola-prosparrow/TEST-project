import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../src/app/page";

test("renders the get started heading", () => {
  render(<Page />);
  expect(
    screen.getByRole("heading", { level: 1, name: /page\.tsx/i }),
  ).toBeInTheDocument();
});
