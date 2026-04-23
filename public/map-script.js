
const API_BASE = '/api';

// Load Supabase faskes to Leaflet map
let map = L.map('rs-sehat-map').setView([-7.33, 110.51], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let facilities = [];
let markers = [];

async function loadFaskesToMap() {
  try {
    const response = await fetch(`${API_BASE}/faskes`);
    const result = await response.json();
    facilities = result.data || [];
    
    // Filter valid lat/lng + map fields
    facilities = facilities.map(f => ({
      id: f.id_faskes,
      name: f.nama_faskes || f.nama,
      address: f.alamat,
      lat: f.lattitude || f.latitude,
      lng: f.longitude,
      type: f.jenis || 'clinic',
      bpjs: f.terima_bpjs
    })).filter(f => f.lat && f.lng && f.lat != 0);
    
    facilities.forEach(facility => {
      const icon = getIcon(facility.type);
      const marker = L.marker([facility.lat, facility.lng], {icon}).addTo(map)
        .bindPopup(`
          <b>${facility.name}</b><br>
          ${facility.address}<br>
          BPJS: ${facility.bpjs ? '✅' : '❌'}<br>
          <a href="https://maps.google.com/?q=${facility.lat},${facility.lng}" target="_blank">Arah</a>
        `);
      markers.push(marker);
    });
    
    console.log(`Map: ${facilities.length} facilities loaded`);
  } catch (e) {
    console.error('Map load error:', e);
  }
}

function getIcon(type) {
  const icons = {
    rs: L.divIcon({html: '<i class="fas fa-hospital text-red"></i>', className: 'map-icon'}),
    faskes: L.divIcon({html: '<i class="fas fa-clinic-medical text-blue"></i>', className: 'map-icon'})
  };
  return icons[type] || icons.faskes;
}

// GPS
document.getElementById('locateBtn')?.addEventListener('click', () => map.locate());

map.on('locationfound', e => {
  L.marker(e.latlng).addTo(map).bindPopup('Your location').openPopup();
  map.setView(e.latlng, 14);
});

loadFaskesToMap();

