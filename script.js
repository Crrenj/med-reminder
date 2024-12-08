import { supabase } from './supabaseClient.js';

const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const appSection = document.getElementById('appSection');

const catalogSelect = document.getElementById('catalogSelect');
const userMedicationNotes = document.getElementById('userMedicationNotes');
const addUserMedicationBtn = document.getElementById('addUserMedicationBtn');

const userMedicationSelect = document.getElementById('userMedicationSelect');
const dose = document.getElementById('dose');
const unit = document.getElementById('unit');
const scheduleTime = document.getElementById('scheduleTime');
const addScheduleBtn = document.getElementById('addScheduleBtn');

const scheduleSelect = document.getElementById('scheduleSelect');
const logTakenBtn = document.getElementById('logTakenBtn');

const historyList = document.getElementById('historyList');

let currentUser = null;

// -------------------- AUTH --------------------

// Signup
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).single();
  if (existingUser) {
    alert('User already exists!');
    return;
  }

  // Insertion de l'utilisateur (mot de passe en clair pour simplifier cet exemple, pas recommandé en prod)
  const { data, error } = await supabase.from('users').insert([{ email, password }]);
  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('Signup successful! Please log in.');
    signupForm.reset();
  }
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).single();
  if (error || !user) {
    alert('Invalid credentials');
  } else {
    currentUser = user;
    alert('Login successful!');
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    appSection.style.display = 'block';
    loadCatalog();
    loadUserMedications();
    loadSchedules();
    loadHistory();
  }
});

// -------------------- FONCTIONS UTILITAIRES --------------------

async function loadCatalog() {
  const { data: catalog } = await supabase.from('medication_catalog').select('*');
  if (catalog) {
    catalogSelect.innerHTML = '';
    catalog.forEach(med => {
      const option = document.createElement('option');
      option.value = med.id;
      option.textContent = med.name;
      catalogSelect.appendChild(option);
    });
  }
}

async function loadUserMedications() {
  const { data: meds } = await supabase
    .from('user_medications')
    .select('id, notes, medication_id (id, name)')
    .eq('user_id', currentUser.id);

  userMedicationSelect.innerHTML = '';
  if (meds) {
    meds.forEach(m => {
      const option = document.createElement('option');
      option.value = m.id;
      option.textContent = m.medication_id.name + (m.notes ? ` (${m.notes})` : '');
      userMedicationSelect.appendChild(option);
    });
  }
}

async function loadSchedules() {
  const userMedIds = await getUserMedicationIds();
  if (userMedIds.length === 0) return;

  const { data: schedules } = await supabase
    .from('schedules')
    .select('id, time, dose, unit, user_medication_id (id, medication_id (name))')
    .in('user_medication_id', userMedIds);

  scheduleSelect.innerHTML = '';
  if (schedules) {
    schedules.forEach(sch => {
      const option = document.createElement('option');
      option.value = sch.id;
      option.textContent = `${sch.user_medication_id.medication_id.name} at ${sch.time} [${sch.dose}${sch.unit}]`;
      scheduleSelect.appendChild(option);
    });
  }
}

async function getUserMedicationIds() {
  const { data: meds } = await supabase.from('user_medications').select('id').eq('user_id', currentUser.id);
  return meds ? meds.map(m => m.id) : [];
}

async function loadHistory() {
  const { data: logs } = await supabase
    .from('logs')
    .select('id, taken_at, status, schedule_id (time, user_medication_id (medication_id (name)))')
    .order('taken_at', { ascending: false });

  historyList.innerHTML = '';
  if (logs) {
    logs.forEach(log => {
      const li = document.createElement('li');
      const medName = log.schedule_id.user_medication_id.medication_id.name;
      li.textContent = `[${log.status}] ${medName} taken at ${log.taken_at}`;
      historyList.appendChild(li);
    });
  }
}

// -------------------- ACTIONS --------------------

// Ajouter un médicament à l'utilisateur
addUserMedicationBtn.addEventListener('click', async () => {
  const medication_id = catalogSelect.value;
  const notesVal = userMedicationNotes.value;

  const { data, error } = await supabase.from('user_medications').insert([
    { user_id: currentUser.id, medication_id, notes: notesVal }
  ]);

  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('Medication added to your list!');
    userMedicationNotes.value = '';
    loadUserMedications();
  }
});

// Ajouter un horaire
addScheduleBtn.addEventListener('click', async () => {
  const user_medication_id = userMedicationSelect.value;
  const d = parseFloat(dose.value);
  const u = unit.value;
  const t = scheduleTime.value;

  const { data, error } = await supabase.from('schedules').insert([
    { user_medication_id, dose: d, unit: u, time: t }
  ]);

  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('Schedule added!');
    dose.value = '';
    unit.value = '';
    scheduleTime.value = '';
    loadSchedules();
  }
});

// Log a medication as taken
logTakenBtn.addEventListener('click', async () => {
  const schedule_id = scheduleSelect.value;
  const now = new Date().toISOString();

  const { data, error } = await supabase.from('logs').insert([
    { schedule_id, taken_at: now, status: 'taken' }
  ]);

  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('Medication logged as taken!');
    loadHistory();
  }
});
