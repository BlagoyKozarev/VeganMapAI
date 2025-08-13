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
  // Helper function for icon sprite system
  function icon(name){
    return `<svg class="vm-ico"><use href="/assets/icons.svg#${name}"></use></svg>`;
  }
  
  // Thin wrappers for compatibility
  function iconSearch(){ return icon('search'); }
  function iconTarget(){ return icon('target'); }
  function iconUser(){ return icon('user'); }
  function iconSparkles(){ return icon('sparkles'); }

  function buildOverlay(){
    const host = document.createElement('div');
    host.id = 'vm-overlay';
    host.innerHTML = `
      <div class="row">
        <div class="vm-search">
          <span class="vm-fab-icon" aria-hidden="true">${icon('search')}</span>
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
        <button class="vm-fab" id="vm-fab-loc" title="Use my location"><span class="vm-fab-icon">${icon('target')}</span></button>
        <button class="vm-fab" id="vm-fab-prof" title="Profile"><span class="vm-fab-icon">${icon('user')}</span></button>
        <button class="vm-fab" id="vm-fab-ai" title="AI Assistant"><span class="vm-fab-icon">${icon('sparkles')}</span></button>
      </div>
    `;
    
    // Drawer (hidden by default)
    if (!document.getElementById('vm-drawer')) {
      const drawer = document.createElement('aside');
      drawer.id = 'vm-drawer';
      drawer.innerHTML = `
        <header>
          <strong>More filters</strong>
          <button class="vm-btn" id="vm-drawer-close">Close</button>
        </header>
        <div class="panel">
          <label>Price</label>
          <select id="mf-price">
            <option value="">Any</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
          </select>

          <label>Cuisine</label>
          <select id="mf-cuisine">
            <option value="">Any</option>
            <option value="american">American</option>
            <option value="asian">Asian</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
          </select>

          <label>Allergens</label>
          <select id="mf-allergens">
            <option value="">Any</option>
            <option value="gluten-free">Gluten-free</option>
            <option value="nut-free">Nut-free</option>
            <option value="soy-free">Soy-free</option>
          </select>

          <label>Min. Rating</label>
          <select id="mf-rating">
            <option value="">Any</option>
            <option value="9">9+</option>
            <option value="8">8+</option>
            <option value="7">7+</option>
          </select>
        </div>
        <div class="actions">
          <button class="vm-btn vm-btn-primary" id="mf-apply">Apply Filters</button>
        </div>
      `;
      document.body.appendChild(drawer);
    }
    
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
    // Search - removed duplicate handler since map-wire.js will handle it
    // $('#vm-q-go')?.addEventListener('click', ()=>{
    //   const q = $('#vm-q').value.trim();
    //   if (!q) return;
    //   alert('Search: '+q); // Handled by map-wire.js
    // });

    // Chips - removed duplicate handler for only-vegan since map-wire.js will handle it
    $('#vm-chips')?.addEventListener('click', (e)=>{
      const chip = e.target.closest('.vm-chip'); if (!chip) return;
      const key = chip.dataset.chip;
      // only-vegan is handled by map-wire.js
      if (key === 'more') {
        document.getElementById('vm-drawer')?.classList.add('open');
      } else if (key !== 'only-vegan' && key) {
        alert('Open filters: '+key); // TODO for other filters
      }
    });

    // FABS - removed duplicate handlers since map-wire.js will handle them
    // $('#vm-fab-loc')?.addEventListener('click', ()=>{
    //   alert('Would request geolocation and center the map.'); // Handled by map-wire.js
    // });
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
    
    // Drawer events
    $('#vm-drawer-close')?.addEventListener('click', ()=>{
      document.getElementById('vm-drawer')?.classList.remove('open');
    });
    // Apply filters button is now handled by map-wire.js
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