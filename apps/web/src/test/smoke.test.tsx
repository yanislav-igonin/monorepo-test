import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("web test setup", () => {
	it("renders a React node in jsdom", () => {
		render(<h1>Hello</h1>);

		expect(screen.getByRole("heading", { name: "Hello" })).toBeInTheDocument();
	});

	it("cleans up rendered DOM between tests", () => {
		expect(document.body).toBeEmptyDOMElement();
	});
});
