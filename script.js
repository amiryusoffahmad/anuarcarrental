// Set Default Dates (Today & Tomorrow)
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    document.getElementById('pickDate').value = formatDate(today);
    document.getElementById('returnDate').value = formatDate(tomorrow);
    document.getElementById('quickPickDate').value = formatDate(today);
    document.getElementById('quickReturnDate').value = formatDate(tomorrow);

    // Min dates to prevent past date booking
    document.getElementById('pickDate').min = formatDate(today);
    document.getElementById('returnDate').min = formatDate(today);

    updateCalculation();
});

// Light & Dark Mode Switcher
const themeToggleBtn = document.getElementById('themeToggleBtn');
const iconSun = document.querySelector('.icon-sun');
const iconMoon = document.querySelector('.icon-moon');

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'light') {
        iconSun.style.display = 'inline-flex';
        iconMoon.style.display = 'none';
    } else {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'inline-flex';
    }
});

// Fleet Filtering Logic
function filterFleet(category, element) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Select Car from Fleet Grid directly into Booking Form
function selectCarForBooking(carName, rate) {
    const select = document.getElementById('mainCarSelect');
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.startsWith(carName)) {
            select.selectedIndex = i;
            break;
        }
    }
    updateCalculation();
    scrollToBooking();
}

// Scroll helper
function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

// Calculation Logic
function updateCalculation() {
    const carVal = document.getElementById('mainCarSelect').value;
    const [carName, carRateStr] = carVal.split('|');
    const dailyRate = parseInt(carRateStr, 10);

    const pickDateVal = new Date(document.getElementById('pickDate').value);
    const returnDateVal = new Date(document.getElementById('returnDate').value);

    let diffDays = 1;
    if (returnDateVal > pickDateVal) {
        const diffTime = Math.abs(returnDateVal - pickDateVal);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const totalCost = dailyRate * diffDays;

    // UI Updates
    document.getElementById('sumCarName').innerText = carName;
    document.getElementById('sumDailyRate').innerText = `RM ${dailyRate} / hari`;
    document.getElementById('sumDays').innerText = `${diffDays} Hari`;
    document.getElementById('sumTotalPrice').innerText = `RM ${totalCost}`;
}

// Format and Trigger WhatsApp Message
function sendBookingToWhatsApp() {
    const carVal = document.getElementById('mainCarSelect').value;
    const [carName, carRateStr] = carVal.split('|');
    const dailyRate = parseInt(carRateStr, 10);

    const pickDate = document.getElementById('pickDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const custName = document.getElementById('custName').value.trim() || 'Pelanggan';
    const custLoc = document.getElementById('custLoc').value.trim() || 'Taman Pulai Indah / Johor Bahru';

    const pickDateObj = new Date(pickDate);
    const returnDateObj = new Date(returnDate);
    let diffDays = 1;
    if (returnDateObj > pickDateObj) {
        const diffTime = Math.abs(returnDateObj - pickDateObj);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    const totalCost = dailyRate * diffDays;

    const textMsg = `Salam ANCR Car Rental (KSTJB),\nSaya nak buat tempahan sewa kereta:\n\n` +
                    `👤 Nama: ${custName}\n` +
                    `🚗 Model Kereta: ${carName}\n` +
                    `📅 Tarikh Ambil: ${pickDate}\n` +
                    `📅 Tarikh Pulang: ${returnDate} (${diffDays} Hari)\n` +
                    `📍 Lokasi / Destinasi: ${custLoc}\n` +
                    `💰 Anggaran Jumlah: RM ${totalCost}\n\n` +
                    `Boleh semak kekosongan kereta ini? Terima kasih!`;

    const waPhone = "60167574577";
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(textMsg)}`;
    window.open(waUrl, '_blank');
}