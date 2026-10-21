import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FAQ from "../components/All_product/FAQ";
import Footer from "../components/Footer/Footer";
import PrivacyPolicy from "../components/Privacy_policy/PrivacyPolicy";
import TermsOfService from "../components/TermsOfService/TermsOfService";
import ReturnRefundPolicy from "../components/Return/ReturnRefundPolicy";
import api from "../Axios/axiosInstance";

describe("Static Pages & Informational Modules", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("FAQ Component", () => {
    it("renders FAQ questions and toggles answer visibility on click", () => {
      render(
        <MemoryRouter>
          <FAQ />
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { name: /frequently asked questions/i })).toBeInTheDocument();
      const questionBtn = screen.getByText(
        /Are Lovixa perfumes and attars 100% alcohol-free\?/i
      );
      expect(questionBtn).toBeInTheDocument();

      fireEvent.click(questionBtn);

      expect(
        screen.getByText(/strictly 100% alcohol-free, non-toxic/i)
      ).toBeInTheDocument();
    });
  });

  describe("Footer Component", () => {
    it("renders newsletter subscription and policy navigation links", async () => {
      vi.spyOn(api, "get").mockResolvedValue({
        data: {
          results: [
            { id: 1, name: "Perfumes", slug: "perfumes" },
          ],
        },
      });

      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      expect(screen.getByAltText(/lovixa logo/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
      expect(screen.getAllByText(/privacy policy/i)[0]).toBeInTheDocument();
    });
  });

  describe("Policy Components", () => {
    it("renders Privacy Policy, Terms of Service and Return & Refund Policy", () => {
      const { rerender } = render(
        <MemoryRouter>
          <PrivacyPolicy />
        </MemoryRouter>
      );
      expect(screen.getByRole("heading", { name: /privacy policy/i })).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <TermsOfService />
        </MemoryRouter>
      );
      expect(screen.getByRole("heading", { name: /terms of service/i })).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <ReturnRefundPolicy />
        </MemoryRouter>
      );
      expect(screen.getByRole("heading", { name: /refunds & returns policy/i })).toBeInTheDocument();
    });
  });
});
