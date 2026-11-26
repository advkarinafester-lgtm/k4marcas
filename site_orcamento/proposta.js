/* K4 Marcas — lógica da página de proposta (index.html) */
(function () {
  "use strict";
  var CFG = window.K4_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- helpers ----------
  var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function brl(v) { return BRL.format(Math.round(v * 100) / 100); }
  function num(v) { return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v); }
  function fmtDate(iso) {
    if (!iso) return "";
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    return p[2] + "/" + p[1] + "/" + p[0];
  }
  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function decode(str) {
    try {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      while (str.length % 4) str += "=";
      var bin = atob(str);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) { return null; }
  }
  function setF(name, value) { $$('[data-f="' + name + '"]').forEach(function (el) { el.textContent = value; }); }
  function setS(name, value) { $$('[data-s="' + name + '"]').forEach(function (el) { el.textContent = value; }); }
  function plural(n) { return n + (n === 1 ? " classe" : " classes"); }

  // ---------- read proposal data from URL ----------
  // Formato: index.html?p=<base64url(JSON)>  (gerado pelo gerador.html)
  // Também aceita parâmetros simples: ?cliente=&marca=&classes=&plano=&desconto=&validade=&consultor=
  var qs = new URLSearchParams(location.search);
  var data = (qs.get("p") && decode(qs.get("p"))) || {};
  if (!qs.get("p")) {
    data = {
      c: qs.get("cliente") || "", m: qs.get("marca") || "", cl: qs.get("classes"), p: qs.get("plano"),
      d: qs.get("desconto"), v: qs.get("validade"), r: qs.get("consultor"), e: qs.get("emissao"),
      pr: qs.get("prioritario"),
    };
  }

  var CLASSES = Object.keys(CFG.planos[0].parcela).map(Number).filter(function (n) {
    return CFG.planos.every(function (p) { return p.parcela[n] > 0; });
  }).sort(function (a, b) { return a - b; });
  var MAXCL = CLASSES[CLASSES.length - 1];
  var planIds = CFG.planos.map(function (p) { return p.id; });
  var offered = Array.isArray(data.po) && data.po.length ? data.po.filter(function (id) { return planIds.indexOf(id) >= 0; }) : planIds.slice();
  if (!offered.length) offered = planIds.slice();

  var state = {
    cliente: String(data.c || "").trim(),
    marca: String(data.m || "").trim(),
    classes: Math.min(MAXCL, Math.max(1, parseInt(data.cl, 10) || 1)),
    plano: offered.indexOf(data.p) >= 0 ? data.p : (offered.indexOf("intermediario") >= 0 ? "intermediario" : offered[0]),
    recomendado: offered.indexOf(data.p) >= 0 ? data.p : null,
    desconto: Math.min(100, Math.max(0, parseFloat(data.d) || 0)),
    bf: !!(data.bf && CFG.campanha && CFG.campanha.ativa),
    // tipo de proposta: "ecom" (forma 1, e-commerce) ou "geral" (forma 2, outros nichos)
    tipo: data.t === "geral" ? "geral" : "ecom",
    // classes NCL definidas pela equipe no gerador (ex.: [25, 35])
    nc: (Array.isArray(data.nc) ? data.nc : []).map(Number).filter(function (n, i, a) { return n >= 1 && n <= 45 && a.indexOf(n) === i; }).sort(function (a, b) { return a - b; }),
    vig: (CFG.vigilancia && CFG.vigilancia.planos.some(function (v) { return v.id === data.vg; })) ? data.vg : "",
    // vigilância é opcional (como o trâmite prioritário); o gerador pode não oferecê-la
    vigOferta: !(data.vo === 0 || data.vo === "0"),
    // serviços avulsos: ocultos por padrão; aparecem só se o gerador marcar
    avulsos: data.av === 1 || data.av === "1",
    validade: data.v || "",
    emissao: data.e || todayIso(),
    consultor: String(data.r || "").trim(),
    ofertaPrio: data.pr === undefined || data.pr === null ? true : !(data.pr === 0 || data.pr === "0" || data.pr === false),
    prio: data.prOn === 1 || data.prOn === true,
    obs: String(data.o || "").trim(),
  };

  // texto curto do desconto ("Black Friday" ou "20% OFF")
  function offTxt() { return state.bf ? CFG.campanha.nome : num(state.desconto).replace(",00", "") + "% OFF"; }
  function temDesc() { return state.bf || state.desconto > 0; }
  function precoParcela(id, n) { return window.K4_PARCELA(id, n, { bf: state.bf, d: state.desconto }); }
  function plan(id) { return CFG.planos.filter(function (p) { return p.id === id; })[0]; }

  // ---------- static fields ----------
  var ano = new Date().getFullYear();
  setF("ano", String(ano));
  setF("parcelas", String(CFG.parcelas));
  setF("cliente", state.cliente || "—");
  setF("marca", state.marca || "—");
  setF("emissao", fmtDate(state.emissao));
  setF("consultor", state.consultor || "Equipe K4");
  setF("saudacao", state.cliente ? state.cliente + ", esta é a proposta" : "Proposta de registro");
  setF("marcaTitulo", state.marca ? "para a marca " + state.marca : "da sua marca");
  if (state.cliente || state.marca) document.title = "Proposta " + (state.marca || state.cliente) + " | K4 Marcas";

  var C = CFG.contato;
  setF("telefone", C.telefone);
  setF("instagram", "@" + C.instagram.toUpperCase());
  setF("site", C.site.toUpperCase());
  setF("email", C.email.toUpperCase());
  setF("endereco", C.endereco);
  $('[data-href="tel"]').href = "tel:+" + C.whatsapp;
  $('[data-href="ig"]').href = "https://instagram.com/" + C.instagram;
  $('[data-href="site"]').href = "https://" + C.site;
  $('[data-href="mail"]').href = "mailto:" + C.email;

  setF("prioPrazo", CFG.prioritario.prazo);
  setF("prioVagas", CFG.prioritario.proximasVagas);

  // validade
  var vEl = $('[data-f="validade"]');
  var expirada = false;
  if (state.validade) {
    expirada = state.validade < todayIso();
    vEl.hidden = false;
    if (expirada) {
      vEl.classList.add("expired");
      vEl.textContent = "Esta proposta venceu em " + fmtDate(state.validade) + ". Fale com a equipe para atualizar as condições.";
    } else {
      var dias = Math.round((new Date(state.validade + "T23:59:59") - new Date()) / 864e5);
      vEl.textContent = "Condições válidas até " + fmtDate(state.validade) + (dias <= 7 ? " — faltam " + Math.max(dias, 0) + (dias === 1 ? " dia" : " dias") : "") +
        (temDesc() ? " · " + offTxt() + " nos honorários do plano" : "");
    }
  } else if (temDesc()) {
    vEl.hidden = false;
    vEl.textContent = offTxt() + " aplicado nos honorários do plano";
  }

  // classes definidas determinam a quantidade inicial; o cliente pode incluir/remover
  if (state.nc.length > MAXCL) state.nc = state.nc.slice(0, MAXCL);
  state.ncOrig = state.nc.slice();
  var MODO_CLASSES = state.nc.length > 0;
  if (MODO_CLASSES) state.classes = state.nc.length;
  function mesmaLista(a, b) { return a.length === b.length && a.every(function (x, i) { return x === b[i]; }); }
  function alteracoes() {
    return {
      add: state.nc.filter(function (n) { return state.ncOrig.indexOf(n) < 0; }),
      rem: state.ncOrig.filter(function (n) { return state.nc.indexOf(n) < 0; }),
    };
  }
  function setClasses(arr) {
    state.nc = arr.filter(function (n, i, a) { return a.indexOf(n) === i; }).sort(function (a, b) { return a - b; });
    state.classes = state.nc.length;
    render();
  }
  function listaClasses(arr) {
    var l = arr.map(String);
    return l.length > 1 ? l.slice(0, -1).join(", ") + " e " + l[l.length - 1] : l[0] || "";
  }

  // ---------- formato da proposta ----------
  if (state.tipo !== "ecom") { state.ofertaPrio = false; state.prio = false; }
  $$("[data-tipo]").forEach(function (el) { el.hidden = el.getAttribute("data-tipo") !== state.tipo; });
  setF("tipoTxt", state.tipo === "ecom" ? " · E-commerce" : "");
  $("#avulsos").hidden = !state.avulsos;
  // alterna o fundo das seções visíveis
  (function zebra() {
    var secs = $$("body > section").filter(function (sec) { return !sec.hidden && !sec.classList.contains("band") && !sec.classList.contains("final"); });
    secs.forEach(function (sec, i) { if (sec.classList.contains("z")) sec.classList.toggle("alt", i % 2 === 1); });
  })();

  if (!state.ofertaPrio) $("#addon").hidden = true;

  // ---------- class selector ----------
  var seg = $("#classSeg");
  CLASSES.forEach(function (n) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = n;
    b.setAttribute("aria-label", plural(n));
    b.dataset.n = n;
    b.addEventListener("click", function () { state.classes = n; render(); });
    seg.appendChild(b);
  });

  // ---------- plan cards ----------
  var plansEl = $("#plans");
  if (offered.length === 2) plansEl.style.gridTemplateColumns = "repeat(2, 1fr)";
  if (offered.length === 1) plansEl.style.gridTemplateColumns = "minmax(0, 520px)";
  offered.forEach(function (id) {
    var p = plan(id);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "plan";
    btn.setAttribute("role", "radio");
    btn.dataset.id = id;
    var items = CFG.itens.map(function (it) {
      var v = it[id];
      var ok = v !== false;
      var label = typeof v === "string" ? it.nome + ": " + v : it.nome;
      return '<li class="' + (ok ? "ok" : "no") + '"><svg class="ic"><use href="#' + (ok ? "i-check" : "i-x") + '"/></svg><span>' + label + "</span></li>";
    }).join("");
    btn.innerHTML =
      (state.recomendado === id ? '<span class="rec">Recomendado para você</span>' : "") +
      (p.destaque && state.recomendado !== id ? '<span class="ribbon">' + p.destaque + "</span>" : "") +
      '<span class="pname">' + p.nome + "</span>" +
      '<span class="pres">' + p.resumo + "</span>" +
      '<div class="price"><s data-old></s><small>' + CFG.parcelas + "x </small><b data-price></b></div>" +
      '<span class="total" data-total></span>' +
      "<ul>" + items + "</ul>" +
      '<span class="radio"><i></i><span data-pick></span></span>';
    btn.addEventListener("click", function () { state.plano = id; render(); });
    plansEl.appendChild(btn);
  });

  // keyboard nav for radiogroup
  plansEl.addEventListener("keydown", function (e) {
    if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].indexOf(e.key) < 0) return;
    e.preventDefault();
    var i = offered.indexOf(state.plano);
    i = (i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + offered.length) % offered.length;
    state.plano = offered[i];
    render();
    $('.plan[data-id="' + state.plano + '"]').focus();
  });

  // ---------- comparison table ----------
  function renderTable() {
    var head = "<tr><th>Proposta de investimento marca</th>" + offered.map(function (id) {
      var p = plan(id);
      return "<th>" + p.nome + "<small>(" + CFG.parcelas + "x " + num(parcela(id) ) + ")</small></th>";
    }).join("") + "</tr>";
    $("#cmpHead").innerHTML = head;
    $("#cmpBody").innerHTML = CFG.itens.map(function (it) {
      return "<tr><td>" + it.nome + "</td>" + offered.map(function (id) {
        var v = it[id];
        if (v === true) return "<td>Sim</td>";
        if (v === false) return '<td class="neg">Não</td>';
        return '<td class="neg">' + v + "</td>";
      }).join("") + "</tr>";
    }).join("");
  }

  // ---------- progressão de desconto por nº de classes ----------
  function economia(id, n) { var p = plan(id).parcela; return 1 - p[n] / (n * p[1]); }
  function renderProg() {
    $("#progHead").innerHTML = "<tr><th>Nº de classes</th>" + offered.map(function (id) { return "<th>" + plan(id).nome + "</th>"; }).join("") + "</tr>";
    $("#progBody").innerHTML = CLASSES.map(function (n) {
      var sel = n === state.classes;
      return '<tr data-n="' + n + '"' + (sel ? ' class="on" aria-current="true"' : "") + '><td><b>' + plural(n) + "</b>" + (sel ? '<span class="here">sua escolha</span>' : "") + "</td>" +
        offered.map(function (id) {
          var pn = precoParcela(id, n);
          var e = economia(id, n);
          return '<td class="' + (sel && id === state.plano ? "pick" : "") + '"><span class="pv">' + CFG.parcelas + "x " + num(pn) + "</span>" +
            '<span class="pc">' + brl(pn / n) + "/classe" + (e > 0.005 ? ' <em>−' + Math.round(e * 100) + "%</em>" : "") + "</span></td>";
        }).join("") + "</tr>";
    }).join("");
    var best = economia(state.plano, MAXCL);
    var next = CLASSES.filter(function (n) { return n > state.classes; })[0];
    var txt = "Quanto mais classes você protege, menor o valor por classe: até " + Math.round(best * 100) + "% de economia por classe no plano " + plan(state.plano).nome + " (" + MAXCL + " classes).";
    if (next) {
      var add = precoParcela(state.plano, next) - precoParcela(state.plano, state.classes);
      txt += " Incluir a " + next + "ª classe custa só +" + CFG.parcelas + "x " + brl(add) + ".";
    }
    $("#progTip").textContent = txt;
  }
  $("#progBody").addEventListener("click", function (e) {
    var tr = e.target.closest("tr[data-n]");
    if (tr && !MODO_CLASSES) { state.classes = +tr.dataset.n; render(); }
  });

  // ---------- pricing ----------
  function parcelaCheia(id) { return plan(id).parcela[state.classes]; }
  function parcela(id) { return precoParcela(id, state.classes); }
  // Trâmite prioritário: somado aos honorários do plano e parcelado no mesmo nº de parcelas.
  function prioTotal() {
    var v = CFG.prioritario.honorariosPorClasse * state.classes;
    return CFG.prioritario.descontoAplica ? v * (1 - (state.bf ? CFG.campanha.desconto : state.desconto) / 100) : v;
  }

  function calc() {
    var pc = parcelaCheia(state.plano);
    var pd = parcela(state.plano);
    var honorCheio = pc * CFG.parcelas;
    var honor = pd * CFG.parcelas;
    var comPrio = state.ofertaPrio && state.prio;
    var prioHon = comPrio ? prioTotal() : 0;
    var taxaBase = CFG.taxaInpiPorClasse * state.classes;
    var taxaPrio = comPrio ? CFG.prioritario.taxaInpiPorClasse * state.classes : 0;
    var taxa = taxaBase + taxaPrio;
    var parcelaFinal = pd + prioHon / CFG.parcelas;
    return { pc: pc, pd: pd, honorCheio: honorCheio, honor: honor, desc: honorCheio - honor, prioHon: prioHon,
      taxaBase: taxaBase, taxaPrio: taxaPrio, taxa: taxa, parcelaFinal: parcelaFinal, honorTotal: honor + prioHon, total: honor + prioHon + taxa };
  }

  // ---------- WhatsApp ----------
  function waLink(text) { return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text); }

  // ---------- vigilância de marca ----------
  var VIG = CFG.vigilancia;
  function vigPlano(id) { return VIG.planos.filter(function (v) { return v.id === id; })[0]; }
  function vigFaixa(id, n) {
    var fx = vigPlano(id).faixas;
    for (var i = 0; i < fx.length; i++) { if (n <= fx[i].ate) return { valor: fx[i].valor, de: i ? fx[i - 1].ate + 1 : 1, ate: fx[i].ate }; }
    return null; // acima da última faixa: sob consulta
  }
  function faixaTxt(f) { return f.de + " a " + f.ate + " processos"; }

  // conteúdo estático gerado a partir do config.js
  (function staticBlocks() {
    var esc = function (t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
    // classes: o cliente vê somente as classes definidas no gerador
    if (MODO_CLASSES) {
      $("#classSeg").hidden = true;
      $("#clsResumo").hidden = false;
      $(".prog-table").classList.add("static");
      // eventos: remover, desfazer, incluir
      $("#classes").addEventListener("click", function (e) {
        var b = e.target.closest("[data-act]");
        if (!b || b.disabled) return;
        var n = +b.dataset.n;
        if (b.dataset.act === "rm") setClasses(state.nc.filter(function (x) { return x !== n; }));
        if (b.dataset.act === "add") { setClasses(state.nc.concat(n)); $("#nclAddBusca").value = ""; renderAddList(); }
      });
      $("#nclAddBtn").addEventListener("click", function () {
        var p = $("#nclAddPanel");
        p.hidden = !p.hidden;
        this.setAttribute("aria-expanded", String(!p.hidden));
        if (!p.hidden) { renderAddList(); $("#nclAddBusca").focus(); }
      });
      $("#nclAddBusca").addEventListener("input", renderAddList);
    } else {
      $("#classes").hidden = true;
      $("#navClasses").hidden = true;
    }

    $("#avulsosBody").innerHTML = CFG.avulsos.map(function (a) {
      return "<tr><td>" + esc(a.nome) + "</td><td>" + esc(a.inclui) + "</td><td>" + brl(a.valor) + "</td><td>" + esc(a.obs) + "</td></tr>";
    }).join("");
    setF("avulsosValidade", CFG.avulsosValidade + ". Taxas do INPI pagas diretamente ao órgão.");

    $("#vigCond").innerHTML = VIG.condicoes.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");

    if (!state.vigOferta) {
      state.vig = "";
      $("#vigAddon").hidden = true;
      $("#monitoramento").hidden = true;
      $("#navMon").hidden = true;
    }
    state.vigUlt = state.vig || VIG.planos[0].id;
    $("#vigOn").addEventListener("change", function (e) { state.vig = e.target.checked ? state.vigUlt : ""; render(); });
    $("#vigPlans").addEventListener("click", function (e) {
      var b = e.target.closest("[data-vig]");
      if (!b) return;
      var id = b.dataset.vig;
      state.vig = state.vig === id ? "" : id;
      if (state.vig) state.vigUlt = state.vig;
      render();
    });
    var seg = $("#vigSeg");
    VIG.planos.forEach(function (v) {
      var b = document.createElement("button");
      b.type = "button";
      b.dataset.id = v.id;
      b.textContent = v.nome.replace("Vigilância ", "");
      b.addEventListener("click", function () { state.vig = state.vigUlt = v.id; render(); });
      seg.appendChild(b);
    });
  })();

  function renderVig() {
    var n = state.classes;
    $("#vigPlans").innerHTML = VIG.planos.map(function (v) {
      var cur = vigFaixa(v.id, n);
      return '<div class="vig-plan rv in' + (state.vig === v.id ? " on" : "") + '">' +
        (v.destaque ? '<span class="ribbon">' + v.destaque + "</span>" : "") +
        "<h3>" + v.nome + "</h3>" +
        "<ul>" + v.inclui.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" +
        '<div class="tiers"><small>Mensalidade</small>' + v.faixas.map(function (f, i) {
          var de = i ? v.faixas[i - 1].ate + 1 : 1;
          var on = cur && cur.ate === f.ate;
          return '<div class="' + (on ? "cur" : "") + '"><span>' + de + " a " + f.ate + " processos</span><b>" + brl(f.valor) + "</b></div>";
        }).join("") + "</div>" +
        '<button type="button" class="btn sm pick-vig no-print' + (state.vig === v.id ? " on" : " ghost") + '" data-vig="' + v.id + '" aria-pressed="' + (state.vig === v.id) + '">' +
        (state.vig === v.id ? "✓ Incluída na proposta · remover" : "Contratar " + v.nome + (cur ? " · " + brl(cur.valor) + "/mês" : "")) + "</button></div>";
    }).join("");

    $$("#vigSeg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.id === state.vig)); });
    $("#vigOn").checked = !!state.vig;
    $("#vigSeg").hidden = !state.vig;
    var f = state.vig ? vigFaixa(state.vig, n) : null;
    setF("vigProc", plural(n).replace("classe", "processo"));
    setF("vigValor", state.vig ? (f ? brl(f.valor) + "/mês" : "Sob consulta") : "Não incluída");
    var row = $('[data-s-row="vig"]');
    row.hidden = !state.vig;
    if (state.vig) {
      setS("vigLabel", vigPlano(state.vig).nome + " (mensal, à parte)");
      setS("vig", f ? brl(f.valor) + "/mês" : "Sob consulta");
    }
    return state.vig ? { nome: vigPlano(state.vig).nome, valor: f ? f.valor : null } : null;
  }

  // ---------- classes editáveis (modo com classes definidas no gerador) ----------
  function escH(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  function renderClasses() {
    var unica = state.nc.length <= 1;
    $("#nclCards").innerHTML = state.nc.map(function (n) {
      var c = CFG.ncl[n - 1];
      var nova = state.ncOrig.indexOf(n) < 0;
      return '<div class="ncl-card rv in"><span class="num">' + n + "</span><small>Classe " + n + " · " + (n <= 34 ? "Produtos" : "Serviços") +
        (nova ? '<span class="new">Incluída por você</span>' : "") + "</small><h3>" + escH(c.nome) + "</h3><p>" + escH(c.resumo) + "</p>" +
        '<button type="button" class="rm no-print" data-act="rm" data-n="' + n + '"' + (unica ? ' disabled title="A proposta precisa de ao menos 1 classe"' : "") +
        ' aria-label="Remover classe ' + n + '">Remover</button></div>';
    }).join("");
    var rem = alteracoes().rem;
    var box = $("#nclRemoved");
    box.hidden = !rem.length;
    box.innerHTML = rem.length ? "<span>Removidas por você:</span>" + rem.map(function (n) {
      return '<button type="button" data-act="add" data-n="' + n + '"' + (state.nc.length >= MAXCL ? " disabled" : "") + ">Classe " + n + " · desfazer</button>";
    }).join("") : "";
    setF("nclTitulo", state.nc.length === 1 ? "Classe da sua marca" : "Classes da sua marca");
    $("#nclTip").hidden = !(state.nc.indexOf(35) >= 0 && state.nc.some(function (n) { return n <= 34; }));
    $("#nclAddBtn").disabled = state.nc.length >= MAXCL;
    $("#nclAddBtn").textContent = state.nc.length >= MAXCL ? "Limite de " + MAXCL + " classes nesta proposta — fale com a equipe para mais" : "+ Incluir outra classe";
    if (state.nc.length >= MAXCL) $("#nclAddPanel").hidden = true;
    if (!$("#nclAddPanel").hidden) renderAddList();

    var r = calc();
    $("#nclTotal").innerHTML = "<span>Com " + plural(state.nc.length) + " (" + listaClasses(state.nc) + ") no plano " + plan(state.plano).nome + ": <b>" +
      CFG.parcelas + "x " + brl(r.parcelaFinal) + "</b> · total estimado " + brl(r.total) + "</span>" + '<a href="#resumo">Ver resumo →</a>';
    $("#clsResumo").innerHTML = escH(plural(state.nc.length) + ": " + listaClasses(state.nc)) + "<span>alterar</span>";
  }
  function renderAddList() {
    var q = $("#nclAddBusca").value.trim().toLowerCase();
    var itens = CFG.ncl.map(function (c, i) { return { n: i + 1, c: c }; }).filter(function (x) {
      if (state.nc.indexOf(x.n) >= 0) return false;
      return !q || (x.n + " " + x.c.nome + " " + x.c.resumo).toLowerCase().indexOf(q) >= 0;
    });
    $("#nclAddList").innerHTML = itens.length ? itens.map(function (x) {
      return '<button type="button" data-act="add" data-n="' + x.n + '"><b>' + x.n + "</b><span>" + escH(x.c.nome) + "<small>" + escH(x.c.resumo) + "</small></span></button>";
    }).join("") : '<span class="empty">Nenhuma classe encontrada.</span>';
  }

  function render() {
    // segment
    $$("#classSeg button").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.n === state.classes)); });
    // cards
    $$(".plan").forEach(function (el) {
      var id = el.dataset.id;
      var sel = id === state.plano;
      el.setAttribute("aria-checked", String(sel));
      el.tabIndex = sel ? 0 : -1;
      $("[data-price]", el).textContent = num(parcela(id));
      $("[data-old]", el).textContent = temDesc() ? CFG.parcelas + "x " + num(parcelaCheia(id)) : "";
      $("[data-total]", el).textContent = "Total de honorários: " + brl(parcela(id) * CFG.parcelas) +
        (state.ofertaPrio && state.prio ? " · + trâmite prioritário " + CFG.parcelas + "x " + brl(prioTotal() / CFG.parcelas) : "");
      $("[data-pick]", el).textContent = sel ? "Plano selecionado" : "Selecionar este plano";
    });
    renderTable();
    renderProg();
    var vig = renderVig();
    if (MODO_CLASSES) renderClasses();

    var r = calc();
    var p = plan(state.plano);
    var alt = alteracoes();
    var difere = MODO_CLASSES && !mesmaLista(state.nc, state.ncOrig);
    setF("classesTxt", MODO_CLASSES ? plural(state.nc.length) + " (" + listaClasses(state.nc) + ")" : plural(state.classes));
    setF("progDesc", state.bf ? ", já com os preços " + CFG.campanha.nome + " (1 classe: preço fechado; 2 ou mais: " + CFG.campanha.desconto + "% OFF)" : state.desconto ? ", já com " + offTxt() : "");
    setF("planoNome", (state.recomendado ? plan(state.recomendado) : p).nome);
    var minParcela = Math.min.apply(null, offered.map(function (id) { return parcela(id); }));
    setF("aPartir", brl(state.recomendado ? parcela(state.recomendado) : minParcela));

    setF("prioHon", "+ " + CFG.parcelas + "x " + brl(prioTotal() / CFG.parcelas) + " (" + brl(prioTotal()) + ")");
    setF("prioTaxa", brl(CFG.prioritario.taxaInpiPorClasse * state.classes) + " (" + brl(CFG.prioritario.taxaInpiPorClasse) + "/classe)");
    $("#prio").checked = state.prio;

    setS("plano", p.nome);
    setS("classes", plural(state.classes) + (MODO_CLASSES ? " — " + listaClasses(state.nc) : ""));
    $("#nclNote").hidden = !difere;
    if (difere) $("#nclNote").textContent = "Você alterou as classes da proposta original (" + listaClasses(state.ncOrig) + ")" +
      (alt.add.length ? ": incluiu " + listaClasses(alt.add) : "") + (alt.rem.length ? (alt.add.length ? "; removeu " : ": removeu ") + listaClasses(alt.rem) : "") +
      ". Nossa equipe confirmará a viabilidade das novas classes.";
    setS("honor", CFG.parcelas + "x " + brl(r.pc) + " = " + brl(r.honorCheio));
    $('[data-s-row="desc"]').hidden = !temDesc();
    setS("descLabel", "Desconto " + offTxt() + " nos honorários");
    setS("desc", "− " + brl(r.desc));
    $('[data-s-row="prio"]').hidden = !r.prioHon;
    setS("prio", CFG.parcelas + "x " + brl(r.prioHon / CFG.parcelas) + " = " + brl(r.prioHon));
    setS("taxa", brl(r.taxa));
    setS("total", brl(r.total));
    setS("honorTotal", brl(r.honorTotal));
    setS("taxaLabel", r.taxaPrio ? "Taxas INPI: pedido " + brl(r.taxaBase) + " + prioritário " + brl(r.taxaPrio) : "Taxas INPI (pagas ao órgão)");
    $('[data-s="parcelaBig"]').innerHTML = CFG.parcelas + "x " + brl(r.parcelaFinal).replace(/\s/, "&nbsp;") + " <span>/mês</span>";
    setS("parcelaSub", "Plano " + p.nome + (r.prioHon ? " + trâmite prioritário" : "") + " · " + plural(state.classes) +
      (temDesc() ? " · " + offTxt() + " no plano" : "") +
      ". Total de honorários: " + brl(r.honorTotal) + ". Taxas do INPI (" + brl(r.taxa) + ") pagas diretamente ao órgão.");

    var who = state.cliente ? state.cliente : "";
    var linhas = [
      "Olá, equipe K4 Marcas! " + (expirada ? "Recebi a proposta, mas ela venceu. Podemos atualizar as condições?" : "Quero *aceitar a proposta* de registro de marca."),
      "",
      who ? "• Cliente: " + who : null,
      state.marca ? "• Marca: " + state.marca : null,
      "• Proposta: " + (state.tipo === "ecom" ? "E-commerce" : "Outros nichos"),
      "• Plano: " + p.nome,
      "• Classes: " + state.classes + (MODO_CLASSES ? " (" + listaClasses(state.nc) + ")" : ""),
      difere ? "• Alterei as classes da proposta original (" + listaClasses(state.ncOrig) + ")" + (alt.add.length ? " — incluí " + listaClasses(alt.add) : "") + (alt.rem.length ? " — removi " + listaClasses(alt.rem) : "") : null,
      r.prioHon ? "• Trâmite prioritário: sim (incluso no plano)" : null,
      "• Honorários: " + CFG.parcelas + "x " + brl(r.parcelaFinal) + " (total " + brl(r.honorTotal) + ")" + (temDesc() ? " — " + offTxt() + " no plano" : ""),
      vig ? "• " + vig.nome + ": " + (vig.valor ? brl(vig.valor) + "/mês" : "sob consulta") : null,
      "• Taxas INPI estimadas: " + brl(r.taxa) + (r.taxaPrio ? " (pedido " + brl(r.taxaBase) + " + prioritário " + brl(r.taxaPrio) + ")" : ""),
      state.validade ? "• Proposta válida até " + fmtDate(state.validade) : null,
      "",
      "Quais são os próximos passos?",
    ].filter(function (l) { return l !== null; });
    $("#aceitar").href = waLink(linhas.join("\n"));
    $("#aceitar").lastChild.textContent = expirada ? "Solicitar proposta atualizada" : "Aceitar proposta pelo WhatsApp";
    $("#duvida").href = waLink("Olá, equipe K4! Tenho uma dúvida sobre a proposta" + (state.marca ? " da marca " + state.marca : "") + ".");

    $("#fineprint").textContent =
      "Valores de honorários parcelados em " + CFG.parcelas + "x. Taxas federais do INPI de " + brl(CFG.taxaInpiPorClasse) +
      " por classe (valor com desconto legal para MEI, ME e EPP), pagas diretamente ao órgão. " +
      (state.ofertaPrio ? "Trâmite prioritário opcional: honorários de " + brl(CFG.prioritario.honorariosPorClasse) + " por classe, incluídos no plano e parcelados em " + CFG.parcelas + "x; ao contratá-lo, somam-se as duas taxas do INPI (" + brl(CFG.taxaInpiPorClasse) + " do pedido + " + brl(CFG.prioritario.taxaInpiPorClasse) + " do trâmite prioritário, por classe). " : "") +
      "O parecer de viabilidade é válido somente na data da análise, pois pode mudar a qualquer momento." +
      (state.obs ? " Observações: " + state.obs : "");
  }

  $("#prio").addEventListener("change", function (e) { state.prio = e.target.checked; render(); });
  render();

  // ---------- chart ----------
  (function drawChart() {
    var svg = $("#chart");
    var W = 900, H = 380, L = 30, R = 150, T = 50, B = 30;
    var up = [82, 85, 89, 95, 108, 122, 134, 141, 149, 156, 164, 172];
    var down = [82, 85, 80, 74, 77, 71, 73, 67, 70, 64, 67, 60];
    var max = 190, min = 40;
    var x = function (i) { return L + i * (W - L - R) / 11; };
    var y = function (v) { return T + (H - T - B) * (1 - (v - min) / (max - min)); };
    var ns = "http://www.w3.org/2000/svg";
    function el(tag, attrs, text) {
      var e = document.createElementNS(ns, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (text) e.textContent = text;
      svg.appendChild(e);
      return e;
    }
    [60, 100, 140, 180].forEach(function (v) { el("line", { x1: L, x2: W - R + 20, y1: y(v), y2: y(v), stroke: "#2a2730", "stroke-width": 1 }); });
    el("line", { x1: x(3), x2: x(3), y1: T - 30, y2: H - 6, stroke: "#8a8590", "stroke-dasharray": "5 6", "stroke-width": 1.5 });
    el("text", { x: x(3) + 12, y: T - 14, fill: "#a7d9d6", "font-size": 13, "font-family": "Montserrat" }, "registro deferido + Loja Oficial");
    function line(data, color, w) {
      el("polyline", { points: data.map(function (v, i) { return x(i) + "," + y(v); }).join(" "), fill: "none", stroke: color, "stroke-width": w, "stroke-linejoin": "round", "stroke-linecap": "round" });
      data.forEach(function (v, i) { el("circle", { cx: x(i), cy: y(v), r: 6, fill: color }); });
    }
    line(down, "#e0185c", 3);
    line(up, "#bdf3f0", 4);
    el("text", { x: x(11) + 18, y: y(172) + 7, fill: "#bdf3f0", "font-size": 22, "font-weight": 700, "font-family": "Poppins" }, "R$ 172 mil");
    el("text", { x: x(11) + 18, y: y(60) + 7, fill: "#ff4d7d", "font-size": 22, "font-weight": 700, "font-family": "Poppins" }, "R$ 60 mil");
  })();

  // ---------- reveal on scroll ----------
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".rv").forEach(function (el) { io.observe(el); });
  } else {
    $$(".rv").forEach(function (el) { el.classList.add("in"); });
  }
  window.addEventListener("beforeprint", function () { $$(".rv").forEach(function (el) { el.classList.add("in"); }); });

  // floating CTA on mobile — hide when summary is visible
  var fc = $("#floatCta");
  var inv = $("#investimento");
  function toggleFloat() {
    var r = inv.getBoundingClientRect();
    var visible = r.top < window.innerHeight && r.bottom > 0;
    fc.classList.toggle("show", window.scrollY > 500 && !visible);
  }
  window.addEventListener("scroll", toggleFloat, { passive: true });
  toggleFloat();
})();
