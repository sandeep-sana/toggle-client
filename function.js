export function subDomain() {
    const host = window.location.hostname;
    const parts = host.split(".");
    if (parts.length < 2) {
        return "toggle";
    }
    const subdomain = parts[0];
    if (subdomain === process.env.DOMAIN) {
        return "toggle";
    }else if(subdomain === "beta"){
        return "toggle";
    }
    return subdomain || "toggle";
}