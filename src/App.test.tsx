import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import App from "./App";

describe("App", () => {
  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("Stamp Duty Calculator")).toBeInTheDocument();
  });
});