import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());

// Подключение к локальной базе данных ZabotaHostel
mongoose.connect('mongodb://localhost:27017/ZabotaHostel')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch(err => console.error('Ошибка подключения:', err));

// Описание схемы и модели вольера (Room)
const roomSchema = new mongoose.Schema({
  roomNumber: Number,
  category: String,
  pricePerDay: Number,
  status: String
}, { versionKey: false });

const Room = mongoose.model('Room', roomSchema);

// === МАРШРУТЫ API (CRUD) ===

// CREATE: Добавление нового вольера
app.post('/api/rooms', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ: Получение списка всех вольеров
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE: Изменение параметров вольера по ID
app.put('/api/rooms/:id', async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({ message: 'Вольер не найден' });
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Удаление вольера из базы данных по ID
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) return res.status(404).json({ message: 'Вольер не найден' });
    res.json({ message: 'Вольер успешно удален из системы' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});