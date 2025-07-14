// Role Model Analysis Worksheet

class RoleModelWorksheet {
    constructor() {
        this.worksheet = {
            roleModelName: '',
            characteristics: [],
            inspirationalStories: [],
            personalLearnings: [],
            challenges: []
        };
    }

    initializeWorksheet() {
        const worksheetContainer = document.getElementById('role-model-worksheet');
        worksheetContainer.innerHTML = `
            <div class="role-model-section bg-gray-700 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-blue-300">Role Model Analysis Worksheet</h2>
                
                <div class="worksheet-section mb-6">
                    <h3 class="text-xl mb-2">1. Role Model Details</h3>
                    <label class="block mb-2">Name of Role Model:</label>
                    <input type="text" id="role-model-name" placeholder="Who is your role model?" 
                           class="w-full bg-gray-600 p-2 rounded">
                </div>

                <div class="worksheet-section mb-6">
                    <h3 class="text-xl mb-2">2. Key Characteristics</h3>
                    <p class="mb-2">What makes this person a great role model? Select or add characteristics.</p>
                    <div class="characteristic-options grid grid-cols-3 gap-2">
                        <label class="inline-flex items-center bg-gray-600 p-2 rounded">
                            <input type="checkbox" value="integrity" class="form-checkbox mr-2">
                            <span>Integrity</span>
                        </label>
                        <label class="inline-flex items-center bg-gray-600 p-2 rounded">
                            <input type="checkbox" value="resilience" class="form-checkbox mr-2">
                            <span>Resilience</span>
                        </label>
                        <label class="inline-flex items-center bg-gray-600 p-2 rounded">
                            <input type="checkbox" value="compassion" class="form-checkbox mr-2">
                            <span>Compassion</span>
                        </label>
                        <label class="inline-flex items-center bg-gray-600 p-2 rounded">
                            <input type="checkbox" value="courage" class="form-checkbox mr-2">
                            <span>Courage</span>
                        </label>
                        <label class="inline-flex items-center bg-gray-600 p-2 rounded">
                            <input type="checkbox" value="leadership" class="form-checkbox mr-2">
                            <span>Leadership</span>
                        </label>
                        
                        <div class="custom-characteristic col-span-3 flex mt-2">
                            <input type="text" id="custom-characteristic" 
                                   placeholder="Add your own characteristic" 
                                   class="flex-grow bg-gray-600 p-2 rounded-l">
                            <button onclick="roleModelWorksheet.addCustomCharacteristic()" 
                                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r">
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                <div class="worksheet-section mb-6">
                    <h3 class="text-xl mb-2">3. Inspirational Stories</h3>
                    <textarea id="inspirational-stories" 
                              placeholder="Describe a story or moment that inspires you about this role model"
                              class="w-full bg-gray-600 p-2 rounded h-40"></textarea>
                </div>

                <div class="worksheet-section mb-6">
                    <h3 class="text-xl mb-2">4. Personal Learnings</h3>
                    <p class="mb-2">What have you learned from this role model that you want to apply in your life?</p>
                    <textarea id="personal-learnings" 
                              placeholder="Write down specific lessons or insights"
                              class="w-full bg-gray-600 p-2 rounded h-40"></textarea>
                </div>

                <div class="worksheet-section mb-6">
                    <h3 class="text-xl mb-2">5. Challenges Overcome</h3>
                    <p class="mb-2">What challenges has this role model faced and how did they overcome them?</p>
                    <textarea id="challenges" 
                              placeholder="Describe the obstacles and how they were addressed"
                              class="w-full bg-gray-600 p-2 rounded h-40"></textarea>
                </div>

                <div class="flex justify-between">
                    <button onclick="roleModelWorksheet.saveWorksheet()" 
                            class="btn-primary">
                        Save Worksheet
                    </button>
                    <button onclick="roleModelWorksheet.viewPastWorksheets()" 
                            class="btn-primary bg-green-600">
                        View Past Worksheets
                    </button>
                </div>
            </div>
        `;
    }

    addCustomCharacteristic() {
        const customInput = document.getElementById('custom-characteristic');
        if (customInput.value.trim()) {
            const characteristicsContainer = document.querySelector('.characteristic-options');
            const newCharacteristic = document.createElement('label');
            newCharacteristic.className = 'inline-flex items-center bg-gray-600 p-2 rounded';
            newCharacteristic.innerHTML = `
                <input type="checkbox" value="${customInput.value.toLowerCase()}" class="form-checkbox mr-2" checked>
                <span>${customInput.value}</span>
            `;
            characteristicsContainer.insertBefore(newCharacteristic, characteristicsContainer.lastElementChild);
            customInput.value = '';
        }
    }

    saveWorksheet() {
        // Collect worksheet data
        this.worksheet.roleModelName = document.getElementById('role-model-name').value;
        
        // Collect selected characteristics
        this.worksheet.characteristics = Array.from(
            document.querySelectorAll('.characteristic-options input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.value);

        this.worksheet.inspirationalStories = document.getElementById('inspirational-stories').value;
        this.worksheet.personalLearnings = document.getElementById('personal-learnings').value;
        this.worksheet.challenges = document.getElementById('challenges').value;
        this.worksheet.date = new Date().toISOString();

        // Validate
        if (!this.worksheet.roleModelName) {
            warriorMindSystem.createNotification('Please enter a role model name', '⚠️');
            return;
        }

        // Save to local storage
        let worksheets = JSON.parse(localStorage.getItem('roleModelWorksheets') || '[]');
        worksheets.push(this.worksheet);
        localStorage.setItem('roleModelWorksheets', JSON.stringify(worksheets));

        // Trigger notifications and achievements
        warriorMindSystem.createNotification('Role Model Worksheet Saved! 🌟', '✅');
        warriorMindSystem.triggerAchievement('role_model_analysis');
        
        // Update progress tracking
        warriorMindSystem.updateProgressTracking('role_model');
    }

    viewPastWorksheets() {
        const worksheets = JSON.parse(localStorage.getItem('roleModelWorksheets') || '[]');
        const worksheetContainer = document.getElementById('role-model-worksheet');

        if (worksheets.length === 0) {
            worksheetContainer.innerHTML = `
                <div class="bg-gray-700 p-6 rounded-lg text-center">
                    <p class="text-gray-400">No past role model worksheets found.</p>
                    <button onclick="roleModelWorksheet.initializeWorksheet()" class="btn-primary mt-4">
                        Create First Worksheet
                    </button>
                </div>
            `;
            return;
        }

        worksheetContainer.innerHTML = `
            <div class="bg-gray-700 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-blue-300">Past Role Model Worksheets</h2>
                ${worksheets.map((worksheet, index) => `
                    <div class="worksheet-entry bg-gray-600 p-4 rounded-lg mb-4">
                        <h3 class="text-lg font-semibold text-blue-300">
                            ${worksheet.roleModelName} 
                            <span class="text-sm text-gray-400">
                                (${new Date(worksheet.date).toLocaleDateString()})
                            </span>
                        </h3>
                        <div class="worksheet-details">
                            <strong class="text-green-400">Key Characteristics:</strong>
                            <p class="mb-2">${worksheet.characteristics.join(', ')}</p>
                            
                            <strong class="text-green-400">Inspirational Stories:</strong>
                            <p class="mb-2">${worksheet.inspirationalStories || 'No stories recorded'}</p>
                            
                            <strong class="text-green-400">Personal Learnings:</strong>
                            <p class="mb-2">${worksheet.personalLearnings || 'No learnings recorded'}</p>
                            
                            <strong class="text-green-400">Challenges Overcome:</strong>
                            <p>${worksheet.challenges || 'No challenges recorded'}</p>
                        </div>
                    </div>
                `).join('')}
                <button onclick="roleModelWorksheet.initializeWorksheet()" class="btn-primary mt-4">
                    Create New Worksheet
                </button>
            </div>
        `;
    }
}

// Initialize the role model worksheet
const roleModelWorksheet = new RoleModelWorksheet();