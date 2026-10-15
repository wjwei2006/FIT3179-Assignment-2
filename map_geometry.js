/*
 * Australian state GeoJSON adapter for Vega-Lite.
 * Source: rowanhogan/australian-states, states.min.geojson.
 *
 * Why this exists:
 * - Source is normal RFC 7946 GeoJSON (anticlockwise exterior polygons).
 * - D3/Vega spherical geoshapes expect CLOCKWISE exterior rings.
 * - Some source geometries contain degenerate short or zero-area fragments.
 *   A degenerate island/ring must never blank the entire national map.
 *
 * All major state shapes are retained; malformed fragments are skipped with a
 * warning. A missing or entirely malformed state still causes a visible error.
 */
(function (root, factory) {
  const adapter = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = adapter;
  if (root) root.AustralianMapGeometry = adapter;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  const EXPECTED_STATES = [
    'New South Wales', 'Victoria', 'Queensland', 'South Australia',
    'Western Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory'
  ];
  const GEOJSON_URL = 'https://raw.githubusercontent.com/rowanhogan/australian-states/master/states.min.geojson';
  const EPS = 1e-11;

  function finitePoint(pt) {
    return Array.isArray(pt) && pt.length >= 2 &&
      typeof pt[0] === 'number' && typeof pt[1] === 'number' &&
      Number.isFinite(pt[0]) && Number.isFinite(pt[1]) &&
      pt[0] >= 105 && pt[0] <= 170 && pt[1] >= -55 && pt[1] <= -5;
  }
  function samePoint(a,b) { return a[0] === b[0] && a[1] === b[1]; }
  function signedArea(ring) {
    let sum = 0;
    for (let i=0; i<ring.length-1; i++) {
      sum += ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1];
    }
    return sum/2;
  }

  // Return null for a degenerate fragment, rather than crash the entire map.
  // Remove repeated adjacent points, close polygons, and set D3-compatible winding.
  function cleanRing(rawRing, clockwise) {
    if (!Array.isArray(rawRing)) return null;
    const points = [];
    for (const raw of rawRing) {
      if (!finitePoint(raw)) return null; // do not draw non-Australian coordinates
      const pt = [raw[0],raw[1]];
      if (!points.length || !samePoint(points[points.length-1],pt)) points.push(pt);
    }
    if (points.length > 1 && samePoint(points[0],points[points.length-1])) points.pop();
    if (points.length < 3) return null;
    points.push(points[0].slice());
    const area = signedArea(points);
    if (!Number.isFinite(area) || Math.abs(area) <= EPS) return null;
    // In lon/lat planar orientation: clockwise means a negative signed area.
    const isClockwise = area < 0;
    if (clockwise !== isClockwise) points.reverse();
    return points;
  }
  function cleanPolygon(rawPolygon, counters) {
    if (!Array.isArray(rawPolygon) || rawPolygon.length === 0) {
      counters.polygonsSkipped++;
      return null;
    }
    const shell = cleanRing(rawPolygon[0], true);
    if (!shell) {
      counters.polygonsSkipped++;
      return null;
    }
    const result = [shell];
    for (const hole of rawPolygon.slice(1)) {
      const clean = cleanRing(hole, false);
      if (clean) result.push(clean);
      else counters.holesSkipped++;
    }
    return result;
  }
  function cleanGeometry(geometry,counters) {
    if (!geometry) return null;
    let polygons;
    if (geometry.type === 'Polygon') polygons = [geometry.coordinates];
    else if (geometry.type === 'MultiPolygon') polygons = geometry.coordinates;
    else if (geometry.type === 'GeometryCollection') {
      polygons = [];
      for (const g of geometry.geometries || []) {
        if (g.type === 'Polygon') polygons.push(g.coordinates);
        if (g.type === 'MultiPolygon') polygons.push(...g.coordinates);
      }
    } else return null;
    if (!Array.isArray(polygons)) return null;
    const kept=polygons.map(p=>cleanPolygon(p,counters)).filter(Boolean);
    if (!kept.length) return null;
    // Always return Polygon/MultiPolygon; both are supported by Vega geoshape.
    return kept.length === 1 ? {type:'Polygon',coordinates:kept[0]} :
      {type:'MultiPolygon',coordinates:kept};
  }

  function normalizeFeatures(geojson) {
    if (!geojson || geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
      throw Error('State boundary file was not a GeoJSON FeatureCollection');
    }
    const counters={polygonsSkipped:0,holesSkipped:0};
    const cleaned=[];
    const seen = new Set();
    for(const feature of geojson.features) {
      const state=feature?.properties?.STATE_NAME;
      if (!EXPECTED_STATES.includes(state)) continue;
      if(seen.has(state)) throw Error('Duplicate state boundary: '+state);
      seen.add(state);
      const geometry=cleanGeometry(feature.geometry,counters);
      if (!geometry) throw Error('No usable polygon remains for '+state);
      cleaned.push({...feature,geometry});
    }
    const missing = EXPECTED_STATES.filter(n=>!seen.has(n));
    if(missing.length) throw Error('Missing Australian state boundaries: '+missing.join(', '));
    if(cleaned.length !== 8) throw Error('Expected 8 state boundaries, found '+cleaned.length);
    if(counters.polygonsSkipped || counters.holesSkipped) {
      console.warn('Australian map: skipped malformed GeoJSON fragments:',counters);
    }
    return cleaned;
  }
  async function load() {
    const res=await fetch(GEOJSON_URL,{cache:'no-cache'});
    if(!res.ok) throw Error('Australian boundary GeoJSON unavailable (HTTP '+res.status+')');
    return normalizeFeatures(await res.json());
  }
  return {EXPECTED_STATES,GEOJSON_URL,signedArea,cleanRing,normalizeFeatures,load};
});
