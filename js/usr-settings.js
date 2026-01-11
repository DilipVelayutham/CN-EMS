// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const settingsNavBtns = document.querySelectorAll('.settings-nav-btn');
    const settingsSections = document.querySelectorAll('.settings-section');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const resetSettingsBtn = document.getElementById('resetSettings');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationModal = document.getElementById('closeConfirmationModal');
    const confirmSaveBtn = document.getElementById('confirmSave');
    const editProfileBtn = document.querySelector('.btn-edit');
    const avatarUploadBtn = document.querySelector('.avatar-upload');
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    const connectButtons = document.querySelectorAll('.btn-connect');
    const disconnectButtons = document.querySelectorAll('.btn-disconnect');
    const radioOptions = document.querySelectorAll('input[type="radio"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const selects = document.querySelectorAll('select');
    const timeInputs = document.querySelectorAll('input[type="time"]');
    const searchInput = document.getElementById('searchInput');
    
    // Current settings state
    let settingsState = {
        account: {},
        notifications: {},
        privacy: {},
        preferences: {},
        billing: {},
        security: {},
        help: {},
        about: {}
    };
    
    // Initialize
    initSettingsPage();
    
    function initSettingsPage() {
        setupEventListeners();
        loadSettings();
        updateDateDisplay();
    }
    
    // Update date display
    function updateDateDisplay() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const currentDateElement = document.getElementById('currentDate');
        if (currentDateElement) {
            currentDateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Settings navigation
        settingsNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                switchSection(sectionId);
            });
        });
        
        // Save settings
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', function() {
                saveSettings();
            });
        }
        
        // Reset settings
        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to reset all settings to default?')) {
                    resetSettings();
                }
            });
        }
        
        // Modal close
        if (closeConfirmationModal) {
            closeConfirmationModal.addEventListener('click', function() {
                closeModal(confirmationModal);
            });
        }
        
        // Confirm save
        if (confirmSaveBtn) {
            confirmSaveBtn.addEventListener('click', function() {
                closeModal(confirmationModal);
                showNotification('Settings have been updated successfully!', 'success');
            });
        }
        
        // Edit profile
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                showNotification('Opening profile editor...');
            });
        }
        
        // Avatar upload
        if (avatarUploadBtn) {
            avatarUploadBtn.addEventListener('click', function() {
                showNotification('Opening image upload...');
            });
        }
        
        // Toggle switches
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const settingName = this.parentElement.parentElement.querySelector('h4').textContent;
                showNotification(`${settingName}: ${this.checked ? 'Enabled' : 'Disabled'}`);
            });
        });
        
        // Connect/Disconnect buttons
        connectButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const accountInfo = this.closest('.connected-account').querySelector('h4').textContent;
                this.textContent = 'Connecting...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = 'Connected';
                    this.style.background = 'var(--success-color)';
                    showNotification(`${accountInfo} connected successfully!`, 'success');
                }, 1000);
            });
        });
        
        disconnectButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const accountInfo = this.closest('.connected-account').querySelector('h4').textContent;
                if (confirm(`Are you sure you want to disconnect ${accountInfo}?`)) {
                    this.textContent = 'Disconnecting...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.textContent = 'Connect';
                        this.style.background = 'var(--primary-color)';
                        this.disabled = false;
                        showNotification(`${accountInfo} disconnected successfully!`, 'success');
                    }, 1000);
                }
            });
        });
        
        // Radio options
        radioOptions.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    const groupName = this.getAttribute('name');
                    const label = this.parentElement.querySelector('.radio-label').textContent;
                    showNotification(`${groupName}: ${label} selected`);
                }
            });
        });
        
        // Checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const label = this.parentElement.querySelector('span').textContent;
                showNotification(`${label}: ${this.checked ? 'Enabled' : 'Disabled'}`);
            });
        });
        
        // Selects
        selects.forEach(select => {
            select.addEventListener('change', function() {
                const label = this.previousElementSibling ? 
                    this.previousElementSibling.querySelector('h4').textContent : 
                    'Setting';
                showNotification(`${label}: ${this.options[this.selectedIndex].text} selected`);
            });
        });
        
        // Time inputs
        timeInputs.forEach(input => {
            input.addEventListener('change', function() {
                const label = this.parentElement.querySelector('label').textContent;
                showNotification(`${label}: ${this.value} set`);
            });
        });
        
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.length > 2) {
                    searchSettings(searchTerm);
                } else if (searchTerm.length === 0) {
                    resetSearch();
                }
            });
        }
        
        // Close modal when clicking outside
        confirmationModal.addEventListener('click', function(e) {
            if (e.target === confirmationModal) {
                closeModal(confirmationModal);
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && confirmationModal.classList.contains('active')) {
                closeModal(confirmationModal);
            }
        });
    }
    
    // Switch settings section
    function switchSection(sectionId) {
        // Update active navigation button
        settingsNavBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionId) {
                btn.classList.add('active');
            }
        });
        
        // Show selected section
        settingsSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${sectionId}-section`) {
                section.classList.add('active');
            }
        });
        
        // Save current section to state
        settingsState.currentSection = sectionId;
        showNotification(`Viewing ${sectionId.replace('-', ' ')} settings`);
    }
    
    // Save settings
    function saveSettings() {
        // Collect all settings
        collectSettings();
        
        // Show confirmation modal
        confirmationModal.classList.add('active');
        confirmationModal.style.display = 'flex';
        
        // In a real app, this would send data to the server
        console.log('Settings saved:', settingsState);
    }
    
    // Collect settings from form
    function collectSettings() {
        // Collect toggle switches
        toggleSwitches.forEach(toggle => {
            const section = toggle.closest('.settings-section').id.replace('-section', '');
            const name = toggle.parentElement.parentElement.querySelector('h4').textContent;
            settingsState[section][name] = toggle.checked;
        });
        
        // Collect radio buttons
        radioOptions.forEach(radio => {
            if (radio.checked) {
                const section = radio.closest('.settings-section').id.replace('-section', '');
                const group = radio.getAttribute('name');
                const value = radio.parentElement.querySelector('.radio-label').textContent;
                settingsState[section][group] = value;
            }
        });
        
        // Collect checkboxes
        checkboxes.forEach(checkbox => {
            const section = checkbox.closest('.settings-section').id.replace('-section', '');
            const name = checkbox.parentElement.querySelector('span').textContent;
            settingsState[section][name] = checkbox.checked;
        });
        
        // Collect select values
        selects.forEach(select => {
            const section = select.closest('.settings-section').id.replace('-section', '');
            const name = select.previousElementSibling ? 
                select.previousElementSibling.querySelector('h4').textContent : 
                'select-' + Math.random();
            settingsState[section][name] = select.value;
        });
    }
    
    // Load settings (simulated)
    function loadSettings() {
        // This would load from server in a real app
        const savedSettings = localStorage.getItem('evento-settings');
        if (savedSettings) {
            settingsState = JSON.parse(savedSettings);
            applySettings();
        }
    }
    
    // Apply settings to form
    function applySettings() {
        // Apply toggle switches
        toggleSwitches.forEach(toggle => {
            const section = toggle.closest('.settings-section').id.replace('-section', '');
            const name = toggle.parentElement.parentElement.querySelector('h4').textContent;
            if (settingsState[section] && settingsState[section][name] !== undefined) {
                toggle.checked = settingsState[section][name];
            }
        });
        
        // Apply radio buttons
        radioOptions.forEach(radio => {
            const section = radio.closest('.settings-section').id.replace('-section', '');
            const group = radio.getAttribute('name');
            const value = radio.parentElement.querySelector('.radio-label').textContent;
            if (settingsState[section] && settingsState[section][group] === value) {
                radio.checked = true;
            }
        });
        
        // Apply checkboxes
        checkboxes.forEach(checkbox => {
            const section = checkbox.closest('.settings-section').id.replace('-section', '');
            const name = checkbox.parentElement.querySelector('span').textContent;
            if (settingsState[section] && settingsState[section][name] !== undefined) {
                checkbox.checked = settingsState[section][name];
            }
        });
        
        // Apply select values
        selects.forEach(select => {
            const section = select.closest('.settings-section').id.replace('-section', '');
            const name = select.previousElementSibling ? 
                select.previousElementSibling.querySelector('h4').textContent : 
                'select-' + Math.random();
            if (settingsState[section] && settingsState[section][name]) {
                select.value = settingsState[section][name];
            }
        });
    }
    
    // Reset settings to default
    function resetSettings() {
        if (confirm('This will reset all settings to their default values. Continue?')) {
            // Reset toggle switches
            toggleSwitches.forEach(toggle => {
                toggle.checked = toggle.defaultChecked;
            });
            
            // Reset radio buttons
            radioOptions.forEach(radio => {
                radio.checked = radio.defaultChecked;
            });
            
            // Reset checkboxes
            checkboxes.forEach(checkbox => {
                checkbox.checked = checkbox.defaultChecked;
            });
            
            // Reset selects
            selects.forEach(select => {
                select.value = select.options[0].value;
            });
            
            // Clear saved settings
            localStorage.removeItem('evento-settings');
            settingsState = {
                account: {},
                notifications: {},
                privacy: {},
                preferences: {},
                billing: {},
                security: {},
                help: {},
                about: {}
            };
            
            showNotification('All settings have been reset to default values', 'success');
        }
    }
    
    // Search settings
    function searchSettings(searchTerm) {
        let found = false;
        
        // Search in section headers
        settingsSections.forEach(section => {
            const header = section.querySelector('h2');
            if (header && header.textContent.toLowerCase().includes(searchTerm)) {
                const sectionId = section.id.replace('-section', '');
                switchSection(sectionId);
                found = true;
                return;
            }
        });
        
        // Search in setting titles
        if (!found) {
            const allHeadings = document.querySelectorAll('h3, h4');
            for (let heading of allHeadings) {
                if (heading.textContent.toLowerCase().includes(searchTerm)) {
                    const section = heading.closest('.settings-section');
                    if (section) {
                        const sectionId = section.id.replace('-section', '');
                        switchSection(sectionId);
                        
                        // Scroll to the element
                        heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        heading.style.background = 'var(--primary-light)';
                        setTimeout(() => {
                            heading.style.background = '';
                        }, 2000);
                        
                        found = true;
                        break;
                    }
                }
            }
        }
        
        if (!found) {
            showNotification(`No settings found for "${searchTerm}"`, 'warning');
        }
    }
    
    // Reset search
    function resetSearch() {
        // Remove any search highlights
        const highlighted = document.querySelectorAll('[style*="background"]');
        highlighted.forEach(el => {
            if (el.style.background.includes('primary-light')) {
                el.style.background = '';
            }
        });
    }
    
    // Close modal function
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification-toast');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 
                    type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
});