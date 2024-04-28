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
    const time = data[3].textContent + " " + data[4].textContent;
    const message = data[5].textContent;

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

function handleSearchAndFilters() {
    const projectIdContainer = document.getElementById('projectIdContainer');
    const projectId = projectIdContainer.dataset.projectid;
    const searchInput = document.querySelector('input[type="text"]');
    
    const typeSelect = document.querySelector('select');
    const startDateInput = document.querySelectorAll('input[type="datetime-local"]')[0];
    const endDateInput = document.querySelectorAll('input[type="datetime-local"]')[1];

    const searchBtn = document.querySelector('button');
    const resetBtn = document.querySelectorAll('button')[1];
    
    const storedSearchQuery = sessionStorage.getItem('searchQuery') || '';
    const storedType = sessionStorage.getItem('type') || '';
    const storedStartDate = sessionStorage.getItem('startDate') || '';
    const storedEndDate = sessionStorage.getItem('endDate') || '';

    searchInput.value = storedSearchQuery;
    typeSelect.value = storedType;
    startDateInput.value = storedStartDate;
    endDateInput.value = storedEndDate;

    searchBtn.addEventListener('click', () => {
        const searchQuery = searchInput.value.trim();
        const type = typeSelect.value;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        sessionStorage.setItem('searchQuery', searchQuery);
        sessionStorage.setItem('type', type);
        sessionStorage.setItem('startDate', startDate);
        sessionStorage.setItem('endDate', endDate);

        window.location.href = `/admin/projects/${projectId}?searchQuery=${searchQuery}&type=${type}&startDate=${startDate}&endDate=${endDate}&page=1`;
    });

    resetBtn.addEventListener('click', () => {
  
        sessionStorage.removeItem('searchQuery');
        sessionStorage.removeItem('type');
        sessionStorage.removeItem('startDate');
        sessionStorage.removeItem('endDate');

        searchInput.value = '';
        typeSelect.selectedIndex = 0;
        startDateInput.value = '';
        endDateInput.value = '';

        // Redirect to URL with cleared filters
        window.location.href = `/admin/projects/${projectId}?page=1`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    handleSearchAndFilters();
    const overlay = document.querySelector('.actions-overlay');
    overlay.addEventListener('click', function(e) {
        if (overlay && overlay.classList.contains('active') && e.target === overlay) {
            overlay.classList.remove('active');
            overlay.innerHTML = '';
            document.body.style.overflow = '';
        }
    });

});

