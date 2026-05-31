/* ============================================================
   THE CELLAR FILES — image slot store
   A lightweight drag-and-drop image store. Each slot has an id;
   its image (a data URL) persists in localStorage. Any number of
   DOM elements can bind to the same id and they all mirror it.
   ============================================================ */

window.Slots = (function () {
  var NS = "cellarfiles:slot:";
  var data = {};                 // id -> dataURL | null
  var bindings = new Map();      // id -> Set(element)
  var fileInput = null;

  function get(id) {
    if (!(id in data)) {
      try { data[id] = localStorage.getItem(NS + id) || null; }
      catch (e) { data[id] = null; }
    }
    return data[id];
  }

  function set(id, url) {
    data[id] = url;
    try { localStorage.setItem(NS + id, url); } catch (e) {}
    render(id);
  }

  function clear(id) {
    data[id] = null;
    try { localStorage.removeItem(NS + id); } catch (e) {}
    render(id);
  }

  function paint(el) {
    var id = el.__slotId;
    var url = get(id);
    var img = el.querySelector(".slot-img");
    if (url) {
      if (img) img.style.backgroundImage = 'url("' + url + '")';
      el.classList.add("has-img");
      return;
    }
    // No user upload — try the default art manifest (auto-load real PNG if present).
    if (img) img.style.backgroundImage = "none";
    el.classList.remove("has-img", "from-manifest");
    var man = window.ART_MANIFEST && window.ART_MANIFEST[id];
    if (man) {
      var probe = new Image();
      probe.onload = function () {
        // user may have uploaded in the meantime; don't clobber
        if (get(el.__slotId) || el.__slotId !== id) return;
        if (img) img.style.backgroundImage = 'url("' + man + '")';
        el.classList.add("has-img", "from-manifest");
      };
      probe.onerror = function () { /* PNG not added yet — keep polished placeholder */ };
      probe.src = man;
    }
  }

  function render(id) {
    var s = bindings.get(id);
    if (s) s.forEach(paint);
  }

  function unbindAll(el) {
    bindings.forEach(function (s) { s.delete(el); });
  }

  // bind an element to a slot id (rebinding moves it)
  function bind(el, id) {
    unbindAll(el);
    el.__slotId = id;
    if (!bindings.has(id)) bindings.set(id, new Set());
    bindings.get(id).add(el);
    wire(el);
    paint(el);
  }

  function readFile(file, id) {
    if (!file || !/^image\//.test(file.type)) return;
    var r = new FileReader();
    r.onload = function () { set(id, r.result); };
    r.readAsDataURL(file);
  }

  function pick(id) {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.style.display = "none";
      document.body.appendChild(fileInput);
    }
    fileInput.onchange = function () {
      var f = fileInput.files && fileInput.files[0];
      if (f) readFile(f, fileInput.__targetId);
      fileInput.value = "";
    };
    fileInput.__targetId = id;
    fileInput.click();
  }

  function wire(el) {
    if (el.__wired) return;
    el.__wired = true;

    el.addEventListener("dragover", function (e) {
      e.preventDefault();
      el.classList.add("drag");
    });
    el.addEventListener("dragleave", function () { el.classList.remove("drag"); });
    el.addEventListener("drop", function (e) {
      e.preventDefault();
      el.classList.remove("drag");
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) readFile(f, el.__slotId);
    });
    el.addEventListener("click", function (e) {
      if (e.target.closest(".slot-clear")) {
        e.stopPropagation();
        clear(el.__slotId);
        return;
      }
      pick(el.__slotId);
    });
  }

  // Build a slot DOM node. caption shows on the placeholder.
  function create(id, caption, hint) {
    var el = document.createElement("div");
    el.className = "slot";
    el.innerHTML =
      '<div class="slot-img"></div>' +
      '<div class="slot-ph">' +
        '<span class="drop-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v10"/><path d="M7 11l5 5 5-5"/><path d="M5 19h14"/></svg></span>' +
        '<span class="slot-cap">' + (caption || "") + "</span>" +
        (hint ? '<span class="slot-hint">' + hint + "</span>" : "") +
      "</div>" +
      '<button class="slot-clear" title="Remove image">&times;</button>';
    bind(el, id);
    return el;
  }

  return { get: get, set: set, clear: clear, bind: bind, create: create, render: render };
})();
