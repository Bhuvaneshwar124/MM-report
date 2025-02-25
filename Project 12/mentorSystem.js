class MentorSystem {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadSavedData();
    }

    initializeElements() {
        this.form = document.getElementById('menteeForm');
        this.toast = document.getElementById('toast');
        this.modal = document.getElementById('details-modal');
        this.semestersContainer = document.getElementById('semesters-container');
        this.printBtn = document.getElementById('printReport');
        this.searchInput = document.getElementById('searchInput');
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.searchInput?.addEventListener('input', () => this.handleSearch());
        this.printBtn?.addEventListener('click', () => this.printReport());
        
        // Setup autosave for editable fields
        document.addEventListener('input', (e) => {
            if (e.target.hasAttribute('contenteditable') || e.target.classList.contains('date-input')) {
                this.autoSave();
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) return;

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        this.saveData(data);
        this.showToast('Data saved successfully', 'success');
        this.form.reset();
    }

    validateForm() {
        const required = this.form.querySelectorAll('[required]');
        let isValid = true;

        required.forEach(field => {
            if (!field.value.trim()) {
                this.showToast(`${field.name} is required`, 'error');
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    saveData(data) {
        const savedData = localStorage.getItem('mentorData') || '{}';
        const allData = JSON.parse(savedData);
        allData[data.registerNumber] = {
            ...data,
            timestamp: new Date().toISOString(),
            semesters: this.getSemesterData()
        };
        localStorage.setItem('mentorData', JSON.stringify(allData));
    }

    getSemesterData() {
        const semesterData = {};
        document.querySelectorAll('.semester').forEach((sem, index) => {
            semesterData[`semester${index + 1}`] = {
                dates: Array.from(sem.querySelectorAll('.date-input')).map(input => input.value),
                discussions: Array.from(sem.querySelectorAll('[contenteditable]')).map(td => td.textContent)
            };
        });
        return semesterData;
    }

    loadSavedData() {
        const savedData = localStorage.getItem('mentorData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.populateForm(data);
            this.populateSemesters(data);
        }
    }

    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast show ${type}`;
        setTimeout(() => this.toast.classList.remove('show'), 3000);
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.toLowerCase();
        document.querySelectorAll('.semester td[contenteditable]').forEach(cell => {
            const row = cell.closest('tr');
            const text = cell.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    printReport() {
        const printWindow = window.open('', '_blank');
        const styles = document.getElementsByTagName('style')[0].innerHTML;
        const content = document.querySelector('.container').innerHTML;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Mentor-Mentee Report</title>
                <style>${styles}</style>
            </head>
            <body>
                <div class="container print-mode">${content}</div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    autoSave() {
        clearTimeout(this._saveTimeout);
        this._saveTimeout = setTimeout(() => {
            this.saveData(Object.fromEntries(new FormData(this.form)));
            this.showToast('Changes auto-saved', 'info');
        }, 1000);
    }
}
