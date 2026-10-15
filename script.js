const chartNames = ["01_registrations_trend", "02_state_year_heatmap", "03_state_rank_bump", "04_choropleth_reg_rate", "05_symbol_map_donors", "06_tile_grid_consent", "07_state_change_dumbbell", "08_age_sex_pyramid", "09_age_mix_state_heatmap", "10_family_agreement", "11_donation_pathway", "12_treemap_registrations", "13_waffle_coverage"];
function fallback(el, name, message) {
  const b=document.createElement('div');
  b.className='chart-error';
  b.style.cssText='font-size:13px;color:#9e4d45;text-align:left;background:#fff2ee;border:1px solid #efc9c2;padding:17px;border-radius:8px;width:100%';
  b.textContent=`Could not display ${name}. ${message}. Try reloading and check the browser Console (F12).`;
  el.replaceChildren(b);
}
// Load/rewind the state shapes once. Keeping an error if the remote file ever changes
// is safer than silently publishing an Australia map with missing states.
let AustralianShapesPromise;
function getAustralianShapes() {
  if(!AustralianShapesPromise) AustralianShapesPromise = window.AustralianMapGeometry.load();
  return AustralianShapesPromise;
}
async function renderOne(name,index) {
  const node=document.getElementById(`chart-${index+1}`);
  if(!node)return;
  try {
    const response=await fetch(`charts/${name}.json`);
    if(!response.ok) throw Error('Chart JSON returned '+response.status);
    const spec=await response.json();
    if(!window.vegaEmbed)throw Error('Vega libraries did not load');
    if(index===3 || index===4) {
      // Geoshape data is now normalized to D3 winding and verified to include all states.
      const features=await getAustralianShapes();
      if(index===3) spec.data={values:features};
      else spec.layer[0].data={values:features};
      // Vega-Lite automatically fits the full Australian geography to the map viewport.
      // Do not restore a fixed Mercator scale or try to center by raw longitude values.
      spec.projection={type:'mercator'};
      spec.height=index===3?440:400;
      console.info('Australian map ready',name,features.map(f=>f.properties.STATE_NAME));
    }
    await window.vegaEmbed(node,spec,{renderer:'svg',actions:{export:true,source:true,editor:true},tooltip:{theme:'custom'}});
  } catch(err) {
    console.error(name,err);
    fallback(node,name,err.message);
  }
}
window.addEventListener('load',()=>chartNames.forEach((name,i)=>renderOne(name,i)));
