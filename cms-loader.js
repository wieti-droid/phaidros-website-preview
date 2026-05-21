/**
 * Decap CMS Content Loader
 * Fetches JSON data files and injects content into the page
 */

const CMS_DATA_PATH = '_data/';

async function loadCMSData() {
    try {
        const [site, hero, about, bonavidea, privateLabel, partners, rd, contact, footer] = await Promise.all([
            fetchJSON('site.json'),
            fetchJSON('hero.json'),
            fetchJSON('about.json'),
            fetchJSON('bonavidea.json'),
            fetchJSON('private-label.json'),
            fetchJSON('partners.json'),
            fetchJSON('rd.json'),
            fetchJSON('contact.json'),
            fetchJSON('footer.json')
        ]);

        applySiteData(site);
        applyHeroData(hero);
        applyAboutData(about);
        applyBonavideaData(bonavidea);
        applyPrivateLabelData(privateLabel);
        applyPartnersData(partners);
        applyRDData(rd);
        applyContactData(contact);
        applyFooterData(footer);

    } catch (error) {
        console.log('CMS data not available, using default content');
    }
}

async function fetchJSON(filename) {
    try {
        const response = await fetch(CMS_DATA_PATH + filename + '?t=' + Date.now());
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

function applySiteData(data) {
    if (!data) return;
    if (data.title) document.title = data.title;
    document.querySelectorAll('.site-email').forEach(el => { if(data.email) el.textContent = data.email; });
    document.querySelectorAll('.site-phone').forEach(el => { if(data.phone) el.textContent = data.phone; });
    document.querySelectorAll('.site-address').forEach(el => { if(data.address) el.textContent = data.address; });
}

function applyHeroData(data) {
    if (!data) return;
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge && data.badge) heroBadge.innerHTML = `<span class="badge-dot"></span>${data.badge}`;
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && data.title) {
        heroTitle.innerHTML = data.title.replace(/\n/g, '<br>');
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && data.subtitle) heroSubtitle.textContent = data.subtitle;
    
    if (data.stats) {
        const statElements = document.querySelectorAll('.hero-stats .stat');
        data.stats.forEach((stat, i) => {
            if (statElements[i]) {
                const num = statElements[i].querySelector('.stat-number');
                const label = statElements[i].querySelector('.stat-label');
                if (num) num.textContent = stat.number;
                if (label) label.textContent = stat.label;
            }
        });
    }
}

function applyAboutData(data) {
    if (!data) return;
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    const tag = aboutSection.querySelector('.section-tag');
    if (tag && data.section_tag) tag.textContent = data.section_tag;
    
    const title = aboutSection.querySelector('.section-title');
    if (title && data.title) {
        title.innerHTML = `${data.title}<br><span class="gradient-text">${data.title_highlight || 'Patient Care'}</span>`;
    }
    
    if (data.cards) {
        const cards = aboutSection.querySelectorAll('.about-card');
        data.cards.forEach((card, i) => {
            if (cards[i]) {
                const h3 = cards[i].querySelector('h3');
                const p = cards[i].querySelector('p');
                if (h3) h3.textContent = card.title;
                if (p) p.textContent = card.description;
            }
        });
    }
}

function applyBonavideaData(data) {
    if (!data) return;
    const section = document.getElementById('bonavidea');
    if (!section) return;
    
    const tag = section.querySelector('.section-tag');
    if (tag && data.section_tag) tag.textContent = data.section_tag;
    
    const title = section.querySelector('.section-title');
    if (title && data.title) title.innerHTML = `${data.title}`;
    
    const lead = section.querySelector('.bonavidea-lead');
    if (lead && data.lead) lead.textContent = data.lead;
    
    const desc = section.querySelector('.bonavidea-text');
    if (desc && data.description) desc.innerHTML = data.description;
    
    if (data.categories) {
        const categories = section.querySelectorAll('.product-category');
        data.categories.forEach((cat, i) => {
            if (categories[i]) {
                const h4 = categories[i].querySelector('h4');
                const p = categories[i].querySelector('p');
                if (h4) h4.textContent = cat.name;
                if (p) p.textContent = cat.description;
            }
        });
    }
}

function applyPrivateLabelData(data) {
    if (!data) return;
    const section = document.getElementById('private-label');
    if (!section) return;
    
    const tag = section.querySelector('.section-tag');
    if (tag && data.section_tag) tag.textContent = data.section_tag;
    
    const title = section.querySelector('.section-title');
    if (title && data.title) {
        title.innerHTML = `${data.title}<br><span class="gradient-text">${data.title_highlight || 'Solutions'}</span>`;
    }
    
    const subtitle = section.querySelector('.section-subtitle');
    if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;
    
    if (data.services) {
        const cards = section.querySelectorAll('.service-card');
        data.services.forEach((svc, i) => {
            if (cards[i]) {
                const num = cards[i].querySelector('.service-number');
                const h3 = cards[i].querySelector('h3');
                const p = cards[i].querySelector('p');
                if (num) num.textContent = svc.number;
                if (h3) h3.textContent = svc.title;
                if (p) p.textContent = svc.description;
            }
        });
    }
}

function applyPartnersData(data) {
    if (!data) return;
    const section = document.getElementById('partners');
    if (!section) return;
    
    const tag = section.querySelector('.section-tag');
    if (tag && data.section_tag) tag.textContent = data.section_tag;
    
    const title = section.querySelector('.section-title');
    if (title && data.title) {
        title.innerHTML = `${data.title}<br><span class="gradient-text">${data.title_highlight || 'Phaidros'}</span>`;
    }
    
    const subtitle = section.querySelector('.section-subtitle');
    if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;
    
    if (data.partner_types) {
        const cards = section.querySelectorAll('.partner-card');
        data.partner_types.forEach((partner, i) => {
            if (cards[i]) {
                const h3 = cards[i].querySelector('h3');
                const p = cards[i].querySelector('p');
                const ul = cards[i].querySelector('ul');
                if (h3) h3.textContent = partner.title;
                if (p) p.textContent = partner.description;
                if (ul && partner.features) {
                    ul.innerHTML = partner.features.map(f => `<li>${f}</li>`).join('');
                }
            }
        });
    }
}

function applyRDData(data) {
    if (!data) return;
    const section = document.getElementById('rd');
    if (!section) return;
    
    const tag = section.querySelector('.section-tag');
    if (tag && data.section_tag) tag.textContent = data.section_tag;
    
    const title = section.querySelector('.section-title');
    if (title && data.title) {
        title.innerHTML = `${data.title}<br><span class="gradient-text">${data.title_highlight || 'Development'}</span>`;
    }
    
    const lead = section.querySelector('.rd-lead');
    if (lead && data.lead) lead.textContent = data.lead;
    
    if (data.focus_items) {
        const items = section.querySelectorAll('.focus-item');
        data.focus_items.forEach((item, i) => {
            if (items[i]) {
                const span = items[i].querySelector('span:last-child');
                if (span) span.textContent = item;
            }
        });
    }
}

function applyContactData(data) {
    if (!data) return;
    const section = document.getElementById('contact');
    if (!section) return;
    
    const tag = section.querySelector('.section-tag');
    if (tag && data.section_tag) tag.textContent = data.section_tag;
    
    const title = section.querySelector('.section-title');
    if (title && data.title) {
        title.innerHTML = `${data.title}<br><span class="gradient-text">${data.title_highlight || 'Something Great'}</span>`;
    }
    
    const lead = section.querySelector('.contact-lead');
    if (lead && data.lead) lead.textContent = data.lead;
}

function applyFooterData(data) {
    if (!data) return;
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    const brandText = footer.querySelector('.footer-brand p');
    if (brandText && data.brand_text) brandText.textContent = data.brand_text;
    
    const copyright = footer.querySelector('.footer-bottom p');
    if (copyright && data.copyright) copyright.textContent = data.copyright;
}

// Load when DOM is ready
document.addEventListener('DOMContentLoaded', loadCMSData);
