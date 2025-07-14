// 5-4-3-2-1 Grounding Exercise Module
class GroundingExercise {
    constructor(storage) {
        this.storage = storage;
        this.currentStep = 0;
        this.responses = [];
        this.isActive = false;
        this.steps = [
            {
                number: 5,
                sense: 'see',
                prompt: 'Name 5 things you can SEE around you',
                description: 'Look around and notice 5 things you can see. Take your time to really observe them.',
                placeholder: 'I can see...'
            },
            {
                number: 4,
                sense: 'touch',
                prompt: 'Name 4 things you can TOUCH or FEEL',
                description: 'Notice 4 things you can physically feel - textures, temperatures, or sensations.',
                placeholder: 'I can feel...'
            },
            {
                number: 3,
                sense: 'hear',
                prompt: 'Name 3 things you can HEAR',
                description: 'Listen carefully and identify 3 different sounds around you.',
                placeholder: 'I can hear...'
            },
            {
                number: 2,
                sense: 'smell',
                prompt: 'Name 2 things you can SMELL',
                description: 'Take a deep breath and notice 2 different scents or smells.',
                placeholder: 'I can smell...'
            },
            {
                number: 1,
                sense: 'taste',
                prompt: 'Name 1 thing you can TASTE',
                description: 'Notice any taste in your mouth, or take a sip of water and describe it.',
                placeholder: 'I can taste...'
            }
        ];
    }

    async init() {
        this.loadPreviousSessions();
        console.log('Grounding Exercise initialized');
    }

    loadPreviousSessions() {
        const sessions = this.storage.load('groundingSessions') || [];
        this.previousSessions = sessions;
    }

    start() {
        this.isActive = true;
        this.currentStep = 0;
        this.responses = [];
        
        // Hide start button and show exercise
        document.getElementById('grounding-start').classList.add('hidden');
        document.getElementById('grounding-exercise').classList.remove('hidden');
        
        this.updateDisplay();
    }

    updateDisplay() {
        const step = this.steps[this.currentStep];
        const progress = ((this.currentStep + 1) / this.steps.length) * 100;
        
        // Update progress circle
        const progressElement = document.getElementById('grounding-progress');
        progressElement.style.setProperty('--value', progress);
        progressElement.textContent = `${Math.round(progress)}%`;
        
        // Update title and description
        document.getElementById('grounding-title').textContent = step.prompt;
        document.getElementById('grounding-description').textContent = step.description;
        
        // Update input placeholder
        const input = document.getElementById('grounding-input');
        input.placeholder = step.placeholder;
        input.value = this.responses[this.currentStep] || '';
        input.focus();
        
        // Update button states
        const prevButton = document.getElementById('grounding-prev');
        const nextButton = document.getElementById('grounding-next');
        
        prevButton.style.display = this.currentStep > 0 ? 'block' : 'none';
        nextButton.textContent = this.currentStep === this.steps.length - 1 ? 'Complete' : 'Next';
        
        // Add step indicator
        this.updateStepIndicator();
    }

    updateStepIndicator() {
        const existingIndicator = document.querySelector('.grounding-steps');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'grounding-steps flex justify-center gap-2 mb-6';
        
        this.steps.forEach((step, index) => {
            const indicator = document.createElement('div');
            indicator.className = `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index < this.currentStep ? 'bg-success text-white' :
                index === this.currentStep ? 'bg-primary text-white' :
                'bg-base-300 text-base-content'
            }`;
            indicator.textContent = step.number;
            stepsContainer.appendChild(indicator);
        });
        
        const exerciseDiv = document.getElementById('grounding-exercise');
        exerciseDiv.insertBefore(stepsContainer, exerciseDiv.firstChild);
    }

    nextStep() {
        const input = document.getElementById('grounding-input');
        const response = input.value.trim();
        
        if (!response) {
            this.showMessage('Please enter your response before continuing.', 'warning');
            return;
        }
        
        // Save current response
        this.responses[this.currentStep] = response;
        
        if (this.currentStep === this.steps.length - 1) {
            this.completeExercise();
        } else {
            this.currentStep++;
            this.updateDisplay();
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateDisplay();
        }
    }

    completeExercise() {
        // Save the session
        const session = {
            id: Date.now().toString(),
            date: new Date(),
            responses: [...this.responses],
            completed: true
        };
        
        const sessions = this.storage.load('groundingSessions') || [];
        sessions.push(session);
        this.storage.save('groundingSessions', sessions);
        
        // Show completion message
        this.showCompletionScreen();
        
        // Reset state
        this.isActive = false;
        this.currentStep = 0;
        this.responses = [];
    }

    showCompletionScreen() {
        const exerciseDiv = document.getElementById('grounding-exercise');
        const startDiv = document.getElementById('grounding-start');
        
        exerciseDiv.classList.add('hidden');
        
        // Update progress to 100%
        const progressElement = document.getElementById('grounding-progress');
        progressElement.style.setProperty('--value', 100);
        progressElement.textContent = '100%';
        
        // Show completion message
        document.getElementById('grounding-title').textContent = 'Exercise Complete!';
        document.getElementById('grounding-description').innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">🎉</div>
                <p class="text-lg mb-4">Well done, warrior! You've successfully completed the 5-4-3-2-1 grounding exercise.</p>
                <p class="text-base-content/70 mb-6">Take a moment to notice how you feel now compared to when you started.</p>
                <div class="flex gap-4 justify-center">
                    <button class="btn btn-primary" onclick="groundingExercise.restart()">Do Another</button>
                    <button class="btn btn-outline" onclick="groundingExercise.viewSummary()">View Summary</button>
                </div>
            </div>
        `;
        
        // Show success animation
        this.showSuccessMessage();
    }

    restart() {
        // Reset display
        document.getElementById('grounding-progress').style.setProperty('--value', 0);
        document.getElementById('grounding-progress').textContent = '0%';
        document.getElementById('grounding-title').textContent = 'Ready to Begin?';
        document.getElementById('grounding-description').textContent = 'Take three deep breaths and click start when you\'re ready.';
        
        // Show start button
        document.getElementById('grounding-start').classList.remove('hidden');
        document.getElementById('grounding-exercise').classList.add('hidden');
        
        // Remove any existing step indicators
        const existingIndicator = document.querySelector('.grounding-steps');
        if (existingIndicator) {
            existingIndicator.remove();
        }
    }

    viewSummary() {
        const sessions = this.storage.load('groundingSessions') || [];
        const totalSessions = sessions.length;
        const thisWeek = sessions.filter(s => {
            const sessionDate = new Date(s.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return sessionDate >= weekAgo;
        }).length;
        
        const modal = document.createElement('dialog');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-box">
                <h3 class="font-bold text-lg mb-4">Grounding Exercise Summary</h3>
                <div class="stats stats-vertical lg:stats-horizontal shadow mb-6">
                    <div class="stat">
                        <div class="stat-title">Total Sessions</div>
                        <div class="stat-value text-primary">${totalSessions}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-title">This Week</div>
                        <div class="stat-value text-secondary">${thisWeek}</div>
                    </div>
                </div>
                <div class="mb-4">
                    <h4 class="font-semibold mb-2">Recent Sessions:</h4>
                    <div class="max-h-40 overflow-y-auto">
                        ${sessions.slice(-5).reverse().map(session => `
                            <div class="flex justify-between items-center py-2 border-b border-base-300">
                                <span>${new Date(session.date).toLocaleDateString()}</span>
                                <span class="badge badge-success">Completed</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-action">
                    <button class="btn btn-primary" onclick="this.closest('dialog').close(); groundingExercise.restart()">Start New Session</button>
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

    showSuccessMessage() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success fixed top-4 right-4 z-50 w-auto success-animation';
        alert.innerHTML = `
            <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Grounding exercise completed! You're more centered now, warrior.</span>
        `;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 4000);
    }

    // Get statistics for progress tracking
    getStats() {
        const sessions = this.storage.load('groundingSessions') || [];
        return {
            totalSessions: sessions.length,
            completedThisWeek: sessions.filter(s => {
                const sessionDate = new Date(s.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return sessionDate >= weekAgo;
            }).length,
            lastSession: sessions.length > 0 ? new Date(sessions[sessions.length - 1].date) : null
        };
    }
}

export { GroundingExercise };