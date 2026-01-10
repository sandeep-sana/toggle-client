<template>
  <header class="navbar">
    <div class="logo">Toggle</div>

    <button 
      @click="isMenuOpen = !isMenuOpen" 
      class="menu-toggle" 
      :class="{ 'is-active': isMenuOpen }"
      aria-label="Toggle Menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="nav-links" :class="{ 'active': isMenuOpen }">
      <ul>
        <li><a href="#" @click="isMenuOpen = false">Product</a></li>
        <li><a href="#" @click="isMenuOpen = false">Solutions</a></li>
        <li><a href="#" @click="isMenuOpen = false">Templates</a></li>
        <li><a href="#" @click="isMenuOpen = false">Demo</a></li>
        <li><a href="#" @click="isMenuOpen = false">Pricing</a></li>
        <li><a href="#" @click="isMenuOpen = false">Resources</a></li>
        <li><a href="#" @click="isMenuOpen = false">About</a></li>
        <li><a href="#" @click="isMenuOpen = false">Contact</a></li>
      </ul>
      <div class="nav-actions">
        <a href="#" class="btn-secondary">Sign Up</a>
        <a href="#" class="btn-primary">Book a Free Call</a>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';

// Use a ref to track state instead of querying the DOM
const isMenuOpen = ref(false);
</script>

<style scoped>
/* Your existing CSS stays the same, but I added the Hamburger animation below */

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  background: var(--background-two);
  box-shadow: 0 2px 10px var(--box-shadow-one);
  position: relative;
  z-index: 1000;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--color-one);
  font-weight: 500;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary{
  padding: 0.6rem 1.2rem;
}
.btn-primary {
  background: var(--background-one);
  color: var(--color-one) !important;
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  text-decoration: none;
}

/* Mobile Toggle Button */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: var(--background-two);
  transition: 0.3s;
}

/* Simple animation for the hamburger to 'X' */
.menu-toggle.is-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.menu-toggle.is-active span:nth-child(2) {
  opacity: 0;
}
.menu-toggle.is-active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

@media (max-width: 1024px) {
  .menu-toggle {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--background-two);
    flex-direction: column;
    padding: 2rem 0;
    display: none; 
    box-shadow: 0 5px 10px var(--box-shadow-one);
  }

  .nav-links.active {
    display: flex;
  }

  .nav-links ul {
    flex-direction: column;
    gap: 1.5rem;
  }

  .nav-actions {
    flex-direction: column;
    width: 80%;
    margin-top: 1rem;
  }
}
</style>