import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditProfileScreen from "../app/EditProfileScreen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
}));

describe("EditProfileScreen - Full Validation Tests", () => {
  it("renders the component correctly", () => {
    const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);
    expect(getByText("Edit Profile")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Enter new password")).toBeTruthy();
  });

  it("validates email format and shows an error message for invalid input", async () => {
    const { getByPlaceholderText, getByText } = render(<EditProfileScreen />);
    const emailInput = getByPlaceholderText("Email");
    const saveButton = getByText("Save Changes");

    // Invalid email input
    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent.press(saveButton);

    // Expect an error message for invalid email
    await waitFor(() => {
      expect(getByText("Invalid email format.")).toBeTruthy();
    });

    // Valid email input
    fireEvent.changeText(emailInput, "valid@example.com");
    fireEvent.press(saveButton);

    // Expect no error message for valid email
    await waitFor(() => {
      expect(() => getByText("Invalid email format.")).toThrow();
    });
  });

  it("shows an error message when passwords do not match", async () => {
    const { getByPlaceholderText, getByText } = render(<EditProfileScreen />);
    const passwordInput = getByPlaceholderText("Enter new password");
    const confirmPasswordInput = getByPlaceholderText("Confirm new password");
    const saveButton = getByText("Save Changes");

    // Set mismatched passwords
    fireEvent.changeText(passwordInput, "Password123!");
    fireEvent.changeText(confirmPasswordInput, "DifferentPassword123!");
    fireEvent.press(saveButton);

    // Expect an error message for mismatched passwords
    await waitFor(() => {
      expect(getByText("Passwords do not match.")).toBeTruthy();
    });

    // Set matching passwords
    fireEvent.changeText(confirmPasswordInput, "Password123!");
    fireEvent.press(saveButton);

    // Expect no error message for matching passwords
    await waitFor(() => {
      expect(() => getByText("Passwords do not match.")).toThrow();
    });
  });

  it("shows an error message when weight is not a number", async () => {
    const { getByPlaceholderText, getByText } = render(<EditProfileScreen />);
    const weightInput = getByPlaceholderText("Weight (kg)");
    const saveButton = getByText("Save Changes");

    // Invalid weight input
    fireEvent.changeText(weightInput, "invalid-weight");
    fireEvent.press(saveButton);

    // Expect an error message for invalid weight
    await waitFor(() => {
      expect(getByText("Weight must be a number.")).toBeTruthy();
    });

    // Valid weight input
    fireEvent.changeText(weightInput, "70");
    fireEvent.press(saveButton);

    // Expect no error message for valid weight
    await waitFor(() => {
      expect(() => getByText("Weight must be a number.")).toThrow();
    });
  });

  it("shows an error message when height is not a number", async () => {
    const { getByPlaceholderText, getByText } = render(<EditProfileScreen />);
    const heightInput = getByPlaceholderText("Height (cm)");
    const saveButton = getByText("Save Changes");

    // Invalid height input
    fireEvent.changeText(heightInput, "invalid-height");
    fireEvent.press(saveButton);

    // Expect an error message for invalid height
    await waitFor(() => {
      expect(getByText("Height must be a number.")).toBeTruthy();
    });

    // Valid height input
    fireEvent.changeText(heightInput, "180");
    fireEvent.press(saveButton);

    // Expect no error message for valid height
    await waitFor(() => {
      expect(() => getByText("Height must be a number.")).toThrow();
    });
  });
});
