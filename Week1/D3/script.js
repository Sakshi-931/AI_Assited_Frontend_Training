import { createEmployeeCard } from "./card.js";

const API_URL = "http://localhost:3000/employees";

let allEmployees = [];

const searchInput = document.getElementById("searchInput");
const deptFilter = document.getElementById("deptFilter");
const statusFilter = document.getElementById("statusFilter");
const locationFilter = document.getElementById("locationFilter");
const sortFilter = document.getElementById("sortFilter");
const resetBtn = document.getElementById("resetBtn");
const employeeList = document.getElementById("employeeList");
const employeeCount = document.getElementById("employeeCount");
const messageBox = document.getElementById("messageBox");
const serverStatus = document.getElementById("serverStatus");

function debounce(fn, delay = 250) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

async function fetchEmployees() {
    showMessage("Loading employees from database...", "info");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allEmployees = Array.isArray(data) ? data : [];

        serverStatus.textContent = "Server: Online";
        serverStatus.className = "status-badge online";

        hideMessage();
        filterAndDisplay();
    } catch (error) {
        console.error("Error fetching employees:", error);

        serverStatus.textContent = "Server: Offline";
        serverStatus.className = "status-badge offline";

        showMessage(
            "⚠️ Cannot connect to json-server. Please run: 'npx json-server db.json --static . -p 3000' in your terminal.",
            "error"
        );
    }
}

function displayEmployees(employees) {
    employeeList.innerHTML = employees.map(emp => createEmployeeCard(emp)).join("");
}

function filterAndDisplay() {
    const searchText = (searchInput.value ?? "").toLowerCase().trim();
    const selectedDept = deptFilter.value;
    const selectedStatus = statusFilter.value;
    const selectedLocation = locationFilter.value;
    const selectedSort = sortFilter.value;

    let result = allEmployees.filter(function (emp) {
        const matchSearch =
            (emp.name?.toLowerCase() ?? "").includes(searchText) ||
            (emp.role?.toLowerCase() ?? "").includes(searchText) ||
            (emp.email?.toLowerCase() ?? "").includes(searchText);

        const matchDept = selectedDept === "all" || emp.department === selectedDept;

        const matchStatus = selectedStatus === "all" || emp.status === selectedStatus;

        const matchLocation = selectedLocation === "all" || emp.location === selectedLocation;

        return matchSearch && matchDept && matchStatus && matchLocation;
    });

    if (selectedSort === "name-asc") {
        result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    } else if (selectedSort === "name-desc") {
        result.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
    } else if (selectedSort === "dept") {
        result.sort((a, b) => (a.department ?? "").localeCompare(b.department ?? ""));
    }

    employeeCount.textContent = `Showing ${result.length} of ${allEmployees.length} employees`;

    if (result.length === 0) {
        showMessage("No matching employees found. Try clearing some filters.", "empty");
        employeeList.innerHTML = "";
    } else {
        hideMessage();
        displayEmployees(result);
    }
}

function resetFilters() {
    searchInput.value = "";
    deptFilter.value = "all";
    statusFilter.value = "all";
    locationFilter.value = "all";
    sortFilter.value = "name-asc";

    filterAndDisplay();
}

function showMessage(msg, type) {
    messageBox.style.display = "block";
    messageBox.textContent = msg;

    if (type === "error") {
        messageBox.style.color = "#721c24";
        messageBox.style.backgroundColor = "#f8d7da";
        messageBox.style.border = "1px solid #f5c6cb";
    } else {
        messageBox.style.color = "#555555";
        messageBox.style.backgroundColor = "#ffffff";
        messageBox.style.border = "1px solid #e0e0e0";
    }
}

function hideMessage() {
    messageBox.style.display = "none";
}

const debouncedSearch = debounce(filterAndDisplay, 250);
searchInput.addEventListener("input", debouncedSearch);

deptFilter.addEventListener("change", filterAndDisplay);
statusFilter.addEventListener("change", filterAndDisplay);
locationFilter.addEventListener("change", filterAndDisplay);
sortFilter.addEventListener("change", filterAndDisplay);
resetBtn.addEventListener("click", resetFilters);

window.addEventListener("DOMContentLoaded", fetchEmployees);
