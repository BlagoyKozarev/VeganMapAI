// Bridge between the map and the overlay UI (VM_UX).
// Loads places from API or local JSON, renders markers (Leaflet), filters & search, and fits bounds.

(function(){
  const WIRE = {};
  const $ = (q,root=document)=>root.querySelector(q);

  // Toggle for extra logs: set window.VM_DEBUG = true in console if needed
  const log = (...args)=> { if (window.VM_DEBUG) console.log('[VM]', ...args); };
  const warn = (...args)=> console.warn('[VM]', ...args);
  const err = (...args)=> console.error('[VM]', ...args);

  // ---------------- Store ----------------
  const store = {
    all: [],
    filtered: [],
    filters: { onlyVegan:false, q:'', price:'', cuisine:'', allergen:'', minRating:'' },
  };
  
  // Cluster group for markers
  let cluster = null;

  // ---------------- Map helpers (Leaflet) ----------------
  function leaflet() { return !!(window.VM_MAP?.map && window.L); }
  function getMap(){ return window.VM_MAP?.map || null; }

  function setCenter(lat, lng, zoom){
    const m = getMap();
    if (leaflet()) m.setView([lat, lng], zoom ?? (m.getZoom() || 13));
  }

  function addMarker(place){
    if (!leaflet()) return null;
    const m = getMap();
    if (!m) return null;
    try {
      const marker = window.L.marker([place.lat, place.lng], { title: place.name });
      marker.__place = place;
      marker.on('click', ()=> openPlace(place));

      if (!cluster) {
        // Check if markerClusterGroup exists
        if (!window.L.markerClusterGroup) {
          console.error('[VM] MarkerCluster library not loaded! Falling back to regular markers.');
          // Fallback: add marker directly to map
          marker.addTo(m);
          window.VM_MAP.markers = window.VM_MAP.markers || [];
          window.VM_MAP.markers.push(marker);
          return marker;
        }
        
        cluster = window.L.markerClusterGroup({
          showCoverageOnHover: false,
          removeOutsideVisibleBounds: true,
          spiderfyOnMaxZoom: true,
          maxClusterRadius: 50
        });
        m.addLayer(cluster);
      }
      cluster.addLayer(marker);

      window.VM_MAP.markers = window.VM_MAP.markers || [];
      window.VM_MAP.markers.push(marker);
      return marker;
    } catch (e) {
      console.error('[VM] Failed to add marker - Error:', e.message || e, 'Place:', place.name);
      return null;
    }
  }

  function clearMarkers(){
    if (!leaflet()) return;
    if (cluster) {
      try { cluster.clearLayers(); } catch(_) {}
    }
    if (window.VM_MAP?.markers && Array.isArray(window.VM_MAP.markers)) {
      window.VM_MAP.markers.length = 0;
    }
  }

  function fitToPlaces(places){
    if (!leaflet()) return;
    const m = getMap();
    try {
      if (cluster && cluster.getLayers().length) {
        const cb = cluster.getBounds();
        if (cb && cb.isValid()) { m.fitBounds(cb.pad(0.12)); return; }
      }
      const pts = (places || []).filter(p=> isFinite(p.lat) && isFinite(p.lng));
      if (!pts.length) { log('fitToPlaces: nothing to fit'); return; }
      const bounds = window.L.latLngBounds(pts.map(p => [p.lat, p.lng]));
      m.fitBounds(bounds.pad(0.12));
    } catch(e) {
      warn('fitBounds failed', e);
    }
  }

  // ---------------- Data loading ----------------
  function isPlace(obj){
    return obj && typeof obj.id==='string'
      && typeof obj.name==='string'
      && typeof obj.address==='string'
      && typeof obj.lat==='number'
      && typeof obj.lng==='number';
  }

  function normalizePlace(p){
    // Ensure required fields & sane defaults
    return {
      id: String(p.id),
      name: String(p.name || 'Unknown'),
      address: String(p.address || ''),
      lat: Number(p.lat),
      lng: Number(p.lng),
      vegan_full: !!p.vegan_full,
      cuisines: Array.isArray(p.cuisines) ? p.cuisines.map(String) : [],
      price: p.price || '',
      score: (typeof p.score==='number' ? p.score : null),
      components: Array.isArray(p.components) ? p.components : [],
    };
  }

  async function fetchJson(url){
    const res = await fetch(url, { credentials:'same-origin' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
  }

  async function fetchData(){
    let data = [];
    // 1) Try API first
    try {
      const apiRes = await fetch('/api/places', { credentials:'same-origin' });
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (Array.isArray(apiData) && apiData.length) {
          data = apiData;
          log('Loaded from API:', data.length);
          console.log('Loaded from API:', data.length); // Always log this
        } else {
          log('API returned no data, will fallback to local JSON.');
        }
      } else {
        log('API not OK:', apiRes.status);
      }
    } catch (e) {
      log('API fetch failed, falling back to local JSON.', e);
    }

    // 2) Fallback to local JSON
    if (!data.length) {
      try {
        const localData = await fetchJson('/assets/data/places.json');
        if (Array.isArray(localData)) {
          data = localData;
          log('Loaded from local JSON:', data.length);
          console.log('Loaded from local JSON:', data.length); // Always log this
        }
      } catch (e) {
        err('Local JSON fetch failed.', e);
      }
    }

    // 3) Validate & normalize
    const good = (data || []).filter(isPlace).map(normalizePlace);
    if (!good.length) {
      warn('No valid places loaded. Check /api/places or /assets/data/places.json and schema.');
    }
    console.log('[VM] Loaded', good.length, 'valid places'); // Always log
    // Update store via public API (keeps filters & rerenders)
    WIRE.setPlaces(good);
  }

  // ---------------- Filter helpers ----------------
  function hasCuisine(p, wanted){
    if (!wanted) return true;
    return (p.cuisines||[]).map(x=>String(x).toLowerCase()).includes(String(wanted).toLowerCase());
  }
  function passPrice(p, wanted){
    if (!wanted) return true;               // '' => Any
    return String(p.price||'') === String(wanted);
  }
  function passAllergen(p, wanted){
    if (!wanted) return true;               // демо: няма реални полета -> винаги true
    // TODO: когато има реални данни: проверка по p.allergens и т.н.
    return true;
  }
  function passRating(p, min){
    if (!min) return true;
    const s = typeof p.score==='number' ? p.score : null;
    return s==null ? false : (s >= Number(min));
  }

  // ---------------- Filters & rendering ----------------
  function applyFilters(){
    store.filtered = store.all.filter(p=>{
      if (store.filters.onlyVegan && !p.vegan_full) return false;

      // Search по name / address / cuisines
      const needle = (store.filters.q||'').trim().toLowerCase();
      if (needle){
        const hay = [p.name, p.address, ...(p.cuisines||[])].join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }

      // NEW: Price / Cuisine / Allergen / Rating
      if (!passPrice(p, store.filters.price)) return false;
      if (!hasCuisine(p, store.filters.cuisine)) return false;
      if (!passAllergen(p, store.filters.allergen)) return false;
      if (!passRating(p, store.filters.minRating)) return false;

      return true;
    });
    renderMarkers();
  }

  function renderMarkers(){
    if (leaflet()) {
      clearMarkers();
      store.filtered.forEach(addMarker);
      fitToPlaces(store.filtered.length ? store.filtered : store.all);
    } else {
      // No Leaflet present — nothing to draw, but UI (sheet/score) still works if openPlace() is called elsewhere.
      log('Leaflet map not detected; renderMarkers skipped.');
    }
  }

  // ---------------- UI glue ----------------
  function openPlace(place){
    if (window.VM_UX?.openPlace) window.VM_UX.openPlace(place);
  }

  function wireOnlyVeganChip(){
    const chips = $('#vm-chips');
    if (!chips) return;
    chips.addEventListener('click', (e)=>{
      const chip = e.target.closest('.vm-chip'); if (!chip) return;
      if (chip.dataset.chip === 'only-vegan'){
        chip.dataset.on = (chip.dataset.on === '1') ? '0' : '1';
        store.filters.onlyVegan = (chip.dataset.on === '1');
        applyFilters();
      }
    });
  }

  function wireSearch(){
    const btn = $('#vm-q-go');
    const inp = $('#vm-q');
    if (!btn || !inp) return;
    const run = ()=>{
      store.filters.q = inp.value || '';
      applyFilters();
    };
    btn.addEventListener('click', run);
    inp.addEventListener('keydown', e=>{ if (e.key === 'Enter') run(); });
  }

  function onUseMyLocation(){
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    const btn = $('#vm-fab-loc'); 
    btn && btn.classList.add('loading');
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const { latitude, longitude } = pos.coords;
        setCenter(latitude, longitude, 15);
        btn && btn.classList.remove('loading');
      },
      e=>{
        alert('Location permission denied or unavailable.');
        btn && btn.classList.remove('loading');
      },
      { enableHighAccuracy:true, timeout:10000, maximumAge:60000 }
    );
  }

  // If host already has Leaflet markers and set marker.__place, hook clicks:
  function hookExistingMarkers(){
    if (!leaflet() || !window.VM_MAP?.markers) return;
    window.VM_MAP.markers.forEach(m=>{
      if (m && m.on && !m.__vm_hooked) {
        m.on('click', ()=> openPlace(m.__place || {}));
        m.__vm_hooked = true;
      }
    });
  }

  // ---------------- Public API ----------------
  WIRE.init = function(){
    console.log('[VM] map-wire init starting...');
    
    // Wire UI
    wireOnlyVeganChip();
    wireSearch();
    $('#vm-fab-loc')?.addEventListener('click', onUseMyLocation);

    // Drawer → прочитаме стойности и прилагаме
    const mfApply = document.getElementById('mf-apply');
    if (mfApply){
      mfApply.addEventListener('click', ()=>{
        const price   = (document.getElementById('mf-price')||{}).value || '';
        const cuisine = (document.getElementById('mf-cuisine')||{}).value || '';
        const allerg  = (document.getElementById('mf-allergens')||{}).value || '';
        const rating  = (document.getElementById('mf-rating')||{}).value || '';

        store.filters.price     = price;
        store.filters.cuisine   = cuisine;
        store.filters.allergen  = allerg;
        store.filters.minRating = rating;

        applyFilters();
        document.getElementById('vm-drawer')?.classList.remove('open');
      });
    }

    // If host already provided places before init:
    if (Array.isArray(window.VM_MAP?.places) && window.VM_MAP.places.length) {
      console.log('[VM] Using pre-loaded places:', window.VM_MAP.places.length);
      WIRE.setPlaces(window.VM_MAP.places);
    } else {
      console.log('[VM] Fetching places from API/JSON...');
      // Load from API/local
      fetchData();
    }

    // If host already has markers, hook their clicks
    hookExistingMarkers();

    log('map-wire init done');
  };

  WIRE.setPlaces = function(arr){
    if (!Array.isArray(arr)) { warn('setPlaces: not an array'); return; }
    store.all = arr.map(normalizePlace);
    // preserve current filters on refresh
    applyFilters();
  };

  WIRE.refresh = applyFilters;
  WIRE.openPlace = openPlace;
  WIRE.store = store; // Expose store for debugging/stats

  window.VM_WIRE = WIRE;
})();