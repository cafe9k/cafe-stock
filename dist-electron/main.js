import Lt, { app as Ce, BrowserWindow as yl, globalShortcut as _l, session as Hf, Notification as Ke, nativeImage as Ai, Tray as jf, Menu as qf, ipcMain as ne, shell as Gf } from "electron";
import z from "path";
import sn, { fileURLToPath as Yf } from "url";
import vt from "fs";
import Vf from "constants";
import Gn from "stream";
import Ao from "util";
import vl from "assert";
import Vr from "child_process";
import wl from "events";
import Yn from "crypto";
import Tl from "tty";
import Wr from "os";
import Wf from "string_decoder";
import Sl from "zlib";
import Xf from "http";
import zf from "better-sqlite3";
var Oe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Kf(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Al = {}, kt = {}, Ne = {};
Ne.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Ne.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var ct = Vf, Jf = process.cwd, Nr = null, Qf = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Nr || (Nr = Jf.call(process)), Nr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var wa = process.chdir;
  process.chdir = function(e) {
    Nr = null, wa.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, wa);
}
var Zf = ed;
function ed(e) {
  ct.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, h, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), Qf === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(h, g, w) {
      var y = Date.now(), T = 0;
      c(h, g, function A(S) {
        if (S && (S.code === "EACCES" || S.code === "EPERM" || S.code === "EBUSY") && Date.now() - y < 6e4) {
          setTimeout(function() {
            e.stat(g, function(F, x) {
              F && F.code === "ENOENT" ? c(h, g, A) : w(S);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        w && w(S);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(h, g, w, y, T, A) {
      var S;
      if (A && typeof A == "function") {
        var F = 0;
        S = function(x, re, le) {
          if (x && x.code === "EAGAIN" && F < 10)
            return F++, c.call(e, h, g, w, y, T, S);
          A.apply(this, arguments);
        };
      }
      return c.call(e, h, g, w, y, T, S);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, h, g, w, y) {
      for (var T = 0; ; )
        try {
          return c.call(e, f, h, g, w, y);
        } catch (A) {
          if (A.code === "EAGAIN" && T < 10) {
            T++;
            continue;
          }
          throw A;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(f, h, g) {
      c.open(
        f,
        ct.O_WRONLY | ct.O_SYMLINK,
        h,
        function(w, y) {
          if (w) {
            g && g(w);
            return;
          }
          c.fchmod(y, h, function(T) {
            c.close(y, function(A) {
              g && g(T || A);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, h) {
      var g = c.openSync(f, ct.O_WRONLY | ct.O_SYMLINK, h), w = !0, y;
      try {
        y = c.fchmodSync(g, h), w = !1;
      } finally {
        if (w)
          try {
            c.closeSync(g);
          } catch {
          }
        else
          c.closeSync(g);
      }
      return y;
    };
  }
  function n(c) {
    ct.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, h, g, w) {
      c.open(f, ct.O_SYMLINK, function(y, T) {
        if (y) {
          w && w(y);
          return;
        }
        c.futimes(T, h, g, function(A) {
          c.close(T, function(S) {
            w && w(A || S);
          });
        });
      });
    }, c.lutimesSync = function(f, h, g) {
      var w = c.openSync(f, ct.O_SYMLINK), y, T = !0;
      try {
        y = c.futimesSync(w, h, g), T = !1;
      } finally {
        if (T)
          try {
            c.closeSync(w);
          } catch {
          }
        else
          c.closeSync(w);
      }
      return y;
    }) : c.futimes && (c.lutimes = function(f, h, g, w) {
      w && process.nextTick(w);
    }, c.lutimesSync = function() {
    });
  }
  function r(c) {
    return c && function(f, h, g) {
      return c.call(e, f, h, function(w) {
        m(w) && (w = null), g && g.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(f, h) {
      try {
        return c.call(e, f, h);
      } catch (g) {
        if (!m(g)) throw g;
      }
    };
  }
  function o(c) {
    return c && function(f, h, g, w) {
      return c.call(e, f, h, g, function(y) {
        m(y) && (y = null), w && w.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, h, g) {
      try {
        return c.call(e, f, h, g);
      } catch (w) {
        if (!m(w)) throw w;
      }
    };
  }
  function s(c) {
    return c && function(f, h, g) {
      typeof h == "function" && (g = h, h = null);
      function w(y, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), g && g.apply(this, arguments);
      }
      return h ? c.call(e, f, h, w) : c.call(e, f, w);
    };
  }
  function l(c) {
    return c && function(f, h) {
      var g = h ? c.call(e, f, h) : c.call(e, f);
      return g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)), g;
    };
  }
  function m(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var Ta = Gn.Stream, td = nd;
function nd(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    Ta.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, l = a.length; s < l; s++) {
      var m = a[s];
      this[m] = i[m];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(c, f) {
      if (c) {
        o.emit("error", c), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function n(r, i) {
    if (!(this instanceof n)) return new n(r, i);
    Ta.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), a = 0, s = o.length; a < s; a++) {
      var l = o[a];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var rd = od, id = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function od(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: id(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var oe = vt, ad = Zf, sd = td, ld = rd, dr = Ao, ye, Pr;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (ye = Symbol.for("graceful-fs.queue"), Pr = Symbol.for("graceful-fs.previous")) : (ye = "___graceful-fs.queue", Pr = "___graceful-fs.previous");
function cd() {
}
function Cl(e, t) {
  Object.defineProperty(e, ye, {
    get: function() {
      return t;
    }
  });
}
var Pt = cd;
dr.debuglog ? Pt = dr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Pt = function() {
  var e = dr.format.apply(dr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[ye]) {
  var ud = Oe[ye] || [];
  Cl(oe, ud), oe.close = function(e) {
    function t(n, r) {
      return e.call(oe, n, function(i) {
        i || Sa(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Pr, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(n) {
      e.apply(oe, arguments), Sa();
    }
    return Object.defineProperty(t, Pr, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Pt(oe[ye]), vl.equal(oe[ye].length, 0);
  });
}
Oe[ye] || Cl(Oe, oe[ye]);
var Re = Co(ld(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && (Re = Co(oe), oe.__patched = !0);
function Co(e) {
  ad(e), e.gracefulify = Co, e.createReadStream = re, e.createWriteStream = le;
  var t = e.readFile;
  e.readFile = n;
  function n(E, G, H) {
    return typeof G == "function" && (H = G, G = null), B(E, G, H);
    function B(J, N, I, D) {
      return t(J, N, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? Ht([B, [J, N, I], O, D || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(E, G, H, B) {
    return typeof H == "function" && (B = H, H = null), J(E, G, H, B);
    function J(N, I, D, O, $) {
      return r(N, I, D, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Ht([J, [N, I, D, O], R, $ || Date.now(), Date.now()]) : typeof O == "function" && O.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(E, G, H, B) {
    return typeof H == "function" && (B = H, H = null), J(E, G, H, B);
    function J(N, I, D, O, $) {
      return o(N, I, D, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Ht([J, [N, I, D, O], R, $ || Date.now(), Date.now()]) : typeof O == "function" && O.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(E, G, H, B) {
    return typeof H == "function" && (B = H, H = 0), J(E, G, H, B);
    function J(N, I, D, O, $) {
      return s(N, I, D, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Ht([J, [N, I, D, O], R, $ || Date.now(), Date.now()]) : typeof O == "function" && O.apply(this, arguments);
      });
    }
  }
  var m = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(E, G, H) {
    typeof G == "function" && (H = G, G = null);
    var B = c.test(process.version) ? function(I, D, O, $) {
      return m(I, J(
        I,
        D,
        O,
        $
      ));
    } : function(I, D, O, $) {
      return m(I, D, J(
        I,
        D,
        O,
        $
      ));
    };
    return B(E, G, H);
    function J(N, I, D, O) {
      return function($, R) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Ht([
          B,
          [N, I, D],
          $,
          O || Date.now(),
          Date.now()
        ]) : (R && R.sort && R.sort(), typeof D == "function" && D.call(this, $, R));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = sd(e);
    A = h.ReadStream, F = h.WriteStream;
  }
  var g = e.ReadStream;
  g && (A.prototype = Object.create(g.prototype), A.prototype.open = S);
  var w = e.WriteStream;
  w && (F.prototype = Object.create(w.prototype), F.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return A;
    },
    set: function(E) {
      A = E;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return F;
    },
    set: function(E) {
      F = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var y = A;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return y;
    },
    set: function(E) {
      y = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var T = F;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return T;
    },
    set: function(E) {
      T = E;
    },
    enumerable: !0,
    configurable: !0
  });
  function A(E, G) {
    return this instanceof A ? (g.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
  }
  function S() {
    var E = this;
    Le(E.path, E.flags, E.mode, function(G, H) {
      G ? (E.autoClose && E.destroy(), E.emit("error", G)) : (E.fd = H, E.emit("open", H), E.read());
    });
  }
  function F(E, G) {
    return this instanceof F ? (w.apply(this, arguments), this) : F.apply(Object.create(F.prototype), arguments);
  }
  function x() {
    var E = this;
    Le(E.path, E.flags, E.mode, function(G, H) {
      G ? (E.destroy(), E.emit("error", G)) : (E.fd = H, E.emit("open", H));
    });
  }
  function re(E, G) {
    return new e.ReadStream(E, G);
  }
  function le(E, G) {
    return new e.WriteStream(E, G);
  }
  var W = e.open;
  e.open = Le;
  function Le(E, G, H, B) {
    return typeof H == "function" && (B = H, H = null), J(E, G, H, B);
    function J(N, I, D, O, $) {
      return W(N, I, D, function(R, M) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Ht([J, [N, I, D, O], R, $ || Date.now(), Date.now()]) : typeof O == "function" && O.apply(this, arguments);
      });
    }
  }
  return e;
}
function Ht(e) {
  Pt("ENQUEUE", e[0].name, e[1]), oe[ye].push(e), Oo();
}
var hr;
function Sa() {
  for (var e = Date.now(), t = 0; t < oe[ye].length; ++t)
    oe[ye][t].length > 2 && (oe[ye][t][3] = e, oe[ye][t][4] = e);
  Oo();
}
function Oo() {
  if (clearTimeout(hr), hr = void 0, oe[ye].length !== 0) {
    var e = oe[ye].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Pt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Pt("TIMEOUT", t.name, n);
      var a = n.pop();
      typeof a == "function" && a.call(null, r);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), m = Math.min(l * 1.2, 100);
      s >= m ? (Pt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : oe[ye].push(e);
    }
    hr === void 0 && (hr = setTimeout(Oo, 0));
  }
}
(function(e) {
  const t = Ne.fromCallback, n = Re, r = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof n[i] == "function");
  Object.assign(e, n), r.forEach((i) => {
    e[i] = t(n[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? n.exists(i, o) : new Promise((a) => n.exists(i, a));
  }, e.read = function(i, o, a, s, l, m) {
    return typeof m == "function" ? n.read(i, o, a, s, l, m) : new Promise((c, f) => {
      n.read(i, o, a, s, l, (h, g, w) => {
        if (h) return f(h);
        c({ bytesRead: g, buffer: w });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.write(i, o, ...a) : new Promise((s, l) => {
      n.write(i, o, ...a, (m, c, f) => {
        if (m) return l(m);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.writev(i, o, ...a) : new Promise((s, l) => {
      n.writev(i, o, ...a, (m, c, f) => {
        if (m) return l(m);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(kt);
var Io = {}, Ol = {};
const fd = z;
Ol.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(fd.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const Il = kt, { checkPath: bl } = Ol, Nl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Io.makeDir = async (e, t) => (bl(e), Il.mkdir(e, {
  mode: Nl(t),
  recursive: !0
}));
Io.makeDirSync = (e, t) => (bl(e), Il.mkdirSync(e, {
  mode: Nl(t),
  recursive: !0
}));
const dd = Ne.fromPromise, { makeDir: hd, makeDirSync: Ci } = Io, Oi = dd(hd);
var Qe = {
  mkdirs: Oi,
  mkdirsSync: Ci,
  // alias
  mkdirp: Oi,
  mkdirpSync: Ci,
  ensureDir: Oi,
  ensureDirSync: Ci
};
const pd = Ne.fromPromise, Rl = kt;
function md(e) {
  return Rl.access(e).then(() => !0).catch(() => !1);
}
var Ut = {
  pathExists: pd(md),
  pathExistsSync: Rl.existsSync
};
const en = Re;
function gd(e, t, n, r) {
  en.open(e, "r+", (i, o) => {
    if (i) return r(i);
    en.futimes(o, t, n, (a) => {
      en.close(o, (s) => {
        r && r(a || s);
      });
    });
  });
}
function Ed(e, t, n) {
  const r = en.openSync(e, "r+");
  return en.futimesSync(r, t, n), en.closeSync(r);
}
var Dl = {
  utimesMillis: gd,
  utimesMillisSync: Ed
};
const nn = kt, pe = z, yd = Ao;
function _d(e, t, n) {
  const r = n.dereference ? (i) => nn.stat(i, { bigint: !0 }) : (i) => nn.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function vd(e, t, n) {
  let r;
  const i = n.dereference ? (a) => nn.statSync(a, { bigint: !0 }) : (a) => nn.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: r };
}
function wd(e, t, n, r, i) {
  yd.callbackify(_d)(e, t, r, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (Vn(s, l)) {
        const m = pe.basename(e), c = pe.basename(t);
        return n === "move" && m !== c && m.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && bo(e, t) ? i(new Error(Xr(e, t, n))) : i(null, { srcStat: s, destStat: l });
  });
}
function Td(e, t, n, r) {
  const { srcStat: i, destStat: o } = vd(e, t, r);
  if (o) {
    if (Vn(i, o)) {
      const a = pe.basename(e), s = pe.basename(t);
      if (n === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && bo(e, t))
    throw new Error(Xr(e, t, n));
  return { srcStat: i, destStat: o };
}
function $l(e, t, n, r, i) {
  const o = pe.resolve(pe.dirname(e)), a = pe.resolve(pe.dirname(n));
  if (a === o || a === pe.parse(a).root) return i();
  nn.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : Vn(t, l) ? i(new Error(Xr(e, n, r))) : $l(e, t, a, r, i));
}
function Pl(e, t, n, r) {
  const i = pe.resolve(pe.dirname(e)), o = pe.resolve(pe.dirname(n));
  if (o === i || o === pe.parse(o).root) return;
  let a;
  try {
    a = nn.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (Vn(t, a))
    throw new Error(Xr(e, n, r));
  return Pl(e, t, o, r);
}
function Vn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function bo(e, t) {
  const n = pe.resolve(e).split(pe.sep).filter((i) => i), r = pe.resolve(t).split(pe.sep).filter((i) => i);
  return n.reduce((i, o, a) => i && r[a] === o, !0);
}
function Xr(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var ln = {
  checkPaths: wd,
  checkPathsSync: Td,
  checkParentPaths: $l,
  checkParentPathsSync: Pl,
  isSrcSubdir: bo,
  areIdentical: Vn
};
const Pe = Re, bn = z, Sd = Qe.mkdirs, Ad = Ut.pathExists, Cd = Dl.utimesMillis, Nn = ln;
function Od(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Nn.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: a, destStat: s } = o;
    Nn.checkParentPaths(e, a, t, "copy", (l) => l ? r(l) : n.filter ? Fl(Aa, s, e, t, n, r) : Aa(s, e, t, n, r));
  });
}
function Aa(e, t, n, r, i) {
  const o = bn.dirname(n);
  Ad(o, (a, s) => {
    if (a) return i(a);
    if (s) return Fr(e, t, n, r, i);
    Sd(o, (l) => l ? i(l) : Fr(e, t, n, r, i));
  });
}
function Fl(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((a) => a ? e(t, n, r, i, o) : o(), (a) => o(a));
}
function Id(e, t, n, r, i) {
  return r.filter ? Fl(Fr, e, t, n, r, i) : Fr(e, t, n, r, i);
}
function Fr(e, t, n, r, i) {
  (r.dereference ? Pe.stat : Pe.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? Fd(s, e, t, n, r, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? bd(s, e, t, n, r, i) : s.isSymbolicLink() ? kd(e, t, n, r, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function bd(e, t, n, r, i, o) {
  return t ? Nd(e, n, r, i, o) : Ll(e, n, r, i, o);
}
function Nd(e, t, n, r, i) {
  if (r.overwrite)
    Pe.unlink(n, (o) => o ? i(o) : Ll(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function Ll(e, t, n, r, i) {
  Pe.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? Rd(e.mode, t, n, i) : zr(n, e.mode, i));
}
function Rd(e, t, n, r) {
  return Dd(e) ? $d(n, e, (i) => i ? r(i) : Ca(e, t, n, r)) : Ca(e, t, n, r);
}
function Dd(e) {
  return (e & 128) === 0;
}
function $d(e, t, n) {
  return zr(e, t | 128, n);
}
function Ca(e, t, n, r) {
  Pd(t, n, (i) => i ? r(i) : zr(n, e, r));
}
function zr(e, t, n) {
  return Pe.chmod(e, t, n);
}
function Pd(e, t, n) {
  Pe.stat(e, (r, i) => r ? n(r) : Cd(t, i.atime, i.mtime, n));
}
function Fd(e, t, n, r, i, o) {
  return t ? xl(n, r, i, o) : Ld(e.mode, n, r, i, o);
}
function Ld(e, t, n, r, i) {
  Pe.mkdir(n, (o) => {
    if (o) return i(o);
    xl(t, n, r, (a) => a ? i(a) : zr(n, e, i));
  });
}
function xl(e, t, n, r) {
  Pe.readdir(e, (i, o) => i ? r(i) : kl(o, e, t, n, r));
}
function kl(e, t, n, r, i) {
  const o = e.pop();
  return o ? xd(e, o, t, n, r, i) : i();
}
function xd(e, t, n, r, i, o) {
  const a = bn.join(n, t), s = bn.join(r, t);
  Nn.checkPaths(a, s, "copy", i, (l, m) => {
    if (l) return o(l);
    const { destStat: c } = m;
    Id(c, a, s, i, (f) => f ? o(f) : kl(e, n, r, i, o));
  });
}
function kd(e, t, n, r, i) {
  Pe.readlink(t, (o, a) => {
    if (o) return i(o);
    if (r.dereference && (a = bn.resolve(process.cwd(), a)), e)
      Pe.readlink(n, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Pe.symlink(a, n, i) : i(s) : (r.dereference && (l = bn.resolve(process.cwd(), l)), Nn.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Nn.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : Ud(a, n, i)));
    else
      return Pe.symlink(a, n, i);
  });
}
function Ud(e, t, n) {
  Pe.unlink(t, (r) => r ? n(r) : Pe.symlink(e, t, n));
}
var Md = Od;
const Te = Re, Rn = z, Bd = Qe.mkdirsSync, Hd = Dl.utimesMillisSync, Dn = ln;
function jd(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = Dn.checkPathsSync(e, t, "copy", n);
  return Dn.checkParentPathsSync(e, r, t, "copy"), qd(i, e, t, n);
}
function qd(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Rn.dirname(n);
  return Te.existsSync(i) || Bd(i), Ul(e, t, n, r);
}
function Gd(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return Ul(e, t, n, r);
}
function Ul(e, t, n, r) {
  const o = (r.dereference ? Te.statSync : Te.lstatSync)(t);
  if (o.isDirectory()) return Jd(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return Yd(o, e, t, n, r);
  if (o.isSymbolicLink()) return eh(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Yd(e, t, n, r, i) {
  return t ? Vd(e, n, r, i) : Ml(e, n, r, i);
}
function Vd(e, t, n, r) {
  if (r.overwrite)
    return Te.unlinkSync(n), Ml(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function Ml(e, t, n, r) {
  return Te.copyFileSync(t, n), r.preserveTimestamps && Wd(e.mode, t, n), No(n, e.mode);
}
function Wd(e, t, n) {
  return Xd(e) && zd(n, e), Kd(t, n);
}
function Xd(e) {
  return (e & 128) === 0;
}
function zd(e, t) {
  return No(e, t | 128);
}
function No(e, t) {
  return Te.chmodSync(e, t);
}
function Kd(e, t) {
  const n = Te.statSync(e);
  return Hd(t, n.atime, n.mtime);
}
function Jd(e, t, n, r, i) {
  return t ? Bl(n, r, i) : Qd(e.mode, n, r, i);
}
function Qd(e, t, n, r) {
  return Te.mkdirSync(n), Bl(t, n, r), No(n, e);
}
function Bl(e, t, n) {
  Te.readdirSync(e).forEach((r) => Zd(r, e, t, n));
}
function Zd(e, t, n, r) {
  const i = Rn.join(t, e), o = Rn.join(n, e), { destStat: a } = Dn.checkPathsSync(i, o, "copy", r);
  return Gd(a, i, o, r);
}
function eh(e, t, n, r) {
  let i = Te.readlinkSync(t);
  if (r.dereference && (i = Rn.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Te.readlinkSync(n);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return Te.symlinkSync(i, n);
      throw a;
    }
    if (r.dereference && (o = Rn.resolve(process.cwd(), o)), Dn.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Te.statSync(n).isDirectory() && Dn.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return th(i, n);
  } else
    return Te.symlinkSync(i, n);
}
function th(e, t) {
  return Te.unlinkSync(t), Te.symlinkSync(e, t);
}
var nh = jd;
const rh = Ne.fromCallback;
var Ro = {
  copy: rh(Md),
  copySync: nh
};
const Oa = Re, Hl = z, Z = vl, $n = process.platform === "win32";
function jl(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || Oa[n], n = n + "Sync", e[n] = e[n] || Oa[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Do(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z.strictEqual(typeof n, "function", "rimraf: callback function required"), Z(t, "rimraf: invalid options argument provided"), Z.strictEqual(typeof t, "object", "rimraf: options should be object"), jl(t), Ia(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const a = r * 100;
        return setTimeout(() => Ia(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function Ia(e, t, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && $n)
      return ba(e, t, r, n);
    if (i && i.isDirectory())
      return Rr(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return $n ? ba(e, t, o, n) : Rr(e, t, o, n);
        if (o.code === "EISDIR")
          return Rr(e, t, o, n);
      }
      return n(o);
    });
  });
}
function ba(e, t, n, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, a) => {
      o ? r(o.code === "ENOENT" ? null : n) : a.isDirectory() ? Rr(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function Na(e, t, n) {
  let r;
  Z(e), Z(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  try {
    r = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  r.isDirectory() ? Dr(e, t, n) : t.unlinkSync(e);
}
function Rr(e, t, n, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? ih(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function ih(e, t, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((s) => {
      Do(Hl.join(e, s), t, (l) => {
        if (!a) {
          if (l) return n(a = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function ql(e, t) {
  let n;
  t = t || {}, jl(t), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z(t, "rimraf: missing options"), Z.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && $n && Na(e, t, r);
  }
  try {
    n && n.isDirectory() ? Dr(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return $n ? Na(e, t, r) : Dr(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    Dr(e, t, r);
  }
}
function Dr(e, t, n) {
  Z(e), Z(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      oh(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function oh(e, t) {
  if (Z(e), Z(t), t.readdirSync(e).forEach((n) => ql(Hl.join(e, n), t)), $n) {
    const n = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - n < 500);
  } else
    return t.rmdirSync(e, t);
}
var ah = Do;
Do.sync = ql;
const Lr = Re, sh = Ne.fromCallback, Gl = ah;
function lh(e, t) {
  if (Lr.rm) return Lr.rm(e, { recursive: !0, force: !0 }, t);
  Gl(e, t);
}
function ch(e) {
  if (Lr.rmSync) return Lr.rmSync(e, { recursive: !0, force: !0 });
  Gl.sync(e);
}
var Kr = {
  remove: sh(lh),
  removeSync: ch
};
const uh = Ne.fromPromise, Yl = kt, Vl = z, Wl = Qe, Xl = Kr, Ra = uh(async function(t) {
  let n;
  try {
    n = await Yl.readdir(t);
  } catch {
    return Wl.mkdirs(t);
  }
  return Promise.all(n.map((r) => Xl.remove(Vl.join(t, r))));
});
function Da(e) {
  let t;
  try {
    t = Yl.readdirSync(e);
  } catch {
    return Wl.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Vl.join(e, n), Xl.removeSync(n);
  });
}
var fh = {
  emptyDirSync: Da,
  emptydirSync: Da,
  emptyDir: Ra,
  emptydir: Ra
};
const dh = Ne.fromCallback, zl = z, dt = Re, Kl = Qe;
function hh(e, t) {
  function n() {
    dt.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  dt.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = zl.dirname(e);
    dt.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? Kl.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(a);
      s.isDirectory() ? n() : dt.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function ph(e) {
  let t;
  try {
    t = dt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = zl.dirname(e);
  try {
    dt.statSync(n).isDirectory() || dt.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") Kl.mkdirsSync(n);
    else throw r;
  }
  dt.writeFileSync(e, "");
}
var mh = {
  createFile: dh(hh),
  createFileSync: ph
};
const gh = Ne.fromCallback, Jl = z, ft = Re, Ql = Qe, Eh = Ut.pathExists, { areIdentical: Zl } = ln;
function yh(e, t, n) {
  function r(i, o) {
    ft.link(i, o, (a) => {
      if (a) return n(a);
      n(null);
    });
  }
  ft.lstat(t, (i, o) => {
    ft.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), n(a);
      if (o && Zl(s, o)) return n(null);
      const l = Jl.dirname(t);
      Eh(l, (m, c) => {
        if (m) return n(m);
        if (c) return r(e, t);
        Ql.mkdirs(l, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function _h(e, t) {
  let n;
  try {
    n = ft.lstatSync(t);
  } catch {
  }
  try {
    const o = ft.lstatSync(e);
    if (n && Zl(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = Jl.dirname(t);
  return ft.existsSync(r) || Ql.mkdirsSync(r), ft.linkSync(e, t);
}
var vh = {
  createLink: gh(yh),
  createLinkSync: _h
};
const ht = z, An = Re, wh = Ut.pathExists;
function Th(e, t, n) {
  if (ht.isAbsolute(e))
    return An.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = ht.dirname(t), i = ht.join(r, e);
    return wh(i, (o, a) => o ? n(o) : a ? n(null, {
      toCwd: i,
      toDst: e
    }) : An.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), n(s)) : n(null, {
      toCwd: e,
      toDst: ht.relative(r, e)
    })));
  }
}
function Sh(e, t) {
  let n;
  if (ht.isAbsolute(e)) {
    if (n = An.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = ht.dirname(t), i = ht.join(r, e);
    if (n = An.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = An.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: ht.relative(r, e)
    };
  }
}
var Ah = {
  symlinkPaths: Th,
  symlinkPathsSync: Sh
};
const ec = Re;
function Ch(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  ec.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function Oh(e, t) {
  let n;
  if (t) return t;
  try {
    n = ec.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var Ih = {
  symlinkType: Ch,
  symlinkTypeSync: Oh
};
const bh = Ne.fromCallback, tc = z, qe = kt, nc = Qe, Nh = nc.mkdirs, Rh = nc.mkdirsSync, rc = Ah, Dh = rc.symlinkPaths, $h = rc.symlinkPathsSync, ic = Ih, Ph = ic.symlinkType, Fh = ic.symlinkTypeSync, Lh = Ut.pathExists, { areIdentical: oc } = ln;
function xh(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, qe.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      qe.stat(e),
      qe.stat(t)
    ]).then(([a, s]) => {
      if (oc(a, s)) return r(null);
      $a(e, t, n, r);
    }) : $a(e, t, n, r);
  });
}
function $a(e, t, n, r) {
  Dh(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, Ph(o.toCwd, n, (a, s) => {
      if (a) return r(a);
      const l = tc.dirname(t);
      Lh(l, (m, c) => {
        if (m) return r(m);
        if (c) return qe.symlink(e, t, s, r);
        Nh(l, (f) => {
          if (f) return r(f);
          qe.symlink(e, t, s, r);
        });
      });
    });
  });
}
function kh(e, t, n) {
  let r;
  try {
    r = qe.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const s = qe.statSync(e), l = qe.statSync(t);
    if (oc(s, l)) return;
  }
  const i = $h(e, t);
  e = i.toDst, n = Fh(i.toCwd, n);
  const o = tc.dirname(t);
  return qe.existsSync(o) || Rh(o), qe.symlinkSync(e, t, n);
}
var Uh = {
  createSymlink: bh(xh),
  createSymlinkSync: kh
};
const { createFile: Pa, createFileSync: Fa } = mh, { createLink: La, createLinkSync: xa } = vh, { createSymlink: ka, createSymlinkSync: Ua } = Uh;
var Mh = {
  // file
  createFile: Pa,
  createFileSync: Fa,
  ensureFile: Pa,
  ensureFileSync: Fa,
  // link
  createLink: La,
  createLinkSync: xa,
  ensureLink: La,
  ensureLinkSync: xa,
  // symlink
  createSymlink: ka,
  createSymlinkSync: Ua,
  ensureSymlink: ka,
  ensureSymlinkSync: Ua
};
function Bh(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function Hh(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var $o = { stringify: Bh, stripBom: Hh };
let rn;
try {
  rn = Re;
} catch {
  rn = vt;
}
const Jr = Ne, { stringify: ac, stripBom: sc } = $o;
async function jh(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || rn, r = "throws" in t ? t.throws : !0;
  let i = await Jr.fromCallback(n.readFile)(e, t);
  i = sc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (r)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const qh = Jr.fromPromise(jh);
function Gh(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || rn, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = sc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Yh(e, t, n = {}) {
  const r = n.fs || rn, i = ac(t, n);
  await Jr.fromCallback(r.writeFile)(e, i, n);
}
const Vh = Jr.fromPromise(Yh);
function Wh(e, t, n = {}) {
  const r = n.fs || rn, i = ac(t, n);
  return r.writeFileSync(e, i, n);
}
var Xh = {
  readFile: qh,
  readFileSync: Gh,
  writeFile: Vh,
  writeFileSync: Wh
};
const pr = Xh;
var zh = {
  // jsonfile exports
  readJson: pr.readFile,
  readJsonSync: pr.readFileSync,
  writeJson: pr.writeFile,
  writeJsonSync: pr.writeFileSync
};
const Kh = Ne.fromCallback, Cn = Re, lc = z, cc = Qe, Jh = Ut.pathExists;
function Qh(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = lc.dirname(e);
  Jh(i, (o, a) => {
    if (o) return r(o);
    if (a) return Cn.writeFile(e, t, n, r);
    cc.mkdirs(i, (s) => {
      if (s) return r(s);
      Cn.writeFile(e, t, n, r);
    });
  });
}
function Zh(e, ...t) {
  const n = lc.dirname(e);
  if (Cn.existsSync(n))
    return Cn.writeFileSync(e, ...t);
  cc.mkdirsSync(n), Cn.writeFileSync(e, ...t);
}
var Po = {
  outputFile: Kh(Qh),
  outputFileSync: Zh
};
const { stringify: ep } = $o, { outputFile: tp } = Po;
async function np(e, t, n = {}) {
  const r = ep(t, n);
  await tp(e, r, n);
}
var rp = np;
const { stringify: ip } = $o, { outputFileSync: op } = Po;
function ap(e, t, n) {
  const r = ip(t, n);
  op(e, r, n);
}
var sp = ap;
const lp = Ne.fromPromise, be = zh;
be.outputJson = lp(rp);
be.outputJsonSync = sp;
be.outputJSON = be.outputJson;
be.outputJSONSync = be.outputJsonSync;
be.writeJSON = be.writeJson;
be.writeJSONSync = be.writeJsonSync;
be.readJSON = be.readJson;
be.readJSONSync = be.readJsonSync;
var cp = be;
const up = Re, ao = z, fp = Ro.copy, uc = Kr.remove, dp = Qe.mkdirp, hp = Ut.pathExists, Ma = ln;
function pp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  Ma.checkPaths(e, t, "move", n, (o, a) => {
    if (o) return r(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    Ma.checkParentPaths(e, s, t, "move", (m) => {
      if (m) return r(m);
      if (mp(t)) return Ba(e, t, i, l, r);
      dp(ao.dirname(t), (c) => c ? r(c) : Ba(e, t, i, l, r));
    });
  });
}
function mp(e) {
  const t = ao.dirname(e);
  return ao.parse(t).root === t;
}
function Ba(e, t, n, r, i) {
  if (r) return Ii(e, t, n, i);
  if (n)
    return uc(t, (o) => o ? i(o) : Ii(e, t, n, i));
  hp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : Ii(e, t, n, i));
}
function Ii(e, t, n, r) {
  up.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : gp(e, t, n, r) : r());
}
function gp(e, t, n, r) {
  fp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : uc(e, r));
}
var Ep = pp;
const fc = Re, so = z, yp = Ro.copySync, dc = Kr.removeSync, _p = Qe.mkdirpSync, Ha = ln;
function vp(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = Ha.checkPathsSync(e, t, "move", n);
  return Ha.checkParentPathsSync(e, i, t, "move"), wp(t) || _p(so.dirname(t)), Tp(e, t, r, o);
}
function wp(e) {
  const t = so.dirname(e);
  return so.parse(t).root === t;
}
function Tp(e, t, n, r) {
  if (r) return bi(e, t, n);
  if (n)
    return dc(t), bi(e, t, n);
  if (fc.existsSync(t)) throw new Error("dest already exists.");
  return bi(e, t, n);
}
function bi(e, t, n) {
  try {
    fc.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return Sp(e, t, n);
  }
}
function Sp(e, t, n) {
  return yp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), dc(e);
}
var Ap = vp;
const Cp = Ne.fromCallback;
var Op = {
  move: Cp(Ep),
  moveSync: Ap
}, wt = {
  // Export promiseified graceful-fs:
  ...kt,
  // Export extra methods:
  ...Ro,
  ...fh,
  ...Mh,
  ...cp,
  ...Qe,
  ...Op,
  ...Po,
  ...Ut,
  ...Kr
}, it = {}, mt = {}, me = {}, gt = {};
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.CancellationError = gt.CancellationToken = void 0;
const Ip = wl;
class bp extends Ip.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new lo());
    const n = () => {
      if (r != null)
        try {
          this.removeListener("cancel", r), r = null;
        } catch {
        }
    };
    let r = null;
    return new Promise((i, o) => {
      let a = null;
      if (r = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new lo());
        }
      }, this.cancelled) {
        r();
        return;
      }
      this.onCancel(r), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (n(), i)).catch((i) => {
      throw n(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
gt.CancellationToken = bp;
class lo extends Error {
  constructor() {
    super("cancelled");
  }
}
gt.CancellationError = lo;
var cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.newError = Np;
function Np(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var Ie = {}, co = { exports: {} }, mr = { exports: {} }, Ni, ja;
function Rp() {
  if (ja) return Ni;
  ja = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  Ni = function(c, f) {
    f = f || {};
    var h = typeof c;
    if (h === "string" && c.length > 0)
      return a(c);
    if (h === "number" && isFinite(c))
      return f.long ? l(c) : s(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function a(c) {
    if (c = String(c), !(c.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (f) {
        var h = parseFloat(f[1]), g = (f[2] || "ms").toLowerCase();
        switch (g) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * o;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function s(c) {
    var f = Math.abs(c);
    return f >= r ? Math.round(c / r) + "d" : f >= n ? Math.round(c / n) + "h" : f >= t ? Math.round(c / t) + "m" : f >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var f = Math.abs(c);
    return f >= r ? m(c, f, r, "day") : f >= n ? m(c, f, n, "hour") : f >= t ? m(c, f, t, "minute") : f >= e ? m(c, f, e, "second") : c + " ms";
  }
  function m(c, f, h, g) {
    var w = f >= h * 1.5;
    return Math.round(c / h) + " " + g + (w ? "s" : "");
  }
  return Ni;
}
var Ri, qa;
function hc() {
  if (qa) return Ri;
  qa = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = m, r.disable = s, r.enable = o, r.enabled = l, r.humanize = Rp(), r.destroy = c, Object.keys(t).forEach((f) => {
      r[f] = t[f];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(f) {
      let h = 0;
      for (let g = 0; g < f.length; g++)
        h = (h << 5) - h + f.charCodeAt(g), h |= 0;
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = n;
    function r(f) {
      let h, g = null, w, y;
      function T(...A) {
        if (!T.enabled)
          return;
        const S = T, F = Number(/* @__PURE__ */ new Date()), x = F - (h || F);
        S.diff = x, S.prev = h, S.curr = F, h = F, A[0] = r.coerce(A[0]), typeof A[0] != "string" && A.unshift("%O");
        let re = 0;
        A[0] = A[0].replace(/%([a-zA-Z%])/g, (W, Le) => {
          if (W === "%%")
            return "%";
          re++;
          const E = r.formatters[Le];
          if (typeof E == "function") {
            const G = A[re];
            W = E.call(S, G), A.splice(re, 1), re--;
          }
          return W;
        }), r.formatArgs.call(S, A), (S.log || r.log).apply(S, A);
      }
      return T.namespace = f, T.useColors = r.useColors(), T.color = r.selectColor(f), T.extend = i, T.destroy = r.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (w !== r.namespaces && (w = r.namespaces, y = r.enabled(f)), y),
        set: (A) => {
          g = A;
        }
      }), typeof r.init == "function" && r.init(T), T;
    }
    function i(f, h) {
      const g = r(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return g.log = this.log, g;
    }
    function o(f) {
      r.save(f), r.namespaces = f, r.names = [], r.skips = [];
      const h = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const g of h)
        g[0] === "-" ? r.skips.push(g.slice(1)) : r.names.push(g);
    }
    function a(f, h) {
      let g = 0, w = 0, y = -1, T = 0;
      for (; g < f.length; )
        if (w < h.length && (h[w] === f[g] || h[w] === "*"))
          h[w] === "*" ? (y = w, T = g, w++) : (g++, w++);
        else if (y !== -1)
          w = y + 1, T++, g = T;
        else
          return !1;
      for (; w < h.length && h[w] === "*"; )
        w++;
      return w === h.length;
    }
    function s() {
      const f = [
        ...r.names,
        ...r.skips.map((h) => "-" + h)
      ].join(",");
      return r.enable(""), f;
    }
    function l(f) {
      for (const h of r.skips)
        if (a(f, h))
          return !1;
      for (const h of r.names)
        if (a(f, h))
          return !0;
      return !1;
    }
    function m(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return Ri = e, Ri;
}
var Ga;
function Dp() {
  return Ga || (Ga = 1, function(e, t) {
    t.formatArgs = r, t.save = i, t.load = o, t.useColors = n, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function r(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const m = "color: " + this.color;
      l.splice(1, 0, m, "color: inherit");
      let c = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (c++, h === "%c" && (f = c));
      }), l.splice(f, 0, m);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let l;
      try {
        l = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = hc()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (m) {
        return "[UnexpectedJSONParseError]: " + m.message;
      }
    };
  }(mr, mr.exports)), mr.exports;
}
var gr = { exports: {} }, Di, Ya;
function $p() {
  return Ya || (Ya = 1, Di = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), Di;
}
var $i, Va;
function Pp() {
  if (Va) return $i;
  Va = 1;
  const e = Wr, t = Tl, n = $p(), { env: r } = process;
  let i;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? i = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (i = 1), "FORCE_COLOR" in r && (r.FORCE_COLOR === "true" ? i = 1 : r.FORCE_COLOR === "false" ? i = 0 : i = r.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(r.FORCE_COLOR, 10), 3));
  function o(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function a(l, m) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (l && !m && i === void 0)
      return 0;
    const c = i || 0;
    if (r.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in r)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in r) || r.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in r)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
    if (r.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in r) {
      const f = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (r.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : c;
  }
  function s(l) {
    const m = a(l, l && l.isTTY);
    return o(m);
  }
  return $i = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, $i;
}
var Wa;
function Fp() {
  return Wa || (Wa = 1, function(e, t) {
    const n = Tl, r = Ao;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = m, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = Pp();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, g) => {
      const w = g.substring(6).toLowerCase().replace(/_([a-z])/g, (T, A) => A.toUpperCase());
      let y = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), h[w] = y, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: g, useColors: w } = this;
      if (w) {
        const y = this.color, T = "\x1B[3" + (y < 8 ? y : "8;5;" + y), A = `  ${T};1m${g} \x1B[0m`;
        h[0] = A + h[0].split(`
`).join(`
` + A), h.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = a() + g + " " + h[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...h) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function l(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function m() {
      return process.env.DEBUG;
    }
    function c(h) {
      h.inspectOpts = {};
      const g = Object.keys(t.inspectOpts);
      for (let w = 0; w < g.length; w++)
        h.inspectOpts[g[w]] = t.inspectOpts[g[w]];
    }
    e.exports = hc()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(gr, gr.exports)), gr.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? co.exports = Dp() : co.exports = Fp();
var Lp = co.exports, Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.ProgressCallbackTransform = void 0;
const xp = Gn;
class kp extends xp.Transform {
  constructor(t, n, r) {
    super(), this.total = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
Wn.ProgressCallbackTransform = kp;
Object.defineProperty(Ie, "__esModule", { value: !0 });
Ie.DigestTransform = Ie.HttpExecutor = Ie.HttpError = void 0;
Ie.createHttpError = uo;
Ie.parseJson = Yp;
Ie.configureRequestOptionsFromUrl = mc;
Ie.configureRequestUrl = Lo;
Ie.safeGetHeader = tn;
Ie.configureRequestOptions = kr;
Ie.safeStringifyJson = Ur;
const Up = Yn, Mp = Lp, Bp = vt, Hp = Gn, pc = sn, jp = gt, Xa = cn, qp = Wn, En = (0, Mp.default)("electron-builder");
function uo(e, t = null) {
  return new Fo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Ur(e.headers), t);
}
const Gp = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class Fo extends Error {
  constructor(t, n = `HTTP error: ${Gp.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ie.HttpError = Fo;
function Yp(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class xr {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new jp.CancellationToken(), r) {
    kr(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      En(i);
      const { headers: a, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...a
        },
        ...s
      };
    }
    return this.doApiRequest(t, n, (a) => a.end(o));
  }
  doApiRequest(t, n, r, i = 0) {
    return En.enabled && En(`Request: ${Ur(t)}`), n.createPromise((o, a, s) => {
      const l = this.createRequest(t, (m) => {
        try {
          this.handleResponse(m, t, n, o, a, i, r);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (m) => {
        this.doApiRequest(m, n, r, i).then(o).catch(a);
      }), r(l, a), s(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, n, r, i, o) {
  }
  addErrorAndTimeoutHandlers(t, n, r = 60 * 1e3) {
    this.addTimeOutHandler(t, n, r), t.on("error", n), t.on("aborted", () => {
      n(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, n, r, i, o, a, s) {
    var l;
    if (En.enabled && En(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Ur(n)}`), t.statusCode === 404) {
      o(uo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const m = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = m >= 300 && m < 400, f = tn(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(xr.prepareRedirectUrlOptions(f, n), r, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (g) => h += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = tn(t, "content-type"), w = g != null && (Array.isArray(g) ? g.find((y) => y.includes("json")) != null : g.includes("json"));
          o(uo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${w ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (g) {
        o(g);
      }
    });
  }
  async downloadToBuffer(t, n) {
    return await n.cancellationToken.createPromise((r, i, o) => {
      const a = [], s = {
        headers: n.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Lo(t, s), kr(s), this.doDownload(s, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (l) => {
          l == null ? r(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, m) => {
          let c = 0;
          l.on("data", (f) => {
            if (c += f.length, c > 524288e3) {
              m(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), l.on("end", () => {
            m(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, n, r) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        n.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", n.callback);
      const a = tn(o, "location");
      if (a != null) {
        r < this.maxRedirects ? this.doDownload(xr.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? Wp(n, o) : n.responseHandler(o, n.callback);
    });
    this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (o) => {
      this.doDownload(o, n, r++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, n, r) {
    t.on("socket", (i) => {
      i.setTimeout(r, () => {
        t.abort(), n(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, n) {
    const r = mc(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = new pc.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return r;
  }
  static retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return t();
      } catch (i) {
        if (r < n && (i instanceof Fo && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ie.HttpExecutor = xr;
function mc(e, t) {
  const n = kr(t);
  return Lo(new pc.URL(e), n), n;
}
function Lo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class fo extends Hp.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, Up.createHash)(n);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, n, r) {
    this.digester.update(t), r(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (n) {
        t(n);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, Xa.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Xa.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Ie.DigestTransform = fo;
function Vp(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function tn(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function Wp(e, t) {
  if (!Vp(tn(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const a = tn(t, "content-length");
    a != null && n.push(new qp.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new fo(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new fo(e.options.sha2, "sha256", "hex"));
  const i = (0, Bp.createWriteStream)(e.destination);
  n.push(i);
  let o = t;
  for (const a of n)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function kr(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Ur(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
Qr.MemoLazy = void 0;
class Xp {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && gc(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
Qr.MemoLazy = Xp;
function gc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => gc(e[a], t[a]));
  }
  return e === t;
}
var Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.githubUrl = zp;
Zr.getS3LikeProviderBaseUrl = Kp;
function zp(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Kp(e) {
  const t = e.provider;
  if (t === "s3")
    return Jp(e);
  if (t === "spaces")
    return Qp(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Jp(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return Ec(t, e.path);
}
function Ec(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Qp(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Ec(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
xo.retry = yc;
const Zp = gt;
async function yc(e, t, n, r = 0, i = 0, o) {
  var a;
  const s = new Zp.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((a = o == null ? void 0 : o(l)) !== null && a !== void 0) || a) && t > 0 && !s.cancelled)
      return await new Promise((m) => setTimeout(m, n + r * i)), await yc(e, t - 1, n, r, i + 1, o);
    throw l;
  }
}
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
ko.parseDn = em;
function em(e) {
  let t = !1, n = null, r = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      n !== null && o.set(n, r);
      break;
    }
    const s = e[a];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        a++;
        const l = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(l) ? r += e[a] : (a++, r += String.fromCharCode(l));
        continue;
      }
      if (n === null && s === "=") {
        n = r, r = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        n !== null && o.set(n, r), n = null, r = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (r.length === 0)
        continue;
      if (a > i) {
        let l = a;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    r += s;
  }
  return o;
}
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.nil = on.UUID = void 0;
const _c = Yn, vc = cn, tm = "options.name must be either a string or a Buffer", za = (0, _c.randomBytes)(16);
za[0] = za[0] | 1;
const $r = {}, V = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  $r[t] = e, V[e] = t;
}
class xt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = xt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return nm(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = rm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: ($r[t[14] + t[15]] & 240) >> 4,
        variant: Ka(($r[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < n + 16)
        return !1;
      let r = 0;
      for (; r < 16 && t[n + r] === 0; r++)
        ;
      return r === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[n + 6] & 240) >> 4,
        variant: Ka((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, vc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = $r[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
on.UUID = xt;
xt.OID = xt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Ka(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var On;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(On || (On = {}));
function nm(e, t, n, r, i = On.ASCII) {
  const o = (0, _c.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, vc.newError)(tm, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case On.BINARY:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = s;
      break;
    case On.OBJECT:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = new xt(s);
      break;
    default:
      l = V[s[0]] + V[s[1]] + V[s[2]] + V[s[3]] + "-" + V[s[4]] + V[s[5]] + "-" + V[s[6] & 15 | n] + V[s[7]] + "-" + V[s[8] & 63 | 128] + V[s[9]] + "-" + V[s[10]] + V[s[11]] + V[s[12]] + V[s[13]] + V[s[14]] + V[s[15]];
      break;
  }
  return l;
}
function rm(e) {
  return V[e[0]] + V[e[1]] + V[e[2]] + V[e[3]] + "-" + V[e[4]] + V[e[5]] + "-" + V[e[6]] + V[e[7]] + "-" + V[e[8]] + V[e[9]] + "-" + V[e[10]] + V[e[11]] + V[e[12]] + V[e[13]] + V[e[14]] + V[e[15]];
}
on.nil = new xt("00000000-0000-0000-0000-000000000000");
var Xn = {}, wc = {};
(function(e) {
  (function(t) {
    t.parser = function(d, u) {
      return new r(d, u);
    }, t.SAXParser = r, t.SAXStream = c, t.createStream = m, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var n = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function r(d, u) {
      if (!(this instanceof r))
        return new r(d, u);
      var C = this;
      o(C), C.q = C.c = "", C.bufferCheckPosition = t.MAX_BUFFER_LENGTH, C.opt = u || {}, C.opt.lowercase = C.opt.lowercase || C.opt.lowercasetags, C.looseCase = C.opt.lowercase ? "toLowerCase" : "toUpperCase", C.tags = [], C.closed = C.closedRoot = C.sawRoot = !1, C.tag = C.error = null, C.strict = !!d, C.noscript = !!(d || C.opt.noscript), C.state = E.BEGIN, C.strictEntities = C.opt.strictEntities, C.ENTITIES = C.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), C.attribList = [], C.opt.xmlns && (C.ns = Object.create(y)), C.opt.unquotedAttributeValues === void 0 && (C.opt.unquotedAttributeValues = !d), C.trackPosition = C.opt.position !== !1, C.trackPosition && (C.position = C.line = C.column = 0), H(C, "onready");
    }
    Object.create || (Object.create = function(d) {
      function u() {
      }
      u.prototype = d;
      var C = new u();
      return C;
    }), Object.keys || (Object.keys = function(d) {
      var u = [];
      for (var C in d) d.hasOwnProperty(C) && u.push(C);
      return u;
    });
    function i(d) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), C = 0, v = 0, X = n.length; v < X; v++) {
        var ee = d[n[v]].length;
        if (ee > u)
          switch (n[v]) {
            case "textNode":
              J(d);
              break;
            case "cdata":
              B(d, "oncdata", d.cdata), d.cdata = "";
              break;
            case "script":
              B(d, "onscript", d.script), d.script = "";
              break;
            default:
              I(d, "Max buffer length exceeded: " + n[v]);
          }
        C = Math.max(C, ee);
      }
      var ae = t.MAX_BUFFER_LENGTH - C;
      d.bufferCheckPosition = ae + d.position;
    }
    function o(d) {
      for (var u = 0, C = n.length; u < C; u++)
        d[n[u]] = "";
    }
    function a(d) {
      J(d), d.cdata !== "" && (B(d, "oncdata", d.cdata), d.cdata = ""), d.script !== "" && (B(d, "onscript", d.script), d.script = "");
    }
    r.prototype = {
      end: function() {
        D(this);
      },
      write: We,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
    });
    var l = t.EVENTS.filter(function(d) {
      return d !== "error" && d !== "end";
    });
    function m(d, u) {
      return new c(d, u);
    }
    function c(d, u) {
      if (!(this instanceof c))
        return new c(d, u);
      s.apply(this), this._parser = new r(d, u), this.writable = !0, this.readable = !0;
      var C = this;
      this._parser.onend = function() {
        C.emit("end");
      }, this._parser.onerror = function(v) {
        C.emit("error", v), C._parser.error = null;
      }, this._decoder = null, l.forEach(function(v) {
        Object.defineProperty(C, "on" + v, {
          get: function() {
            return C._parser["on" + v];
          },
          set: function(X) {
            if (!X)
              return C.removeAllListeners(v), C._parser["on" + v] = X, X;
            C.on(v, X);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(s.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype.write = function(d) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(d)) {
        if (!this._decoder) {
          var u = Wf.StringDecoder;
          this._decoder = new u("utf8");
        }
        d = this._decoder.write(d);
      }
      return this._parser.write(d.toString()), this.emit("data", d), !0;
    }, c.prototype.end = function(d) {
      return d && d.length && this.write(d), this._parser.end(), !0;
    }, c.prototype.on = function(d, u) {
      var C = this;
      return !C._parser["on" + d] && l.indexOf(d) !== -1 && (C._parser["on" + d] = function() {
        var v = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        v.splice(0, 0, d), C.emit.apply(C, v);
      }), s.prototype.on.call(C, d, u);
    };
    var f = "[CDATA[", h = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", w = "http://www.w3.org/2000/xmlns/", y = { xml: g, xmlns: w }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, S = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, F = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(d) {
      return d === " " || d === `
` || d === "\r" || d === "	";
    }
    function re(d) {
      return d === '"' || d === "'";
    }
    function le(d) {
      return d === ">" || x(d);
    }
    function W(d, u) {
      return d.test(u);
    }
    function Le(d, u) {
      return !W(d, u);
    }
    var E = 0;
    t.STATE = {
      BEGIN: E++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: E++,
      // leading whitespace
      TEXT: E++,
      // general stuff
      TEXT_ENTITY: E++,
      // &amp and such.
      OPEN_WAKA: E++,
      // <
      SGML_DECL: E++,
      // <!BLARG
      SGML_DECL_QUOTED: E++,
      // <!BLARG foo "bar
      DOCTYPE: E++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: E++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: E++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: E++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: E++,
      // <!-
      COMMENT: E++,
      // <!--
      COMMENT_ENDING: E++,
      // <!-- blah -
      COMMENT_ENDED: E++,
      // <!-- blah --
      CDATA: E++,
      // <![CDATA[ something
      CDATA_ENDING: E++,
      // ]
      CDATA_ENDING_2: E++,
      // ]]
      PROC_INST: E++,
      // <?hi
      PROC_INST_BODY: E++,
      // <?hi there
      PROC_INST_ENDING: E++,
      // <?hi "there" ?
      OPEN_TAG: E++,
      // <strong
      OPEN_TAG_SLASH: E++,
      // <strong /
      ATTRIB: E++,
      // <a
      ATTRIB_NAME: E++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: E++,
      // <a foo _
      ATTRIB_VALUE: E++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: E++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: E++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: E++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: E++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: E++,
      // <foo bar=&quot
      CLOSE_TAG: E++,
      // </a
      CLOSE_TAG_SAW_WHITE: E++,
      // </a   >
      SCRIPT: E++,
      // <script> ...
      SCRIPT_ENDING: E++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(d) {
      var u = t.ENTITIES[d], C = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[d] = C;
    });
    for (var G in t.STATE)
      t.STATE[t.STATE[G]] = G;
    E = t.STATE;
    function H(d, u, C) {
      d[u] && d[u](C);
    }
    function B(d, u, C) {
      d.textNode && J(d), H(d, u, C);
    }
    function J(d) {
      d.textNode = N(d.opt, d.textNode), d.textNode && H(d, "ontext", d.textNode), d.textNode = "";
    }
    function N(d, u) {
      return d.trim && (u = u.trim()), d.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function I(d, u) {
      return J(d), d.trackPosition && (u += `
Line: ` + d.line + `
Column: ` + d.column + `
Char: ` + d.c), u = new Error(u), d.error = u, H(d, "onerror", u), d;
    }
    function D(d) {
      return d.sawRoot && !d.closedRoot && O(d, "Unclosed root tag"), d.state !== E.BEGIN && d.state !== E.BEGIN_WHITESPACE && d.state !== E.TEXT && I(d, "Unexpected end"), J(d), d.c = "", d.closed = !0, H(d, "onend"), r.call(d, d.strict, d.opt), d;
    }
    function O(d, u) {
      if (typeof d != "object" || !(d instanceof r))
        throw new Error("bad call to strictFail");
      d.strict && I(d, u);
    }
    function $(d) {
      d.strict || (d.tagName = d.tagName[d.looseCase]());
      var u = d.tags[d.tags.length - 1] || d, C = d.tag = { name: d.tagName, attributes: {} };
      d.opt.xmlns && (C.ns = u.ns), d.attribList.length = 0, B(d, "onopentagstart", C);
    }
    function R(d, u) {
      var C = d.indexOf(":"), v = C < 0 ? ["", d] : d.split(":"), X = v[0], ee = v[1];
      return u && d === "xmlns" && (X = "xmlns", ee = ""), { prefix: X, local: ee };
    }
    function M(d) {
      if (d.strict || (d.attribName = d.attribName[d.looseCase]()), d.attribList.indexOf(d.attribName) !== -1 || d.tag.attributes.hasOwnProperty(d.attribName)) {
        d.attribName = d.attribValue = "";
        return;
      }
      if (d.opt.xmlns) {
        var u = R(d.attribName, !0), C = u.prefix, v = u.local;
        if (C === "xmlns")
          if (v === "xml" && d.attribValue !== g)
            O(
              d,
              "xml: prefix must be bound to " + g + `
Actual: ` + d.attribValue
            );
          else if (v === "xmlns" && d.attribValue !== w)
            O(
              d,
              "xmlns: prefix must be bound to " + w + `
Actual: ` + d.attribValue
            );
          else {
            var X = d.tag, ee = d.tags[d.tags.length - 1] || d;
            X.ns === ee.ns && (X.ns = Object.create(ee.ns)), X.ns[v] = d.attribValue;
          }
        d.attribList.push([d.attribName, d.attribValue]);
      } else
        d.tag.attributes[d.attribName] = d.attribValue, B(d, "onattribute", {
          name: d.attribName,
          value: d.attribValue
        });
      d.attribName = d.attribValue = "";
    }
    function Y(d, u) {
      if (d.opt.xmlns) {
        var C = d.tag, v = R(d.tagName);
        C.prefix = v.prefix, C.local = v.local, C.uri = C.ns[v.prefix] || "", C.prefix && !C.uri && (O(
          d,
          "Unbound namespace prefix: " + JSON.stringify(d.tagName)
        ), C.uri = v.prefix);
        var X = d.tags[d.tags.length - 1] || d;
        C.ns && X.ns !== C.ns && Object.keys(C.ns).forEach(function(rr) {
          B(d, "onopennamespace", {
            prefix: rr,
            uri: C.ns[rr]
          });
        });
        for (var ee = 0, ae = d.attribList.length; ee < ae; ee++) {
          var ge = d.attribList[ee], ve = ge[0], ot = ge[1], ue = R(ve, !0), He = ue.prefix, gi = ue.local, nr = He === "" ? "" : C.ns[He] || "", dn = {
            name: ve,
            value: ot,
            prefix: He,
            local: gi,
            uri: nr
          };
          He && He !== "xmlns" && !nr && (O(
            d,
            "Unbound namespace prefix: " + JSON.stringify(He)
          ), dn.uri = He), d.tag.attributes[ve] = dn, B(d, "onattribute", dn);
        }
        d.attribList.length = 0;
      }
      d.tag.isSelfClosing = !!u, d.sawRoot = !0, d.tags.push(d.tag), B(d, "onopentag", d.tag), u || (!d.noscript && d.tagName.toLowerCase() === "script" ? d.state = E.SCRIPT : d.state = E.TEXT, d.tag = null, d.tagName = ""), d.attribName = d.attribValue = "", d.attribList.length = 0;
    }
    function j(d) {
      if (!d.tagName) {
        O(d, "Weird empty close tag."), d.textNode += "</>", d.state = E.TEXT;
        return;
      }
      if (d.script) {
        if (d.tagName !== "script") {
          d.script += "</" + d.tagName + ">", d.tagName = "", d.state = E.SCRIPT;
          return;
        }
        B(d, "onscript", d.script), d.script = "";
      }
      var u = d.tags.length, C = d.tagName;
      d.strict || (C = C[d.looseCase]());
      for (var v = C; u--; ) {
        var X = d.tags[u];
        if (X.name !== v)
          O(d, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        O(d, "Unmatched closing tag: " + d.tagName), d.textNode += "</" + d.tagName + ">", d.state = E.TEXT;
        return;
      }
      d.tagName = C;
      for (var ee = d.tags.length; ee-- > u; ) {
        var ae = d.tag = d.tags.pop();
        d.tagName = d.tag.name, B(d, "onclosetag", d.tagName);
        var ge = {};
        for (var ve in ae.ns)
          ge[ve] = ae.ns[ve];
        var ot = d.tags[d.tags.length - 1] || d;
        d.opt.xmlns && ae.ns !== ot.ns && Object.keys(ae.ns).forEach(function(ue) {
          var He = ae.ns[ue];
          B(d, "onclosenamespace", { prefix: ue, uri: He });
        });
      }
      u === 0 && (d.closedRoot = !0), d.tagName = d.attribValue = d.attribName = "", d.attribList.length = 0, d.state = E.TEXT;
    }
    function Q(d) {
      var u = d.entity, C = u.toLowerCase(), v, X = "";
      return d.ENTITIES[u] ? d.ENTITIES[u] : d.ENTITIES[C] ? d.ENTITIES[C] : (u = C, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), v = parseInt(u, 16), X = v.toString(16)) : (u = u.slice(1), v = parseInt(u, 10), X = v.toString(10))), u = u.replace(/^0+/, ""), isNaN(v) || X.toLowerCase() !== u || v < 0 || v > 1114111 ? (O(d, "Invalid character entity"), "&" + d.entity + ";") : String.fromCodePoint(v));
    }
    function de(d, u) {
      u === "<" ? (d.state = E.OPEN_WAKA, d.startTagPosition = d.position) : x(u) || (O(d, "Non-whitespace before first tag."), d.textNode = u, d.state = E.TEXT);
    }
    function U(d, u) {
      var C = "";
      return u < d.length && (C = d.charAt(u)), C;
    }
    function We(d) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return I(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (d === null)
        return D(u);
      typeof d == "object" && (d = d.toString());
      for (var C = 0, v = ""; v = U(d, C++), u.c = v, !!v; )
        switch (u.trackPosition && (u.position++, v === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case E.BEGIN:
            if (u.state = E.BEGIN_WHITESPACE, v === "\uFEFF")
              continue;
            de(u, v);
            continue;
          case E.BEGIN_WHITESPACE:
            de(u, v);
            continue;
          case E.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var ee = C - 1; v && v !== "<" && v !== "&"; )
                v = U(d, C++), v && u.trackPosition && (u.position++, v === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += d.substring(ee, C - 1);
            }
            v === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = E.OPEN_WAKA, u.startTagPosition = u.position) : (!x(v) && (!u.sawRoot || u.closedRoot) && O(u, "Text data outside of root node."), v === "&" ? u.state = E.TEXT_ENTITY : u.textNode += v);
            continue;
          case E.SCRIPT:
            v === "<" ? u.state = E.SCRIPT_ENDING : u.script += v;
            continue;
          case E.SCRIPT_ENDING:
            v === "/" ? u.state = E.CLOSE_TAG : (u.script += "<" + v, u.state = E.SCRIPT);
            continue;
          case E.OPEN_WAKA:
            if (v === "!")
              u.state = E.SGML_DECL, u.sgmlDecl = "";
            else if (!x(v)) if (W(T, v))
              u.state = E.OPEN_TAG, u.tagName = v;
            else if (v === "/")
              u.state = E.CLOSE_TAG, u.tagName = "";
            else if (v === "?")
              u.state = E.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (O(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var X = u.position - u.startTagPosition;
                v = new Array(X).join(" ") + v;
              }
              u.textNode += "<" + v, u.state = E.TEXT;
            }
            continue;
          case E.SGML_DECL:
            if (u.sgmlDecl + v === "--") {
              u.state = E.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = E.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + v, u.sgmlDecl = "") : (u.sgmlDecl + v).toUpperCase() === f ? (B(u, "onopencdata"), u.state = E.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + v).toUpperCase() === h ? (u.state = E.DOCTYPE, (u.doctype || u.sawRoot) && O(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : v === ">" ? (B(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = E.TEXT) : (re(v) && (u.state = E.SGML_DECL_QUOTED), u.sgmlDecl += v);
            continue;
          case E.SGML_DECL_QUOTED:
            v === u.q && (u.state = E.SGML_DECL, u.q = ""), u.sgmlDecl += v;
            continue;
          case E.DOCTYPE:
            v === ">" ? (u.state = E.TEXT, B(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += v, v === "[" ? u.state = E.DOCTYPE_DTD : re(v) && (u.state = E.DOCTYPE_QUOTED, u.q = v));
            continue;
          case E.DOCTYPE_QUOTED:
            u.doctype += v, v === u.q && (u.q = "", u.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            v === "]" ? (u.doctype += v, u.state = E.DOCTYPE) : v === "<" ? (u.state = E.OPEN_WAKA, u.startTagPosition = u.position) : re(v) ? (u.doctype += v, u.state = E.DOCTYPE_DTD_QUOTED, u.q = v) : u.doctype += v;
            continue;
          case E.DOCTYPE_DTD_QUOTED:
            u.doctype += v, v === u.q && (u.state = E.DOCTYPE_DTD, u.q = "");
            continue;
          case E.COMMENT:
            v === "-" ? u.state = E.COMMENT_ENDING : u.comment += v;
            continue;
          case E.COMMENT_ENDING:
            v === "-" ? (u.state = E.COMMENT_ENDED, u.comment = N(u.opt, u.comment), u.comment && B(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + v, u.state = E.COMMENT);
            continue;
          case E.COMMENT_ENDED:
            v !== ">" ? (O(u, "Malformed comment"), u.comment += "--" + v, u.state = E.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = E.DOCTYPE_DTD : u.state = E.TEXT;
            continue;
          case E.CDATA:
            for (var ee = C - 1; v && v !== "]"; )
              v = U(d, C++), v && u.trackPosition && (u.position++, v === `
` ? (u.line++, u.column = 0) : u.column++);
            u.cdata += d.substring(ee, C - 1), v === "]" && (u.state = E.CDATA_ENDING);
            continue;
          case E.CDATA_ENDING:
            v === "]" ? u.state = E.CDATA_ENDING_2 : (u.cdata += "]" + v, u.state = E.CDATA);
            continue;
          case E.CDATA_ENDING_2:
            v === ">" ? (u.cdata && B(u, "oncdata", u.cdata), B(u, "onclosecdata"), u.cdata = "", u.state = E.TEXT) : v === "]" ? u.cdata += "]" : (u.cdata += "]]" + v, u.state = E.CDATA);
            continue;
          case E.PROC_INST:
            v === "?" ? u.state = E.PROC_INST_ENDING : x(v) ? u.state = E.PROC_INST_BODY : u.procInstName += v;
            continue;
          case E.PROC_INST_BODY:
            if (!u.procInstBody && x(v))
              continue;
            v === "?" ? u.state = E.PROC_INST_ENDING : u.procInstBody += v;
            continue;
          case E.PROC_INST_ENDING:
            v === ">" ? (B(u, "onprocessinginstruction", {
              name: u.procInstName,
              body: u.procInstBody
            }), u.procInstName = u.procInstBody = "", u.state = E.TEXT) : (u.procInstBody += "?" + v, u.state = E.PROC_INST_BODY);
            continue;
          case E.OPEN_TAG:
            W(A, v) ? u.tagName += v : ($(u), v === ">" ? Y(u) : v === "/" ? u.state = E.OPEN_TAG_SLASH : (x(v) || O(u, "Invalid character in tag name"), u.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            v === ">" ? (Y(u, !0), j(u)) : (O(
              u,
              "Forward-slash in opening tag not followed by >"
            ), u.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (x(v))
              continue;
            v === ">" ? Y(u) : v === "/" ? u.state = E.OPEN_TAG_SLASH : W(T, v) ? (u.attribName = v, u.attribValue = "", u.state = E.ATTRIB_NAME) : O(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            v === "=" ? u.state = E.ATTRIB_VALUE : v === ">" ? (O(u, "Attribute without value"), u.attribValue = u.attribName, M(u), Y(u)) : x(v) ? u.state = E.ATTRIB_NAME_SAW_WHITE : W(A, v) ? u.attribName += v : O(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME_SAW_WHITE:
            if (v === "=")
              u.state = E.ATTRIB_VALUE;
            else {
              if (x(v))
                continue;
              O(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", B(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", v === ">" ? Y(u) : W(T, v) ? (u.attribName = v, u.state = E.ATTRIB_NAME) : (O(u, "Invalid attribute name"), u.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (x(v))
              continue;
            re(v) ? (u.q = v, u.state = E.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || I(u, "Unquoted attribute value"), u.state = E.ATTRIB_VALUE_UNQUOTED, u.attribValue = v);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (v !== u.q) {
              v === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_Q : u.attribValue += v;
              continue;
            }
            M(u), u.q = "", u.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            x(v) ? u.state = E.ATTRIB : v === ">" ? Y(u) : v === "/" ? u.state = E.OPEN_TAG_SLASH : W(T, v) ? (O(u, "No whitespace between attributes"), u.attribName = v, u.attribValue = "", u.state = E.ATTRIB_NAME) : O(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!le(v)) {
              v === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_U : u.attribValue += v;
              continue;
            }
            M(u), v === ">" ? Y(u) : u.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (u.tagName)
              v === ">" ? j(u) : W(A, v) ? u.tagName += v : u.script ? (u.script += "</" + u.tagName, u.tagName = "", u.state = E.SCRIPT) : (x(v) || O(u, "Invalid tagname in closing tag"), u.state = E.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(v))
                continue;
              Le(T, v) ? u.script ? (u.script += "</" + v, u.state = E.SCRIPT) : O(u, "Invalid tagname in closing tag.") : u.tagName = v;
            }
            continue;
          case E.CLOSE_TAG_SAW_WHITE:
            if (x(v))
              continue;
            v === ">" ? j(u) : O(u, "Invalid characters in closing tag");
            continue;
          case E.TEXT_ENTITY:
          case E.ATTRIB_VALUE_ENTITY_Q:
          case E.ATTRIB_VALUE_ENTITY_U:
            var ae, ge;
            switch (u.state) {
              case E.TEXT_ENTITY:
                ae = E.TEXT, ge = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                ae = E.ATTRIB_VALUE_QUOTED, ge = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                ae = E.ATTRIB_VALUE_UNQUOTED, ge = "attribValue";
                break;
            }
            if (v === ";") {
              var ve = Q(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ve) ? (u.entity = "", u.state = ae, u.write(ve)) : (u[ge] += ve, u.entity = "", u.state = ae);
            } else W(u.entity.length ? F : S, v) ? u.entity += v : (O(u, "Invalid character in entity name"), u[ge] += "&" + u.entity + v, u.entity = "", u.state = ae);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var d = String.fromCharCode, u = Math.floor, C = function() {
        var v = 16384, X = [], ee, ae, ge = -1, ve = arguments.length;
        if (!ve)
          return "";
        for (var ot = ""; ++ge < ve; ) {
          var ue = Number(arguments[ge]);
          if (!isFinite(ue) || // `NaN`, `+Infinity`, or `-Infinity`
          ue < 0 || // not a valid Unicode code point
          ue > 1114111 || // not a valid Unicode code point
          u(ue) !== ue)
            throw RangeError("Invalid code point: " + ue);
          ue <= 65535 ? X.push(ue) : (ue -= 65536, ee = (ue >> 10) + 55296, ae = ue % 1024 + 56320, X.push(ee, ae)), (ge + 1 === ve || X.length > v) && (ot += d.apply(null, X), X.length = 0);
        }
        return ot;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: C,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = C;
    }();
  })(e);
})(wc);
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.XElement = void 0;
Xn.parseXml = sm;
const im = wc, Er = cn;
class Tc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Er.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!am(t))
      throw (0, Er.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, Er.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, Er.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (Ja(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => Ja(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
Xn.XElement = Tc;
const om = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function am(e) {
  return om.test(e);
}
function Ja(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function sm(e) {
  let t = null;
  const n = im.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new Tc(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = r[r.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    r.push(o);
  }, n.onclosetag = () => {
    r.pop();
  }, n.ontext = (i) => {
    r.length > 0 && (r[r.length - 1].value = i);
  }, n.oncdata = (i) => {
    const o = r[r.length - 1];
    o.value = i, o.isCData = !0;
  }, n.onerror = (i) => {
    throw i;
  }, n.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = gt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = cn;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = Ie;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return r.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return r.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return r.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return r.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return r.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return r.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return r.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return r.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return r.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return r.safeStringifyJson;
  } });
  var i = Qr;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = Wn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = Zr;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } });
  var s = xo;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = ko;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var m = on;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return m.UUID;
  } });
  var c = Xn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(me);
var _e = {}, Uo = {}, Ge = {};
function Sc(e) {
  return typeof e > "u" || e === null;
}
function lm(e) {
  return typeof e == "object" && e !== null;
}
function cm(e) {
  return Array.isArray(e) ? e : Sc(e) ? [] : [e];
}
function um(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function fm(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function dm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ge.isNothing = Sc;
Ge.isObject = lm;
Ge.toArray = cm;
Ge.repeat = fm;
Ge.isNegativeZero = dm;
Ge.extend = um;
function Ac(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Pn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Ac(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Pn.prototype = Object.create(Error.prototype);
Pn.prototype.constructor = Pn;
Pn.prototype.toString = function(t) {
  return this.name + ": " + Ac(this, t);
};
var zn = Pn, Tn = Ge;
function Pi(e, t, n, r, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return r - t > s && (o = " ... ", t = r - s + o.length), n - r > s && (a = " ...", n = r + s - a.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + a,
    pos: r - t + o.length
    // relative position
  };
}
function Fi(e, t) {
  return Tn.repeat(" ", t - e.length) + e;
}
function hm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, a = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = r.length - 2);
  a < 0 && (a = r.length - 1);
  var s = "", l, m, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    m = Pi(
      e.buffer,
      r[a - l],
      i[a - l],
      e.position - (r[a] - r[a - l]),
      f
    ), s = Tn.repeat(" ", t.indent) + Fi((e.line - l + 1).toString(), c) + " | " + m.str + `
` + s;
  for (m = Pi(e.buffer, r[a], i[a], e.position, f), s += Tn.repeat(" ", t.indent) + Fi((e.line + 1).toString(), c) + " | " + m.str + `
`, s += Tn.repeat("-", t.indent + c + 3 + m.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    m = Pi(
      e.buffer,
      r[a + l],
      i[a + l],
      e.position - (r[a] - r[a + l]),
      f
    ), s += Tn.repeat(" ", t.indent) + Fi((e.line + l + 1).toString(), c) + " | " + m.str + `
`;
  return s.replace(/\n$/, "");
}
var pm = hm, Qa = zn, mm = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], gm = [
  "scalar",
  "sequence",
  "mapping"
];
function Em(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function ym(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (mm.indexOf(n) === -1)
      throw new Qa('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Em(t.styleAliases || null), gm.indexOf(this.kind) === -1)
    throw new Qa('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var De = ym, yn = zn, Li = De;
function Za(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, a) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = a);
    }), n[i] = r;
  }), n;
}
function _m() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, n;
  function r(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, n = arguments.length; t < n; t += 1)
    arguments[t].forEach(r);
  return e;
}
function ho(e) {
  return this.extend(e);
}
ho.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof Li)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new yn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Li))
      throw new yn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new yn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new yn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Li))
      throw new yn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(ho.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = Za(i, "implicit"), i.compiledExplicit = Za(i, "explicit"), i.compiledTypeMap = _m(i.compiledImplicit, i.compiledExplicit), i;
};
var Cc = ho, vm = De, Oc = new vm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), wm = De, Ic = new wm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Tm = De, bc = new Tm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Sm = Cc, Nc = new Sm({
  explicit: [
    Oc,
    Ic,
    bc
  ]
}), Am = De;
function Cm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Om() {
  return null;
}
function Im(e) {
  return e === null;
}
var Rc = new Am("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Cm,
  construct: Om,
  predicate: Im,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), bm = De;
function Nm(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Rm(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Dm(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Dc = new bm("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Nm,
  construct: Rm,
  predicate: Dm,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), $m = Ge, Pm = De;
function Fm(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Lm(e) {
  return 48 <= e && e <= 55;
}
function xm(e) {
  return 48 <= e && e <= 57;
}
function km(e) {
  if (e === null) return !1;
  var t = e.length, n = 0, r = !1, i;
  if (!t) return !1;
  if (i = e[n], (i === "-" || i === "+") && (i = e[++n]), i === "0") {
    if (n + 1 === t) return !0;
    if (i = e[++n], i === "b") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "x") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!Fm(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!Lm(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!xm(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function Um(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function Mm(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !$m.isNegativeZero(e);
}
var $c = new Pm("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: km,
  construct: Um,
  predicate: Mm,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), Pc = Ge, Bm = De, Hm = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function jm(e) {
  return !(e === null || !Hm.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function qm(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var Gm = /^[-+]?[0-9]+e/;
function Ym(e, t) {
  var n;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (Pc.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), Gm.test(n) ? n.replace("e", ".e") : n;
}
function Vm(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Pc.isNegativeZero(e));
}
var Fc = new Bm("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: jm,
  construct: qm,
  predicate: Vm,
  represent: Ym,
  defaultStyle: "lowercase"
}), Lc = Nc.extend({
  implicit: [
    Rc,
    Dc,
    $c,
    Fc
  ]
}), xc = Lc, Wm = De, kc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Uc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Xm(e) {
  return e === null ? !1 : kc.exec(e) !== null || Uc.exec(e) !== null;
}
function zm(e) {
  var t, n, r, i, o, a, s, l = 0, m = null, c, f, h;
  if (t = kc.exec(e), t === null && (t = Uc.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), m = (c * 60 + f) * 6e4, t[9] === "-" && (m = -m)), h = new Date(Date.UTC(n, r, i, o, a, s, l)), m && h.setTime(h.getTime() - m), h;
}
function Km(e) {
  return e.toISOString();
}
var Mc = new Wm("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Xm,
  construct: zm,
  instanceOf: Date,
  represent: Km
}), Jm = De;
function Qm(e) {
  return e === "<<" || e === null;
}
var Bc = new Jm("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Qm
}), Zm = De, Mo = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function eg(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = Mo;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function tg(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = Mo, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : n === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : n === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function ng(e) {
  var t = "", n = 0, r, i, o = e.length, a = Mo;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : i === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : i === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
}
function rg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Hc = new Zm("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: eg,
  construct: tg,
  predicate: rg,
  represent: ng
}), ig = De, og = Object.prototype.hasOwnProperty, ag = Object.prototype.toString;
function sg(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, a, s = e;
  for (n = 0, r = s.length; n < r; n += 1) {
    if (i = s[n], a = !1, ag.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (og.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function lg(e) {
  return e !== null ? e : [];
}
var jc = new ig("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: sg,
  construct: lg
}), cg = De, ug = Object.prototype.toString;
function fg(e) {
  if (e === null) return !0;
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1) {
    if (r = a[t], ug.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function dg(e) {
  if (e === null) return [];
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1)
    r = a[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var qc = new cg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: fg,
  construct: dg
}), hg = De, pg = Object.prototype.hasOwnProperty;
function mg(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (pg.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function gg(e) {
  return e !== null ? e : {};
}
var Gc = new hg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: mg,
  construct: gg
}), Bo = xc.extend({
  implicit: [
    Mc,
    Bc
  ],
  explicit: [
    Hc,
    jc,
    qc,
    Gc
  ]
}), Dt = Ge, Yc = zn, Eg = pm, yg = Bo, Et = Object.prototype.hasOwnProperty, Mr = 1, Vc = 2, Wc = 3, Br = 4, xi = 1, _g = 2, es = 3, vg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, wg = /[\x85\u2028\u2029]/, Tg = /[,\[\]\{\}]/, Xc = /^(?:!|!!|![a-z\-]+!)$/i, zc = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function ts(e) {
  return Object.prototype.toString.call(e);
}
function Je(e) {
  return e === 10 || e === 13;
}
function Ft(e) {
  return e === 9 || e === 32;
}
function Fe(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Xt(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Sg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Ag(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Cg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function ns(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Og(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function Kc(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var Jc = new Array(256), Qc = new Array(256);
for (var jt = 0; jt < 256; jt++)
  Jc[jt] = ns(jt) ? 1 : 0, Qc[jt] = ns(jt);
function Ig(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || yg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Zc(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = Eg(n), new Yc(t, n);
}
function k(e, t) {
  throw Zc(e, t);
}
function Hr(e, t) {
  e.onWarning && e.onWarning.call(null, Zc(e, t));
}
var rs = {
  YAML: function(t, n, r) {
    var i, o, a;
    t.version !== null && k(t, "duplication of %YAML directive"), r.length !== 1 && k(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && k(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && k(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Hr(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && k(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], Xc.test(i) || k(t, "ill-formed tag handle (first argument) of the TAG directive"), Et.call(t.tagMap, i) && k(t, 'there is a previously declared suffix for "' + i + '" tag handle'), zc.test(o) || k(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      k(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function pt(e, t, n, r) {
  var i, o, a, s;
  if (t < n) {
    if (s = e.input.slice(t, n), r)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || k(e, "expected valid JSON character");
    else vg.test(s) && k(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function is(e, t, n, r) {
  var i, o, a, s;
  for (Dt.isObject(n) || k(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), a = 0, s = i.length; a < s; a += 1)
    o = i[a], Et.call(t, o) || (Kc(t, o, n[o]), r[o] = !0);
}
function zt(e, t, n, r, i, o, a, s, l) {
  var m, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), m = 0, c = i.length; m < c; m += 1)
      Array.isArray(i[m]) && k(e, "nested arrays are not supported inside keys"), typeof i == "object" && ts(i[m]) === "[object Object]" && (i[m] = "[object Object]");
  if (typeof i == "object" && ts(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (m = 0, c = o.length; m < c; m += 1)
        is(e, t, o[m], n);
    else
      is(e, t, o, n);
  else
    !e.json && !Et.call(n, i) && Et.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, k(e, "duplicated mapping key")), Kc(t, i, o), delete n[i];
  return t;
}
function Ho(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : k(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ce(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Ft(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Je(i))
      for (Ho(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && Hr(e, "deficient indentation"), r;
}
function ei(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || Fe(n)));
}
function jo(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Dt.repeat(`
`, t - 1));
}
function bg(e, t, n) {
  var r, i, o, a, s, l, m, c, f = e.kind, h = e.result, g;
  if (g = e.input.charCodeAt(e.position), Fe(g) || Xt(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), Fe(i) || n && Xt(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Fe(i) || n && Xt(i))
        break;
    } else if (g === 35) {
      if (r = e.input.charCodeAt(e.position - 1), Fe(r))
        break;
    } else {
      if (e.position === e.lineStart && ei(e) || n && Xt(g))
        break;
      if (Je(g))
        if (l = e.line, m = e.lineStart, c = e.lineIndent, ce(e, !1, -1), e.lineIndent >= t) {
          s = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = m, e.lineIndent = c;
          break;
        }
    }
    s && (pt(e, o, a, !1), jo(e, e.line - l), o = a = e.position, s = !1), Ft(g) || (a = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return pt(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function Ng(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (pt(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else Je(n) ? (pt(e, r, i, !0), jo(e, ce(e, !1, t)), r = i = e.position) : e.position === e.lineStart && ei(e) ? k(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  k(e, "unexpected end of the stream within a single quoted scalar");
}
function Rg(e, t) {
  var n, r, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return pt(e, n, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (pt(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), Je(s))
        ce(e, !1, t);
      else if (s < 256 && Jc[s])
        e.result += Qc[s], e.position++;
      else if ((a = Ag(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = Sg(s)) >= 0 ? o = (o << 4) + a : k(e, "expected hexadecimal character");
        e.result += Og(o), e.position++;
      } else
        k(e, "unknown escape sequence");
      n = r = e.position;
    } else Je(s) ? (pt(e, n, r, !0), jo(e, ce(e, !1, t)), n = r = e.position) : e.position === e.lineStart && ei(e) ? k(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  k(e, "unexpected end of the stream within a double quoted scalar");
}
function Dg(e, t) {
  var n = !0, r, i, o, a = e.tag, s, l = e.anchor, m, c, f, h, g, w = /* @__PURE__ */ Object.create(null), y, T, A, S;
  if (S = e.input.charCodeAt(e.position), S === 91)
    c = 93, g = !1, s = [];
  else if (S === 123)
    c = 125, g = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), S = e.input.charCodeAt(++e.position); S !== 0; ) {
    if (ce(e, !0, t), S = e.input.charCodeAt(e.position), S === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = s, !0;
    n ? S === 44 && k(e, "expected the node content, but found ','") : k(e, "missed comma between flow collection entries"), T = y = A = null, f = h = !1, S === 63 && (m = e.input.charCodeAt(e.position + 1), Fe(m) && (f = h = !0, e.position++, ce(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, an(e, t, Mr, !1, !0), T = e.tag, y = e.result, ce(e, !0, t), S = e.input.charCodeAt(e.position), (h || e.line === r) && S === 58 && (f = !0, S = e.input.charCodeAt(++e.position), ce(e, !0, t), an(e, t, Mr, !1, !0), A = e.result), g ? zt(e, s, w, T, y, A, r, i, o) : f ? s.push(zt(e, null, w, T, y, A, r, i, o)) : s.push(y), ce(e, !0, t), S = e.input.charCodeAt(e.position), S === 44 ? (n = !0, S = e.input.charCodeAt(++e.position)) : n = !1;
  }
  k(e, "unexpected end of the stream within a flow collection");
}
function $g(e, t) {
  var n, r, i = xi, o = !1, a = !1, s = t, l = 0, m = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      xi === i ? i = f === 43 ? es : _g : k(e, "repeat of a chomping mode identifier");
    else if ((c = Cg(f)) >= 0)
      c === 0 ? k(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? k(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (Ft(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Ft(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!Je(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (Ho(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), Je(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === es ? e.result += Dt.repeat(`
`, o ? 1 + l : l) : i === xi && o && (e.result += `
`);
      break;
    }
    for (r ? Ft(f) ? (m = !0, e.result += Dt.repeat(`
`, o ? 1 + l : l)) : m ? (m = !1, e.result += Dt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Dt.repeat(`
`, l) : e.result += Dt.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, n = e.position; !Je(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    pt(e, n, e.position, !1);
  }
  return !0;
}
function os(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, k(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !Fe(a)))); ) {
    if (s = !0, e.position++, ce(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, an(e, t, Wc, !1, !0), o.push(e.result), ce(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      k(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function Pg(e, t, n) {
  var r, i, o, a, s, l, m = e.tag, c = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), g = null, w = null, y = null, T = !1, A = !1, S;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), S = e.input.charCodeAt(e.position); S !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, k(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (S === 63 || S === 58) && Fe(r))
      S === 63 ? (T && (zt(e, f, h, g, w, null, a, s, l), g = w = y = null), A = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : k(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, S = r;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !an(e, n, Vc, !1, !0))
        break;
      if (e.line === o) {
        for (S = e.input.charCodeAt(e.position); Ft(S); )
          S = e.input.charCodeAt(++e.position);
        if (S === 58)
          S = e.input.charCodeAt(++e.position), Fe(S) || k(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (zt(e, f, h, g, w, null, a, s, l), g = w = y = null), A = !0, T = !1, i = !1, g = e.tag, w = e.result;
        else if (A)
          k(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = m, e.anchor = c, !0;
      } else if (A)
        k(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = m, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (T && (a = e.line, s = e.lineStart, l = e.position), an(e, t, Br, !0, i) && (T ? w = e.result : y = e.result), T || (zt(e, f, h, g, w, y, a, s, l), g = w = y = null), ce(e, !0, -1), S = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && S !== 0)
      k(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && zt(e, f, h, g, w, null, a, s, l), A && (e.tag = m, e.anchor = c, e.kind = "mapping", e.result = f), A;
}
function Fg(e) {
  var t, n = !1, r = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && k(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (n = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (r = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : k(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Fe(a); )
      a === 33 && (r ? k(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Xc.test(i) || k(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), Tg.test(o) && k(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !zc.test(o) && k(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    k(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : Et.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : k(e, 'undeclared tag handle "' + i + '"'), !0;
}
function Lg(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && k(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Fe(n) && !Xt(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && k(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function xg(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Fe(r) && !Xt(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && k(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), Et.call(e.anchorMap, n) || k(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], ce(e, !0, -1), !0;
}
function an(e, t, n, r, i) {
  var o, a, s, l = 1, m = !1, c = !1, f, h, g, w, y, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = Br === n || Wc === n, r && ce(e, !0, -1) && (m = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; Fg(e) || Lg(e); )
      ce(e, !0, -1) ? (m = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = m || i), (l === 1 || Br === n) && (Mr === n || Vc === n ? y = t : y = t + 1, T = e.position - e.lineStart, l === 1 ? s && (os(e, T) || Pg(e, T, y)) || Dg(e, y) ? c = !0 : (a && $g(e, y) || Ng(e, y) || Rg(e, y) ? c = !0 : xg(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && k(e, "alias node should not have any properties")) : bg(e, y, Mr === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && os(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && k(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (w = e.implicitTypes[f], w.resolve(e.result)) {
        e.result = w.construct(e.result), e.tag = w.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Et.call(e.typeMap[e.kind || "fallback"], e.tag))
      w = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (w = null, g = e.typeMap.multi[e.kind || "fallback"], f = 0, h = g.length; f < h; f += 1)
        if (e.tag.slice(0, g[f].tag.length) === g[f].tag) {
          w = g[f];
          break;
        }
    w || k(e, "unknown tag !<" + e.tag + ">"), e.result !== null && w.kind !== e.kind && k(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + w.kind + '", not "' + e.kind + '"'), w.resolve(e.result, e.tag) ? (e.result = w.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : k(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function kg(e) {
  var t = e.position, n, r, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (ce(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), n = e.position; a !== 0 && !Fe(a); )
      a = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && k(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Ft(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !Je(a));
        break;
      }
      if (Je(a)) break;
      for (n = e.position; a !== 0 && !Fe(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    a !== 0 && Ho(e), Et.call(rs, r) ? rs[r](e, r, i) : Hr(e, 'unknown document directive "' + r + '"');
  }
  if (ce(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ce(e, !0, -1)) : o && k(e, "directives end mark is expected"), an(e, e.lineIndent - 1, Br, !1, !0), ce(e, !0, -1), e.checkLineBreaks && wg.test(e.input.slice(t, e.position)) && Hr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ei(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ce(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    k(e, "end of the stream or a document separator is expected");
  else
    return;
}
function eu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new Ig(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, k(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    kg(n);
  return n.documents;
}
function Ug(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = eu(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function Mg(e, t) {
  var n = eu(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new Yc("expected a single document in the stream, but found more");
  }
}
Uo.loadAll = Ug;
Uo.load = Mg;
var tu = {}, ti = Ge, Kn = zn, Bg = Bo, nu = Object.prototype.toString, ru = Object.prototype.hasOwnProperty, qo = 65279, Hg = 9, Fn = 10, jg = 13, qg = 32, Gg = 33, Yg = 34, po = 35, Vg = 37, Wg = 38, Xg = 39, zg = 42, iu = 44, Kg = 45, jr = 58, Jg = 61, Qg = 62, Zg = 63, e0 = 64, ou = 91, au = 93, t0 = 96, su = 123, n0 = 124, lu = 125, Se = {};
Se[0] = "\\0";
Se[7] = "\\a";
Se[8] = "\\b";
Se[9] = "\\t";
Se[10] = "\\n";
Se[11] = "\\v";
Se[12] = "\\f";
Se[13] = "\\r";
Se[27] = "\\e";
Se[34] = '\\"';
Se[92] = "\\\\";
Se[133] = "\\N";
Se[160] = "\\_";
Se[8232] = "\\L";
Se[8233] = "\\P";
var r0 = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], i0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function o0(e, t) {
  var n, r, i, o, a, s, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    a = r[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && ru.call(l.styleAliases, s) && (s = l.styleAliases[s]), n[a] = s;
  return n;
}
function a0(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new Kn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + ti.repeat("0", r - t.length) + t;
}
var s0 = 1, Ln = 2;
function l0(e) {
  this.schema = e.schema || Bg, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ti.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = o0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Ln : s0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function as(e, t) {
  for (var n = ti.repeat(" ", t), r = 0, i = -1, o = "", a, s = e.length; r < s; )
    i = e.indexOf(`
`, r), i === -1 ? (a = e.slice(r), r = s) : (a = e.slice(r, i + 1), r = i + 1), a.length && a !== `
` && (o += n), o += a;
  return o;
}
function mo(e, t) {
  return `
` + ti.repeat(" ", e.indent * t);
}
function c0(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function qr(e) {
  return e === qg || e === Hg;
}
function xn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== qo || 65536 <= e && e <= 1114111;
}
function ss(e) {
  return xn(e) && e !== qo && e !== jg && e !== Fn;
}
function ls(e, t, n) {
  var r = ss(e), i = r && !qr(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== iu && e !== ou && e !== au && e !== su && e !== lu) && e !== po && !(t === jr && !i) || ss(t) && !qr(t) && e === po || t === jr && i
  );
}
function u0(e) {
  return xn(e) && e !== qo && !qr(e) && e !== Kg && e !== Zg && e !== jr && e !== iu && e !== ou && e !== au && e !== su && e !== lu && e !== po && e !== Wg && e !== zg && e !== Gg && e !== n0 && e !== Jg && e !== Qg && e !== Xg && e !== Yg && e !== Vg && e !== e0 && e !== t0;
}
function f0(e) {
  return !qr(e) && e !== jr;
}
function Sn(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function cu(e) {
  var t = /^\n* /;
  return t.test(e);
}
var uu = 1, go = 2, fu = 3, du = 4, Wt = 5;
function d0(e, t, n, r, i, o, a, s) {
  var l, m = 0, c = null, f = !1, h = !1, g = r !== -1, w = -1, y = u0(Sn(e, 0)) && f0(Sn(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; m >= 65536 ? l += 2 : l++) {
      if (m = Sn(e, l), !xn(m))
        return Wt;
      y = y && ls(m, c, s), c = m;
    }
  else {
    for (l = 0; l < e.length; m >= 65536 ? l += 2 : l++) {
      if (m = Sn(e, l), m === Fn)
        f = !0, g && (h = h || // Foldable line = too long, and not more-indented.
        l - w - 1 > r && e[w + 1] !== " ", w = l);
      else if (!xn(m))
        return Wt;
      y = y && ls(m, c, s), c = m;
    }
    h = h || g && l - w - 1 > r && e[w + 1] !== " ";
  }
  return !f && !h ? y && !a && !i(e) ? uu : o === Ln ? Wt : go : n > 9 && cu(e) ? Wt : a ? o === Ln ? Wt : go : h ? du : fu;
}
function h0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Ln ? '""' : "''";
    if (!e.noCompatMode && (r0.indexOf(t) !== -1 || i0.test(t)))
      return e.quotingType === Ln ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(m) {
      return c0(e, m);
    }
    switch (d0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case uu:
        return t;
      case go:
        return "'" + t.replace(/'/g, "''") + "'";
      case fu:
        return "|" + cs(t, e.indent) + us(as(t, o));
      case du:
        return ">" + cs(t, e.indent) + us(as(p0(t, a), o));
      case Wt:
        return '"' + m0(t) + '"';
      default:
        throw new Kn("impossible error: invalid scalar style");
    }
  }();
}
function cs(e, t) {
  var n = cu(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function us(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function p0(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var m = e.indexOf(`
`);
    return m = m !== -1 ? m : e.length, n.lastIndex = m, fs(e.slice(0, m), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = n.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", r += s + (!i && !o && l !== "" ? `
` : "") + fs(l, t), i = o;
  }
  return r;
}
function fs(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, a = 0, s = 0, l = ""; r = n.exec(e); )
    s = r.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function m0(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = Sn(e, i), r = Se[n], !r && xn(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || a0(n);
  return t;
}
function g0(e, t, n) {
  var r = "", i = e.tag, o, a, s;
  for (o = 0, a = n.length; o < a; o += 1)
    s = n[o], e.replacer && (s = e.replacer.call(n, String(o), s)), (rt(e, t, s, !1, !1) || typeof s > "u" && rt(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function ds(e, t, n, r) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = n.length; a < s; a += 1)
    l = n[a], e.replacer && (l = e.replacer.call(n, String(a), l)), (rt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && rt(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += mo(e, t)), e.dump && Fn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function E0(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), a, s, l, m, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], m = n[l], e.replacer && (m = e.replacer.call(n, l, m)), rt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), rt(e, t, m, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function y0(e, t, n, r) {
  var i = "", o = e.tag, a = Object.keys(n), s, l, m, c, f, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Kn("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    h = "", (!r || i !== "") && (h += mo(e, t)), m = a[s], c = n[m], e.replacer && (c = e.replacer.call(n, m, c)), rt(e, t + 1, m, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Fn === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += mo(e, t)), rt(e, t + 1, c, !0, f) && (e.dump && Fn === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function hs(e, t, n) {
  var r, i, o, a, s, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, nu.call(s.represent) === "[object Function]")
          r = s.represent(t, l);
        else if (ru.call(s.represent, l))
          r = s.represent[l](t, l);
        else
          throw new Kn("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function rt(e, t, n, r, i, o, a) {
  e.tag = null, e.dump = n, hs(e, n, !1) || hs(e, n, !0);
  var s = nu.call(e.dump), l = r, m;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, h;
  if (c && (f = e.duplicates.indexOf(n), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (y0(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (E0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? ds(e, t - 1, e.dump, i) : ds(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (g0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && h0(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Kn("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (m = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? m = "!" + m : m.slice(0, 18) === "tag:yaml.org,2002:" ? m = "!!" + m.slice(18) : m = "!<" + m + ">", e.dump = m + " " + e.dump);
  }
  return !0;
}
function _0(e, t) {
  var n = [], r = [], i, o;
  for (Eo(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function Eo(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Eo(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        Eo(e[r[i]], t, n);
}
function v0(e, t) {
  t = t || {};
  var n = new l0(t);
  n.noRefs || _0(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), rt(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
tu.dump = v0;
var hu = Uo, w0 = tu;
function Go(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
_e.Type = De;
_e.Schema = Cc;
_e.FAILSAFE_SCHEMA = Nc;
_e.JSON_SCHEMA = Lc;
_e.CORE_SCHEMA = xc;
_e.DEFAULT_SCHEMA = Bo;
_e.load = hu.load;
_e.loadAll = hu.loadAll;
_e.dump = w0.dump;
_e.YAMLException = zn;
_e.types = {
  binary: Hc,
  float: Fc,
  map: bc,
  null: Rc,
  pairs: qc,
  set: Gc,
  timestamp: Mc,
  bool: Dc,
  int: $c,
  merge: Bc,
  omap: jc,
  seq: Ic,
  str: Oc
};
_e.safeLoad = Go("safeLoad", "load");
_e.safeLoadAll = Go("safeLoadAll", "loadAll");
_e.safeDump = Go("safeDump", "dump");
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
ni.Lazy = void 0;
class T0 {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
ni.Lazy = T0;
var yo = { exports: {} };
const S0 = "2.0.0", pu = 256, A0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, C0 = 16, O0 = pu - 6, I0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ri = {
  MAX_LENGTH: pu,
  MAX_SAFE_COMPONENT_LENGTH: C0,
  MAX_SAFE_BUILD_LENGTH: O0,
  MAX_SAFE_INTEGER: A0,
  RELEASE_TYPES: I0,
  SEMVER_SPEC_VERSION: S0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const b0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ii = b0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = ri, o = ii;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], m = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [h, r]
  ], w = (T) => {
    for (const [A, S] of g)
      T = T.split(`${A}*`).join(`${A}{0,${S}}`).split(`${A}+`).join(`${A}{1,${S}}`);
    return T;
  }, y = (T, A, S) => {
    const F = w(A), x = f++;
    o(T, x, A), c[T] = x, l[x] = A, m[x] = F, a[x] = new RegExp(A, S ? "g" : void 0), s[x] = new RegExp(F, S ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), y("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${h}+`), y("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), y("FULL", `^${l[c.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), y("LOOSE", `^${l[c.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), y("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), y("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[c.COERCE], !0), y("COERCERTLFULL", l[c.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(yo, yo.exports);
var Jn = yo.exports;
const N0 = Object.freeze({ loose: !0 }), R0 = Object.freeze({}), D0 = (e) => e ? typeof e != "object" ? N0 : e : R0;
var Yo = D0;
const ps = /^[0-9]+$/, mu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = ps.test(e), r = ps.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, $0 = (e, t) => mu(t, e);
var gu = {
  compareIdentifiers: mu,
  rcompareIdentifiers: $0
};
const yr = ii, { MAX_LENGTH: ms, MAX_SAFE_INTEGER: _r } = ri, { safeRe: vr, t: wr } = Jn, P0 = Yo, { compareIdentifiers: ki } = gu;
let F0 = class ze {
  constructor(t, n) {
    if (n = P0(n), t instanceof ze) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > ms)
      throw new TypeError(
        `version is longer than ${ms} characters`
      );
    yr("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? vr[wr.LOOSE] : vr[wr.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > _r || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > _r || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > _r || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < _r)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (yr("SemVer.compare", this.version, this.options, t), !(t instanceof ze)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ze(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ze || (t = new ze(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof ze || (t = new ze(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (yr("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return ki(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof ze || (t = new ze(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (yr("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return ki(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? vr[wr.PRERELEASELOOSE] : vr[wr.PRERELEASE]);
        if (!i || i[1] !== n)
          throw new Error(`invalid identifier: ${n}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", n, r);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", n, r);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(r) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (n === this.prerelease.join(".") && r === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (n) {
          let o = [n, i];
          r === !1 && (o = [n]), ki(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var $e = F0;
const gs = $e, L0 = (e, t, n = !1) => {
  if (e instanceof gs)
    return e;
  try {
    return new gs(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var un = L0;
const x0 = un, k0 = (e, t) => {
  const n = x0(e, t);
  return n ? n.version : null;
};
var U0 = k0;
const M0 = un, B0 = (e, t) => {
  const n = M0(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var H0 = B0;
const Es = $e, j0 = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new Es(
      e instanceof Es ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var q0 = j0;
const ys = un, G0 = (e, t) => {
  const n = ys(e, null, !0), r = ys(t, null, !0), i = n.compare(r);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? n : r, s = o ? r : n, l = !!a.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(a) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return n.major !== r.major ? c + "major" : n.minor !== r.minor ? c + "minor" : n.patch !== r.patch ? c + "patch" : "prerelease";
};
var Y0 = G0;
const V0 = $e, W0 = (e, t) => new V0(e, t).major;
var X0 = W0;
const z0 = $e, K0 = (e, t) => new z0(e, t).minor;
var J0 = K0;
const Q0 = $e, Z0 = (e, t) => new Q0(e, t).patch;
var eE = Z0;
const tE = un, nE = (e, t) => {
  const n = tE(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var rE = nE;
const _s = $e, iE = (e, t, n) => new _s(e, n).compare(new _s(t, n));
var Ye = iE;
const oE = Ye, aE = (e, t, n) => oE(t, e, n);
var sE = aE;
const lE = Ye, cE = (e, t) => lE(e, t, !0);
var uE = cE;
const vs = $e, fE = (e, t, n) => {
  const r = new vs(e, n), i = new vs(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var Vo = fE;
const dE = Vo, hE = (e, t) => e.sort((n, r) => dE(n, r, t));
var pE = hE;
const mE = Vo, gE = (e, t) => e.sort((n, r) => mE(r, n, t));
var EE = gE;
const yE = Ye, _E = (e, t, n) => yE(e, t, n) > 0;
var oi = _E;
const vE = Ye, wE = (e, t, n) => vE(e, t, n) < 0;
var Wo = wE;
const TE = Ye, SE = (e, t, n) => TE(e, t, n) === 0;
var Eu = SE;
const AE = Ye, CE = (e, t, n) => AE(e, t, n) !== 0;
var yu = CE;
const OE = Ye, IE = (e, t, n) => OE(e, t, n) >= 0;
var Xo = IE;
const bE = Ye, NE = (e, t, n) => bE(e, t, n) <= 0;
var zo = NE;
const RE = Eu, DE = yu, $E = oi, PE = Xo, FE = Wo, LE = zo, xE = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return RE(e, n, r);
    case "!=":
      return DE(e, n, r);
    case ">":
      return $E(e, n, r);
    case ">=":
      return PE(e, n, r);
    case "<":
      return FE(e, n, r);
    case "<=":
      return LE(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var _u = xE;
const kE = $e, UE = un, { safeRe: Tr, t: Sr } = Jn, ME = (e, t) => {
  if (e instanceof kE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? Tr[Sr.COERCEFULL] : Tr[Sr.COERCE]);
  else {
    const l = t.includePrerelease ? Tr[Sr.COERCERTLFULL] : Tr[Sr.COERCERTL];
    let m;
    for (; (m = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || m.index + m[0].length !== n.index + n[0].length) && (n = m), l.lastIndex = m.index + m[1].length + m[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", a = t.includePrerelease && n[5] ? `-${n[5]}` : "", s = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return UE(`${r}.${i}.${o}${a}${s}`, t);
};
var BE = ME;
class HE {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const n = this.map.get(t);
    if (n !== void 0)
      return this.map.delete(t), this.map.set(t, n), n;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, n) {
    if (!this.delete(t) && n !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, n);
    }
    return this;
  }
}
var jE = HE, Ui, ws;
function Ve() {
  if (ws) return Ui;
  ws = 1;
  const e = /\s+/g;
  class t {
    constructor(I, D) {
      if (D = i(D), I instanceof t)
        return I.loose === !!D.loose && I.includePrerelease === !!D.includePrerelease ? I : new t(I.raw, D);
      if (I instanceof o)
        return this.raw = I.value, this.set = [[I]], this.formatted = void 0, this;
      if (this.options = D, this.loose = !!D.loose, this.includePrerelease = !!D.includePrerelease, this.raw = I.trim().replace(e, " "), this.set = this.raw.split("||").map((O) => this.parseRange(O.trim())).filter((O) => O.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const O = this.set[0];
        if (this.set = this.set.filter(($) => !y($[0])), this.set.length === 0)
          this.set = [O];
        else if (this.set.length > 1) {
          for (const $ of this.set)
            if ($.length === 1 && T($[0])) {
              this.set = [$];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let I = 0; I < this.set.length; I++) {
          I > 0 && (this.formatted += "||");
          const D = this.set[I];
          for (let O = 0; O < D.length; O++)
            O > 0 && (this.formatted += " "), this.formatted += D[O].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(I) {
      const O = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + I, $ = r.get(O);
      if ($)
        return $;
      const R = this.options.loose, M = R ? l[m.HYPHENRANGELOOSE] : l[m.HYPHENRANGE];
      I = I.replace(M, B(this.options.includePrerelease)), a("hyphen replace", I), I = I.replace(l[m.COMPARATORTRIM], c), a("comparator trim", I), I = I.replace(l[m.TILDETRIM], f), a("tilde trim", I), I = I.replace(l[m.CARETTRIM], h), a("caret trim", I);
      let Y = I.split(" ").map((U) => S(U, this.options)).join(" ").split(/\s+/).map((U) => H(U, this.options));
      R && (Y = Y.filter((U) => (a("loose invalid filter", U, this.options), !!U.match(l[m.COMPARATORLOOSE])))), a("range list", Y);
      const j = /* @__PURE__ */ new Map(), Q = Y.map((U) => new o(U, this.options));
      for (const U of Q) {
        if (y(U))
          return [U];
        j.set(U.value, U);
      }
      j.size > 1 && j.has("") && j.delete("");
      const de = [...j.values()];
      return r.set(O, de), de;
    }
    intersects(I, D) {
      if (!(I instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((O) => A(O, D) && I.set.some(($) => A($, D) && O.every((R) => $.every((M) => R.intersects(M, D)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(I) {
      if (!I)
        return !1;
      if (typeof I == "string")
        try {
          I = new s(I, this.options);
        } catch {
          return !1;
        }
      for (let D = 0; D < this.set.length; D++)
        if (J(this.set[D], I, this.options))
          return !0;
      return !1;
    }
  }
  Ui = t;
  const n = jE, r = new n(), i = Yo, o = ai(), a = ii, s = $e, {
    safeRe: l,
    t: m,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = Jn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = ri, y = (N) => N.value === "<0.0.0-0", T = (N) => N.value === "", A = (N, I) => {
    let D = !0;
    const O = N.slice();
    let $ = O.pop();
    for (; D && O.length; )
      D = O.every((R) => $.intersects(R, I)), $ = O.pop();
    return D;
  }, S = (N, I) => (N = N.replace(l[m.BUILD], ""), a("comp", N, I), N = le(N, I), a("caret", N), N = x(N, I), a("tildes", N), N = Le(N, I), a("xrange", N), N = G(N, I), a("stars", N), N), F = (N) => !N || N.toLowerCase() === "x" || N === "*", x = (N, I) => N.trim().split(/\s+/).map((D) => re(D, I)).join(" "), re = (N, I) => {
    const D = I.loose ? l[m.TILDELOOSE] : l[m.TILDE];
    return N.replace(D, (O, $, R, M, Y) => {
      a("tilde", N, O, $, R, M, Y);
      let j;
      return F($) ? j = "" : F(R) ? j = `>=${$}.0.0 <${+$ + 1}.0.0-0` : F(M) ? j = `>=${$}.${R}.0 <${$}.${+R + 1}.0-0` : Y ? (a("replaceTilde pr", Y), j = `>=${$}.${R}.${M}-${Y} <${$}.${+R + 1}.0-0`) : j = `>=${$}.${R}.${M} <${$}.${+R + 1}.0-0`, a("tilde return", j), j;
    });
  }, le = (N, I) => N.trim().split(/\s+/).map((D) => W(D, I)).join(" "), W = (N, I) => {
    a("caret", N, I);
    const D = I.loose ? l[m.CARETLOOSE] : l[m.CARET], O = I.includePrerelease ? "-0" : "";
    return N.replace(D, ($, R, M, Y, j) => {
      a("caret", N, $, R, M, Y, j);
      let Q;
      return F(R) ? Q = "" : F(M) ? Q = `>=${R}.0.0${O} <${+R + 1}.0.0-0` : F(Y) ? R === "0" ? Q = `>=${R}.${M}.0${O} <${R}.${+M + 1}.0-0` : Q = `>=${R}.${M}.0${O} <${+R + 1}.0.0-0` : j ? (a("replaceCaret pr", j), R === "0" ? M === "0" ? Q = `>=${R}.${M}.${Y}-${j} <${R}.${M}.${+Y + 1}-0` : Q = `>=${R}.${M}.${Y}-${j} <${R}.${+M + 1}.0-0` : Q = `>=${R}.${M}.${Y}-${j} <${+R + 1}.0.0-0`) : (a("no pr"), R === "0" ? M === "0" ? Q = `>=${R}.${M}.${Y}${O} <${R}.${M}.${+Y + 1}-0` : Q = `>=${R}.${M}.${Y}${O} <${R}.${+M + 1}.0-0` : Q = `>=${R}.${M}.${Y} <${+R + 1}.0.0-0`), a("caret return", Q), Q;
    });
  }, Le = (N, I) => (a("replaceXRanges", N, I), N.split(/\s+/).map((D) => E(D, I)).join(" ")), E = (N, I) => {
    N = N.trim();
    const D = I.loose ? l[m.XRANGELOOSE] : l[m.XRANGE];
    return N.replace(D, (O, $, R, M, Y, j) => {
      a("xRange", N, O, $, R, M, Y, j);
      const Q = F(R), de = Q || F(M), U = de || F(Y), We = U;
      return $ === "=" && We && ($ = ""), j = I.includePrerelease ? "-0" : "", Q ? $ === ">" || $ === "<" ? O = "<0.0.0-0" : O = "*" : $ && We ? (de && (M = 0), Y = 0, $ === ">" ? ($ = ">=", de ? (R = +R + 1, M = 0, Y = 0) : (M = +M + 1, Y = 0)) : $ === "<=" && ($ = "<", de ? R = +R + 1 : M = +M + 1), $ === "<" && (j = "-0"), O = `${$ + R}.${M}.${Y}${j}`) : de ? O = `>=${R}.0.0${j} <${+R + 1}.0.0-0` : U && (O = `>=${R}.${M}.0${j} <${R}.${+M + 1}.0-0`), a("xRange return", O), O;
    });
  }, G = (N, I) => (a("replaceStars", N, I), N.trim().replace(l[m.STAR], "")), H = (N, I) => (a("replaceGTE0", N, I), N.trim().replace(l[I.includePrerelease ? m.GTE0PRE : m.GTE0], "")), B = (N) => (I, D, O, $, R, M, Y, j, Q, de, U, We) => (F(O) ? D = "" : F($) ? D = `>=${O}.0.0${N ? "-0" : ""}` : F(R) ? D = `>=${O}.${$}.0${N ? "-0" : ""}` : M ? D = `>=${D}` : D = `>=${D}${N ? "-0" : ""}`, F(Q) ? j = "" : F(de) ? j = `<${+Q + 1}.0.0-0` : F(U) ? j = `<${Q}.${+de + 1}.0-0` : We ? j = `<=${Q}.${de}.${U}-${We}` : N ? j = `<${Q}.${de}.${+U + 1}-0` : j = `<=${j}`, `${D} ${j}`.trim()), J = (N, I, D) => {
    for (let O = 0; O < N.length; O++)
      if (!N[O].test(I))
        return !1;
    if (I.prerelease.length && !D.includePrerelease) {
      for (let O = 0; O < N.length; O++)
        if (a(N[O].semver), N[O].semver !== o.ANY && N[O].semver.prerelease.length > 0) {
          const $ = N[O].semver;
          if ($.major === I.major && $.minor === I.minor && $.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ui;
}
var Mi, Ts;
function ai() {
  if (Ts) return Mi;
  Ts = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, f) {
      if (f = n(f), c instanceof t) {
        if (c.loose === !!f.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), a("comparator", c, f), this.options = f, this.loose = !!f.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(c) {
      const f = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], h = c.match(f);
      if (!h)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new s(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (a("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new s(c, this.options);
        } catch {
          return !1;
        }
      return o(c, this.operator, this.semver, this.options);
    }
    intersects(c, f) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, f).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, f).test(c.semver) : (f = n(f), f.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, f) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, f) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  Mi = t;
  const n = Yo, { safeRe: r, t: i } = Jn, o = _u, a = ii, s = $e, l = Ve();
  return Mi;
}
const qE = Ve(), GE = (e, t, n) => {
  try {
    t = new qE(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var si = GE;
const YE = Ve(), VE = (e, t) => new YE(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var WE = VE;
const XE = $e, zE = Ve(), KE = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new zE(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === -1) && (r = a, i = new XE(r, n));
  }), r;
};
var JE = KE;
const QE = $e, ZE = Ve(), ey = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new ZE(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === 1) && (r = a, i = new QE(r, n));
  }), r;
};
var ty = ey;
const Bi = $e, ny = Ve(), Ss = oi, ry = (e, t) => {
  e = new ny(e, t);
  let n = new Bi("0.0.0");
  if (e.test(n) || (n = new Bi("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((a) => {
      const s = new Bi(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || Ss(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!n || Ss(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var iy = ry;
const oy = Ve(), ay = (e, t) => {
  try {
    return new oy(e, t).range || "*";
  } catch {
    return null;
  }
};
var sy = ay;
const ly = $e, vu = ai(), { ANY: cy } = vu, uy = Ve(), fy = si, As = oi, Cs = Wo, dy = zo, hy = Xo, py = (e, t, n, r) => {
  e = new ly(e, r), t = new uy(t, r);
  let i, o, a, s, l;
  switch (n) {
    case ">":
      i = As, o = dy, a = Cs, s = ">", l = ">=";
      break;
    case "<":
      i = Cs, o = hy, a = As, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (fy(e, t, r))
    return !1;
  for (let m = 0; m < t.set.length; ++m) {
    const c = t.set[m];
    let f = null, h = null;
    if (c.forEach((g) => {
      g.semver === cy && (g = new vu(">=0.0.0")), f = f || g, h = h || g, i(g.semver, f.semver, r) ? f = g : a(g.semver, h.semver, r) && (h = g);
    }), f.operator === s || f.operator === l || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === l && a(e, h.semver))
      return !1;
  }
  return !0;
};
var Ko = py;
const my = Ko, gy = (e, t, n) => my(e, t, ">", n);
var Ey = gy;
const yy = Ko, _y = (e, t, n) => yy(e, t, "<", n);
var vy = _y;
const Os = Ve(), wy = (e, t, n) => (e = new Os(e, n), t = new Os(t, n), e.intersects(t, n));
var Ty = wy;
const Sy = si, Ay = Ye;
var Cy = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const a = e.sort((c, f) => Ay(c, f, n));
  for (const c of a)
    Sy(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const s = [];
  for (const [c, f] of r)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), m = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < m.length ? l : t;
};
const Is = Ve(), Jo = ai(), { ANY: Hi } = Jo, _n = si, Qo = Ye, Oy = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new Is(e, n), t = new Is(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = by(i, o, n);
      if (r = r || a !== null, a)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, Iy = [new Jo(">=0.0.0-0")], bs = [new Jo(">=0.0.0")], by = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Hi) {
    if (t.length === 1 && t[0].semver === Hi)
      return !0;
    n.includePrerelease ? e = Iy : e = bs;
  }
  if (t.length === 1 && t[0].semver === Hi) {
    if (n.includePrerelease)
      return !0;
    t = bs;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = Ns(i, g, n) : g.operator === "<" || g.operator === "<=" ? o = Rs(o, g, n) : r.add(g.semver);
  if (r.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = Qo(i.semver, o.semver, n), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of r) {
    if (i && !_n(g, String(i), n) || o && !_n(g, String(o), n))
      return null;
    for (const w of t)
      if (!_n(g, String(w), n))
        return !1;
    return !0;
  }
  let s, l, m, c, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const g of t) {
    if (c = c || g.operator === ">" || g.operator === ">=", m = m || g.operator === "<" || g.operator === "<=", i) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === ">" || g.operator === ">=") {
        if (s = Ns(i, g, n), s === g && s !== i)
          return !1;
      } else if (i.operator === ">=" && !_n(i.semver, String(g), n))
        return !1;
    }
    if (o) {
      if (f && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === f.major && g.semver.minor === f.minor && g.semver.patch === f.patch && (f = !1), g.operator === "<" || g.operator === "<=") {
        if (l = Rs(o, g, n), l === g && l !== o)
          return !1;
      } else if (o.operator === "<=" && !_n(o.semver, String(g), n))
        return !1;
    }
    if (!g.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && m && !o && a !== 0 || o && c && !i && a !== 0 || h || f);
}, Ns = (e, t, n) => {
  if (!e)
    return t;
  const r = Qo(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Rs = (e, t, n) => {
  if (!e)
    return t;
  const r = Qo(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Ny = Oy;
const ji = Jn, Ds = ri, Ry = $e, $s = gu, Dy = un, $y = U0, Py = H0, Fy = q0, Ly = Y0, xy = X0, ky = J0, Uy = eE, My = rE, By = Ye, Hy = sE, jy = uE, qy = Vo, Gy = pE, Yy = EE, Vy = oi, Wy = Wo, Xy = Eu, zy = yu, Ky = Xo, Jy = zo, Qy = _u, Zy = BE, e_ = ai(), t_ = Ve(), n_ = si, r_ = WE, i_ = JE, o_ = ty, a_ = iy, s_ = sy, l_ = Ko, c_ = Ey, u_ = vy, f_ = Ty, d_ = Cy, h_ = Ny;
var wu = {
  parse: Dy,
  valid: $y,
  clean: Py,
  inc: Fy,
  diff: Ly,
  major: xy,
  minor: ky,
  patch: Uy,
  prerelease: My,
  compare: By,
  rcompare: Hy,
  compareLoose: jy,
  compareBuild: qy,
  sort: Gy,
  rsort: Yy,
  gt: Vy,
  lt: Wy,
  eq: Xy,
  neq: zy,
  gte: Ky,
  lte: Jy,
  cmp: Qy,
  coerce: Zy,
  Comparator: e_,
  Range: t_,
  satisfies: n_,
  toComparators: r_,
  maxSatisfying: i_,
  minSatisfying: o_,
  minVersion: a_,
  validRange: s_,
  outside: l_,
  gtr: c_,
  ltr: u_,
  intersects: f_,
  simplifyRange: d_,
  subset: h_,
  SemVer: Ry,
  re: ji.re,
  src: ji.src,
  tokens: ji.t,
  SEMVER_SPEC_VERSION: Ds.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Ds.RELEASE_TYPES,
  compareIdentifiers: $s.compareIdentifiers,
  rcompareIdentifiers: $s.rcompareIdentifiers
}, Qn = {}, Gr = { exports: {} };
Gr.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", m = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", h = "[object Error]", g = "[object Function]", w = "[object GeneratorFunction]", y = "[object Map]", T = "[object Number]", A = "[object Null]", S = "[object Object]", F = "[object Promise]", x = "[object Proxy]", re = "[object RegExp]", le = "[object Set]", W = "[object String]", Le = "[object Symbol]", E = "[object Undefined]", G = "[object WeakMap]", H = "[object ArrayBuffer]", B = "[object DataView]", J = "[object Float32Array]", N = "[object Float64Array]", I = "[object Int8Array]", D = "[object Int16Array]", O = "[object Int32Array]", $ = "[object Uint8Array]", R = "[object Uint8ClampedArray]", M = "[object Uint16Array]", Y = "[object Uint32Array]", j = /[\\^$.*+?()[\]{}|]/g, Q = /^\[object .+?Constructor\]$/, de = /^(?:0|[1-9]\d*)$/, U = {};
  U[J] = U[N] = U[I] = U[D] = U[O] = U[$] = U[R] = U[M] = U[Y] = !0, U[s] = U[l] = U[H] = U[c] = U[B] = U[f] = U[h] = U[g] = U[y] = U[T] = U[S] = U[re] = U[le] = U[W] = U[G] = !1;
  var We = typeof Oe == "object" && Oe && Oe.Object === Object && Oe, d = typeof self == "object" && self && self.Object === Object && self, u = We || d || Function("return this")(), C = t && !t.nodeType && t, v = C && !0 && e && !e.nodeType && e, X = v && v.exports === C, ee = X && We.process, ae = function() {
    try {
      return ee && ee.binding && ee.binding("util");
    } catch {
    }
  }(), ge = ae && ae.isTypedArray;
  function ve(p, _) {
    for (var b = -1, L = p == null ? 0 : p.length, te = 0, q = []; ++b < L; ) {
      var se = p[b];
      _(se, b, p) && (q[te++] = se);
    }
    return q;
  }
  function ot(p, _) {
    for (var b = -1, L = _.length, te = p.length; ++b < L; )
      p[te + b] = _[b];
    return p;
  }
  function ue(p, _) {
    for (var b = -1, L = p == null ? 0 : p.length; ++b < L; )
      if (_(p[b], b, p))
        return !0;
    return !1;
  }
  function He(p, _) {
    for (var b = -1, L = Array(p); ++b < p; )
      L[b] = _(b);
    return L;
  }
  function gi(p) {
    return function(_) {
      return p(_);
    };
  }
  function nr(p, _) {
    return p.has(_);
  }
  function dn(p, _) {
    return p == null ? void 0 : p[_];
  }
  function rr(p) {
    var _ = -1, b = Array(p.size);
    return p.forEach(function(L, te) {
      b[++_] = [te, L];
    }), b;
  }
  function Uu(p, _) {
    return function(b) {
      return p(_(b));
    };
  }
  function Mu(p) {
    var _ = -1, b = Array(p.size);
    return p.forEach(function(L) {
      b[++_] = L;
    }), b;
  }
  var Bu = Array.prototype, Hu = Function.prototype, ir = Object.prototype, Ei = u["__core-js_shared__"], ra = Hu.toString, Xe = ir.hasOwnProperty, ia = function() {
    var p = /[^.]+$/.exec(Ei && Ei.keys && Ei.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), oa = ir.toString, ju = RegExp(
    "^" + ra.call(Xe).replace(j, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), aa = X ? u.Buffer : void 0, or = u.Symbol, sa = u.Uint8Array, la = ir.propertyIsEnumerable, qu = Bu.splice, St = or ? or.toStringTag : void 0, ca = Object.getOwnPropertySymbols, Gu = aa ? aa.isBuffer : void 0, Yu = Uu(Object.keys, Object), yi = Bt(u, "DataView"), hn = Bt(u, "Map"), _i = Bt(u, "Promise"), vi = Bt(u, "Set"), wi = Bt(u, "WeakMap"), pn = Bt(Object, "create"), Vu = Ot(yi), Wu = Ot(hn), Xu = Ot(_i), zu = Ot(vi), Ku = Ot(wi), ua = or ? or.prototype : void 0, Ti = ua ? ua.valueOf : void 0;
  function At(p) {
    var _ = -1, b = p == null ? 0 : p.length;
    for (this.clear(); ++_ < b; ) {
      var L = p[_];
      this.set(L[0], L[1]);
    }
  }
  function Ju() {
    this.__data__ = pn ? pn(null) : {}, this.size = 0;
  }
  function Qu(p) {
    var _ = this.has(p) && delete this.__data__[p];
    return this.size -= _ ? 1 : 0, _;
  }
  function Zu(p) {
    var _ = this.__data__;
    if (pn) {
      var b = _[p];
      return b === r ? void 0 : b;
    }
    return Xe.call(_, p) ? _[p] : void 0;
  }
  function ef(p) {
    var _ = this.__data__;
    return pn ? _[p] !== void 0 : Xe.call(_, p);
  }
  function tf(p, _) {
    var b = this.__data__;
    return this.size += this.has(p) ? 0 : 1, b[p] = pn && _ === void 0 ? r : _, this;
  }
  At.prototype.clear = Ju, At.prototype.delete = Qu, At.prototype.get = Zu, At.prototype.has = ef, At.prototype.set = tf;
  function Ze(p) {
    var _ = -1, b = p == null ? 0 : p.length;
    for (this.clear(); ++_ < b; ) {
      var L = p[_];
      this.set(L[0], L[1]);
    }
  }
  function nf() {
    this.__data__ = [], this.size = 0;
  }
  function rf(p) {
    var _ = this.__data__, b = sr(_, p);
    if (b < 0)
      return !1;
    var L = _.length - 1;
    return b == L ? _.pop() : qu.call(_, b, 1), --this.size, !0;
  }
  function of(p) {
    var _ = this.__data__, b = sr(_, p);
    return b < 0 ? void 0 : _[b][1];
  }
  function af(p) {
    return sr(this.__data__, p) > -1;
  }
  function sf(p, _) {
    var b = this.__data__, L = sr(b, p);
    return L < 0 ? (++this.size, b.push([p, _])) : b[L][1] = _, this;
  }
  Ze.prototype.clear = nf, Ze.prototype.delete = rf, Ze.prototype.get = of, Ze.prototype.has = af, Ze.prototype.set = sf;
  function Ct(p) {
    var _ = -1, b = p == null ? 0 : p.length;
    for (this.clear(); ++_ < b; ) {
      var L = p[_];
      this.set(L[0], L[1]);
    }
  }
  function lf() {
    this.size = 0, this.__data__ = {
      hash: new At(),
      map: new (hn || Ze)(),
      string: new At()
    };
  }
  function cf(p) {
    var _ = lr(this, p).delete(p);
    return this.size -= _ ? 1 : 0, _;
  }
  function uf(p) {
    return lr(this, p).get(p);
  }
  function ff(p) {
    return lr(this, p).has(p);
  }
  function df(p, _) {
    var b = lr(this, p), L = b.size;
    return b.set(p, _), this.size += b.size == L ? 0 : 1, this;
  }
  Ct.prototype.clear = lf, Ct.prototype.delete = cf, Ct.prototype.get = uf, Ct.prototype.has = ff, Ct.prototype.set = df;
  function ar(p) {
    var _ = -1, b = p == null ? 0 : p.length;
    for (this.__data__ = new Ct(); ++_ < b; )
      this.add(p[_]);
  }
  function hf(p) {
    return this.__data__.set(p, r), this;
  }
  function pf(p) {
    return this.__data__.has(p);
  }
  ar.prototype.add = ar.prototype.push = hf, ar.prototype.has = pf;
  function at(p) {
    var _ = this.__data__ = new Ze(p);
    this.size = _.size;
  }
  function mf() {
    this.__data__ = new Ze(), this.size = 0;
  }
  function gf(p) {
    var _ = this.__data__, b = _.delete(p);
    return this.size = _.size, b;
  }
  function Ef(p) {
    return this.__data__.get(p);
  }
  function yf(p) {
    return this.__data__.has(p);
  }
  function _f(p, _) {
    var b = this.__data__;
    if (b instanceof Ze) {
      var L = b.__data__;
      if (!hn || L.length < n - 1)
        return L.push([p, _]), this.size = ++b.size, this;
      b = this.__data__ = new Ct(L);
    }
    return b.set(p, _), this.size = b.size, this;
  }
  at.prototype.clear = mf, at.prototype.delete = gf, at.prototype.get = Ef, at.prototype.has = yf, at.prototype.set = _f;
  function vf(p, _) {
    var b = cr(p), L = !b && Lf(p), te = !b && !L && Si(p), q = !b && !L && !te && _a(p), se = b || L || te || q, he = se ? He(p.length, String) : [], Ee = he.length;
    for (var ie in p)
      Xe.call(p, ie) && !(se && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      te && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      q && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      Rf(ie, Ee))) && he.push(ie);
    return he;
  }
  function sr(p, _) {
    for (var b = p.length; b--; )
      if (ma(p[b][0], _))
        return b;
    return -1;
  }
  function wf(p, _, b) {
    var L = _(p);
    return cr(p) ? L : ot(L, b(p));
  }
  function mn(p) {
    return p == null ? p === void 0 ? E : A : St && St in Object(p) ? bf(p) : Ff(p);
  }
  function fa(p) {
    return gn(p) && mn(p) == s;
  }
  function da(p, _, b, L, te) {
    return p === _ ? !0 : p == null || _ == null || !gn(p) && !gn(_) ? p !== p && _ !== _ : Tf(p, _, b, L, da, te);
  }
  function Tf(p, _, b, L, te, q) {
    var se = cr(p), he = cr(_), Ee = se ? l : st(p), ie = he ? l : st(_);
    Ee = Ee == s ? S : Ee, ie = ie == s ? S : ie;
    var xe = Ee == S, je = ie == S, we = Ee == ie;
    if (we && Si(p)) {
      if (!Si(_))
        return !1;
      se = !0, xe = !1;
    }
    if (we && !xe)
      return q || (q = new at()), se || _a(p) ? ha(p, _, b, L, te, q) : Of(p, _, Ee, b, L, te, q);
    if (!(b & i)) {
      var ke = xe && Xe.call(p, "__wrapped__"), Ue = je && Xe.call(_, "__wrapped__");
      if (ke || Ue) {
        var lt = ke ? p.value() : p, et = Ue ? _.value() : _;
        return q || (q = new at()), te(lt, et, b, L, q);
      }
    }
    return we ? (q || (q = new at()), If(p, _, b, L, te, q)) : !1;
  }
  function Sf(p) {
    if (!ya(p) || $f(p))
      return !1;
    var _ = ga(p) ? ju : Q;
    return _.test(Ot(p));
  }
  function Af(p) {
    return gn(p) && Ea(p.length) && !!U[mn(p)];
  }
  function Cf(p) {
    if (!Pf(p))
      return Yu(p);
    var _ = [];
    for (var b in Object(p))
      Xe.call(p, b) && b != "constructor" && _.push(b);
    return _;
  }
  function ha(p, _, b, L, te, q) {
    var se = b & i, he = p.length, Ee = _.length;
    if (he != Ee && !(se && Ee > he))
      return !1;
    var ie = q.get(p);
    if (ie && q.get(_))
      return ie == _;
    var xe = -1, je = !0, we = b & o ? new ar() : void 0;
    for (q.set(p, _), q.set(_, p); ++xe < he; ) {
      var ke = p[xe], Ue = _[xe];
      if (L)
        var lt = se ? L(Ue, ke, xe, _, p, q) : L(ke, Ue, xe, p, _, q);
      if (lt !== void 0) {
        if (lt)
          continue;
        je = !1;
        break;
      }
      if (we) {
        if (!ue(_, function(et, It) {
          if (!nr(we, It) && (ke === et || te(ke, et, b, L, q)))
            return we.push(It);
        })) {
          je = !1;
          break;
        }
      } else if (!(ke === Ue || te(ke, Ue, b, L, q))) {
        je = !1;
        break;
      }
    }
    return q.delete(p), q.delete(_), je;
  }
  function Of(p, _, b, L, te, q, se) {
    switch (b) {
      case B:
        if (p.byteLength != _.byteLength || p.byteOffset != _.byteOffset)
          return !1;
        p = p.buffer, _ = _.buffer;
      case H:
        return !(p.byteLength != _.byteLength || !q(new sa(p), new sa(_)));
      case c:
      case f:
      case T:
        return ma(+p, +_);
      case h:
        return p.name == _.name && p.message == _.message;
      case re:
      case W:
        return p == _ + "";
      case y:
        var he = rr;
      case le:
        var Ee = L & i;
        if (he || (he = Mu), p.size != _.size && !Ee)
          return !1;
        var ie = se.get(p);
        if (ie)
          return ie == _;
        L |= o, se.set(p, _);
        var xe = ha(he(p), he(_), L, te, q, se);
        return se.delete(p), xe;
      case Le:
        if (Ti)
          return Ti.call(p) == Ti.call(_);
    }
    return !1;
  }
  function If(p, _, b, L, te, q) {
    var se = b & i, he = pa(p), Ee = he.length, ie = pa(_), xe = ie.length;
    if (Ee != xe && !se)
      return !1;
    for (var je = Ee; je--; ) {
      var we = he[je];
      if (!(se ? we in _ : Xe.call(_, we)))
        return !1;
    }
    var ke = q.get(p);
    if (ke && q.get(_))
      return ke == _;
    var Ue = !0;
    q.set(p, _), q.set(_, p);
    for (var lt = se; ++je < Ee; ) {
      we = he[je];
      var et = p[we], It = _[we];
      if (L)
        var va = se ? L(It, et, we, _, p, q) : L(et, It, we, p, _, q);
      if (!(va === void 0 ? et === It || te(et, It, b, L, q) : va)) {
        Ue = !1;
        break;
      }
      lt || (lt = we == "constructor");
    }
    if (Ue && !lt) {
      var ur = p.constructor, fr = _.constructor;
      ur != fr && "constructor" in p && "constructor" in _ && !(typeof ur == "function" && ur instanceof ur && typeof fr == "function" && fr instanceof fr) && (Ue = !1);
    }
    return q.delete(p), q.delete(_), Ue;
  }
  function pa(p) {
    return wf(p, Uf, Nf);
  }
  function lr(p, _) {
    var b = p.__data__;
    return Df(_) ? b[typeof _ == "string" ? "string" : "hash"] : b.map;
  }
  function Bt(p, _) {
    var b = dn(p, _);
    return Sf(b) ? b : void 0;
  }
  function bf(p) {
    var _ = Xe.call(p, St), b = p[St];
    try {
      p[St] = void 0;
      var L = !0;
    } catch {
    }
    var te = oa.call(p);
    return L && (_ ? p[St] = b : delete p[St]), te;
  }
  var Nf = ca ? function(p) {
    return p == null ? [] : (p = Object(p), ve(ca(p), function(_) {
      return la.call(p, _);
    }));
  } : Mf, st = mn;
  (yi && st(new yi(new ArrayBuffer(1))) != B || hn && st(new hn()) != y || _i && st(_i.resolve()) != F || vi && st(new vi()) != le || wi && st(new wi()) != G) && (st = function(p) {
    var _ = mn(p), b = _ == S ? p.constructor : void 0, L = b ? Ot(b) : "";
    if (L)
      switch (L) {
        case Vu:
          return B;
        case Wu:
          return y;
        case Xu:
          return F;
        case zu:
          return le;
        case Ku:
          return G;
      }
    return _;
  });
  function Rf(p, _) {
    return _ = _ ?? a, !!_ && (typeof p == "number" || de.test(p)) && p > -1 && p % 1 == 0 && p < _;
  }
  function Df(p) {
    var _ = typeof p;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? p !== "__proto__" : p === null;
  }
  function $f(p) {
    return !!ia && ia in p;
  }
  function Pf(p) {
    var _ = p && p.constructor, b = typeof _ == "function" && _.prototype || ir;
    return p === b;
  }
  function Ff(p) {
    return oa.call(p);
  }
  function Ot(p) {
    if (p != null) {
      try {
        return ra.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function ma(p, _) {
    return p === _ || p !== p && _ !== _;
  }
  var Lf = fa(/* @__PURE__ */ function() {
    return arguments;
  }()) ? fa : function(p) {
    return gn(p) && Xe.call(p, "callee") && !la.call(p, "callee");
  }, cr = Array.isArray;
  function xf(p) {
    return p != null && Ea(p.length) && !ga(p);
  }
  var Si = Gu || Bf;
  function kf(p, _) {
    return da(p, _);
  }
  function ga(p) {
    if (!ya(p))
      return !1;
    var _ = mn(p);
    return _ == g || _ == w || _ == m || _ == x;
  }
  function Ea(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= a;
  }
  function ya(p) {
    var _ = typeof p;
    return p != null && (_ == "object" || _ == "function");
  }
  function gn(p) {
    return p != null && typeof p == "object";
  }
  var _a = ge ? gi(ge) : Af;
  function Uf(p) {
    return xf(p) ? vf(p) : Cf(p);
  }
  function Mf() {
    return [];
  }
  function Bf() {
    return !1;
  }
  e.exports = kf;
})(Gr, Gr.exports);
var p_ = Gr.exports;
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.DownloadedUpdateHelper = void 0;
Qn.createTempUpdateFile = __;
const m_ = Yn, g_ = vt, Ps = p_, Nt = wt, In = z;
class E_ {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return In.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Ps(this.versionInfo, n) && Ps(this.fileInfo.info, r.info) && await (0, Nt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, a) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Nt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Nt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, n) {
    const r = this.getUpdateInfoFile();
    if (!await (0, Nt.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, Nt.readJson)(r);
    } catch (m) {
      let c = "No cached update info available";
      return m.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${m.message})`), n.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = In.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Nt.pathExists)(s))
      return n.info("Cached update file doesn't exist"), null;
    const l = await y_(s);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return In.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Qn.DownloadedUpdateHelper = E_;
function y_(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const a = (0, m_.createHash)(t);
    a.on("error", o).setEncoding(n), (0, g_.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function __(e, t, n) {
  let r = 0, i = In.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Nt.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${a}`), i = In.join(t, `${r++}-${e}`);
    }
  return i;
}
var li = {}, Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
Zo.getAppCacheDir = w_;
const qi = z, v_ = Wr;
function w_() {
  const e = (0, v_.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || qi.join(e, "AppData", "Local") : process.platform === "darwin" ? t = qi.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || qi.join(e, ".cache"), t;
}
Object.defineProperty(li, "__esModule", { value: !0 });
li.ElectronAppAdapter = void 0;
const Fs = z, T_ = Zo;
class S_ {
  constructor(t = Lt.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Fs.join(process.resourcesPath, "app-update.yml") : Fs.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, T_.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (n, r) => t(r));
  }
}
li.ElectronAppAdapter = S_;
var Tu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = me;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Lt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((l, m, c) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: c,
          callback: (h) => {
            h == null ? l(a) : m(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const s = Lt.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, l, m) {
      o.on("redirect", (c, f, h) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : m(t.HttpExecutor.prepareRedirectUrlOptions(h, a));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(Tu);
var Zn = {}, Be = {}, A_ = "[object Symbol]", Su = /[\\^$.*+?()[\]{}|]/g, C_ = RegExp(Su.source), O_ = typeof Oe == "object" && Oe && Oe.Object === Object && Oe, I_ = typeof self == "object" && self && self.Object === Object && self, b_ = O_ || I_ || Function("return this")(), N_ = Object.prototype, R_ = N_.toString, Ls = b_.Symbol, xs = Ls ? Ls.prototype : void 0, ks = xs ? xs.toString : void 0;
function D_(e) {
  if (typeof e == "string")
    return e;
  if (P_(e))
    return ks ? ks.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function $_(e) {
  return !!e && typeof e == "object";
}
function P_(e) {
  return typeof e == "symbol" || $_(e) && R_.call(e) == A_;
}
function F_(e) {
  return e == null ? "" : D_(e);
}
function L_(e) {
  return e = F_(e), e && C_.test(e) ? e.replace(Su, "\\$&") : e;
}
var x_ = L_;
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.newBaseUrl = U_;
Be.newUrlFromBase = _o;
Be.getChannelFilename = M_;
Be.blockmapFiles = B_;
const Au = sn, k_ = x_;
function U_(e) {
  const t = new Au.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function _o(e, t, n = !1) {
  const r = new Au.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function M_(e) {
  return `${e}.yml`;
}
function B_(e, t, n) {
  const r = _o(`${e.pathname}.blockmap`, e);
  return [_o(`${e.pathname.replace(new RegExp(k_(n), "g"), t)}.blockmap`, e), r];
}
var fe = {};
Object.defineProperty(fe, "__esModule", { value: !0 });
fe.Provider = void 0;
fe.findFile = q_;
fe.parseUpdateInfo = G_;
fe.getFileList = Cu;
fe.resolveFiles = Y_;
const yt = me, H_ = _e, Us = Be;
class j_ {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, n, r) {
    return this.executor.request(this.createRequestOptions(t, n), r);
  }
  createRequestOptions(t, n) {
    const r = {};
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, yt.configureRequestUrl)(t, r), r;
  }
}
fe.Provider = j_;
function q_(e, t, n) {
  if (e.length === 0)
    throw (0, yt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const r = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return r ?? (n == null ? e[0] : e.find((i) => !n.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function G_(e, t, n) {
  if (e == null)
    throw (0, yt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, H_.load)(e);
  } catch (i) {
    throw (0, yt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function Cu(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, yt.newError)(`No files provided: ${(0, yt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Y_(e, t, n = (r) => r) {
  const i = Cu(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, yt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, yt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Us.newUrlFromBase)(n(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, Us.newUrlFromBase)(n(a.path), t).href
  }), i;
}
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.GenericProvider = void 0;
const Ms = me, Gi = Be, Yi = fe;
class V_ extends Yi.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, Gi.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Gi.getChannelFilename)(this.channel), n = (0, Gi.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, Yi.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof Ms.HttpError && i.statusCode === 404)
          throw (0, Ms.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && r < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * r);
            } catch (s) {
              a(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Yi.resolveFiles)(t, this.baseUrl);
  }
}
Zn.GenericProvider = V_;
var ci = {}, ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
ui.BitbucketProvider = void 0;
const Bs = me, Vi = Be, Wi = fe;
class W_ extends Wi.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Vi.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Bs.CancellationToken(), n = (0, Vi.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Vi.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, Wi.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Bs.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Wi.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
ui.BitbucketProvider = W_;
var _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.GitHubProvider = _t.BaseGitHubProvider = void 0;
_t.computeReleaseNotes = Iu;
const tt = me, Kt = wu, X_ = sn, Jt = Be, vo = fe, Xi = /\/tag\/([^/]+)$/;
class Ou extends vo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Jt.newBaseUrl)((0, tt.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, Jt.newBaseUrl)((0, tt.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
_t.BaseGitHubProvider = Ou;
class z_ extends Ou {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const a = new tt.CancellationToken(), s = await this.httpRequest((0, Jt.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, tt.parseXml)(s);
    let m = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = Kt.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (T === null)
          c = Xi.exec(m.element("link").attribute("href"))[1];
        else
          for (const A of l.getElements("entry")) {
            const S = Xi.exec(A.element("link").attribute("href"));
            if (S === null)
              continue;
            const F = S[1], x = ((r = Kt.prerelease(F)) === null || r === void 0 ? void 0 : r[0]) || null, re = !T || ["alpha", "beta"].includes(T), le = x !== null && !["alpha", "beta"].includes(String(x));
            if (re && !le && !(T === "beta" && x === "alpha")) {
              c = F;
              break;
            }
            if (x && x === T) {
              c = F;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(a);
        for (const T of l.getElements("entry"))
          if (Xi.exec(T.element("link").attribute("href"))[1] === c) {
            m = T;
            break;
          }
      }
    } catch (T) {
      throw (0, tt.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, tt.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", g = "";
    const w = async (T) => {
      h = (0, Jt.getChannelFilename)(T), g = (0, Jt.newUrlFromBase)(this.getBaseDownloadPath(String(c), h), this.baseUrl);
      const A = this.createRequestOptions(g);
      try {
        return await this.executor.request(A, a);
      } catch (S) {
        throw S instanceof tt.HttpError && S.statusCode === 404 ? (0, tt.newError)(`Cannot find ${h} in the latest release artifacts (${g}): ${S.stack || S.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : S;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = Kt.prerelease(c)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((o = Kt.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await w(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        f = await w(this.getDefaultChannelName());
      else
        throw T;
    }
    const y = (0, vo.parseUpdateInfo)(f, h, g);
    return y.releaseName == null && (y.releaseName = m.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = Iu(this.updater.currentVersion, this.updater.fullChangelog, l, m)), {
      tag: c,
      ...y
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, Jt.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new X_.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, tt.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, vo.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
_t.GitHubProvider = z_;
function Hs(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Iu(e, t, n, r) {
  if (!t)
    return Hs(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Kt.lt(e, a) && i.push({
      version: a,
      note: Hs(o)
    });
  }
  return i.sort((o, a) => Kt.rcompare(o.version, a.version));
}
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.KeygenProvider = void 0;
const js = me, zi = Be, Ki = fe;
class K_ extends Ki.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, zi.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new js.CancellationToken(), n = (0, zi.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, zi.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Ki.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, js.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Ki.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
fi.KeygenProvider = K_;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.PrivateGitHubProvider = void 0;
const qt = me, J_ = _e, Q_ = z, qs = sn, Gs = Be, Z_ = _t, ev = fe;
class tv extends Z_.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new qt.CancellationToken(), n = (0, Gs.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((s) => s.name === n);
    if (i == null)
      throw (0, qt.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new qs.URL(i.url);
    let a;
    try {
      a = (0, J_.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof qt.HttpError && s.statusCode === 404 ? (0, qt.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = r.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const n = this.updater.allowPrerelease;
    let r = this.basePath;
    n || (r = `${r}/latest`);
    const i = (0, Gs.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, qt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, ev.getFileList)(t).map((n) => {
      const r = Q_.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, qt.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new qs.URL(i.url),
        info: n
      };
    });
  }
}
di.PrivateGitHubProvider = tv;
Object.defineProperty(ci, "__esModule", { value: !0 });
ci.isUrlProbablySupportMultiRangeRequests = bu;
ci.createClient = av;
const Ar = me, nv = ui, Ys = Zn, rv = _t, iv = fi, ov = di;
function bu(e) {
  return !e.includes("s3.amazonaws.com");
}
function av(e, t, n) {
  if (typeof e == "string")
    throw (0, Ar.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new rv.GitHubProvider(i, t, n) : new ov.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new nv.BitbucketProvider(e, t, n);
    case "keygen":
      return new iv.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new Ys.GenericProvider({
        provider: "generic",
        url: (0, Ar.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Ys.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && bu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Ar.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, Ar.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var hi = {}, er = {}, fn = {}, Mt = {};
Object.defineProperty(Mt, "__esModule", { value: !0 });
Mt.OperationKind = void 0;
Mt.computeOperations = sv;
var $t;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})($t || (Mt.OperationKind = $t = {}));
function sv(e, t, n) {
  const r = Ws(e.files), i = Ws(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, m = r.get(l);
  if (m == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: g } = cv(r.get(l), m.offset, n);
  let w = a.offset;
  for (let y = 0; y < c.checksums.length; w += c.sizes[y], y++) {
    const T = c.sizes[y], A = c.checksums[y];
    let S = h.get(A);
    S != null && g.get(A) !== T && (n.warn(`Checksum ("${A}") matches, but size differs (old: ${g.get(A)}, new: ${T})`), S = void 0), S === void 0 ? (f++, o != null && o.kind === $t.DOWNLOAD && o.end === w ? o.end += T : (o = {
      kind: $t.DOWNLOAD,
      start: w,
      end: w + T
      // oldBlocks: null,
    }, Vs(o, s, A, y))) : o != null && o.kind === $t.COPY && o.end === S ? o.end += T : (o = {
      kind: $t.COPY,
      start: S,
      end: S + T
      // oldBlocks: [checksum]
    }, Vs(o, s, A, y));
  }
  return f > 0 && n.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const lv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Vs(e, t, n, r) {
  if (lv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${$t[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function cv(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], m = i.get(s);
    if (m === void 0)
      r.set(s, o), i.set(s, l);
    else if (n.debug != null) {
      const c = m === l ? "(same size)" : `(size: ${m}, this size: ${l})`;
      n.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function Ws(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.DataSplitter = void 0;
fn.copyData = Nu;
const Cr = me, uv = vt, fv = Gn, dv = Mt, Xs = Buffer.from(`\r
\r
`);
var ut;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(ut || (ut = {}));
function Nu(e, t, n, r, i) {
  const o = (0, uv.createReadStream)("", {
    fd: n,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", r), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class hv extends fv.Writable {
  constructor(t, n, r, i, o, a) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = a, this.partIndex = -1, this.headerListBuffer = null, this.readState = ut.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, n, r) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(r).catch(r);
  }
  async handleData(t) {
    let n = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Cr.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === ut.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = ut.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === ut.BODY)
          this.readState = ut.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Cr.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, Cr.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = ut.HEADER;
            return;
          }
        }
        const r = this.partIndexToLength[this.partIndex], i = n + r, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, n, o), this.remainingPartDataCount = r - (o - n), this.remainingPartDataCount > 0)
          return;
        if (n = i + this.boundaryLength, n >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, n) {
    return new Promise((r, i) => {
      const o = () => {
        if (t === n) {
          r();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== dv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Nu(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(Xs, n);
    if (r !== -1)
      return r + Xs.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Cr.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, n, r) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, n, r);
  }
  processPartData(t, n, r) {
    this.actualPartLength += r - n;
    const i = this.out;
    return i.write(n === 0 && t.length === r ? t : t.slice(n, r)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
fn.DataSplitter = hv;
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.executeTasksUsingMultipleRangeRequests = pv;
pi.checkIsRangesSupported = To;
const wo = me, zs = fn, Ks = Mt;
function pv(e, t, n, r, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const s = a + 1e3;
    mv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: r
    }, n, () => o(s), i);
  };
  return o;
}
function mv(e, t, n, r, i) {
  let o = "bytes=", a = 0;
  const s = /* @__PURE__ */ new Map(), l = [];
  for (let f = t.start; f < t.end; f++) {
    const h = t.tasks[f];
    h.kind === Ks.OperationKind.DOWNLOAD && (o += `${h.start}-${h.end - 1}, `, s.set(a, f), a++, l.push(h.end - h.start));
  }
  if (a <= 1) {
    const f = (h) => {
      if (h >= t.end) {
        r();
        return;
      }
      const g = t.tasks[h++];
      if (g.kind === Ks.OperationKind.COPY)
        (0, zs.copyData)(g, n, t.oldFileFd, i, () => f(h));
      else {
        const w = e.createRequestOptions();
        w.headers.Range = `bytes=${g.start}-${g.end - 1}`;
        const y = e.httpExecutor.createRequest(w, (T) => {
          To(T, i) && (T.pipe(n, {
            end: !1
          }), T.once("end", () => f(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(y, i), y.end();
      }
    };
    f(t.start);
    return;
  }
  const m = e.createRequestOptions();
  m.headers.Range = o.substring(0, o.length - 2);
  const c = e.httpExecutor.createRequest(m, (f) => {
    if (!To(f, i))
      return;
    const h = (0, wo.safeGetHeader)(f, "content-type"), g = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(h);
    if (g == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const w = new zs.DataSplitter(n, t, s, g[1] || g[2], l, r);
    w.on("error", i), f.pipe(w), f.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function To(e, t) {
  if (e.statusCode >= 400)
    return t((0, wo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, wo.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.ProgressDifferentialDownloadCallbackTransform = void 0;
const gv = Gn;
var Qt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Qt || (Qt = {}));
class Ev extends gv.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Qt.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Qt.COPY) {
      r(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  beginFileCopy() {
    this.operationType = Qt.COPY;
  }
  beginRangeDownload() {
    this.operationType = Qt.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
mi.ProgressDifferentialDownloadCallbackTransform = Ev;
Object.defineProperty(er, "__esModule", { value: !0 });
er.DifferentialDownloader = void 0;
const vn = me, Ji = wt, yv = vt, _v = fn, vv = sn, Or = Mt, Js = pi, wv = mi;
class Tv {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, n, r) {
    this.blockAwareFileInfo = t, this.httpExecutor = n, this.options = r, this.fileMetadataBuffer = null, this.logger = r.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, vn.configureRequestUrl)(this.options.newUrl, t), (0, vn.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Or.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const m = l.end - l.start;
      l.kind === Or.OperationKind.DOWNLOAD ? o += m : a += m;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return r.info(`Full: ${Qs(s)}, To download: ${Qs(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, Ji.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, n).then(r).catch((i) => r().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, n) {
    const r = await (0, Ji.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, Ji.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, yv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let m;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const A = [];
        let S = 0;
        for (const x of t)
          x.kind === Or.OperationKind.DOWNLOAD && (A.push(x.end - x.start), S += x.end - x.start);
        const F = {
          expectedByteCounts: A,
          grandTotal: S
        };
        m = new wv.ProgressDifferentialDownloadCallbackTransform(F, this.options.cancellationToken, this.options.onProgress), l.push(m);
      }
      const c = new vn.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            c.validate();
          } catch (A) {
            s(A);
            return;
          }
          a(void 0);
        });
      }), l.push(o);
      let f = null;
      for (const A of l)
        A.on("error", s), f == null ? f = A : f = f.pipe(A);
      const h = l[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, Js.executeTasksUsingMultipleRangeRequests)(this, t, h, r, s), g(0);
        return;
      }
      let w = 0, y = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", g = (A) => {
        var S, F;
        if (A >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const x = t[A++];
        if (x.kind === Or.OperationKind.COPY) {
          m && m.beginFileCopy(), (0, _v.copyData)(x, h, r, s, () => g(A));
          return;
        }
        const re = `bytes=${x.start}-${x.end - 1}`;
        T.headers.range = re, (F = (S = this.logger) === null || S === void 0 ? void 0 : S.debug) === null || F === void 0 || F.call(S, `download range: ${re}`), m && m.beginRangeDownload();
        const le = this.httpExecutor.createRequest(T, (W) => {
          W.on("error", s), W.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), W.statusCode >= 400 && s((0, vn.createHttpError)(W)), W.pipe(h, {
            end: !1
          }), W.once("end", () => {
            m && m.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => g(A), 1e3)) : g(A);
          });
        });
        le.on("redirect", (W, Le, E) => {
          this.logger.info(`Redirect to ${Sv(E)}`), y = E, (0, vn.configureRequestUrl)(new vv.URL(y), T), le.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(le, s), le.end();
      }, g(0);
    });
  }
  async readRemoteBytes(t, n) {
    const r = Buffer.allocUnsafe(n + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${n}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(r, o), o += a.length;
    }), o !== r.length)
      throw new Error(`Received data length ${o} is not equal to expected ${r.length}`);
    return r;
  }
  request(t, n) {
    return new Promise((r, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, Js.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", n), a.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
er.DifferentialDownloader = Tv;
function Qs(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Sv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.GenericDifferentialDownloader = void 0;
const Av = er;
class Cv extends Av.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
hi.GenericDifferentialDownloader = Cv;
var Tt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = r;
  const t = me;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class n {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      r(this.emitter, "login", o);
    }
    progress(o) {
      r(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      r(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      r(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = n;
  function r(i, o, a) {
    i.on(o, a);
  }
})(Tt);
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.NoOpLogger = mt.AppUpdater = void 0;
const Ae = me, Ov = Yn, Iv = Wr, bv = wl, Gt = wt, Nv = _e, Qi = ni, bt = z, Rt = wu, Zs = Qn, Rv = li, el = Tu, Dv = Zn, Zi = ci, $v = Sl, Pv = Be, Fv = hi, Yt = Tt;
class ea extends bv.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, Ae.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Ae.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, el.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Ru();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Qi.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  constructor(t, n) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Yt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this.clientPromise = null, this.stagingUserIdPromise = new Qi.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Qi.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new Rv.ElectronAppAdapter(), this.httpExecutor = new el.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, Rt.parse)(r);
    if (i == null)
      throw (0, Ae.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = Lv(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const n = this.createProviderRuntimeOptions();
    let r;
    typeof t == "string" ? r = new Dv.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, Zi.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, Zi.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const n = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((r) => (n(), r)).catch((r) => {
      throw n(), this.emit("error", r, `Cannot check for updates: ${(r.stack || r).toString()}`), r;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((n) => n != null && n.downloadPromise ? (n.downloadPromise.then(() => {
      const r = ea.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new Lt.Notification(r).show();
    }), n) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), n));
  }
  static formatDownloadNotification(t, n, r) {
    return r == null && (r = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), r = {
      title: r.title.replace("{appName}", n).replace("{version}", t),
      body: r.body.replace("{appName}", n).replace("{version}", t)
    }, r;
  }
  async isStagingMatch(t) {
    const n = t.stagingPercentage;
    let r = n;
    if (r == null)
      return !0;
    if (r = parseInt(r, 10), isNaN(r))
      return this._logger.warn(`Staging percentage is NaN: ${n}`), !0;
    r = r / 100;
    const i = await this.stagingUserIdPromise.value, a = Ae.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${a}, user id: ${i}`), a < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, Rt.parse)(t.version);
    if (n == null)
      throw (0, Ae.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, Rt.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const o = (0, Rt.gt)(n, r), a = (0, Rt.lt)(n, r);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, Iv.release)();
    if (n)
      try {
        if ((0, Rt.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, Zi.createClient)(r, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, n = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": n })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), n = t.info;
    if (!await this.isUpdateAvailable(n))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${n.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", n), {
        isUpdateAvailable: !1,
        versionInfo: n,
        updateInfo: n
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(n);
    const r = new Ae.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Ae.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Ae.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Ae.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof Ae.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: n,
      requestHeaders: this.computeRequestHeaders(n.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw r(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(Yt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, Nv.load)(await (0, Gt.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const n = t.fileExtraDownloadHeaders;
    if (n != null) {
      const r = this.requestHeaders;
      return r == null ? n : {
        ...n,
        ...r
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = bt.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, Gt.readFile)(t, "utf-8");
      if (Ae.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Ae.UUID.v5((0, Ov.randomBytes)(4096), Ae.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, Gt.outputFile)(t, n);
    } catch (r) {
      this._logger.warn(`Couldn't write out staging user ID: ${r}`);
    }
    return n;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const n of Object.keys(t)) {
      const r = n.toLowerCase();
      if (r === "authorization" || r === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const n = (await this.configOnDisk.value).updaterCacheDirName, r = this._logger;
      n == null && r.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = bt.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new Zs.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const n = t.fileInfo, r = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: n.info.sha2,
      sha512: n.info.sha512
    };
    this.listenerCount(Yt.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (S) => this.emit(Yt.DOWNLOAD_PROGRESS, S));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = n.packageInfo;
    function s() {
      const S = decodeURIComponent(t.fileInfo.url.pathname);
      return S.endsWith(`.${t.fileExtension}`) ? bt.basename(S) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), m = l.cacheDirForPendingUpdate;
    await (0, Gt.mkdir)(m, { recursive: !0 });
    const c = s();
    let f = bt.join(m, c);
    const h = a == null ? null : bt.join(m, `package-${o}${bt.extname(a.path) || ".7z"}`), g = async (S) => (await l.setDownloadedFile(f, h, i, n, c, S), await t.done({
      ...i,
      downloadedFile: f
    }), h == null ? [f] : [f, h]), w = this._logger, y = await l.validateDownloadedPath(f, i, n, w);
    if (y != null)
      return f = y, await g(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, Gt.unlink)(f).catch(() => {
    })), A = await (0, Zs.createTempUpdateFile)(`temp-${c}`, m, w);
    try {
      await t.task(A, r, h, T), await (0, Ae.retry)(() => (0, Gt.rename)(A, f), 60, 500, 0, 0, (S) => S instanceof Error && /^EBUSY:/.test(S.message));
    } catch (S) {
      throw await T(), S instanceof Ae.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), S;
    }
    return w.info(`New version ${o} has been downloaded to ${f}`), await g(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = (0, Pv.blockmapFiles)(t.url, this.app.version, n.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const s = async (c) => {
        const f = await this.httpExecutor.downloadToBuffer(c, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (f == null || f.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, $v.gunzipSync)(f).toString());
        } catch (h) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${h}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: bt.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(Yt.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(Yt.DOWNLOAD_PROGRESS, c));
      const m = await Promise.all(a.map((c) => s(c)));
      return await new Fv.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(m[0], m[1]), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
mt.AppUpdater = ea;
function Lv(e) {
  const t = (0, Rt.prerelease)(e);
  return t != null && t.length > 0;
}
class Ru {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
mt.NoOpLogger = Ru;
Object.defineProperty(it, "__esModule", { value: !0 });
it.BaseUpdater = void 0;
const tl = Vr, xv = mt;
class kv extends xv.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Lt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (n) => (this.dispatchUpdateDownloaded(n), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, n = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const r = this.downloadedUpdateHelper, i = this.installerPath, o = r == null ? null : r.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${n}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: n,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  wrapSudo() {
    const { name: t } = this.app, n = `"${t} would like to update"`, r = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), i = [r];
    return /kdesudo/i.test(r) ? (i.push("--comment", n), i.push("-c")) : /gksudo/i.test(r) ? i.push("--message", n) : /pkexec/i.test(r) && i.push("--disable-internal-agent"), i.join(" ");
  }
  spawnSyncLog(t, n = [], r = {}) {
    this._logger.info(`Executing: ${t} with args: ${n}`);
    const i = (0, tl.spawnSync)(t, n, {
      env: { ...process.env, ...r },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: a, stdout: s, stderr: l } = i;
    if (o != null)
      throw this._logger.error(l), o;
    if (a != null && a !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${a}`);
    return s.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, n = [], r = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${n}`), new Promise((o, a) => {
      try {
        const s = { stdio: i, env: r, detached: !0 }, l = (0, tl.spawn)(t, n, s);
        l.on("error", (m) => {
          a(m);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
it.BaseUpdater = kv;
var kn = {}, tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Vt = wt, Uv = er, Mv = Sl;
class Bv extends Uv.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = Du(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await Hv(this.options.oldFile), i);
  }
}
tr.FileWithEmbeddedBlockMapDifferentialDownloader = Bv;
function Du(e) {
  return JSON.parse((0, Mv.inflateRawSync)(e).toString());
}
async function Hv(e) {
  const t = await (0, Vt.open)(e, "r");
  try {
    const n = (await (0, Vt.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, Vt.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, Vt.read)(t, i, 0, i.length, n - r.length - i.length), await (0, Vt.close)(t), Du(i);
  } catch (n) {
    throw await (0, Vt.close)(t), n;
  }
}
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.AppImageUpdater = void 0;
const nl = me, rl = Vr, jv = wt, qv = vt, wn = z, Gv = it, Yv = tr, Vv = fe, il = Tt;
class Wv extends Gv.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Vv.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, nl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, a, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, jv.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, n, r, i, o) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: n,
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(il.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(il.DOWNLOAD_PROGRESS, s)), await new Yv.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, nl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, qv.unlinkSync)(n);
    let r;
    const i = wn.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    wn.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = wn.join(wn.dirname(n), wn.basename(o)), (0, rl.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, rl.execFileSync)(r, [], { env: a })), !0;
  }
}
kn.AppImageUpdater = Wv;
var Un = {};
Object.defineProperty(Un, "__esModule", { value: !0 });
Un.DebUpdater = void 0;
const Xv = it, zv = fe, ol = Tt;
class Kv extends Xv.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, zv.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(ol.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(ol.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, n;
    return (n = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
  }
  doInstall(t) {
    const n = this.wrapSudo(), r = /pkexec/i.test(n) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
    return this.spawnSyncLog(n, [`${r}/bin/bash`, "-c", `'${o.join(" ")}'${r}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Un.DebUpdater = Kv;
var Mn = {};
Object.defineProperty(Mn, "__esModule", { value: !0 });
Mn.PacmanUpdater = void 0;
const Jv = it, al = Tt, Qv = fe;
class Zv extends Jv.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Qv.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(al.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(al.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, n;
    return (n = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
  }
  doInstall(t) {
    const n = this.wrapSudo(), r = /pkexec/i.test(n) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(n, [`${r}/bin/bash`, "-c", `'${o.join(" ")}'${r}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Mn.PacmanUpdater = Zv;
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.RpmUpdater = void 0;
const ew = it, sl = Tt, tw = fe;
class nw extends ew.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, tw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(sl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(sl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, n;
    return (n = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
  }
  doInstall(t) {
    const n = this.wrapSudo(), r = /pkexec/i.test(n) ? "" : '"', i = this.spawnSyncLog("which zypper"), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    let a;
    return i ? a = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", o] : a = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", o], this.spawnSyncLog(n, [`${r}/bin/bash`, "-c", `'${a.join(" ")}'${r}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Bn.RpmUpdater = nw;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.MacUpdater = void 0;
const ll = me, eo = wt, rw = vt, cl = z, iw = Xf, ow = mt, aw = fe, ul = Vr, fl = Yn;
class sw extends ow.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = Lt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
      this._logger.warn(r), this.emit("error", r);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let n = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const r = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, ul.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, ul.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      r.info(`Checked 'uname -a': arm64=${h}`), a = a || h;
    } catch (f) {
      r.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var h;
      return f.url.pathname.includes("arm64") || ((h = f.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    a && n.some(s) ? n = n.filter((f) => a === s(f)) : n = n.filter((f) => !s(f));
    const l = (0, aw.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, ll.newError)(`ZIP file not provided: ${(0, ll.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const m = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const g = cl.join(this.downloadedUpdateHelper.cacheDir, c), w = () => (0, eo.pathExistsSync)(g) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let y = !0;
        w() && (y = await this.differentialDownloadInstaller(l, t, f, m, c)), y && await this.httpExecutor.download(l.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = cl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, eo.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, eo.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, iw.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (m) => {
      const c = m.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((m, c) => {
      const f = (0, fl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), g = `/${(0, fl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, y) => {
        const T = w.url;
        if (a.info(`${T} requested`), T === "/") {
          if (!w.headers.authorization || w.headers.authorization.indexOf("Basic ") === -1) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("No authenthication info");
            return;
          }
          const F = w.headers.authorization.split(" ")[1], x = Buffer.from(F, "base64").toString("ascii"), [re, le] = x.split(":");
          if (re !== "autoupdater" || le !== f) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const W = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          y.writeHead(200, { "Content-Type": "application/json", "Content-Length": W.length }), y.end(W);
          return;
        }
        if (!T.startsWith(g)) {
          a.warn(`${T} requested, but not supported`), y.writeHead(404), y.end();
          return;
        }
        a.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let A = !1;
        y.on("finish", () => {
          A || (this.nativeUpdater.removeListener("error", c), m([]));
        });
        const S = (0, rw.createReadStream)(i);
        S.on("error", (F) => {
          try {
            y.end();
          } catch (x) {
            a.warn(`cannot end response: ${x}`);
          }
          A = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${F}`));
        }), y.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), S.pipe(y);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : m([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
Hn.MacUpdater = sw;
var jn = {}, ta = {};
Object.defineProperty(ta, "__esModule", { value: !0 });
ta.verifySignature = cw;
const dl = me, $u = Vr, lw = Wr, hl = z;
function cw(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, $u.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (a, s, l) => {
      var m;
      try {
        if (a != null || l) {
          to(n, a, l, i), r(null);
          return;
        }
        const c = uw(s);
        if (c.Status === 0) {
          try {
            const w = hl.normalize(c.Path), y = hl.normalize(t);
            if (n.info(`LiteralPath: ${w}. Update Path: ${y}`), w !== y) {
              to(n, new Error(`LiteralPath of ${w} is different than ${y}`), l, i), r(null);
              return;
            }
          } catch (w) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(m = w.message) !== null && m !== void 0 ? m : w.stack}`);
          }
          const h = (0, dl.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const w of e) {
            const y = (0, dl.parseDn)(w);
            if (y.size ? g = Array.from(y.keys()).every((A) => y.get(A) === h.get(A)) : w === h.get("CN") && (n.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (h, g) => h === "RawData" ? void 0 : g, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (c) {
        to(n, c, null, i), r(null);
        return;
      }
    });
  });
}
function uw(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function to(e, t, n, r) {
  if (fw()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, $u.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function fw() {
  const e = lw.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.NsisUpdater = void 0;
const Ir = me, pl = z, dw = it, hw = tr, ml = Tt, pw = fe, mw = wt, gw = ta, gl = sn;
class Ew extends dw.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, gw.verifySignature)(r, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, pw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, a, s) => {
        const l = r.packageInfo, m = l != null && a != null;
        if (m && t.disableWebInstaller)
          throw (0, Ir.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !m && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (m || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, Ir.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, Ir.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (m && await this.differentialDownloadWebPackage(t, l, a, n))
          try {
            await this.httpExecutor.download(new gl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, mw.unlink)(a);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let n;
    try {
      if (n = (await this.configOnDisk.value).publisherName, n == null)
        return null;
    } catch (r) {
      if (r.code === "ENOENT")
        return null;
      throw r;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(n) ? n : [n], t);
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const r = ["--updated"];
    t.isSilent && r.push("/S"), t.isForceRunAfter && r.push("--force-run"), this.installDirectory && r.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && r.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(pl.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? Lt.shell.openPath(n).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new gl.URL(n.path),
        oldFile: pl.join(this.downloadedUpdateHelper.cacheDir, Ir.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(ml.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(ml.DOWNLOAD_PROGRESS, a)), await new hw.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
jn.NsisUpdater = Ew;
(function(e) {
  var t = Oe && Oe.__createBinding || (Object.create ? function(T, A, S, F) {
    F === void 0 && (F = S);
    var x = Object.getOwnPropertyDescriptor(A, S);
    (!x || ("get" in x ? !A.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return A[S];
    } }), Object.defineProperty(T, F, x);
  } : function(T, A, S, F) {
    F === void 0 && (F = S), T[F] = A[S];
  }), n = Oe && Oe.__exportStar || function(T, A) {
    for (var S in T) S !== "default" && !Object.prototype.hasOwnProperty.call(A, S) && t(A, T, S);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = wt, i = z;
  var o = it;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = mt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = fe;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = kn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var m = Un;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return m.DebUpdater;
  } });
  var c = Mn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = Bn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = Hn;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var g = jn;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), n(Tt, e);
  let w;
  function y() {
    if (process.platform === "win32")
      w = new jn.NsisUpdater();
    else if (process.platform === "darwin")
      w = new Hn.MacUpdater();
    else {
      w = new kn.AppImageUpdater();
      try {
        const T = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(T))
          return w;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const A = (0, r.readFileSync)(T).toString().trim();
        switch (console.info("Found package-type:", A), A) {
          case "deb":
            w = new Un.DebUpdater();
            break;
          case "rpm":
            w = new Bn.RpmUpdater();
            break;
          case "pacman":
            w = new Mn.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (T) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", T.message);
      }
    }
    return w;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => w || y()
  });
})(Al);
const yw = /* @__PURE__ */ Kf(Al), _w = z.join(Ce.getPath("userData"), "cafe_stock.db"), K = new zf(_w);
function vw() {
  K.pragma("table_info(announcements)").some((n) => n.name === "file_path") || (console.log("Running migration: Adding file_path column to announcements table"), K.exec("ALTER TABLE announcements ADD COLUMN file_path TEXT"), console.log("Migration completed: file_path column added"));
}
K.exec(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL,
    ann_date TEXT NOT NULL,
    ann_type TEXT,
    title TEXT,
    content TEXT,
    pub_time TEXT,
    file_path TEXT,
    UNIQUE(ts_code, ann_date, title)
  );

  CREATE INDEX IF NOT EXISTS idx_ann_date_pub_time ON announcements (ann_date DESC, pub_time DESC);
  CREATE INDEX IF NOT EXISTS idx_ann_ts_code ON announcements (ts_code);

  CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL UNIQUE,
    symbol TEXT,
    name TEXT,
    area TEXT,
    industry TEXT,
    fullname TEXT,
    enname TEXT,
    cnspell TEXT,
    market TEXT,
    exchange TEXT,
    curr_type TEXT,
    list_status TEXT,
    list_date TEXT,
    delist_date TEXT,
    is_hs TEXT,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_stock_name ON stocks (name);
  CREATE INDEX IF NOT EXISTS idx_stock_industry ON stocks (industry);
  CREATE INDEX IF NOT EXISTS idx_stock_list_status ON stocks (list_status);

  CREATE TABLE IF NOT EXISTS sync_flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sync_type TEXT NOT NULL UNIQUE,
    last_sync_date TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS favorite_stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_favorite_ts_code ON favorite_stocks (ts_code);
`);
vw();
const Pu = (e) => {
  const t = K.prepare(`
    INSERT OR IGNORE INTO announcements (ts_code, ann_date, ann_type, title, content, pub_time, file_path)
    VALUES (@ts_code, @ann_date, @ann_type, @title, @content, @pub_time, @file_path)
  `);
  K.transaction((r) => {
    for (const i of r)
      t.run({
        ts_code: i.ts_code || null,
        ann_date: i.ann_date || null,
        ann_type: i.ann_type || null,
        title: i.title || null,
        content: i.content || null,
        pub_time: i.pub_time || null,
        file_path: i.file_path || null
      });
  })(e);
}, ww = () => {
  const e = K.prepare("SELECT MAX(ann_date) as max_date FROM announcements").get();
  return (e == null ? void 0 : e.max_date) || null;
}, Tw = () => {
  const e = K.prepare("SELECT MIN(ann_date) as min_date FROM announcements").get();
  return (e == null ? void 0 : e.min_date) || null;
}, Sw = (e, t) => K.prepare(
  `
    SELECT COUNT(*) as count FROM announcements 
    WHERE ann_date >= ? AND ann_date <= ?
  `
).get(e, t).count > 0, Aw = (e, t) => K.prepare(
  `
    SELECT * FROM announcements 
    ORDER BY ann_date DESC, pub_time DESC 
    LIMIT ? OFFSET ?
  `
).all(e, t), Cw = () => K.prepare("SELECT COUNT(*) as count FROM announcements").get().count, Ow = (e, t, n, r, i) => {
  let o = `
    SELECT
      s.ts_code,
      s.name as stock_name,
      s.industry,
      s.market,
      COUNT(a.id) as announcement_count,
      MAX(a.ann_date) as latest_ann_date,
      (
        SELECT title
        FROM announcements a2
        WHERE a2.ts_code = s.ts_code
        ${n && r ? `AND a2.ann_date BETWEEN '${n}' AND '${r}'` : ""}
        ORDER BY a2.ann_date DESC, a2.pub_time DESC
        LIMIT 1
      ) as latest_ann_title
    FROM stocks s
    INNER JOIN announcements a ON s.ts_code = a.ts_code
  `;
  const a = [], s = [];
  return n && r && (s.push("a.ann_date BETWEEN ? AND ?"), a.push(n, r)), i && i !== "all" && (s.push("s.market = ?"), a.push(i)), s.length > 0 && (o += " WHERE " + s.join(" AND ")), o += `
    GROUP BY s.ts_code, s.name, s.industry, s.market
    ORDER BY MAX(a.ann_date) DESC, s.name
    LIMIT ? OFFSET ?
  `, a.push(e, t), K.prepare(o).all(...a);
}, Iw = (e, t = 100) => K.prepare(
  `
    SELECT * FROM announcements 
    WHERE ts_code = ?
    ORDER BY ann_date DESC, pub_time DESC
    LIMIT ?
  `
).all(e, t), bw = (e, t, n) => {
  let r = `
    SELECT COUNT(DISTINCT s.ts_code) as count
    FROM stocks s
    INNER JOIN announcements a ON s.ts_code = a.ts_code
  `;
  const i = [], o = [];
  return e && t && (o.push("a.ann_date BETWEEN ? AND ?"), i.push(e, t)), n && n !== "all" && (o.push("s.market = ?"), i.push(n)), o.length > 0 && (r += " WHERE " + o.join(" AND ")), K.prepare(r).get(...i).count;
}, Nw = (e, t, n, r, i, o) => {
  const a = `%${e}%`;
  let s = `
    SELECT
      s.ts_code,
      s.name as stock_name,
      s.industry,
      s.market,
      COUNT(a.id) as announcement_count,
      MAX(a.ann_date) as latest_ann_date,
      (
        SELECT title
        FROM announcements a2
        WHERE a2.ts_code = s.ts_code
        ${r && i ? `AND a2.ann_date BETWEEN '${r}' AND '${i}'` : ""}
        ORDER BY a2.ann_date DESC, a2.pub_time DESC
        LIMIT 1
      ) as latest_ann_title
    FROM stocks s
    INNER JOIN announcements a ON s.ts_code = a.ts_code
    WHERE (s.name LIKE ? OR s.ts_code LIKE ? OR s.symbol LIKE ?)
  `;
  const l = [a, a, a];
  return r && i && (s += " AND a.ann_date BETWEEN ? AND ?", l.push(r, i)), o && o !== "all" && (s += " AND s.market = ?", l.push(o)), s += `
    GROUP BY s.ts_code, s.name, s.industry, s.market
    ORDER BY MAX(a.ann_date) DESC, s.name
    LIMIT ? OFFSET ?
  `, l.push(t, n), K.prepare(s).all(...l);
}, Rw = (e, t, n, r) => {
  const i = `%${e}%`;
  let o = `
    SELECT COUNT(DISTINCT s.ts_code) as count
    FROM stocks s
    INNER JOIN announcements a ON s.ts_code = a.ts_code
    WHERE (s.name LIKE ? OR s.ts_code LIKE ? OR s.symbol LIKE ?)
  `;
  const a = [i, i, i];
  return t && n && (o += " AND a.ann_date BETWEEN ? AND ?", a.push(t, n)), r && r !== "all" && (o += " AND s.market = ?", a.push(r)), K.prepare(o).get(...a).count;
}, no = (e) => {
  const t = (/* @__PURE__ */ new Date()).toISOString(), n = K.prepare(`
    INSERT INTO stocks (
      ts_code, symbol, name, area, industry, fullname, enname, cnspell,
      market, exchange, curr_type, list_status, list_date, delist_date, is_hs, updated_at
    )
    VALUES (
      @ts_code, @symbol, @name, @area, @industry, @fullname, @enname, @cnspell,
      @market, @exchange, @curr_type, @list_status, @list_date, @delist_date, @is_hs, @updated_at
    )
    ON CONFLICT(ts_code) DO UPDATE SET
      symbol = excluded.symbol,
      name = excluded.name,
      area = excluded.area,
      industry = excluded.industry,
      fullname = excluded.fullname,
      enname = excluded.enname,
      cnspell = excluded.cnspell,
      market = excluded.market,
      exchange = excluded.exchange,
      curr_type = excluded.curr_type,
      list_status = excluded.list_status,
      list_date = excluded.list_date,
      delist_date = excluded.delist_date,
      is_hs = excluded.is_hs,
      updated_at = excluded.updated_at
  `);
  K.transaction((i) => {
    for (const o of i)
      n.run({
        ts_code: o.ts_code || null,
        symbol: o.symbol || null,
        name: o.name || null,
        area: o.area || null,
        industry: o.industry || null,
        fullname: o.fullname || null,
        enname: o.enname || null,
        cnspell: o.cnspell || null,
        market: o.market || null,
        exchange: o.exchange || null,
        curr_type: o.curr_type || null,
        list_status: o.list_status || null,
        list_date: o.list_date || null,
        delist_date: o.delist_date || null,
        is_hs: o.is_hs || null,
        updated_at: t
      });
  })(e);
}, Dw = () => K.prepare("SELECT * FROM stocks ORDER BY ts_code").all(), Zt = () => K.prepare("SELECT COUNT(*) as count FROM stocks").get().count, $w = (e, t = 50) => {
  const n = `%${e}%`;
  return K.prepare(
    `
    SELECT * FROM stocks 
    WHERE name LIKE ? OR ts_code LIKE ? OR symbol LIKE ? OR cnspell LIKE ?
    ORDER BY 
      CASE 
        WHEN ts_code = ? THEN 1
        WHEN symbol = ? THEN 2
        WHEN name = ? THEN 3
        ELSE 4
      END,
      ts_code
    LIMIT ?
  `
  ).all(n, n, n, n, e, e, e, t);
}, Fu = (e) => {
  const t = K.prepare("SELECT last_sync_date FROM sync_flags WHERE sync_type = ?").get(e);
  return (t == null ? void 0 : t.last_sync_date) || null;
}, Pw = (e, t) => {
  const n = (/* @__PURE__ */ new Date()).toISOString();
  K.prepare(
    `
    INSERT INTO sync_flags (sync_type, last_sync_date, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(sync_type) DO UPDATE SET
      last_sync_date = excluded.last_sync_date,
      updated_at = excluded.updated_at
  `
  ).run(e, t, n);
}, Lu = (e) => {
  const t = Fu(e);
  if (!t) return !1;
  const n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  return t === n;
}, Fw = (e) => {
  const t = (/* @__PURE__ */ new Date()).toISOString();
  try {
    return K.prepare(
      `
      INSERT INTO favorite_stocks (ts_code, created_at)
      VALUES (?, ?)
    `
    ).run(e, t), !0;
  } catch (n) {
    if (n.code === "SQLITE_CONSTRAINT")
      return !1;
    throw n;
  }
}, Lw = (e) => K.prepare("DELETE FROM favorite_stocks WHERE ts_code = ?").run(e).changes > 0, xw = (e) => K.prepare("SELECT COUNT(*) as count FROM favorite_stocks WHERE ts_code = ?").get(e).count > 0, kw = () => K.prepare("SELECT ts_code FROM favorite_stocks ORDER BY created_at DESC").all().map((t) => t.ts_code), Uw = () => K.prepare("SELECT COUNT(*) as count FROM favorite_stocks").get().count, Mw = (e, t, n, r) => {
  let i = `
    SELECT
      s.ts_code,
      s.name as stock_name,
      s.industry,
      s.market,
      COUNT(a.id) as announcement_count,
      MAX(a.ann_date) as latest_ann_date,
      (
        SELECT title
        FROM announcements a2
        WHERE a2.ts_code = s.ts_code
        ${n && r ? `AND a2.ann_date BETWEEN '${n}' AND '${r}'` : ""}
        ORDER BY a2.ann_date DESC, a2.pub_time DESC
        LIMIT 1
      ) as latest_ann_title
    FROM stocks s
    INNER JOIN favorite_stocks f ON s.ts_code = f.ts_code
    INNER JOIN announcements a ON s.ts_code = a.ts_code
  `;
  const o = [];
  return n && r && (i += " WHERE a.ann_date BETWEEN ? AND ?", o.push(n, r)), i += `
    GROUP BY s.ts_code, s.name, s.industry, s.market
    ORDER BY MAX(a.ann_date) DESC, s.name
    LIMIT ? OFFSET ?
  `, o.push(e, t), K.prepare(i).all(...o);
}, Bw = (e, t) => {
  let n = `
    SELECT COUNT(DISTINCT s.ts_code) as count
    FROM stocks s
    INNER JOIN favorite_stocks f ON s.ts_code = f.ts_code
    INNER JOIN announcements a ON s.ts_code = a.ts_code
  `;
  const r = [];
  return e && t && (n += " WHERE a.ann_date BETWEEN ? AND ?", r.push(e, t)), K.prepare(n).get(...r).count;
}, Yr = class Yr {
  static async request(t, n = {}, r = "") {
    const i = {
      api_name: t,
      token: this.TOKEN,
      params: n,
      fields: Array.isArray(r) ? r.join(",") : r
    };
    try {
      const o = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(i)
      });
      if (!o.ok)
        throw new Error(`HTTP Error: ${o.status}`);
      const a = await o.json();
      if (a.code !== 0)
        throw new Error(`Tushare Error [${a.code}]: ${a.msg}`);
      if (!a.data)
        return [];
      const { fields: s, items: l } = a.data;
      return l.map((m) => {
        const c = {};
        return s.forEach((f, h) => {
          c[f] = m[h];
        }), c;
      });
    } catch (o) {
      throw console.error("Tushare Request Failed:", o), o;
    }
  }
  /**
   * 获取全量公告数据
   * 文档: https://tushare.pro/document/2?doc_id=176
   * 接口：anns_d
   * 描述：获取上市公司公告数据
   * 限量：单次最大2000，总量不限制
   * 权限：用户需要至少2000积分才可以调取，5000积分以上频次相对较高，具体请参阅积分获取办法
   *
   * 输入参数：
   * ts_code: str, 股票代码（支持多个股票同时提取，逗号分隔）
   * ann_date: str, 公告日期（YYYYMMDD格式，支持单日和多日）
   * start_date: str, 公告开始日期
   * end_date: str, 公告结束日期
   *
   * 输出参数：
   * ts_code: str, 股票代码
   * ann_date: str, 公告日期
   * ann_type: str, 公告类型
   * title: str, 公告标题
   * content: str, 公告内容
   * pub_time: str, 公告发布时间
   */
  static async getAnnouncements(t, n, r, i, o = 2e3, a = 0) {
    return this.request("anns_d", {
      ts_code: t,
      ann_date: n,
      start_date: r,
      end_date: i,
      limit: o,
      // Internal support for pagination if API allows, or wrapper logic
      offset: a
    });
  }
  /**
   * 获取A股股票列表
   * 文档: https://tushare.pro/document/2?doc_id=25
   * 接口：stock_basic
   * 描述：获取基础信息数据，包括股票代码、名称、上市日期、退市日期等
   * 限量：单次最大5000条
   * 权限：用户需要至少120积分才可以调取
   *
   * 输入参数：
   * ts_code: str, 股票代码
   * name: str, 股票名称
   * exchange: str, 交易所 SSE上交所 SZSE深交所 BSE北交所
   * market: str, 市场类别 主板 创业板 科创板 CDR
   * is_hs: str, 是否沪深港通标的，N否 H沪股通 S深股通
   * list_status: str, 上市状态 L上市 D退市 P暂停上市，默认L
   * limit: int, 单次返回数据长度
   * offset: int, 开始行数
   *
   * 输出参数：
   * ts_code: str, TS代码
   * symbol: str, 股票代码
   * name: str, 股票名称
   * area: str, 地域
   * industry: str, 所属行业
   * fullname: str, 股票全称
   * enname: str, 英文全称
   * cnspell: str, 拼音缩写
   * market: str, 市场类型（主板/创业板/科创板/CDR）
   * exchange: str, 交易所代码
   * curr_type: str, 交易货币
   * list_status: str, 上市状态 L上市 D退市 P暂停上市
   * list_date: str, 上市日期
   * delist_date: str, 退市日期
   * is_hs: str, 是否沪深港通标的，N否 H沪股通 S深股通
   */
  static async getStockList(t, n, r, i, o, a = "L", s = 5e3, l = 0) {
    return this.request("stock_basic", {
      ts_code: t,
      name: n,
      exchange: r,
      market: i,
      is_hs: o,
      list_status: a,
      limit: s,
      offset: l
    });
  }
  /**
   * 获取交易日历
   * 文档: https://tushare.pro/document/2?doc_id=26
   * 接口：trade_cal
   * 描述：获取各大交易所交易日历数据，默认提取的是上交所
   * 限量：单次最大提取4000条
   * 权限：用户需要至少120积分才可以调取
   *
   * 输入参数：
   * exchange: str, 交易所 SSE上交所 SZSE深交所 BSE北交所
   * start_date: str, 开始日期 (YYYYMMDD格式)
   * end_date: str, 结束日期 (YYYYMMDD格式)
   * is_open: str, 是否交易 '0'休市 '1'交易
   *
   * 输出参数：
   * exchange: str, 交易所 SSE上交所 SZSE深交所
   * cal_date: str, 日历日期
   * is_open: str, 是否交易 0休市 1交易
   * pretrade_date: str, 上一个交易日
   */
  static async getTradeCalendar(t = "SSE", n, r, i) {
    return this.request("trade_cal", {
      exchange: t,
      start_date: n,
      end_date: r,
      is_open: i
    });
  }
  /**
   * 获取公告原文 URL
   * 文档: https://tushare.pro/document/2?doc_id=176
   * 接口：anns_d
   * 描述：获取全量公告数据，提供 PDF 下载 URL
   * 限量：单次最大 2000 条
   * 权限：本接口为单独权限
   *
   * 输入参数：
   * ts_code: str, 股票代码
   * ann_date: str, 公告日期（YYYYMMDD格式）
   * start_date: str, 公告开始日期
   * end_date: str, 公告结束日期
   *
   * 输出参数：
   * ann_date: str, 公告日期
   * ts_code: str, 股票代码
   * name: str, 股票名称
   * title: str, 标题
   * url: str, URL，原文下载链接
   * rec_time: datetime, 发布时间
   */
  static async getAnnouncementFiles(t, n, r, i) {
    return this.request("anns_d", {
      ts_code: t,
      ann_date: n,
      start_date: r,
      end_date: i
    });
  }
};
Yr.TOKEN = "834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d", Yr.BASE_URL = "http://api.tushare.pro";
let nt = Yr;
const { autoUpdater: Me } = yw, Hw = Yf(import.meta.url), So = z.dirname(Hw), qn = process.env.NODE_ENV === "development" || !Ce.isPackaged;
let P = null, br = null;
const na = Ce;
let ro = !1, io = !1, oo = !1;
Me.autoDownload = !1;
Me.autoInstallOnAppQuit = !0;
function El() {
  qn || Hf.defaultSession.webRequest.onHeadersReceived((e, t) => {
    t({
      responseHeaders: {
        ...e.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.tushare.pro https://github.com;"
        ]
      }
    });
  }), P = new yl({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "酷咖啡",
    webPreferences: {
      preload: z.join(So, "preload.cjs"),
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !1,
      webSecurity: !0,
      webviewTag: !0
      // 启用 webview 标签
    },
    show: !1,
    backgroundColor: "#ffffff"
  }), P.webContents.on("console-message", (e, t, n, r, i) => {
    const a = {
      0: "LOG",
      1: "INFO",
      2: "WARN",
      3: "ERROR"
    }[t] || "UNKNOWN", s = i ? `[${i}]` : "", l = r ? `:${r}` : "";
    switch (t) {
      case 0:
        console.log(`[Renderer ${a}]${s}${l} ${n}`);
        break;
      case 1:
        console.info(`[Renderer ${a}]${s}${l} ${n}`);
        break;
      case 2:
        console.warn(`[Renderer ${a}]${s}${l} ${n}`);
        break;
      case 3:
        console.error(`[Renderer ${a}]${s}${l} ${n}`);
        break;
      default:
        console.log(`[Renderer ${a}]${s}${l} ${n}`);
    }
  }), P.once("ready-to-show", () => {
    P == null || P.show(), Ke.isSupported() && new Ke({
      title: "酷咖啡",
      body: "应用已启动，准备好为您服务！"
    }).show();
  }), qn ? (P.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173"), P.webContents.openDevTools()) : P.loadFile(z.join(So, "../dist/index.html")), P.on("close", (e) => {
    na.isQuitting || (e.preventDefault(), P == null || P.hide());
  }), P.on("closed", () => {
    P = null;
  });
}
function jw() {
  const e = qn ? z.join(So, "../build/tray-icon.png") : z.join(process.resourcesPath, "build/tray-icon.png");
  let t;
  try {
    t = Ai.createFromPath(e), t.isEmpty() && (t = Ai.createEmpty());
  } catch (r) {
    console.error("创建托盘图标失败:", r), t = Ai.createEmpty();
  }
  br = new jf(t), br.setToolTip("酷咖啡");
  const n = qf.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        P == null || P.show();
      }
    },
    { type: "separator" },
    {
      label: "关于",
      click: () => {
        Ke.isSupported() && new Ke({
          title: "酷咖啡",
          body: `版本: ${Ce.getVersion()}
基于 Electron + React`
        }).show();
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        na.isQuitting = !0, Ce.quit();
      }
    }
  ]);
  br.setContextMenu(n), br.on("click", () => {
    P != null && P.isVisible() ? P.hide() : P == null || P.show();
  });
}
function qw() {
  _l.register("CommandOrControl+Shift+S", () => {
    P != null && P.isVisible() ? P.hide() : P == null || P.show();
  });
}
async function xu() {
  if (ro)
    return console.log("Sync already in progress, skipping"), { status: "skipped", message: "Sync already in progress" };
  ro = !0, console.log("Starting incremental sync...");
  let e = 0;
  try {
    const t = ww(), r = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    if (t === r)
      return console.log("Already synced to today."), { status: "success", message: "Already up to date", totalSynced: 0 };
    const i = t || r;
    console.log(`Incremental sync from ${i} to ${r}`);
    let o = 0;
    const a = 2e3;
    let s = !0;
    for (; s; ) {
      const l = await nt.getAnnouncements(void 0, void 0, i, r, a, o);
      if (l.length > 0 ? (Pu(l), console.log(`Synced ${l.length} items.`), e += l.length, P == null || P.webContents.send("data-updated", {
        type: "incremental",
        totalSynced: e,
        currentBatchSize: l.length
      }), l.length < a ? s = !1 : o += a) : s = !1, o > 1e5) {
        console.warn("Sync limit reached (safety break).");
        break;
      }
    }
    return console.log(`Incremental sync completed. Total: ${e}`), { status: "success", message: "Sync completed", totalSynced: e };
  } catch (t) {
    return console.error("Incremental sync failed:", t), { status: "failed", message: t.message || "Unknown error" };
  } finally {
    ro = !1;
  }
}
async function Gw() {
  if (io)
    return console.log("History loading already in progress"), { status: "skipped", message: "Loading already in progress" };
  io = !0, console.log("Loading historical data...");
  let e = 0;
  try {
    const t = Tw();
    let n;
    t ? n = t : n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    const r = /* @__PURE__ */ new Date(n.slice(0, 4) + "-" + n.slice(4, 6) + "-" + n.slice(6, 8));
    r.setMonth(r.getMonth() - 1);
    const i = r.toISOString().slice(0, 10).replace(/-/g, "");
    if (console.log(`Loading history from ${i} to ${n}`), Sw(i, n))
      return console.log("Data already exists in this range"), { status: "success", message: "Data already exists", totalLoaded: 0 };
    let o = 0;
    const a = 2e3;
    let s = !0;
    for (; s; ) {
      const l = await nt.getAnnouncements(void 0, void 0, i, n, a, o);
      if (l.length > 0 ? (Pu(l), console.log(`Loaded ${l.length} historical items.`), e += l.length, P == null || P.webContents.send("data-updated", {
        type: "historical",
        totalLoaded: e,
        currentBatchSize: l.length,
        startDate: i,
        endDate: n
      }), l.length < a ? s = !1 : o += a) : s = !1, o > 5e4) {
        console.warn("History load limit reached (safety break).");
        break;
      }
    }
    return console.log(`Historical data loaded. Total: ${e}`), { status: "success", message: "History loaded", totalLoaded: e, startDate: i, endDate: n };
  } catch (t) {
    return console.error("Historical data load failed:", t), { status: "failed", message: t.message || "Unknown error" };
  } finally {
    io = !1;
  }
}
async function ku() {
  const e = "stock_list";
  if (Lu(e))
    return console.log("Stock list already synced today."), { status: "skipped", message: "Already synced today", totalStocks: Zt() };
  if (oo)
    return console.log("Stock sync already in progress"), { status: "skipped", message: "Sync already in progress" };
  oo = !0, console.log("Starting stock list sync...");
  let t = 0;
  try {
    console.log("Fetching listed stocks...");
    const n = await nt.getStockList(void 0, void 0, void 0, void 0, void 0, "L", 5e3, 0);
    n.length > 0 && (no(n), t += n.length, console.log(`Synced ${n.length} listed stocks.`)), console.log("Fetching delisted stocks...");
    const r = await nt.getStockList(void 0, void 0, void 0, void 0, void 0, "D", 5e3, 0);
    r.length > 0 && (no(r), t += r.length, console.log(`Synced ${r.length} delisted stocks.`)), console.log("Fetching paused stocks...");
    const i = await nt.getStockList(void 0, void 0, void 0, void 0, void 0, "P", 5e3, 0);
    i.length > 0 && (no(i), t += i.length, console.log(`Synced ${i.length} paused stocks.`));
    const o = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    return Pw(e, o), console.log(`Stock list sync completed. Total synced: ${t}, Total in DB: ${Zt()}`), P == null || P.webContents.send("stocks-updated", {
      totalSynced: t,
      totalInDB: Zt()
    }), {
      status: "success",
      message: "Stock list synced successfully",
      totalSynced: t,
      totalInDB: Zt()
    };
  } catch (n) {
    return console.error("Stock list sync failed:", n), { status: "failed", message: n.message || "Unknown error" };
  } finally {
    oo = !1;
  }
}
function Yw() {
  ne.handle("show-notification", async (e, t, n) => {
    Ke.isSupported() && new Ke({ title: t, body: n }).show();
  }), ne.handle("get-app-version", async () => Ce.getVersion()), ne.handle("get-announcements", async (e, t, n) => {
    const r = (t - 1) * n, i = Aw(n, r), o = Cw();
    console.log(`[IPC] get-announcements: page=${t}, offset=${r}, items=${i.length}, total=${o}`);
    const a = Math.ceil(o / n), s = t >= a - 2 && o > 0;
    return {
      items: i,
      total: o,
      shouldLoadHistory: s
    };
  }), ne.handle("trigger-incremental-sync", async () => await xu()), ne.handle("load-historical-data", async () => await Gw()), ne.handle("sync-stock-list", async () => await ku()), ne.handle("get-all-stocks", async () => Dw()), ne.handle("count-stocks", async () => Zt()), ne.handle("search-stocks", async (e, t, n) => $w(t, n)), ne.handle("get-stock-sync-status", async () => {
    const e = Fu("stock_list"), t = Lu("stock_list"), n = Zt();
    return {
      lastSync: e,
      syncedToday: t,
      totalStocks: n
    };
  }), ne.handle(
    "get-announcements-grouped",
    async (e, t, n, r, i, o) => {
      try {
        const a = (t - 1) * n, s = Ow(n, a, r, i, o), l = bw(r, i, o);
        return console.log(
          `[IPC] get-announcements-grouped: page=${t}, offset=${a}, items=${s.length}, total=${l}, dateRange=${r}-${i}, market=${o}`
        ), {
          items: s,
          total: l,
          page: t,
          pageSize: n
        };
      } catch (a) {
        throw console.error("Failed to get grouped announcements:", a), a;
      }
    }
  ), ne.handle("get-stock-announcements", async (e, t, n = 100) => {
    try {
      return console.log(`[IPC] get-stock-announcements: tsCode=${t}, limit=${n}`), Iw(t, n);
    } catch (r) {
      throw console.error("Failed to get stock announcements:", r), r;
    }
  }), ne.handle(
    "search-announcements-grouped",
    async (e, t, n, r, i, o, a) => {
      try {
        const s = (n - 1) * r, l = Nw(t, r, s, i, o, a), m = Rw(t, i, o, a);
        return console.log(
          `[IPC] search-announcements-grouped: keyword=${t}, page=${n}, items=${l.length}, total=${m}, dateRange=${i}-${o}, market=${a}`
        ), {
          items: l,
          total: m,
          page: n,
          pageSize: r
        };
      } catch (s) {
        throw console.error("Failed to search grouped announcements:", s), s;
      }
    }
  ), ne.handle("get-latest-trade-date", async () => {
    try {
      const t = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ""), n = /* @__PURE__ */ new Date();
      n.setDate(n.getDate() - 30);
      const r = n.toISOString().slice(0, 10).replace(/-/g, "");
      console.log(`[IPC] get-latest-trade-date: fetching from ${r} to ${t}`);
      const i = await nt.getTradeCalendar("SSE", r, t, "1");
      if (i && i.length > 0) {
        const o = i.filter((a) => a.is_open === "1" || a.is_open === 1).sort((a, s) => s.cal_date.localeCompare(a.cal_date));
        if (o.length > 0) {
          const a = o[0].cal_date;
          return console.log(`[IPC] get-latest-trade-date: found ${a}`), a;
        }
      }
      return console.log("[IPC] get-latest-trade-date: no trade date found, returning today"), t;
    } catch (e) {
      return console.error("Failed to get latest trade date:", e), (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    }
  }), ne.handle("get-announcement-pdf", async (e, t, n, r) => {
    try {
      console.log(`[IPC] get-announcement-pdf: tsCode=${t}, annDate=${n}, title=${r}`);
      const i = await nt.getAnnouncementFiles(t, n);
      console.log(`[IPC] Found ${i.length} announcements for ${t} on ${n}`);
      let o = i.find((a) => a.title === r);
      return o || (o = i.find((a) => {
        const s = a.title || "", l = r || "";
        return s.includes(l) || l.includes(s);
      })), o && o.url ? (console.log(`[IPC] Found PDF URL: ${o.url}`), {
        success: !0,
        url: o.url
      }) : (console.log(`[IPC] No PDF found for announcement: ${r}`), {
        success: !1,
        message: "该公告暂无 PDF 文件"
      });
    } catch (i) {
      return console.error("Failed to get announcement PDF:", i), {
        success: !1,
        message: i.message || "获取 PDF 失败"
      };
    }
  }), ne.handle("open-external", async (e, t) => {
    try {
      return console.log(`[IPC] open-external: ${t}`), await Gf.openExternal(t), { success: !0 };
    } catch (n) {
      return console.error("Failed to open external URL:", n), {
        success: !1,
        message: n.message || "打开链接失败"
      };
    }
  }), ne.handle("check-for-updates", async () => {
    if (qn)
      return { available: !1, message: "开发环境不检查更新" };
    try {
      const e = await Me.checkForUpdates();
      return { available: !0, updateInfo: e == null ? void 0 : e.updateInfo };
    } catch (e) {
      return console.error("检查更新失败:", e), { available: !1, error: e.message };
    }
  }), ne.handle("download-update", async () => {
    try {
      return await Me.downloadUpdate(), { success: !0 };
    } catch (e) {
      return console.error("下载更新失败:", e), { success: !1, error: e.message };
    }
  }), ne.handle("install-update", async () => {
    Me.quitAndInstall();
  }), ne.handle("add-favorite-stock", async (e, t) => {
    try {
      return console.log(`[IPC] add-favorite-stock: tsCode=${t}`), { success: Fw(t) };
    } catch (n) {
      return console.error("Failed to add favorite stock:", n), { success: !1, message: n.message };
    }
  }), ne.handle("remove-favorite-stock", async (e, t) => {
    try {
      return console.log(`[IPC] remove-favorite-stock: tsCode=${t}`), { success: Lw(t) };
    } catch (n) {
      return console.error("Failed to remove favorite stock:", n), { success: !1, message: n.message };
    }
  }), ne.handle("is-favorite-stock", async (e, t) => {
    try {
      return xw(t);
    } catch (n) {
      return console.error("Failed to check favorite stock:", n), !1;
    }
  }), ne.handle("get-all-favorite-stocks", async () => {
    try {
      return kw();
    } catch (e) {
      return console.error("Failed to get favorite stocks:", e), [];
    }
  }), ne.handle("count-favorite-stocks", async () => {
    try {
      return Uw();
    } catch (e) {
      return console.error("Failed to count favorite stocks:", e), 0;
    }
  }), ne.handle(
    "get-favorite-stocks-announcements-grouped",
    async (e, t, n, r, i) => {
      try {
        const o = (t - 1) * n, a = Mw(n, o, r, i), s = Bw(r, i);
        return console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${t}, items=${a.length}, total=${s}`), {
          items: a,
          total: s,
          page: t,
          pageSize: n
        };
      } catch (o) {
        throw console.error("Failed to get favorite stocks announcements:", o), o;
      }
    }
  );
}
function Vw() {
  Me.on("checking-for-update", () => {
    console.log("正在检查更新..."), P == null || P.webContents.send("update-checking");
  }), Me.on("update-available", (e) => {
    console.log("发现新版本:", e.version), P == null || P.webContents.send("update-available", e), Ke.isSupported() && new Ke({
      title: "发现新版本",
      body: `版本 ${e.version} 可用，点击查看详情`
    }).show();
  }), Me.on("update-not-available", (e) => {
    console.log("当前已是最新版本"), P == null || P.webContents.send("update-not-available", e);
  }), Me.on("download-progress", (e) => {
    console.log(`下载进度: ${e.percent.toFixed(2)}%`), P == null || P.webContents.send("update-download-progress", e);
  }), Me.on("update-downloaded", (e) => {
    console.log("更新下载完成:", e.version), P == null || P.webContents.send("update-downloaded", e), Ke.isSupported() && new Ke({
      title: "更新已下载",
      body: "新版本已准备就绪，重启应用即可安装"
    }).show();
  }), Me.on("error", (e) => {
    console.error("更新错误:", e), P == null || P.webContents.send("update-error", e.message);
  });
}
const Ww = Ce.requestSingleInstanceLock();
Ww ? (Ce.on("second-instance", (e, t, n) => {
  console.log("检测到第二个实例尝试启动，聚焦到主窗口"), P && (P.isMinimized() && P.restore(), P.focus(), P.show());
}), Ce.whenReady().then(() => {
  El(), jw(), qw(), Yw(), Vw(), xu().catch((e) => console.error("Auto sync failed:", e)), ku().catch((e) => console.error("Stock sync failed:", e)), qn || setTimeout(() => {
    Me.checkForUpdates();
  }, 3e3), Ce.on("activate", () => {
    yl.getAllWindows().length === 0 ? El() : P == null || P.show();
  });
})) : (console.log("应用已经在运行，退出当前实例"), Ce.quit());
Ce.on("window-all-closed", () => {
  process.platform !== "darwin" && Ce.quit();
});
Ce.on("before-quit", () => {
  na.isQuitting = !0;
});
Ce.on("will-quit", () => {
  _l.unregisterAll();
});
