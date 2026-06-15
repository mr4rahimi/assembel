/* ===========================================================================
   مای مونتا — منطق پیکربندی شیر
   =========================================================================== */
(function () {
  const { FINISHES, FINISH_ORDER, SPOUTS, HANDLES, BODY, BASE, PARTS } = window.MM;

  const DEFAULT = {
    selected: 'spout',
    body:    { finish: 'chrome' },
    spout:   { model: 'goose',  finish: 'chrome' },
    handle:  { model: 'paddle', finish: 'chrome' },
    base:    { finish: 'chrome' },
    aerator: { finish: 'chrome' },
  };

  let state = load() || structuredClone(DEFAULT);
  let zoom = 1;

  /* ---------- helpers ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const spoutById  = id => SPOUTS.find(s => s.id === id) || SPOUTS[0];
  const handleById = id => HANDLES.find(h => h.id === id) || HANDLES[0];

  function segmentsFor(key) {
    if (key === 'body')    return [BODY];
    if (key === 'base')    return [BASE];
    if (key === 'spout')   { const s = spoutById(state.spout.model); return [{ d: s.spoutD, w: s.spoutW }]; }
    if (key === 'handle')  return handleById(state.handle.model).segments;
    if (key === 'aerator') { const s = spoutById(state.spout.model); return [{ d: s.aeratorD, w: s.aeratorW }]; }
    return [];
  }

  /* جلوه‌ی فلزی هم‌مرکز: چهار لایه‌ی هم‌مسیر با عرض‌های کاهشی */
  function metalLayers(segs, fk) {
    const f = FINISHES[fk];
    let out = '';
    for (const s of segs) {
      out +=
        `<path d="${s.d}" stroke="${f.dark}"  stroke-width="${s.w}"/>` +
        `<path d="${s.d}" stroke="${f.mid}"   stroke-width="${(s.w * 0.78).toFixed(1)}"/>` +
        `<path d="${s.d}" stroke="${f.light}" stroke-width="${(s.w * 0.42).toFixed(1)}"/>` +
        `<path d="${s.d}" stroke="${f.spec}"  stroke-width="${(s.w * 0.14).toFixed(1)}" opacity="${f.glossy}"/>`;
    }
    return out;
  }

  function partGroup(key) {
    const segs = segmentsFor(key);
    const glow = segs.map(s => `<path d="${s.d}" stroke-width="${s.w + 13}"/>`).join('');
    return `<g class="part${state.selected === key ? ' sel' : ''}" data-part="${key}">
      <g class="glow" filter="url(#glowF)">${glow}</g>
      <g class="metal">${metalLayers(segs, state[key].finish)}</g>
    </g>`;
  }

  /* ترتیب رسم از عقب به جلو */
  const DRAW_ORDER = ['base', 'body', 'spout', 'handle', 'aerator'];

  function renderFaucet() {
    const html = DRAW_ORDER.map(partGroup).join('');
    $('#faucet').innerHTML = html;
    // بازتاب کف (آینه‌ی محو شده زیر پایه)
    $('#reflection').innerHTML =
      `<g transform="matrix(1 0 0 -1 0 1054)" style="pointer-events:none">${html}</g>`;
    applyZoom();
    bindParts();
  }

  function applyZoom() {
    $('#faucet').setAttribute('transform', `translate(210 320) scale(${zoom}) translate(-210 -320)`);
  }

  function bindParts() {
    document.querySelectorAll('#faucet .part').forEach(g => {
      const key = g.dataset.part;
      g.addEventListener('click', () => select(key));
      g.addEventListener('mouseenter', () => showTag(key, g));
      g.addEventListener('mouseleave', hideTag);
    });
  }

  /* ---------- floating tag ---------- */
  function showTag(key, g) {
    const meta = PARTS.find(p => p.key === key);
    const tag = $('#partTag');
    tag.textContent = meta.name;
    const svg = $('#faucetSvg'), inner = $('#stageInner');
    const bb = g.getBBox();
    const pt = svg.createSVGPoint();
    pt.x = bb.x + bb.width / 2; pt.y = bb.y;
    const ctm = g.getScreenCTM();
    const scr = pt.matrixTransform(ctm);
    const ir = inner.getBoundingClientRect();
    tag.style.right = (ir.right - scr.x) + 'px';
    tag.style.top = (scr.y - ir.top - 12) + 'px';
    tag.classList.add('on');
  }
  function hideTag() { $('#partTag').classList.remove('on'); }

  /* ---------- selection ---------- */
  function select(key) {
    state.selected = key;
    document.querySelectorAll('#faucet .part').forEach(g =>
      g.classList.toggle('sel', g.dataset.part === key));
    renderPanel();
    const row = $(`.part-row[data-part="${key}"]`);
    if (row) row.scrollIntoViewIfNeeded ? row.scrollIntoViewIfNeeded() :
      row.parentElement.scrollTo({ top: row.offsetTop - 12, behavior: 'smooth' });
    save();
  }

  /* ---------- panel ---------- */
  function swatchBg(fk) {
    const f = FINISHES[fk];
    return `linear-gradient(135deg, ${f.dark} 0%, ${f.mid} 34%, ${f.light} 52%, ${f.spec} 60%, ${f.mid} 74%, ${f.dark} 100%)`;
  }

  function thumbSVG(segs, vb) {
    const path = segs.map(s =>
      `<path d="${s.d}" fill="none" stroke="#aeb4ba" stroke-width="${s.w}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${s.d}" fill="none" stroke="#eef1f3" stroke-width="${(s.w * 0.4).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>`
    ).join('');
    return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${path}</svg>`;
  }

  function modelsBlock(meta) {
    const cur = state[meta.key].model;
    const cards = meta.models.map(m => {
      const segs = meta.key === 'spout' ? [{ d: m.spoutD, w: m.spoutW }] : m.segments;
      return `<button class="model-card${m.id === cur ? ' on' : ''}" data-model="${m.id}">
        ${thumbSVG(segs, m.thumbVB)}
        <span class="mn">${m.name}</span>
      </button>`;
    }).join('');
    const label = meta.key === 'spout' ? 'مدل علم' : 'مدل دسته';
    return `<div class="sec-label">${label}</div><div class="models">${cards}</div>`;
  }

  function finishesBlock(key) {
    const cur = state[key].finish;
    const swatches = FINISH_ORDER.map(fk => `<div class="fin">
        <button class="${fk === cur ? 'on' : ''}" data-finish="${fk}" style="background:${swatchBg(fk)}" title="${FINISHES[fk].name}" aria-label="${FINISHES[fk].name}"></button>
        <span class="fl">${FINISHES[fk].name}</span>
      </div>`).join('');
    return `<div class="sec-label">رنگ و روکش</div><div class="finishes">${swatches}</div>`;
  }

  function renderPanel() {
    const html = PARTS.map((meta, i) => {
      const open = state.selected === meta.key;
      const fk = state[meta.key].finish;
      let valTxt = FINISHES[fk].name;
      if (meta.hasModel) {
        const mName = (meta.key === 'spout' ? spoutById(state.spout.model) : handleById(state.handle.model)).name;
        valTxt = `${mName} · ${FINISHES[fk].name}`;
      }
      const body = (meta.hasModel ? modelsBlock(meta) : '') + finishesBlock(meta.key);
      return `<div class="part-row${open ? ' open' : ''}" data-part="${meta.key}">
        <button class="part-head" data-head="${meta.key}">
          <span class="swatch-dot" style="background:${swatchBg(fk)}"></span>
          <span class="part-meta">
            <span class="pn"><span class="idx">${i + 1}</span>${meta.name}</span>
            <span class="pv">${valTxt}</span>
          </span>
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="part-body"><div><div class="pb-inner">${body}</div></div></div>
      </div>`;
    }).join('');
    $('#parts').innerHTML = html;
  }

  /* ---------- panel events (delegated) ---------- */
  $('#parts').addEventListener('click', e => {
    const head = e.target.closest('[data-head]');
    if (head) { select(head.dataset.head); return; }
    const mc = e.target.closest('[data-model]');
    if (mc) {
      const key = state.selected;
      state[key].model = mc.dataset.model;
      renderFaucet(); renderPanel(); save(); return;
    }
    const fb = e.target.closest('[data-finish]');
    if (fb) {
      const key = e.target.closest('.part-row').dataset.part;
      state[key].finish = fb.dataset.finish;
      renderFaucet(); renderPanel(); save(); return;
    }
  });

  /* ---------- save / share ---------- */
  function encode() {
    const c = {
      b: state.body.finish, s: state.spout.model, sf: state.spout.finish,
      h: state.handle.model, hf: state.handle.finish, ba: state.base.finish, a: state.aerator.finish,
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(c))));
  }
  function decode(code) {
    try {
      const c = JSON.parse(decodeURIComponent(escape(atob(code))));
      return {
        selected: 'spout',
        body: { finish: c.b }, spout: { model: c.s, finish: c.sf },
        handle: { model: c.h, finish: c.hf }, base: { finish: c.ba }, aerator: { finish: c.a },
      };
    } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem('mymonta:design', JSON.stringify(state)); } catch (e) {}
  }
  function load() {
    const h = location.hash.match(/d=([^&]+)/);
    if (h) { const s = decode(h[1]); if (s) return s; }
    try { const raw = localStorage.getItem('mymonta:design'); if (raw) return JSON.parse(raw); } catch (e) {}
    return null;
  }

  function openShare() {
    const code = encode();
    const url = location.origin + location.pathname + '#d=' + code;
    history.replaceState(null, '', '#d=' + code);
    $('#shareLink').value = url;
    // خلاصه‌ی طرح
    $('#summary').innerHTML = PARTS.map(meta => {
      const fk = state[meta.key].finish;
      let v = FINISHES[fk].name;
      if (meta.hasModel) {
        const mName = (meta.key === 'spout' ? spoutById(state.spout.model) : handleById(state.handle.model)).name;
        v = `${mName} · ${FINISHES[fk].name}`;
      }
      return `<div class="srow"><span class="l"><span class="sd" style="background:${swatchBg(fk)}"></span>${meta.name}</span><span class="v">${v}</span></div>`;
    }).join('');
    $('#modalBg').classList.add('on');
  }

  function toast(msg) {
    $('#toastMsg').textContent = msg;
    const t = $('#toast'); t.classList.add('on');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 2200);
  }

  /* ---------- top-level controls ---------- */
  $('#shareBtn').addEventListener('click', openShare);
  $('#shareBtn2').addEventListener('click', openShare);
  $('#closeModal').addEventListener('click', () => $('#modalBg').classList.remove('on'));
  $('#modalBg').addEventListener('click', e => { if (e.target.id === 'modalBg') $('#modalBg').classList.remove('on'); });
  $('#copyBtn').addEventListener('click', async () => {
    const inp = $('#shareLink');
    try { await navigator.clipboard.writeText(inp.value); }
    catch (e) { inp.select(); document.execCommand('copy'); }
    toast('پیوند طرح کپی شد');
  });
  $('#resetBtn').addEventListener('click', () => {
    state = structuredClone(DEFAULT);
    history.replaceState(null, '', location.pathname);
    renderFaucet(); renderPanel(); save(); toast('به حالت اولیه بازگشت');
  });
  $('#randomBtn').addEventListener('click', () => {
    const rf = () => FINISH_ORDER[Math.floor(Math.random() * FINISH_ORDER.length)];
    state.body.finish = rf(); state.base.finish = rf(); state.aerator.finish = rf();
    state.spout.finish = rf(); state.handle.finish = rf();
    state.spout.model = SPOUTS[Math.floor(Math.random() * SPOUTS.length)].id;
    state.handle.model = HANDLES[Math.floor(Math.random() * HANDLES.length)].id;
    renderFaucet(); renderPanel(); save(); toast('ترکیب تصادفی ساخته شد');
  });
  $('#zoomIn').addEventListener('click', () => { zoom = Math.min(1.6, zoom + 0.15); applyZoom(); });
  $('#zoomOut').addEventListener('click', () => { zoom = Math.max(0.7, zoom - 0.15); applyZoom(); });

  /* ---------- init ---------- */
  renderFaucet();
  renderPanel();
})();
