import {
  AdminSession,
  AmbassadorBio,
  CmsBoardMember,
  CmsBoardSummaryItem,
  CmsEventItem,
  CmsMisiEntry,
  CmsRegistration2027,
  CmsState,
  RegistrationStatus,
  RoleFilter,
  SUMBAR_REGIONS,
  clearAdminSession,
  createEmptyBoardMember,
  createEmptyEvent,
  createTemplateYearLineup,
  deleteRegistration2027,
  exportCatalogCsv,
  exportCmsBackupJson,
  exportRegistrations2027Csv,
  extractRegistrationSequence,
  formatBytesCompact,
  getAdminSession,
  getCmsState,
  getDefaultPasscodeValue,
  hydrateCmsMediaUrls,
  importCmsBackupJson,
  isUsingDefaultPasscodeHint,
  resetCmsModule,
  resolveCmsDocumentUrl,
  resolveCmsImageUrl,
  reviewRegistration2027,
  saveCmsState,
  saveCompressedAdminImage,
  setAdminSession,
  subscribeCmsChange,
  updateAdminPasscode,
  verifyAdminPasscode,
} from './cmsStore';

type AdminTab = 'overview' | 'registrations' | 'catalog' | 'events' | 'board' | 'visimisi';

function escapeHtml(raw: string | undefined | null): string {
  return String(raw ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], {type: mimeType});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function setupAdminPanel(): void {
  const dialog = document.getElementById('admin-cms-dialog') as HTMLDialogElement | null;
  if (!dialog) return;

  let activeTab: AdminTab = 'overview';
  let session: AdminSession | null = getAdminSession();
  let selectedYear = getCmsState().catalogYears[0]?.year ?? '2024';
  let selectedRole: RoleFilter = 'uda';
  let selectedSlotIndex = 0;
  let catalogQuery = '';
  let newYearMode = false;
  let selectedEventId = getCmsState().events[0]?.id ?? '';
  let selectedBoardId = getCmsState().boardMembers[0]?.id ?? '';
  let selectedRegId = getCmsState().registrations2027[0]?.id ?? '';
  let regFilterStatus: 'all' | RegistrationStatus = 'all';
  let regFilterRole: 'all' | RoleFilter = 'all';
  let regFilterRegion = 'all';
  let regQuery = '';
  let previewRegDocOpen = false;
  let zoomRegPhoto: {src: string; title: string} | null = null;
  let globalSearchQuery = '';
  let overviewActivityFilter: 'all' | 'registrations' | 'logs' = 'all';
  let overviewSortOrder: 'newest' | 'oldest' = 'newest';
  let overviewSplineTab: 'all' | 'pending' | 'revision' | 'approved' = 'all';
  let overviewSplineFocusIdx: number | null = null;
  let openRowMenuId: string | null = null;
  let notifPopoverOpen = false;
  let toastMessage = '';
  let toastType: 'success' | 'error' | 'info' = 'success';
  let toastTimer = 0;
  let pendingConfirm: {
    key: string;
    label: string;
    onConfirm: () => void;
  } | null = null;
  let uploadStatNote = '';
  let isRendering = false;

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    toastMessage = msg;
    toastType = type;
    window.clearTimeout(toastTimer);
    render();
    toastTimer = window.setTimeout(() => {
      toastMessage = '';
      const bar = dialog.querySelector<HTMLElement>('[data-admin-toast]');
      if (bar) bar.hidden = true;
    }, 4200);
  };

  const openAdminDialog = () => {
    session = getAdminSession();
    pendingConfirm = null;
    uploadStatNote = '';
    zoomRegPhoto = null;
    if (!dialog.open) {
      dialog.showModal();
    }
    render();
    void hydrateCmsMediaUrls().then(() => {
      if (dialog.open && session) {
        const focused = dialog.querySelector(':focus');
        if (!focused || activeTab === 'registrations') {
          render();
        }
      }
    });
  };

  // Hidden Admin entry: 10 consecutive clicks on the website logo (completely invisible to visitors)
  const SECRET_CLICK_TARGET = 10;
  const SECRET_CLICK_WINDOW_MS = 2500;
  let logoClickCount = 0;
  let lastLogoClickAt = 0;

  const handleSecretLogoClick = (e: MouseEvent, isHeaderLink: boolean) => {
    if (isHeaderLink) {
      e.preventDefault();
    }
    const now = Date.now();
    if (now - lastLogoClickAt > SECRET_CLICK_WINDOW_MS) {
      logoClickCount = 0;
    }
    logoClickCount += 1;
    lastLogoClickAt = now;

    if (logoClickCount >= SECRET_CLICK_TARGET) {
      logoClickCount = 0;
      lastLogoClickAt = 0;
      openAdminDialog();
      return;
    }

    if (isHeaderLink && logoClickCount === 1 && window.scrollY > 24) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const headerBrand = document.querySelector<HTMLElement>('.site-header .brand');
  headerBrand?.addEventListener('click', (e) => handleSecretLogoClick(e, true));

  const footerLogo = document.querySelector<HTMLElement>('.site-footer-brand img');
  footerLogo?.addEventListener('click', (e) => handleSecretLogoClick(e, false));

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });

  const cloneState = (): CmsState => JSON.parse(JSON.stringify(getCmsState())) as CmsState;

  const getTabTitle = (tab: AdminTab): {crumb: string; title: string} => {
    switch (tab) {
      case 'overview':
        return {crumb: 'Ringkasan & Log', title: 'Ringkasan Portal & Riwayat Perubahan'};
      case 'registrations':
        return {crumb: 'Pendaftar 2027', title: 'Verifikasi Berkas & Surat Rekomendasi Peserta 2027'};
      case 'catalog':
        return {crumb: 'Katalog Uda & Uni', title: 'Manajemen Katalog Uda & Uni per Angkatan'};
      case 'events':
        return {crumb: 'Berita & Program', title: 'Berita dan Program Kegiatan'};
      case 'board':
        return {crumb: 'Kepengurusan 2027', title: 'Struktur Kepengurusan & Angka Ringkasan'};
      case 'visimisi':
        return {crumb: 'Visi, Misi & Backup', title: 'Visi, Misi, Cadangan Data & Pengaturan'};
    }
  };

  const renderLoginScreen = () => {
    const useDefaultHint = isUsingDefaultPasscodeHint();
    dialog.innerHTML = `
      <div class="admin-auth-shell">
        <button type="button" class="admin-close-x" data-admin-close aria-label="Tutup Panel Admin">×</button>
        <div class="admin-auth-brand">
          <img src="/assets/aistudio/logo_uda_uni_2027_a45f5678.png" width="40" height="40" alt="Logo Ikatan Uda &amp; Uni">
          <div>
            <strong>Konsol Admin Portal</strong>
            <span>Ikatan Uda &amp; Uni Duta Wisata Sumatera Barat</span>
          </div>
        </div>
        <h2 class="admin-auth-title">Masuk Pengelola Data</h2>
        <p class="admin-auth-sub">Kelola katalog Uda &amp; Uni, berita dan program kegiatan, struktur kepengurusan, serta visi dan misi secara langsung di browser.</p>

        <div class="admin-local-notice">
          <strong>Mode Penyimpanan Lokal Aktif</strong>
          <span>Perubahan disimpan di browser (<code>localStorage</code> &amp; <code>IndexedDB</code>) dan belum terhubung ke Firebase sesuai arahan Anda.</span>
        </div>

        <form class="admin-auth-form" data-admin-login-form>
          <div class="admin-field">
            <label for="admin-operator-name">Nama Operator / Pengurus</label>
            <input id="admin-operator-name" name="operator" type="text" value="Admin Sekretariat" required autocomplete="name">
          </div>
          <div class="admin-field">
            <label for="admin-passcode-input">Kata Sandi Admin</label>
            <input id="admin-passcode-input" name="passcode" type="password" placeholder="Masukkan kata sandi admin" required autocomplete="current-password">
            ${
              useDefaultHint
                ? `<small class="admin-field-hint">Sandi bawaan awal: <code>${escapeHtml(getDefaultPasscodeValue())}</code> (dapat diganti di menu Pengaturan)</small>`
                : `<small class="admin-field-hint">Masukkan kata sandi pengelola yang tersimpan di browser ini.</small>`
            }
          </div>
          <p class="admin-auth-error" data-admin-auth-error hidden></p>
          <div class="admin-auth-actions">
            <button type="button" class="admin-btn admin-btn--ghost" data-admin-close>Batal</button>
            <button type="submit" class="admin-btn admin-btn--primary">Buka Panel Admin</button>
          </div>
        </form>
      </div>
    `;

    dialog.querySelectorAll('[data-admin-close]').forEach((el) => {
      el.addEventListener('click', () => dialog.close());
    });

    const form = dialog.querySelector<HTMLFormElement>('[data-admin-login-form]');
    const errEl = dialog.querySelector<HTMLElement>('[data-admin-auth-error]');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const operator = String(fd.get('operator') || 'Admin Sekretariat');
      const passcode = String(fd.get('passcode') || '');
      const ok = await verifyAdminPasscode(passcode);
      if (!ok) {
        if (errEl) {
          errEl.textContent = 'Kata sandi tidak valid. Periksa kembali sandi admin Anda.';
          errEl.hidden = false;
        }
        return;
      }
      session = setAdminSession(operator);
      showToast(`Selamat datang, ${session.operatorName}. Mode lokal siap digunakan.`, 'success');
    });
  };

  const buildSplineSvgPath = (pts: {x: number; y: number}[]): string => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const renderOverviewTab = (state: CmsState): string => {
    const totalProfiles = state.catalogYears.reduce((sum, y) => sum + y.uda.length + y.uni.length, 0);
    const customPhotos = state.catalogYears.reduce((sum, y) => {
      return (
        sum +
        [...y.uda, ...y.uni].filter((p) => p.photo?.thumb && p.photo.thumb.startsWith('cms-media://')).length
      );
    }, 0);
    const publishedEvents = state.events.filter((e) => e.status === 'published').length;
    const publishedBoard = state.boardMembers.filter((m) => m.status === 'published').length;
    const allRegs = state.registrations2027 || [];
    const pendingOnly = allRegs.filter((r) => r.status === 'pending').length;
    const revisionOnly = allRegs.filter((r) => r.status === 'revision').length;
    const pendingRegs = pendingOnly + revisionOnly;
    const approvedRegs = allRegs.filter((r) => r.status === 'approved').length;
    const rejectedRegs = allRegs.filter((r) => r.status === 'rejected').length;
    const udaRegs = allRegs.filter((r) => r.role === 'uda').length;
    const uniRegs = allRegs.filter((r) => r.role === 'uni').length;
    const representedRegions = new Set(allRegs.map((r) => r.region)).size;
    const regionCoveragePct = Math.round((representedRegions / SUMBAR_REGIONS.length) * 100);
    const decidedRegs = approvedRegs + rejectedRegs;
    const verificationProgressPct = allRegs.length > 0 ? Math.round((decidedRegs / allRegs.length) * 100) : 0;

    // Unified Activity & Registration Queue rows for the bottom list
    interface OverviewRow {
      uid: string;
      kind: 'reg' | 'log';
      title: string;
      subtitle: string;
      timestamp: string;
      metricText: string;
      metricTone: 'default' | 'warn' | 'ok' | 'danger';
      regId?: string;
      regCode?: string;
      targetTab: AdminTab;
      iconSvg: string;
    }

    const regStatusLabel: Record<RegistrationStatus, {text: string; tone: OverviewRow['metricTone']}> = {
      pending: {text: 'Menunggu Cek', tone: 'warn'},
      revision: {text: 'Perlu Revisi', tone: 'warn'},
      approved: {text: 'Disahkan', tone: 'ok'},
      rejected: {text: 'Ditolak', tone: 'danger'},
    };

    const regRows: OverviewRow[] = allRegs.map((r) => {
      const st = regStatusLabel[r.status];
      return {
        uid: `reg-${r.id}`,
        kind: 'reg',
        title: `${r.fullName} · ${r.region}`,
        subtitle: `${r.regCode} · ${r.role === 'uda' ? 'Uda' : 'Uni'}`,
        timestamp: r.updatedAt || r.createdAt,
        metricText: st.text,
        metricTone: st.tone,
        regId: r.id,
        regCode: r.regCode,
        targetTab: 'registrations',
        iconSvg:
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11l-3 3-1.5-1.5"/></svg>',
      };
    });

    const moduleToTab = (mod: string): AdminTab => {
      const m = mod.toLowerCase();
      if (m.includes('pendaftar')) return 'registrations';
      if (m.includes('katalog')) return 'catalog';
      if (m.includes('event') || m.includes('berita')) return 'events';
      if (m.includes('pengurus')) return 'board';
      if (m.includes('visi') || m.includes('sandi') || m.includes('cadangan')) return 'visimisi';
      return 'overview';
    };

    const logRows: OverviewRow[] = state.activityLog.map((log, i) => ({
      uid: `log-${log.id || i}`,
      kind: 'log',
      title: log.summary || log.action,
      subtitle: `${log.operator} · ${log.action}`,
      timestamp: log.timestamp,
      metricText: log.module,
      metricTone: 'default',
      targetTab: moduleToTab(log.module),
      iconSvg:
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
    }));

    let combinedRows: OverviewRow[] = [];
    if (overviewActivityFilter === 'registrations') combinedRows = regRows;
    else if (overviewActivityFilter === 'logs') combinedRows = logRows;
    else combinedRows = [...regRows, ...logRows];

    combinedRows.sort((a, b) => {
      const ta = new Date(a.timestamp).getTime() || 0;
      const tb = new Date(b.timestamp).getTime() || 0;
      return overviewSortOrder === 'newest' ? tb - ta : ta - tb;
    });

    const visibleRows = combinedRows.slice(0, 6);

    // Spline chart data nodes (calculated live from CmsState)
    const splineNodes = [
      {label: 'Masuk', val: allRegs.length, filter: 'all' as const},
      {label: 'Cek', val: pendingOnly, filter: 'pending' as const},
      {label: 'Revisi', val: revisionOnly, filter: 'revision' as const},
      {label: 'Sah', val: approvedRegs, filter: 'approved' as const},
      {label: 'Uda', val: udaRegs, filter: 'all' as const},
      {label: 'Uni', val: uniRegs, filter: 'all' as const},
    ];

    const defaultFocusByTab: Record<typeof overviewSplineTab, number> = {
      all: 0,
      pending: 1,
      revision: 2,
      approved: 3,
    };
    const activeNodeIdx = overviewSplineFocusIdx !== null ? overviewSplineFocusIdx : defaultFocusByTab[overviewSplineTab];
    const activeNode = splineNodes[activeNodeIdx] ?? splineNodes[0];

    const heroMetricMap: Record<typeof overviewSplineTab, {value: string; caption: string}> = {
      all: {
        value: `${allRegs.length} Berkas`,
        caption: `${pendingRegs} menunggu tindakan · ${approvedRegs} sah Katalog 2027`,
      },
      pending: {
        value: `${pendingOnly} Antrean`,
        caption: pendingOnly > 0 ? 'Membutuhkan pemeriksaan & pengesahan admin' : 'Tidak ada antrean baru',
      },
      revision: {
        value: `${revisionOnly} Revisi`,
        caption: revisionOnly > 0 ? 'Menunggu peserta melengkapi foto/surat' : 'Belum ada berkas berstatus revisi',
      },
      approved: {
        value: `${approvedRegs} Finalis`,
        caption: `Masuk otomatis ke Katalog Angkatan 2027 (${udaRegs} Uda · ${uniRegs} Uni)`,
      },
    };
    const activeHero =
      overviewSplineFocusIdx !== null && overviewSplineFocusIdx >= 4
        ? {
            value: `${activeNode.val} ${activeNode.label}`,
            caption: `Total peserta ${activeNode.label} 2027 yang terdaftar`,
          }
        : heroMetricMap[overviewSplineTab];

    const svgW = 310;
    const svgH = 148;
    const padX = 24;
    const topY = 24;
    const baseY = 122;
    const maxVal = Math.max(1, ...splineNodes.map((n) => n.val));
    const hasAnyReg = allRegs.length > 0;

    const chartPts = splineNodes.map((n, idx) => {
      const x = padX + (idx * (svgW - padX * 2)) / (splineNodes.length - 1);
      const ratio = hasAnyReg ? n.val / maxVal : [0.32, 0.26, 0.18, 0.36, 0.24, 0.28][idx];
      const y = baseY - ratio * (baseY - topY);
      return {x, y};
    });

    const linePath = buildSplineSvgPath(chartPts);
    const lastPt = chartPts[chartPts.length - 1];
    const firstPt = chartPts[0];
    const areaPath = `${linePath} L ${lastPt.x.toFixed(1)} ${svgH} L ${firstPt.x.toFixed(1)} ${svgH} Z`;
    const focusPt = chartPts[activeNodeIdx] ?? chartPts[0];

    // Donut progress gauge in right bottom dark card
    const donutPct = allRegs.length > 0 ? verificationProgressPct : regionCoveragePct;
    const donutR = 27;
    const donutC = 2 * Math.PI * donutR;
    const donutOffset = donutC - (donutPct / 100) * donutC;

    const rowsHtml = visibleRows
      .map((row) => {
        const isMenuOpen = openRowMenuId === row.uid;
        return `
          <div class="admin-c-row ${isMenuOpen ? 'has-open-menu' : ''}">
            <button type="button" class="admin-c-row-main" data-overview-open-row="${escapeHtml(row.uid)}" data-overview-target-tab="${row.targetTab}" ${row.regId ? `data-overview-reg-id="${escapeHtml(row.regId)}"` : ''}>
              <span class="admin-c-row-icon" aria-hidden="true">${row.iconSvg}</span>
              <span class="admin-c-row-title-wrap">
                <strong>${escapeHtml(row.title)}</strong>
                <small>${escapeHtml(row.subtitle)}</small>
              </span>
              <span class="admin-c-row-date is-tabular">${escapeHtml(formatDateTime(row.timestamp))}</span>
              <span class="admin-c-row-metric is-${row.metricTone} is-tabular">${escapeHtml(row.metricText)}</span>
            </button>
            <div class="admin-c-row-menu-wrap">
              <button type="button" class="admin-c-dots-btn" data-overview-dots="${escapeHtml(row.uid)}" aria-label="Menu tindakan baris" aria-expanded="${isMenuOpen}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>
              </button>
              ${
                isMenuOpen
                  ? `
                  <div class="admin-c-popover" role="menu">
                    ${
                      row.kind === 'reg' && row.regId
                        ? `
                        <button type="button" role="menuitem" data-overview-open-row="${escapeHtml(row.uid)}" data-overview-target-tab="registrations" data-overview-reg-id="${escapeHtml(row.regId)}">Periksa &amp; Sahkan Berkas</button>
                        <button type="button" role="menuitem" data-reg-copy-code="${escapeHtml(row.regCode || '')}">Salin Kode ${escapeHtml(row.regCode || '')}</button>
                        <button type="button" role="menuitem" data-switch-tab="catalog">Lihat Katalog 2027</button>
                      `
                        : `
                        <button type="button" role="menuitem" data-switch-tab="${row.targetTab}">Buka Modul Terkait</button>
                        <button type="button" role="menuitem" data-action="export-json">Unduh Backup JSON</button>
                        <button type="button" role="menuitem" data-overview-close-menu>Tutup Menu</button>
                      `
                    }
                  </div>
                `
                  : ''
              }
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div class="admin-c-overview-grid">
        <div class="admin-c-left">
          <div class="admin-c-hero-split">
            <div class="admin-c-col-card">
              <div class="admin-c-sec-head">
                <h2>Dasbor Admin</h2>
                <span class="admin-c-sec-hint">Mode Lokal · Non-Firebase</span>
              </div>
              <div class="admin-c-dark-card">
                <div class="admin-c-dark-top">
                  <div class="admin-c-chip-row">
                    <span class="admin-c-sim-chip" aria-hidden="true"></span>
                    <span class="admin-c-card-tag">PORTAL RESMI · 2027</span>
                  </div>
                  <span class="admin-c-signal-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/></svg>
                  </span>
                </div>
                <div class="admin-c-dark-mid">
                  <span class="admin-c-dark-kicker">${pendingRegs > 0 ? 'KEPUTUSAN VERIFIKASI DIPERLUKAN' : 'RINGKASAN PENDAFTAR & KATALOG'}</span>
                  <strong class="is-tabular">${pendingRegs > 0 ? `${pendingRegs} Berkas Antrean` : `${allRegs.length} Pendaftar 2027`}</strong>
                  <small class="is-tabular">${approvedRegs} Disahkan · ${totalProfiles} Profil Katalog (${customPhotos} foto baru)</small>
                </div>
                <div class="admin-c-dark-foot">
                  <button type="button" class="admin-c-dark-cta" data-switch-tab="registrations">
                    ${pendingRegs > 0 ? 'Periksa &amp; Sahkan →' : 'Kelola Pendaftar →'}
                  </button>
                  <div class="admin-c-brand-circles" aria-hidden="true">
                    <i></i><i></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="admin-c-col-tasks">
              <div class="admin-c-sec-head">
                <h3>Akses Prioritas</h3>
              </div>
              <div class="admin-c-squircle-grid">
                <button type="button" class="admin-c-squircle" data-switch-tab="registrations">
                  <span class="admin-c-sq-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                  </span>
                  <strong>Verifikasi 2027</strong>
                  <small>Keputusan Resmi</small>
                  <span class="admin-c-sq-val is-tabular ${pendingRegs > 0 ? 'is-alert' : ''}">${pendingRegs > 0 ? `${pendingRegs} Cek` : `${approvedRegs} Sah`}</span>
                </button>

                <button type="button" class="admin-c-squircle" data-switch-tab="catalog">
                  <span class="admin-c-sq-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </span>
                  <strong>Katalog Duta</strong>
                  <small class="is-tabular">${state.catalogYears.length} Angkatan</small>
                  <span class="admin-c-sq-val is-tabular">${totalProfiles} Profil</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Secondary 3 Module Shortcuts (Single-line clean action cards) -->
          <div class="admin-c-module-strip">
            <button type="button" class="admin-c-mod-pill" data-switch-tab="events">
              <span class="admin-c-mod-dot" aria-hidden="true"></span>
              <div>
                <strong>Berita &amp; Program (${publishedEvents}/${state.events.length})</strong>
                <small>Publikasi Sorotan Section 2</small>
              </div>
              <span class="admin-c-mod-arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" class="admin-c-mod-pill" data-switch-tab="board">
              <span class="admin-c-mod-dot" aria-hidden="true"></span>
              <div>
                <strong>Pengurus 2027 (${publishedBoard}/${state.boardMembers.length})</strong>
                <small>Kartu 3D &amp; Angka Ringkasan</small>
              </div>
              <span class="admin-c-mod-arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" class="admin-c-mod-pill" data-switch-tab="visimisi">
              <span class="admin-c-mod-dot" aria-hidden="true"></span>
              <div>
                <strong>Visi, Misi &amp; Backup</strong>
                <small>Ekspor JSON, Reset &amp; Sandi</small>
              </div>
              <span class="admin-c-mod-arrow" aria-hidden="true">→</span>
            </button>
          </div>

          <!-- Recent Transactions -> Antrean & Aktivitas Terbaru -->
          <section class="admin-c-list-section" aria-label="Antrean dan Aktivitas Terbaru">
            <div class="admin-c-list-head">
              <h3>Antrean &amp; Aktivitas Terbaru</h3>
              <div class="admin-c-list-controls">
                <select class="admin-c-select" aria-label="Filter jenis aktivitas" data-overview-filter>
                  <option value="all" ${overviewActivityFilter === 'all' ? 'selected' : ''}>Semua Data</option>
                  <option value="registrations" ${overviewActivityFilter === 'registrations' ? 'selected' : ''}>Pendaftar 2027 (${allRegs.length})</option>
                  <option value="logs" ${overviewActivityFilter === 'logs' ? 'selected' : ''}>Log Perubahan (${state.activityLog.length})</option>
                </select>
                <button type="button" class="admin-c-sort-btn" data-overview-sort title="Ubah urutan waktu">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
                  <span>${overviewSortOrder === 'newest' ? 'Terbaru' : 'Terlama'}</span>
                </button>
              </div>
            </div>

            <div class="admin-c-list-surface">
              ${
                rowsHtml ||
                `<div class="admin-empty-state">
                  <strong>Belum Ada Aktivitas atau Pendaftar 2027</strong>
                  <p>Setiap berkas peserta yang mendaftar atau perubahan konten admin akan otomatis tercatat di sini.</p>
                </div>`
              }
            </div>
          </section>
        </div>

        <!-- Right Column: Light Analytics Panel + Floating Dark Progress Card -->
        <aside class="admin-c-right" aria-label="Statistik Visual Pendaftar 2027">
          <div class="admin-c-analytics-top">
            <div class="admin-c-analytics-head">
              <span>Pendaftar 2027</span>
              <button type="button" class="admin-c-icon-ghost" data-switch-tab="registrations" title="Buka Analitik &amp; Chart Pendaftar 2027">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>
              </button>
            </div>
            <strong class="admin-c-hero-figure is-tabular">${escapeHtml(activeHero.value)}</strong>
            <p class="admin-c-hero-caption">${escapeHtml(activeHero.caption)}</p>

            <div class="admin-c-spline-tabs" role="tablist" aria-label="Filter metrik pendaftar">
              <button type="button" class="${overviewSplineTab === 'all' && overviewSplineFocusIdx === null ? 'is-active' : ''}" data-spline-tab="all">Semua</button>
              <button type="button" class="${overviewSplineTab === 'pending' && overviewSplineFocusIdx === null ? 'is-active' : ''}" data-spline-tab="pending">Antrean</button>
              <button type="button" class="${overviewSplineTab === 'revision' && overviewSplineFocusIdx === null ? 'is-active' : ''}" data-spline-tab="revision">Revisi</button>
              <button type="button" class="${overviewSplineTab === 'approved' && overviewSplineFocusIdx === null ? 'is-active' : ''}" data-spline-tab="approved">Sah</button>
            </div>
          </div>

          <div class="admin-c-spline-wrap">
            <svg class="admin-c-spline-svg" viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="Grafik tren status pendaftar 2027">
              <defs>
                <linearGradient id="adminCSplineArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#141518" stop-opacity="0.14"/>
                  <stop offset="100%" stop-color="#141518" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="${areaPath}" fill="url(#adminCSplineArea)" />
              <line x1="${focusPt.x.toFixed(1)}" y1="${focusPt.y.toFixed(1)}" x2="${focusPt.x.toFixed(1)}" y2="${svgH - 4}" stroke="#9aa3b2" stroke-width="1.2" stroke-dasharray="2 2" />
              <path d="${linePath}" fill="none" stroke="#141518" stroke-width="2.6" stroke-linecap="round" />
              ${chartPts
                .map(
                  (pt, idx) =>
                    `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${idx === activeNodeIdx ? '5.5' : '9'}" fill="${idx === activeNodeIdx ? '#ffffff' : 'transparent'}" stroke="${idx === activeNodeIdx ? '#141518' : 'transparent'}" stroke-width="2.5" class="admin-c-spline-hit" data-spline-node="${idx}" />`,
                )
                .join('')}
            </svg>
            <div class="admin-c-spline-xaxis">
              ${splineNodes
                .map(
                  (n, idx) => `
                  <button type="button" class="admin-c-x-btn ${idx === activeNodeIdx ? 'is-active' : ''}" data-spline-node="${idx}">
                    ${escapeHtml(n.label)}
                  </button>
                `,
                )
                .join('')}
            </div>
          </div>

          <button type="button" class="admin-c-plan-card" data-switch-tab="registrations">
            <div class="admin-c-plan-copy">
              <span>${allRegs.length > 0 ? `Progres Verifikasi · ${decidedRegs}/${allRegs.length}` : 'Cakupan Kab/Kota 2027'}</span>
              <strong>${allRegs.length > 0 ? 'Berkas Diputuskan' : `${representedRegions} / ${SUMBAR_REGIONS.length} Daerah`}</strong>
              <small>${pendingRegs > 0 ? `${pendingRegs} menunggu pengesahan →` : 'Buka panel verifikasi →'}</small>
            </div>
            <div class="admin-c-donut-wrap">
              <svg width="70" height="70" viewBox="0 0 70 70" aria-hidden="true">
                <defs>
                  <linearGradient id="adminCDonutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="100%" stop-color="#9ca3af" />
                  </linearGradient>
                </defs>
                <circle cx="35" cy="35" r="${donutR}" fill="none" stroke="#2c303a" stroke-width="7.5" />
                <circle
                  cx="35"
                  cy="35"
                  r="${donutR}"
                  fill="none"
                  stroke="url(#adminCDonutGrad)"
                  stroke-width="7.5"
                  stroke-linecap="round"
                  stroke-dasharray="${donutC.toFixed(1)}"
                  stroke-dashoffset="${donutOffset.toFixed(1)}"
                  transform="rotate(-90 35 35)"
                />
              </svg>
              <span class="admin-c-donut-pct is-tabular">${donutPct}%</span>
            </div>
          </button>
        </aside>
      </div>
    `;
  };

  const renderDotsRating = (filledCount: number, toneClass: string): string => {
    const clamped = Math.max(0, Math.min(5, filledCount));
    return `<span class="reg-chart-dots" aria-hidden="true">${Array.from({length: 5}, (_, idx) => `<i class="${idx < clamped ? `is-on ${toneClass}` : ''}"></i>`).join('')}</span>`;
  };

  const renderRegistrationAnalyticsCard = (
    allRegs: CmsRegistration2027[],
    countByStatus: {all: number; pending: number; revision: number; approved: number; rejected: number},
    representedRegions: number,
  ): string => {
    const total = countByStatus.all;
    const pctPending = total ? Math.round((countByStatus.pending / total) * 100) : 0;
    const pctRevision = total ? Math.round((countByStatus.revision / total) * 100) : 0;
    const pctApproved = total ? Math.round((countByStatus.approved / total) * 100) : 0;
    const pctRejected = total ? Math.round((countByStatus.rejected / total) * 100) : 0;

    const udaCount = allRegs.filter((r) => r.role === 'uda').length;
    const uniCount = allRegs.filter((r) => r.role === 'uni').length;
    const completeFilesCount = allRegs.filter((r) =>
      Boolean((r.photoAdatRef || r.photoRef) && r.photoKebesaranRef && r.recLetterRef && r.recNumber),
    ).length;
    const completeFilesPct = total ? Math.round((completeFilesCount / total) * 100) : 0;
    const verificationDone = countByStatus.approved + countByStatus.rejected;
    const verificationProgressPct = total ? Math.round((verificationDone / total) * 100) : 0;
    const regionCoveragePct = Math.round((representedRegions / SUMBAR_REGIONS.length) * 100);

    const cx = 160;
    const cy = 136;

    interface ChartSliceSpec {
      key: RegistrationStatus;
      label: string;
      count: number;
      pct: number;
      radius: number;
      fill: string;
      textColor: string;
    }

    const sliceSpecs: ChartSliceSpec[] = [
      {
        key: 'approved',
        label: 'Disahkan',
        count: countByStatus.approved,
        pct: pctApproved,
        radius: 112,
        fill: 'url(#regChartIceGrad)',
        textColor: '#202124',
      },
      {
        key: 'rejected',
        label: 'Ditolak',
        count: countByStatus.rejected,
        pct: pctRejected,
        radius: 74,
        fill: '#253038',
        textColor: '#ffffff',
      },
      {
        key: 'revision',
        label: 'Perlu Revisi',
        count: countByStatus.revision,
        pct: pctRevision,
        radius: 86,
        fill: '#33B386',
        textColor: '#ffffff',
      },
      {
        key: 'pending',
        label: 'Menunggu Cek',
        count: countByStatus.pending,
        pct: pctPending,
        radius: 98,
        fill: '#E61C45',
        textColor: '#ffffff',
      },
    ];

    const activeSlices = sliceSpecs.filter((s) => s.count > 0);
    let svgWedgesHtml = '';

    if (total === 0 || activeSlices.length === 0) {
      // Placeholder stepped silhouette matching the visual style while indicating 0 registrations
      const demoArcs: {startDeg: number; endDeg: number; r: number; fill: string}[] = [
        {startDeg: -90, endDeg: 115, r: 110, fill: '#E5EEF5'},
        {startDeg: 115, endDeg: 155, r: 74, fill: '#DDE3E8'},
        {startDeg: 155, endDeg: 195, r: 86, fill: '#DDF2EA'},
        {startDeg: 195, endDeg: 270, r: 98, fill: '#FCE4EA'},
      ];
      svgWedgesHtml = demoArcs
        .map((arc) => {
          const sRad = (arc.startDeg * Math.PI) / 180;
          const eRad = (arc.endDeg * Math.PI) / 180;
          const x1 = cx + arc.r * Math.cos(sRad);
          const y1 = cy + arc.r * Math.sin(sRad);
          const x2 = cx + arc.r * Math.cos(eRad);
          const y2 = cy + arc.r * Math.sin(eRad);
          const largeArc = arc.endDeg - arc.startDeg > 180 ? 1 : 0;
          return `<path d="M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${arc.r} ${arc.r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${arc.fill}" />`;
        })
        .join('');
      svgWedgesHtml += `
        <circle cx="${cx}" cy="${cy}" r="42" fill="#ffffff" fill-opacity="0.92" stroke="#dadce0" stroke-width="1" />
        <text x="${cx}" y="${cy - 2}" text-anchor="middle" fill="#202124" font-size="19" font-weight="700" class="is-tabular">0%</text>
        <text x="${cx}" y="${cy + 15}" text-anchor="middle" fill="#5f6368" font-size="10.5" font-weight="500">0 Berkas</text>
      `;
    } else if (activeSlices.length === 1) {
      const only = activeSlices[0];
      const isSelected = regFilterStatus === only.key;
      svgWedgesHtml = `
        <g class="reg-chart-wedge ${isSelected ? 'is-active' : ''}" data-reg-filter="${only.key}" role="button" tabindex="0" aria-label="Filter ${only.label}: ${only.count} berkas (${only.pct}%)">
          <circle cx="${cx}" cy="${cy}" r="${only.radius}" fill="${only.fill}" filter="url(#regChartShadow)" />
          <text x="${cx}" y="${cy - 2}" text-anchor="middle" fill="${only.textColor}" font-size="24" font-weight="700" class="is-tabular">100%</text>
          <text x="${cx}" y="${cy + 18}" text-anchor="middle" fill="${only.textColor}" fill-opacity="0.88" font-size="11.5" font-weight="600">${escapeHtml(only.label)} (${only.count})</text>
        </g>
      `;
    } else {
      let currentDeg = -90;
      svgWedgesHtml = activeSlices
        .map((slice) => {
          const sweepDeg = (slice.count / total) * 360;
          const startDeg = currentDeg;
          const endDeg = currentDeg + sweepDeg;
          currentDeg = endDeg;

          const sRad = (startDeg * Math.PI) / 180;
          const eRad = (endDeg * Math.PI) / 180;
          const midRad = (((startDeg + endDeg) / 2) * Math.PI) / 180;

          const x1 = cx + slice.radius * Math.cos(sRad);
          const y1 = cy + slice.radius * Math.sin(sRad);
          const x2 = cx + slice.radius * Math.cos(eRad);
          const y2 = cy + slice.radius * Math.sin(eRad);
          const largeArc = sweepDeg > 180 ? 1 : 0;

          const labelR = slice.radius * (sweepDeg > 120 ? 0.5 : 0.62);
          const lx = cx + labelR * Math.cos(midRad);
          const ly = cy + labelR * Math.sin(midRad);
          const fontSize = sweepDeg > 110 ? 21 : sweepDeg >= 45 ? 15 : 11.5;
          const isSelected = regFilterStatus === slice.key;
          const showLabel = sweepDeg >= 18;

          return `
            <g class="reg-chart-wedge ${isSelected ? 'is-active' : ''}" data-reg-filter="${slice.key}" role="button" tabindex="0" aria-label="Filter ${slice.label}: ${slice.count} berkas (${slice.pct}%)">
              <path
                d="M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${slice.radius} ${slice.radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z"
                fill="${slice.fill}"
                stroke="${isSelected ? '#1a73e8' : '#ffffff'}"
                stroke-width="${isSelected ? '2.5' : '1.5'}"
                filter="url(#regChartShadow)"
              />
              ${
                showLabel
                  ? `<text x="${lx.toFixed(1)}" y="${(ly + fontSize * 0.34).toFixed(1)}" text-anchor="middle" fill="${slice.textColor}" font-size="${fontSize}" font-weight="700" class="is-tabular">${slice.pct}%</text>`
                  : ''
              }
            </g>
          `;
        })
        .join('');
    }

    const dotFill = (count: number): number => {
      if (total === 0 || count === 0) return 0;
      return Math.max(1, Math.round((count / total) * 5));
    };

    return `
      <section class="admin-reg-chart-card" aria-label="Chart Analitik Verifikasi Pendaftar 2027">
        <div class="admin-reg-chart-head">
          <div>
            <span class="admin-g-intent-label">Kalkulasi Otomatis Real-Time</span>
            <h3>Distribusi Status &amp; Keterisian Pendaftar 2027</h3>
          </div>
          <div class="admin-reg-chart-meta">
            <span class="admin-g-metric-chip is-tabular">Progres Verifikasi: <strong>${verificationProgressPct}%</strong></span>
            <span class="admin-g-metric-chip is-tabular">Utusan Daerah: <strong>${representedRegions} / ${SUMBAR_REGIONS.length}</strong> (${regionCoveragePct}%)</span>
          </div>
        </div>

        <div class="admin-reg-polar-stage">
          <!-- Top Callout: Menunggu Cek -->
          <button type="button" class="reg-chart-callout is-top ${regFilterStatus === 'pending' ? 'is-active' : ''}" data-reg-filter="pending" title="Klik untuk memfilter berkas Menunggu Cek">
            <span class="reg-callout-icon is-red" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            </span>
            <strong class="reg-callout-title">Menunggu Cek · <span class="is-tabular">${countByStatus.pending} (${pctPending}%)</span></strong>
            ${renderDotsRating(dotFill(countByStatus.pending), 'is-red')}
          </button>

          <div class="admin-reg-polar-mid">
            <!-- Left Callout: Perlu Revisi -->
            <button type="button" class="reg-chart-callout is-side ${regFilterStatus === 'revision' ? 'is-active' : ''}" data-reg-filter="revision" title="Klik untuk memfilter berkas Perlu Revisi">
              <span class="reg-callout-icon is-teal" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </span>
              <strong class="reg-callout-title">Perlu Revisi</strong>
              <span class="reg-callout-val is-tabular">${countByStatus.revision} berkas (${pctRevision}%)</span>
              ${renderDotsRating(dotFill(countByStatus.revision), 'is-teal')}
            </button>

            <!-- Center Stepped Radial Pie SVG -->
            <div class="admin-reg-polar-svg-wrap">
              <svg class="admin-reg-polar-svg" viewBox="0 0 320 264" role="img" aria-label="Grafik lingkaran bertingkat status pendaftaran">
                <defs>
                  <linearGradient id="regChartIceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#EDF4F8" />
                    <stop offset="100%" stop-color="#CFDCE7" />
                  </linearGradient>
                  <filter id="regChartShadow" x="-18%" y="-18%" width="136%" height="142%">
                    <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#1e293b" flood-opacity="0.12" />
                  </filter>
                </defs>
                <circle cx="${cx}" cy="${cy}" r="118" fill="none" stroke="#e8edf2" stroke-width="1" stroke-dasharray="3 4" />
                <circle cx="${cx}" cy="${cy}" r="92" fill="none" stroke="#eef2f6" stroke-width="1" />
                ${svgWedgesHtml}
              </svg>
            </div>

            <!-- Right Callout: Disahkan + Ditolak -->
            <div class="reg-chart-side-stack">
              <button type="button" class="reg-chart-callout is-side ${regFilterStatus === 'approved' ? 'is-active' : ''}" data-reg-filter="approved" title="Klik untuk memfilter berkas Disahkan">
                <span class="reg-callout-icon is-dark" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
                </span>
                <strong class="reg-callout-title">Disahkan (Sah)</strong>
                <span class="reg-callout-val is-tabular">${countByStatus.approved} finalis (${pctApproved}%)</span>
                ${renderDotsRating(dotFill(countByStatus.approved), 'is-dark')}
              </button>
              <button type="button" class="reg-chart-rejected-mini ${regFilterStatus === 'rejected' ? 'is-active' : ''}" data-reg-filter="rejected" title="Klik untuk melihat berkas yang ditolak">
                <span>Ditolak:</span>
                <strong class="is-tabular">${countByStatus.rejected} (${pctRejected}%)</strong>
              </button>
            </div>
          </div>
        </div>

        <!-- 01-04 Numbered Legend Strip (Matching Reference Layout & Clickable Filters) -->
        <div class="admin-reg-chart-steps">
          <button type="button" class="reg-step-col ${regFilterStatus === 'all' ? 'is-active' : ''}" data-reg-filter="all">
            <span class="reg-step-icon is-slate" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            <span class="reg-step-title">Total Masuk</span>
            <strong class="reg-step-num is-tabular is-slate">01 · ${total}</strong>
            <small class="reg-step-sub is-tabular">Uda ${udaCount} · Uni ${uniCount}</small>
          </button>

          <button type="button" class="reg-step-col ${regFilterStatus === 'pending' ? 'is-active' : ''}" data-reg-filter="pending">
            <span class="reg-step-icon is-red" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            </span>
            <span class="reg-step-title">Menunggu Cek</span>
            <strong class="reg-step-num is-tabular is-red">02 · ${countByStatus.pending}</strong>
            <small class="reg-step-sub is-tabular">${pctPending}% antrean</small>
          </button>

          <button type="button" class="reg-step-col ${regFilterStatus === 'revision' ? 'is-active' : ''}" data-reg-filter="revision">
            <span class="reg-step-icon is-teal" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </span>
            <span class="reg-step-title">Perlu Revisi</span>
            <strong class="reg-step-num is-tabular is-teal">03 · ${countByStatus.revision}</strong>
            <small class="reg-step-sub is-tabular">${pctRevision}% perbaikan</small>
          </button>

          <button type="button" class="reg-step-col ${regFilterStatus === 'approved' ? 'is-active' : ''}" data-reg-filter="approved">
            <span class="reg-step-icon is-dark" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
            </span>
            <span class="reg-step-title">Disahkan Sah</span>
            <strong class="reg-step-num is-tabular is-dark">04 · ${countByStatus.approved}</strong>
            <small class="reg-step-sub is-tabular">${pctApproved}% Katalog 2027</small>
          </button>
        </div>

        <p class="admin-reg-chart-footnote">
          Kalkulasi otomatis: <strong class="is-tabular">${total}</strong> berkas masuk (<strong class="is-tabular">${udaCount}</strong> Uda, <strong class="is-tabular">${uniCount}</strong> Uni) mewakili <strong class="is-tabular">${representedRegions}/${SUMBAR_REGIONS.length}</strong> kab/kota · kelengkapan berkas penuh <strong class="is-tabular">${completeFilesPct}%</strong> (<span class="is-tabular">${completeFilesCount}/${total}</span>) · progres keputusan selesai <strong class="is-tabular">${verificationProgressPct}%</strong>. Klik bagian chart atau kolom 01–04 untuk memfilter daftar.
        </p>
      </section>
    `;
  };

  const renderRegistrationsTab = (state: CmsState): string => {
    const allRegs = state.registrations2027 || [];
    const q = regQuery.trim().toLowerCase();
    const hasActiveFilters =
      regFilterStatus !== 'all' || regFilterRole !== 'all' || regFilterRegion !== 'all' || q.length > 0;

    const filtered = allRegs
      .filter((r) => {
        if (regFilterStatus !== 'all' && r.status !== regFilterStatus) return false;
        if (regFilterRole !== 'all' && r.role !== regFilterRole) return false;
        if (regFilterRegion !== 'all' && r.region !== regFilterRegion) return false;
        if (!q) return true;
        return `${r.regCode} ${r.fullName} ${r.shortName} ${r.region} ${r.recNumber} ${r.recIssuer} ${r.advocacy} ${r.phone} ${r.email}`
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => {
        const sa = extractRegistrationSequence(a.regCode) ?? Number.MAX_SAFE_INTEGER;
        const sb = extractRegistrationSequence(b.regCode) ?? Number.MAX_SAFE_INTEGER;
        if (sa !== sb) return sa - sb;
        return a.createdAt.localeCompare(b.createdAt);
      });

    const activeReg: CmsRegistration2027 | undefined =
      filtered.find((r) => r.id === selectedRegId) ?? filtered[0];
    if (activeReg) {
      selectedRegId = activeReg.id;
    }

    const statusBadgeMap: Record<RegistrationStatus, {label: string; cls: string}> = {
      pending: {label: 'Menunggu', cls: 'is-empty'},
      revision: {label: 'Revisi', cls: 'is-revision'},
      approved: {label: 'Disahkan', cls: 'is-ok'},
      rejected: {label: 'Ditolak', cls: 'is-rejected'},
    };

    const countByStatus = {
      all: allRegs.length,
      pending: allRegs.filter((r) => r.status === 'pending').length,
      revision: allRegs.filter((r) => r.status === 'revision').length,
      approved: allRegs.filter((r) => r.status === 'approved').length,
      rejected: allRegs.filter((r) => r.status === 'rejected').length,
    };
    const representedRegions = new Set(allRegs.map((r) => r.region)).size;

    const listRows = filtered
      .map((r) => {
        const thumbFallback =
          r.role === 'uda' ? '/assets/placeholders/silhouette-uda.svg' : '/assets/placeholders/silhouette-uni.svg';
        const thumbSrc = resolveCmsImageUrl(r.photoKebesaranRef || r.photoAdatRef || r.photoRef) || thumbFallback;
        const badge = statusBadgeMap[r.status];
        const photoTotal =
          (r.photoAdatRef || r.photoRef ? 1 : 0) +
          (r.photoKebesaranRef ? 1 : 0) +
          (r.extraPhotos?.length ?? 0);
        return `
          <button type="button" class="admin-list-row ${r.id === activeReg?.id ? 'is-selected' : ''}" data-reg-select="${escapeHtml(r.id)}">
            <img class="admin-list-thumb" src="${escapeHtml(thumbSrc)}" alt="" loading="lazy">
            <div class="admin-list-meta">
              <strong>${escapeHtml(r.shortName)}</strong>
              <span>${escapeHtml(r.regCode)} · ${escapeHtml(r.region)} · ${photoTotal} foto</span>
            </div>
            <span class="admin-status-dot ${badge.cls}">${badge.label}</span>
          </button>
        `;
      })
      .join('');

    const activeDocUrl = activeReg ? resolveCmsDocumentUrl(activeReg.recLetterRef) : '';
    const isPdfDoc = Boolean(
      activeReg &&
        (activeReg.recLetterMime.toLowerCase().includes('pdf') ||
          activeReg.recLetterName.toLowerCase().endsWith('.pdf')),
    );

    const regionFilterOptions = SUMBAR_REGIONS.map((regName) => {
      const count = allRegs.filter((r) => r.region === regName).length;
      return `<option value="${escapeHtml(regName)}" ${regFilterRegion === regName ? 'selected' : ''}>${escapeHtml(regName)}${count ? ` (${count})` : ''}</option>`;
    }).join('');

    const activeAchList = activeReg
      ? activeReg.achievementsText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

    const activeChecklist = activeReg
      ? [
          {
            label: 'Biodata & Kontak',
            ok: Boolean(activeReg.fullName && activeReg.phone && activeReg.email && activeReg.education),
            detail: 'Lengkap',
          },
          {
            label: 'Foto Baju Adat',
            ok: Boolean(activeReg.photoAdatRef || activeReg.photoRef),
            detail: activeReg.photoAdatRef || activeReg.photoRef ? 'Ada' : 'Kosong',
          },
          {
            label: 'Foto Kebesaran',
            ok: Boolean(activeReg.photoKebesaranRef),
            detail: activeReg.photoKebesaranRef ? 'Ada' : 'Kosong',
          },
          {
            label: 'Foto Tambahan',
            ok: true,
            detail: `${activeReg.extraPhotos?.length ?? 0} foto`,
          },
          {
            label: 'Surat Rekomendasi',
            ok: Boolean(activeReg.recLetterRef && activeReg.recNumber),
            detail: activeReg.recLetterRef ? 'Terlampir' : 'Kosong',
          },
        ]
      : [];

    const emptyDetailHtml =
      allRegs.length === 0
        ? `
          <div class="admin-empty-state">
            <strong>Belum Ada Pendaftar 2027</strong>
            <p>Pendaftar baru yang mengisi formulir <em>Daftar 2027</em> di halaman utama akan otomatis muncul di sini untuk Anda verifikasi foto &amp; surat rekomendasinya.</p>
          </div>
        `
        : `
          <div class="admin-empty-state">
            <strong>Tidak Ada Berkas yang Cocok</strong>
            <p>Filter status, kelompok, daerah, atau kata kunci pencarian saat ini tidak menghasilkan berkas pendaftar.</p>
            <button type="button" class="admin-btn admin-btn--secondary" data-reg-reset-filters>Reset Semua Filter</button>
          </div>
        `;

    return `
      <div class="admin-section">
        ${renderRegistrationAnalyticsCard(allRegs, countByStatus, representedRegions)}

        <div class="admin-toolbar">
          <div class="admin-toolbar-group">
            <div class="admin-seg" role="group" aria-label="Filter status pendaftar 2027">
              <button type="button" class="admin-seg-btn ${regFilterStatus === 'all' ? 'is-active' : ''}" data-reg-filter="all">Semua (${countByStatus.all})</button>
              <button type="button" class="admin-seg-btn ${regFilterStatus === 'pending' ? 'is-active' : ''}" data-reg-filter="pending">Menunggu (${countByStatus.pending})</button>
              <button type="button" class="admin-seg-btn ${regFilterStatus === 'revision' ? 'is-active' : ''}" data-reg-filter="revision">Revisi (${countByStatus.revision})</button>
              <button type="button" class="admin-seg-btn ${regFilterStatus === 'approved' ? 'is-active' : ''}" data-reg-filter="approved">Disahkan (${countByStatus.approved})</button>
              <button type="button" class="admin-seg-btn ${regFilterStatus === 'rejected' ? 'is-active' : ''}" data-reg-filter="rejected">Ditolak (${countByStatus.rejected})</button>
            </div>
          </div>
          <div class="admin-toolbar-group admin-reg-select-filters">
            <select class="admin-reg-select" aria-label="Filter kelompok" data-reg-role-filter>
              <option value="all" ${regFilterRole === 'all' ? 'selected' : ''}>Semua Kelompok</option>
              <option value="uda" ${regFilterRole === 'uda' ? 'selected' : ''}>Uda (Putra)</option>
              <option value="uni" ${regFilterRole === 'uni' ? 'selected' : ''}>Uni (Putri)</option>
            </select>
            <select class="admin-reg-select" aria-label="Filter Kabupaten/Kota" data-reg-region-filter>
              <option value="all" ${regFilterRegion === 'all' ? 'selected' : ''}>Semua Kab/Kota</option>
              ${regionFilterOptions}
            </select>
            ${
              hasActiveFilters
                ? '<button type="button" class="admin-btn admin-btn--ghost" data-reg-reset-filters>Reset</button>'
                : ''
            }
            <button type="button" class="admin-btn admin-btn--secondary" data-action="export-reg-csv" ${allRegs.length === 0 ? 'disabled' : ''}>Ekspor CSV</button>
          </div>
        </div>

        <div class="admin-split">
          <div class="admin-split-list">
            <input
              type="search"
              class="admin-search-input"
              placeholder="Cari nomor 001, kode, nama, WA, atau daerah..."
              value="${escapeHtml(regQuery)}"
              data-reg-search
            >
            <div class="admin-scroll-list">
              ${
                listRows ||
                `<div class="admin-empty-state">${
                  allRegs.length === 0
                    ? 'Belum ada pendaftar 2027 yang masuk.'
                    : 'Tidak ada berkas pendaftar yang sesuai filter.'
                }</div>`
              }
            </div>
          </div>

          <div class="admin-split-editor">
            ${
              activeReg
                ? `
              <form class="admin-editor-form" data-reg-decision-form>
                <div class="admin-editor-head">
                  <div>
                    <div class="admin-reg-head-tags">
                      <span class="admin-tag">${escapeHtml(activeReg.regCode)}</span>
                      <span class="admin-status-dot ${statusBadgeMap[activeReg.status].cls}">${statusBadgeMap[activeReg.status].label}</span>
                      ${
                        activeReg.assignedSlotIndex !== undefined && activeReg.status === 'approved'
                          ? `<span class="admin-tag">Slot #${activeReg.assignedSlotIndex + 1} Katalog 2027</span>`
                          : ''
                      }
                    </div>
                    <h3>${escapeHtml(activeReg.fullName)}</h3>
                    <p class="admin-reg-submeta">${activeReg.role === 'uda' ? 'Uda (Putra)' : 'Uni (Putri)'} · ${escapeHtml(activeReg.region)}</p>
                  </div>
                  <div class="admin-editor-actions">
                    <button type="button" class="admin-btn admin-btn--ghost admin-mobile-back-list" data-scroll-to-list>↑ Daftar</button>
                    <button type="button" class="admin-btn admin-btn--ghost" data-reg-copy-code="${escapeHtml(activeReg.regCode)}" title="Salin nomor registrasi ke clipboard">Salin Kode</button>
                    ${
                      activeReg.status === 'approved'
                        ? '<button type="button" class="admin-btn admin-btn--secondary" data-reg-jump-catalog title="Buka profil ini di tab Katalog 2027">Lihat di Katalog →</button>'
                        : ''
                    }
                    <button type="button" class="admin-btn admin-btn--danger" data-reg-delete="${escapeHtml(activeReg.id)}" title="Tindakan kritis: Hapus berkas permanen">Hapus Berkas</button>
                  </div>
                </div>

                <div class="admin-reg-checklist">
                  ${activeChecklist
                    .map(
                      (chk) => `
                      <div class="admin-reg-chk-item ${chk.ok ? 'is-ok' : 'is-missing'}">
                        <span>${chk.ok ? '✓' : '!'}</span>
                        <div>
                          <strong>${escapeHtml(chk.label)}</strong>
                          <small>${escapeHtml(chk.detail)}</small>
                        </div>
                      </div>
                    `,
                    )
                    .join('')}
                </div>

                <div class="admin-reg-biodata-card">
                  <div class="admin-reg-biodata-head">
                    <strong>Biodata &amp; Kontak Pendaftar</strong>
                    <div class="admin-reg-contact-actions">
                      <button type="button" class="admin-btn admin-btn--ghost" data-reg-copy-wa="${escapeHtml(activeReg.phone)}">Salin WA</button>
                      <a class="admin-btn admin-btn--ghost" href="mailto:${escapeHtml(activeReg.email)}">Kirim Email</a>
                    </div>
                  </div>
                  <p>Usia: <strong>${escapeHtml(activeReg.age)} th</strong> · WhatsApp: <code>${escapeHtml(activeReg.phone)}</code> · Email: <code>${escapeHtml(activeReg.email)}</code></p>
                  <p>Pendidikan: ${escapeHtml(activeReg.education)}${activeReg.profession ? ` · Profesi: ${escapeHtml(activeReg.profession)}` : ''}</p>
                  <p>Dikirim pada ${escapeHtml(formatDateTime(activeReg.createdAt))} · Diperbarui ${escapeHtml(formatDateTime(activeReg.updatedAt))}</p>
                </div>

                <div class="admin-reg-photos-block">
                  <div class="admin-reg-photos-head">
                    <strong>Portofolio Foto Peserta (${
                      (activeReg.photoAdatRef || activeReg.photoRef ? 1 : 0) +
                      (activeReg.photoKebesaranRef ? 1 : 0) +
                      (activeReg.extraPhotos?.length ?? 0)
                    } Foto)</strong>
                    <span>Klik foto untuk memperbesar &amp; memeriksa detail busana</span>
                  </div>
                  <div class="admin-reg-photos-grid">
                    ${
                      activeReg.photoAdatRef || activeReg.photoRef
                        ? (() => {
                            const url = resolveCmsImageUrl(activeReg.photoAdatRef || activeReg.photoRef);
                            return `
                              <figure class="admin-reg-photo-item is-zoomable" data-reg-zoom-photo="${escapeHtml(url)}" data-reg-zoom-title="Baju Adat Daerah — ${escapeHtml(activeReg.fullName)}">
                                <img src="${escapeHtml(url)}" alt="Foto Baju Adat ${escapeHtml(activeReg.fullName)}">
                                <figcaption>Baju Adat Daerah</figcaption>
                              </figure>
                            `;
                          })()
                        : ''
                    }
                    ${
                      activeReg.photoKebesaranRef
                        ? (() => {
                            const url = resolveCmsImageUrl(activeReg.photoKebesaranRef);
                            return `
                              <figure class="admin-reg-photo-item is-zoomable" data-reg-zoom-photo="${escapeHtml(url)}" data-reg-zoom-title="Baju Kebesaran — ${escapeHtml(activeReg.fullName)}">
                                <img src="${escapeHtml(url)}" alt="Foto Baju Kebesaran ${escapeHtml(activeReg.fullName)}">
                                <figcaption>Baju Kebesaran</figcaption>
                              </figure>
                            `;
                          })()
                        : ''
                    }
                    ${(activeReg.extraPhotos || [])
                      .map((ex, idx) => {
                        const url = resolveCmsImageUrl(ex.ref);
                        const label = ex.label || `Foto Tambahan ${idx + 1}`;
                        return `
                          <figure class="admin-reg-photo-item is-zoomable" data-reg-zoom-photo="${escapeHtml(url)}" data-reg-zoom-title="${escapeHtml(label)} — ${escapeHtml(activeReg.fullName)}">
                            <img src="${escapeHtml(url)}" alt="${escapeHtml(label)}">
                            <figcaption>${escapeHtml(label)}</figcaption>
                          </figure>
                        `;
                      })
                      .join('')}
                  </div>

                  ${
                    zoomRegPhoto
                      ? `
                      <div class="admin-reg-lightbox" role="region" aria-label="Pratinjau foto besar">
                        <div class="admin-reg-lightbox-head">
                          <strong>${escapeHtml(zoomRegPhoto.title)}</strong>
                          <div class="admin-reg-lightbox-actions">
                            <a class="admin-btn admin-btn--ghost" href="${escapeHtml(zoomRegPhoto.src)}" download="${escapeHtml(activeReg.regCode)}-foto.webp">Unduh Foto</a>
                            <button type="button" class="admin-btn admin-btn--secondary" data-reg-zoom-close>Tutup Zoom</button>
                          </div>
                        </div>
                        <img src="${escapeHtml(zoomRegPhoto.src)}" alt="${escapeHtml(zoomRegPhoto.title)}">
                      </div>
                    `
                      : ''
                  }
                </div>

                <div class="admin-reg-doc-box">
                  <div class="admin-reg-doc-head">
                    <div>
                      <strong>Surat Rekomendasi Kabupaten / Kota</strong>
                      <p>No. <code>${escapeHtml(activeReg.recNumber)}</code> · ${escapeHtml(activeReg.recIssuer)} (${escapeHtml(activeReg.recDate)})</p>
                      <small>File: ${escapeHtml(activeReg.recLetterName)} (${escapeHtml(formatBytesCompact(activeReg.recLetterSize))})</small>
                    </div>
                    <div class="admin-photo-actions">
                      ${
                        activeDocUrl
                          ? `<button type="button" class="admin-btn admin-btn--secondary" data-reg-toggle-doc>${previewRegDocOpen ? 'Tutup Pratinjau' : 'Pratinjau Surat'}</button>
                             <a class="admin-btn admin-btn--ghost" href="${escapeHtml(activeDocUrl)}" download="${escapeHtml(activeReg.recLetterName)}">Unduh Surat</a>`
                          : '<span class="admin-tag">Dokumen sedang dimuat / tidak ditemukan</span>'
                      }
                    </div>
                  </div>
                  ${
                    previewRegDocOpen && activeDocUrl
                      ? `<div class="admin-reg-doc-preview">
                          ${
                            isPdfDoc
                              ? `<iframe src="${escapeHtml(activeDocUrl)}" title="Pratinjau Surat Rekomendasi ${escapeHtml(activeReg.recNumber)}"></iframe>`
                              : `<img src="${escapeHtml(activeDocUrl)}" alt="Scan Surat Rekomendasi ${escapeHtml(activeReg.recNumber)}">`
                          }
                        </div>`
                      : ''
                  }
                </div>

                <div class="admin-form-grid">
                  <div class="admin-field admin-field--full">
                    <label>Fokus Advokasi Pariwisata &amp; Budaya</label>
                    <input type="text" value="${escapeHtml(activeReg.advocacy)}" readonly>
                  </div>
                  <div class="admin-field admin-field--full">
                    <label>Prestasi Unggulan (${activeAchList.length} Poin)</label>
                    ${
                      activeAchList.length > 0
                        ? `<ol class="admin-reg-ach-list">${activeAchList
                            .map((item) => `<li>${escapeHtml(item)}</li>`)
                            .join('')}</ol>`
                        : '<div class="admin-reg-ach-empty">Belum ada poin prestasi yang dicantumkan.</div>'
                    }
                  </div>
                  <div class="admin-field admin-field--full">
                    <label>Biografi Singkat Peserta</label>
                    <textarea rows="3" readonly>${escapeHtml(activeReg.bio)}</textarea>
                  </div>
                  <div class="admin-field">
                    <label for="reg-admin-fin">Nomor Finalis 2027 (otomatis dari nomor urut jika dikosongkan)</label>
                    <input id="reg-admin-fin" name="finalistNumber" type="text" value="${escapeHtml(activeReg.finalistNumber ?? '')}" placeholder="Contoh: ${escapeHtml(String(extractRegistrationSequence(activeReg.regCode) ?? 1).padStart(3, '0'))}">
                  </div>
                  <div class="admin-field">
                    <label>Status Saat Ini</label>
                    <input type="text" value="${escapeHtml(statusBadgeMap[activeReg.status].label)}${activeReg.assignedSlotIndex !== undefined ? ` (Slot #${activeReg.assignedSlotIndex + 1} Katalog 2027)` : ''}" readonly>
                  </div>
                  <div class="admin-field admin-field--full">
                    <label for="reg-admin-note">Catatan Verifikasi Panitia (Ditampilkan pada Cek Status Publik)</label>
                    <div class="admin-reg-presets">
                      <button type="button" class="admin-reg-preset-chip" data-reg-note-preset="Berkas & Surat Rekomendasi terverifikasi sah sebagai Finalis Pemilihan Uda & Uni Sumbar 2027.">✓ Berkas Sah &amp; Lengkap</button>
                      <button type="button" class="admin-reg-preset-chip" data-reg-note-preset="Mohon unggah ulang foto Baju Adat Daerah / Baju Kebesaran dengan pencahayaan jelas rasio 3:4.">! Foto Kurang Jelas</button>
                      <button type="button" class="admin-reg-preset-chip" data-reg-note-preset="Scan/PDF Surat Rekomendasi Kab/Kota tampak buram atau nomor surat belum sesuai.">! Surat Rekomendasi Buram</button>
                    </div>
                    <textarea id="reg-admin-note" name="reviewerNote" rows="2" placeholder="Tuliskan status verifikasi atau alasan perbaikan berkas...">${escapeHtml(activeReg.reviewerNote)}</textarea>
                  </div>
                </div>

                <div class="admin-g-decision-card" role="region" aria-label="Panel Keputusan Resmi Verifikasi Admin">
                  <div class="admin-g-decision-head">
                    <div class="admin-g-decision-title">
                      <span class="admin-g-decision-badge" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                      </span>
                      <div>
                        <strong>Keputusan Resmi Admin — Pengesahan Pendaftar 2027</strong>
                        <p>Setiap tombol di bawah langsung mengubah status resmi peserta pada <em>Cek Status Publik</em>. Tombol <strong>Setujui &amp; Masuk Katalog 2027</strong> otomatis mengesahkan peserta sebagai Finalis 2027.</p>
                      </div>
                    </div>
                  </div>
                  <div class="admin-form-foot admin-reg-decision-foot">
                    <button type="button" class="admin-btn admin-btn--ghost" data-scroll-to-list>↑ Kembali ke Daftar</button>
                    ${
                      activeReg.status !== 'pending'
                        ? '<button type="button" class="admin-btn admin-btn--ghost" data-reg-decide="pending">Kembalikan ke Antrean</button>'
                        : ''
                    }
                    <button type="button" class="admin-btn admin-btn--google-warn" data-reg-decide="revision" title="Kembalikan berkas agar peserta memperbaiki foto atau surat">Minta Perbaikan (Revisi)</button>
                    <button type="button" class="admin-btn admin-btn--danger" data-reg-decide="rejected" title="Tindakan kritis (konfirmasi dahulu): Tolak berkas pendaftar">Tolak Berkas</button>
                    <button type="button" class="admin-btn admin-btn--primary" data-reg-decide="approved" title="Pengesahan resmi: Terima berkas &amp; masukkan ke Katalog Finalis 2027">✓ Setujui &amp; Masuk Katalog 2027</button>
                  </div>
                </div>
              </form>
            `
                : emptyDetailHtml
            }
          </div>
        </div>
      </div>
    `;
  };

  const renderCatalogTab = (state: CmsState): string => {
    const yearObj = state.catalogYears.find((y) => y.year === selectedYear) ?? state.catalogYears[0];
    if (!yearObj) {
      return '<div class="admin-empty-state">Belum ada tahun angkatan. Tambahkan tahun baru.</div>';
    }
    selectedYear = yearObj.year;

    const list = selectedRole === 'uda' ? yearObj.uda : yearObj.uni;
    if (selectedSlotIndex < 0 || selectedSlotIndex >= list.length) {
      selectedSlotIndex = 0;
    }

    const q = catalogQuery.trim().toLowerCase();
    const filteredSlots = list.filter((p) => {
      if (!q) return true;
      return `${p.fullName} ${p.region} ${p.rankLabel} ${p.advocacy} ${p.finalistNumber ?? ''} ${p.achievement}`
        .toLowerCase()
        .includes(q);
    });

    const activePerson: AmbassadorBio = list[selectedSlotIndex] ?? list[0];
    const fallbackSvg =
      selectedRole === 'uda' ? '/assets/placeholders/silhouette-uda.svg' : '/assets/placeholders/silhouette-uni.svg';
    const previewUrl = resolveCmsImageUrl(activePerson.photo?.thumb) || fallbackSvg;

    const yearOptions = state.catalogYears
      .map(
        (y) =>
          `<button type="button" class="admin-seg-btn ${y.year === yearObj.year ? 'is-active' : ''}" data-cat-year="${escapeHtml(y.year)}">${escapeHtml(y.year)}${y.status === 'draft' ? ' (Draft)' : ''}</button>`,
      )
      .join('');

    const slotRows = filteredSlots
      .map((p) => {
        const isCustomPhoto = Boolean(p.photo?.thumb && p.photo.thumb.startsWith('cms-media://'));
        const hasRealPhoto = Boolean(p.photo?.thumb && !p.photo.thumb.includes('silhouette-'));
        const thumbSrc = resolveCmsImageUrl(p.photo?.thumb) || fallbackSvg;
        return `
          <button type="button" class="admin-list-row ${p.slotIndex === activePerson.slotIndex ? 'is-selected' : ''}" data-cat-slot="${p.slotIndex}">
            <img class="admin-list-thumb" src="${escapeHtml(thumbSrc)}" alt="" loading="lazy" referrerpolicy="no-referrer">
            <div class="admin-list-meta">
              <strong>${escapeHtml(p.shortName)}</strong>
              <span>${escapeHtml(p.region)} · ${escapeHtml(p.rankLabel)}</span>
            </div>
            <span class="admin-status-dot ${isCustomPhoto ? 'is-custom' : hasRealPhoto ? 'is-ok' : 'is-empty'}">
              ${isCustomPhoto ? 'Upload' : hasRealPhoto ? 'Foto' : 'Siluet'}
            </span>
          </button>
        `;
      })
      .join('');

    return `
      <div class="admin-section">
        <div class="admin-toolbar">
          <div class="admin-toolbar-group">
            <div class="admin-seg" role="group" aria-label="Pilih tahun angkatan">
              ${yearOptions}
            </div>
            <button type="button" class="admin-btn admin-btn--secondary" data-cat-toggle-new-year>+ Tambah Tahun</button>
          </div>
          <div class="admin-toolbar-group">
            <button type="button" class="admin-btn admin-btn--ghost" data-action="export-csv">Ekspor CSV</button>
            <button type="button" class="admin-btn ${yearObj.status === 'published' ? 'admin-btn--secondary' : 'admin-btn--primary'}" data-cat-toggle-year-status>
              ${yearObj.status === 'published' ? 'Status Tahun: Tayang (Ubah ke Draft)' : 'Status Tahun: Draft (Publikasikan)'}
            </button>
          </div>
        </div>

        ${
          newYearMode
            ? `
            <form class="admin-inline-create" data-cat-add-year-form>
              <label for="new-year-input">Tahun Angkatan Baru (4 digit, mis. 2027)</label>
              <input id="new-year-input" name="year" type="number" min="2020" max="2099" value="${Math.max(2027, Number(state.catalogYears[0]?.year || 2024) + 1)}" required>
              <button type="submit" class="admin-btn admin-btn--primary">Buat 19 Slot Uda &amp; 19 Uni</button>
              <button type="button" class="admin-btn admin-btn--ghost" data-cat-cancel-new-year>Batal</button>
            </form>
          `
            : ''
        }

        <div class="admin-split">
          <div class="admin-split-list">
            <div class="admin-list-controls">
              <div class="admin-seg admin-seg--full">
                <button type="button" class="admin-seg-btn ${selectedRole === 'uda' ? 'is-active' : ''}" data-cat-role="uda">Uda (${yearObj.uda.length})</button>
                <button type="button" class="admin-seg-btn ${selectedRole === 'uni' ? 'is-active' : ''}" data-cat-role="uni">Uni (${yearObj.uni.length})</button>
              </div>
              <input type="search" class="admin-search-input" placeholder="Cari nama, daerah, gelar..." value="${escapeHtml(catalogQuery)}" data-cat-search>
            </div>
            <div class="admin-scroll-list">
              ${slotRows || '<div class="admin-empty-state">Tidak ada profil sesuai pencarian.</div>'}
            </div>
          </div>

          <div class="admin-split-editor">
            <form class="admin-editor-form" data-cat-save-form>
              <div class="admin-editor-head">
                <div>
                  <span class="admin-tag">Slot #${String(activePerson.slotIndex + 1).padStart(2, '0')} · ${escapeHtml(yearObj.year)} · ${activePerson.role.toUpperCase()}</span>
                  <h3>${escapeHtml(activePerson.fullName)}</h3>
                </div>
                <div class="admin-editor-actions">
                  <button type="button" class="admin-btn admin-btn--ghost admin-mobile-back-list" data-scroll-to-list>↑ Daftar Peserta</button>
                  <button type="submit" class="admin-btn admin-btn--primary">Simpan Profil</button>
                </div>
              </div>

              <div class="admin-photo-row">
                <div class="admin-photo-preview admin-photo-preview--portrait">
                  <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(activePerson.shortName)}" data-cat-photo-preview referrerpolicy="no-referrer">
                </div>
                <div class="admin-photo-controls">
                  <strong>Foto Duta Wisata (${activePerson.role === 'uda' ? 'Uda' : 'Uni'})</strong>
                  <p>Unggah foto potret (otomatis dikompres ke WebP &le; 900px di browser sebelum disimpan agar cepat saat berpindah Uda/Uni).</p>
                  <div class="admin-photo-actions">
                    <label class="admin-btn admin-btn--secondary admin-file-label">
                      Pilih &amp; Kompres Foto
                      <input type="file" accept="image/*" hidden data-cat-upload-photo>
                    </label>
                    ${
                      activePerson.photo?.thumb
                        ? `<button type="button" class="admin-btn admin-btn--ghost" data-cat-reset-photo>Pakai Siluet Bawaan</button>`
                        : ''
                    }
                  </div>
                  ${uploadStatNote ? `<small class="admin-upload-note">${escapeHtml(uploadStatNote)}</small>` : ''}
                </div>
              </div>

              <div class="admin-form-grid">
                <div class="admin-field">
                  <label for="cat-fullName">Nama Lengkap &amp; Gelar</label>
                  <input id="cat-fullName" name="fullName" type="text" value="${escapeHtml(activePerson.fullName)}" required>
                </div>
                <div class="admin-field">
                  <label for="cat-shortName">Nama Singkat (di Stage)</label>
                  <input id="cat-shortName" name="shortName" type="text" value="${escapeHtml(activePerson.shortName)}" required>
                </div>
                <div class="admin-field">
                  <label for="cat-rankLabel">Predikat / Gelar</label>
                  <input id="cat-rankLabel" name="rankLabel" type="text" value="${escapeHtml(activePerson.rankLabel)}" required>
                </div>
                <div class="admin-field">
                  <label for="cat-region">Kabupaten / Kota Utusan</label>
                  <input id="cat-region" name="region" type="text" value="${escapeHtml(activePerson.region)}" required>
                </div>
                <div class="admin-field">
                  <label for="cat-finalistNumber">No. Finalis (opsional)</label>
                  <input id="cat-finalistNumber" name="finalistNumber" type="text" placeholder="mis. 01" value="${escapeHtml(activePerson.finalistNumber ?? '')}">
                </div>
                <div class="admin-field">
                  <label for="cat-age">Umur (opsional)</label>
                  <input id="cat-age" name="age" type="text" placeholder="mis. 21 tahun" value="${escapeHtml(activePerson.age ?? '')}">
                </div>
                <div class="admin-field">
                  <label for="cat-education">Pekerjaan / Pendidikan</label>
                  <input id="cat-education" name="education" type="text" value="${escapeHtml(activePerson.education)}">
                </div>
                <div class="admin-field">
                  <label for="cat-profession">Peran / Subjudul Profil</label>
                  <input id="cat-profession" name="profession" type="text" value="${escapeHtml(activePerson.profession)}">
                </div>
                <div class="admin-field admin-field--full">
                  <label for="cat-advocacy">Fokus Advokasi (kosongkan jika tidak ditampilkan)</label>
                  <input id="cat-advocacy" name="advocacy" type="text" value="${escapeHtml(activePerson.advocacy)}">
                </div>
                <div class="admin-field admin-field--full">
                  <label for="cat-achievementsText">Daftar Prestasi yang Pernah Diraih (1 poin per baris)</label>
                  <textarea id="cat-achievementsText" name="achievementsText" rows="5" placeholder="Tulis satu prestasi per baris untuk ditampilkan sebagai daftar poin...">${escapeHtml((activePerson.achievements ?? []).join('\n'))}</textarea>
                </div>
                <div class="admin-field admin-field--full">
                  <label for="cat-achievement">Ringkasan Prestasi &amp; Mandat (1 baris)</label>
                  <input id="cat-achievement" name="achievement" type="text" value="${escapeHtml(activePerson.achievement)}">
                </div>
                <div class="admin-field admin-field--full">
                  <label for="cat-bio">Biografi Singkat</label>
                  <textarea id="cat-bio" name="bio" rows="4">${escapeHtml(activePerson.bio)}</textarea>
                </div>
              </div>

              <div class="admin-form-foot">
                <button type="button" class="admin-btn admin-btn--ghost" data-scroll-to-list>↑ Daftar</button>
                <button type="submit" class="admin-btn admin-btn--primary">Simpan Profil</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  };

  const renderEventsTab = (state: CmsState): string => {
    const activeEvent = state.events.find((e) => e.id === selectedEventId) ?? state.events[0];
    if (activeEvent) selectedEventId = activeEvent.id;

    const listRows = state.events
      .map((ev, idx) => {
        const thumbUrl = resolveCmsImageUrl(ev.photo);
        return `
          <div class="admin-item-card ${ev.id === activeEvent?.id ? 'is-selected' : ''}">
            <button type="button" class="admin-item-select" data-ev-select="${escapeHtml(ev.id)}">
              <img class="admin-item-thumb" src="${escapeHtml(thumbUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer">
              <div class="admin-list-meta">
                <strong>${escapeHtml(ev.title)}</strong>
                <span>${escapeHtml(ev.category)} · ${ev.status === 'published' ? 'Tayang' : 'Draft'}</span>
              </div>
            </button>
            <div class="admin-item-order">
              <button type="button" class="admin-icon-btn" data-ev-move="-1" data-ev-id="${escapeHtml(ev.id)}" ${idx === 0 ? 'disabled' : ''} title="Geser naik">↑</button>
              <button type="button" class="admin-icon-btn" data-ev-move="1" data-ev-id="${escapeHtml(ev.id)}" ${idx === state.events.length - 1 ? 'disabled' : ''} title="Geser turun">↓</button>
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div class="admin-section">
        <div class="admin-toolbar">
          <div class="admin-toolbar-group">
            <span class="admin-count-text is-tabular">${state.events.length} Berita &amp; Program Kegiatan (${state.events.filter((e) => e.status === 'published').length} Tayang)</span>
          </div>
          <div class="admin-toolbar-group">
            <button type="button" class="admin-btn admin-btn--primary" data-ev-add>+ Tambah Kegiatan</button>
          </div>
        </div>

        <div class="admin-split">
          <div class="admin-split-list">
            <div class="admin-scroll-list">
              ${listRows}
            </div>
          </div>

          <div class="admin-split-editor">
            ${
              activeEvent
                ? `
              <form class="admin-editor-form" data-ev-save-form>
                <div class="admin-editor-head">
                  <div>
                    <span class="admin-tag">${activeEvent.status === 'published' ? 'TAYANG' : 'DRAFT'} · Urutan #${state.events.findIndex((e) => e.id === activeEvent.id) + 1}</span>
                    <h3>${escapeHtml(activeEvent.title)}</h3>
                  </div>
                  <div class="admin-editor-actions">
                    <button type="button" class="admin-btn admin-btn--ghost admin-mobile-back-list" data-scroll-to-list>↑ Daftar</button>
                    ${
                      state.events.length > 1
                        ? `<button type="button" class="admin-btn admin-btn--danger" data-ev-delete="${escapeHtml(activeEvent.id)}">Hapus</button>`
                        : ''
                    }
                    <button type="submit" class="admin-btn admin-btn--primary">Simpan Event</button>
                  </div>
                </div>

                <div class="admin-photo-row">
                  <div class="admin-photo-preview admin-photo-preview--landscape">
                    <img src="${escapeHtml(resolveCmsImageUrl(activeEvent.photo))}" alt="${escapeHtml(activeEvent.photoAlt)}" referrerpolicy="no-referrer">
                  </div>
                  <div class="admin-photo-controls">
                    <strong>Foto Kartu &amp; Pop-Up Event</strong>
                    <p>Gambar disinkronkan otomatis antara Section 2 dan pop-up detail event. Otomatis dikompres saat diunggah.</p>
                    <div class="admin-photo-actions">
                      <label class="admin-btn admin-btn--secondary admin-file-label">
                        Unggah &amp; Kompres Foto Event
                        <input type="file" accept="image/*" hidden data-ev-upload-photo>
                      </label>
                    </div>
                    ${uploadStatNote ? `<small class="admin-upload-note">${escapeHtml(uploadStatNote)}</small>` : ''}
                  </div>
                </div>

                <div class="admin-form-grid">
                  <div class="admin-field">
                    <label for="ev-status">Status Publikasi</label>
                    <select id="ev-status" name="status">
                      <option value="published" ${activeEvent.status === 'published' ? 'selected' : ''}>Tayang di Website</option>
                      <option value="draft" ${activeEvent.status === 'draft' ? 'selected' : ''}>Draft (Disembunyikan)</option>
                    </select>
                  </div>
                  <div class="admin-field">
                    <label for="ev-category">Label Kategori Kartu</label>
                    <input id="ev-category" name="category" type="text" value="${escapeHtml(activeEvent.category)}" required>
                  </div>
                  <div class="admin-field admin-field--full">
                    <label for="ev-title">Judul Program / Event</label>
                    <input id="ev-title" name="title" type="text" value="${escapeHtml(activeEvent.title)}" required>
                  </div>
                  <div class="admin-field">
                    <label for="ev-modalKicker">Sub-Judul Pop-Up</label>
                    <input id="ev-modalKicker" name="modalKicker" type="text" value="${escapeHtml(activeEvent.modalKicker)}">
                  </div>
                  <div class="admin-field">
                    <label for="ev-focusLine">Baris Fokus Pop-Up</label>
                    <input id="ev-focusLine" name="focusLine" type="text" value="${escapeHtml(activeEvent.focusLine)}">
                  </div>
                  <div class="admin-field admin-field--full">
                    <label for="ev-cardSummary">Ringkasan Kartu Section 2</label>
                    <textarea id="ev-cardSummary" name="cardSummary" rows="2">${escapeHtml(activeEvent.cardSummary)}</textarea>
                  </div>
                  <div class="admin-field admin-field--full">
                    <label for="ev-detailSummary">Narasi Utama Pop-Up (Rata Kiri-Kanan)</label>
                    <textarea id="ev-detailSummary" name="detailSummary" rows="3">${escapeHtml(activeEvent.detailSummary)}</textarea>
                  </div>
                </div>

                <div class="admin-subfieldset">
                  <h4>3 Angka Metrik Kartu Depan</h4>
                  <div class="admin-tri-grid">
                    ${[0, 1, 2]
                      .map((mIdx) => {
                        const m = activeEvent.metrics[mIdx] ?? {value: '', label: ''};
                        return `
                          <div class="admin-mini-pair">
                            <span class="admin-subitem-label">Metrik #${mIdx + 1}</span>
                            <input type="text" name="metricVal_${mIdx}" value="${escapeHtml(m.value)}" placeholder="Angka (mis. 19)" aria-label="Angka Metrik ${mIdx + 1}">
                            <input type="text" name="metricLabel_${mIdx}" value="${escapeHtml(m.label)}" placeholder="Keterangan" aria-label="Keterangan Metrik ${mIdx + 1}">
                          </div>
                        `;
                      })
                      .join('')}
                  </div>
                </div>

                <div class="admin-subfieldset">
                  <h4>3 Poin Rincian Pop-Up</h4>
                  ${[0, 1, 2]
                    .map((dIdx) => {
                      const d = activeEvent.details[dIdx] ?? {label: '', text: ''};
                      return `
                        <div class="admin-detail-pair">
                          <span class="admin-subitem-label admin-detail-label">Poin Rincian #${dIdx + 1}</span>
                          <input type="text" name="detailLabel_${dIdx}" value="${escapeHtml(d.label)}" placeholder="Label poin" aria-label="Label Poin Rincian ${dIdx + 1}">
                          <input type="text" name="detailText_${dIdx}" value="${escapeHtml(d.text)}" placeholder="Uraian poin rincian" aria-label="Uraian Poin Rincian ${dIdx + 1}">
                        </div>
                      `;
                    })
                    .join('')}
                </div>

                <div class="admin-form-foot">
                  <button type="button" class="admin-btn admin-btn--ghost" data-scroll-to-list>↑ Daftar</button>
                  ${
                    state.events.length > 1
                      ? `<button type="button" class="admin-btn admin-btn--danger" data-ev-delete="${escapeHtml(activeEvent.id)}">Hapus</button>`
                      : ''
                  }
                  <button type="submit" class="admin-btn admin-btn--primary">Simpan Event</button>
                </div>
              </form>
            `
                : '<div class="admin-empty-state">Pilih event untuk diedit.</div>'
            }
          </div>
        </div>
      </div>
    `;
  };

  const renderBoardTab = (state: CmsState): string => {
    const activeMember = state.boardMembers.find((m) => m.id === selectedBoardId) ?? state.boardMembers[0];
    if (activeMember) selectedBoardId = activeMember.id;

    const summaryInputs = state.boardSummary
      .map(
        (s, idx) => `
          <div class="admin-summary-edit-card">
            <label>Statistik #${idx + 1}</label>
            <input type="text" name="sumLabel_${idx}" value="${escapeHtml(s.label)}" placeholder="Label">
            <div class="admin-summary-pair">
              <input type="text" name="sumVal_${idx}" value="${escapeHtml(s.value)}" placeholder="Angka">
              <input type="text" name="sumUnit_${idx}" value="${escapeHtml(s.unit)}" placeholder="Satuan (opsional)">
            </div>
          </div>
        `,
      )
      .join('');

    const listRows = state.boardMembers
      .map((member, idx) => {
        const thumbUrl = resolveCmsImageUrl(member.photo);
        return `
          <div class="admin-item-card ${member.id === activeMember?.id ? 'is-selected' : ''}">
            <button type="button" class="admin-item-select" data-bd-select="${escapeHtml(member.id)}">
              <img class="admin-list-thumb" src="${escapeHtml(thumbUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer">
              <div class="admin-list-meta">
                <strong>${escapeHtml(member.cardName)}</strong>
                <span>${escapeHtml(member.cardRolePrefix)} · ${member.status === 'published' ? 'Tayang' : 'Draft'}</span>
              </div>
            </button>
            <div class="admin-item-order">
              <button type="button" class="admin-icon-btn" data-bd-move="-1" data-bd-id="${escapeHtml(member.id)}" ${idx === 0 ? 'disabled' : ''} title="Geser naik">↑</button>
              <button type="button" class="admin-icon-btn" data-bd-move="1" data-bd-id="${escapeHtml(member.id)}" ${idx === state.boardMembers.length - 1 ? 'disabled' : ''} title="Geser turun">↓</button>
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div class="admin-section">
        <form class="admin-panel-block" data-bd-summary-form>
          <div class="admin-block-head">
            <div>
              <h3>Ringkasan Angka Section Kepengurusan</h3>
              <p>Tiga angka utama di bagian kiri Section 3 (Utusan Daerah, Bidang Kerja, Masa Bakti).</p>
            </div>
            <button type="submit" class="admin-btn admin-btn--secondary">Simpan Ringkasan Angka</button>
          </div>
          <div class="admin-tri-grid">
            ${summaryInputs}
          </div>
        </form>

        <div class="admin-toolbar">
          <div class="admin-toolbar-group">
            <span class="admin-count-text is-tabular">${state.boardMembers.length} Pengurus (${state.boardMembers.filter((m) => m.status === 'published').length} Tayang di Kartu 3D)</span>
          </div>
          <div class="admin-toolbar-group">
            <button type="button" class="admin-btn admin-btn--primary" data-bd-add>+ Tambah Pengurus</button>
          </div>
        </div>

        <div class="admin-split">
          <div class="admin-split-list">
            <div class="admin-scroll-list">
              ${listRows}
            </div>
          </div>

          <div class="admin-split-editor">
            ${
              activeMember
                ? `
              <form class="admin-editor-form" data-bd-save-form>
                <div class="admin-editor-head">
                  <div>
                    <span class="admin-tag">${activeMember.status === 'published' ? 'TAYANG' : 'DRAFT'} · ${escapeHtml(activeMember.division)}</span>
                    <h3>${escapeHtml(activeMember.name)}</h3>
                  </div>
                  <div class="admin-editor-actions">
                    <button type="button" class="admin-btn admin-btn--ghost admin-mobile-back-list" data-scroll-to-list>↑ Daftar</button>
                    ${
                      state.boardMembers.length > 1
                        ? `<button type="button" class="admin-btn admin-btn--danger" data-bd-delete="${escapeHtml(activeMember.id)}">Hapus</button>`
                        : ''
                    }
                    <button type="submit" class="admin-btn admin-btn--primary">Simpan Pengurus</button>
                  </div>
                </div>

                <div class="admin-photo-row">
                  <div class="admin-photo-preview admin-photo-preview--portrait">
                    <img src="${escapeHtml(resolveCmsImageUrl(activeMember.photo))}" alt="${escapeHtml(activeMember.name)}" referrerpolicy="no-referrer">
                  </div>
                  <div class="admin-photo-controls">
                    <strong>Foto Pengurus (Kartu 3D &amp; Pop-Up)</strong>
                    <p>Foto yang sama digunakan pada tumpukan kartu 3D Section 3 dan panel detail pengurus.</p>
                    <div class="admin-photo-actions">
                      <label class="admin-btn admin-btn--secondary admin-file-label">
                        Unggah &amp; Kompres Foto
                        <input type="file" accept="image/*" hidden data-bd-upload-photo>
                      </label>
                    </div>
                    ${uploadStatNote ? `<small class="admin-upload-note">${escapeHtml(uploadStatNote)}</small>` : ''}
                  </div>
                </div>

                <div class="admin-form-grid">
                  <div class="admin-field">
                    <label for="bd-status">Status Publikasi</label>
                    <select id="bd-status" name="status">
                      <option value="published" ${activeMember.status === 'published' ? 'selected' : ''}>Tayang di Website</option>
                      <option value="draft" ${activeMember.status === 'draft' ? 'selected' : ''}>Draft (Disembunyikan)</option>
                    </select>
                  </div>
                  <div class="admin-field">
                    <label for="bd-divisionKey">Kelompok Bidang</label>
                    <select id="bd-divisionKey" name="divisionKey">
                      <option value="inti" ${activeMember.divisionKey === 'inti' ? 'selected' : ''}>Pengurus Inti</option>
                      <option value="budaya" ${activeMember.divisionKey === 'budaya' ? 'selected' : ''}>Advokasi &amp; Budaya</option>
                      <option value="promosi" ${activeMember.divisionKey === 'promosi' ? 'selected' : ''}>Promosi &amp; Media</option>
                      <option value="kemitraan" ${activeMember.divisionKey === 'kemitraan' ? 'selected' : ''}>Kemitraan &amp; Sosial</option>
                    </select>
                  </div>
                  <div class="admin-field">
                    <label for="bd-name">Nama Lengkap &amp; Gelar (Pop-Up)</label>
                    <input id="bd-name" name="name" type="text" value="${escapeHtml(activeMember.name)}" required>
                  </div>
                  <div class="admin-field">
                    <label for="bd-cardName">Nama di Kartu 3D</label>
                    <input id="bd-cardName" name="cardName" type="text" value="${escapeHtml(activeMember.cardName)}" required>
                  </div>
                  <div class="admin-field">
                    <label for="bd-cardRolePrefix">Jabatan Singkat Kartu</label>
                    <input id="bd-cardRolePrefix" name="cardRolePrefix" type="text" value="${escapeHtml(activeMember.cardRolePrefix)}" required>
                  </div>
                  <div class="admin-field">
                    <label for="bd-role">Jabatan Lengkap Pop-Up</label>
                    <input id="bd-role" name="role" type="text" value="${escapeHtml(activeMember.role)}" required>
                  </div>
                  <div class="admin-field">
                    <label for="bd-division">Nama Bidang / Divisi</label>
                    <input id="bd-division" name="division" type="text" value="${escapeHtml(activeMember.division)}" required>
                  </div>
                  <div class="admin-field">
                    <label for="bd-origin">Asal Utusan Daerah</label>
                    <input id="bd-origin" name="origin" type="text" value="${escapeHtml(activeMember.origin)}" required>
                  </div>
                  <div class="admin-field">
                    <label for="bd-cohortYear">Tahun Angkatan (Kartu)</label>
                    <input id="bd-cohortYear" name="cohortYear" type="text" value="${escapeHtml(activeMember.cohortYear)}" required>
                  </div>
                  <div class="admin-field">
                    <label for="bd-badge">Predikat Utama</label>
                    <input id="bd-badge" name="badge" type="text" value="${escapeHtml(activeMember.badge)}">
                  </div>
                  <div class="admin-field admin-field--full">
                    <label for="bd-cardRoleCopy">Ringkasan Singkat di Kartu 3D</label>
                    <input id="bd-cardRoleCopy" name="cardRoleCopy" type="text" value="${escapeHtml(activeMember.cardRoleCopy)}">
                  </div>
                  <div class="admin-field admin-field--full">
                    <label for="bd-summary">Deskripsi Peran di Pop-Up (Rata Kiri-Kanan)</label>
                    <textarea id="bd-summary" name="summary" rows="3">${escapeHtml(activeMember.summary)}</textarea>
                  </div>
                </div>

                <div class="admin-subfieldset">
                  <h4>3 Mandat Program Kerja</h4>
                  ${[0, 1, 2]
                    .map(
                      (tIdx) => `
                        <div class="admin-field admin-field--full">
                          <label for="bd-task-${tIdx}">Mandat ${tIdx + 1}</label>
                          <input id="bd-task-${tIdx}" type="text" name="task_${tIdx}" value="${escapeHtml(activeMember.tasks[tIdx] ?? '')}">
                        </div>
                      `,
                    )
                    .join('')}
                </div>

                <div class="admin-form-foot">
                  <button type="button" class="admin-btn admin-btn--ghost" data-scroll-to-list>↑ Daftar</button>
                  ${
                    state.boardMembers.length > 1
                      ? `<button type="button" class="admin-btn admin-btn--danger" data-bd-delete="${escapeHtml(activeMember.id)}">Hapus</button>`
                      : ''
                  }
                  <button type="submit" class="admin-btn admin-btn--primary">Simpan Pengurus</button>
                </div>
              </form>
            `
                : '<div class="admin-empty-state">Pilih pengurus untuk diedit.</div>'
            }
          </div>
        </div>
      </div>
    `;
  };

  const renderMisiGroupFields = (prefix: string, items: CmsMisiEntry[], groupTitle: string): string => `
    <div class="admin-subfieldset">
      <h4>${escapeHtml(groupTitle)}</h4>
      <div class="admin-misi-edit-grid">
        ${items
          .map(
            (item, idx) => `
              <div class="admin-misi-edit-item">
                <span class="admin-subitem-label">Pilar #${idx + 1}</span>
                <input type="text" name="${prefix}_idx_${idx}" value="${escapeHtml(item.indexLabel)}" placeholder="Label indeks" aria-label="Label indeks pilar ${idx + 1}">
                <input type="text" name="${prefix}_title_${idx}" value="${escapeHtml(item.title)}" placeholder="Judul pilar" aria-label="Judul pilar ${idx + 1}">
                <textarea name="${prefix}_desc_${idx}" rows="2" placeholder="Deskripsi" aria-label="Deskripsi pilar ${idx + 1}">${escapeHtml(item.description)}</textarea>
              </div>
            `,
          )
          .join('')}
      </div>
    </div>
  `;

  const renderVisiMisiTab = (state: CmsState): string => {
    const vm = state.visimisi;
    return `
      <div class="admin-section">
        <form class="admin-panel-block" data-vm-save-form>
          <div class="admin-block-head">
            <div>
              <h3>Konten Pop-Up Visi &amp; Misi Ikatan</h3>
              <p>Perubahan langsung memperbarui kartu Visi, Misi, Sebaran 19 Kab/Kota, dan Sapta Pesona.</p>
            </div>
            <button type="submit" class="admin-btn admin-btn--primary">Simpan Visi &amp; Misi</button>
          </div>

          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="vm-eyebrow">Label Atas Dialog</label>
              <input id="vm-eyebrow" name="eyebrow" type="text" value="${escapeHtml(vm.eyebrow)}">
            </div>
            <div class="admin-field">
              <label for="vm-seal">Label Mandat Bawah</label>
              <input id="vm-seal" name="sealLabel" type="text" value="${escapeHtml(vm.sealLabel)}">
            </div>
            <div class="admin-field admin-field--full">
              <label for="vm-chips">Label Nilai Utama (pisahkan dengan koma)</label>
              <input id="vm-chips" name="chips" type="text" value="${escapeHtml(vm.chips.join(', '))}">
            </div>
            <div class="admin-field admin-field--full">
              <label for="vm-quoteLead">Kutipan Visi — Bagian Utama</label>
              <textarea id="vm-quoteLead" name="visiQuoteLead" rows="2">${escapeHtml(vm.visiQuoteLead)}</textarea>
            </div>
            <div class="admin-field admin-field--full">
              <label for="vm-quoteMuted">Kutipan Visi — Lanjutan Sekunder</label>
              <textarea id="vm-quoteMuted" name="visiQuoteMuted" rows="2">${escapeHtml(vm.visiQuoteMuted)}</textarea>
            </div>
            <div class="admin-field admin-field--full">
              <label for="vm-desc">Sub-Deskripsi Visi</label>
              <textarea id="vm-desc" name="visiDesc" rows="2">${escapeHtml(vm.visiDesc)}</textarea>
            </div>
          </div>

          ${renderMisiGroupFields('misi', vm.misiItems, 'Tab 1 — Empat Misi Strategis')}
          ${renderMisiGroupFields('sebaran', vm.sebaranItems, 'Tab 2 — Sebaran 19 Kabupaten / Kota')}
          ${renderMisiGroupFields('komitmen', vm.komitmenItems, 'Tab 3 — Pilar Sapta Pesona')}

          <div class="admin-form-foot">
            <button type="submit" class="admin-btn admin-btn--primary">Simpan Visi &amp; Misi</button>
          </div>
        </form>

        <div class="admin-panel-block">
          <div class="admin-block-head">
            <div>
              <h3>Cadangan, Pemulihan &amp; Keamanan Lokal</h3>
              <p>Kelola ekspor-impor JSON, pulihkan data bawaan per modul, atau ubah kata sandi Admin lokal.</p>
            </div>
          </div>

          <div class="admin-tools-grid">
            <div class="admin-tool-box">
              <strong>Ekspor &amp; Impor Backup Data</strong>
              <p>Simpan seluruh data teks ke file JSON, pulihkan cadangan JSON, atau unduh kode sumber website dalam format Repomix (.txt).</p>
              <div class="admin-photo-actions">
                <button type="button" class="admin-btn admin-btn--secondary" data-action="export-json">Ekspor JSON</button>
                <label class="admin-btn admin-btn--ghost admin-file-label">
                  Impor JSON Backup
                  <input type="file" accept=".json,application/json" hidden data-action-import-json>
                </label>
                <button type="button" class="admin-btn admin-btn--secondary" data-action="download-repomix">Unduh Repomix (.txt)</button>
              </div>
            </div>

            <div class="admin-tool-box">
              <strong>Pulihkan Data Bawaan (Reset)</strong>
              <p>Kembalikan modul tertentu atau seluruh situs ke setelan bawaan awal.</p>
              <div class="admin-reset-row">
                <button type="button" class="admin-btn admin-btn--ghost" data-reset-mod="catalog">Reset Katalog</button>
                <button type="button" class="admin-btn admin-btn--ghost" data-reset-mod="events">Reset Event</button>
                <button type="button" class="admin-btn admin-btn--ghost" data-reset-mod="board">Reset Pengurus</button>
                <button type="button" class="admin-btn admin-btn--danger" data-reset-mod="all">Reset Semua</button>
              </div>
            </div>
          </div>

          <form class="admin-passcode-form" data-passcode-form>
            <h4>Ubah Kata Sandi Admin Lokal</h4>
            <div class="admin-tri-grid admin-passcode-grid">
              <div class="admin-field">
                <label for="admin-cur-pass">Sandi Saat Ini</label>
                <input id="admin-cur-pass" type="password" name="currentPasscode" placeholder="Sandi saat ini" required autocomplete="current-password">
              </div>
              <div class="admin-field">
                <label for="admin-new-pass">Sandi Baru (min. 6 karakter)</label>
                <input id="admin-new-pass" type="password" name="newPasscode" placeholder="Sandi baru (min. 6 karakter)" required autocomplete="new-password">
              </div>
              <div class="admin-field admin-passcode-submit-wrap">
                <button type="submit" class="admin-btn admin-btn--secondary">Simpan Sandi Baru</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  };

  const renderGlobalSearchResults = (state: CmsState): string => {
    const q = globalSearchQuery.trim().toLowerCase();
    if (!q) return '';
    interface SearchHit {
      tab: AdminTab;
      badge: string;
      title: string;
      sub: string;
      regId?: string;
      year?: string;
      role?: RoleFilter;
      slot?: number;
      eventId?: string;
      boardId?: string;
    }
    const hits: SearchHit[] = [];

    for (const r of state.registrations2027 || []) {
      if (`${r.regCode} ${r.fullName} ${r.shortName} ${r.region}`.toLowerCase().includes(q)) {
        hits.push({
          tab: 'registrations',
          badge: 'Pendaftar 2027',
          title: `${r.shortName} · ${r.regCode}`,
          sub: `${r.region} · ${r.status}`,
          regId: r.id,
        });
      }
      if (hits.length >= 6) break;
    }

    if (hits.length < 6) {
      for (const yr of state.catalogYears) {
        for (const role of ['uda', 'uni'] as const) {
          for (const p of yr[role]) {
            if (`${p.fullName} ${p.shortName} ${p.region} ${yr.year}`.toLowerCase().includes(q)) {
              hits.push({
                tab: 'catalog',
                badge: `Katalog ${yr.year}`,
                title: p.shortName,
                sub: `${p.region} · ${role.toUpperCase()}`,
                year: yr.year,
                role,
                slot: p.slotIndex,
              });
            }
            if (hits.length >= 6) break;
          }
          if (hits.length >= 6) break;
        }
        if (hits.length >= 6) break;
      }
    }

    if (hits.length < 6) {
      for (const ev of state.events) {
        if (`${ev.title} ${ev.category}`.toLowerCase().includes(q)) {
          hits.push({
            tab: 'events',
            badge: 'Berita & Agenda',
            title: ev.title,
            sub: ev.category,
            eventId: ev.id,
          });
        }
        if (hits.length >= 6) break;
      }
    }

    if (hits.length < 6) {
      for (const m of state.boardMembers) {
        if (`${m.name} ${m.cardName} ${m.division} ${m.origin}`.toLowerCase().includes(q)) {
          hits.push({
            tab: 'board',
            badge: 'Pengurus 2027',
            title: m.cardName,
            sub: `${m.cardRolePrefix} · ${m.origin}`,
            boardId: m.id,
          });
        }
        if (hits.length >= 6) break;
      }
    }

    return `
      <div class="admin-c-search-results" role="listbox" aria-label="Hasil pencarian cepat">
        ${
          hits.length > 0
            ? hits
                .map(
                  (h, i) => `
                  <button
                    type="button"
                    class="admin-c-search-hit"
                    data-global-hit-idx="${i}"
                    data-hit-tab="${h.tab}"
                    ${h.regId ? `data-hit-reg-id="${escapeHtml(h.regId)}"` : ''}
                    ${h.year ? `data-hit-year="${escapeHtml(h.year)}"` : ''}
                    ${h.role ? `data-hit-role="${h.role}"` : ''}
                    ${h.slot !== undefined ? `data-hit-slot="${h.slot}"` : ''}
                    ${h.eventId ? `data-hit-event-id="${escapeHtml(h.eventId)}"` : ''}
                    ${h.boardId ? `data-hit-board-id="${escapeHtml(h.boardId)}"` : ''}
                  >
                    <span class="admin-c-hit-badge">${escapeHtml(h.badge)}</span>
                    <strong>${escapeHtml(h.title)}</strong>
                    <small>${escapeHtml(h.sub)}</small>
                  </button>
                `,
                )
                .join('')
            : '<div class="admin-c-search-empty">Tidak ditemukan data yang cocok.</div>'
        }
      </div>
    `;
  };

  const render = () => {
    isRendering = true;
    try {
      if (!session) {
        renderLoginScreen();
        return;
      }

      const state = getCmsState();
      const {crumb, title} = getTabTitle(activeTab);
      const pendingRegCount = (state.registrations2027 || []).filter(
        (r) => r.status === 'pending' || r.status === 'revision',
      ).length;
      const operatorInitials = session.operatorName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('') || 'AD';

      let bodyHtml = '';
      if (activeTab === 'overview') bodyHtml = renderOverviewTab(state);
      else if (activeTab === 'registrations') bodyHtml = renderRegistrationsTab(state);
      else if (activeTab === 'catalog') bodyHtml = renderCatalogTab(state);
      else if (activeTab === 'events') bodyHtml = renderEventsTab(state);
      else if (activeTab === 'board') bodyHtml = renderBoardTab(state);
      else bodyHtml = renderVisiMisiTab(state);

      dialog.innerHTML = `
      <div class="admin-workspace">
        <aside class="admin-sidebar">
          <div class="admin-sidebar-brand">
            <div class="admin-sidebar-brand-left">
              <img src="/assets/aistudio/logo_uda_uni_2027_a45f5678.png" width="32" height="32" alt="Logo">
              <div>
                <strong>Uda &amp; Uni</strong>
                <span class="admin-brand-sub-desktop">Konsol Admin</span>
                <span class="admin-brand-sub-mobile">${escapeHtml(session.operatorName)} · Lokal</span>
              </div>
            </div>
            <div class="admin-mobile-head-actions">
              <button type="button" class="admin-btn admin-btn--ghost" data-admin-logout>Keluar</button>
              <button type="button" class="admin-btn admin-btn--secondary" data-admin-close aria-label="Tutup Panel Admin">Tutup</button>
            </div>
          </div>

          <nav class="admin-nav" aria-label="Menu utama Admin">
            <button type="button" class="admin-nav-btn ${activeTab === 'overview' ? 'is-active' : ''}" data-switch-tab="overview">
              <span class="admin-nav-lead">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6.5h-5V21H4a1 1 0 0 1-1-1z"/></svg>
                <span>Ringkasan</span>
              </span>
            </button>
            <button type="button" class="admin-nav-btn ${activeTab === 'registrations' ? 'is-active' : ''}" data-switch-tab="registrations">
              <span class="admin-nav-lead">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M4 4h16v12H5.17L4 17.17z"/><path d="M8 9h8M8 13h5"/></svg>
                <span>Pendaftar 2027</span>
              </span>
              ${
                pendingRegCount > 0
                  ? `<span class="admin-nav-count admin-nav-count--action is-tabular" title="${pendingRegCount} berkas menunggu keputusan">${pendingRegCount}</span>`
                  : `<span class="admin-nav-count is-tabular">${(state.registrations2027 || []).length}</span>`
              }
            </button>
            <button type="button" class="admin-nav-btn ${activeTab === 'catalog' ? 'is-active' : ''}" data-switch-tab="catalog">
              <span class="admin-nav-lead">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="13" width="7" height="7" rx="1.5"/><rect x="14" y="13" width="7" height="7" rx="1.5"/></svg>
                <span>Katalog Duta</span>
              </span>
              <span class="admin-nav-count is-tabular">${state.catalogYears.length}</span>
            </button>
            <button type="button" class="admin-nav-btn ${activeTab === 'events' ? 'is-active' : ''}" data-switch-tab="events">
              <span class="admin-nav-lead">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><path d="M7 8h10M7 12h10M7 16h6"/></svg>
                <span>Berita &amp; Agenda</span>
              </span>
              <span class="admin-nav-count is-tabular">${state.events.length}</span>
            </button>
            <button type="button" class="admin-nav-btn ${activeTab === 'board' ? 'is-active' : ''}" data-switch-tab="board">
              <span class="admin-nav-lead">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Pengurus 2027</span>
              </span>
              <span class="admin-nav-count is-tabular">${state.boardMembers.length}</span>
            </button>
            <button type="button" class="admin-nav-btn ${activeTab === 'visimisi' ? 'is-active' : ''}" data-switch-tab="visimisi">
              <span class="admin-nav-lead">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.79 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                <span>Visi &amp; Backup</span>
              </span>
            </button>
          </nav>

          <div class="admin-sidebar-foot">
            <button type="button" class="admin-btn admin-btn--ghost admin-btn--full" data-admin-logout>Kunci &amp; Keluar</button>
          </div>
        </aside>

        <div class="admin-main">
          <header class="admin-topbar">
            <div class="admin-c-search-wrap">
              <div class="admin-c-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                <input
                  type="search"
                  placeholder="Cari pendaftar, kode 001, finalis, atau agenda..."
                  value="${escapeHtml(globalSearchQuery)}"
                  data-admin-global-search
                  aria-label="Pencarian cepat panel admin"
                >
                ${globalSearchQuery ? '<button type="button" class="admin-c-search-clear" data-admin-clear-search aria-label="Bersihkan pencarian">×</button>' : ''}
              </div>
              ${renderGlobalSearchResults(state)}
            </div>

            <div class="admin-topbar-actions">
              <span class="admin-c-crumb-pill">${escapeHtml(crumb)}</span>
              <button type="button" class="admin-c-icon-btn" data-action="export-json" title="Unduh Backup JSON">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span class="admin-c-icon-btn-label">Backup</span>
              </button>
              <div class="admin-c-notif-wrap">
                <button type="button" class="admin-c-bell-btn ${pendingRegCount > 0 ? 'has-badge' : ''}" data-admin-notif-toggle aria-label="Pemberitahuan antrean verifikasi" aria-expanded="${notifPopoverOpen}">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  ${pendingRegCount > 0 ? `<span class="admin-c-bell-dot is-tabular">${pendingRegCount}</span>` : ''}
                </button>
                ${
                  notifPopoverOpen
                    ? `
                    <div class="admin-c-notif-popover" role="region" aria-label="Ringkasan pemberitahuan verifikasi">
                      <strong>${pendingRegCount > 0 ? `${pendingRegCount} Berkas Perlu Keputusan` : 'Semua Berkas Terverifikasi'}</strong>
                      <p>${pendingRegCount > 0 ? 'Segera periksa foto &amp; surat rekomendasi pada menu Pendaftar 2027.' : 'Tidak ada antrean berkas pendaftar yang tertunda.'}</p>
                      <button type="button" class="admin-btn admin-btn--primary admin-btn--full" data-switch-tab="registrations">Buka Pendaftar 2027 →</button>
                    </div>
                  `
                    : ''
                }
              </div>
              <div class="admin-c-avatar" title="${escapeHtml(session.operatorName)} · Penyimpanan Lokal">${escapeHtml(operatorInitials)}</div>
              <button type="button" class="admin-c-close-pill" data-admin-close aria-label="Tutup Panel Admin">Tutup</button>
            </div>
          </header>

          ${
            pendingConfirm
              ? `
              <div class="admin-confirm-bar" role="alert">
                <span>${escapeHtml(pendingConfirm.label)}</span>
                <div class="admin-confirm-actions">
                  <button type="button" class="admin-btn admin-btn--ghost" data-confirm-cancel>Batal</button>
                  <button type="button" class="admin-btn admin-btn--danger" data-confirm-proceed>Ya, Lanjutkan</button>
                </div>
              </div>
            `
              : ''
          }

          ${
            toastMessage
              ? `<div class="admin-toast admin-toast--${toastType}" data-admin-toast>${escapeHtml(toastMessage)}</div>`
              : ''
          }

          <div class="admin-viewport ${activeTab === 'overview' ? 'is-overview' : ''}">
            ${
              activeTab === 'overview'
                ? ''
                : `
                <div class="admin-view-title">
                  <h2>${escapeHtml(title)}</h2>
                </div>
              `
            }
            ${bodyHtml}
          </div>
        </div>
      </div>
    `;

      bindRenderedEvents();

      // Keep active navigation pill visible when scrolling horizontal mobile tab bar
      if (window.innerWidth <= 980) {
        const activeNav = dialog.querySelector<HTMLElement>('.admin-nav-btn.is-active');
        activeNav?.scrollIntoView({inline: 'nearest', block: 'nearest'});
      }
    } finally {
      isRendering = false;
    }
  };

  const scrollToMobileSection = (selector: string) => {
    if (window.innerWidth > 980) return;
    window.requestAnimationFrame(() => {
      const target = dialog.querySelector<HTMLElement>(selector);
      target?.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  };

  const bindRenderedEvents = () => {
    dialog.querySelectorAll('[data-admin-close]').forEach((el) => {
      el.addEventListener('click', () => dialog.close());
    });

    dialog.querySelectorAll('[data-admin-logout]').forEach((el) => {
      el.addEventListener('click', () => {
        clearAdminSession();
        session = null;
        render();
      });
    });

    dialog.querySelectorAll('[data-scroll-to-list]').forEach((el) => {
      el.addEventListener('click', () => {
        const listEl = dialog.querySelector<HTMLElement>('.admin-split-list');
        listEl?.scrollIntoView({behavior: 'smooth', block: 'start'});
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-switch-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextTab = btn.dataset.switchTab as AdminTab;
        if (!nextTab) return;
        activeTab = nextTab;
        pendingConfirm = null;
        openRowMenuId = null;
        notifPopoverOpen = false;
        uploadStatNote = '';
        render();
      });
    });

    const globalSearchInput = dialog.querySelector<HTMLInputElement>('[data-admin-global-search]');
    globalSearchInput?.addEventListener('input', () => {
      globalSearchQuery = globalSearchInput.value;
      if (activeTab === 'registrations') regQuery = globalSearchQuery;
      if (activeTab === 'catalog') catalogQuery = globalSearchQuery;
      const caret = globalSearchInput.selectionStart ?? globalSearchQuery.length;
      render();
      const restored = dialog.querySelector<HTMLInputElement>('[data-admin-global-search]');
      if (restored) {
        restored.focus();
        restored.setSelectionRange(caret, caret);
      }
    });

    dialog.querySelector('[data-admin-clear-search]')?.addEventListener('click', () => {
      globalSearchQuery = '';
      if (activeTab === 'registrations') regQuery = '';
      if (activeTab === 'catalog') catalogQuery = '';
      render();
    });

    dialog.querySelectorAll<HTMLElement>('[data-global-hit-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const hitTab = (btn.dataset.hitTab as AdminTab) || 'overview';
        activeTab = hitTab;
        if (btn.dataset.hitRegId) selectedRegId = btn.dataset.hitRegId;
        if (btn.dataset.hitYear) selectedYear = btn.dataset.hitYear;
        if (btn.dataset.hitRole) selectedRole = btn.dataset.hitRole as RoleFilter;
        if (btn.dataset.hitSlot !== undefined) selectedSlotIndex = Number(btn.dataset.hitSlot) || 0;
        if (btn.dataset.hitEventId) selectedEventId = btn.dataset.hitEventId;
        if (btn.dataset.hitBoardId) selectedBoardId = btn.dataset.hitBoardId;
        globalSearchQuery = '';
        notifPopoverOpen = false;
        openRowMenuId = null;
        render();
      });
    });

    dialog.querySelector('[data-admin-notif-toggle]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPopoverOpen = !notifPopoverOpen;
      openRowMenuId = null;
      render();
    });

    if (openRowMenuId || notifPopoverOpen) {
      dialog.querySelector('.admin-workspace')?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        if (target.closest('.admin-c-row-menu-wrap') || target.closest('.admin-c-notif-wrap')) return;
        openRowMenuId = null;
        notifPopoverOpen = false;
        render();
      });
    }

    dialog.querySelector<HTMLSelectElement>('[data-overview-filter]')?.addEventListener('change', (e) => {
      overviewActivityFilter = ((e.currentTarget as HTMLSelectElement).value as typeof overviewActivityFilter) || 'all';
      openRowMenuId = null;
      render();
    });

    dialog.querySelector('[data-overview-sort]')?.addEventListener('click', () => {
      overviewSortOrder = overviewSortOrder === 'newest' ? 'oldest' : 'newest';
      openRowMenuId = null;
      render();
    });

    dialog.querySelectorAll<HTMLElement>('[data-overview-dots]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const uid = btn.dataset.overviewDots || null;
        openRowMenuId = openRowMenuId === uid ? null : uid;
        notifPopoverOpen = false;
        render();
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-overview-close-menu]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openRowMenuId = null;
        render();
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-overview-open-row]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTab = (btn.dataset.overviewTargetTab as AdminTab) || 'overview';
        const regId = btn.dataset.overviewRegId;
        activeTab = targetTab;
        if (regId) selectedRegId = regId;
        openRowMenuId = null;
        notifPopoverOpen = false;
        render();
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-spline-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        overviewSplineTab = (btn.dataset.splineTab as typeof overviewSplineTab) || 'all';
        overviewSplineFocusIdx = null;
        render();
      });
    });

    dialog.querySelectorAll<Element>('[data-spline-node]').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = Number((el as HTMLElement).dataset.splineNode);
        if (Number.isNaN(idx)) return;
        overviewSplineFocusIdx = idx;
        if (idx === 0) overviewSplineTab = 'all';
        else if (idx === 1) overviewSplineTab = 'pending';
        else if (idx === 2) overviewSplineTab = 'revision';
        else if (idx === 3) overviewSplineTab = 'approved';
        render();
      });
    });

    dialog.querySelectorAll('[data-action="export-json"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dateTag = new Date().toISOString().slice(0, 10);
        downloadTextFile(`backup-uda-uni-sumbar-${dateTag}.json`, exportCmsBackupJson(), 'application/json');
        showToast('Backup JSON berhasil diunduh.', 'success');
      });
    });

    dialog.querySelector('[data-action="export-csv"]')?.addEventListener('click', () => {
      const dateTag = new Date().toISOString().slice(0, 10);
      downloadTextFile(`katalog-uda-uni-${dateTag}.csv`, exportCatalogCsv(), 'text/csv;charset=utf-8');
      showToast('Katalog Uda & Uni diekspor ke format CSV.', 'success');
    });

    dialog.querySelector('[data-action="export-reg-csv"]')?.addEventListener('click', () => {
      const dateTag = new Date().toISOString().slice(0, 10);
      downloadTextFile(`pendaftar-2027-${dateTag}.csv`, exportRegistrations2027Csv(), 'text/csv;charset=utf-8');
      showToast('Data pendaftar 2027 diekspor ke format CSV.', 'success');
    });

    // Registrations 2027 bindings (buttons + interactive chart wedges)
    dialog.querySelectorAll<Element>('[data-reg-filter]').forEach((el) => {
      const applyFilter = () => {
        const nextFilter = (el as HTMLElement).dataset.regFilter as typeof regFilterStatus;
        regFilterStatus = nextFilter || 'all';
        previewRegDocOpen = false;
        zoomRegPhoto = null;
        render();
      };
      el.addEventListener('click', applyFilter);
      if (el.tagName.toLowerCase() === 'g') {
        el.addEventListener('keydown', (e: Event) => {
          const ke = e as KeyboardEvent;
          if (ke.key === 'Enter' || ke.key === ' ') {
            ke.preventDefault();
            applyFilter();
          }
        });
      }
    });

    dialog.querySelector<HTMLSelectElement>('[data-reg-role-filter]')?.addEventListener('change', (e) => {
      regFilterRole = ((e.currentTarget as HTMLSelectElement).value as typeof regFilterRole) || 'all';
      previewRegDocOpen = false;
      zoomRegPhoto = null;
      render();
    });

    dialog.querySelector<HTMLSelectElement>('[data-reg-region-filter]')?.addEventListener('change', (e) => {
      regFilterRegion = (e.currentTarget as HTMLSelectElement).value || 'all';
      previewRegDocOpen = false;
      zoomRegPhoto = null;
      render();
    });

    dialog.querySelectorAll<HTMLElement>('[data-reg-reset-filters]').forEach((btn) => {
      btn.addEventListener('click', () => {
        regFilterStatus = 'all';
        regFilterRole = 'all';
        regFilterRegion = 'all';
        regQuery = '';
        previewRegDocOpen = false;
        zoomRegPhoto = null;
        render();
      });
    });

    const regSearchInput = dialog.querySelector<HTMLInputElement>('[data-reg-search]');
    regSearchInput?.addEventListener('input', () => {
      regQuery = regSearchInput.value;
      const caret = regSearchInput.selectionStart ?? regQuery.length;
      render();
      const restored = dialog.querySelector<HTMLInputElement>('[data-reg-search]');
      if (restored) {
        restored.focus();
        restored.setSelectionRange(caret, caret);
      }
    });

    dialog.querySelectorAll<HTMLElement>('[data-reg-select]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedRegId = btn.dataset.regSelect || selectedRegId;
        previewRegDocOpen = false;
        zoomRegPhoto = null;
        render();
        scrollToMobileSection('.admin-split-editor');
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-reg-copy-code]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const code = btn.dataset.regCopyCode || '';
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code);
          showToast(`Kode ${code} disalin ke papan klip.`, 'success');
        } catch {
          showToast(`Kode pendaftaran: ${code}`, 'info');
        }
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-reg-copy-wa]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const wa = btn.dataset.regCopyWa || '';
        if (!wa) return;
        try {
          await navigator.clipboard.writeText(wa);
          showToast(`Nomor WhatsApp ${wa} disalin.`, 'success');
        } catch {
          showToast(`Nomor WhatsApp: ${wa}`, 'info');
        }
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-reg-zoom-photo]').forEach((fig) => {
      fig.addEventListener('click', () => {
        const src = fig.dataset.regZoomPhoto || '';
        const title = fig.dataset.regZoomTitle || 'Foto Peserta';
        if (!src) return;
        zoomRegPhoto = {src, title};
        render();
      });
    });

    dialog.querySelector('[data-reg-zoom-close]')?.addEventListener('click', () => {
      zoomRegPhoto = null;
      render();
    });

    dialog.querySelector('[data-reg-toggle-doc]')?.addEventListener('click', () => {
      previewRegDocOpen = !previewRegDocOpen;
      render();
    });

    dialog.querySelectorAll<HTMLElement>('[data-reg-note-preset]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const noteEl = dialog.querySelector<HTMLTextAreaElement>('#reg-admin-note');
        const text = chip.dataset.regNotePreset || '';
        if (noteEl && text) {
          noteEl.value = text;
          noteEl.focus();
        }
      });
    });

    dialog.querySelector('[data-reg-jump-catalog]')?.addEventListener('click', () => {
      const current = (getCmsState().registrations2027 || []).find((r) => r.id === selectedRegId);
      if (!current) return;
      activeTab = 'catalog';
      selectedYear = '2027';
      selectedRole = current.role;
      selectedSlotIndex = current.assignedSlotIndex ?? 0;
      render();
    });

    dialog.querySelectorAll<HTMLElement>('[data-reg-decide]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const status = btn.dataset.regDecide as RegistrationStatus;
        const formEl = dialog.querySelector<HTMLFormElement>('[data-reg-decision-form]');
        if (!formEl || !selectedRegId || !status) return;
        const fd = new FormData(formEl);
        const reviewerNote = String(fd.get('reviewerNote') || '').trim();
        const finalistNumber = String(fd.get('finalistNumber') || '').trim();
        const fallbackNotes: Record<RegistrationStatus, string> = {
          pending: 'Menunggu verifikasi berkas oleh Panitia.',
          revision: 'Mohon periksa kembali kejelasan Surat Rekomendasi Kab/Kota atau foto potret.',
          approved: 'Berkas & Surat Rekomendasi terverifikasi sah sebagai Finalis Pemilihan 2027.',
          rejected: 'Berkas belum memenuhi persyaratan administratif utusan Kabupaten/Kota.',
        };

        const executeDecision = () => {
          const res = reviewRegistration2027(selectedRegId, {
            status,
            reviewerNote: reviewerNote || fallbackNotes[status],
            finalistNumber,
            operatorName: session?.operatorName,
          });
          if (!res.ok) {
            showToast(res.error, 'error');
            return;
          }
          if (status === 'approved') {
            showToast(
              `Berkas disahkan! Profil & foto masuk ke Katalog Angkatan 2027 (Slot #${res.syncedSlot ?? 1}, No. Finalis ${res.registration.finalistNumber ?? '-'}).`,
              'success',
            );
          } else if (status === 'revision') {
            showToast('Status diubah menjadi Perlu Perbaikan Berkas.', 'info');
          } else if (status === 'pending') {
            showToast('Berkas dikembalikan ke antrean menunggu verifikasi.', 'info');
          } else {
            showToast('Berkas pendaftar ditolak.', 'info');
          }
        };

        if (status === 'rejected') {
          const target = (getCmsState().registrations2027 || []).find((r) => r.id === selectedRegId);
          pendingConfirm = {
            key: `reject-reg-${selectedRegId}`,
            label: `Konfirmasi keputusan kritis: Tolak berkas pendaftar ${target?.regCode ?? ''} (${target?.shortName ?? ''})?`,
            onConfirm: executeDecision,
          };
          render();
          return;
        }

        executeDecision();
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-reg-delete]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.regDelete;
        const target = (getCmsState().registrations2027 || []).find((r) => r.id === id);
        if (!id || !target) return;
        pendingConfirm = {
          key: `del-reg-${id}`,
          label: `Hapus permanen berkas pendaftaran ${target.regCode} (${target.shortName})?`,
          onConfirm: () => {
            deleteRegistration2027(id, session?.operatorName);
            selectedRegId = getCmsState().registrations2027[0]?.id ?? '';
            previewRegDocOpen = false;
            zoomRegPhoto = null;
            showToast('Berkas pendaftar dihapus.', 'info');
          },
        };
        render();
      });
    });

    dialog.querySelectorAll('[data-action="download-repomix"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          const resp = await fetch('/repomix-output.txt', {cache: 'no-cache'});
          if (!resp.ok) throw new Error('File Repomix belum tersedia.');
          const text = await resp.text();
          downloadTextFile('repomix-uda-uni-sumbar.txt', text, 'text/plain;charset=utf-8');
          showToast('File Repomix (.txt) berhasil diunduh.', 'success');
        } catch {
          showToast('Gagal mengunduh file Repomix (.txt).', 'error');
        }
      });
    });

    dialog.querySelector('[data-confirm-cancel]')?.addEventListener('click', () => {
      pendingConfirm = null;
      render();
    });
    dialog.querySelector('[data-confirm-proceed]')?.addEventListener('click', () => {
      const fn = pendingConfirm?.onConfirm;
      pendingConfirm = null;
      fn?.();
    });

    // Catalog bindings
    dialog.querySelectorAll<HTMLElement>('[data-cat-year]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedYear = btn.dataset.catYear || selectedYear;
        selectedSlotIndex = 0;
        uploadStatNote = '';
        render();
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-cat-role]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedRole = (btn.dataset.catRole as RoleFilter) || 'uda';
        selectedSlotIndex = 0;
        uploadStatNote = '';
        render();
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-cat-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedSlotIndex = Number(btn.dataset.catSlot || 0);
        uploadStatNote = '';
        render();
        scrollToMobileSection('.admin-split-editor');
      });
    });

    const catSearch = dialog.querySelector<HTMLInputElement>('[data-cat-search]');
    catSearch?.addEventListener('input', () => {
      catalogQuery = catSearch.value;
      const caret = catSearch.selectionStart ?? catalogQuery.length;
      render();
      const restored = dialog.querySelector<HTMLInputElement>('[data-cat-search]');
      if (restored) {
        restored.focus();
        restored.setSelectionRange(caret, caret);
      }
    });

    dialog.querySelector('[data-cat-toggle-new-year]')?.addEventListener('click', () => {
      newYearMode = !newYearMode;
      render();
    });
    dialog.querySelector('[data-cat-cancel-new-year]')?.addEventListener('click', () => {
      newYearMode = false;
      render();
    });

    dialog.querySelector<HTMLFormElement>('[data-cat-add-year-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const yearStr = String(fd.get('year') || '').trim();
      if (!/^\d{4}$/.test(yearStr)) {
        showToast('Masukkan tahun 4 digit yang valid.', 'error');
        return;
      }
      const next = cloneState();
      if (next.catalogYears.some((y) => y.year === yearStr)) {
        showToast(`Angkatan ${yearStr} sudah ada.`, 'error');
        return;
      }
      next.catalogYears.unshift(createTemplateYearLineup(yearStr, 'published'));
      next.catalogYears.sort((a, b) => Number(b.year) - Number(a.year));
      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Katalog',
        action: 'Tambah Tahun Angkatan',
        summary: `Menambahkan angkatan ${yearStr} lengkap dengan 19 slot Uda & 19 slot Uni.`,
      });
      newYearMode = false;
      selectedYear = yearStr;
      selectedSlotIndex = 0;
      showToast(`Angkatan ${yearStr} berhasil dibuat dan langsung tayang di katalog.`, 'success');
    });

    dialog.querySelector('[data-cat-toggle-year-status]')?.addEventListener('click', () => {
      const next = cloneState();
      const target = next.catalogYears.find((y) => y.year === selectedYear);
      if (!target) return;
      target.status = target.status === 'published' ? 'draft' : 'published';
      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Katalog',
        action: 'Ubah Status Angkatan',
        summary: `Angkatan ${target.year} diubah ke status ${target.status === 'published' ? 'Tayang' : 'Draft'}.`,
      });
      showToast(`Status angkatan ${target.year} diperbarui.`, 'success');
    });

    dialog.querySelector<HTMLInputElement>('[data-cat-upload-photo]')?.addEventListener('change', async (e) => {
      const input = e.currentTarget as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
      try {
        const res = await saveCompressedAdminImage(file, 'portrait');
        const next = cloneState();
        const yearObj = next.catalogYears.find((y) => y.year === selectedYear);
        const list = selectedRole === 'uda' ? yearObj?.uda : yearObj?.uni;
        const person = list?.[selectedSlotIndex];
        if (!person) return;
        person.photo = {thumb: res.refUrl, full: res.refUrl};
        saveCmsState(next, {
          operator: session?.operatorName,
          module: 'Katalog',
          action: 'Unggah Foto Duta',
          summary: `${person.shortName} (${selectedYear}) — dikompres ${formatBytesCompact(res.originalBytes)} → ${formatBytesCompact(res.compressedBytes)}.`,
        });
        uploadStatNote = `Terkompres: ${formatBytesCompact(res.originalBytes)} → ${formatBytesCompact(res.compressedBytes)} (${res.width}×${res.height}px)`;
        showToast('Foto potret dikompresi, disimpan ke browser & diterapkan ke panggung utama.', 'success');
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Gagal memproses foto.', 'error');
      }
    });

    dialog.querySelector('[data-cat-reset-photo]')?.addEventListener('click', () => {
      const next = cloneState();
      const yearObj = next.catalogYears.find((y) => y.year === selectedYear);
      const list = selectedRole === 'uda' ? yearObj?.uda : yearObj?.uni;
      const person = list?.[selectedSlotIndex];
      if (!person) return;
      delete person.photo;
      uploadStatNote = '';
      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Katalog',
        action: 'Reset Foto Slot',
        summary: `Mengembalikan foto ${person.shortName} (${selectedYear}) ke siluet bawaan.`,
      });
      showToast('Foto profil dikembalikan ke siluet bawaan.', 'info');
    });

    dialog.querySelector<HTMLFormElement>('[data-cat-save-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const next = cloneState();
      const yearObj = next.catalogYears.find((y) => y.year === selectedYear);
      const list = selectedRole === 'uda' ? yearObj?.uda : yearObj?.uni;
      const person = list?.[selectedSlotIndex];
      if (!person) return;

      person.fullName = String(fd.get('fullName') || person.fullName).trim();
      person.shortName = String(fd.get('shortName') || person.shortName).trim();
      person.rankLabel = String(fd.get('rankLabel') || person.rankLabel).trim();
      person.region = String(fd.get('region') || person.region).trim();
      const finalistNumber = String(fd.get('finalistNumber') || '').trim();
      if (finalistNumber) person.finalistNumber = finalistNumber;
      else delete person.finalistNumber;
      const age = String(fd.get('age') || '').trim();
      if (age) person.age = age;
      else delete person.age;
      person.education = String(fd.get('education') || '').trim();
      person.profession = String(fd.get('profession') || '').trim();
      person.advocacy = String(fd.get('advocacy') || '').trim();
      const achievementsList = String(fd.get('achievementsText') || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const singleAchievement = String(fd.get('achievement') || '').trim();
      if (achievementsList.length > 0) {
        person.achievements = achievementsList;
        person.achievement = singleAchievement || achievementsList.join(' · ');
      } else {
        delete person.achievements;
        person.achievement = singleAchievement;
      }
      person.bio = String(fd.get('bio') || '').trim();

      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Katalog',
        action: 'Perbarui Profil Duta',
        summary: `Menyimpan perubahan ${person.shortName} (${person.region}, ${selectedYear}).`,
      });
      showToast(`Profil ${person.shortName} tersimpan dan langsung aktif di katalog.`, 'success');
    });

    // Events bindings
    dialog.querySelectorAll<HTMLElement>('[data-ev-select]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedEventId = btn.dataset.evSelect || selectedEventId;
        uploadStatNote = '';
        render();
        scrollToMobileSection('.admin-split-editor');
      });
    });

    dialog.querySelector('[data-ev-add]')?.addEventListener('click', () => {
      const next = cloneState();
      const created = createEmptyEvent();
      next.events.push(created);
      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Event',
        action: 'Tambah Event Baru',
        summary: `Menambahkan draft event baru "${created.title}".`,
      });
      selectedEventId = created.id;
      showToast('Event baru ditambahkan (status Draft). Silakan lengkapi & publikasikan.', 'info');
      scrollToMobileSection('.admin-split-editor');
    });

    dialog.querySelectorAll<HTMLElement>('[data-ev-move]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.evId;
        const delta = Number(btn.dataset.evMove || 0);
        const next = cloneState();
        const idx = next.events.findIndex((e) => e.id === id);
        const targetIdx = idx + delta;
        if (idx < 0 || targetIdx < 0 || targetIdx >= next.events.length) return;
        const [item] = next.events.splice(idx, 1);
        next.events.splice(targetIdx, 0, item);
        saveCmsState(next, {
          operator: session?.operatorName,
          module: 'Event',
          action: 'Urutkan Event',
          summary: `Memindahkan urutan "${item.title}" ke posisi #${targetIdx + 1}.`,
        });
        showToast('Urutan Berita dan Program Kegiatan diperbarui.', 'success');
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-ev-delete]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.evDelete;
        const target = getCmsState().events.find((ev) => ev.id === id);
        if (!id || !target) return;
        pendingConfirm = {
          key: `del-ev-${id}`,
          label: `Hapus permanen event "${target.title}"?`,
          onConfirm: () => {
            const next = cloneState();
            next.events = next.events.filter((ev) => ev.id !== id);
            saveCmsState(next, {
              operator: session?.operatorName,
              module: 'Event',
              action: 'Hapus Event',
              summary: `Menghapus event "${target.title}".`,
            });
            selectedEventId = next.events[0]?.id ?? '';
            showToast('Event berhasil dihapus.', 'info');
          },
        };
        render();
      });
    });

    dialog.querySelector<HTMLInputElement>('[data-ev-upload-photo]')?.addEventListener('change', async (e) => {
      const file = (e.currentTarget as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const res = await saveCompressedAdminImage(file, 'landscape');
        const next = cloneState();
        const ev = next.events.find((item) => item.id === selectedEventId);
        if (!ev) return;
        ev.photo = res.refUrl;
        saveCmsState(next, {
          operator: session?.operatorName,
          module: 'Event',
          action: 'Unggah Foto Event',
          summary: `Foto "${ev.title}" dikompres ${formatBytesCompact(res.originalBytes)} → ${formatBytesCompact(res.compressedBytes)}.`,
        });
        uploadStatNote = `Terkompres: ${formatBytesCompact(res.originalBytes)} → ${formatBytesCompact(res.compressedBytes)} (${res.width}×${res.height}px)`;
        showToast('Foto event diperbarui pada Section 2 & pop-up detail.', 'success');
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Gagal memproses foto event.', 'error');
      }
    });

    dialog.querySelector<HTMLFormElement>('[data-ev-save-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const next = cloneState();
      const ev = next.events.find((item) => item.id === selectedEventId);
      if (!ev) return;

      ev.status = fd.get('status') === 'draft' ? 'draft' : 'published';
      ev.category = String(fd.get('category') || ev.category).trim();
      ev.title = String(fd.get('title') || ev.title).trim();
      ev.modalKicker = String(fd.get('modalKicker') || ev.modalKicker).trim();
      ev.focusLine = String(fd.get('focusLine') || '').trim();
      ev.cardSummary = String(fd.get('cardSummary') || '').trim();
      ev.detailSummary = String(fd.get('detailSummary') || '').trim();
      ev.photoAlt = ev.title;
      ev.metrics = [0, 1, 2].map((idx) => ({
        value: String(fd.get(`metricVal_${idx}`) || '').trim(),
        label: String(fd.get(`metricLabel_${idx}`) || '').trim(),
      }));
      ev.details = [0, 1, 2]
        .map((idx) => ({
          label: String(fd.get(`detailLabel_${idx}`) || '').trim(),
          text: String(fd.get(`detailText_${idx}`) || '').trim(),
        }))
        .filter((d) => d.label || d.text);

      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Event',
        action: 'Simpan Event',
        summary: `Memperbarui "${ev.title}" (${ev.status === 'published' ? 'Tayang' : 'Draft'}).`,
      });
      showToast(`Program "${ev.title}" disimpan dan langsung diperbarui di halaman depan.`, 'success');
    });

    // Board bindings
    dialog.querySelector<HTMLFormElement>('[data-bd-summary-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const next = cloneState();
      const items: CmsBoardSummaryItem[] = next.boardSummary.map((orig, idx) => ({
        id: orig.id,
        label: String(fd.get(`sumLabel_${idx}`) || orig.label).trim(),
        value: String(fd.get(`sumVal_${idx}`) || orig.value).trim(),
        unit: String(fd.get(`sumUnit_${idx}`) || '').trim(),
      }));
      next.boardSummary = items;
      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Pengurus',
        action: 'Perbarui Ringkasan Angka',
        summary: `Memperbarui 3 angka ringkasan Section 3 (${items.map((i) => `${i.label}: ${i.value}`).join(', ')}).`,
      });
      showToast('Ringkasan angka Section Kepengurusan diperbarui.', 'success');
    });

    dialog.querySelectorAll<HTMLElement>('[data-bd-select]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedBoardId = btn.dataset.bdSelect || selectedBoardId;
        uploadStatNote = '';
        render();
        scrollToMobileSection('.admin-split-editor');
      });
    });

    dialog.querySelector('[data-bd-add]')?.addEventListener('click', () => {
      const next = cloneState();
      const created = createEmptyBoardMember();
      next.boardMembers.push(created);
      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Pengurus',
        action: 'Tambah Pengurus Baru',
        summary: `Menambahkan draft profil pengurus "${created.cardName}".`,
      });
      selectedBoardId = created.id;
      showToast('Profil pengurus baru ditambahkan (Draft). Lengkapi data & publikasikan.', 'info');
      scrollToMobileSection('.admin-split-editor');
    });

    dialog.querySelectorAll<HTMLElement>('[data-bd-move]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.bdId;
        const delta = Number(btn.dataset.bdMove || 0);
        const next = cloneState();
        const idx = next.boardMembers.findIndex((m) => m.id === id);
        const targetIdx = idx + delta;
        if (idx < 0 || targetIdx < 0 || targetIdx >= next.boardMembers.length) return;
        const [item] = next.boardMembers.splice(idx, 1);
        next.boardMembers.splice(targetIdx, 0, item);
        saveCmsState(next, {
          operator: session?.operatorName,
          module: 'Pengurus',
          action: 'Urutkan Pengurus',
          summary: `Memindahkan urutan "${item.cardName}" ke posisi #${targetIdx + 1}.`,
        });
        showToast('Urutan kartu pengurus 2027 diperbarui.', 'success');
      });
    });

    dialog.querySelectorAll<HTMLElement>('[data-bd-delete]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.bdDelete;
        const target = getCmsState().boardMembers.find((m) => m.id === id);
        if (!id || !target) return;
        pendingConfirm = {
          key: `del-bd-${id}`,
          label: `Hapus permanen profil pengurus "${target.name}"?`,
          onConfirm: () => {
            const next = cloneState();
            next.boardMembers = next.boardMembers.filter((m) => m.id !== id);
            saveCmsState(next, {
              operator: session?.operatorName,
              module: 'Pengurus',
              action: 'Hapus Pengurus',
              summary: `Menghapus profil pengurus "${target.name}".`,
            });
            selectedBoardId = next.boardMembers[0]?.id ?? '';
            showToast('Profil pengurus dihapus.', 'info');
          },
        };
        render();
      });
    });

    dialog.querySelector<HTMLInputElement>('[data-bd-upload-photo]')?.addEventListener('change', async (e) => {
      const file = (e.currentTarget as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const res = await saveCompressedAdminImage(file, 'portrait');
        const next = cloneState();
        const member = next.boardMembers.find((m) => m.id === selectedBoardId);
        if (!member) return;
        member.photo = res.refUrl;
        saveCmsState(next, {
          operator: session?.operatorName,
          module: 'Pengurus',
          action: 'Unggah Foto Pengurus',
          summary: `Foto "${member.cardName}" dikompres ${formatBytesCompact(res.originalBytes)} → ${formatBytesCompact(res.compressedBytes)}.`,
        });
        uploadStatNote = `Terkompres: ${formatBytesCompact(res.originalBytes)} → ${formatBytesCompact(res.compressedBytes)} (${res.width}×${res.height}px)`;
        showToast('Foto pengurus diperbarui di kartu 3D & pop-up detail.', 'success');
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Gagal memproses foto pengurus.', 'error');
      }
    });

    dialog.querySelector<HTMLFormElement>('[data-bd-save-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const next = cloneState();
      const member = next.boardMembers.find((m) => m.id === selectedBoardId);
      if (!member) return;

      const divKey = String(fd.get('divisionKey') || 'budaya') as CmsBoardMember['divisionKey'];
      member.status = fd.get('status') === 'draft' ? 'draft' : 'published';
      member.divisionKey = divKey;
      member.isCore = divKey === 'inti';
      member.name = String(fd.get('name') || member.name).trim();
      member.cardName = String(fd.get('cardName') || member.cardName).trim();
      member.cardRolePrefix = String(fd.get('cardRolePrefix') || member.cardRolePrefix).trim();
      member.cardRoleCopy = String(fd.get('cardRoleCopy') || '').trim();
      member.role = String(fd.get('role') || member.role).trim();
      member.division = String(fd.get('division') || member.division).trim();
      member.origin = String(fd.get('origin') || '').trim();
      member.cohortYear = String(fd.get('cohortYear') || '').trim();
      member.badge = String(fd.get('badge') || '').trim();
      member.summary = String(fd.get('summary') || '').trim();
      member.photoAlt = `${member.name} — ${member.role}`;
      member.tasks = [0, 1, 2].map((i) => String(fd.get(`task_${i}`) || '').trim()).filter(Boolean);

      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Pengurus',
        action: 'Simpan Pengurus',
        summary: `Memperbarui profil "${member.name}" (${member.status === 'published' ? 'Tayang' : 'Draft'}).`,
      });
      showToast(`Profil ${member.cardName} tersimpan dan kartu 3D langsung diperbarui.`, 'success');
    });

    // Visi Misi & Backup bindings
    dialog.querySelector<HTMLFormElement>('[data-vm-save-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const next = cloneState();
      const vm = next.visimisi;

      vm.eyebrow = String(fd.get('eyebrow') || vm.eyebrow).trim();
      vm.sealLabel = String(fd.get('sealLabel') || vm.sealLabel).trim();
      vm.chips = String(fd.get('chips') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      vm.visiQuoteLead = String(fd.get('visiQuoteLead') || vm.visiQuoteLead).trim();
      vm.visiQuoteMuted = String(fd.get('visiQuoteMuted') || '').trim();
      vm.visiDesc = String(fd.get('visiDesc') || '').trim();

      const readGroup = (prefix: string, orig: CmsMisiEntry[]): CmsMisiEntry[] =>
        orig.map((item, idx) => ({
          indexLabel: String(fd.get(`${prefix}_idx_${idx}`) || item.indexLabel).trim(),
          title: String(fd.get(`${prefix}_title_${idx}`) || item.title).trim(),
          description: String(fd.get(`${prefix}_desc_${idx}`) || item.description).trim(),
        }));

      vm.misiItems = readGroup('misi', vm.misiItems);
      vm.sebaranItems = readGroup('sebaran', vm.sebaranItems);
      vm.komitmenItems = readGroup('komitmen', vm.komitmenItems);

      saveCmsState(next, {
        operator: session?.operatorName,
        module: 'Visi & Misi',
        action: 'Simpan Visi & Misi',
        summary: 'Memperbarui kutipan Visi, 4 Misi Strategis, Sebaran 19 Kab/Kota, & Sapta Pesona.',
      });
      showToast('Data Visi & Misi berhasil disimpan dan diterapkan.', 'success');
    });

    dialog.querySelector<HTMLInputElement>('[data-action-import-json]')?.addEventListener('change', async (e) => {
      const file = (e.currentTarget as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const res = importCmsBackupJson(text, session?.operatorName);
        if (!res.ok) {
          showToast(res.error, 'error');
          return;
        }
        selectedYear = res.state.catalogYears[0]?.year ?? '2024';
        selectedEventId = res.state.events[0]?.id ?? '';
        selectedBoardId = res.state.boardMembers[0]?.id ?? '';
        showToast('Backup JSON berhasil diimpor dan diterapkan ke seluruh situs.', 'success');
      } catch {
        showToast('Gagal membaca file JSON.', 'error');
      }
    });

    dialog.querySelectorAll<HTMLElement>('[data-reset-mod]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mod = btn.dataset.resetMod as 'catalog' | 'events' | 'board' | 'visimisi' | 'all';
        const labelMap: Record<typeof mod, string> = {
          catalog: 'Pulihkan Katalog Uda & Uni ke data bawaan? Foto upload pada katalog akan dilepas dari slot.',
          events: 'Pulihkan seluruh Berita dan Program Kegiatan ke data bawaan?',
          board: 'Pulihkan Struktur Kepengurusan 2027 ke data bawaan?',
          visimisi: 'Pulihkan Visi & Misi ke teks bawaan?',
          all: 'Pulihkan SELURUH data portal ke setelan bawaan awal?',
        };
        pendingConfirm = {
          key: `reset-${mod}`,
          label: labelMap[mod],
          onConfirm: () => {
            const updated = resetCmsModule(mod, session?.operatorName);
            selectedYear = updated.catalogYears[0]?.year ?? '2024';
            selectedEventId = updated.events[0]?.id ?? '';
            selectedBoardId = updated.boardMembers[0]?.id ?? '';
            showToast('Data berhasil dipulihkan ke bawaan.', 'info');
          },
        };
        render();
      });
    });

    dialog.querySelector<HTMLFormElement>('[data-passcode-form]')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const currentPass = String(fd.get('currentPasscode') || '');
      const newPass = String(fd.get('newPasscode') || '');
      const res = await updateAdminPasscode(currentPass, newPass);
      if (!res.ok) {
        showToast(res.error || 'Gagal mengganti sandi.', 'error');
        return;
      }
      showToast('Kata sandi admin lokal berhasil diperbarui.', 'success');
    });
  };

  subscribeCmsChange(() => {
    if (!dialog.open || !session || isRendering) return;
    if (dialog.querySelector('input:focus, textarea:focus, select:focus')) return;
    if (activeTab === 'registrations' || activeTab === 'overview') {
      render();
    }
  });
}
