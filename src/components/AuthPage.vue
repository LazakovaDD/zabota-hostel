<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-logo">
        <i class="fa-solid fa-paw"></i>
        <h2>ЗАБОТА</h2>
      </div>
      
      <div class="auth-tabs">
        <button :class="['auth-tab', { active: currentMode === 'client' }]" @click="switchAuthMode('client')">Вход для Клиентов</button>
        <button :class="['auth-tab', { active: currentMode === 'admin' }]" @click="switchAuthMode('admin')">Администратор</button>
      </div>

      <form @submit.prevent="nextStep">
        <div class="form-group">
          <label>{{ currentMode === 'client' ? 'Номер мобильного телефона' : 'Логин сотрудника' }}</label>
          <input type="text" class="form-control" v-model="loginInput" :placeholder="currentMode === 'client' ? '+7 (999) 000-00-00' : 'admin_khv'" required>
        </div>
        
        <div class="form-group" v-if="stage === 2">
          <label>{{ currentMode === 'client' ? 'Код подтверждения из SMS' : 'Пароль доступа' }}</label>
          <input type="password" class="form-control" v-model="passwordInput" :placeholder="currentMode === 'client' ? '1234' : '••••••••'" required>
        </div>

        <button type="submit" class="btn">
          {{ stage === 1 ? (currentMode === 'client' ? 'Получить SMS-код' : 'Далее') : (currentMode === 'client' ? 'Войти на сайт' : 'Войти в панель') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthPage',
  data() {
    return {
      currentMode: 'client',
      stage: 1,
      loginInput: '',
      passwordInput: ''
    };
  },
  methods: {
    switchAuthMode(mode) {
      this.currentMode = mode;
      this.stage = 1;
      this.loginInput = '';
      this.passwordInput = '';
    },
    nextStep() {
      if (this.stage === 1) {
        this.stage = 2;
      } else {
        this.$emit('login-success', this.currentMode);
      }
    }
  }
};
</script>

<style scoped>
.auth-wrapper { height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #2c3e50, #1a252f); position: fixed; top:0; left:0; }
.auth-card { background: #fff; width: 100%; max-width: 400px; padding: 40px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); text-align: center; border-top: 5px solid var(--primary); }
.auth-logo { font-size: 28px; margin-bottom: 25px; display: inline-flex; align-items: center; gap: 10px; font-family: 'Montserrat', sans-serif; color: var(--secondary); }
.auth-logo i { color: var(--primary); }
.auth-tabs { display: flex; background: #edf2f7; padding: 4px; border-radius: 8px; margin-bottom: 25px; }
.auth-tab { flex: 1; border: none; background: transparent; padding: 8px; font-weight: 600; cursor: pointer; border-radius: 6px; font-family: 'Montserrat', sans-serif; font-size: 13px; }
.auth-tab.active { background: #fff; color: var(--secondary); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
</style>