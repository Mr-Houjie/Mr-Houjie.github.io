// 现代化个人简历网站 - 主脚本文件

class ResumeWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupAnimations();
    this.setupInteractions();
    this.setupTypingEffect();
    this.setupSkillBars();
    this.setupScrollEffects();
    this.setupMobileMenu();
    this.setupBackToTop();
  }

  // 主题系统
  setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 获取保存的主题或使用系统偏好
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
    
    this.setTheme(initialTheme);
    
    // 桌面端主题切换事件
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
      });
    }
    
    // 移动端主题切换事件
    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
      });
    }
    
    // 监听系统主题变化
    prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // 更新桌面端主题切换按钮状态
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `切换到${theme === 'dark' ? '亮色' : '暗黑'}模式`);
    }
    
    // 更新移动端主题切换按钮状态
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    if (mobileThemeToggle) {
      mobileThemeToggle.setAttribute('aria-label', `切换到${theme === 'dark' ? '亮色' : '暗黑'}模式`);
    }
  }

  // 导航系统
  setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    // 平滑滚动
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏高度
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // 关闭移动端菜单
          this.closeMobileMenu();
        }
      });
    });
    
    // 导航栏滚动效果
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (navbar) {
        if (currentScrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        
        // 自动隐藏/显示导航栏
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
      }
      
      lastScrollY = currentScrollY;
    });
    
    // 活动导航项高亮
    this.updateActiveNavItem();
    window.addEventListener('scroll', () => this.updateActiveNavItem());
  }

  updateActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // 动画系统
  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // 特殊处理技能条动画
          if (entry.target.classList.contains('skills-section')) {
            this.animateSkillBars();
          }
        }
      });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .skills-section'
    );
    
    animatedElements.forEach(el => observer.observe(el));
  }

  // 交互效果
  setupInteractions() {
    // 3D 倾斜效果
    const tiltElements = document.querySelectorAll('.tilt-3d');
    
    tiltElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
    
    // 卡片悬停效果
    const cards = document.querySelectorAll('.card, .glass-hover');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // 打字效果
  setupTypingEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid var(--accent-primary)';
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          // 闪烁光标效果
          setInterval(() => {
            element.style.borderColor = element.style.borderColor === 'transparent' 
              ? 'var(--accent-primary)' 
              : 'transparent';
          }, 750);
        }
      }, 100);
    });
  }

  // 技能条动画
  setupSkillBars() {
    this.skillBarsAnimated = false;
  }

  animateSkillBars() {
    if (this.skillBarsAnimated) return;
    
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach((bar, index) => {
      setTimeout(() => {
        const percentage = bar.getAttribute('data-percentage') || '0';
        bar.style.width = percentage + '%';
      }, index * 200);
    });
    
    this.skillBarsAnimated = true;
  }

  // 滚动效果
  setupScrollEffects() {
    // 视差滚动效果
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    });
    
    // 滚动进度指示器
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: var(--gradient-primary);
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = scrollPercentage + '%';
    });
  }

  // 移动端菜单
  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      // 汉堡菜单按钮点击事件
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });
      
      // 点击菜单项关闭菜单
      const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-nav-item');
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // 添加点击动效
          const originalTransform = link.style.transform;
          link.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            link.style.transform = originalTransform;
            this.closeMobileMenu();
          }, 150);
        });
      });
      
      // 点击页面其他地方关闭菜单
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
      
      // ESC键关闭菜单
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
          this.closeMobileMenu();
        }
      });

      // 添加菜单项激活状态
      this.updateMobileMenuActiveItem();
      window.addEventListener('scroll', () => this.updateMobileMenuActiveItem());
    }
  }

  updateMobileMenuActiveItem() {
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav-item');
    
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    mobileMenuLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    if (mobileMenu && mobileMenuBtn) {
      const isOpen = !mobileMenu.classList.contains('hidden');
      
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    }
  }

  openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    if (mobileMenu && mobileMenuBtn) {
      // 显示菜单
      mobileMenu.classList.remove('hidden');
      
      // 按钮状态
      mobileMenuBtn.classList.add('active');
      
      // 添加菜单项进场动画
      const menuItems = mobileMenu.querySelectorAll('.mobile-nav-item');
      menuItems.forEach((item, index) => {
        // 重置动画状态
        item.style.animation = 'none';
        item.offsetHeight; // 强制重排
        item.style.animation = null;
        
        // 设置延迟
        item.style.animationDelay = `${index * 0.05 + 0.1}s`;
      });
      
      // 主题切换按钮动画
      const themeToggle = mobileMenu.querySelector('#mobile-theme-toggle');
      if (themeToggle) {
        themeToggle.style.animationDelay = `${menuItems.length * 0.05 + 0.15}s`;
      }
      
      // 快捷联系按钮动画
      const contactButtons = mobileMenu.querySelectorAll('.grid a');
      contactButtons.forEach((button, index) => {
        button.style.animationDelay = `${menuItems.length * 0.05 + 0.2 + index * 0.05}s`;
      });
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    if (mobileMenu && mobileMenuBtn) {
      // 隐藏菜单
      mobileMenu.classList.add('hidden');
      
      // 按钮状态
      mobileMenuBtn.classList.remove('active');
      
      // 重置所有动画延迟
      const animatedElements = mobileMenu.querySelectorAll('.mobile-nav-item, #mobile-theme-toggle, .grid a');
      animatedElements.forEach(element => {
        element.style.animationDelay = '';
      });
    }
  }

  // 返回顶部
  setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });
      
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // 性能优化：防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 性能优化：节流函数
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new ResumeWebsite();
});

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 页面隐藏时暂停动画
    document.body.style.animationPlayState = 'paused';
  } else {
    // 页面显示时恢复动画
    document.body.style.animationPlayState = 'running';
  }
});

// 错误处理
window.addEventListener('error', (e) => {
  console.error('页面错误:', e.error);
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResumeWebsite;
}