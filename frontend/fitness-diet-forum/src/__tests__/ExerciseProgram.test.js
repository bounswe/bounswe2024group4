import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExerciseProgram from "../components/ExerciseProgram";
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";

jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ status: 200 }),
  get: jest.fn().mockResolvedValue({
    status: 200,
    data: [
      { id: 1, name: "Full Body Workout" },
    ],
  }),
}));

describe("ExerciseProgram Component", () => {
  const mockOnDelete = jest.fn();
  const programData = {
    programName: "Full Body Workout",
    exercises: [
      { name: "Push-up", sets: 3, reps: 10, instruction: "Push-up instruction", equipment: "None" },
      { name: "Squat", sets: 3, reps: 15, instruction: "Squat instruction", equipment: "None" },
    ],
    onDelete: mockOnDelete,
    isOwn: true,
    programId: 1,
    currentRating: 4.5,
    ratingCount: 10,
    showRating: true,
  };

  const renderComponent = () =>
    render(
      <Context.Provider value={{ baseURL: "http://localhost" }}>
        <ExerciseProgram {...programData} />
      </Context.Provider>
    );

  test("renders ExerciseProgram component correctly", () => {
    renderComponent();

    expect(screen.getByText(/Full Body Workout/)).toBeInTheDocument();
    expect(screen.getByText(/Rating: 4.5 \/ 5/)).toBeInTheDocument();
    expect(screen.getByText("Push-up"))
      .toBeInTheDocument();
    expect(screen.getByText("Squat"))
      .toBeInTheDocument();
  });

  test("submits rating and updates the UI", async () => {
    renderComponent();

    const stars = screen.getAllByText("★");
    const submitButton = screen.getByText(/Submit Rating/);

    fireEvent.click(stars[2]); // Click on the third star
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost/rate-workout/",
        { workout_id: 1, rating: 3 },
        { headers: { Authorization: expect.stringContaining("Token") } }
      );
    });
  });

  test("calls onDelete function when Remove Program button is clicked", () => {
    renderComponent();

    const deleteButton = screen.getByText(/Remove Program/);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalled();
  });

  test("handles API errors gracefully when submitting rating", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network error"));

    renderComponent();

    const stars = screen.getAllByText("★");
    const submitButton = screen.getByText(/Submit Rating/);

    fireEvent.click(stars[4]); // Click on the fifth star
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit rating. Please try again./)).toBeInTheDocument();
    });
  });
});
