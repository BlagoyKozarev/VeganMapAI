(function(){
  const UX = {};
  const $ = (q,root=document)=>root.querySelector(q);

  const demoPlace = {
    id:'demo-1', name:'Demo Restaurant', address:'123 Main Street, Sofia',
    lat:0, lng:0, score:8.4,
    components:[
      {k:'Purity (Fully Vegan)', w:0.25, v:0.9},
      {k:'Menu Breadth', w:0.20, v:0.8},
      {k:'Ingredient Transparency', w:0.20, v:0.85},
      {k:'User Sentiment', w:0.20, v:0.82},
      {k:'Sustainability', w:0.10, v:0.7},
      {k:'Consistency', w:0.05, v:0.8},
    ]
  };

  /* ---------- UI builders ---------- */
  function iconTarget(){
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path>
      <circle cx="12" cy="12" r="9" stroke-opacity=".25"></circle>
    </svg>`;
  }
  function iconUser(){
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="8" r="4"></circle>
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
    </svg>`;
  }
  function iconSparkles(){
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"></path>
      <path d="M18 14l.8 1.8L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-1.2L18 14z"></path>
    </svg>`;
  }

  function buildOverlay(){
    const host = document.createElement('div');
    host.id = 'vm-overlay';
    host.innerHTML = `
      <div class="row">
        <div class="vm-search">
          <span class="vm-icon" aria-hidden="true"></span>
          <input id="vm-q" placeholder="Search restaurants, cuisines…" />
          <button id="vm-q-go" class="vm-chip" style="box-shadow:none;">Search</button>
        </div>
      </div>
      <div class="vm-chips" id="vm-chips">
        <button class="vm-chip" data-chip="restaurants">Restaurants</button>
        <!-- Cafés REMOVED -->
        <button class="vm-chip" data-chip="only-vegan" data-on="0">Only fully vegan</button>
        <button class="vm-chip" data-chip="price">$–$$$</button>
        <button class="vm-chip" data-chip="cuisine">Cuisine</button>
        <button class="vm-chip" data-chip="allergens">Allergens</button>
        <button class="vm-chip" data-chip="more">More filters</button>
      </div>

      <!-- FABS stack -->
      <div id="vm-fabs">
        <button class="vm-fab" id="vm-fab-loc" title="Use my location">${iconTarget()}</button>
        <button class="vm-fab" id="vm-fab-prof" title="Profile">${iconUser()}</button>
        <button class="vm-fab" id="vm-fab-ai" title="AI Assistant">${iconSparkles()}</button>
      </div>
    `;
    return host;
  }

  function buildSheet(){
    const sheet = document.createElement('div');
    sheet.id = 'vm-sheet';
    sheet.innerHTML = `
      <div class="vm-sheet-card" role="dialog" aria-label="Place actions">
        <div class="vm-handle"></div>
        <div class="vm-title">
          <div>
            <h4 id="vm-place-title">Place</h4>
            <div class="vm-sub" id="vm-place-sub">Address</div>
          </div>
          <button class="vm-btn" id="vm-sheet-close">Close</button>
        </div>
        <div class="vm-actions">
          <button class="vm-btn" data-act="details">View details</button>
          <button class="vm-btn" data-act="save">Save</button>
          <button class="vm-btn" data-act="report">Report</button>
          <!-- "Open in Google Maps" REMOVED by request -->
          <button class="vm-btn vm-btn-primary" data-act="score">View Vegan Score</button>
        </div>
      </div>
    `;
    return sheet;
  }

  function buildScorePanel(){
    const panel = document.createElement('aside');
    panel.id = 'vm-score';
    panel.innerHTML = `
      <header>
        <strong>Vegan Score</strong>
        <button class="vm-btn" id="vm-score-close">Close</button>
      </header>
      <div class="panel">
        <div class="vm-kv"><div>Overall</div><div id="vm-score-overall">—</div></div>
        <div id="vm-score-list"></div>
        <div style="margin-top:10px;">
          <a class="vm-btn" href="/pages/score-methodology.html">How this score is calculated</a>
        </div>
      </div>
    `;
    return panel;
  }

  /* ---------- Behavior ---------- */
  let currentPlace = null;

  function openSheet(place){
    currentPlace = place;
    $('#vm-place-title').textContent = place.name || 'Place';
    $('#vm-place-sub').textContent = place.address || '';
    $('#vm-sheet').classList.add('open');
  }
  function closeSheet(){ $('#vm-sheet').classList.remove('open'); }

  function openScorePanel(place){
    const p = $('#vm-score');
    $('#vm-score-overall').textContent = (place.score!=null? place.score.toFixed(1): '—');
    const list = $('#vm-score-list'); list.innerHTML = '';
    (place.components||[]).forEach(c=>{
      const row = document.createElement('div'); row.className='vm-kv';
      const pct = Math.round(c.v*100);
      row.innerHTML = `
        <div>${c.k} <span style="color:var(--muted);font-size:12px;">(w:${(c.w*100)|0}%)</span></div>
        <div style="min-width:160px"><div class="vm-meter"><span style="width:${pct}%"></span></div></div>
      `;
      list.appendChild(row);
    });
    p.classList.add('open');
  }
  function closeScorePanel(){ $('#vm-score').classList.remove('open'); }

  function wireEvents(){
    // Search
    $('#vm-q-go')?.addEventListener('click', ()=>{
      const q = $('#vm-q').value.trim();
      if (!q) return;
      alert('Search: '+q); // TODO: hook to real map search
    });

    // Chips
    $('#vm-chips')?.addEventListener('click', (e)=>{
      const chip = e.target.closest('.vm-chip'); if (!chip) return;
      const key = chip.dataset.chip;
      if (key === 'only-vegan'){
        chip.dataset.on = chip.dataset.on === '1' ? '0' : '1';
        // TODO: apply filter
      } else {
        alert('Open filters: '+key); // TODO
      }
    });

    // FABS
    $('#vm-fab-loc')?.addEventListener('click', ()=>{
      alert('Would request geolocation and center the map.'); // TODO
    });
    $('#vm-fab-prof')?.addEventListener('click', ()=>{
      window.location.href = '/auth?next=/test-map';
    });
    $('#vm-fab-ai')?.addEventListener('click', ()=>{
      alert('AI Assistant (coming soon)'); // later: open assistant panel
    });

    // Sheet
    $('#vm-sheet-close')?.addEventListener('click', closeSheet);
    $('#vm-sheet')?.addEventListener('click', (e)=>{
      const act = e.target?.dataset?.act; if (!act) return;
      if (act==='details') window.location.href = `/place/${currentPlace?.id||''}`;
      if (act==='save') alert('Sign in required to save');
      if (act==='report') alert('Report form (todo)');
      if (act==='score') openScorePanel(currentPlace||demoPlace);
    });

    // Score panel
    document.addEventListener('click', (e)=>{
      if (e.target?.id === 'vm-score') closeScorePanel();
    });
    $('#vm-score-close')?.addEventListener('click', closeScorePanel);
  }

  /* ---------- Public API ---------- */
  UX.init = function(){
    const outer = document.getElementById('map-root')
              || document.querySelector('.vm-map-root')
              || document.querySelector('.leaflet-container')?.parentElement
              || document.body;

    if (!outer) return;
    if (getComputedStyle(outer).position === 'static') { outer.style.position = 'relative'; }

    if (!document.getElementById('vm-overlay')) outer.appendChild(buildOverlay());
    if (!document.getElementById('vm-sheet')) document.body.appendChild(buildSheet());
    if (!document.getElementById('vm-score')) document.body.appendChild(buildScorePanel());

    wireEvents();

    // Keep overlay anchored to OUTER in case the map library re-parents nodes
    const mo = new MutationObserver(()=>{
      const ov = document.getElementById('vm-overlay');
      if (ov && ov.parentElement !== outer) { outer.appendChild(ov); }
    });
    mo.observe(outer, { childList:true, subtree:true });
  };

  // Bind marker DOM nodes (optional)
  UX.bindPins = function(nodes){
    (nodes||[]).forEach(node=>{
      node.addEventListener('click', ()=>{
        const place = {
          id: node.dataset.placeId,
          name: node.dataset.placeName,
          address: node.dataset.placeAddr,
          lat: parseFloat(node.dataset.placeLat||''),
          lng: parseFloat(node.dataset.placeLng||''),
          score: parseFloat(node.dataset.placeScore||''),
          components: demoPlace.components
        };
        openSheet(place);
      });
    });
  };

  // Open place programmatically
  UX.openPlace = function(place){ openSheet(place || demoPlace); };

  window.VM_UX = UX;
})();