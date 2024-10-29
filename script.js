// script.js

let clients = JSON.parse(localStorage.getItem('clients')) || [];  // Load saved clients or initialize empty array

function saveClientsToStorage() {
    localStorage.setItem('clients', JSON.stringify(clients));  // Save clients to local storage
}

function searchClient() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const clientRecords = document.getElementById("clientRecords");
    clientRecords.innerHTML = '';  // Clear previous search results

    const client = clients.find(c => c.name.toLowerCase() === searchInput);

    if (client) {
        clientRecords.innerHTML = `
            <h2>Client: ${client.name}</h2>
            ${client.loans.map((loan, index) => `
                <div>
                    <p>Loan Amount: ${loan.amount} UGX</p>
                    <p>Loan Date: ${loan.date}</p>
                    <p>Payment Due: ${calculatePaymentDue(loan.amount, loan.date)}</p>
                    <p>Status: ${loan.status}</p>
                    <button onclick="updateLoanStatus('${client.name}', ${index})">
                        ${loan.status === 'active' ? 'Complete Loan' : 'Re-activate Loan'}
                    </button>
                </div>
            `).join('')}
            <button onclick="window.location.href='client.html'">Add New Loan</button>
        `;
    } else {
        clientRecords.innerHTML = `<p>Client not found</p>`;
    }
}

function addClient() {
    const clientName = document.getElementById('clientName').value;
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const loanDate = document.getElementById('loanDate').value;

    if (clientName && loanAmount && loanDate) {
        const client = clients.find(c => c.name === clientName);

        if (client) {
            client.loans.push({ amount: loanAmount, date: loanDate, status: 'active' });
        } else {
            clients.push({ name: clientName, loans: [{ amount: loanAmount, date: loanDate, status: 'active' }] });
        }

        saveClientsToStorage();  // Save to local storage
        alert('Client and loan added successfully!');
        window.location.href = 'records.html';
    } else {
        alert('Please fill all fields.');
    }
}

function updateLoanStatus(clientName, loanIndex) {
    const client = clients.find(c => c.name === clientName);
    if (client) {
        const loan = client.loans[loanIndex];
        loan.status = loan.status === 'active' ? 'completed' : 'active';
        saveClientsToStorage();  // Save updated status to local storage
        searchClient();  // Refresh search results
    }
}

function calculatePaymentDue(loanAmount, loanDate) {
    const interestRate = 0.10;
    const penalty = 100000;
    const loanDateObj = new Date(loanDate);
    const currentDate = new Date();
    const daysElapsed = Math.floor((currentDate - loanDateObj) / (1000 * 60 * 60 * 24));

    if (loanAmount < 1000000) {
        if (daysElapsed <= 7) return loanAmount;
        else if (daysElapsed <= 28) return loanAmount + penalty;
        else {
            const monthsElapsed = (daysElapsed - 28) / 30;
            const interest = loanAmount * Math.pow(1 + interestRate, monthsElapsed) - loanAmount;
            return loanAmount + penalty + interest;
        }
    } else {
        const monthsElapsed = daysElapsed / 30;
        const interest = loanAmount * Math.pow(1 + interestRate, monthsElapsed) - loanAmount;
        return loanAmount + interest;
    }
}

// Load data on page load
window.onload = () => {
    clients = JSON.parse(localStorage.getItem('clients')) || [];
};
