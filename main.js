// vivtiw.github.io: interactive terminal. No dependencies.
(() => {
  const out = document.getElementById('term-out');
  const form = document.getElementById('term-form');
  const input = document.getElementById('term-input');
  const body = document.getElementById('term-body');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('yr').textContent = new Date().getFullYear();

  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const c = (cls, s) => `<span class="${cls}">${s}</span>`;

  const COMMANDS = {
    help: () => [
      c('dim', 'available commands:'),
      `  ${c('green', 'whoami')}     who I am, in one breath`,
      `  ${c('green', 'agents')}     the agentic AI systems I've built`,
      `  ${c('green', 'qhin')}       case study: certifying a national health-data network`,
      `  ${c('green', 'experience')} git log of my career`,
      `  ${c('green', 'stack')}      what I build with`,
      `  ${c('green', 'contact')}    how to reach me`,
      `  ${c('green', 'resume')}     open resume.pdf`,
      `  ${c('green', 'clear')}      clear the screen`,
      c('dim', '  (tab completes, ↑/↓ for history. there may be a sudo command or two.)'),
    ],
    whoami: () => [
      `${c('bright', 'Vivek Tiwari')}: backend/infra → ${c('ai', 'agentic AI')}`,
      `10+ yrs: ${c('cyan', 'health interop')} · ${c('cyan', 'security')} · ${c('cyan', 'climate')}`,
      `now:     Principal MTS, Oracle Health (TEFCA/QHIN)`,
      `building: ${c('ai', 'MCP agents with human-in-the-loop gates')}`,
    ],
    agents: () => [
      c('dim', '# ./ai --list-projects'),
      `${c('ai', '●')} trading-analysis agent`,
      `  ${c('dim', 'Claude ⇄ IBKR via MCP · risk gate · human approves orders')}`,
      `${c('ai', '●')} cruiseoutfits.com`,
      `  ${c('dim', 'live LLM app · 3-layer output validation')}`,
      `${c('green', '●')} job-intel pipeline`,
      `  ${c('dim', 'n8n · scrape ATS → match → draft → human review')}`,
      `${c('green', '●')} ai-first dev loop`,
      `  ${c('dim', 'spec-driven · Claude Code implements · I review')}`,
    ],
    qhin: () => [
      c('dim', '# case-studies/tefca-qhin.md'),
      `${c('red', 'problem')} XUA must behave identically across`,
      `        independent partner networks`,
      `${c('amber', 'built')}   QHIN Simulator in CI/CD (~30% less manual)`,
      `        security/transport validation scripts`,
      `        SMART on FHIR v2 authorization flows`,
      `${c('green', 'result')}  passed every Sequoia RCE suite`,
    ],
    experience: () => [
      `${c('amber', 'a1c0e42')} ${c('green', 'oracle')}    Principal MTS · health   2024–`,
      `${c('amber', '7f3b9d1')} ${c('cyan', 'zscaler')}   Sr Dev · DLP             2024`,
      `${c('amber', '3e8a5c0')} ${c('cyan', 'bmo')}       Sr Dev · climate tech    2021–24`,
      `${c('amber', 'c41d2f7')} ${c('cyan', 'motorola')}  Sr Dev · access control  2016–21`,
      `${c('amber', '0b9e6a3')} ${c('cyan', 'fortinet')}  Dev · sandbox/data       2014–16`,
      `${c('amber', '0000001')} ${c('dim', 'init')}      MASc ECE · UVic`,
    ],
    stack: () => [
      `${c('ai', 'ai:')}    MCP · tool use · Claude Code · Ollama · n8n`,
      `${c('ai', 'lang:')}  Python · Java · Ruby · TypeScript · Bash`,
      `${c('ai', 'infra:')} AWS · OCI · Docker · Kubernetes · GH Actions`,
      `${c('ai', 'data:')}  PostgreSQL · Redis · Kafka · ELK · Grafana`,
      `${c('ai', 'sec:')}   OAuth/SMART · XUA · JWT · X.509 · DLP`,
    ],
    contact: () => [
      `mail      ${link('mailto:ece.vivek@gmail.com', 'ece.vivek@gmail.com')}`,
      `linkedin  ${link('https://www.linkedin.com/in/vivektiwari', '/in/vivektiwari')}`,
      `github    ${link('https://github.com/vivtiw', '@vivtiw')}`,
    ],
    resume: () => { window.open('data/Vivek_Tiwari_Resume.pdf', '_blank', 'noopener'); return ['opening resume.pdf …']; },
    ls: () => [`${c('cyan', 'ai/')}  ${c('cyan', 'case-studies/')}  career.log  stack.yaml  resume.pdf`],
    pwd: () => ['/home/vivek'],
    date: () => [new Date().toString()],
    echo: (args) => [esc(args.join(' '))],
    'sudo': (args) => {
      if (args.join(' ') === 'hire vivek') {
        setTimeout(() => { window.location.href = 'mailto:ece.vivek@gmail.com?subject=Let%27s%20talk%20%E2%80%94%20from%20vivtiw.github.io'; }, 900);
        return [
          `[sudo] password for recruiter: ${c('dim', '********')}`,
          c('green', '✓ permission granted. opening mail client …'),
        ];
      }
      if (args[0] === 'rm') return [c('red', 'nice try. this incident will be reported.')];
      return [`${c('dim', 'sudo:')} try ${c('green', 'sudo hire vivek')}`];
    },
    rm: () => [c('red', 'rm: permission denied (prod is sacred)')],
    exit: () => ['there is no escape. try ' + c('green', 'contact') + ' instead.'],
    clear: () => { out.innerHTML = ''; return []; },
  };
  const ALIASES = { 'git': 'experience', 'log': 'experience', 'projects': 'agents', 'ai': 'agents', 'about': 'whoami', 'cv': 'resume', 'cls': 'clear', 'man': 'help', '?': 'help', 'cat': 'stack' };

  function link(href, text) { return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`; }

  function print(html, cls = '') {
    const d = document.createElement('div');
    d.className = 'ln ' + cls;
    d.innerHTML = html;
    out.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }

  const history = [];
  let hIdx = 0;
  let busy = false;

  async function run(raw, { echo = true } = {}) {
    const line = raw.trim();
    if (echo) print(esc(line), 'cmd');
    if (!line) return;
    history.push(line); hIdx = history.length;
    const [name, ...args] = line.split(/\s+/);
    const key = COMMANDS[name] ? name : ALIASES[name.toLowerCase()] || name.toLowerCase();
    const fn = COMMANDS[key];
    const lines = fn ? fn(args) : [`zsh: command not found: ${esc(name)}. try ${c('green', 'help')}`];
    for (const l of lines) { print(l); if (!reduced) await sleep(28); }
    print('');
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typeCmd(cmd) {
    const d = document.createElement('div');
    d.className = 'ln cmd';
    out.appendChild(d);
    for (const ch of cmd) { d.textContent += ch; body.scrollTop = body.scrollHeight; await sleep(reduced ? 0 : 55); }
    await sleep(reduced ? 0 : 220);
    await run(cmd, { echo: false });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    const v = input.value; input.value = '';
    busy = true; await run(v); busy = false;
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { if (hIdx > 0) input.value = history[--hIdx]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; e.preventDefault(); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const v = input.value.trim();
      const m = Object.keys(COMMANDS).filter((k) => k.startsWith(v) && k !== 'sudo');
      if (m.length === 1) input.value = m[0];
      else if (m.length > 1) print(m.join('  '), 'dim');
    }
  });

  body.addEventListener('click', () => { if (!window.getSelection().toString()) input.focus({ preventScroll: true }); });

  document.querySelectorAll('.chips button').forEach((b) => b.addEventListener('click', async () => {
    if (busy) return;
    busy = true; await typeCmd(b.dataset.cmd); busy = false;
  }));

  // boot sequence
  (async () => {
    busy = true;
    print(c('dim', `Last login: ${new Date().toDateString()} on ttys001`));
    print('');
    await typeCmd('whoami');
    await typeCmd('agents');
    print(c('dim', "type 'help', or tap a command below ↓"));
    busy = false;
  })();
})();
