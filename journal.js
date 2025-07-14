// Journal Manager Module
class JournalManager {
    constructor(storage) {
        this.storage = storage;
        this.entries = [];
    }

    async init() {
        this.loadEntries();
        this.renderEntries();
        console.log('Journal Manager initialized');
    }

    loadEntries() {
        this.entries = this.storage.load('journalEntries') || [];
    }

    saveEntries() {
        this.storage.save('journalEntries', this.entries);
    }

    addEntry() {
        const content = document.getElementById('journal-content').value.trim();
        const mood = document.getElementById('mood-select').value;

        if (!content) {
            this.showMessage('Please write something before saving your entry.', 'warning');
            return;
        }

        const entry = {
            id: Date.now().toString(),
            date: new Date(),
            content,
            mood,
            tags: this.extractTags(content),
            wordCount: content.split(/\s+/).length
        };

        this.entries.unshift(entry); // Add to beginning for newest first
        this.saveEntries();
        this.renderEntries();

        // Clear form
        document.getElementById('journal-content').value = '';
        document.getElementById('mood-select').value = 'good';

        // Show success message
        this.showSuccessMessage('Journal entry saved successfully!');

        // Update streak and stats
        this.updateStats();
    }

    extractTags(content) {
        // Simple tag extraction based on common emotional and activity keywords
        const keywords = {
            emotions: ['happy', 'sad', 'angry', 'excited', 'nervous', 'calm', 'stressed', 'proud', 'grateful', 'frustrated'],
            activities: ['school', 'sports', 'friends', 'family', 'homework', 'exercise', 'meditation', 'martial arts'],
            challenges: ['difficult', 'hard', 'struggle', 'challenge', 'problem', 'issue', 'tough', 'overwhelming']
        };

        const tags = [];
        const lowerContent = content.toLowerCase();

        Object.entries(keywords).forEach(([category, words]) => {
            words.forEach(word => {
                if (lowerContent.includes(word)) {
                    tags.push(word);
                }
            });
        });

        return [...new Set(tags)]; // Remove duplicates
    }

    renderEntries() {
        const entriesContainer = document.getElementById('journal-entries');
        
        if (this.entries.length === 0) {
            entriesContainer.innerHTML = `
                <div class="text-center text-base-content/50 py-8">
                    <p>No entries yet. Start your journey by writing your first entry!</p>
                </div>
            `;
            return;
        }

        entriesContainer.innerHTML = this.entries.slice(0, 10).map((entry, index) => `
            <div class="journal-entry card bg-base-100 shadow-sm mb-4" style="animation-delay: ${index * 0.1}s">
                <div class="card-body p-4">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-base-content/70">${this.formatDate(entry.date)}</span>
                            <div class="badge badge-sm ${this.getMoodColor(entry.mood)}">${this.getMoodEmoji(entry.mood)}</div>
                        </div>
                        <div class="dropdown dropdown-end">
                            <div tabindex="0" role="button" class="btn btn-ghost btn-xs">⋮</div>
                            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                                <li><a onclick="journalManager.editEntry('${entry.id}')">Edit</a></li>
                                <li><a onclick="journalManager.deleteEntry('${entry.id}')" class="text-error">Delete</a></li>
                            </ul>
                        </div>
                    </div>
                    <p class="text-sm mb-3">${this.truncateText(entry.content, 150)}</p>
                    ${entry.tags.length > 0 ? `
                        <div class="flex flex-wrap gap-1">
                            ${entry.tags.slice(0, 3).map(tag => `<span class="badge badge-outline badge-xs">${tag}</span>`).join('')}
                            ${entry.tags.length > 3 ? `<span class="badge badge-outline badge-xs">+${entry.tags.length - 3}</span>` : ''}
                        </div>
                    ` : ''}
                    <div class="flex justify-between items-center mt-3 text-xs text-base-content/50">
                        <span>${entry.wordCount} words</span>
                        <button class="btn btn-ghost btn-xs" onclick="journalManager.viewFullEntry('${entry.id}')">Read more</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatDate(date) {
        const d = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        
        return d.toLocaleDateString();
    }

    getMoodColor(mood) {
        const colors = {
            'great': 'badge-success',
            'good': 'badge-info',
            'okay': 'badge-warning',
            'challenging': 'badge-warning',
            'tough': 'badge-error'
        };
        return colors[mood] || 'badge-neutral';
    }

    getMoodEmoji(mood) {
        const emojis = {
            'great': '🚀',
            'good': '😊',
            'okay': '😐',
            'challenging': '😤',
            'tough': '💪'
        };
        return emojis[mood] || '📝';
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    viewFullEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;

        const modal = document.createElement('dialog');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-box max-w-2xl">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div class="flex items-center gap-3 mb-4">
                    <h3 class="font-bold text-lg">Journal Entry</h3>
                    <div class="badge ${this.getMoodColor(entry.mood)}">${this.getMoodEmoji(entry.mood)} ${entry.mood}</div>
                </div>
                <div class="text-sm text-base-content/70 mb-4">${this.formatDate(entry.date)} • ${entry.wordCount} words</div>
                <div class="prose max-w-none mb-4">
                    <p class="whitespace-pre-wrap">${entry.content}</p>
                </div>
                ${entry.tags.length > 0 ? `
                    <div class="mb-4">
                        <h4 class="font-semibold mb-2">Tags:</h4>
                        <div class="flex flex-wrap gap-2">
                            ${entry.tags.map(tag => `<span class="badge badge-outline">${tag}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                <div class="modal-action">
                    <button class="btn btn-primary" onclick="journalManager.editEntry('${entry.id}'); this.closest('dialog').close()">Edit</button>
                    <button class="btn" onclick="this.closest('dialog').close()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.showModal();
        
        // Remove modal when closed
        modal.addEventListener('close', () => {
            modal.remove();
        });
    }

    editEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;

        // Fill form with existing data
        document.getElementById('journal-content').value = entry.content;
        document.getElementById('mood-select').value = entry.mood;

        // Change the add button to update
        const addButton = document.querySelector('#journal button[onclick="journalManager.addEntry()"]');
        addButton.textContent = 'Update Entry';
        addButton.onclick = () => this.updateEntry(entryId);

        // Scroll to form
        document.getElementById('journal').scrollIntoView({ behavior: 'smooth' });
    }

    updateEntry(entryId) {
        const content = document.getElementById('journal-content').value.trim();
        const mood = document.getElementById('mood-select').value;

        if (!content) {
            this.showMessage('Please write something before updating your entry.', 'warning');
            return;
        }

        const entryIndex = this.entries.findIndex(e => e.id === entryId);
        if (entryIndex === -1) return;

        // Update entry
        this.entries[entryIndex] = {
            ...this.entries[entryIndex],
            content,
            mood,
            tags: this.extractTags(content),
            wordCount: content.split(/\s+/).length,
            updatedAt: new Date()
        };

        this.saveEntries();
        this.renderEntries();

        // Reset form
        document.getElementById('journal-content').value = '';
        document.getElementById('mood-select').value = 'good';

        // Reset button
        const updateButton = document.querySelector('#journal button');
        updateButton.textContent = 'Save Entry';
        updateButton.onclick = () => this.addEntry();

        this.showSuccessMessage('Journal entry updated successfully!');
    }

    deleteEntry(entryId) {
        if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            return;
        }

        this.entries = this.entries.filter(e => e.id !== entryId);
        this.saveEntries();
        this.renderEntries();
        this.updateStats();

        this.showMessage('Journal entry deleted.', 'info');
    }

    updateStats() {
        // This will be called by the main app to update overall statistics
        if (window.app && window.app.progressTracker) {
            window.app.progressTracker.updateStats();
        }
    }

    getStats() {
        const now = new Date();
        const thisWeek = this.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return entryDate >= weekAgo;
        });

        const thisMonth = this.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
        });

        const moodCounts = this.entries.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {});

        return {
            totalEntries: this.entries.length,
            thisWeek: thisWeek.length,
            thisMonth: thisMonth.length,
            averageWordsPerEntry: this.entries.length > 0 ? 
                Math.round(this.entries.reduce((sum, entry) => sum + entry.wordCount, 0) / this.entries.length) : 0,
            moodDistribution: moodCounts,
            longestStreak: this.calculateLongestStreak(),
            currentStreak: this.calculateCurrentStreak()
        };
    }

    calculateCurrentStreak() {
        if (this.entries.length === 0) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sortedEntries = this.entries
            .map(entry => {
                const date = new Date(entry.date);
                date.setHours(0, 0, 0, 0);
                return date;
            })
            .sort((a, b) => b - a);

        let streak = 0;
        let currentDate = new Date(today);

        for (const entryDate of sortedEntries) {
            if (entryDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (entryDate.getTime() < currentDate.getTime()) {
                break;
            }
        }

        return streak;
    }

    calculateLongestStreak() {
        if (this.entries.length === 0) return 0;

        const dates = [...new Set(this.entries.map(entry => {
            const date = new Date(entry.date);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        }))].sort((a, b) => a - b);

        let longestStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currentDate = new Date(dates[i]);
            const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

            if (dayDiff === 1) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }

        return longestStreak;
    }

    showMessage(message, type = 'info') {
        const alertClass = {
            'info': 'alert-info',
            'success': 'alert-success',
            'warning': 'alert-warning',
            'error': 'alert-error'
        }[type] || 'alert-info';
        
        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} fixed top-4 right-4 z-50 w-auto`;
        alert.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success fixed top-4 right-4 z-50 w-auto success-animation';
        alert.innerHTML = `
            <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${message}</span>
        `;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    // Export journal data
    exportJournal() {
        const data = {
            exportDate: new Date(),
            totalEntries: this.entries.length,
            entries: this.entries
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindful-warriors-journal-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showSuccessMessage('Journal exported successfully!');
    }
}

export { JournalManager };