import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../screens/LoginScreen";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "View",
}));

const mockedNavigate = jest.fn();

describe("LoginScreen", () => {
  it("mora prikazati napako, ko so polja prazna", async () => {
    const { getByText } = render(
      <LoginScreen navigation={{ navigate: mockedNavigate }} />,
    );

    const loginButton = getByText("Prijavi se");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText(/Prosimo, vnesi e-pošto in geslo/i)).toBeTruthy();
    });
  });

  it("mora posodobiti vrednosti v poljih", () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={{ navigate: mockedNavigate }} />,
    );

    const emailInput = getByPlaceholderText("vnesi e-pošto");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(emailInput.props.value).toBe("test@example.com");
  });
});
