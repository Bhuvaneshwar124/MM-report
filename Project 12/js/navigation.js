class NavigationManager {
    static init() {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Setup navigation links
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    static redirectTo(page) {
        window.location.href = page;
    }

    static goToMenteeDetails(menteeId) {
        this.redirectTo(`final.html?id=${menteeId}`);
    }

    static goToMentorDashboard(mentorId) {
        this.redirectTo(`mentor-dashboard.html?id=${mentorId}`);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    NavigationManager.init();
});
