function simulate() {
    let refString = document.getElementById("refString").value.split(" ");
    let frames = parseInt(document.getElementById("frames").value);
    let algorithm = document.getElementById("algorithm").value;

    if (algorithm === "FIFO") {
        fifo(refString, frames);
    } else {
        lru(refString, frames);
    }
}

function fifo(refString, frames) {
    let memory = [];
    let faults = 0;
    let pointer = 0;

    let output = "<table><tr><th>Page</th>";

    for (let i = 0; i < frames; i++) {
        output += "<th>Frame " + (i+1) + "</th>";
    }
    output += "<th>Status</th></tr>";

    for (let page of refString) {
        let status = "Hit";

        if (!memory.includes(page)) {
            memory[pointer] = page;
            pointer = (pointer + 1) % frames;
            faults++;
            status = "Fault";
        }

        output += "<tr><td>" + page + "</td>";
        for (let i = 0; i < frames; i++) {
            output += "<td>" + (memory[i] || "-") + "</td>";
        }
        output += "<td>" + status + "</td></tr>";
    }

    output += "</table>";
    output += "<p>Total Page Faults: " + faults + "</p>";

    document.getElementById("output").innerHTML = output;
}

function lru(refString, frames) {
    let memory = [];
    let recent = [];
    let faults = 0;

    let output = "<table><tr><th>Page</th>";

    for (let i = 0; i < frames; i++) {
        output += "<th>Frame " + (i+1) + "</th>";
    }
    output += "<th>Status</th></tr>";

    for (let page of refString) {
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

        output += "<tr><td>" + page + "</td>";
        for (let i = 0; i < frames; i++) {
            output += "<td>" + (memory[i] || "-") + "</td>";
        }
        output += "<td>" + status + "</td></tr>";
    }

    output += "</table>";
    output += "<p>Total Page Faults: " + faults + "</p>";

    document.getElementById("output").innerHTML = output;
}