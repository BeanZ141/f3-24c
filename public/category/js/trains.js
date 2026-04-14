// Train search functionality
function searchTrains() {
    const fromSelect = document.querySelector("#from .select-selected");
    const toSelect = document.querySelector("#to .select-selected");
    
    if (!fromSelect || !toSelect || !fromSelect.dataset.value || !toSelect.dataset.value) {
        if (window.showAlert) {
            showAlert("Please select both source and destination.", "error");
        } else {
            alert("Please select both source and destination.");
        }
        return;
    }
    
    const from = fromSelect.dataset.value;
    const to = toSelect.dataset.value;
    
    window.location.href = `../category/train-results.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
}

// Any other train-page specific logic can go here
document.addEventListener('DOMContentLoaded', () => {
    console.log('Trains page initialized');
});
