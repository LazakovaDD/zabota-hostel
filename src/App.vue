<template>
  <div id="app">
    <AuthPage 
      v-if="currentPage === 'auth'" 
      @login-success="handleLoginSuccess" 
    />

    <ClientPage 
      v-else-if="currentPage === 'client'" 
      @logout="handleLogout"
      @send-reservation="handleNewReservation"
    />

    <AdminPage 
      v-else-if="currentPage === 'admin'" 
      :newOrder="incomingReservation"
      @logout="handleLogout"
    />
  </div>
</template>

<script>
import AuthPage from './components/AuthPage.vue';
import ClientPage from './components/ClientPage.vue';
import AdminPage from './components/AdminPage.vue';

export default {
  name: 'App',
  components: {
    AuthPage,
    ClientPage,
    AdminPage
  },
  data() {
    return {
      currentPage: 'auth',
      incomingReservation: null
    };
  },
  methods: {
    handleLoginSuccess(role) {
      this.currentPage = role;
    },
    handleLogout() {
      this.currentPage = 'auth';
      this.incomingReservation = null;
    },
    handleNewReservation(payload) {
      this.incomingReservation = payload;
      this.currentPage = 'auth'; // возвращаем на вход для смены роли
    }
  }
};
</script>

<style>
/* Глобальные переменные и шрифты, которые использовались во всех ваших файлах */
:root {
  --primary: #e67e22;
  --primary-hover: #d35400;
  --secondary: #2c3e50;
  --dark: #1a252f;
  --gray: #7f8c8d;
  --success: #27ae60;
  --border: #e2e8f0;
}

* { 
  box-sizing: border-box; 
  margin: 0; 
  padding: 0; 
}

body { 
  font-family: 'Open Sans', sans-serif; 
  background-color: #f7fafc; 
  color: var(--dark); 
  line-height: 1.6; 
}

/* Стили для карточек и форм, общие для всего интерфейса хостела */
.card { 
  background: #fff; 
  border-radius: 12px; 
  border: 1px solid var(--border); 
  padding: 25px; 
  box-shadow: 0 4px 6px rgba(0,0,0,0.02); 
  margin-bottom: 25px; 
}

.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 600; font-size: 14px; }
.form-control { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px; font-family: inherit; font-size: 15px; }
.form-control:focus { outline: none; border-color: var(--primary); }

.btn { display: inline-block; background-color: var(--primary); color: #fff; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; font-family: 'Montserrat', sans-serif; width: 100%; text-align: center; font-size: 15px; transition: background 0.2s; }
.btn:hover { background-color: var(--primary-hover); }
</style>