const DAILY_GOAL = 200;
let currentTotal = 0.00;
const tableBody = document.querySelector('#savings-table tbody');
const totalDisplay = document.getElementById('current-total');

/**
 * Calculates and formats the current date, day, and time in DD/MM/YYYY format.
 */
function getDateTimeString() {
    const now = new Date();
    // Using en-GB for DD/MM/YYYY format
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${date} (${day}) at ${time}`;
}

/**
 * Adds a new entry to the tracker table and updates the total.
 */
function addEntry() {
    const type = document.getElementById('activity-type').value;
    const amountInput = document.getElementById('amount');
    const reason = document.getElementById('reason').value.trim();

    if (!amountInput.value) {
        alert('Please enter a valid amount.');
        return;
    }

    const amount = parseFloat(amountInput.value);
    let sign = (type === 'deposit') ? 1 : -1;
    const signedAmount = amount * sign;

    // Update Total
    currentTotal += signedAmount;

    // Format amount display
    const amountClass = (type === 'deposit') ? 'deposit' : 'withdrawal';
    const amountText = (type === 'deposit' ? '+' : '-') + amount.toFixed(2);
    
    // Logic for missed goal (only applies to deposits)
    let reasonText = reason;
    if (type === 'deposit' && amount < DAILY_GOAL) {
        reasonText = reason || `MISSED GOAL: Saved only $${amount.toFixed(2)} instead of $${DAILY_GOAL.toFixed(2)}`;
    } else if (type === 'deposit' && amount >= DAILY_GOAL) {
        reasonText = reason || 'GOAL ACHIEVED! 🎉';
    } else if (type === 'withdrawal') {
        reasonText = reason || 'N/A';
    }
    
    // Create new table row
    const newRow = tableBody.insertRow(0); // Insert at the top
    
    newRow.insertCell(0).textContent = getDateTimeString();
    newRow.insertCell(1).textContent = type.toUpperCase();
    newRow.insertCell(2).innerHTML = `<span class="${amountClass}">$${amountText}</span>`;
    newRow.insertCell(3).textContent = reasonText;
    
    // The running total column
    const totalCell = newRow.insertCell(4);
    totalCell.textContent = 'Rs' + currentTotal.toFixed(2);
    totalCell.style.fontWeight = 'bold'; // Emphasize the running total

    // Update the main total display
    totalDisplay.textContent = currentTotal.toFixed(2);

    // Clear input fields for next entry
    amountInput.value = '';
    document.getElementById('reason').value = '';
}

// Initialize with a starting zero entry
function initializeTracker() {
    const initialRow = tableBody.insertRow();
    initialRow.insertCell(0).textContent = new Date().toLocaleDateString('en-GB');
    initialRow.insertCell(1).textContent = 'START';
    initialRow.insertCell(2).textContent = 'Rs.0.00';
    initialRow.insertCell(3).textContent = 'N/A';
    const totalCell = initialRow.insertCell(4);
    totalCell.textContent = 'Rs.0.00';
    totalCell.style.fontWeight = 'bold';
}

// Run the initialization function when the script loads
initializeTracker();
