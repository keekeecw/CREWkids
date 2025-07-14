// Warrior's Mind Challenges Module

class ChallengesSystem {
    constructor() {
        this.challenges = [
            {
                id: 'mindfulness_starter',
                title: 'Mindfulness Beginner',
                description: 'Complete 3 grounding activities in a week',
                points: 100,
                category: 'Mindfulness',
                difficulty: 'Easy',
                requirements: {
                    groundingSessionsRequired: 3
                }
            },
            {
                id: 'role_model_deep_dive',
                title: 'Inspiration Investigator',
                description: 'Complete 2 detailed role model analysis worksheets',
                points: 150,
                category: 'Personal Growth',
                difficulty: 'Medium',
                requirements: {
                    roleModelWorksheetsRequired: 2
                }
            },
            {
                id: 'emotional_awareness',
                title: 'Emotional Warrior',
                description: 'Journal for 7 consecutive days',
                points: 200,
                category: 'Emotional Intelligence',
                difficulty: 'Hard',
                requirements: {
                    consecutiveJournalingDays: 7
                }
            },
            {
                id: 'resilience_builder',
                title: 'Resilience Champion',
                description: 'Reflect on a personal challenge and develop a growth strategy',
                points: 250,
                category: 'Personal Development',
                difficulty: 'Advanced',
                requirements: {
                    challengeReflectionRequired: true
                }
            }
        ];

        this.userChallenges = JSON.parse(localStorage.getItem('warriorChallenges') || '[]');
    }

    initializeChallengesView() {
        const challengesContainer = document.getElementById('challenges-container');
        challengesContainer.innerHTML = `
            <div class="challenges-section bg-gray-700 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-blue-300">Warrior Challenges</h2>
                
                <div id="active-challenges" class="mb-6">
                    <h3 class="text-xl mb-2">Active Challenges</h3>
                    ${this.renderActiveChallenges()}
                </div>

                <div id="available-challenges" class="mb-6">
                    <h3 class="text-xl mb-2">Available Challenges</h3>
                    ${this.renderAvailableChallenges()}
                </div>

                <div id="challenge-progress" class="mt-4">
                    <h3 class="text-xl mb-2">Your Challenge Progress</h3>
                    ${this.renderChallengeProgress()}
                </div>
            </div>
        `;
    }

    renderActiveChallenges() {
        const activeUserChallenges = this.userChallenges.filter(c => !c.completed);
        
        if (activeUserChallenges.length === 0) {
            return `<p class="text-gray-400">No active challenges. Start a new challenge!</p>`;
        }

        return activeUserChallenges.map(challenge => `
            <div class="challenge-card bg-gray-600 p-4 rounded-lg mb-2">
                <h4 class="font-semibold text-blue-300">${challenge.title}</h4>
                <p>${challenge.description}</p>
                <div class="progress-bar bg-gray-500 rounded-full h-2 mt-2">
                    <div class="progress bg-green-500 rounded-full h-2" style="width: ${challenge.progress || 0}%"></div>
                </div>
                <div class="flex justify-between mt-2">
                    <span class="text-sm">Progress: ${challenge.progress || 0}%</span>
                    <span class="text-sm text-blue-400">${challenge.points} points</span>
                </div>
            </div>
        `).join('');
    }

    renderAvailableChallenges() {
        // Filter out challenges already in progress
        const availableChallenges = this.challenges.filter(
            challenge => !this.userChallenges.some(uc => uc.id === challenge.id)
        );

        return availableChallenges.map(challenge => `
            <div class="challenge-card bg-gray-600 p-4 rounded-lg mb-2">
                <h4 class="font-semibold text-blue-300">${challenge.title}</h4>
                <p>${challenge.description}</p>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-sm text-gray-400">Difficulty: ${challenge.difficulty}</span>
                    <button onclick="challengesSystem.acceptChallenge('${challenge.id}')" 
                            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                        Accept Challenge
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderChallengeProgress() {
        const totalChallenges = this.userChallenges.length;
        const completedChallenges = this.userChallenges.filter(c => c.completed).length;
        const progressPercentage = totalChallenges > 0 ? 
            Math.round((completedChallenges / totalChallenges) * 100) : 0;

        return `
            <div class="bg-gray-600 p-4 rounded-lg">
                <div class="progress-bar bg-gray-500 rounded-full h-4 mb-2">
                    <div class="progress bg-green-500 rounded-full h-4" 
                         style="width: ${progressPercentage}%"></div>
                </div>
                <div class="flex justify-between">
                    <span>Challenges Completed: ${completedChallenges}/${totalChallenges}</span>
                    <span class="text-green-400">${progressPercentage}% Complete</span>
                </div>
            </div>
        `;
    }

    acceptChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (challenge) {
            const newUserChallenge = {
                ...challenge,
                startDate: new Date().toISOString(),
                progress: 0,
                completed: false
            };

            this.userChallenges.push(newUserChallenge);
            localStorage.setItem('warriorChallenges', JSON.stringify(this.userChallenges));
            
            // Notification
            warriorMindSystem.createNotification(`Challenge Accepted: ${challenge.title}! 🏆`, '🔥');
            
            // Refresh view
            this.initializeChallengesView();
        }
    }

    updateChallengeProgress() {
        // Check and update challenge progress based on user activities
        const groundingJournals = JSON.parse(localStorage.getItem('groundingJournals') || '[]');
        const roleModelWorksheets = JSON.parse(localStorage.getItem('roleModelWorksheets') || '[]');

        this.userChallenges = this.userChallenges.map(challenge => {
            switch(challenge.id) {
                case 'mindfulness_starter':
                    const recentGroundingSessions = groundingJournals.filter(
                        journal => new Date(journal.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    );
                    challenge.progress = Math.min(100, (recentGroundingSessions.length / challenge.requirements.groundingSessionsRequired) * 100);
                    challenge.completed = recentGroundingSessions.length >= challenge.requirements.groundingSessionsRequired;
                    break;

                case 'role_model_deep_dive':
                    challenge.progress = Math.min(100, (roleModelWorksheets.length / challenge.requirements.roleModelWorksheetsRequired) * 100);
                    challenge.completed = roleModelWorksheets.length >= challenge.requirements.roleModelWorksheetsRequired;
                    break;
            }
            return challenge;
        });

        localStorage.setItem('warriorChallenges', JSON.stringify(this.userChallenges));
        this.initializeChallengesView();
    }
}

// Initialize the challenges system
const challengesSystem = new ChallengesSystem();