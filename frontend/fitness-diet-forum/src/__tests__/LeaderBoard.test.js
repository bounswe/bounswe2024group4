import { render, screen, waitFor } from "@testing-library/react";
import { Context } from "../globalContext/globalContext.js";
import LeaderBoard from "../pages/LeaderBoard";

jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: [] }), // Mocking axios.get
}));

test("renders Loading...", async () => {
    render(
        <Context.Provider value={{ baseURL: "127.0.0.1" }}>
        <LeaderBoard />
        </Context.Provider>
    );

    expect(screen.getByText(/Loading../)).toBeInTheDocument();
});
