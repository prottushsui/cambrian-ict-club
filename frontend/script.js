async function submitVote(pollName) {
  const selected = document.querySelector(`input[name="${pollName}"]:checked`);
  const campusIdInput = document.getElementById('campus-id') || document.getElementById('campus-id2');
  const campusId = campusIdInput?.value.trim();

  if (!selected) {
    showMessage('Please select an option', 'error');
    return;
  }
  if (!campusId) {
    showMessage('Please enter your Campus ID', 'error');
    return;
  }

  const payload = {
    pollTitle: pollName,
    optionIndex: selected.value
  };

  try {
    const res = await fetch('http://localhost:5000/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      showMessage('Vote submitted successfully!', 'success');
      setTimeout(() => location.reload(), 1500);
    } else {
      showMessage(data.message, 'error');
    }
  } catch (err) {
    showMessage('Network error. Please try again.', 'error');
  }
}

// Reuse this for better UX
function showMessage(text, type = 'success') {
  const msg = document.getElementById('message');
  msg.innerText = text;
  msg.className = `p-2 rounded mt-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`;
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 3000);
}
