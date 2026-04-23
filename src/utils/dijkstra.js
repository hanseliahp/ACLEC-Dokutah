'use strict';

/**
 * src/utils/dijkstra.js
 * Implementasi Algoritma Dijkstra untuk mencari faskes terdekat
 * dari lokasi pengguna di Kota Salatiga.
 *
 * Konsep JS yang diterapkan:
 * - Pure functions
 * - Higher-order functions (map, filter, reduce)
 * - Destructuring
 * - Arrow functions
 * - Object.create(null) untuk pure map
 * - Priority Queue via array sorting (min-heap sederhana)
 */

const { calculateDistance } = require('./geoHelper');

// ─── Priority Queue (Min-Heap sederhana) ──────────────────────────────────────
class MinPriorityQueue {
  constructor() { this._data = []; }

  enqueue(node, priority) {
    this._data.push({ node, priority });
    this._data.sort((a, b) => a.priority - b.priority); // ascending
  }

  dequeue() { return this._data.shift(); }

  isEmpty() { return this._data.length === 0; }
}

/**
 * buildGraph — membangun graf dari daftar lokasi faskes.
 * Setiap node = id faskes, edge = jarak antar faskes (km).
 * Node 'USER' adalah titik asal pengguna.
 *
 * @param {{ lat: number, lng: number }} userLocation - koordinat pengguna
 * @param {Array} faskesList - array faskes dengan id_faskes, latitude, longitude, nama, dll
 * @returns {{ adjacency: Object, nodes: string[] }}
 */
const buildGraph = (userLocation, faskesList) => {
  // adjacency list: { nodeId: [{ to, weight }] }
  const adjacency = Object.create(null);
  const USER_NODE = 'USER';

  // Inisialisasi semua node
  adjacency[USER_NODE] = [];
  faskesList.forEach(f => {
    const id = String(f.id_faskes || f.id_rumah_sakit || f.id);
    adjacency[id] = [];
  });

  // Tambahkan edge dari USER ke setiap faskes
  faskesList.forEach(f => {
    const id  = String(f.id_faskes || f.id_rumah_sakit || f.id);
    const lat = parseFloat(f.latitude || f.lat || f.lattitude);
    const lng = parseFloat(f.longitude || f.lng);

    if (isNaN(lat) || isNaN(lng)) return;

    const dist = calculateDistance(userLocation, { lat, lng });

    // Edge USER → faskes
    adjacency[USER_NODE].push({ to: id, weight: dist });

    // Edge faskes → USER (undirected)
    adjacency[id].push({ to: USER_NODE, weight: dist });

    // Edge faskes ↔ faskes lain (untuk jalur alternatif via faskes)
    faskesList.forEach(other => {
      const otherId  = String(other.id_faskes || other.id_rumah_sakit || other.id);
      if (otherId === id) return;

      const otherLat = parseFloat(other.latitude || other.lat || other.lattitude);
      const otherLng = parseFloat(other.longitude || other.lng);
      if (isNaN(otherLat) || isNaN(otherLng)) return;

      const edgeDist = calculateDistance({ lat, lng }, { lat: otherLat, lng: otherLng });
      adjacency[id].push({ to: otherId, weight: edgeDist });
    });
  });

  const nodes = [USER_NODE, ...faskesList.map(f =>
    String(f.id_faskes || f.id_rumah_sakit || f.id)
  )];

  return { adjacency, nodes };
};

/**
 * dijkstra — Algoritma Dijkstra untuk shortest path dari source ke semua node.
 *
 * @param {Object} adjacency - adjacency list hasil buildGraph
 * @param {string} source - node awal ('USER')
 * @returns {{ distances: Object, previous: Object }}
 */
const dijkstra = (adjacency, source) => {
  const distances = Object.create(null); // jarak terpendek dari source ke setiap node
  const previous  = Object.create(null); // node sebelumnya dalam jalur terpendek
  const visited   = new Set();
  const pq        = new MinPriorityQueue();

  // Inisialisasi: semua jarak = Infinity kecuali source = 0
  Object.keys(adjacency).forEach(node => {
    distances[node] = node === source ? 0 : Infinity;
    previous[node]  = null;
  });

  pq.enqueue(source, 0);

  while (!pq.isEmpty()) {
    const { node: current } = pq.dequeue();

    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = adjacency[current] || [];
    neighbors.forEach(({ to, weight }) => {
      if (visited.has(to)) return;

      const newDist = distances[current] + weight;
      if (newDist < distances[to]) {
        distances[to] = newDist;
        previous[to]  = current;
        pq.enqueue(to, newDist);
      }
    });
  }

  return { distances, previous };
};

/**
 * getShortestPath — rekonstruksi jalur dari source ke target.
 *
 * @param {Object} previous - hasil dijkstra.previous
 * @param {string} target
 * @returns {string[]} - array node dari source ke target
 */
const getShortestPath = (previous, target) => {
  const path = [];
  let current = target;

  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
};

/**
 * findNearestFaskes — fungsi utama yang dipakai controller.
 * Menjalankan Dijkstra dan mengembalikan faskes yang diurutkan
 * berdasarkan jarak terpendek dari lokasi pengguna.
 *
 * @param {{ lat: number, lng: number }} userLocation
 * @param {Array} faskesList
 * @param {number} [topN=10] - ambil N terdekat
 * @returns {Array} faskes yang sudah diurutkan + field distance_km & path
 */
const findNearestFaskes = (userLocation, faskesList, topN = 10) => {
  if (!faskesList.length) return [];

  const { adjacency } = buildGraph(userLocation, faskesList);
  const { distances, previous } = dijkstra(adjacency, 'USER');

  // Map hasil ke faskes list + tambahkan distance dan path
  const enriched = faskesList
    .map(f => {
      const id       = String(f.id_faskes || f.id_rumah_sakit || f.id);
      const dist     = distances[id] ?? Infinity;
      const path     = dist < Infinity ? getShortestPath(previous, id) : [];

      return {
        ...f,
        distance_km:    Math.round(dist * 100) / 100,
        dijkstra_path:  path,
        algoritma:      'Dijkstra',
      };
    })
    .filter(f => f.distance_km < Infinity)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, topN);

  return enriched;
};

module.exports = { findNearestFaskes, dijkstra, buildGraph };
