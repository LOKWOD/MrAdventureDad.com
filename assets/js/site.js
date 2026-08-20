document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav')?.classList.remove('open')));
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

(() => {
  let audioContext;
  function playCashRegister() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioContext ||= new AudioContext();
    const now = audioContext.currentTime;
    const master = audioContext.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.24, now + 0.008);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
    master.connect(audioContext.destination);
    [[1250, 0], [1740, 0.08], [2320, 0.16]].forEach(([frequency, delay]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now + delay);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, now + delay + 0.18);
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.8, now + delay + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.22);
      oscillator.connect(gain).connect(master);
      oscillator.start(now + delay);
      oscillator.stop(now + delay + 0.24);
    });
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-affiliate-active="true"]');
    if (!link) return;
    playCashRegister();
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
