import * as Penner from "./external/penner";

/**
 * Returns correct Penner equation using string or Function.
 *
 * @internal
 * @ignore
 * @param {(function|string)} [ease]
 * @param {defaults} default penner equation to use if none is provided
 */

export default function ease(ease: any, defaults?: string): any {
  if (!ease) {
    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: easing functions are dynamically selected
    return Penner[defaults as keyof typeof Penner];
  } else if (typeof ease === "function") {
    return ease;
  } else if (typeof ease === "string") {
    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: easing functions are dynamically selected
    return Penner[ease as keyof typeof Penner];
  }
}
