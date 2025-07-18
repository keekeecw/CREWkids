// Warrior's Mind Resources and Support Module

class ResourcesSystem {
    constructor() {
        this.resourceCategories = [
            {
                id: 'mental_health',
                title: 'Mental Health Support',
                description: 'Resources for understanding and managing mental health',
                resources: [
                    {
                        title: 'Understanding Emotions',
                        type: 'Guide',
                        description: 'A comprehensive guide to recognizing and managing emotions',
                        difficulty: 'Beginner',
                        tags: ['emotions', 'self-awareness', 'mental health']
                    },
                    {
                        title: 'Dealing with Stress',
                        type: 'Video Series',
                        description: 'Practical techniques for managing stress and anxiety',
                        difficulty: 'Intermediate',
                        tags: ['stress', 'coping', 'mental wellness']
                    }
                ]
            },
            {
                id: 'personal_development',
                title: 'Personal Growth',
                description: 'Resources to help you develop skills and build confidence',
                resources: [
                    {
                        title: 'Building Self-Confidence',
                        type: 'Interactive Workshop',
                        description: 'Step-by-step strategies to boost your self-esteem and confidence',
                        difficulty: 'Intermediate',
                        tags: ['confidence', 'self-esteem', 'personal growth']
                    },
                    {
                        title: 'Goal Setting Masterclass',
                        type: 'Online Course',
                        description: 'Learn how to set and achieve meaningful personal goals',
                        difficulty: 'Advanced',
                        tags: ['goals', 'achievement', 'motivation']
                    }
                ]
            },
            {
                id: 'relationships',
                title: 'Relationships and Communication',
                description: 'Guidance on building healthy relationships and communication skills',
                resources: [
                    {
                        title: 'Healthy Masculinity',
                        type: 'Podcast Series',
                        description: 'Exploring positive masculinity and emotional intelligence',
                        difficulty: 'Beginner',
                        tags: ['masculinity', 'relationships', 'communication']
                    },
                    {
                        title: 'Conflict Resolution Skills',
                        type: 'Interactive Guide',
                        description: 'Learn effective strategies for resolving conflicts peacefully',
                        difficulty: 'Intermediate',
                        tags: ['communication', 'conflict', 'relationships']
                    }
                ]
            }
        ];

        this.supportResources = [
            {
                title: 'National Suicide Prevention Lifeline',
                phone: '988',
                description: '24/7 support for those in emotional distress',
                type: 'Crisis Support'
            },
            {
                title: 'Crisis Text Line',
                phone: 'Text HOME to 741741',
                description: 'Free 24/7 support for teens experiencing crisis',
                type: 'Text Support'
            },
            {
                title: 'Teen Mental Health Resources',
                website: 'https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health',
                description: 'Comprehensive mental health information for teenagers',
                type: 'Online Resource'
            }
        ];

        this.userResourceProgress = JSON.parse(localStorage.getItem('userResourceProgress') || '{}');
    }

   

    renderResourceCategories() {
        return this.resourceCategories.map(category => `
            <div class="resource-category bg-gray-600 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-blue-300 mb-2">${category.title}</h3>
                <p class="text-sm mb-3">${category.description}</p>
                <div class="resources-list">
                    ${category.resources.map(resource => `
                        <div class="resource-item bg-gray-500 p-3 rounded mb-2">
                            <h4 class="font-semibold">${resource.title}</h4>
                            <p class="text-sm">${resource.description}</p>
                            <div class="resource-meta flex justify-between items-center mt-2">
                                <span class="text-xs bg-blue-600 px-2 py-1 rounded">${resource.type}</span>
                                <span class="text-xs bg-green-600 px-2 py-1 rounded">${resource.difficulty}</span>
                                <button onclick="resourcesSystem.startResource('${category.id}', '${resource.title}')" 
                                        class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                    Start
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    renderSupportResources() {
        return this.supportResources.map(support => `
            <div class="support-resource bg-gray-600 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-blue-300 mb-2">${support.title}</h3>
                <p class="text-sm mb-2">${support.description}</p>
                <div class="support-contact">
                    ${support.phone ? `<p class="font-semibold">Contact: ${support.phone}</p>` : ''}
                    ${support.website ? `<a href="${support.website}" target="_blank" class="text-blue-400 hover:underline">Visit Website</a>` : ''}
                </div>
                <span class="text-xs bg-green-600 px-2 py-1 rounded mt-2 inline-block">${support.type}</span>
            </div>
        `).join('');
    }

    startResource(categoryId, resourceTitle) {
        const category = this.resourceCategories.find(cat => cat.id === categoryId);
        const resource = category.resources.find(res => res.title === resourceTitle);

        if (!this.userResourceProgress[categoryId]) {
            this.userResourceProgress[categoryId] = {};
        }

        // Track resource start
        this.userResourceProgress[categoryId][resourceTitle] = {
            started: new Date().toISOString(),
            completed: false
        };

        // Save progress
        localStorage.setItem('userResourceProgress', JSON.stringify(this.userResourceProgress));

        // Notification
        warriorMindSystem.createNotification(`Started Resource: ${resourceTitle}! 📚`, '🚀');

        // Potential future: Open resource in a modal or new view
        this.showResourceDetailModal(category, resource);
    }

    showResourceDetailModal(category, resource) {
        const modalContainer = document.getElementById('resource-modal-container');
        modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-gray-700 p-6 rounded-lg max-w-2xl w-full">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-semibold text-blue-300">${resource.title}</h2>
                        <button onclick="resourcesSystem.closeResourceModal()" 
                                class="text-red-500 hover:text-red-600">
                            Close
                        </button>
                    </div>
                    <div class="resource-details">
                        <p class="mb-4">${resource.description}</p>
                        <div class="resource-tags mb-4">
                            ${resource.tags.map(tag => `
                                <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded mr-2">${tag}</span>
                            `).join('')}
                        </div>
                        <div class="resource-actions">
                            <button onclick="resourcesSystem.markResourceCompleted('${category.id}', '${resource.title}')" 
                                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                                Mark as Completed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modalContainer.style.display = 'block';
    }

    closeResourceModal() {
        const modalContainer = document.getElementById('resource-modal-container');
        modalContainer.style.display = 'none';
        modalContainer.innerHTML = '';
    }

    markResourceCompleted(categoryId, resourceTitle) {
        if (this.userResourceProgress[categoryId] && 
            this.userResourceProgress[categoryId][resourceTitle]) {
            this.userResourceProgress[categoryId][resourceTitle].completed = true;
            this.userResourceProgress[categoryId][resourceTitle].completedDate = new Date().toISOString();

            // Save progress
            localStorage.setItem('userResourceProgress', JSON.stringify(this.userResourceProgress));

            // Notification
            warriorMindSystem.createNotification(`Completed Resource: ${resourceTitle}! 🎉`, '✅');

            // Close modal
            this.closeResourceModal();

            // Potential achievement trigger
            warriorMindSystem.triggerAchievement('resource_completed');
        }
    }

    getResourceProgressSummary() {
        let totalResources = 0;
        let completedResources = 0;

        this.resourceCategories.forEach(category => {
            category.resources.forEach(resource => {
                totalResources++;
                const categoryProgress = this.userResourceProgress[category.id];
                if (categoryProgress && 
                    categoryProgress[resource.title] && 
                    categoryProgress[resource.title].completed) {
                    completedResources++;
                }
            });
        });

        return {
            totalResources,
            completedResources,
            progressPercentage: Math.round((completedResources / totalResources) * 100)
        };
    }
}

// Initialize the resources system
const resourcesSystem = new ResourcesSystem();
