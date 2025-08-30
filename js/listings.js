/* js/listings.js - loads approved listings from Firestore and renders them */
(async function(){
  if(!window.db) return console.error("Firestore not initialized");
  const cardsEl = document.getElementById('cards');
  const resultCount = document.getElementById('resultCount');
  const cityFilter = document.getElementById('cityFilter');
  const typeFilter = document.getElementById('typeFilter');
  const qInput = document.getElementById('q');
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const applyBtn = document.getElementById('applyFiltersBtn');
  const clearBtn = document.getElementById('clearFiltersBtn');
  const toggleMapBtn = document.getElementById('toggleMapBtn');
  const mapWrap = document.getElementById('mapWrap');
  let allListings = [];

  async function loadListings(){
    const snap = await db.collection('listings').where('status','==','approved').get();
    allListings = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    // populate city filter
    const cities = [...new Set(allListings.map(x=>x.city).filter(Boolean))];
    cityFilter.innerHTML = '<option value="">All Cities</option>' + cities.map(c=>`<option>${c}</option>`).join('');
    render();
  }

  function applyFilters(){
    const q = qInput.value.trim().toLowerCase();
    const city = cityFilter.value;
    const type = typeFilter.value;
    const min = parseInt(minPrice.value||0,10);
    const max = parseInt(maxPrice.value||0,10);
    let filtered = allListings.filter(l=>{
      if(city && l.city !== city) return false;
      if(type && l.type !== type) return false;
      if(min && l.priceINR < min) return false;
      if(max && max>0 && l.priceINR > max) return false;
      if(q){
        const text = `${l.name} ${l.city} ${l.type} ${l.description || ''}`.toLowerCase();
        if(!text.includes(q)) return false;
      }
      return true;
    });
    return filtered;
  }

  function render(){
    const items = applyFilters();
    resultCount.textContent = items.length;
    const currency = document.getElementById('currencySelect').value || 'INR';
    cardsEl.innerHTML = items.map(item=>{
      const price = formatCurrency(convert(item.priceINR || 0, currency), currency);
      const mapsEmbed = item.mapsEmbed || (item.mapsLink ? item.mapsLink.replace('/maps/place','/maps/embed') : '');
      return `
        <article class="card" data-id="${item.id}">
          <div class="media"><img src="${item.imageUrl || 'assets/images/placeholder.png'}" alt="${item.name}"></div>
          <div class="body">
            <div class="title-row">
              <h4>${item.name}</h4>
              <div class="muted">${(item.rating||0).toFixed(1)} ★</div>
            </div>
            <div class="muted">${item.city} • ${item.type||''}</div>
            <div class="muted">${item.amenities ? item.amenities.join(' • ') : ''}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
              <div class="price">${price} <small class="muted">/ night</small></div>
              <div>
                <a class="btn" href="listing-detail.html?id=${item.id}">View</a>
                <a class="button" href="${item.mapsLink|| '#'}" target="_blank" style="margin-left:8px">Directions</a>
              </div>
            </div>
            ${item.mapsLink ? `<div style="margin-top:8px"><iframe src="${mapsEmbed}" width="100%" height="160" style="border:0;" loading="lazy"></iframe></div>` : ''}
            ${item.videoUrl ? `<div style="margin-top:8px"><video controls width="100%"><source src="${item.videoUrl}" type="video/mp4"></video></div>` : ''}
          </div>
        </article>
      `;
    }).join('');
  }

  // events
  applyBtn.addEventListener('click', ()=>render());
  clearBtn.addEventListener('click', ()=>{
    qInput.value=''; cityFilter.value=''; typeFilter.value=''; minPrice.value=''; maxPrice.value='';
    render();
  });

  toggleMapBtn.addEventListener('click', ()=>{
    mapWrap.style.display = mapWrap.style.display === 'none' ? 'block' : 'none';
    toggleMapBtn.textContent = mapWrap.style.display === 'none' ? 'Show Map' : 'Hide Map';
    // lazy-load Google maps if shown
    if(mapWrap.style.display === 'block' && !window.google) {
      const s = document.createElement('script');
      s.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY";
      s.onload = () => { /* you can build map markers here if desired */ };
      document.head.appendChild(s);
    }
  });

  // currency select
  document.getElementById('currencySelect').addEventListener('change', render);

  // initial load
  loadListings();

})();

