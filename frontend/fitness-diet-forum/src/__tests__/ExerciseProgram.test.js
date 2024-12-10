import { render, screen, fireEvent } from "@testing-library/react";
import ExerciseProgram from "../components/ExerciseProgram"; // Adjust path accordingly
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";

jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ status: 200 }),
}));

test("renders ExerciseProgram component and submits rating", async () => {
  const mockOnDelete = jest.fn();
  const programData = {
    programName: "Full Body Workout",
    exercises: [
      { name: "Push-up", sets: 3, reps: 10, instruction: "Push-up instruction", equipment: "None" },
      { name: "Squat", sets: 3, reps: 15, instruction: "Squat instruction", equipment: "None" },
    ],
    onDelete: mockOnDelete,
    isOwn: false,
    programId: 1,
    currentRating: 4.5,
    ratingCount: 10,
    showRating: true,
  };

  render(
    <Context.Provider value={{ baseURL: "http://localhost" }}>
      <ExerciseProgram {...programData} />
    </Context.Provider>
  );

  expect(screen.getByText(/Full Body Workout/)).toBeInTheDocument();

  expect(screen.getByText(/Rating: 4.5 \/ 5/)).toBeInTheDocument();

  const submitButton = screen.getByText(/Submit Rating/);
  expect(submitButton).toBeInTheDocument();

  const stars = screen.getAllByText("★");
  fireEvent.click(stars[0]); // Click on the first star

  expect(submitButton).not.toBeDisabled();

  fireEvent.click(submitButton);

  expect(axios.post).toHaveBeenCalledWith(
    "http://localhost/rate-workout/",
    { workout_id: 1, rating: 1 }
  );
});
