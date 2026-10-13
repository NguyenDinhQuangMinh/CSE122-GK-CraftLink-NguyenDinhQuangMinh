
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

const KEY="craftlink-slide04-products-v2";
const products=[
 ["Bình gốm hoa sen","Nguyễn Văn Hòa","850.000 đ","2 giờ trước","product-1.png","Tạo hình hoa sen, men nâu thủ công; sản xuất tại xưởng gia đình ở Bát Tràng."],
 ["Đèn mây tre đan","Trần Thị Mai","620.000 đ","3 giờ trước","product-2.png","Đèn trang trí đan tay từ tre tự nhiên, hoàn thiện bằng dầu thực vật."],
 ["Khay gỗ khắc lá","Lê Minh Tuấn","410.000 đ","4 giờ trước","product-3.png","Khay gỗ khắc tay họa tiết lá, mô tả rõ chất liệu và cách bảo quản."],
 ["Trang trí tường macrame","Phạm Thị Trang","360.000 đ","5 giờ trước","product-4.png","Trang trí tường dệt tay bằng sợi cotton tự nhiên."],
 ["Bộ ấm chén men lam","Đỗ Văn Quang","750.000 đ","6 giờ trước","product-5.png","Bộ ấm chén vẽ men lam thủ công, dùng được với nước nóng."],
 ["Túi cói quai tròn","Vũ Thị Hạnh","320.000 đ","7 giờ trước","product-6.png","Túi cói đan tay, quai tròn, phù hợp sử dụng hằng ngày."],
 ["Hộp gỗ khắc tay","Hoàng Anh Dũng","550.000 đ","8 giờ trước","product-7.png","Hộp gỗ chạm khắc hoa văn thủ công."],
 ["Rổ mây đựng trái cây","Nguyễn Thị Lan","280.000 đ","9 giờ trước","product-8.png","Rổ mây tre đan tự nhiên, dùng để đựng trái cây."]
].map((x,i)=>({id:i+1,name:x[0],maker:x[1],price:x[2],age:x[3],image:x[4],description:x[5],status:"pending",note:""}));
try{const saved=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(saved))products.splice(0,products.length,...saved);}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify(products));}catch{}}
const dialog=$("#editor"),form=$("#decisionForm");let selected=0,query="";
function render(){
 $("#products").innerHTML=products.filter(x=>x.status==="pending"&&(x.name+" "+x.maker).toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi"))).map(x=>
 '<article class="product-card" data-id="'+x.id+'"><img class="product-image" data-act="detail" role="button" tabindex="0" src="../assets/'+x.image+'" alt="'+esc(x.name)+'"><div class="product-info"><h2>'+esc(x.name)+'</h2><p class="product-maker">'+esc(x.maker)+'</p><p class="product-price">'+x.price+'</p><p class="product-age">'+x.age+'</p><div class="product-actions"><button class="approve" data-act="approve">Duyệt bài</button><button class="decision" data-act="decision">Từ chối / Yêu cầu sửa</button></div></div></article>'
 ).join("")||'<p class="empty">Không còn sản phẩm đang chờ.</p>';
}
function approve(item){item.status="approved";save();dialog.close();render();notify("Đã duyệt bài đăng “"+item.name+"”.");}
function showDecision(item){
 selected=item.id;$("#dialogTitle").textContent="Từ chối / Yêu cầu sửa";
 $("#detailPanel").hidden=true;$("#decisionPanel").hidden=false;form.elements.id.value=item.id;form.elements.note.value=item.note;
 dialog.showModal();
}
function showDetail(item){
 selected=item.id;$("#dialogTitle").textContent=item.name;$("#detailPanel").hidden=false;$("#decisionPanel").hidden=true;
 $("#detailText").textContent=item.maker+" · "+item.price+"\n"+item.description+"\nTrạng thái: "+(item.status==="pending"?"Đang chờ kiểm duyệt":item.status);
 $("#detailApprove").hidden=item.status!=="pending";$("#detailDecision").hidden=item.status!=="pending";dialog.showModal();
}
$("#products").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".product-image")){e.preventDefault();e.target.click();}});
$("#products").addEventListener("click",e=>{
 const b=e.target.closest("[data-act]");if(!b)return;
 const item=products.find(x=>x.id===Number(b.closest(".product-card").dataset.id));if(!item)return;
 if(b.dataset.act==="approve")approve(item);else if(b.dataset.act==="decision")showDecision(item);else showDetail(item);
});
$("#detailApprove").addEventListener("click",()=>approve(products.find(x=>x.id===selected)));
$("#detailDecision").addEventListener("click",()=>showDecision(products.find(x=>x.id===selected)));
$("#close").addEventListener("click",()=>dialog.close());$("#cancel").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
form.addEventListener("submit",e=>{
 e.preventDefault();const item=products.find(x=>x.id===Number(form.elements.id.value)),note=form.elements.note.value.trim();
 if(!item||note.length<5)return notify("Vui lòng ghi phản hồi tối thiểu 5 ký tự.");
 item.note=note;item.status=form.elements.status.value;save();dialog.close();render();
 notify(item.status==="revision"?"Đã gửi yêu cầu chỉnh sửa cho người bán.":"Đã từ chối bài đăng.");
});
wireHeader(value=>{query=value;render();});render();
