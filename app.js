document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const navMenu = document.getElementById('nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    let siteData = null;

    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Fetch data and initialize
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            siteData = data;
            initSite();
        })
        .catch(err => console.error('Error loading data:', err));

    function initSite() {
        // Setup Header/Footer from data
        document.getElementById('hospital-name').textContent = siteData.hospital.name;
        document.getElementById('footer-name').textContent = siteData.hospital.name;
        document.getElementById('footer-phone').textContent = siteData.hospital.phone;
        document.getElementById('footer-email').textContent = siteData.hospital.email;
        document.getElementById('footer-address').textContent = siteData.hospital.address;

        // Setup Navigation
        const footerLinks = document.getElementById('footer-links');
        siteData.navigation.forEach(nav => {
            // Header Nav
            const a = document.createElement('a');
            a.className = 'nav-link';
            a.textContent = nav.label;
            a.dataset.page = nav.id;
            a.setAttribute('href', '#/' + nav.id);
            a.addEventListener('click', () => {
                if(window.innerWidth <= 768) navMenu.classList.remove('open');
            });
            navMenu.appendChild(a);

            // Footer Nav
            const li = document.createElement('li');
            const fa = document.createElement('a');
            fa.textContent = nav.label;
            fa.dataset.page = nav.id;
            fa.setAttribute('href', '#/' + nav.id);
            fa.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            li.appendChild(fa);
            footerLinks.appendChild(li);
        });

        // Mobile Menu Toggle
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        // Hash Routing setup
        window.addEventListener('hashchange', handleRouting);
        
        // Initial route handling
        handleRouting();
    }

    function getPageFromHash() {
        const hash = window.location.hash.replace('#/', '').replace('#', '');
        const validPages = ['home', 'about', 'doctors', 'appointment', 'contact'];
        return validPages.includes(hash) ? hash : 'home';
    }

    function handleRouting() {
        const pageId = getPageFromHash();
        navigate(pageId);
    }

    const pageTitles = {
        home: "City Hospital - Premium Healthcare & Medical Services",
        about: "About Us - City Hospital Nagpur",
        doctors: "Our Specialist Doctors - City Hospital",
        appointment: "Book an Appointment Online - City Hospital",
        contact: "Contact Us - City Hospital Nagpur"
    };

    const pageDescriptions = {
        home: "Welcome to City Hospital Nagpur. We provide premium, quick, and affordable healthcare services with experienced doctors.",
        about: "Learn about City Hospital's mission, vision, and stats. Discover our high-quality healthcare standards and medical equipment.",
        doctors: "Find and book appointments with our specialist doctors, including dentists, general doctors, child specialists, and eye specialists.",
        appointment: "Book your appointment online easily at City Hospital. Choose your doctor and preferred date in a few simple steps.",
        contact: "Get in touch with City Hospital for any inquiries. Phone, email, and location details are listed here."
    };

    function navigate(pageId) {
        // Update active nav state
        document.querySelectorAll('.nav-link').forEach(link => {
            if(link.dataset.page === pageId) link.classList.add('active');
            else link.classList.remove('active');
        });

        // Update document title & meta description
        document.title = pageTitles[pageId] || "City Hospital";
        const metaDesc = document.getElementById('meta-description');
        if (metaDesc) {
            metaDesc.setAttribute('content', pageDescriptions[pageId] || "City Hospital");
        }

        // Dispatch event for Three.js 3D Camera System
        window.dispatchEvent(new CustomEvent('pageChange', { detail: { page: pageId } }));

        // Render Page
        let html = '';
        if(pageId === 'home') html = renderHome();
        else if(pageId === 'about') html = renderAbout();
        else if(pageId === 'doctors') html = renderDoctors();
        else if(pageId === 'appointment') html = renderAppointment();
        else if(pageId === 'contact') html = renderContact();

        app.innerHTML = `<div class="page-content page-enter">${html}</div>`;

        if (pageId === 'doctors') {
            initDoctorsPageListeners();
        } else if (pageId === 'appointment') {
            initAppointmentPageListeners();
        } else if (pageId === 'contact') {
            initContactPageListeners();
        }

        // Wait a frame and apply animations
        requestAnimationFrame(() => {
            const pageContent = document.querySelector('.page-content');
            if (pageContent) {
                pageContent.classList.add('page-enter-active');
            }
            
            // GSAP Animations
            gsap.from('.anim-up', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });
        });
    }

    // --- Render Functions ---

    function renderHome() {
        const d = siteData.home;
        return `
            <section class="hero">
                <div class="container">
                    <h1 class="anim-up">${d.hero.title}</h1>
                    <p class="anim-up">${d.hero.subtitle}</p>
                    <p class="anim-up">${d.hero.description}</p>
                    <a href="#/appointment" class="btn anim-up">Book Appointment</a>
                </div>
            </section>

            <section class="section container">
                <div class="section-header anim-up">
                    <h2>${d.services.title}</h2>
                    <p>${d.services.description}</p>
                </div>
                <div class="grid">
                    ${d.services.items.map(item => `
                        <div class="card anim-up">
                            <h3 class="card-title">${item.name}</h3>
                            <p class="card-text">${item.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="section container">
                <div class="grid-2 anim-up">
                    <div>
                        <h2 style="color: var(--text-main); font-size: 32px; margin-bottom: 20px;">${d.about_preview.title}</h2>
                        <h3 style="color: var(--primary-light); margin-bottom: 15px;">${d.about_preview.subtitle}</h3>
                        <p style="color: var(--text-muted); margin-bottom: 20px;">${d.about_preview.description}</p>
                        <ul class="feature-list">
                            ${d.about_preview.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                        <br>
                        <a href="#/about" class="btn">Read More</a>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); border-radius: var(--border-radius); height: 400px; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05);">
                        <spline-viewer url="https://prod.spline.design/6Wq1Q7YGyM-iab9I/scene.splinecode" style="width: 100%; height: 100%;"></spline-viewer>
                    </div>
                </div>
            </section>
        `;
    }

    function renderAbout() {
        const d = siteData.about;
        return `
            <section class="section container" style="padding-top: 40px;">
                <div class="section-header anim-up">
                    <h1>${d.title}</h1>
                    <p>${d.subtitle}</p>
                </div>
                
                <div class="card anim-up" style="margin-bottom: 40px;">
                    <h3 class="card-title">${d.welcome.title}</h3>
                    <h4 style="color: var(--primary); margin-bottom: 15px;">${d.welcome.subtitle}</h4>
                    <p class="card-text">${d.welcome.description}</p>
                    <ul class="feature-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        ${d.welcome.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>

                <div class="grid-2 anim-up" style="margin-bottom: 40px;">
                    <div class="card">
                        <h3 class="card-title">Our Mission</h3>
                        <p class="card-text">${d.mission}</p>
                    </div>
                    <div class="card">
                        <h3 class="card-title">Our Vision</h3>
                        <p class="card-text">${d.vision}</p>
                    </div>
                </div>

                <div class="stats-grid anim-up">
                    ${d.stats.map(s => `
                        <div class="stat-item">
                            <div class="stat-value">${s.value}</div>
                            <div class="stat-label">${s.label}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    function renderDoctors() {
        const d = siteData.doctors;
        const specialties = [...new Set(d.list.map(doc => doc.specialty))];
        return `
            <section class="section container" style="padding-top: 40px;">
                <div class="section-header anim-up">
                    <h1>${d.title}</h1>
                    <p>${d.subtitle}</p>
                </div>

                <div class="search-filter-bar anim-up">
                    <div class="search-group">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" id="doctor-search" class="form-control" placeholder="Search doctor by name...">
                    </div>
                    <div class="filter-group">
                        <select id="doctor-specialty-filter" class="form-control">
                            <option value="">All Specialties</option>
                            ${specialties.map(spec => `<option value="${spec}">${spec}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div class="grid anim-up" id="doctors-list-container" style="margin-bottom: 60px;">
                    ${d.list.map(doc => `
                        <div class="card" style="text-align: center;">
                            <div class="doctor-avatar-wrapper">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <h3 class="card-title" style="margin-bottom: 5px;">${doc.name}</h3>
                            <p style="color: var(--primary-light); font-weight: 600; margin-bottom: 10px;">${doc.specialty}</p>
                            <p style="color: var(--text-muted); margin-bottom: 20px;">Consultation Fee: ${doc.fee}</p>
                            <a href="#/appointment" class="btn" style="padding: 8px 20px; font-size: 14px;">Book Now</a>
                        </div>
                    `).join('')}
                </div>

                <div class="card anim-up" style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: white;">
                    <div class="grid-2">
                        <div>
                            <h3 style="font-size: 28px; margin-bottom: 10px; color: white;">${d.why_choose_us.title}</h3>
                            <p style="margin-bottom: 15px; opacity: 0.9;">${d.why_choose_us.subtitle}</p>
                            <p style="opacity: 0.8; margin-bottom: 20px;">${d.why_choose_us.description}</p>
                        </div>
                        <div>
                            <ul class="feature-list" style="color: white;">
                                ${d.why_choose_us.features.map(f => `<li style="color: white; padding-left: 35px; margin-bottom: 15px;"><span style="position: absolute; left: 0; top: -2px; background: rgba(255,255,255,0.2); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">✓</span>${f}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function renderAppointment() {
        const d = siteData.appointment;
        return `
            <section class="section container" style="padding-top: 40px;">
                <div class="section-header anim-up">
                    <h1>${d.title}</h1>
                    <p>${d.subtitle}</p>
                </div>

                <div class="grid-2 anim-up">
                    <div>
                        <div class="card">
                            <h3 class="card-title">Fill the form below</h3>
                            <p class="card-text">Our team will contact you shortly.</p>
                            <form id="appointment-form">
                                <div class="form-group">
                                    <label>Patient Name</label>
                                    <input type="text" id="apt-name" class="form-control" required placeholder="Enter patient name">
                                </div>
                                <div class="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" id="apt-phone" class="form-control" required placeholder="Enter phone number">
                                </div>
                                <div class="form-group">
                                    <label>Select Doctor</label>
                                    <select id="apt-doctor" class="form-control" required>
                                        <option value="">Select an option</option>
                                        ${siteData.doctors.list.map(doc => `<option value="${doc.name}">${doc.name} (${doc.specialty})</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Appointment Date</label>
                                    <input type="date" id="apt-date" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label>Address</label>
                                    <textarea id="apt-address" class="form-control" required placeholder="Enter your address" style="min-height: 80px;"></textarea>
                                </div>
                                <button type="submit" class="btn" style="width: 100%;">Submit</button>
                            </form>
                        </div>

                        <div class="card" style="margin-top: 30px;">
                            <h3 class="card-title">My Bookings</h3>
                            <div id="appointments-list-container">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="card" style="margin-bottom: 30px;">
                            <h3 class="card-title">${d.why_choose_us.title}</h3>
                            <p class="card-text">${d.why_choose_us.description}</p>
                            <ul class="feature-list">
                                ${d.why_choose_us.features.map(f => `<li>${f}</li>`).join('')}
                            </ul>
                        </div>

                        <h3 style="color: var(--text-main); margin-bottom: 20px;">Frequently Asked Questions</h3>
                        <div class="faq-accordion">
                            ${d.faq.map(f => `
                                <div class="faq-item">
                                    <button class="faq-toggle" aria-expanded="false">
                                        <span class="faq-question">${f.question}</span>
                                        <span class="faq-icon">+</span>
                                    </button>
                                    <div class="faq-answer-wrapper">
                                        <div class="faq-answer">${f.answer}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function renderContact() {
        return `
            <section class="section container" style="padding-top: 40px;">
                <div class="section-header anim-up">
                    <h1>Contact Us</h1>
                    <p>Get in touch with us for any inquiries.</p>
                </div>
                <div class="grid-2 anim-up">
                    <div class="card">
                        <h3 class="card-title">Send us a Message</h3>
                        <form id="contact-form">
                            <div class="form-group">
                                <label>Your Name</label>
                                <input type="text" id="contact-name" class="form-control" required placeholder="Enter your name">
                            </div>
                            <div class="form-group">
                                <label>Your Email</label>
                                <input type="email" id="contact-email" class="form-control" required placeholder="Enter your email address">
                            </div>
                            <div class="form-group">
                                <label>Subject</label>
                                <input type="text" id="contact-subject" class="form-control" required placeholder="Enter subject">
                            </div>
                            <div class="form-group">
                                <label>Your Message</label>
                                <textarea id="contact-message" class="form-control" required placeholder="Write your message here..."></textarea>
                            </div>
                            <button type="submit" class="btn" style="width: 100%;">Submit</button>
                        </form>
                    </div>
                    <div>
                        <div class="card" style="margin-bottom: 30px;">
                            <h3 class="card-title">Hospital Information</h3>
                            <p style="margin-bottom: 10px;"><strong>Phone:</strong> ${siteData.hospital.phone}</p>
                            <p style="margin-bottom: 10px;"><strong>Email:</strong> ${siteData.hospital.email}</p>
                            <p><strong>Address:</strong> ${siteData.hospital.address}</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    // Delegated FAQ Accordion Toggle
    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.faq-toggle');
        if (toggle) {
            const faqItem = toggle.closest('.faq-item');
            const wrapper = faqItem.querySelector('.faq-answer-wrapper');
            const icon = toggle.querySelector('.faq-icon');
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';

            // Collapse other open accordion items if desired
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    const otherToggle = item.querySelector('.faq-toggle');
                    const otherWrapper = item.querySelector('.faq-answer-wrapper');
                    const otherIcon = item.querySelector('.faq-icon');
                    if (otherToggle && otherWrapper && otherIcon) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                        otherWrapper.style.height = '0px';
                        otherIcon.textContent = '+';
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });

            if (isOpen) {
                toggle.setAttribute('aria-expanded', 'false');
                wrapper.style.height = '0px';
                icon.textContent = '+';
                icon.style.transform = 'rotate(0deg)';
            } else {
                toggle.setAttribute('aria-expanded', 'true');
                const content = wrapper.querySelector('.faq-answer');
                wrapper.style.height = content.offsetHeight + 'px';
                icon.textContent = '−';
                icon.style.transform = 'rotate(180deg)';
            }
        }
    });

    function initDoctorsPageListeners() {
        const searchInput = document.getElementById('doctor-search');
        const filterSelect = document.getElementById('doctor-specialty-filter');
        const listContainer = document.getElementById('doctors-list-container');

        if (!searchInput || !filterSelect || !listContainer) return;

        const updateList = () => {
            const query = searchInput.value.toLowerCase().trim();
            const selectedSpecialty = filterSelect.value;

            const filtered = siteData.doctors.list.filter(doc => {
                const matchesSearch = doc.name.toLowerCase().includes(query);
                const matchesFilter = selectedSpecialty === '' || doc.specialty === selectedSpecialty;
                return matchesSearch && matchesFilter;
            });

            if (filtered.length === 0) {
                listContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                        <p style="font-size: 18px; margin-bottom: 10px;">No doctors found matching your criteria.</p>
                        <p style="font-size: 14px;">Try searching for a different name or specialty.</p>
                    </div>
                `;
            } else {
                listContainer.innerHTML = filtered.map(doc => `
                    <div class="card" style="text-align: center;">
                        <div class="doctor-avatar-wrapper">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <h3 class="card-title" style="margin-bottom: 5px;">${doc.name}</h3>
                        <p style="color: var(--primary-light); font-weight: 600; margin-bottom: 10px;">${doc.specialty}</p>
                        <p style="color: var(--text-muted); margin-bottom: 20px;">Consultation Fee: ${doc.fee}</p>
                        <a href="#/appointment" class="btn" style="padding: 8px 20px; font-size: 14px;">Book Now</a>
                    </div>
                `).join('');
            }
        };

        searchInput.addEventListener('input', updateList);
        filterSelect.addEventListener('change', updateList);
    }

    // Delegated cancel button click listener
    document.addEventListener('click', (e) => {
        const cancelBtn = e.target.closest('.btn-cancel');
        if (cancelBtn) {
            const item = cancelBtn.closest('.appointment-list-item');
            if (item) {
                const id = item.id;
                cancelAppointment(id);
            }
        }
    });

    function cancelAppointment(id) {
        let apts = JSON.parse(localStorage.getItem('city_hospital_appointments') || '[]');
        const toCancel = apts.find(a => a.id === id);
        apts = apts.filter(a => a.id !== id);
        localStorage.setItem('city_hospital_appointments', JSON.stringify(apts));
        
        if (toCancel) {
            showToast(`Appointment with ${toCancel.doctor} has been cancelled.`, 'error');
        } else {
            showToast(`Appointment has been cancelled.`, 'error');
        }

        renderAppointmentsList();
    }

    function initAppointmentPageListeners() {
        const form = document.getElementById('appointment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('apt-name').value.trim();
                const phone = document.getElementById('apt-phone').value.trim();
                const doctor = document.getElementById('apt-doctor').value;
                const date = document.getElementById('apt-date').value;
                const address = document.getElementById('apt-address').value.trim();

                // Validation
                if (!name || !phone || !doctor || !date || !address) {
                    showToast('Please fill out all fields correctly.', 'error');
                    return;
                }

                // Save to local storage
                const newApt = {
                    id: 'apt-' + Date.now(),
                    name,
                    phone,
                    doctor,
                    date,
                    address
                };

                const currentApts = JSON.parse(localStorage.getItem('city_hospital_appointments') || '[]');
                currentApts.push(newApt);
                localStorage.setItem('city_hospital_appointments', JSON.stringify(currentApts));

                showToast(`Appointment successfully booked with ${doctor}!`, 'success');
                form.reset();
                renderAppointmentsList();
            });
        }

        renderAppointmentsList();
    }

    function renderAppointmentsList() {
        const container = document.getElementById('appointments-list-container');
        if (!container) return;

        const apts = JSON.parse(localStorage.getItem('city_hospital_appointments') || '[]');

        if (apts.length === 0) {
            container.innerHTML = `<p style="color: var(--text-muted); font-size: 15px; text-align: center; margin: 20px 0;">No upcoming appointments booked. Use the form above to schedule your visit.</p>`;
            return;
        }

        container.innerHTML = apts.map(apt => `
            <div class="appointment-list-item" id="${apt.id}">
                <div class="appointment-info">
                    <h4>${apt.doctor}</h4>
                    <p>Patient: <strong>${apt.name}</strong></p>
                    <p>Date: ${apt.date}</p>
                </div>
                <button class="btn-cancel">Cancel</button>
            </div>
        `).join('');
    }

    function initContactPageListeners() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('contact-name').value.trim();
                const email = document.getElementById('contact-email').value.trim();
                const subject = document.getElementById('contact-subject').value.trim();
                const message = document.getElementById('contact-message').value.trim();

                if (!name || !email || !subject || !message) {
                    showToast('Please fill out all fields.', 'error');
                    return;
                }

                // Save message
                const newMsg = {
                    id: 'msg-' + Date.now(),
                    name,
                    email,
                    subject,
                    message,
                    timestamp: new Date().toISOString()
                };

                const currentMsgs = JSON.parse(localStorage.getItem('city_hospital_messages') || '[]');
                currentMsgs.push(newMsg);
                localStorage.setItem('city_hospital_messages', JSON.stringify(currentMsgs));

                showToast('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            });
        }
    }

    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto close after 4 seconds
        const autoClose = setTimeout(() => {
            closeToast(toast);
        }, 4000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoClose);
            closeToast(toast);
        });
    }

    function closeToast(toast) {
        toast.classList.remove('show');
        const removeTimeout = setTimeout(() => {
            toast.remove();
        }, 400);

        toast.addEventListener('transitionend', () => {
            clearTimeout(removeTimeout);
            toast.remove();
        });
    }
});
