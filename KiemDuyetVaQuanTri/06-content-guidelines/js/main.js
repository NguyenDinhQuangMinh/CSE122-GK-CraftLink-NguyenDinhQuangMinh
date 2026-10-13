const $=s=>document.querySelector(s),KEY="craftlink-content-guidelines-v4";
const seed=[
  {id:"rule-01",title:"Sản phẩm đúng mô tả",group:"Thông tin sản phẩm",text:"Ảnh, chất liệu, kích thước và tình trạng phải phản ánh đúng sản phẩm người mua sẽ nhận."},
  {id:"rule-02",title:"Không đăng hàng giả hoặc hàng cấm",group:"An toàn cộng đồng",text:"Không chấp nhận hàng giả, hàng vi phạm pháp luật hoặc nội dung cổ súy hành vi nguy hiểm."},
  {id:"rule-03",title:"Tôn trọng quyền sở hữu trí tuệ",group:"Quyền tác giả",text:"Chỉ đăng nội dung do mình sở hữu hoặc được phép sử dụng; nêu nguồn khi phù hợp."}
];
let rules=seed;
try{const saved=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(saved))rules=saved}catch{}
const form=$("#ruleForm"),dialog=$("#editor"),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(rules));return true}catch{return false}}
function notify(text){const toast=$("#toast");toast.textContent=text;toast.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove("show"),2600)}
function render(){
  const q=$("#search").value.trim().toLocaleLowerCase("vi");
  const found=rules.filter(x=>(x.title+" "+x.group+" "+x.text).toLocaleLowerCase("vi").includes(q));
  $("#resultCount").textContent=found.length+" quy định";
  $("#rules").innerHTML=found.map(x=>'<article class="rule-card"><header class="rule-head"><span class="rule-badge">'+esc(x.group)+'</span><div class="rule-actions"><button class="action-btn" type="button" data-action="edit" data-id="'+esc(x.id)+'" aria-label="Sửa '+esc(x.title)+'">✎</button><button class="action-btn danger" type="button" data-action="delete" data-id="'+esc(x.id)+'" aria-label="Xóa '+esc(x.title)+'">×</button></div></header><h2>'+esc(x.title)+'</h2><p>'+esc(x.text)+'</p></article>').join("")||'<div class="empty-state">Chưa có quy định phù hợp.</div>';
}
function edit(item){
  form.reset();form.elements.id.value=item?.id||"";form.elements.group.value=item?.group||"Thông tin sản phẩm";
  form.elements.title.value=item?.title||"";form.elements.text.value=item?.text||"";
  $("#dialogTitle").textContent=item?"Sửa quy định":"Thêm quy định";dialog.showModal();
}
$("#addRule").addEventListener("click",()=>edit());
$("#close").addEventListener("click",()=>dialog.close());$("#cancel").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
$("#search").addEventListener("input",render);
$("#globalSearch").addEventListener("input",e=>{$("#search").value=e.target.value;render()});
$("#rules").addEventListener("click",e=>{
  const button=e.target.closest("[data-action]");if(!button)return;
  const item=rules.find(x=>x.id===button.dataset.id);if(!item)return;
  if(button.dataset.action==="edit")edit(item);
  if(button.dataset.action==="delete"&&confirm("Xóa quy định “"+item.title+"”?")){
    rules=rules.filter(x=>x.id!==item.id);save();render();notify("Đã xóa quy định.");
  }
});
form.addEventListener("submit",e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const id=form.elements.id.value,old=rules.find(x=>x.id===id);
  const item={id:id||"rule-"+Date.now(),title:form.elements.title.value.trim(),group:form.elements.group.value,text:form.elements.text.value.trim()};
  rules=old?rules.map(x=>x.id===id?item:x):[item,...rules];
  const saved=save();dialog.close();render();
  notify(saved?(old?"Đã cập nhật quy định.":"Bạn đã thêm quy định thành công."):"Không thể lưu dữ liệu vào trình duyệt.");
});
const notice=$("#noticeMenu"),profile=$("#profileMenu");
$("#noticeButton").addEventListener("click",()=>{notice.hidden=!notice.hidden;profile.hidden=true});
$("#profileButton").addEventListener("click",()=>{profile.hidden=!profile.hidden;notice.hidden=true});
document.addEventListener("click",e=>{if(!e.target.closest(".popover-wrap")){notice.hidden=true;profile.hidden=true}});
document.querySelectorAll('[data-action="logout"]').forEach(b=>b.addEventListener("click",()=>notify("Đăng xuất chỉ là thao tác minh họa.")));
render();
