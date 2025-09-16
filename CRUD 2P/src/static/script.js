// API Configuration
const API_BASE_URL = '/api/pessoas';

// Global State
let currentPeople = [];
let currentEditingId = null;

// DOM Elements
const elements = {
    peopleList: document.getElementById('peopleList'),
    emptyState: document.getElementById('emptyState'),
    totalCount: document.getElementById('totalCount'),
    searchInput: document.getElementById('searchInput'),
    addPersonBtn: document.getElementById('addPersonBtn'),
    exportBtn: document.getElementById('exportBtn'),
    personModal: document.getElementById('personModal'),
    confirmModal: document.getElementById('confirmModal'),
    personForm: document.getElementById('personForm'),
    modalTitle: document.getElementById('modalTitle'),
    personName: document.getElementById('personName'),
    personAge: document.getElementById('personAge'),
    closeModal: document.getElementById('closeModal'),
    cancelBtn: document.getElementById('cancelBtn'),
    saveBtn: document.getElementById('saveBtn'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmCancel: document.getElementById('confirmCancel'),
    confirmAction: document.getElementById('confirmAction'),
    toastContainer: document.getElementById('toastContainer'),
    loadingOverlay: document.getElementById('loadingOverlay')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadPeople();
});

// Event Listeners
function initializeEventListeners() {
    // Add Person Button
    elements.addPersonBtn.addEventListener('click', () => openModal());
    
    // Export Button
    elements.exportBtn.addEventListener('click', exportToCsv);
    
    // Search Input
    elements.searchInput.addEventListener('input', handleSearch);
    
    // Modal Events
    elements.closeModal.addEventListener('click', closeModal);
    elements.cancelBtn.addEventListener('click', closeModal);
    elements.personForm.addEventListener('submit', handleFormSubmit);
    
    // Confirm Modal Events
    elements.confirmCancel.addEventListener('click', closeConfirmModal);
    
    // Close modals when clicking outside
    elements.personModal.addEventListener('click', (e) => {
        if (e.target === elements.personModal) closeModal();
    });
    
    elements.confirmModal.addEventListener('click', (e) => {
        if (e.target === elements.confirmModal) closeConfirmModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeConfirmModal();
        }
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            openModal();
        }
    });
}

// API Functions
async function apiRequest(url, options = {}) {
    showLoading();
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast(error.message || 'Erro na comunicação com o servidor', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function loadPeople() {
    try {
        const response = await apiRequest(API_BASE_URL);
        currentPeople = response.data || [];
        renderPeople(currentPeople);
        updateStats();
    } catch (error) {
        console.error('Error loading people:', error);
    }
}

async function createPerson(personData) {
    try {
        const response = await apiRequest(API_BASE_URL, {
            method: 'POST',
            body: JSON.stringify(personData)
        });
        
        showToast('Pessoa criada com sucesso!', 'success');
        await loadPeople();
        return response.data;
    } catch (error) {
        console.error('Error creating person:', error);
        throw error;
    }
}

async function updatePerson(id, personData) {
    try {
        const response = await apiRequest(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(personData)
        });
        
        showToast('Pessoa atualizada com sucesso!', 'success');
        await loadPeople();
        return response.data;
    } catch (error) {
        console.error('Error updating person:', error);
        throw error;
    }
}

async function deletePerson(id) {
    try {
        await apiRequest(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        showToast('Pessoa excluída com sucesso!', 'success');
        await loadPeople();
    } catch (error) {
        console.error('Error deleting person:', error);
        throw error;
    }
}

async function exportToCsv() {
    try {
        const response = await apiRequest(`${API_BASE_URL}/exportar`);
        showToast('Dados exportados para pessoas.csv com sucesso!', 'success');
    } catch (error) {
        console.error('Error exporting CSV:', error);
    }
}

// UI Functions
function renderPeople(people) {
    if (!people || people.length === 0) {
        elements.peopleList.style.display = 'none';
        elements.emptyState.style.display = 'block';
        return;
    }
    
    elements.peopleList.style.display = 'grid';
    elements.emptyState.style.display = 'none';
    
    elements.peopleList.innerHTML = people.map(person => `
        <div class="person-card" data-id="${person.id}">
            <div class="person-id">#${person.id}</div>
            <div class="person-info">
                <div class="person-name">
                    <i class="fas fa-user"></i>
                    ${escapeHtml(person.nome)}
                </div>
                <div class="person-age">
                    <i class="fas fa-birthday-cake"></i>
                    ${person.idade} anos
                </div>
            </div>
            <div class="person-actions">
                <button class="btn btn-edit btn-small" onclick="editPerson(${person.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn btn-delete btn-small" onclick="confirmDelete(${person.id}, '${escapeHtml(person.nome)}')">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    elements.totalCount.textContent = currentPeople.length;
}

function handleSearch() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderPeople(currentPeople);
        return;
    }
    
    const filteredPeople = currentPeople.filter(person => 
        person.nome.toLowerCase().includes(searchTerm) ||
        person.idade.toString().includes(searchTerm)
    );
    
    renderPeople(filteredPeople);
}

function openModal(person = null) {
    currentEditingId = person ? person.id : null;
    
    if (person) {
        elements.modalTitle.textContent = 'Editar Pessoa';
        elements.personName.value = person.nome;
        elements.personAge.value = person.idade;
        elements.saveBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar';
    } else {
        elements.modalTitle.textContent = 'Nova Pessoa';
        elements.personName.value = '';
        elements.personAge.value = '';
        elements.saveBtn.innerHTML = '<i class="fas fa-plus"></i> Criar';
    }
    
    elements.personModal.classList.add('show');
    elements.personName.focus();
}

function closeModal() {
    elements.personModal.classList.remove('show');
    currentEditingId = null;
}

function editPerson(id) {
    const person = currentPeople.find(p => p.id === id);
    if (person) {
        openModal(person);
    }
}

function confirmDelete(id, name) {
    elements.confirmMessage.textContent = `Tem certeza que deseja excluir "${name}"?`;
    elements.confirmAction.onclick = () => {
        deletePerson(id);
        closeConfirmModal();
    };
    elements.confirmModal.classList.add('show');
}

function closeConfirmModal() {
    elements.confirmModal.classList.remove('show');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = elements.personName.value.trim();
    const age = parseInt(elements.personAge.value);
    
    if (!name) {
        showToast('Nome é obrigatório', 'error');
        elements.personName.focus();
        return;
    }
    
    if (isNaN(age) || age < 0 || age > 150) {
        showToast('Idade deve ser um número entre 0 e 150', 'error');
        elements.personAge.focus();
        return;
    }
    
    const personData = { nome: name, idade: age };
    
    try {
        if (currentEditingId) {
            await updatePerson(currentEditingId, personData);
        } else {
            await createPerson(personData);
        }
        closeModal();
    } catch (error) {
        // Error is already handled in apiRequest
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
    
    // Remove on click
    toast.addEventListener('click', () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
}

function showLoading() {
    elements.loadingOverlay.classList.add('show');
}

function hideLoading() {
    elements.loadingOverlay.classList.remove('show');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced search with debounce
elements.searchInput.addEventListener('input', debounce(handleSearch, 300));

// Auto-refresh every 30 seconds
setInterval(loadPeople, 30000);

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

