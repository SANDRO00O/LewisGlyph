const POSITIONS = [
  ['28%', '10%'],
  ['50%', '10%'],
  ['72%', '10%'],
  ['88%', '28%'],
  ['88%', '50%'],
  ['88%', '72%'],
  ['72%', '90%'],
  ['50%', '90%'],
  ['28%', '90%'],
  ['10%', '72%'],
  ['10%', '50%'],
  ['10%', '28%']
];

const LETTERS = {
  'A': [1, 6, 8],
  'B': [0, 8, 10],
  'C': [3, 5],
  'D': [11, 4, 9],
  'E': [3, 4, 5],
  'F': [3, 4, 8],
  'G': [3, 6],
  'H': [0, 2, 6, 8],
  'I': [1],
  'J': [2, 9],
  'K': [0, 3, 5, 8],
  'L': [0, 5],
  'M': [0, 2, 6, 7, 8],
  'N': [2, 8],
  'O': [],
  'P': [8],
  'Q': [7],
  'R': [3, 6, 8],
  'S': [3, 9],
  'T': [3, 7, 11],
  'U': [0, 2],
  'V': [0, 2, 7],
  'W': [0, 1, 2, 6, 8],
  'X': [3, 5, 9, 11],
  'Y': [0, 2, 7],
  'Z': [0, 3, 9, 6],
  ' ': []
};

const inputText = document.getElementById('inputText');
const renderArea = document.getElementById('renderArea');
const charset = document.getElementById('charset');
const spacing = document.getElementById('spacing');
const statusMsg = document.createElement('div'); // لعرض حالة التحميل  
document.body.appendChild(statusMsg);
statusMsg.style.position = 'fixed';
statusMsg.style.bottom = '10px';
statusMsg.style.right = '10px';
statusMsg.style.background = '#333';
statusMsg.style.color = '#fff';
statusMsg.style.padding = '5px 10px';
statusMsg.style.display = 'none';

inputText.addEventListener('input', () => {
  inputText.value = inputText.value.replace(/[^a-zA-Z]/g, ' ');
});

/* دالة إنشاء عنصر SVG واحد (للعرض في الصفحة) */
function createGlyph(char, size = 80, small = false) {
  // تحويل الحرف إلى Uppercase، أي شيء غير حرف أصلي سيكون ' ' بالفعل
  const ch = (char || ' ').toString().toUpperCase();
  const dots = LETTERS[ch] || [];
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.classList.add('glyph');
  
  // أي مسافة أو Y تُصبح حمراء
  const isRed = (ch === 'Y' || ch === ' ');
  
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', 20);
  rect.setAttribute('y', 20);
  rect.setAttribute('width', 60);
  rect.setAttribute('height', 60);
  rect.setAttribute('rx', 0);
  rect.setAttribute('fill', isRed ? '#B55050' : '#111'); // اللون الأحمر للمسافات
  svg.appendChild(rect);
  
  // رسم النقاط
  dots.forEach(p => {
    const c = document.createElementNS(ns, 'circle');
    const pos = POSITIONS[p];
    c.setAttribute('cx', pos[0]);
    c.setAttribute('cy', pos[1]);
    c.setAttribute('r', 5.5);
    c.setAttribute('fill', '#111');
    svg.appendChild(c);
  });
  
  return svg;
}

/* متغير للتحكم في عملية الرندرة المتزامنة */
let currentRenderTask = null;

/* دالة الرندرة الذكية (Async Rendering) */
function renderTextSmart() {
  // إلغاء أي عملية رندرة سابقة إذا كانت تعمل  
  if (currentRenderTask) cancelAnimationFrame(currentRenderTask);
  
  const txt = (inputText.value || '').toUpperCase().replace(/\n/g, '');
  const size = parseInt(spacing.value) || 80;
  
  // تفريغ المنطقة  
  renderArea.innerHTML = '';
  
  if (!txt) return;
  
  statusMsg.style.display = 'block';
  statusMsg.textContent = 'Rendering...';
  
  let index = 0;
  const chunkSize = 50; // عدد الحروف التي يتم رسمها في كل دفعة  
  
  function processChunk() {
    const end = Math.min(index + chunkSize, txt.length);
    
    // استخدام DocumentFragment لتحسين الأداء (إضافة مرة واحدة للـ DOM لكل دفعة)  
    const fragment = document.createDocumentFragment();
    
    for (; index < end; index++) {
      const ch = txt[index];
      const g = createGlyph(ch, size);
      const wrap = document.createElement('div');
      wrap.style.width = size + 'px';
      wrap.style.height = size + 'px';
      wrap.style.display = 'inline-flex'; // تغيير ليتناسب مع التدفق  
      wrap.style.alignItems = 'center';
      wrap.style.justifyContent = 'center';
      wrap.appendChild(g);
      fragment.appendChild(wrap);
    }
    
    renderArea.appendChild(fragment);
    
    if (index < txt.length) {
      // إذا لم ننته، نطلب إطاراً جديداً ونكمل  
      currentRenderTask = requestAnimationFrame(processChunk);
      statusMsg.textContent = `Rendering: ${Math.round((index / txt.length) * 100)}%`;
    } else {
      statusMsg.style.display = 'none';
      currentRenderTask = null;
    }
  }
  
  processChunk();
}

/* بناء قائمة الحروف (لا تحتاج لتغيير كبير لأنها صغيرة) */
function buildCharset() {
  charset.innerHTML = '';
  const letters = Object.keys(LETTERS).filter(k => k.length === 1 && ((k >= 'A' && k <= 'Z') || k === ' '));
  letters.sort((a, b) => {
    if (a === ' ') return 1;
    if (b === ' ') return -1;
    return a.localeCompare(b);
  });
  for (const ch of letters) {
    const card = document.createElement('div');
    card.className = 'char-card';
    const g = createGlyph(ch, 48, true);
    card.appendChild(g);
    const lbl = document.createElement('div');
    lbl.className = 'label';
    lbl.textContent = (ch === ' ' ? 'space' : ch);
    card.appendChild(lbl);
    charset.appendChild(card);
  }
}

/* الأحداث */
document.getElementById('convertBtn').addEventListener('click', renderTextSmart);
spacing.addEventListener('change', renderTextSmart);

// تهيئة أولية  
buildCharset();
renderTextSmart();

/* ---------------------------------------------------------  
   تحسين التحميل (SVG Download)  
   استخدام بناء النصوص String Concatenation بدلاً من DOM Cloning  
--------------------------------------------------------- */
document.getElementById('downloadSvg').addEventListener('click', () => {
  const txt = (inputText.value || '').toUpperCase().replace(/\n/g, '');
  if (!txt) return alert('Nothing to download.');
  
  const size = 100; // حجم ثابت داخل الـ SVG الناتج  
  const totalWidth = txt.length * size;
  
  // بداية ملف الـ SVG  
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${size}" viewBox="0 0 ${totalWidth} ${size}">`;
  
  // نقوم ببناء الـ XML يدوياً وهو أسرع بكثير من استنساخ العقد  
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];
    const isRed = (ch === 'Y' || ch === ' ');
    const dots = LETTERS[ch] || [];
    const offsetX = i * size;
    
    // مجموعة الحرف  
    svgContent += `<g transform="translate(${offsetX}, 0)">`;
    
    // المربع  
    svgContent += `<rect x="20" y="20" width="60" height="60" fill="${isRed ? '#B55050' : '#111'}" />`;
    
    // النقاط  
    dots.forEach(p => {
      const pos = POSITIONS[p];
      // تحويل النسبة المئوية إلى أرقام (نفترض 100x100)  
      // التنسيق في POSITIONS هو نسبة مئوية، نزيل %  
      const cx = parseFloat(pos[0]);
      const cy = parseFloat(pos[1]);
      svgContent += `<circle cx="${cx}" cy="${cy}" r="5.5" fill="#111" />`;
    });
    
    svgContent += `</g>`;
  }
  
  svgContent += `</svg>`;
  
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'LewisGlyph.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

document.getElementById('downloadPng').addEventListener('click', () => {
  const txt = (inputText.value || '').toUpperCase().replace(/\n/g, '');
  if (!txt) return alert('Nothing to download.');
  
  statusMsg.style.display = 'block';
  statusMsg.textContent = 'Generating PNG...';
  
  // نعطي المتصفح وقتاً صغيراً لعرض رسالة التحميل  
  setTimeout(() => {
    const baseSize = 100; // الحجم الأساسي  
    const scale = 3; // دقة الصورة (كلما زاد الرقم زادت الدقة والحجم)  
    const finalSize = baseSize * scale;
    
    // تحديد عدد الحروف في كل سطر داخل الصورة لتجنب تجاوز حدود عرض المتصفح  
    // 25 حرفاً × 300 بكسل = 7500 بكسل عرضاً (آمن جداً لجميع المتصفحات)  
    const charsPerRow = 25;
    
    // حساب أبعاد الصورة الكلية  
    const cols = Math.min(charsPerRow, txt.length);
    const rows = Math.ceil(txt.length / charsPerRow);
    
    const canvas = document.createElement('canvas');
    canvas.width = cols * finalSize;
    canvas.height = rows * finalSize;
    
    const ctx = canvas.getContext('2d');
    
    // خلفية بيضاء للصورة بالكامل  
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // حلقة الرسم  
    for (let i = 0; i < txt.length; i++) {
      const ch = txt[i];
      const isRed = (ch === 'Y' || ch === ' ');
      const dots = LETTERS[ch] || [];
      
      // حساب مكان الحرف (العمود والصف)  
      const colIndex = i % charsPerRow;
      const rowIndex = Math.floor(i / charsPerRow);
      
      const offsetX = colIndex * finalSize;
      const offsetY = rowIndex * finalSize;
      
      // رسم المربع  
      ctx.fillStyle = isRed ? '#B55050' : '#111';
      // الإحداثيات الأصلية 20، نضربها في scale ونضيف الإزاحة  
      ctx.fillRect(
        offsetX + (20 * scale),
        offsetY + (20 * scale),
        (60 * scale),
        (60 * scale)
      );
      
      // رسم النقاط  
      ctx.fillStyle = '#111';
      dots.forEach(p => {
        const pos = POSITIONS[p];
        // تحويل النسبة المئوية لقيمة رقمية  
        const cxRaw = parseFloat(pos[0]); // مثلاً 28  
        const cyRaw = parseFloat(pos[1]); // مثلاً 10  
        
        // حساب الموقع النهائي للنقطة  
        const cx = (cxRaw / 100) * finalSize; // نحول النسبة إلى بكسل بناء على الحجم الجديد  
        const cy = (cyRaw / 100) * finalSize; // ملاحظة: في الكود السابق كنا نضرب مباشرة، هنا الحساب أدق  
        
        /*   
           توضيح سريع: POSITIONS مخزنة كـ '28%'  
           parseFloat('28%') يعطي 28  
           بما أن viewBox الأصلي 100، فالنسبة هي نفسها الرقم.  
           لذا cx = 28 * (finalSize / 100)  
           أو ببساطة كما في الكود السابق إذا افترضنا أن النسبة مئوية من 100:  
        */
        const circleX = offsetX + (parseFloat(pos[0]) * scale);
        const circleY = offsetY + (parseFloat(pos[1]) * scale);
        
        ctx.beginPath();
        ctx.arc(circleX, circleY, 5.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // استخدام toBlob بدلاً من toDataURL لأنه يتعامل مع الأحجام الكبيرة دون تعليق المتصفح  
    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Image too large to generate!');
        statusMsg.style.display = 'none';
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'LewisGlyph_output.png';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      statusMsg.style.display = 'none';
    }, 'image/png');
    
  }, 100);
});