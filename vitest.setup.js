import React from "react";
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("next/link", () => ({
    __esModule: true,
    default: React.forwardRef(({ href, children, ...props }, ref) =>
        React.createElement("a", { ref, href, ...props }, children)
    ),
}));

class MockResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = MockResizeObserver;
}
