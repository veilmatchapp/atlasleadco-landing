// Forms post to Web3Forms. Success is shown only when Web3Forms confirms receipt.
(function () {
  var C = window.ATLAS_CONFIG || {};
  var fallback = C.contactEmail ? ' You can email ' + C.contactEmail + ' instead.' : '';
  document.querySelectorAll('form[data-form]').forEach(function (f) {
    var status = f.querySelector('.form-status'), btn = f.querySelector('button[type=submit]');
    function say(text, isErr) { status.hidden = false; status.className = 'form-status' + (isErr ? ' err' : ''); status.textContent = text; }
    if (!C.web3formsKey) { btn.disabled = true; say('This form is not connected yet.' + (fallback || ' Please check back soon.'), true); return; }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var data = new FormData(f);
      data.append('access_key', C.web3formsKey);
      data.append('subject', f.getAttribute('data-subject'));
      data.append('from_name', 'Atlas site');
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); say('Sending...', false);
      fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { Accept: 'application/json' }, body: data })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && res.j && res.j.success === true) { f.reset(); say('Thank you. Your request was received. Atlas will reply by email.', false); }
          else { say('Your request was not sent.' + fallback, true); }
        })
        .catch(function () { say('Your request was not sent. Check your connection and try again.' + fallback, true); })
        .then(function () { btn.disabled = false; btn.removeAttribute('aria-busy'); });
    });
  });
})();
