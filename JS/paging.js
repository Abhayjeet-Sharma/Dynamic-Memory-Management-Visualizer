function runPaging() {
    // Read Inputs
    let numPrograms = parseInt(document.getElementById("numPrograms").value);
    let programSizes = document.getElementById("programSizes").value.split(",");
    let pageSize = parseInt(document.getElementById("pageSize").value);
    let physicalMemory = parseInt(document.getElementById("physicalMemory").value);
    let refString = document.getElementById("refString").value.split(" ");
    let algorithm = document.getElementById("algorithm").value;

    // Calculate Pages per Program
    let totalPages = 0;
    let pagesPerProgram = [];

    for (let size of programSizes) {
        let pages = Math.ceil(parseInt(size) / pageSize);
        pagesPerProgram.push(pages);
        totalPages += pages;
    }

    // Calculate Frames
    let frames = Math.floor(physicalMemory / pageSize);

    // Display Basic Info
    let output = `
        <h3>Simulation Info</h3>
        <p>Total Programs: ${numPrograms}</p>
        <p>Total Pages: ${totalPages}</p>
        <p>Total Frames: ${frames}</p>
        <p>Page Size: ${pageSize}</p>
        <hr>
    `;

    // Run Algorithm
    if (algorithm === "FIFO") {
        output += fifoSim(refString, frames);
    } else {
        output += lruSim(refString, frames);
    }

    document.getElementById("output").innerHTML = output;
}


// FIFO Simulation
function fifoSim(refString, frames) {
    let memory = [];
    let pointer = 0;
    let faults = 0;

    let table = "<h3>FIFO Simulation</h3>";
    table += "<table><tr><th>Step</th><th>Page</th>";

    for (let i = 0; i < frames; i++) {
        table += "<th>Frame " + (i+1) + "</th>";
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

        table += "<td>" + status + "</td>";
        table += "</tr>";
    });

    table += "</table>";
    table += "<p><b>Total Page Faults:</b> " + faults + "</p>";

    return table;
}


// LRU Simulation
function lruSim(refString, frames) {
    let memory = [];
    let recent = [];
    let faults = 0;

    let table = "<h3>LRU Simulation</h3>";
    table += "<table><tr><th>Step</th><th>Page</th>";

    for (let i = 0; i < frames; i++) {
        table += "<th>Frame " + (i+1) + "</th>";
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

        table += "<td>" + status + "</td>";
        table += "</tr>";
    });

    table += "</table>";
    table += "<p><b>Total Page Faults:</b> " + faults + "</p>";

    return table;
}