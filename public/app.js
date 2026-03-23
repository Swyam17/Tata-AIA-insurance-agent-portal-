/* ═══════════════════════════════════════════════════
   TATA AIA INSURANCE AGENT PORTAL — APPLICATION JS
   Connected to Express + MongoDB backend
   ═══════════════════════════════════════════════════ */

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {

  // ── LOAD INITIAL DATA FROM MONGODB ──────────────
  loadPolicies();
  loadStats();
  loadAgentProfile();
  loadAnalytics(); // NEW: Load chart data

  // ... (existing resize and scroll observers)

  // ── SIGNATURE PAD LOGIC ─────────────────────────
  const canvas = document.getElementById('signaturePad');
  const ctx = canvas.getContext('2d');
  let drawing = false;

  canvas.addEventListener('mousedown', () => drawing = true);
  window.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mousemove', draw);

  function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#333';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  document.getElementById('clearSignature').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  });

  // ── BENEFITS CALCULATOR LOGIC ───────────────────
  const calcInvest = document.getElementById('calcInvest');
  const calcTerm = document.getElementById('calcTerm');
  const calcReturn = document.getElementById('calcReturn');

  const calcInvestDisplay = document.getElementById('calcInvestDisplay');
  const calcTermDisplay = document.getElementById('calcTermDisplay');
  const calcReturnDisplay = document.getElementById('calcReturnDisplay');

  const calcMaturityValue = document.getElementById('calcMaturityValue');
  const calcTotalInvested = document.getElementById('calcTotalInvested');
  const calcWealthGained = document.getElementById('calcWealthGained');

  function updateCalculator() {
    const principal = parseInt(calcInvest.value);
    const years = parseInt(calcTerm.value);
    const rate = parseFloat(calcReturn.value) / 100;

    calcInvestDisplay.textContent = formatCurrency(principal);
    calcTermDisplay.textContent = `${years} Years`;
    calcReturnDisplay.textContent = `${calcReturn.value}%`;

    // Compound Interest Formula: A = P * (1 + r)^n
    const maturityValue = Math.round(principal * Math.pow((1 + rate), years));
    const profit = maturityValue - principal;

    calcMaturityValue.textContent = formatCurrency(maturityValue);
    calcTotalInvested.textContent = formatCurrency(principal);
    calcWealthGained.textContent = formatCurrency(profit);
  }

  [calcInvest, calcTerm, calcReturn].forEach(el => el.addEventListener('input', updateCalculator));
  updateCalculator();

  // ── ANALYTICS (GRAPHS) ──────────────────────────
  async function loadAnalytics() {
    try {
      const response = await fetch(`${API_BASE}/analytics`);
      const data = await response.json();

      // 1. Monthly Growth Chart
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const labels = data.monthlyData.map(d => months[d._id - 1]);
      const counts = data.monthlyData.map(d => d.count);
      const premiums = data.monthlyData.map(d => d.premium / 1000); // in K

      new Chart(document.getElementById('growthChart'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Policies Sold',
            data: counts,
            borderColor: '#D62049',
            backgroundColor: 'rgba(214, 32, 73, 0.1)',
            fill: true,
            tension: 0.4
          }, {
            label: 'Premium (₹ K)',
            data: premiums,
            borderColor: '#267CC5',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } },
          scales: { y: { beginAtZero: true } }
        }
      });

      // 2. Plan Distribution Chart
      const planLabels = data.planDistribution.map(d => d._id);
      const planCounts = data.planDistribution.map(d => d.count);

      new Chart(document.getElementById('planChart'), {
        type: 'doughnut',
        data: {
          labels: planLabels,
          datasets: [{
            data: planCounts,
            backgroundColor: ['#D62049', '#103B7C', '#267CC5', '#FFC107', '#28A745']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'right' } }
        }
      });

    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  }

  // ... (Existing functions for loadPolicies, loadStats, loadAgentProfile)
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ── ACTIVE NAV LINK ON SCROLL ───────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = { threshold: 0.3 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ── HAMBURGER MENU ──────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
  });
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinksContainer.classList.remove('open'));
  });

  // ── SCROLL REVEAL ANIMATION ─────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => revealObserver.observe(el));

  // ── SUM ASSURED SLIDER ──────────────────────────
  const sumSlider = document.getElementById('sumAssured');
  const sumDisplay = document.getElementById('sumDisplay');
  const premiumValue = document.getElementById('premiumValue');

  function formatCurrency(num) {
    return '₹' + num.toLocaleString('en-IN');
  }

  function updateSliderBg() {
    const pct = ((sumSlider.value - sumSlider.min) / (sumSlider.max - sumSlider.min)) * 100;
    sumSlider.style.background = `linear-gradient(to right, var(--brand-red) ${pct}%, #dfe6ed ${pct}%)`;
  }

  function calculatePremium() {
    const sum = parseInt(sumSlider.value) || 0;
    const term = parseInt(document.getElementById('policyTerm').value) || 20;
    const plan = document.getElementById('planType').value;
    const freq = document.querySelector('input[name="frequency"]:checked');

    let baseRate = 3.5;
    if (plan === 'ULIP') baseRate = 5.2;
    else if (plan === 'Savings') baseRate = 4.0;
    else if (plan === 'Retirement') baseRate = 3.8;
    else if (plan === 'Health Plan') baseRate = 6.5;

    let annual = (sum / 1000) * baseRate;
    if (term <= 10) annual *= 1.3;
    else if (term >= 25) annual *= 0.85;

    let premium = annual;
    if (freq) {
      if (freq.value === 'Monthly') premium = annual / 12;
      else if (freq.value === 'Quarterly') premium = annual / 4;
    }

    premiumValue.textContent = formatCurrency(Math.round(premium));
    return Math.round(premium);
  }

  sumSlider.addEventListener('input', () => {
    sumDisplay.textContent = formatCurrency(parseInt(sumSlider.value));
    updateSliderBg();
    calculatePremium();
  });

  document.getElementById('policyTerm').addEventListener('change', calculatePremium);
  document.getElementById('planType').addEventListener('change', calculatePremium);
  document.querySelectorAll('input[name="frequency"]').forEach(r => r.addEventListener('change', calculatePremium));

  updateSliderBg();

  // ── FORM SUBMISSION → SHOW PAYMENT ──────────────
  const policyForm = document.getElementById('policyForm');
  const paymentSection = document.getElementById('payment-section');

  policyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredFields = policyForm.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      if (!field.value && field.type !== 'radio') { valid = false; field.style.borderColor = '#DC3545'; }
      else if (field.type !== 'radio') { field.style.borderColor = '#d0d8e4'; }
    });
    if (!document.querySelector('input[name="gender"]:checked')) valid = false;
    if (!document.querySelector('input[name="frequency"]:checked')) valid = false;

    if (!valid) {
      showToast('❌', 'Please fill all required fields');
      return;
    }

    document.getElementById('payCustomerName').textContent = document.getElementById('custName').value;
    document.getElementById('payPlanType').textContent = document.getElementById('planType').value;
    const prem = calculatePremium();
    document.getElementById('payAmount').textContent = formatCurrency(prem);

    paymentSection.style.display = 'block';
    paymentSection.scrollIntoView({ behavior: 'smooth' });
    showToast('✅', 'Form validated! Select a payment method.');
  });

  // ── PAYMENT METHOD SELECTION ────────────────────
  const paymentRadios = document.querySelectorAll('input[name="payMethod"]');
  const upiArea = document.getElementById('upiInputArea');
  const cardArea = document.getElementById('cardInputArea');
  const payBtn = document.getElementById('payNowBtn');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      upiArea.style.display = 'none';
      cardArea.style.display = 'none';
      payBtn.disabled = false;

      if (radio.value === 'upi') upiArea.style.display = 'block';
      else if (radio.value === 'card') cardArea.style.display = 'block';
    });
  });

  // ── PAY NOW → SAVE TO MONGODB ───────────────────
  payBtn.addEventListener('click', async () => {
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';

    const selectedPayMethod = document.querySelector('input[name="payMethod"]:checked');
    if (!selectedPayMethod) {
      showToast('❌', 'Please select a payment method');
      payBtn.disabled = false;
      payBtn.textContent = 'Pay Premium →';
      return;
    }

    // Build policy object from form
    const canvas = document.getElementById('signaturePad');
    const signatureData = canvas.toDataURL(); // Capture signature as base64

    // Calculate Maturity Benefit (Simple projection)
    const sumAssured = parseInt(sumSlider.value);
    const tenure = parseInt(document.getElementById('policyTerm').value);
    const maturityBenefit = Math.round(sumAssured * Math.pow(1.06, tenure)); // Mock 6% annual growth

    const policyData = {
      customerName: document.getElementById('custName').value,
      customerDob: document.getElementById('custDob').value,
      customerGender: document.querySelector('input[name="gender"]:checked')?.value || '',
      customerPhone: document.getElementById('custPhone').value,
      customerEmail: document.getElementById('custEmail').value,
      customerAddress: document.getElementById('custAddress').value,
      nomineeName: document.getElementById('nomineeName').value,
      nomineeRelation: document.getElementById('nomineeRel').value,
      planType: document.getElementById('planType').value,
      sumAssured: sumAssured,
      policyTerm: tenure,
      premiumFrequency: document.querySelector('input[name="frequency"]:checked')?.value || '',
      premiumAmount: calculatePremium(),
      policyStartDate: document.getElementById('policyStart').value,
      paymentMethod: selectedPayMethod.value,
      paymentStatus: 'Completed',
      status: 'Active',
      signature: signatureData,
      maturityBenefit: maturityBenefit
    };

    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const response = await fetch(`${API_BASE}/policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      });

      if (!response.ok) throw new Error('Failed to create policy');

      const newPolicy = await response.json();

      // Refresh data from MongoDB
      await loadPolicies();
      await loadStats();

      // Reset form
      payBtn.textContent = 'Pay Premium →';
      payBtn.disabled = false;
      paymentSection.style.display = 'none';
      policyForm.reset();

      // Clear Signature Pad
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      sumDisplay.textContent = '₹25,0,000';
      sumSlider.value = 2500000;
      updateSliderBg();
      premiumValue.textContent = '₹0';

      showToast('🎉', `Policy ${newPolicy.policyId} saved to database!`);
      document.getElementById('my-policies').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      console.error('Error creating policy:', err);
      showToast('❌', 'Error saving policy. Check MongoDB connection.');
      payBtn.textContent = 'Pay Premium →';
      payBtn.disabled = false;
    }
  });

  // ── LOAD POLICIES FROM MONGODB ──────────────────
  async function loadPolicies(search = '') {
    try {
      const url = search
        ? `${API_BASE}/policies?search=${encodeURIComponent(search)}`
        : `${API_BASE}/policies`;

      const response = await fetch(url);
      const policies = await response.json();
      renderPolicies(policies);
    } catch (err) {
      console.error('Error loading policies:', err);
      // Fallback: show empty table
      renderPolicies([]);
    }
  }

  function renderPolicies(policies) {
    const tableBody = document.getElementById('policyTableBody');
    tableBody.innerHTML = policies.map(p => `
      <tr>
        <td><strong style="color:var(--royal-blue)">${p.policyId}</strong></td>
        <td>${p.customerName}</td>
        <td>${p.planType}</td>
        <td>${formatCurrency(p.sumAssured)}</td>
        <td style="font-weight:600">${formatCurrency(p.premiumAmount)}</td>
        <td>${formatDate(p.policyStartDate)}</td>
        <td><span class="status-badge status-${p.status.toLowerCase()}">${p.status}</span></td>
      </tr>
    `).join('');
  }

  // ── LOAD STATS FROM MONGODB ─────────────────────
  async function loadStats() {
    try {
      const response = await fetch(`${API_BASE}/policies/stats`);
      const stats = await response.json();

      document.getElementById('totalPolicies').textContent = stats.total;
      document.getElementById('activePolicies').textContent = stats.active;
      document.getElementById('pendingRenewals').textContent = stats.pending;

      if (stats.totalPremium >= 100000) {
        document.getElementById('totalPremium').textContent = '₹' + (stats.totalPremium / 100000).toFixed(1) + 'L';
      } else {
        document.getElementById('totalPremium').textContent = formatCurrency(stats.totalPremium);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }

  // ── LOAD AGENT PROFILE FROM MONGODB ─────────────
  async function loadAgentProfile() {
    try {
      const response = await fetch(`${API_BASE}/agent`);
      const agent = await response.json();
      if (agent) {
        document.getElementById('agentName').textContent = agent.name || 'Swyam Arora';
        document.getElementById('agentIrda').textContent = agent.irdaNo || '';
        document.getElementById('agentPhone').textContent = agent.phone || '';
        document.getElementById('agentEmail').textContent = agent.email || '';
        document.getElementById('agentBranch').textContent = agent.branch || '';
        // Update avatar initials
        const initials = agent.name ? agent.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SA';
        document.querySelector('.avatar-circle span').textContent = initials;
      }
    } catch (err) {
      console.error('Error loading agent profile:', err);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ── SEARCH (QUERIES MONGODB) ────────────────────
  let searchTimeout;
  document.getElementById('searchPolicies').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadPolicies(e.target.value);
    }, 300); // debounce 300ms
  });

  // ── EXPORT CSV ──────────────────────────────────
  document.getElementById('exportCsv').addEventListener('click', async () => {
    try {
      const response = await fetch(`${API_BASE}/policies`);
      const policies = await response.json();

      const headers = ['Policy ID', 'Customer Name', 'Plan Type', 'Sum Assured', 'Premium', 'Start Date', 'Status'];
      const rows = policies.map(p => [
        p.policyId, p.customerName, p.planType,
        p.sumAssured, p.premiumAmount,
        p.policyStartDate, p.status
      ]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'tata_aia_policies.csv'; a.click();
      URL.revokeObjectURL(url);
      showToast('📥', 'CSV exported from database!');
    } catch (err) {
      showToast('❌', 'Error exporting CSV');
    }
  });

  // ── TOAST ───────────────────────────────────────
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(icon, msg) {
    toastIcon.textContent = icon;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // ── SET DEFAULT DATE ────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('policyStart').value = today;

  // ── LOGIN MODAL LOGIC ───────────────────────────
  const loginModal = document.getElementById('loginModal');
  const openLoginBtn = document.getElementById('openLogin');
  const closeLoginBtn = document.getElementById('closeLogin');
  const loginForm = document.getElementById('loginForm');

  openLoginBtn.addEventListener('click', () => {
    loginModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scroll
  });

  closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('show');
    document.body.style.overflow = '';
  });

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;
    const loginBtn = document.getElementById('loginBtn');

    try {
      loginBtn.textContent = 'Verifying...';
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });

      const data = await response.json();

      if (data.success) {
        showToast('🔐', `Welcome, ${data.user.userId}! Access Granted.`);
        loginModal.classList.remove('show');
        document.body.style.overflow = '';
        loginForm.reset();
      } else {
        showToast('❌', 'Invalid User ID or Password');
      }
    } catch (err) {
      showToast('❌', 'Login failed. Check server connection.');
    } finally {
      loginBtn.textContent = 'Sign In to Portal';
    }
  });

  // ── FORGOT PASSWORD LOGIC ───────────────────────
  document.getElementById('forgotPassword').addEventListener('click', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('loginUser').value;

    if (!userId) {
      showToast('⚠️', 'Please enter your User ID/Email first');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (data.success) {
        showToast('📧', `Reset PIN sent! Check ${data.message.split('to ')[1]}`);
        console.log('Reset Token (Dev Mode):', data.debugToken);
      } else {
        showToast('❌', 'User not found in our records');
      }
    } catch (err) {
      showToast('❌', 'Unable to process request');
    }
  });

  // ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ──────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

});
