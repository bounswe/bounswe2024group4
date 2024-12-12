import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Post from "../components/Post";
import { Context } from "../globalContext/globalContext";
import { BrowserRouter } from "react-router-dom";

jest.mock('axios', () => ({
    post: jest.fn().mockResolvedValue({ status: 200 }),
    get: jest.fn().mockResolvedValue({
      status: 200,
      data: [
        { },
      ],
    }),
}));

describe("Post Component", () => {
    const mockGlobalContext = {
      baseURL: "http://localhost",
    };
  
    const defaultProps = {
      postId: 1,
      user: { username: "test_user", score: 5 },
      content: "This is a test post.",
      like_count: 5,
      liked: false,
    };
  
    const renderComponent = () =>
      render(
        <BrowserRouter>
          <Context.Provider value={mockGlobalContext}>
            <Post {...defaultProps} />
          </Context.Provider>
        </BrowserRouter>
    );
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    test("renders the Post component", () => {
      renderComponent();
      expect(screen.getByText("@test_user")).toBeInTheDocument();
      expect(screen.getByText("This is a test post.")).toBeInTheDocument();
    });
  
    test("displays the like count correctly", () => {
      renderComponent();
      expect(screen.getByText(/5\s*Like/)).toBeInTheDocument();
    });
  
    test("handles like toggle correctly", async () => {
      renderComponent();
  
      const likeButton = screen.getByRole("button", { name: /like/i });
      expect(likeButton).toBeInTheDocument();
  
      // Initial state
      expect(screen.getByText(/5\s*Like/)).toBeInTheDocument();
  
      // Simulate liking the post
      fireEvent.click(likeButton);
      await waitFor(() => 
        expect(axios.post).toHaveBeenCalledWith(
          `${mockGlobalContext.baseURL}/toggle_like/`, 
          { postId: 1 },
          { headers: { Authorization: "Token null" } }
        )
      );
  
      // Update state after liking
      expect(screen.getByText(/6\s*Like/)).toBeInTheDocument();
    });
  
    test("displays unlike button if post is already liked", () => {
      render(
        <BrowserRouter>
          <Context.Provider value={mockGlobalContext}>
            <Post {...defaultProps} liked={true} />
          </Context.Provider>
        </BrowserRouter>
      );
      const likeButton = screen.getByRole("button", { name: "5 Like" });
      const heartIcon = likeButton.querySelector("svg");
      expect(heartIcon).toHaveClass("text-red-500");
    });
  
    test("handles unlike toggle correctly", async () => {
      render(
        <BrowserRouter>
          <Context.Provider value={mockGlobalContext}>
            <Post {...defaultProps} liked={true} />
          </Context.Provider>
        </BrowserRouter>
      );
  
      const unlikeButton = screen.getByText(/5\s*Like/);
      expect(unlikeButton).toBeInTheDocument();
  
      // Simulate unliking the post
      fireEvent.click(unlikeButton);
      await waitFor(() => 
        expect(axios.post).toHaveBeenCalledWith(
          `${mockGlobalContext.baseURL}/toggle_like/`, 
          { postId: 1 },
          { headers: { Authorization: "Token null" } }
        )
      );  
      // Update state after unliking
      expect(screen.getByText(/4\s*Like/)).toBeInTheDocument();
    });
  
    test("renders user's score correctly", () => {
      renderComponent();
      expect(screen.getByText("5.0")).toBeInTheDocument();
    });
  
    test("handles API error on like action", async () => {
        // Mock axios.post to reject with a network error
        axios.post.mockRejectedValueOnce(new Error("Network Error"));
      
        renderComponent();
        const likeButton = screen.getByText(/5\s*Like/);
      
        // Fire the click event on the like button
        fireEvent.click(likeButton);
      
        // Wait for the axios call to be made
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
      
        // Check that the like count hasn't changed after the error
        await waitFor(() => expect(screen.getByText(/5\s*Like/)).toBeInTheDocument());
      });
      
  });
  