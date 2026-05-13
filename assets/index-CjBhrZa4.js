(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[],t={pricing:[],keysystem:[],platform:[],type:[],detection:[],status:[]},n=`name`,r=``;function i(e){let t=document.getElementById(`toast-container`),n=document.createElement(`div`);n.className=`toast`,n.textContent=e,t.appendChild(n),setTimeout(()=>{n.style.opacity=`0`,setTimeout(()=>n.remove(),300)},2e3)}function a(e){navigator.clipboard.writeText(e).then(()=>{i(`Link copied!`)})}async function o(){try{e=(await(await fetch(`./data.json`)).json()).map(e=>({name:e.title||`Unknown`,version:e.version||`N/A`,pricing:e.free?`free`:`paid`,price:e.cost||(e.free?`Free`:`Paid`),keysystem:e.keysystem?`keysystem`:`keyless`,platforms:[e.platform].filter(Boolean),detection:e.detected?`Detected`:e.clientmods?`Bypass`:`Undetected`,sUNC:e.suncPercentage||0,UNC:e.uncPercentage||0,decompiler:!!e.decompiler,multiInstance:!!e.multiInject,raknet:!!e.raknet,updated:!!e.updateStatus,link:e.websitelink||`#`,type:e.extype&&e.extype.includes(`external`)?`external`:`internal`})),s()}catch(e){console.error(`Error loading data:`,e),i(`Error loading JSON data!`)}}function s(){let i=document.getElementById(`executors-container`),o=document.getElementById(`results-count`);if(!i)return;i.innerHTML=``;let s=e.filter(e=>{if(r&&!e.name.toLowerCase().includes(r.toLowerCase())||t.pricing.length>0&&!t.pricing.includes(e.pricing)||t.keysystem.length>0&&!t.keysystem.includes(e.keysystem)||t.platform.length>0&&!e.platforms.some(e=>t.platform.includes(e))||t.type.length>0&&!t.type.includes(e.type)||t.detection.length>0&&!t.detection.includes(e.detection))return!1;if(t.status.length>0){let n=e.updated?`updated`:`outdated`;if(!t.status.includes(n))return!1}return!0});s.sort((e,t)=>n===`name`?e.name.localeCompare(t.name):n===`unc`?t.UNC-e.UNC:n===`sunc`?t.sUNC-e.sUNC:0),o.textContent=`Found: ${s.length} ${s.length===1?`executor`:`executors`}`,s.forEach((e,t)=>{let n=document.createElement(`div`);n.className=`card`,n.style.animationDelay=`${t*.03}s`;let r=e=>e===0?`N/A`:`${e}%`;n.innerHTML=`
      <div class="card-header">
        <div class="card-title-group">
          <h2>${e.name}</h2>
          <span class="version-tag">${e.version}</span>
        </div>
        <div class="price-tag">${e.price}</div>
      </div>

      <div class="status-badges">
        <span class="badge ${e.updated?`updated`:`outdated`}">${e.updated?`Updated`:`Not Updated`}</span>
        <span class="badge ${e.detection.toLowerCase()}">${e.detection}</span>
      </div>

      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-row">
            <span class="stat-label">sUNC Support</span>
            <span class="stat-value">${r(e.sUNC)}</span>
          </div>
          ${e.sUNC>0?`<div class="progress-bar"><div class="progress-fill" style="width: ${e.sUNC}%; background: var(--accent-primary)"></div></div>`:``}
        </div>
        <div class="stat-item">
          <div class="stat-row">
            <span class="stat-label">UNC Support</span>
            <span class="stat-value">${r(e.UNC)}</span>
          </div>
          ${e.UNC>0?`<div class="progress-bar"><div class="progress-fill" style="width: ${e.UNC}%; background: var(--accent-secondary)"></div></div>`:``}
        </div>
      </div>

      <div class="features-grid">
        <div class="feature-item"><span class="feature-icon ${e.decompiler?`yes`:`no`}">${e.decompiler?`✓`:`✗`}</span><span>Decompiler</span></div>
        <div class="feature-item"><span class="feature-icon ${e.multiInstance?`yes`:`no`}">${e.multiInstance?`✓`:`✗`}</span><span>Multi-Instance</span></div>
        <div class="feature-item"><span class="feature-icon ${e.raknet?`yes`:`no`}">${e.raknet?`✓`:`✗`}</span><span>Raknet</span></div>
        <div class="feature-item"><span class="feature-icon yes">✓</span><span>${e.platforms.join(`, `)}</span></div>
      </div>

      <div class="card-actions">
        <a href="${e.link}" target="_blank" class="card-link">Visit Website</a>
        <button class="copy-btn" title="Copy Link">📋</button>
      </div>
    `,n.querySelector(`.copy-btn`).addEventListener(`click`,t=>{t.preventDefault(),a(e.link)}),i.appendChild(n)}),s.length===0&&(i.innerHTML=`<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">No executors found matching your criteria.</div>`)}document.querySelectorAll(`.pill-btn, .platform-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let n=e.parentElement,r=n.dataset.filter,i=e.dataset.value;e.classList.contains(`active`)?(e.classList.remove(`active`),t[r]=[]):(n.querySelectorAll(`.pill-btn, .platform-btn`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),t[r]=[i]),s()})}),document.getElementById(`sort-by`).addEventListener(`change`,e=>{n=e.target.value,s()}),document.getElementById(`executor-search`).addEventListener(`input`,e=>{r=e.target.value,s()}),document.getElementById(`clear-all`).addEventListener(`click`,()=>{t={pricing:[],keysystem:[],platform:[],type:[],detection:[],status:[]},r=``,document.getElementById(`executor-search`).value=``,document.querySelectorAll(`.pill-btn, .platform-btn`).forEach(e=>e.classList.remove(`active`)),s()}),o();