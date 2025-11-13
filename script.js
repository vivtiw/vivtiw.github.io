// Enhanced Personal Website Script with Modern Features
document.addEventListener('DOMContentLoaded', function() {

    // ==================== SECURITY MEASURES ====================

    // Disable right-click on entire page
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSecurityNotification('Right-click is disabled to protect content.');
        return false;
    });

    // Disable common keyboard shortcuts for page manipulation
    document.addEventListener('keydown', function(e) {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
            (e.ctrlKey && e.keyCode === 85)) { // Ctrl+U
            e.preventDefault();
            showSecurityNotification('Developer tools shortcuts are disabled.');
            return false;
        }
    });

    // Disable text selection on sensitive content
    document.querySelectorAll('.protected-image, .image-watermark').forEach(el => {
        el.style.userSelect = 'none';
        el.style.webkitUserSelect = 'none';
        el.style.mozUserSelect = 'none';
        el.style.msUserSelect = 'none';
    });

    // Show security notification
    function showSecurityNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(239, 68, 68, 0.95);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add animation styles
    const securityStyles = document.createElement('style');
    securityStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(securityStyles);

    // Prevent image dragging
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'false');
        img.style.pointerEvents = 'none';
    });

    // Add copyright notice in console
    console.clear();
    console.log('%c⚠️ STOP!', 'color: red; font-size: 60px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log('%cThis is a browser feature intended for developers.', 'font-size: 18px; color: #333;');
    console.log('%cIf someone told you to copy-paste something here, it is a scam.', 'font-size: 16px; color: red; font-weight: bold;');
    console.log('%c\n© 2024 Vivek Tiwari. All rights reserved.', 'font-size: 14px; color: #6366f1; font-weight: bold;');
    console.log('%cUnauthorized copying or distribution is prohibited.', 'font-size: 12px; color: #666;');
    console.log('%c\nOfficial site: https://vivtiw.github.io/', 'font-size: 12px; color: #6366f1;');


    // ==================== PARTICLE SYSTEM ====================
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Connect particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // ==================== DARK MODE TOGGLE ====================
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<span class="theme-toggle-icon">🌙</span><span>Dark</span>';
    document.body.appendChild(themeToggle);

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<span class="theme-toggle-icon">☀️</span><span>Light</span>';
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');

        this.innerHTML = isLight
            ? '<span class="theme-toggle-icon">☀️</span><span>Light</span>'
            : '<span class="theme-toggle-icon">🌙</span><span>Dark</span>';

        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        // Animate the toggle
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });

    // ==================== SMOOTH SCROLLING ====================
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==================== SCROLL ANIMATIONS ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('.work-section, .skills-section, .experience-section, .education-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // ==================== ENHANCED SKILL CARDS ====================
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        // Stagger animation
        category.style.animationDelay = `${index * 0.1}s`;

        category.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const glow = document.createElement('div');
            glow.style.position = 'absolute';
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
            glow.style.width = '100px';
            glow.style.height = '100px';
            glow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)';
            glow.style.transform = 'translate(-50%, -50%)';
            glow.style.pointerEvents = 'none';
            glow.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            this.appendChild(glow);

            setTimeout(() => {
                glow.style.opacity = '0';
                glow.style.transform = 'translate(-50%, -50%) scale(2)';
            }, 10);

            setTimeout(() => {
                glow.remove();
            }, 500);
        });
    });

    // ==================== EXPERIENCE ITEMS HOVER ====================
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ==================== EDUCATION ITEMS HOVER ====================
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // ==================== SCROLL TO TOP BUTTON ====================
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        opacity: 0;
        visibility: hidden;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button with progress indicator
    let scrollProgress = 0;
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollProgress = (scrollTop / (documentHeight - windowHeight)) * 100;

        if (window.pageYOffset > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }

        // Update button with scroll progress
        scrollToTopBtn.style.background = `
            linear-gradient(135deg, #667eea 0%, #764ba2 100%),
            conic-gradient(#fff ${scrollProgress * 3.6}deg, transparent 0deg)
        `;
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Add pulse animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });

    // Add hover effect to scroll to top button
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) translateY(-5px)';
        this.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.6)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
        this.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.4)';
    });

    // ==================== CONTACT ICON ANIMATIONS ====================
    const contactIcons = document.querySelectorAll('.contact-icon');
    contactIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });

        icon.addEventListener('click', function(e) {
            // Pulse effect
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 100);
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ==================== PAGE LOAD ANIMATION ====================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // ==================== TYPING EFFECT FOR TAGLINE ====================
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };

        // Start typing effect after a short delay
        setTimeout(typeWriter, 800);
    }

    // ==================== PARALLAX EFFECT ====================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.header, .profile-image');

        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ==================== EASTER EGG GAME ====================

    // Create game trigger button
    const gameButton = document.createElement('div');
    gameButton.className = 'easter-egg-trigger';
    gameButton.innerHTML = '🎮<div class="easter-egg-tooltip">Bored? Play a game!</div>';
    document.body.appendChild(gameButton);

    // Create game modal
    const gameModal = document.createElement('div');
    gameModal.className = 'game-modal';
    gameModal.innerHTML = `
        <div class="game-container">
            <div class="game-header">
                <h2>Code Jumper 🚀</h2>
                <p class="game-tagline">Stuck in a code review? Let's jump over some bugs!</p>
            </div>
            <canvas class="game-canvas" id="gameCanvas"></canvas>
            <div class="game-controls">
                <div class="game-score">Score: <span id="score">0</span></div>
                <div class="game-buttons">
                    <button class="game-btn game-btn-primary" id="restartBtn">Restart</button>
                    <button class="game-btn game-btn-secondary" id="closeBtn">Close</button>
                </div>
            </div>
            <div class="game-instructions">
                Press SPACE or click to jump | Avoid the bugs! 🐛
            </div>
        </div>
    `;
    document.body.appendChild(gameModal);

    // Game variables
    let gameCanvas, gameCtx, gameRunning, score, player, obstacles, gameSpeed, gameAnimationId;

    // Initialize game
    function initGame() {
        gameCanvas = document.getElementById('gameCanvas');
        gameCtx = gameCanvas.getContext('2d');
        gameCanvas.width = gameCanvas.offsetWidth;
        gameCanvas.height = gameCanvas.offsetHeight;

        gameRunning = false;
        score = 0;
        gameSpeed = 5;
        obstacles = [];

        player = {
            x: 50,
            y: gameCanvas.height - 80,
            width: 40,
            height: 40,
            jumping: false,
            velocityY: 0,
            gravity: 0.8,
            jumpPower: -15
        };
    }

    // Start game
    function startGame() {
        if (!gameRunning) {
            gameRunning = true;
            obstacles = [];
            score = 0;
            gameSpeed = 5;
            player.y = gameCanvas.height - 80;
            player.velocityY = 0;
            player.jumping = false;
            updateScore();
            gameLoop();
        }
    }

    // Game loop
    function gameLoop() {
        if (!gameRunning) return;

        // Clear canvas
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw ground
        gameCtx.fillStyle = '#6366f1';
        gameCtx.fillRect(0, gameCanvas.height - 30, gameCanvas.width, 2);

        // Update and draw player
        if (player.jumping) {
            player.velocityY += player.gravity;
            player.y += player.velocityY;

            if (player.y >= gameCanvas.height - 80) {
                player.y = gameCanvas.height - 80;
                player.jumping = false;
                player.velocityY = 0;
            }
        }

        // Draw player (character)
        gameCtx.fillStyle = '#8b5cf6';
        gameCtx.fillRect(player.x, player.y, player.width, player.height);
        gameCtx.fillStyle = '#fff';
        gameCtx.font = '30px Arial';
        gameCtx.fillText('👨‍💻', player.x + 5, player.y + 32);

        // Spawn obstacles
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < gameCanvas.width - 300) {
            obstacles.push({
                x: gameCanvas.width,
                y: gameCanvas.height - 70,
                width: 30,
                height: 40
            });
        }

        // Update and draw obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameSpeed;

            // Draw obstacle (bug)
            gameCtx.fillStyle = '#ec4899';
            gameCtx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
            gameCtx.fillStyle = '#fff';
            gameCtx.font = '35px Arial';
            gameCtx.fillText('🐛', obstacles[i].x - 2, obstacles[i].y + 32);

            // Check collision
            if (player.x < obstacles[i].x + obstacles[i].width &&
                player.x + player.width > obstacles[i].x &&
                player.y < obstacles[i].y + obstacles[i].height &&
                player.y + player.height > obstacles[i].y) {
                gameOver();
                return;
            }

            // Remove off-screen obstacles and increase score
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
                updateScore();

                // Increase difficulty
                if (score % 5 === 0) {
                    gameSpeed += 0.5;
                }
            }
        }

        gameAnimationId = requestAnimationFrame(gameLoop);
    }

    // Jump function
    function jump() {
        if (!player.jumping && gameRunning) {
            player.jumping = true;
            player.velocityY = player.jumpPower;
        }
    }

    // Game over
    function gameOver() {
        gameRunning = false;
        cancelAnimationFrame(gameAnimationId);

        gameCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        gameCtx.fillStyle = '#fff';
        gameCtx.font = 'bold 40px Arial';
        gameCtx.textAlign = 'center';
        gameCtx.fillText('Game Over!', gameCanvas.width / 2, gameCanvas.height / 2 - 20);

        gameCtx.font = '20px Arial';
        gameCtx.fillText(`Final Score: ${score}`, gameCanvas.width / 2, gameCanvas.height / 2 + 20);
        gameCtx.fillText('Click Restart to try again', gameCanvas.width / 2, gameCanvas.height / 2 + 50);
    }

    // Update score display
    function updateScore() {
        document.getElementById('score').textContent = score;
    }

    // Event listeners for game
    gameButton.addEventListener('click', () => {
        gameModal.classList.add('active');
        initGame();
        startGame();
    });

    document.getElementById('closeBtn').addEventListener('click', () => {
        gameModal.classList.remove('active');
        gameRunning = false;
        cancelAnimationFrame(gameAnimationId);
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        initGame();
        startGame();
    });

    // Jump on space or click
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameModal.classList.contains('active')) {
            e.preventDefault();
            jump();
        }
    });

    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            gameModal.classList.remove('active');
            gameRunning = false;
            cancelAnimationFrame(gameAnimationId);
        }
    });

    document.getElementById('gameCanvas').addEventListener('click', jump);

    // ==================== CONSOLE MESSAGE ====================
    console.log('%c✨ Vivek Tiwari - Portfolio Website', 'font-size: 20px; font-weight: bold; color: #667eea;');
    console.log('%c🚀 Built with modern web technologies', 'font-size: 14px; color: #764ba2;');
    console.log('%c💻 Dark Mode | Particle Effects | Smooth Animations', 'font-size: 12px; color: #6366f1;');
    console.log('%c🎮 Found the game? Nice! Press the game button to play!', 'font-size: 12px; color: #ec4899;');
});
