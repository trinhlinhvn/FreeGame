/* Universal Settings Panel - Add to any game */

class GameSettings {
    constructor(gameTitle = 'Game') {
        this.gameTitle = gameTitle;
        this.settings = this.loadSettings();
        this.panel = null;
        this.onSettingsChange = null;
    }

    loadSettings() {
        const saved = localStorage.getItem('gameSettings');
        const defaults = {
            soundEnabled: true,
            musicEnabled: true,
            soundVolume: 0.5,
            musicVolume: 0.3,
            difficulty: 'normal',
            showFPS: false,
            screenShake: true,
            particles: true
        };
        return saved ? {...defaults, ...JSON.parse(saved)} : defaults;
    }

    saveSettings() {
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));
        if (this.onSettingsChange) {
            this.onSettingsChange(this.settings);
        }
    }

    createPanel() {
        const overlay = document.createElement('div');
        overlay.id = 'settingsOverlay';
        overlay.innerHTML = `
            <style>
                #settingsOverlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 9999;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Orbitron', sans-serif;
                }

                #settingsOverlay.show {
                    display: flex;
                }

                .settings-panel {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 3px solid #00d4ff;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 0 50px rgba(0, 212, 255, 0.5);
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .settings-title {
                    font-size: 2.5em;
                    color: #00d4ff;
                    text-align: center;
                    margin-bottom: 30px;
                    text-shadow: 0 0 20px #00d4ff;
                }

                .setting-group {
                    margin-bottom: 25px;
                }

                .setting-label {
                    color: #fff;
                    font-size: 1.1em;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .setting-value {
                    color: #00ff88;
                    font-weight: bold;
                }

                input[type="range"] {
                    width: 100%;
                    height: 8px;
                    border-radius: 5px;
                    background: rgba(255, 255, 255, 0.2);
                    outline: none;
                    -webkit-appearance: none;
                }

                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #00d4ff;
                    cursor: pointer;
                    box-shadow: 0 0 10px #00d4ff;
                }

                input[type="range"]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #00d4ff;
                    cursor: pointer;
                    box-shadow: 0 0 10px #00d4ff;
                    border: none;
                }

                .toggle-switch {
                    position: relative;
                    width: 60px;
                    height: 30px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 15px;
                    cursor: pointer;
                    transition: background 0.3s;
                }

                .toggle-switch.active {
                    background: #00ff88;
                }

                .toggle-switch::after {
                    content: '';
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.3s;
                }

                .toggle-switch.active::after {
                    transform: translateX(30px);
                }

                .difficulty-select {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }

                .difficulty-btn {
                    flex: 1;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: 'Orbitron', sans-serif;
                    font-weight: bold;
                }

                .difficulty-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .difficulty-btn.active {
                    background: #00d4ff;
                    border-color: #00d4ff;
                    color: #000;
                    box-shadow: 0 0 20px #00d4ff;
                }

                .settings-buttons {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                }

                .settings-btn {
                    flex: 1;
                    padding: 15px;
                    border: 3px solid;
                    border-radius: 10px;
                    font-size: 1.1em;
                    font-weight: bold;
                    cursor: pointer;
                    font-family: 'Orbitron', sans-serif;
                    transition: all 0.3s;
                    text-transform: uppercase;
                }

                .btn-save {
                    background: linear-gradient(135deg, #00ff88, #00d4ff);
                    color: #000;
                    border-color: #00ff88;
                }

                .btn-save:hover {
                    box-shadow: 0 0 30px #00ff88;
                    transform: scale(1.05);
                }

                .btn-cancel {
                    background: transparent;
                    color: #e74c3c;
                    border-color: #e74c3c;
                }

                .btn-cancel:hover {
                    background: rgba(231, 76, 60, 0.2);
                }

                .info-text {
                    text-align: center;
                    color: #888;
                    font-size: 0.9em;
                    margin-top: 20px;
                }
            </style>

            <div class="settings-panel">
                <h2 class="settings-title">⚙️ SETTINGS</h2>

                <div class="setting-group">
                    <div class="setting-label">
                        <span>🔊 Sound Effects</span>
                        <div class="toggle-switch ${this.settings.soundEnabled ? 'active' : ''}"
                             onclick="gameSettings.toggleSound()"></div>
                    </div>
                    <input type="range" min="0" max="100" value="${this.settings.soundVolume * 100}"
                           ${!this.settings.soundEnabled ? 'disabled' : ''}
                           oninput="gameSettings.setSoundVolume(this.value / 100)"
                           style="margin-top: 10px;">
                </div>

                <div class="setting-group">
                    <div class="setting-label">
                        <span>🎵 Background Music</span>
                        <div class="toggle-switch ${this.settings.musicEnabled ? 'active' : ''}"
                             onclick="gameSettings.toggleMusic()"></div>
                    </div>
                    <input type="range" min="0" max="100" value="${this.settings.musicVolume * 100}"
                           ${!this.settings.musicEnabled ? 'disabled' : ''}
                           oninput="gameSettings.setMusicVolume(this.value / 100)"
                           style="margin-top: 10px;">
                </div>

                <div class="setting-group">
                    <div class="setting-label">
                        <span>📺 Screen Shake</span>
                        <div class="toggle-switch ${this.settings.screenShake ? 'active' : ''}"
                             onclick="gameSettings.toggleScreenShake()"></div>
                    </div>
                </div>

                <div class="setting-group">
                    <div class="setting-label">
                        <span>✨ Particles</span>
                        <div class="toggle-switch ${this.settings.particles ? 'active' : ''}"
                             onclick="gameSettings.toggleParticles()"></div>
                    </div>
                </div>

                <div class="setting-group">
                    <div class="setting-label">
                        <span>⚔️ Difficulty</span>
                    </div>
                    <div class="difficulty-select">
                        <button class="difficulty-btn ${this.settings.difficulty === 'easy' ? 'active' : ''}"
                                onclick="gameSettings.setDifficulty('easy')">EASY</button>
                        <button class="difficulty-btn ${this.settings.difficulty === 'normal' ? 'active' : ''}"
                                onclick="gameSettings.setDifficulty('normal')">NORMAL</button>
                        <button class="difficulty-btn ${this.settings.difficulty === 'hard' ? 'active' : ''}"
                                onclick="gameSettings.setDifficulty('hard')">HARD</button>
                    </div>
                </div>

                <div class="settings-buttons">
                    <button class="settings-btn btn-save" onclick="gameSettings.close()">✓ SAVE</button>
                    <button class="settings-btn btn-cancel" onclick="gameSettings.cancel()">✗ CANCEL</button>
                </div>

                <div class="info-text">
                    Press ESC or ⚙️ to open settings during gameplay
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.panel = overlay;

        // ESC key to toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !overlay.classList.contains('show')) {
                this.show();
            }
        });

        return overlay;
    }

    show() {
        if (!this.panel) this.createPanel();
        this.panel.classList.add('show');
    }

    close() {
        if (this.panel) {
            this.panel.classList.remove('show');
            this.saveSettings();
        }
    }

    cancel() {
        if (this.panel) {
            this.panel.classList.remove('show');
            this.settings = this.loadSettings(); // Revert changes
        }
    }

    toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        this.updatePanel();
    }

    toggleMusic() {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        this.updatePanel();
    }

    toggleScreenShake() {
        this.settings.screenShake = !this.settings.screenShake;
        this.updatePanel();
    }

    toggleParticles() {
        this.settings.particles = !this.settings.particles;
        this.updatePanel();
    }

    setSoundVolume(value) {
        this.settings.soundVolume = value;
    }

    setMusicVolume(value) {
        this.settings.musicVolume = value;
    }

    setDifficulty(level) {
        this.settings.difficulty = level;
        this.updatePanel();
    }

    updatePanel() {
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
            this.createPanel();
            this.show();
        }
    }
}

// Global instance
let gameSettings;

// Usage in any game:
// gameSettings = new GameSettings('Game Name');
// gameSettings.createPanel();
//
// Add settings button to game UI:
// <button onclick="gameSettings.show()">⚙️</button>
//
// Use settings in game:
// if (gameSettings.settings.soundEnabled) {
//     sound.playJump();
// }
