// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const searchInput = document.getElementById('searchInput');
    const matchFilter = document.getElementById('matchFilter');
    const dateFilter = document.getElementById('dateFilter');
    const resetFilters = document.getElementById('resetFilters');
    const refreshRecommendationsBtn = document.getElementById('refreshRecommendations');
    const managePreferencesBtn = document.getElementById('managePreferences');
    const insightInfoBtn = document.getElementById('insightInfo');
    const quickBookmarkButtons = document.querySelectorAll('.quick-bookmark');
    const moreOptionsButtons = document.querySelectorAll('.more-options');
    const bookNowButtons = document.querySelectorAll('.btn-book-now');
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    const loadMoreBtn = document.getElementById('loadMoreRecommendations');
    const editProfileBtn = document.getElementById('editProfile');
    const improveProfileBtn = document.querySelector('.btn-improve-profile');
    const followEventButtons = document.querySelectorAll('.btn-follow-event');
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    const updateProfileBtn = document.getElementById('updateProfileBtn');
    const closeEventModal = document.getElementById('closeEventModal');
    const eventModal = document.getElementById('eventModal');
    const closePreferencesModal = document.getElementById('closePreferencesModal');
    const preferencesModal = document.getElementById('preferencesModal');
    const cancelPreferencesBtn = document.getElementById('cancelPreferences');
    const savePreferencesBtn = document.getElementById('savePreferences');
    const priceRangeSlider = document.getElementById('priceRange');
    const currentPriceSpan = document.getElementById('currentPrice');
    
    // Recommendation data
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    
    // Initialize recommendations page
    initRecommendationsPage();
    
    function initRecommendationsPage() {
        // Setup event listeners
        setupEventListeners();
        
        // Update counts
        updateRecommendationCounts();
        
        // Initialize price range
        initPriceRange();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Filter controls
        matchFilter.addEventListener('change', filterRecommendations);
        dateFilter.addEventListener('change', filterRecommendations);
        
        // Reset filters
        resetFilters.addEventListener('click', function() {
            matchFilter.value = 'all';
            dateFilter.value = 'all';
            filterRecommendations();
            showNotification('Filters reset to default');
        });
        
        // Search input
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 2) {
                filterRecommendations();
            } else if (searchTerm.length === 0) {
                filterRecommendations();
            }
        });
        
        // Refresh recommendations
        refreshRecommendationsBtn.addEventListener('click', function() {
            showNotification('Refreshing recommendations...', 'info');
            
            // Animate refresh
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
                this.disabled = false;
                showNotification('Recommendations refreshed with 3 new matches!', 'success');
                
                // Update counts
                updateRecommendationCounts();
            }, 2000);
        });
        
        // Manage preferences
        managePreferencesBtn.addEventListener('click', function() {
            openPreferencesModal();
        });
        
        // Insight info
        insightInfoBtn.addEventListener('click', function() {
            showNotification('Recommendations are based on your event history, interests, friends activity, and trending events in your area.', 'info');
        });
        
        // Quick bookmark buttons
        quickBookmarkButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recommendationCard = this.closest('.recommendation-card');
                const eventName = recommendationCard.querySelector('h4').textContent;
                
                // Toggle bookmark state
                const isBookmarked = this.querySelector('i').classList.contains('fas');
                
                if (isBookmarked) {
                    this.innerHTML = '<i class="far fa-bookmark"></i>';
                    showNotification(`Removed ${eventName} from bookmarks`, 'info');
                } else {
                    this.innerHTML = '<i class="fas fa-bookmark"></i>';
                    this.style.color = 'var(--warning-color)';
                    showNotification(`Added ${eventName} to bookmarks`, 'success');
                }
            });
        });
        
        // More options buttons
        moreOptionsButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recommendationCard = this.closest('.recommendation-card');
                const eventName = recommendationCard.querySelector('h4').textContent;
                showMoreOptions(eventName, recommendationCard);
            });
        });
        
        // Book now buttons
        bookNowButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recommendationCard = this.closest('.recommendation-card');
                const eventName = recommendationCard.querySelector('h4').textContent;
                
                showNotification(`Booking tickets for ${eventName}...`, 'info');
                
                // Change button state
                this.innerHTML = '<i class="fas fa-check"></i> Booked';
                this.disabled = true;
                this.style.opacity = '0.7';
                
                // Update match score to indicate booked
                const matchScore = recommendationCard.querySelector('.score-value');
                matchScore.textContent = '100%';
                matchScore.style.color = 'var(--success-color)';
                
                setTimeout(() => {
                    showNotification(`Successfully booked ${eventName}!`, 'success');
                }, 1500);
            });
        });
        
        // View details buttons
        viewDetailsButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recommendationCard = this.closest('.recommendation-card');
                const eventName = recommendationCard.querySelector('h4').textContent;
                const eventDescription = recommendationCard.querySelector('.event-description').textContent;
                const eventInfo = recommendationCard.querySelectorAll('.info-item');
                const matchReasons = recommendationCard.querySelectorAll('.match-reasons li');
                openEventModal(eventName, eventDescription, eventInfo, matchReasons);
            });
        });
        
        // Load more recommendations
        loadMoreBtn.addEventListener('click', function() {
            showNotification('Loading more recommendations...', 'info');
            
            // Simulate loading
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                // In a real app, this would load more recommendations from API
                this.innerHTML = '<i class="fas fa-check"></i> All Recommendations Loaded';
                this.style.opacity = '0.7';
                showNotification('All recommendations loaded', 'success');
            }, 2000);
        });
        
        // Edit profile
        editProfileBtn.addEventListener('click', function() {
            showNotification('Opening profile editor...', 'info');
        });
        
        // Improve profile
        improveProfileBtn.addEventListener('click', function() {
            showNotification('Improving your profile...', 'info');
            
            // Simulate profile improvement
            setTimeout(() => {
                showNotification('Profile strength improved to 95%!', 'success');
                
                // Update profile score
                const profileScore = document.querySelector('.profile-score-circle .score-value');
                profileScore.textContent = '95%';
                
                // Update ring animation
                const ring = document.querySelector('.profile-score-circle .score-ring-fill');
                ring.style.strokeDashoffset = '37.68'; // 95% filled
            }, 2000);
        });
        
        // Follow event buttons
        followEventButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const friendRecommendation = this.closest('.friend-recommendation');
                const friendName = friendRecommendation.querySelector('h5').textContent;
                const eventName = friendRecommendation.querySelector('.friend-event').textContent;
                
                showNotification(`Following ${friendName}'s event: ${eventName}`, 'info');
                
                // Change button state
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.disabled = true;
                this.style.opacity = '0.7';
            });
        });
        
        // Quick action buttons
        quickActionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('span').textContent;
                switch(action) {
                    case 'Discover Similar':
                        showNotification('Finding similar events...', 'info');
                        break;
                    case 'Save Search':
                        showNotification('Saving your search preferences...', 'info');
                        break;
                    case 'Get Alerts':
                        showNotification('Setting up recommendation alerts...', 'info');
                        break;
                    case 'Share Profile':
                        showNotification('Sharing your interests profile...', 'info');
                        break;
                }
            });
        });
        
        // Update profile button
        updateProfileBtn.addEventListener('click', function() {
            openPreferencesModal();
        });
        
        // Recommendation card clicks
        recommendationCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('button') && !e.target.closest('.icon-btn')) {
                    const eventName = this.querySelector('h4').textContent;
                    const eventDescription = this.querySelector('.event-description').textContent;
                    const eventInfo = this.querySelectorAll('.info-item');
                    const matchReasons = this.querySelectorAll('.match-reasons li');
                    openEventModal(eventName, eventDescription, eventInfo, matchReasons);
                }
            });
        });
        
        // Close event modal
        closeEventModal.addEventListener('click', function() {
            closeModal(eventModal);
        });
        
        // Close modal when clicking outside
        eventModal.addEventListener('click', function(e) {
            if (e.target === eventModal) {
                closeModal(eventModal);
            }
        });
        
        // Preferences modal functionality
        closePreferencesModal.addEventListener('click', function() {
            closeModal(preferencesModal);
        });
        
        preferencesModal.addEventListener('click', function(e) {
            if (e.target === preferencesModal) {
                closeModal(preferencesModal);
            }
        });
        
        cancelPreferencesBtn.addEventListener('click', function() {
            closeModal(preferencesModal);
        });
        
        savePreferencesBtn.addEventListener('click', function() {
            // Get selected preferences
            const selectedInterests = Array.from(document.querySelectorAll('.preference-tag input:checked'))
                .map(checkbox => checkbox.nextElementSibling.textContent.trim());
            
            const priceValue = priceRangeSlider.value;
            const selectedDistance = document.querySelector('input[name="distance"]:checked').value;
            const selectedNotifications = Array.from(document.querySelectorAll('.notification-option input:checked'))
                .map(checkbox => checkbox.nextElementSibling.textContent.trim());
            
            // Save preferences logic
            showNotification('Preferences saved successfully!', 'success');
            closeModal(preferencesModal);
            
            // Update recommendation counts
            updateRecommendationCounts();
        });
        
        // Price range slider
        priceRangeSlider.addEventListener('input', function() {
            currentPriceSpan.textContent = `$${this.value}`;
        });
    }
    
    // Initialize price range
    function initPriceRange() {
        if (priceRangeSlider && currentPriceSpan) {
            currentPriceSpan.textContent = `$${priceRangeSlider.value}`;
        }
    }
    
    // Filter recommendations based on selected filters
    function filterRecommendations() {
        const searchTerm = searchInput.value.toLowerCase();
        const matchType = matchFilter.value;
        const dateType = dateFilter.value;
        
        let totalCount = 0;
        let highMatchCount = 0;
        let visibleCount = 0;
        
        recommendationCards.forEach(card => {
            const eventName = card.querySelector('h4').textContent.toLowerCase();
            const eventDescription = card.querySelector('.event-description').textContent.toLowerCase();
            const matchScore = parseInt(card.getAttribute('data-match'));
            const eventDate = card.getAttribute('data-date');
            
            // Search filter
            const matchesSearch = searchTerm === '' || 
                eventName.includes(searchTerm) || 
                eventDescription.includes(searchTerm);
            
            // Match filter
            let matchesMatch = true;
            switch(matchType) {
                case 'high':
                    matchesMatch = matchScore >= 90;
                    break;
                case 'medium':
                    matchesMatch = matchScore >= 70 && matchScore <= 89;
                    break;
                case 'friends':
                    const friendsCount = card.querySelectorAll('.friend-avatars img').length;
                    matchesMatch = friendsCount > 0;
                    break;
                case 'trending':
                    // For demo, assume trending if match score > 85
                    matchesMatch = matchScore > 85;
                    break;
            }
            
            // Date filter
            let matchesDate = true;
            if (dateType !== 'all') {
                matchesDate = eventDate === dateType;
            }
            
            // Show/hide card
            if (matchesSearch && matchesMatch && matchesDate) {
                card.style.display = 'block';
                visibleCount++;
                
                // Update counts
                totalCount++;
                if (matchScore >= 90) {
                    highMatchCount++;
                }
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update stats
        updateFilteredCounts(totalCount, highMatchCount);
        
        // Check empty state
        checkEmptyState();
        
        if (searchTerm || matchType !== 'all' || dateType !== 'all') {
            showNotification(`Found ${visibleCount} recommendations matching your filters`, 'info');
        }
    }
    
    // Update recommendation counts
    function updateRecommendationCounts() {
        const totalRecommendations = recommendationCards.length;
        const highMatchCount = Array.from(recommendationCards).filter(card => 
            parseInt(card.getAttribute('data-match')) >= 90).length;
        
        // Calculate average match score
        let totalMatchScore = 0;
        recommendationCards.forEach(card => {
            totalMatchScore += parseInt(card.getAttribute('data-match'));
        });
        const avgMatchScore = Math.round(totalMatchScore / recommendationCards.length);
        
        // Count friends attending
        let friendsCount = 0;
        recommendationCards.forEach(card => {
            const friendsAttending = card.querySelector('.friend-avatars');
            if (friendsAttending) {
                const friendImages = friendsAttending.querySelectorAll('img');
                const moreFriends = friendsAttending.querySelector('.more-friends');
                if (moreFriends) {
                    const moreCount = parseInt(moreFriends.textContent.replace('+', '')) || 0;
                    friendsCount += friendImages.length + moreCount;
                } else {
                    friendsCount += friendImages.length;
                }
            }
        });
        
        // Count interests (simplified for demo)
        const interestsCount = 8;
        
        document.getElementById('personalizedCount').textContent = totalRecommendations;
        document.getElementById('matchScore').textContent = `${avgMatchScore}%`;
        document.getElementById('friendsAttending').textContent = friendsCount;
        document.getElementById('topInterests').textContent = interestsCount;
        document.getElementById('footerMatches').textContent = totalRecommendations;
        document.getElementById('footerMatchScore').textContent = `${avgMatchScore}%`;
        document.getElementById('footerFriends').textContent = friendsCount;
        
        // Update sidebar stats
        document.querySelector('.sidebar-footer .stat-item:nth-child(1) .stat-value').textContent = totalRecommendations;
        document.querySelector('.sidebar-footer .stat-item:nth-child(2) .stat-value').textContent = interestsCount;
    }
    
    // Update filtered counts
    function updateFilteredCounts(total, highMatches) {
        document.getElementById('personalizedCount').textContent = total;
        document.getElementById('matchScore').textContent = `${Math.round((highMatches / total) * 100)}%`;
    }
    
    // Check if empty state should be shown
    function checkEmptyState() {
        const visibleRecommendations = Array.from(recommendationCards)
            .filter(card => card.style.display !== 'none').length;
        
        const emptyState = document.getElementById('emptyState');
        if (visibleRecommendations === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Open event modal
    function openEventModal(eventName, description, infoItems, matchReasons) {
        const modalTitle = document.getElementById('modalEventTitle');
        const modalContent = document.getElementById('modalEventContent');
        
        modalTitle.textContent = eventName;
        
        // Create info HTML
        let infoHTML = '';
        infoItems.forEach(item => {
            infoHTML += `<p>${item.innerHTML}</p>`;
        });
        
        // Create match reasons HTML
        let reasonsHTML = '';
        if (matchReasons) {
            reasonsHTML = '<h5>Why this is recommended for you:</h5><ul>';
            matchReasons.forEach(reason => {
                reasonsHTML += `<li>${reason.textContent}</li>`;
            });
            reasonsHTML += '</ul>';
        }
        
        modalContent.innerHTML = `
            <div class="event-modal-content">
                <div class="event-modal-header">
                    <div class="match-badge">
                        <span class="match-percent">95% Match</span>
                        <span class="match-label">Excellent Match</span>
                    </div>
                </div>
                
                <div class="event-modal-description">
                    <h4>About This Event</h4>
                    <p>${description}</p>
                </div>
                
                <div class="event-modal-info">
                    <h4>Event Information</h4>
                    ${infoHTML}
                </div>
                
                <div class="event-modal-match">
                    ${reasonsHTML}
                </div>
                
                <div class="event-modal-actions">
                    <button class="btn-book-now-modal">
                        <i class="fas fa-shopping-cart"></i> Book Now
                    </button>
                    <button class="btn-save-event">
                        <i class="fas fa-bookmark"></i> Save for Later
                    </button>
                    <button class="btn-share-event">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        `;
        
        // Add modal-specific styles if not already added
        if (!document.querySelector('#recommended-event-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'recommended-event-modal-styles';
            style.textContent = `
                .event-modal-header {
                    margin-bottom: 20px;
                }
                
                .match-badge {
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    padding: 15px 25px;
                    background: var(--primary-light);
                    border-radius: var(--radius-lg);
                }
                
                .match-percent {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--primary-color);
                }
                
                .match-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .event-modal-description,
                .event-modal-info,
                .event-modal-match {
                    margin-bottom: 25px;
                }
                
                .event-modal-description h4,
                .event-modal-info h4,
                .event-modal-match h5 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: var(--text-primary);
                }
                
                .event-modal-description p {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                
                .event-modal-info p {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                    color: var(--text-primary);
                }
                
                .event-modal-info i {
                    color: var(--primary-color);
                    width: 16px;
                }
                
                .event-modal-match ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .event-modal-match li {
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin-bottom: 10px;
                    padding-left: 24px;
                    position: relative;
                }
                
                .event-modal-match li:before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--success-color);
                    font-weight: bold;
                }
                
                .event-modal-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                }
                
                .btn-book-now-modal,
                .btn-save-event,
                .btn-share-event {
                    flex: 1;
                    padding: 12px;
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                .btn-book-now-modal {
                    background: var(--success-color);
                    color: white;
                    border: none;
                }
                
                .btn-book-now-modal:hover {
                    background: #0da271;
                }
                
                .btn-save-event {
                    background: var(--primary-light);
                    color: var(--primary-color);
                    border: 1px solid var(--primary-color);
                }
                
                .btn-save-event:hover {
                    background: var(--primary-color);
                    color: white;
                }
                
                .btn-share-event {
                    background: white;
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }
                
                .btn-share-event:hover {
                    background: var(--bg-secondary);
                }
                
                @media (max-width: 768px) {
                    .event-modal-actions {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show modal
        eventModal.classList.add('active');
        eventModal.style.display = 'flex';
        
        // Add event listeners to modal buttons
        setTimeout(() => {
            const bookNowBtn = modalContent.querySelector('.btn-book-now-modal');
            const saveEventBtn = modalContent.querySelector('.btn-save-event');
            const shareBtn = modalContent.querySelector('.btn-share-event');
            
            if (bookNowBtn) {
                bookNowBtn.addEventListener('click', function() {
                    showNotification(`Booking ${eventName}...`, 'info');
                    closeModal(eventModal);
                });
            }
            
            if (saveEventBtn) {
                saveEventBtn.addEventListener('click', function() {
                    showNotification(`Saving ${eventName} to bookmarks...`, 'info');
                    this.innerHTML = '<i class="fas fa-check"></i> Saved';
                    this.disabled = true;
                    this.style.opacity = '0.7';
                });
            }
            
            if (shareBtn) {
                shareBtn.addEventListener('click', function() {
                    showNotification(`Sharing ${eventName}...`, 'info');
                });
            }
        }, 100);
    }
    
    // Open preferences modal
    function openPreferencesModal() {
        preferencesModal.classList.add('active');
        preferencesModal.style.display = 'flex';
    }
    
    // Show more options menu
    function showMoreOptions(eventName, recommendationCard) {
        // In a real app, this would show a dropdown menu
        const options = [
            'Not Interested',
            'Hide Similar Events',
            'Report Inappropriate',
            'View Event Website',
            'Contact Organizer',
            'Compare with Similar',
            'Get Price Alert',
            'Share with Specific Friends'
        ];
        
        showNotification(`More options for ${eventName}: ${options.join(', ')}`, 'info');
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
    updateRecommendationCounts();
    checkEmptyState();
});