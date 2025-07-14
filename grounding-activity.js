// 5-4-3-2-1 Grounding Activity Module

class GroundingActivity {
    constructor() {
        this.stage = 0;
        this.stages = [
            { 
                name: "See", 
                count: 5, 
                prompt: "Look around and find 5 things you can see. What are their details?",
                items: []
            },
            { 
                name: "Touch", 
                count: 4, 
                prompt: "Find 4 things you can touch. What do they feel like?",
                items: []
            },
            { 
                name: "Hear", 
                count: 3, 
                prompt: "Listen carefully and identify 3 sounds around you. How are they different?",
                items: []
            },
            { 
                name: "Smell", 
                count: 2, 
                prompt: "Notice 2 different smells. Where do they come from?",
                items: []
            },
            { 
                name: "Taste", 
                count: 1, 
                prompt: "If possible, take a sip of water. What does it taste like?",
                items: []
            }
        ];
    }

    start() {
        this.stage = 0;
        this.renderCurrentStage();
    }

    renderCurrentStage() {
        const activityContainer = document.getElementById('grounding-activity-container');
        const currentStage = this.stages[this.stage];

        activityContainer.innerHTML = `
            <div class="grounding-stage bg-gray-700 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-blue-300">5-4-3-2-1 Grounding Technique</h2>
                <div class="stage-info">
                    <h3 class="text-xl mb-2">Stage: ${currentStage.name}</h3>
                    <p class="mb-4">${currentStage.prompt}</p>
                    <div class="item-input flex mb-4">
                        <input type="text" id="item-input" placeholder="Enter an item" class="flex-grow bg-gray-600 p-2 rounded-l">
                        <button onclick="groundingActivity.addItem()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r">
                            Add
                        </button>
                    </div>
                    <div id="current-items" class="mb-4">
                        ${this.renderCurrentItems()}
                    </div>
                    <div class="stage-progress text-sm">
                        Items left: ${currentStage.count - currentStage.items.length}
                    </div>
                </div>
            </div>
        `;
    }

    addItem() {
        const input = document.getElementById('item-input');
        const currentStage = this.stages[this.stage];

        if (input.value.trim() && currentStage.items.length < currentStage.count) {
            currentStage.items.push(input.value.trim());
            input.value = '';
            this.renderCurrentStage();

            if (currentStage.items.length === currentStage.count) {
                this.moveToNextStage();
            }
        }
    }

    renderCurrentItems() {
        const currentStage = this.stages[this.stage];
        return currentStage.items.map(item => `
            <p class="bg-gray-600 p-2 rounded mb-2">${item}</p>
        `).join('');
    }

    moveToNextStage() {
        this.stage++;
        if (this.stage < this.stages.length) {
            this.renderCurrentStage();
        } else {
            this.completedActivity();
        }
    }

    completedActivity() {
        const activityContainer = document.getElementById('grounding-activity-container');
        activityContainer.innerHTML = `
            <div class="activity-completed bg-gray-700 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-green-400">Grounding Activity Complete!</h2>
                <p class="mb-4">Great job completing the 5-4-3-2-1 Grounding Technique.</p>
                <h3 class="text-xl mb-2">Your Observations:</h3>
                ${this.stages.map((stage, index) => `
                    <div class="stage-summary mb-4">
                        <strong class="text-blue-300">${stage.name}:</strong>
                        ${stage.items.map(item => `<p class="bg-gray-600 p-2 rounded mb-2">${item}</p>`).join('')}
                    </div>
                `).join('')}
                <div class="flex justify-between">
                    <button onclick="groundingActivity.saveJournal()" class="btn-primary">
                        Save to Journal
                    </button>
                    <button onclick="warriorMindSystem.triggerAchievement('completed_grounding')" class="btn-primary bg-green-600">
                        Mark as Achievement
                    </button>
                </div>
            </div>
        `;
        
        // Update progress tracking
        warriorMindSystem.updateProgressTracking('mindfulness');
    }

    saveJournal() {
        const journalEntry = {
            date: new Date().toISOString(),
            stages: this.stages.map(stage => ({
                name: stage.name,
                items: stage.items
            }))
        };

        // Save to local storage
        let journals = JSON.parse(localStorage.getItem('groundingJournals') || '[]');
        journals.push(journalEntry);
        localStorage.setItem('groundingJournals', JSON.stringify(journals));

        // Create a notification
        warriorMindSystem.createNotification('Grounding Activity Journal Saved! 🧘', '✅');
        
        // Trigger achievement
        warriorMindSystem.triggerAchievement('completed_grounding');
    }

    viewPastJournals() {
        const journals = JSON.parse(localStorage.getItem('groundingJournals') || '[]');
        const journalContainer = document.getElementById('past-journals');
        
        if (journals.length === 0) {
            journalContainer.innerHTML = '<p class="text-gray-400">No past journal entries found.</p>';
            return;
        }

        journalContainer.innerHTML = journals.map((journal, index) => `
            <div class="journal-entry bg-gray-700 p-4 rounded-lg mb-4">
                <h3 class="text-lg font-semibold text-blue-300">
                    Entry from ${new Date(journal.date).toLocaleString()}
                </h3>
                ${journal.stages.map(stage => `
                    <div class="stage-entry mb-2">
                        <strong class="text-green-400">${stage.name}:</strong>
                        ${stage.items.map(item => `<p class="bg-gray-600 p-2 rounded">${item}</p>`).join('')}
                    </div>
                `).join('')}
            </div>
        `).join('');
    }
}

// Initialize the grounding activity
const groundingActivity = new GroundingActivity();