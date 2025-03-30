/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders a heading", () => {
    render(
      <h1>
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>,
    );
    //render(<Home />);

    /*const heading = screen.getByRole("heading", {
      name: /welcome to next\.js!/i,
    });*/

    const heading = screen.getByRole("heading", {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBeTruthy();
  });
});
