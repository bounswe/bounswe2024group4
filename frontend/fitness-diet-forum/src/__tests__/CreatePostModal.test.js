import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";
import CreatePostModal from '../components/CreatePostModal.js';

jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ status: 200 })
}));

// Mock localStorage
beforeEach(() => {
    localStorage.setItem('username', 'testUser');
    localStorage.setItem('token', 'testToken');
});

// Mock global context
const mockGlobalContext = {
    baseURL: 'http://localhost:3000'
};

// Helper function to wrap component in context provider
const renderWithContext = (ui) => {
    return render(
        <Context.Provider value={mockGlobalContext}>
            {ui}
        </Context.Provider>
    );
};

describe('CreatePostModal', () => {
    test('renders modal when isModalOpen is true', () => {
        const mockWorkouts = [
            { id: 1, workout_name: 'Workout 1', exercises: ['Exercise 1'], rating: 5, rating_count: 10 }
        ];

        axios.get.mockResolvedValueOnce({ data: mockWorkouts });
        axios.get.mockResolvedValueOnce({
            data: { meals: [{ id: 1, name: 'Meal 1' }] }, // Example response structure
        });
        renderWithContext(<CreatePostModal isModalOpen={true} closeModal={jest.fn()} />);
        expect(screen.getByText(/Create a Post/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Write your post here.../i)).toBeInTheDocument();
    });

    test('does not render modal when isModalOpen is false', () => {
        renderWithContext(<CreatePostModal isModalOpen={false} closeModal={jest.fn()} />);

        expect(screen.queryByText(/Create a Post/i)).not.toBeInTheDocument();
    });

    test('fetches workouts when modal is opened', async () => {
        const mockWorkouts = [
          { id: 1, workout_name: 'Workout 1' },
          { id: 2, workout_name: 'Workout 2' }
        ];
        axios.get.mockResolvedValueOnce({ data: mockWorkouts });
        axios.get.mockResolvedValueOnce({
            data: { meals: [{ id: 1, name: 'Meal 1' }] }, // Example response structure
        });
      
        renderWithContext(<CreatePostModal isModalOpen={true} closeModal={jest.fn()} />);
      
        // Wait for workouts to be fetched and displayed
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(screen.getByText('Workout 1')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Workout 2')).toBeInTheDocument());
    });

    test('handles workout selection and displays selected workout', async () => {
        const mockWorkouts = [
            { id: 1, workout_name: 'Workout 1', exercises: ['Exercise 1'], rating: 5, rating_count: 10 }
        ];
    
        axios.get.mockResolvedValueOnce({ data: mockWorkouts });
        axios.post.mockResolvedValueOnce({ status: 200 });
        axios.get.mockResolvedValueOnce({
            data: { meals: [{ id: 1, name: 'Meal 1' }] }, // Example response structure
        });
    
        renderWithContext(<CreatePostModal isModalOpen={true} closeModal={jest.fn()} />);
    
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    
        // Get all comboboxes and select the one for the workout (index 0)
        const selectElements = screen.getAllByRole('combobox');
        fireEvent.change(selectElements[0], { target: { value: '1' } });
    
        // Click Add Workout
        fireEvent.click(screen.getByText('Add Workout'));
    
        expect(screen.getByText('Workout 1')).toBeInTheDocument();
    });


    test('handles creating post with content and workout selection', async () => {
        const mockWorkouts = [
            { id: 1, workout_name: 'Workout 1', exercises: ['Exercise 1'], rating: 5, rating_count: 10 }
        ];
        axios.get.mockResolvedValueOnce({ data: mockWorkouts });
        axios.get.mockResolvedValueOnce({
            data: { meals: [{ id: 1, name: 'Meal 1' }] }, // Example response structure
        });
        axios.post.mockResolvedValueOnce({ status: 200 });
    
        // Mock the user context or props if necessary
        const mockUser = { username: 'testUser' };
        renderWithContext(<CreatePostModal isModalOpen={true} closeModal={jest.fn()} user={mockUser} />);
    
        // Wait for the workouts to load and validate the dropdown contains the expected option
        await waitFor(() => {
            const option = screen.getByRole('option', { name: 'Workout 1' });
            expect(option).toBeInTheDocument();
        });
    
        // Select a workout
        fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: '1' } });
    
        // Add content to the post
        fireEvent.change(screen.getByPlaceholderText(/Write your post here.../i), {
            target: { value: 'This is my post content.' },
        });
    
        // Click 'Submit'
        fireEvent.click(screen.getByText('Submit'));
    
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3000/post/',
                {
                    content: 'This is my post content.',
                    workoutId: 1,
                    mealId: null, // If mealId is optional and defaults to null
                },
                {
                    headers: { Authorization: 'Token testToken' } // Ensure the Authorization header is sent
                }
            );
        });
    });
    
    
    test('handles cancel button and resets state', async () => {
        const mockWorkouts = [
          { id: 1, workout_name: 'Workout 1', exercises: ['Exercise 1'], rating: 5, rating_count: 10 }
        ];
        const closeModalMock = jest.fn(); // Mock the closeModal function
    
        axios.get.mockResolvedValueOnce({ data: mockWorkouts });
        axios.get.mockResolvedValueOnce({
            data: { meals: [{ id: 1, name: 'Meal 1' }] }, // Example response structure
        });
      
        renderWithContext(<CreatePostModal isModalOpen={true} closeModal={closeModalMock} />);
      
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
      
        const selectElements = screen.getAllByRole('combobox');
        fireEvent.change(selectElements[0], { target: { value: '1' } });
      
        fireEvent.click(screen.getByText('Add Workout'));
      
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
      
        // Check if the closeModal function was called with false
        expect(closeModalMock).toHaveBeenCalledWith(); 
    });
    

    test('disables submit button when post content and workout are empty', () => {
        const mockWorkouts = [
            { id: 1, workout_name: 'Workout 1', exercises: ['Exercise 1'], rating: 5, rating_count: 10 }
        ];
        const closeModalMock = jest.fn(); // Mock the closeModal function
    
        axios.get.mockResolvedValueOnce({ data: mockWorkouts });
        axios.get.mockResolvedValueOnce({
            data: { meals: [{ id: 1, name: 'Meal 1' }] }, // Example response structure
        });
    
        renderWithContext(<CreatePostModal isModalOpen={true} closeModal={closeModalMock} />);
        expect(screen.getByText('Submit')).toBeDisabled();
    });


    test('enables submit button when post content and workout are provided', async () => {
        const mockWorkouts = [
          { id: 1, workout_name: 'Workout 1', exercises: ['Exercise 1'], rating: 5, rating_count: 10 }
        ];
        axios.get.mockResolvedValueOnce({ data: mockWorkouts });
        axios.get.mockResolvedValueOnce({
            data: { meals: [{ id: 1, name: 'Meal 1' }] }, // Example response structure
        });
      
        renderWithContext(<CreatePostModal isModalOpen={true} closeModal={jest.fn()} />);
      
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
      
        const selectElements = screen.getAllByRole('combobox');
        fireEvent.change(selectElements[0], { target: { value: '1' } });
      
        fireEvent.click(screen.getByText('Add Workout'));
      
        const textarea = screen.getByPlaceholderText(/Write your post here.../i);
        fireEvent.change(textarea, { target: { value: 'This is my post content.' } });
      
        expect(screen.getByText('Submit')).toBeEnabled();
    });      
});
