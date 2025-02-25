class MenteeSystem {
    constructor() {
        this.form = document.getElementById('menteeForm');
        this.toast = document.getElementById('toast');
        this.semestersContainer = document.getElementById('semesters-container');
        this.searchInput = document.getElementById('searchDiscussions');
        this.semesterFilter = document.getElementById('semesterFilter');
        this.clearDataBtn = document.getElementById('clearData');

        this.initializeEventListeners();
        this.loadData();
        this.generateSemesterTables();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.searchInput.addEventListener('input', () => this.filterDiscussions());
        this.semesterFilter.addEventListener('change', () => this.filterSemesters());
        this.clearDataBtn.addEventListener('click', () => this.handleDataClear());

        // Auto-save functionality for table cells
        document.addEventListener('input', (e) => {
            if (e.target.matches('[contenteditable="true"], .date-input')) {
                this.autoSaveTableData();
            }
        });
    }

    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast show ${type}`;
        setTimeout(() => this.toast.classList.remove('show'), 3000);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        if (this.validateForm(data)) {
            this.saveFormData(data);
            this.form.reset();
            this.showToast('Details saved successfully!', 'success');
        }
    }

    validateForm(data) {
        const validators = {
            mentorName: /^[A-Za-z\s]{2,50}$/,
            registerNumber: /^[0-9]{8}$/
        };

        for (const [field, regex] of Object.entries(validators)) {
            if (!regex.test(data[field])) {
                this.showToast(`Invalid ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                return false;
            }
        }
        return true;
    }

    generateSemesterTables() {
        const template = document.getElementById('semester-template');
        const savedData = this.loadTableData();

        for (let i = 1; i <= 8; i++) {
            const semesterContent = template.content.cloneNode(true);
            const semester = semesterContent.querySelector('.semester');
            semester.dataset.semester = i;
            
            if (savedData && savedData[`semester${i}`]) {
                this.populateSemesterData(semester, savedData[`semester${i}`]);
            }

            this.semestersContainer.appendChild(semesterContent);
        }
    }

    populateSemesterData(semester, data) {
        const dateInputs = semester.querySelectorAll('.date-input');
        const discussions = semester.querySelectorAll('[contenteditable="true"]');

        data.dates.forEach((date, i) => {
            if (dateInputs[i]) dateInputs[i].value = date;
        });

        data.discussions.forEach((text, i) => {
            if (discussions[i]) discussions[i].textContent = text;
        });
    }

    autoSaveTableData() {
        const tableData = {};
        document.querySelectorAll('.semester').forEach((sem) => {
            const semesterNum = sem.dataset.semester;
            tableData[`semester${semesterNum}`] = {
                dates: Array.from(sem.querySelectorAll('.date-input')).map(input => input.value),
                discussions: Array.from(sem.querySelectorAll('[contenteditable="true"]')).map(td => td.textContent)
            };
        });
        localStorage.setItem('tableData', JSON.stringify(tableData));
        this.showToast('Changes saved automatically', 'info');
    }

    filterDiscussions() {
        const searchText = this.searchInput.value.toLowerCase();
        document.querySelectorAll('[contenteditable="true"]').forEach(cell => {
            const row = cell.closest('tr');
            const text = cell.textContent.toLowerCase();
            row.style.display = text.includes(searchText) ? '' : 'none';
        });
    }

    filterSemesters() {
        const selected = this.semesterFilter.value;
        document.querySelectorAll('.semester').forEach(sem => {
            sem.style.display = (selected === 'all' || sem.dataset.semester === selected) ? '' : 'none';
        });
    }

    handleDataClear() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    }
}

// Initialize the system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MenteeSystem();
});
