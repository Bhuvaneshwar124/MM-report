class DataManager {
    static STORAGE_KEYS = {
        MENTEES: 'menteeData',
        MENTORS: 'mentorData',
        SESSIONS: 'sessionData'
    };

    static saveMenteeData(data) {
        const existingData = this.getMenteeData();
        existingData[data.registerNumber] = {
            ...data,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(this.STORAGE_KEYS.MENTEES, JSON.stringify(existingData));
    }

    static getMenteeData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.MENTEES) || '{}');
    }

    static saveMentorData(data) {
        const existingData = this.getMentorData();
        existingData[data.id] = {
            ...data,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(this.STORAGE_KEYS.MENTORS, JSON.stringify(existingData));
    }

    static getMentorData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.MENTORS) || '{}');
    }

    static saveSessionData(menteeId, semesterId, data) {
        const sessions = this.getSessionData();
        if (!sessions[menteeId]) {
            sessions[menteeId] = {};
        }
        if (!sessions[menteeId][semesterId]) {
            sessions[menteeId][semesterId] = [];
        }
        sessions[menteeId][semesterId].push({
            ...data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    }

    static getSessionData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SESSIONS) || '{}');
    }
}
