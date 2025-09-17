// status.js or status.ts
const STATUS = {
    OK: 200,               // Success
    CREATED: 201,          // Resource created
    ACCEPTED: 202,         // Request accepted, processing
    NO_CONTENT: 204,       // Request successful, but no content
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,      // Client-side error (e.g., invalid input)
    UNAUTHORIZED: 401,     // Authentication required
    FORBIDDEN: 403,        // Server understood but refuses action
    NOT_FOUND: 404,        // Resource not found
    INTERNAL_SERVER_ERROR: 500,  // Server error
    SERVICE_UNAVAILABLE: 503   // Service unavailable
};

export default STATUS;
