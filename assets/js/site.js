const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
const closeMenu=()=>{
  if(!menuButton||!nav)return;
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
  menuButton.setAttribute('aria-label','Open menu');
};
menuButton?.addEventListener('click',()=>{
  const isOpen=nav?.classList.toggle('open')??false;
  menuButton.setAttribute('aria-expanded',String(isOpen));
  menuButton.setAttribute('aria-label',isOpen?'Close menu':'Open menu');
});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();menuButton?.focus();}});
document.addEventListener('click',event=>{if(nav?.classList.contains('open')&&!nav.contains(event.target)&&!menuButton?.contains(event.target))closeMenu();});
const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
nav?.querySelectorAll('a').forEach(link=>{
  const target=(link.getAttribute('href')||'').split('#')[0].split('/').pop()?.toLowerCase();
  if(target===current)link.setAttribute('aria-current','page');
});
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

(()=>{
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[data-affiliate-active="true"]');
    if(!link)return;
    const detail={event:'affiliate_click',affiliate_network:link.dataset.affiliateNetwork||'amazon',affiliate_tag:link.dataset.affiliateTag||'mradventuredad-20',link_url:link.href,link_text:link.textContent.trim().replace(/\s+/g,' ').slice(0,120),page_path:location.pathname};
    if(typeof window.gtag==='function')window.gtag('event','affiliate_click',detail);
    else(window.dataLayer||=[]).push(detail);
  });
})();
