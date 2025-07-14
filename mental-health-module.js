// Warrior's Mind Mental Health Support Module

class MentalHealthModule {
    constructor() {
        this.assessmentQuestions = [
            {
                category: 'Emotional Wellbeing',
                questions: [
                    {
                        text: "How often do you feel overwhelmed by your emotions?",
                        type: 'scale',
                        options: [
                            "Almost never",
                            "Rarely",
                            "Sometimes",
                            "Often",
                            "Almost always"
                        ]
                    },
                    {
                        text: "Do you find it difficult to express your feelings?",
                        type: 'scale',
                        options: [
                            "Not at all",
                            "Slightly",
                            "Moderately",
                            "Very much",
                            "Completely"
                        ]
                    }
                ]
            },
            {
                category: 'Stress Management',
                questions: [
                    {
                        text: "How well do you handle stress?",
                        type: 'scale',
                        options: [
                            "I manage stress very effectively",
                            "I can usually handle stress",
                            "Stress sometimes overwhelms me",
                            "I struggle to manage stress",
                            "Stress completely controls me"
                        ]
                    },
                    {
                        text: "How often do you use healthy coping mechanisms?",
                        type: 'scale',
                        options: [
                            "Always",
                            "Most of the time",
                            "Sometimes",
                            "Rarely",
                            "Never"
                        ]
                    }
                ]
            },
            {
                category: 'Social Connections',
                questions: [
                    {
                        text: "Do you feel comfortable talking about your feelings with others?",
                        type: 'scale',
                        options: [
                            "Completely comfortable",
                            "Somewhat comfortable",
                            "Neutral",
                            "Somewhat uncomfortable",
                            "Very uncomfortable"
                        ]
                    },
                    {
                        text: "How connected do you feel to your friends and family?",
                        type: 'scale',
                        options: [
                            "Extremely connected",
                            "Very connected",
                            "Moderately connected",
                            "Slightly connected",
                            "Not connected at all"
                        ]
                    }
                ]
            }
        ];

        this.supportResources = {
            'Low Emotional Wellbeing': [
                {
                    title: 'Emotional Regulation Techniques',
                    description: 'Learn strategies to understand and manage your emotions',
                    type: 'Guide'
                },
                {
                    title: 'Mindfulness for Emotional Balance',
                    description: 'Meditation and breathing techniques to improve emotional control',
                    type: 'Video Series'
                }
            ],
            'High Stress': [
                {
                    title: 'Stress Management Workshop',
                    description: 'Practical techniques to reduce and manage stress',
                    type: 'Interactive Course'
                },
                {
                    title: 'Relaxation and Coping Strategies',
                    description: 'Learn effective ways to calm your mind and body',
                    type: 'Guided Exercises'
                }
            ],
            'Low Social Connection': [
                {
                    title: 'Building Meaningful Connections',
                    description: 'Strategies for improving communication and relationships',
                    type: 'Communication Guide'
                },
                {
                    title: 'Confidence in Social Situations',
                    description: 'Develop skills to feel more comfortable in social interactions',
                    type: 'Skill Development Program'
                }
            ]
        };

        this.userAssessmentHistory = JSON.parse(localStorage.getItem('mentalHealthAssessments') || '[]');
    }

    initializeMentalHealthAssessment() {
        const assessmentContainer = document.getElementById('mental-health-assessment');
        assessmentContainer.innerHTML = `
            <div class="mental-health-assessment bg-gray-700 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-blue-300">Mental Wellness Check-In</h2>
                <p class="mb-4 text-gray-300">This assessment helps you understand your current mental and emotional state. Be honest with yourself.</p>
                
                <div id="assessment-questions">
                    ${this.renderAssessmentQuestions()}
                </div>

                <button onclick="mentalHealthModule.submitAssessment()" class="btn-primary mt-4">
                    Submit Assessment
                </button>
            </div>
        `;
    }

    renderAssessmentQuestions() {
        return this.assessmentQuestions.map(category => `
            <div class="assessment-category mb-6">
                <h3 class="text-xl font-semibold text-blue-300 mb-3">${category.category}</h3>
                ${category.questions.map((question, index) => `
                    <div class="question bg-gray-600 p-4 rounded-lg mb-3">
                        <p class="mb-2">${question.text}</p>
                        <div class="question-options grid grid-cols-5 gap-2">
                            ${question.options.map((option, optionIndex) => `
                                <label class="inline-flex items-center bg-gray-500 p-2 rounded">
                                    <input type="radio" 
                                           name="question_${category.category}_${index}" 
                                           value="${optionIndex}" 
                                           class="form-radio mr-2">
                                    <span class="text-sm">${option}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    submitAssessment() {
        const assessmentResults = {
            date: new Date().toISOString(),
            categories: {}
        };

        let hasAllAnswers = true;

        this.assessmentQuestions.forEach(category => {
            const categoryResults = {
                questions: []
            };

            category.questions.forEach((question, index) => {
                const selectedOption = document.querySelector(`input[name="question_${category.category}_${index}"]:checked`);
                
                if (!selectedOption) {
                    hasAllAnswers = false;
                    return;
                }

                categoryResults.questions.push({
                    text: question.text,
                    selectedOption: selectedOption.value,
                    selectedText: question.options[selectedOption.value]
                });
            });

            assessmentResults.categories[category.category] = categoryResults;
        });

        if (!hasAllAnswers) {
            warriorMindSystem.createNotification('Please answer all questions before submitting', '⚠️');
            return;
        }

        // Analyze results
        const analysisResult = this.analyzeAssessmentResults(assessmentResults);
        
        // Save assessment
        this.userAssessmentHistory.push(assessmentResults);
        localStorage.setItem('mentalHealthAssessments', JSON.stringify(this.userAssessmentHistory));

        // Show results
        this.displayAssessmentResults(analysisResult);
    }

    analyzeAssessmentResults(assessment) {
        const analysis = {
            categories: {},
            recommendedResources: []
        };

        Object.keys(assessment.categories).forEach(categoryName => {
            const category = assessment.categories[categoryName];
            const scores = category.questions.map(q => parseInt(q.selectedOption));
            const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

            analysis.categories[categoryName] = {
                averageScore: averageScore,
                interpretation: this.interpretScore(averageScore)
            };

            // Determine recommended resources based on low scores
            if (averageScore > 3) {
                const categoryResources = this.supportResources[analysis.categories[categoryName].interpretation];
                if (categoryResources) {
                    analysis.recommendedResources.push(...categoryResources);
                }
            }
        });

        return analysis;
    }

    interpretScore(score) {
        if (score <= 1) return 'Excellent';
        if (score <= 2) return 'Good';
        if (score <= 3) return 'Moderate';
        if (score <= 4) return 'Needs Attention';
        return 'Requires Support';
    }

    displayAssessmentResults(analysisResult) {
        const assessmentContainer = document.getElementById('mental-health-assessment');
        assessmentContainer.innerHTML = `
            <div class="assessment-results bg-gray-700 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-blue-300">Assessment Results</h2>
                
                <div class="category-results mb-6">
                    ${Object.keys(analysisResult.categories).map(categoryName => `
                        <div class="category-result bg-gray-600 p-4 rounded-lg mb-3">
                            <h3 class="text-xl font-semibold text-blue-300">${categoryName}</h3>
                            <p>Average Score: ${analysisResult.categories[categoryName].averageScore.toFixed(2)}</p>
                            <p>Interpretation: ${analysisResult.categories[categoryName].interpretation}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="recommended-resources mb-6">
                    <h3 class="text-xl font-semibold text-blue-300 mb-3">Recommended Resources</h3>
                    ${analysisResult.recommendedResources.length > 0 ? 
                        analysisResult.recommendedResources.map(resource => `
                            <div class="resource bg-gray-500 p-3 rounded-lg mb-2">
                                <h4 class="font-semibold">${resource.title}</h4>
                                <p class="text-sm">${resource.description}</p>
                                <span class="text-xs bg-blue-600 px-2 py-1 rounded">${resource.type}</span>
                            </div>
                        `).join('') : 
                        '<p class="text-gray-400">No specific resources recommended at this time.</p>'
                    }
                </div>

                <button onclick="mentalHealthModule.initializeMentalHealthAssessment()" class="btn-primary">
                    Retake Assessment
                </button>
            </div>
        `;

        // Trigger achievement
        warriorMindSystem.triggerAchievement('mental_health_assessment');
        
        // Update progress tracking
        warriorMindSystem.updateProgressTracking('mental_health');
    }

    viewAssessmentHistory() {
        const historyContainer = document.getElementById('mental-health-assessment');
        
        if (this.userAssessmentHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="bg-gray-700 p-6 rounded-lg text-center">
                    <p class="text-gray-400">No previous assessments found.</p>
                    <button onclick="mentalHealthModule.initializeMentalHealthAssessment()" class="btn-primary mt-4">
                        Start First Assessment
                    </button>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = `
            <div class="assessment-history bg-gray-700 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-blue-300">Assessment History</h2>
                ${this.userAssessmentHistory.map((assessment, index) => `
                    <div class="assessment-entry bg-gray-600 p-4 rounded-lg mb-4">
                        <h3 class="text-lg font-semibold text-blue-300">
                            Assessment from ${new Date(assessment.date).toLocaleString()}
                        </h3>
                        ${Object.keys(assessment.categories).map(categoryName => `
                            <div class="category-result mb-2">
                                <strong>${categoryName}:</strong>
                                ${assessment.categories[categoryName].questions.map(q => `
                                    <p class="text-sm">
                                        ${q.text}: ${q.selectedText}
                                    </p>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
                <button onclick="mentalHealthModule.initializeMentalHealthAssessment()" class="btn-primary mt-4">
                    Take New Assessment
                </button>
            </div>
        `;
    }
}

// Initialize the mental health module
const mentalHealthModule = new MentalHealthModule();