const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Cho phép server đọc các file tĩnh trong thư mục public (chứa index.html, host.html, play.html, ảnh, âm thanh)
app.use(express.static(path.join(__dirname, 'public')));

// Bộ nhớ tạm lưu trữ danh sách phòng (khi đưa lên server miễn phí, dữ liệu này lưu trên RAM)
const rooms = {};

// API tạo phòng
app.post('/api/rooms', (req, res) => {
    let { code, password } = req.body;
    if (!code) {
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
    } else {
        code = code.toUpperCase();
    }
    if (!password || password.length < 4) {
        return res.status(400).json({ error: 'Mật khẩu phòng phải có ít nhất 4 ký tự.' });
    }
    if (rooms[code]) {
        return res.status(400).json({ error: 'Mã trận này đã tồn tại, vui lòng chọn mã khác.' });
    }

    rooms[code] = { password, players: [], createdAt: Date.now() };
    const token = Math.random().toString(36).substring(2);
    res.json({ code, token });
});

// API vào phòng dành cho thí sinh
app.post('/api/join', (req, res) => {
    const { code, password, name } = req.body;
    const room = rooms[code];
    if (!room) {
        return res.status(400).json({ error: 'Mã trận không tồn tại.' });
    }
    if (room.password !== password) {
        return res.status(400).json({ error: 'Mật khẩu phòng không đúng.' });
    }
    if (!name) {
        return res.status(400).json({ error: 'Vui lòng nhập tên hiển thị.' });
    }

    const token = Math.random().toString(36).substring(2);
    room.players.push({ name, token });
    res.json({ token });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});