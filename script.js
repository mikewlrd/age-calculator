// === Utilities ===
function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}
function toInputDateString(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
// === DOM refs ===
const dobInput  = document.getElementById('dob');
const calcBtn   = document.getElementById('calcBtn');
const resetBtn  = document.getElementById('resetBtn');
const errorEl   = document.getElementById('error');
const yearsEl   = document.getElementById('years');
const monthsEl  = document.getElementById('months');
const daysEl    = document.getElementById('days');
const summaryEl = document.getElementById('summary');

// === Init ===
document.addEventListener('DOMContentLoaded', () => {
  // Don’t allow future dates
  dobInput.setAttribute('max', toInputDateString(new Date()));
  // Pressing Enter in the date input runs calculation
  dobInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); runCalculation(); }
  });
});
calcBtn.addEventListener('click', runCalculation);
resetBtn.addEventListener('click', clearAll);

// === Core logic ===
function runCalculation() {
  clearError();
  const dobStr = dobInput.value;
  if (!dobStr) return setError('Please pick your date of birth.');

  const dob = new Date(dobStr);
  const today = new Date();

  if (isNaN(dob.getTime())) return setError("That date doesn't look valid. Try again.");
  if (dob > today) return setError('Date of birth cannot be in the future.');

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    const prevMonthIndex = (today.getMonth() - 1 + 12) % 12;
    const prevMonthYear = prevMonthIndex === 11 ? today.getFullYear() - 1 : today.getFullYear();
    days += daysInMonth(prevMonthYear, prevMonthIndex);
    months -= 1;
  }
  if (months < 0) { months += 12; years -= 1; }

  yearsEl.textContent = years;
  monthsEl.textContent = months;
  daysEl.textContent = days;

  const nextBday = getNextBirthday(dob, today);
  const daysUntil = Math.ceil((nextBday - stripTime(today)) / (1000*60*60*24));
  summaryEl.textContent = `You are ${years} years, ${months} months and ${days} days old. Your next birthday is in ${daysUntil} day(s) on ${nextBday.toDateString()}.`;
}

function getNextBirthday(dob, today) {
  const y = today.getFullYear();
  let next = new Date(y, dob.getMonth(), dob.getDate());
  // Handle Feb 29 → Feb 28 on non-leap years
  if (dob.getMonth() === 1 && dob.getDate() === 29 && isNaN(next.getTime())) next = new Date(y, 1, 28);
  if (stripTime(next) < stripTime(today)) {
    next = new Date(y + 1, dob.getMonth(), dob.getDate());
    if (dob.getMonth() === 1 && dob.getDate() === 29 && isNaN(next.getTime())) next = new Date(y + 1, 1, 28);
  }
  return stripTime(next);
}
function stripTime(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

// === Error/reset helpers ===
function setError(msg){ errorEl.textContent = msg; }
function clearError(){ errorEl.textContent = ''; }
function clearAll(){
  clearError();
  yearsEl.textContent = monthsEl.textContent = daysEl.textContent = '--';
  summaryEl.textContent = '';
}
