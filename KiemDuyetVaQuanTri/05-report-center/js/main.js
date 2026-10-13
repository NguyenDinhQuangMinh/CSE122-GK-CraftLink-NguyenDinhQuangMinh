
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

const KEY="craftlink-slide05-reports-v2";
const reports=[
 {id:"RPT20261003",sender:"Nguyễn Văn Hòa",target:"Bình gốm hoa sen",type:"Sản phẩm",reason:"Nội dung vi phạm",date:"03/10/2026 14:32",status:"pending"},
 {id:"RPT20261002",sender:"Tần Thị Mai",target:"Đỗ Văn Quang",type:"Người dùng",reason:"Gian lận",date:"03/10/2026 11:18",status:"verifying"},
 {id:"RPT20261001",sender:"Lê Minh Tuấn",target:"Trang trí tường macrame",type:"Bài đăng",reason:"SP không đúng mô tả",date:"03/10/2026 09:45",status:"handled"},
 {id:"RPT20260930",sender:"Phạm Thu Trang",target:"Đèn mây tre đan",type:"Sản phẩm",reason:"Nội dung vi phạm",date:"02/10/2026 16:20",status:"pending"},
 {id:"RPT20260929",sender:"Vũ Thị Hạnh",target:"Túi cói quai tròn",type:"Sản phẩm",reason:"Gian lận",date:"01/10/2026 13:07",status:"verifying"},
 {id:"RPT20260928",sender:"Hoàng Anh Dũng",target:"Bộ ấm chén men lam",type:"Sản phẩm",reason:"Nội dung vi phạm",date:"01/10/2026 10:22",status:"handled"},
 {id:"RPT20260927",sender:"Nguyễn Thị Lan",target:"Hộp gỗ khắc tay",type:"Sản phẩm",reason:"SP không đúng mô tả",date:"30/09/2026 08:55",status:"pending"},
 {id:"RPT20260926",sender:"Phạm Quang Minh",target:"Rổ mây đựng trái cây",type:"Sản phẩm",reason:"Nội dung vi phạm",date:"29/09/2026 15:40",status:"verifying"}
];
let restored=false;try{const saved=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(saved)){reports.splice(0,reports.length,...saved);restored=true}}catch{}
if(!restored){const firstReports=reports.slice();for(let n=2;n<=5;n++)firstReports.forEach(r=>reports.push({...r,id:r.id+"-"+n}));}
function save(){try{localStorage.setItem(KEY,JSON.stringify(reports));}catch{}}
const labels={pending:"Đang chờ",verifying:"Đang xác minh",handled:"Đã xử lý",dismissed:"Đã bỏ qua"};
let query="",selected="",page=1;const pageSize=8;
const dialog=$("#detailDialog");
function render(){
 const q=($("#search").value||query).toLocaleLowerCase("vi"),status=$("#status").value,reason=$("#reason").value,period=$("#period").value;
 const found=reports.filter(r=>{const a=r.date.slice(0,10).split("/").map(Number),age=(Date.now()-new Date(a[2],a[1]-1,a[0]).getTime())/86400000;return(status==="all"||r.status===status)&&(reason==="all"||r.reason===reason)&&(!period||period==="all"||age<=Number(period))&&[r.id,r.sender,r.target,r.reason].join(" ").toLocaleLowerCase("vi").includes(q)});
 const pages=Math.max(1,Math.ceil(found.length/pageSize));page=Math.min(page,pages);
 $("#rows").innerHTML=found.slice((page-1)*pageSize,page*pageSize).map(r=>
 '<tr><td class="report-id">#'+r.id+'</td><td>'+esc(r.sender)+'</td><td><b>'+esc(r.target)+'</b><span class="subtext">'+esc(r.type)+'</span></td><td>'+esc(r.reason)+'</td><td>'+r.date+'</td><td><span class="status '+r.status+'">'+labels[r.status]+'</span></td><td><div class="actions"><button class="action-btn primary small" data-act="detail" data-id="'+r.id+'">Xem chi tiết</button><button class="action-btn small" data-act="ignore" data-id="'+r.id+'">Bỏ qua</button><button class="action-btn danger small" data-act="process" data-id="'+r.id+'">Xử lý vi phạm</button></div></td></tr>'
 ).join("")||'<tr><td colspan="7" class="empty">Không tìm thấy báo cáo phù hợp.</td></tr>';
 $("#pagination").innerHTML='<button data-page="'+Math.max(1,page-1)+'" '+(page===1?"disabled":"")+' aria-label="Trang trước">‹</button>'+Array.from({length:pages},(_,i)=>'<button class="'+(page===i+1?"active":"")+'" data-page="'+(i+1)+'">'+(i+1)+'</button>').join("")+'<button data-page="'+(page+1)+'" aria-label="Trang sau">›</button><select class="page-size" aria-label="Số dòng mỗi trang"><option>10 / trang</option></select>';
}
function openDetail(report){
 selected=report.id;$("#detailTitle").textContent="Báo cáo #"+report.id;
 $("#detailText").textContent="Người gửi: "+report.sender+"\nĐối tượng: "+report.target+" ("+report.type+")\nLý do: "+report.reason+"\nNgày gửi: "+report.date+"\nTrạng thái: "+labels[report.status];
 $("#detailEffect").textContent=report.effect||"Chưa có quyết định xử lý.";$("#verify").hidden=report.status!=="pending";
 $("#ignore").hidden=report.status==="handled"||report.status==="dismissed";$("#process").hidden=report.status==="handled"||report.status==="dismissed";dialog.showModal();
}
function act(report,action){
 if(action==="verify"){report.status="verifying";notify("Đã chuyển báo cáo sang xác minh.");}
 if(action==="ignore"){if(!confirm("Bỏ qua báo cáo "+report.id+"?"))return;report.status="dismissed";report.effect="Báo cáo được đánh dấu đã bỏ qua.";notify("Đã bỏ qua báo cáo.");}
 if(action==="process"){if(!confirm("Xử lý vi phạm của “"+report.target+"”?"))return;report.status="handled";report.effect=report.type==="Người dùng"?"Tài khoản bị tạm ngưng trong demo.":"Sản phẩm bị ẩn trong demo.";notify("Đã xử lý báo cáo vi phạm.");}
 save();dialog.close();render();
}
["#search","#status","#reason","#period"].forEach(s=>$(s).addEventListener(s==="#search"?"input":"change",()=>{page=1;render();}));
wireHeader(value=>{query=value;$("#search").value=value;render();});
$("#rows").addEventListener("click",e=>{const b=e.target.closest("[data-act]");if(!b)return;const r=reports.find(x=>x.id===b.dataset.id);if(b.dataset.act==="detail")openDetail(r);else act(r,b.dataset.act);});
$("#pagination").addEventListener("click",e=>{if(e.target.dataset.page){page=Number(e.target.dataset.page);render();}});
$("#pagination").addEventListener("change",e=>{if(e.target.matches(".page-size"))notify("Danh sách đang hiển thị tối đa 10 báo cáo.");});
$("#close").addEventListener("click",()=>dialog.close());$("#cancel").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
["verify","ignore","process"].forEach(id=>$("#"+id).addEventListener("click",()=>act(reports.find(r=>r.id===selected),id)));
render();
