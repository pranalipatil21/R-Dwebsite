/* script.js - Complete Fixed Version */

/* 1. COUNTDOWN TIMER */
const eventDate = new Date("March 13, 2026 09:00:00").getTime();
const eventDateElement = document.getElementById("days");


function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;
    const daysElement = document.getElementById("days");

    if (daysElement) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerHTML = days;
        document.getElementById("hours").innerHTML = hours;
        document.getElementById("minutes").innerHTML = minutes;
        document.getElementById("seconds").innerHTML = seconds;
    }
}
setInterval(updateCountdown, 1000);

/* 2. PARTICLE BACKGROUND */
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
        for (let i = 0; i < 100; i++) {
            particlesArray.push(new Particle());
        }
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
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

/* 3. SCROLL & NAVBAR LOGIC */
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

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

window.addEventListener('scroll', handleNavbarZoom);

/* 4. MAIN INITIALIZATION (Form & Animations) */
document.addEventListener('DOMContentLoaded', () => {
    
    // Init Scroll Animations
    const scrollElements = document.querySelectorAll('.scroll-animate');
    scrollElements.forEach((el) => observer.observe(el));
    
    // Init Navbar State
    handleNavbarZoom();

    // --- FORM LOGIC ---
    const teamSelect = document.getElementById("teamSizeSelect");
    const form = document.forms['submit-to-google-sheet'];

    // Only run form logic if the form exists on this page
    if (form && teamSelect) {
        
        // Init Team Fields (Default to 1)
        teamSelect.value = "1";
        generateMemberFields();

        // Handle Submit
        form.addEventListener('submit', e => {
            e.preventDefault();
            
            // Your Google Script URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwfN_vBWKFH4W-BN5GB8_o2I4o9964KRBbLccFKKqb9SoiFvbp930E5q7uZ-E74FDCE/exec';
            
            const msgDiv = document.getElementById("formMessage");
            const msgTitle = document.getElementById("msgTitle");
            const msgText = document.getElementById("msgText");

            // UI: Hide Form, Show Loading
            form.style.display = "none";
            msgDiv.style.display = "block";
            
            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => {
                    msgTitle.innerText = "Registration Successful!";
                    msgTitle.style.color = "#22c55e"; // Green
                    msgText.innerText = "Thank you for registering. We will contact you soon.";
                    console.log('Success!', response);
                })
                .catch(error => {
                    msgTitle.innerText = "Error!";
                    msgTitle.style.color = "red";
                    msgText.innerText = "Something went wrong. Please try again later.";
                    console.error('Error!', error.message);
                });
        });
    }
});

/* 5. HELPER FUNCTIONS (Must be global for HTML onclick attributes) */

// Multi-step Form Navigation
let currentStep = 0;

function showStep(n) {
    const steps = document.querySelectorAll(".form-step");
    const progressBar = document.getElementById("progressBar");
    
    if(steps.length > 0) {
        steps.forEach(step => step.classList.remove("active"));
        steps[n].classList.add("active");
        
        // Update Progress Bar
        const progressPercent = ((n + 1) / steps.length) * 100;
        if(progressBar) progressBar.style.width = progressPercent + "%";
    }
}

function nextStep() {
    const steps = document.querySelectorAll(".form-step");
    const currentInputs = steps[currentStep].querySelectorAll("input, select");
    let isValid = true;
    
    currentInputs.forEach(input => {
        if (input.hasAttribute("required") && input.value.trim() === "") {
            isValid = false;
            input.style.borderColor = "red";
            setTimeout(() => input.style.borderColor = "", 2000);
        }
    });

    if (isValid) {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    } else {
        alert("Please fill in all required fields.");
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

// Dynamic Team Fields
function generateMemberFields() {
    const size = document.getElementById("teamSizeSelect").value;
    const container = document.getElementById("member-fields-container");
    
    // Clear previous fields immediately
    container.innerHTML = "";

    // If size is 1, return
    if (size === "1") {
        return; 
    }

    // Generate fields starting from Member 2
    for (let i = 2; i <= size; i++) {
        const memberHtml = `
            <div class="member-block" style="margin-top: 20px; padding: 15px; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; background: rgba(255,255,255,0.02); animation: fadeIn 0.5s ease;">
                <h4 style="color: #f97316; margin-bottom: 10px;">Member ${i} Details</h4>
                
                <div class="input-group">
                    <label>Full Name</label>
                    <input type="text" name="Member${i}Name" placeholder="Name" required>
                </div>
                <div class="input-group">
                    <label>Email</label>
                    <input type="email" name="Member${i}Email" placeholder="Email" required>
                </div>
                <div class="input-group" style="display:flex; gap: 15px;">
                    <div style="flex:1">
                        <label>Year</label>
                        <select name="Member${i}Year" required>
                            <option value="">Select</option>
                            <option value="FY">FY</option>
                            <option value="SY">SY</option>
                            <option value="TY">TY</option>
                            <option value="B.Tech">B.Tech</option>
                        </select>
                    </div>
                    <div style="flex:1">
                        <label>Department</label>
                        <input type="text" name="Member${i}Dept" placeholder="Dept" required>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', memberHtml);
    }
}

/* --- MOBILE MENU TOGGLE --- */
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Close menu when a link is clicked (optional, good for user experience)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});