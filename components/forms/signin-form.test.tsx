import { render, screen } from "@testing-library/react";
import { SigninForm } from "./signin-form";

describe("SigninForm", () => {
  it("renders correctly (snapshot)", () => {
    const { container } = render(<SigninForm />);
    expect(container).toMatchSnapshot();
  });

  it("renders email and password fields", () => {
    render(<SigninForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<SigninForm />);
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
