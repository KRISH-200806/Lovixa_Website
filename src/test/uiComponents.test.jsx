import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  Button,
  Input,
  Card,
  Modal,
  Badge,
  Skeleton,
  ProductCardSkeleton,
  ErrorBoundary,
} from "../components/ui";

describe("UI Primitive Component Library", () => {
  describe("Button Component", () => {
    it("renders children and handles click events", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("displays loading spinner and disables button when isLoading is true", () => {
      render(<Button isLoading>Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("applies primary, outline and danger variants correctly", () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-brand");

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toHaveClass("border-brand");

      rerender(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-red-600");
    });
  });

  describe("Input Component", () => {
    it("renders label, placeholder, and updates value on input", () => {
      render(
        <Input
          label="Email Address"
          placeholder="Enter your email"
          defaultValue=""
        />
      );
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      const input = screen.getByPlaceholderText(/enter your email/i);
      fireEvent.change(input, { target: { value: "user@lovixa.com" } });
      expect(input.value).toBe("user@lovixa.com");
    });

    it("displays error message with role='alert'", () => {
      render(<Input label="Password" error="Password is required" />);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Password is required");
    });
  });

  describe("Card Component", () => {
    it("renders card content and handles custom classNames", () => {
      render(
        <Card className="custom-card">
          <p>Luxury Perfume Card</p>
        </Card>
      );
      expect(screen.getByText("Luxury Perfume Card")).toBeInTheDocument();
      expect(screen.getByText("Luxury Perfume Card").closest("div")).toHaveClass("custom-card");
    });
  });

  describe("Badge Component", () => {
    it("renders badge with appropriate variant styles", () => {
      const { rerender } = render(<Badge variant="gold">Best Seller</Badge>);
      expect(screen.getByText("Best Seller")).toHaveClass("text-gold-dark");

      rerender(<Badge variant="success">In Stock</Badge>);
      expect(screen.getByText("In Stock")).toHaveClass("text-emerald-700");

      rerender(<Badge variant="danger">Out of Stock</Badge>);
      expect(screen.getByText("Out of Stock")).toHaveClass("text-rose-700");
    });
  });

  describe("Modal Component", () => {
    it("renders when isOpen is true and closes when close button is clicked", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Quick View">
          <p>Product Quick View Content</p>
        </Modal>
      );

      expect(screen.getByText("Quick View")).toBeInTheDocument();
      expect(screen.getByText("Product Quick View Content")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: /close modal/i });
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("does not render content when isOpen is false", () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="Hidden Modal">
          <p>Hidden Content</p>
        </Modal>
      );
      expect(screen.queryByText("Hidden Modal")).not.toBeInTheDocument();
    });
  });

  describe("Skeleton Loaders", () => {
    it("renders skeleton loader and product card skeleton", () => {
      render(
        <div>
          <Skeleton width="100px" height="20px" />
          <ProductCardSkeleton />
        </div>
      );
      const loaders = screen.getAllByTestId("skeleton-loader");
      expect(loaders.length).toBeGreaterThan(1);
    });
  });

  describe("ErrorBoundary Component", () => {
    const ProblemChild = () => {
      throw new Error("Test Crash");
    };

    it("catches render errors and displays user friendly fallback UI", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /reload page/i })).toBeInTheDocument();

      spy.mockRestore();
    });
  });
});
