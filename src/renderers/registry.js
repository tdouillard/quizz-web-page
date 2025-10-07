import { RENDER_TYPES } from "../utils.js";

// Precompute acceptable type labels (values of RENDER_TYPES)
const VALID_TYPES = new Set(Object.values(RENDER_TYPES));

// Auto-discover all renderer modules in this folder except the registry itself & base
const modules = import.meta.glob("./*Renderer.js", { eager: true });

function extractRendererClass(mod) {
  if (mod.defaultRenderer) return mod.defaultRenderer;
  if (mod.default && typeof mod.default === "function") return mod.default;
  for (const key of Object.keys(mod)) {
    const candidate = mod[key];
    if (
      typeof candidate === "function" &&
      candidate.prototype &&
      typeof candidate.prototype.render === "function"
    ) {
      return candidate;
    }
  }
  return null;
}

function inferTypeFromClass(RendererClass) {
  try {
    const instance = new RendererClass();
    if (typeof instance.getType === "function") return instance.getType();
  } catch (_) {}
  const name = RendererClass.name.replace(/Renderer$/, "").toLowerCase();
  const mapping = Object.entries(RENDER_TYPES).find(
    ([, label]) =>
      label.toLowerCase() === name ||
      label.toLowerCase().replace(/\s+/g, "") === name,
  );
  return mapping ? mapping[1] : RendererClass.name;
}

export function buildRendererRegistry({
  devLog = import.meta.env && import.meta.env.DEV,
} = {}) {
  const map = new Map();
  Object.entries(modules).forEach(([path, mod]) => {
    if (/BaseQuestionRenderer/.test(path) || /registry\.js$/.test(path)) return;
    const RendererClass = extractRendererClass(mod);
    if (!RendererClass) return;
    try {
      const instance = new RendererClass();
      const type =
        typeof instance.getType === "function"
          ? instance.getType()
          : inferTypeFromClass(RendererClass);
      if (!type) {
        console.warn(`[renderer-registry] Empty type for ${path}, skipping.`);
        return;
      }
      if (!VALID_TYPES.has(type)) {
        console.warn(
          `[renderer-registry] Type "${type}" from ${path} is not in RENDER_TYPES; skipping (enforce whitelist).`,
        );
        return;
      }
      if (map.has(type)) {
        console.warn(
          `[renderer-registry] Duplicate type "${type}" at ${path} – keeping first.`,
        );
        return;
      }
      map.set(type, instance);
    } catch (e) {
      console.error(`[renderer-registry] Failed to register ${path}:`, e);
    }
  });
  if (devLog) {
    console.info(
      "[renderer-registry] Registered types:",
      Array.from(map.keys()).join(", ") || "(none)",
    );
  }
  return map;
}

export function listRendererTypes(registry) {
  return Array.from(registry.keys());
}

export function getRenderer(registry, type) {
  return registry.get(type) || null;
}

export function validateRegistry(registry) {
  const registered = new Set(registry.keys());
  const missing = Array.from(VALID_TYPES).filter((t) => !registered.has(t));
  if (missing.length) {
    console.warn(
      "[renderer-registry] Missing renderer(s) for types:",
      missing.join(", "),
    );
  } else {
    console.info("[renderer-registry] All renderer types accounted for.");
  }
  return { missing, total: registered.size };
}

// Allow runtime plugin injection (e.g., loaded dynamically from external bundle)
// RendererClass must implement getType() returning a VALID_TYPES member.
export function registerExternalRenderer(registry, RendererClass) {
  if (typeof RendererClass !== "function")
    throw new Error("RendererClass must be a constructor");
  let instance;
  try {
    instance = new RendererClass();
  } catch (e) {
    throw new Error(`Failed to instantiate external renderer: ${e.message}`);
  }
  const type =
    typeof instance.getType === "function"
      ? instance.getType()
      : inferTypeFromClass(RendererClass);
  if (!type || !VALID_TYPES.has(type)) {
    throw new Error(
      `External renderer type "${type}" is invalid or not in RENDER_TYPES`,
    );
  }
  if (registry.has(type)) {
    throw new Error(`Renderer for type "${type}" already registered`);
  }
  registry.set(type, instance);
  return type;
}
