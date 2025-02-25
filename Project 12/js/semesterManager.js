class SemesterManager {
    constructor() {
        this.initializeSemesters();
        this.addEventListeners();
    }

    initializeSemesters() {
        const semesters = document.querySelectorAll('.semester-card');
        semesters.forEach(semester => {
            this.setupSemester(semester);
        });
    }

    setupSemester(semester) {
        const addButton = semester.querySelector('.add-row');
        if (addButton) {
            addButton.addEventListener('click', () => this.addNewRow(semester));
        }
    }

    addNewRow(semester) {
        const tbody = semester.querySelector('tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="date" class="date-input"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td class="signature-cell"></td>
        `;
        tbody.appendChild(newRow);
    }

    addEventListeners() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('[contenteditable="true"], .date-input')) {
                this.autoSave(e.target);
            }
        });
    }

    autoSave(element) {
        const semesterCard = element.closest('.semester-card');
        const semesterId = semesterCard.dataset.semester;
        const data = this.getSemesterData(semesterCard);
        
        // Save to localStorage or your backend
        localStorage.setItem(`semester_${semesterId}`, JSON.stringify(data));
    }

    getSemesterData(semesterCard) {
        const rows = Array.from(semesterCard.querySelectorAll('tbody tr'));
        return rows.map(row => ({
            date: row.querySelector('.date-input')?.value || '',
            discussion: row.querySelector('[contenteditable="true"]:nth-child(2)')?.textContent || '',
            mentor: row.querySelector('[contenteditable="true"]:nth-child(3)')?.textContent || ''
        }));
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new SemesterManager();
});
