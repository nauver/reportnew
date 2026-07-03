
const data = JSON.parse(document.getElementById('reportData').textContent);
const fmt = new Intl.NumberFormat('en-GB');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateNumber(el, value, suffix = ''){
  if(reduceMotion || Number.isNaN(value)){ el.textContent = fmt.format(value) + suffix; return; }
  const duration = 1050;
  const start = performance.now();
  function frame(now){
    const progress = Math.min(1, (now-start)/duration);
    const eased = 1 - Math.pow(1-progress, 3);
    el.textContent = fmt.format(Math.round(value*eased)) + suffix;
    if(progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function renderHero(){
  const wrap = document.getElementById('heroMetrics');
  wrap.innerHTML = data.hero.map((m,i)=>`<article class="metric-card glass reveal" style="animation-delay:${i*90}ms"><div class="metric-value" data-value="${m.value}" data-suffix="${m.suffix || ''}">0</div><div class="metric-label">${m.label}</div><p class="metric-detail">${m.detail}</p></article>`).join('');
  wrap.querySelectorAll('.metric-value').forEach(el=>animateNumber(el, Number(el.dataset.value), el.dataset.suffix));
}

function renderMetricGrid(){
  const wrap = document.getElementById('metricGrid');
  wrap.innerHTML = data.hero.map((m,i)=>`<article class="metric-card reveal" style="animation-delay:${i*90}ms"><div class="metric-value">${fmt.format(m.value)}</div><div class="metric-label">${m.label}</div><p class="metric-detail">${m.detail}</p></article>`).join('');
}

function renderChannels(){
  document.getElementById('channelCards').innerHTML = data.channels.map((c,i)=>`<button class="channel-card" aria-expanded="false"><img src="assets/images/${c.image}" alt=""><strong>${c.name}</strong><div class="channel-value">${c.value}</div><p><b>${c.trend}</b></p><div class="channel-text">${c.text}</div></button>`).join('');
  document.querySelectorAll('.channel-card').forEach(card=>card.addEventListener('click',()=>card.setAttribute('aria-expanded', card.getAttribute('aria-expanded') !== 'true')));
}

function renderCampaigns(){
  const max = Math.max(...data.campaigns.map(c=>c.mentions));
  document.getElementById('campaignBars').innerHTML = data.campaigns.map(c=>`<div class="bar-row"><div class="bar-header"><span>${c.name}</span><span>${fmt.format(c.mentions)} · ${c.share}%</span></div><div class="bar-track"><div class="bar-fill" style="background:${c.colour};width:${(c.mentions/max)*100}%"></div></div><p>${c.text}</p></div>`).join('');
}

function renderSocial(){
  const max = Math.max(...data.socialPlatforms.map(p=>p.followers));
  document.getElementById('socialBars').innerHTML = data.socialPlatforms.map(p=>`<div class="chart-row"><span>${p.name}</span><div class="chart-track"><div class="chart-fill" style="width:${(p.followers/max)*100}%"></div></div><span>${fmt.format(p.followers)}<br><small>${p.growth}</small></span></div>`).join('');
}

function renderEvents(){
  document.getElementById('eventTimeline').innerHTML = data.events.map(e=>`<article class="event-card"><strong>${e.value}</strong><h3>${e.name}</h3><p>${e.text}</p></article>`).join('');
}

function renderDigital(){
  document.getElementById('digitalCards').innerHTML = data.digital.map(item=>`<article class="mini-card"><strong>${item.value}</strong><span>${item.label}</span><p>${item.detail}</p></article>`).join('');
}

function renderLessons(){
  document.getElementById('lessonList').innerHTML = data.lessons.map(l=>`<li>${l}</li>`).join('');
}

function activate(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active', p.id===id));
  document.querySelectorAll('.nav-pill').forEach(b=>b.classList.toggle('active', b.dataset.target===id));
  const panel = document.getElementById(id);
  if(panel){
    panel.focus({preventScroll:true});
    panel.scrollIntoView({block:'start'});
  }
}

document.querySelectorAll('.nav-pill').forEach(btn=>btn.addEventListener('click',()=>activate(btn.dataset.target)));
document.querySelectorAll('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>activate(btn.dataset.jump)));
document.getElementById('contrastToggle').addEventListener('click', e=>{
  const active = document.body.classList.toggle('high-contrast');
  e.currentTarget.setAttribute('aria-pressed', String(active));
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('is-visible'); }
  });
},{threshold:.18});

document.querySelectorAll('.panel, .story-card, .image-tile').forEach(el=>observer.observe(el));

renderHero();
renderMetricGrid();
renderChannels();
renderCampaigns();
renderSocial();
renderEvents();
renderDigital();
renderLessons();
