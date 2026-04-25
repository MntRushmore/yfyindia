/* ═══════════════════════════════════════════════
   Mobile Toast — show once per session on mobile
   ═══════════════════════════════════════════════ */
(function () {
  // Only run on mobile-width screens
  if (window.innerWidth > 768) return;

  // Only show once per session
  if (sessionStorage.getItem('mobile_toast_shown')) return;
  sessionStorage.setItem('mobile_toast_shown', '1');

  // Create toast HTML
  var toast = document.createElement('div');
  toast.className = 'mobile-toast';
  toast.id = 'mobile-toast';
  toast.innerHTML =
    '<div class="mobile-toast-icon">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>' +
        '<line x1="8" y1="21" x2="16" y2="21"/>' +
        '<line x1="12" y1="17" x2="12" y2="21"/>' +
      '</svg>' +
    '</div>' +
    '<span class="mobile-toast-text">For better experience visit from a desktop or laptop!</span>' +
    '<button class="mobile-toast-close" id="mobile-toast-close" aria-label="Close">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="18" y1="6" x2="6" y2="18"/>' +
        '<line x1="6" y1="6" x2="18" y2="18"/>' +
      '</svg>' +
    '</button>' +
    '<div class="mobile-toast-progress"></div>';

  document.body.appendChild(toast);

  // Slide in after a short delay so the page loads first
  setTimeout(function () {
    toast.classList.add('show');
  }, 600);

  // Auto dismiss after 5 seconds (from when it appears)
  var autoDismiss = setTimeout(function () {
    dismissToast();
  }, 5600);

  // Close button
  document.getElementById('mobile-toast-close').addEventListener('click', function () {
    clearTimeout(autoDismiss);
    dismissToast();
  });

  function dismissToast() {
    toast.classList.remove('show');
    toast.classList.add('hide');
    // Remove from DOM after animation
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 500);
  }
})();
