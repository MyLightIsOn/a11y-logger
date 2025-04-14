import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { getHomePageData } from "@/data/loaders/home";

interface DataType {
  data: {
    title: string;
  };
}

// Mock the data loader to control what the component receives during testing.
jest.mock("../data/loaders/home", () => ({
  getHomePageData: jest.fn(),
}));

// Mock the HeroSection component to return a simple testable element.
jest.mock("../components/custom/hero-section", () => ({
  HeroSection: ({ data }: DataType) => (
    <div data-testid="hero-section">{data.title}</div>
  ),
}));

// Mock the FeatureSection component similarly to keep rendering simple and focused.
jest.mock("../components/custom/features-section", () => ({
  FeatureSection: ({ data }: DataType) => (
    <div data-testid="features-section">{data.title}</div>
  ),
}));

describe("Home Page", () => {
  it("renders components based on block type", async () => {
    // Arrange mock data to simulate what would come from the CMS
    (getHomePageData as jest.Mock).mockResolvedValue({
      data: {
        blocks: [
          {
            id: 1,
            __component: "layout.hero-section",
            title: "Welcome to the Hero Section",
          },
          {
            id: 2,
            __component: "layout.features-section",
            title: "Our Features",
          },
        ],
      },
    });

    // Act: Render the Home component with the mocked data
    render(await Home());

    // Assert: Check if both mocked components rendered with the correct text
    expect(screen.getByTestId("hero-section")).toHaveTextContent(
      "Welcome to the Hero Section",
    );
    expect(screen.getByTestId("features-section")).toHaveTextContent(
      "Our Features",
    );
  });

  it("renders nothing if block type is unknown", async () => {
    // Provide a block with an unknown type not mapped in blockComponents
    (getHomePageData as jest.Mock).mockResolvedValue({
      data: {
        blocks: [
          {
            id: 3,
            __component: "layout.unknown-section",
            title: "This won't render",
          },
        ],
      },
    });

    // Render the Home component and capture the container
    const { container } = render(await Home());

    // Since the component type is unknown, the main tag should be empty
    expect(container.innerHTML).toBe("<main></main>");
  });
});
