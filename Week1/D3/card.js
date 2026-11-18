/**
 * Escapes unsafe characters to prevent Cross-Site Scripting (XSS)
 * @param {*} str - Raw input value
 * @returns {string} - HTML-safe sanitized string
 */
function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Generates the HTML markup for an employee card
 * @param {Object} emp - The employee data object
 * @returns {string} - Sanitized HTML string representing the card
 */
export function createEmployeeCard(emp) {
    let statusClass = "active";
    if (emp?.status === "On Leave") {
        statusClass = "on-leave";
    } else if (emp?.status === "Inactive") {
        statusClass = "inactive";
    }

    const safeName = escapeHTML(emp?.name ?? "Unnamed Employee");
    const safeRole = escapeHTML(emp?.role ?? "Staff");
    const safeDept = escapeHTML(emp?.department ?? "N/A");
    const safeLoc = escapeHTML(emp?.location ?? "N/A");
    const safeStatus = escapeHTML(emp?.status ?? "Active");
    const safeEmail = escapeHTML(emp?.email ?? "N/A");
    const safePhone = escapeHTML(emp?.phone ?? "N/A");
    const safeDate = escapeHTML(emp?.joinedDate ?? "N/A");
    const safeAvatar = escapeHTML(emp?.avatar ?? "");

    const encodedName = encodeURIComponent(emp?.name ?? "User");
    const avatarFallback = `https://ui-avatars.com/api/?name=${encodedName}&background=007bff&color=fff`;

    return `
        <div class="card">
            <div class="card-header">
                <img 
                    class="avatar" 
                    src="${safeAvatar}" 
                    alt="${safeName}" 
                    onerror="this.onerror=null; this.src='${avatarFallback}';"
                >
                <div class="employee-info">
                    <h3>${safeName}</h3>
                    <p>${safeRole}</p>
                </div>
            </div>
            <div class="card-body">
                <div class="card-row">
                    <span>Department:</span>
                    <strong>${safeDept}</strong>
                </div>
                <div class="card-row">
                    <span>Location:</span>
                    <strong>${safeLoc}</strong>
                </div>
                <div class="card-row">
                    <span>Status:</span>
                    <span class="status-pill ${statusClass}">${safeStatus}</span>
                </div>
                <div class="card-row">
                    <span>Email:</span>
                    <span>${safeEmail}</span>
                </div>
                <div class="card-row">
                    <span>Phone:</span>
                    <span>${safePhone}</span>
                </div>
                <div class="card-row">
                    <span>Joined:</span>
                    <span>${safeDate}</span>
                </div>
            </div>
        </div>
    `;
}