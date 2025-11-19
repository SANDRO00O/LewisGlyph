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
    
    inputText.addEventListener('input', () => {
      inputText.value = inputText.value.replace(/[0-9]/g, '');
    });
    
    function createGlyph(char, size = 80, small = false) {
  const ch = (char || ' ').toString().toUpperCase();
  const dots = LETTERS[ch] || [];
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.classList.add('glyph');
  
  // الحروف التي لون مربعها أحمر
  const isRed = (ch === 'Y' || ch === ' ');
  
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', 20);
  rect.setAttribute('y', 20);
  rect.setAttribute('width', 60);
  rect.setAttribute('height', 60);
  rect.setAttribute('rx', 0);
  rect.setAttribute('fill', isRed ? '#B55050' : '#111'); // هنا التلوين الأحمر
  svg.appendChild(rect);
  
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
    
    function renderText() {
      const txt = (inputText.value || '').toUpperCase();
      const size = parseInt(spacing.value) || 80;
      renderArea.innerHTML = '';
      for (const ch of txt) {
        if (ch === '\n') continue;
        const g = createGlyph(ch, size);
        const wrap = document.createElement('div');
        wrap.style.width = size + 'px';
        wrap.style.height = size + 'px';
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.justifyContent = 'center';
        wrap.appendChild(g);
        renderArea.appendChild(wrap);
      }
    }
    
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
    
    document.getElementById('convertBtn').addEventListener('click', () => renderText());
    spacing.addEventListener('change', () => renderText());
    
    buildCharset();
    renderText();
    
    document.getElementById('downloadSvg').addEventListener('click', () => {
      const svgs = renderArea.querySelectorAll('svg');
      if (!svgs.length) return alert('nothing.');
      
      const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      wrapper.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      wrapper.setAttribute('width', svgs.length * 100);
      wrapper.setAttribute('height', 100);
      
      svgs.forEach((svg, i) => {
        const clone = svg.cloneNode(true);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${i * 100},0)`);
        g.appendChild(clone);
        wrapper.appendChild(g);
      });
      
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(wrapper);
      const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'LewisGlyph_output.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
    
    document.getElementById('downloadPng').addEventListener('click', () => {
      if (!renderArea.innerHTML.trim()) return alert('nothing.');
      html2canvas(renderArea, { backgroundColor: '#ffffff', scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'LewisGlyph_output.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });