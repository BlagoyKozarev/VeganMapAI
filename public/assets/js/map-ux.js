(function(){
  const UX = {};
  const $ = (q,root=document)=>root.querySelector(q);
  const $$ = (q,root=document)=>Array.from(root.querySelectorAll(q));

  // Demo data (will be replaced with real place data)
  const demoPlace = {
    id: 'demo-1',
    name: 'Green Fork Diner',
    address: '123 Main St',
    lat: 0, lng: 0,
    score: 8.4,
    components: [
      {k:'Purity (Fully Vegan)', w:0.25, v:0.9},
      {k:'Menu Breadth', w:0.20, v:0.8},
      {k:'Ingredient Transparency', w:0.20, v:0.85},
      {k:'User Sentiment', w:0.20, v:0.82},
      {k:'Sustainability', w:0.10, v:0.7},
      {k:'Consistency', w:0.05, v:0.8},
    ]
  };

  function ensureContainers(){
    // Insert Filters bar above map
    const root = $('#map-root') || $('.map-root') || document.body;
    if (!$('#vm-bar')) {
      const bar = document.createElement('div');
      bar.id = 'vm-bar';
      bar.className = 'vm-bar';
      bar.innerHTML = `
        <div class="vm-card vm-row">
          <label class="vm-chip">Price
            <select id="vm-price">
              <option value="">Any</option>
              <option>$</option><option>$$</option><option>$$$</option>
            </select>
          </label>
          <label class="vm-chip">Cuisine
            <select id="vm-cuisine">
              <option value="">Any</option>
              <option value="american">American</option>
              <option value="asian">Asian</option>
              <option value="italian">Italian</option>
              <option value="mexican">Mexican</option>
            </select>
          </label>
          <label class="vm-chip">Allergens
            <select id="vm-allergens">
              <option value="">Any</option>
              <option value="gluten-free">Gluten‑free</option>
              <option value="nut-free">Nut‑free</option>
              <option value="soy-free">Soy‑free</option>
            </select>
          </label>
          <label class="vm-chip">
            <input type="checkbox" id="vm-fully"> Only fully vegan
          </label>
          <span class="vm-spacer"></span>
          <button class="vm-btn" id="vm-reset">Reset</button>
          <button class="vm-btn" id="vm-use">Use my location</button>
          <button class="vm-btn vm-btn-primary" id="vm-open-gmaps" disabled>Open in Google Maps</button>
          <button class="vm-btn" id="vm-demo">Demo popover</button>
        </div>
      `;
      root.parentNode.insertBefore(bar, root);
    }

    // Popover
    if (!$('#vm-pop')) {
      const pop = document.createElement('div');
      pop.id = 'vm-pop';
      pop.innerHTML = `
        <h4 id="vm-pop-title">Place</h4>
        <div class="muted" id="vm-pop-sub">Address</div>
        <div class="actions">
          <button class="vm-btn" data-act="details">View details</button>
          <button class="vm-btn" data-act="nav">Navigate</button>
          <button class="vm-btn" data-act="save">Save</button>
          <button class="vm-btn" data-act="report">Report</button>
          <button class="vm-btn vm-btn-primary" data-act="score">View Vegan Score</button>
        </div>
      `;
      document.body.appendChild(pop);
    }

    // Right Score Panel
    if (!$('#vm-score')) {
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
      document.body.appendChild(panel);
      $('#vm-score-close').addEventListener('click', ()=> panel.classList.remove('open'));
    }
  }

  function openPopover(place, x, y) {
    const pop = $('#vm-pop');
    $('#vm-pop-title').textContent = place.name || 'Place';
    $('#vm-pop-sub').textContent = place.address || '';
    pop.style.left = Math.max(12, (x||window.innerWidth/2)-150) + 'px';
    pop.style.top = Math.max(12, (y||120)) + 'px';
    pop.style.display = 'block';

    // enable "Open in Google Maps"
    const gbtn = $('#vm-open-gmaps');
    if (gbtn) gbtn.disabled = false;

    // actions
    pop.onclick = (e)=>{
      const act = e.target?.dataset?.act;
      if (!act) return;
      if (act==='details') window.location.href = `/place/${place.id||''}`;
      if (act==='nav') window.open(`https://maps.google.com/?q=${encodeURIComponent(place.name||'')}`, '_blank');
      if (act==='save') alert('Sign in required to save');
      if (act==='report') alert('Report form (todo)');
      if (act==='score') openScorePanel(place);
    };
  }

  function openScorePanel(place){
    const p = $('#vm-score');
    $('#vm-score-overall').textContent = (place.score!=null? place.score.toFixed(1): '—');
    const list = $('#vm-score-list');
    list.innerHTML = '';
    (place.components||[]).forEach(c=>{
      const row = document.createElement('div');
      row.className = 'vm-kv';
      const pct = Math.round(c.v*100);
      row.innerHTML = `
        <div>${c.k} <span style="color:var(--muted);font-size:12px;">(w:${(c.w*100)|0}%)</span></div>
        <div style="min-width:160px">
          <div class="vm-meter"><span style="width:${pct}%"></span></div>
        </div>
      `;
      list.appendChild(row);
    });
    p.classList.add('open');
  }

  function bindFilters(){
    $('#vm-reset')?.addEventListener('click', ()=>{
      $('#vm-price').value = '';
      $('#vm-cuisine').value = '';
      $('#vm-allergens').value = '';
      $('#vm-fully').checked = false;
      // TODO: trigger actual map refresh
    });
    $('#vm-use')?.addEventListener('click', ()=>{
      // TODO: wire to real geolocation centering
      alert('Would request geolocation and center the map.');
    });
    $('#vm-open-gmaps')?.addEventListener('click', ()=>{
      // If a selected place exists, deep link there; fallback to center
      window.open('https://maps.google.com/', '_blank');
    });
    $('#vm-demo')?.addEventListener('click', (e)=>{
      const rect = e.target.getBoundingClientRect();
      openPopover(demoPlace, rect.left, rect.bottom+8);
    });
  }

  // Public API
  UX.init = function(){
    ensureContainers();
    bindFilters();

    // Close popover on outside click
    document.addEventListener('click', (e)=>{
      const pop = $('#vm-pop');
      if (!pop) return;
      if (pop.style.display==='block' && !pop.contains(e.target) && !e.target.closest('#vm-demo')) {
        pop.style.display = 'none';
      }
    });
  };

  // Bind marker DOM nodes later if available
  UX.bindPins = function(nodes){
    (nodes||[]).forEach(node=>{
      node.addEventListener('click', (ev)=>{
        const place = {
          id: node.dataset.placeId,
          name: node.dataset.placeName,
          address: node.dataset.placeAddr,
          score: parseFloat(node.dataset.placeScore||''),
          components: demoPlace.components // replace with real
        };
        const r = node.getBoundingClientRect();
        openPopover(place, r.left+r.width/2, r.top);
      });
    });
  };

  // Open popover directly from a place object
  UX.openPopover = function(place, x, y){ openPopover(place, x, y); };

  window.VM_UX = UX;
})();