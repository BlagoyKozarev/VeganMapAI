// Minimal bridge between the Map and the overlay UI (VM_UX).
// Works with Leaflet if available; otherwise falls back to demo DOM markers.

(function(){
  const WIRE = {};
  const $ = (q,root=document)=>root.querySelector(q);
  const hasLeaflet = !!(window.L || (window.VM_MAP && window.VM_MAP.map));

  // --- DATA STORE ---
  const store = {
    all: [],
    filtered: [],
    filters: { onlyVegan:false, q:'' },
  };

  // --- FETCH DATA ---
  async function fetchData(){
    let data = [];
    try {
      // Try API endpoint first
      const apiRes = await fetch('/api/places');
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (Array.isArray(apiData) && apiData.length) {
          data = apiData;
        }
      }
    } catch(e) {
      console.warn('API fetch failed, falling back to local JSON.', e);
    }
    
    if (!data.length) {
      try {
        const localRes = await fetch('/assets/data/places.json');
        if (localRes.ok) {
          const localData = await localRes.json();
          if (Array.isArray(localData)) data = localData;
        }
      } catch(e) {
        console.error('Local JSON fetch failed.', e);
      }
    }
    
    if (data.length) {
      window.VM_WIRE.setPlaces(data);
    } else {
      console.warn('No place data loaded.');
    }
  }

  // --- MAP HELPERS (Leaflet-first; otherwise no-op) ---
  function getMap(){
    if (window.VM_MAP && window.VM_MAP.map) return window.VM_MAP.map;
    return null;
  }
  function setCenter(lat, lng, zoom){
    const m = getMap();
    if (m && m.setView) { m.setView([lat, lng], zoom || m.getZoom() || 13); }
  }
  function addMarker(place){
    const m = getMap();
    if (!m || !window.L) return null;
    const marker = window.L.marker([place.lat, place.lng]).addTo(m);
    marker.__place = place;
    marker.on('click', ()=> openPlace(place));
    window.VM_MAP.markers = window.VM_MAP.markers || [];
    window.VM_MAP.markers.push(marker);
    return marker;
  }
  function clearMarkers(){
    const m = getMap();
    if (!m || !window.L || !window.VM_MAP?.markers) return;
    window.VM_MAP.markers.forEach(x => { try { m.removeLayer(x); } catch(_){} });
    window.VM_MAP.markers = [];
  }

  // --- FILTERING & SEARCH ---
  function applyFilters(){
    const { onlyVegan, q } = store.filters;
    const qn = (q||'').trim().toLowerCase();
    store.filtered = store.all.filter(p=>{
      if (onlyVegan && !p.vegan_full) return false;
      if (qn) {
        const hay = [p.name, p.address, ...(p.cuisines||[])].join(' ').toLowerCase();
        if (!hay.includes(qn)) return false;
      }
      return true;
    });
    renderMarkers();
  }

  function renderMarkers(){
    // If host already provides markers, we only hide/show via opacity;
    // else we create Leaflet markers here.
    if (getMap() && window.L) {
      clearMarkers();
      store.filtered.forEach(addMarker);
    } else {
      // Fallback: bind to DOM nodes if any are present with data attrs (optional)
      // Or do nothing — the UX layer still works with VM_UX.openPlace(demo).
    }
  }

  // --- OPEN PLACE (→ bottom sheet) ---
  function openPlace(place){
    if (window.VM_UX && window.VM_UX.openPlace) window.VM_UX.openPlace(place);
  }

  // --- A) Use my location ---
  function onUseMyLocation(){
    if (!navigator.geolocation) return alert('Geolocation not supported.');
    $('#vm-fab-loc')?.classList.add('loading');
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const { latitude, longitude } = pos.coords;
        setCenter(latitude, longitude, 15);
        $('#vm-fab-loc')?.classList.remove('loading');
      },
      err=>{
        alert('Location permission denied or unavailable.');
        $('#vm-fab-loc')?.classList.remove('loading');
      },
      { enableHighAccuracy:true, timeout:10000, maximumAge:60000 }
    );
  }

  // --- B) Wire marker clicks (if host already has markers) ---
  function hookExistingMarkers(){
    if (!window.VM_MAP?.markers) return;
    window.VM_MAP.markers.forEach(m=>{
      if (m && m.on && !m.__vm_hooked) {
        m.on('click', ()=> openPlace(m.__place || {}));
        m.__vm_hooked = true;
      }
    });
  }

  // --- C) Only fully vegan chip ---
  function wireOnlyVeganChip(){
    const chips = document.getElementById('vm-chips');
    if (!chips) return;
    chips.addEventListener('click', (e)=>{
      const chip = e.target.closest('.vm-chip'); if (!chip) return;
      if (chip.dataset.chip === 'only-vegan'){
        chip.dataset.on = chip.dataset.on === '1' ? '0' : '1';
        store.filters.onlyVegan = (chip.dataset.on === '1');
        applyFilters();
      }
    });
  }

  // --- D) Search ---
  function wireSearch(){
    const btn = document.getElementById('vm-q-go');
    const inp = document.getElementById('vm-q');
    if (!btn || !inp) return;
    const run = ()=>{ store.filters.q = inp.value || ''; applyFilters(); };
    btn.addEventListener('click', run);
    inp.addEventListener('keydown', e=>{ if (e.key === 'Enter') run(); });
  }

  // --- E) Score panel: done in VM_UX.openPlace (uses place.components/score) ---

  // --- INIT ---
  WIRE.init = function(){
    // Expose helpers for future integration first
    window.VM_WIRE = window.VM_WIRE || {};
    window.VM_WIRE.refresh = applyFilters;
    window.VM_WIRE.openPlace = openPlace;
    window.VM_WIRE.setPlaces = (arr)=>{ store.all = Array.isArray(arr)? arr:[]; applyFilters(); };
    
    // If host provides initial places, merge them in
    if (window.VM_MAP?.places && Array.isArray(window.VM_MAP.places)) {
      store.all = window.VM_MAP.places;
    }

    // Wire UI events
    wireOnlyVeganChip();
    wireSearch();

    // "Use my location"
    document.getElementById('vm-fab-loc')?.addEventListener('click', onUseMyLocation);

    // Fetch data and render
    if (store.all.length === 0) {
      // No initial data, fetch from API/JSON
      fetchData().then(()=>{
        store.filtered = store.all.slice(0);
        renderMarkers();
        hookExistingMarkers();
      });
    } else {
      // Use existing data from VM_MAP
      store.filtered = store.all.slice(0);
      renderMarkers();
      hookExistingMarkers();
    }

    // If you want to open a demo place immediately (dev):
    // setTimeout(()=> openPlace(store.all[0]), 800);
  };

  window.VM_WIRE = WIRE;
})();