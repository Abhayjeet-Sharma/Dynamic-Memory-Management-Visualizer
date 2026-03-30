function simulateVM() {
    let refString = document.getElementById("refString").value.split(" ");
    let frames = parseInt(document.getElementById("frames").value);
    let algorithm = document.getElementById("algorithm").value;

    if (algorithm === "FIFO") {
        fifoVM(refString, frames);
    } else {
        lruVM(refString, frames);
    }
}

function fifoVM(refString, frames) {
    let memory = [];
    let faults = 0;
    let pointer = 0;

    let output = "<h3>RAM (Physical Memory)</h3>";
    output += "<table><tr><th>Step</th><th>Page</th>";

    for (let i = 0; i < frames; i++) {
        output += "<th>Frame " + (i+1) + "</th>";
    }

    output += "<th>Status</th></tr>";

    refString.forEach((page, step) => {
        let status = "Hit (Already in RAM)";

        if (!memory.includes(page)) {
            memory[pointer] = page;
            pointer = (pointer + 1) % frames;
            faults++;
            status = "Page Fault (Loaded from Disk)";
        }

        output += `<tr>
            <td>${step + 1}</td>
            <td>${page}</td>`;

        for (let i = 0; i < frames; i++) {
            output += `<td>${memory[i] || "-"}</td>`;
        }

        output += `<td>${status}</td></tr>`;
    });

    output += "</table>";
    output += `<p><b>Total Page Faults:</b> ${faults}</p>`;
    output += `<p><b>Page Fault Rate:</b> ${(faults / refString.length).toFixed(2)}</p>`;

    document.getElementById("output").innerHTML = output;
}

function lruVM(refString, frames) {
    let memory = [];
    let recent = [];
    let faults = 0;

    let output = "<h3>RAM (Physical Memory)</h3>";
    output += "<table><tr><th>Step</th><th>Page</th>";

    for (let i = 0; i < frames; i++) {
        output += "<th>Frame " + (i+1) + "</th>";
    }

    output += "<th>Status</th></tr>";

    refString.forEach((page, step) => {
        let status = "Hit (Already in RAM)";

        if (!memory.includes(page)) {
            if (memory.length < frames) {
                memory.push(page);
            } else {
                let lruPage = recent.shift();
                let index = memory.indexOf(lruPage);
                memory[index] = page;
            }
            faults++;
            status = "Page Fault (Loaded from Disk)";
        } else {
            recent.splice(recent.indexOf(page), 1);
        }

        recent.push(page);

        output += `<tr>
            <td>${step + 1}</td>
            <td>${page}</td>`;

        for (let i = 0; i < frames; i++) {
            output += `<td>${memory[i] || "-"}</td>`;
        }

        output += `<td>${status}</td></tr>`;
    });

    output += "</table>";
    output += `<p><b>Total Page Faults:</b> ${faults}</p>`;
    output += `<p><b>Page Fault Rate:</b> ${(faults / refString.length).toFixed(2)}</p>`;

    document.getElementById("output").innerHTML = output;
}
