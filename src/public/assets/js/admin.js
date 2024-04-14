document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.actions-overlay');
    const addProject = document.getElementById('action-add-project');
    overlay.addEventListener('click', function(e) {
        if (overlay && overlay.classList.contains('active') && e.target === overlay) {
            overlay.classList.remove('active');
            overlay.innerHTML = '';
        }
    });

    addProject.addEventListener('click', async function() {
        if (overlay && !overlay.classList.contains('active')) {
            overlay.classList.add('active');
        }

        const form = await createForm('add');
        overlay.appendChild(form);
        if (form) {
            form.addEventListener('input', validateAddProject('add'));
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                //send data as json
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => {
                    if (key === 'image' && value === '') {
                        value = '/assets/imgs/no-avatar.png';
                    }
                    data[key] = value;
                });

                const res = await fetch('/api/admin/projects/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (res.status === 200) {
                    const { newProject } = await res.json();
                    // remove the form
                    overlay.innerHTML = '';
                    overlay.classList.remove('active');
                    // append the new project to the table
                    const table = document.getElementById('projects-table');
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <tr>
                            <td>
                                <div class="an-container">
                                    <img src="${newProject.image}" alt="${newProject.name}" class="an-image">
                                    <span class="an-name">${newProject.name}</span>
                                </div>
                            </td>
                            <td>${newProject.description}</td>
                            <td>${newProject.enabled}</td>
                            <td>${newProject.github}</td>
                            <td>
                                <div class="an-container actions">
                                    <a href="/admin/projects/logs/${newProject.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse"><path d="m3 10 2.5-2.5L3 5"/><path d="m3 19 2.5-2.5L3 14"/><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/></svg>
                                    </a>
                                    <button 
                                        type="button" 
                                        class="edit-project"
                                        onclick="editProject(${newProject.id}, event)"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil edit-project-icon"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    </button>
                                    <button 
                                        type="button" 
                                        class="delete-project"
                                        onclick="deleteProject(${newProject.id}, event)"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 delete-project-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                    // append the new row to the table after the first row which is the th
                    table.insertRow(1).outerHTML = newRow.outerHTML;
                    // if class="no-projects" exists, remove it
                    const noProjects = document.querySelector('.no-projects');
                    if (noProjects) {
                        noProjects.remove();
                    }
                } else {
                    console.error('Error adding project');
                    alert('Error adding project');
                }
            });
        }

    });
});
// GLOBALS
let submitDisabled = false;

/* Dynamic Forms */
// create a new form element depending on the type of action button clicked
async function createForm(action, id = undefined) {
    const form = document.createElement('form');
    form.classList.add('form-actions');
    if (action === 'add') {
        // h2 element
        const h2 = document.createElement('h2');
        h2.textContent = 'Add a new project';
        form.appendChild(h2);

        const name = document.createElement('input');
        name.setAttribute('id', 'name');
        name.setAttribute('type', 'text');
        name.setAttribute('name', 'name');
        name.setAttribute('placeholder', 'My new project');
        name.setAttribute('autocomplete', 'off');
        name.setAttribute('required', true);

        const description = document.createElement('textarea');
        description.setAttribute('id', 'description');
        description.setAttribute('name', 'description');
        description.setAttribute('placeholder', 'A portfolio project for my work - not required');
        description.setAttribute('autocomplete', 'off');

        const github = document.createElement('input');
        github.setAttribute('id', 'github');
        github.setAttribute('type', 'text');
        github.setAttribute('name', 'github');
        github.setAttribute('placeholder', 'Source URL - not required');

        const image = document.createElement('input');
        image.setAttribute('id', 'image');
        image.setAttribute('type', 'text');
        image.setAttribute('name', 'image');
        image.setAttribute('placeholder', 'Image URL - not required');
        image.setAttribute('autocomplete', 'off')

        const submit = document.createElement('button');
        submit.setAttribute('type', 'submit');
        submit.setAttribute('disabled', true);
        submit.textContent = 'Submit';

        // create label elements
        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('for', 'name');
        nameLabel.textContent = 'Name';
        nameLabel.appendChild(name);
        
        const descriptionLabel = document.createElement('label');
        descriptionLabel.setAttribute('for', 'description');
        descriptionLabel.textContent = 'Description';
        descriptionLabel.appendChild(description);

        const githubLabel = document.createElement('label');
        githubLabel.setAttribute('for', 'github');
        githubLabel.textContent = 'Source';
        githubLabel.appendChild(github);
        
        const imageLabel = document.createElement('label');
        imageLabel.setAttribute('for', 'image');
        imageLabel.textContent = 'Image URL';
        imageLabel.appendChild(image);

        form.appendChild(nameLabel);
        form.appendChild(descriptionLabel);
        form.appendChild(githubLabel);
        form.appendChild(imageLabel);
        form.appendChild(submit);
    }

    if (action === 'edit') {
        // h2 element
        const res = await fetch(`/api/admin/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { project } = await res.json();
        const h2 = document.createElement('h2');
        const time = document.createElement('span');
        h2.innerHTML = `<span class="pr-name">${project.name}</span>`;
        time.textContent = `${project.updated_at}`;
        time.setAttribute('class', 'pr-update');
        form.appendChild(h2);
        form.appendChild(time);

        const name = document.createElement('input');
        name.value = project.name;
        name.setAttribute('id', 'name');
        name.setAttribute('type', 'text');
        name.setAttribute('name', 'name');
        name.setAttribute('placeholder', 'My new project');
        name.setAttribute('autocomplete', 'off');
        name.setAttribute('required', true);

        const description = document.createElement('textarea');
        description.value = project.description;
        description.setAttribute('id', 'description');
        description.setAttribute('name', 'description');
        description.setAttribute('placeholder', 'A portfolio project for my work - not required');
        description.setAttribute('autocomplete', 'off');

        const github = document.createElement('input');
        github.value = project.github;
        github.setAttribute('id', 'github');
        github.setAttribute('type', 'text');
        github.setAttribute('name', 'github');
        github.setAttribute('placeholder', 'Source URL - not required');

        const image = document.createElement('input');
        image.value = project.image;
        image.setAttribute('id', 'image');
        image.setAttribute('type', 'text');
        image.setAttribute('name', 'image');
        image.setAttribute('placeholder', 'Image URL - not required');
        image.setAttribute('autocomplete', 'off')

        const status = document.createElement('input');
        status.checked = project.enabled;
        status.setAttribute('id', 'enabled');
        status.setAttribute('name', 'enabled');
        status.setAttribute('type', 'checkbox');

        const apiKey = document.createElement('input');
        apiKey.value = project.apiKey;
        apiKey.setAttribute('id', 'apiKey');
        apiKey.setAttribute('name', 'apiKey');
        apiKey.setAttribute('type', 'text');
        apiKey.setAttribute('placeholder', 'API Key - not required');
        apiKey.setAttribute('autocomplete', 'off');

        const submit = document.createElement('button');
        submit.setAttribute('type', 'submit');
        submit.setAttribute('disabled', true);
        submit.textContent = 'Submit';

        // create label elements
        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('for', 'name');
        nameLabel.textContent = 'Name';
        nameLabel.appendChild(name);
        
        const descriptionLabel = document.createElement('label');
        descriptionLabel.setAttribute('for', 'description');
        descriptionLabel.textContent = 'Description';
        descriptionLabel.appendChild(description);

        const githubLabel = document.createElement('label');
        githubLabel.setAttribute('for', 'github');
        githubLabel.textContent = 'Source';
        githubLabel.appendChild(github);
        
        const imageLabel = document.createElement('label');
        imageLabel.setAttribute('for', 'image');
        imageLabel.textContent = 'Image URL';
        imageLabel.appendChild(image);

        const statusLabel = document.createElement('label');
        statusLabel.setAttribute('for', 'enabled');
        statusLabel.textContent = 'Enabled';
        statusLabel.appendChild(status);

        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.setAttribute('for', 'apiKey');
        apiKeyLabel.textContent = 'API Key';
        apiKeyLabel.appendChild(apiKey);

        form.appendChild(nameLabel);
        form.appendChild(descriptionLabel);
        form.appendChild(githubLabel);
        form.appendChild(imageLabel);
        form.appendChild(apiKeyLabel);
        form.appendChild(statusLabel);
        form.appendChild(submit);
    }

    return form;
};

function validateAddProject(action) {
    const projectName = document.querySelector('.form-actions input[name="name"]').value;
    const projectDescription = document.querySelector('.form-actions textarea[name="description"]').value;
    const projectGithub = document.querySelector('.form-actions input[name="github"]').value;
    const projectImage = document.querySelector('.form-actions input[name="image"]').value;
    if (action === 'edit') {
        const projectApiKey = document.querySelector('.form-actions input[name="apiKey"]').value;

        if (projectApiKey.length < 31 && projectApiKey.length > 255 ) {
            submitBtn.removeAttribute('disabled');
        }

    }
    const submitBtn = document.querySelector('.form-actions button[type="submit"]');

    // all needs to exist , name > 3 and < 50, description < 255, github < 255, image < 255
    if (projectName.length < 3 || projectName.length > 50) {
        submitBtn.setAttribute('disabled', true);
    } else {
        submitBtn.removeAttribute('disabled');
    }

    if (projectDescription.length > 255 || projectGithub.length > 255 || projectImage.length > 255) {
        submitBtn.setAttribute('disabled', true);
    } else {
        submitBtn.removeAttribute('disabled');
    }

}

async function deleteProject(delId, e) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }
    if (submitDisabled) {
        return;
    }
    submitDisabled = true;
    const res = await fetch(`/api/admin/projects/delete/${delId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (res.status === 200) {
        // remove the project from the table
        const row = e.target.closest('tr');
        row.remove();
        // if there are no projects, add a message
        const table = document.querySelector('.projects-table > tbody');
        if (table.children.length === 1) {
            const newRow = document.createElement('tr');
            newRow.classList.add('no-projects');
            newRow.innerHTML = `
                <td colspan="5" class="no-projects">Currently there are no active projects, please add at least one first.</td>
            `;
            table.appendChild(newRow);
        }
    } else {
        alert('Error deleting project');
    }
    submitDisabled = false;
}

async function editProject(editId) {
    // open the overlay
    const overlay = document.querySelector('.actions-overlay');
    overlay.classList.add('active');
    // create the form
    const form = await createForm('edit', editId);
    overlay.appendChild(form);
    if (form) {
        form.addEventListener('input', validateAddProject('edit'));
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            //send data as json
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                if (key === 'image' && value === '') {
                    value = '/assets/imgs/no-avatar.png';
                }

                if (key === 'enabled') {
                    value = value === 'on' ? true : false;
                }
                data[key] = value;
            });
            data.id = editId;
            data.enabled = data.enabled === undefined ? false : data.enabled;
            const res = await fetch('/api/admin/projects/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.status === 200) {
                const { updatedProject } = await res.json();
                // remove the form
                overlay.innerHTML = '';
                overlay.classList.remove('active');
                // update the project in the table
                const row = document.querySelector(`#projects-table tr[data-id="${updatedProject.id}"]`);
                row.innerHTML = `
                    <td>
                        <div class="an-container">
                            <img src="${updatedProject.image}" alt="${updatedProject.name}" class="an-image">
                            <span class="an-name">${updatedProject.name}</span>
                        </div>
                    </td>
                    <td>${updatedProject.description}</td>
                    <td>
                        <span class="pr-enabled" data-state="${updatedProject.enabled ? "enabled" : "disabled" }">
                            ${updatedProject.enabled ? "online" : "offline" }
                        </span>
                    </td>
                    <td>${updatedProject.github}</td>
                    <td>
                        <div class="an-container actions">
                            <a href="/admin/projects/${updatedProject.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-collapse"><path d="m3 10 2.5-2.5L3 5"/><path d="m3 19 2.5-2.5L3 14"/><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/></svg>
                            </a>
                            <button 
                                type="button" 
                                class="edit-project"
                                onclick="editProject(${updatedProject.id}, event)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil edit-project-icon"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button 
                                type="button" 
                                class="delete-project"
                                onclick="deleteProject(${updatedProject.id}, event)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 delete-project-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    </td>
                `;
            }
        });

    }
}