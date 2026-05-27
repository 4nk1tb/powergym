/**
 * PowerGym PWA — Core Logic
 * Highly modular vanilla JavaScript implementation for fitness tracking.
 * Includes synthetic audio, visual SVG charts, routine editor, and local storage state.
 */

(function () {
  // ==========================================================================
  // 1. Datos de Rutina por Defecto (Plan de Fuerza e Hipertrofia de 6 semanas)
  // ==========================================================================
  const defaultRoutineData = {
    days: [
      {
        title: "Lunes",
        muscle: "Empuje (Pecho/Tríceps)",
        exercises: [
          { id: "press_banca", name: "Press de Banca con Barra", sets: 3, reps: "5-8", rir: "RIR 2", rest: "2-3 min", timer: 2.5, note: "Foco en fuerza. Mantener retracción escapular." },
          { id: "press_inclinado_manc", name: "Press Inclinado con Mancuernas", sets: 3, reps: "8-12", rir: "RIR 1-2", rest: "2 min", timer: 2.0 },
          { id: "press_maquina", name: "Press en Máquina Convergente", sets: 2, reps: "10-12", rir: "RIR 1", rest: "90 seg", timer: 1.5 },
          { id: "aperturas_cable", name: "Aperturas en Poleas", sets: 2, reps: "12-15", rir: "RIR 1", rest: "90 seg", timer: 1.5 },
          { id: "laterales_maint", name: "Elevaciones Laterales (Polea)", sets: 2, reps: "12-20", rir: "RIR 1", rest: "90 seg", timer: 1.5 },
          { id: "gemelos_pie", name: "Gemelos de Pie (Pausa abajo)", sets: 3, reps: "8-12", rir: "RIR 1", rest: "90 seg", timer: 1.5, note: "Pausa de 2 segundos abajo estirando el sóleo." }
        ]
      },
      {
        title: "Martes",
        muscle: "Tirón (Dorsal/Bíceps)",
        exercises: [
          { id: "dominadas", name: "Dominadas Lastradas", sets: 4, reps: "6-8", rir: "RIR 1-2", rest: "2-3 min", timer: 2.5 },
          { id: "jalon_neutro", name: "Jalón al Pecho Agarre Neutro", sets: 3, reps: "8-12", rir: "RIR 1-2", rest: "2 min", timer: 2.0 },
          { id: "pullover_polea", name: "Pullover en Polea Alta (Brazos Rectos)", sets: 2, reps: "12-15", rir: "RIR 1", rest: "90 seg", timer: 1.5 },
          { id: "face_pull", name: "Face Pull (Hombro Posterior)", sets: 2, reps: "15-20", rir: "RIR 1", rest: "90 seg", timer: 1.5 },
          { id: "curl_barra", name: "Curl de Bíceps con Barra", sets: 3, reps: "6-10", rir: "RIR 1-2", rest: "90 seg", timer: 1.5 },
          { id: "gemelos_sentado", name: "Gemelos Sentado (Sóleo)", sets: 4, reps: "12-20", rir: "RIR 1", rest: "90 seg", timer: 1.5 }
        ]
      },
      {
        title: "Miércoles",
        muscle: "Pierna (Énfasis Quads)",
        exercises: [
          { id: "prep_rodilla", name: "Preparación de Rodilla (Movilidad)", sets: 0, reps: "6-8 min", rir: "N/A", rest: "N/A", timer: 0, note: "TKE banda 2x15 + Isométricos extensión 2x20s + Trineo atrás." },
          { id: "prensa_45", name: "Prensa de Piernas 45°", sets: 4, reps: "10-12", rir: "RIR 1-2", rest: "2-3 min", timer: 2.5, note: "Pies medios-bajos. ROM completo sin dolor de cadera." },
          { id: "extension_iso", name: "Extensiones de Rodilla (Con Isometría)", sets: 3, reps: "12-15", rir: "RIR 1", rest: "90 seg", timer: 1.5, note: "Isométrico de 2 segundos arriba en cada rep." },
          { id: "rdl_x", name: "Peso Muerto Rumano con Mancuernas", sets: 3, reps: "6-10", rir: "RIR 2", rest: "2-3 min", timer: 2.5, note: "Bisagra de cadera. Foco en glúteos e isquios." },
          { id: "hip_thrust", name: "Hip Thrust con Barra", sets: 3, reps: "6-10", rir: "RIR 1-2", rest: "2 min", timer: 2.0 },
          { id: "curl_femoral", name: "Curl Femoral Tumbado", sets: 3, reps: "8-12", rir: "RIR 1", rest: "90 seg", timer: 1.5 }
        ]
      },
      {
        title: "Jueves",
        muscle: "Push (Hombros/Tríceps)",
        exercises: [
          { id: "militar_manc", name: "Press Militar Sentado con Mancuernas", sets: 3, reps: "6-10", rir: "RIR 2", rest: "2 min", timer: 2.0 },
          { id: "press_cerrado_smith", name: "Press de Banca Agarre Cerrado Multipower", sets: 2, reps: "8-12", rir: "RIR 1-2", rest: "2 min", timer: 2.0, note: "Codos pegados al torso." },
          { id: "laterales_j", name: "Elevaciones Laterales Pesadas", sets: 2, reps: "12-20", rir: "RIR 1", rest: "90 seg", timer: 1.5 },
          { id: "peck_deck", name: "Pec Deck (Pecho)", sets: 2, reps: "10-15", rir: "RIR 1", rest: "90 seg", timer: 1.5 },
          { id: "triceps_ez", name: "Tríceps Copa EZ (Estiramiento)", sets: 2, reps: "10-12", rir: "RIR 1", rest: "90 seg", timer: 1.5 }
        ]
      },
      {
        title: "Viernes",
        muscle: "Pull (Dorsal Espesor/Espalda)",
        exercises: [
          { id: "remo_t", name: "Remo en T apoyando Pecho", sets: 4, reps: "6-10", rir: "RIR 1-2", rest: "2-3 min", timer: 2.5 },
          { id: "remo_cable_neutro", name: "Remo en Polea Agarre Neutro Angosto", sets: 3, reps: "8-12", rir: "RIR 1-2", rest: "2 min", timer: 2.0 },
          { id: "reverse_fly", name: "Pájaros en Máquina (Deltoide Posterior)", sets: 2, reps: "15-20", rir: "RIR 1", rest: "90 seg", timer: 1.5 },
          { id: "curl_martillo", name: "Curl Martillo Mancuernas (Braquial)", sets: 2, reps: "8-12", rir: "RIR 1", rest: "90 seg", timer: 1.5 },
          { id: "curl_inclinado", name: "Curl Inclinado Mancuernas (Bíceps)", sets: 2, reps: "10-15", rir: "RIR 1", rest: "90 seg", timer: 1.5 }
        ]
      },
      {
        title: "Sábado",
        muscle: "Pierna Completa (Fuerza/Volumen)",
        exercises: [
          { id: "hack_squat", name: "Sentadilla Hack o Péndulo", sets: 4, reps: "8-12", rir: "RIR 1-2", rest: "2-3 min", timer: 2.5 },
          { id: "prensa_pies_bajos", name: "Prensa con Pies Bajos (Aislamiento Quad)", sets: 3, reps: "10-15", rir: "RIR 1-2", rest: "2-3 min", timer: 2.5 },
          { id: "extension_15", name: "Extensión de Rodilla 1.5 Reps", sets: 3, reps: "12-15", rir: "RIR 1", rest: "90 seg", timer: 1.5, note: "Media repetición abajo + repetición completa = 1 rep." },
          { id: "curl_femoral_sentado", name: "Curl Femoral Sentado", sets: 3, reps: "10-15", rir: "RIR 1", rest: "90 seg", timer: 1.5 }
        ]
      },
      {
        title: "Domingo",
        muscle: "Descanso Activo / Cardio",
        exercises: [
          { id: "descanso_activo", name: "Descanso Activo", sets: 0, reps: "Paseo 30-45m", rir: "N/A", rest: "N/A", timer: 0, note: "Caminar, estiramientos suaves o movilidad ligera. Recupera bien." }
        ]
      }
    ]
  };

  // Keys de LocalStorage
  const STATE_KEY = "powergym-state-v8";
  const ROUTINE_KEY = "powergym-custom-routine-v8";

  // ==========================================================================
  // 2. Estado del Programa y Elementos DOM
  // ==========================================================================
  let state = {
    sets: {},        // Formato: { "dayIndex:exId": [false, false, false] }
    progress: {},    // Formato: { "exId": [ { date, weight, reps, setsData: [{w, r}], volume, 1rm, note } ] }
    lastOpenedDay: 0,
    week: "1",
    notes: ""
  };

  let routineData = null;

  // DOM Elements cache
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  let dom = {};

  function initDOM() {
    dom = {
      dayTabs: $("#dayTabsContainer"),
      exercises: $("#exercisesContainer"),
      selectWeek: $("#selectWeek"),
      weekTipText: $("#weekTipText"),
      sessionNotes: $("#sessionNotes"),
      weekDisplay: $("#weekDisplay"),
      
      // Naves
      bottomNav: $("#bottomNav"),
      headerBranding: $("#headerBrandingBtn"),
      btnProgressDesktop: $("#btnGoToProgressDesktop"),
      btnSettingsDesktop: $("#btnGoToSettingsDesktop"),
      btnResetDayDesktop: $("#btnResetDayDesktop"),
      
      // Backup
      btnExportJSON: $("#btnExportJSON"),
      btnImportJSON: $("#btnImportJSON"),
      inputImportFile: $("#inputImportFile"),
      
      // Timer Flotante
      floatingTimer: $("#floatingTimer"),
      timerDisplay: $("#timerDisplay"),
      timerRingCircle: $("#timerRingCircle"),
      timerExerciseName: $("#timerExerciseName"),
      timerBtnAction: $("#timerBtnAction"),
      timerBtnAdd15: $("#timerBtnAdd15"),
      timerBtnSub15: $("#timerBtnSub15"),
      timerBtnClose: $("#timerBtnClose"),
      
      // Modal
      modalOverlay: $("#modalOverlay"),
      modalTitle: $("#modalTitle"),
      modalSubtitle: $("#modalSubtitle"),
      modalSetsGrid: $("#modalSetsGrid"),
      modalExerciseNote: $("#modalExerciseNote"),
      modalBtnCancel: $("#modalBtnCancel"),
      modalBtnSave: $("#modalBtnSave"),
      modalCloseBtn: $("#modalCloseBtn"),
      
      // Opciones
      toggleFastLogging: $("#toggleFastLogging"),
      
      // Toast
      toast: $("#appNotification")
    };
  }

  // Variables para Temporizador Global
  let activeTimer = null; // { iv, left, total, running, exId, exName }
  let audioCtx = null;    // Lazy Web Audio API context

  // ==========================================================================
  // 3. Inicialización del Estado y Almacenamiento
  // ==========================================================================
  function normalizeRoutineData(data) {
    if (!data || !data.days) return;
    data.days.forEach(day => {
      if (!day.muscle) {
        if (day.title.includes("•")) {
          const parts = day.title.split("•");
          day.muscle = parts[1].trim();
          day.title = parts[0].trim();
        } else {
          day.muscle = "Fuerza / Hipertrofia";
        }
      }
    });
  }

  function loadState() {
    // Intentar migrar datos desde la PWA anterior del usuario
    const oldRoutine = localStorage.getItem('customRoutineData');
    const oldState = localStorage.getItem('rutina-fuerza-elegante-v7-final');

    if (oldRoutine && !localStorage.getItem(ROUTINE_KEY)) {
      console.log("Migrando rutina de la PWA anterior...");
      localStorage.setItem(ROUTINE_KEY, oldRoutine);
    }
    
    if (oldState && !localStorage.getItem(STATE_KEY)) {
      console.log("Migrando progreso y estado de la PWA anterior...");
      try {
        const parsedOld = JSON.parse(oldState);
        if (parsedOld.progress) {
          Object.keys(parsedOld.progress).forEach(exId => {
            parsedOld.progress[exId] = parsedOld.progress[exId].map(record => {
              if (!record.setsData && record.weight) {
                // Rellenar setsData compatible con su peso registrado en 3 series
                record.setsData = Array(3).fill(null).map(() => ({ w: record.weight, r: 8 }));
                record.volume = record.weight * 3 * 8;
                record.max1RM = Math.round(record.weight * (1 + 8/30) * 10) / 10;
              }
              return record;
            });
          });
        }
        localStorage.setItem(STATE_KEY, JSON.stringify(parsedOld));
      } catch (e) {
        console.error("Fallo al migrar el estado antiguo:", e);
      }
    }

    const savedState = localStorage.getItem(STATE_KEY);
    if (savedState) {
      try {
        state = JSON.parse(savedState);
        state.sets = state.sets || {};
        state.progress = state.progress || {};
        state.week = state.week || "1";
        state.notes = state.notes || "";
        state.fastLogging = !!state.fastLogging;
      } catch (e) {
        console.error("Error cargando el estado:", e);
      }
    }

    const savedRoutine = localStorage.getItem(ROUTINE_KEY);
    if (savedRoutine) {
      try {
        routineData = JSON.parse(savedRoutine);
        if (!routineData.days || !Array.isArray(routineData.days)) {
          throw new Error("Formato de rutina personalizado inválido");
        }
      } catch (e) {
        console.error("Error cargando rutina personalizada:", e);
        routineData = defaultRoutineData;
      }
    } else {
      routineData = defaultRoutineData;
    }

    // Normalizar la estructura de la rutina si es necesario
    if (routineData) {
      normalizeRoutineData(routineData);
    }
  }

  function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function saveRoutine() {
    localStorage.setItem(ROUTINE_KEY, JSON.stringify(routineData));
  }

  // ==========================================================================
  // 4. Temporizador de Descanso con Sonido Sintetizado y Vibración (Offline)
  // ==========================================================================
  
  // Pitido sintetizado offline para avisar al acabar
  function playSynthesizedBeep() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const playBeep = (freq, duration, delay) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        }, delay);
      };

      // Tono doble de alta frecuencia (moderno de gimnasio)
      playBeep(880, 0.2, 0);
      playBeep(880, 0.25, 250);
      playBeep(1200, 0.35, 500);

    } catch (e) {
      console.warn("Fallo al reproducir audio:", e);
    }
  }

  function triggerVibration() {
    if ("vibrate" in navigator) {
      // Vibración triple (120ms vibración, 60ms pausa)
      navigator.vibrate([120, 60, 120, 60, 200]);
    }
  }

  function renderTimerRing(left, total) {
    const r = 26;
    const circ = 2 * Math.PI * r;
    const percentage = total > 0 ? (left / total) : 0;
    const offset = circ - (percentage * circ);
    dom.timerRingCircle.style.strokeDashoffset = offset;
    
    const minutes = Math.floor(left / 60);
    const seconds = Math.floor(left % 60);
    dom.timerDisplay.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  }

  // Mantener viva la app en segundo plano reproduciendo un búfer de silencio
  let silenceSource = null;

  function startBackgroundSilence() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      // Crear un búfer de silencio de 1 segundo a la tasa de muestreo nativa
      const bufferSize = audioCtx.sampleRate;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = 0; // Llenar con silencio (ceros)
      }
      
      silenceSource = audioCtx.createBufferSource();
      silenceSource.buffer = buffer;
      silenceSource.loop = true;
      silenceSource.connect(audioCtx.destination);
      silenceSource.start();
      console.log("PowerGym: Silencio activado para segundo plano.");
    } catch (e) {
      console.warn("Fallo al iniciar silencio en segundo plano:", e);
    }
  }

  function stopBackgroundSilence() {
    if (silenceSource) {
      try {
        silenceSource.stop();
        silenceSource.disconnect();
      } catch (e) {}
      silenceSource = null;
      console.log("PowerGym: Silencio desactivado.");
    }
  }

  function startGlobalTimer(minutes, exId, exName) {
    stopGlobalTimer(false);

    // Solicitar permiso de notificaciones de forma nativa al iniciar el primer descanso
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const totalSeconds = Math.round(minutes * 60);
    activeTimer = {
      left: totalSeconds,
      total: totalSeconds,
      running: true,
      exId: exId,
      exName: exName,
      iv: null
    };

    dom.timerExerciseName.textContent = exName;
    dom.floatingTimer.classList.add("active");
    dom.timerBtnAction.textContent = "⏸ Pausa";

    // Marcar timer de ejercicio específico si está renderizado
    const timerTrig = $(`.exercise-timer-trigger[data-ex-id="${exId}"]`);
    if (timerTrig) {
      timerTrig.classList.add("running");
    }

    renderTimerRing(activeTimer.left, activeTimer.total);
    
    // Activar bucle de silencio para evitar suspensión del navegador
    startBackgroundSilence();
    
    activeTimer.iv = setInterval(() => {
      if (activeTimer && activeTimer.running) {
        activeTimer.left--;
        renderTimerRing(activeTimer.left, activeTimer.total);
        
        // Actualizar título de la ventana
        const minStr = String(Math.floor(activeTimer.left/60)).padStart(2,'0');
        const secStr = String(Math.floor(activeTimer.left%60)).padStart(2,'0');
        document.title = `⏱️ ${minStr}:${secStr} | PowerGym`;

        // Sincronizar texto del botón de la tarjeta
        const activeCardTimer = $(`.exercise-timer-trigger[data-ex-id="${exId}"] b`);
        if (activeCardTimer) {
          activeCardTimer.textContent = `${minStr}:${secStr}`;
        }

        if (activeTimer.left <= 0) {
          playSynthesizedBeep();
          triggerVibration();
          
          // Lanzar notificación nativa PWA para pantalla de bloqueo
          if ("Notification" in window && Notification.permission === "granted") {
            const notifTitle = "⏱️ ¡Descanso Terminado!";
            const notifOptions = {
              body: `Es hora de tu siguiente serie de: ${exName}`,
              icon: "https://4nk1tb.github.io/rutina-cliente1/img/logo.png",
              vibrate: [200, 100, 200],
              tag: "timer-done",
              renotify: true
            };
            
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(notifTitle, notifOptions);
              });
            } else {
              new Notification(notifTitle, notifOptions);
            }
          }

          showNotification(`⏱️ ¡Descanso de "${exName}" terminado! A por la serie.`);
          stopGlobalTimer(true);
        }
      }
    }, 1000);
  }

  function stopGlobalTimer(hidePanel = true) {
    // Apagar silencio de fondo
    stopBackgroundSilence();

    if (activeTimer) {
      clearInterval(activeTimer.iv);
      const prevExId = activeTimer.exId;
      
      // Limpiar estados de las tarjetas
      const timerTrig = $(`.exercise-timer-trigger[data-ex-id="${prevExId}"]`);
      if (timerTrig) {
        timerTrig.classList.remove("running");
        const baseTimerMin = parseFloat(timerTrig.dataset.baseMin || "2");
        const minutes = Math.floor(baseTimerMin);
        const seconds = Math.round((baseTimerMin - minutes) * 60);
        const textBtn = $("b", timerTrig);
        if (textBtn) {
          textBtn.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        }
      }

      activeTimer = null;
    }
    
    document.title = "PowerGym — Rutina y Progreso de Fuerza";
    if (hidePanel) {
      dom.floatingTimer.classList.remove("active");
    }
  }

  function toggleTimerPause() {
    if (activeTimer) {
      activeTimer.running = !activeTimer.running;
      dom.timerBtnAction.textContent = activeTimer.running ? "⏸ Pausa" : "▶ Reanudar";
      
      if (activeTimer.running) {
        startBackgroundSilence();
        showNotification("Temporizador reanudado");
      } else {
        stopBackgroundSilence();
        showNotification("Temporizador en pausa");
      }
    }
  }

  function adjustTimer(seconds) {
    if (activeTimer) {
      activeTimer.left = Math.max(0, activeTimer.left + seconds);
      // Si aumentamos tiempo y es mayor al total inicial, actualizamos el total para que el círculo no desborde
      if (activeTimer.left > activeTimer.total) {
        activeTimer.total = activeTimer.left;
      }
      renderTimerRing(activeTimer.left, activeTimer.total);
      showNotification((seconds > 0 ? "+" : "") + seconds + " segundos de descanso");
    }
  }

  // ==========================================================================
  // 5. Renderizado Dinámico de la Rutina (Página 1)
  // ==========================================================================
  function renderDayTabs() {
    dom.dayTabs.innerHTML = "";
    routineData.days.forEach((day, index) => {
      const tab = document.createElement("button");
      tab.className = `day-tab ${index === state.lastOpenedDay ? "active" : ""}`;
      tab.dataset.dayIndex = index;
      
      tab.innerHTML = `
        <span class="tab-day-name">${day.title}</span>
        <span class="tab-muscle">${day.muscle.split(" ")[0]}</span>
        <div class="tab-progress-bar" style="width: ${calculateDayProgress(index)}%"></div>
      `;
      dom.dayTabs.appendChild(tab);
    });
  }

  function calculateDayProgress(dayIndex) {
    const day = routineData.days[dayIndex];
    if (!day || !day.exercises) return 0;
    
    const trackableExercises = day.exercises.filter(ex => ex.sets > 0);
    if (trackableExercises.length === 0) return 100; // Días de descanso al 100%

    let totalSets = 0;
    let completedSets = 0;

    trackableExercises.forEach(ex => {
      const exId = `${dayIndex}:${ex.id}`;
      const setStates = state.sets[exId];
      if (setStates) {
        totalSets += setStates.length;
        completedSets += setStates.filter(s => s).length;
      } else {
        totalSets += ex.sets;
      }
    });

    return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  }

  function updateActiveDayProgress() {
    const activeTab = $(`.day-tab[data-day-index="${state.lastOpenedDay}"]`);
    if (activeTab) {
      const bar = $(".tab-progress-bar", activeTab);
      const percentage = calculateDayProgress(state.lastOpenedDay);
      if (bar) bar.style.width = `${percentage}%`;
    }
  }

  function renderActiveDayRoutine() {
    const dayIndex = state.lastOpenedDay;
    const day = routineData.days[dayIndex];
    
    dom.exercises.innerHTML = "";

    if (!day) return;

    // Encabezado del entrenamiento con botón Reset integrado para móviles
    const titleRow = document.createElement("div");
    titleRow.className = "workout-day-title-row";
    titleRow.style.display = "flex";
    titleRow.style.justifyContent = "space-between";
    titleRow.style.alignItems = "center";
    titleRow.style.width = "100%";
    titleRow.style.marginBottom = "1rem";
    
    titleRow.innerHTML = `
      <div style="flex: 1; min-width: 0; padding-right: 0.5rem;">
        <h2 style="font-size: 1.15rem; font-weight: 800; letter-spacing: -0.3px; white-space: normal; line-height: 1.2;">${day.title}</h2>
        <span style="color: var(--ink-muted); font-size: 0.78rem; font-weight: 500; display: block; margin-top: 2px;">Enfoque: <b>${day.muscle}</b></span>
      </div>
      <button class="btn btn-danger btn-xs" id="btnResetDayMobile" style="font-size: 0.72rem; padding: 0.35rem 0.65rem; flex-shrink: 0;">
        <svg viewBox="0 0 24 24" style="width:13px; height:13px; fill:currentColor; margin-right:2px;"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        <span>Reset</span>
      </button>
    `;
    dom.exercises.appendChild(titleRow);

    // Evento del botón Reset en móvil
    const btnResetMobile = titleRow.querySelector("#btnResetDayMobile");
    if (btnResetMobile) {
      btnResetMobile.onclick = resetCurrentDay;
    }

    if (day.exercises.length === 0) {
      dom.exercises.innerHTML += `<div class="no-data-view">No hay ejercicios agregados a este día. Ve a Ajustes para añadir uno.</div>`;
      return;
    }

    day.exercises.forEach((ex) => {
      const exId = `${dayIndex}:${ex.id}`;
      const setsArr = state.sets[exId] || Array(ex.sets).fill(false);
      
      // Si no tenemos inicializadas las series del ejercicio en el estado, las inicializamos
      if (ex.sets > 0 && (!state.sets[exId] || state.sets[exId].length !== ex.sets)) {
        state.sets[exId] = Array(ex.sets).fill(false);
        saveState();
      }

      const isCompleted = ex.sets > 0 && state.sets[exId] && state.sets[exId].every(s => s);

      const card = document.createElement("article");
      card.className = `exercise-card ${isCompleted ? "all-done-exercise" : ""}`;
      card.dataset.exId = exId;
      card.dataset.name = ex.name;

      // Badges
      let badgesHTML = "";
      if (ex.sets > 0) {
        badgesHTML += `<span class="badge badge-reps">${ex.sets}×${ex.reps}</span>`;
        badgesHTML += `<span class="badge badge-rir">${ex.rir}</span>`;
        badgesHTML += `<span class="badge badge-rest">⏳ ${ex.rest}</span>`;
      } else {
        badgesHTML += `<span class="badge badge-dark">Cardio / Descanso</span>`;
      }

      // Timer duration formatting
      const timerMinutes = ex.timer || 1.5;
      const fmtMins = Math.floor(timerMinutes);
      const fmtSecs = Math.round((timerMinutes - fmtMins) * 60);
      const timerDisplayStr = `${String(fmtMins).padStart(2,'0')}:${String(fmtSecs).padStart(2,'0')}`;

      // Notas
      const noteHTML = ex.note ? `<div class="exercise-note">${ex.note}</div>` : "";

      // Contenido de Series
      let setsHTML = "";
      if (ex.sets > 0) {
        setsHTML += `<div class="sets-grid">`;
        setsArr.forEach((val, i) => {
          setsHTML += `
            <button class="set-btn ${val ? "completed" : ""}" data-set-index="${i}">
              <span class="set-btn-num">S${i + 1}</span>
              <span class="set-btn-status">${val ? "OK" : "LISTO"}</span>
            </button>
          `;
        });
        setsHTML += `</div>`;
      }

      // Barra de herramientas de Ejercicio
      let toolsHTML = "";
      if (ex.sets > 0) {
        const isTimerRunning = activeTimer && activeTimer.exId === exId;
        toolsHTML += `
          <div class="exercise-actions">
            <div class="exercise-actions-left">
              <button class="exercise-timer-trigger ${isTimerRunning ? "running" : ""}" data-ex-id="${exId}" data-base-min="${timerMinutes}">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <b>${isTimerRunning ? dom.timerDisplay.textContent : timerDisplayStr}</b>
              </button>
            </div>
            <div class="exercise-actions-right" style="display:flex; gap:0.4rem;">
              <button class="btn btn-secondary btn-xs" data-action="add-set" title="Añadir Serie">+ Serie</button>
              <button class="btn btn-secondary btn-xs ${ex.sets <= 1 ? "ghost" : ""}" data-action="remove-set" title="Eliminar Serie">– Serie</button>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="exercise-header">
          <div class="exercise-title-row">
            <h3 class="exercise-name">${ex.name}</h3>
          </div>
          <div class="exercise-meta">${badgesHTML}</div>
        </div>
        ${noteHTML}
        ${setsHTML}
        ${toolsHTML}
      `;

      dom.exercises.appendChild(card);
    });
  }

  // ==========================================================================
  // 6. Lógica de Series, Popups y Guardado de Progreso
  // ==========================================================================
  function handleExerciseClick(e) {
    const setBtn = e.target.closest(".set-btn");
    const actionBtn = e.target.closest("[data-action]");
    const timerBtn = e.target.closest(".exercise-timer-trigger");

    if (setBtn) {
      const card = setBtn.closest(".exercise-card");
      const exId = card.dataset.exId;
      const setIndex = parseInt(setBtn.dataset.setIndex, 10);
      
      const currentSets = state.sets[exId];
      const isCompleting = !currentSets[setIndex];
      currentSets[setIndex] = isCompleting;
      
      saveState();

      // Animación pop al completar
      if (isCompleting) {
        setBtn.classList.add("completed", "pop-animation");
        setBtn.querySelector(".set-btn-status").textContent = "OK";
        
        // Auto-activar cronómetro de descanso
        const timerMinutes = parseFloat(card.querySelector(".exercise-timer-trigger")?.dataset.baseMin || "1.5");
        startGlobalTimer(timerMinutes, exId, card.dataset.name);
      } else {
        setBtn.classList.remove("completed", "pop-animation");
        setBtn.querySelector(".set-btn-status").textContent = "LISTO";
        
        // Si desactivamos y este temporizador estaba activo, lo apagamos
        if (activeTimer && activeTimer.exId === exId) {
          stopGlobalTimer(true);
        }
      }

      // Checkear si el ejercicio se ha terminado entero
      const isExFullyCompleted = currentSets.every(s => s);
      if (isExFullyCompleted) {
        card.classList.add("all-done-exercise");
        playSynthesizedBeep();
        
        // Abrir modal dinámico para registrar las cargas de CADA serie
        setTimeout(() => {
          showLoggingModal(exId, card.dataset.name, currentSets.length);
        }, 300);
      } else {
        card.classList.remove("all-done-exercise");
      }

      updateActiveDayProgress();
      return;
    }

    if (timerBtn) {
      const exId = timerBtn.dataset.exId;
      const exName = timerBtn.closest(".exercise-card").dataset.name;
      const baseMin = parseFloat(timerBtn.dataset.baseMin);

      if (activeTimer && activeTimer.exId === exId) {
        stopGlobalTimer(true);
      } else {
        startGlobalTimer(baseMin, exId, exName);
      }
      return;
    }

    if (actionBtn) {
      const action = actionBtn.dataset.action;
      const card = actionBtn.closest(".exercise-card");
      const exId = card.dataset.exId;
      const dayIndex = state.lastOpenedDay;

      if (action === "add-set") {
        // Actualizar la definición del ejercicio en routineData para que el cambio sea permanente
        const [dayIdx, exStringId] = exId.split(":");
        const day = routineData.days[parseInt(dayIdx, 10)];
        const exercise = day.exercises.find(e => e.id === exStringId);
        
        if (exercise) {
          exercise.sets = (exercise.sets || 0) + 1;
          saveRoutine();
        }

        // Sincronizar el estado de series activas
        state.sets[exId].push(false);
        saveState();
        
        renderActiveDayRoutine();
        showNotification("Serie añadida al ejercicio");
      } else if (action === "remove-set") {
        const [dayIdx, exStringId] = exId.split(":");
        const day = routineData.days[parseInt(dayIdx, 10)];
        const exercise = day.exercises.find(e => e.id === exStringId);
        
        if (exercise && exercise.sets > 1) {
          exercise.sets -= 1;
          saveRoutine();
        }

        // Sincronizar el estado de series activas
        if (state.sets[exId].length > 1) {
          state.sets[exId].pop();
          saveState();
          renderActiveDayRoutine();
          showNotification("Serie eliminada");
        }
      }
    }
  }

  // Analizar repeticiones recomendadas para sacar la media o el número inferior en caso de 9-10
  function parseRecommendedReps(repsStr) {
    if (!repsStr) return 10;
    
    // Limpiar caracteres extraños pero mantener números y guiones/barras
    const cleaned = repsStr.toString().replace(/[^0-9\-\/]/g, "").trim();
    
    // Dividir por guion o barra para detectar rangos
    const parts = cleaned.split(/[\-\/]/);
    
    if (parts.length === 1) {
      const val = parseInt(parts[0], 10);
      return isNaN(val) ? 10 : val;
    }
    
    if (parts.length === 2) {
      const A = parseInt(parts[0], 10);
      const B = parseInt(parts[1], 10);
      
      if (isNaN(A) && isNaN(B)) return 10;
      if (isNaN(A)) return B;
      if (isNaN(B)) return A;
      
      // Si es un rango de dos números consecutivos (ej. 9-10 o 8-9)
      if (Math.abs(B - A) === 1) {
        return Math.min(A, B); // Devuelve el más pequeño (ej. 9)
      }
      
      // De lo contrario, calcula la media
      return Math.floor((A + B) / 2);
    }
    
    const val = parseInt(cleaned, 10);
    return isNaN(val) ? 10 : val;
  }

  // Abre el Modal avanzado de entrada de datos (Peso y Reps por serie)
  function showLoggingModal(exId, exName, numSets) {
    dom.modalTitle.textContent = `¡Excelente! Registrar "${exName}"`;
    dom.modalSetsGrid.innerHTML = "";
    
    // Buscar historial anterior para rellenar valores por defecto y recordar qué levantó
    const history = state.progress[exId] || [];
    const lastSession = history[history.length - 1];

    if (state.fastLogging) {
      dom.modalSubtitle.textContent = `Modo Rápido: Introduce el peso levantado. Las repeticiones se completarán automáticamente en tus ${numSets} series:`;
      
      let defaultWeight = "";
      if (lastSession && lastSession.setsData && lastSession.setsData[0]) {
        defaultWeight = lastSession.setsData[0].w;
      } else if (lastSession && lastSession.weight) {
        defaultWeight = lastSession.weight;
      }

      const row = document.createElement("div");
      row.className = "set-entry-row";
      row.style.gridTemplateColumns = "1.2fr 1fr";
      row.innerHTML = `
        <span class="set-entry-label" style="font-size: 0.88rem; display: flex; align-items: center;">Peso en todas las series</span>
        <div class="set-input-group">
          <label>Peso Único (kg)</label>
          <input type="number" class="modal-weight-input" data-set="all" step="0.5" value="${defaultWeight}" placeholder="kg" required />
        </div>
      `;
      dom.modalSetsGrid.appendChild(row);
    } else {
      dom.modalSubtitle.textContent = `Registra el peso y repeticiones logrados en cada una de tus ${numSets} series:`;
      
      for (let i = 0; i < numSets; i++) {
        let defaultWeight = "";
        let defaultReps = "";
        
        // Si hay registro de la serie en la sesión anterior, la usamos de base
        if (lastSession && lastSession.setsData && lastSession.setsData[i]) {
          defaultWeight = lastSession.setsData[i].w;
          defaultReps = lastSession.setsData[i].r;
        } else if (lastSession) {
          // En caso de que haya aumentado las series hoy, usamos la primera de la sesión anterior
          defaultWeight = lastSession.setsData[0]?.w || "";
          defaultReps = lastSession.setsData[0]?.r || "";
        }

        const row = document.createElement("div");
        row.className = "set-entry-row";
        row.innerHTML = `
          <span class="set-entry-label">Serie ${i + 1}</span>
          <div class="set-input-group">
            <label>Peso (kg)</label>
            <input type="number" class="modal-weight-input" data-set="${i}" step="0.5" value="${defaultWeight}" placeholder="kg" required />
          </div>
          <div class="set-input-group">
            <label>Reps</label>
            <input type="number" class="modal-reps-input" data-set="${i}" value="${defaultReps}" placeholder="reps" required />
          </div>
        `;
        dom.modalSetsGrid.appendChild(row);
      }
    }

    // Enfocar el primer input
    setTimeout(() => {
      const firstInput = dom.modalSetsGrid.querySelector(".modal-weight-input");
      if (firstInput) firstInput.focus();
    }, 100);

    dom.modalExerciseNote.value = "";
    dom.modalOverlay.classList.add("active");

    // Lógica para guardar desde el modal
    dom.modalBtnSave.onclick = () => {
      const setsData = [];
      let totalVolume = 0;
      let maxWeight = 0;
      let max1RM = 0;
      let isValid = true;

      if (state.fastLogging) {
        const weightInput = dom.modalSetsGrid.querySelector(".modal-weight-input");
        const w = parseFloat(weightInput.value);

        // Obtener reps recomendadas del ejercicio
        const [dayIdx, exStringId] = exId.split(":");
        const day = routineData.days[parseInt(dayIdx, 10)];
        const exercise = day ? day.exercises.find(e => e.id === exStringId) : null;
        const r = parseRecommendedReps(exercise ? exercise.reps : "10");

        if (isNaN(w) || w <= 0) {
          isValid = false;
          weightInput.style.borderColor = "var(--danger)";
        } else {
          weightInput.style.borderColor = "";
          for (let i = 0; i < numSets; i++) {
            setsData.push({ w, r });
            totalVolume += (w * r);
          }
          maxWeight = w;
          const estimated1RM = r === 1 ? w : w * (1 + r / 30);
          max1RM = estimated1RM;
        }
      } else {
        const weightInputs = $$(".modal-weight-input", dom.modalSetsGrid);
        const repsInputs = $$(".modal-reps-input", dom.modalSetsGrid);

        for (let i = 0; i < numSets; i++) {
          const w = parseFloat(weightInputs[i].value);
          const r = parseInt(repsInputs[i].value, 10);

          if (isNaN(w) || w <= 0 || isNaN(r) || r <= 0) {
            isValid = false;
            weightInputs[i].style.borderColor = "var(--danger)";
            repsInputs[i].style.borderColor = "var(--danger)";
          } else {
            weightInputs[i].style.borderColor = "";
            repsInputs[i].style.borderColor = "";
            
            setsData.push({ w, r });
            totalVolume += (w * r);
            
            if (w > maxWeight) maxWeight = w;
            
            // Epley Formula para estimar 1RM: 1RM = W * (1 + R/30)
            const estimated1RM = r === 1 ? w : w * (1 + r / 30);
            if (estimated1RM > max1RM) max1RM = estimated1RM;
          }
        }
      }

      if (!isValid) {
        showNotification("Completa todos los pesos requeridos", "error");
        return;
      }

      // Guardar en el historial
      state.progress[exId] = state.progress[exId] || [];
      state.progress[exId].push({
        name: exName,
        date: getFormattedDate(),
        setsData: setsData,
        volume: Math.round(totalVolume * 100) / 100,
        weight: maxWeight, // Guardamos el peso máximo para compatibilidad
        max1RM: Math.round(max1RM * 10) / 10,
        note: dom.modalExerciseNote.value
      });

      saveState();
      dom.modalOverlay.classList.remove("active");
      showNotification("💪 Progreso guardado con éxito. ¡Buen entreno!");
    };
  }

  function getFormattedDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function resetCurrentDay() {
    const dayIndex = state.lastOpenedDay;
    const day = routineData.days[dayIndex];
    if (confirm(`¿Quieres reiniciar todas las series de hoy (${day.title})?`)) {
      day.exercises.forEach(ex => {
        const exId = `${dayIndex}:${ex.id}`;
        if (state.sets[exId]) {
          state.sets[exId] = Array(ex.sets).fill(false);
        }
      });
      saveState();
      stopGlobalTimer(true);
      renderActiveDayRoutine();
      updateActiveDayProgress();
      showNotification("Día reiniciado");
    }
  }

  // ==========================================================================
  // 7. Visualización Avanzada de Progreso (SVG Charts Interactivos) (Página 2)
  // ==========================================================================
  let selectedProgressExId = null;
  let chartMetric = "weight"; // "weight", "1rm", "volume"

  function renderProgressTab() {
    const container = $("#progressMainView");
    container.innerHTML = "";

    const trackedKeys = Object.keys(state.progress).filter(key => state.progress[key].length > 0);

    if (trackedKeys.length === 0) {
      container.innerHTML = `<div class="no-data-view">Aún no hay datos de progreso. Completa todas las series de cualquier ejercicio para registrar tu primer entrenamiento.</div>`;
      return;
    }

    if (selectedProgressExId) {
      renderExerciseProgressDetail(selectedProgressExId, container);
    } else {
      // Listar todos los ejercicios con progreso
      const listDiv = document.createElement("div");
      listDiv.className = "progress-list";
      
      trackedKeys.forEach(exId => {
        const records = state.progress[exId];
        const lastRecord = records[records.length - 1];
        
        const card = document.createElement("div");
        card.className = "progress-exercise-card";
        card.dataset.exId = exId;
        
        let subText = `Último registro: ${lastRecord.date} | `;
        if (lastRecord.setsData) {
          subText += `${lastRecord.setsData.length} series`;
        } else {
          subText += `${lastRecord.weight} kg`;
        }

        card.innerHTML = `
          <div class="progress-exercise-info">
            <h3>${lastRecord.name}</h3>
            <p>${subText}</p>
          </div>
          <div class="progress-exercise-badge">
            ${lastRecord.weight} kg
          </div>
        `;
        
        card.onclick = () => {
          selectedProgressExId = exId;
          renderProgressTab();
        };

        listDiv.appendChild(card);
      });
      
      container.appendChild(listDiv);
    }
  }

  function renderExerciseProgressDetail(exId, container) {
    const records = state.progress[exId];
    if (!records || records.length === 0) {
      selectedProgressExId = null;
      renderProgressTab();
      return;
    }

    const lastRecord = records[records.length - 1];
    
    // Calcular estadísticas clave
    const maxWeight = Math.max(...records.map(r => r.weight || 0));
    const max1RM = Math.max(...records.map(r => r.max1RM || r.weight || 0));
    const totalSessions = records.length;
    const lastVolume = lastRecord.volume || 0;

    const detailDiv = document.createElement("div");
    detailDiv.className = "progress-detail-view";
    
    detailDiv.innerHTML = `
      <div class="progress-detail-header">
        <button class="btn btn-secondary btn-sm" id="btnBackToProgressList" style="align-self: flex-start;">← Volver a Lista</button>
        <div class="progress-detail-title-row" style="margin-top: 0.5rem;">
          <h3>${lastRecord.name}</h3>
        </div>
      </div>

      <!-- Grid de Tarjetas de Estadísticas -->
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-box-label">Peso Máx.</span>
          <span class="stat-box-value">${maxWeight} kg</span>
          <span class="stat-box-desc">Carga récord absoluta</span>
        </div>
        <div class="stat-box">
          <span class="stat-box-label">1RM Estimado</span>
          <span class="stat-box-value">${max1RM} kg</span>
          <span class="stat-box-desc">Potencia máxima teórica</span>
        </div>
        <div class="stat-box">
          <span class="stat-box-label">Volumen Últ.</span>
          <span class="stat-box-value">${lastVolume} kg</span>
          <span class="stat-box-desc">Tonelaje (Peso × Reps)</span>
        </div>
        <div class="stat-box">
          <span class="stat-box-label">Sesiones</span>
          <span class="stat-box-value">${totalSessions}</span>
          <span class="stat-box-desc">Entrenamientos registrados</span>
        </div>
      </div>

      <!-- Gráfico Lineal SVG Interactivo -->
      <div class="chart-container-card">
        <div class="chart-header">
          <h4>Evolución Temporal</h4>
          <div class="chart-selectors">
            <button class="chart-selector-btn ${chartMetric === "weight" ? "active" : ""}" data-metric="weight">Peso</button>
            <button class="chart-selector-btn ${chartMetric === "1rm" ? "active" : ""}" data-metric="1rm">1RM Est.</button>
            <button class="chart-selector-btn ${chartMetric === "volume" ? "active" : ""}" data-metric="volume">Volumen</button>
          </div>
        </div>
        <div class="chart-svg-wrapper">
          <svg id="chart-svg" viewBox="0 0 300 160"></svg>
        </div>
      </div>

      <!-- Tabla de Historial Histórico -->
      <div class="history-table-container">
        <table class="history-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Carga Máx.</th>
              <th>Series Logradas</th>
              <th>Volumen</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            ${[...records].reverse().map(r => {
              let seriesText = "";
              if (r.setsData) {
                seriesText = r.setsData.map(s => `${s.w}x${s.r}`).join(", ");
              } else {
                seriesText = `${r.weight} kg`;
              }
              return `
                <tr>
                  <td><b>${r.date}</b></td>
                  <td><span style="color: var(--brand); font-weight:700;">${r.weight} kg</span></td>
                  <td><span style="font-family: var(--font-mono); font-size: 0.8rem;">${seriesText}</span></td>
                  <td>${r.volume || "—"} kg</td>
                  <td><small style="color: var(--ink-muted);">${r.note || "—"}</small></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;

    container.appendChild(detailDiv);

    // Eventos de botones
    $("#btnBackToProgressList").onclick = () => {
      selectedProgressExId = null;
      renderProgressTab();
    };

    $$(".chart-selector-btn").forEach(btn => {
      btn.onclick = (e) => {
        chartMetric = e.target.dataset.metric;
        $$(".chart-selector-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        drawSVGChart(records);
      };
    });

    drawSVGChart(records);
  }

  // Dibuja el gráfico interactivo de progreso mediante SVG
  function drawSVGChart(records) {
    const svg = $("#chart-svg");
    if (!svg) return;

    // Obtener los últimos 8 registros para no colapsar la pantalla
    const data = records.slice(-8);
    
    // Extraer valores según la métrica
    let values = [];
    if (chartMetric === "weight") {
      values = data.map(d => d.weight || 0);
    } else if (chartMetric === "1rm") {
      values = data.map(d => d.max1RM || d.weight || 0);
    } else if (chartMetric === "volume") {
      values = data.map(d => d.volume || 0);
    }

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    let valRange = maxVal - minVal;

    const width = 300;
    const height = 160;
    const padding = { top: 25, right: 15, bottom: 25, left: 35 };

    if (valRange === 0) {
      valRange = maxVal * 0.25 || 10;
    }

    // Agregar margen por arriba y abajo en el eje Y
    const yMin = Math.max(0, minVal - valRange * 0.15);
    const yMax = maxVal + valRange * 0.15;
    const finalRange = yMax - yMin;

    const getX = (index) => padding.left + (index * (width - padding.left - padding.right) / (data.length - 1 || 1));
    const getY = (val) => (height - padding.bottom) - ((val - yMin) / (finalRange || 1)) * (height - padding.top - padding.bottom);

    // Dibujar líneas de rejilla Y
    let svgContent = `
      <!-- Rejilla Horizontal -->
      <line class="grid-line" x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}"></line>
      <line class="grid-line" x1="${padding.left}" y1="${(height - padding.top - padding.bottom) / 2 + padding.top}" x2="${width - padding.right}" y2="${(height - padding.top - padding.bottom) / 2 + padding.top}"></line>
      <line class="grid-line" x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}"></line>
      
      <!-- Etiquetas del eje Y -->
      <text class="axis-label-y" x="${padding.left - 6}" y="${padding.top}" dominant-baseline="middle" text-anchor="end">${Math.round(yMax)}</text>
      <text class="axis-label-y" x="${padding.left - 6}" y="${(height - padding.top - padding.bottom) / 2 + padding.top}" dominant-baseline="middle" text-anchor="end">${Math.round((yMax + yMin) / 2)}</text>
      <text class="axis-label-y" x="${padding.left - 6}" y="${height - padding.bottom}" dominant-baseline="middle" text-anchor="end">${Math.round(yMin)}</text>
    `;

    // Generar línea poligonal
    let points = data.map((d, i) => `${getX(i)},${getY(values[i])}`).join(" ");
    
    if (data.length > 1) {
      svgContent += `<polyline class="data-line" points="${points}"></polyline>`;
    }

    // Dibujar puntos interactivos y etiquetas X
    data.forEach((d, i) => {
      const x = getX(i);
      const y = getY(values[i]);
      const val = values[i];
      const shortDate = d.date.substring(0, 5); // formato DD/MM

      svgContent += `
        <g class="chart-point-group">
          <circle class="data-point" cx="${x}" cy="${y}"><title>${d.date}: ${val}</title></circle>
          <text class="data-label" x="${x}" y="${y - 8}">${Math.round(val)}</text>
          <text class="axis-label-x" x="${x}" y="${height - padding.bottom + 14}" text-anchor="middle">${shortDate}</text>
        </g>
      `;
    });

    svg.innerHTML = svgContent;
  }

  // ==========================================================================
  // 8. Editor de Rutinas Avanzado (Ajustes - Página 3)
  // ==========================================================================
  function renderSettingsTab() {
    const editor = dom.settingsRoutineEditor;
    editor.innerHTML = "";

    routineData.days.forEach((day, dayIndex) => {
      const dayBlock = document.createElement("div");
      dayBlock.className = "settings-day-block";
      
      dayBlock.innerHTML = `
        <div class="settings-day-header">
          <span class="settings-day-title">${day.title} • ${day.muscle}</span>
          <button class="btn btn-secondary btn-sm" data-action="edit-day-name" data-day="${dayIndex}">Editar Nombre</button>
        </div>
        <div class="settings-exercise-list" id="settingsExList:${dayIndex}">
          <!-- Ejercicios cargados debajo -->
        </div>
      `;
      
      editor.appendChild(dayBlock);
      const exListEl = dayBlock.querySelector(`.settings-exercise-list`);

      if (day.exercises.length === 0) {
        exListEl.innerHTML = `<p style="color:var(--ink-muted); font-size:0.8rem; text-align:center; padding:1rem;">Sin ejercicios.</p>`;
      } else {
        day.exercises.forEach((ex, exIndex) => {
          const item = document.createElement("div");
          item.className = "settings-exercise-item";
          item.innerHTML = `
            <div class="settings-ex-info">
              <h4>${ex.name}</h4>
              <p>${ex.sets} series × ${ex.reps} reps | RIR: ${ex.rir} | Rest: ${ex.rest}</p>
            </div>
            <div class="settings-ex-controls">
              <button class="btn btn-secondary btn-square btn-xs" data-action="edit-ex" data-day="${dayIndex}" data-ex="${exIndex}" title="Editar">✏️</button>
              <button class="btn btn-secondary btn-square btn-xs" data-action="move-up-ex" data-day="${dayIndex}" data-ex="${exIndex}" title="Subir">↑</button>
              <button class="btn btn-secondary btn-square btn-xs" data-action="move-down-ex" data-day="${dayIndex}" data-ex="${exIndex}" title="Bajar">↓</button>
              <button class="btn btn-danger btn-square btn-xs" data-action="delete-ex" data-day="${dayIndex}" data-ex="${exIndex}" title="Eliminar">✕</button>
            </div>
          `;
          exListEl.appendChild(item);
        });
      }
    });

    // Delegar clicks dentro del editor de ajustes
    editor.onclick = (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const dayIdx = parseInt(btn.dataset.day, 10);
      const exIdx = parseInt(btn.dataset.ex, 10);

      switch (action) {
        case "edit-day-name":
          const day = routineData.days[dayIdx];
          const newTitle = prompt("Nombre del día:", day.title);
          const newMuscle = prompt("Enfoque muscular:", day.muscle);
          if (newTitle && newMuscle) {
            day.title = newTitle;
            day.muscle = newMuscle;
            saveRoutine();
            renderSettingsTab();
            renderDayTabs();
            showNotification("Día actualizado");
          }
          break;

        case "delete-ex":
          if (confirm("¿Seguro que quieres eliminar este ejercicio de la rutina?")) {
            routineData.days[dayIdx].exercises.splice(exIdx, 1);
            saveRoutine();
            renderSettingsTab();
            showNotification("Ejercicio eliminado");
          }
          break;

        case "move-up-ex":
          if (exIdx > 0) {
            const list = routineData.days[dayIdx].exercises;
            const temp = list[exIdx];
            list[exIdx] = list[exIdx - 1];
            list[exIdx - 1] = temp;
            saveRoutine();
            renderSettingsTab();
          }
          break;

        case "move-down-ex":
          const list = routineData.days[dayIdx].exercises;
          if (exIdx < list.length - 1) {
            const temp = list[exIdx];
            list[exIdx] = list[exIdx + 1];
            list[exIdx + 1] = temp;
            saveRoutine();
            renderSettingsTab();
          }
          break;

        case "edit-ex":
          showExerciseEditorModal(dayIdx, exIdx);
          break;
      }
    };
  }

  // Popup modal para agregar o editar un ejercicio
  function showExerciseEditorModal(dayIdx, exIdx = null) {
    const isEdit = exIdx !== null;
    const day = routineData.days[dayIdx];
    const ex = isEdit ? day.exercises[exIdx] : {
      id: "nuevo_ejercicio_" + Date.now(),
      name: "",
      sets: 3,
      reps: "8-12",
      rir: "RIR 1-2",
      rest: "2 min",
      timer: 2.0,
      note: ""
    };

    dom.modalTitle.textContent = isEdit ? "Editar Ejercicio" : "Añadir Ejercicio";
    dom.modalSubtitle.textContent = `Guardar en día: ${day.title}`;
    
    dom.modalSetsGrid.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:0.75rem; width:100%; padding:0.25rem;">
        <div class="form-group">
          <label>Nombre del Ejercicio:</label>
          <input type="text" id="editExName" class="form-control" value="${ex.name}" placeholder="Ej. Press Militar Smith" required />
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
          <div class="form-group">
            <label>Series Base:</label>
            <input type="number" id="editExSets" class="form-control" value="${ex.sets}" min="0" required />
          </div>
          <div class="form-group">
            <label>Repeticiones:</label>
            <input type="text" id="editExReps" class="form-control" value="${ex.reps}" placeholder="Ej. 8-12 o 5" required />
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
          <div class="form-group">
            <label>RIR Recomendado:</label>
            <input type="text" id="editExRir" class="form-control" value="${ex.rir}" placeholder="Ej. RIR 1-2" required />
          </div>
          <div class="form-group">
            <label>Texto Descanso:</label>
            <input type="text" id="editExRest" class="form-control" value="${ex.rest}" placeholder="Ej. 2 min o 90s" required />
          </div>
        </div>
        <div class="form-group">
          <label>Minutos del Cronómetro de Descanso:</label>
          <input type="number" id="editExTimer" class="form-control" value="${ex.timer}" step="0.1" min="0" required />
        </div>
      </div>
    `;

    dom.modalExerciseNote.value = ex.note || "";
    dom.modalOverlay.classList.add("active");

    dom.modalBtnSave.onclick = () => {
      const name = $("#editExName").value.trim();
      const sets = parseInt($("#editExSets").value, 10);
      const reps = $("#editExReps").value.trim();
      const rir = $("#editExRir").value.trim();
      const rest = $("#editExRest").value.trim();
      const timer = parseFloat($("#editExTimer").value);
      const note = dom.modalExerciseNote.value.trim();

      if (!name || isNaN(sets) || !reps || !rir || !rest || isNaN(timer)) {
        showNotification("Por favor, rellena todos los campos válidamente", "error");
        return;
      }

      const savedEx = {
        id: ex.id,
        name,
        sets,
        reps,
        rir,
        rest,
        timer,
        note
      };

      if (isEdit) {
        day.exercises[exIdx] = savedEx;
      } else {
        day.exercises.push(savedEx);
      }

      saveRoutine();
      dom.modalOverlay.classList.remove("active");
      renderSettingsTab();
      renderActiveDayRoutine();
      showNotification(isEdit ? "Ejercicio actualizado" : "Ejercicio añadido");
    };
  }

  // ==========================================================================
  // 9. Lógica de Pestañas e Importación / Exportación JSON (Copia Seguridad)
  // ==========================================================================
  function switchPage(pageId) {
    $$(".app-page").forEach(p => p.classList.remove("active"));
    $(`#${pageId}`).classList.add("active");

    // Sincronizar botones de barra de navegación
    $$(".nav-item").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.page === pageId);
    });

    if (pageId === "page-routine") {
      renderActiveDayRoutine();
    } else if (pageId === "page-progress") {
      renderProgressTab();
    } else if (pageId === "page-settings") {
      renderSettingsTab();
    }
  }

  function handleImportJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        
        // Comprobar formato
        if (imported.days && Array.isArray(imported.days)) {
          normalizeRoutineData(imported);
          routineData = { days: imported.days };
          saveRoutine();
          
          // Si el archivo JSON también tiene datos de progreso/historial, cargarlo
          if (imported.progress) {
            state.progress = imported.progress;
          }
          if (imported.sets) {
            state.sets = imported.sets;
          } else {
            state.sets = {};
          }
          if (imported.notes) {
            state.notes = imported.notes;
          }
          if (imported.week) {
            state.week = imported.week;
          }
          saveState();
          
          showNotification("Rutina importada con éxito. Aplicando...");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (imported.progress) {
          // Si importa un backup completo de la app
          state = imported;
          saveState();
          showNotification("Historial e Importación cargados. Aplicando...");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (Array.isArray(imported)) {
          // Si es solo una lista directa de días (formato alternativo de importación)
          const dataWrapper = { days: imported };
          normalizeRoutineData(dataWrapper);
          routineData = dataWrapper;
          saveRoutine();
          state.sets = {};
          saveState();
          showNotification("Días de rutina cargados. Aplicando...");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          throw new Error("Formato no reconocido");
        }
      } catch (err) {
        console.error("Fallo al importar:", err);
        showNotification("Error: Archivo JSON no válido o corrupto", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Limpiar
  }

  function handleExportJSON() {
    try {
      // Exportamos un objeto completo con rutina e historial para copia de seguridad total
      const backupData = {
        days: routineData.days,
        sets: state.sets,
        progress: state.progress,
        week: state.week,
        notes: state.notes
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `powergym-backup-${getFormattedDate().replace(/\//g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification("Backup exportado correctamente");
    } catch (e) {
      console.error(e);
      showNotification("Error al exportar", "error");
    }
  }

  function applyWeekHints() {
    const w = state.week;
    dom.selectWeek.value = w;
    
    // Sincronizar el encabezado
    const weekTitles = {
      "1": "Semana 1 • Acondicionamiento (RIR 2-3)",
      "2": "Semana 2 • Carga Progresiva (RIR 1-2)",
      "3": "Semana 3 • Intensidad Alta (RIR 1-0)",
      "4": "Semana 4 • Descarga / Deload (RIR 3-4)",
      "5": "Semana 5 • Supercompensación (RIR 1)",
      "6": "Semana 6 • Pico de Fuerza (RIR 0)"
    };
    
    dom.weekDisplay.textContent = weekTitles[w] || `Semana ${w}`;

    // Cambiar tips
    let tip = "";
    dom.weekTipText.style.borderColor = "var(--brand)";
    
    if (w === "1") {
      tip = "<b>Semana 1:</b> Toma de contacto. Deja ~2-3 repeticiones en recámara en ejercicios compuestos y ~1-2 en aislados. Céntrate en técnica perfecta.";
    } else if (w === "2" || w === "3") {
      tip = "<b>Semanas 2-3:</b> Carga Progresiva. Aumenta peso o repeticiones en cada ejercicio. RIR 1-2 compuestos, RIR 0-1 en accesorios. ¡Haz que cueste!";
      dom.weekTipText.style.borderColor = "var(--warn)";
    } else if (w === "4") {
      tip = "<b>SEMANA DE DESCARGA:</b> Reduce el volumen un 40-50% (menos series) y mantén RIR 3-4 cómodo. Deja recuperar al sistema nervioso y articulaciones.";
      dom.weekTipText.style.borderColor = "var(--danger)";
    } else if (w === "5" || w === "6") {
      tip = "<b>Semanas 5-6:</b> Intensidad Máxima. Busca tu récord (PR). RIR 1-0 en las últimas series. Cuidado con el fallo técnico en sentadillas o banca.";
      dom.weekTipText.style.borderColor = "var(--ok)";
    }
    
    dom.weekTipText.innerHTML = tip;
  }

  // ==========================================================================
  // 10. Notificaciones Toast
  // ==========================================================================
  let toastTimeout;
  function showNotification(message, type = "success") {
    clearTimeout(toastTimeout);
    
    dom.toast.textContent = message;
    dom.toast.className = `app-toast show ${type}`;
    
    toastTimeout = setTimeout(() => {
      dom.toast.classList.remove("show");
    }, 3000);
  }

  // ==========================================================================
  // 11. Enlace de Eventos y Arranque inicial (DOM Ready)
  // ==========================================================================
  function init() {
    initDOM();
    loadState();
    
    // Renderizado Inicial
    renderDayTabs();
    renderActiveDayRoutine();
    applyWeekHints();
    
    dom.sessionNotes.value = state.notes || "";

    // Sincronizar el toggle de registro rápido
    if (dom.toggleFastLogging) {
      dom.toggleFastLogging.checked = !!state.fastLogging;
      dom.toggleFastLogging.onchange = (e) => {
        state.fastLogging = e.target.checked;
        saveState();
        showNotification(
          state.fastLogging 
            ? "⚡ Registro Rápido activado (Reps automáticas)" 
            : "📝 Registro Avanzado activado (Reps por serie)"
        );
      };
    }

    // Eventos de Navegación SPA
    dom.bottomNav.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-item");
      if (btn) switchPage(btn.dataset.page);
    });

    dom.headerBranding.onclick = () => switchPage("page-routine");
    dom.btnProgressDesktop.onclick = () => switchPage("page-progress");
    dom.btnSettingsDesktop.onclick = () => switchPage("page-settings");
    dom.btnResetDayDesktop.onclick = resetCurrentDay;

    // Cambios en barra lateral
    dom.selectWeek.onchange = (e) => {
      state.week = e.target.value;
      saveState();
      applyWeekHints();
      showNotification(`Periodización: Semana ${state.week} activada`);
    };

    dom.sessionNotes.oninput = (e) => {
      state.notes = e.target.value;
      saveState();
    };

    // Pestañas de día
    dom.dayTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".day-tab");
      if (tab) {
        $$(".day-tab", dom.dayTabs).forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        state.lastOpenedDay = parseInt(tab.dataset.dayIndex, 10);
        saveState();
        
        renderActiveDayRoutine();
      }
    });

    // Clicks en Ejercicios (Series, cronómetro rápido, add/remove series)
    dom.exercises.addEventListener("click", handleExerciseClick);

    // Acciones de Backup
    dom.btnExportJSON.onclick = handleExportJSON;
    dom.btnImportJSON.onclick = () => dom.inputImportFile.click();
    dom.inputImportFile.onchange = handleImportJSON;

    // Ajustes Editor
    $("#btnCreateNewExercise").onclick = () => {
      showExerciseEditorModal(state.lastOpenedDay);
    };

    $("#btnResetRoutineToDefault").onclick = () => {
      if (confirm("¿Estás seguro de que quieres restablecer la rutina inicial por defecto? Esto borrará tus ejercicios personalizados.")) {
        routineData = defaultRoutineData;
        saveRoutine();
        state.sets = {};
        saveState();
        renderDayTabs();
        renderActiveDayRoutine();
        renderSettingsTab();
        showNotification("Rutina restablecida por defecto");
      }
    };

    // Eventos Temporizador Flotante
    dom.timerBtnAction.onclick = toggleTimerPause;
    dom.timerBtnAdd15.onclick = () => adjustTimer(15);
    dom.timerBtnSub15.onclick = () => adjustTimer(-15);
    dom.timerBtnClose.onclick = () => stopGlobalTimer(true);

    // Cerrar modales
    dom.modalCloseBtn.onclick = () => dom.modalOverlay.classList.remove("active");
    dom.modalBtnCancel.onclick = () => dom.modalOverlay.classList.remove("active");

    // Registro de Service Worker para PWA Offline
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
          .then(reg => console.log("PowerGym Service Worker: Registrado", reg.scope))
          .catch(err => console.error("PowerGym Service Worker: Fallo en registro", err));
      });
    }
  }

  // Arrancar la app en DOMContentLoaded
  document.addEventListener("DOMContentLoaded", init);

})();
