// 실시간 상담 도움 패널 (phase 1 - static rule engine)
// 사용: HelpPanel.init({ textareaId, accidentTypeSelectId, panelId, accidentType, debounceMs })

(function (global) {
    function debounce(fn, ms) {
        let t;
        return function () {
            const self = this, args = arguments;
            clearTimeout(t);
            t = setTimeout(() => fn.apply(self, args), ms);
        };
    }

    function renderList(title, items) {
        if (!items || items.length === 0) return '';
        return '<div class="help-section"><h4>' + title + '</h4><ul>'
            + items.map(s => '<li>' + escapeHtml(s) + '</li>').join('')
            + '</ul></div>';
    }

    function renderChecklist(items, storageKey) {
        if (!items || items.length === 0) return '';
        const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
        const html = items.map((s, idx) => {
            const checked = state[s] ? 'checked' : '';
            return '<li><label>'
                + '<input type="checkbox" data-item="' + escapeHtml(s) + '" ' + checked + '/> '
                + escapeHtml(s) + '</label></li>';
        }).join('');
        return '<div class="help-section"><h4>체크리스트</h4><ul class="help-checklist">'
            + html + '</ul></div>';
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function fetchAndRender(cfg) {
        const ta = document.getElementById(cfg.textareaId);
        const sel = cfg.accidentTypeSelectId ? document.getElementById(cfg.accidentTypeSelectId) : null;
        const panel = document.getElementById(cfg.panelId);
        if (!panel) return;

        const accidentType = (sel && sel.value) ? sel.value : (cfg.accidentType || null);
        const body = {
            accidentType: accidentType,
            consultationText: ta ? ta.value : '',
            consultationId: cfg.consultationId || null
        };

        fetch('/api/help/suggest', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        }).then(r => r.json()).then(data => {
            const storageKey = 'help.checklist.' + (cfg.consultationId || 'new');
            let html = '';
            html += '<p class="help-engine-info">엔진: ' + escapeHtml(data.engine || '-')
                  + ' / 사고유형: ' + escapeHtml(data.accidentType || '-') + '</p>';
            html += renderList('추천 질문', data.suggestedQuestions);
            html += renderChecklist(data.checklist, storageKey);
            html += renderList('필요 서류', data.requiredDocs);
            html += renderList('주의사항', data.cautions);
            html += renderList('키워드 힌트', data.keywordHints);
            panel.innerHTML = html || '<p class="help-empty">도움 정보가 없습니다.</p>';

            // 체크박스 localStorage 바인딩
            panel.querySelectorAll('.help-checklist input[type=checkbox]').forEach(cb => {
                cb.addEventListener('change', () => {
                    const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
                    state[cb.dataset.item] = cb.checked;
                    localStorage.setItem(storageKey, JSON.stringify(state));
                });
            });
        }).catch(err => {
            panel.innerHTML = '<p class="help-empty">도움 정보를 불러오지 못했습니다.</p>';
            console.error('[help-panel]', err);
        });
    }

    const HelpPanel = {
        init: function (cfg) {
            cfg = cfg || {};
            cfg.debounceMs = cfg.debounceMs || 1500;
            const debounced = debounce(() => fetchAndRender(cfg), cfg.debounceMs);

            const ta = document.getElementById(cfg.textareaId);
            if (ta) ta.addEventListener('input', debounced);

            if (cfg.accidentTypeSelectId) {
                const sel = document.getElementById(cfg.accidentTypeSelectId);
                if (sel) sel.addEventListener('change', () => fetchAndRender(cfg));
            }

            // 최초 로딩
            fetchAndRender(cfg);
        }
    };

    global.HelpPanel = HelpPanel;
})(window);
