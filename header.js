// header.js
// Dynamically loads the header component and applies page-specific styling.
//
// Uses the same reliable injection pattern as footer.js:
// Parse HTML in temp div -> style to <head> -> element to DOM.

fetch('header.html?v=' + new Date().getTime())
  .then(function(r) {
    if (!r.ok) throw new Error('Header fetch failed: ' + r.status);
    return r.text();
  })
  .then(function(headerHtml) {
    // Step 1: Parse in temp container
    var temp = document.createElement('div');
    temp.innerHTML = headerHtml;

    // Step 2: Move <style> to <head>
    var styleTag = temp.querySelector('style');
    if (styleTag) {
      document.head.appendChild(styleTag);
    }

    // Step 3: Extract the <nav>, drawer, and scripts from header.html
    var hdrContainer = document.getElementById('header-container');
    if (!hdrContainer) return;
    var insertAfter = hdrContainer;

    // Inject all relevant nodes: style already moved, now do nav + drawer + scripts
    var nodesToInject = [];
    temp.childNodes.forEach(function(node) {
      if (node.nodeType === 1 && node.tagName !== 'STYLE') {
        nodesToInject.push(node.cloneNode(true));
      }
    });

    // Replace the placeholder with the first node, then insert the rest after
    if (nodesToInject.length > 0) {
      hdrContainer.parentNode.replaceChild(nodesToInject[0], hdrContainer);
      insertAfter = nodesToInject[0];
      for (var i = 1; i < nodesToInject.length; i++) {
        var node = nodesToInject[i];
        // Re-run scripts by creating a fresh script element
        if (node.tagName === 'SCRIPT') {
          var sc = document.createElement('script');
          sc.textContent = node.textContent;
          insertAfter.parentNode.insertBefore(sc, insertAfter.nextSibling);
          insertAfter = sc;
        } else {
          insertAfter.parentNode.insertBefore(node, insertAfter.nextSibling);
          insertAfter = node;
        }
      }
    }

    // Step 5: Apply universal scroll styling matching services.html
    var nav = document.getElementById('nav');
    if (!nav) return;

    // Force position:fixed via inline style — this cannot be overridden by any page CSS
    nav.style.cssText += '; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 9999 !important;';

    // Rewrite hash links for smooth scroll if on index page
    var path = window.location.pathname.toLowerCase();
    var isIndex = !path.includes('contact') && !path.includes('gallery') && !path.includes('services');
    
    if (isIndex) {
      var links = nav.querySelectorAll('.nav-ul a');
      links.forEach(function(l) {
        var href = l.getAttribute('href');
        if (href && href.startsWith('index.html#')) {
          l.setAttribute('href', href.replace('index.html', ''));
        }
      });
    }

    // Set active link colors based on current page
    var currentLinks = nav.querySelectorAll('.nav-ul a');
    currentLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (path.includes('contact') && href.includes('contact')) {
        link.classList.add('act');
      }
      if (path.includes('gallery') && href.includes('gallery')) {
        link.classList.add('act');
      }
      if (path.includes('services') && href.includes('services')) {
        link.classList.add('act');
      }
    });

    // Handle scroll — always stay visible, just add shadow when scrolled
    window.addEventListener('scroll', function() {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });

    // Handle Mobile Drawer Toggle
    var menu = document.getElementById('navMenu');
    var drawer = document.getElementById('nav-drawer');
    if (menu && drawer) {
      menu.addEventListener('click', function() {
        var isOpen = drawer.classList.toggle('open');
        menu.classList.toggle('open', isOpen);
      });

      // Close drawer on link click
      drawer.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          drawer.classList.remove('open');
          menu.classList.remove('open');
        });
      });

      // Close drawer on outside click
      document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !drawer.contains(e.target)) {
          drawer.classList.remove('open');
          menu.classList.remove('open');
        }
      });
    }

  })
  .catch(function(err) {
    console.error('header.js:', err);
  });
