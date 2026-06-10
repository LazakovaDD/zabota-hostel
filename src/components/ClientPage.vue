<template>
  <div>
    <header>
      <div class="header-container">
        <a href="#" class="logo"><i class="fa-solid fa-paw"></i> <span>ЗАБОТА</span></a>
        <div class="user-menu">
          <span><i class="fa-regular fa-user"></i> Личный кабинет клиента</span>
          <a style="margin-left: 20px; cursor: pointer; color: var(--gray);" @click="$emit('logout')">Выйти</a>
        </div>
      </div>
    </header>

    <main>
      <div class="grid-layout">
        <div>
          <div class="card">
            <h3 class="card-title"><i class="fa-solid fa-calendar-days"></i> 1. Сроки и тип питомца</h3>
            <div class="room-select-grid">
              <div class="form-group">
                <label>Дата заезда</label>
                <input type="date" class="form-control" v-model="checkInDate">
              </div>
              <div class="form-group">
                <label>Дата выезда</label>
                <input type="date" class="form-control" v-model="checkOutDate">
              </div>
            </div>
            <div class="form-group">
              <label>Ккого заселяем?</label>
              <select class="form-control" v-model="petType"><option>Собака</option><option>Кошка</option></select>
            </div>
          </div>

          <div class="card">
  <h3 class="card-title"><i class="fa-solid fa-hotel"></i> 2. Выбор категории вольера</h3>
  <div class="room-select-grid">
    
    <div 
      v-for="room in rooms" 
      :key="room._id" 
      :class="['room-option', { selected: roomClass === room._id, 'room-disabled': room.status !== 'free' }]" 
      @click="selectRoom(room)"
    >
      <h4>Вольер №{{ room.roomNumber }}</h4>
      <p style="font-size: 13px; color: var(--gray);">{{ room.category || 'Стандарт' }}</p>
      
      <p style="font-size: 11px; margin-top: 4px; font-weight: 600;">
        <span v-if="room.status === 'free'" style="color: var(--success);">● Свободен</span>
        <span v-else-if="room.status === 'occupied'" style="color: #e74c3c;">● Занят</span>
        <span v-else style="color: #f39c12;">● На уборке</span>
      </p>

      <p style="margin-top: 10px; font-weight: bold; color: var(--primary);">
        {{ room.pricePerDay.toLocaleString() }} ₽ / сут
      </p>
    </div>

  </div>
</div>

          <div class="card">
            <h3 class="card-title"><i class="fa-solid fa-paw"></i> 3. Сведения о животном</h3>
            <div class="form-group"><label>Кличка</label><input type="text" class="form-control" v-model="petName" placeholder="Арчи"></div>
            <div class="form-group"><label>Особые требования к питанию</label><input type="text" class="form-control" v-model="petFeatures" placeholder="Кормление строго в 09:00 и 21:00"></div>
          </div>
        </div>

        <div>
          <div class="card" style="position: sticky; top: 100px;">
            <h3 class="card-title"><i class="fa-solid fa-square-plus"></i> Дополнительный сервис</h3>
            <div class="checkbox-group">
              <label class="checkbox-label"><input type="checkbox" v-model="services.grooming"> <span>Груминг-процедуры (+1 500 ₽)</span></label>
              <label class="checkbox-label"><input type="checkbox" v-model="services.transfer"> <span>Трансфер из дома (+800 ₽)</span></label>
              <label class="checkbox-label"><input type="checkbox" v-model="services.vet"> <span>Штатный осмотр врача (+1 200 ₽)</span></label>
            </div>

            <div class="total-block" style="margin-top: 25px;">
              <div class="summary-row"><span>Дней проживания:</span><span>{{ daysCount }}</span></div>
              <div class="summary-row"><span>Стоимость номера:</span><span>{{ baseCost.toLocaleString() }} ₽</span></div>
              <div class="summary-row"><span>Доп. услуги:</span><span>{{ servicesCost.toLocaleString() }} ₽</span></div>
              <div class="summary-row total-price"><span>Итого к оплате:</span><span>{{ totalCost.toLocaleString() }} ₽</span></div>
            </div>
            <button class="btn" style="margin-top: 20px;" @click="sendReservation">Отправить бронь</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ClientPage',
  data() {
    return {
      checkInDate: '2026-06-01',
      checkOutDate: '2026-06-06',
      petType: 'Собака',
      
      // ИЗМЕНЕНО: теперь храним список комнат из БД и ID выбранной комнаты
      rooms: [], 
      roomClass: null, // Сюда будет записываться _id выбранного вольера
      currentRoomPrice: 0,
      selectedRoomNumber: null, // Запоминаем номер для отправки админу
      selectedRoomCategory: '',  // Запоминаем категорию для отправки админу

      petName: '',
      petFeatures: '',
      services: { grooming: false, transfer: false, vet: false }
    };
  },
  computed: {
    daysCount() {
      const start = new Date(this.checkInDate);
      const end = new Date(this.checkOutDate);
      let diff = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      return diff > 0 ? diff : 1;
    },
    baseCost() {
      return this.daysCount * this.currentRoomPrice;
    },
    servicesCost() {
      let total = 0;
      if (this.services.grooming) total += 1500;
      if (this.services.transfer) total += 800;
      if (this.services.vet) total += 1200;
      return total;
    },
    totalCost() {
      return this.baseCost + this.servicesCost;
    }
  },
  // ДОБАВЛЕНО: Хук mounted автоматически запрашивает вольеры у сервера Express
  mounted() {
    this.fetchRooms();
  },
  methods: {
    async fetchRooms() {
  try {
    // Попытка связаться с локальным сервером
    const response = await fetch('http://localhost:3000/api/rooms');
    if (response.ok) {
      this.rooms = await response.json();
    } else {
      throw new Error('Локальный сервер не ответил');
    }
  } catch (err) {
    console.log('Используются демонстрационные данные для Vercel...');
    
    // Гарантированно СВОБОДНЫЕ вольеры с правильными ценами из вашей базы
    this.rooms = [
      {
        _id: "6a28332b2f4bdc11ffd12d5f",
        roomNumber: 1,
        category: "Стандарт",
        pricePerDay: 1000,
        status: "free"
      },
      {
        _id: "6a28332b2f4bdc11ffd12d60",
        roomNumber: 2,
        category: "Стандарт",
        pricePerDay: 1000,
        status: "free"
      },
      {
        _id: "6a28332b2f4bdc11ffd12d61",
        roomNumber: 3,
        category: "Люкс",
        pricePerDay: 2500,
        status: "free"
      },
      {
        _id: "6a28332b2f4bdc11ffd12d62",
        roomNumber: 4,
        category: "Люкс",
        pricePerDay: 2500,
        status: "free"
      }
    ];
  }

  // Задаем начальный выбор (первый свободный вольер)
  const firstFree = this.rooms.find(r => r.status === 'free');
  if (firstFree) {
    this.selectRoom(firstFree);
  }
},
    sendReservation() {
      if (!this.roomClass) {
        alert('Пожалуйста, выберите вольер для заселения!');
        return;
      }

      let activeServices = [];
      if (this.services.grooming) activeServices.push('Груминг');
      if (this.services.transfer) activeServices.push('Трансфер');
      if (this.services.vet) activeServices.push('Осмотр врача');

      const payload = {
        petName: this.petName || 'Арчи',
        petType: this.petType,
        period: `${this.checkInDate.split('-').reverse().slice(0,2).join('.')} - ${this.checkOutDate.split('-').reverse().slice(0,2).join('.')}`,
        // ИЗМЕНЕНО: Отправляем админу реальные данные выбранного из БД вольера
        roomType: `Вольер №${this.selectedRoomNumber} (${this.selectedRoomCategory})`,
        services: activeServices.length > 0 ? activeServices.join(', ') : 'нет'
      };
      alert('Заявка на бронирование успешно отправлена администратору!');
      this.$emit('send-reservation', payload);
    }
  }
};
</script>

<style scoped>
header { background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-bottom: 3px solid var(--primary); }
.header-container { max-width: 1200px; margin: 0 auto; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 24px; color: var(--secondary); text-decoration: none; display: flex; align-items: center; gap: 10px; font-weight: bold; }
.logo i { color: var(--primary); }
.user-menu { display: flex; align-items: center; gap: 15px; font-weight: 600; }
main { max-width: 1200px; margin: 30px auto; padding: 0 20px; }
.grid-layout { display: grid; grid-template-columns: 7fr 5fr; gap: 30px; }
.room-select-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.room-option { border: 2px solid var(--border); border-radius: 8px; padding: 15px; cursor: pointer; }
.room-option.selected { border-color: var(--primary); background-color: #fffaf0; }
.checkbox-group { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
.checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px; }
.total-price { font-size: 22px; font-weight: 700; color: var(--secondary); border-top: 2px dashed var(--border); padding-top: 15px; margin-top: 15px; }
.room-option.room-disabled {
  background-color: #f8f9fa;
  border-color: #e2e8f0;
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
