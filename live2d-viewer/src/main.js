import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display/cubism4';

// 模型文件路径（本地服务，也支持从 GitHub raw URL 加载）
// 如果 GitHub 仓库为公开仓库，可使用: https://raw.githubusercontent.com/Qing-Feng-123/live2Dsample/main/runtime/hiyori_free_t08.model3.json
const MODEL_URL = '/runtime/hiyori_free_t08.model3.json';

// 等待 DOM 加载
document.addEventListener('DOMContentLoaded', async () => {
  const appElement = document.getElementById('app');
  const loadingEl = document.getElementById('loading');

  // 创建 PixiJS 应用
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  appElement.appendChild(app.view);

  // 添加背景粒子效果
  createBackground(app);

  // 模型引用
  let model = null;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let modelStart = { x: 0, y: 0 };
  let scale = 0.38;
  let targetScale = 0.38;
  let modelX = window.innerWidth / 2;
  let modelY = window.innerHeight / 2;
  let targetX = modelX;
  let targetY = modelY;

  // 加载模型
  try {
    model = await Live2DModel.from(MODEL_URL, {
      autoInteract: true,
      autoFocus: true,
    });

    // 设置模型属性
    model.anchor.set(0.5, 0.5);
    model.scale.set(scale);
    model.x = modelX;
    model.y = modelY;
    model.interactive = true;
    model.cursor = 'grab';

    app.stage.addChild(model);

    // 隐藏加载提示
    loadingEl.style.display = 'none';

    console.log('模型加载成功！');
  } catch (error) {
    loadingEl.innerHTML = `<div style="color:#ff6b6b">模型加载失败</div><div style="font-size:12px;margin-top:8px;color:rgba(255,255,255,0.5)">${error.message}</div>`;
    console.error('模型加载失败:', error);
    return;
  }

  // ============= 拖拽移动 =============
  model.on('pointerdown', (e) => {
    isDragging = true;
    dragStart = { x: e.global.x, y: e.global.y };
    modelStart = { x: model.x, y: model.y };
    model.cursor = 'grabbing';
  });

  app.stage.on('pointermove', (e) => {
    if (isDragging && model) {
      const dx = e.global.x - dragStart.x;
      const dy = e.global.y - dragStart.y;
      targetX = modelStart.x + dx;
      targetY = modelStart.y + dy;
    }
  });

  app.stage.on('pointerup', () => {
    isDragging = false;
    if (model) model.cursor = 'grab';
  });

  app.stage.on('pointerupoutside', () => {
    isDragging = false;
    if (model) model.cursor = 'grab';
  });

  // ============= 滚轮缩放 =============
  app.view.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (model) {
      targetScale += e.deltaY > 0 ? -0.04 : 0.04;
      targetScale = Math.max(0.15, Math.min(1.2, targetScale));
    }
  }, { passive: false });

  // ============= 按钮控制 =============
  document.getElementById('btn-idle').addEventListener('click', () => {
    setActiveButton('btn-idle');
    if (model) {
      model.motion('Idle');
    }
  });

  document.getElementById('btn-tap').addEventListener('click', () => {
    setActiveButton('btn-tap');
    if (model) {
      model.motion('Tap');
    }
  });

  document.getElementById('btn-flick').addEventListener('click', () => {
    setActiveButton('btn-flick');
    if (model) {
      model.motion('Flick');
    }
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    setActiveButton('btn-idle');
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
    targetScale = 0.38;
    if (model) {
      model.motion('Idle');
    }
  });

  // ============= 窗口缩放适配 =============
  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  // ============= 动画循环 - 平滑插值 =============
  app.ticker.add(() => {
    if (!model) return;

    // 平滑移动
    model.x += (targetX - model.x) * 0.15;
    model.y += (targetY - model.y) * 0.15;

    // 平滑缩放
    scale += (targetScale - scale) * 0.12;
    model.scale.set(scale);
  });
});

// 设置按钮激活状态
function setActiveButton(id) {
  document.querySelectorAll('.controls button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// 创建背景粒子效果
function createBackground(app) {
  const particles = new PIXI.Container();
  app.stage.addChildAt(particles, 0);

  const particleGraphics = [];
  const colors = [0x64b4ff, 0xff6b9d, 0xffd93d, 0x6bcb77, 0x9b59b6, 0x4ecdc4];

  for (let i = 0; i < 50; i++) {
    const g = new PIXI.Graphics();
    const color = colors[Math.floor(Math.random() * colors.length)];
    const radius = Math.random() * 3 + 1;
    g.beginFill(color, 0.3 + Math.random() * 0.3);
    g.drawCircle(0, 0, radius);
    g.endFill();
    g.x = Math.random() * window.innerWidth;
    g.y = Math.random() * window.innerHeight;
    particles.addChild(g);

    particleGraphics.push({
      g,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.3,
      baseY: g.y,
      amplitude: Math.random() * 30 + 10,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    });
  }

  let time = 0;
  app.ticker.add(() => {
    time += 1;
    for (const p of particleGraphics) {
      p.g.x += p.vx;
      p.g.y = p.baseY + Math.sin(time * p.speed + p.phase) * p.amplitude;

      // 边界循环
      if (p.g.x < -10) p.g.x = window.innerWidth + 10;
      if (p.g.x > window.innerWidth + 10) p.g.x = -10;
      if (p.g.y < -10) p.g.y = window.innerHeight + 10;
      if (p.g.y > window.innerHeight + 10) p.g.y = -10;
    }
  });
}