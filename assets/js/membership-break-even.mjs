export function calculateMembership({annual,day,memberVisit,visits}) {
  for(const n of [annual,day,memberVisit,visits]) if(!Number.isFinite(n)||n<0) throw new RangeError('Use finite, nonnegative numbers.');
  if([annual,day,memberVisit].some(n=>n>100000)||!Number.isInteger(visits)||visits>100) throw new RangeError('Use costs up to $100,000 and a whole visit count from 0 to 100.');
  const cents=n=>Math.round(n*100), a=cents(annual),d=cents(day),m=cents(memberVisit),saving=d-m;
  return {perVisitSaving:saving/100,breakEven:saving>0?Math.ceil(a/saving):null,without:visits*d/100,withMembership:(a+visits*m)/100,difference:(visits*saving-a)/100};
}
if(typeof document!=='undefined') {
  const form=document.querySelector('#membership-cost-form'),out=document.querySelector('#membership-cost-result');
  const presets={most:{annual:109,day:64,memberVisit:0,visits:2},zoo:{annual:77,day:28,memberVisit:0,visits:3}};
  const money=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD'});
  function update(){
    if(!form||!out||!form.reportValidity())return;
    const input={};for(const key of ['annual','day','memberVisit','visits']){const value=form.elements.namedItem(key).value;if(value===''){out.textContent='Complete every field, including zero where appropriate.';return;}input[key]=Number(value);}
    try{const r=calculateMembership(input);const gate=r.breakEven===null?'There is no positive per-visit saving, so admission savings do not recover the membership cost.':`First whole-visit count costing no more: ${r.breakEven}. An exact tie is not yet a saving.`;
      const compare=r.difference>0?`Membership is ${money(r.difference)} lower.`:r.difference<0?`Paying per visit is ${money(-r.difference)} lower.`:'The two options tie.';
      out.textContent=`${gate} At ${input.visits} visit${input.visits===1?'':'s'}: without membership ${money(r.without)}; with membership ${money(r.withMembership)}. ${compare} This comparison excludes costs you did not enter. Recheck prices, eligibility and the actual membership term.`;
    }catch(e){out.textContent=e.message;}
  }
  if(form){form.addEventListener('submit',e=>{e.preventDefault();update();});document.querySelectorAll('[data-membership-preset]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.membershipPreset;if(key==='clear'){for(const name of ['annual','day','memberVisit','visits'])form.elements.namedItem(name).value='';out.textContent='Fields cleared. Enter your own current whole-group costs and realistic visit count.';form.elements.namedItem('annual').focus();return;}for(const [name,value] of Object.entries(presets[key]))form.elements.namedItem(name).value=String(value);update();}));update();}
}
