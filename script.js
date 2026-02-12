/* script.js - Updated Timer Logic */

// 1. SMART COUNTDOWN TIMER
function startTimer() {
    const timerBox = document.querySelector('.timer-box');
    if (!timerBox) return;

    // Logic: If HTML has 'data-deadline', use it. Otherwise, default to Conference Date (March 13).
    const dateAttr = timerBox.getAttribute('data-deadline');
    const targetDate = dateAttr ? new Date(dateAttr).getTime() : new Date("March 13, 2026 09:00:00").getTime();

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (document.getElementById("days")) {
            document.getElementById("days").innerHTML = days;
            document.getElementById("hours").innerHTML = hours;
            document.getElementById("minutes").innerHTML = minutes;
            document.getElementById("seconds").innerHTML = seconds;
        }

        if (distance < 0) {
            clearInterval(timerInterval);
            timerBox.innerHTML = "<h2 style='color:white; text-align:center;'>Time's Up!</h2>";
        }
    }

    update(); // Run immediately to avoid 1-second delay
    const timerInterval = setInterval(update, 1000);
}

// 2. SCROLL ANIMATIONS
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// 3. NAVBAR ZOOM LOGIC
const navbar = document.querySelector('nav');
function handleNavbarZoom() {
    if (navbar) {
        if (window.scrollY < 50) {
            navbar.classList.add('nav-zoomed');
        } else {
            navbar.classList.remove('nav-zoomed');
        }
    }
}

// 4. MOBILE MENU
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// 5. PARTICLE BACKGROUND (Optional)
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() * 1) - 0.5;
            this.speedY = (Math.random() * 1) - 0.5;
            this.color = '#3b82f6';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < 100; i++) { particlesArray.push(new Particle()); }
    }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance/100})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
}

// INITIALIZE EVERYTHING
document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    handleNavbarZoom();
    window.addEventListener('scroll', handleNavbarZoom);
    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));
});

