document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav')?.classList.remove('open')));
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

(() => {
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-affiliate-active="true"]');
    if (!link) return;
    const detail = {
      event: 'affiliate_click',
      affiliate_network: link.dataset.affiliateNetwork || 'amazon',
      affiliate_tag: link.dataset.affiliateTag || 'mradventuredad-20',
      link_url: link.href,
      link_text: link.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
      page_path: location.pathname,
    };
    if (typeof window.gtag === 'function') window.gtag('event', 'affiliate_click', detail);
    else (window.dataLayer ||= []).push(detail);
  });
})();
