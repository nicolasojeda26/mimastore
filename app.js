const products = [
  {id:1,name:'Top de encaje',detail:'Disponible en varios tonos',category:'Tops',price:28900,badge:'NUEVO',image:'assets/mima-top-encaje.jpg'},
  {id:2,name:'Top blanco',detail:'Un favorito para salir',category:'Tops',price:22900,badge:'',image:'assets/mima-top-blanco.jpg'},
  {id:3,name:'Short efecto cuero',detail:'Negro, para sumar actitud',category:'Shorts',price:35900,badge:'MÁS ELEGIDO',image:'assets/mima-short-negro.jpg'},
  {id:4,name:'Short efecto cuero',detail:'Chocolate, recién llegado',category:'Shorts',price:36900,badge:'NUEVO',image:'assets/mima-short-chocolate.jpg'},
  {id:5,name:'Bota negra',detail:'Caña baja desmontable · 36 al 40',category:'Calzado',price:68900,badge:'NUEVO',image:'assets/mima-bota-negra.jpg'}
];
let cart = [];
let activeFilter = 'Todos';
let searchText = '';
const $ = (selector) => document.querySelector(selector);
const money = (amount) => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(amount);

function renderProducts(){
  const filtered = products.filter(p => (activeFilter==='Todos' || p.category===activeFilter) && `${p.name} ${p.detail} ${p.category}`.toLowerCase().includes(searchText.toLowerCase()));
  $('#product-grid').innerHTML = filtered.length ? filtered.map(p => `<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.badge?`<span class="product-badge">${p.badge}</span>`:''}<button class="favorite" aria-label="Agregar ${p.name} a favoritos" data-favorite="${p.id}">♡</button><button class="quick-add" data-add="${p.id}">AGREGAR A LA BOLSA　＋</button></div><div class="product-info"><div><h3>${p.name}</h3><p>${p.detail}</p></div><span class="price">${money(p.price)}</span></div></article>`).join('') : '<p class="no-results">No encontramos productos con esa búsqueda. Probá con otra palabra.</p>';
}
function updateCart(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  $('#cart-count').textContent=count;
  $('#cart-heading-count').textContent=`(${count})`;
  $('#cart-subtotal').textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
  $('#cart-items').innerHTML = count ? cart.map(item=>`<article class="cart-item"><img src="${item.image}" alt=""><div><h4>${item.name}</h4><p>Precio de muestra · ${money(item.price)}</p><div class="qty-controls"><button data-qty="${item.id}" data-change="-1" aria-label="Quitar una unidad">−</button><span>${item.qty}</span><button data-qty="${item.id}" data-change="1" aria-label="Agregar una unidad">＋</button></div></div><strong>${money(item.price*item.qty)}</strong></article>`).join('') : '<div class="empty-cart"><span>✳</span><p>Tu bolsa está esperando<br>ese algo especial.</p><a href="#coleccion" class="button button-dark" id="continue-shopping">Ver colección</a></div>';
  $('#cart-footer').style.display=count?'block':'none';
}
function openCart(){ $('#cart-drawer').classList.add('open'); $('#cart-overlay').classList.add('open'); document.body.style.overflow='hidden'; }
function closeCart(){ $('#cart-drawer').classList.remove('open'); $('#cart-overlay').classList.remove('open'); document.body.style.overflow=''; }
function addToCart(id){ const p=products.find(item=>item.id===Number(id));const found=cart.find(item=>item.id===p.id);found?found.qty++:cart.push({...p,qty:1});updateCart();$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1900); }

$('#product-grid').addEventListener('click',event=>{
  const add=event.target.closest('[data-add]'); if(add){addToCart(add.dataset.add);return;}
  const fav=event.target.closest('[data-favorite]'); if(fav){fav.classList.toggle('liked');fav.textContent=fav.classList.contains('liked')?'♥':'♡';}
});
$('#category-row').addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(!button)return;activeFilter=button.dataset.filter;document.querySelectorAll('.category').forEach(b=>b.classList.toggle('active',b===button));renderProducts();});
$('#cart-items').addEventListener('click',event=>{const button=event.target.closest('[data-qty]');if(!button)return;const item=cart.find(i=>i.id===Number(button.dataset.qty));item.qty+=Number(button.dataset.change);if(item.qty<=0)cart=cart.filter(i=>i!==item);updateCart();});
$('#open-cart').addEventListener('click',openCart);$('#close-cart').addEventListener('click',closeCart);$('#cart-overlay').addEventListener('click',closeCart);
$('#cart-items').addEventListener('click',event=>{if(event.target.closest('#continue-shopping'))closeCart();});
  $('#checkout').addEventListener('click',()=>{const lines=cart.map(i=>`• ${i.name} x${i.qty} — ${money(i.price*i.qty)}`).join('\n');const message=`Hola Mima! Quería consultar por este pedido:\n${lines}\nTotal de muestra: ${money(cart.reduce((sum,i)=>sum+i.price*i.qty,0))}`;window.open(`https://wa.me/message/TQD3LFMSIVB2G1?text=${encodeURIComponent(message)}`,'_blank','noopener');});
$('#search-toggle').addEventListener('click',()=>{$('#search-bar').classList.add('open');$('#search-input').focus();});$('#close-search').addEventListener('click',()=>{$('#search-bar').classList.remove('open');$('#search-input').value='';searchText='';renderProducts();});$('#search-input').addEventListener('input',event=>{searchText=event.target.value;renderProducts();document.querySelector('#coleccion').scrollIntoView({behavior:'smooth',block:'start'});});
$('#menu-toggle').addEventListener('click',()=>$('#main-nav').classList.toggle('open'));document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',()=>$('#main-nav').classList.remove('open')));
$('#newsletter-form').addEventListener('submit',event=>{event.preventDefault();$('#newsletter-message').textContent='¡Gracias! En esta demo ya estás en la lista de Mima ✳';$('#email').value='';});
renderProducts();updateCart();
