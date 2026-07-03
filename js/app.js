
const data = JSON.parse(document.getElementById('reportData').textContent);
const fmt = new Intl.NumberFormat('en-GB');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateNumber(el, value){
  if(reduceMotion){ el.textContent = fmt.format(value); return; }
  const duration = 1100;
  const start = performance.now();
  function frame(now){
    const progress = Math.min(1, (now-start)/duration);
    const eased = 1 - Math.pow(1-progress, 3);
    el.textContent = fmt.format(Math.round(value*eased));
    if(progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function renderHeroMetrics(){
  const wrap = document.getElementById('heroMetrics');
  wrap.innerHTML = data.hero.map((m,i)=>`
    <article class="kpi-card" style="transition-delay:${i*80}ms">
      <div class="kpi-value" data-count="${m.value}">0</div>
      <div class="kpi-label">${m.label}</div>
      <p class="kpi-detail">${m.detail}</p>
    </article>`).join('');
}

function renderSocial(){
  const max = Math.max(...data.socialPlatforms.map(p=>p.followers));
  document.getElementById('socialBars').innerHTML = data.socialPlatforms.map(p=>{
    const width = (p.followers/max)*100;
    return `<div class="chart-row" style="--w:${width}%"><span>${p.name}</span><div class="chart-track"><div class="chart-fill"></div></div><span>${fmt.format(p.followers)}<br><small>${p.growth}</small></span></div>`;
  }).join('');
}

function renderCampaigns(){
  const max = Math.max(...data.campaigns.map(c=>c.mentions));
  document.getElementById('campaignCards').innerHTML = data.campaigns.map((c,i)=>{
    const width = (c.mentions/max)*100;
    return `<article class="campaign-card" style="transition-delay:${i*80}ms">
      <img src="assets/images/${c.image}" alt="">
      <div>
        <h3>${c.name}</h3>
        <div class="campaign-number">${fmt.format(c.mentions)}</div>
        <div class="campaign-bar" aria-hidden="true"><span style="--w:${width}%;--c:${c.colour}"></span></div>
        <p><strong>${c.share}%</strong> of campaign media mentions. ${c.text}</p>
      </div>
    </article>`;
  }).join('');
}

function observeElements(){
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        entry.target.querySelectorAll('[data-count]').forEach(el=>{
          if(el.dataset.done) return;
          el.dataset.done = '1';
          animateNumber(el, Number(el.dataset.count));
        });
      }
    });
  }, {threshold:.22});
  document.querySelectorAll('.scene,.kpi-card,.chart-row,.campaign-card').forEach(el=>observer.observe(el));
}

function updateProgress(){
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  document.getElementById('progressBar').style.width = `${pct}%`;
}

renderHeroMetrics();
renderSocial();
renderCampaigns();
observeElements();
updateProgress();
window.addEventListener('scroll', updateProgress, {passive:true});

document.getElementById('contrastToggle').addEventListener('click', e=>{
  const active = document.body.classList.toggle('high-contrast');
  e.currentTarget.setAttribute('aria-pressed', String(active));
});
