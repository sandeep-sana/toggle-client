<template>
  <div class="page">
    <div class="card">
      <!-- Left (Brand / Info) -->
      <aside class="side">
        <div class="brand">
          <div class="logo">A</div>
          <div class="brand-text">
            <h1>Airhub</h1>
            <p>Create your account and start managing your eSIMs.</p>
          </div>
        </div>

        <div class="side-box">
          <h3>Why join?</h3>
          <ul>
            <li>Track orders & downloads</li>
            <li>Fast checkout next time</li>
            <li>Manage eSIM activations</li>
          </ul>
        </div>

        <p class="side-foot">Already have an account? <a href="#" @click.prevent="goToLogin">Login</a></p>
      </aside>

      <!-- Right (Form) -->
      <section class="form">
        <header class="form-head">
          <h2>Create Account</h2>
          <p>It takes less than a minute.</p>
        </header>

        <form class="form-body" @submit.prevent="onSubmit">
          <div class="grid">
            <div class="field">
              <label>Full Name</label>
              <input
                v-model.trim="form.name"
                type="text"
                placeholder="Enter your name"
                autocomplete="name"
              />
            </div>

            <div class="field">
              <label>Email</label>
              <input
                v-model.trim="form.email"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="grid">
            <div class="field">
              <label>Password</label>
              <div class="password-wrap">
                <input
                  v-model="form.password"
                  :type="showPass ? 'text' : 'password'"
                  placeholder="Create a password"
                  autocomplete="new-password"
                />
                <button type="button" class="icon-btn" @click="showPass = !showPass">
                  {{ showPass ? "Hide" : "Show" }}
                </button>
              </div>
              <small class="hint">Use 8+ characters with letters & numbers.</small>
            </div>

            <div class="field">
              <label>Confirm Password</label>
              <input
                v-model="form.confirmPassword"
                :type="showPass ? 'text' : 'password'"
                placeholder="Re-enter password"
                autocomplete="new-password"
              />
            </div>
          </div>

          <div class="field">
            <label>Phone (optional)</label>
            <input
              v-model.trim="form.phone"
              type="tel"
              placeholder="+91 98765 43210"
              autocomplete="tel"
            />
          </div>

          <div class="row">
            <label class="check">
              <input v-model="form.accept" type="checkbox" />
              <span>
                I agree to the <a href="#" @click.prevent>Terms</a> & <a href="#" @click.prevent>Privacy Policy</a>
              </span>
            </label>
          </div>

          <div v-if="error" class="alert">{{ error }}</div>

          <button class="primary" type="submit" :disabled="loading">
            <span v-if="!loading">Create Account</span>
            <span v-else>Creating...</span>
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <button class="secondary" type="button" @click="onGoogle">
            Continue with Google
          </button>

          <p class="footer">
            Already have an account?
            <a href="#" @click.prevent="goToLogin">Login</a>
          </p>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const loading = ref(false);
const error = ref("");
const showPass = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  accept: false,
});

function validate() {
  error.value = "";

  if (!form.name) return (error.value = "Please enter your name.");
  if (!form.email) return (error.value = "Please enter your email.");
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return (error.value = "Please enter a valid email.");

  if (!form.password) return (error.value = "Please create a password.");
  if (form.password.length < 8) return (error.value = "Password must be at least 8 characters.");
  if (form.password !== form.confirmPassword) return (error.value = "Passwords do not match.");

  if (!form.accept) return (error.value = "Please accept Terms & Privacy Policy.");
  return true;
}

async function onSubmit() {
  if (!validate()) return;

  loading.value = true;
  try {
    // TODO: Replace with your API
    // await api.post("/signup", form)

    console.log("Signup payload:", { ...form });
    alert("Signup UI OK ✅ (connect API now)");
  } catch (e) {
    error.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}

function onGoogle() {
  alert("Google signup UI ✅ (connect OAuth later)");
}

function goToLogin() {
  // TODO: router push to login
  alert("Route to Login page");
}
</script>

<style scoped>
.page{
  min-height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px;
  background:
    radial-gradient(900px 500px at 20% 10%, rgba(99,102,241,.18), transparent 55%),
    radial-gradient(900px 500px at 80% 30%, rgba(16,185,129,.18), transparent 55%),
    linear-gradient(180deg, #fafafa, #f3f4f6);
}

.card{
  width: min(980px, 100%);
  display:grid;
  grid-template-columns: 1fr 1.1fr;
  border-radius: 18px;
  overflow:hidden;
  background:#fff;
  box-shadow: 0 18px 55px rgba(0,0,0,.10);
  border: 1px solid rgba(0,0,0,.06);
}

.side{
  padding:28px;
  background:
    linear-gradient(135deg, rgba(99,102,241,.10), rgba(16,185,129,.08));
  display:flex;
  flex-direction:column;
  gap:18px;
}

.brand{
  display:flex;
  align-items:center;
  gap:14px;
}

.logo{
  width:46px;
  height:46px;
  border-radius: 14px;
  background: #111827;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  letter-spacing: .5px;
}

.brand-text h1{
  margin:0;
  font-size: 20px;
  font-weight: 800;
  color:#111827;
}
.brand-text p{
  margin:4px 0 0;
  font-size: 13px;
  color:#374151;
}

.side-box{
  margin-top: 10px;
  padding:16px;
  border-radius: 14px;
  background: rgba(255,255,255,.65);
  border: 1px solid rgba(17,24,39,.08);
}

.side-box h3{
  margin:0 0 10px;
  font-size: 14px;
  font-weight: 800;
  color:#111827;
}

.side-box ul{
  margin:0;
  padding-left: 16px;
  color:#374151;
  font-size: 13px;
  line-height: 1.6;
}

.side-foot{
  margin-top:auto;
  font-size: 13px;
  color:#374151;
}
.side-foot a{
  color:#111827;
  font-weight:700;
  text-decoration:none;
}
.side-foot a:hover{ text-decoration:underline; }

.form{
  padding:28px;
}

.form-head h2{
  margin:0;
  font-size: 22px;
  font-weight: 900;
  color:#111827;
}
.form-head p{
  margin:6px 0 0;
  font-size: 13px;
  color:#6b7280;
}

.form-body{
  margin-top: 18px;
  display:flex;
  flex-direction:column;
  gap:14px;
}

.grid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:12px;
}

.field label{
  display:block;
  font-size: 12px;
  font-weight: 700;
  color:#111827;
  margin-bottom: 6px;
}

.field input{
  width:100%;
  padding:12px 12px;
  border-radius: 12px;
  border: 1px solid rgba(17,24,39,.12);
  outline:none;
  background:#fff;
  transition: .15s;
  font-size: 14px;
}
.field input:focus{
  border-color: rgba(99,102,241,.55);
  box-shadow: 0 0 0 4px rgba(99,102,241,.14);
}

.password-wrap{
  position:relative;
  display:flex;
  align-items:center;
}
.password-wrap input{
  padding-right: 70px;
}
.icon-btn{
  position:absolute;
  right:8px;
  top:50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(17,24,39,.06);
  padding:7px 10px;
  border-radius: 10px;
  cursor:pointer;
  font-weight: 800;
  font-size: 12px;
  color:#111827;
}
.icon-btn:hover{ background: rgba(17,24,39,.10); }

.hint{
  display:block;
  margin-top:6px;
  color:#6b7280;
  font-size: 12px;
}

.row{
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.check{
  display:flex;
  align-items:flex-start;
  gap:10px;
  font-size: 13px;
  color:#374151;
  line-height: 1.4;
}
.check input{ margin-top:2px; }
.check a{
  color:#111827;
  font-weight:700;
  text-decoration:none;
}
.check a:hover{ text-decoration:underline; }

.alert{
  padding:10px 12px;
  border-radius: 12px;
  background: rgba(239,68,68,.10);
  border: 1px solid rgba(239,68,68,.25);
  color:#7f1d1d;
  font-size: 13px;
  font-weight: 700;
}

.primary{
  width:100%;
  padding:12px 14px;
  border-radius: 12px;
  border:none;
  cursor:pointer;
  font-weight: 900;
  color:#fff;
  background: #111827;
  transition: .15s;
}
.primary:hover{ transform: translateY(-1px); }
.primary:disabled{
  opacity:.65;
  cursor:not-allowed;
  transform:none;
}

.divider{
  position:relative;
  text-align:center;
  margin: 2px 0;
}
.divider::before{
  content:"";
  position:absolute;
  top:50%;
  left:0;
  right:0;
  height:1px;
  background: rgba(17,24,39,.12);
}
.divider span{
  position:relative;
  display:inline-block;
  padding: 0 10px;
  background:#fff;
  color:#6b7280;
  font-size: 12px;
  font-weight: 800;
}

.secondary{
  width:100%;
  padding:12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(17,24,39,.14);
  background:#fff;
  cursor:pointer;
  font-weight: 900;
  color:#111827;
}
.secondary:hover{ background: rgba(17,24,39,.04); }

.footer{
  margin: 2px 0 0;
  font-size: 13px;
  color:#374151;
  text-align:center;
}
.footer a{
  color:#111827;
  font-weight:800;
  text-decoration:none;
}
.footer a:hover{ text-decoration:underline; }

@media (max-width: 900px){
  .card{ grid-template-columns: 1fr; }
  .side{ display:none; } /* Hide left panel on mobile for clean UX */
  .grid{ grid-template-columns: 1fr; }
}
</style>
