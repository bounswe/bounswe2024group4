import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import EditProfileForm from "../components/EditProfileForm";
import { Context } from "../globalContext/globalContext";

jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: [] }), // Default mock to avoid issues
    post: jest.fn().mockResolvedValue({ status: 200 })
}));

describe("EditProfileForm Component", () => {
    const mockContextValue = {
        baseURL: "http://example.com",
    };

    const mockUserData = {
        username: "testuser",
        email: "testuser@example.com",
        bio: "Test bio",
        weight: "70",
        height: "170",
        profile_picture: "http://example.com/profile.jpg",
    };

    const mockOnClose = jest.fn();
    const mockOnUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the form with pre-filled user data", () => {
        render(
            <Context.Provider value={mockContextValue}>
                <EditProfileForm userData={mockUserData} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </Context.Provider>
        );

        expect(screen.getByDisplayValue(mockUserData.username)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockUserData.email)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockUserData.bio)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockUserData.weight)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockUserData.height)).toBeInTheDocument();
        expect(screen.getByAltText("Profile Preview").src).toBe(mockUserData.profile_picture);
    });

    test("calls onClose when the Cancel button is clicked", () => {
        render(
            <Context.Provider value={mockContextValue}>
                <EditProfileForm userData={mockUserData} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </Context.Provider>
        );

        fireEvent.click(screen.getByText("Cancel"));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("updates the form state when inputs change", () => {
        render(
            <Context.Provider value={mockContextValue}>
                <EditProfileForm userData={mockUserData} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </Context.Provider>
        );

        const usernameInput = screen.getByDisplayValue(mockUserData.username);
        fireEvent.change(usernameInput, { target: { value: "newusername" } });
        expect(usernameInput.value).toBe("newusername");
    });

    test("submits the form and calls the API", async () => {
        axios.post.mockResolvedValue({ status: 200 });

        render(
            <Context.Provider value={mockContextValue}>
                <EditProfileForm userData={mockUserData} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </Context.Provider>
        );

        fireEvent.change(screen.getByDisplayValue(mockUserData.username), {
            target: { value: "updateduser" },
        });

        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `${mockContextValue.baseURL}/edit_profile/`,
                expect.any(FormData),
                expect.objectContaining({
                    headers: expect.objectContaining({ Authorization: expect.any(String) }),
                })
            );
            expect(mockOnUpdate).toHaveBeenCalledWith(
                expect.objectContaining({ username: "updateduser" })
            );
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    test("shows an error alert if the API call fails", async () => {
        axios.post.mockRejectedValue(new Error("Network error"));
        window.alert = jest.fn();

        render(
            <Context.Provider value={mockContextValue}>
                <EditProfileForm userData={mockUserData} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </Context.Provider>
        );

        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Failed to update profile.");
        });
    });
});