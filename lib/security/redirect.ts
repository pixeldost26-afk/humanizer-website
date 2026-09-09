/**
 * Security Utility: Redirect URL Validation & Sanitization
 *
 * Prevents Open Redirect vulnerabilities (CWE-601) by ensuring all redirects
 * are strictly constrained to internal relative application paths.
 * Disallows external domains, protocol-relative paths ("//"), backslash evasion ("/\"),
 * control characters, and non-http schemes (e.g. javascript:, data:).
 */

export function getSafeRedirectUrl(
  url: string | null | undefined,
  fallback: string = "/dashboard"
): string {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  const trimmed = url.trim();

  // Must begin with a single "/" and must not begin with "//" or "/\"
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return fallback;
  }

  // Reject newlines, carriage returns, tabs, null bytes, or backslashes
  if (/[\r\n\t\0\\]/.test(trimmed)) {
    return fallback;
  }

  try {
    // Parse relative to a dummy origin to inspect the resolved URL
    const dummyOrigin = "http://localhost";
    const parsed = new URL(trimmed, dummyOrigin);

    // Verify the origin didn't mutate (e.g. via scheme tricks or authority parsing)
    if (parsed.origin !== dummyOrigin) {
      return fallback;
    }

    // Disallow javascript: or other pseudo-protocols
    if (parsed.protocol !== "http:") {
      return fallback;
    }

    // Ensure the pathname strictly begins with a single "/" and not "//"
    if (!parsed.pathname.startsWith("/") || parsed.pathname.startsWith("//")) {
      return fallback;
    }

    // Return the sanitized relative path including query and hash
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}
