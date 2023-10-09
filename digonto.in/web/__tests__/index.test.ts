import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Dummy Test Suite", () => {
  it("Dummy Test", () => {
    const val = false;
    expect(val).toBeTruthy();
  });
});

// docker build -t digonto/web:0.0.12 --progress=plain --no-cache --target=test .
