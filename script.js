const dishes = [
  {id:'d1', name:'Chicken Adobo',   price:150, icon:'🍗'},
  {id:'d2', name:'Pork Sinigang',   price:180, icon:'🍲'},
  {id:'d3', name:'Beef Caldereta',  price:220, icon:'🥘'},
  {id:'d4', name:'Pancit Canton',   price:120, icon:'🍜'},
  {id:'d5', name:'Lechon Kawali',   price:200, icon:'🥓'}
];
const desserts = [
  {id:'s1', name:'Leche Flan',   price:80,  icon:'🍮'},
  {id:'s2', name:'Halo-Halo',    price:100, icon:'🍧'},
  {id:'s3', name:'Turon',        price:60,  icon:'🍌'},
  {id:'s4', name:'Buko Pandan',  price:90,  icon:'🥥'}
];
const all = [...dishes, ...desserts];
const qty = {};
all.forEach(f => qty[f.id] = 0);
const peso = n => '₱' + n.toLocaleString();

// Slide 2: menu
const fill = (el, list) => el.innerHTML = list.map(f =>
  `<li><span>${f.icon} ${f.name}</span><b>${peso(f.price)}</b></li>`).join('');
fill(document.getElementById('dishList'), dishes);
fill(document.getElementById('dessertList'), desserts);

// Slide 3: order cards
const grid = document.getElementById('orderGrid');
grid.innerHTML = all.map(f => `
  <div class="item">
    <div class="pic">${f.icon}<img src="images/${f.id}.jpg" alt="${f.name}" onerror="this.remove()"></div>
    <div class="info">
      <strong>${f.name}</strong>
      <span class="price">${peso(f.price)}</span>
      <div class="qty">
        <button type="button" data-id="${f.id}" data-d="-1" aria-label="Remove ${f.name}">-</button>
        <span id="q-${f.id}">0</span>
        <button type="button" data-id="${f.id}" data-d="1" aria-label="Add ${f.name}">+</button>
      </div>
    </div>
  </div>`).join('');

grid.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  const id = b.dataset.id;
  qty[id] = Math.max(0, qty[id] + Number(b.dataset.d));
  document.getElementById('q-' + id).textContent = qty[id];
  update();
});

// Totals + Slide 4 summary
function update(){
  let total = 0, rows = '';
  all.forEach(f => {
    if (qty[f.id] > 0){
      total += qty[f.id] * f.price;
      rows += `<li><span>${qty[f.id]} x ${f.name}</span><span>${peso(qty[f.id]*f.price)}</span></li>`;
    }
  });
  document.getElementById('total').textContent = peso(total);
  document.getElementById('total2').textContent = peso(total);
  document.getElementById('summaryList').innerHTML =
    rows || '<li class="empty">Nothing selected yet. Go back to Order Now.</li>';
}

// Place order
document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = document.getElementById('msg');
  const total = all.reduce((s,f) => s + qty[f.id]*f.price, 0);
  if (total === 0){
    msg.style.color = '#b5301f';
    msg.textContent = 'Please choose at least one item in Order Now.';
    return;
  }
  msg.style.color = '#1f7a3a';
  msg.textContent = `Thank you, ${document.getElementById('name').value}! Your order of ${peso(total)} has been placed.`;
});
