// Universal Sound System for All Games
// Add this to any game's <script> section

class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.3;
        this.enabled = true;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // Beep sound (for UI interactions)
    playBeep(frequency = 440, duration = 0.1) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Jump/Flap sound
    playJump() {
        if (!this.enabled) return;
        const startFreq = 200;
        const endFreq = 400;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + 0.1);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(this.masterVolume * 0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Collision/Hit sound
    playHit() {
        if (!this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 100;
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(this.masterVolume * 0.8, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    // Score/Collect sound
    playScore() {
        if (!this.enabled) return;

        const notes = [523.25, 659.25, 783.99]; // C, E, G
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
            }, i * 50);
        });
    }

    // Game Over sound
    playGameOver() {
        if (!this.enabled) return;

        const notes = [392, 349.23, 329.63, 293.66]; // G, F, E, D (descending)
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'triangle';

                gainNode.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
            }, i * 150);
        });
    }

    // Level Up sound
    playLevelUp() {
        if (!this.enabled) return;

        const notes = [261.63, 329.63, 392, 523.25]; // C, E, G, C (ascending)
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);

                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.25);
            }, i * 80);
        });
    }

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Screen Shake Effect
class ScreenShake {
    constructor(canvas) {
        this.canvas = canvas;
        this.shaking = false;
        this.shakeAmount = 0;
        this.shakeDuration = 0;
    }

    shake(intensity = 10, duration = 300) {
        this.shaking = true;
        this.shakeAmount = intensity;
        this.shakeDuration = duration;

        const startTime = Date.now();
        const originalTransform = this.canvas.style.transform;

        const shakeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;

            if (elapsed >= duration) {
                clearInterval(shakeInterval);
                this.canvas.style.transform = originalTransform;
                this.shaking = false;
                return;
            }

            const progress = elapsed / duration;
            const currentIntensity = this.shakeAmount * (1 - progress);

            const x = (Math.random() - 0.5) * currentIntensity;
            const y = (Math.random() - 0.5) * currentIntensity;

            this.canvas.style.transform = `translate(${x}px, ${y}px)`;
        }, 16);
    }
}

// Enhanced Particle System
class ParticleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
    }

    emit(x, y, options = {}) {
        const count = options.count || 10;
        const color = options.color || '#ffffff';
        const speed = options.speed || 3;
        const life = options.life || 1000;
        const gravity = options.gravity !== undefined ? options.gravity : 0.2;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed * (0.5 + Math.random()),
                vy: Math.sin(angle) * speed * (0.5 + Math.random()),
                life: life,
                maxLife: life,
                color: color,
                size: 3 + Math.random() * 3,
                gravity: gravity
            });
        }
    }

    update(deltaTime = 16) {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life -= deltaTime;

            p.vx *= 0.98; // Air resistance
            p.vy *= 0.98;

            return p.life > 0;
        });
    }

    draw() {
        this.particles.forEach(p => {
            const alpha = p.life / p.maxLife;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
}

// Usage Example:
// const sound = new SoundSystem();
// const shake = new ScreenShake(canvas);
// const particles = new ParticleSystem(ctx);
//
// // On collision:
// sound.playHit();
// shake.shake(15, 200);
// particles.emit(x, y, {color: '#ff0088', count: 20});
