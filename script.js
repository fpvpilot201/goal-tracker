let goals = JSON.parse(localStorage.getItem('goals')) || [];

document.getElementById('goalForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('goalName').value;
  const goal = parseFloat(document.getElementById('goal').value);
  const current = parseFloat(document.getElementById('current').value);

  if (!name || goal <= 0 || current < 0) return;

  const existing = goals.find(g => g.name === name);
  if (existing) {
    existing.goal = goal;
    existing.current = current;
  } else {
    goals.push({ name, goal, current });
  }

  localStorage.setItem('goals', JSON.stringify(goals));
  renderGoals();
  updateChart();
});

function renderGoals() {
  const container = document.getElementById('goals');
  container.innerHTML = '';
  goals.forEach(g => {
    const percent = Math.min((g.current / g.goal) * 100, 100).toFixed(2);
    const remaining = Math.max(g.goal - g.current, 0).toFixed(2);
    container.innerHTML += `
      <div>
        <h3>${g.name}</h3>
        <p>Progress: ${percent}% | Remaining: $${remaining}</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>
      </div>`;
  });
}

function exportToCSV() {
  let csv = "Goal Name,Target,Current,Percent,Remaining\n";
  goals.forEach(g => {
    const percent = ((g.current / g.goal) * 100).toFixed(2);
    const remaining = Math.max(g.goal - g.current, 0).toFixed(2);
    csv += `${g.name},${g.goal},${g.current},${percent}%,${remaining}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "goal_data.csv";
  link.click();
}

function updateChart() {
  const ctx = document.getElementById('goalChart').getContext('2d');
  if (window.chartInstance) window.chartInstance.destroy();
  window.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: goals.map(g => g.name),
      datasets: [{
        label: '% Complete',
        data: goals.map(g => ((g.current / g.goal) * 100).toFixed(2)),
        backgroundColor: '#00ff88'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

renderGoals();
updateChart();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceWorker.js');
}
