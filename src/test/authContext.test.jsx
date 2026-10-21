import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../components/Context/AuthContext";
import api from "../Axios/axiosInstance";

// Test Consumer component
const AuthTestConsumer = () => {
  const { user, isAuthenticated, login, register, logout, isLoading } = useAuth();

  return (
    <div>
      <div data-testid="auth-loading">{isLoading ? "loading" : "idle"}</div>
      <div data-testid="auth-status">
        {isAuthenticated ? `Logged in as ${user?.email || user?.first_name}` : "Guest"}
      </div>

      <button
        onClick={() => login({ email: "user@lovixa.com", password: "Password123!" })}
      >
        Trigger Login
      </button>

      <button
        onClick={() =>
          register({
            first_name: "Elena",
            last_name: "Rovere",
            email: "elena@lovixa.com",
            password: "Password123!",
          })
        }
      >
        Trigger Register
      </button>

      <button onClick={logout}>Trigger Logout</button>
    </div>
  );
};

describe("AuthContext & Session Management", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("initializes as Guest when no token in localStorage", async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-loading")).toHaveTextContent("idle");
    });
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Guest");
  });

  it("logs in successfully and sets auth state & localStorage tokens", async () => {
    vi.spyOn(api, "post").mockResolvedValueOnce({
      data: {
        status: true,
        access: "mock-access-token",
        refresh: "mock-refresh-token",
        user_id: 101,
        message: "Login successful!",
      },
    });

    vi.spyOn(api, "get").mockResolvedValueOnce({
      data: {
        data: {
          id: 101,
          email: "user@lovixa.com",
          first_name: "Elena",
        },
      },
    });

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /trigger login/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mock-access-token");
      expect(localStorage.getItem("refresh")).toBe("mock-refresh-token");
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged in as user@lovixa.com");
    });
  });

  it("handles logout properly by clearing tokens and resetting user state", async () => {
    localStorage.setItem("token", "existing-token");
    localStorage.setItem("refresh", "existing-refresh");

    vi.spyOn(api, "get").mockResolvedValueOnce({
      data: {
        data: {
          id: 101,
          email: "user@lovixa.com",
        },
      },
    });

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged in as user@lovixa.com");
    });

    fireEvent.click(screen.getByRole("button", { name: /trigger logout/i }));

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("refresh")).toBeNull();
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Guest");
  });
});
