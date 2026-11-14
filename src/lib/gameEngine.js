export const SEGS=['0','1','2','3','4','5','6','OUT'];
export const COLORS=['#ffe08a','#9ad8f0','#b8f0d8','#f8cfe0','#cbbdee','#ffc0a8','#a2dcb4','#ef6f6c'];
export const pickIndex=()=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%8;}; // 2^32 divisible by 8 => unbiased
export const init=()=>({inn:0,scores:[0,0],balls:[0,0],hist:[[],[]],brk:false,done:false});
export function applyBall(s,idx,max){
  if(s.brk||s.done)return s;
  const i=s.inn,out=idx===7,run=out?0:idx;
  const scores=[...s.scores],balls=[...s.balls],hist=s.hist.map(h=>[...h]);
  scores[i]+=run;balls[i]+=1;hist[i].push(out?'OUT':run);
  let end=out||balls[i]>=max,done=false;
  if(i===1){if(scores[1]>scores[0])end=true;if(end)done=true;}
  return{...s,scores,balls,hist,done,brk:end&&i===0};
}
export const oversStr=b=>`${Math.floor(b/6)}.${b%6}`;
