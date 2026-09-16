(function () {
  const dataUrl = 'datos/eventos.json';
  const calendar = document.getElementById('calendar');
  const monthTitle = document.getElementById('monthTitle');
  const prev = document.getElementById('prevMonth');
  const next = document.getElementById('nextMonth');
  const eventList = document.getElementById('eventList');
  const status = document.getElementById('calendarStatus');

  let events = [];
  let current = new Date();
  current.setDate(1);

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const weekdays = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  function dateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatDate(value) {
    const [y, m, d] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d));
  }

  function renderCalendar() {
    const year = current.getFullYear();
    const month = current.getMonth();
    monthTitle.textContent = `${monthNames[month]} ${year}`;
    calendar.innerHTML = '';

    weekdays.forEach(day => {
      const el = document.createElement('div');
      el.className = 'calendar-weekday';
      el.textContent = day;
      calendar.appendChild(el);
    });

    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < offset; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calendar.appendChild(empty);
    }

    for (let day = 1; day <= days; day++) {
      const date = new Date(year, month, day);
      const key = dateKey(date);
      const dayEvents = events.filter(e => e.fecha === key).sort((a,b) => (a.hora || '').localeCompare(b.hora || ''));
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      if (key === dateKey(new Date())) cell.classList.add('today');

      const number = document.createElement('div');
      number.className = 'calendar-number';
      number.textContent = day;
      cell.appendChild(number);

      dayEvents.forEach(e => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'calendar-event';
        item.textContent = `${e.hora ? e.hora + ' · ' : ''}${e.titulo}`;
        item.title = e.descripcion || e.titulo;
        item.addEventListener('click', () => showEvent(e));
        cell.appendChild(item);
      });
      calendar.appendChild(cell);
    }
  }

  function renderList() {
    eventList.innerHTML = '';
    const visible = events.slice().sort((a,b) => `${a.fecha} ${a.hora || ''}`.localeCompare(`${b.fecha} ${b.hora || ''}`));
    if (!visible.length) {
      eventList.innerHTML = '<p class="muted">No hay eventos programados.</p>';
      return;
    }
    visible.forEach(e => {
      const card = document.createElement('article');
      card.className = 'event-card';
      card.innerHTML = `<div class="event-date">${formatDate(e.fecha)}${e.hora ? ' · ' + e.hora : ''}</div><h3></h3><span class="tag"></span><p class="muted"></p>`;
      card.querySelector('h3').textContent = e.titulo || 'Evento';
      card.querySelector('.tag').textContent = e.tipo || 'Evento';
      card.querySelector('p').textContent = e.descripcion || '';
      eventList.appendChild(card);
    });
  }

  function showEvent(e) {
    const text = `${e.titulo || 'Evento'}\n${formatDate(e.fecha)}${e.hora ? ' · ' + e.hora : ''}\n${e.tipo || ''}${e.descripcion ? '\n\n' + e.descripcion : ''}`;
    window.alert(text);
  }

  prev.addEventListener('click', () => { current.setMonth(current.getMonth() - 1); renderCalendar(); });
  next.addEventListener('click', () => { current.setMonth(current.getMonth() + 1); renderCalendar(); });

  fetch(dataUrl, { cache: 'no-store' })
    .then(r => { if (!r.ok) throw new Error('No se pudo cargar eventos.json'); return r.json(); })
    .then(data => {
      events = Array.isArray(data.eventos) ? data.eventos : [];
      status.textContent = `Calendario actualizado desde GitHub · ${events.length} evento${events.length === 1 ? '' : 's'}`;
      renderCalendar();
      renderList();
    })
    .catch(err => {
      status.textContent = 'No se pudo cargar el calendario. Comprueba que datos/eventos.json exista en el repositorio.';
      console.error(err);
      renderCalendar();
      renderList();
    });
})();
