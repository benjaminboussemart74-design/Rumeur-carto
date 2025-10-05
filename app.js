// Application State
const state = {
    user: null,
    editMode: false,
    currentMinistry: null,
    data: {
        ministries: [],
        members: [],
        pendingChanges: []
    }
};

// Sample Data (simulating backend)
const sampleData = {
    ministries: [
        { id: 1, name: "Premier Ministre", color: "#667eea" },
        { id: 2, name: "Ministère de l'Intérieur", color: "#f093fb" },
        { id: 3, name: "Ministère des Affaires Étrangères", color: "#4facfe" },
        { id: 4, name: "Ministère de l'Économie", color: "#43e97b" },
        { id: 5, name: "Ministère de l'Éducation Nationale", color: "#fa709a" },
        { id: 6, name: "Ministère de la Santé", color: "#30cfd0" }
    ],
    members: [
        {
            id: 1,
            name: "Élisabeth Borne",
            role: "Première Ministre",
            ministryId: 1,
            supervisorId: null,
            bio: "Première Ministre de la République française depuis mai 2022.",
            isMinister: true
        },
        {
            id: 2,
            name: "Gérald Darmanin",
            role: "Ministre de l'Intérieur",
            ministryId: 2,
            supervisorId: null,
            bio: "Ministre de l'Intérieur et des Outre-mer.",
            isMinister: true
        },
        {
            id: 3,
            name: "Catherine Colonna",
            role: "Ministre de l'Europe et des Affaires Étrangères",
            ministryId: 3,
            supervisorId: null,
            bio: "Ministre de l'Europe et des Affaires étrangères.",
            isMinister: true
        },
        {
            id: 4,
            name: "Bruno Le Maire",
            role: "Ministre de l'Économie",
            ministryId: 4,
            supervisorId: null,
            bio: "Ministre de l'Économie, des Finances et de la Souveraineté industrielle et numérique.",
            isMinister: true
        },
        {
            id: 5,
            name: "Pap Ndiaye",
            role: "Ministre de l'Éducation Nationale",
            ministryId: 5,
            supervisorId: null,
            bio: "Ministre de l'Éducation nationale et de la Jeunesse.",
            isMinister: true
        },
        {
            id: 6,
            name: "François Braun",
            role: "Ministre de la Santé",
            ministryId: 6,
            supervisorId: null,
            bio: "Ministre de la Santé et de la Prévention.",
            isMinister: true
        },
        // Collaborators
        {
            id: 7,
            name: "Jean Dupont",
            role: "Directeur de Cabinet",
            ministryId: 2,
            supervisorId: 2,
            bio: "Directeur de cabinet du ministre de l'Intérieur.",
            isMinister: false
        },
        {
            id: 8,
            name: "Marie Martin",
            role: "Conseillère Technique",
            ministryId: 2,
            supervisorId: 2,
            bio: "Conseillère technique auprès du ministre.",
            isMinister: false
        },
        {
            id: 9,
            name: "Pierre Bernard",
            role: "Chef de Service",
            ministryId: 3,
            supervisorId: 3,
            bio: "Chef de service des affaires européennes.",
            isMinister: false
        },
        {
            id: 10,
            name: "Sophie Laurent",
            role: "Directrice Adjointe",
            ministryId: 4,
            supervisorId: 4,
            bio: "Directrice adjointe du Trésor.",
            isMinister: false
        }
    ],
    users: [
        { username: "admin", password: "admin123", role: "admin" },
        { username: "editor", password: "editor123", role: "editor" }
    ]
};

// Initialize application
function init() {
    // Load data from localStorage or use sample data
    loadData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial view
    renderMinistries();
    renderOrgChart();
}

// Load data from localStorage or use sample data
function loadData() {
    const savedData = localStorage.getItem('govData');
    if (savedData) {
        state.data = JSON.parse(savedData);
    } else {
        state.data.ministries = [...sampleData.ministries];
        state.data.members = [...sampleData.members];
        state.data.pendingChanges = [];
        saveData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('govData', JSON.stringify(state.data));
}

// Set up event listeners
function setupEventListeners() {
    // Login/Logout
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('closeLoginModalBtn').addEventListener('click', hideLoginModal);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Edit Mode
    document.getElementById('editModeBtn').addEventListener('click', toggleEditMode);
    
    // Modals
    document.getElementById('closeModalBtn').addEventListener('click', hideEditModal);
    document.getElementById('closeDetailBtn').addEventListener('click', hideDetailPanel);
    
    // Forms
    document.getElementById('editForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('saveDraftBtn').addEventListener('click', handleSaveDraft);
    
    // Close modals on background click
    document.getElementById('loginModal').addEventListener('click', (e) => {
        if (e.target.id === 'loginModal') hideLoginModal();
    });
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') hideEditModal();
    });
}

// Render ministries list
function renderMinistries() {
    const container = document.getElementById('ministriesList');
    container.innerHTML = '';
    
    state.data.ministries.forEach(ministry => {
        const memberCount = state.data.members.filter(m => m.ministryId === ministry.id).length;
        
        const item = document.createElement('div');
        item.className = 'ministry-item';
        if (state.currentMinistry === ministry.id) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <div class="ministry-name">${ministry.name}</div>
            <div class="ministry-count">${memberCount} membre(s)</div>
        `;
        
        item.addEventListener('click', () => {
            state.currentMinistry = ministry.id;
            renderMinistries();
            renderOrgChart();
        });
        
        container.appendChild(item);
    });
}

// Render organizational chart
function renderOrgChart() {
    const container = document.getElementById('orgChart');
    container.innerHTML = '';
    
    if (!state.currentMinistry) {
        container.innerHTML = '<div class="empty-state"><h3>Sélectionnez un ministère pour voir sa composition</h3></div>';
        return;
    }
    
    const ministry = state.data.ministries.find(m => m.id === state.currentMinistry);
    const members = state.data.members.filter(m => m.ministryId === state.currentMinistry);
    
    const hierarchyContainer = document.createElement('div');
    hierarchyContainer.className = 'hierarchy-container';
    
    // Render ministers
    const ministers = members.filter(m => m.isMinister);
    if (ministers.length > 0) {
        const ministerLevel = document.createElement('div');
        ministerLevel.className = 'hierarchy-level ministers';
        
        ministers.forEach(minister => {
            ministerLevel.appendChild(createMemberCard(minister, true));
        });
        
        hierarchyContainer.appendChild(ministerLevel);
    }
    
    // Render collaborators grouped by supervisor
    ministers.forEach(minister => {
        const collaborators = members.filter(m => m.supervisorId === minister.id);
        
        if (collaborators.length > 0) {
            const collabGroup = document.createElement('div');
            collabGroup.className = 'collaborators-group';
            
            const title = document.createElement('div');
            title.className = 'collaborators-title';
            title.textContent = `Collaborateurs de ${minister.name}`;
            collabGroup.appendChild(title);
            
            const collabLevel = document.createElement('div');
            collabLevel.className = 'hierarchy-level collaborators';
            
            collaborators.forEach(collab => {
                collabLevel.appendChild(createMemberCard(collab, false));
            });
            
            collabGroup.appendChild(collabLevel);
            hierarchyContainer.appendChild(collabGroup);
        }
    });
    
    container.appendChild(hierarchyContainer);
    
    // Add "Add Member" button if in edit mode
    if (state.editMode) {
        addEditModeUI();
    }
}

// Create member card
function createMemberCard(member, isMinister) {
    const card = document.createElement('div');
    card.className = 'member-card';
    if (isMinister) {
        card.classList.add('minister');
    }
    
    card.innerHTML = `
        <div class="member-name">${member.name}</div>
        <div class="member-role">${member.role}</div>
    `;
    
    card.addEventListener('click', () => showMemberDetails(member));
    
    // Add edit button in edit mode
    if (state.editMode && state.user) {
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-secondary';
        editBtn.textContent = '✏️ Modifier';
        editBtn.style.marginTop = '0.5rem';
        editBtn.style.width = '100%';
        editBtn.style.fontSize = '0.85rem';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            showEditModal(member);
        };
        card.appendChild(editBtn);
    }
    
    return card;
}

// Show member details
function showMemberDetails(member) {
    const panel = document.getElementById('detailPanel');
    const nameEl = document.getElementById('detailName');
    const contentEl = document.getElementById('detailContent');
    
    nameEl.textContent = member.name;
    
    const ministry = state.data.ministries.find(m => m.id === member.ministryId);
    const supervisor = member.supervisorId ? state.data.members.find(m => m.id === member.supervisorId) : null;
    const collaborators = state.data.members.filter(m => m.supervisorId === member.id);
    
    let html = `
        <div class="detail-section">
            <h3>Rôle</h3>
            <p>${member.role}</p>
        </div>
        <div class="detail-section">
            <h3>Ministère</h3>
            <p>${ministry.name}</p>
        </div>
    `;
    
    if (supervisor) {
        html += `
            <div class="detail-section">
                <h3>Superviseur</h3>
                <p>${supervisor.name} - ${supervisor.role}</p>
            </div>
        `;
    }
    
    if (member.bio) {
        html += `
            <div class="detail-section">
                <h3>Biographie</h3>
                <p>${member.bio}</p>
            </div>
        `;
    }
    
    if (collaborators.length > 0) {
        html += `
            <div class="detail-section">
                <h3>Collaborateurs (${collaborators.length})</h3>
                <div class="collaborators-list">
        `;
        
        collaborators.forEach(collab => {
            html += `
                <div class="collaborator-item" onclick="showMemberDetails(${JSON.stringify(collab).replace(/"/g, '&quot;')})">
                    <div class="collaborator-name">${collab.name}</div>
                    <div class="collaborator-role">${collab.role}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    contentEl.innerHTML = html;
    panel.style.display = 'block';
}

// Hide detail panel
function hideDetailPanel() {
    document.getElementById('detailPanel').style.display = 'none';
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('loginError').style.display = 'none';
}

// Hide login modal
function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginForm').reset();
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = sampleData.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('editModeBtn').style.display = 'block';
        
        hideLoginModal();
        
        if (user.role === 'admin') {
            renderAdminPanel();
        }
    } else {
        const errorEl = document.getElementById('loginError');
        errorEl.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
        errorEl.style.display = 'block';
    }
}

// Logout
function logout() {
    state.user = null;
    state.editMode = false;
    localStorage.removeItem('user');
    
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('editModeBtn').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    
    // Remove edit mode UI
    const editIndicator = document.querySelector('.edit-mode-active');
    if (editIndicator) editIndicator.remove();
    const addBtn = document.querySelector('.add-member-btn');
    if (addBtn) addBtn.remove();
    
    renderOrgChart();
}

// Toggle edit mode
function toggleEditMode() {
    state.editMode = !state.editMode;
    
    if (state.editMode) {
        document.getElementById('editModeBtn').textContent = 'Quitter le mode édition';
        document.getElementById('editModeBtn').style.background = '#e67e22';
    } else {
        document.getElementById('editModeBtn').textContent = 'Mode Édition';
        document.getElementById('editModeBtn').style.background = '#f39c12';
        
        // Remove edit mode UI
        const editIndicator = document.querySelector('.edit-mode-active');
        if (editIndicator) editIndicator.remove();
        const addBtn = document.querySelector('.add-member-btn');
        if (addBtn) addBtn.remove();
    }
    
    renderOrgChart();
}

// Add edit mode UI elements
function addEditModeUI() {
    // Add edit mode indicator
    if (!document.querySelector('.edit-mode-active')) {
        const indicator = document.createElement('div');
        indicator.className = 'edit-mode-active';
        indicator.textContent = 'Mode Édition Actif';
        document.body.appendChild(indicator);
    }
    
    // Add floating add button
    if (!document.querySelector('.add-member-btn')) {
        const addBtn = document.createElement('button');
        addBtn.className = 'add-member-btn';
        addBtn.textContent = '+';
        addBtn.title = 'Ajouter un membre';
        addBtn.addEventListener('click', () => showEditModal(null));
        document.body.appendChild(addBtn);
    }
}

// Show edit modal
function showEditModal(member = null) {
    const modal = document.getElementById('editModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('editForm');
    
    if (member) {
        title.textContent = 'Modifier un membre';
        document.getElementById('memberName').value = member.name;
        document.getElementById('memberRole').value = member.role;
        document.getElementById('memberMinistry').value = member.ministryId;
        document.getElementById('memberSupervisor').value = member.supervisorId || '';
        document.getElementById('memberBio').value = member.bio || '';
        form.dataset.memberId = member.id;
    } else {
        title.textContent = 'Ajouter un membre';
        form.reset();
        if (state.currentMinistry) {
            document.getElementById('memberMinistry').value = state.currentMinistry;
        }
        delete form.dataset.memberId;
    }
    
    // Populate ministry dropdown
    const ministrySelect = document.getElementById('memberMinistry');
    ministrySelect.innerHTML = '<option value="">Sélectionner un ministère</option>';
    state.data.ministries.forEach(m => {
        const option = document.createElement('option');
        option.value = m.id;
        option.textContent = m.name;
        ministrySelect.appendChild(option);
    });
    
    // Populate supervisor dropdown
    const supervisorSelect = document.getElementById('memberSupervisor');
    supervisorSelect.innerHTML = '<option value="">Aucun (ministre)</option>';
    state.data.members.filter(m => m.isMinister).forEach(m => {
        const option = document.createElement('option');
        option.value = m.id;
        option.textContent = `${m.name} - ${m.role}`;
        supervisorSelect.appendChild(option);
    });
    
    modal.style.display = 'flex';
}

// Hide edit modal
function hideEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editForm').reset();
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        role: formData.get('role'),
        ministryId: parseInt(formData.get('ministry')),
        supervisorId: formData.get('supervisor') ? parseInt(formData.get('supervisor')) : null,
        bio: formData.get('bio'),
        isMinister: !formData.get('supervisor')
    };
    
    const memberId = e.target.dataset.memberId;
    
    if (state.user.role === 'admin') {
        // Admin can directly modify
        if (memberId) {
            const memberIndex = state.data.members.findIndex(m => m.id === parseInt(memberId));
            state.data.members[memberIndex] = { ...state.data.members[memberIndex], ...data };
        } else {
            const newMember = {
                id: Date.now(),
                ...data
            };
            state.data.members.push(newMember);
        }
        saveData();
        renderOrgChart();
        renderMinistries();
        hideEditModal();
        alert('Modification enregistrée avec succès !');
    } else {
        // Editor must submit for approval
        const change = {
            id: Date.now(),
            type: memberId ? 'edit' : 'add',
            memberId: memberId ? parseInt(memberId) : null,
            data: data,
            submittedBy: state.user.username,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        state.data.pendingChanges.push(change);
        saveData();
        hideEditModal();
        alert('Votre modification a été soumise pour validation par un administrateur.');
    }
}

// Handle save draft
function handleSaveDraft() {
    alert('Fonctionnalité de brouillon à implémenter. Les données du formulaire seraient sauvegardées localement.');
}

// Render admin panel
function renderAdminPanel() {
    const panel = document.getElementById('adminPanel');
    const container = document.getElementById('pendingChanges');
    
    if (state.data.pendingChanges.length === 0) {
        container.innerHTML = '<p style="color: #7f8c8d;">Aucune modification en attente</p>';
        panel.style.display = 'block';
        return;
    }
    
    container.innerHTML = '';
    
    state.data.pendingChanges.filter(c => c.status === 'pending').forEach(change => {
        const item = document.createElement('div');
        item.className = 'pending-item';
        
        const typeText = change.type === 'add' ? 'Ajout' : 'Modification';
        const memberName = change.data.name;
        
        item.innerHTML = `
            <div class="pending-item-header">
                <div class="pending-item-type">${typeText}: ${memberName}</div>
                <div class="pending-item-actions">
                    <button class="btn-approve" data-change-id="${change.id}">✓ Approuver</button>
                    <button class="btn-reject" data-change-id="${change.id}">✗ Rejeter</button>
                </div>
            </div>
            <div style="font-size: 0.85rem; color: #7f8c8d;">
                Par ${change.submittedBy} le ${new Date(change.submittedAt).toLocaleDateString('fr-FR')}
            </div>
        `;
        
        container.appendChild(item);
    });
    
    // Add event listeners for approve/reject buttons
    container.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', () => approveChange(parseInt(btn.dataset.changeId)));
    });
    
    container.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', () => rejectChange(parseInt(btn.dataset.changeId)));
    });
    
    panel.style.display = 'block';
}

// Approve change
function approveChange(changeId) {
    const change = state.data.pendingChanges.find(c => c.id === changeId);
    
    if (change.type === 'add') {
        const newMember = {
            id: Date.now(),
            ...change.data
        };
        state.data.members.push(newMember);
    } else if (change.type === 'edit') {
        const memberIndex = state.data.members.findIndex(m => m.id === change.memberId);
        state.data.members[memberIndex] = { ...state.data.members[memberIndex], ...change.data };
    }
    
    change.status = 'approved';
    saveData();
    
    renderOrgChart();
    renderMinistries();
    renderAdminPanel();
    
    alert('Modification approuvée et publiée !');
}

// Reject change
function rejectChange(changeId) {
    const change = state.data.pendingChanges.find(c => c.id === changeId);
    change.status = 'rejected';
    
    saveData();
    renderAdminPanel();
    
    alert('Modification rejetée.');
}

// Check if user is already logged in
function checkExistingUser() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('editModeBtn').style.display = 'block';
        
        if (state.user.role === 'admin') {
            renderAdminPanel();
        }
    }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        checkExistingUser();
    });
} else {
    init();
    checkExistingUser();
}
