let processes = [];

const RAM_SIZE = 2048; // MB
let usedMemory = 0;
let currentAddress = 0;

// 🔹 Add Process
function addProcess() {
    const name = document.getElementById("processName").value.trim();
    const size = parseInt(document.getElementById("processSize").value);

    if (!name || isNaN(size) || size <= 0) {
        alert("Enter valid process name and size");
        return;
    }

    // 🚫 Memory check
    if (usedMemory + size > RAM_SIZE) {
        alert("Not enough memory!");
        return;
    }

    // 🔹 Split size into segments
    const segments = splitIntoSegments(size);

    // 🔹 Assign base addresses
    segments.forEach(seg => {
        seg.base = currentAddress;
        currentAddress += seg.limit;
    });

    const process = { name, segments };

    processes.push(process);

    usedMemory += size;

    updateMemoryDisplay();
    renderProcesses();
    renderRAM();

    // clear inputs
    document.getElementById("processName").value = "";
    document.getElementById("processSize").value = "";
}

// 🔹 Split total size into Code/Data/Heap/Stack
function splitIntoSegments(total) {
    // random distribution but sum = total
    let code = Math.floor(total * (0.2 + Math.random() * 0.2));
    let data = Math.floor(total * (0.1 + Math.random() * 0.2));
    let heap = Math.floor(total * (0.3 + Math.random() * 0.3));
    let stack = total - (code + data + heap);

    return [
        { name: "Code", limit: code },
        { name: "Data", limit: data },
        { name: "Heap", limit: heap },
        { name: "Stack", limit: stack }
    ];
}

// 🔹 Update memory stats
function updateMemoryDisplay() {
    document.getElementById("usedMem").textContent = usedMemory;
    document.getElementById("freeMem").textContent = RAM_SIZE - usedMemory;
}

// 🔹 Render process list
function renderProcesses() {
    const list = document.getElementById("processList");
    list.innerHTML = "";

    processes.forEach((p, index) => {
        const li = document.createElement("li");
        li.textContent = `${p.name} (${getProcessSize(p)} MB)`;
        li.style.cursor = "pointer";

        li.onclick = () => showSegmentTable(index);

        list.appendChild(li);
    });
}

// 🔹 Calculate total process size
function getProcessSize(process) {
    return process.segments.reduce((sum, seg) => sum + seg.limit, 0);
}

// 🔹 Render RAM
function renderRAM() {
    const ram = document.getElementById("ramBox");
    ram.innerHTML = "";

    processes.forEach((p, index) => {
        p.segments.forEach(seg => {
            const div = document.createElement("div");

            div.className = "block segment";
            div.textContent = `${p.name} - ${seg.name} (${seg.limit} MB)`;

            // height proportional to size
            div.style.flex = seg.limit;

            div.onclick = () => showSegmentTable(index);

            ram.appendChild(div);
        });
    });

    // free memory block
    let free = RAM_SIZE - usedMemory;
    if (free > 0) {
        const freeDiv = document.createElement("div");
        freeDiv.className = "block free";
        freeDiv.textContent = `Free (${free} MB)`;
        freeDiv.style.flex = free;
        ram.appendChild(freeDiv);
    }
}

// 🔹 Show segment table
function showSegmentTable(index) {
    const table = document.getElementById("segmentTable");
    table.innerHTML = "";

    processes[index].segments.forEach(seg => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${seg.name}</td>
            <td>${seg.base}</td>
            <td>${seg.limit}</td>
        `;

        table.appendChild(row);
    });
}
