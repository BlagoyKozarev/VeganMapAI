(function() {
  'use strict';
  
  window.VM_UX = {
    init: function() {
      this.injectFiltersBar();
      this.injectPopover();
      this.injectScorePanel();
      this.bindEvents();
    },
    
    injectFiltersBar: function() {
      const mapRoot = document.getElementById('map-root') || document.getElementById('map');
      if (!mapRoot) return;
      
      const filtersBar = document.createElement('div');
      filtersBar.className = 'vm-bar';
      filtersBar.innerHTML = `
        <div class="vm-card">
          <div class="vm-row">
            <div class="vm-chip">
              💵 Price: 
              <select id="vm-price">
                <option value="">All</option>
                <option value="1">$</option>
                <option value="2">$$</option>
                <option value="3">$$$</option>
                <option value="4">$$$$</option>
              </select>
            </div>
            <div class="vm-chip">
              🍕 Cuisine:
              <select id="vm-cuisine">
                <option value="">All</option>
                <option value="italian">Italian</option>
                <option value="asian">Asian</option>
                <option value="american">American</option>
                <option value="mexican">Mexican</option>
                <option value="mediterranean">Mediterranean</option>
              </select>
            </div>
            <div class="vm-chip">
              ⚠️ Allergens:
              <select id="vm-allergen">
                <option value="">None</option>
                <option value="gluten-free">Gluten-free</option>
                <option value="nut-free">Nut-free</option>
                <option value="soy-free">Soy-free</option>
              </select>
            </div>
            <div class="vm-chip">
              <input type="checkbox" id="vm-vegan-only" style="width:16px;height:16px">
              <label for="vm-vegan-only" style="cursor:pointer">Only fully vegan</label>
            </div>
            <div class="vm-spacer"></div>
            <button class="vm-btn" onclick="window.VM_UX.showDemoPopover()">Demo popover</button>
          </div>
        </div>
      `;
      
      mapRoot.parentNode.insertBefore(filtersBar, mapRoot);
    },
    
    injectPopover: function() {
      const popover = document.createElement('div');
      popover.id = 'vm-pop';
      popover.innerHTML = `
        <h4>Demo Restaurant</h4>
        <div class="muted">123 Main Street, Sofia</div>
        <div class="actions">
          <button class="vm-btn" onclick="window.VM_UX.showDetails()">📋 View details</button>
          <button class="vm-btn" onclick="window.VM_UX.navigate()">🗺 Navigate</button>
          <button class="vm-btn" onclick="window.VM_UX.save()">💚 Save</button>
          <button class="vm-btn" onclick="window.VM_UX.report()">🚨 Report</button>
          <button class="vm-btn vm-btn-primary" onclick="window.VM_UX.showScore()">🌱 View Vegan Score</button>
        </div>
      `;
      document.body.appendChild(popover);
    },
    
    injectScorePanel: function() {
      const scorePanel = document.createElement('div');
      scorePanel.id = 'vm-score';
      scorePanel.innerHTML = `
        <header>
          <h3>Vegan Score Breakdown</h3>
          <button onclick="window.VM_UX.closeScore()" style="background:none;border:none;font-size:24px;cursor:pointer">&times;</button>
        </header>
        <div class="panel">
          <h4>Demo Restaurant</h4>
          <p style="color:#4b5563;font-size:14px">Overall Score: <strong style="color:#22c55e">8.5/10</strong></p>
          
          <div style="margin:20px 0">
            <div class="vm-kv">
              <span>🌱 Menu Variety</span>
              <span>9/10</span>
            </div>
            <div class="vm-meter"><span style="width:90%"></span></div>
          </div>
          
          <div style="margin:20px 0">
            <div class="vm-kv">
              <span>🏷️ Clear Labeling</span>
              <span>8/10</span>
            </div>
            <div class="vm-meter"><span style="width:80%"></span></div>
          </div>
          
          <div style="margin:20px 0">
            <div class="vm-kv">
              <span>👨‍🍳 Staff Knowledge</span>
              <span>7/10</span>
            </div>
            <div class="vm-meter"><span style="width:70%"></span></div>
          </div>
          
          <div style="margin:20px 0">
            <div class="vm-kv">
              <span>🛡️ Cross-Contamination</span>
              <span>9/10</span>
            </div>
            <div class="vm-meter"><span style="width:90%"></span></div>
          </div>
          
          <div style="margin:20px 0">
            <div class="vm-kv">
              <span>📱 Online Info</span>
              <span>8/10</span>
            </div>
            <div class="vm-meter"><span style="width:80%"></span></div>
          </div>
          
          <div style="margin:20px 0">
            <div class="vm-kv">
              <span>🎨 Creativity</span>
              <span>9/10</span>
            </div>
            <div class="vm-meter"><span style="width:90%"></span></div>
          </div>
          
          <div style="margin-top:30px;padding-top:20px;border-top:1px solid rgba(15,23,32,0.08)">
            <a href="/pages/score-methodology.html" style="color:#22c55e;text-decoration:none;font-weight:600">
              Learn about our scoring methodology →
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(scorePanel);
    },
    
    bindEvents: function() {
      // Close popover on click outside
      document.addEventListener('click', function(e) {
        const popover = document.getElementById('vm-pop');
        if (!popover.contains(e.target) && !e.target.classList.contains('vm-btn')) {
          popover.style.display = 'none';
        }
      });
      
      // Filter change handlers
      ['vm-price', 'vm-cuisine', 'vm-allergen', 'vm-vegan-only'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', function() {
            console.log('Filter changed:', id, el.value || el.checked);
          });
        }
      });
    },
    
    showDemoPopover: function() {
      const popover = document.getElementById('vm-pop');
      popover.style.display = 'block';
      popover.style.left = '50%';
      popover.style.top = '50%';
      popover.style.transform = 'translate(-50%, -50%)';
    },
    
    showDetails: function() {
      console.log('View details clicked');
      alert('View details - would show restaurant details modal');
    },
    
    navigate: function() {
      console.log('Navigate clicked');
      window.open('https://maps.google.com/maps?q=42.6977,23.3219', '_blank');
    },
    
    save: function() {
      console.log('Save clicked');
      alert('Restaurant saved to favorites!');
    },
    
    report: function() {
      console.log('Report clicked');
      alert('Report form would open here');
    },
    
    showScore: function() {
      document.getElementById('vm-score').classList.add('open');
      document.getElementById('vm-pop').style.display = 'none';
    },
    
    closeScore: function() {
      document.getElementById('vm-score').classList.remove('open');
    },
    
    // Public API for binding to real markers
    bindPins: function(markerNodes) {
      markerNodes.forEach(node => {
        node.addEventListener('click', function(e) {
          e.stopPropagation();
          const popover = document.getElementById('vm-pop');
          const rect = node.getBoundingClientRect();
          popover.style.display = 'block';
          popover.style.left = rect.left + 'px';
          popover.style.top = (rect.bottom + 10) + 'px';
        });
      });
    },
    
    openPopover: function(placeData) {
      const popover = document.getElementById('vm-pop');
      popover.querySelector('h4').textContent = placeData.name || 'Restaurant';
      popover.querySelector('.muted').textContent = placeData.address || 'No address';
      popover.style.display = 'block';
    }
  };
})();