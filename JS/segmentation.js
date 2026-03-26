function translateSeg() {
    let segmentNumber = parseInt(document.getElementById("segmentNumber").value);
    let offset = parseInt(document.getElementById("offset").value);
    let segmentTableInput = document.getElementById("segmentTable").value;

    let segments = segmentTableInput.split(",");
    let segment = segments[segmentNumber].split("-");

    let base = parseInt(segment[0]);
    let limit = parseInt(segment[1]);

    if (offset > limit) {
        document.getElementById("result").innerHTML =
            "<p style='color:red;'>Invalid Address: Offset exceeds limit</p>";
        return;
    }

    let physicalAddress = base + offset;

    let output = `
        <p><b>Base Address:</b> ${base}</p>
        <p><b>Limit:</b> ${limit}</p>
        <p><b>Physical Address:</b> ${physicalAddress}</p>
    `;

    document.getElementById("result").innerHTML = output;
}