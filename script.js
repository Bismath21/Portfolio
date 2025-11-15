// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

// Update theme toggle icon
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 3D Background Animation
class ThreeJSBackground {
    constructor() {
        this.container = document.getElementById('three-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.createParticles();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 5;
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 0.05,
            transparent: true,
            opacity: 0.8
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
        
        // Add floating geometric shapes
        this.createFloatingShapes();
    }
    
    createFloatingShapes() {
        const shapes = [
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.SphereGeometry(0.1, 8, 6),
            new THREE.ConeGeometry(0.1, 0.3, 6)
        ];
        
        for (let i = 0; i < 15; i++) {
            const geometry = shapes[Math.floor(Math.random() * shapes.length)];
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() * 0xffffff,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                }
            };
            
            this.scene.add(mesh);
            this.particles.push(mesh);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate particle system
        this.particleSystem.rotation.x += 0.001;
        this.particleSystem.rotation.y += 0.002;
        
        // Animate floating shapes
        this.particles.forEach(particle => {
            particle.rotation.x += particle.userData.rotationSpeed.x;
            particle.rotation.y += particle.userData.rotationSpeed.y;
            particle.rotation.z += particle.userData.rotationSpeed.z;
        });
        
        // Mouse interaction
        this.camera.position.x += (this.mouse.x * 0.001 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y * 0.001 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }
}

// 3D Profile Animation
class Profile3D {
    constructor() {
        this.canvas = document.getElementById('profile-3d-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        
        this.init();
        this.createProfile();
        this.animate();
    }
    
    init() {
        this.renderer.setSize(200, 200);
        this.renderer.setClearColor(0x000000, 0);
        this.camera.position.z = 3;
    }
    
    createProfile() {
        // Create a rotating DNA-like helix
        const helixGeometry = new THREE.BufferGeometry();
        const helixPositions = [];
        
        for (let i = 0; i < 100; i++) {
            const angle = (i / 100) * Math.PI * 4;
            const radius = 0.5;
            const x = Math.cos(angle) * radius;
            const y = (i / 100) * 2 - 1;
            const z = Math.sin(angle) * radius;
            
            helixPositions.push(x, y, z);
        }
        
        helixGeometry.setAttribute('position', new THREE.Float32BufferAttribute(helixPositions, 3));
        
        const helixMaterial = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        this.helix = new THREE.Points(helixGeometry, helixMaterial);
        this.scene.add(this.helix);
        
        // Add orbiting spheres
        for (let i = 0; i < 3; i++) {
            const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 6);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: [0x6366f1, 0x8b5cf6, 0x06b6d4][i],
                transparent: true,
                opacity: 0.7
            });
            
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.userData = { angle: i * (Math.PI * 2 / 3), radius: 0.8 };
            this.scene.add(sphere);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate helix
        this.helix.rotation.y += 0.01;
        
        // Animate orbiting spheres
        this.scene.children.forEach((child, index) => {
            if (child.userData && child.userData.angle !== undefined) {
                child.userData.angle += 0.02;
                child.position.x = Math.cos(child.userData.angle) * child.userData.radius;
                child.position.z = Math.sin(child.userData.angle) * child.userData.radius;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// 3D Skills Visualization
class Skills3D {
    constructor() {
        this.canvas = document.getElementById('skills-3d-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.offsetWidth / this.canvas.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        
        this.init();
        this.createSkillsBars();
        this.animate();
    }
    
    init() {
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, 0);
    }
    
    createSkillsBars() {
        const skills = [
            { name: 'Python', level: 0.95, color: 0x6366f1 },
            { name: 'ML/AI', level: 0.88, color: 0x8b5cf6 },
            { name: 'Data Analysis', level: 0.92, color: 0x06b6d4 },
            { name: 'Deep Learning', level: 0.85, color: 0x10b981 },
            { name: 'Statistics', level: 0.90, color: 0xf59e0b }
        ];
        
        skills.forEach((skill, index) => {
            const geometry = new THREE.BoxGeometry(0.3, skill.level * 2, 0.3);
            const material = new THREE.MeshBasicMaterial({
                color: skill.color,
                transparent: true,
                opacity: 0.8
            });
            
            const bar = new THREE.Mesh(geometry, material);
            bar.position.x = (index - 2) * 0.8;
            bar.position.y = skill.level;
            
            bar.userData = {
                targetHeight: skill.level * 2,
                currentHeight: 0,
                growing: false
            };
            
            this.scene.add(bar);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Animate skill bars growth
        this.scene.children.forEach(bar => {
            if (bar.userData && bar.userData.growing) {
                if (bar.userData.currentHeight < bar.userData.targetHeight) {
                    bar.userData.currentHeight += 0.02;
                    bar.scale.y = bar.userData.currentHeight / bar.userData.targetHeight;
                }
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    startAnimation() {
        this.scene.children.forEach(bar => {
            if (bar.userData) {
                bar.userData.growing = true;
            }
        });
    }
}

// Initialize 3D systems after DOM is loaded
let background3D, profile3D, skills3D;

window.addEventListener('load', () => {
    background3D = new ThreeJSBackground();
    
    // Initialize profile 3D if canvas exists
    if (document.getElementById('profile-3d-canvas')) {
        profile3D = new Profile3D();
    }
    
    // Initialize skills 3D if canvas exists
    if (document.getElementById('skills-3d-canvas')) {
        skills3D = new Skills3D();
    }
    
    // Initialize data science demos
    initDataScienceDemos();
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    section.classList.add('animate-on-scroll');
    observer.observe(section);
});

// Skill Bar Animations
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate 3D skills
            if (skills3D) {
                skills3D.startAnimation();
            }
            
            // Animate 2D skill bars
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skills').forEach(section => {
    skillObserver.observe(section);
});

// Typing Animation for Hero Title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = document.body.getAttribute('data-theme') === 'dark' 
            ? 'rgba(15, 23, 42, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = document.body.getAttribute('data-theme') === 'dark' 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
    }
});

// Add active class to current navigation item
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add some interactive hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Update 3D background based on scroll
    if (background3D && background3D.particleSystem) {
        background3D.particleSystem.rotation.z = scrolled * 0.0001;
    }
});

// Add smooth reveal animation for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-item h3');
            statNumbers.forEach(stat => {
                const finalNumber = stat.textContent;
                const isPercentage = finalNumber.includes('%');
                const number = parseInt(finalNumber);
                
                let current = 0;
                const increment = number / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        current = number;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + (isPercentage ? '%' : '+');
                }, 30);
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(section => {
    statsObserver.observe(section);
});

// Data Science Demos Implementation
function initDataScienceDemos() {
    // Linear Regression Demo
    const regressionCanvas = document.getElementById('regression-canvas');
    if (regressionCanvas) {
        const ctx = regressionCanvas.getContext('2d');
        let points = [];
        let showLine = false;
        
        function drawRegression() {
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, 300, 300);
            
            // Draw grid
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 300; i += 30) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 300);
                ctx.moveTo(0, i);
                ctx.lineTo(300, i);
                ctx.stroke();
            }
            
            // Draw points
            ctx.fillStyle = '#6366f1';
            points.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });
            
            // Draw regression line
            if (showLine && points.length >= 2) {
                const {slope, intercept, r2} = calculateRegression();
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, intercept);
                ctx.lineTo(300, slope * 300 + intercept);
                ctx.stroke();
                
                document.getElementById('r-squared').textContent = r2.toFixed(3);
            }
        }
        
        function calculateRegression() {
            const n = points.length;
            const sumX = points.reduce((sum, p) => sum + p.x, 0);
            const sumY = points.reduce((sum, p) => sum + p.y, 0);
            const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
            const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
            const sumYY = points.reduce((sum, p) => sum + p.y * p.y, 0);
            
            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            
            // Calculate R-squared
            const yMean = sumY / n;
            const ssRes = points.reduce((sum, p) => {
                const predicted = slope * p.x + intercept;
                return sum + Math.pow(p.y - predicted, 2);
            }, 0);
            const ssTot = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
            const r2 = 1 - (ssRes / ssTot);
            
            return {slope, intercept, r2: isNaN(r2) ? 0 : r2};
        }
        
        regressionCanvas.onclick = (e) => {
            const rect = regressionCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            points.push({x, y});
            drawRegression();
        };
        
        document.getElementById('clear-points').onclick = () => {
            points = [];
            showLine = false;
            document.getElementById('r-squared').textContent = '0.00';
            drawRegression();
        };
        
        document.getElementById('show-line').onclick = () => {
            showLine = !showLine;
            drawRegression();
        };
        
        drawRegression();
    }
    
    // Classification Demo
    const classCanvas = document.getElementById('classification-canvas');
    if (classCanvas) {
        const ctx = classCanvas.getContext('2d');
        let redPoints = [];
        let bluePoints = [];
        let currentClass = 'red';
        let showBoundary = false;
        
        function drawClassification() {
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, 300, 300);
            
            // Draw boundary if classification is shown
            if (showBoundary) {
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(150, 0);
                ctx.lineTo(150, 300);
                ctx.stroke();
                
                // Calculate accuracy
                let correct = 0;
                let total = redPoints.length + bluePoints.length;
                redPoints.forEach(p => { if (p.x < 150) correct++; });
                bluePoints.forEach(p => { if (p.x >= 150) correct++; });
                const accuracy = total > 0 ? (correct / total * 100).toFixed(0) : 0;
                document.getElementById('accuracy').textContent = accuracy + '%';
            }
            
            // Draw red points
            ctx.fillStyle = '#ef4444';
            redPoints.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
                ctx.fill();
            });
            
            // Draw blue points
            ctx.fillStyle = '#3b82f6';
            bluePoints.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
        
        classCanvas.onclick = (e) => {
            const rect = classCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (currentClass === 'red') {
                redPoints.push({x, y});
            } else {
                bluePoints.push({x, y});
            }
            drawClassification();
        };
        
        document.getElementById('add-red').onclick = () => {
            currentClass = 'red';
            showBoundary = false;
            document.getElementById('accuracy').textContent = '0%';
        };
        
        document.getElementById('add-blue').onclick = () => {
            currentClass = 'blue';
            showBoundary = false;
            document.getElementById('accuracy').textContent = '0%';
        };
        
        document.getElementById('classify').onclick = () => {
            showBoundary = true;
            drawClassification();
        };
        
        drawClassification();
    }
    
    // Statistics Quiz
    const quizQuestions = [
        {q: "What is the mean of [2, 4, 6, 8, 10]?", options: ["5", "6", "7", "8"], correct: 1},
        {q: "What is the median of [1, 3, 5, 7, 9]?", options: ["3", "5", "7", "9"], correct: 1},
        {q: "In a normal distribution, what % of data falls within 1 standard deviation?", options: ["68%", "95%", "99%", "50%"], correct: 0},
        {q: "What does R² measure in regression?", options: ["Error", "Variance explained", "Mean", "Correlation"], correct: 1},
        {q: "What is the mode of [1, 2, 2, 3, 4]?", options: ["1", "2", "3", "4"], correct: 1}
    ];
    
    let currentQuestion = 0;
    let score = 0;
    let quizActive = false;
    
    function showQuestion() {
        if (currentQuestion >= quizQuestions.length) {
            document.getElementById('question-text').textContent = `Quiz Complete! Final Score: ${score}/${quizQuestions.length}`;
            document.getElementById('quiz-options').innerHTML = '';
            document.getElementById('next-question').style.display = 'none';
            document.getElementById('start-quiz').style.display = 'inline-block';
            return;
        }
        
        const q = quizQuestions[currentQuestion];
        document.getElementById('question-text').textContent = q.q;
        
        const optionsDiv = document.getElementById('quiz-options');
        optionsDiv.innerHTML = '';
        
        q.options.forEach((option, i) => {
            const btn = document.createElement('div');
            btn.className = 'quiz-option';
            btn.textContent = option;
            btn.onclick = () => selectAnswer(i);
            optionsDiv.appendChild(btn);
        });
        
        document.getElementById('quiz-feedback').textContent = '';
        document.getElementById('next-question').style.display = 'none';
    }
    
    function selectAnswer(selected) {
        const q = quizQuestions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach((opt, i) => {
            opt.onclick = null;
            if (i === q.correct) {
                opt.classList.add('correct');
            } else if (i === selected) {
                opt.classList.add('incorrect');
            }
        });
        
        const feedback = document.getElementById('quiz-feedback');
        if (selected === q.correct) {
            score++;
            feedback.textContent = 'Correct! ✓';
            feedback.className = 'correct';
        } else {
            feedback.textContent = 'Incorrect. The correct answer is highlighted.';
            feedback.className = 'incorrect';
        }
        
        document.getElementById('quiz-score').textContent = `${score}/${currentQuestion + 1}`;
        document.getElementById('next-question').style.display = 'inline-block';
    }
    
    document.getElementById('start-quiz').onclick = () => {
        currentQuestion = 0;
        score = 0;
        quizActive = true;
        document.getElementById('quiz-score').textContent = '0/0';
        document.getElementById('start-quiz').style.display = 'none';
        showQuestion();
    };
    
    document.getElementById('next-question').onclick = () => {
        currentQuestion++;
        showQuestion();
    };
}

// Theme change for 3D elements
themeToggle.addEventListener('click', () => {
    setTimeout(() => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        
        // Update 3D background colors
        if (background3D && background3D.particleSystem) {
            background3D.particleSystem.material.color.setHex(isDark ? 0x6366f1 : 0x8b5cf6);
        }
    }, 100);
});

// Resize handler for 3D canvases
window.addEventListener('resize', () => {
    if (skills3D) {
        const canvas = skills3D.canvas;
        skills3D.camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        skills3D.camera.updateProjectionMatrix();
        skills3D.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    }
});