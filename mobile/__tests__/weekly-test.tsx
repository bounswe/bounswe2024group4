import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import WeeklyProgram from "../app/(tabs)/WeeklyProgram";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { within } from "@testing-library/react-native";
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockAxios = new MockAdapter(axios);
const baseURL = "http://undefined:8000";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe("WeeklyProgram", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupTest = async (mockResponse: any[]) => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("mock-token");
    mockAxios.onGet(`${baseURL}/get-workouts/`).reply(200, mockResponse);
    return render(<WeeklyProgram />);
  };

  test("renders loading spinner while fetching data", async () => {
    const { getByText, queryByText } = render(<WeeklyProgram />);

    expect(getByText("Loading programs...")).toBeTruthy();

    await waitFor(() => {
      expect(queryByText("Loading programs...")).toBeNull();
    });
  });

  test("renders days of the week", async () => {
    const { getByText } = await setupTest([]);

    await waitFor(() => {
      expect(getByText("Monday")).toBeTruthy();
      expect(getByText("Tuesday")).toBeTruthy();
      expect(getByText("Wednesday")).toBeTruthy();
    });
  });

  test("adds a program to a day", async () => {
    const mockPrograms = [
      {
        id: "1",
        workout_name: "Chest Day",
        exercises: [{ id: "e1", name: "Bench Press", sets: 3, reps: 10 }],
      },
    ];

    const { getByText, getAllByText } = await setupTest(mockPrograms);

    await waitFor(() => {
      expect(getAllByText("Add Program")).toHaveLength(7);
    });

    fireEvent.press(getAllByText("Add Program")[0]);

    await waitFor(() => {
      expect(getByText("Select a Program")).toBeTruthy();
    });

    fireEvent.press(getByText("Chest Day"));

    await waitFor(() => {
      expect(getByText(/Bench Press: 3 sets x 10 reps/i)).toBeTruthy();
    });
  });

  test("removes a program from a day", async () => {
  const mockPrograms = [
    {
      id: "1",
      workout_name: "Chest Day",
      exercises: [{ id: "e1", name: "Bench Press", sets: 3, reps: 10 }],
    },
  ];

  const { getByText, getAllByText, getByTestId } = await setupTest(mockPrograms);

  await waitFor(() => {
    expect(getAllByText("Add Program")).toHaveLength(7);
  });

  // Monday için "Add Program" düğmesine tıkla
  fireEvent.press(getAllByText("Add Program")[0]);

  // Modal'ın açıldığını doğrula
  await waitFor(() => {
    expect(getByText("Select a Program")).toBeTruthy();
  });

  // Programı seç
  fireEvent.press(getByText("Chest Day"));

  // Programın eklendiğini doğrula
  await waitFor(() => {
    expect(getByText(/Bench Press: 3 sets x 10 reps/i)).toBeTruthy();
  });

  // Remove düğmesine bas
  fireEvent.press(getByText("Remove"));

  // Monday'e özgü "No programs assigned" metninin varlığını doğrula
  const mondaySection = getByTestId("day-Monday");
  await waitFor(() => {
    expect(within(mondaySection).getByText("No programs assigned")).toBeTruthy();
  });
});

  

  test("saves the weekly program", async () => {
    const mockPrograms = [
      {
        id: "1",
        workout_name: "Chest Day",
        exercises: [{ id: "e1", name: "Bench Press", sets: 3, reps: 10 }],
      },
    ];

    mockAxios.onPost(`${baseURL}/create-program/`).reply(200, {});

    const { getByText, getAllByText } = await setupTest(mockPrograms);

    await waitFor(() => {
      expect(getAllByText("Add Program")).toHaveLength(7);
    });

    fireEvent.press(getAllByText("Add Program")[0]);

    await waitFor(() => {
      expect(getByText("Select a Program")).toBeTruthy();
    });

    fireEvent.press(getByText("Chest Day"));

    await waitFor(() => {
      expect(getByText(/Bench Press: 3 sets x 10 reps/i)).toBeTruthy();
    });

    fireEvent.press(getByText("Save Weekly Program"));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1);
      expect(mockAxios.history.post[0].url).toBe(`${baseURL}/create-program/`);
    });
  });

  test("closes the modal", async () => {
    const mockPrograms = [
      {
        id: "1",
        workout_name: "Chest Day",
        exercises: [{ id: "e1", name: "Bench Press", sets: 3, reps: 10 }],
      },
    ];

    const { getByText, getAllByText, queryByText } = await setupTest(mockPrograms);

    await waitFor(() => {
      expect(getAllByText("Add Program")).toHaveLength(7);
    });

    fireEvent.press(getAllByText("Add Program")[0]);

    await waitFor(() => {
      expect(getByText("Select a Program")).toBeTruthy();
    });

    fireEvent.press(getByText("Close"));

    await waitFor(() => {
      expect(queryByText("Select a Program")).toBeNull();
    });
  });
});
