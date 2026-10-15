CÂU 1 — Khung Layout và HTML ngữ nghĩa
1.1. Sơ đồ bố cục tổng thể
Trang của em là layout 2 cột (sidebar trái + nội dung phải), không xếp chồng dọc
code.txt
┌──────────────────┬────────────────────────────────────────────┐
│ <aside>          │ <main class="app">                         │
│ class="sidebar"  │                                            │
│                  │  ┌─ <header class="topbar"> ─────────────┐ │
│ <a class="brand">│  │ <label class="system-search">         │ │
│ <div class=      │  │   └ <input type=search id=globalSearch>│ │
│  "area-label">   │  │ <div class="top-actions">             │ │
│                  │  │  ├ <div class="popover-wrap">         │ │
│ <nav class=      │  │  │   ├ <button id=noticeButton><svg>  │ │
│  "side-nav">     │  │  │   └ <section class=popover hidden> │ │
│  6 × <button>    │  │  └ <div class="popover-wrap">         │ │
│                  │  │      ├ <button class=profile><img>    │ │
│ <div class=      │  │      └ <section class=popover hidden> │ │
│  "sidebar-spacer">│ └───────────────────────────────────────┘ │
│                  │  ┌─ <div class="page"> ─────────────────┐  │
│ <div class=      │  │  <h1> Quản lý danh mục ...           │  │
│  "sidebar-status">│ │  <div class="toolbar">               │  │
│  <span> ×2       │  │   ├ <label class=search-box>         │  │
│                  │  │   │   └ <input type=search id=search>│  │
│ <button class=   │  │   └ <button class=primary id=add>    │  │
│  "side-user">    │  │  <section class="table-card card">   │  │
│  <img>+<span>    │  │   └ <table class="data-table">       │  │
│   └ <b> <small>  │  │      ├ <thead> 5 × <th>              │  │
│                  │  │      └ <tbody id="rows"> ← JS đổ dòng│  │
│                  │  │  <dialog class="dialog" id="editor"> │  │
│                  │  │   └ <form id="form">                 │  │
│                  │  │      ├ <header class="dialog-head">  │  │
│                  │  │      │   <h2 id=dialogTitle> <button>│  │
│                  │  │      ├ <input type=hidden name=id>   │  │
│                  │  │      ├ <label> ×3 (mỗi cái 1 <input>)│  │
│                  │  │      └ <div class="dialog-actions">  │  │
│                  │  │          <button> ×2                 │  │
└──────────────────┴──┴──────────────────────────────────────┴──┘
                    <div id="toast" role="status" aria-live="polite">
                    — position:fixed, nằm ngoài luồng trang —
Thẻ ngữ nghĩa đã dùng: <aside> · <nav> · <main> · <header> (×2) · <section> (×3) · <table>/<thead>/<tbody> · <dialog> · <form> · <label> · <h1>/<h2> · <button>.
Điểm cần nói chủ động: trang không có <footer>. Đây là trang đơn trong khu quản trị nên em chưa dùng; nếu làm đầy đủ thì footer sẽ chứa bản quyền và phiên bản hệ thống. Nói trước còn hơn để giám khảo tự tìm ra.
1.2. Thành phần bên trong từng khối
KhốiChứa gìThẻ HTML<aside class="sidebar">Logo, nhãn khu vực, menu, khoảng đệm, trạng thái hệ thống, tài khoản<a> <span> <div> <nav> <button> <svg> <img> <b> <small><nav class="side-nav">6 mục điều hướng, mỗi mục = 1 biểu tượng + 1 nhãn<button> (mỗi button có data-page), <svg> + <rect>/<path>/<circle><header class="topbar">Ô tìm kiếm toàn hệ thống + 2 cụm nút có menu xổ<label> <input type="search"> <div> <button> <svg> <i> <img> <section hidden> <b> <p> <small><header class="dialog-head">Tiêu đề hộp thoại + nút đóng<h2> <button><footer>Không có—
1.3. Mã HTML rút gọn của đối tượng lặp lại
Đối tượng lặp lại của em là một dòng danh mục trong bảng. Nó không có sẵn trong index.html — <tbody id="rows"> để trống; khung HTML của một dòng nằm trong main.js:90–111
code.html
<tr class="category-row">
  <td>
    <div class="category-name">
      <img class="category-thumb" src="../assets/category-1.png" alt="">
      <span>Gốm sứ thủ công</span>
    </div>
  </td>
  <td>3</td>
  <td>128</td>
  <td><span class="status">Hiển thị</span></td>
  <td>
    <div class="category-actions">
      <button class="switch on"  type="button" data-act="toggle" data-id="c1"></button>
      <button class="action-btn" type="button" data-act="edit"   data-id="c1">✎ Sửa</button>
      <button class="action-btn" type="button" data-act="delete" data-id="c1">▤ Xóa</button>
    </div>
  </td>
</tr>
Thẻ lồng nhau: <tr> → <td> → <div> → <img> / <span> / <button>. data-act nói nút nào, data-id nói danh mục nào — hai dữ liệu này là cầu nối để một listener duy nhất xử lý được cả 15 nút.
CÂU 2 — Dàn trang và Định dạng CSS
2.1. Khu vực dùng Flexbox / Grid
CSS Grid
Khu vựcThuộc tínhTác dụng.side-nav (danh sách menu)display: grid + gap: 6pxXếp 6 nút một cột, cách nhau 6px mà không cần margin..side-nav trên mobilegrid-template-columns: repeat(3, 1fr) ≤680pxChuyển menu từ 1 cột dọc thành lưới 3 cột ngang, mỗi ô chiếm 1/3 đều nhau..brand-mark (chữ C logo)display: grid + place-items: centerCăn giữa chữ C cả dọc lẫn ngang trong ô vuông 35px chỉ bằng 1 khai báo.
Flexbox
Khu vựcThuộc tínhTác dụng.sidebardisplay: flex + flex-direction: columnXếp dọc các khối trong sidebar..sidebar-spacerflex: 1Chiếm hết chỗ trống còn lại, đẩy trạng thái + tài khoản xuống đáy..nav-linkdisplay: flex + align-items: center + gap: 12pxIcon và chữ thẳng hàng dọc, cách nhau 12px..topbardisplay: flex + align-items: centerÔ tìm kiếm và các nút cùng một hàng, giữa theo chiều cao..category-namedisplay: flex + align-items: center + gap: 14pxẢnh và tên danh mục nằm cạnh nhau trong ô <td>..category-actionsdisplay: flex + justify-content: center + gap: 10px3 nút thao tác căn giữa và cách đều nhau..dialog-headdisplay: flex + justify-content: space-betweenTiêu đề sang trái, nút × sang phải.
2.2. Định vị và khoảng cách
ElementpositionVì sao.sidebarfixed + inset: 0 auto 0 0 + z-index: 2Ghim cứng mép trái, cuộn trang vẫn còn..appkhông (dùng margin-left: 270px)Nhường chỗ cho sidebar — hai giá trị này phải khớp nhau..topbarsticky + top: 0 + z-index: 1Dính đầu khi cuộn, để ô tìm kiếm luôn trong tầm với..popover-wraprelativeLàm mốc tham chiếu cho menu xổ..popoverabsoluteĐổ ra ngay dưới nút mà không đẩy layout..icon-btn i (chấm thông báo)absoluteGhim chấm đỏ lên góc nút chuông..switchrelativeMốc cho quả trượt..switch:afterabsolute + left: 4pxQuả tròn nằm trong công tắc.#toastfixed + right: 24px + bottom: 22pxNeo vào màn hình, không phụ thuộc cuộn.
margin / padding:
- reset.css: { box-sizing: border-box }
-  — padding tính vào trong bề rộng; body { margin: 0 } — bỏ 8px mặc định.
- .sidebar { padding: 29px 0 20px } — đệm trên dưới, không đệm trái phải vì các nút tự lo padding.
- .nav-link { padding: 0 12px } — chữ không dính mép thanh.
- .page { padding: 18px 27px 28px } — vùng nội dung thở ra.
- .category-thumb { padding: 3px } — tạo viền trắng mỏng quanh ảnh.
- .empty { padding: 26px } — dòng "Không tìm thấy" không bị lún.
2.3. Hiệu ứng tương tác
Hiệu ứng chính — công tắc bật/tắt hiển thị (components.css:148–173)
code.css
.switch        { position: relative; width: 48px; height: 29px;
                 border-radius: 18px; background: #c6c8c8; }
.switch:after  { content: ""; position: absolute; left: 4px;  width: 21px;
                 height: 21px; border-radius: 50%; background: #fff;
                 transition: .15s; }
.switch.on     { background: #438861; }
.switch.on:after { left: 23px; }
Cách hoạt động: JavaScript không đổi kiểu gì trực tiếp — nó chỉ thêm/bớt lớp .on trong render(). Trình duyệt tự nội suy chuyển động giữa left: 4px và left: 23px nhờ transition: .15s, và màu nền chuyển xám ↔ xanh. Quả tròn là phần tử giả :after, không có trong HTML.
Hiệu ứng phụ: #toast { opacity: 0; pointer-events: none; transition: .2s } + #toast.show { opacity: 1 } — thông báo fade vào fade ra. pointer-events: none để lúc ẩn nó không chặn click vào nội dung bên dưới.
Hover: .primary:hover { background: #b94524 } — nút cam đậm hơn khi rê chuột.
Không dùng Bootstrap/Tailwind — toàn bộ CSS tự viết.
CÂU 3 — Tương tác JavaScript
Chức năng em chọn: Thêm / chỉnh sửa danh mục qua hộp thoại Modal.
3.1. Sự kiện và chọn phần tử
Câu hỏiTrả lờiNgười dùng thao tác gì?Hai sự kiện. Bấm click vào "＋ Thêm danh mục mới" (hoặc nút ✎ Sửa trên dòng) để mở hộp thoại. Rồi submit của <form> khi bấm "Lưu danh mục" hoặc bấm Enter trong ô input.Lệnh gì tìm phần tử?Một hàm bọc: const $ = s => document.querySelector(s); (main.js:1). Từ đó: const form = $("#form") :72, const dialog = $("#editor") :73, $("#add").addEventListener("click", ...) :129. Không dùng getElementById — dùng querySelector để một hàm tìm được cả theo class và thuộc tính.Mở hộp thoại thế nào?dialog.showModal() (:126) — API native của thẻ <dialog>, tự sinh nền mờ ::backdrop và chặn thao tác phía sau, không cần thư viện.Nút trong bảng tìm bằng gì?Không tìm trước. Một listener trên #rows (:145) + e.target.closest("[data-act]") để suy ra nút, rồi items.find(x => x.id === button.dataset.id) để tìm danh mục.
3.2. Luồng xử lý
code.txt
Lấy dữ liệu input  →  Kiểm tra điều kiện  →  Xử lý dữ liệu  →  Cập nhật giao diện (DOM)
① Lấy dữ liệu input (main.js:176–178)
code.js
const id   = form.elements.id.value;              // input ẩn
const name = form.elements.name.value.trim();     // trim bỏ khoảng trắng thừa
const item = { children: Number(form.elements.children.value) || 0, ... };
② Kiểm tra điều kiện (:173–177)
code.js
e.preventDefault();                        // chặn trình duyệt tải lại trang
if (!form.reportValidity()) return;        // tận dụng required / maxlength / min
const old = items.find(x => x.id === id);  // có id trong mảng ⇒ là SỬA, không ⇒ là THÊM
③ Xử lý dữ liệu (:179–190)
code.js
id:      id || "c" + Date.now(),   // thêm mới thì tự sinh mã
active:  old?.active ?? true,      // sửa thì GIỮ trạng thái; chỉ bản mới tinh mới bật
image:   old?.image  || 1,
items = old
  ? items.map(x => x.id === id ? item : x)   // thay đúng phần tử cũ
  : [...items, item];                         // nối vào cuối
const ok = save();                            // ghi localStorage, trả true/false
④ Cập nhật giao diện (DOM) (:193–197 + render() :87)
Thuộc tính JSDùng ở đâuThay đổi gì trên màn hìnhdialog.close():193Hộp thoại và nền mờ biến mấtelement.innerHTMLrender() :87Toàn bộ <tbody> bị ghi đè — dòng mới xuất hiện / dòng cũ mất đielement.textContentrender() :123, notify() :6Tiêu đề hộp thoại đổi; nội dung thông báo đổiclassList.add() / .remove()notify() :7 / :11Thêm .show → toast fade vào; gỡ .show → fade ra sau 2 giâyelement.hiddenwireHeader() :20–33Bật / tắt menu thông báo và menu tài khoản
Không dùng style.display ở đâu cả — mọi thay đổi hiển thị đi qua class (.show, .on, .off, .active) hoặc thuộc tính hidden. Lý do: tách kiểu khỏi logic, và render() chỉ cần đổi chuỗi class là giao diện đổi theo.
Kết quả cuối: bảng vẽ lại từ mảng items, hộp thoại đóng, toast hiện "Bạn đã thêm danh mục thành công." trong 2 giây. Dữ liệu đã nằm trong localStorage nên F5 vẫn còn.
