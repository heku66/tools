(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "className") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v !== undefined && v !== null) node.setAttribute(k, v);
    }
    for (const child of [].concat(children)) {
      if (child == null || child === false) continue;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    }
    return node;
  };

  const copyText = async (text, statusEl) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(statusEl, "已复制", "ok");
    } catch {
      setStatus(statusEl, "复制失败，请手动选择", "err");
    }
  };

  const setStatus = (node, msg, kind = "") => {
    if (!node) return;
    node.textContent = msg || "";
    node.className = `status${kind ? ` ${kind}` : ""}`;
  };

  const field = (labelText, control, hint) =>
    el("div", { className: "field" }, [
      el("label", { className: "label", text: labelText }),
      control,
      hint ? el("p", { className: "hint", text: hint }) : null,
    ]);

  const textarea = (id, placeholder = "", value = "") =>
    el("textarea", { id, placeholder, spellcheck: "false" }, value ? [value] : []);

  const actions = (...btns) => el("div", { className: "row" }, btns);

  // --- MD5 (compact, public domain style implementation) ---
  function md5(str) {
    function cmn(q, a, b, x, s, t) {
      a = (a + q + x + t) | 0;
      return (((a << s) | (a >>> (32 - s))) + b) | 0;
    }
    function ff(a, b, c, d, x, s, t) {
      return cmn((b & c) | (~b & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
      return cmn((b & d) | (c & ~d), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | ~d), a, b, x, s, t);
    }
    function md5cycle(x, k) {
      let [a, b, c, d] = x;
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = (a + x[0]) | 0;
      x[1] = (b + x[1]) | 0;
      x[2] = (c + x[2]) | 0;
      x[3] = (d + x[3]) | 0;
    }
    function md5blk(s) {
      const md5blks = [];
      for (let i = 0; i < 64; i += 4) {
        md5blks[i >> 2] =
          s.charCodeAt(i) +
          (s.charCodeAt(i + 1) << 8) +
          (s.charCodeAt(i + 2) << 16) +
          (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }
    function md51(s) {
      const n = s.length;
      const state = [1732584193, -271733879, -1732584194, 271733878];
      let i;
      for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
      s = s.substring(i - 64);
      const tail = Array(16).fill(0);
      for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
      tail[i >> 2] |= 0x80 << (i % 4 << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }
    function rhex(n) {
      const hex = "0123456789abcdef";
      let s = "";
      for (let j = 0; j < 4; j++) s += hex.charAt((n >> (j * 8 + 4)) & 0x0f) + hex.charAt((n >> (j * 8)) & 0x0f);
      return s;
    }
    function hex(x) {
      return x.map(rhex).join("");
    }
    const utf8 = unescape(encodeURIComponent(str));
    return hex(md51(utf8));
  }

  async function sha256(str) {
    const data = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function uuidv4() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const h = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }

  function b64Encode(text) {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
  }

  function b64Decode(text) {
    const cleaned = text.replace(/\s+/g, "");
    const bin = atob(cleaned);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function b64urlToJson(part) {
    const pad = "=".repeat((4 - (part.length % 4)) % 4);
    const b64 = (part + pad).replace(/-/g, "+").replace(/_/g, "/");
    const json = b64Decode(b64);
    return JSON.parse(json);
  }

  function lineDiff(a, b) {
    const A = a.split("\n");
    const B = b.split("\n");
    const n = A.length;
    const m = B.length;
    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const out = [];
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (A[i] === B[j]) {
        out.push({ type: "same", text: A[i] });
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        out.push({ type: "del", text: A[i++] });
      } else {
        out.push({ type: "add", text: B[j++] });
      }
    }
    while (i < n) out.push({ type: "del", text: A[i++] });
    while (j < m) out.push({ type: "add", text: B[j++] });
    return out;
  }

  // --- Cron (5-field) ---
  function parseCronField(field, min, max) {
    const values = new Set();
    for (const part of field.split(",")) {
      const stepMatch = part.match(/^(.*?)\/(\d+)$/);
      const step = stepMatch ? Number(stepMatch[2]) : 1;
      const rangePart = stepMatch ? stepMatch[1] : part;
      let start;
      let end;
      if (rangePart === "*") {
        start = min;
        end = max;
      } else if (rangePart.includes("-")) {
        const [a, b] = rangePart.split("-").map(Number);
        start = a;
        end = b;
      } else {
        start = end = Number(rangePart);
      }
      if ([start, end, step].some((x) => Number.isNaN(x))) throw new Error(`非法字段: ${field}`);
      for (let v = start; v <= end; v += step) {
        if (v >= min && v <= max) values.add(v);
      }
    }
    return [...values].sort((a, b) => a - b);
  }

  function parseCron(expr) {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) throw new Error("需要 5 段：分 时 日 月 周");
    const [minute, hour, day, month, weekday] = parts;
    return {
      minute: parseCronField(minute, 0, 59),
      hour: parseCronField(hour, 0, 23),
      day: parseCronField(day, 1, 31),
      month: parseCronField(month, 1, 12),
      weekday: parseCronField(weekday, 0, 6),
    };
  }

  function cronMatches(parsed, date) {
    const dow = date.getDay();
    return (
      parsed.minute.includes(date.getMinutes()) &&
      parsed.hour.includes(date.getHours()) &&
      parsed.day.includes(date.getDate()) &&
      parsed.month.includes(date.getMonth() + 1) &&
      parsed.weekday.includes(dow)
    );
  }

  function nextCronRuns(expr, count = 8) {
    const parsed = parseCron(expr);
    const out = [];
    const d = new Date();
    d.setSeconds(0, 0);
    d.setMinutes(d.getMinutes() + 1);
    let guard = 0;
    while (out.length < count && guard < 366 * 24 * 60) {
      if (cronMatches(parsed, d)) out.push(new Date(d));
      d.setMinutes(d.getMinutes() + 1);
      guard++;
    }
    return out;
  }

  function describeCron(expr) {
    const p = parseCron(expr);
    const fmt = (arr, allLabel) => (arr.length > 12 ? `${arr.slice(0, 8).join(",")}…` : arr.join(",") || allLabel);
    return [
      `分: ${fmt(p.minute, "*")}`,
      `时: ${fmt(p.hour, "*")}`,
      `日: ${fmt(p.day, "*")}`,
      `月: ${fmt(p.month, "*")}`,
      `周: ${fmt(p.weekday, "*")} (0=周日)`,
    ].join("\n");
  }

  const tools = [
    {
      id: "json",
      name: "JSON 格式化",
      kbd: "01",
      desc: "格式化、压缩，并校验 JSON 是否合法。",
      render(root) {
        const input = textarea("json-in", '{"hello":"world"}');
        const output = el("div", { className: "output-box", id: "json-out" });
        const status = el("div", { className: "status" });
        const run = (pretty) => {
          try {
            const obj = JSON.parse(input.value);
            const text = pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
            output.textContent = text;
            setStatus(status, pretty ? "已格式化" : "已压缩", "ok");
          } catch (e) {
            output.textContent = "";
            setStatus(status, e.message, "err");
          }
        };
        root.append(
          el("div", { className: "tool-grid" }, [
            field("输入", input),
            actions(
              el("button", { className: "btn", type: "button", text: "格式化", onClick: () => run(true) }),
              el("button", { className: "btn secondary", type: "button", text: "压缩", onClick: () => run(false) }),
              el("button", {
                className: "ghost-btn",
                type: "button",
                text: "复制结果",
                onClick: () => copyText(output.textContent, status),
              })
            ),
            status,
            field("输出", output),
          ])
        );
        root._clear = () => {
          input.value = "";
          output.textContent = "";
          setStatus(status, "");
        };
      },
    },
    {
      id: "base64",
      name: "Base64 编码/解码",
      kbd: "02",
      desc: "支持 UTF-8 文本的 Base64 编解码。",
      render(root) {
        const input = textarea("b64-in", "你好，世界");
        const output = el("div", { className: "output-box" });
        const status = el("div", { className: "status" });
        root.append(
          el("div", { className: "tool-grid" }, [
            field("输入", input),
            actions(
              el("button", {
                className: "btn",
                type: "button",
                text: "编码",
                onClick: () => {
                  try {
                    output.textContent = b64Encode(input.value);
                    setStatus(status, "编码完成", "ok");
                  } catch (e) {
                    setStatus(status, e.message, "err");
                  }
                },
              }),
              el("button", {
                className: "btn secondary",
                type: "button",
                text: "解码",
                onClick: () => {
                  try {
                    output.textContent = b64Decode(input.value);
                    setStatus(status, "解码完成", "ok");
                  } catch {
                    setStatus(status, "不是合法的 Base64", "err");
                  }
                },
              }),
              el("button", {
                className: "ghost-btn",
                type: "button",
                text: "复制结果",
                onClick: () => copyText(output.textContent, status),
              })
            ),
            status,
            field("输出", output),
          ])
        );
        root._clear = () => {
          input.value = "";
          output.textContent = "";
          setStatus(status, "");
        };
      },
    },
    {
      id: "url",
      name: "URL 编码/解码",
      kbd: "03",
      desc: "对查询参数或整段文本做 encodeURIComponent / decode。",
      render(root) {
        const input = textarea("url-in", "a=1&name=你好");
        const output = el("div", { className: "output-box" });
        const status = el("div", { className: "status" });
        root.append(
          el("div", { className: "tool-grid" }, [
            field("输入", input),
            actions(
              el("button", {
                className: "btn",
                type: "button",
                text: "编码",
                onClick: () => {
                  output.textContent = encodeURIComponent(input.value);
                  setStatus(status, "编码完成", "ok");
                },
              }),
              el("button", {
                className: "btn secondary",
                type: "button",
                text: "解码",
                onClick: () => {
                  try {
                    output.textContent = decodeURIComponent(input.value.replace(/\+/g, " "));
                    setStatus(status, "解码完成", "ok");
                  } catch {
                    setStatus(status, "解码失败", "err");
                  }
                },
              }),
              el("button", {
                className: "ghost-btn",
                type: "button",
                text: "复制结果",
                onClick: () => copyText(output.textContent, status),
              })
            ),
            status,
            field("输出", output),
          ])
        );
        root._clear = () => {
          input.value = "";
          output.textContent = "";
          setStatus(status, "");
        };
      },
    },
    {
      id: "uuid",
      name: "UUID 生成",
      kbd: "04",
      desc: "生成 UUID v4，可批量输出。",
      render(root) {
        const count = el("input", { type: "number", id: "uuid-count", value: "5", min: "1", max: "100" });
        const output = el("div", { className: "output-box" });
        const status = el("div", { className: "status" });
        const gen = () => {
          const n = Math.min(100, Math.max(1, Number(count.value) || 1));
          const list = Array.from({ length: n }, () => uuidv4());
          output.textContent = list.join("\n");
          setStatus(status, `已生成 ${n} 个`, "ok");
        };
        root.append(
          el("div", { className: "tool-grid" }, [
            field("数量 (1–100)", count),
            actions(
              el("button", { className: "btn", type: "button", text: "生成", onClick: gen }),
              el("button", {
                className: "ghost-btn",
                type: "button",
                text: "复制",
                onClick: () => copyText(output.textContent, status),
              })
            ),
            status,
            field("结果", output),
          ])
        );
        gen();
        root._clear = () => {
          count.value = "5";
          output.textContent = "";
          setStatus(status, "");
        };
      },
    },
    {
      id: "timestamp",
      name: "时间戳转换",
      kbd: "05",
      desc: "秒/毫秒时间戳与本地时间互相转换。",
      render(root) {
        const tsInput = el("input", { type: "text", id: "ts-in", placeholder: "1710000000 或 1710000000000" });
        const dtInput = el("input", { type: "datetime-local", id: "dt-in", step: "1" });
        const output = el("div", { className: "output-box" });
        const status = el("div", { className: "status" });
        const nowBtn = () => {
          const now = Date.now();
          tsInput.value = String(Math.floor(now / 1000));
          const local = new Date(now - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19);
          dtInput.value = local;
          output.textContent = [
            `现在 (ms): ${now}`,
            `现在 (s):  ${Math.floor(now / 1000)}`,
            `本地:      ${new Date(now).toLocaleString()}`,
            `ISO:       ${new Date(now).toISOString()}`,
          ].join("\n");
          setStatus(status, "已填入当前时间", "ok");
        };
        const fromTs = () => {
          const raw = tsInput.value.trim();
          if (!/^-?\d+$/.test(raw)) return setStatus(status, "请输入数字时间戳", "err");
          let n = Number(raw);
          if (Math.abs(n) < 1e12) n *= 1000;
          const d = new Date(n);
          if (Number.isNaN(d.getTime())) return setStatus(status, "无效时间戳", "err");
          const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
          dtInput.value = local;
          output.textContent = [
            `本地: ${d.toLocaleString()}`,
            `ISO:  ${d.toISOString()}`,
            `ms:   ${d.getTime()}`,
            `s:    ${Math.floor(d.getTime() / 1000)}`,
          ].join("\n");
          setStatus(status, "时间戳 → 时间", "ok");
        };
        const fromDt = () => {
          if (!dtInput.value) return setStatus(status, "请选择时间", "err");
          const d = new Date(dtInput.value);
          if (Number.isNaN(d.getTime())) return setStatus(status, "无效时间", "err");
          tsInput.value = String(Math.floor(d.getTime() / 1000));
          output.textContent = [
            `本地: ${d.toLocaleString()}`,
            `ISO:  ${d.toISOString()}`,
            `ms:   ${d.getTime()}`,
            `s:    ${Math.floor(d.getTime() / 1000)}`,
          ].join("\n");
          setStatus(status, "时间 → 时间戳", "ok");
        };
        root.append(
          el("div", { className: "tool-grid two" }, [
            field("时间戳", tsInput),
            field("本地时间", dtInput),
          ]),
          actions(
            el("button", { className: "btn", type: "button", text: "现在", onClick: nowBtn }),
            el("button", { className: "btn secondary", type: "button", text: "戳 → 时间", onClick: fromTs }),
            el("button", { className: "btn secondary", type: "button", text: "时间 → 戳", onClick: fromDt }),
            el("button", {
              className: "ghost-btn",
              type: "button",
              text: "复制",
              onClick: () => copyText(output.textContent, status),
            })
          ),
          status,
          field("结果", output)
        );
        nowBtn();
        root._clear = () => {
          tsInput.value = "";
          dtInput.value = "";
          output.textContent = "";
          setStatus(status, "");
        };
      },
    },
    {
      id: "hash",
      name: "MD5 / SHA256",
      kbd: "06",
      desc: "对文本计算 MD5 与 SHA-256（本地计算，不上传）。",
      render(root) {
        const input = textarea("hash-in", "hello");
        const output = el("div", { className: "output-box" });
        const status = el("div", { className: "status" });
        const run = async () => {
          try {
            const text = input.value;
            const m = md5(text);
            const s = await sha256(text);
            output.textContent = `MD5:    ${m}\nSHA256: ${s}`;
            setStatus(status, "计算完成", "ok");
          } catch (e) {
            setStatus(status, e.message, "err");
          }
        };
        root.append(
          el("div", { className: "tool-grid" }, [
            field("输入文本", input),
            actions(
              el("button", { className: "btn", type: "button", text: "计算", onClick: run }),
              el("button", {
                className: "ghost-btn",
                type: "button",
                text: "复制",
                onClick: () => copyText(output.textContent, status),
              })
            ),
            status,
            field("结果", output),
          ])
        );
        run();
        root._clear = () => {
          input.value = "";
          output.textContent = "";
          setStatus(status, "");
        };
      },
    },
    {
      id: "jwt",
      name: "JWT 解析",
      kbd: "07",
      desc: "解码 Header / Payload（不校验签名）。",
      render(root) {
        const sample =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        const input = textarea("jwt-in", sample);
        const out = el("div", { className: "tool-grid" });
        const status = el("div", { className: "status" });
        const run = () => {
          out.innerHTML = "";
          try {
            const parts = input.value.trim().split(".");
            if (parts.length < 2) throw new Error("JWT 至少需要 header.payload");
            const header = b64urlToJson(parts[0]);
            const payload = b64urlToJson(parts[1]);
            const claims = [];
            if (payload.exp) claims.push(`exp: ${new Date(payload.exp * 1000).toLocaleString()}`);
            if (payload.iat) claims.push(`iat: ${new Date(payload.iat * 1000).toLocaleString()}`);
            if (payload.nbf) claims.push(`nbf: ${new Date(payload.nbf * 1000).toLocaleString()}`);
            out.append(
              el("div", { className: "jwt-block" }, [
                el("h3", { text: "Header" }),
                el("pre", { text: JSON.stringify(header, null, 2) }),
              ]),
              el("div", { className: "jwt-block" }, [
                el("h3", { text: "Payload" }),
                el("pre", { text: JSON.stringify(payload, null, 2) }),
              ]),
              claims.length
                ? el("div", { className: "chips" }, claims.map((c) => el("span", { className: "chip", text: c })))
                : null,
              parts[2]
                ? el("p", { className: "hint", text: `Signature: ${parts[2].slice(0, 24)}…（未校验）` })
                : el("p", { className: "hint", text: "无 signature 段" })
            );
            setStatus(status, "解析成功", "ok");
          } catch (e) {
            setStatus(status, e.message || "解析失败", "err");
          }
        };
        root.append(
          el("div", { className: "tool-grid" }, [
            field("JWT", input),
            actions(el("button", { className: "btn", type: "button", text: "解析", onClick: run })),
            status,
            out,
          ])
        );
        run();
        root._clear = () => {
          input.value = "";
          out.innerHTML = "";
          setStatus(status, "");
        };
      },
    },
    {
      id: "diff",
      name: "文本 Diff",
      kbd: "08",
      desc: "按行对比两段文本的增删变化。",
      render(root) {
        const a = textarea("diff-a", "alpha\nbeta\ngamma");
        const b = textarea("diff-b", "alpha\nbeta2\ngamma\ndelta");
        const view = el("div", { className: "diff-view" });
        const status = el("div", { className: "status" });
        const run = () => {
          view.innerHTML = "";
          const rows = lineDiff(a.value, b.value);
          for (const row of rows) {
            const prefix = row.type === "add" ? "+" : row.type === "del" ? "-" : " ";
            view.append(el("div", { className: `diff-line ${row.type}`, text: `${prefix} ${row.text}` }));
          }
          const add = rows.filter((r) => r.type === "add").length;
          const del = rows.filter((r) => r.type === "del").length;
          setStatus(status, `+${add}  -${del}`, "ok");
        };
        root.append(
          el("div", { className: "tool-grid two" }, [field("原文", a), field("新文", b)]),
          actions(el("button", { className: "btn", type: "button", text: "对比", onClick: run })),
          status,
          field("差异", view)
        );
        run();
        root._clear = () => {
          a.value = "";
          b.value = "";
          view.innerHTML = "";
          setStatus(status, "");
        };
      },
    },
    {
      id: "regex",
      name: "正则测试",
      kbd: "09",
      desc: "实时测试正则，高亮匹配并列出分组。",
      render(root) {
        const pattern = el("input", { type: "text", id: "re-pat", value: "(\\w+)@(\\w+\\.\\w+)" });
        const flags = el("input", { type: "text", id: "re-flags", value: "g" });
        const text = textarea("re-text", "contact a@x.com and b@y.org");
        const highlight = el("div", { className: "output-box" });
        const tableWrap = el("div");
        const status = el("div", { className: "status" });
        const run = () => {
          highlight.innerHTML = "";
          tableWrap.innerHTML = "";
          try {
            const re = new RegExp(pattern.value, flags.value);
            const src = text.value;
            if (!pattern.value) {
              highlight.textContent = src;
              setStatus(status, "请输入正则", "err");
              return;
            }
            let html = "";
            let last = 0;
            const rows = [];
            if (re.global) {
              let m;
              let i = 0;
              while ((m = re.exec(src)) !== null) {
                html += escapeHtml(src.slice(last, m.index));
                html += `<span class="regex-match">${escapeHtml(m[0])}</span>`;
                last = m.index + m[0].length;
                rows.push({ i: ++i, match: m[0], index: m.index, groups: m.slice(1) });
                if (m[0].length === 0) re.lastIndex++;
              }
              html += escapeHtml(src.slice(last));
            } else {
              const m = re.exec(src);
              if (m) {
                html =
                  escapeHtml(src.slice(0, m.index)) +
                  `<span class="regex-match">${escapeHtml(m[0])}</span>` +
                  escapeHtml(src.slice(m.index + m[0].length));
                rows.push({ i: 1, match: m[0], index: m.index, groups: m.slice(1) });
              } else html = escapeHtml(src);
            }
            highlight.innerHTML = html || "&nbsp;";
            if (rows.length) {
              const table = el("table", { className: "table" }, [
                el("thead", {}, [
                  el("tr", {}, [
                    el("th", { text: "#" }),
                    el("th", { text: "匹配" }),
                    el("th", { text: "位置" }),
                    el("th", { text: "分组" }),
                  ]),
                ]),
                el(
                  "tbody",
                  {},
                  rows.map((r) =>
                    el("tr", {}, [
                      el("td", { text: String(r.i) }),
                      el("td", { text: r.match }),
                      el("td", { text: String(r.index) }),
                      el("td", { text: r.groups.join(" | ") || "—" }),
                    ])
                  )
                ),
              ]);
              tableWrap.append(table);
            }
            setStatus(status, `匹配 ${rows.length} 处`, "ok");
          } catch (e) {
            setStatus(status, e.message, "err");
            highlight.textContent = text.value;
          }
        };
        for (const node of [pattern, flags, text]) node.addEventListener("input", run);
        root.append(
          el("div", { className: "tool-grid two" }, [
            field("正则", pattern),
            field("标志 (g i m s u y)", flags),
          ]),
          field("测试文本", text),
          status,
          field("高亮", highlight),
          tableWrap
        );
        run();
        root._clear = () => {
          pattern.value = "";
          flags.value = "g";
          text.value = "";
          highlight.innerHTML = "";
          tableWrap.innerHTML = "";
          setStatus(status, "");
        };
      },
    },
    {
      id: "cron",
      name: "Cron 表达式",
      kbd: "10",
      desc: "解析标准 5 段 Cron，并预览接下来的几次执行时间。",
      render(root) {
        const input = el("input", { type: "text", id: "cron-in", value: "*/5 * * * *" });
        const desc = el("div", { className: "output-box" });
        const next = el("div", { className: "cron-next" });
        const status = el("div", { className: "status" });

        const run = () => {
          try {
            desc.textContent = describeCron(input.value);
            const runs = nextCronRuns(input.value, 8);
            next.textContent = runs.map((d, i) => `${i + 1}. ${d.toLocaleString()}`).join("\n");
            setStatus(status, "解析成功", "ok");
          } catch (e) {
            desc.textContent = "";
            next.textContent = "";
            setStatus(status, e.message, "err");
          }
        };
        const chip = (label, value) =>
          el("button", {
            className: "chip",
            type: "button",
            text: label,
            onClick: () => {
              input.value = value;
              run();
            },
          });
        const examples = el("div", { className: "chips" }, [
          chip("每分钟", "* * * * *"),
          chip("每 5 分钟", "*/5 * * * *"),
          chip("每天 9:00", "0 9 * * *"),
          chip("工作日 18:30", "30 18 * * 1-5"),
        ]);
        input.addEventListener("input", run);
        root.append(
          field("Cron（分 时 日 月 周）", input, "示例：0 9 * * 1-5 = 工作日早上 9 点"),
          examples,
          actions(el("button", { className: "btn", type: "button", text: "解析", onClick: run })),
          status,
          el("div", { className: "tool-grid two" }, [field("字段展开", desc), field("接下来执行", next)])
        );
        run();
        root._clear = () => {
          input.value = "";
          desc.textContent = "";
          next.textContent = "";
          setStatus(status, "");
        };
      },
    },
  ];

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const nav = $("#tool-nav");
  const panel = $("#tool-panel");
  const title = $("#tool-title");
  const desc = $("#tool-desc");
  const eyebrow = $("#tool-eyebrow");
  const search = $("#tool-search");
  const clearBtn = $("#btn-clear");

  let activeId = tools[0].id;
  let clearFn = null;

  function renderNav(filter = "") {
    nav.innerHTML = "";
    const q = filter.trim().toLowerCase();
    const list = tools.filter((t) => !q || t.name.toLowerCase().includes(q) || t.id.includes(q));
    for (const t of list) {
      nav.append(
        el("button", {
          type: "button",
          className: t.id === activeId ? "active" : "",
          "data-id": t.id,
          onClick: () => selectTool(t.id),
        }, [t.name, el("span", { className: "kbd", text: t.kbd })])
      );
    }
    if (!list.length) nav.append(el("p", { className: "hint", text: "没有匹配的工具" }));
  }

  function selectTool(id) {
    const tool = tools.find((t) => t.id === id) || tools[0];
    activeId = tool.id;
    title.textContent = tool.name;
    desc.textContent = tool.desc;
    eyebrow.textContent = `TOOL · ${tool.kbd}`;
    panel.innerHTML = "";
    panel.style.animation = "none";
    void panel.offsetWidth;
    panel.style.animation = "";
    tool.render(panel);
    clearFn = panel._clear || null;
    location.hash = tool.id;
    renderNav(search.value);
  }

  clearBtn.addEventListener("click", () => clearFn && clearFn());
  search.addEventListener("input", () => renderNav(search.value));

  window.addEventListener("hashchange", () => {
    const id = location.hash.replace(/^#/, "");
    if (id && id !== activeId && tools.some((t) => t.id === id)) selectTool(id);
  });

  const initial = location.hash.replace(/^#/, "");
  selectTool(tools.some((t) => t.id === initial) ? initial : tools[0].id);
})();
