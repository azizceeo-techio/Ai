// API endpoint (change this later when you deploy to a server)
const API_URL = 'http://localhost:5000/api';

let selectedModel = null;
let allModels = [];

// Load models when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadModels();
});

// Fetch available models from backend
async function loadModels() {
    try {
        const response = await fetch(`${API_URL}/models`);
        const data = await response.json();
        allModels = data.models;
        displayModels(allModels);
    } catch (error) {
        console.error('Error loading models:', error);
        document.getElementById('model-list').innerHTML = 
            '<p style="color: red;">⚠️ Could not connect to server. Make sure backend is running!</p>';
    }
}

// Display models as cards
function displayModels(models) {
    const modelList = document.getElementById('model-list');
    modelList.innerHTML = '';
    
    models.forEach(model => {
        const card = document.createElement('div');
        card.className = 'model-card';
        card.onclick = () => selectModel(model);
        
        card.innerHTML = `
            <h3>${model.name}</h3>
            <p>${model.description}</p>
        `;
        
        modelList.appendChild(card);
    });
}

// When user selects a model
function selectModel(model) {
    selectedModel = model;
    document.getElementById('selected-model-name').textContent = model.name;
    document.getElementById('selected-model-desc').textContent = model.description;
    showInputSection();
}

// Run the selected model
async function runModel() {
    const userInput = document.getElementById('user-input').value.trim();
    
    if (!userInput) {
        alert('⚠️ Please enter some text first!');
        return;
    }
    
    if (!selectedModel) {
        alert('⚠️ Please select a model first!');
        return;
    }
    
    // Show loading
    document.getElementById('loading').style.display = 'flex';
    
    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model_id: selectedModel.id,
                input: userInput
            })
        });
        
        const data = await response.json();
        
        // Hide loading
        document.getElementById('loading').style.display = 'none';
        
        // Show results
        document.getElementById('results-output').textContent = data.result;
        showResultsSection();
        
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        alert('❌ Error: Could not connect to server. Make sure backend is running!');
        console.error('Error:', error);
    }
}

// Navigation functions
function showModelSelection() {
    document.getElementById('input-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
    document.querySelector('.model-selection').style.display = 'block';
    document.getElementById('user-input').value = '';
}

function showInputSection() {
    document.querySelector('.model-selection').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
}

function showResultsSection() {
    document.getElementById('input-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';
}