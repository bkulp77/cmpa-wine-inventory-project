
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.supabase={}))})(this,(function(exports){'use strict';var __defProp=Object.defineProperty;var __getOwnPropSymbols=Object.getOwnPropertySymbols;var __hasOwnProp=Object.prototype.hasOwnProperty;var __propIsEnum=Object.prototype.propertyIsEnumerable;var __defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:true,configurable:true,writable:true,value}):obj[key]=value;var __spreadValues=(a,b)=>{for(var prop in b||(b={}))if(__hasOwnProp.call(b,prop))__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b)){if(__propIsEnum.call(b,prop))__defNormalProp(a,prop,b[prop]);}return a;};class SupabaseClient{constructor(supabaseUrl,supabaseKey,options){this.supabaseUrl=supabaseUrl;this.supabaseKey=supabaseKey;const settings=__spreadValues({auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}},options);this.auth=null;this.realtime=null;}from(table){const url=`${this.supabaseUrl}/rest/v1/${table}`;return{select:(columns='*')=>this._request('GET',url,null,columns),insert:(values)=>this._request('POST',url,values),update:(values)=>this._request('PATCH',url,values),delete:()=>this._request('DELETE',url,null)};}_request(method,url,body=null,columns=null){let targetUrl=url;if(columns)targetUrl+=`?select=${encodeURIComponent(columns)}`;if(method==='PATCH'||method==='DELETE'){const idSearch=body&&body.id?`id=eq.${body.id}`:'';if(idSearch)targetUrl+=`?${idSearch}`;}const headers={'apikey':this.supabaseKey,'Authorization':`Bearer ${this.supabaseKey}`,'Content-Type':'application/json','Prefer':'return=representation'};if(method==='PATCH'&&body){delete body.id;}const fetchOptions={method,headers};if(body&&method!=='GET')fetchOptions.body=JSON.stringify(body);return fetch(targetUrl,fetchOptions).then(res=>{if(!res.ok)return res.json().then(err=>({data:null,error:err}));if(res.status===204)return{data:[],error:null};return res.json().then(data=>({data,error:null}));}).catch(err=>({data:null,error:{message:err.message}}));}}function createClient(supabaseUrl,supabaseKey,options){return new SupabaseClient(supabaseUrl,supabaseKey,options)}exports.createClient=createClient;Object.defineProperty(exports,'__esModule',{value:true});})); 

const supabaseUrl = 'https://nlgwoafmcxzcjknkbmtd.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZ3dvYWZtY3h6Y2prbmtibXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNzY3MzcsImV4cCI6MjEwNDY1MjczN30.azfPDyKXzVVc0YVpV7vbmwhlz6U7AfLvM8surXfVQJI'; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 

const tableBody = document.getElementById('table-body'); 
const searchBox = document.getElementById('search-box'); 
let inventoryData = [];

async function loadInventory() {
  try {
    console.log("Attempting secure connection to Supabase...");
    
    const { data, error } = await supabase
      .from('inventory.csv')
      .select('*', { 
        headers: { 'pragma': 'no-cache', 'cache-control': 'no-cache' } 
      });

    if (error) {
      console.error("Supabase Error Details:", error);
      throw new Error(`[${error.code || 'API Error'}] ${error.message}`);
    }

if (data && data.length > 0) { 
  inventoryData = JSON.parse(JSON.stringify(data)).filter(row => {
    return (parseInt(row.quantity) || 0) > 0;
  }); 
      
      inventoryData.sort((rowA, rowB) => {
        const wineryA = String(rowA.winery || '').trim().toLowerCase();
        const wineryB = String(rowB.winery || '').trim().toLowerCase();
        if (wineryA < wineryB) return -1;
        if (wineryA > wineryB) return 1;

        const wineA = String(rowA.wine_name || '').trim().toLowerCase();
        const wineB = String(rowB.wine_name || '').trim().toLowerCase();
        if (wineA < wineB) return -1;
        if (wineA > wineB) return 1;
        return 0;
      });
    } else {
      inventoryData = [];
    }

    console.log("Data successfully retrieved:", inventoryData);
    renderTable(inventoryData);
  } catch (error) {
    console.error("Critical Failure inside loadInventory:", error);
    tableBody.innerHTML = `<tr><td colspan="9" style="color:red; font-weight:bold; padding: 20px; background: #fff1f1;">⚠️ Connection Failed:<br><small>${error.message}</small></td></tr>`;
  }
}

function renderTable(rows) {
  updateSummaryDashboard(rows); 
  tableBody.innerHTML = '';
  if (!rows || rows.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:20px; color:#666;">Your database table is connected but empty.</td></tr>`;
    return;
  }
  
  rows.forEach((row) => {
    try {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', row.id); // Tag the row so we can find it instantly on save
      
      const id = row.id;
      const winery = row.winery || 'N/A';
      const state = row.state || 'N/A';
      const wineName = row.wine_name || 'N/A';
      const vintage = row.vintage || 'N/A';
      const type = row.type || 'N/A';
      let quantity = parseInt(row.quantity) || 0;
      const binLocation = row.bin_location || 'N/A';
      const imagePath = row.image ? String(row.image).trim() : '';
      const website = row.website || 'N/A';
      
      const currentNotes = row.tasting_notes ? String(row.tasting_notes).trim() : '';
      const lowStockClass = quantity <= 1 ? '' : 'display: none;';
      const imageHtml = imagePath ? `<img src="${imagePath}" class="wine-pic" alt="${wineName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : '';
      const fallbackHtml = `<div class="wine-pic" style="${imagePath ? 'display:none;' : 'display:flex;'}">🍷</div>`;

      tr.innerHTML = `
        <td><div class="img-cell-wrapper">${imageHtml}${fallbackHtml}</div></td>
        <td><strong>${winery}</strong></td>
        <td>${state}</td>
        <td><strong>${wineName}</strong></td>
        <td>${vintage}</td>
        <td>${type}</td>
        <td>
          <div class="qty-controls">
            <button class="btn-qty btn-minus">−</button>
            <span class="qty-val">${quantity}</span>
            <button class="btn-qty btn-plus">+</button>
            <span class="low-stock" style="${lowStockClass}">Low</span>
          </div>
        </td>
        <td><code>${binLocation}</code></td>
        <td><a href="https://${website}" target="_blank"><code>${website}</code></a></td>
        <td>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <button class="open-notes-modal-btn" style="background:#58111A; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold; white-space:nowrap;">
              ${currentNotes !== "" ? '📝 View Notes' : '➕ Log Notes'}
            </button>
            <div class="notes-text-block" style="font-size: 11px; color: #58111A; font-style: italic; white-space: normal; max-width: 150px; text-align: center;">
              ${currentNotes ? ` ` : ''}
            </div>
          </div>
        </td>
      `;

      tr.querySelector('.open-notes-modal-btn').addEventListener('click', () => {
        document.getElementById('modal-wine-id').value = id;
        document.getElementById('modal-wine-title').textContent = `Tasting Notes: ${winery} - ${wineName}`;
        document.getElementById('modal-notes-textarea').value = row.tasting_notes || '';
        document.getElementById('modal-status-msg').textContent = "";
        document.getElementById('notes-modal').style.display = 'flex';
      });

      const qtyValEl = tr.querySelector('.qty-val');
      const lowStockEl = tr.querySelector('.low-stock');

      tr.querySelector('.btn-minus').addEventListener('click', async () => {
        if (quantity > 0) {
          quantity--;
          const { error } = await supabase.from('inventory.csv').update({ id: id, quantity: quantity });
          if (!error) { row.quantity = quantity; qtyValEl.textContent = quantity; lowStockEl.style.display = quantity <= 1 ? 'inline' : 'none'; }
        }
      });

      tr.querySelector('.btn-plus').addEventListener('click', async () => {
        quantity++;
        const { error } = await supabase.from('inventory.csv').update({ id: id, quantity: quantity });
        if (!error) { row.quantity = quantity; qtyValEl.textContent = quantity; lowStockEl.style.display = quantity <= 1 ? 'inline' : 'none'; }
      });

      tableBody.appendChild(tr);
    } catch (rowError) {
      console.error("Error rendering a row item:", rowError, row);
    }
  });
}

document.getElementById('close-modal-btn').addEventListener('click', () => {
  document.getElementById('notes-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  const modalOverlay = document.getElementById('notes-modal');
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});

document.getElementById('save-modal-notes-btn').addEventListener('click', async () => {
  const wineId = document.getElementById('modal-wine-id').value;
  const notesText = document.getElementById('modal-notes-textarea').value.trim();
  const statusMsg = document.getElementById('modal-status-msg');
  
  statusMsg.style.color = "orange";
  statusMsg.textContent = "Saving...";

  const { error } = await supabase
    .from('inventory.csv')
    .update({ id: wineId, tasting_notes: notesText });

  if (!error) {
    statusMsg.style.color = "green";
    statusMsg.textContent = "Saved successfully! ✓";
    
    const localMatch = inventoryData.find(item => String(item.id) === String(wineId));
    if (localMatch) { localMatch.tasting_notes = notesText; }

  
    const targetRow = document.querySelector(`tr[data-id="${wineId}"]`);
    if (targetRow) {
      const notesBlock = targetRow.querySelector('.notes-text-block');
      const actionBtn = targetRow.querySelector('.open-notes-modal-btn');
      
      if (notesBlock) { notesBlock.innerHTML = notesText ? `💬 ${notesText}` : ''; }
      if (actionBtn) { actionBtn.textContent = notesText ? '📝 View Notes' : '➕ Log Notes'; }
    }
    
    setTimeout(() => { document.getElementById('notes-modal').style.display = 'none'; }, 800);
  } else {
    statusMsg.textContent = "";
    alert("Failed to save tasting updates: " + error.message);
  }
});



searchBox.addEventListener('input', function(e) {
  const searchFilter = e.target.value.toLowerCase();
  const filteredRows = inventoryData.filter(row => {
    const winery = String(row.winery || '').toLowerCase();
    const wineName = String(row.wine_name || '').toLowerCase();
    const binLocation = String(row.bin_location || '').toLowerCase();
    const type = String(row.type || '').toLowerCase();
    // Added fields:
    const state = String(row.state || '').toLowerCase();
    const vintage = String(row.vintage || '').toLowerCase();
    
    return winery.includes(searchFilter) || 
           wineName.includes(searchFilter) || 
           type.includes(searchFilter) || 
           binLocation.includes(searchFilter) ||
           state.includes(searchFilter) ||
           vintage.includes(searchFilter);
  });
  renderTable(filteredRows);
});

loadInventory();

setInterval(() => {
  const searchInput = document.getElementById('search-box');
  if (!searchInput || searchInput.value === '') {
    console.log("Auto-refreshing inventory from Supabase...");
    loadInventory();
  }
}, 5000);
document.getElementById('wine-data-entry').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitButton = e.target.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Processing & Saving...";

  const imageFileInput = document.getElementById('form-image');
  let imageBase64String = '';

  if (imageFileInput.files && imageFileInput.files[0]) {
    try {
      imageBase64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); 
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFileInput.files[0]);
      });
    } catch (fileErr) {
      console.error("File processing failure:", fileErr);
      alert("Failed to process your image file. Saving without a photo instead.");
    }
  }

  // Capture the form inputs
  const wineryInput = document.getElementById('form-winery').value.trim();
  const nameInput = document.getElementById('form-name').value.trim();
  const vintageInput = document.getElementById('form-vintage').value.trim() || 'N/A';
  const additionalQty = parseInt(document.getElementById('form-qty').value) || 0;

  // 1. SMART CHECK: Look through your existing inventory array for a perfect match
  const duplicateMatch = inventoryData.find(item => {
    return String(item.winery).trim().toLowerCase() === wineryInput.toLowerCase() &&
           String(item.wine_name).trim().toLowerCase() === nameInput.toLowerCase() &&
           String(item.vintage).trim().toLowerCase() === vintageInput.toLowerCase();
  });

  try {
    if (duplicateMatch) {
      // 2. IF MATCH FOUND: Update the existing row's quantity in Supabase
      const newTotalQuantity = (parseInt(duplicateMatch.quantity) || 0) + additionalQty;
      
      const { error } = await supabase
        .from('inventory.csv')
        .update({ id: duplicateMatch.id, quantity: newTotalQuantity });

      if (error) throw error;
      alert(`Updated existing inventory! Added ${additionalQty} bottle(s) to "${wineryInput} - ${nameInput} (${vintageInput})".`);
      
    } else {
      // 3. IF NO MATCH FOUND: Carry out a standard fresh insert
      const newWine = {
        winery: wineryInput,
        wine_name: nameInput,
        state: document.getElementById('form-state').value.trim() || 'N/A',
        vintage: vintageInput,
        type: document.getElementById('form-type').value,
        quantity: additionalQty,
        bin_location: document.getElementById('form-bin').value.trim().toUpperCase() || 'N/A',
        image: imageBase64String,
        website: 'N/A'
      };

      const { error } = await supabase
        .from('inventory.csv')
        .insert(newWine);

      if (error) throw error;
      alert(`Success! "${newWine.wine_name}" has been permanently added with its photo.`);
    }

    // Reset form elements cleanly
    e.target.reset();
    document.getElementById('form-qty').value = "1";
    
    // Reload your synchronized UI
    await loadInventory();
    
  } catch (err) {
    console.error("Submission Error:", err);
    alert("Database Connection Failed: " + (err.message || "Unknown error"));
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Save Wine to Shared Inventory";
  }
});

setInterval(() => {
  const searchInput = document.getElementById('search-box');
  const isModalOpen = document.getElementById('notes-modal').style.display === 'flex';
  
  if ((!searchInput || searchInput.value === '') && !isModalOpen) {
    console.log("Auto-refreshing inventory safely from Supabase...");
    loadInventory();
  }
}, 5000);
if (!error) {
  statusMsg.style.color = "green";
  statusMsg.textContent = "Saved successfully! ✓";
  
  const localMatch = inventoryData.find(item => String(item.id) === String(wineId));
  if (localMatch) {
    localMatch.tasting_notes = notesText;
  }

  renderTable(inventoryData);
  
  setTimeout(() => {
    document.getElementById('notes-modal').style.display = 'none';
  }, 800);
}
function updateSummaryDashboard(rows) {
  const dashboard = document.getElementById('inventory-summary-dashboard');
  if (!dashboard) return;

  let totalRed = 0;
  let totalWhite = 0;
  let totalRose = 0;
  const wineryTotals = {};

  // Accumulate calculations across active items
  rows.forEach(row => {
    const qty = parseInt(row.quantity) || 0;
    const type = String(row.type || '').trim().toLowerCase();
    const winery = String(row.winery || 'Unknown Winery').trim();

    // 1. Calculate Wine Type totals
    if (type.includes('red')) totalRed += qty;
    else if (type.includes('white')) totalWhite += qty;
    else if (type.includes('ros')) totalRose += qty; // Handles rose and rosé variations

    // 2. Calculate Winery totals
    if (qty > 0) {
      wineryTotals[winery] = (wineryTotals[winery] || 0) + qty;
    }
  });

  // Build the Winery badge elements string
  const wineryBadgesHtml = Object.keys(wineryTotals)
    .sort()
    .map(winery => `<span class="winery-badge">${winery}: <strong>${wineryTotals[winery]}</strong> btl${wineryTotals[winery] !== 1 ? 's' : ''}</span>`)
    .join('');

  // Inject structural template markup into dashboard container
  dashboard.innerHTML = `
    <div class="summary-row">
      <div class="summary-card type-red">
        <h4>Red Wines</h4>
        <div class="summary-count">${totalRed}</div>
      </div>
      <div class="summary-card type-white">
        <h4>White Wines</h4>
        <div class="summary-count">${totalWhite}</div>
      </div>
      <div class="summary-card type-rose">
        <h4>Rosé Wines</h4>
        <div class="summary-count">${totalRose}</div>
      </div>
    </div>
    <div class="winery-summary-list">
      <h4>Winery Inventory Allocation</h4>
      <div class="winery-badges">
        ${wineryBadgesHtml || '<span style="color:#999; font-style:italic;">No active winery stock available.</span>'}
      </div>
    </div>
  `;
}