import { describe, it, expect } from "vitest";
import {
  buildRendererRegistry,
  listRendererTypes,
  registerExternalRenderer,
  validateRegistry,
  getRenderer,
} from "../renderers/registry.js";
import { RENDER_TYPES } from "../utils.js";

// Dummy external renderer for plugin injection tests
class ExternalInputRendererMock {
  getType() {
    return RENDER_TYPES.INPUT;
  }
  render() {
    return "<div>external</div>";
  }
}

class ExternalNewRendererMock {
  getType() {
    return RENDER_TYPES.SINGLE_CHOICE;
  }
  render() {
    return "<div>single external</div>";
  }
}

class InvalidTypeRenderer {
  getType() {
    return "TotallyInvalidType";
  }
  render() {
    return "<div>invalid</div>";
  }
}

describe("renderer registry", () => {
  it("builds a registry with known types", () => {
    const registry = buildRendererRegistry({ devLog: false });
    const types = listRendererTypes(registry);
    // Ensure at least one known type is present
    expect(types.length).toBeGreaterThan(0);
    // All types in registry should be in RENDER_TYPES
    const validValues = new Set(Object.values(RENDER_TYPES));
    types.forEach((t) => expect(validValues.has(t)).toBe(true));
  });

  it("validateRegistry returns missing types array (may be empty)", () => {
    const registry = buildRendererRegistry({ devLog: false });
    const { missing } = validateRegistry(registry);
    // missing is allowed but should not be undefined
    expect(Array.isArray(missing)).toBe(true);
  });

  it("getRenderer returns null for unknown type", () => {
    const registry = buildRendererRegistry({ devLog: false });
    expect(getRenderer(registry, "NotExisting")).toBeNull();
  });

  it("registerExternalRenderer rejects duplicate type", () => {
    const registry = buildRendererRegistry({ devLog: false });
    // Attempt to re-register an existing type (INPUT likely exists already)
    expect(() =>
      registerExternalRenderer(registry, ExternalInputRendererMock),
    ).toThrow();
  });

  it("registerExternalRenderer allows adding a new valid type when not yet present", () => {
    // To simulate a new type, we first ensure SINGLE_CHOICE is removed if present (create fresh map)
    const registry = buildRendererRegistry({ devLog: false });
    if (registry.has(RENDER_TYPES.SINGLE_CHOICE)) {
      registry.delete(RENDER_TYPES.SINGLE_CHOICE); // simulate missing
    }
    const addedType = registerExternalRenderer(
      registry,
      ExternalNewRendererMock,
    );
    expect(addedType).toBe(RENDER_TYPES.SINGLE_CHOICE);
    expect(registry.has(RENDER_TYPES.SINGLE_CHOICE)).toBe(true);
  });

  it("registerExternalRenderer rejects invalid type renderer", () => {
    const registry = buildRendererRegistry({ devLog: false });
    expect(() =>
      registerExternalRenderer(registry, InvalidTypeRenderer),
    ).toThrow();
  });
});
