let currentEditingId = null;

async function fetchContacts() {
    try {
        const response = await fetch('/contacts');
        const contacts = await response.json();

        const tableBody = document.querySelector('#contacts-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>${contact.message}</td>
                <td>
                    <button onclick="editContact('${contact._id}')">Edit</button>
                    <button onclick="deleteContact('${contact._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

async function deleteContact(id) {
    try {
        await fetch(`/contacts/${id}`, { method: 'DELETE' });
        fetchContacts(); // Refresh the list after deletion
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}

function editContact(id) {
    const contactRow = document.querySelector(`button[onclick="editContact('${id}')"]`).closest('tr');
    const cells = contactRow.getElementsByTagName('td');

    // Populate the edit modal with contact details
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-name').value = cells[0].innerText;
    document.getElementById('edit-email').value = cells[1].innerText;
    document.getElementById('edit-phone').value = cells[2].innerText;
    document.getElementById('edit-message').value = cells[3].innerText;

    // Show the edit modal
    document.getElementById('edit-modal').style.display = 'block';
}

document.getElementById('save-edit').addEventListener('click', async () => {
    const id = document.getElementById('edit-id').value;
    const updatedContact = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        message: document.getElementById('edit-message').value
    };

    try {
        await fetch(`/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedContact)
        });
        fetchContacts(); // Refresh the list after editing
        document.getElementById('edit-modal').style.display = 'none'; // Hide the modal
    } catch (error) {
        console.error('Error updating contact:', error);
    }
});

document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none'; // Hide the modal
});

// Fetch contacts when the page loads
document.addEventListener('DOMContentLoaded', fetchContacts);
