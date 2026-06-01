// footer.js
// Dynamically loads the footer component and injects it into the page.

fetch('footer.html?v=' + new Date().getTime())
  .then(function(r) {
    if (!r.ok) throw new Error('Footer fetch failed: ' + r.status);
    return r.text();
  })
  .then(function(footerHtml) {
    var temp = document.createElement('div');
    temp.innerHTML = footerHtml;

    var footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    // Append any links/styles to <head>
    var styles = temp.querySelectorAll('link[rel="stylesheet"], style');
    styles.forEach(function(s) {
      document.head.appendChild(s.cloneNode(true));
    });

    // Extract the footer and replace the container
    var footerEl = temp.querySelector('footer');
    if (footerEl) {
      footerContainer.parentNode.replaceChild(footerEl, footerContainer);
    }
  })
  .catch(function(err) {
    console.error('footer.js error:', err);
  });
