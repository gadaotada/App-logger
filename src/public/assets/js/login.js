document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('logginForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
           window.location.href = '/admin';
        } else {
            const data = await response.json();
            alert(data.error);
        }
    });
});
