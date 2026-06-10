<template>
  <div>
    <header>
      <div class="header-container">
        <a href="#" class="logo"><i class="fa-solid fa-paw"></i> <span>ЗАБОТА</span> <span class="admin-badge">АРМ АДМИНИСТРАТОРА</span></a>
        <div>
          <span><i class="fa-solid fa-user-gear"></i> Оператор: Лазакова Д.Д.</span>
          <a style="margin-left: 20px; cursor: pointer; color: var(--gray);" @click="$emit('logout')">Выйти</a>
        </div>
      </div>
    </header>

    <main class="grid-layout">
      <div>
        <div class="card">
          <h3 class="card-title" style="color: var(--secondary);"><i class="fa-solid fa-table-cells" style="color: var(--primary);"></i> Интерактивная «Шахматка» комнат</h3>
          <div class="rooms-matrix">
            <div v-for="room in rooms" :key="room.id" :class="['room-cell', room.status]">
              <div>Вольер {{ room.id }}</div>
              <span class="status-badge">{{ getStatusText(room.status) }}</span>
            </div>
          </div>
        </div>

        <div class="card" v-if="currentOrder">
          <h3 class="card-title"><i class="fa-solid fa-bell" style="color: var(--primary);"></i> Обработка входящих броней</h3>
          <div class="order-item">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>Заявка №2026-08 ({{ currentOrder.petType }}: {{ currentOrder.petName }})</span>
              <span :style="{ color: isApproved ? 'var(--success)' : 'var(--primary)' }">
                {{ isApproved ? 'Одобрена' : 'Новая' }}
              </span>
            </div>
            <p style="font-size: 14px; margin-top: 5px; color: var(--gray);">
              Период: {{ currentOrder.period }} | Клиент: Петров И.В. | Доп. услуги: {{ currentOrder.services }}
            </p>
            <button v-if="!isApproved" class="btn-sm" @click="approveOrder">Подтвердить и выделить вольер</button>
          </div>
        </div>
      </div>

      <div>
        <div class="card">
          <h3 class="card-title"><i class="fa-solid fa-heart-pulse" style="color: var(--primary);"></i> Операционный журнал процедур</h3>
          <ul class="log-list">
            <li class="log-item" v-for="(log, idx) in logs" :key="idx">
              <span>{{ log.text }}</span>
              <span class="log-time">{{ log.time }}</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  props: ['newOrder'],
  data() {
    return {
      isApproved: false,
      currentOrder: this.newOrder || {
        petName: 'Арчи',
        petType: 'Овчарка',
        period: '01.06 - 06.06',
        roomType: 'Стандарт',
        services: 'Груминг'
      },
      rooms: [
        { id: 1, status: 'free' },
        { id: 2, status: 'occupied' },
        { id: 3, status: 'occupied' },
        { id: 4, status: 'free' },
        { id: 5, status: 'cleaning' },
        { id: 6, status: 'free' }
      ],
      logs: [
        { text: 'Вольер 2 (Кот Мурзик) — Кормление влажным лечебным кормом.', time: '14:32' },
        { text: 'Вольер 3 (Хаски Буран) — Выгул на уличной площадке (45 мин).', time: '13:05' },
        { text: 'Вольер 5 — Начало дезинфекции кварцевой лампой.', time: '11:15' }
      ]
    };
  },
  methods: {
    getStatusText(status) {
      if (status === 'free') return 'Свободен';
      if (status === 'occupied') return 'Занят';
      return 'Уборка';
    },
    approveOrder() {
      this.isApproved = true;
      const room4 = this.rooms.find(r => r.id === 4);
      if (room4) room4.status = 'occupied';
      
      alert('Успешно: бронь одобрена, вольер №4 зарезервирован!');
      this.logs.unshift({
        text: `Вольер 4 (${this.currentOrder.petName}) — Успешно заселен через реактивный стейт Vue.`,
        time: 'Только что'
      });
    }
  }
};
</script>

<style scoped>
header { background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-bottom: 3px solid var(--secondary); }
.header-container { max-width: 1200px; margin: 0 auto; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 24px; color: var(--secondary); text-decoration: none; display: flex; align-items: center; gap: 10px; font-weight: bold; }
.logo i { color: var(--primary); }
.admin-badge { background-color: red; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
main { max-width: 1200px; margin: 30px auto; padding: 0 20px; }
.grid-layout { display: grid; grid-template-columns: 7fr 5fr; gap: 30px; }
.rooms-matrix { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; }
.room-cell { border: 1px solid var(--border); border-radius: 8px; padding: 15px; text-align: center; font-weight: bold; }
.room-cell.free { background-color: #eafaf1; color: var(--success); border-color: #c2f0d5; }
.room-cell.occupied { background-color: #fceade; color: var(--primary); border-color: #f7d6c1; }
.room-cell.cleaning { background-color: #edf2f7; color: var(--secondary); border-color: #cbd5e1; }
.status-badge { display: inline-block; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-top: 5px; text-transform: uppercase; }
.order-item { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary); margin-top: 15px; }
.btn-sm { background-color: var(--success); color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; margin-top: 10px; font-size: 13px; }
.log-list { list-style: none; }
.log-item { padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; display: flex; justify-content: space-between; }
.log-time { color: var(--gray); font-size: 12px; }
</style>
