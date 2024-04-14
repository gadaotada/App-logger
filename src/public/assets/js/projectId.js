document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.actions-overlay');
    overlay.addEventListener('click', function(e) {
        if (overlay && overlay.classList.contains('active') && e.target === overlay) {
            overlay.classList.remove('active');
            overlay.innerHTML = '';
            document.body.style.overflow = '';
        }
    });

});

function toggleOverlay(logId) {
    const overlay = document.querySelector('.actions-overlay');
    overlay.classList.toggle('active');
    document.body.style.overflow = 'hidden';
    // build a card with the error information
    const card = document.createElement('div');
    card.classList.add('err-card');
    // get the data from the tr with the logId
    const tr = document.querySelector(`tr[data-id="${logId}"]`);
    const data = tr.querySelectorAll('td');
    const type = data[0].textContent;
    const code = data[1].textContent;
    const location = data[2].textContent;
    const time = data[3].textContent;
    const message = data[4].textContent;

    card.innerHTML = `
        <div class="err-card-header">
            <h3>${type}</h3>
        </div>
        <div class="err-card-body">
            <p><strong>Code:</strong> ${code}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Message:</strong> ${message}</p>
        </div>
    `;

    overlay.appendChild(card);
}