// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const searchInput = document.getElementById('searchInput');
    const timeFilter = document.getElementById('timeFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resetFilters = document.getElementById('resetFilters');
    const prevYearBtn = document.getElementById('prevYear');
    const nextYearBtn = document.getElementById('nextYear');
    const currentYearEl = document.getElementById('currentYear');
    const viewDetailButtons = document.querySelectorAll('.view-details');
    const shareButtons = document.querySelectorAll('.share-event');
    const addMemoryButtons = document.querySelectorAll('.add-memories');
    const interestedAgainButtons = document.querySelectorAll('.interested-again');
    const editReviewButtons = document.querySelectorAll('.btn-edit-review');
    const shareReviewButtons = document.querySelectorAll('.btn-share-review');
    const addMemoryBtn = document.getElementById('addMemoryBtn');
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    const exploreEventsBtn = document.getElementById('exploreEventsBtn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const closeEventModal = document.getElementById('closeEventModal');
    const eventModal = document.getElementById('eventModal');
    const closeReviewModal = document.getElementById('closeReviewModal');
    const reviewModal = document.getElementById('reviewModal');
    const cancelReviewBtn = document.getElementById('cancelReview');
    const submitReviewBtn = document.getElementById('submitReview');
    const reviewStars = document.querySelectorAll('.stars i');
    const ratingValue = document.querySelector('.rating-value');
    const photoInput = document.getElementById('photoInput');
    const uploadPreview = document.getElementById('uploadPreview');
    
    // Current year for navigation
    let currentYear = 2024;
    
    // Review state
    let selectedRating = 0;
    let uploadedPhotos = [];
    
    // Initialize past events page
    initPastEvents();
    
    function initPastEvents() {
        // Setup event listeners
        setupEventListeners();
        
        // Update counts
        updateEventCounts();
        
        // Update year display
        updateYearDisplay();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Filter controls
        timeFilter.addEventListener('change', filterEvents);
        categoryFilter.addEventListener('change', filterEvents);
        sortFilter.addEventListener('change', sortEvents);
        
        // Reset filters
        resetFilters.addEventListener('click', function() {
            timeFilter.value = 'all';
            categoryFilter.value = 'all';
            sortFilter.value = 'date-desc';
            filterEvents();
            showNotification('Filters reset to default');
        });
        
        // Search input
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 2) {
                filterEvents();
            } else if (searchTerm.length === 0) {
                filterEvents();
            }
        });
        
        // Year navigation
        prevYearBtn.addEventListener('click', function() {
            currentYear--;
            updateYearDisplay();
            showNotification(`Viewing events from ${currentYear}`, 'info');
        });
        
        nextYearBtn.addEventListener('click', function() {
            currentYear++;
            updateYearDisplay();
            showNotification(`Viewing events from ${currentYear}`, 'info');
        });
        
        // View details buttons
        viewDetailButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const timelineItem = this.closest('.timeline-item');
                const eventName = timelineItem.querySelector('h5').textContent;
                const eventCategory = timelineItem.querySelector('.category').textContent;
                const eventNote = timelineItem.querySelector('.event-note').textContent;
                const eventDate = timelineItem.querySelector('.timeline-date').textContent.trim();
                
                openEventModal(eventName, eventCategory, eventNote, eventDate);
            });
        });
        
        // Share event buttons
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const timelineItem = this.closest('.timeline-item');
                const eventName = timelineItem.querySelector('h5').textContent;
                showNotification(`Sharing ${eventName} on social media`, 'info');
            });
        });
        
        // Add memory buttons
        addMemoryButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const timelineItem = this.closest('.timeline-item');
                const eventName = timelineItem.querySelector('h5').textContent;
                openMemoryUpload(eventName);
            });
        });
        
        // Interested again buttons
        interestedAgainButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const timelineItem = this.closest('.timeline-item');
                const eventName = timelineItem.querySelector('h5').textContent;
                showNotification(`Marked ${eventName} as interested for future events`, 'success');
                
                // Change button state
                this.innerHTML = '<i class="fas fa-check"></i> Interested';
                this.disabled = true;
                this.style.opacity = '0.7';
            });
        });
        
        // Edit review buttons
        editReviewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const reviewCard = this.closest('.review-card');
                const eventName = reviewCard.querySelector('h5').textContent;
                openReviewModal(eventName);
            });
        });
        
        // Share review buttons
        shareReviewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const reviewCard = this.closest('.review-card');
                const eventName = reviewCard.querySelector('h5').textContent;
                showNotification(`Sharing your review of ${eventName}`, 'info');
            });
        });
        
        // Add memory button
        addMemoryBtn.addEventListener('click', function() {
            showNotification('Opening memory upload', 'info');
        });
        
        // Quick action buttons
        quickActionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('span').textContent;
                switch(action) {
                    case 'Export History':
                        showNotification('Exporting your event history...', 'info');
                        break;
                    case 'Write Reviews':
                        openReviewModal();
                        break;
                    case 'Certificates':
                        showNotification('Viewing your event certificates...', 'info');
                        break;
                    case 'Relive Events':
                        showNotification('Browsing past event highlights...', 'info');
                        break;
                }
            });
        });
        
        // Explore events button
        exploreEventsBtn.addEventListener('click', function() {
            showNotification('Opening events explorer...', 'info');
        });
        
        // Timeline item clicks
        timelineItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('button') && !e.target.closest('.icon-btn')) {
                    const eventName = this.querySelector('h5').textContent;
                    const eventCategory = this.querySelector('.category').textContent;
                    const eventNote = this.querySelector('.event-note').textContent;
                    const eventDate = this.querySelector('.timeline-date').textContent.trim();
                    
                    openEventModal(eventName, eventCategory, eventNote, eventDate);
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
        
        // Review modal functionality
        closeReviewModal.addEventListener('click', function() {
            closeModal(reviewModal);
        });
        
        reviewModal.addEventListener('click', function(e) {
            if (e.target === reviewModal) {
                closeModal(reviewModal);
            }
        });
        
        cancelReviewBtn.addEventListener('click', function() {
            closeModal(reviewModal);
            resetReviewForm();
        });
        
        // Star rating
        reviewStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                selectedRating = rating;
                updateStarRating(rating);
                ratingValue.textContent = `${rating}/5`;
            });
            
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(rating);
            });
            
            star.addEventListener('mouseout', function() {
                updateStarRating(selectedRating);
            });
        });
        
        // Photo upload
        photoInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            if (files.length + uploadedPhotos.length > 5) {
                showNotification('Maximum 5 photos allowed', 'error');
                return;
            }
            
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        uploadedPhotos.push({
                            file: file,
                            url: e.target.result
                        });
                        updatePhotoPreview();
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
        
        // Submit review
        submitReviewBtn.addEventListener('click', function() {
            const eventSelect = document.getElementById('reviewEvent');
            const reviewTitle = document.getElementById('reviewTitle').value;
            const reviewText = document.getElementById('reviewText').value;
            
            if (!eventSelect.value) {
                showNotification('Please select an event', 'error');
                return;
            }
            
            if (selectedRating === 0) {
                showNotification('Please provide a rating', 'error');
                return;
            }
            
            if (!reviewTitle.trim() || !reviewText.trim()) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Submit review logic
            showNotification('Review submitted successfully!', 'success');
            closeModal(reviewModal);
            resetReviewForm();
            
            // Update review count
            updateReviewCount();
        });
    }
    
    // Update year display
    function updateYearDisplay() {
        currentYearEl.textContent = currentYear;
        
        // Disable next year button if current year is current year
        const currentDate = new Date();
        nextYearBtn.disabled = currentYear >= currentDate.getFullYear();
        nextYearBtn.style.opacity = nextYearBtn.disabled ? '0.5' : '1';
        nextYearBtn.style.cursor = nextYearBtn.disabled ? 'not-allowed' : 'pointer';
    }
    
    // Filter events based on selected filters
    function filterEvents() {
        const searchTerm = searchInput.value.toLowerCase();
        const timePeriod = timeFilter.value;
        const category = categoryFilter.value;
        
        let visibleCount = 0;
        let yearCount = 0;
        
        timelineItems.forEach(item => {
            const eventName = item.querySelector('h5').textContent.toLowerCase();
            const eventNote = item.querySelector('.event-note').textContent.toLowerCase();
            const eventCategory = item.querySelector('.category').textContent.toLowerCase();
            const eventDate = item.querySelector('.timeline-date .day').textContent;
            const eventYear = parseInt(item.querySelector('.timeline-date .year').textContent);
            
            // Check if event is in selected year
            const inSelectedYear = eventYear === currentYear;
            
            // Search filter
            const matchesSearch = searchTerm === '' || 
                eventName.includes(searchTerm) || 
                eventNote.includes(searchTerm);
            
            // Category filter
            const matchesCategory = category === 'all' || 
                (category === 'tech' && eventCategory.includes('technology')) ||
                (category === 'music' && eventCategory.includes('music')) ||
                (category === 'food' && eventCategory.includes('food')) ||
                (category === 'sports' && eventCategory.includes('sports')) ||
                (category === 'arts' && eventCategory.includes('arts')) ||
                (category === 'business' && eventCategory.includes('business'));
            
            // Time period filter (simplified for demo)
            let matchesTime = true;
            if (timePeriod !== 'all') {
                const currentDate = new Date();
                const eventDateObj = new Date(`${eventDate}, ${eventYear}`);
                
                switch(timePeriod) {
                    case 'month':
                        const monthAgo = new Date();
                        monthAgo.setMonth(currentDate.getMonth() - 1);
                        matchesTime = eventDateObj >= monthAgo;
                        break;
                    case '3months':
                        const threeMonthsAgo = new Date();
                        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
                        matchesTime = eventDateObj >= threeMonthsAgo;
                        break;
                    case '6months':
                        const sixMonthsAgo = new Date();
                        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
                        matchesTime = eventDateObj >= sixMonthsAgo;
                        break;
                    case 'year':
                        matchesTime = eventYear === currentDate.getFullYear();
                        break;
                    case 'lastyear':
                        matchesTime = eventYear === currentDate.getFullYear() - 1;
                        break;
                }
            }
            
            // Show/hide item
            if (inSelectedYear && matchesSearch && matchesCategory && matchesTime) {
                item.style.display = 'flex';
                visibleCount++;
                yearCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update timeline count
        document.getElementById('timelineCount').textContent = `${yearCount} event${yearCount !== 1 ? 's' : ''}`;
        
        // Check empty state
        checkEmptyState();
        
        if (searchTerm || category !== 'all' || timePeriod !== 'all') {
            showNotification(`Found ${visibleCount} events matching your filters`, 'info');
        }
    }
    
    // Sort events
    function sortEvents() {
        const sortBy = sortFilter.value;
        const timelineMonths = document.querySelectorAll('.timeline-month');
        
        timelineMonths.forEach(month => {
            const items = Array.from(month.querySelectorAll('.timeline-item'));
            
            items.sort((a, b) => {
                const aName = a.querySelector('h5').textContent;
                const bName = b.querySelector('h5').textContent;
                const aDate = a.querySelector('.timeline-date .day').textContent;
                const bDate = b.querySelector('.timeline-date .day').textContent;
                const aRating = parseFloat(a.querySelector('.rating span')?.textContent || 0);
                const bRating = parseFloat(b.querySelector('.rating span')?.textContent || 0);
                
                switch(sortBy) {
                    case 'date-desc':
                        return new Date(bDate) - new Date(aDate);
                    case 'date-asc':
                        return new Date(aDate) - new Date(bDate);
                    case 'rating':
                        return bRating - aRating;
                    case 'name':
                        return aName.localeCompare(bName);
                    default:
                        return 0;
                }
            });
            
            // Reorder in DOM
            const monthContent = month.querySelector('.month-header').nextElementSibling;
            items.forEach(item => {
                month.appendChild(item);
            });
        });
        
        showNotification(`Events sorted by ${sortFilter.options[sortFilter.selectedIndex].text}`, 'info');
    }
    
    // Update event counts
    function updateEventCounts() {
        const totalEvents = 19; // Hardcoded for demo
        const avgRating = 4.6;
        const streakCount = 8;
        
        document.getElementById('totalEvents').textContent = totalEvents;
        document.getElementById('avgRating').textContent = avgRating.toFixed(1);
        document.getElementById('streakCount').textContent = streakCount;
        document.getElementById('footerTotal').textContent = totalEvents;
    }
    
    // Update review count
    function updateReviewCount() {
        const reviewCount = document.querySelectorAll('.review-card').length + 1;
        document.querySelector('.sidebar-footer .stat-item:nth-child(2) .stat-value').textContent = reviewCount;
    }
    
    // Check if empty state should be shown
    function checkEmptyState() {
        const visibleEvents = Array.from(timelineItems)
            .filter(item => item.style.display !== 'none').length;
        
        const emptyState = document.getElementById('emptyState');
        if (visibleEvents === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }
    }
    
    // Open event modal
    function openEventModal(name, category, note, date) {
        const modalTitle = document.getElementById('modalEventTitle');
        const modalContent = document.getElementById('modalEventContent');
        
        modalTitle.textContent = name;
        
        modalContent.innerHTML = `
            <div class="event-modal-content">
                <div class="event-modal-header">
                    <div class="event-modal-category ${category.toLowerCase()}">
                        <i class="fas fa-${getCategoryIcon(category)}"></i>
                        <span>${category}</span>
                    </div>
                    <div class="event-modal-date">
                        <i class="fas fa-calendar"></i>
                        <span>${date}</span>
                    </div>
                </div>
                
                <div class="event-modal-description">
                    <h4>Your Experience</h4>
                    <p>${note}</p>
                </div>
                
                <div class="event-modal-stats">
                    <h4>Event Stats</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-info">
                                <span class="label">Attendance</span>
                                <span class="value">450+</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="stat-info">
                                <span class="label">Your Rating</span>
                                <span class="value">4.5/5</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">
                                <i class="fas fa-images"></i>
                            </div>
                            <div class="stat-info">
                                <span class="label">Photos</span>
                                <span class="value">5</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="event-modal-actions">
                    <button class="btn-share-event">
                        <i class="fas fa-share-alt"></i> Share Experience
                    </button>
                    <button class="btn-add-photos">
                        <i class="fas fa-camera"></i> Add More Photos
                    </button>
                </div>
            </div>
        `;
        
        // Add modal-specific styles if not already added
        if (!document.querySelector('#past-event-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'past-event-modal-styles';
            style.textContent = `
                .event-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .event-modal-date {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--text-secondary);
                    font-size: 14px;
                }
                
                .event-modal-date i {
                    color: var(--primary-color);
                }
                
                .event-modal-stats {
                    margin: 25px 0;
                }
                
                .event-modal-stats h4 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: var(--text-primary);
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                }
                
                .stat-item {
                    padding: 15px;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                    text-align: center;
                }
                
                .stat-icon {
                    width: 40px;
                    height: 40px;
                    background: var(--primary-light);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 10px;
                    color: var(--primary-color);
                    font-size: 18px;
                }
                
                .stat-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .stat-info .label {
                    font-size: 12px;
                    color: var(--text-secondary);
                }
                
                .stat-info .value {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                
                .event-modal-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                }
                
                .btn-share-event,
                .btn-add-photos {
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
                
                .btn-share-event {
                    background: var(--primary-light);
                    color: var(--primary-color);
                    border: 1px solid var(--primary-color);
                }
                
                .btn-share-event:hover {
                    background: var(--primary-color);
                    color: white;
                }
                
                .btn-add-photos {
                    background: white;
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }
                
                .btn-add-photos:hover {
                    background: var(--bg-secondary);
                }
                
                @media (max-width: 768px) {
                    .event-modal-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .event-modal-actions {
                        flex-direction: column;
                    }
                }
                
                @media (max-width: 480px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
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
            const shareBtn = modalContent.querySelector('.btn-share-event');
            const addPhotosBtn = modalContent.querySelector('.btn-add-photos');
            
            if (shareBtn) {
                shareBtn.addEventListener('click', function() {
                    showNotification(`Sharing experience from ${name}`, 'info');
                });
            }
            
            if (addPhotosBtn) {
                addPhotosBtn.addEventListener('click', function() {
                    openMemoryUpload(name);
                    closeModal(eventModal);
                });
            }
        }, 100);
    }
    
    // Open review modal
    function openReviewModal(eventName = '') {
        if (eventName) {
            document.getElementById('reviewEvent').value = eventName.toLowerCase().replace(/\s+/g, '-');
        }
        
        reviewModal.classList.add('active');
        reviewModal.style.display = 'flex';
    }
    
    // Open memory upload
    function openMemoryUpload(eventName) {
        showNotification(`Uploading memories for ${eventName}`, 'info');
        // In a real app, this would open a file upload dialog
    }
    
    // Update star rating display
    function updateStarRating(rating) {
        reviewStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }
    
    // Highlight stars on hover
    function highlightStars(rating) {
        reviewStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }
    
    // Update photo preview
    function updatePhotoPreview() {
        uploadPreview.innerHTML = '';
        uploadedPhotos.forEach((photo, index) => {
            const img = document.createElement('img');
            img.src = photo.url;
            img.alt = `Uploaded photo ${index + 1}`;
            uploadPreview.appendChild(img);
        });
    }
    
    // Reset review form
    function resetReviewForm() {
        document.getElementById('reviewEvent').value = '';
        document.getElementById('reviewTitle').value = '';
        document.getElementById('reviewText').value = '';
        selectedRating = 0;
        uploadedPhotos = [];
        updateStarRating(0);
        ratingValue.textContent = '0/5';
        updatePhotoPreview();
    }
    
    // Get icon for category
    function getCategoryIcon(category) {
        switch(category.toLowerCase()) {
            case 'technology':
            case 'tech':
                return 'laptop-code';
            case 'music':
                return 'music';
            case 'food':
            case 'food & drink':
                return 'utensils';
            case 'arts':
                return 'palette';
            case 'sports':
                return 'futbol';
            case 'business':
                return 'briefcase';
            default:
                return 'calendar-alt';
        }
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
    updateEventCounts();
    checkEmptyState();
});