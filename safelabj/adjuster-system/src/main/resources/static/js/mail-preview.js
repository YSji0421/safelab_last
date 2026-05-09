// 이메일 미리보기 + 발송 모달
// 사용: MailPreview.open(consultationId)

(function (global) {
    function ensureModal() {
        let modal = document.getElementById('mail-preview-modal');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'mail-preview-modal';
        modal.innerHTML = `
          <div class="mp-backdrop"></div>
          <div class="mp-dialog">
            <div class="mp-header">
              <h3>상담 요약 이메일 - 미리보기 / 발송</h3>
              <button type="button" class="mp-close">&times;</button>
            </div>
            <div class="mp-body">
              <div class="mp-row">
                <label>수신자</label>
                <input id="mp-to" type="email" placeholder="customer@example.com"/>
              </div>
              <div class="mp-row">
                <label>제목</label>
                <input id="mp-subject" type="text"/>
              </div>
              <div class="mp-row">
                <label>본문 미리보기</label>
                <iframe id="mp-iframe" style="width:100%; height:320px; border:1px solid #ddd;"></iframe>
              </div>
              <div class="mp-row" style="display:none;">
                <textarea id="mp-body"></textarea>
              </div>
              <div class="mp-msg" id="mp-msg"></div>
            </div>
            <div class="mp-footer">
              <button type="button" class="btn btn-secondary mp-close">취소</button>
              <button type="button" class="btn btn-primary" id="mp-send">발송 (mock)</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.textContent = `
          #mail-preview-modal { display:none; position:fixed; inset:0; z-index:9999; }
          #mail-preview-modal.open { display:block; }
          .mp-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.5); }
          .mp-dialog { position:relative; background:#fff; width:640px; max-width:95%; margin:5% auto;
                       border-radius:6px; box-shadow:0 10px 30px rgba(0,0,0,0.3); display:flex;
                       flex-direction:column; max-height:90vh; }
          .mp-header { padding:14px 20px; border-bottom:1px solid #eee; display:flex;
                       justify-content:space-between; align-items:center; }
          .mp-header h3 { margin:0; font-size:1.1em; }
          .mp-close { background:none; border:none; font-size:1.6em; cursor:pointer; color:#666; }
          .mp-body { padding:16px 20px; overflow-y:auto; }
          .mp-row { margin-bottom:12px; }
          .mp-row label { display:block; font-size:0.9em; color:#333; margin-bottom:4px; font-weight:600; }
          .mp-row input { width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; }
          .mp-msg { padding:8px 12px; border-radius:4px; font-size:0.9em; display:none; }
          .mp-msg.error { display:block; background:#fff3f3; color:#c92a2a; border:1px solid #ffa8a8; }
          .mp-msg.success { display:block; background:#ebfbee; color:#2b8a3e; border:1px solid #8ce99a; }
          .mp-footer { padding:12px 20px; border-top:1px solid #eee; text-align:right; }
          .mp-footer .btn { margin-left:6px; }
        `;
        document.head.appendChild(style);

        // 이벤트 바인딩
        modal.querySelectorAll('.mp-close').forEach(b => b.addEventListener('click', close));
        modal.querySelector('.mp-backdrop').addEventListener('click', close);
        modal.querySelector('#mp-send').addEventListener('click', send);
        return modal;
    }

    let currentConsultationId = null;
    let currentCaseId = null;

    function open(consultationId) {
        currentConsultationId = consultationId;
        const modal = ensureModal();
        const msg = modal.querySelector('#mp-msg');
        msg.className = 'mp-msg';
        msg.textContent = '';
        modal.classList.add('open');

        fetch('/api/consultations/' + consultationId + '/mail/preview')
          .then(r => r.json())
          .then(data => {
              currentCaseId = data.caseId;
              modal.querySelector('#mp-to').value = data.to || '';
              modal.querySelector('#mp-subject').value = data.subject || '';
              modal.querySelector('#mp-body').value = data.bodyHtml || '';
              const iframe = modal.querySelector('#mp-iframe');
              iframe.srcdoc = data.bodyHtml || '';
          })
          .catch(err => {
              msg.className = 'mp-msg error';
              msg.textContent = '미리보기 로드 실패: ' + err.message;
          });
    }

    function close() {
        const modal = document.getElementById('mail-preview-modal');
        if (modal) modal.classList.remove('open');
    }

    function send() {
        const modal = document.getElementById('mail-preview-modal');
        const to = modal.querySelector('#mp-to').value.trim();
        const subject = modal.querySelector('#mp-subject').value.trim();
        const bodyHtml = modal.querySelector('#mp-body').value;
        const msg = modal.querySelector('#mp-msg');
        msg.className = 'mp-msg';
        msg.textContent = '';

        if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
            msg.className = 'mp-msg error';
            msg.textContent = '올바른 이메일 주소를 입력하세요.';
            return;
        }
        if (!subject) {
            msg.className = 'mp-msg error';
            msg.textContent = '제목을 입력하세요.';
            return;
        }

        fetch('/api/consultations/' + currentConsultationId + '/mail/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                consultationId: currentConsultationId,
                caseId: currentCaseId,
                to: to, subject: subject, bodyHtml: bodyHtml
            })
        }).then(r => r.json()).then(data => {
            if (data.success) {
                msg.className = 'mp-msg success';
                msg.textContent = '발송 완료 (상태: ' + data.status + ', logId=' + data.logId + ')';
                setTimeout(close, 1500);
            } else {
                msg.className = 'mp-msg error';
                msg.textContent = '발송 실패';
            }
        }).catch(err => {
            msg.className = 'mp-msg error';
            msg.textContent = '발송 중 오류: ' + err.message;
        });
    }

    global.MailPreview = { open };
})(window);
