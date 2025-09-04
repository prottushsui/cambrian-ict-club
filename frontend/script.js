// ====== Password Toggle (Login Page) ======
document.addEventListener('DOMContentLoaded', function () {
  const togglePassword = document.getElementById('toggle-password');
  if (togglePassword) {
    togglePassword.addEventListener('click', function () {
      const pwd = document.getElementById('password');
      const icon = this.querySelector('i');
      pwd.type = pwd.type === 'password' ? 'text' : 'password';
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }

  // ====== Password Strength Meter (Login) ======
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      const pwd = this.value;
      let strength = 0;
      if (pwd.length >= 8) strength++;
      if (pwd.match(/[a-z]/)) strength++;
      if (pwd.match(/[A-Z]/)) strength++;
      if (pwd.match(/[0-9]/)) strength++;
      if (pwd.match(/[^A-Za-z0-9]/)) strength++;

      const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-green-500', 'bg-green-600'];
      const texts = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
      const fill = document.getElementById('strength-fill');
      const strengthText = document.getElementById('strength-text');
      if (fill && strengthText) {
        fill.className = `h-2 rounded-full transition-all duration-300 ${colors[strength]}`;
        fill.style.width = `${strength * 25}%`;
        strengthText.innerText = texts[strength];
        strengthText.className = `text-xs ${colors[strength].replace('bg-', 'text-')}`;
      }
    });
  }
});

// ====== Show Section (Dashboard Navigation) ======
function showSection(id) {
  document.querySelectorAll('.flex-1 > div[id$="-section"]').forEach(el => {
    el.classList.add('hidden');
  });
  const section = document.getElementById(id);
  if (section) {
    section.classList.remove('hidden');
    document.getElementById('page-title').innerText = id.replace('-section', '').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
}

// ====== Login Function ======
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');

  if (!email || !password) {
    message.innerText = 'Please enter both email and password';
    message.className = 'bg-red-500 text-white p-2 rounded mt-4';
    message.classList.remove('hidden');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showDashboard(data.user);
    } else {
      message.innerText = data.message || 'Login failed';
      message.className = 'bg-red-500 text-white p-2 rounded mt-4';
      message.classList.remove('hidden');
    }
  } catch (err) {
    message.innerText = 'Network error. Check if backend is running.';
    message.className = 'bg-red-500 text-white p-2 rounded mt-4';
    message.classList.remove('hidden');
  }
}

// ====== Show Dashboard ======
function showDashboard(user) {
  document.getElementById('login-container').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('user-name').innerText = user.name;
  document.getElementById('user-greeting').innerText = user.name;
  showSection('dashboard-content');
}

// ====== Logout Function ======
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login-container').classList.remove('hidden');
}

// ====== Mobile Menu Toggle ======
document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const sidebar = document.getElementById('sidebar');
  if (mobileMenuButton && sidebar) {
    mobileMenuButton.addEventListener('click', function () {
      sidebar.classList.toggle('-translate-x-full');
    });
  }
});

// ====== Submit Vote Function ======
async function submitVote(pollName) {
  const selected = document.querySelector(`input[name="${pollName}"]:checked`);
  const campusIdInput = document.getElementById(`campus-id${pollName === 'workshop' ? '2' : ''}`);
  const campusId = campusIdInput?.value.trim();

  if (!selected) {
    alert('Please select an option');
    return;
  }
  if (!campusId) {
    alert('Please enter your Campus ID');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ pollTitle: pollName, optionIndex: selected.value })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Vote submitted successfully!');
      location.reload();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Network error. Please try again.');
  }
}

// ====== On Page Load ======
window.onload = function () {
  const user = localStorage.getItem('user');
  if (user) {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    const userData = JSON.parse(user);
    document.getElementById('user-name').innerText = userData.name;
    document.getElementById('user-greeting').innerText = userData.name;
    showSection('dashboard-content');
  }

  // Hide loading screen
  setTimeout(() => {
    const loading = document.getElementById('loading-screen');
    if (loading) loading.classList.add('hidden');
  }, 1000);
};
