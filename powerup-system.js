/* Power-Up System for Breakout and Similar Games */

class PowerUpSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.powerUps = [];
        this.activePowerUps = [];
        this.types = {
            MULTI_BALL: {
                id: 'multi_ball',
                name: 'Multi Ball',
                icon: '⚾',
                color: '#e74c3c',
                duration: 0, // Instant effect
                effect: 'spawn_balls'
            },
            EXPAND_PADDLE: {
                id: 'expand_paddle',
                name: 'Expand Paddle',
                icon: '📏',
                color: '#3498db',
                duration: 10000,
                effect: 'paddle_size',
                multiplier: 1.5
            },
            LASER: {
                id: 'laser',
                name: 'Laser Paddle',
                icon: '🔫',
                color: '#9b59b6',
                duration: 8000,
                effect: 'laser_shots'
            },
            SLOW_BALL: {
                id: 'slow_ball',
                name: 'Slow Ball',
                icon: '🐌',
                color: '#f39c12',
                duration: 7000,
                effect: 'ball_speed',
                multiplier: 0.5
            },
            STICKY_PADDLE: {
                id: 'sticky_paddle',
                name: 'Sticky Paddle',
                icon: '🍯',
                color: '#e67e22',
                duration: 12000,
                effect: 'catch_ball'
            },
            EXTRA_LIFE: {
                id: 'extra_life',
                name: 'Extra Life',
                icon: '❤️',
                color: '#e74c3c',
                duration: 0,
                effect: 'add_life'
            },
            FIREBALL: {
                id: 'fireball',
                name: 'Fire Ball',
                icon: '🔥',
                color: '#ff6b6b',
                duration: 6000,
                effect: 'pierce_bricks'
            }
        };
    }

    spawnPowerUp(x, y, typeKey = null) {
        // Random type if not specified
        if (!typeKey) {
            const keys = Object.keys(this.types);
            typeKey = keys[Math.floor(Math.random() * keys.length)];
        }

        const type = this.types[typeKey];
        if (!type) return;

        this.powerUps.push({
            x: x,
            y: y,
            width: 40,
            height: 20,
            type: type,
            vy: 2, // Fall speed
            collected: false
        });
    }

    update(paddle, onCollect) {
        // Update falling power-ups
        this.powerUps = this.powerUps.filter(powerUp => {
            if (powerUp.collected) return false;

            powerUp.y += powerUp.vy;

            // Check paddle collision
            if (this.checkCollision(powerUp, paddle)) {
                powerUp.collected = true;
                this.activate(powerUp.type);
                if (onCollect) onCollect(powerUp.type);
                return false;
            }

            // Remove if off screen
            return powerUp.y < this.canvas.height;
        });

        // Update active power-ups
        this.activePowerUps = this.activePowerUps.filter(active => {
            if (active.duration === 0) return false; // Instant effects

            active.remaining -= 16; // Assuming 60fps
            return active.remaining > 0;
        });
    }

    draw() {
        // Draw falling power-ups
        this.powerUps.forEach(powerUp => {
            // Glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = powerUp.type.color;

            // Background
            this.ctx.fillStyle = powerUp.type.color;
            this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

            // Border
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

            // Icon
            this.ctx.shadowBlur = 0;
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(
                powerUp.type.icon,
                powerUp.x + powerUp.width / 2,
                powerUp.y + powerUp.height / 2
            );
        });

        this.ctx.shadowBlur = 0;

        // Draw active power-up indicators
        this.drawActiveIndicators();
    }

    drawActiveIndicators() {
        const indicatorY = 10;
        let indicatorX = 10;

        this.activePowerUps.forEach(active => {
            const width = 60;
            const height = 30;

            // Background
            this.ctx.fillStyle = active.type.color;
            this.ctx.globalAlpha = 0.8;
            this.ctx.fillRect(indicatorX, indicatorY, width, height);
            this.ctx.globalAlpha = 1;

            // Border
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(indicatorX, indicatorY, width, height);

            // Icon
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(active.type.icon, indicatorX + width / 2, indicatorY + height / 2);

            // Timer bar
            if (active.duration > 0) {
                const progress = active.remaining / active.duration;
                const barWidth = width * progress;
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.fillRect(indicatorX, indicatorY + height - 3, barWidth, 3);
            }

            indicatorX += width + 10;
        });
    }

    activate(type) {
        // Prevent duplicate instant effects
        if (type.duration > 0) {
            // Remove existing of same type
            this.activePowerUps = this.activePowerUps.filter(a => a.type.id !== type.id);

            this.activePowerUps.push({
                type: type,
                duration: type.duration,
                remaining: type.duration
            });
        }

        // Return the effect for game to handle
        return {
            effect: type.effect,
            multiplier: type.multiplier,
            duration: type.duration
        };
    }

    checkCollision(powerUp, paddle) {
        return powerUp.x < paddle.x + paddle.width &&
               powerUp.x + powerUp.width > paddle.x &&
               powerUp.y < paddle.y + paddle.height &&
               powerUp.y + powerUp.height > paddle.y;
    }

    isActive(effectType) {
        return this.activePowerUps.some(a => a.type.effect === effectType);
    }

    getActiveMultiplier(effectType) {
        const active = this.activePowerUps.find(a => a.type.effect === effectType);
        return active ? active.type.multiplier : 1;
    }

    clear() {
        this.powerUps = [];
        this.activePowerUps = [];
    }
}

// Laser System for Breakout
class LaserSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.lasers = [];
        this.cooldown = 0;
        this.cooldownTime = 300; // ms between shots
    }

    shoot(x, y) {
        if (this.cooldown > 0) return false;

        this.lasers.push({
            x: x - 2,
            y: y - 20,
            width: 4,
            height: 15,
            speed: 8
        });

        this.cooldown = this.cooldownTime;
        return true;
    }

    update(bricks, onHit) {
        // Update cooldown
        this.cooldown = Math.max(0, this.cooldown - 16);

        // Update lasers
        this.lasers = this.lasers.filter(laser => {
            laser.y -= laser.speed;

            // Check brick collision
            let hit = false;
            bricks.forEach((row, rowIndex) => {
                row.forEach((brick, colIndex) => {
                    if (brick.status === 1 && this.checkLaserBrickCollision(laser, brick)) {
                        brick.status = 0;
                        hit = true;
                        if (onHit) onHit(brick, rowIndex, colIndex);
                    }
                });
            });

            if (hit) return false;

            // Remove if off screen
            return laser.y > -laser.height;
        });
    }

    draw() {
        this.lasers.forEach(laser => {
            // Laser beam
            const gradient = this.ctx.createLinearGradient(
                laser.x, laser.y,
                laser.x, laser.y + laser.height
            );
            gradient.addColorStop(0, '#00ffff');
            gradient.addColorStop(1, '#0088ff');

            this.ctx.fillStyle = gradient;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00ffff';
            this.ctx.fillRect(laser.x, laser.y, laser.width, laser.height);

            // Glow
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            this.ctx.fillRect(laser.x - 2, laser.y, laser.width + 4, laser.height);

            this.ctx.shadowBlur = 0;
        });
    }

    checkLaserBrickCollision(laser, brick) {
        return laser.x < brick.x + brick.width &&
               laser.x + laser.width > brick.x &&
               laser.y < brick.y + brick.height &&
               laser.y + laser.height > brick.y;
    }

    clear() {
        this.lasers = [];
    }
}

// Usage Example for Breakout:
/*
const powerUpSystem = new PowerUpSystem(canvas, ctx);
const laserSystem = new LaserSystem(canvas, ctx);

// When brick is destroyed (30% chance):
if (Math.random() < 0.3) {
    powerUpSystem.spawnPowerUp(brick.x, brick.y);
}

// In game loop:
powerUpSystem.update(paddle, (type) => {
    switch(type.effect) {
        case 'multi_ball':
            // Duplicate current balls
            balls.forEach(ball => {
                balls.push({...ball, dx: -ball.dx});
            });
            sound.playScore();
            break;

        case 'expand_paddle':
            paddle.originalWidth = paddle.width;
            paddle.width *= type.multiplier;
            sound.playLevelUp();
            break;

        case 'laser_shots':
            // Enable laser mode
            sound.playLevelUp();
            break;

        case 'add_life':
            lives++;
            sound.playScore();
            break;

        case 'ball_speed':
            balls.forEach(ball => {
                ball.originalSpeed = Math.sqrt(ball.dx*ball.dx + ball.dy*ball.dy);
            });
            break;

        case 'pierce_bricks':
            // Ball goes through bricks
            break;
    }
});

// Draw power-ups
powerUpSystem.draw();

// If laser is active
if (powerUpSystem.isActive('laser_shots')) {
    laserSystem.update(bricks, (brick) => {
        score += brick.points;
        sound.playHit();
    });
    laserSystem.draw();

    // Shoot on click
    canvas.addEventListener('click', () => {
        if (laserSystem.shoot(paddle.x + paddle.width/2, paddle.y)) {
            sound.playBeep(800, 0.05);
        }
    });
}

// Restore paddle size when power-up expires
if (paddle.originalWidth && !powerUpSystem.isActive('expand_paddle')) {
    paddle.width = paddle.originalWidth;
    paddle.originalWidth = null;
}
*/
