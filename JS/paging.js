function runPaging() {
    let numPrograms = parseInt(document.getElementById("numPrograms").value);
    let programSizes = document.getElementById("programSizes").value.split(",");
    let pageSize = parseInt(document.getElementById("pageSize").value);
    let physicalMemory = parseInt(document.getElementById("physicalMemory").value);
    let refString = document.getElementById("refString").value.split(" ");
    let algorithm = document.getElementById("algorithm").value;

    let totalPages = 0;

    for (let size of programSizes) {
        let pages = Math.ceil(parseInt(size) / pageSize);
        totalPages += pages;
    }

    let frames = Math.floor(physicalMemory / pageSize);

    let output = `
        <div class="simulation-info">
            <h2>Simulation Info</h2>
            <p>Total Programs: ${numPrograms}</p>
            <p>Total Pages: ${totalPages}</p>
            <p>Total Frames: ${frames}</p>
            <p>Page Size: ${pageSize}</p>
        </div>
    `;

    let tableData = "";

    if (algorithm === "FIFO") {
        tableData = fifoSim(refString, frames);
    } else {
        tableData = lruSim(refString, frames);
    }

    output += `
        <h2>${algorithm} Simulation</h2>
        <div class="table-container">
            ${tableData}
        </div>
    `;

    document.getElementById("output").innerHTML = output;

    // Animation
    if (typeof gsap !== "undefined") {
        gsap.from("table tr", {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: 0.05
        });
    }
}


// FIFO Simulation
function fifoSim(refString, frames) {
    let memory = [];
    let pointer = 0;
    let faults = 0;

    let table = "<table><tr><th>Step</th><th>Page</th>";

    for (let i = 0; i < frames; i++) {
        table += "<th>F" + (i+1) + "</th>";
    }

    table += "<th>Status</th></tr>";

    refString.forEach((page, step) => {
        let status = "Hit";

        if (!memory.includes(page)) {
            memory[pointer] = page;
            pointer = (pointer + 1) % frames;
            faults++;
            status = "Fault";
        }

        table += "<tr>";
        table += "<td>" + (step + 1) + "</td>";
        table += "<td>" + page + "</td>";

        for (let i = 0; i < frames; i++) {
            table += "<td>" + (memory[i] || "-") + "</td>";
        }

        let statusClass = status === "Fault" ? "fault" : "hit";

        table += `<td class="${statusClass}">${status}</td>`;
        table += "</tr>";
    });

    table += "</table>";
    table += `<h3 style="margin-top:20px;">🔥 Total Page Faults: ${faults}</h3>`;

    return table;
}


// LRU Simulation
function lruSim(refString, frames) {
    let memory = [];
    let recent = [];
    let faults = 0;

    let table = "<table><tr><th>Step</th><th>Page</th>";

    for (let i = 0; i < frames; i++) {
        table += "<th>F" + (i+1) + "</th>";
    }

    table += "<th>Status</th></tr>";

    refString.forEach((page, step) => {
        let status = "Hit";

        if (!memory.includes(page)) {
            if (memory.length < frames) {
                memory.push(page);
            } else {
                let lruPage = recent.shift();
                let index = memory.indexOf(lruPage);
                memory[index] = page;
            }
            faults++;
            status = "Fault";
        } else {
            recent.splice(recent.indexOf(page), 1);
        }

        recent.push(page);

        table += "<tr>";
        table += "<td>" + (step + 1) + "</td>";
        table += "<td>" + page + "</td>";

        for (let i = 0; i < frames; i++) {
            table += "<td>" + (memory[i] || "-") + "</td>";
        }

        let statusClass = status === "Fault" ? "fault" : "hit";

        table += `<td class="${statusClass}">${status}</td>`;
        table += "</tr>";
    });

    table += "</table>";
    table += `<h3 style="margin-top:20px;">🔥 Total Page Faults: ${faults}</h3>`;

    return table;
}
gsap.from("table tr", {
  opacity: 0,
  y: 20,
  duration: 0.3,
  stagger: 0.05
});
