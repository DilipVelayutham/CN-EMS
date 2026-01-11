// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resetFilters = document.getElementById('resetFilters');
    const downloadAllBtn = document.getElementById('downloadAllTickets');
    const transferTicketBtn = document.getElementById('transferTicket');
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const moreOptionsButtons = document.querySelectorAll('.more-options');
    const viewTicketButtons = document.querySelectorAll('.btn-view-ticket');
    const downloadTicketButtons = document.querySelectorAll('.btn-download-ticket');
    const shareTicketButtons = document.querySelectorAll('.btn-share-ticket');
    const addCalendarButtons = document.querySelectorAll('.btn-add-calendar');
    const viewReceiptButtons = document.querySelectorAll('.btn-view-receipt');
    const reviewEventButtons = document.querySelectorAll('.btn-review-event');
    const addToWalletBtn = document.getElementById('addToWallet');
    const walletBackupBtn = document.getElementById('walletBackup');
    const walletShareBtn = document.getElementById('walletShare');
    const quickAccessButtons = document.querySelectorAll('.quick-access-btn');
    const alertSettingsBtn = document.getElementById('alertSettings');
    const dismissAllAlertsBtn = document.getElementById('dismissAllAlerts');
    const exploreEventsBtn = document.getElementById('exploreEventsBtn');
    const closeTicketModal = document.getElementById('closeTicketModal');
    const ticketModal = document.getElementById('ticketModal');
    const closeTransferModal = document.getElementById('closeTransferModal');
    const transferModal = document.getElementById('transferModal');
    const cancelTransferBtn = document.getElementById('cancelTransfer');
    const submitTransferBtn = document.getElementById('submitTransfer');
    
    // Ticket data
    const ticketItems = document.querySelectorAll('.ticket-item, .ticket-card');
    
    // Initialize tickets page
    initTicketsPage();
    
    function initTicketsPage() {
        // Setup event listeners
        setupEventListeners();
        
        // Update counts
        updateTicketCounts();
        
        // Simulate QR code refresh
        simulateQRRefresh();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Filter controls
        statusFilter.addEventListener('change', filterTickets);
        typeFilter.addEventListener('change', filterTickets);
        sortFilter.addEventListener('change', sortTickets);
        
        // Reset filters
        resetFilters.addEventListener('click', function() {
            statusFilter.value = 'all';
            typeFilter.value = 'all';
            sortFilter.value = 'date-desc';
            filterTickets();
            showNotification('Filters reset to default');
        });
        
        // Search input
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 2) {
                filterTickets();
            } else if (searchTerm.length === 0) {
                filterTickets();
            }
        });
        
        // Download all tickets
        downloadAllBtn.addEventListener('click', function() {
            showNotification('Preparing all tickets for download...', 'info');
            
            // Simulate download process
            setTimeout(() => {
                showNotification('All tickets downloaded as PDF!', 'success');
            }, 2000);
        });
        
        // Transfer ticket
        transferTicketBtn.addEventListener('click', function() {
            openTransferModal();
        });
        
        // Quick view buttons
        quickViewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ticketItem = this.closest('.ticket-item');
                const eventName = ticketItem.querySelector('h4').textContent;
                openTicketModal(eventName, ticketItem);
            });
        });
        
        // More options buttons
        moreOptionsButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ticketItem = this.closest('.ticket-item');
                const eventName = ticketItem.querySelector('h4').textContent;
                showMoreOptions(eventName, ticketItem);
            });
        });
        
        // View ticket buttons
        viewTicketButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ticketItem = this.closest('.ticket-item');
                const eventName = ticketItem.querySelector('h4').textContent;
                openTicketModal(eventName, ticketItem);
            });
        });
        
        // Download ticket buttons
        downloadTicketButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ticketItem = this.closest('.ticket-item');
                const eventName = ticketItem.querySelector('h4').textContent;
                
                showNotification(`Downloading ticket for ${eventName}...`, 'info');
                
                // Change button state
                this.innerHTML = '<i class="fas fa-check"></i> Downloaded';
                this.disabled = true;
                this.style.opacity = '0.7';
                
                setTimeout(() => {
                    showNotification(`Ticket for ${eventName} downloaded successfully!`, 'success');
                }, 1000);
            });
        });
        
        // Share ticket buttons
        shareTicketButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ticketItem = this.closest('.ticket-item');
                const eventName = ticketItem.querySelector('h4').textContent;
                showNotification(`Sharing ticket for ${eventName}...`, 'info');
            });
        });
        
        // Add to calendar buttons
        addCalendarButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ticketItem = this.closest('.ticket-item');
                const eventName = ticketItem.querySelector('h4').textContent;
                
                showNotification(`Adding ${eventName} to your calendar...`, 'info');
                
                // Change button state
                this.innerHTML = '<i class="fas fa-check"></i> Added';
                this.disabled = true;
                this.style.opacity = '0.7';
            });
        });
        
        // View receipt buttons
        viewReceiptButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ticketCard = this.closest('.ticket-card');
                const eventName = ticketCard.querySelector('h5').textContent;
                showNotification(`Opening receipt for ${eventName}...`, 'info');
            });
        });
        
        // Review event buttons
        reviewEventButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const ticketCard = this.closest('.ticket-card');
                const eventName = ticketCard.querySelector('h5').textContent;
                showNotification(`Writing review for ${eventName}...`, 'info');
                
                // Navigate to review page or open review modal
                setTimeout(() => {
                    // In a real app, this would open a review form
                    showNotification(`Review page opened for ${eventName}`, 'success');
                }, 500);
            });
        });
        
        // Wallet actions
        addToWalletBtn.addEventListener('click', function() {
            showNotification('Adding ticket to wallet...', 'info');
        });
        
        walletBackupBtn.addEventListener('click', function() {
            showNotification('Backing up wallet to cloud...', 'info');
        });
        
        walletShareBtn.addEventListener('click', function() {
            showNotification('Sharing wallet access...', 'info');
        });
        
        // Quick access buttons
        quickAccessButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('h5').textContent;
                switch(action) {
                    case 'Download All':
                        downloadAllBtn.click();
                        break;
                    case 'Print Tickets':
                        showNotification('Opening print dialog...', 'info');
                        break;
                    case 'Transfer':
                        transferTicketBtn.click();
                        break;
                    case 'Support':
                        showNotification('Opening support chat...', 'info');
                        break;
                }
            });
        });
        
        // Alert settings
        alertSettingsBtn.addEventListener('click', function() {
            showNotification('Opening alert settings...', 'info');
        });
        
        // Dismiss all alerts
        dismissAllAlertsBtn.addEventListener('click', function() {
            const alerts = document.querySelectorAll('.alert-item');
            alerts.forEach(alert => {
                alert.style.opacity = '0.5';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            });
            
            showNotification('All alerts dismissed', 'success');
            this.disabled = true;
            this.style.opacity = '0.7';
        });
        
        // Explore events button
        exploreEventsBtn.addEventListener('click', function() {
            showNotification('Opening events explorer...', 'info');
        });
        
        // Ticket item clicks
        ticketItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('button') && !e.target.closest('.icon-btn')) {
                    const eventName = this.querySelector('h4, h5').textContent;
                    openTicketModal(eventName, this);
                }
            });
        });
        
        // Close ticket modal
        closeTicketModal.addEventListener('click', function() {
            closeModal(ticketModal);
        });
        
        // Close modal when clicking outside
        ticketModal.addEventListener('click', function(e) {
            if (e.target === ticketModal) {
                closeModal(ticketModal);
            }
        });
        
        // Transfer modal functionality
        closeTransferModal.addEventListener('click', function() {
            closeModal(transferModal);
        });
        
        transferModal.addEventListener('click', function(e) {
            if (e.target === transferModal) {
                closeModal(transferModal);
            }
        });
        
        cancelTransferBtn.addEventListener('click', function() {
            closeModal(transferModal);
        });
        
        submitTransferBtn.addEventListener('click', function() {
            const ticketSelect = document.getElementById('selectTicket');
            const recipientEmail = document.getElementById('recipientEmail').value;
            
            if (!ticketSelect.value) {
                showNotification('Please select a ticket to transfer', 'error');
                return;
            }
            
            if (!recipientEmail || !isValidEmail(recipientEmail)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            const ticketName = ticketSelect.options[ticketSelect.selectedIndex].text;
            
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transferring...';
            this.disabled = true;
            
            // Simulate transfer process
            setTimeout(() => {
                showNotification(`Ticket transferred successfully to ${recipientEmail}`, 'success');
                closeModal(transferModal);
                
                // Reset form
                document.getElementById('selectTicket').value = '';
                document.getElementById('recipientEmail').value = '';
                document.getElementById('transferMessage').value = '';
                
                // Reset button
                this.innerHTML = 'Transfer Ticket';
                this.disabled = false;
            }, 2000);
        });
    }
    
    // Filter tickets based on selected filters
    function filterTickets() {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const type = typeFilter.value;
        
        let activeCount = 0;
        let usedCount = 0;
        let visibleCount = 0;
        
        ticketItems.forEach(item => {
            const eventName = item.querySelector('h4, h5').textContent.toLowerCase();
            const ticketStatus = item.getAttribute('data-status');
            const ticketType = item.getAttribute('data-type');
            
            // Search filter
            const matchesSearch = searchTerm === '' || eventName.includes(searchTerm);
            
            // Status filter
            const matchesStatus = status === 'all' || ticketStatus === status;
            
            // Type filter
            const matchesType = type === 'all' || ticketType === type;
            
            // Show/hide item
            if (matchesSearch && matchesStatus && matchesType) {
                item.style.display = item.classList.contains('ticket-card') ? 'block' : 'flex';
                visibleCount++;
                
                // Update counts
                if (ticketStatus === 'active' || ticketStatus === 'upcoming') {
                    activeCount++;
                } else if (ticketStatus === 'used') {
                    usedCount++;
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update badges
        document.getElementById('activeBadge').textContent = `${activeCount} ticket${activeCount !== 1 ? 's' : ''}`;
        document.getElementById('usedBadge').textContent = `${usedCount} ticket${usedCount !== 1 ? 's' : ''}`;
        
        // Check empty state
        checkEmptyState();
        
        if (searchTerm || status !== 'all' || type !== 'all') {
            showNotification(`Found ${visibleCount} tickets matching your filters`, 'info');
        }
    }
    
    // Sort tickets
    function sortTickets() {
        const sortBy = sortFilter.value;
        const ticketList = document.querySelector('.ticket-list');
        const ticketGrid = document.querySelector('.ticket-grid');
        
        if (ticketList) {
            const items = Array.from(ticketList.querySelectorAll('.ticket-item'));
            
            items.sort((a, b) => {
                const aName = a.querySelector('h4').textContent;
                const bName = b.querySelector('h4').textContent;
                const aDate = a.querySelector('.event-date').textContent;
                const bDate = b.querySelector('.event-date').textContent;
                const aPrice = parseFloat(a.querySelector('.detail-item:nth-child(3) .value').textContent.replace('$', ''));
                const bPrice = parseFloat(b.querySelector('.detail-item:nth-child(3) .value').textContent.replace('$', ''));
                
                switch(sortBy) {
                    case 'date-desc':
                        return new Date(bDate) - new Date(aDate);
                    case 'date-asc':
                        return new Date(aDate) - new Date(bDate);
                    case 'price':
                        return bPrice - aPrice;
                    case 'event':
                        return aName.localeCompare(bName);
                    default:
                        return 0;
                }
            });
            
            // Reorder in DOM
            items.forEach(item => {
                ticketList.appendChild(item);
            });
        }
        
        if (ticketGrid) {
            const items = Array.from(ticketGrid.querySelectorAll('.ticket-card'));
            
            items.sort((a, b) => {
                const aName = a.querySelector('h5').textContent;
                const bName = b.querySelector('h5').textContent;
                const aDate = a.querySelector('.ticket-card-date').textContent;
                const bDate = b.querySelector('.ticket-card-date').textContent;
                const aPrice = parseFloat(a.querySelector('.detail:nth-child(2) .value').textContent.replace('$', ''));
                const bPrice = parseFloat(b.querySelector('.detail:nth-child(2) .value').textContent.replace('$', ''));
                
                switch(sortBy) {
                    case 'date-desc':
                        return new Date(bDate) - new Date(aDate);
                    case 'date-asc':
                        return new Date(aDate) - new Date(bDate);
                    case 'price':
                        return bPrice - aPrice;
                    case 'event':
                        return aName.localeCompare(bName);
                    default:
                        return 0;
                }
            });
            
            // Reorder in DOM
            items.forEach(item => {
                ticketGrid.appendChild(item);
            });
        }
        
        showNotification(`Tickets sorted by ${sortFilter.options[sortFilter.selectedIndex].text}`, 'info');
    }
    
    // Update ticket counts
    function updateTicketCounts() {
        const totalTickets = 18;
        const activeTickets = 5;
        const usedTickets = 12;
        const digitalTickets = 18;
        
        document.getElementById('totalTickets').textContent = totalTickets;
        document.getElementById('activeTickets').textContent = activeTickets;
        document.getElementById('usedTickets').textContent = usedTickets;
        document.getElementById('digitalTickets').textContent = digitalTickets;
        document.getElementById('footerTotalTickets').textContent = totalTickets;
        document.getElementById('footerActiveTickets').textContent = activeTickets;
        document.getElementById('footerUsedTickets').textContent = usedTickets;
        
        // Update sidebar stats
        document.querySelector('.sidebar-footer .stat-item:nth-child(1) .stat-value').textContent = totalTickets;
        document.querySelector('.sidebar-footer .stat-item:nth-child(2) .stat-value').textContent = activeTickets;
    }
    
    // Check if empty state should be shown
    function checkEmptyState() {
        const visibleTickets = Array.from(ticketItems)
            .filter(item => item.style.display !== 'none').length;
        
        const emptyState = document.getElementById('emptyState');
        if (visibleTickets === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Open ticket modal
    function openTicketModal(eventName, ticketElement) {
        const modalTitle = document.getElementById('modalTicketTitle');
        const modalContent = document.getElementById('modalTicketContent');
        
        modalTitle.textContent = eventName;
        
        // Get ticket details
        const eventLocation = ticketElement.querySelector('.event-location, .ticket-card-date')?.textContent || 'Location not specified';
        const eventDate = ticketElement.querySelector('.event-date, .ticket-card-date')?.textContent || 'Date not specified';
        const ticketNumber = ticketElement.querySelector('.detail-item:nth-child(1) .value, .ticket-card-details .detail:nth-child(1) .value')?.textContent || 'N/A';
        const ticketType = ticketElement.querySelector('.detail-item:nth-child(2) .value, .ticket-card-details .detail:nth-child(1) .value')?.textContent || 'General';
        const price = ticketElement.querySelector('.detail-item:nth-child(3) .value, .ticket-card-details .detail:nth-child(2) .value')?.textContent || '$0.00';
        
        modalContent.innerHTML = `
            <div class="ticket-modal-content">
                <div class="ticket-modal-header">
                    <div class="event-icon large ${getEventCategory(eventName)}">
                        <i class="fas fa-${getEventIcon(eventName)}"></i>
                    </div>
                    <div class="ticket-modal-title">
                        <h4>${eventName}</h4>
                        <p class="ticket-modal-subtitle">${eventDate}</p>
                    </div>
                </div>
                
                <div class="ticket-modal-details">
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="label">Ticket Number</span>
                            <span class="value">${ticketNumber}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Ticket Type</span>
                            <span class="value ${ticketType.toLowerCase()}">${ticketType}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Price</span>
                            <span class="value">${price}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Purchase Date</span>
                            <span class="value">Dec 1, 2024</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Venue</span>
                            <span class="value">${eventLocation}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Status</span>
                            <span class="value active">Active</span>
                        </div>
                    </div>
                </div>
                
                <div class="ticket-modal-qr">
                    <div class="qr-container">
                        <div class="qr-code-large">
                            <i class="fas fa-qrcode"></i>
                            <p>Scan QR Code for Entry</p>
                            <span class="qr-timer">Refreshes in: <span id="qrTimer">30</span>s</span>
                        </div>
                        <div class="qr-instructions">
                            <h5>Entry Instructions:</h5>
                            <ul>
                                <li>Present this QR code at the entrance</li>
                                <li>QR code refreshes every 30 seconds for security</li>
                                <li>Ensure your phone brightness is at maximum</li>
                                <li>Have a valid ID ready for verification</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="ticket-modal-actions">
                    <button class="btn-download-pdf">
                        <i class="fas fa-file-pdf"></i> Download PDF
                    </button>
                    <button class="btn-print-ticket">
                        <i class="fas fa-print"></i> Print Ticket
                    </button>
                    <button class="btn-save-wallet">
                        <i class="fas fa-wallet"></i> Save to Wallet
                    </button>
                </div>
            </div>
        `;
        
        // Add modal-specific styles if not already added
        if (!document.querySelector('#ticket-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'ticket-modal-styles';
            style.textContent = `
                .ticket-modal-content {
                    padding: 10px;
                    max-height: calc(90vh - 120px);
                    overflow-y: auto;
                }
                
                .ticket-modal-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .event-icon.large {
                    width: 80px;
                    height: 80px;
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 32px;
                    flex-shrink: 0;
                }
                
                .event-icon.large.tech {
                    background: linear-gradient(135deg, #3b82f6, #60a5fa);
                }
                
                .event-icon.large.music {
                    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
                }
                
                .event-icon.large.food {
                    background: linear-gradient(135deg, #f59e0b, #fbbf24);
                }
                
                .ticket-modal-title {
                    flex: 1;
                }
                
                .ticket-modal-title h4 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    color: var(--text-primary);
                }
                
                .ticket-modal-subtitle {
                    font-size: 16px;
                    color: var(--text-secondary);
                }
                
                .ticket-modal-details {
                    margin-bottom: 30px;
                }
                
                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                }
                
                .detail-item {
                    padding: 15px;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                }
                
                .detail-item .label {
                    font-size: 12px;
                    color: var(--text-secondary);
                    display: block;
                    margin-bottom: 6px;
                }
                
                .detail-item .value {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-primary);
                    display: block;
                }
                
                .detail-item .value.vip {
                    color: var(--warning-color);
                }
                
                .detail-item .value.active {
                    color: var(--success-color);
                }
                
                .ticket-modal-qr {
                    margin-bottom: 30px;
                }
                
                .qr-container {
                    display: flex;
                    gap: 30px;
                    align-items: flex-start;
                }
                
                .qr-code-large {
                    width: 200px;
                    height: 200px;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-color);
                    text-align: center;
                    padding: 20px;
                    flex-shrink: 0;
                }
                
                .qr-code-large i {
                    font-size: 80px;
                    margin-bottom: 15px;
                }
                
                .qr-code-large p {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: var(--text-primary);
                }
                
                .qr-timer {
                    font-size: 12px;
                    color: var(--text-secondary);
                }
                
                .qr-instructions {
                    flex: 1;
                }
                
                .qr-instructions h5 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: var(--text-primary);
                }
                
                .qr-instructions ul {
                    list-style: none;
                    padding: 0;
                }
                
                .qr-instructions li {
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin-bottom: 10px;
                    padding-left: 24px;
                    position: relative;
                }
                
                .qr-instructions li:before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--success-color);
                    font-weight: bold;
                }
                
                .ticket-modal-actions {
                    display: flex;
                    gap: 15px;
                }
                
                .btn-download-pdf,
                .btn-print-ticket,
                .btn-save-wallet {
                    flex: 1;
                    padding: 15px;
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .btn-download-pdf {
                    background: var(--danger-color);
                    color: white;
                    border: none;
                }
                
                .btn-download-pdf:hover {
                    background: #dc2626;
                }
                
                .btn-print-ticket {
                    background: var(--primary-light);
                    color: var(--primary-color);
                    border: 1px solid var(--primary-color);
                }
                
                .btn-print-ticket:hover {
                    background: var(--primary-color);
                    color: white;
                }
                
                .btn-save-wallet {
                    background: var(--primary-color);
                    color: white;
                    border: none;
                }
                
                .btn-save-wallet:hover {
                    background: var(--secondary-color);
                }
                
                @media (max-width: 768px) {
                    .qr-container {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .ticket-modal-actions {
                        flex-direction: column;
                    }
                    
                    .details-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                @media (max-width: 480px) {
                    .ticket-modal-header {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show modal
        ticketModal.classList.add('active');
        ticketModal.style.display = 'flex';
        
        // Start QR timer
        startQRTimer();
        
        // Add event listeners to modal buttons
        setTimeout(() => {
            const downloadPdfBtn = modalContent.querySelector('.btn-download-pdf');
            const printTicketBtn = modalContent.querySelector('.btn-print-ticket');
            const saveWalletBtn = modalContent.querySelector('.btn-save-wallet');
            
            if (downloadPdfBtn) {
                downloadPdfBtn.addEventListener('click', function() {
                    showNotification(`Downloading PDF ticket for ${eventName}...`, 'info');
                });
            }
            
            if (printTicketBtn) {
                printTicketBtn.addEventListener('click', function() {
                    showNotification(`Printing ticket for ${eventName}...`, 'info');
                });
            }
            
            if (saveWalletBtn) {
                saveWalletBtn.addEventListener('click', function() {
                    showNotification(`Saving ${eventName} to wallet...`, 'info');
                    this.innerHTML = '<i class="fas fa-check"></i> Saved';
                    this.disabled = true;
                    this.style.opacity = '0.7';
                });
            }
        }, 100);
    }
    
    // Open transfer modal
    function openTransferModal() {
        transferModal.classList.add('active');
        transferModal.style.display = 'flex';
    }
    
    // Show more options menu
    function showMoreOptions(eventName, ticketItem) {
        // In a real app, this would show a dropdown menu
        const options = [
            'Transfer Ticket',
            'Cancel Ticket',
            'Request Refund',
            'Duplicate Ticket',
            'View Purchase History',
            'Contact Organizer'
        ];
        
        showNotification(`More options for ${eventName}: ${options.join(', ')}`, 'info');
    }
    
    // Simulate QR code refresh
    function simulateQRRefresh() {
        setInterval(() => {
            const qrTimers = document.querySelectorAll('#qrTimer');
            qrTimers.forEach(timer => {
                let seconds = parseInt(timer.textContent);
                seconds = seconds > 0 ? seconds - 1 : 30;
                timer.textContent = seconds;
                
                if (seconds === 0) {
                    showNotification('QR code refreshed for security', 'info');
                }
            });
        }, 1000);
    }
    
    // Start QR timer
    function startQRTimer() {
        const qrTimer = document.getElementById('qrTimer');
        if (qrTimer) {
            let seconds = 30;
            const interval = setInterval(() => {
                seconds = seconds > 0 ? seconds - 1 : 30;
                qrTimer.textContent = seconds;
                
                if (seconds === 0) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }
    
    // Get event category
    function getEventCategory(eventName) {
        if (eventName.toLowerCase().includes('tech') || eventName.toLowerCase().includes('conference')) {
            return 'tech';
        } else if (eventName.toLowerCase().includes('music') || eventName.toLowerCase().includes('festival')) {
            return 'music';
        } else if (eventName.toLowerCase().includes('food') || eventName.toLowerCase().includes('wine')) {
            return 'food';
        } else {
            return 'tech';
        }
    }
    
    // Get event icon
    function getEventIcon(eventName) {
        if (eventName.toLowerCase().includes('tech') || eventName.toLowerCase().includes('conference')) {
            return 'laptop-code';
        } else if (eventName.toLowerCase().includes('music') || eventName.toLowerCase().includes('festival')) {
            return 'music';
        } else if (eventName.toLowerCase().includes('food') || eventName.toLowerCase().includes('wine')) {
            return 'utensils';
        } else {
            return 'calendar-alt';
        }
    }
    
    // Validate email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Close modal function
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Show notification (using the same function from dashboard)
    function showNotification(message, type = 'info') {
        // Reuse the notification function from dashboard
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback if dashboard function not available
            console.log(`${type}: ${message}`);
            alert(message);
        }
    }
    
    // Initialize on load
    updateTicketCounts();
    checkEmptyState();
});