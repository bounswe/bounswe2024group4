import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import SearchResults from "../pages/SearchResults";
import { Context } from "../globalContext/globalContext";

// Mock Axios
jest.mock("axios");

const mockContext = {
  baseURL: "http://example.com",
};

describe("SearchResults Component", () => {
  beforeEach(() => {
    axios.get.mockClear();
  });

  it("fetches and renders search results correctly", async () => {
    // Mock the /search endpoint
    axios.get.mockResolvedValueOnce({
      data: {
        users: [
          {
            username: "batu",
            profile_picture: "",
            score: 5,
            user_type: "member",
            workout_rating: 5,
            meal_rating: 0,
          },
        ],
        posts: [
          {
            id: 4,
            content: "best",
            created_at: "2024-12-16T07:22:00.655Z",
            like_count: 1,
            user: {
              username: "batu",
              profile_picture: null,
              score: 5,
              user_type: "member",
              workout_rating: 5,
              meal_rating: 0,
            },
            workout_id: 2,
            meal_id: null,
          },
        ],
        meals: [
          {
            meal_id: 1,
            meal_name: "mm",
            created_at: "2024-12-16T08:42:36.162Z",
            rating: 0,
            rating_count: 0,
            created_by: {
              username: "batu",
              profile_picture: null,
            },
          },
        ],
        workouts: [
          {
            workout_id: 2,
            workout_name: "upper back",
            rating: 0,
            rating_count: 0,
            created_by: {
              username: "batu",
              profile_picture: null,
            },
          },
        ],
      },
    });

    render(
      <Context.Provider value={mockContext}>
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      </Context.Provider>
    );

    // Verify Users tab
    await waitFor(() => expect(screen.getByText("batu")).toBeInTheDocument());

    // Switch to Posts tab
    fireEvent.click(screen.getByText("Posts"));
    await waitFor(() => expect(screen.getByText("best")).toBeInTheDocument());

    // Switch to Meals tab
    fireEvent.click(screen.getByText("Meals"));
    await waitFor(() => expect(screen.getByText("mm")).toBeInTheDocument());

    // Switch to Workouts tab
    fireEvent.click(screen.getByText("Workouts"));
    await waitFor(() => expect(screen.getByText("upper back")).toBeInTheDocument());
  });
});