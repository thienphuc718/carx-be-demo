'use strict';
const { v4: uuidv4 } = require('uuid');
const schemaConfig = require(__dirname + '../../config/schema.js');

const removeVietnameseTones = (str) => {
  // remove accents
  const from =
    'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ';
  const to =
    'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, ' ')
    .replace(/-+/g, ' ');

  return str;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    let serviceTemplateGroup1 = [
      'Đại tu toàn diện máy',
      'Thay ron carte',
      'Công thay dầu máy xe ô tô',
      'Công thay lọc dầu xe ô tô',
      'Công thay dầu máy, lọc dầu xe ô tô',
      'Thay lọc xăng xe ô tô',
      'Thay lọc xăng thả thùng',
      'Thay lọc nhiên liệu xe ô tô',
      'Thay dầu hộp số MT',
      'Thay bơm xăng',
      'Thay chế hòa khí, chỉnh máy',
      'Thay lọc gió xe ô tô',
      'Thay bugi xe ô tô',
      'Xử lý động cơ xì nhớt',
      'Bảo dưỡng chế hoà khí, chỉnh máy (bao gồm vật liệu bảo dưỡng)',
      'Bảo dưỡng cụm bướm ga, chỉnh máy (bao gồm vật liệu bảo dưỡng)',
      'Bảo dưỡng cụm bướm ga, thông súc tu bô, chỉnh máy (bao gồm vật liệu bảo dưỡng)',
      'Kiểm tra, vệ sinh bugi (trường hợp tháo bugi phức tạp thêm công 100%)',
      'Bảo dưỡng Delco xe ô tô',
      'Bảo dưỡng máy phát điện xe ô tô',
      'Bảo dưỡng máy đề xe ô tô',
      'Thay nước mát xe ô tô',
      'Thông súc két nước (không tháo) (bao gồm dung dịch làm sạch)',
      'Thông súc két nước (tháo két nước ra ngoài)',
      'Tháo hàn két nước, thông súc',
      'Tháo lắp kiểm tra kim phun, bơm cao áp (loại bơm không cân)',
      'Tháo lắp căn chỉnh kim phun',
      'Cân bơm cao áp xe ô tô',
      'Thông súc bình xăng hoặc thùng dầu xe ô tô',
      'Tăng chỉnh dây curoa ngoài',
      'Tăng chỉnh dây curoa ngoài (3 dây)',
      'Vệ sinh kim phun và buồng đốt bằng thiết bị CHLB Đức- Máy dầu dung tích nhỏ nhơn 2.5L',
      'Thay phớt chân bugi (bộ) bao gồm keo gioăng – xe 4 máy chạy chế hoà khí',
      'Thay phớt chân bugi (bộ) bao gồm keo gioăng – xe 4 máy phun xăng',
      'Thay gioăng nắp supap bao gồm keo gioăng (4 máy)',
      'Thay gioăng nắp supap bao gồm keo gioăng (máy V), thay cả 2 bên tăng thêm 80%',
      'Kiểm tra thay dây cao áp',
      'Láng bàn ép hoặc bánh đà',
      'Láng bàn ép bánh đà',
      'Láng đĩa phanh, tăm bua',
      'Láng bôn từ lốc lạnh (chưa bao gồm công tháo lắp lốc lạnh)',
      'Chế công bi láp',
      'Ép tuy ô điều hòa + hàn (chưa bao gồm vật tư)',
      'Ép tuy ô trợ lực (chưa bao gồm vật tư)',
      'Gia công chế 01 rô tuyn',
      'Mài rà mặt máy (không bao gồm công tháo lắp)',
      'Doa mài xi lanh 04 máy (không bao gồm công đại tu máy)',
      'Doa mài xi lanh 6-8 máy (không bao gồm công đại tu máy)',
      'Thay xi lanh (đóng nòng) (không bao gồm công đại tu máy)',
      'Mài trục cơ 04 máy',
      'Mài trục cơ 06 máy',
      'Thay vai két nước (chế vai két nước bao gồm thông súc)',
      'Gia công, đánh bóng thanh thước lái + thay phớt (sedan)',
      'Gia công, đánh bóng thanh thước lái + thay phớt (SUV xe đặc chủng)',
      'Công thay tay mở cửa ngoài, trong',
      'Công thay nẹp cánh cửa',
      'Công thay ốp phồng',
      'Công thay chắn bùn',
      'Công thay lòng dè',
      'Công thay trần',
      'Công thay mặt gương (phức tạp công tăng 50%)',
      'Công thay ca lăng',
      'Công thay chắn bùn gầm máy',
      'Thay cảm biến oxy',
      'Thay thế cảm biến ',
      'Xúc rửa động cơ',
      'thay dầu trợ lực ',
      'Thay lọc xăng nhựa lắp ngoài ',
      'Thay lọc xăng sắt lắp ngoài  ',
      'Thay lọc xăng (lắp trong bình xăng) ',
      'Thay lọc xăng (phải hạ bình xăng) ',
      'Thay chế hoá khí + chỉnh máy  ',
      'Thay lọc gió  ',
      'Thay bugi (động cơ 4 máy)',
      'Thay bugi (động cơ 6 -8 máy) không tháo cổ hút',
      'Thay bugi (động cơ 6-8 máy ) phải tháo cổ hút  ',
      'Thay phớt bugi (bộ) + keo gắn gioăng nắp supap (4 máy chạy chế hòa khí) ',
      'Thay phớt bugi (bộ) + keo gắn gioăng nắp supap (4 máy phun xăng) ',
      'Thay gioăng nắp supáp + keo gắn gioăng (4 máy) ',
      'Thay gioăng nắp supáp + keo gắn gioăng 1 bên (Máy V). Nếu thay cả hai bên tăng thêm 80%. ',
      'Thay gioăng nắp xupáp máy V6 (phải tháo cổ hút)/1 vế ',
      'Kiểm tra, thay dây cao áp  ',
      'Thay nước mát ',
      'Thay vai két nước + thông súc ',
      'Tháo lắp thay két nước ',
      'Thay bơm nước (một số xe phải tháo dỡ hết phần giàn đầu máy tăng thêm 50% công) ',
      'Thay cánh quạt két nước ',
      'Thay lồng quạt két nước đơn (1bên)',
      'Thay lồng quạt két nước kép (1bên)',
      'Thay dây curoa đơn',
      'Thay dây curoa tổng',
      'Thay gioăng đáy các te hoặc xử lý chảy dầu đáy các te + keo máy',
      'Thay gioăng quy lát, mài mặt máy, vệ sinh (4 máy )',
      'Thay gioăng mặt máy, mài mặt máy 6 máy thẳng hàng',
      'Thay gioăng mặt máy (động cơ turbo hoặc comonrail 6-8 máy) ',
      'Thay gioăng mặt máy một bên, mài mặt máy (máy chữ V). ',
      'Thay mặt máy (mài rà xupáp, thay phớt gíp…)',
      'Căn chỉnh supáp (xu páp chỉnh cơ khí)',
      'Thay con đội supáp (không tháo cam)',
      'Thay con đội supáp (phải tháo cam)',
      'Kiểm tra thay cảm biến trục cơ hoặc trục cam, chỉnh máy',
      'Thay cảm biến nhiệt độ, nước, dầu',
      'Kiểm tra thay cụm bướm ga + cài đặt bằng máy chuyên dùng',
      'Kiểm tra thay cảm biến đo gió',
      'Kiểm tra thay kim phun / 1 cái',
      'Kiểm tra thay kim phun (1bộ)',
      'Thay cụm Turbo',
      'Thay curoa cam, bi tỳ, tỳ tăng cam (4 máy)',
      'Thay cua roa cam,bi tăng,bi tỳ cam (6 máy V)',
      'Thay bơm dầu máy (một số xe phải tháo dỡ hết phần giàn đầu máy, tháo đáy các te thì tăng thêm 30% công)',
      'Thay phớt đầu trục cơ, phớt cam,phớt trục cân bằng, phớt bơm dầu (động cơ 4 máy chạy dây cam)',
      'Thay phớt đầu trục cơ, phớt cam,phớt trục cân bằng, phớt bơm dầu (động cơ 6 máy chạy dây cam)',
      'Thay phớt đầu trục cơ (động cơ chạy xích cam)',
      'Thay phớt đuôi trục cơ (Hạ hộp số cơ)',
      'Thay phớt đuôi trục cơ (Hạ hộp số tự động)',
      'Thay phớt đuôi trục cơ (Phải cẩu máy)',
      'Thay gioăng cổ xả giáp thân động cơ (loại phức tạp tăng 50%)',
      'Thay ống xả đoạn giữa (loại có lọc tăng 50%)  ',
      'Thay ống xả đoạn cuối (loại hai bầu tăng thêm 50%)',
      'Thay toàn bộ ống xả',
      'Thay 01 chân máy (nếu chân máy phức tạp phải tháo nhiều chi tiết tính trên cơ sở thực tế) ',
      'Thay chân máy phụ trước hoặc sau  ',
      'Thay giằng đầu máy ',
      'Thay bơm xăng cơ, bơm xăng điện ngoài thùng xăng ',
      'Thay bơm xăng điện trong thùng xăng (không hạ bình xăng) ',
      'Thay bơm xăng điện trong thùng xăng (phải hạ bình xăng) ',
      'Hạ hộp số thay lá côn, bàn ép, bi tê, phớt đuôi trục cơ (động cơ 4 máy ngang)  ',
      'Hạ hộp số thay lá côn, bàn ép, bi tê, phớt đuôi trục cơ (động cơ 6 máy ngang)   ',
      'Cẩu máy thay lá côn,bàn ép,bi tê ',
      'Hạ hộp số thay lá côn, bàn ép, bi tê, phớt đuôi trục cơ (động cơ 4 máy dọc) ',
      'Tháo lắp hôp số phải hạ giá bệ đỡ máy (XTRAIL……)  ',
      'Thay xéc măng, bạc biên, baliê, gioăng phớt + căn chỉnh máy (tương đương bằng 80% công đại tu).',
      'Đại tu máy động cơ 4 máy',
      'Đại tu máy động cơ 6 máy ',
      'Đại tu máy động cơ 8 máy  ',
      'Đại tu máy những loại động cơ đặc chủng phức tạp, hiệu xe sang',
    ];

    const serviceTemplateGroup2 = [
      'Thay láp ngoài / 1 bên',
      'Thay láp trong / 1 bên',
      'Thay láp cả cây',
      'Thay phớt láp',
      'Thay bi moay ơ trước hoặc cụm bi /1 bên',
      'Thay bi moay ơ sau hoặc cụm bi /1 bên',
      'Thay má phanh trước',
      'Thay cuppen phanh trước, xả e',
      'Thay cupen phanh sau, xả e',
      'Thay dầu phanh (tháo các bộ phận vệ sinh, xả e,...)',
      'Thay dầu phanh không tháo các bộ phận, xả e',
      'Thay tổng phanh, xả e',
      'Thay cụm ABS, test xoá lỗi',
      'Thay ruột tổng phanh, xả e',
      'Thay tuy ô phanh, xả e',
      'Thay ruột tổng côn, xả e',
      'Thay trượt côn dưới hoặc ruột, xả e',
      'Thay rô tuyn lái ngoài hoặc cao su chụp bụi thước lái, chỉnh lái',
      'Thay rô tuyn lái trong, chỉnh lái',
      'Thay bộ lái (lái trong + lái ngoài), chỉnh lái',
      'Thay rô tuyn cân bằng trước sau',
      'Thay cao su cân bằng trước, sau',
      'Thay rô tuyn đứng trên hoặc dưới',
      'Thay bộ rotuyn đứng (4 quả)',
      'Thay càng A hoặc cao su càng A (TH phức tạp công tăng 50%)',
      'Thay càng A dưới hoặc cao su (TH phức tạp công tăng 30%)',
      'Thay giá bắt moay ơ trước (sau)',
      'Kiểm tra thay cảm biến ABS',
      'Thay bát bèo trước, sau hoặc bi bát bèo (TH phức tạp công tăng 50%)',
      'Thay giảm sóc trước (sau)',
      'Thay lò xo giảm sóc trước (sau)',
      'Thay phớt thước lái + căn chỉnh',
      'Thay Bộ phớt bót lái + căn chỉnh',
      'Thay phớt hoặc bạc, hoặc BD thước lái cơ',
      'Thay thước lái cơ, căn chỉnh góc lái',
      'Thay thước lái trợ lực, căn chỉnh góc lái',
      'Thay bơm trợ lực (TH phức tạp công tăng 50%)',
      'Tháo lắp thay phớt bơm trợ lực',
      'Thay khớp các đăng lái (TH phức tạp công tăng 50%)',
      'Thay thanh chuyển hướng lái + căn chỉnh góc lái',
      'Thay thanh giằng dọc sau hoặc ngang sau',
      'Thay cao su giằng dọc sau',
      'Thay dây công tơ mét hoặc cảm biến CTM',
      'Thay dây côn',
      'Thay lốp hoặc la zăng (bao gồm cân bằng động)',
      'Thay cuppen phanh trước, xả e',
      'Thay cupen phanh sau, xả e',
      'Thay dầu phanh (tháo các bộ phận vệ sinh, xả e, KT)',
      'Thay dầu phanh không tháo các bộ phận, xả e',
      'Thay tổng phanh, xả e',
      'Thay cụm ABS, test xoá lỗi',
      'Thay ruột tổng phanh, xả e',
      'Thay tuy ô phanh, xả e',
      'Thay ruột tổng côn, xả e',
      'Thay càng A hoặc cao su càng A (TH phức tạp công tăng 50%)',
      'Thay càng A dưới hoặc cao su (TH phức tạp công tăng 30%)',
      'Thay giá bắt moay ơ trước (sau)',
      'Kiểm tra thay cảm biến ABS',
      'Bảo dưỡng láp trong (1 bên)',
      'Bảo dưỡng phanh trước hoặc sau',
      'Bảo dưỡng moay ơ trước / 1 bánh (xe Sedan)',
      'Bảo dưỡng moay ơ trước / 1 bánh (xe SUV)',
      'Bảo dưỡng phanh moay ơ 4 bánh (xe Sedan)',
      'Bảo dưỡng phanh moay ơ 4 bánh (xe SUV)',
      'Chỉnh độ chụm, góc đặt bánh xe',
      'Cân bằng động 1 bánh xe (bao gồm cả kẹp chì)',
      'Tháo lắp bảo dưỡng hệ thống trục vô lăng lái, căn chỉnh lái',
    ];

    const serviceTemplateGroup3 = [
      'Tháo lắp hộp số thay bánh răng',
      'Tháo lắp thay lá côn hộp số tự động',
      'Thay hộp số tự động',
      'Thay bi hộp số hoặc ruột hộp số',
      'Công thay thế hộp số',
      'Công hạ hộp số kiểm tra',
      'Thay vỉ điện hộp số',
      'Thay valve body',
      'Thay nhớt hộp số',
      'Thay cảm biến tốc độ hộp số',
      'Thay thế linh kiện cảm biến của hộp số',
    ];

    const serviceTemplateGroup4 = [
      'Bảo dưỡng mô tơ quạt dàn lạnh',
      'Bảo dưỡng lốc lạnh + nạp ga + dầu lốc (đã bao gồm ga và dầu)',
      'Bảo dưỡng hệ thống điều hòa + nạp ga + dầu lốc (1 giàn)',
      'Bảo dưỡng hệ thống điều hòa + nạp ga + dầu lốc (2 giàn)',
      'Bảo dưỡng hệ thống điều hòa + nạp ga + dầu lốc (1 giàn) (phải tháo táp lô)',
      'Thay rơ le ngắt lạnh (lắp rơ le cơ)',
    ];

    const serviceTemplateGroup5 = [
      'Bảo dưỡng máy phát (bao gồm xăng dầu rửa, mỡ…)',
      'Bảo dưỡng máy đề (bao gồm xăng dầu rửa, mỡ…)',
      'Bảo dưỡng mô tơ lên xuống kính cửa',
      'Thay ắc quy',
      'Thay còi',
      'Thay còi + lắp chuyển đổi 02 loại còi',
      'Lắp bộ điều khiển chốt cửa (bao gồm rơ le)',
      'Thay đèn pha hoặc phải tháo đèn pha để thay bóng đèn',
      'Thay đèn xi nhan',
      'Thay đèn padershock trước',
      'Lắp đèn cản trước (1 bộ bao gồm cả công tắc)',
      'Lắp đầu CD, VCD, DVD (phức tạp phải khảo sát và thỏa thuận với khách)',
      'Thay loa đài',
      'Thay ăng ten',
      'Thay quạt két nước, quạt giàn nóng hoặc cánh quạt',
      'Thay máy phát (TH phải tháo lắp nhiều, công tăng 50%)',
      'Thay chổi than, IC máy phát + BD',
      'Thay chổi than máy đề + BD',
      'Thay máy đề',
      'Thay mô tơ lên kính cửa',
      'Thay đồng hồ táp lô hoặc đồng hồ CTM',
      'Thay công tắc lên kính cửa',
      'Thay giàn sưởi',
      'Thay cảm biến báo nhiên liệu',
      'Thay mô tơ trượt ghế',
      'Thay mô tơ gạt mưa',
      'Thay mô tơ bơm nước rửa kính',
      'Bảo dưỡng đổ nước ắc quy (bao gồm cả nước axit)',
      'Đánh 01 chìa khóa (bao gồm phôi chìa)',
      'Dùng máy scan xoá lỗi động cơ/hộp số ',
      'Đo thử nồng độ khí xả ',
      'Kiểm tra cài đặt chế độ không tải  ',
      'Dùng máy Scaner lập trình lại hệ thống  ',
      'Cài đặt lại chìa khoá/điều khiển từ  ',
      'Xóa lỗi đèn túi khí ',
      'Xóa lỗi, cài đạt hệ thống chống trượt ',
      'Kiểm tra cài đạt chế độ điều hòa  ',
      'Cài đặt mã Radio (bao gồm tháo lắp)  ',
      'Căn chỉnh, cài đạt hệ thống góc đặt tay lái điện ',
      'Cài đặt chế độ nâng gầm (giảm sóc khí – điện)',
    ];

    const serviceTemplateGroup6 = [
      'Sơn Cản (trước hoặc sau)',
      'Sơn Galant',
      'Sơn Hông dè (trước hoặc sau)',
      'Sơn Cửa hông) trước hoặc sau)',
      'Sơn Capô trước',
      'Sơn Cốp sau',
      'Sơn Kính hậu',
      'Sơn Lườn xe',
      'Sơn Mui xe',
      'Sơn Sàn sau',
      'Sơn Xương vè) hoặc lòng vè, hoặc khung xương két nước)',
      'Sơn Hông thùng sau bên (T) (hoặc cửa lùa sau)',
      'Sơn Hông dài thùng xe bên (P)',
      'Sơn Cửa) trước hoặc sau) – SPRINTER, TRANSIT',
      'Sơn Cốp sau – MER MB140D, HIACE',
      'Gò nắn chỉnh + sơn ba bu lê phải',
      'Gò nắn chỉnh + sơn ba bu lê trái',
      'Xử ký bề mặt sơn',
    ];

    const serviceTemplateGroup7 = [
      'Vệ sinh họng gas',
      'Vệ sinh kim phun',
      'Vệ sinh thắng đĩa',
      'Vệ sinh thay nước làm máy',
      'Vệ sinh khoang máy',
      'Vệ sinh buồng đốt',
      'Bảo dưỡng dinamo,bộ khởi động',
      'Thay nhớt 5,000km ',
      'Thay nhớt 10,000km ',
      'Thay nhớt hộp số ',
      'Vệ sinh bugi / Mobin',
      'Bảo dưỡng quạt giải nhiệt',
      'Vệ sinh dàn nóng',
      'Bảo dưỡng curoa',
      'Thay nhớt cầu,dầu thắng,trợ lực ',
      'Bảo dưỡng ắc-quy',
      'Dọn máy',
      'Dọn nội thất',
      'Dọn ngoại thất',
      'Dọn gầm',
      'Làm sạch – Bảo dưỡng Máy',
      'Làm sạch – Bảo dưỡng Nhựa ngoài',
      'Làm sạch – Bảo dưỡng Ghế',
      'Làm sạch – Bảo dưỡng Taplo',
      'Làm sạch – Bảo dưỡng Trần Sàn',
      'Làm sạch – Bảo dưỡng Cánh cửa và chi tiết Nhựa',
      'Làm sạch – Bảo dưỡng toàn bộ Gioăng',
      'Làm sạch – Bảo dưỡng toàn bộ nội thất',
      'Bảo dưỡng định kỳ cấp 1 (Sau 5.000km)',
      'Bảo dưỡng định kỳ cấp 2 (Sau 15.000km)',
      'Bảo dưỡng định kỳ cấp 3 (Sau 30.000km)',
      'Bảo dưỡng định kỳ cấp 4 (Sau 80.000km)',
      'Công bảo dưỡng cấp 5.000 km xe SEDAN (theo bảng chi tiết nội dung công việc cho từng số Km bảo dưỡng) và không bao gồm vật tư dầu, nước làm mát',
      'Công bảo dưỡng cấp 5.000 xe SUV (theo bảng chi tiết nội dung công việc cho từng số Km bảo dưỡng) và không bao gồm vật tư dầu, nước làm mát',
      'Công bảo dưỡng cấp 20.000 km (cấp trung bình lớn, bảng chi tiết công việc và không bao gồm vật tư, dầu, nước mát) xe Sedan',
      'Công bảo dưỡng cấp 20.000 km (cấp trung bình lớn, cấp trung bình lớn, bảng chi tiết công việc và không bao gồm vật tư, dầu, nước mát) xe SUV',
      'Công bảo dưỡng cấp 30.000 km (cấp bảo dưỡng lớn, bảng chi tiết công việc và không bao gồm vật tư, dầu, nước mát) xe SUV',
      'Công bảo dưỡng cấp 30.000- 60.000 km (cấp bảo dưỡng lớn, bảng chi tiết công việc và không bao gồm vật tư, dầu, nước mát) xe SUV',
      'Công bảo dưỡng chế hoà khí chỉnh máy + vật liệu bảo dưỡng',
      'Công bảo dưỡng họng hút gió ,chỉnh máy + vật liệu bảo dưỡng',
      'Công bảo dưỡng bướm ga, chỉnh máy + vật liệu bảo dưỡng',
      'Công bảo dưỡng cụm bướm ga, thông súc tubô, hiệu chỉnh máy + vật liệu bảo dưỡng',
      'Công bảo dưỡng van không tải + hiệu chỉnh máy ',
      'Công bảo dưỡng van tuần hoàn khí xả + hiệu chỉnh máy ',
      'Công bảo dưỡng van điều khiển TURBO +hiệu chỉnh máy  ',
      'Vệ sinh cảm biến đo gió + hiệu chỉnh máy  ',
      'Tháo vệ sinh họng hút + dung dịch ',
      'Vệ sinh bugi 4 máy (không tháo cổ hút) ',
      'Vệ sinh bugi 6 máy (tháo cổ hút) ',
      'Bảo Dưỡng đenco (hoặc thay phớt) ',
      'Thông súc két nước (không tháo) + dung dich làm sạch  ',
      'Thông súc két nước (tháo két nước ra ngoài)',
      'Tháo hàn két nước thông súc',
      'Thông súc kim phun (dùng máy) + dung dịch',
      'Tháo lắp kiểm tra kim phun, bơm cao áp (loại bơm không cân )',
      'Tháo lắp cân kim phun (động cơ 4 máy',
      'Tháo lắp cân kim phun (động cơ 6 máy) ',
      'Tháo lắp bơm cao áp (không phải tháo cam)',
      'Tháo lắp bơm cao áp (phải tháo cam)',
      'Tháo, lắp cân bơm cao áp',
      'Thông súc thùng xăng hoặc thùng dầu',
      'Tăng chỉnh dây curoa, ngoài/1dây',
      'Tháo lắp động cơ, bảo dưỡng vệ sinh máy chỉ tháo nắp supáp, đáy các te (không bao gồm vật tư)',
    ];

    const serviceTemplateGroup8 = [
      'Gắn body kit',
      'Wrap full xe',
      'Wrap trần',
      'Dán kính chống nhiệt, nắng',
      'Tune công suất stage 1 ',
      'Tune công suất stage 2',
      'Thay mâm ',
      'Độ đèn full led',
      'Độ đèn bi xenon',
      'Độ đèn Biled',
      'Độ trần 3D nội thất',
      'Độ ghế thể thao',
      'Nâng cấp nội thất',
      'Nâng đởi xe',
      'Độ Pô thể thao',
      'Thay máy hiệu suất cao',
      'Nâng cấp phần cứng động cơ',
    ];

    const serviceTemplateGroup9 = [
      'Rửa xe 4 chỗ (ngoại thất)',
      'Rửa xe 4 chỗ (Nội ngoại thất + Gầm)',
      'Rửa xe 7 chỗ (Ngoại thất)',
      'Rửa xe 7 chỗ (Nội ngoại thất + Gầm)',
      'Detailing Rửa xe 4 chỗ nâng cao',
      'Detailing rửa xe 7 chỗ nâng cao',
      'Rửa xe 8-12 chỗ',
      'Rửa xe khách >28 chỗ',
      'Phủ ceramic 1 lớp',
      'Phủ ceramic 2 lớp',
      'Phủ ceramic full',
      'Dán cách nhiệt',
      'Wrap xe full',
      'Wrap bộ phận',
      'Decal trang trí',
    ];

    let insertObjects1 = [];
    for (let i = 0; i < serviceTemplateGroup1.length; i++) {
      insertObjects1.push({
        id: uuidv4(),
        category_id: '62224493-4686-45a0-a960-427caeba6610',
        template: serviceTemplateGroup1[i],
        search: removeVietnameseTones(serviceTemplateGroup1[i]).split(' '),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    let insertObjects2 = [];
    for (let i = 0; i < serviceTemplateGroup2.length; i++) {
      insertObjects2.push({
        id: uuidv4(),
        category_id: 'a5ffb637-3f3f-469c-8bdd-9e3f12eaf482',
        template: serviceTemplateGroup2[i],
        search: removeVietnameseTones(serviceTemplateGroup2[i]).split(' '),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    let insertObjects3 = [];
    for (let i = 0; i < serviceTemplateGroup3.length; i++) {
      insertObjects3.push({
        id: uuidv4(),
        category_id: '07d9acfd-a624-4b0a-bf22-98e5765152be',
        template: serviceTemplateGroup3[i],
        search: removeVietnameseTones(serviceTemplateGroup3[i]).split(' '),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    let insertObjects4 = [];
    for (let i = 0; i < serviceTemplateGroup4.length; i++) {
      insertObjects4.push({
        id: uuidv4(),
        category_id: 'ce678873-d847-4e14-a396-eedb754f4f57',
        template: serviceTemplateGroup4[i],
        search: removeVietnameseTones(serviceTemplateGroup4[i]).split(' '),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    let insertObjects5 = [];
    for (let i = 0; i < serviceTemplateGroup5.length; i++) {
      insertObjects5.push({
        id: uuidv4(),
        category_id: 'c23be564-5407-4d68-bdc9-632a8eb8e3e6',
        template: serviceTemplateGroup5[i],
        search: removeVietnameseTones(serviceTemplateGroup5[i]).split(' '),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    let insertObjects6 = [];
    for (let i = 0; i < serviceTemplateGroup6.length; i++) {
      insertObjects6.push({
        id: uuidv4(),
        category_id: '0faf5815-7f58-4c35-8baf-b9f676bbfd29',
        template: serviceTemplateGroup6[i],
        search: removeVietnameseTones(serviceTemplateGroup6[i]).split(' '),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    let insertObjects7 = [];
    for (let i = 0; i < serviceTemplateGroup7.length; i++) {
      insertObjects7.push({
        id: uuidv4(),
        category_id: 'bdc24a18-0f88-486c-b417-9f3283beeb59',
        template: serviceTemplateGroup7[i],
        search: removeVietnameseTones(serviceTemplateGroup7[i]).split(' '),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    let insertObjects8 = [];
    for (let i = 0; i < serviceTemplateGroup8.length; i++) {
      insertObjects8.push({
        id: uuidv4(),
        category_id: 'f1301021-2bdf-4728-894a-a06f2e3f9f15',
        template: serviceTemplateGroup8[i],
        search: removeVietnameseTones(serviceTemplateGroup8[i]).split(' '),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    let insertObjects9 = [];
    for (let i = 0; i < serviceTemplateGroup9.length; i++) {
      insertObjects9.push({
        id: uuidv4(),
        category_id: '08d38701-0597-4f8e-94bf-58c38c17ad15',
        template: serviceTemplateGroup9[i],
        search: removeVietnameseTones(serviceTemplateGroup9[i]).split(' '),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return Promise.all([
      await queryInterface.bulkInsert('service_templates', insertObjects1, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert('service_templates', insertObjects2, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert('service_templates', insertObjects3, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert('service_templates', insertObjects4, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert('service_templates', insertObjects5, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert('service_templates', insertObjects6, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert('service_templates', insertObjects7, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert('service_templates', insertObjects8, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert('service_templates', insertObjects9, {
        schema: schemaConfig.name,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('service_templates', null, {
      schema: schemaConfig.name,
    });
  },
};
