(()=>{
 const root=document.getElementById('research-pathway');
 if(!root)return;
 const buttons=[...root.querySelectorAll('[data-stage]')];
 buttons.forEach(button=>button.addEventListener('click',()=>{
  buttons.forEach(b=>{b.setAttribute('aria-pressed',String(b===button));b.classList.remove('rp-motion');});
  void button.offsetWidth;
  button.classList.add('rp-motion');
 }));
})();
