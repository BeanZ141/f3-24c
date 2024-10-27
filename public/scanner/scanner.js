let scannedTicketId = null;

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {
    const resultContainer = document.getElementById("qr-reader-results");
    const validationResult = document.getElementById("validation-result");
    const qrReaderContainer = document.querySelector(".container");
    const qrReaderCheckIn = document.querySelector(".check-in");
    const toggleManualCheckIn = document.getElementById("manual-check-in-toggle");
    let lastResult, countResults = 0;

    qrReaderContainer.style.display = "none";
    qrReaderCheckIn.style.display = "none";
    toggleManualCheckIn.style.display = "none";

    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            countResults++;
            lastResult = decodedText;
            scannedTicketId = decodedText;
            validateTicket(decodedText);
        }
    }

    function startScanning() {
        qrReaderContainer.style.display = "block";
        qrReaderCheckIn.style.display = "block";
        toggleManualCheckIn.style.display = "block";
    }

    const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 30, qrbox: 350 });
    html5QrcodeScanner.render(onScanSuccess, startScanning);
});

// Checks if the ticket is valid/exists in the database and checks-in if true
async function validateTicket(ticketId) {
    const { data, error } = await supabase
        .from('ticket_ids')
        .select('used')
        .eq('tickets', ticketId)
        .single();

    const resultElement = document.getElementById('validation-result');
    const resultContainer = document.getElementById("qr-reader-results");

    resultElement.style.display = "block";

    if (error) {
        resultElement.innerHTML = `<span class="validation-result" style="color: black; background-color: #ff8800;">TICKET ID DOES NOT EXIST</span>`;
        return;
    }

    if (data) {
        if (!data.used) {
            resultElement.innerHTML = `<span class="validation-result" style="color: black; background-color: #00ff00;">VALID TICKET ID</span>`;
            resultContainer.innerHTML = `<div>TICKET ID: ${ticketId}</div>`;
        } else {
            resultElement.innerHTML = `<span class="validation-result" style="color: black; background-color: red;">TICKET ID ALREADY IN USE</span>`;
        }
    } else {
        resultElement.innerHTML = `<span class="validation-result" style="color: black; background-color: #ff8800;">TICKET ID DOES NOT EXIST</span>`;
    }
}

async function validateAndCheckInTicket(manual = false) {
    if (!scannedTicketId && !manual) {
        alert("Please scan a ticket first.");
        return;
    }

    const { data, error } = await supabase
        .from('ticket_ids')
        .select('used')
        .eq('tickets', scannedTicketId)
        .single();

    const resultElement = document.getElementById('validation-result');
    const resultContainer = document.getElementById("qr-reader-results");
    const qrReaderCheckIn = document.querySelector(".check-in");

    if (error) {
        resultElement.innerHTML = `<span class="validation-result" style="color: black; background-color: #fcba03;">TICKET ID DOES NOT EXIST</span>`;
        return;
    }

    if (data && !data.used) {
        await markTicketAsUsed(scannedTicketId);
        await logAttendance(scannedTicketId, 'scan');
        resultContainer.innerHTML = `<div style="background-color: #00ff00;">TICKET ID: ${scannedTicketId}</div>`;
        resultElement.innerHTML = `<span class="validation-result" style="color: black; background-color: #00ff00;">CHECKED IN</span>`;

        const originalColor = qrReaderCheckIn.style.backgroundColor;
        qrReaderCheckIn.style.backgroundColor = "#00ff00";
        setTimeout(() => { qrReaderCheckIn.style.backgroundColor = originalColor; }, 1300);

        setTimeout(() => {
            scannedTicketId = null;
            resultElement.innerHTML = "";
            resultContainer.innerHTML = "";
            document.getElementById('manual-check-in').style.display = 'none';
        }, 1300);

    } else if (data && data.used) {
        resultElement.innerHTML = `<span class="validation-result" style="color: black; background-color: red;">TICKET ID ALREADY IN USE</span>`;
    } else {
        resultElement.innerHTML = `<span class="validation-result" style="color: black; background-color: #fcba03;">TICKET ID DOES NOT EXIST</span>`;
    }
}

// Marks ticket as used when checked in
async function markTicketAsUsed(ticketId) {
    const { error } = await supabase
        .from('ticket_ids')
        .update({ used: true })
        .eq('tickets', ticketId);

    if (error) {
        const resultElement = document.getElementById('validation-result');
        resultElement.innerHTML = "Error checking ticket.";
        console.error("Error updating ticket:", error.message);
    }
}

// Manual check in
function toggleManualCheckIn() {
    const manualCheckInDiv = document.getElementById("manual-check-in");
    manualCheckInDiv.style.display = (manualCheckInDiv.style.display === "none") ? "block" : "none";
}

async function manualCheckIn() {
    const ticketIdInput = document.getElementById("manual-ticket-id");
    const ticketId = ticketIdInput.value.trim();
    scannedTicketId = ticketId;
    await validateAndCheckInTicket(true);

    await logAttendance(ticketId, 'manual');

    ticketIdInput.value = "";
}


// Attendence logging
async function logAttendance(ticketId) {
    const { error } = await supabase
        .from('attendance_log')
        .insert([
            { ticket_id: ticketId, }
        ]);

    if (error) {
        console.error("Error logging attendance:", error.message);
    }
}