/**
 * @jest-environment jsdom
 */
/*
import { render } from "@testing-library/react";
import Home from "@/app/page";

it("renders homepage unchanged", () => {
  const { container } = render(<Home />);

  //const { container } = render(<Home />);
  expect(container).toMatchSnapshot();
});
*/

import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import mockAxios from "jest-mock-axios";
// Updated fetchData function with Dependency Injection (DI)
async function fetchData(axiosInstance, url) {
  const authToken = null;
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };
  try {
    const response = await axiosInstance.get(url, authToken ? headers : {});
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    throw error;
  }
}

// your test case
test("fetchData returns data on success", async () => {
  const url = "https://localhost:1337/api";
  const mockData = { key: "value" };

  // Set up the promise that should be returned from the axios.get function.
  const promise = new Promise((resolve) => {
    resolve({ data: mockData });
  });

  // Override the function to return the Promise we just set up.
  mockAxios.get.mockReturnValueOnce(promise);

  // Inject mockAxios as axiosInstance
  const data = await fetchData(mockAxios, url);

  // Later, after making the call, we can make assertions about whether or not axios.get was called with the
  // expected input, and whether or not fetchData then returned the expected output.
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  /*expect(mockAxios.get).toHaveBeenCalledWith(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer null",
    },
  });*/

  // Snapshot testing here
  expect(data).toMatchInlineSnapshot(
    { key: "value" },
    `
    {
      "key": "value",
    }
  `,
  );

  // Clean up after this test case.
  mockAxios.mockClear();
});
