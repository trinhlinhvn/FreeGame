/* Achievement System - Track Player Progress */

class AchievementSystem {
    constructor(gameId) {
        this.gameId = gameId;
        this.achievements = [];
        this.unlocked = this.loadUnlocked();
        this.notificationQueue = [];
    }

    loadUnlocked() {
        const saved = localStorage.getItem(`achievements_${this.gameId}`);
        return saved ? JSON.parse(saved) : [];
    }

    saveUnlocked() {
        localStorage.setItem(`achievements_${this.gameId}`, JSON.stringify(this.unlocked));
    }

    defineAchievement(id, name, description, icon, condition) {
        this.achievements.push({
            id,
            name,
            description,
            icon,
            condition,
            unlocked: this.unlocked.includes(id)
        });
    }

    check(achievementId, value) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;

        if (achievement.condition(value)) {
            this.unlock(achievementId);
        }
    }

    unlock(achievementId) {
        if (this.unlocked.includes(achievementId)) return;

        this.unlocked.push(achievementId);
        this.saveUnlocked();

        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement) {
            achievement.unlocked = true;
            this.showNotification(achievement);
        }
    }

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <style>
                .achievement-notification {
                    position: fixed;
                    top: -200px;
                    right: 20px;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 3px solid #f1c40f;
                    border-radius: 15px;
                    padding: 20px;
                    min-width: 300px;
                    box-shadow: 0 0 40px rgba(241, 196, 15, 0.6);
                    z-index: 10000;
                    animation: achievementSlide 0.5s ease-out forwards, achievementShake 0.5s ease-out 0.5s;
                }

                @keyframes achievementSlide {
                    to { top: 20px; }
                }

                @keyframes achievementShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .achievement-header {
                    color: #f1c40f;
                    font-size: 0.9em;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-shadow: 0 0 10px #f1c40f;
                    letter-spacing: 2px;
                }

                .achievement-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .achievement-icon {
                    font-size: 3em;
                    filter: drop-shadow(0 0 10px #f1c40f);
                }

                .achievement-info {
                    flex: 1;
                }

                .achievement-name {
                    color: white;
                    font-size: 1.2em;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .achievement-desc {
                    color: #aaa;
                    font-size: 0.9em;
                }
            </style>

            <div class="achievement-header">🏆 ACHIEVEMENT UNLOCKED!</div>
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'achievementSlide 0.5s ease-in reverse forwards';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    getProgress() {
        return {
            unlocked: this.unlocked.length,
            total: this.achievements.length,
            percentage: Math.round((this.unlocked.length / this.achievements.length) * 100)
        };
    }
}

// Example Achievement Definitions for Different Games:

// Flappy Bird Achievements
const flappyAchievements = (achievementSystem) => {
    achievementSystem.defineAchievement(
        'first_flight',
        'First Flight',
        'Score your first point',
        '🐣',
        (score) => score >= 1
    );

    achievementSystem.defineAchievement(
        'bronze_bird',
        'Bronze Bird',
        'Score 10 points in one run',
        '🥉',
        (score) => score >= 10
    );

    achievementSystem.defineAchievement(
        'silver_bird',
        'Silver Bird',
        'Score 25 points in one run',
        '🥈',
        (score) => score >= 25
    );

    achievementSystem.defineAchievement(
        'gold_bird',
        'Gold Bird',
        'Score 50 points in one run',
        '🥇',
        (score) => score >= 50
    );

    achievementSystem.defineAchievement(
        'persistent',
        'Persistent',
        'Attempt 50 times',
        '💪',
        (attempts) => attempts >= 50
    );
};

// Snake Achievements
const snakeAchievements = (achievementSystem) => {
    achievementSystem.defineAchievement(
        'tiny_snake',
        'Tiny Snake',
        'Grow to length 10',
        '🐍',
        (length) => length >= 10
    );

    achievementSystem.defineAchievement(
        'big_snake',
        'Big Snake',
        'Grow to length 25',
        '🐉',
        (length) => length >= 25
    );

    achievementSystem.defineAchievement(
        'level_master',
        'Level Master',
        'Reach level 10',
        '🏆',
        (level) => level >= 10
    );

    achievementSystem.defineAchievement(
        'speed_demon',
        'Speed Demon',
        'Survive at max speed for 30 seconds',
        '⚡',
        (time) => time >= 30
    );
};

// Tetris Achievements
const tetrisAchievements = (achievementSystem) => {
    achievementSystem.defineAchievement(
        'tetris_newbie',
        'Tetris Newbie',
        'Clear your first line',
        '📦',
        (lines) => lines >= 1
    );

    achievementSystem.defineAchievement(
        'tetris_master',
        'Tetris Master',
        'Clear 4 lines at once (Tetris!)',
        '💥',
        (clearedAtOnce) => clearedAtOnce === 4
    );

    achievementSystem.defineAchievement(
        'combo_king',
        'Combo King',
        'Clear 10 lines without missing',
        '🔥',
        (combo) => combo >= 10
    );

    achievementSystem.defineAchievement(
        'speed_runner',
        'Speed Runner',
        'Reach level 15',
        '⚡',
        (level) => level >= 15
    );
};

// Usage Example:
// const achievements = new AchievementSystem('flappy-bird');
// flappyAchievements(achievements);
//
// // In game code:
// achievements.check('first_flight', currentScore);
// achievements.check('persistent', totalAttempts);
