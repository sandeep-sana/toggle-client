export function subDomain() {
    if (typeof window === "undefined" || !window.location) {
        return "toggle";
    }

    const host = window.location.hostname || "";
    const parts = host.split(".").filter(Boolean);
    if (parts.length < 2) {
        return "toggle";
    }

    const subdomain = parts[0]?.toLowerCase() || "";
    if (!subdomain || subdomain === "www" || subdomain === "beta") {
        return "toggle";
    }

    return subdomain;
}