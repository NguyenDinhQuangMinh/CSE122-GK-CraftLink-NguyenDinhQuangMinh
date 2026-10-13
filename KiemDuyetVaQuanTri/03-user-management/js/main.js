
const $ = s => document.querySelector(s);
const toast = $("#toast");
let toastTimer;
function notify(message){
  toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"),2800);
}
function wireHeader(searchHandler){
  const notice=$("#noticeMenu"),profile=$("#profileMenu");
  $("#noticeButton").addEventListener("click",()=>{notice.hidden=!notice.hidden;profile.hidden=true;});
  $("#profileButton").addEventListener("click",()=>{profile.hidden=!profile.hidden;notice.hidden=true;});
  document.addEventListener("click",e=>{if(!e.target.closest(".popover-wrap")){notice.hidden=true;profile.hidden=true;}});
  document.querySelectorAll('[data-action="logout"]').forEach(b=>b.addEventListener("click",()=>notify("Đăng xuất chỉ là thao tác minh họa.")));
  $("#globalSearch").addEventListener("input",e=>searchHandler&&searchHandler(e.target.value));
}
function esc(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

const KEY="craftlink-slide03-users-v2";
const seed=[
 {name:"Nguyễn Thị Lan",email:"lan.nguyen@example.com",role:"buyer",date:"12/05/2024",active:true,image:1},
 {name:"Trần Văn Hùng",email:"hung.tran@example.com",role:"maker",date:"28/04/2024",active:true,image:2},
 {name:"Phạm Minh Anh",email:"anh.pham@example.com",role:"buyer",date:"03/04/2024",active:false,image:3},
 {name:"Lê Quốc Bảo",email:"bao.le@example.com",role:"moderator",date:"18/03/2024",active:true,image:4},
 {name:"Đỗ Thị Hoa",email:"hoa.do@example.com",role:"maker",date:"27/02/2024",active:true,image:5}
];
let users=seed,role="all",query="";
try{const saved=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(saved))users=saved;}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify(users));return true}catch{return false}}
const roleText={buyer:"Khách hàng",maker:"Thợ thủ công (Maker)",moderator:"Kiểm duyệt viên (Moderator)"};
function render(){
 const q=($("#search").value||query).toLocaleLowerCase("vi");
 $("#rows").innerHTML=users.filter(x=>(role==="all"||x.role===role)&&(x.name+" "+x.email).toLocaleLowerCase("vi").includes(q)).map(x=>
 '<tr><td><div class="user-cell"><img src="../assets/user-'+x.image+'.jpg" alt=""><b>'+esc(x.name)+'</b></div></td><td>'+esc(x.email)+'</td><td><span class="role-pill '+x.role+'">'+roleText[x.role]+'</span></td><td>'+x.date+'</td><td><span class="user-state '+(x.active?"":"locked")+'">'+(x.active?"Hoạt động":"Tạm dừng")+'</span></td><td><button class="switch '+(x.active?"on":"")+'" type="button" data-email="'+esc(x.email)+'" aria-label="'+(x.active?"Khóa":"Mở khóa")+' '+esc(x.name)+'"></button></td></tr>'
 ).join("")||'<tr><td colspan="6" class="empty">Không tìm thấy tài khoản.</td></tr>';
}
$("#search").addEventListener("input",render);
document.querySelectorAll("[data-role]").forEach(b=>b.addEventListener("click",()=>{
 role=b.dataset.role;document.querySelectorAll("[data-role]").forEach(x=>x.classList.toggle("selected",x===b));render();
}));
wireHeader(value=>{query=value;$("#search").value=value;render();});
$("#rows").addEventListener("click",e=>{
 const b=e.target.closest(".switch");if(!b)return;
 const user=users.find(x=>x.email===b.dataset.email);user.active=!user.active;save();render();
 notify(user.name+(user.active?" đã được mở khóa.":" đã bị khóa."));
});
render();
