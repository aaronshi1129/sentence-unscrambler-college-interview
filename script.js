// Game state variables
let currentSentence = "";
let score = 0;
let hasScored = false;
let customSentences = [];
let currentSentenceBank = "default";
let gameStarted = false;
let gameComplete = false;
let ttsSetting = false; 

const sentences = [  
    "Why do you want to study at our university?",  
    "What are your academic strengths and weaknesses?",  
    "Why did you choose this major?",  
    "How do you handle challenging situations?",  
    "What are your career goals?",  
    "Can you describe a difficult project you completed?",  
    "How do you manage your time effectively?",  
    "What motivates you to succeed?",  
    "How would you contribute to our university community?",  
    "Tell us about your leadership experience.",  
    "What books have influenced your thinking?",  
    "Why should we choose you over other candidates?",  
    "How do you handle constructive criticism?",  
    "What subjects do you enjoy the most?",  
    "Where do you see yourself in five years?",  
    "Describe a time you worked in a team.",  
    "What challenges have you overcome academically?",  
    "What extracurricular activities are you involved in?",  
    "How do you stay organized during busy periods?",  
    "Tell us about your greatest achievement.",  
    "What skills do you bring to this program?",  
    "How do you approach problem-solving?",  
    "Describe a time you failed and what you learned.",  
    "What do you know about our university?",  
    "How would you handle a disagreement with a classmate?",  
    "What inspires your interest in this field?",  
    "Describe your study habits.",  
    "How do you balance academics and social life?",  
    "What recent news topic interests you?",  
    "What role does technology play in your education?",  
    "How do you respond to pressure?",  
    "What does success mean to you?",  
    "Describe a mentor who influenced your life.",  
    "How do you handle deadlines?",  
    "What do you hope to gain from this program?",  
    "Have you ever led a group project?",  
    "What is your biggest strength?",  
    "How do you stay motivated?",  
    "What is your favorite subject and why?",  
    "How do you prioritize tasks?",  
    "What impact do you want to make in your field?",  
    "Do you prefer working independently or in a group?",  
    "What are your long-term academic goals?",  
    "Describe a challenge you faced outside of school.",  
    "How do you deal with failure?",  
    "What would your teachers say about you?",  
    "What makes you a good candidate for this program?",  
    "How do you stay informed about your field of interest?",  
    "What project are you most proud of?",  
    "What role does creativity play in your work?",  
    "How do you approach learning new topics?",  
    "What questions do you have for us?",
    "I am passionate about this field of study.",  
    "I chose this major because I love solving problems.",  
    "My greatest strength is my dedication to learning.",  
    "I enjoy working both independently and in teams.",  
    "I believe I can contribute positively to the campus community.",  
    "I’m excited about the research opportunities at your university.",  
    "I’ve always been curious about how things work.",  
    "Time management is one of my key strengths.",  
    "I volunteered at a local charity last summer.",  
    "I hope to gain practical skills from this program.",  
    "I’m eager to join student organizations on campus.",  
    "I’m highly motivated to succeed in this field.",  
    "My biggest achievement is winning a science competition.",  
    "I enjoy collaborating with others on projects.",  
    "I have a strong interest in environmental issues.",  
    "I’ve always been fascinated by technology.",  
    "I’m looking forward to participating in community service projects.",  
    "This program aligns perfectly with my career goals.",  
    "I am determined to make the most of this opportunity.",  
    "I’ve learned a lot from working on group projects.",  
    "I want to make a positive impact in society.",  
    "I’ve developed strong leadership skills through volunteering.",  
    "I enjoy learning about different cultures.",  
    "I’m confident in my ability to succeed here.",  
    "I always strive to improve my knowledge.",  
    "I’m excited to learn from experienced professors.",  
    "I’ve participated in several extracurricular activities.",  
    "My dream is to become a research scientist.",  
    "I enjoy exploring new ideas and concepts.",  
    "I believe hard work is the key to success.",  
    "I’ve always been passionate about helping others.",  
    "I’m eager to gain hands-on experience.",  
    "This university’s values align with my own.",  
    "I’ve worked on several community projects.",  
    "I’m proud of my academic achievements.",  
    "I’m excited to contribute to the student community.",  
    "I’m open to learning from different perspectives.",  
    "I enjoy taking on new challenges.",  
    "I want to make a difference in the world.",  
    "I’ve participated in various leadership programs.",  
    "I’m prepared to work hard and succeed.",  
    "I enjoy reading about the latest scientific advancements.",  
    "I’ve always been curious about global issues.",  
    "I’m passionate about protecting the environment.",  
    "I thrive in collaborative environments.",  
    "I’m excited to attend your university.",  
    "I believe this program will help me grow personally and professionally.",  
    "I’m eager to improve my knowledge and skills.",  
    "I’m ready to embrace new opportunities.",  
    "I’m confident this university is the right fit for me.",  
    "I’ve always enjoyed problem-solving tasks.",  
    "I look forward to contributing to research projects." 
];

function loadSettings() {
    try {
        const savedBank = localStorage.getItem('sentenceBank');
        const savedSentences = localStorage.getItem('customSentences');
        const savedTTSSetting = localStorage.getItem('ttsSetting');
        
        if (savedBank) {
            currentSentenceBank = savedBank;
            document.getElementById('sentenceSource').value = savedBank;
        }
        
        if (savedSentences) {
            customSentences = JSON.parse(savedSentences);
        }
        
        if (savedTTSSetting !== null) {
            ttsSetting = savedTTSSetting === 'true';
            updateTTSToggleButton();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        // Reset to defaults if there's an error
        currentSentenceBank = "default";
        customSentences = [];
        ttsSetting = false;
    }
}

function saveSettings() {
    const source = document.getElementById('sentenceSource').value;
    const sentences = document.getElementById('customSentences').value
        .split('\n')
        .filter(s => s.trim());
    
    if (source === 'custom' && sentences.length < 5) {
        alert('Please enter at least 5 sentences for the custom sentence bank.');
        document.getElementById('sentenceSource').value = currentSentenceBank;
        return;
    }
    
    currentSentenceBank = source;
    customSentences = sentences;
    
    try {
        localStorage.setItem('sentenceBank', source);
        localStorage.setItem('customSentences', JSON.stringify(sentences));
        document.getElementById('settingsModal').style.display = 'none';
        
        // Only get a new sentence if the game is in progress and not complete
        if (gameStarted && !gameComplete) {
            newSentence();
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings. Please try again.');
    }
}

function toggleTTS() {
    ttsSetting = !ttsSetting;
    localStorage.setItem('ttsSetting', ttsSetting);
    updateTTSToggleButton();
}

function updateTTSToggleButton() {
    const ttsButton = document.getElementById('ttsToggle');
    if (ttsSetting) {
        ttsButton.textContent = "Voice: ON";
        ttsButton.classList.add('active');
    } else {
        ttsButton.textContent = "Voice: OFF";
        ttsButton.classList.remove('active');
    }
}

// TTS function to speak text
function speakText(text) {
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower rate for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-US';
    
    window.speechSynthesis.speak(utterance);
}

// Speak word function - depends on ttsSetting
function speakWord(text) {
    if (!ttsSetting) return;
    speakText(text);
}

function getCurrentSentences() {
    return currentSentenceBank === 'custom' && customSentences.length > 0 
        ? customSentences 
        : sentences;  
}

function startGame() {
    gameStarted = true;
    gameComplete = false;
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('checkButton').style.display = 'inline';
    document.getElementById('skipButton').style.display = 'inline';
    document.getElementById('settingsButton').style.display = 'none';
    document.getElementById('directions').style.display = 'none';
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    newSentence();
}

function newSentence() {
    if (gameComplete) return;
    
    // Show check and skip buttons for the new sentence
    document.getElementById('checkButton').style.display = 'inline';
    document.getElementById('skipButton').style.display = 'inline';
    
    // Hide next sentence and speak sentence buttons
    document.getElementById('nextSentenceButton').style.display = 'none';
    document.getElementById('speakSentenceButton').style.display = 'none';
    
    const sentences = getCurrentSentences();
    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentSentence = sentences[randomIndex];
    
    const words = currentSentence.split(/\s+/);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    
    const scrambledWordsDiv = document.getElementById('scrambledWords');
    scrambledWordsDiv.innerHTML = '';
    
    shuffledWords.forEach((word, index) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.textContent = word;
        wordDiv.dataset.index = index;
        scrambledWordsDiv.appendChild(wordDiv);
    });
    
    document.getElementById('answerArea').innerHTML = '';
    selectedWords = [];
    hasScored = false;
    document.getElementById('feedback').textContent = '';
}

function checkAnswer() {
    const userAnswer = Array.from(document.getElementById('answerArea').children)
        .map(word => word.textContent)
        .join(' ');
    
    if (userAnswer.toLowerCase() === currentSentence.toLowerCase()) {
        if (!hasScored) {
            score++;
            hasScored = true;
            document.getElementById('score').textContent = `${score}`;
        }
        
        document.getElementById('feedback').textContent = '✨ Correct! ✨';
        
        // Hide check and skip buttons
        document.getElementById('checkButton').style.display = 'none';
        document.getElementById('skipButton').style.display = 'none';
        
        // Show the next sentence and speak sentence buttons
        document.getElementById('nextSentenceButton').style.display = 'inline';
        document.getElementById('speakSentenceButton').style.display = 'inline';
        
        // Mark game as complete but don't show victory modal yet if score is 5
        if (score >= 5) {
            gameComplete = true;
            // We've removed the showVictoryModal() call from here
        }
    } else {
        document.getElementById('feedback').textContent = '❌ Try again! ❌';
    }
}

function speakSentence() {
    // Always speak the sentence regardless of ttsSetting
    speakText(currentSentence);
}

async function showVictoryModal() {
    const modal = document.getElementById("victoryModal");
    const pokemonId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    const pokemonImageDiv = document.getElementById("pokemonImage");
    const img = document.createElement("img");
    img.src = data.sprites.other["official-artwork"].front_default;
    img.alt = `${data.name} Pokemon artwork`;
    img.width = 300;
    img.height = 300;
    pokemonImageDiv.innerHTML = "";
    pokemonImageDiv.appendChild(img);
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("victoryModal").style.display = "none";
    resetGame();
}

function resetGame() {
    gameStarted = false;
    gameComplete = false;
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('startButton').style.display = 'inline';
    document.getElementById('checkButton').style.display = 'none';
    document.getElementById('skipButton').style.display = 'none';
    document.getElementById('nextSentenceButton').style.display = 'none';
    document.getElementById('speakSentenceButton').style.display = 'none';
    document.getElementById('feedback').textContent = '';
    document.getElementById('scrambledWords').innerHTML = '';
    document.getElementById('answerArea').innerHTML = '';
    document.getElementById('settingsButton').style.display = 'inline';
}

function handleWordSelection(event) {
    if (!gameStarted || gameComplete) return;
    
    const clickedElement = event.target;
    if (!clickedElement.classList.contains('word')) return;
    
    const sourceArea = clickedElement.parentElement.id;
    const targetArea = sourceArea === 'scrambledWords' ? 'answerArea' : 'scrambledWords';
    
    document.getElementById(targetArea).appendChild(clickedElement);
    
    // If moving from scrambled words to answer area, speak the word (controlled by ttsSetting)
    if (sourceArea === 'scrambledWords') {
        speakWord(clickedElement.textContent);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    
    // Event Listeners
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('checkButton').addEventListener('click', checkAnswer);
    document.getElementById('skipButton').addEventListener('click', newSentence);
    
    // Modified the nextSentenceButton event listener to check if victory modal should be shown
    document.getElementById('nextSentenceButton').addEventListener('click', () => {
        if (gameComplete) {
            showVictoryModal(); // Show victory modal when clicking "Next Sentence" after completing 5 sentences
        } else {
            newSentence();
        }
    });
    
    document.getElementById('speakSentenceButton').addEventListener('click', speakSentence);
    document.getElementById('ttsToggle').addEventListener('click', toggleTTS);
    document.getElementById('scrambledWords').addEventListener('click', handleWordSelection);
    document.getElementById('answerArea').addEventListener('click', handleWordSelection);
    
    // Add directions button handler
    document.getElementById('directionsButton').addEventListener('click', () => {
        const directions = document.getElementById('directions');
        directions.style.display = directions.style.display === 'none' ? 'block' : 'none';
    });
    
    document.getElementById('settingsButton').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'block';
        document.getElementById('customSentences').value = customSentences.join('\n');
        document.getElementById('sentenceSource').value = currentSentenceBank;
    });
    
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('settingsModal');
        const modalContent = modal.querySelector('.modal-content');
        if (event.target === modal && !modalContent.contains(event.target)) {
            modal.style.display = 'none';
        }
    });
    
    // Initialize TTS button state
    updateTTSToggleButton();
    
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
        document.getElementById('ttsToggle').style.display = 'none';
        document.getElementById('speakSentenceButton').style.display = 'none';
        console.error('Browser does not support speech synthesis');
    }
});
