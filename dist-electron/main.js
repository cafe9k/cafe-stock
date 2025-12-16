import Ht, { app as Ce, BrowserWindow as Ml, globalShortcut as Bl, session as vf, Notification as Le, nativeImage as xi, Tray as wf, Menu as Tf, ipcMain as B, shell as Sf } from "electron";
import J from "path";
import hn, { fileURLToPath as Cf, URL as Af } from "url";
import If, { createServer as Of } from "http";
import Be from "fs";
import Rf from "constants";
import Jn from "stream";
import xo from "util";
import Hl from "assert";
import ni from "child_process";
import jl from "events";
import Qn from "crypto";
import ql from "tty";
import ri from "os";
import bf from "string_decoder";
import Gl from "zlib";
import Nf from "better-sqlite3";
var Re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function $f(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Yl = {}, qt = {}, $e = {};
$e.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
$e.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var pt = Rf, Pf = process.cwd, kr = null, Df = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return kr || (kr = Pf.call(process)), kr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var js = process.chdir;
  process.chdir = function(e) {
    kr = null, js.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, js);
}
var Ff = Lf;
function Lf(e) {
  pt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, u, f) {
    f && process.nextTick(f);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, u, f, y) {
    y && process.nextTick(y);
  }, e.lchownSync = function() {
  }), Df === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function u(f, y, E) {
      var g = Date.now(), v = 0;
      c(f, y, function S(C) {
        if (C && (C.code === "EACCES" || C.code === "EPERM" || C.code === "EBUSY") && Date.now() - g < 6e4) {
          setTimeout(function() {
            e.stat(y, function(P, L) {
              P && P.code === "ENOENT" ? c(f, y, S) : E(C);
            });
          }, v), v < 100 && (v += 10);
          return;
        }
        E && E(C);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function u(f, y, E, g, v, S) {
      var C;
      if (S && typeof S == "function") {
        var P = 0;
        C = function(L, re, le) {
          if (L && L.code === "EAGAIN" && P < 10)
            return P++, c.call(e, f, y, E, g, v, C);
          S.apply(this, arguments);
        };
      }
      return c.call(e, f, y, E, g, v, C);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(u, f, y, E, g) {
      for (var v = 0; ; )
        try {
          return c.call(e, u, f, y, E, g);
        } catch (S) {
          if (S.code === "EAGAIN" && v < 10) {
            v++;
            continue;
          }
          throw S;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(u, f, y) {
      c.open(
        u,
        pt.O_WRONLY | pt.O_SYMLINK,
        f,
        function(E, g) {
          if (E) {
            y && y(E);
            return;
          }
          c.fchmod(g, f, function(v) {
            c.close(g, function(S) {
              y && y(v || S);
            });
          });
        }
      );
    }, c.lchmodSync = function(u, f) {
      var y = c.openSync(u, pt.O_WRONLY | pt.O_SYMLINK, f), E = !0, g;
      try {
        g = c.fchmodSync(y, f), E = !1;
      } finally {
        if (E)
          try {
            c.closeSync(y);
          } catch {
          }
        else
          c.closeSync(y);
      }
      return g;
    };
  }
  function n(c) {
    pt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(u, f, y, E) {
      c.open(u, pt.O_SYMLINK, function(g, v) {
        if (g) {
          E && E(g);
          return;
        }
        c.futimes(v, f, y, function(S) {
          c.close(v, function(C) {
            E && E(S || C);
          });
        });
      });
    }, c.lutimesSync = function(u, f, y) {
      var E = c.openSync(u, pt.O_SYMLINK), g, v = !0;
      try {
        g = c.futimesSync(E, f, y), v = !1;
      } finally {
        if (v)
          try {
            c.closeSync(E);
          } catch {
          }
        else
          c.closeSync(E);
      }
      return g;
    }) : c.futimes && (c.lutimes = function(u, f, y, E) {
      E && process.nextTick(E);
    }, c.lutimesSync = function() {
    });
  }
  function r(c) {
    return c && function(u, f, y) {
      return c.call(e, u, f, function(E) {
        h(E) && (E = null), y && y.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(u, f) {
      try {
        return c.call(e, u, f);
      } catch (y) {
        if (!h(y)) throw y;
      }
    };
  }
  function o(c) {
    return c && function(u, f, y, E) {
      return c.call(e, u, f, y, function(g) {
        h(g) && (g = null), E && E.apply(this, arguments);
      });
    };
  }
  function s(c) {
    return c && function(u, f, y) {
      try {
        return c.call(e, u, f, y);
      } catch (E) {
        if (!h(E)) throw E;
      }
    };
  }
  function a(c) {
    return c && function(u, f, y) {
      typeof f == "function" && (y = f, f = null);
      function E(g, v) {
        v && (v.uid < 0 && (v.uid += 4294967296), v.gid < 0 && (v.gid += 4294967296)), y && y.apply(this, arguments);
      }
      return f ? c.call(e, u, f, E) : c.call(e, u, E);
    };
  }
  function l(c) {
    return c && function(u, f) {
      var y = f ? c.call(e, u, f) : c.call(e, u);
      return y && (y.uid < 0 && (y.uid += 4294967296), y.gid < 0 && (y.gid += 4294967296)), y;
    };
  }
  function h(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var u = !process.getuid || process.getuid() !== 0;
    return !!(u && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var qs = Jn.Stream, xf = kf;
function kf(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    qs.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var s = Object.keys(i), a = 0, l = s.length; a < l; a++) {
      var h = s[a];
      this[h] = i[h];
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
    e.open(this.path, this.flags, this.mode, function(c, u) {
      if (c) {
        o.emit("error", c), o.readable = !1;
        return;
      }
      o.fd = u, o.emit("open", u), o._read();
    });
  }
  function n(r, i) {
    if (!(this instanceof n)) return new n(r, i);
    qs.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), s = 0, a = o.length; s < a; s++) {
      var l = o[s];
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
var Uf = Bf, Mf = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Bf(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Mf(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var oe = Be, Hf = Ff, jf = xf, qf = Uf, vr = xo, Ee, jr;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ee = Symbol.for("graceful-fs.queue"), jr = Symbol.for("graceful-fs.previous")) : (Ee = "___graceful-fs.queue", jr = "___graceful-fs.previous");
function Gf() {
}
function Xl(e, t) {
  Object.defineProperty(e, Ee, {
    get: function() {
      return t;
    }
  });
}
var Mt = Gf;
vr.debuglog ? Mt = vr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Mt = function() {
  var e = vr.format.apply(vr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[Ee]) {
  var Yf = Re[Ee] || [];
  Xl(oe, Yf), oe.close = function(e) {
    function t(n, r) {
      return e.call(oe, n, function(i) {
        i || Gs(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, jr, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(n) {
      e.apply(oe, arguments), Gs();
    }
    return Object.defineProperty(t, jr, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Mt(oe[Ee]), Hl.equal(oe[Ee].length, 0);
  });
}
Re[Ee] || Xl(Re, oe[Ee]);
var Pe = ko(qf(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && (Pe = ko(oe), oe.__patched = !0);
function ko(e) {
  Hf(e), e.gracefulify = ko, e.createReadStream = re, e.createWriteStream = le;
  var t = e.readFile;
  e.readFile = n;
  function n(_, X, q) {
    return typeof X == "function" && (q = X, X = null), j(_, X, q);
    function j(Q, N, O, D) {
      return t(Q, N, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Vt([j, [Q, N, O], I, D || Date.now(), Date.now()]) : typeof O == "function" && O.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(_, X, q, j) {
    return typeof q == "function" && (j = q, q = null), Q(_, X, q, j);
    function Q(N, O, D, I, F) {
      return r(N, O, D, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Vt([Q, [N, O, D, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = s);
  function s(_, X, q, j) {
    return typeof q == "function" && (j = q, q = null), Q(_, X, q, j);
    function Q(N, O, D, I, F) {
      return o(N, O, D, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Vt([Q, [N, O, D, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = l);
  function l(_, X, q, j) {
    return typeof q == "function" && (j = q, q = 0), Q(_, X, q, j);
    function Q(N, O, D, I, F) {
      return a(N, O, D, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Vt([Q, [N, O, D, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var h = e.readdir;
  e.readdir = u;
  var c = /^v[0-5]\./;
  function u(_, X, q) {
    typeof X == "function" && (q = X, X = null);
    var j = c.test(process.version) ? function(O, D, I, F) {
      return h(O, Q(
        O,
        D,
        I,
        F
      ));
    } : function(O, D, I, F) {
      return h(O, D, Q(
        O,
        D,
        I,
        F
      ));
    };
    return j(_, X, q);
    function Q(N, O, D, I) {
      return function(F, $) {
        F && (F.code === "EMFILE" || F.code === "ENFILE") ? Vt([
          j,
          [N, O, D],
          F,
          I || Date.now(),
          Date.now()
        ]) : ($ && $.sort && $.sort(), typeof D == "function" && D.call(this, F, $));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var f = jf(e);
    S = f.ReadStream, P = f.WriteStream;
  }
  var y = e.ReadStream;
  y && (S.prototype = Object.create(y.prototype), S.prototype.open = C);
  var E = e.WriteStream;
  E && (P.prototype = Object.create(E.prototype), P.prototype.open = L), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return S;
    },
    set: function(_) {
      S = _;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return P;
    },
    set: function(_) {
      P = _;
    },
    enumerable: !0,
    configurable: !0
  });
  var g = S;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return g;
    },
    set: function(_) {
      g = _;
    },
    enumerable: !0,
    configurable: !0
  });
  var v = P;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return v;
    },
    set: function(_) {
      v = _;
    },
    enumerable: !0,
    configurable: !0
  });
  function S(_, X) {
    return this instanceof S ? (y.apply(this, arguments), this) : S.apply(Object.create(S.prototype), arguments);
  }
  function C() {
    var _ = this;
    Ue(_.path, _.flags, _.mode, function(X, q) {
      X ? (_.autoClose && _.destroy(), _.emit("error", X)) : (_.fd = q, _.emit("open", q), _.read());
    });
  }
  function P(_, X) {
    return this instanceof P ? (E.apply(this, arguments), this) : P.apply(Object.create(P.prototype), arguments);
  }
  function L() {
    var _ = this;
    Ue(_.path, _.flags, _.mode, function(X, q) {
      X ? (_.destroy(), _.emit("error", X)) : (_.fd = q, _.emit("open", q));
    });
  }
  function re(_, X) {
    return new e.ReadStream(_, X);
  }
  function le(_, X) {
    return new e.WriteStream(_, X);
  }
  var z = e.open;
  e.open = Ue;
  function Ue(_, X, q, j) {
    return typeof q == "function" && (j = q, q = null), Q(_, X, q, j);
    function Q(N, O, D, I, F) {
      return z(N, O, D, function($, H) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Vt([Q, [N, O, D, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  return e;
}
function Vt(e) {
  Mt("ENQUEUE", e[0].name, e[1]), oe[Ee].push(e), Uo();
}
var wr;
function Gs() {
  for (var e = Date.now(), t = 0; t < oe[Ee].length; ++t)
    oe[Ee][t].length > 2 && (oe[Ee][t][3] = e, oe[Ee][t][4] = e);
  Uo();
}
function Uo() {
  if (clearTimeout(wr), wr = void 0, oe[Ee].length !== 0) {
    var e = oe[Ee].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Mt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Mt("TIMEOUT", t.name, n);
      var s = n.pop();
      typeof s == "function" && s.call(null, r);
    } else {
      var a = Date.now() - o, l = Math.max(o - i, 1), h = Math.min(l * 1.2, 100);
      a >= h ? (Mt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : oe[Ee].push(e);
    }
    wr === void 0 && (wr = setTimeout(Uo, 0));
  }
}
(function(e) {
  const t = $e.fromCallback, n = Pe, r = [
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
    return typeof o == "function" ? n.exists(i, o) : new Promise((s) => n.exists(i, s));
  }, e.read = function(i, o, s, a, l, h) {
    return typeof h == "function" ? n.read(i, o, s, a, l, h) : new Promise((c, u) => {
      n.read(i, o, s, a, l, (f, y, E) => {
        if (f) return u(f);
        c({ bytesRead: y, buffer: E });
      });
    });
  }, e.write = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.write(i, o, ...s) : new Promise((a, l) => {
      n.write(i, o, ...s, (h, c, u) => {
        if (h) return l(h);
        a({ bytesWritten: c, buffer: u });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.writev(i, o, ...s) : new Promise((a, l) => {
      n.writev(i, o, ...s, (h, c, u) => {
        if (h) return l(h);
        a({ bytesWritten: c, buffers: u });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(qt);
var Mo = {}, Vl = {};
const Xf = J;
Vl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Xf.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const Wl = qt, { checkPath: zl } = Vl, Kl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Mo.makeDir = async (e, t) => (zl(e), Wl.mkdir(e, {
  mode: Kl(t),
  recursive: !0
}));
Mo.makeDirSync = (e, t) => (zl(e), Wl.mkdirSync(e, {
  mode: Kl(t),
  recursive: !0
}));
const Vf = $e.fromPromise, { makeDir: Wf, makeDirSync: ki } = Mo, Ui = Vf(Wf);
var nt = {
  mkdirs: Ui,
  mkdirsSync: ki,
  // alias
  mkdirp: Ui,
  mkdirpSync: ki,
  ensureDir: Ui,
  ensureDirSync: ki
};
const zf = $e.fromPromise, Jl = qt;
function Kf(e) {
  return Jl.access(e).then(() => !0).catch(() => !1);
}
var Gt = {
  pathExists: zf(Kf),
  pathExistsSync: Jl.existsSync
};
const sn = Pe;
function Jf(e, t, n, r) {
  sn.open(e, "r+", (i, o) => {
    if (i) return r(i);
    sn.futimes(o, t, n, (s) => {
      sn.close(o, (a) => {
        r && r(s || a);
      });
    });
  });
}
function Qf(e, t, n) {
  const r = sn.openSync(e, "r+");
  return sn.futimesSync(r, t, n), sn.closeSync(r);
}
var Ql = {
  utimesMillis: Jf,
  utimesMillisSync: Qf
};
const cn = qt, pe = J, Zf = xo;
function eh(e, t, n) {
  const r = n.dereference ? (i) => cn.stat(i, { bigint: !0 }) : (i) => cn.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function th(e, t, n) {
  let r;
  const i = n.dereference ? (s) => cn.statSync(s, { bigint: !0 }) : (s) => cn.lstatSync(s, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: o, destStat: null };
    throw s;
  }
  return { srcStat: o, destStat: r };
}
function nh(e, t, n, r, i) {
  Zf.callbackify(eh)(e, t, r, (o, s) => {
    if (o) return i(o);
    const { srcStat: a, destStat: l } = s;
    if (l) {
      if (Zn(a, l)) {
        const h = pe.basename(e), c = pe.basename(t);
        return n === "move" && h !== c && h.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: a, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && Bo(e, t) ? i(new Error(ii(e, t, n))) : i(null, { srcStat: a, destStat: l });
  });
}
function rh(e, t, n, r) {
  const { srcStat: i, destStat: o } = th(e, t, r);
  if (o) {
    if (Zn(i, o)) {
      const s = pe.basename(e), a = pe.basename(t);
      if (n === "move" && s !== a && s.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Bo(e, t))
    throw new Error(ii(e, t, n));
  return { srcStat: i, destStat: o };
}
function Zl(e, t, n, r, i) {
  const o = pe.resolve(pe.dirname(e)), s = pe.resolve(pe.dirname(n));
  if (s === o || s === pe.parse(s).root) return i();
  cn.stat(s, { bigint: !0 }, (a, l) => a ? a.code === "ENOENT" ? i() : i(a) : Zn(t, l) ? i(new Error(ii(e, n, r))) : Zl(e, t, s, r, i));
}
function ec(e, t, n, r) {
  const i = pe.resolve(pe.dirname(e)), o = pe.resolve(pe.dirname(n));
  if (o === i || o === pe.parse(o).root) return;
  let s;
  try {
    s = cn.statSync(o, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Zn(t, s))
    throw new Error(ii(e, n, r));
  return ec(e, t, o, r);
}
function Zn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Bo(e, t) {
  const n = pe.resolve(e).split(pe.sep).filter((i) => i), r = pe.resolve(t).split(pe.sep).filter((i) => i);
  return n.reduce((i, o, s) => i && r[s] === o, !0);
}
function ii(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var pn = {
  checkPaths: nh,
  checkPathsSync: rh,
  checkParentPaths: Zl,
  checkParentPathsSync: ec,
  isSrcSubdir: Bo,
  areIdentical: Zn
};
const xe = Pe, Ln = J, ih = nt.mkdirs, oh = Gt.pathExists, sh = Ql.utimesMillis, xn = pn;
function ah(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), xn.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: s, destStat: a } = o;
    xn.checkParentPaths(e, s, t, "copy", (l) => l ? r(l) : n.filter ? tc(Ys, a, e, t, n, r) : Ys(a, e, t, n, r));
  });
}
function Ys(e, t, n, r, i) {
  const o = Ln.dirname(n);
  oh(o, (s, a) => {
    if (s) return i(s);
    if (a) return qr(e, t, n, r, i);
    ih(o, (l) => l ? i(l) : qr(e, t, n, r, i));
  });
}
function tc(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((s) => s ? e(t, n, r, i, o) : o(), (s) => o(s));
}
function lh(e, t, n, r, i) {
  return r.filter ? tc(qr, e, t, n, r, i) : qr(e, t, n, r, i);
}
function qr(e, t, n, r, i) {
  (r.dereference ? xe.stat : xe.lstat)(t, (s, a) => s ? i(s) : a.isDirectory() ? mh(a, e, t, n, r, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? ch(a, e, t, n, r, i) : a.isSymbolicLink() ? Eh(e, t, n, r, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function ch(e, t, n, r, i, o) {
  return t ? uh(e, n, r, i, o) : nc(e, n, r, i, o);
}
function uh(e, t, n, r, i) {
  if (r.overwrite)
    xe.unlink(n, (o) => o ? i(o) : nc(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function nc(e, t, n, r, i) {
  xe.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? dh(e.mode, t, n, i) : oi(n, e.mode, i));
}
function dh(e, t, n, r) {
  return fh(e) ? hh(n, e, (i) => i ? r(i) : Xs(e, t, n, r)) : Xs(e, t, n, r);
}
function fh(e) {
  return (e & 128) === 0;
}
function hh(e, t, n) {
  return oi(e, t | 128, n);
}
function Xs(e, t, n, r) {
  ph(t, n, (i) => i ? r(i) : oi(n, e, r));
}
function oi(e, t, n) {
  return xe.chmod(e, t, n);
}
function ph(e, t, n) {
  xe.stat(e, (r, i) => r ? n(r) : sh(t, i.atime, i.mtime, n));
}
function mh(e, t, n, r, i, o) {
  return t ? rc(n, r, i, o) : gh(e.mode, n, r, i, o);
}
function gh(e, t, n, r, i) {
  xe.mkdir(n, (o) => {
    if (o) return i(o);
    rc(t, n, r, (s) => s ? i(s) : oi(n, e, i));
  });
}
function rc(e, t, n, r) {
  xe.readdir(e, (i, o) => i ? r(i) : ic(o, e, t, n, r));
}
function ic(e, t, n, r, i) {
  const o = e.pop();
  return o ? yh(e, o, t, n, r, i) : i();
}
function yh(e, t, n, r, i, o) {
  const s = Ln.join(n, t), a = Ln.join(r, t);
  xn.checkPaths(s, a, "copy", i, (l, h) => {
    if (l) return o(l);
    const { destStat: c } = h;
    lh(c, s, a, i, (u) => u ? o(u) : ic(e, n, r, i, o));
  });
}
function Eh(e, t, n, r, i) {
  xe.readlink(t, (o, s) => {
    if (o) return i(o);
    if (r.dereference && (s = Ln.resolve(process.cwd(), s)), e)
      xe.readlink(n, (a, l) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? xe.symlink(s, n, i) : i(a) : (r.dereference && (l = Ln.resolve(process.cwd(), l)), xn.isSrcSubdir(s, l) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && xn.isSrcSubdir(l, s) ? i(new Error(`Cannot overwrite '${l}' with '${s}'.`)) : _h(s, n, i)));
    else
      return xe.symlink(s, n, i);
  });
}
function _h(e, t, n) {
  xe.unlink(t, (r) => r ? n(r) : xe.symlink(e, t, n));
}
var vh = ah;
const Se = Pe, kn = J, wh = nt.mkdirsSync, Th = Ql.utimesMillisSync, Un = pn;
function Sh(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = Un.checkPathsSync(e, t, "copy", n);
  return Un.checkParentPathsSync(e, r, t, "copy"), Ch(i, e, t, n);
}
function Ch(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = kn.dirname(n);
  return Se.existsSync(i) || wh(i), oc(e, t, n, r);
}
function Ah(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return oc(e, t, n, r);
}
function oc(e, t, n, r) {
  const o = (r.dereference ? Se.statSync : Se.lstatSync)(t);
  if (o.isDirectory()) return Ph(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return Ih(o, e, t, n, r);
  if (o.isSymbolicLink()) return Lh(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Ih(e, t, n, r, i) {
  return t ? Oh(e, n, r, i) : sc(e, n, r, i);
}
function Oh(e, t, n, r) {
  if (r.overwrite)
    return Se.unlinkSync(n), sc(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function sc(e, t, n, r) {
  return Se.copyFileSync(t, n), r.preserveTimestamps && Rh(e.mode, t, n), Ho(n, e.mode);
}
function Rh(e, t, n) {
  return bh(e) && Nh(n, e), $h(t, n);
}
function bh(e) {
  return (e & 128) === 0;
}
function Nh(e, t) {
  return Ho(e, t | 128);
}
function Ho(e, t) {
  return Se.chmodSync(e, t);
}
function $h(e, t) {
  const n = Se.statSync(e);
  return Th(t, n.atime, n.mtime);
}
function Ph(e, t, n, r, i) {
  return t ? ac(n, r, i) : Dh(e.mode, n, r, i);
}
function Dh(e, t, n, r) {
  return Se.mkdirSync(n), ac(t, n, r), Ho(n, e);
}
function ac(e, t, n) {
  Se.readdirSync(e).forEach((r) => Fh(r, e, t, n));
}
function Fh(e, t, n, r) {
  const i = kn.join(t, e), o = kn.join(n, e), { destStat: s } = Un.checkPathsSync(i, o, "copy", r);
  return Ah(s, i, o, r);
}
function Lh(e, t, n, r) {
  let i = Se.readlinkSync(t);
  if (r.dereference && (i = kn.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Se.readlinkSync(n);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Se.symlinkSync(i, n);
      throw s;
    }
    if (r.dereference && (o = kn.resolve(process.cwd(), o)), Un.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Se.statSync(n).isDirectory() && Un.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return xh(i, n);
  } else
    return Se.symlinkSync(i, n);
}
function xh(e, t) {
  return Se.unlinkSync(t), Se.symlinkSync(e, t);
}
var kh = Sh;
const Uh = $e.fromCallback;
var jo = {
  copy: Uh(vh),
  copySync: kh
};
const Vs = Pe, lc = J, ee = Hl, Mn = process.platform === "win32";
function cc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || Vs[n], n = n + "Sync", e[n] = e[n] || Vs[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function qo(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), ee(e, "rimraf: missing path"), ee.strictEqual(typeof e, "string", "rimraf: path should be a string"), ee.strictEqual(typeof n, "function", "rimraf: callback function required"), ee(t, "rimraf: invalid options argument provided"), ee.strictEqual(typeof t, "object", "rimraf: options should be object"), cc(t), Ws(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const s = r * 100;
        return setTimeout(() => Ws(e, t, i), s);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function Ws(e, t, n) {
  ee(e), ee(t), ee(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && Mn)
      return zs(e, t, r, n);
    if (i && i.isDirectory())
      return Ur(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return Mn ? zs(e, t, o, n) : Ur(e, t, o, n);
        if (o.code === "EISDIR")
          return Ur(e, t, o, n);
      }
      return n(o);
    });
  });
}
function zs(e, t, n, r) {
  ee(e), ee(t), ee(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, s) => {
      o ? r(o.code === "ENOENT" ? null : n) : s.isDirectory() ? Ur(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function Ks(e, t, n) {
  let r;
  ee(e), ee(t);
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
  r.isDirectory() ? Mr(e, t, n) : t.unlinkSync(e);
}
function Ur(e, t, n, r) {
  ee(e), ee(t), ee(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Mh(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function Mh(e, t, n) {
  ee(e), ee(t), ee(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, s;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((a) => {
      qo(lc.join(e, a), t, (l) => {
        if (!s) {
          if (l) return n(s = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function uc(e, t) {
  let n;
  t = t || {}, cc(t), ee(e, "rimraf: missing path"), ee.strictEqual(typeof e, "string", "rimraf: path should be a string"), ee(t, "rimraf: missing options"), ee.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && Mn && Ks(e, t, r);
  }
  try {
    n && n.isDirectory() ? Mr(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return Mn ? Ks(e, t, r) : Mr(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    Mr(e, t, r);
  }
}
function Mr(e, t, n) {
  ee(e), ee(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      Bh(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function Bh(e, t) {
  if (ee(e), ee(t), t.readdirSync(e).forEach((n) => uc(lc.join(e, n), t)), Mn) {
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
var Hh = qo;
qo.sync = uc;
const Gr = Pe, jh = $e.fromCallback, dc = Hh;
function qh(e, t) {
  if (Gr.rm) return Gr.rm(e, { recursive: !0, force: !0 }, t);
  dc(e, t);
}
function Gh(e) {
  if (Gr.rmSync) return Gr.rmSync(e, { recursive: !0, force: !0 });
  dc.sync(e);
}
var si = {
  remove: jh(qh),
  removeSync: Gh
};
const Yh = $e.fromPromise, fc = qt, hc = J, pc = nt, mc = si, Js = Yh(async function(t) {
  let n;
  try {
    n = await fc.readdir(t);
  } catch {
    return pc.mkdirs(t);
  }
  return Promise.all(n.map((r) => mc.remove(hc.join(t, r))));
});
function Qs(e) {
  let t;
  try {
    t = fc.readdirSync(e);
  } catch {
    return pc.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = hc.join(e, n), mc.removeSync(n);
  });
}
var Xh = {
  emptyDirSync: Qs,
  emptydirSync: Qs,
  emptyDir: Js,
  emptydir: Js
};
const Vh = $e.fromCallback, gc = J, Et = Pe, yc = nt;
function Wh(e, t) {
  function n() {
    Et.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  Et.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = gc.dirname(e);
    Et.stat(o, (s, a) => {
      if (s)
        return s.code === "ENOENT" ? yc.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(s);
      a.isDirectory() ? n() : Et.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function zh(e) {
  let t;
  try {
    t = Et.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = gc.dirname(e);
  try {
    Et.statSync(n).isDirectory() || Et.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") yc.mkdirsSync(n);
    else throw r;
  }
  Et.writeFileSync(e, "");
}
var Kh = {
  createFile: Vh(Wh),
  createFileSync: zh
};
const Jh = $e.fromCallback, Ec = J, yt = Pe, _c = nt, Qh = Gt.pathExists, { areIdentical: vc } = pn;
function Zh(e, t, n) {
  function r(i, o) {
    yt.link(i, o, (s) => {
      if (s) return n(s);
      n(null);
    });
  }
  yt.lstat(t, (i, o) => {
    yt.lstat(e, (s, a) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), n(s);
      if (o && vc(a, o)) return n(null);
      const l = Ec.dirname(t);
      Qh(l, (h, c) => {
        if (h) return n(h);
        if (c) return r(e, t);
        _c.mkdirs(l, (u) => {
          if (u) return n(u);
          r(e, t);
        });
      });
    });
  });
}
function ep(e, t) {
  let n;
  try {
    n = yt.lstatSync(t);
  } catch {
  }
  try {
    const o = yt.lstatSync(e);
    if (n && vc(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = Ec.dirname(t);
  return yt.existsSync(r) || _c.mkdirsSync(r), yt.linkSync(e, t);
}
var tp = {
  createLink: Jh(Zh),
  createLinkSync: ep
};
const _t = J, $n = Pe, np = Gt.pathExists;
function rp(e, t, n) {
  if (_t.isAbsolute(e))
    return $n.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = _t.dirname(t), i = _t.join(r, e);
    return np(i, (o, s) => o ? n(o) : s ? n(null, {
      toCwd: i,
      toDst: e
    }) : $n.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), n(a)) : n(null, {
      toCwd: e,
      toDst: _t.relative(r, e)
    })));
  }
}
function ip(e, t) {
  let n;
  if (_t.isAbsolute(e)) {
    if (n = $n.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = _t.dirname(t), i = _t.join(r, e);
    if (n = $n.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = $n.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: _t.relative(r, e)
    };
  }
}
var op = {
  symlinkPaths: rp,
  symlinkPathsSync: ip
};
const wc = Pe;
function sp(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  wc.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function ap(e, t) {
  let n;
  if (t) return t;
  try {
    n = wc.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var lp = {
  symlinkType: sp,
  symlinkTypeSync: ap
};
const cp = $e.fromCallback, Tc = J, We = qt, Sc = nt, up = Sc.mkdirs, dp = Sc.mkdirsSync, Cc = op, fp = Cc.symlinkPaths, hp = Cc.symlinkPathsSync, Ac = lp, pp = Ac.symlinkType, mp = Ac.symlinkTypeSync, gp = Gt.pathExists, { areIdentical: Ic } = pn;
function yp(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, We.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      We.stat(e),
      We.stat(t)
    ]).then(([s, a]) => {
      if (Ic(s, a)) return r(null);
      Zs(e, t, n, r);
    }) : Zs(e, t, n, r);
  });
}
function Zs(e, t, n, r) {
  fp(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, pp(o.toCwd, n, (s, a) => {
      if (s) return r(s);
      const l = Tc.dirname(t);
      gp(l, (h, c) => {
        if (h) return r(h);
        if (c) return We.symlink(e, t, a, r);
        up(l, (u) => {
          if (u) return r(u);
          We.symlink(e, t, a, r);
        });
      });
    });
  });
}
function Ep(e, t, n) {
  let r;
  try {
    r = We.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const a = We.statSync(e), l = We.statSync(t);
    if (Ic(a, l)) return;
  }
  const i = hp(e, t);
  e = i.toDst, n = mp(i.toCwd, n);
  const o = Tc.dirname(t);
  return We.existsSync(o) || dp(o), We.symlinkSync(e, t, n);
}
var _p = {
  createSymlink: cp(yp),
  createSymlinkSync: Ep
};
const { createFile: ea, createFileSync: ta } = Kh, { createLink: na, createLinkSync: ra } = tp, { createSymlink: ia, createSymlinkSync: oa } = _p;
var vp = {
  // file
  createFile: ea,
  createFileSync: ta,
  ensureFile: ea,
  ensureFileSync: ta,
  // link
  createLink: na,
  createLinkSync: ra,
  ensureLink: na,
  ensureLinkSync: ra,
  // symlink
  createSymlink: ia,
  createSymlinkSync: oa,
  ensureSymlink: ia,
  ensureSymlinkSync: oa
};
function wp(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function Tp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Go = { stringify: wp, stripBom: Tp };
let un;
try {
  un = Pe;
} catch {
  un = Be;
}
const ai = $e, { stringify: Oc, stripBom: Rc } = Go;
async function Sp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || un, r = "throws" in t ? t.throws : !0;
  let i = await ai.fromCallback(n.readFile)(e, t);
  i = Rc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (s) {
    if (r)
      throw s.message = `${e}: ${s.message}`, s;
    return null;
  }
  return o;
}
const Cp = ai.fromPromise(Sp);
function Ap(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || un, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Rc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Ip(e, t, n = {}) {
  const r = n.fs || un, i = Oc(t, n);
  await ai.fromCallback(r.writeFile)(e, i, n);
}
const Op = ai.fromPromise(Ip);
function Rp(e, t, n = {}) {
  const r = n.fs || un, i = Oc(t, n);
  return r.writeFileSync(e, i, n);
}
var bp = {
  readFile: Cp,
  readFileSync: Ap,
  writeFile: Op,
  writeFileSync: Rp
};
const Tr = bp;
var Np = {
  // jsonfile exports
  readJson: Tr.readFile,
  readJsonSync: Tr.readFileSync,
  writeJson: Tr.writeFile,
  writeJsonSync: Tr.writeFileSync
};
const $p = $e.fromCallback, Pn = Pe, bc = J, Nc = nt, Pp = Gt.pathExists;
function Dp(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = bc.dirname(e);
  Pp(i, (o, s) => {
    if (o) return r(o);
    if (s) return Pn.writeFile(e, t, n, r);
    Nc.mkdirs(i, (a) => {
      if (a) return r(a);
      Pn.writeFile(e, t, n, r);
    });
  });
}
function Fp(e, ...t) {
  const n = bc.dirname(e);
  if (Pn.existsSync(n))
    return Pn.writeFileSync(e, ...t);
  Nc.mkdirsSync(n), Pn.writeFileSync(e, ...t);
}
var Yo = {
  outputFile: $p(Dp),
  outputFileSync: Fp
};
const { stringify: Lp } = Go, { outputFile: xp } = Yo;
async function kp(e, t, n = {}) {
  const r = Lp(t, n);
  await xp(e, r, n);
}
var Up = kp;
const { stringify: Mp } = Go, { outputFileSync: Bp } = Yo;
function Hp(e, t, n) {
  const r = Mp(t, n);
  Bp(e, r, n);
}
var jp = Hp;
const qp = $e.fromPromise, Ne = Np;
Ne.outputJson = qp(Up);
Ne.outputJsonSync = jp;
Ne.outputJSON = Ne.outputJson;
Ne.outputJSONSync = Ne.outputJsonSync;
Ne.writeJSON = Ne.writeJson;
Ne.writeJSONSync = Ne.writeJsonSync;
Ne.readJSON = Ne.readJson;
Ne.readJSONSync = Ne.readJsonSync;
var Gp = Ne;
const Yp = Pe, mo = J, Xp = jo.copy, $c = si.remove, Vp = nt.mkdirp, Wp = Gt.pathExists, sa = pn;
function zp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  sa.checkPaths(e, t, "move", n, (o, s) => {
    if (o) return r(o);
    const { srcStat: a, isChangingCase: l = !1 } = s;
    sa.checkParentPaths(e, a, t, "move", (h) => {
      if (h) return r(h);
      if (Kp(t)) return aa(e, t, i, l, r);
      Vp(mo.dirname(t), (c) => c ? r(c) : aa(e, t, i, l, r));
    });
  });
}
function Kp(e) {
  const t = mo.dirname(e);
  return mo.parse(t).root === t;
}
function aa(e, t, n, r, i) {
  if (r) return Mi(e, t, n, i);
  if (n)
    return $c(t, (o) => o ? i(o) : Mi(e, t, n, i));
  Wp(t, (o, s) => o ? i(o) : s ? i(new Error("dest already exists.")) : Mi(e, t, n, i));
}
function Mi(e, t, n, r) {
  Yp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : Jp(e, t, n, r) : r());
}
function Jp(e, t, n, r) {
  Xp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : $c(e, r));
}
var Qp = zp;
const Pc = Pe, go = J, Zp = jo.copySync, Dc = si.removeSync, em = nt.mkdirpSync, la = pn;
function tm(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = la.checkPathsSync(e, t, "move", n);
  return la.checkParentPathsSync(e, i, t, "move"), nm(t) || em(go.dirname(t)), rm(e, t, r, o);
}
function nm(e) {
  const t = go.dirname(e);
  return go.parse(t).root === t;
}
function rm(e, t, n, r) {
  if (r) return Bi(e, t, n);
  if (n)
    return Dc(t), Bi(e, t, n);
  if (Pc.existsSync(t)) throw new Error("dest already exists.");
  return Bi(e, t, n);
}
function Bi(e, t, n) {
  try {
    Pc.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return im(e, t, n);
  }
}
function im(e, t, n) {
  return Zp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), Dc(e);
}
var om = tm;
const sm = $e.fromCallback;
var am = {
  move: sm(Qp),
  moveSync: om
}, It = {
  // Export promiseified graceful-fs:
  ...qt,
  // Export extra methods:
  ...jo,
  ...Xh,
  ...vp,
  ...Gp,
  ...nt,
  ...am,
  ...Yo,
  ...Gt,
  ...si
}, ct = {}, wt = {}, me = {}, Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.CancellationError = Tt.CancellationToken = void 0;
const lm = jl;
class cm extends lm.EventEmitter {
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
      return Promise.reject(new yo());
    const n = () => {
      if (r != null)
        try {
          this.removeListener("cancel", r), r = null;
        } catch {
        }
    };
    let r = null;
    return new Promise((i, o) => {
      let s = null;
      if (r = () => {
        try {
          s != null && (s(), s = null);
        } finally {
          o(new yo());
        }
      }, this.cancelled) {
        r();
        return;
      }
      this.onCancel(r), t(i, o, (a) => {
        s = a;
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
Tt.CancellationToken = cm;
class yo extends Error {
  constructor() {
    super("cancelled");
  }
}
Tt.CancellationError = yo;
var mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.newError = um;
function um(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var be = {}, Eo = { exports: {} }, Sr = { exports: {} }, Hi, ca;
function dm() {
  if (ca) return Hi;
  ca = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  Hi = function(c, u) {
    u = u || {};
    var f = typeof c;
    if (f === "string" && c.length > 0)
      return s(c);
    if (f === "number" && isFinite(c))
      return u.long ? l(c) : a(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function s(c) {
    if (c = String(c), !(c.length > 100)) {
      var u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (u) {
        var f = parseFloat(u[1]), y = (u[2] || "ms").toLowerCase();
        switch (y) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return f * o;
          case "weeks":
          case "week":
          case "w":
            return f * i;
          case "days":
          case "day":
          case "d":
            return f * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return f * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return f * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return f * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return f;
          default:
            return;
        }
      }
    }
  }
  function a(c) {
    var u = Math.abs(c);
    return u >= r ? Math.round(c / r) + "d" : u >= n ? Math.round(c / n) + "h" : u >= t ? Math.round(c / t) + "m" : u >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var u = Math.abs(c);
    return u >= r ? h(c, u, r, "day") : u >= n ? h(c, u, n, "hour") : u >= t ? h(c, u, t, "minute") : u >= e ? h(c, u, e, "second") : c + " ms";
  }
  function h(c, u, f, y) {
    var E = u >= f * 1.5;
    return Math.round(c / f) + " " + y + (E ? "s" : "");
  }
  return Hi;
}
var ji, ua;
function Fc() {
  if (ua) return ji;
  ua = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = h, r.disable = a, r.enable = o, r.enabled = l, r.humanize = dm(), r.destroy = c, Object.keys(t).forEach((u) => {
      r[u] = t[u];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(u) {
      let f = 0;
      for (let y = 0; y < u.length; y++)
        f = (f << 5) - f + u.charCodeAt(y), f |= 0;
      return r.colors[Math.abs(f) % r.colors.length];
    }
    r.selectColor = n;
    function r(u) {
      let f, y = null, E, g;
      function v(...S) {
        if (!v.enabled)
          return;
        const C = v, P = Number(/* @__PURE__ */ new Date()), L = P - (f || P);
        C.diff = L, C.prev = f, C.curr = P, f = P, S[0] = r.coerce(S[0]), typeof S[0] != "string" && S.unshift("%O");
        let re = 0;
        S[0] = S[0].replace(/%([a-zA-Z%])/g, (z, Ue) => {
          if (z === "%%")
            return "%";
          re++;
          const _ = r.formatters[Ue];
          if (typeof _ == "function") {
            const X = S[re];
            z = _.call(C, X), S.splice(re, 1), re--;
          }
          return z;
        }), r.formatArgs.call(C, S), (C.log || r.log).apply(C, S);
      }
      return v.namespace = u, v.useColors = r.useColors(), v.color = r.selectColor(u), v.extend = i, v.destroy = r.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => y !== null ? y : (E !== r.namespaces && (E = r.namespaces, g = r.enabled(u)), g),
        set: (S) => {
          y = S;
        }
      }), typeof r.init == "function" && r.init(v), v;
    }
    function i(u, f) {
      const y = r(this.namespace + (typeof f > "u" ? ":" : f) + u);
      return y.log = this.log, y;
    }
    function o(u) {
      r.save(u), r.namespaces = u, r.names = [], r.skips = [];
      const f = (typeof u == "string" ? u : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const y of f)
        y[0] === "-" ? r.skips.push(y.slice(1)) : r.names.push(y);
    }
    function s(u, f) {
      let y = 0, E = 0, g = -1, v = 0;
      for (; y < u.length; )
        if (E < f.length && (f[E] === u[y] || f[E] === "*"))
          f[E] === "*" ? (g = E, v = y, E++) : (y++, E++);
        else if (g !== -1)
          E = g + 1, v++, y = v;
        else
          return !1;
      for (; E < f.length && f[E] === "*"; )
        E++;
      return E === f.length;
    }
    function a() {
      const u = [
        ...r.names,
        ...r.skips.map((f) => "-" + f)
      ].join(",");
      return r.enable(""), u;
    }
    function l(u) {
      for (const f of r.skips)
        if (s(u, f))
          return !1;
      for (const f of r.names)
        if (s(u, f))
          return !0;
      return !1;
    }
    function h(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return ji = e, ji;
}
var da;
function fm() {
  return da || (da = 1, function(e, t) {
    t.formatArgs = r, t.save = i, t.load = o, t.useColors = n, t.storage = s(), t.destroy = /* @__PURE__ */ (() => {
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
      const h = "color: " + this.color;
      l.splice(1, 0, h, "color: inherit");
      let c = 0, u = 0;
      l[0].replace(/%[a-zA-Z%]/g, (f) => {
        f !== "%%" && (c++, f === "%c" && (u = c));
      }), l.splice(u, 0, h);
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
    function s() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Fc()(t);
    const { formatters: a } = e.exports;
    a.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (h) {
        return "[UnexpectedJSONParseError]: " + h.message;
      }
    };
  }(Sr, Sr.exports)), Sr.exports;
}
var Cr = { exports: {} }, qi, fa;
function hm() {
  return fa || (fa = 1, qi = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), qi;
}
var Gi, ha;
function pm() {
  if (ha) return Gi;
  ha = 1;
  const e = ri, t = ql, n = hm(), { env: r } = process;
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
  function s(l, h) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (l && !h && i === void 0)
      return 0;
    const c = i || 0;
    if (r.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const u = e.release().split(".");
      return Number(u[0]) >= 10 && Number(u[2]) >= 10586 ? Number(u[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in r)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((u) => u in r) || r.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in r)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
    if (r.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in r) {
      const u = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (r.TERM_PROGRAM) {
        case "iTerm.app":
          return u >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : c;
  }
  function a(l) {
    const h = s(l, l && l.isTTY);
    return o(h);
  }
  return Gi = {
    supportsColor: a,
    stdout: o(s(!0, t.isatty(1))),
    stderr: o(s(!0, t.isatty(2)))
  }, Gi;
}
var pa;
function mm() {
  return pa || (pa = 1, function(e, t) {
    const n = ql, r = xo;
    t.init = c, t.log = a, t.formatArgs = o, t.save = l, t.load = h, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const f = pm();
      f && (f.stderr || f).level >= 2 && (t.colors = [
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
    t.inspectOpts = Object.keys(process.env).filter((f) => /^debug_/i.test(f)).reduce((f, y) => {
      const E = y.substring(6).toLowerCase().replace(/_([a-z])/g, (v, S) => S.toUpperCase());
      let g = process.env[y];
      return /^(yes|on|true|enabled)$/i.test(g) ? g = !0 : /^(no|off|false|disabled)$/i.test(g) ? g = !1 : g === "null" ? g = null : g = Number(g), f[E] = g, f;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(f) {
      const { namespace: y, useColors: E } = this;
      if (E) {
        const g = this.color, v = "\x1B[3" + (g < 8 ? g : "8;5;" + g), S = `  ${v};1m${y} \x1B[0m`;
        f[0] = S + f[0].split(`
`).join(`
` + S), f.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        f[0] = s() + y + " " + f[0];
    }
    function s() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function a(...f) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...f) + `
`);
    }
    function l(f) {
      f ? process.env.DEBUG = f : delete process.env.DEBUG;
    }
    function h() {
      return process.env.DEBUG;
    }
    function c(f) {
      f.inspectOpts = {};
      const y = Object.keys(t.inspectOpts);
      for (let E = 0; E < y.length; E++)
        f.inspectOpts[y[E]] = t.inspectOpts[y[E]];
    }
    e.exports = Fc()(t);
    const { formatters: u } = e.exports;
    u.o = function(f) {
      return this.inspectOpts.colors = this.useColors, r.inspect(f, this.inspectOpts).split(`
`).map((y) => y.trim()).join(" ");
    }, u.O = function(f) {
      return this.inspectOpts.colors = this.useColors, r.inspect(f, this.inspectOpts);
    };
  }(Cr, Cr.exports)), Cr.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Eo.exports = fm() : Eo.exports = mm();
var gm = Eo.exports, er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
er.ProgressCallbackTransform = void 0;
const ym = Jn;
class Em extends ym.Transform {
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
er.ProgressCallbackTransform = Em;
Object.defineProperty(be, "__esModule", { value: !0 });
be.DigestTransform = be.HttpExecutor = be.HttpError = void 0;
be.createHttpError = _o;
be.parseJson = Im;
be.configureRequestOptionsFromUrl = xc;
be.configureRequestUrl = Vo;
be.safeGetHeader = an;
be.configureRequestOptions = Xr;
be.safeStringifyJson = Vr;
const _m = Qn, vm = gm, wm = Be, Tm = Jn, Lc = hn, Sm = Tt, ma = mn, Cm = er, Cn = (0, vm.default)("electron-builder");
function _o(e, t = null) {
  return new Xo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Vr(e.headers), t);
}
const Am = /* @__PURE__ */ new Map([
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
class Xo extends Error {
  constructor(t, n = `HTTP error: ${Am.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
be.HttpError = Xo;
function Im(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Yr {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new Sm.CancellationToken(), r) {
    Xr(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      Cn(i);
      const { headers: s, ...a } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...s
        },
        ...a
      };
    }
    return this.doApiRequest(t, n, (s) => s.end(o));
  }
  doApiRequest(t, n, r, i = 0) {
    return Cn.enabled && Cn(`Request: ${Vr(t)}`), n.createPromise((o, s, a) => {
      const l = this.createRequest(t, (h) => {
        try {
          this.handleResponse(h, t, n, o, s, i, r);
        } catch (c) {
          s(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, s, t.timeout), this.addRedirectHandlers(l, t, s, i, (h) => {
        this.doApiRequest(h, n, r, i).then(o).catch(s);
      }), r(l, s), a(() => l.abort());
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
  handleResponse(t, n, r, i, o, s, a) {
    var l;
    if (Cn.enabled && Cn(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Vr(n)}`), t.statusCode === 404) {
      o(_o(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const h = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = h >= 300 && h < 400, u = an(t, "location");
    if (c && u != null) {
      if (s > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Yr.prepareRedirectUrlOptions(u, n), r, a, s).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let f = "";
    t.on("error", o), t.on("data", (y) => f += y), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const y = an(t, "content-type"), E = y != null && (Array.isArray(y) ? y.find((g) => g.includes("json")) != null : y.includes("json"));
          o(_o(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${E ? JSON.stringify(JSON.parse(f)) : f}
          `));
        } else
          i(f.length === 0 ? null : f);
      } catch (y) {
        o(y);
      }
    });
  }
  async downloadToBuffer(t, n) {
    return await n.cancellationToken.createPromise((r, i, o) => {
      const s = [], a = {
        headers: n.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Vo(t, a), Xr(a), this.doDownload(a, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (l) => {
          l == null ? r(Buffer.concat(s)) : i(l);
        },
        responseHandler: (l, h) => {
          let c = 0;
          l.on("data", (u) => {
            if (c += u.length, c > 524288e3) {
              h(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            s.push(u);
          }), l.on("end", () => {
            h(null);
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
      const s = an(o, "location");
      if (s != null) {
        r < this.maxRedirects ? this.doDownload(Yr.prepareRedirectUrlOptions(s, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? Rm(n, o) : n.responseHandler(o, n.callback);
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
    const r = xc(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = new Lc.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return r;
  }
  static retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return t();
      } catch (i) {
        if (r < n && (i instanceof Xo && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
be.HttpExecutor = Yr;
function xc(e, t) {
  const n = Xr(t);
  return Vo(new Lc.URL(e), n), n;
}
function Vo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class vo extends Tm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, _m.createHash)(n);
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
      throw (0, ma.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, ma.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
be.DigestTransform = vo;
function Om(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function an(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function Rm(e, t) {
  if (!Om(an(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const s = an(t, "content-length");
    s != null && n.push(new Cm.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new vo(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new vo(e.options.sha2, "sha256", "hex"));
  const i = (0, wm.createWriteStream)(e.destination);
  n.push(i);
  let o = t;
  for (const s of n)
    s.on("error", (a) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(a);
    }), o = o.pipe(s);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Xr(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Vr(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
li.MemoLazy = void 0;
class bm {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && kc(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
li.MemoLazy = bm;
function kc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((s) => kc(e[s], t[s]));
  }
  return e === t;
}
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
ci.githubUrl = Nm;
ci.getS3LikeProviderBaseUrl = $m;
function Nm(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function $m(e) {
  const t = e.provider;
  if (t === "s3")
    return Pm(e);
  if (t === "spaces")
    return Dm(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Pm(e) {
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
  return Uc(t, e.path);
}
function Uc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Dm(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Uc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
Wo.retry = Mc;
const Fm = Tt;
async function Mc(e, t, n, r = 0, i = 0, o) {
  var s;
  const a = new Fm.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((s = o == null ? void 0 : o(l)) !== null && s !== void 0) || s) && t > 0 && !a.cancelled)
      return await new Promise((h) => setTimeout(h, n + r * i)), await Mc(e, t - 1, n, r, i + 1, o);
    throw l;
  }
}
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
zo.parseDn = Lm;
function Lm(e) {
  let t = !1, n = null, r = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let s = 0; s <= e.length; s++) {
    if (s === e.length) {
      n !== null && o.set(n, r);
      break;
    }
    const a = e[s];
    if (t) {
      if (a === '"') {
        t = !1;
        continue;
      }
    } else {
      if (a === '"') {
        t = !0;
        continue;
      }
      if (a === "\\") {
        s++;
        const l = parseInt(e.slice(s, s + 2), 16);
        Number.isNaN(l) ? r += e[s] : (s++, r += String.fromCharCode(l));
        continue;
      }
      if (n === null && a === "=") {
        n = r, r = "";
        continue;
      }
      if (a === "," || a === ";" || a === "+") {
        n !== null && o.set(n, r), n = null, r = "";
        continue;
      }
    }
    if (a === " " && !t) {
      if (r.length === 0)
        continue;
      if (s > i) {
        let l = s;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
        s = i - 1;
        continue;
      }
    }
    r += a;
  }
  return o;
}
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.nil = dn.UUID = void 0;
const Bc = Qn, Hc = mn, xm = "options.name must be either a string or a Buffer", ga = (0, Bc.randomBytes)(16);
ga[0] = ga[0] | 1;
const Br = {}, W = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Br[t] = e, W[e] = t;
}
class jt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = jt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return km(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = Um(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Br[t[14] + t[15]] & 240) >> 4,
        variant: ya((Br[t[19] + t[20]] & 224) >> 5),
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
        variant: ya((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Hc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = Br[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
dn.UUID = jt;
jt.OID = jt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function ya(e) {
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
var Dn;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Dn || (Dn = {}));
function km(e, t, n, r, i = Dn.ASCII) {
  const o = (0, Bc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Hc.newError)(xm, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const a = o.digest();
  let l;
  switch (i) {
    case Dn.BINARY:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, l = a;
      break;
    case Dn.OBJECT:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, l = new jt(a);
      break;
    default:
      l = W[a[0]] + W[a[1]] + W[a[2]] + W[a[3]] + "-" + W[a[4]] + W[a[5]] + "-" + W[a[6] & 15 | n] + W[a[7]] + "-" + W[a[8] & 63 | 128] + W[a[9]] + "-" + W[a[10]] + W[a[11]] + W[a[12]] + W[a[13]] + W[a[14]] + W[a[15]];
      break;
  }
  return l;
}
function Um(e) {
  return W[e[0]] + W[e[1]] + W[e[2]] + W[e[3]] + "-" + W[e[4]] + W[e[5]] + "-" + W[e[6]] + W[e[7]] + "-" + W[e[8]] + W[e[9]] + "-" + W[e[10]] + W[e[11]] + W[e[12]] + W[e[13]] + W[e[14]] + W[e[15]];
}
dn.nil = new jt("00000000-0000-0000-0000-000000000000");
var tr = {}, jc = {};
(function(e) {
  (function(t) {
    t.parser = function(p, d) {
      return new r(p, d);
    }, t.SAXParser = r, t.SAXStream = c, t.createStream = h, t.MAX_BUFFER_LENGTH = 64 * 1024;
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
    function r(p, d) {
      if (!(this instanceof r))
        return new r(p, d);
      var A = this;
      o(A), A.q = A.c = "", A.bufferCheckPosition = t.MAX_BUFFER_LENGTH, A.opt = d || {}, A.opt.lowercase = A.opt.lowercase || A.opt.lowercasetags, A.looseCase = A.opt.lowercase ? "toLowerCase" : "toUpperCase", A.tags = [], A.closed = A.closedRoot = A.sawRoot = !1, A.tag = A.error = null, A.strict = !!p, A.noscript = !!(p || A.opt.noscript), A.state = _.BEGIN, A.strictEntities = A.opt.strictEntities, A.ENTITIES = A.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), A.attribList = [], A.opt.xmlns && (A.ns = Object.create(g)), A.opt.unquotedAttributeValues === void 0 && (A.opt.unquotedAttributeValues = !p), A.trackPosition = A.opt.position !== !1, A.trackPosition && (A.position = A.line = A.column = 0), q(A, "onready");
    }
    Object.create || (Object.create = function(p) {
      function d() {
      }
      d.prototype = p;
      var A = new d();
      return A;
    }), Object.keys || (Object.keys = function(p) {
      var d = [];
      for (var A in p) p.hasOwnProperty(A) && d.push(A);
      return d;
    });
    function i(p) {
      for (var d = Math.max(t.MAX_BUFFER_LENGTH, 10), A = 0, T = 0, K = n.length; T < K; T++) {
        var te = p[n[T]].length;
        if (te > d)
          switch (n[T]) {
            case "textNode":
              Q(p);
              break;
            case "cdata":
              j(p, "oncdata", p.cdata), p.cdata = "";
              break;
            case "script":
              j(p, "onscript", p.script), p.script = "";
              break;
            default:
              O(p, "Max buffer length exceeded: " + n[T]);
          }
        A = Math.max(A, te);
      }
      var se = t.MAX_BUFFER_LENGTH - A;
      p.bufferCheckPosition = se + p.position;
    }
    function o(p) {
      for (var d = 0, A = n.length; d < A; d++)
        p[n[d]] = "";
    }
    function s(p) {
      Q(p), p.cdata !== "" && (j(p, "oncdata", p.cdata), p.cdata = ""), p.script !== "" && (j(p, "onscript", p.script), p.script = "");
    }
    r.prototype = {
      end: function() {
        D(this);
      },
      write: Qe,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        s(this);
      }
    };
    var a;
    try {
      a = require("stream").Stream;
    } catch {
      a = function() {
      };
    }
    a || (a = function() {
    });
    var l = t.EVENTS.filter(function(p) {
      return p !== "error" && p !== "end";
    });
    function h(p, d) {
      return new c(p, d);
    }
    function c(p, d) {
      if (!(this instanceof c))
        return new c(p, d);
      a.apply(this), this._parser = new r(p, d), this.writable = !0, this.readable = !0;
      var A = this;
      this._parser.onend = function() {
        A.emit("end");
      }, this._parser.onerror = function(T) {
        A.emit("error", T), A._parser.error = null;
      }, this._decoder = null, l.forEach(function(T) {
        Object.defineProperty(A, "on" + T, {
          get: function() {
            return A._parser["on" + T];
          },
          set: function(K) {
            if (!K)
              return A.removeAllListeners(T), A._parser["on" + T] = K, K;
            A.on(T, K);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(a.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype.write = function(p) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(p)) {
        if (!this._decoder) {
          var d = bf.StringDecoder;
          this._decoder = new d("utf8");
        }
        p = this._decoder.write(p);
      }
      return this._parser.write(p.toString()), this.emit("data", p), !0;
    }, c.prototype.end = function(p) {
      return p && p.length && this.write(p), this._parser.end(), !0;
    }, c.prototype.on = function(p, d) {
      var A = this;
      return !A._parser["on" + p] && l.indexOf(p) !== -1 && (A._parser["on" + p] = function() {
        var T = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        T.splice(0, 0, p), A.emit.apply(A, T);
      }), a.prototype.on.call(A, p, d);
    };
    var u = "[CDATA[", f = "DOCTYPE", y = "http://www.w3.org/XML/1998/namespace", E = "http://www.w3.org/2000/xmlns/", g = { xml: y, xmlns: E }, v = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, S = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, C = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, P = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function L(p) {
      return p === " " || p === `
` || p === "\r" || p === "	";
    }
    function re(p) {
      return p === '"' || p === "'";
    }
    function le(p) {
      return p === ">" || L(p);
    }
    function z(p, d) {
      return p.test(d);
    }
    function Ue(p, d) {
      return !z(p, d);
    }
    var _ = 0;
    t.STATE = {
      BEGIN: _++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: _++,
      // leading whitespace
      TEXT: _++,
      // general stuff
      TEXT_ENTITY: _++,
      // &amp and such.
      OPEN_WAKA: _++,
      // <
      SGML_DECL: _++,
      // <!BLARG
      SGML_DECL_QUOTED: _++,
      // <!BLARG foo "bar
      DOCTYPE: _++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: _++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: _++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: _++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: _++,
      // <!-
      COMMENT: _++,
      // <!--
      COMMENT_ENDING: _++,
      // <!-- blah -
      COMMENT_ENDED: _++,
      // <!-- blah --
      CDATA: _++,
      // <![CDATA[ something
      CDATA_ENDING: _++,
      // ]
      CDATA_ENDING_2: _++,
      // ]]
      PROC_INST: _++,
      // <?hi
      PROC_INST_BODY: _++,
      // <?hi there
      PROC_INST_ENDING: _++,
      // <?hi "there" ?
      OPEN_TAG: _++,
      // <strong
      OPEN_TAG_SLASH: _++,
      // <strong /
      ATTRIB: _++,
      // <a
      ATTRIB_NAME: _++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: _++,
      // <a foo _
      ATTRIB_VALUE: _++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: _++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: _++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: _++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: _++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: _++,
      // <foo bar=&quot
      CLOSE_TAG: _++,
      // </a
      CLOSE_TAG_SAW_WHITE: _++,
      // </a   >
      SCRIPT: _++,
      // <script> ...
      SCRIPT_ENDING: _++
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
    }, Object.keys(t.ENTITIES).forEach(function(p) {
      var d = t.ENTITIES[p], A = typeof d == "number" ? String.fromCharCode(d) : d;
      t.ENTITIES[p] = A;
    });
    for (var X in t.STATE)
      t.STATE[t.STATE[X]] = X;
    _ = t.STATE;
    function q(p, d, A) {
      p[d] && p[d](A);
    }
    function j(p, d, A) {
      p.textNode && Q(p), q(p, d, A);
    }
    function Q(p) {
      p.textNode = N(p.opt, p.textNode), p.textNode && q(p, "ontext", p.textNode), p.textNode = "";
    }
    function N(p, d) {
      return p.trim && (d = d.trim()), p.normalize && (d = d.replace(/\s+/g, " ")), d;
    }
    function O(p, d) {
      return Q(p), p.trackPosition && (d += `
Line: ` + p.line + `
Column: ` + p.column + `
Char: ` + p.c), d = new Error(d), p.error = d, q(p, "onerror", d), p;
    }
    function D(p) {
      return p.sawRoot && !p.closedRoot && I(p, "Unclosed root tag"), p.state !== _.BEGIN && p.state !== _.BEGIN_WHITESPACE && p.state !== _.TEXT && O(p, "Unexpected end"), Q(p), p.c = "", p.closed = !0, q(p, "onend"), r.call(p, p.strict, p.opt), p;
    }
    function I(p, d) {
      if (typeof p != "object" || !(p instanceof r))
        throw new Error("bad call to strictFail");
      p.strict && O(p, d);
    }
    function F(p) {
      p.strict || (p.tagName = p.tagName[p.looseCase]());
      var d = p.tags[p.tags.length - 1] || p, A = p.tag = { name: p.tagName, attributes: {} };
      p.opt.xmlns && (A.ns = d.ns), p.attribList.length = 0, j(p, "onopentagstart", A);
    }
    function $(p, d) {
      var A = p.indexOf(":"), T = A < 0 ? ["", p] : p.split(":"), K = T[0], te = T[1];
      return d && p === "xmlns" && (K = "xmlns", te = ""), { prefix: K, local: te };
    }
    function H(p) {
      if (p.strict || (p.attribName = p.attribName[p.looseCase]()), p.attribList.indexOf(p.attribName) !== -1 || p.tag.attributes.hasOwnProperty(p.attribName)) {
        p.attribName = p.attribValue = "";
        return;
      }
      if (p.opt.xmlns) {
        var d = $(p.attribName, !0), A = d.prefix, T = d.local;
        if (A === "xmlns")
          if (T === "xml" && p.attribValue !== y)
            I(
              p,
              "xml: prefix must be bound to " + y + `
Actual: ` + p.attribValue
            );
          else if (T === "xmlns" && p.attribValue !== E)
            I(
              p,
              "xmlns: prefix must be bound to " + E + `
Actual: ` + p.attribValue
            );
          else {
            var K = p.tag, te = p.tags[p.tags.length - 1] || p;
            K.ns === te.ns && (K.ns = Object.create(te.ns)), K.ns[T] = p.attribValue;
          }
        p.attribList.push([p.attribName, p.attribValue]);
      } else
        p.tag.attributes[p.attribName] = p.attribValue, j(p, "onattribute", {
          name: p.attribName,
          value: p.attribValue
        });
      p.attribName = p.attribValue = "";
    }
    function V(p, d) {
      if (p.opt.xmlns) {
        var A = p.tag, T = $(p.tagName);
        A.prefix = T.prefix, A.local = T.local, A.uri = A.ns[T.prefix] || "", A.prefix && !A.uri && (I(
          p,
          "Unbound namespace prefix: " + JSON.stringify(p.tagName)
        ), A.uri = T.prefix);
        var K = p.tags[p.tags.length - 1] || p;
        A.ns && K.ns !== A.ns && Object.keys(A.ns).forEach(function(dr) {
          j(p, "onopennamespace", {
            prefix: dr,
            uri: A.ns[dr]
          });
        });
        for (var te = 0, se = p.attribList.length; te < se; te++) {
          var ge = p.attribList[te], ve = ge[0], ut = ge[1], ue = $(ve, !0), Xe = ue.prefix, Ri = ue.local, ur = Xe === "" ? "" : A.ns[Xe] || "", _n = {
            name: ve,
            value: ut,
            prefix: Xe,
            local: Ri,
            uri: ur
          };
          Xe && Xe !== "xmlns" && !ur && (I(
            p,
            "Unbound namespace prefix: " + JSON.stringify(Xe)
          ), _n.uri = Xe), p.tag.attributes[ve] = _n, j(p, "onattribute", _n);
        }
        p.attribList.length = 0;
      }
      p.tag.isSelfClosing = !!d, p.sawRoot = !0, p.tags.push(p.tag), j(p, "onopentag", p.tag), d || (!p.noscript && p.tagName.toLowerCase() === "script" ? p.state = _.SCRIPT : p.state = _.TEXT, p.tag = null, p.tagName = ""), p.attribName = p.attribValue = "", p.attribList.length = 0;
    }
    function G(p) {
      if (!p.tagName) {
        I(p, "Weird empty close tag."), p.textNode += "</>", p.state = _.TEXT;
        return;
      }
      if (p.script) {
        if (p.tagName !== "script") {
          p.script += "</" + p.tagName + ">", p.tagName = "", p.state = _.SCRIPT;
          return;
        }
        j(p, "onscript", p.script), p.script = "";
      }
      var d = p.tags.length, A = p.tagName;
      p.strict || (A = A[p.looseCase]());
      for (var T = A; d--; ) {
        var K = p.tags[d];
        if (K.name !== T)
          I(p, "Unexpected close tag");
        else
          break;
      }
      if (d < 0) {
        I(p, "Unmatched closing tag: " + p.tagName), p.textNode += "</" + p.tagName + ">", p.state = _.TEXT;
        return;
      }
      p.tagName = A;
      for (var te = p.tags.length; te-- > d; ) {
        var se = p.tag = p.tags.pop();
        p.tagName = p.tag.name, j(p, "onclosetag", p.tagName);
        var ge = {};
        for (var ve in se.ns)
          ge[ve] = se.ns[ve];
        var ut = p.tags[p.tags.length - 1] || p;
        p.opt.xmlns && se.ns !== ut.ns && Object.keys(se.ns).forEach(function(ue) {
          var Xe = se.ns[ue];
          j(p, "onclosenamespace", { prefix: ue, uri: Xe });
        });
      }
      d === 0 && (p.closedRoot = !0), p.tagName = p.attribValue = p.attribName = "", p.attribList.length = 0, p.state = _.TEXT;
    }
    function Z(p) {
      var d = p.entity, A = d.toLowerCase(), T, K = "";
      return p.ENTITIES[d] ? p.ENTITIES[d] : p.ENTITIES[A] ? p.ENTITIES[A] : (d = A, d.charAt(0) === "#" && (d.charAt(1) === "x" ? (d = d.slice(2), T = parseInt(d, 16), K = T.toString(16)) : (d = d.slice(1), T = parseInt(d, 10), K = T.toString(10))), d = d.replace(/^0+/, ""), isNaN(T) || K.toLowerCase() !== d || T < 0 || T > 1114111 ? (I(p, "Invalid character entity"), "&" + p.entity + ";") : String.fromCodePoint(T));
    }
    function fe(p, d) {
      d === "<" ? (p.state = _.OPEN_WAKA, p.startTagPosition = p.position) : L(d) || (I(p, "Non-whitespace before first tag."), p.textNode = d, p.state = _.TEXT);
    }
    function M(p, d) {
      var A = "";
      return d < p.length && (A = p.charAt(d)), A;
    }
    function Qe(p) {
      var d = this;
      if (this.error)
        throw this.error;
      if (d.closed)
        return O(
          d,
          "Cannot write after close. Assign an onready handler."
        );
      if (p === null)
        return D(d);
      typeof p == "object" && (p = p.toString());
      for (var A = 0, T = ""; T = M(p, A++), d.c = T, !!T; )
        switch (d.trackPosition && (d.position++, T === `
` ? (d.line++, d.column = 0) : d.column++), d.state) {
          case _.BEGIN:
            if (d.state = _.BEGIN_WHITESPACE, T === "\uFEFF")
              continue;
            fe(d, T);
            continue;
          case _.BEGIN_WHITESPACE:
            fe(d, T);
            continue;
          case _.TEXT:
            if (d.sawRoot && !d.closedRoot) {
              for (var te = A - 1; T && T !== "<" && T !== "&"; )
                T = M(p, A++), T && d.trackPosition && (d.position++, T === `
` ? (d.line++, d.column = 0) : d.column++);
              d.textNode += p.substring(te, A - 1);
            }
            T === "<" && !(d.sawRoot && d.closedRoot && !d.strict) ? (d.state = _.OPEN_WAKA, d.startTagPosition = d.position) : (!L(T) && (!d.sawRoot || d.closedRoot) && I(d, "Text data outside of root node."), T === "&" ? d.state = _.TEXT_ENTITY : d.textNode += T);
            continue;
          case _.SCRIPT:
            T === "<" ? d.state = _.SCRIPT_ENDING : d.script += T;
            continue;
          case _.SCRIPT_ENDING:
            T === "/" ? d.state = _.CLOSE_TAG : (d.script += "<" + T, d.state = _.SCRIPT);
            continue;
          case _.OPEN_WAKA:
            if (T === "!")
              d.state = _.SGML_DECL, d.sgmlDecl = "";
            else if (!L(T)) if (z(v, T))
              d.state = _.OPEN_TAG, d.tagName = T;
            else if (T === "/")
              d.state = _.CLOSE_TAG, d.tagName = "";
            else if (T === "?")
              d.state = _.PROC_INST, d.procInstName = d.procInstBody = "";
            else {
              if (I(d, "Unencoded <"), d.startTagPosition + 1 < d.position) {
                var K = d.position - d.startTagPosition;
                T = new Array(K).join(" ") + T;
              }
              d.textNode += "<" + T, d.state = _.TEXT;
            }
            continue;
          case _.SGML_DECL:
            if (d.sgmlDecl + T === "--") {
              d.state = _.COMMENT, d.comment = "", d.sgmlDecl = "";
              continue;
            }
            d.doctype && d.doctype !== !0 && d.sgmlDecl ? (d.state = _.DOCTYPE_DTD, d.doctype += "<!" + d.sgmlDecl + T, d.sgmlDecl = "") : (d.sgmlDecl + T).toUpperCase() === u ? (j(d, "onopencdata"), d.state = _.CDATA, d.sgmlDecl = "", d.cdata = "") : (d.sgmlDecl + T).toUpperCase() === f ? (d.state = _.DOCTYPE, (d.doctype || d.sawRoot) && I(
              d,
              "Inappropriately located doctype declaration"
            ), d.doctype = "", d.sgmlDecl = "") : T === ">" ? (j(d, "onsgmldeclaration", d.sgmlDecl), d.sgmlDecl = "", d.state = _.TEXT) : (re(T) && (d.state = _.SGML_DECL_QUOTED), d.sgmlDecl += T);
            continue;
          case _.SGML_DECL_QUOTED:
            T === d.q && (d.state = _.SGML_DECL, d.q = ""), d.sgmlDecl += T;
            continue;
          case _.DOCTYPE:
            T === ">" ? (d.state = _.TEXT, j(d, "ondoctype", d.doctype), d.doctype = !0) : (d.doctype += T, T === "[" ? d.state = _.DOCTYPE_DTD : re(T) && (d.state = _.DOCTYPE_QUOTED, d.q = T));
            continue;
          case _.DOCTYPE_QUOTED:
            d.doctype += T, T === d.q && (d.q = "", d.state = _.DOCTYPE);
            continue;
          case _.DOCTYPE_DTD:
            T === "]" ? (d.doctype += T, d.state = _.DOCTYPE) : T === "<" ? (d.state = _.OPEN_WAKA, d.startTagPosition = d.position) : re(T) ? (d.doctype += T, d.state = _.DOCTYPE_DTD_QUOTED, d.q = T) : d.doctype += T;
            continue;
          case _.DOCTYPE_DTD_QUOTED:
            d.doctype += T, T === d.q && (d.state = _.DOCTYPE_DTD, d.q = "");
            continue;
          case _.COMMENT:
            T === "-" ? d.state = _.COMMENT_ENDING : d.comment += T;
            continue;
          case _.COMMENT_ENDING:
            T === "-" ? (d.state = _.COMMENT_ENDED, d.comment = N(d.opt, d.comment), d.comment && j(d, "oncomment", d.comment), d.comment = "") : (d.comment += "-" + T, d.state = _.COMMENT);
            continue;
          case _.COMMENT_ENDED:
            T !== ">" ? (I(d, "Malformed comment"), d.comment += "--" + T, d.state = _.COMMENT) : d.doctype && d.doctype !== !0 ? d.state = _.DOCTYPE_DTD : d.state = _.TEXT;
            continue;
          case _.CDATA:
            for (var te = A - 1; T && T !== "]"; )
              T = M(p, A++), T && d.trackPosition && (d.position++, T === `
` ? (d.line++, d.column = 0) : d.column++);
            d.cdata += p.substring(te, A - 1), T === "]" && (d.state = _.CDATA_ENDING);
            continue;
          case _.CDATA_ENDING:
            T === "]" ? d.state = _.CDATA_ENDING_2 : (d.cdata += "]" + T, d.state = _.CDATA);
            continue;
          case _.CDATA_ENDING_2:
            T === ">" ? (d.cdata && j(d, "oncdata", d.cdata), j(d, "onclosecdata"), d.cdata = "", d.state = _.TEXT) : T === "]" ? d.cdata += "]" : (d.cdata += "]]" + T, d.state = _.CDATA);
            continue;
          case _.PROC_INST:
            T === "?" ? d.state = _.PROC_INST_ENDING : L(T) ? d.state = _.PROC_INST_BODY : d.procInstName += T;
            continue;
          case _.PROC_INST_BODY:
            if (!d.procInstBody && L(T))
              continue;
            T === "?" ? d.state = _.PROC_INST_ENDING : d.procInstBody += T;
            continue;
          case _.PROC_INST_ENDING:
            T === ">" ? (j(d, "onprocessinginstruction", {
              name: d.procInstName,
              body: d.procInstBody
            }), d.procInstName = d.procInstBody = "", d.state = _.TEXT) : (d.procInstBody += "?" + T, d.state = _.PROC_INST_BODY);
            continue;
          case _.OPEN_TAG:
            z(S, T) ? d.tagName += T : (F(d), T === ">" ? V(d) : T === "/" ? d.state = _.OPEN_TAG_SLASH : (L(T) || I(d, "Invalid character in tag name"), d.state = _.ATTRIB));
            continue;
          case _.OPEN_TAG_SLASH:
            T === ">" ? (V(d, !0), G(d)) : (I(
              d,
              "Forward-slash in opening tag not followed by >"
            ), d.state = _.ATTRIB);
            continue;
          case _.ATTRIB:
            if (L(T))
              continue;
            T === ">" ? V(d) : T === "/" ? d.state = _.OPEN_TAG_SLASH : z(v, T) ? (d.attribName = T, d.attribValue = "", d.state = _.ATTRIB_NAME) : I(d, "Invalid attribute name");
            continue;
          case _.ATTRIB_NAME:
            T === "=" ? d.state = _.ATTRIB_VALUE : T === ">" ? (I(d, "Attribute without value"), d.attribValue = d.attribName, H(d), V(d)) : L(T) ? d.state = _.ATTRIB_NAME_SAW_WHITE : z(S, T) ? d.attribName += T : I(d, "Invalid attribute name");
            continue;
          case _.ATTRIB_NAME_SAW_WHITE:
            if (T === "=")
              d.state = _.ATTRIB_VALUE;
            else {
              if (L(T))
                continue;
              I(d, "Attribute without value"), d.tag.attributes[d.attribName] = "", d.attribValue = "", j(d, "onattribute", {
                name: d.attribName,
                value: ""
              }), d.attribName = "", T === ">" ? V(d) : z(v, T) ? (d.attribName = T, d.state = _.ATTRIB_NAME) : (I(d, "Invalid attribute name"), d.state = _.ATTRIB);
            }
            continue;
          case _.ATTRIB_VALUE:
            if (L(T))
              continue;
            re(T) ? (d.q = T, d.state = _.ATTRIB_VALUE_QUOTED) : (d.opt.unquotedAttributeValues || O(d, "Unquoted attribute value"), d.state = _.ATTRIB_VALUE_UNQUOTED, d.attribValue = T);
            continue;
          case _.ATTRIB_VALUE_QUOTED:
            if (T !== d.q) {
              T === "&" ? d.state = _.ATTRIB_VALUE_ENTITY_Q : d.attribValue += T;
              continue;
            }
            H(d), d.q = "", d.state = _.ATTRIB_VALUE_CLOSED;
            continue;
          case _.ATTRIB_VALUE_CLOSED:
            L(T) ? d.state = _.ATTRIB : T === ">" ? V(d) : T === "/" ? d.state = _.OPEN_TAG_SLASH : z(v, T) ? (I(d, "No whitespace between attributes"), d.attribName = T, d.attribValue = "", d.state = _.ATTRIB_NAME) : I(d, "Invalid attribute name");
            continue;
          case _.ATTRIB_VALUE_UNQUOTED:
            if (!le(T)) {
              T === "&" ? d.state = _.ATTRIB_VALUE_ENTITY_U : d.attribValue += T;
              continue;
            }
            H(d), T === ">" ? V(d) : d.state = _.ATTRIB;
            continue;
          case _.CLOSE_TAG:
            if (d.tagName)
              T === ">" ? G(d) : z(S, T) ? d.tagName += T : d.script ? (d.script += "</" + d.tagName, d.tagName = "", d.state = _.SCRIPT) : (L(T) || I(d, "Invalid tagname in closing tag"), d.state = _.CLOSE_TAG_SAW_WHITE);
            else {
              if (L(T))
                continue;
              Ue(v, T) ? d.script ? (d.script += "</" + T, d.state = _.SCRIPT) : I(d, "Invalid tagname in closing tag.") : d.tagName = T;
            }
            continue;
          case _.CLOSE_TAG_SAW_WHITE:
            if (L(T))
              continue;
            T === ">" ? G(d) : I(d, "Invalid characters in closing tag");
            continue;
          case _.TEXT_ENTITY:
          case _.ATTRIB_VALUE_ENTITY_Q:
          case _.ATTRIB_VALUE_ENTITY_U:
            var se, ge;
            switch (d.state) {
              case _.TEXT_ENTITY:
                se = _.TEXT, ge = "textNode";
                break;
              case _.ATTRIB_VALUE_ENTITY_Q:
                se = _.ATTRIB_VALUE_QUOTED, ge = "attribValue";
                break;
              case _.ATTRIB_VALUE_ENTITY_U:
                se = _.ATTRIB_VALUE_UNQUOTED, ge = "attribValue";
                break;
            }
            if (T === ";") {
              var ve = Z(d);
              d.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ve) ? (d.entity = "", d.state = se, d.write(ve)) : (d[ge] += ve, d.entity = "", d.state = se);
            } else z(d.entity.length ? P : C, T) ? d.entity += T : (I(d, "Invalid character in entity name"), d[ge] += "&" + d.entity + T, d.entity = "", d.state = se);
            continue;
          default:
            throw new Error(d, "Unknown state: " + d.state);
        }
      return d.position >= d.bufferCheckPosition && i(d), d;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var p = String.fromCharCode, d = Math.floor, A = function() {
        var T = 16384, K = [], te, se, ge = -1, ve = arguments.length;
        if (!ve)
          return "";
        for (var ut = ""; ++ge < ve; ) {
          var ue = Number(arguments[ge]);
          if (!isFinite(ue) || // `NaN`, `+Infinity`, or `-Infinity`
          ue < 0 || // not a valid Unicode code point
          ue > 1114111 || // not a valid Unicode code point
          d(ue) !== ue)
            throw RangeError("Invalid code point: " + ue);
          ue <= 65535 ? K.push(ue) : (ue -= 65536, te = (ue >> 10) + 55296, se = ue % 1024 + 56320, K.push(te, se)), (ge + 1 === ve || K.length > T) && (ut += p.apply(null, K), K.length = 0);
        }
        return ut;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: A,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = A;
    }();
  })(e);
})(jc);
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.XElement = void 0;
tr.parseXml = jm;
const Mm = jc, Ar = mn;
class qc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Ar.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Hm(t))
      throw (0, Ar.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, Ar.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, Ar.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (Ea(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => Ea(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
tr.XElement = qc;
const Bm = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Hm(e) {
  return Bm.test(e);
}
function Ea(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function jm(e) {
  let t = null;
  const n = Mm.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new qc(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const s = r[r.length - 1];
      s.elements == null && (s.elements = []), s.elements.push(o);
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
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = u;
  var t = Tt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = mn;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = be;
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
  var i = li;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = er;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var s = ci;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } });
  var a = Wo;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var l = zo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var h = dn;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return h.UUID;
  } });
  var c = tr;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function u(f) {
    return f == null ? [] : Array.isArray(f) ? f : [f];
  }
})(me);
var _e = {}, Ko = {}, ze = {};
function Gc(e) {
  return typeof e > "u" || e === null;
}
function qm(e) {
  return typeof e == "object" && e !== null;
}
function Gm(e) {
  return Array.isArray(e) ? e : Gc(e) ? [] : [e];
}
function Ym(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function Xm(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function Vm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
ze.isNothing = Gc;
ze.isObject = qm;
ze.toArray = Gm;
ze.repeat = Xm;
ze.isNegativeZero = Vm;
ze.extend = Ym;
function Yc(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Bn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Yc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Bn.prototype = Object.create(Error.prototype);
Bn.prototype.constructor = Bn;
Bn.prototype.toString = function(t) {
  return this.name + ": " + Yc(this, t);
};
var nr = Bn, bn = ze;
function Yi(e, t, n, r, i) {
  var o = "", s = "", a = Math.floor(i / 2) - 1;
  return r - t > a && (o = " ... ", t = r - a + o.length), n - r > a && (s = " ...", n = r + a - s.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + s,
    pos: r - t + o.length
    // relative position
  };
}
function Xi(e, t) {
  return bn.repeat(" ", t - e.length) + e;
}
function Wm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, s = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = r.length - 2);
  s < 0 && (s = r.length - 1);
  var a = "", l, h, c = Math.min(e.line + t.linesAfter, i.length).toString().length, u = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(s - l < 0); l++)
    h = Yi(
      e.buffer,
      r[s - l],
      i[s - l],
      e.position - (r[s] - r[s - l]),
      u
    ), a = bn.repeat(" ", t.indent) + Xi((e.line - l + 1).toString(), c) + " | " + h.str + `
` + a;
  for (h = Yi(e.buffer, r[s], i[s], e.position, u), a += bn.repeat(" ", t.indent) + Xi((e.line + 1).toString(), c) + " | " + h.str + `
`, a += bn.repeat("-", t.indent + c + 3 + h.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++)
    h = Yi(
      e.buffer,
      r[s + l],
      i[s + l],
      e.position - (r[s] - r[s + l]),
      u
    ), a += bn.repeat(" ", t.indent) + Xi((e.line + l + 1).toString(), c) + " | " + h.str + `
`;
  return a.replace(/\n$/, "");
}
var zm = Wm, _a = nr, Km = [
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
], Jm = [
  "scalar",
  "sequence",
  "mapping"
];
function Qm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function Zm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (Km.indexOf(n) === -1)
      throw new _a('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Qm(t.styleAliases || null), Jm.indexOf(this.kind) === -1)
    throw new _a('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var De = Zm, An = nr, Vi = De;
function va(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, s) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = s);
    }), n[i] = r;
  }), n;
}
function eg() {
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
function wo(e) {
  return this.extend(e);
}
wo.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof Vi)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new An("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Vi))
      throw new An("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new An("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new An("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Vi))
      throw new An("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(wo.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = va(i, "implicit"), i.compiledExplicit = va(i, "explicit"), i.compiledTypeMap = eg(i.compiledImplicit, i.compiledExplicit), i;
};
var Xc = wo, tg = De, Vc = new tg("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), ng = De, Wc = new ng("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), rg = De, zc = new rg("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), ig = Xc, Kc = new ig({
  explicit: [
    Vc,
    Wc,
    zc
  ]
}), og = De;
function sg(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function ag() {
  return null;
}
function lg(e) {
  return e === null;
}
var Jc = new og("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: sg,
  construct: ag,
  predicate: lg,
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
}), cg = De;
function ug(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function dg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function fg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Qc = new cg("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: ug,
  construct: dg,
  predicate: fg,
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
}), hg = ze, pg = De;
function mg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function gg(e) {
  return 48 <= e && e <= 55;
}
function yg(e) {
  return 48 <= e && e <= 57;
}
function Eg(e) {
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
          if (!mg(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!gg(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!yg(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function _g(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function vg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !hg.isNegativeZero(e);
}
var Zc = new pg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Eg,
  construct: _g,
  predicate: vg,
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
}), eu = ze, wg = De, Tg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Sg(e) {
  return !(e === null || !Tg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Cg(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var Ag = /^[-+]?[0-9]+e/;
function Ig(e, t) {
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
  else if (eu.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), Ag.test(n) ? n.replace("e", ".e") : n;
}
function Og(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || eu.isNegativeZero(e));
}
var tu = new wg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Sg,
  construct: Cg,
  predicate: Og,
  represent: Ig,
  defaultStyle: "lowercase"
}), nu = Kc.extend({
  implicit: [
    Jc,
    Qc,
    Zc,
    tu
  ]
}), ru = nu, Rg = De, iu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), ou = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function bg(e) {
  return e === null ? !1 : iu.exec(e) !== null || ou.exec(e) !== null;
}
function Ng(e) {
  var t, n, r, i, o, s, a, l = 0, h = null, c, u, f;
  if (t = iu.exec(e), t === null && (t = ou.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], s = +t[5], a = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], u = +(t[11] || 0), h = (c * 60 + u) * 6e4, t[9] === "-" && (h = -h)), f = new Date(Date.UTC(n, r, i, o, s, a, l)), h && f.setTime(f.getTime() - h), f;
}
function $g(e) {
  return e.toISOString();
}
var su = new Rg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: bg,
  construct: Ng,
  instanceOf: Date,
  represent: $g
}), Pg = De;
function Dg(e) {
  return e === "<<" || e === null;
}
var au = new Pg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Dg
}), Fg = De, Jo = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Lg(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = Jo;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function xg(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = Jo, s = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : n === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : n === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function kg(e) {
  var t = "", n = 0, r, i, o = e.length, s = Jo;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]) : i === 2 ? (t += s[n >> 10 & 63], t += s[n >> 4 & 63], t += s[n << 2 & 63], t += s[64]) : i === 1 && (t += s[n >> 2 & 63], t += s[n << 4 & 63], t += s[64], t += s[64]), t;
}
function Ug(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var lu = new Fg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Lg,
  construct: xg,
  predicate: Ug,
  represent: kg
}), Mg = De, Bg = Object.prototype.hasOwnProperty, Hg = Object.prototype.toString;
function jg(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, s, a = e;
  for (n = 0, r = a.length; n < r; n += 1) {
    if (i = a[n], s = !1, Hg.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Bg.call(i, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function qg(e) {
  return e !== null ? e : [];
}
var cu = new Mg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: jg,
  construct: qg
}), Gg = De, Yg = Object.prototype.toString;
function Xg(e) {
  if (e === null) return !0;
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1) {
    if (r = s[t], Yg.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function Vg(e) {
  if (e === null) return [];
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1)
    r = s[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var uu = new Gg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Xg,
  construct: Vg
}), Wg = De, zg = Object.prototype.hasOwnProperty;
function Kg(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (zg.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function Jg(e) {
  return e !== null ? e : {};
}
var du = new Wg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Kg,
  construct: Jg
}), Qo = ru.extend({
  implicit: [
    su,
    au
  ],
  explicit: [
    lu,
    cu,
    uu,
    du
  ]
}), kt = ze, fu = nr, Qg = zm, Zg = Qo, St = Object.prototype.hasOwnProperty, Wr = 1, hu = 2, pu = 3, zr = 4, Wi = 1, e0 = 2, wa = 3, t0 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, n0 = /[\x85\u2028\u2029]/, r0 = /[,\[\]\{\}]/, mu = /^(?:!|!!|![a-z\-]+!)$/i, gu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Ta(e) {
  return Object.prototype.toString.call(e);
}
function tt(e) {
  return e === 10 || e === 13;
}
function Bt(e) {
  return e === 9 || e === 32;
}
function ke(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function en(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function i0(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function o0(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function s0(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Sa(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function a0(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function yu(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var Eu = new Array(256), _u = new Array(256);
for (var Wt = 0; Wt < 256; Wt++)
  Eu[Wt] = Sa(Wt) ? 1 : 0, _u[Wt] = Sa(Wt);
function l0(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Zg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function vu(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = Qg(n), new fu(t, n);
}
function U(e, t) {
  throw vu(e, t);
}
function Kr(e, t) {
  e.onWarning && e.onWarning.call(null, vu(e, t));
}
var Ca = {
  YAML: function(t, n, r) {
    var i, o, s;
    t.version !== null && U(t, "duplication of %YAML directive"), r.length !== 1 && U(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && U(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), s = parseInt(i[2], 10), o !== 1 && U(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Kr(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && U(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], mu.test(i) || U(t, "ill-formed tag handle (first argument) of the TAG directive"), St.call(t.tagMap, i) && U(t, 'there is a previously declared suffix for "' + i + '" tag handle'), gu.test(o) || U(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      U(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function vt(e, t, n, r) {
  var i, o, s, a;
  if (t < n) {
    if (a = e.input.slice(t, n), r)
      for (i = 0, o = a.length; i < o; i += 1)
        s = a.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || U(e, "expected valid JSON character");
    else t0.test(a) && U(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function Aa(e, t, n, r) {
  var i, o, s, a;
  for (kt.isObject(n) || U(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), s = 0, a = i.length; s < a; s += 1)
    o = i[s], St.call(t, o) || (yu(t, o, n[o]), r[o] = !0);
}
function tn(e, t, n, r, i, o, s, a, l) {
  var h, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), h = 0, c = i.length; h < c; h += 1)
      Array.isArray(i[h]) && U(e, "nested arrays are not supported inside keys"), typeof i == "object" && Ta(i[h]) === "[object Object]" && (i[h] = "[object Object]");
  if (typeof i == "object" && Ta(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (h = 0, c = o.length; h < c; h += 1)
        Aa(e, t, o[h], n);
    else
      Aa(e, t, o, n);
  else
    !e.json && !St.call(n, i) && St.call(t, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = l || e.position, U(e, "duplicated mapping key")), yu(t, i, o), delete n[i];
  return t;
}
function Zo(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : U(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ce(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Bt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (tt(i))
      for (Zo(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && Kr(e, "deficient indentation"), r;
}
function ui(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || ke(n)));
}
function es(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += kt.repeat(`
`, t - 1));
}
function c0(e, t, n) {
  var r, i, o, s, a, l, h, c, u = e.kind, f = e.result, y;
  if (y = e.input.charCodeAt(e.position), ke(y) || en(y) || y === 35 || y === 38 || y === 42 || y === 33 || y === 124 || y === 62 || y === 39 || y === 34 || y === 37 || y === 64 || y === 96 || (y === 63 || y === 45) && (i = e.input.charCodeAt(e.position + 1), ke(i) || n && en(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; y !== 0; ) {
    if (y === 58) {
      if (i = e.input.charCodeAt(e.position + 1), ke(i) || n && en(i))
        break;
    } else if (y === 35) {
      if (r = e.input.charCodeAt(e.position - 1), ke(r))
        break;
    } else {
      if (e.position === e.lineStart && ui(e) || n && en(y))
        break;
      if (tt(y))
        if (l = e.line, h = e.lineStart, c = e.lineIndent, ce(e, !1, -1), e.lineIndent >= t) {
          a = !0, y = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = h, e.lineIndent = c;
          break;
        }
    }
    a && (vt(e, o, s, !1), es(e, e.line - l), o = s = e.position, a = !1), Bt(y) || (s = e.position + 1), y = e.input.charCodeAt(++e.position);
  }
  return vt(e, o, s, !1), e.result ? !0 : (e.kind = u, e.result = f, !1);
}
function u0(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (vt(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else tt(n) ? (vt(e, r, i, !0), es(e, ce(e, !1, t)), r = i = e.position) : e.position === e.lineStart && ui(e) ? U(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  U(e, "unexpected end of the stream within a single quoted scalar");
}
function d0(e, t) {
  var n, r, i, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return vt(e, n, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (vt(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), tt(a))
        ce(e, !1, t);
      else if (a < 256 && Eu[a])
        e.result += _u[a], e.position++;
      else if ((s = o0(a)) > 0) {
        for (i = s, o = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (s = i0(a)) >= 0 ? o = (o << 4) + s : U(e, "expected hexadecimal character");
        e.result += a0(o), e.position++;
      } else
        U(e, "unknown escape sequence");
      n = r = e.position;
    } else tt(a) ? (vt(e, n, r, !0), es(e, ce(e, !1, t)), n = r = e.position) : e.position === e.lineStart && ui(e) ? U(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  U(e, "unexpected end of the stream within a double quoted scalar");
}
function f0(e, t) {
  var n = !0, r, i, o, s = e.tag, a, l = e.anchor, h, c, u, f, y, E = /* @__PURE__ */ Object.create(null), g, v, S, C;
  if (C = e.input.charCodeAt(e.position), C === 91)
    c = 93, y = !1, a = [];
  else if (C === 123)
    c = 125, y = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), C = e.input.charCodeAt(++e.position); C !== 0; ) {
    if (ce(e, !0, t), C = e.input.charCodeAt(e.position), C === c)
      return e.position++, e.tag = s, e.anchor = l, e.kind = y ? "mapping" : "sequence", e.result = a, !0;
    n ? C === 44 && U(e, "expected the node content, but found ','") : U(e, "missed comma between flow collection entries"), v = g = S = null, u = f = !1, C === 63 && (h = e.input.charCodeAt(e.position + 1), ke(h) && (u = f = !0, e.position++, ce(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, fn(e, t, Wr, !1, !0), v = e.tag, g = e.result, ce(e, !0, t), C = e.input.charCodeAt(e.position), (f || e.line === r) && C === 58 && (u = !0, C = e.input.charCodeAt(++e.position), ce(e, !0, t), fn(e, t, Wr, !1, !0), S = e.result), y ? tn(e, a, E, v, g, S, r, i, o) : u ? a.push(tn(e, null, E, v, g, S, r, i, o)) : a.push(g), ce(e, !0, t), C = e.input.charCodeAt(e.position), C === 44 ? (n = !0, C = e.input.charCodeAt(++e.position)) : n = !1;
  }
  U(e, "unexpected end of the stream within a flow collection");
}
function h0(e, t) {
  var n, r, i = Wi, o = !1, s = !1, a = t, l = 0, h = !1, c, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    r = !1;
  else if (u === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      Wi === i ? i = u === 43 ? wa : e0 : U(e, "repeat of a chomping mode identifier");
    else if ((c = s0(u)) >= 0)
      c === 0 ? U(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? U(e, "repeat of an indentation width identifier") : (a = t + c - 1, s = !0);
    else
      break;
  if (Bt(u)) {
    do
      u = e.input.charCodeAt(++e.position);
    while (Bt(u));
    if (u === 35)
      do
        u = e.input.charCodeAt(++e.position);
      while (!tt(u) && u !== 0);
  }
  for (; u !== 0; ) {
    for (Zo(e), e.lineIndent = 0, u = e.input.charCodeAt(e.position); (!s || e.lineIndent < a) && u === 32; )
      e.lineIndent++, u = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > a && (a = e.lineIndent), tt(u)) {
      l++;
      continue;
    }
    if (e.lineIndent < a) {
      i === wa ? e.result += kt.repeat(`
`, o ? 1 + l : l) : i === Wi && o && (e.result += `
`);
      break;
    }
    for (r ? Bt(u) ? (h = !0, e.result += kt.repeat(`
`, o ? 1 + l : l)) : h ? (h = !1, e.result += kt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += kt.repeat(`
`, l) : e.result += kt.repeat(`
`, o ? 1 + l : l), o = !0, s = !0, l = 0, n = e.position; !tt(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    vt(e, n, e.position, !1);
  }
  return !0;
}
function Ia(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], s, a = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !ke(s)))); ) {
    if (a = !0, e.position++, ce(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, fn(e, t, pu, !1, !0), o.push(e.result), ce(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      U(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function p0(e, t, n) {
  var r, i, o, s, a, l, h = e.tag, c = e.anchor, u = {}, f = /* @__PURE__ */ Object.create(null), y = null, E = null, g = null, v = !1, S = !1, C;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), C = e.input.charCodeAt(e.position); C !== 0; ) {
    if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (C === 63 || C === 58) && ke(r))
      C === 63 ? (v && (tn(e, u, f, y, E, null, s, a, l), y = E = g = null), S = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : U(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, C = r;
    else {
      if (s = e.line, a = e.lineStart, l = e.position, !fn(e, n, hu, !1, !0))
        break;
      if (e.line === o) {
        for (C = e.input.charCodeAt(e.position); Bt(C); )
          C = e.input.charCodeAt(++e.position);
        if (C === 58)
          C = e.input.charCodeAt(++e.position), ke(C) || U(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (tn(e, u, f, y, E, null, s, a, l), y = E = g = null), S = !0, v = !1, i = !1, y = e.tag, E = e.result;
        else if (S)
          U(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = h, e.anchor = c, !0;
      } else if (S)
        U(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = h, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (v && (s = e.line, a = e.lineStart, l = e.position), fn(e, t, zr, !0, i) && (v ? E = e.result : g = e.result), v || (tn(e, u, f, y, E, g, s, a, l), y = E = g = null), ce(e, !0, -1), C = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && C !== 0)
      U(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return v && tn(e, u, f, y, E, null, s, a, l), S && (e.tag = h, e.anchor = c, e.kind = "mapping", e.result = u), S;
}
function m0(e) {
  var t, n = !1, r = !1, i, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && U(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (n = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (r = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : U(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !ke(s); )
      s === 33 && (r ? U(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), mu.test(i) || U(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), r0.test(o) && U(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !gu.test(o) && U(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    U(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : St.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : U(e, 'undeclared tag handle "' + i + '"'), !0;
}
function g0(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && U(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !ke(n) && !en(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && U(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function y0(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !ke(r) && !en(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && U(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), St.call(e.anchorMap, n) || U(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], ce(e, !0, -1), !0;
}
function fn(e, t, n, r, i) {
  var o, s, a, l = 1, h = !1, c = !1, u, f, y, E, g, v;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = zr === n || pu === n, r && ce(e, !0, -1) && (h = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; m0(e) || g0(e); )
      ce(e, !0, -1) ? (h = !0, a = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : a = !1;
  if (a && (a = h || i), (l === 1 || zr === n) && (Wr === n || hu === n ? g = t : g = t + 1, v = e.position - e.lineStart, l === 1 ? a && (Ia(e, v) || p0(e, v, g)) || f0(e, g) ? c = !0 : (s && h0(e, g) || u0(e, g) || d0(e, g) ? c = !0 : y0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && U(e, "alias node should not have any properties")) : c0(e, g, Wr === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = a && Ia(e, v))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && U(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, f = e.implicitTypes.length; u < f; u += 1)
      if (E = e.implicitTypes[u], E.resolve(e.result)) {
        e.result = E.construct(e.result), e.tag = E.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (St.call(e.typeMap[e.kind || "fallback"], e.tag))
      E = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (E = null, y = e.typeMap.multi[e.kind || "fallback"], u = 0, f = y.length; u < f; u += 1)
        if (e.tag.slice(0, y[u].tag.length) === y[u].tag) {
          E = y[u];
          break;
        }
    E || U(e, "unknown tag !<" + e.tag + ">"), e.result !== null && E.kind !== e.kind && U(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + E.kind + '", not "' + e.kind + '"'), E.resolve(e.result, e.tag) ? (e.result = E.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : U(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function E0(e) {
  var t = e.position, n, r, i, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (ce(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), n = e.position; s !== 0 && !ke(s); )
      s = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && U(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; Bt(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !tt(s));
        break;
      }
      if (tt(s)) break;
      for (n = e.position; s !== 0 && !ke(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    s !== 0 && Zo(e), St.call(Ca, r) ? Ca[r](e, r, i) : Kr(e, 'unknown document directive "' + r + '"');
  }
  if (ce(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ce(e, !0, -1)) : o && U(e, "directives end mark is expected"), fn(e, e.lineIndent - 1, zr, !1, !0), ce(e, !0, -1), e.checkLineBreaks && n0.test(e.input.slice(t, e.position)) && Kr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ui(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ce(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    U(e, "end of the stream or a document separator is expected");
  else
    return;
}
function wu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new l0(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, U(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    E0(n);
  return n.documents;
}
function _0(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = wu(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function v0(e, t) {
  var n = wu(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new fu("expected a single document in the stream, but found more");
  }
}
Ko.loadAll = _0;
Ko.load = v0;
var Tu = {}, di = ze, rr = nr, w0 = Qo, Su = Object.prototype.toString, Cu = Object.prototype.hasOwnProperty, ts = 65279, T0 = 9, Hn = 10, S0 = 13, C0 = 32, A0 = 33, I0 = 34, To = 35, O0 = 37, R0 = 38, b0 = 39, N0 = 42, Au = 44, $0 = 45, Jr = 58, P0 = 61, D0 = 62, F0 = 63, L0 = 64, Iu = 91, Ou = 93, x0 = 96, Ru = 123, k0 = 124, bu = 125, Ae = {};
Ae[0] = "\\0";
Ae[7] = "\\a";
Ae[8] = "\\b";
Ae[9] = "\\t";
Ae[10] = "\\n";
Ae[11] = "\\v";
Ae[12] = "\\f";
Ae[13] = "\\r";
Ae[27] = "\\e";
Ae[34] = '\\"';
Ae[92] = "\\\\";
Ae[133] = "\\N";
Ae[160] = "\\_";
Ae[8232] = "\\L";
Ae[8233] = "\\P";
var U0 = [
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
], M0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function B0(e, t) {
  var n, r, i, o, s, a, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    s = r[i], a = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && Cu.call(l.styleAliases, a) && (a = l.styleAliases[a]), n[s] = a;
  return n;
}
function H0(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new rr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + di.repeat("0", r - t.length) + t;
}
var j0 = 1, jn = 2;
function q0(e) {
  this.schema = e.schema || w0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = di.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = B0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? jn : j0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Oa(e, t) {
  for (var n = di.repeat(" ", t), r = 0, i = -1, o = "", s, a = e.length; r < a; )
    i = e.indexOf(`
`, r), i === -1 ? (s = e.slice(r), r = a) : (s = e.slice(r, i + 1), r = i + 1), s.length && s !== `
` && (o += n), o += s;
  return o;
}
function So(e, t) {
  return `
` + di.repeat(" ", e.indent * t);
}
function G0(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function Qr(e) {
  return e === C0 || e === T0;
}
function qn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== ts || 65536 <= e && e <= 1114111;
}
function Ra(e) {
  return qn(e) && e !== ts && e !== S0 && e !== Hn;
}
function ba(e, t, n) {
  var r = Ra(e), i = r && !Qr(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Au && e !== Iu && e !== Ou && e !== Ru && e !== bu) && e !== To && !(t === Jr && !i) || Ra(t) && !Qr(t) && e === To || t === Jr && i
  );
}
function Y0(e) {
  return qn(e) && e !== ts && !Qr(e) && e !== $0 && e !== F0 && e !== Jr && e !== Au && e !== Iu && e !== Ou && e !== Ru && e !== bu && e !== To && e !== R0 && e !== N0 && e !== A0 && e !== k0 && e !== P0 && e !== D0 && e !== b0 && e !== I0 && e !== O0 && e !== L0 && e !== x0;
}
function X0(e) {
  return !Qr(e) && e !== Jr;
}
function Nn(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Nu(e) {
  var t = /^\n* /;
  return t.test(e);
}
var $u = 1, Co = 2, Pu = 3, Du = 4, Zt = 5;
function V0(e, t, n, r, i, o, s, a) {
  var l, h = 0, c = null, u = !1, f = !1, y = r !== -1, E = -1, g = Y0(Nn(e, 0)) && X0(Nn(e, e.length - 1));
  if (t || s)
    for (l = 0; l < e.length; h >= 65536 ? l += 2 : l++) {
      if (h = Nn(e, l), !qn(h))
        return Zt;
      g = g && ba(h, c, a), c = h;
    }
  else {
    for (l = 0; l < e.length; h >= 65536 ? l += 2 : l++) {
      if (h = Nn(e, l), h === Hn)
        u = !0, y && (f = f || // Foldable line = too long, and not more-indented.
        l - E - 1 > r && e[E + 1] !== " ", E = l);
      else if (!qn(h))
        return Zt;
      g = g && ba(h, c, a), c = h;
    }
    f = f || y && l - E - 1 > r && e[E + 1] !== " ";
  }
  return !u && !f ? g && !s && !i(e) ? $u : o === jn ? Zt : Co : n > 9 && Nu(e) ? Zt : s ? o === jn ? Zt : Co : f ? Du : Pu;
}
function W0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === jn ? '""' : "''";
    if (!e.noCompatMode && (U0.indexOf(t) !== -1 || M0.test(t)))
      return e.quotingType === jn ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(h) {
      return G0(e, h);
    }
    switch (V0(
      t,
      a,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case $u:
        return t;
      case Co:
        return "'" + t.replace(/'/g, "''") + "'";
      case Pu:
        return "|" + Na(t, e.indent) + $a(Oa(t, o));
      case Du:
        return ">" + Na(t, e.indent) + $a(Oa(z0(t, s), o));
      case Zt:
        return '"' + K0(t) + '"';
      default:
        throw new rr("impossible error: invalid scalar style");
    }
  }();
}
function Na(e, t) {
  var n = Nu(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function $a(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function z0(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var h = e.indexOf(`
`);
    return h = h !== -1 ? h : e.length, n.lastIndex = h, Pa(e.slice(0, h), t);
  }(), i = e[0] === `
` || e[0] === " ", o, s; s = n.exec(e); ) {
    var a = s[1], l = s[2];
    o = l[0] === " ", r += a + (!i && !o && l !== "" ? `
` : "") + Pa(l, t), i = o;
  }
  return r;
}
function Pa(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, s = 0, a = 0, l = ""; r = n.exec(e); )
    a = r.index, a - i > t && (o = s > i ? s : a, l += `
` + e.slice(i, o), i = o + 1), s = a;
  return l += `
`, e.length - i > t && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function K0(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = Nn(e, i), r = Ae[n], !r && qn(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || H0(n);
  return t;
}
function J0(e, t, n) {
  var r = "", i = e.tag, o, s, a;
  for (o = 0, s = n.length; o < s; o += 1)
    a = n[o], e.replacer && (a = e.replacer.call(n, String(o), a)), (lt(e, t, a, !1, !1) || typeof a > "u" && lt(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function Da(e, t, n, r) {
  var i = "", o = e.tag, s, a, l;
  for (s = 0, a = n.length; s < a; s += 1)
    l = n[s], e.replacer && (l = e.replacer.call(n, String(s), l)), (lt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && lt(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += So(e, t)), e.dump && Hn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function Q0(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), s, a, l, h, c;
  for (s = 0, a = o.length; s < a; s += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[s], h = n[l], e.replacer && (h = e.replacer.call(n, l, h)), lt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), lt(e, t, h, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function Z0(e, t, n, r) {
  var i = "", o = e.tag, s = Object.keys(n), a, l, h, c, u, f;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new rr("sortKeys must be a boolean or a function");
  for (a = 0, l = s.length; a < l; a += 1)
    f = "", (!r || i !== "") && (f += So(e, t)), h = s[a], c = n[h], e.replacer && (c = e.replacer.call(n, h, c)), lt(e, t + 1, h, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && Hn === e.dump.charCodeAt(0) ? f += "?" : f += "? "), f += e.dump, u && (f += So(e, t)), lt(e, t + 1, c, !0, u) && (e.dump && Hn === e.dump.charCodeAt(0) ? f += ":" : f += ": ", f += e.dump, i += f));
  e.tag = o, e.dump = i || "{}";
}
function Fa(e, t, n) {
  var r, i, o, s, a, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, s = i.length; o < s; o += 1)
    if (a = i[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (n ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (l = e.styleMap[a.tag] || a.defaultStyle, Su.call(a.represent) === "[object Function]")
          r = a.represent(t, l);
        else if (Cu.call(a.represent, l))
          r = a.represent[l](t, l);
        else
          throw new rr("!<" + a.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function lt(e, t, n, r, i, o, s) {
  e.tag = null, e.dump = n, Fa(e, n, !1) || Fa(e, n, !0);
  var a = Su.call(e.dump), l = r, h;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = a === "[object Object]" || a === "[object Array]", u, f;
  if (c && (u = e.duplicates.indexOf(n), f = u !== -1), (e.tag !== null && e.tag !== "?" || f || e.indent !== 2 && t > 0) && (i = !1), f && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (c && f && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), a === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (Z0(e, t, e.dump, i), f && (e.dump = "&ref_" + u + e.dump)) : (Q0(e, t, e.dump), f && (e.dump = "&ref_" + u + " " + e.dump));
    else if (a === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? Da(e, t - 1, e.dump, i) : Da(e, t, e.dump, i), f && (e.dump = "&ref_" + u + e.dump)) : (J0(e, t, e.dump), f && (e.dump = "&ref_" + u + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && W0(e, e.dump, t, o, l);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new rr("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (h = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? h = "!" + h : h.slice(0, 18) === "tag:yaml.org,2002:" ? h = "!!" + h.slice(18) : h = "!<" + h + ">", e.dump = h + " " + e.dump);
  }
  return !0;
}
function ey(e, t) {
  var n = [], r = [], i, o;
  for (Ao(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function Ao(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Ao(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        Ao(e[r[i]], t, n);
}
function ty(e, t) {
  t = t || {};
  var n = new q0(t);
  n.noRefs || ey(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), lt(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
Tu.dump = ty;
var Fu = Ko, ny = Tu;
function ns(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
_e.Type = De;
_e.Schema = Xc;
_e.FAILSAFE_SCHEMA = Kc;
_e.JSON_SCHEMA = nu;
_e.CORE_SCHEMA = ru;
_e.DEFAULT_SCHEMA = Qo;
_e.load = Fu.load;
_e.loadAll = Fu.loadAll;
_e.dump = ny.dump;
_e.YAMLException = nr;
_e.types = {
  binary: lu,
  float: tu,
  map: zc,
  null: Jc,
  pairs: uu,
  set: du,
  timestamp: su,
  bool: Qc,
  int: Zc,
  merge: au,
  omap: cu,
  seq: Wc,
  str: Vc
};
_e.safeLoad = ns("safeLoad", "load");
_e.safeLoadAll = ns("safeLoadAll", "loadAll");
_e.safeDump = ns("safeDump", "dump");
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.Lazy = void 0;
class ry {
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
fi.Lazy = ry;
var Io = { exports: {} };
const iy = "2.0.0", Lu = 256, oy = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, sy = 16, ay = Lu - 6, ly = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var hi = {
  MAX_LENGTH: Lu,
  MAX_SAFE_COMPONENT_LENGTH: sy,
  MAX_SAFE_BUILD_LENGTH: ay,
  MAX_SAFE_INTEGER: oy,
  RELEASE_TYPES: ly,
  SEMVER_SPEC_VERSION: iy,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const cy = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var pi = cy;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = hi, o = pi;
  t = e.exports = {};
  const s = t.re = [], a = t.safeRe = [], l = t.src = [], h = t.safeSrc = [], c = t.t = {};
  let u = 0;
  const f = "[a-zA-Z0-9-]", y = [
    ["\\s", 1],
    ["\\d", i],
    [f, r]
  ], E = (v) => {
    for (const [S, C] of y)
      v = v.split(`${S}*`).join(`${S}{0,${C}}`).split(`${S}+`).join(`${S}{1,${C}}`);
    return v;
  }, g = (v, S, C) => {
    const P = E(S), L = u++;
    o(v, L, S), c[v] = L, l[L] = S, h[L] = P, s[L] = new RegExp(S, C ? "g" : void 0), a[L] = new RegExp(P, C ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${f}*`), g("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${f}+`), g("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), g("FULL", `^${l[c.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), g("LOOSE", `^${l[c.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), g("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), g("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", l[c.COERCE], !0), g("COERCERTLFULL", l[c.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Io, Io.exports);
var ir = Io.exports;
const uy = Object.freeze({ loose: !0 }), dy = Object.freeze({}), fy = (e) => e ? typeof e != "object" ? uy : e : dy;
var rs = fy;
const La = /^[0-9]+$/, xu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = La.test(e), r = La.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, hy = (e, t) => xu(t, e);
var ku = {
  compareIdentifiers: xu,
  rcompareIdentifiers: hy
};
const Ir = pi, { MAX_LENGTH: xa, MAX_SAFE_INTEGER: Or } = hi, { safeRe: Rr, t: br } = ir, py = rs, { compareIdentifiers: zi } = ku;
let my = class et {
  constructor(t, n) {
    if (n = py(n), t instanceof et) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > xa)
      throw new TypeError(
        `version is longer than ${xa} characters`
      );
    Ir("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? Rr[br.LOOSE] : Rr[br.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > Or || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Or || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Or || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < Or)
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
    if (Ir("SemVer.compare", this.version, this.options, t), !(t instanceof et)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new et(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof et || (t = new et(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof et || (t = new et(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (Ir("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return zi(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof et || (t = new et(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (Ir("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return zi(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? Rr[br.PRERELEASELOOSE] : Rr[br.PRERELEASE]);
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
          r === !1 && (o = [n]), zi(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Fe = my;
const ka = Fe, gy = (e, t, n = !1) => {
  if (e instanceof ka)
    return e;
  try {
    return new ka(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var gn = gy;
const yy = gn, Ey = (e, t) => {
  const n = yy(e, t);
  return n ? n.version : null;
};
var _y = Ey;
const vy = gn, wy = (e, t) => {
  const n = vy(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var Ty = wy;
const Ua = Fe, Sy = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new Ua(
      e instanceof Ua ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var Cy = Sy;
const Ma = gn, Ay = (e, t) => {
  const n = Ma(e, null, !0), r = Ma(t, null, !0), i = n.compare(r);
  if (i === 0)
    return null;
  const o = i > 0, s = o ? n : r, a = o ? r : n, l = !!s.prerelease.length;
  if (!!a.prerelease.length && !l) {
    if (!a.patch && !a.minor)
      return "major";
    if (a.compareMain(s) === 0)
      return a.minor && !a.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return n.major !== r.major ? c + "major" : n.minor !== r.minor ? c + "minor" : n.patch !== r.patch ? c + "patch" : "prerelease";
};
var Iy = Ay;
const Oy = Fe, Ry = (e, t) => new Oy(e, t).major;
var by = Ry;
const Ny = Fe, $y = (e, t) => new Ny(e, t).minor;
var Py = $y;
const Dy = Fe, Fy = (e, t) => new Dy(e, t).patch;
var Ly = Fy;
const xy = gn, ky = (e, t) => {
  const n = xy(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var Uy = ky;
const Ba = Fe, My = (e, t, n) => new Ba(e, n).compare(new Ba(t, n));
var Ke = My;
const By = Ke, Hy = (e, t, n) => By(t, e, n);
var jy = Hy;
const qy = Ke, Gy = (e, t) => qy(e, t, !0);
var Yy = Gy;
const Ha = Fe, Xy = (e, t, n) => {
  const r = new Ha(e, n), i = new Ha(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var is = Xy;
const Vy = is, Wy = (e, t) => e.sort((n, r) => Vy(n, r, t));
var zy = Wy;
const Ky = is, Jy = (e, t) => e.sort((n, r) => Ky(r, n, t));
var Qy = Jy;
const Zy = Ke, eE = (e, t, n) => Zy(e, t, n) > 0;
var mi = eE;
const tE = Ke, nE = (e, t, n) => tE(e, t, n) < 0;
var os = nE;
const rE = Ke, iE = (e, t, n) => rE(e, t, n) === 0;
var Uu = iE;
const oE = Ke, sE = (e, t, n) => oE(e, t, n) !== 0;
var Mu = sE;
const aE = Ke, lE = (e, t, n) => aE(e, t, n) >= 0;
var ss = lE;
const cE = Ke, uE = (e, t, n) => cE(e, t, n) <= 0;
var as = uE;
const dE = Uu, fE = Mu, hE = mi, pE = ss, mE = os, gE = as, yE = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return dE(e, n, r);
    case "!=":
      return fE(e, n, r);
    case ">":
      return hE(e, n, r);
    case ">=":
      return pE(e, n, r);
    case "<":
      return mE(e, n, r);
    case "<=":
      return gE(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Bu = yE;
const EE = Fe, _E = gn, { safeRe: Nr, t: $r } = ir, vE = (e, t) => {
  if (e instanceof EE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? Nr[$r.COERCEFULL] : Nr[$r.COERCE]);
  else {
    const l = t.includePrerelease ? Nr[$r.COERCERTLFULL] : Nr[$r.COERCERTL];
    let h;
    for (; (h = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || h.index + h[0].length !== n.index + n[0].length) && (n = h), l.lastIndex = h.index + h[1].length + h[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", s = t.includePrerelease && n[5] ? `-${n[5]}` : "", a = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return _E(`${r}.${i}.${o}${s}${a}`, t);
};
var wE = vE;
class TE {
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
var SE = TE, Ki, ja;
function Je() {
  if (ja) return Ki;
  ja = 1;
  const e = /\s+/g;
  class t {
    constructor(O, D) {
      if (D = i(D), O instanceof t)
        return O.loose === !!D.loose && O.includePrerelease === !!D.includePrerelease ? O : new t(O.raw, D);
      if (O instanceof o)
        return this.raw = O.value, this.set = [[O]], this.formatted = void 0, this;
      if (this.options = D, this.loose = !!D.loose, this.includePrerelease = !!D.includePrerelease, this.raw = O.trim().replace(e, " "), this.set = this.raw.split("||").map((I) => this.parseRange(I.trim())).filter((I) => I.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const I = this.set[0];
        if (this.set = this.set.filter((F) => !g(F[0])), this.set.length === 0)
          this.set = [I];
        else if (this.set.length > 1) {
          for (const F of this.set)
            if (F.length === 1 && v(F[0])) {
              this.set = [F];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let O = 0; O < this.set.length; O++) {
          O > 0 && (this.formatted += "||");
          const D = this.set[O];
          for (let I = 0; I < D.length; I++)
            I > 0 && (this.formatted += " "), this.formatted += D[I].toString().trim();
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
    parseRange(O) {
      const I = ((this.options.includePrerelease && y) | (this.options.loose && E)) + ":" + O, F = r.get(I);
      if (F)
        return F;
      const $ = this.options.loose, H = $ ? l[h.HYPHENRANGELOOSE] : l[h.HYPHENRANGE];
      O = O.replace(H, j(this.options.includePrerelease)), s("hyphen replace", O), O = O.replace(l[h.COMPARATORTRIM], c), s("comparator trim", O), O = O.replace(l[h.TILDETRIM], u), s("tilde trim", O), O = O.replace(l[h.CARETTRIM], f), s("caret trim", O);
      let V = O.split(" ").map((M) => C(M, this.options)).join(" ").split(/\s+/).map((M) => q(M, this.options));
      $ && (V = V.filter((M) => (s("loose invalid filter", M, this.options), !!M.match(l[h.COMPARATORLOOSE])))), s("range list", V);
      const G = /* @__PURE__ */ new Map(), Z = V.map((M) => new o(M, this.options));
      for (const M of Z) {
        if (g(M))
          return [M];
        G.set(M.value, M);
      }
      G.size > 1 && G.has("") && G.delete("");
      const fe = [...G.values()];
      return r.set(I, fe), fe;
    }
    intersects(O, D) {
      if (!(O instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((I) => S(I, D) && O.set.some((F) => S(F, D) && I.every(($) => F.every((H) => $.intersects(H, D)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(O) {
      if (!O)
        return !1;
      if (typeof O == "string")
        try {
          O = new a(O, this.options);
        } catch {
          return !1;
        }
      for (let D = 0; D < this.set.length; D++)
        if (Q(this.set[D], O, this.options))
          return !0;
      return !1;
    }
  }
  Ki = t;
  const n = SE, r = new n(), i = rs, o = gi(), s = pi, a = Fe, {
    safeRe: l,
    t: h,
    comparatorTrimReplace: c,
    tildeTrimReplace: u,
    caretTrimReplace: f
  } = ir, { FLAG_INCLUDE_PRERELEASE: y, FLAG_LOOSE: E } = hi, g = (N) => N.value === "<0.0.0-0", v = (N) => N.value === "", S = (N, O) => {
    let D = !0;
    const I = N.slice();
    let F = I.pop();
    for (; D && I.length; )
      D = I.every(($) => F.intersects($, O)), F = I.pop();
    return D;
  }, C = (N, O) => (N = N.replace(l[h.BUILD], ""), s("comp", N, O), N = le(N, O), s("caret", N), N = L(N, O), s("tildes", N), N = Ue(N, O), s("xrange", N), N = X(N, O), s("stars", N), N), P = (N) => !N || N.toLowerCase() === "x" || N === "*", L = (N, O) => N.trim().split(/\s+/).map((D) => re(D, O)).join(" "), re = (N, O) => {
    const D = O.loose ? l[h.TILDELOOSE] : l[h.TILDE];
    return N.replace(D, (I, F, $, H, V) => {
      s("tilde", N, I, F, $, H, V);
      let G;
      return P(F) ? G = "" : P($) ? G = `>=${F}.0.0 <${+F + 1}.0.0-0` : P(H) ? G = `>=${F}.${$}.0 <${F}.${+$ + 1}.0-0` : V ? (s("replaceTilde pr", V), G = `>=${F}.${$}.${H}-${V} <${F}.${+$ + 1}.0-0`) : G = `>=${F}.${$}.${H} <${F}.${+$ + 1}.0-0`, s("tilde return", G), G;
    });
  }, le = (N, O) => N.trim().split(/\s+/).map((D) => z(D, O)).join(" "), z = (N, O) => {
    s("caret", N, O);
    const D = O.loose ? l[h.CARETLOOSE] : l[h.CARET], I = O.includePrerelease ? "-0" : "";
    return N.replace(D, (F, $, H, V, G) => {
      s("caret", N, F, $, H, V, G);
      let Z;
      return P($) ? Z = "" : P(H) ? Z = `>=${$}.0.0${I} <${+$ + 1}.0.0-0` : P(V) ? $ === "0" ? Z = `>=${$}.${H}.0${I} <${$}.${+H + 1}.0-0` : Z = `>=${$}.${H}.0${I} <${+$ + 1}.0.0-0` : G ? (s("replaceCaret pr", G), $ === "0" ? H === "0" ? Z = `>=${$}.${H}.${V}-${G} <${$}.${H}.${+V + 1}-0` : Z = `>=${$}.${H}.${V}-${G} <${$}.${+H + 1}.0-0` : Z = `>=${$}.${H}.${V}-${G} <${+$ + 1}.0.0-0`) : (s("no pr"), $ === "0" ? H === "0" ? Z = `>=${$}.${H}.${V}${I} <${$}.${H}.${+V + 1}-0` : Z = `>=${$}.${H}.${V}${I} <${$}.${+H + 1}.0-0` : Z = `>=${$}.${H}.${V} <${+$ + 1}.0.0-0`), s("caret return", Z), Z;
    });
  }, Ue = (N, O) => (s("replaceXRanges", N, O), N.split(/\s+/).map((D) => _(D, O)).join(" ")), _ = (N, O) => {
    N = N.trim();
    const D = O.loose ? l[h.XRANGELOOSE] : l[h.XRANGE];
    return N.replace(D, (I, F, $, H, V, G) => {
      s("xRange", N, I, F, $, H, V, G);
      const Z = P($), fe = Z || P(H), M = fe || P(V), Qe = M;
      return F === "=" && Qe && (F = ""), G = O.includePrerelease ? "-0" : "", Z ? F === ">" || F === "<" ? I = "<0.0.0-0" : I = "*" : F && Qe ? (fe && (H = 0), V = 0, F === ">" ? (F = ">=", fe ? ($ = +$ + 1, H = 0, V = 0) : (H = +H + 1, V = 0)) : F === "<=" && (F = "<", fe ? $ = +$ + 1 : H = +H + 1), F === "<" && (G = "-0"), I = `${F + $}.${H}.${V}${G}`) : fe ? I = `>=${$}.0.0${G} <${+$ + 1}.0.0-0` : M && (I = `>=${$}.${H}.0${G} <${$}.${+H + 1}.0-0`), s("xRange return", I), I;
    });
  }, X = (N, O) => (s("replaceStars", N, O), N.trim().replace(l[h.STAR], "")), q = (N, O) => (s("replaceGTE0", N, O), N.trim().replace(l[O.includePrerelease ? h.GTE0PRE : h.GTE0], "")), j = (N) => (O, D, I, F, $, H, V, G, Z, fe, M, Qe) => (P(I) ? D = "" : P(F) ? D = `>=${I}.0.0${N ? "-0" : ""}` : P($) ? D = `>=${I}.${F}.0${N ? "-0" : ""}` : H ? D = `>=${D}` : D = `>=${D}${N ? "-0" : ""}`, P(Z) ? G = "" : P(fe) ? G = `<${+Z + 1}.0.0-0` : P(M) ? G = `<${Z}.${+fe + 1}.0-0` : Qe ? G = `<=${Z}.${fe}.${M}-${Qe}` : N ? G = `<${Z}.${fe}.${+M + 1}-0` : G = `<=${G}`, `${D} ${G}`.trim()), Q = (N, O, D) => {
    for (let I = 0; I < N.length; I++)
      if (!N[I].test(O))
        return !1;
    if (O.prerelease.length && !D.includePrerelease) {
      for (let I = 0; I < N.length; I++)
        if (s(N[I].semver), N[I].semver !== o.ANY && N[I].semver.prerelease.length > 0) {
          const F = N[I].semver;
          if (F.major === O.major && F.minor === O.minor && F.patch === O.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ki;
}
var Ji, qa;
function gi() {
  if (qa) return Ji;
  qa = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, u) {
      if (u = n(u), c instanceof t) {
        if (c.loose === !!u.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), s("comparator", c, u), this.options = u, this.loose = !!u.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(c) {
      const u = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], f = c.match(u);
      if (!f)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = f[1] !== void 0 ? f[1] : "", this.operator === "=" && (this.operator = ""), f[2] ? this.semver = new a(f[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (s("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new a(c, this.options);
        } catch {
          return !1;
        }
      return o(c, this.operator, this.semver, this.options);
    }
    intersects(c, u) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, u).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, u).test(c.semver) : (u = n(u), u.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !u.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, u) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, u) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  Ji = t;
  const n = rs, { safeRe: r, t: i } = ir, o = Bu, s = pi, a = Fe, l = Je();
  return Ji;
}
const CE = Je(), AE = (e, t, n) => {
  try {
    t = new CE(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var yi = AE;
const IE = Je(), OE = (e, t) => new IE(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var RE = OE;
const bE = Fe, NE = Je(), $E = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new NE(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === -1) && (r = s, i = new bE(r, n));
  }), r;
};
var PE = $E;
const DE = Fe, FE = Je(), LE = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new FE(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === 1) && (r = s, i = new DE(r, n));
  }), r;
};
var xE = LE;
const Qi = Fe, kE = Je(), Ga = mi, UE = (e, t) => {
  e = new kE(e, t);
  let n = new Qi("0.0.0");
  if (e.test(n) || (n = new Qi("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((s) => {
      const a = new Qi(s.semver.version);
      switch (s.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!o || Ga(a, o)) && (o = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), o && (!n || Ga(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var ME = UE;
const BE = Je(), HE = (e, t) => {
  try {
    return new BE(e, t).range || "*";
  } catch {
    return null;
  }
};
var jE = HE;
const qE = Fe, Hu = gi(), { ANY: GE } = Hu, YE = Je(), XE = yi, Ya = mi, Xa = os, VE = as, WE = ss, zE = (e, t, n, r) => {
  e = new qE(e, r), t = new YE(t, r);
  let i, o, s, a, l;
  switch (n) {
    case ">":
      i = Ya, o = VE, s = Xa, a = ">", l = ">=";
      break;
    case "<":
      i = Xa, o = WE, s = Ya, a = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (XE(e, t, r))
    return !1;
  for (let h = 0; h < t.set.length; ++h) {
    const c = t.set[h];
    let u = null, f = null;
    if (c.forEach((y) => {
      y.semver === GE && (y = new Hu(">=0.0.0")), u = u || y, f = f || y, i(y.semver, u.semver, r) ? u = y : s(y.semver, f.semver, r) && (f = y);
    }), u.operator === a || u.operator === l || (!f.operator || f.operator === a) && o(e, f.semver))
      return !1;
    if (f.operator === l && s(e, f.semver))
      return !1;
  }
  return !0;
};
var ls = zE;
const KE = ls, JE = (e, t, n) => KE(e, t, ">", n);
var QE = JE;
const ZE = ls, e_ = (e, t, n) => ZE(e, t, "<", n);
var t_ = e_;
const Va = Je(), n_ = (e, t, n) => (e = new Va(e, n), t = new Va(t, n), e.intersects(t, n));
var r_ = n_;
const i_ = yi, o_ = Ke;
var s_ = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const s = e.sort((c, u) => o_(c, u, n));
  for (const c of s)
    i_(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const a = [];
  for (const [c, u] of r)
    c === u ? a.push(c) : !u && c === s[0] ? a.push("*") : u ? c === s[0] ? a.push(`<=${u}`) : a.push(`${c} - ${u}`) : a.push(`>=${c}`);
  const l = a.join(" || "), h = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < h.length ? l : t;
};
const Wa = Je(), cs = gi(), { ANY: Zi } = cs, In = yi, us = Ke, a_ = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new Wa(e, n), t = new Wa(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const s = c_(i, o, n);
      if (r = r || s !== null, s)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, l_ = [new cs(">=0.0.0-0")], za = [new cs(">=0.0.0")], c_ = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Zi) {
    if (t.length === 1 && t[0].semver === Zi)
      return !0;
    n.includePrerelease ? e = l_ : e = za;
  }
  if (t.length === 1 && t[0].semver === Zi) {
    if (n.includePrerelease)
      return !0;
    t = za;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const y of e)
    y.operator === ">" || y.operator === ">=" ? i = Ka(i, y, n) : y.operator === "<" || y.operator === "<=" ? o = Ja(o, y, n) : r.add(y.semver);
  if (r.size > 1)
    return null;
  let s;
  if (i && o) {
    if (s = us(i.semver, o.semver, n), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const y of r) {
    if (i && !In(y, String(i), n) || o && !In(y, String(o), n))
      return null;
    for (const E of t)
      if (!In(y, String(E), n))
        return !1;
    return !0;
  }
  let a, l, h, c, u = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, f = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && o.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const y of t) {
    if (c = c || y.operator === ">" || y.operator === ">=", h = h || y.operator === "<" || y.operator === "<=", i) {
      if (f && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === f.major && y.semver.minor === f.minor && y.semver.patch === f.patch && (f = !1), y.operator === ">" || y.operator === ">=") {
        if (a = Ka(i, y, n), a === y && a !== i)
          return !1;
      } else if (i.operator === ">=" && !In(i.semver, String(y), n))
        return !1;
    }
    if (o) {
      if (u && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === u.major && y.semver.minor === u.minor && y.semver.patch === u.patch && (u = !1), y.operator === "<" || y.operator === "<=") {
        if (l = Ja(o, y, n), l === y && l !== o)
          return !1;
      } else if (o.operator === "<=" && !In(o.semver, String(y), n))
        return !1;
    }
    if (!y.operator && (o || i) && s !== 0)
      return !1;
  }
  return !(i && h && !o && s !== 0 || o && c && !i && s !== 0 || f || u);
}, Ka = (e, t, n) => {
  if (!e)
    return t;
  const r = us(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Ja = (e, t, n) => {
  if (!e)
    return t;
  const r = us(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var u_ = a_;
const eo = ir, Qa = hi, d_ = Fe, Za = ku, f_ = gn, h_ = _y, p_ = Ty, m_ = Cy, g_ = Iy, y_ = by, E_ = Py, __ = Ly, v_ = Uy, w_ = Ke, T_ = jy, S_ = Yy, C_ = is, A_ = zy, I_ = Qy, O_ = mi, R_ = os, b_ = Uu, N_ = Mu, $_ = ss, P_ = as, D_ = Bu, F_ = wE, L_ = gi(), x_ = Je(), k_ = yi, U_ = RE, M_ = PE, B_ = xE, H_ = ME, j_ = jE, q_ = ls, G_ = QE, Y_ = t_, X_ = r_, V_ = s_, W_ = u_;
var ju = {
  parse: f_,
  valid: h_,
  clean: p_,
  inc: m_,
  diff: g_,
  major: y_,
  minor: E_,
  patch: __,
  prerelease: v_,
  compare: w_,
  rcompare: T_,
  compareLoose: S_,
  compareBuild: C_,
  sort: A_,
  rsort: I_,
  gt: O_,
  lt: R_,
  eq: b_,
  neq: N_,
  gte: $_,
  lte: P_,
  cmp: D_,
  coerce: F_,
  Comparator: L_,
  Range: x_,
  satisfies: k_,
  toComparators: U_,
  maxSatisfying: M_,
  minSatisfying: B_,
  minVersion: H_,
  validRange: j_,
  outside: q_,
  gtr: G_,
  ltr: Y_,
  intersects: X_,
  simplifyRange: V_,
  subset: W_,
  SemVer: d_,
  re: eo.re,
  src: eo.src,
  tokens: eo.t,
  SEMVER_SPEC_VERSION: Qa.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Qa.RELEASE_TYPES,
  compareIdentifiers: Za.compareIdentifiers,
  rcompareIdentifiers: Za.rcompareIdentifiers
}, or = {}, Zr = { exports: {} };
Zr.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, s = 9007199254740991, a = "[object Arguments]", l = "[object Array]", h = "[object AsyncFunction]", c = "[object Boolean]", u = "[object Date]", f = "[object Error]", y = "[object Function]", E = "[object GeneratorFunction]", g = "[object Map]", v = "[object Number]", S = "[object Null]", C = "[object Object]", P = "[object Promise]", L = "[object Proxy]", re = "[object RegExp]", le = "[object Set]", z = "[object String]", Ue = "[object Symbol]", _ = "[object Undefined]", X = "[object WeakMap]", q = "[object ArrayBuffer]", j = "[object DataView]", Q = "[object Float32Array]", N = "[object Float64Array]", O = "[object Int8Array]", D = "[object Int16Array]", I = "[object Int32Array]", F = "[object Uint8Array]", $ = "[object Uint8ClampedArray]", H = "[object Uint16Array]", V = "[object Uint32Array]", G = /[\\^$.*+?()[\]{}|]/g, Z = /^\[object .+?Constructor\]$/, fe = /^(?:0|[1-9]\d*)$/, M = {};
  M[Q] = M[N] = M[O] = M[D] = M[I] = M[F] = M[$] = M[H] = M[V] = !0, M[a] = M[l] = M[q] = M[c] = M[j] = M[u] = M[f] = M[y] = M[g] = M[v] = M[C] = M[re] = M[le] = M[z] = M[X] = !1;
  var Qe = typeof Re == "object" && Re && Re.Object === Object && Re, p = typeof self == "object" && self && self.Object === Object && self, d = Qe || p || Function("return this")(), A = t && !t.nodeType && t, T = A && !0 && e && !e.nodeType && e, K = T && T.exports === A, te = K && Qe.process, se = function() {
    try {
      return te && te.binding && te.binding("util");
    } catch {
    }
  }(), ge = se && se.isTypedArray;
  function ve(m, w) {
    for (var R = -1, x = m == null ? 0 : m.length, ne = 0, Y = []; ++R < x; ) {
      var ae = m[R];
      w(ae, R, m) && (Y[ne++] = ae);
    }
    return Y;
  }
  function ut(m, w) {
    for (var R = -1, x = w.length, ne = m.length; ++R < x; )
      m[ne + R] = w[R];
    return m;
  }
  function ue(m, w) {
    for (var R = -1, x = m == null ? 0 : m.length; ++R < x; )
      if (w(m[R], R, m))
        return !0;
    return !1;
  }
  function Xe(m, w) {
    for (var R = -1, x = Array(m); ++R < m; )
      x[R] = w(R);
    return x;
  }
  function Ri(m) {
    return function(w) {
      return m(w);
    };
  }
  function ur(m, w) {
    return m.has(w);
  }
  function _n(m, w) {
    return m == null ? void 0 : m[w];
  }
  function dr(m) {
    var w = -1, R = Array(m.size);
    return m.forEach(function(x, ne) {
      R[++w] = [ne, x];
    }), R;
  }
  function yd(m, w) {
    return function(R) {
      return m(w(R));
    };
  }
  function Ed(m) {
    var w = -1, R = Array(m.size);
    return m.forEach(function(x) {
      R[++w] = x;
    }), R;
  }
  var _d = Array.prototype, vd = Function.prototype, fr = Object.prototype, bi = d["__core-js_shared__"], Cs = vd.toString, Ze = fr.hasOwnProperty, As = function() {
    var m = /[^.]+$/.exec(bi && bi.keys && bi.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), Is = fr.toString, wd = RegExp(
    "^" + Cs.call(Ze).replace(G, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Os = K ? d.Buffer : void 0, hr = d.Symbol, Rs = d.Uint8Array, bs = fr.propertyIsEnumerable, Td = _d.splice, Rt = hr ? hr.toStringTag : void 0, Ns = Object.getOwnPropertySymbols, Sd = Os ? Os.isBuffer : void 0, Cd = yd(Object.keys, Object), Ni = Xt(d, "DataView"), vn = Xt(d, "Map"), $i = Xt(d, "Promise"), Pi = Xt(d, "Set"), Di = Xt(d, "WeakMap"), wn = Xt(Object, "create"), Ad = $t(Ni), Id = $t(vn), Od = $t($i), Rd = $t(Pi), bd = $t(Di), $s = hr ? hr.prototype : void 0, Fi = $s ? $s.valueOf : void 0;
  function bt(m) {
    var w = -1, R = m == null ? 0 : m.length;
    for (this.clear(); ++w < R; ) {
      var x = m[w];
      this.set(x[0], x[1]);
    }
  }
  function Nd() {
    this.__data__ = wn ? wn(null) : {}, this.size = 0;
  }
  function $d(m) {
    var w = this.has(m) && delete this.__data__[m];
    return this.size -= w ? 1 : 0, w;
  }
  function Pd(m) {
    var w = this.__data__;
    if (wn) {
      var R = w[m];
      return R === r ? void 0 : R;
    }
    return Ze.call(w, m) ? w[m] : void 0;
  }
  function Dd(m) {
    var w = this.__data__;
    return wn ? w[m] !== void 0 : Ze.call(w, m);
  }
  function Fd(m, w) {
    var R = this.__data__;
    return this.size += this.has(m) ? 0 : 1, R[m] = wn && w === void 0 ? r : w, this;
  }
  bt.prototype.clear = Nd, bt.prototype.delete = $d, bt.prototype.get = Pd, bt.prototype.has = Dd, bt.prototype.set = Fd;
  function rt(m) {
    var w = -1, R = m == null ? 0 : m.length;
    for (this.clear(); ++w < R; ) {
      var x = m[w];
      this.set(x[0], x[1]);
    }
  }
  function Ld() {
    this.__data__ = [], this.size = 0;
  }
  function xd(m) {
    var w = this.__data__, R = mr(w, m);
    if (R < 0)
      return !1;
    var x = w.length - 1;
    return R == x ? w.pop() : Td.call(w, R, 1), --this.size, !0;
  }
  function kd(m) {
    var w = this.__data__, R = mr(w, m);
    return R < 0 ? void 0 : w[R][1];
  }
  function Ud(m) {
    return mr(this.__data__, m) > -1;
  }
  function Md(m, w) {
    var R = this.__data__, x = mr(R, m);
    return x < 0 ? (++this.size, R.push([m, w])) : R[x][1] = w, this;
  }
  rt.prototype.clear = Ld, rt.prototype.delete = xd, rt.prototype.get = kd, rt.prototype.has = Ud, rt.prototype.set = Md;
  function Nt(m) {
    var w = -1, R = m == null ? 0 : m.length;
    for (this.clear(); ++w < R; ) {
      var x = m[w];
      this.set(x[0], x[1]);
    }
  }
  function Bd() {
    this.size = 0, this.__data__ = {
      hash: new bt(),
      map: new (vn || rt)(),
      string: new bt()
    };
  }
  function Hd(m) {
    var w = gr(this, m).delete(m);
    return this.size -= w ? 1 : 0, w;
  }
  function jd(m) {
    return gr(this, m).get(m);
  }
  function qd(m) {
    return gr(this, m).has(m);
  }
  function Gd(m, w) {
    var R = gr(this, m), x = R.size;
    return R.set(m, w), this.size += R.size == x ? 0 : 1, this;
  }
  Nt.prototype.clear = Bd, Nt.prototype.delete = Hd, Nt.prototype.get = jd, Nt.prototype.has = qd, Nt.prototype.set = Gd;
  function pr(m) {
    var w = -1, R = m == null ? 0 : m.length;
    for (this.__data__ = new Nt(); ++w < R; )
      this.add(m[w]);
  }
  function Yd(m) {
    return this.__data__.set(m, r), this;
  }
  function Xd(m) {
    return this.__data__.has(m);
  }
  pr.prototype.add = pr.prototype.push = Yd, pr.prototype.has = Xd;
  function dt(m) {
    var w = this.__data__ = new rt(m);
    this.size = w.size;
  }
  function Vd() {
    this.__data__ = new rt(), this.size = 0;
  }
  function Wd(m) {
    var w = this.__data__, R = w.delete(m);
    return this.size = w.size, R;
  }
  function zd(m) {
    return this.__data__.get(m);
  }
  function Kd(m) {
    return this.__data__.has(m);
  }
  function Jd(m, w) {
    var R = this.__data__;
    if (R instanceof rt) {
      var x = R.__data__;
      if (!vn || x.length < n - 1)
        return x.push([m, w]), this.size = ++R.size, this;
      R = this.__data__ = new Nt(x);
    }
    return R.set(m, w), this.size = R.size, this;
  }
  dt.prototype.clear = Vd, dt.prototype.delete = Wd, dt.prototype.get = zd, dt.prototype.has = Kd, dt.prototype.set = Jd;
  function Qd(m, w) {
    var R = yr(m), x = !R && pf(m), ne = !R && !x && Li(m), Y = !R && !x && !ne && Bs(m), ae = R || x || ne || Y, he = ae ? Xe(m.length, String) : [], ye = he.length;
    for (var ie in m)
      Ze.call(m, ie) && !(ae && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ne && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      Y && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      cf(ie, ye))) && he.push(ie);
    return he;
  }
  function mr(m, w) {
    for (var R = m.length; R--; )
      if (xs(m[R][0], w))
        return R;
    return -1;
  }
  function Zd(m, w, R) {
    var x = w(m);
    return yr(m) ? x : ut(x, R(m));
  }
  function Tn(m) {
    return m == null ? m === void 0 ? _ : S : Rt && Rt in Object(m) ? af(m) : hf(m);
  }
  function Ps(m) {
    return Sn(m) && Tn(m) == a;
  }
  function Ds(m, w, R, x, ne) {
    return m === w ? !0 : m == null || w == null || !Sn(m) && !Sn(w) ? m !== m && w !== w : ef(m, w, R, x, Ds, ne);
  }
  function ef(m, w, R, x, ne, Y) {
    var ae = yr(m), he = yr(w), ye = ae ? l : ft(m), ie = he ? l : ft(w);
    ye = ye == a ? C : ye, ie = ie == a ? C : ie;
    var Me = ye == C, Ve = ie == C, we = ye == ie;
    if (we && Li(m)) {
      if (!Li(w))
        return !1;
      ae = !0, Me = !1;
    }
    if (we && !Me)
      return Y || (Y = new dt()), ae || Bs(m) ? Fs(m, w, R, x, ne, Y) : of(m, w, ye, R, x, ne, Y);
    if (!(R & i)) {
      var He = Me && Ze.call(m, "__wrapped__"), je = Ve && Ze.call(w, "__wrapped__");
      if (He || je) {
        var ht = He ? m.value() : m, it = je ? w.value() : w;
        return Y || (Y = new dt()), ne(ht, it, R, x, Y);
      }
    }
    return we ? (Y || (Y = new dt()), sf(m, w, R, x, ne, Y)) : !1;
  }
  function tf(m) {
    if (!Ms(m) || df(m))
      return !1;
    var w = ks(m) ? wd : Z;
    return w.test($t(m));
  }
  function nf(m) {
    return Sn(m) && Us(m.length) && !!M[Tn(m)];
  }
  function rf(m) {
    if (!ff(m))
      return Cd(m);
    var w = [];
    for (var R in Object(m))
      Ze.call(m, R) && R != "constructor" && w.push(R);
    return w;
  }
  function Fs(m, w, R, x, ne, Y) {
    var ae = R & i, he = m.length, ye = w.length;
    if (he != ye && !(ae && ye > he))
      return !1;
    var ie = Y.get(m);
    if (ie && Y.get(w))
      return ie == w;
    var Me = -1, Ve = !0, we = R & o ? new pr() : void 0;
    for (Y.set(m, w), Y.set(w, m); ++Me < he; ) {
      var He = m[Me], je = w[Me];
      if (x)
        var ht = ae ? x(je, He, Me, w, m, Y) : x(He, je, Me, m, w, Y);
      if (ht !== void 0) {
        if (ht)
          continue;
        Ve = !1;
        break;
      }
      if (we) {
        if (!ue(w, function(it, Pt) {
          if (!ur(we, Pt) && (He === it || ne(He, it, R, x, Y)))
            return we.push(Pt);
        })) {
          Ve = !1;
          break;
        }
      } else if (!(He === je || ne(He, je, R, x, Y))) {
        Ve = !1;
        break;
      }
    }
    return Y.delete(m), Y.delete(w), Ve;
  }
  function of(m, w, R, x, ne, Y, ae) {
    switch (R) {
      case j:
        if (m.byteLength != w.byteLength || m.byteOffset != w.byteOffset)
          return !1;
        m = m.buffer, w = w.buffer;
      case q:
        return !(m.byteLength != w.byteLength || !Y(new Rs(m), new Rs(w)));
      case c:
      case u:
      case v:
        return xs(+m, +w);
      case f:
        return m.name == w.name && m.message == w.message;
      case re:
      case z:
        return m == w + "";
      case g:
        var he = dr;
      case le:
        var ye = x & i;
        if (he || (he = Ed), m.size != w.size && !ye)
          return !1;
        var ie = ae.get(m);
        if (ie)
          return ie == w;
        x |= o, ae.set(m, w);
        var Me = Fs(he(m), he(w), x, ne, Y, ae);
        return ae.delete(m), Me;
      case Ue:
        if (Fi)
          return Fi.call(m) == Fi.call(w);
    }
    return !1;
  }
  function sf(m, w, R, x, ne, Y) {
    var ae = R & i, he = Ls(m), ye = he.length, ie = Ls(w), Me = ie.length;
    if (ye != Me && !ae)
      return !1;
    for (var Ve = ye; Ve--; ) {
      var we = he[Ve];
      if (!(ae ? we in w : Ze.call(w, we)))
        return !1;
    }
    var He = Y.get(m);
    if (He && Y.get(w))
      return He == w;
    var je = !0;
    Y.set(m, w), Y.set(w, m);
    for (var ht = ae; ++Ve < ye; ) {
      we = he[Ve];
      var it = m[we], Pt = w[we];
      if (x)
        var Hs = ae ? x(Pt, it, we, w, m, Y) : x(it, Pt, we, m, w, Y);
      if (!(Hs === void 0 ? it === Pt || ne(it, Pt, R, x, Y) : Hs)) {
        je = !1;
        break;
      }
      ht || (ht = we == "constructor");
    }
    if (je && !ht) {
      var Er = m.constructor, _r = w.constructor;
      Er != _r && "constructor" in m && "constructor" in w && !(typeof Er == "function" && Er instanceof Er && typeof _r == "function" && _r instanceof _r) && (je = !1);
    }
    return Y.delete(m), Y.delete(w), je;
  }
  function Ls(m) {
    return Zd(m, yf, lf);
  }
  function gr(m, w) {
    var R = m.__data__;
    return uf(w) ? R[typeof w == "string" ? "string" : "hash"] : R.map;
  }
  function Xt(m, w) {
    var R = _n(m, w);
    return tf(R) ? R : void 0;
  }
  function af(m) {
    var w = Ze.call(m, Rt), R = m[Rt];
    try {
      m[Rt] = void 0;
      var x = !0;
    } catch {
    }
    var ne = Is.call(m);
    return x && (w ? m[Rt] = R : delete m[Rt]), ne;
  }
  var lf = Ns ? function(m) {
    return m == null ? [] : (m = Object(m), ve(Ns(m), function(w) {
      return bs.call(m, w);
    }));
  } : Ef, ft = Tn;
  (Ni && ft(new Ni(new ArrayBuffer(1))) != j || vn && ft(new vn()) != g || $i && ft($i.resolve()) != P || Pi && ft(new Pi()) != le || Di && ft(new Di()) != X) && (ft = function(m) {
    var w = Tn(m), R = w == C ? m.constructor : void 0, x = R ? $t(R) : "";
    if (x)
      switch (x) {
        case Ad:
          return j;
        case Id:
          return g;
        case Od:
          return P;
        case Rd:
          return le;
        case bd:
          return X;
      }
    return w;
  });
  function cf(m, w) {
    return w = w ?? s, !!w && (typeof m == "number" || fe.test(m)) && m > -1 && m % 1 == 0 && m < w;
  }
  function uf(m) {
    var w = typeof m;
    return w == "string" || w == "number" || w == "symbol" || w == "boolean" ? m !== "__proto__" : m === null;
  }
  function df(m) {
    return !!As && As in m;
  }
  function ff(m) {
    var w = m && m.constructor, R = typeof w == "function" && w.prototype || fr;
    return m === R;
  }
  function hf(m) {
    return Is.call(m);
  }
  function $t(m) {
    if (m != null) {
      try {
        return Cs.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function xs(m, w) {
    return m === w || m !== m && w !== w;
  }
  var pf = Ps(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Ps : function(m) {
    return Sn(m) && Ze.call(m, "callee") && !bs.call(m, "callee");
  }, yr = Array.isArray;
  function mf(m) {
    return m != null && Us(m.length) && !ks(m);
  }
  var Li = Sd || _f;
  function gf(m, w) {
    return Ds(m, w);
  }
  function ks(m) {
    if (!Ms(m))
      return !1;
    var w = Tn(m);
    return w == y || w == E || w == h || w == L;
  }
  function Us(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= s;
  }
  function Ms(m) {
    var w = typeof m;
    return m != null && (w == "object" || w == "function");
  }
  function Sn(m) {
    return m != null && typeof m == "object";
  }
  var Bs = ge ? Ri(ge) : nf;
  function yf(m) {
    return mf(m) ? Qd(m) : rf(m);
  }
  function Ef() {
    return [];
  }
  function _f() {
    return !1;
  }
  e.exports = gf;
})(Zr, Zr.exports);
var z_ = Zr.exports;
Object.defineProperty(or, "__esModule", { value: !0 });
or.DownloadedUpdateHelper = void 0;
or.createTempUpdateFile = ev;
const K_ = Qn, J_ = Be, el = z_, Lt = It, Fn = J;
class Q_ {
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
    return Fn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return el(this.versionInfo, n) && el(this.fileInfo.info, r.info) && await (0, Lt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, s) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, Lt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Lt.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, Lt.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, Lt.readJson)(r);
    } catch (h) {
      let c = "No cached update info available";
      return h.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${h.message})`), n.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = Fn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Lt.pathExists)(a))
      return n.info("Cached update file doesn't exist"), null;
    const l = await Z_(a);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, a);
  }
  getUpdateInfoFile() {
    return Fn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
or.DownloadedUpdateHelper = Q_;
function Z_(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const s = (0, K_.createHash)(t);
    s.on("error", o).setEncoding(n), (0, J_.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function ev(e, t, n) {
  let r = 0, i = Fn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Lt.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${s}`), i = Fn.join(t, `${r++}-${e}`);
    }
  return i;
}
var Ei = {}, ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
ds.getAppCacheDir = nv;
const to = J, tv = ri;
function nv() {
  const e = (0, tv.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || to.join(e, "AppData", "Local") : process.platform === "darwin" ? t = to.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || to.join(e, ".cache"), t;
}
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.ElectronAppAdapter = void 0;
const tl = J, rv = ds;
class iv {
  constructor(t = Ht.app) {
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
    return this.isPackaged ? tl.join(process.resourcesPath, "app-update.yml") : tl.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, rv.getAppCacheDir)();
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
Ei.ElectronAppAdapter = iv;
var qu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = me;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Ht.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, s, a) {
      return await a.cancellationToken.createPromise((l, h, c) => {
        const u = {
          headers: a.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, u), (0, t.configureRequestOptions)(u), this.doDownload(u, {
          destination: s,
          options: a,
          onCancel: c,
          callback: (f) => {
            f == null ? l(s) : h(f);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, s) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const a = Ht.net.request({
        ...o,
        session: this.cachedSession
      });
      return a.on("response", s), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
    }
    addRedirectHandlers(o, s, a, l, h) {
      o.on("redirect", (c, u, f) => {
        o.abort(), l > this.maxRedirects ? a(this.createMaxRedirectError()) : h(t.HttpExecutor.prepareRedirectUrlOptions(f, s));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(qu);
var sr = {}, Ye = {}, ov = "[object Symbol]", Gu = /[\\^$.*+?()[\]{}|]/g, sv = RegExp(Gu.source), av = typeof Re == "object" && Re && Re.Object === Object && Re, lv = typeof self == "object" && self && self.Object === Object && self, cv = av || lv || Function("return this")(), uv = Object.prototype, dv = uv.toString, nl = cv.Symbol, rl = nl ? nl.prototype : void 0, il = rl ? rl.toString : void 0;
function fv(e) {
  if (typeof e == "string")
    return e;
  if (pv(e))
    return il ? il.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function hv(e) {
  return !!e && typeof e == "object";
}
function pv(e) {
  return typeof e == "symbol" || hv(e) && dv.call(e) == ov;
}
function mv(e) {
  return e == null ? "" : fv(e);
}
function gv(e) {
  return e = mv(e), e && sv.test(e) ? e.replace(Gu, "\\$&") : e;
}
var yv = gv;
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.newBaseUrl = _v;
Ye.newUrlFromBase = Oo;
Ye.getChannelFilename = vv;
Ye.blockmapFiles = wv;
const Yu = hn, Ev = yv;
function _v(e) {
  const t = new Yu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Oo(e, t, n = !1) {
  const r = new Yu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function vv(e) {
  return `${e}.yml`;
}
function wv(e, t, n) {
  const r = Oo(`${e.pathname}.blockmap`, e);
  return [Oo(`${e.pathname.replace(new RegExp(Ev(n), "g"), t)}.blockmap`, e), r];
}
var de = {};
Object.defineProperty(de, "__esModule", { value: !0 });
de.Provider = void 0;
de.findFile = Cv;
de.parseUpdateInfo = Av;
de.getFileList = Xu;
de.resolveFiles = Iv;
const Ct = me, Tv = _e, ol = Ye;
class Sv {
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
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, Ct.configureRequestUrl)(t, r), r;
  }
}
de.Provider = Sv;
function Cv(e, t, n) {
  if (e.length === 0)
    throw (0, Ct.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const r = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return r ?? (n == null ? e[0] : e.find((i) => !n.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function Av(e, t, n) {
  if (e == null)
    throw (0, Ct.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, Tv.load)(e);
  } catch (i) {
    throw (0, Ct.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function Xu(e) {
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
  throw (0, Ct.newError)(`No files provided: ${(0, Ct.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Iv(e, t, n = (r) => r) {
  const i = Xu(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, Ct.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Ct.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, ol.newUrlFromBase)(n(a.url), t),
      info: a
    };
  }), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, ol.newUrlFromBase)(n(s.path), t).href
  }), i;
}
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.GenericProvider = void 0;
const sl = me, no = Ye, ro = de;
class Ov extends ro.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, no.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, no.getChannelFilename)(this.channel), n = (0, no.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, ro.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof sl.HttpError && i.statusCode === 404)
          throw (0, sl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && r < 3) {
          await new Promise((o, s) => {
            try {
              setTimeout(o, 1e3 * r);
            } catch (a) {
              s(a);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, ro.resolveFiles)(t, this.baseUrl);
  }
}
sr.GenericProvider = Ov;
var _i = {}, vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.BitbucketProvider = void 0;
const al = me, io = Ye, oo = de;
class Rv extends oo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, io.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new al.CancellationToken(), n = (0, io.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, io.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, oo.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, al.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, oo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
vi.BitbucketProvider = Rv;
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.GitHubProvider = At.BaseGitHubProvider = void 0;
At.computeReleaseNotes = Wu;
const at = me, nn = ju, bv = hn, rn = Ye, Ro = de, so = /\/tag\/([^/]+)$/;
class Vu extends Ro.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, rn.newBaseUrl)((0, at.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, rn.newBaseUrl)((0, at.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
At.BaseGitHubProvider = Vu;
class Nv extends Vu {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const s = new at.CancellationToken(), a = await this.httpRequest((0, rn.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), l = (0, at.parseXml)(a);
    let h = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const v = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = nn.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (v === null)
          c = so.exec(h.element("link").attribute("href"))[1];
        else
          for (const S of l.getElements("entry")) {
            const C = so.exec(S.element("link").attribute("href"));
            if (C === null)
              continue;
            const P = C[1], L = ((r = nn.prerelease(P)) === null || r === void 0 ? void 0 : r[0]) || null, re = !v || ["alpha", "beta"].includes(v), le = L !== null && !["alpha", "beta"].includes(String(L));
            if (re && !le && !(v === "beta" && L === "alpha")) {
              c = P;
              break;
            }
            if (L && L === v) {
              c = P;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(s);
        for (const v of l.getElements("entry"))
          if (so.exec(v.element("link").attribute("href"))[1] === c) {
            h = v;
            break;
          }
      }
    } catch (v) {
      throw (0, at.newError)(`Cannot parse releases feed: ${v.stack || v.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, at.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let u, f = "", y = "";
    const E = async (v) => {
      f = (0, rn.getChannelFilename)(v), y = (0, rn.newUrlFromBase)(this.getBaseDownloadPath(String(c), f), this.baseUrl);
      const S = this.createRequestOptions(y);
      try {
        return await this.executor.request(S, s);
      } catch (C) {
        throw C instanceof at.HttpError && C.statusCode === 404 ? (0, at.newError)(`Cannot find ${f} in the latest release artifacts (${y}): ${C.stack || C.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : C;
      }
    };
    try {
      let v = this.channel;
      this.updater.allowPrerelease && (!((i = nn.prerelease(c)) === null || i === void 0) && i[0]) && (v = this.getCustomChannelName(String((o = nn.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), u = await E(v);
    } catch (v) {
      if (this.updater.allowPrerelease)
        u = await E(this.getDefaultChannelName());
      else
        throw v;
    }
    const g = (0, Ro.parseUpdateInfo)(u, f, y);
    return g.releaseName == null && (g.releaseName = h.elementValueOrEmpty("title")), g.releaseNotes == null && (g.releaseNotes = Wu(this.updater.currentVersion, this.updater.fullChangelog, l, h)), {
      tag: c,
      ...g
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, rn.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new bv.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, at.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Ro.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
At.GitHubProvider = Nv;
function ll(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Wu(e, t, n, r) {
  if (!t)
    return ll(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    nn.lt(e, s) && i.push({
      version: s,
      note: ll(o)
    });
  }
  return i.sort((o, s) => nn.rcompare(o.version, s.version));
}
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.KeygenProvider = void 0;
const cl = me, ao = Ye, lo = de;
class $v extends lo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, ao.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new cl.CancellationToken(), n = (0, ao.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, ao.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, lo.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, cl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, lo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
wi.KeygenProvider = $v;
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.PrivateGitHubProvider = void 0;
const zt = me, Pv = _e, Dv = J, ul = hn, dl = Ye, Fv = At, Lv = de;
class xv extends Fv.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new zt.CancellationToken(), n = (0, dl.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((a) => a.name === n);
    if (i == null)
      throw (0, zt.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new ul.URL(i.url);
    let s;
    try {
      s = (0, Pv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof zt.HttpError && a.statusCode === 404 ? (0, zt.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
    }
    return s.assets = r.assets, s;
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
    const i = (0, dl.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((s) => s.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, zt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Lv.getFileList)(t).map((n) => {
      const r = Dv.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, zt.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ul.URL(i.url),
        info: n
      };
    });
  }
}
Ti.PrivateGitHubProvider = xv;
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.isUrlProbablySupportMultiRangeRequests = zu;
_i.createClient = Hv;
const Pr = me, kv = vi, fl = sr, Uv = At, Mv = wi, Bv = Ti;
function zu(e) {
  return !e.includes("s3.amazonaws.com");
}
function Hv(e, t, n) {
  if (typeof e == "string")
    throw (0, Pr.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Uv.GitHubProvider(i, t, n) : new Bv.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new kv.BitbucketProvider(e, t, n);
    case "keygen":
      return new Mv.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new fl.GenericProvider({
        provider: "generic",
        url: (0, Pr.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new fl.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && zu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Pr.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, Pr.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Si = {}, ar = {}, yn = {}, Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.OperationKind = void 0;
Yt.computeOperations = jv;
var Ut;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Ut || (Yt.OperationKind = Ut = {}));
function jv(e, t, n) {
  const r = pl(e.files), i = pl(t.files);
  let o = null;
  const s = t.files[0], a = [], l = s.name, h = r.get(l);
  if (h == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let u = 0;
  const { checksumToOffset: f, checksumToOldSize: y } = Gv(r.get(l), h.offset, n);
  let E = s.offset;
  for (let g = 0; g < c.checksums.length; E += c.sizes[g], g++) {
    const v = c.sizes[g], S = c.checksums[g];
    let C = f.get(S);
    C != null && y.get(S) !== v && (n.warn(`Checksum ("${S}") matches, but size differs (old: ${y.get(S)}, new: ${v})`), C = void 0), C === void 0 ? (u++, o != null && o.kind === Ut.DOWNLOAD && o.end === E ? o.end += v : (o = {
      kind: Ut.DOWNLOAD,
      start: E,
      end: E + v
      // oldBlocks: null,
    }, hl(o, a, S, g))) : o != null && o.kind === Ut.COPY && o.end === C ? o.end += v : (o = {
      kind: Ut.COPY,
      start: C,
      end: C + v
      // oldBlocks: [checksum]
    }, hl(o, a, S, g));
  }
  return u > 0 && n.info(`File${s.name === "file" ? "" : " " + s.name} has ${u} changed blocks`), a;
}
const qv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function hl(e, t, n, r) {
  if (qv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((s, a) => s < a ? s : a);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${Ut[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function Gv(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const a = e.checksums[s], l = e.sizes[s], h = i.get(a);
    if (h === void 0)
      r.set(a, o), i.set(a, l);
    else if (n.debug != null) {
      const c = h === l ? "(same size)" : `(size: ${h}, this size: ${l})`;
      n.debug(`${a} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function pl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.DataSplitter = void 0;
yn.copyData = Ku;
const Dr = me, Yv = Be, Xv = Jn, Vv = Yt, ml = Buffer.from(`\r
\r
`);
var gt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(gt || (gt = {}));
function Ku(e, t, n, r, i) {
  const o = (0, Yv.createReadStream)("", {
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
class Wv extends Xv.Writable {
  constructor(t, n, r, i, o, s) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = s, this.partIndex = -1, this.headerListBuffer = null, this.readState = gt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, Dr.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === gt.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = gt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === gt.BODY)
          this.readState = gt.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Dr.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < s)
            await this.copyExistingData(a, s);
          else if (a > s)
            throw (0, Dr.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = gt.HEADER;
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
        const s = this.options.tasks[t];
        if (s.kind !== Vv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Ku(s, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(ml, n);
    if (r !== -1)
      return r + ml.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Dr.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, n, r) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, n, r);
  }
  processPartData(t, n, r) {
    this.actualPartLength += r - n;
    const i = this.out;
    return i.write(n === 0 && t.length === r ? t : t.slice(n, r)) ? Promise.resolve() : new Promise((o, s) => {
      i.on("error", s), i.once("drain", () => {
        i.removeListener("error", s), o();
      });
    });
  }
}
yn.DataSplitter = Wv;
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.executeTasksUsingMultipleRangeRequests = zv;
Ci.checkIsRangesSupported = No;
const bo = me, gl = yn, yl = Yt;
function zv(e, t, n, r, i) {
  const o = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const a = s + 1e3;
    Kv(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, a),
      oldFileFd: r
    }, n, () => o(a), i);
  };
  return o;
}
function Kv(e, t, n, r, i) {
  let o = "bytes=", s = 0;
  const a = /* @__PURE__ */ new Map(), l = [];
  for (let u = t.start; u < t.end; u++) {
    const f = t.tasks[u];
    f.kind === yl.OperationKind.DOWNLOAD && (o += `${f.start}-${f.end - 1}, `, a.set(s, u), s++, l.push(f.end - f.start));
  }
  if (s <= 1) {
    const u = (f) => {
      if (f >= t.end) {
        r();
        return;
      }
      const y = t.tasks[f++];
      if (y.kind === yl.OperationKind.COPY)
        (0, gl.copyData)(y, n, t.oldFileFd, i, () => u(f));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${y.start}-${y.end - 1}`;
        const g = e.httpExecutor.createRequest(E, (v) => {
          No(v, i) && (v.pipe(n, {
            end: !1
          }), v.once("end", () => u(f)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(g, i), g.end();
      }
    };
    u(t.start);
    return;
  }
  const h = e.createRequestOptions();
  h.headers.Range = o.substring(0, o.length - 2);
  const c = e.httpExecutor.createRequest(h, (u) => {
    if (!No(u, i))
      return;
    const f = (0, bo.safeGetHeader)(u, "content-type"), y = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(f);
    if (y == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${f}"`));
      return;
    }
    const E = new gl.DataSplitter(n, t, a, y[1] || y[2], l, r);
    E.on("error", i), u.pipe(E), u.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function No(e, t) {
  if (e.statusCode >= 400)
    return t((0, bo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, bo.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.ProgressDifferentialDownloadCallbackTransform = void 0;
const Jv = Jn;
var on;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(on || (on = {}));
class Qv extends Jv.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = on.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == on.COPY) {
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
    this.operationType = on.COPY;
  }
  beginRangeDownload() {
    this.operationType = on.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
Ai.ProgressDifferentialDownloadCallbackTransform = Qv;
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.DifferentialDownloader = void 0;
const On = me, co = It, Zv = Be, ew = yn, tw = hn, Fr = Yt, El = Ci, nw = Ai;
class rw {
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
    return (0, On.configureRequestUrl)(this.options.newUrl, t), (0, On.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Fr.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, s = 0;
    for (const l of i) {
      const h = l.end - l.start;
      l.kind === Fr.OperationKind.DOWNLOAD ? o += h : s += h;
    }
    const a = this.blockAwareFileInfo.size;
    if (o + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${s}, newSize: ${a}`);
    return r.info(`Full: ${_l(a)}, To download: ${_l(o)} (${Math.round(o / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, co.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, n).then(r).catch((i) => r().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (s) {
        try {
          console.error(s);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, n) {
    const r = await (0, co.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, co.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, Zv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, a) => {
      const l = [];
      let h;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const S = [];
        let C = 0;
        for (const L of t)
          L.kind === Fr.OperationKind.DOWNLOAD && (S.push(L.end - L.start), C += L.end - L.start);
        const P = {
          expectedByteCounts: S,
          grandTotal: C
        };
        h = new nw.ProgressDifferentialDownloadCallbackTransform(P, this.options.cancellationToken, this.options.onProgress), l.push(h);
      }
      const c = new On.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            c.validate();
          } catch (S) {
            a(S);
            return;
          }
          s(void 0);
        });
      }), l.push(o);
      let u = null;
      for (const S of l)
        S.on("error", a), u == null ? u = S : u = u.pipe(S);
      const f = l[0];
      let y;
      if (this.options.isUseMultipleRangeRequest) {
        y = (0, El.executeTasksUsingMultipleRangeRequests)(this, t, f, r, a), y(0);
        return;
      }
      let E = 0, g = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const v = this.createRequestOptions();
      v.redirect = "manual", y = (S) => {
        var C, P;
        if (S >= t.length) {
          this.fileMetadataBuffer != null && f.write(this.fileMetadataBuffer), f.end();
          return;
        }
        const L = t[S++];
        if (L.kind === Fr.OperationKind.COPY) {
          h && h.beginFileCopy(), (0, ew.copyData)(L, f, r, a, () => y(S));
          return;
        }
        const re = `bytes=${L.start}-${L.end - 1}`;
        v.headers.range = re, (P = (C = this.logger) === null || C === void 0 ? void 0 : C.debug) === null || P === void 0 || P.call(C, `download range: ${re}`), h && h.beginRangeDownload();
        const le = this.httpExecutor.createRequest(v, (z) => {
          z.on("error", a), z.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), z.statusCode >= 400 && a((0, On.createHttpError)(z)), z.pipe(f, {
            end: !1
          }), z.once("end", () => {
            h && h.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => y(S), 1e3)) : y(S);
          });
        });
        le.on("redirect", (z, Ue, _) => {
          this.logger.info(`Redirect to ${iw(_)}`), g = _, (0, On.configureRequestUrl)(new tw.URL(g), v), le.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(le, a), le.end();
      }, y(0);
    });
  }
  async readRemoteBytes(t, n) {
    const r = Buffer.allocUnsafe(n + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${n}`;
    let o = 0;
    if (await this.request(i, (s) => {
      s.copy(r, o), o += s.length;
    }), o !== r.length)
      throw new Error(`Received data length ${o} is not equal to expected ${r.length}`);
    return r;
  }
  request(t, n) {
    return new Promise((r, i) => {
      const o = this.httpExecutor.createRequest(t, (s) => {
        (0, El.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", n), s.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
ar.DifferentialDownloader = rw;
function _l(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function iw(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.GenericDifferentialDownloader = void 0;
const ow = ar;
class sw extends ow.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
Si.GenericDifferentialDownloader = sw;
var Ot = {};
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
  function r(i, o, s) {
    i.on(o, s);
  }
})(Ot);
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.NoOpLogger = wt.AppUpdater = void 0;
const Ie = me, aw = Qn, lw = ri, cw = jl, Kt = It, uw = _e, uo = fi, Dt = J, xt = ju, vl = or, dw = Ei, wl = qu, fw = sr, fo = _i, hw = Gl, pw = Ye, mw = Si, Jt = Ot;
class fs extends cw.EventEmitter {
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
        throw (0, Ie.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Ie.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, wl.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Ju();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new uo.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Jt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this.clientPromise = null, this.stagingUserIdPromise = new uo.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new uo.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new dw.ElectronAppAdapter(), this.httpExecutor = new wl.ElectronHttpExecutor((o, s) => this.emit("login", o, s))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, xt.parse)(r);
    if (i == null)
      throw (0, Ie.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = gw(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? r = new fw.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, fo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, fo.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
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
      const r = fs.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new Ht.Notification(r).show();
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
    const i = await this.stagingUserIdPromise.value, s = Ie.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${s}, user id: ${i}`), s < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, xt.parse)(t.version);
    if (n == null)
      throw (0, Ie.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, xt.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const o = (0, xt.gt)(n, r), s = (0, xt.lt)(n, r);
    return o ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, lw.release)();
    if (n)
      try {
        if ((0, xt.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, fo.createClient)(r, this, this.createProviderRuntimeOptions())));
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
    const r = new Ie.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Ie.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Ie.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Ie.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof Ie.CancellationError))
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
    this.emit(Jt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, uw.load)(await (0, Kt.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Dt.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, Kt.readFile)(t, "utf-8");
      if (Ie.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Ie.UUID.v5((0, aw.randomBytes)(4096), Ie.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, Kt.outputFile)(t, n);
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
      const i = Dt.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new vl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(Jt.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (C) => this.emit(Jt.DOWNLOAD_PROGRESS, C));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, s = n.packageInfo;
    function a() {
      const C = decodeURIComponent(t.fileInfo.url.pathname);
      return C.endsWith(`.${t.fileExtension}`) ? Dt.basename(C) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), h = l.cacheDirForPendingUpdate;
    await (0, Kt.mkdir)(h, { recursive: !0 });
    const c = a();
    let u = Dt.join(h, c);
    const f = s == null ? null : Dt.join(h, `package-${o}${Dt.extname(s.path) || ".7z"}`), y = async (C) => (await l.setDownloadedFile(u, f, i, n, c, C), await t.done({
      ...i,
      downloadedFile: u
    }), f == null ? [u] : [u, f]), E = this._logger, g = await l.validateDownloadedPath(u, i, n, E);
    if (g != null)
      return u = g, await y(!1);
    const v = async () => (await l.clear().catch(() => {
    }), await (0, Kt.unlink)(u).catch(() => {
    })), S = await (0, vl.createTempUpdateFile)(`temp-${c}`, h, E);
    try {
      await t.task(S, r, f, v), await (0, Ie.retry)(() => (0, Kt.rename)(S, u), 60, 500, 0, 0, (C) => C instanceof Error && /^EBUSY:/.test(C.message));
    } catch (C) {
      throw await v(), C instanceof Ie.CancellationError && (E.info("cancelled"), this.emit("update-cancelled", i)), C;
    }
    return E.info(`New version ${o} has been downloaded to ${u}`), await y(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, pw.blockmapFiles)(t.url, this.app.version, n.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const a = async (c) => {
        const u = await this.httpExecutor.downloadToBuffer(c, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (u == null || u.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, hw.gunzipSync)(u).toString());
        } catch (f) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${f}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: Dt.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(Jt.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(Jt.DOWNLOAD_PROGRESS, c));
      const h = await Promise.all(s.map((c) => a(c)));
      return await new mw.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(h[0], h[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
wt.AppUpdater = fs;
function gw(e) {
  const t = (0, xt.prerelease)(e);
  return t != null && t.length > 0;
}
class Ju {
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
wt.NoOpLogger = Ju;
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.BaseUpdater = void 0;
const Tl = ni, yw = wt;
class Ew extends yw.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Ht.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
    } catch (s) {
      return this.dispatchError(s), !1;
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
    const i = (0, Tl.spawnSync)(t, n, {
      env: { ...process.env, ...r },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: s, stdout: a, stderr: l } = i;
    if (o != null)
      throw this._logger.error(l), o;
    if (s != null && s !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${s}`);
    return a.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, n = [], r = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${n}`), new Promise((o, s) => {
      try {
        const a = { stdio: i, env: r, detached: !0 }, l = (0, Tl.spawn)(t, n, a);
        l.on("error", (h) => {
          s(h);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (a) {
        s(a);
      }
    });
  }
}
ct.BaseUpdater = Ew;
var Gn = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Qt = It, _w = ar, vw = Gl;
class ww extends _w.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = Qu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await Tw(this.options.oldFile), i);
  }
}
lr.FileWithEmbeddedBlockMapDifferentialDownloader = ww;
function Qu(e) {
  return JSON.parse((0, vw.inflateRawSync)(e).toString());
}
async function Tw(e) {
  const t = await (0, Qt.open)(e, "r");
  try {
    const n = (await (0, Qt.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, Qt.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, Qt.read)(t, i, 0, i.length, n - r.length - i.length), await (0, Qt.close)(t), Qu(i);
  } catch (n) {
    throw await (0, Qt.close)(t), n;
  }
}
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.AppImageUpdater = void 0;
const Sl = me, Cl = ni, Sw = It, Cw = Be, Rn = J, Aw = ct, Iw = lr, Ow = de, Al = Ot;
class Rw extends Aw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Ow.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, Sl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, s, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, Sw.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, n, r, i, o) {
    try {
      const s = {
        newUrl: t.url,
        oldFile: n,
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(Al.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(Al.DOWNLOAD_PROGRESS, a)), await new Iw.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, Sl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, Cw.unlinkSync)(n);
    let r;
    const i = Rn.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Rn.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = Rn.join(Rn.dirname(n), Rn.basename(o)), (0, Cl.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Cl.execFileSync)(r, [], { env: s })), !0;
  }
}
Gn.AppImageUpdater = Rw;
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.DebUpdater = void 0;
const bw = ct, Nw = de, Il = Ot;
class $w extends bw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Nw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Il.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Il.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
Yn.DebUpdater = $w;
var Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.PacmanUpdater = void 0;
const Pw = ct, Ol = Ot, Dw = de;
class Fw extends Pw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Dw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Ol.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Ol.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
Xn.PacmanUpdater = Fw;
var Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.RpmUpdater = void 0;
const Lw = ct, Rl = Ot, xw = de;
class kw extends Lw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, xw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Rl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Rl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
    let s;
    return i ? s = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", o] : s = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", o], this.spawnSyncLog(n, [`${r}/bin/bash`, "-c", `'${s.join(" ")}'${r}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Vn.RpmUpdater = kw;
var Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.MacUpdater = void 0;
const bl = me, ho = It, Uw = Be, Nl = J, Mw = If, Bw = wt, Hw = de, $l = ni, Pl = Qn;
class jw extends Bw.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = Ht.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
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
      this.debug("Checking for macOS Rosetta environment"), o = (0, $l.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (u) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${u}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const f = (0, $l.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      r.info(`Checked 'uname -a': arm64=${f}`), s = s || f;
    } catch (u) {
      r.warn(`uname shell command to check for arm64 failed: ${u}`);
    }
    s = s || process.arch === "arm64" || o;
    const a = (u) => {
      var f;
      return u.url.pathname.includes("arm64") || ((f = u.info.url) === null || f === void 0 ? void 0 : f.includes("arm64"));
    };
    s && n.some(a) ? n = n.filter((u) => s === a(u)) : n = n.filter((u) => !a(u));
    const l = (0, Hw.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, bl.newError)(`ZIP file not provided: ${(0, bl.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const h = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (u, f) => {
        const y = Nl.join(this.downloadedUpdateHelper.cacheDir, c), E = () => (0, ho.pathExistsSync)(y) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let g = !0;
        E() && (g = await this.differentialDownloadInstaller(l, t, u, h, c)), g && await this.httpExecutor.download(l.url, u, f);
      },
      done: async (u) => {
        if (!t.disableDifferentialDownload)
          try {
            const f = Nl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, ho.copyFile)(u.downloadedFile, f);
          } catch (f) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${f.message}`);
          }
        return this.updateDownloaded(l, u);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, ho.stat)(i)).size, s = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, Mw.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const l = (h) => {
      const c = h.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((h, c) => {
      const u = (0, Pl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), f = Buffer.from(`autoupdater:${u}`, "ascii"), y = `/${(0, Pl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (E, g) => {
        const v = E.url;
        if (s.info(`${v} requested`), v === "/") {
          if (!E.headers.authorization || E.headers.authorization.indexOf("Basic ") === -1) {
            g.statusCode = 401, g.statusMessage = "Invalid Authentication Credentials", g.end(), s.warn("No authenthication info");
            return;
          }
          const P = E.headers.authorization.split(" ")[1], L = Buffer.from(P, "base64").toString("ascii"), [re, le] = L.split(":");
          if (re !== "autoupdater" || le !== u) {
            g.statusCode = 401, g.statusMessage = "Invalid Authentication Credentials", g.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const z = Buffer.from(`{ "url": "${l(this.server)}${y}" }`);
          g.writeHead(200, { "Content-Type": "application/json", "Content-Length": z.length }), g.end(z);
          return;
        }
        if (!v.startsWith(y)) {
          s.warn(`${v} requested, but not supported`), g.writeHead(404), g.end();
          return;
        }
        s.info(`${y} requested by Squirrel.Mac, pipe ${i}`);
        let S = !1;
        g.on("finish", () => {
          S || (this.nativeUpdater.removeListener("error", c), h([]));
        });
        const C = (0, Uw.createReadStream)(i);
        C.on("error", (P) => {
          try {
            g.end();
          } catch (L) {
            s.warn(`cannot end response: ${L}`);
          }
          S = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${P}`));
        }), g.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), C.pipe(g);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${a})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${a})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${f.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : h([]);
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
Wn.MacUpdater = jw;
var zn = {}, hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
hs.verifySignature = Gw;
const Dl = me, Zu = ni, qw = ri, Fl = J;
function Gw(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, Zu.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, a, l) => {
      var h;
      try {
        if (s != null || l) {
          po(n, s, l, i), r(null);
          return;
        }
        const c = Yw(a);
        if (c.Status === 0) {
          try {
            const E = Fl.normalize(c.Path), g = Fl.normalize(t);
            if (n.info(`LiteralPath: ${E}. Update Path: ${g}`), E !== g) {
              po(n, new Error(`LiteralPath of ${E} is different than ${g}`), l, i), r(null);
              return;
            }
          } catch (E) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(h = E.message) !== null && h !== void 0 ? h : E.stack}`);
          }
          const f = (0, Dl.parseDn)(c.SignerCertificate.Subject);
          let y = !1;
          for (const E of e) {
            const g = (0, Dl.parseDn)(E);
            if (g.size ? y = Array.from(g.keys()).every((S) => g.get(S) === f.get(S)) : E === f.get("CN") && (n.warn(`Signature validated using only CN ${E}. Please add your full Distinguished Name (DN) to publisherNames configuration`), y = !0), y) {
              r(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (f, y) => f === "RawData" ? void 0 : y, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), r(u);
      } catch (c) {
        po(n, c, null, i), r(null);
        return;
      }
    });
  });
}
function Yw(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function po(e, t, n, r) {
  if (Xw()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Zu.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function Xw() {
  const e = qw.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(zn, "__esModule", { value: !0 });
zn.NsisUpdater = void 0;
const Lr = me, Ll = J, Vw = ct, Ww = lr, xl = Ot, zw = de, Kw = It, Jw = hs, kl = hn;
class Qw extends Vw.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, Jw.verifySignature)(r, i, this._logger);
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
    const n = t.updateInfoAndProvider.provider, r = (0, zw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, s, a) => {
        const l = r.packageInfo, h = l != null && s != null;
        if (h && t.disableWebInstaller)
          throw (0, Lr.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !h && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (h || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, Lr.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await a(), (0, Lr.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (h && await this.differentialDownloadWebPackage(t, l, s, n))
          try {
            await this.httpExecutor.download(new kl.URL(l.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (u) {
            try {
              await (0, Kw.unlink)(s);
            } catch {
            }
            throw u;
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
      this.spawnLog(Ll.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((s) => {
      const a = s.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? o() : a === "ENOENT" ? Ht.shell.openPath(n).catch((l) => this.dispatchError(l)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new kl.URL(n.path),
        oldFile: Ll.join(this.downloadedUpdateHelper.cacheDir, Lr.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(xl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(xl.DOWNLOAD_PROGRESS, s)), await new Ww.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
zn.NsisUpdater = Qw;
(function(e) {
  var t = Re && Re.__createBinding || (Object.create ? function(v, S, C, P) {
    P === void 0 && (P = C);
    var L = Object.getOwnPropertyDescriptor(S, C);
    (!L || ("get" in L ? !S.__esModule : L.writable || L.configurable)) && (L = { enumerable: !0, get: function() {
      return S[C];
    } }), Object.defineProperty(v, P, L);
  } : function(v, S, C, P) {
    P === void 0 && (P = C), v[P] = S[C];
  }), n = Re && Re.__exportStar || function(v, S) {
    for (var C in v) C !== "default" && !Object.prototype.hasOwnProperty.call(S, C) && t(S, v, C);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = It, i = J;
  var o = ct;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var s = wt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var a = de;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var l = Gn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var h = Yn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return h.DebUpdater;
  } });
  var c = Xn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var u = Vn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return u.RpmUpdater;
  } });
  var f = Wn;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return f.MacUpdater;
  } });
  var y = zn;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return y.NsisUpdater;
  } }), n(Ot, e);
  let E;
  function g() {
    if (process.platform === "win32")
      E = new zn.NsisUpdater();
    else if (process.platform === "darwin")
      E = new Wn.MacUpdater();
    else {
      E = new Gn.AppImageUpdater();
      try {
        const v = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(v))
          return E;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const S = (0, r.readFileSync)(v).toString().trim();
        switch (console.info("Found package-type:", S), S) {
          case "deb":
            E = new Yn.DebUpdater();
            break;
          case "rpm":
            E = new Vn.RpmUpdater();
            break;
          case "pacman":
            E = new Xn.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (v) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", v.message);
      }
    }
    return E;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => E || g()
  });
})(Yl);
const Zw = /* @__PURE__ */ $f(Yl), eT = [
  // 优先级1: 财务报告类 (覆盖率: 7.19%)
  {
    category: "财务报告",
    keywords: [
      "年度报告",
      "年报",
      "半年度报告",
      "半年报",
      "季度报告",
      "季报",
      "一季报",
      "三季报",
      "财务报告",
      "财务报表",
      "业绩快报",
      "业绩预告",
      "盈利预告",
      "审计报告",
      "审计",
      "会计",
      "会计师事务所",
      "业绩说明会"
    ],
    priority: 1
  },
  // 优先级2: 分红派息 (覆盖率: 1.81%)
  {
    category: "分红派息",
    keywords: ["分红", "派息", "现金分红", "送股", "转增", "利润分配", "股利分配", "权益分派", "除权除息"],
    priority: 2
  },
  // 优先级3: 股权变动 (覆盖率: 1.72%)
  {
    category: "股权变动",
    keywords: [
      "股权变动",
      "权益变动",
      "增持",
      "减持",
      "股份回购",
      "回购股份",
      "回购",
      "限售股",
      "解禁",
      "股权激励",
      "员工持股",
      "出售股份",
      "出售已回购"
    ],
    priority: 3
  },
  // 优先级4: 风险提示 (覆盖率: 6.23%)
  {
    category: "风险提示",
    keywords: [
      "风险提示",
      "风险警示",
      "异常波动",
      "股价异常",
      "ST",
      "*ST",
      "退市风险",
      "退市",
      "停牌",
      "复牌",
      "核查",
      "问询",
      "问询函",
      "关注函",
      "回复",
      "回复函",
      "澄清",
      "澄清公告",
      "资产减值",
      "计提减值"
    ],
    priority: 4
  },
  // 优先级5: 公司治理 (覆盖率: 30.39% - 最高)
  {
    category: "公司治理",
    keywords: [
      "董事会",
      "董事会决议",
      "监事会",
      "监事会决议",
      "股东大会",
      "股东会",
      "临时股东大会",
      "独立董事",
      "董事",
      "高管",
      "总经理",
      "副总经理",
      "财务总监",
      "董事长",
      "监事",
      "任命",
      "选举",
      "辞职",
      "离职",
      "聘任",
      "章程",
      "章程修订",
      "会议通知",
      "会议决议",
      "会议",
      "提名",
      "候选人"
    ],
    priority: 5
  },
  // 优先级6: 担保事项 (新增，预计覆盖率: 2-3%)
  {
    category: "担保事项",
    keywords: ["担保", "提供担保", "反担保", "担保额度", "对外担保"],
    priority: 6
  },
  // 优先级7: 交易公告 (覆盖率: 7.20%)
  {
    category: "交易公告",
    keywords: ["关联交易", "日常关联交易", "购买资产", "出售资产", "资产转让", "股权转让", "交易", "买卖"],
    priority: 7
  },
  // 优先级8: 重大事项 (覆盖率: 0.70%)
  {
    category: "重大事项",
    keywords: ["重大事项", "重大事件", "重大资产重组", "资产重组", "收购", "兼并", "并购", "重组", "整合", "重大合同"],
    priority: 8
  },
  // 优先级9: 对外投资 (覆盖率: 3.44%)
  {
    category: "对外投资",
    keywords: ["对外投资", "投资设立", "设立", "参股", "控股", "合资", "合作", "子公司", "全资子公司", "投资进展"],
    priority: 9
  },
  // 优先级10: 经营情况 (覆盖率: 2.76%)
  {
    category: "经营情况",
    keywords: [
      "经营情况",
      "生产经营",
      "经营数据",
      "项目",
      "工程",
      "中标",
      "中标公告",
      "合同",
      "签订合同",
      "签署",
      "协议",
      "建设",
      "施工",
      "完成",
      "竣工",
      "授信",
      "综合授信",
      "银行授信"
    ],
    priority: 10
  },
  // 优先级11: 债券相关 (新增，预计覆盖率: 3-5%)
  {
    category: "债券相关",
    keywords: ["债券", "公司债", "可转债", "转债", "可转换债券", "付息", "兑付", "摘牌", "发行", "发行结果", "信用评级", "评级", "转股"],
    priority: 11
  },
  // 优先级12: 内部控制 (新增，预计覆盖率: 1-2%)
  {
    category: "内部控制",
    keywords: ["内部控制", "内控", "鉴证报告", "自我评价", "管理制度", "信息披露"],
    priority: 12
  },
  // 优先级13: 资质认证 (新增，预计覆盖率: 0.5-1%)
  {
    category: "资质认证",
    keywords: ["高新技术企业", "高新认定", "资质", "认证", "许可证", "证书", "专利", "知识产权"],
    priority: 13
  },
  // 优先级14: 基金相关 (新增，预计覆盖率: 2-3%)
  {
    category: "基金相关",
    keywords: ["基金", "基金管理", "开放日常", "开放申购", "开放赎回", "基金份额", "基金净值", "估值调整"],
    priority: 14
  },
  // 优先级15: 诉讼仲裁 (覆盖率: 0.64%)
  {
    category: "诉讼仲裁",
    keywords: ["诉讼", "起诉", "被诉", "仲裁", "纠纷", "法律纠纷", "判决", "裁决", "法律"],
    priority: 15
  },
  // 优先级16: 募集资金 (预计覆盖率: 3-4%)
  {
    category: "募集资金",
    keywords: ["募集资金", "闲置募集资金", "现金管理", "理财产品", "补充流动资金", "募集资金管理"],
    priority: 16
  },
  // 优先级17: 股权激励 (预计覆盖率: 2-3%)
  {
    category: "股权激励",
    keywords: ["股权激励", "激励计划", "股票期权", "期权激励", "限制性股票", "激励对象", "授予", "行权", "解锁"],
    priority: 17
  },
  // 优先级18: 投资者关系 (预计覆盖率: 1-2%)
  {
    category: "投资者关系",
    keywords: ["投资者关系", "投资者关系活动", "投资者关系管理", "投资者接待", "路演"],
    priority: 18
  },
  // 优先级19: 持续督导 (预计覆盖率: 0.5-1%)
  {
    category: "持续督导",
    keywords: ["持续督导", "督导报告", "定期现场检查", "现场检查", "跟踪报告"],
    priority: 19
  },
  // 优先级20: ESG报告 (预计覆盖率: 0.3-0.5%)
  {
    category: "ESG报告",
    keywords: ["ESG", "ESG报告", "社会责任", "社会责任报告", "可持续发展", "环境报告", "环境、社会及治理"],
    priority: 20
  },
  // 优先级21: 股份质押 (预计覆盖率: 0.3-0.5%)
  {
    category: "股份质押",
    keywords: ["质押", "股份质押", "解除质押", "股权质押", "再质押", "补充质押"],
    priority: 21
  }
];
function En(e) {
  if (!e) return "其他";
  const t = [...eT].sort((n, r) => n.priority - r.priority);
  for (const n of t)
    for (const r of n.keywords)
      if (e.includes(r))
        return n.category;
  return "其他";
}
const ed = J.join(Ce.getPath("userData"), "cafe_stock.db"), k = new Nf(ed), $o = () => ed;
k.exec(`
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

  CREATE TABLE IF NOT EXISTS favorite_stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_favorite_ts_code ON favorite_stocks (ts_code);

  CREATE TABLE IF NOT EXISTS sync_flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sync_type TEXT NOT NULL UNIQUE,
    last_sync_date TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );


  CREATE TABLE IF NOT EXISTS top10_holders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL,
    ann_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    hold_amount REAL,
    hold_ratio REAL,
    updated_at TEXT NOT NULL,
    UNIQUE(ts_code, end_date, holder_name)
  );

  CREATE INDEX IF NOT EXISTS idx_top10_ts_code ON top10_holders (ts_code);
  CREATE INDEX IF NOT EXISTS idx_top10_end_date ON top10_holders (end_date DESC);
  CREATE INDEX IF NOT EXISTS idx_top10_holder_name ON top10_holders (holder_name);
  CREATE INDEX IF NOT EXISTS idx_top10_ts_end_date ON top10_holders (ts_code, end_date DESC);

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL,
    ann_date TEXT NOT NULL,
    ann_type TEXT,
    title TEXT,
    content TEXT,
    pub_time TEXT,
    file_path TEXT,
    name TEXT,
    UNIQUE(ts_code, ann_date, title)
  );

  CREATE INDEX IF NOT EXISTS idx_ann_date ON announcements (ann_date DESC);
  CREATE INDEX IF NOT EXISTS idx_ann_ts_code ON announcements (ts_code);
  CREATE INDEX IF NOT EXISTS idx_ann_ts_code_date ON announcements (ts_code, ann_date DESC, pub_time DESC);

  CREATE TABLE IF NOT EXISTS announcement_sync_ranges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    synced_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sync_range_ts_code ON announcement_sync_ranges (ts_code);
  CREATE INDEX IF NOT EXISTS idx_sync_range_dates ON announcement_sync_ranges (start_date, end_date);
`);
function tT() {
  const e = k.prepare("PRAGMA table_info(announcements)").all(), t = new Set(e.map((o) => o.name)), n = [
    { name: "name", type: "TEXT" },
    { name: "url", type: "TEXT" },
    { name: "rec_time", type: "TEXT" }
  ];
  for (const o of n)
    if (!t.has(o.name)) {
      console.log(`[DB Migration] 添加 announcements.${o.name} 列`);
      try {
        k.exec(`ALTER TABLE announcements ADD COLUMN ${o.name} ${o.type}`), console.log(`[DB Migration] announcements.${o.name} 列添加成功`);
      } catch (s) {
        console.error(`[DB Migration Error] 添加 announcements.${o.name} 列失败:`, s);
      }
    }
  const r = k.prepare("PRAGMA table_info(stocks)").all();
  if (!new Set(r.map((o) => o.name)).has("is_favorite")) {
    console.log("[DB Migration] 添加 stocks.is_favorite 列");
    try {
      k.exec("ALTER TABLE stocks ADD COLUMN is_favorite INTEGER DEFAULT 0"), console.log("[DB Migration] stocks.is_favorite 列添加成功"), k.exec("CREATE INDEX IF NOT EXISTS idx_stock_is_favorite ON stocks (is_favorite)"), console.log("[DB Migration] stocks.is_favorite 索引创建成功");
    } catch (o) {
      console.error("[DB Migration Error] 添加 stocks.is_favorite 列失败:", o);
    }
  }
  if (!t.has("category")) {
    console.log("[DB Migration] 添加 announcements.category 列");
    try {
      k.exec("ALTER TABLE announcements ADD COLUMN category TEXT DEFAULT NULL"), console.log("[DB Migration] announcements.category 列添加成功"), k.exec("CREATE INDEX IF NOT EXISTS idx_ann_category ON announcements (category)"), console.log("[DB Migration] announcements.category 索引创建成功");
    } catch (o) {
      console.error("[DB Migration Error] 添加 announcements.category 列失败:", o);
    }
  }
}
tT();
const ps = (e) => {
  const t = (/* @__PURE__ */ new Date()).toISOString(), n = k.prepare(`
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
  k.transaction((i) => {
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
}, Ii = () => k.prepare("SELECT * FROM stocks ORDER BY ts_code").all(), cr = () => k.prepare("SELECT COUNT(*) as count FROM stocks").get().count, ei = () => {
  const e = cr(), t = k.prepare("SELECT MAX(updated_at) as last_sync_time FROM stocks").get();
  return {
    stockCount: e,
    lastSyncTime: (t == null ? void 0 : t.last_sync_time) || null
  };
}, ms = (e, t = 50) => {
  const n = `%${e}%`;
  return k.prepare(
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
}, td = (e) => {
  try {
    return k.prepare("UPDATE stocks SET is_favorite = 1 WHERE ts_code = ?").run(e).changes > 0;
  } catch (t) {
    return console.error("Failed to add favorite stock:", t), !1;
  }
}, nd = (e) => {
  try {
    return k.prepare("UPDATE stocks SET is_favorite = 0 WHERE ts_code = ?").run(e).changes > 0;
  } catch (t) {
    return console.error("Failed to remove favorite stock:", t), !1;
  }
}, rd = (e) => {
  try {
    const n = k.prepare("SELECT is_favorite FROM stocks WHERE ts_code = ?").get(e);
    return (n == null ? void 0 : n.is_favorite) === 1;
  } catch (t) {
    return console.error("Failed to check favorite stock:", t), !1;
  }
}, gs = () => {
  try {
    return k.prepare("SELECT ts_code FROM stocks WHERE is_favorite = 1 ORDER BY ts_code").all().map((n) => n.ts_code);
  } catch (e) {
    return console.error("Failed to get all favorite stocks:", e), [];
  }
}, ys = () => {
  try {
    const t = k.prepare("SELECT COUNT(*) as count FROM stocks WHERE is_favorite = 1").get();
    return (t == null ? void 0 : t.count) || 0;
  } catch (e) {
    return console.error("Failed to count favorite stocks:", e), 0;
  }
}, id = (e) => {
  const t = k.prepare("SELECT last_sync_date FROM sync_flags WHERE sync_type = ?").get(e);
  return (t == null ? void 0 : t.last_sync_date) || null;
}, od = (e, t) => {
  const n = (/* @__PURE__ */ new Date()).toISOString();
  k.prepare(
    `
    INSERT INTO sync_flags (sync_type, last_sync_date, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(sync_type) DO UPDATE SET
      last_sync_date = excluded.last_sync_date,
      updated_at = excluded.updated_at
  `
  ).run(e, t, n);
}, Es = (e) => {
  const t = id(e);
  if (!t) return !1;
  const n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  return t === n;
}, Po = (e) => {
  const t = (/* @__PURE__ */ new Date()).toISOString(), n = k.prepare(`
    INSERT INTO top10_holders (
      ts_code, ann_date, end_date, holder_name, hold_amount, hold_ratio, updated_at
    )
    VALUES (
      @ts_code, @ann_date, @end_date, @holder_name, @hold_amount, @hold_ratio, @updated_at
    )
    ON CONFLICT(ts_code, end_date, holder_name) DO UPDATE SET
      ann_date = excluded.ann_date,
      hold_amount = excluded.hold_amount,
      hold_ratio = excluded.hold_ratio,
      updated_at = excluded.updated_at
  `);
  k.transaction((i) => {
    for (const o of i)
      n.run({
        ts_code: o.ts_code || null,
        ann_date: o.ann_date || null,
        end_date: o.end_date || null,
        holder_name: o.holder_name || null,
        hold_amount: o.hold_amount || null,
        hold_ratio: o.hold_ratio || null,
        updated_at: t
      });
  })(e);
}, sd = (e, t = 100) => k.prepare(
  `
    SELECT * FROM top10_holders 
    WHERE ts_code = ?
    ORDER BY end_date DESC, hold_ratio DESC
    LIMIT ?
  `
).all(e, t), ad = (e) => k.prepare(
  `
    SELECT DISTINCT end_date 
    FROM top10_holders 
    WHERE ts_code = ?
    ORDER BY end_date DESC
  `
).all(e).map((n) => n.end_date), ld = (e, t) => k.prepare(
  `
    SELECT * FROM top10_holders 
    WHERE ts_code = ? AND end_date = ?
    ORDER BY hold_ratio DESC
  `
).all(e, t), Do = (e) => k.prepare("SELECT COUNT(*) as count FROM top10_holders WHERE ts_code = ?").get(e).count > 0, cd = () => k.prepare("SELECT DISTINCT ts_code FROM top10_holders ORDER BY ts_code").all().map((t) => t.ts_code), _s = () => k.prepare("SELECT COUNT(DISTINCT ts_code) as count FROM top10_holders").get().count, nT = (e, t = 100) => {
  const n = `%${e}%`;
  return k.prepare(
    `
    SELECT h.*, s.name as stock_name, s.industry, s.market
    FROM top10_holders h
    INNER JOIN stocks s ON h.ts_code = s.ts_code
    WHERE h.holder_name LIKE ?
    ORDER BY h.end_date DESC, h.hold_ratio DESC
    LIMIT ?
  `
  ).all(n, t);
}, rT = (e) => k.prepare(
  `
    SELECT DISTINCT h.ts_code, s.name as stock_name, s.industry, s.market,
           MAX(h.end_date) as latest_end_date,
           MAX(h.hold_ratio) as latest_hold_ratio
    FROM top10_holders h
    INNER JOIN stocks s ON h.ts_code = s.ts_code
    WHERE h.holder_name = ?
    GROUP BY h.ts_code, s.name, s.industry, s.market
    ORDER BY latest_end_date DESC, latest_hold_ratio DESC
  `
).all(e), ud = (e) => k.prepare("DELETE FROM top10_holders WHERE ts_code = ?").run(e).changes, Oi = (e) => {
  const t = k.prepare(`
    INSERT INTO announcements (
      ts_code, ann_date, ann_type, title, content, pub_time, file_path, name, category
    )
    VALUES (
      @ts_code, @ann_date, @ann_type, @title, @content, @pub_time, @file_path, @name, @category
    )
    ON CONFLICT(ts_code, ann_date, title) DO UPDATE SET
      ann_type = excluded.ann_type,
      content = excluded.content,
      pub_time = excluded.pub_time,
      file_path = excluded.file_path,
      name = excluded.name,
      category = COALESCE(announcements.category, excluded.category)
  `);
  k.transaction((r) => {
    for (const i of r) {
      const o = i.category || En(i.title || "");
      t.run({
        ts_code: i.ts_code || null,
        ann_date: i.ann_date || null,
        ann_type: i.ann_type || null,
        title: i.title || null,
        content: i.content || null,
        pub_time: i.pub_time || null,
        file_path: i.file_path || null,
        name: i.name || null,
        category: o
      });
    }
  })(e);
}, ln = (e, t, n) => {
  let r, i;
  e ? (r = `
      SELECT start_date, end_date 
      FROM announcement_sync_ranges 
      WHERE ts_code = ?
        AND start_date <= ?
        AND end_date >= ?
      ORDER BY start_date
    `, i = [e, n, t]) : (r = `
      SELECT start_date, end_date 
      FROM announcement_sync_ranges 
      WHERE ts_code IS NULL
        AND start_date <= ?
        AND end_date >= ?
      ORDER BY start_date
    `, i = [n, t]);
  const o = k.prepare(r).all(...i);
  if (o.length === 0)
    return !1;
  for (const s of o)
    if (s.start_date <= t && s.end_date >= n)
      return !0;
  return !1;
}, Fo = (e, t, n) => {
  let r, i;
  e ? (r = `
      SELECT start_date, end_date 
      FROM announcement_sync_ranges 
      WHERE ts_code = ?
        AND NOT (end_date < ? OR start_date > ?)
      ORDER BY start_date
    `, i = [e, t, n]) : (r = `
      SELECT start_date, end_date 
      FROM announcement_sync_ranges 
      WHERE ts_code IS NULL
        AND NOT (end_date < ? OR start_date > ?)
      ORDER BY start_date
    `, i = [t, n]);
  const o = k.prepare(r).all(...i);
  if (o.length === 0)
    return [{ start_date: t, end_date: n }];
  const s = [];
  let a = t;
  for (const l of o) {
    if (a < l.start_date) {
      const h = aT(l.start_date);
      s.push({
        start_date: a,
        end_date: h
      });
    }
    a = hd(l.end_date);
  }
  return a <= n && s.push({
    start_date: a,
    end_date: n
  }), s;
}, vs = (e, t, n) => {
  const r = (/* @__PURE__ */ new Date()).toISOString();
  e ? k.prepare(`
      INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
      VALUES (?, ?, ?, ?)
    `).run(e, t, n, r) : k.prepare(`
      INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
      VALUES (NULL, ?, ?, ?)
    `).run(t, n, r), iT(e);
}, iT = (e) => {
  var h, c;
  let t, n;
  e ? (t = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code = ? ORDER BY start_date", n = [e]) : (t = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code IS NULL ORDER BY start_date", n = []);
  const r = k.prepare(t).all(...n);
  if (r.length <= 1)
    return;
  const i = [], o = [];
  let s = r[0];
  for (let u = 1; u < r.length; u++) {
    const f = r[u];
    hd(s.end_date) >= f.start_date ? (s = {
      id: s.id,
      start_date: s.start_date,
      end_date: f.end_date > s.end_date ? f.end_date : s.end_date
    }, i.push(f.id)) : (s.end_date !== ((h = r.find((y) => y.id === s.id)) == null ? void 0 : h.end_date) && o.push(s), s = f);
  }
  s.end_date !== ((c = r.find((u) => u.id === s.id)) == null ? void 0 : c.end_date) && o.push(s);
  const a = k.prepare("UPDATE announcement_sync_ranges SET end_date = ? WHERE id = ?"), l = k.prepare("DELETE FROM announcement_sync_ranges WHERE id = ?");
  k.transaction(() => {
    for (const u of o)
      a.run(u.end_date, u.id);
    for (const u of i)
      l.run(u);
  })();
}, oT = (e, t, n = 100) => {
  let r = "SELECT * FROM announcements WHERE ts_code = ?";
  const i = [e];
  if (t && t.length > 0) {
    const o = t.map(() => "?").join(",");
    r += ` AND category IN (${o})`, i.push(...t);
  }
  return r += " ORDER BY ann_date DESC, rec_time DESC LIMIT ?", i.push(n), k.prepare(r).all(...i);
}, Hr = (e, t, n, r, i = 200) => {
  let o = "SELECT * FROM announcements WHERE ann_date >= ? AND ann_date <= ?";
  const s = [e, t];
  if (n && (o += " AND ts_code = ?", s.push(n)), r && r.length > 0) {
    const a = r.map(() => "?").join(",");
    o += ` AND category IN (${a})`, s.push(...r);
  }
  return o += " ORDER BY ann_date DESC, rec_time DESC LIMIT ?", s.push(i), k.prepare(o).all(...s);
}, dd = (e, t = 100) => {
  const n = `%${e}%`;
  return k.prepare(
    `
    SELECT a.*, s.name as stock_name 
    FROM announcements a
    LEFT JOIN stocks s ON a.ts_code = s.ts_code
    WHERE a.title LIKE ? OR a.ts_code LIKE ? OR s.name LIKE ?
    ORDER BY a.ann_date DESC, a.rec_time DESC
    LIMIT ?
  `
  ).all(n, n, n, t);
}, ws = () => k.prepare("SELECT COUNT(*) as count FROM announcements").get().count, Ts = () => k.prepare("SELECT COUNT(*) as count FROM announcements WHERE category IS NULL").get().count, fd = (e = 1e3, t) => {
  const n = Ts();
  let r = 0;
  if (n === 0)
    return { success: !0, processed: 0, total: 0 };
  console.log(`[Tagging] 开始批量打标，共 ${n} 条未打标公告`);
  const i = k.prepare("UPDATE announcements SET category = ? WHERE id = ?"), o = k.transaction(() => {
    for (; r < n; ) {
      const s = k.prepare(
        `
                SELECT id, title 
                FROM announcements 
                WHERE category IS NULL 
                LIMIT ?
            `
      ).all(e);
      if (s.length === 0) break;
      for (const a of s) {
        const l = En(a.title || "");
        i.run(l, a.id);
      }
      r += s.length, t && t(r, n), console.log(`[Tagging] 已处理 ${r}/${n} (${(r / n * 100).toFixed(2)}%)`);
    }
  });
  try {
    return o(), console.log(`[Tagging] 批量打标完成，共处理 ${r} 条`), { success: !0, processed: r, total: n };
  } catch (s) {
    return console.error("[Tagging Error]", s), { success: !1, processed: r, total: n };
  }
}, sT = (e, t = 100) => k.prepare(
  `
        SELECT * FROM announcements 
        WHERE category = ? 
        ORDER BY ann_date DESC, pub_time DESC 
        LIMIT ?
    `
).all(e, t), aT = (e) => {
  const t = parseInt(e.substring(0, 4)), n = parseInt(e.substring(4, 6)) - 1, r = parseInt(e.substring(6, 8)), i = new Date(t, n, r);
  return i.setDate(i.getDate() - 1), pd(i);
}, hd = (e) => {
  const t = parseInt(e.substring(0, 4)), n = parseInt(e.substring(4, 6)) - 1, r = parseInt(e.substring(6, 8)), i = new Date(t, n, r);
  return i.setDate(i.getDate() + 1), pd(i);
}, pd = (e) => {
  const t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0");
  return `${t}${n}${r}`;
};
k.pragma("journal_mode = WAL");
k.pragma("synchronous = NORMAL");
k.pragma("cache_size = -64000");
k.pragma("temp_store = MEMORY");
const lT = (e, t = []) => {
  const n = k.prepare(`EXPLAIN QUERY PLAN ${e}`).all(...t);
  return console.log("Query Plan:", JSON.stringify(n, null, 2)), n;
}, md = () => {
  const e = cr(), t = ys(), n = _s(), i = k.prepare("SELECT COUNT(*) as count FROM top10_holders").get().count, o = ws(), s = ei(), a = k.prepare("SELECT sync_type, last_sync_date, updated_at FROM sync_flags ORDER BY sync_type").all();
  return {
    stocks: {
      count: e,
      lastSyncTime: s.lastSyncTime
    },
    favoriteStocks: {
      count: t
    },
    top10Holders: {
      stockCount: n,
      recordCount: i
    },
    announcements: {
      count: o
    },
    syncFlags: a.map((l) => ({
      type: l.sync_type,
      lastSyncDate: l.last_sync_date,
      updatedAt: l.updated_at
    }))
  };
}, cT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addFavoriteStock: td,
  analyzeQuery: lT,
  countAnnouncements: ws,
  countFavoriteStocks: ys,
  countStocks: cr,
  countStocksWithTop10Holders: _s,
  default: k,
  deleteTop10HoldersByStock: ud,
  getAllFavoriteStocks: gs,
  getAllStocks: Ii,
  getAnnouncementsByCategory: sT,
  getAnnouncementsByDateRange: Hr,
  getAnnouncementsByStock: oT,
  getCacheDataStats: md,
  getDbPath: $o,
  getLastSyncDate: id,
  getStockListSyncInfo: ei,
  getStocksByHolder: rT,
  getStocksWithTop10Holders: cd,
  getTop10HoldersByStock: sd,
  getTop10HoldersByStockAndEndDate: ld,
  getTop10HoldersEndDates: ad,
  getUnsyncedAnnouncementRanges: Fo,
  getUntaggedAnnouncementsCount: Ts,
  hasTop10HoldersData: Do,
  isAnnouncementRangeSynced: ln,
  isFavoriteStock: rd,
  isSyncedToday: Es,
  recordAnnouncementSyncRange: vs,
  removeFavoriteStock: nd,
  searchAnnouncements: dd,
  searchHoldersByName: nT,
  searchStocks: ms,
  tagAnnouncementsBatch: fd,
  updateSyncFlag: od,
  upsertAnnouncements: Oi,
  upsertStocks: ps,
  upsertTop10Holders: Po
}, Symbol.toStringTag, { value: "Module" })), ti = class ti {
  static async request(t, n = {}, r = "") {
    const i = {
      api_name: t,
      token: this.TOKEN,
      params: n,
      fields: Array.isArray(r) ? r.join(",") : r
    }, o = Date.now();
    console.log(`[Tushare Request] 开始请求 API: ${t}`), console.log("[Tushare Request] 请求参数:", JSON.stringify(n, null, 2)), console.log("[Tushare Request] 请求字段:", r);
    try {
      const s = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(i)
      }), a = Date.now() - o;
      if (console.log(`[Tushare Response] API: ${t}, HTTP状态: ${s.status}, 耗时: ${a}ms`), !s.ok)
        throw new Error(`HTTP Error: ${s.status}`);
      const l = await s.json();
      if (console.log(`[Tushare Response] API: ${t}, 响应码: ${l.code}, 消息: ${l.msg || "成功"}`), l.code !== 0)
        throw new Error(`Tushare Error [${l.code}]: ${l.msg}`);
      if (!l.data)
        return console.log(`[Tushare Response] API: ${t}, 返回空数据`), [];
      const { fields: h, items: c } = l.data, u = c.map((f) => {
        const y = {};
        return h.forEach((E, g) => {
          y[E] = f[g];
        }), y;
      });
      return console.log(`[Tushare Response] API: ${t}, 返回 ${u.length} 条数据, 总耗时: ${Date.now() - o}ms`), u;
    } catch (s) {
      const a = Date.now() - o;
      throw console.error(`[Tushare Error] API: ${t}, 耗时: ${a}ms`), console.error("[Tushare Error] 请求参数:", JSON.stringify(n, null, 2)), console.error("[Tushare Error] 错误详情:", s), s;
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
  static async getAnnouncements(t, n, r, i, o = 2e3, s = 0) {
    return this.request("anns_d", {
      ts_code: t,
      ann_date: n,
      start_date: r,
      end_date: i,
      limit: o,
      // Internal support for pagination if API allows, or wrapper logic
      offset: s
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
  static async getStockList(t, n, r, i, o, s = "L", a = 5e3, l = 0) {
    return this.request("stock_basic", {
      ts_code: t,
      name: n,
      exchange: r,
      market: i,
      is_hs: o,
      list_status: s,
      limit: a,
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
   * 获取公告原文 URL（单次请求）
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
  /**
   * 获取公告原文 URL（迭代获取完整数据）
   * 处理单次 2000 条的限制，自动迭代直到获取完所有数据
   * 
   * @param tsCode 股票代码（可选）
   * @param startDate 开始日期 YYYYMMDD
   * @param endDate 结束日期 YYYYMMDD
   * @param onProgress 进度回调 (currentCount, totalFetched)
   * @returns 所有公告数据
   */
  static async getAnnouncementsIterative(t, n, r, i) {
    const o = [];
    let s = r;
    const a = 2e3;
    let l = !0;
    for (; l; ) {
      console.log(`[Tushare] 获取公告: ts_code=${t || "全市场"}, start=${n}, end=${s}`);
      const h = await this.getAnnouncementFiles(t, void 0, n, s);
      if (!h || h.length === 0) {
        console.log("[Tushare] 没有更多公告数据"), l = !1;
        break;
      }
      if (o.push(...h), i && i(h.length, o.length), console.log(`[Tushare] 获取到 ${h.length} 条公告，累计 ${o.length} 条`), h.length < a) {
        l = !1;
        break;
      }
      const c = h[h.length - 1].ann_date;
      if (c <= n) {
        console.log("[Tushare] 已到达起始日期，停止迭代"), l = !1;
        break;
      }
      if (s = this.getPreviousDay(c), s < n) {
        l = !1;
        break;
      }
      await this.sleep(300);
    }
    return console.log(`[Tushare] 公告获取完成，共 ${o.length} 条`), o;
  }
  /**
   * 获取日期的前一天（YYYYMMDD格式）
   */
  static getPreviousDay(t) {
    const n = parseInt(t.substring(0, 4)), r = parseInt(t.substring(4, 6)) - 1, i = parseInt(t.substring(6, 8)), o = new Date(n, r, i);
    return o.setDate(o.getDate() - 1), this.formatDateToYYYYMMDD(o);
  }
  /**
   * 格式化日期为 YYYYMMDD
   */
  static formatDateToYYYYMMDD(t) {
    const n = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0");
    return `${n}${r}${i}`;
  }
  /**
   * 延迟函数
   */
  static sleep(t) {
    return new Promise((n) => setTimeout(n, t));
  }
  /**
   * 完整获取指定日期范围的公告（确保覆盖整个范围）
   * 采用双向迭代策略：既向前获取更新数据，也向后获取历史数据
   */
  static async getAnnouncementsComplete(t, n, r, i) {
    const o = [];
    console.log(`[Tushare] 开始获取完整公告数据: ${n} - ${r}`);
    let a = await this.getAnnouncements(t, void 0, n, r, 2e3, 0);
    if (console.log(`[Tushare] 首次获取 ${a.length} 条公告`), !a || a.length === 0)
      return console.log("[Tushare] 该时间范围内没有公告数据"), [];
    if (o.push(...a), i && i(`已获取 ${o.length} 条`, o.length, o.length), a.length < 2e3)
      return console.log("[Tushare] 数据量小于批次大小，获取完成"), o;
    const l = a.map((u) => u.ann_date).sort(), h = l[0], c = l[l.length - 1];
    if (console.log(`[Tushare] 首批数据日期范围: ${h} - ${c}`), h > n) {
      console.log("[Tushare] 向后获取更早的数据...");
      let u = this.getPreviousDay(h);
      for (; u >= n; ) {
        console.log(`[Tushare] 获取历史数据: ${n} - ${u}`);
        const f = await this.getAnnouncements(t, void 0, n, u, 2e3, 0);
        if (!f || f.length === 0) {
          console.log("[Tushare] 没有更早的数据");
          break;
        }
        if (o.push(...f), console.log(`[Tushare] 获取到 ${f.length} 条历史公告，累计 ${o.length} 条`), i && i(`已获取 ${o.length} 条`, o.length, o.length), f.length < 2e3)
          break;
        const y = f.map((E) => E.ann_date).sort()[0];
        if (y <= n)
          break;
        u = this.getPreviousDay(y), await this.sleep(300);
      }
    }
    if (c < r) {
      console.log("[Tushare] 向前获取更新的数据...");
      let u = this.getNextDay(c);
      for (; u <= r; ) {
        console.log(`[Tushare] 获取最新数据: ${u} - ${r}`);
        const f = await this.getAnnouncements(t, void 0, u, r, 2e3, 0);
        if (!f || f.length === 0) {
          console.log("[Tushare] 没有更新的数据");
          break;
        }
        if (o.push(...f), console.log(`[Tushare] 获取到 ${f.length} 条最新公告，累计 ${o.length} 条`), i && i(`已获取 ${o.length} 条`, o.length, o.length), f.length < 2e3)
          break;
        const y = f.map((E) => E.ann_date).sort()[f.length - 1];
        if (y >= r)
          break;
        u = this.getNextDay(y), await this.sleep(300);
      }
    }
    return console.log(`[Tushare] 公告获取完成，共 ${o.length} 条`), o;
  }
  /**
   * 获取日期的后一天（YYYYMMDD格式）
   */
  static getNextDay(t) {
    const n = parseInt(t.substring(0, 4)), r = parseInt(t.substring(4, 6)) - 1, i = parseInt(t.substring(6, 8)), o = new Date(n, r, i);
    return o.setDate(o.getDate() + 1), this.formatDateToYYYYMMDD(o);
  }
  /**
   * 获取财经新闻
   * 文档: https://tushare.pro/document/2?doc_id=143
   * 接口：news
   * 描述：获取主要新闻网站的财经新闻数据
   * 限量：单次最大2000条
   * 权限：用户需要至少120积分才可以调取
   *
   * 输入参数：
   * src: str, 新闻来源 sina(新浪财经), wallstreetcn(华尔街见闻), 10jqka(同花顺), eastmoney(东方财富), yuncaijing(云财经)
   * start_date: str, 开始日期 (YYYYMMDD格式)
   * end_date: str, 结束日期 (YYYYMMDD格式)
   *
   * 输出参数：
   * datetime: str, 发布时间
   * content: str, 新闻内容
   * title: str, 新闻标题
   * channels: str, 频道
   */
  static async getNews(t, n, r) {
    return this.request("news", {
      src: t,
      start_date: n,
      end_date: r
    });
  }
  /**
   * 获取十大股东数据
   * 文档: https://tushare.pro/document/2?doc_id=61
   * 接口：top10_holders
   * 描述：获取上市公司前十大股东数据，包括持股数量和比例等信息
   * 限量：单次最大2000条，总量不限制
   * 权限：用户需要至少2000积分才可以调取
   *
   * 输入参数：
   * ts_code: str, 股票代码（支持单个或多个，多个用逗号分隔）
   * period: str, 报告期（YYYYMMDD格式）
   * ann_date: str, 公告日期（YYYYMMDD格式）
   * start_date: str, 报告期开始日期
   * end_date: str, 报告期结束日期
   *
   * 输出参数：
   * ts_code: str, TS股票代码
   * ann_date: str, 公告日期
   * end_date: str, 报告期
   * holder_name: str, 股东名称
   * hold_amount: float, 持有数量（股）
   * hold_ratio: float, 持有比例（%）
   */
  static async getTop10Holders(t, n, r, i, o) {
    return this.request("top10_holders", {
      ts_code: t,
      period: n,
      ann_date: r,
      start_date: i,
      end_date: o
    });
  }
};
ti.TOKEN = "834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d", ti.BASE_URL = "http://api.tushare.pro";
let Te = ti;
const { autoUpdater: Ge } = Zw, uT = Cf(import.meta.url), Lo = J.dirname(uT), Kn = process.env.NODE_ENV === "development" || !Ce.isPackaged;
let b = null, xr = null;
const Ss = Ce;
let mt = !1, ot = !1, Oe = null, Ft = 8080, qe = "", st = "";
Ge.autoDownload = !1;
Ge.autoInstallOnAppQuit = !0;
function Ul() {
  Kn || vf.defaultSession.webRequest.onHeadersReceived((e, t) => {
    t({
      responseHeaders: {
        ...e.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.tushare.pro https://github.com;"
        ]
      }
    });
  }), b = new Ml({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "酷咖啡",
    webPreferences: {
      preload: J.join(Lo, "preload.cjs"),
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !1,
      webSecurity: !0,
      webviewTag: !0
      // 启用 webview 标签
    },
    show: !1,
    backgroundColor: "#ffffff"
  }), b.webContents.on("console-message", (e, t, n, r, i) => {
    const s = {
      0: "LOG",
      1: "INFO",
      2: "WARN",
      3: "ERROR"
    }[t] || "UNKNOWN", a = i ? `[${i}]` : "", l = r ? `:${r}` : "";
    switch (t) {
      case 0:
        console.log(`[Renderer ${s}]${a}${l} ${n}`);
        break;
      case 1:
        console.info(`[Renderer ${s}]${a}${l} ${n}`);
        break;
      case 2:
        console.warn(`[Renderer ${s}]${a}${l} ${n}`);
        break;
      case 3:
        console.error(`[Renderer ${s}]${a}${l} ${n}`);
        break;
      default:
        console.log(`[Renderer ${s}]${a}${l} ${n}`);
    }
  }), b.once("ready-to-show", () => {
    b == null || b.show(), Le.isSupported() && new Le({
      title: "酷咖啡",
      body: "应用已启动，准备好为您服务！"
    }).show();
  }), Kn ? (b.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173"), b.webContents.openDevTools()) : b.loadFile(J.join(Lo, "../dist/index.html")), b.on("close", (e) => {
    Ss.isQuitting || (e.preventDefault(), b == null || b.hide());
  }), b.on("closed", () => {
    b = null;
  });
}
function dT() {
  const e = Kn ? J.join(Lo, "../build/tray-icon.png") : J.join(process.resourcesPath, "build/tray-icon.png");
  let t;
  try {
    t = xi.createFromPath(e), t.isEmpty() && (t = xi.createEmpty());
  } catch (r) {
    console.error("创建托盘图标失败:", r), t = xi.createEmpty();
  }
  xr = new wf(t), xr.setToolTip("酷咖啡");
  const n = Tf.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        b == null || b.show();
      }
    },
    { type: "separator" },
    {
      label: "关于",
      click: () => {
        Le.isSupported() && new Le({
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
        Ss.isQuitting = !0, Ce.quit();
      }
    }
  ]);
  xr.setContextMenu(n), xr.on("click", () => {
    b != null && b.isVisible() ? b.hide() : b == null || b.show();
  });
}
function fT() {
  Bl.register("CommandOrControl+Shift+S", () => {
    b != null && b.isVisible() ? b.hide() : b == null || b.show();
  });
}
async function hT() {
  return console.log("Incremental sync is deprecated. Data is now fetched in real-time from Tushare API."), { status: "success", message: "数据现在实时从服务端获取，无需同步", totalSynced: 0 };
}
async function pT() {
  try {
    const e = cr();
    if (e > 0) {
      console.log(`Stock list already synced: ${e} stocks`);
      return;
    }
    console.log("Stock list is empty, syncing...");
    const t = await Te.getStockList(void 0, void 0, void 0, void 0, void 0, "L", 5e3, 0);
    t && t.length > 0 && (ps(t), console.log(`Synced ${t.length} stocks to database`), Le.isSupported() && new Le({
      title: "股票列表同步完成",
      body: `已同步 ${t.length} 只股票`
    }).show());
  } catch (e) {
    console.error("Failed to sync stocks:", e);
  }
}
async function mT(e, t, n, r, i, o) {
  const s = Ii();
  let a = s;
  i && i !== "all" && (a = s.filter((g) => g.market === i));
  let l = [];
  (!o && n && r ? ln(null, n, r) : !1) ? (console.log(`[DB Cache Hit] 从数据库读取公告: ${n} - ${r}`), l = k.prepare(
    `
      SELECT * FROM announcements 
      WHERE ann_date >= ? AND ann_date <= ?
      ORDER BY ann_date DESC, rec_time DESC
    `
  ).all(n, r), console.log(`[DB Cache Hit] 从数据库读取到 ${l.length} 条公告`)) : (console.log(o ? `[Force Refresh] 强制从 API 获取公告: ${n || "无"} - ${r || "无"}` : `[DB Cache Miss] 从 API 获取公告: ${n || "无"} - ${r || "无"}`), n && r ? (console.log(`[getAnnouncementsGroupedFromAPI] 使用完整获取方式获取公告: ${n} - ${r}`), l = await Te.getAnnouncementsComplete(
    void 0,
    // 全市场
    n,
    r,
    (g, v, S) => {
      console.log(`[getAnnouncementsGroupedFromAPI] ${g}`);
    }
  )) : l = await Te.getAnnouncements(void 0, void 0, n, r, 2e3, 0), l.length > 0 && (console.log(`[DB Cache] 保存 ${l.length} 条公告到数据库`), Oi(l), n && r && (vs(null, n, r), console.log(`[DB Cache] 记录同步范围: ${n} - ${r}`))));
  const c = /* @__PURE__ */ new Map();
  a.forEach((g) => {
    c.set(g.ts_code, {
      ts_code: g.ts_code,
      stock_name: g.name,
      industry: g.industry || "",
      market: g.market || "",
      announcements: []
    });
  }), l.forEach((g) => {
    const v = c.get(g.ts_code);
    v && v.announcements.push(g);
  });
  const u = Array.from(c.values()).map((g) => {
    if (g.announcements.length === 0)
      return null;
    g.announcements.sort((C, P) => {
      const L = (P.ann_date || "").localeCompare(C.ann_date || "");
      return L !== 0 ? L : (P.pub_time || "").localeCompare(C.pub_time || "");
    });
    const v = {};
    g.announcements.forEach((C) => {
      const P = En(C.title);
      v[P] = (v[P] || 0) + 1;
    });
    const S = g.announcements[0];
    return {
      ts_code: g.ts_code,
      stock_name: g.stock_name,
      industry: g.industry,
      market: g.market,
      announcement_count: g.announcements.length,
      latest_ann_date: S.ann_date,
      latest_ann_title: S.title,
      category_stats: v
    };
  }).filter((g) => g !== null).sort((g, v) => {
    const S = ((v == null ? void 0 : v.latest_ann_date) || "").localeCompare((g == null ? void 0 : g.latest_ann_date) || "");
    return S !== 0 ? S : ((g == null ? void 0 : g.stock_name) || "").localeCompare((v == null ? void 0 : v.stock_name) || "");
  }), f = u.length, y = (e - 1) * t;
  return { items: u.slice(y, y + t), total: f };
}
async function gT(e, t, n, r, i, o) {
  const s = ms(e, 1e3);
  let a = s;
  if (o && o !== "all" && (a = s.filter((g) => g.market === o)), a.length === 0)
    return { items: [], total: 0 };
  const l = a.map((g) => g.ts_code).join(","), h = await Te.getAnnouncements(l, void 0, r, i, 2e3, 0), c = /* @__PURE__ */ new Map();
  a.forEach((g) => {
    c.set(g.ts_code, {
      ts_code: g.ts_code,
      stock_name: g.name,
      industry: g.industry || "",
      market: g.market || "",
      announcements: []
    });
  }), h.forEach((g) => {
    const v = c.get(g.ts_code);
    v && v.announcements.push(g);
  });
  const u = Array.from(c.values()).map((g) => {
    if (g.announcements.length === 0)
      return null;
    g.announcements.sort((C, P) => {
      const L = (P.ann_date || "").localeCompare(C.ann_date || "");
      return L !== 0 ? L : (P.pub_time || "").localeCompare(C.pub_time || "");
    });
    const v = {};
    g.announcements.forEach((C) => {
      const P = En(C.title);
      v[P] = (v[P] || 0) + 1;
    });
    const S = g.announcements[0];
    return {
      ts_code: g.ts_code,
      stock_name: g.stock_name,
      industry: g.industry,
      market: g.market,
      announcement_count: g.announcements.length,
      latest_ann_date: S.ann_date,
      latest_ann_title: S.title,
      category_stats: v
    };
  }).filter((g) => g !== null).sort((g, v) => {
    const S = ((v == null ? void 0 : v.latest_ann_date) || "").localeCompare((g == null ? void 0 : g.latest_ann_date) || "");
    return S !== 0 ? S : ((g == null ? void 0 : g.stock_name) || "").localeCompare((v == null ? void 0 : v.stock_name) || "");
  }), f = u.length, y = (t - 1) * n;
  return { items: u.slice(y, y + n), total: f };
}
async function yT(e, t, n, r) {
  const i = gs();
  if (i.length === 0)
    return { items: [], total: 0 };
  const s = Ii().filter((E) => i.includes(E.ts_code));
  let a = [];
  if (n && r ? ln(null, n, r) : !1) {
    console.log(`[DB Cache Hit] 从数据库读取关注股票公告: ${n} - ${r}`);
    const g = `
			SELECT * FROM announcements 
			WHERE ts_code IN (${i.map(() => "?").join(",")})
			AND ann_date >= ? AND ann_date <= ?
			ORDER BY ann_date DESC, rec_time DESC
		`;
    a = k.prepare(g).all(...i, n, r), console.log(`[DB Cache Hit] 从数据库读取到 ${a.length} 条关注股票公告`);
  } else {
    console.log(`[DB Cache Miss] 从 API 获取关注股票公告: ${n || "无"} - ${r || "无"}`);
    for (const E of i)
      try {
        const g = await Te.getAnnouncements(E, void 0, n, r, 2e3, 0);
        a.push(...g), i.length > 1 && await new Promise((v) => setTimeout(v, 200));
      } catch (g) {
        console.error(`Failed to get announcements for ${E}:`, g);
      }
    a.length > 0 && (console.log(`[DB Cache] 保存 ${a.length} 条关注股票公告到数据库`), Oi(a));
  }
  const h = /* @__PURE__ */ new Map();
  s.forEach((E) => {
    h.set(E.ts_code, {
      ts_code: E.ts_code,
      stock_name: E.name,
      industry: E.industry || "",
      market: E.market || "",
      announcements: []
    });
  }), a.forEach((E) => {
    const g = h.get(E.ts_code);
    g && g.announcements.push(E);
  });
  const c = Array.from(h.values()).map((E) => {
    if (E.announcements.length === 0)
      return null;
    E.announcements.sort((S, C) => {
      const P = (C.ann_date || "").localeCompare(S.ann_date || "");
      return P !== 0 ? P : (C.pub_time || "").localeCompare(S.pub_time || "");
    });
    const g = {};
    E.announcements.forEach((S) => {
      const C = En(S.title);
      g[C] = (g[C] || 0) + 1;
    });
    const v = E.announcements[0];
    return {
      ts_code: E.ts_code,
      stock_name: E.stock_name,
      industry: E.industry,
      market: E.market,
      announcement_count: E.announcements.length,
      latest_ann_date: v.ann_date,
      latest_ann_title: v.title,
      category_stats: g
    };
  }).filter((E) => E !== null).sort((E, g) => {
    const v = ((g == null ? void 0 : g.latest_ann_date) || "").localeCompare((E == null ? void 0 : E.latest_ann_date) || "");
    return v !== 0 ? v : ((E == null ? void 0 : E.stock_name) || "").localeCompare((g == null ? void 0 : g.stock_name) || "");
  }), u = c.length, f = (e - 1) * t;
  return { items: c.slice(f, f + t), total: u };
}
async function gd() {
  try {
    console.log("Starting full stock list sync..."), b == null || b.webContents.send("stock-list-sync-progress", {
      status: "started",
      message: "开始同步股票列表..."
    });
    const e = await Te.getStockList(void 0, void 0, void 0, void 0, void 0, "L", 5e3, 0);
    if (e && e.length > 0) {
      b == null || b.webContents.send("stock-list-sync-progress", {
        status: "syncing",
        message: `正在同步 ${e.length} 只股票...`,
        total: e.length,
        current: 0
      }), ps(e), console.log(`Synced ${e.length} stocks to database`);
      const t = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
      return od("stock_list", t), b == null || b.webContents.send("stock-list-sync-progress", {
        status: "completed",
        message: `成功同步 ${e.length} 只股票`,
        total: e.length,
        current: e.length,
        stockCount: e.length
      }), Le.isSupported() && new Le({
        title: "股票列表同步完成",
        body: `已同步 ${e.length} 只股票`
      }).show(), {
        success: !0,
        stockCount: e.length,
        message: `成功同步 ${e.length} 只股票`
      };
    } else
      return b == null || b.webContents.send("stock-list-sync-progress", {
        status: "failed",
        message: "未获取到股票数据"
      }), {
        success: !1,
        stockCount: 0,
        message: "未获取到股票数据"
      };
  } catch (e) {
    return console.error("Failed to sync stocks:", e), b == null || b.webContents.send("stock-list-sync-progress", {
      status: "failed",
      message: e.message || "同步失败",
      error: e.message
    }), {
      success: !1,
      stockCount: 0,
      message: e.message || "同步失败"
    };
  }
}
function ET() {
  B.handle("show-notification", async (t, n, r) => {
    Le.isSupported() && new Le({ title: n, body: r }).show();
  }), B.handle("get-app-version", async () => Ce.getVersion()), B.handle(
    "get-announcements-grouped",
    async (t, n, r, i, o, s, a) => {
      try {
        console.log(
          `[IPC] get-announcements-grouped: page=${n}, pageSize=${r}, dateRange=${i}-${o}, market=${s}, forceRefresh=${a}`
        );
        const l = await mT(n, r, i, o, s, a);
        return console.log(`[IPC] get-announcements-grouped: page=${n}, items=${l.items.length}, total=${l.total}`), {
          items: l.items,
          total: l.total,
          page: n,
          pageSize: r
        };
      } catch (l) {
        throw console.error("Failed to get grouped announcements:", l), l;
      }
    }
  ), B.handle("get-stock-announcements", async (t, n, r = 100, i, o) => {
    try {
      console.log(`[IPC] get-stock-announcements: tsCode=${n}, limit=${r}, dateRange=${i}-${o}`);
      const s = await Te.getAnnouncements(n, void 0, i, o, r, 0);
      return s.sort((a, l) => {
        const h = (l.ann_date || "").localeCompare(a.ann_date || "");
        return h !== 0 ? h : (l.pub_time || "").localeCompare(a.pub_time || "");
      }), s.map((a) => ({
        ts_code: a.ts_code,
        ann_date: a.ann_date,
        ann_type: a.ann_type,
        title: a.title,
        content: a.content,
        pub_time: a.pub_time,
        category: En(a.title)
        // 添加分类信息
      }));
    } catch (s) {
      throw console.error("Failed to get stock announcements:", s), s;
    }
  }), B.handle(
    "search-announcements-grouped",
    async (t, n, r, i, o, s, a) => {
      try {
        console.log(
          `[IPC] search-announcements-grouped: keyword=${n}, page=${r}, pageSize=${i}, dateRange=${o}-${s}, market=${a}`
        );
        const l = await gT(n, r, i, o, s, a);
        return console.log(
          `[IPC] search-announcements-grouped: keyword=${n}, page=${r}, items=${l.items.length}, total=${l.total}`
        ), {
          items: l.items,
          total: l.total,
          page: r,
          pageSize: i
        };
      } catch (l) {
        throw console.error("Failed to search grouped announcements:", l), l;
      }
    }
  ), B.handle("get-latest-trade-date", async () => {
    try {
      const n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ""), r = /* @__PURE__ */ new Date();
      r.setDate(r.getDate() - 30);
      const i = r.toISOString().slice(0, 10).replace(/-/g, "");
      console.log(`[IPC] get-latest-trade-date: fetching from ${i} to ${n}`);
      const o = await Te.getTradeCalendar("SSE", i, n, "1");
      if (o && o.length > 0) {
        const s = o.filter((a) => a.is_open === "1" || a.is_open === 1).sort((a, l) => l.cal_date.localeCompare(a.cal_date));
        if (s.length > 0) {
          const a = s[0].cal_date;
          return console.log(`[IPC] get-latest-trade-date: found ${a}`), a;
        }
      }
      return console.log("[IPC] get-latest-trade-date: no trade date found, returning today"), n;
    } catch (t) {
      return console.error("Failed to get latest trade date:", t), (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    }
  }), B.handle("get-announcement-pdf", async (t, n, r, i) => {
    try {
      console.log(`[IPC] get-announcement-pdf: tsCode=${n}, annDate=${r}, title=${i}`);
      const o = await Te.getAnnouncementFiles(n, r);
      console.log(`[IPC] Found ${o.length} announcements for ${n} on ${r}`);
      let s = o.find((a) => a.title === i);
      return s || (s = o.find((a) => {
        const l = a.title || "", h = i || "";
        return l.includes(h) || h.includes(l);
      })), s && s.url ? (console.log(`[IPC] Found PDF URL: ${s.url}`), {
        success: !0,
        url: s.url
      }) : (console.log(`[IPC] No PDF found for announcement: ${i}`), {
        success: !1,
        message: "该公告暂无 PDF 文件"
      });
    } catch (o) {
      return console.error("Failed to get announcement PDF:", o), {
        success: !1,
        message: o.message || "获取 PDF 失败"
      };
    }
  }), B.handle("open-external", async (t, n) => {
    try {
      return console.log(`[IPC] open-external: ${n}`), await Sf.openExternal(n), { success: !0 };
    } catch (r) {
      return console.error("Failed to open external URL:", r), {
        success: !1,
        message: r.message || "打开链接失败"
      };
    }
  }), B.handle("get-db-connection-info", async () => {
    try {
      const t = $o(), n = Oe !== null, r = n ? `http://localhost:${Ft}` : null, i = !!(qe && st);
      return console.log(`[IPC] get-db-connection-info: ${t}`), {
        success: !0,
        dbPath: t,
        connectionString: `sqlite://${t}`,
        httpServerUrl: r,
        isServerRunning: n,
        port: Ft,
        hasAuth: i,
        username: qe || null,
        password: i ? st : ""
      };
    } catch (t) {
      return console.error("Failed to get DB connection info:", t), {
        success: !1,
        message: t.message || "获取数据库信息失败"
      };
    }
  }), B.handle("start-sqlite-http-server", async (t, n) => {
    try {
      if (Oe)
        return {
          success: !1,
          message: "HTTP 服务器已在运行",
          port: Ft
        };
      const r = n || Ft, i = $o(), s = (await Promise.resolve().then(() => cT)).default;
      return Oe = Of(async (a, l) => {
        if (l.setHeader("Access-Control-Allow-Origin", "*"), l.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"), l.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"), l.setHeader("Content-Type", "application/json; charset=utf-8"), a.method === "OPTIONS") {
          l.writeHead(200), l.end();
          return;
        }
        if (qe && st) {
          const h = a.headers.authorization;
          if (!h || !h.startsWith("Basic ")) {
            l.writeHead(401, { "WWW-Authenticate": 'Basic realm="SQLite Database"' }), l.end(JSON.stringify({ error: "Authentication required" }));
            return;
          }
          const c = Buffer.from(h.substring(6), "base64").toString("utf-8"), [u, f] = c.split(":");
          if (u !== qe || f !== st) {
            l.writeHead(401, { "WWW-Authenticate": 'Basic realm="SQLite Database"' }), l.end(JSON.stringify({ error: "Invalid credentials" }));
            return;
          }
        }
        try {
          const c = new Af(a.url || "/", `http://${a.headers.host}`).pathname;
          if (c === "/health" || c === "/") {
            l.writeHead(200), l.end(
              JSON.stringify({
                status: "ok",
                database: i,
                port: r,
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              })
            );
            return;
          }
          if (c === "/query" && a.method === "POST") {
            let u = "";
            a.on("data", (f) => {
              u += f.toString();
            }), a.on("end", () => {
              try {
                const { sql: f, params: y = [] } = JSON.parse(u);
                if (!f || typeof f != "string") {
                  l.writeHead(400), l.end(JSON.stringify({ error: "SQL query is required" }));
                  return;
                }
                if (!f.trim().toUpperCase().startsWith("SELECT")) {
                  l.writeHead(403), l.end(JSON.stringify({ error: "Only SELECT queries are allowed" }));
                  return;
                }
                const E = s.prepare(f), g = y.length > 0 ? E.all(...y) : E.all();
                l.writeHead(200), l.end(JSON.stringify({ success: !0, data: g }));
              } catch (f) {
                l.writeHead(500), l.end(JSON.stringify({ error: f.message || "Query execution failed" }));
              }
            });
            return;
          }
          if (c === "/tables" && a.method === "GET") {
            const u = s.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
            l.writeHead(200), l.end(JSON.stringify({ success: !0, data: u.map((f) => f.name) }));
            return;
          }
          if (c.startsWith("/table/") && a.method === "GET") {
            const u = c.split("/")[2];
            if (!u) {
              l.writeHead(400), l.end(JSON.stringify({ error: "Table name is required" }));
              return;
            }
            const f = s.prepare(`PRAGMA table_info(${u})`).all();
            l.writeHead(200), l.end(JSON.stringify({ success: !0, data: f }));
            return;
          }
          l.writeHead(404), l.end(JSON.stringify({ error: "Not found" }));
        } catch (h) {
          l.writeHead(500), l.end(JSON.stringify({ error: h.message || "Internal server error" }));
        }
      }), Oe.listen(r, () => {
        const a = qe && st ? ` (认证: ${qe})` : " (无认证)";
        console.log(`[SQLite HTTP Server] Started on http://localhost:${r}${a}`), b == null || b.webContents.send("sqlite-http-server-started", {
          port: r,
          hasAuth: !!(qe && st),
          username: qe || null
        });
      }), Oe.on("error", (a) => {
        console.error("[SQLite HTTP Server] Error:", a), a.code === "EADDRINUSE" && (b == null || b.webContents.send("sqlite-http-server-error", {
          message: `端口 ${r} 已被占用`
        }));
      }), Ft = r, {
        success: !0,
        port: r,
        url: `http://localhost:${r}`
      };
    } catch (r) {
      return console.error("Failed to start SQLite HTTP server:", r), {
        success: !1,
        message: r.message || "启动 HTTP 服务器失败"
      };
    }
  }), B.handle("stop-sqlite-http-server", async () => {
    try {
      return Oe ? new Promise((t) => {
        Oe == null || Oe.close(() => {
          console.log("[SQLite HTTP Server] Stopped"), Oe = null, b == null || b.webContents.send("sqlite-http-server-stopped"), t({
            success: !0,
            message: "HTTP 服务器已停止"
          });
        });
      }) : {
        success: !1,
        message: "HTTP 服务器未运行"
      };
    } catch (t) {
      return console.error("Failed to stop SQLite HTTP server:", t), {
        success: !1,
        message: t.message || "停止 HTTP 服务器失败"
      };
    }
  }), B.handle("get-sqlite-http-server-status", async () => ({
    isRunning: Oe !== null,
    port: Ft,
    url: Oe ? `http://localhost:${Ft}` : null,
    hasAuth: !!(qe && st),
    username: qe || null
  })), B.handle("set-sqlite-http-auth", async (t, n, r) => {
    try {
      return !n || !r ? {
        success: !1,
        message: "用户名和密码不能为空"
      } : (qe = n, st = r, console.log(`[SQLite HTTP Server] Auth configured: username=${n}`), {
        success: !0,
        message: "认证信息已设置"
      });
    } catch (i) {
      return console.error("Failed to set auth:", i), {
        success: !1,
        message: i.message || "设置认证信息失败"
      };
    }
  }), B.handle("clear-sqlite-http-auth", async () => {
    try {
      return qe = "", st = "", console.log("[SQLite HTTP Server] Auth cleared"), {
        success: !0,
        message: "认证信息已清除"
      };
    } catch (t) {
      return console.error("Failed to clear auth:", t), {
        success: !1,
        message: t.message || "清除认证信息失败"
      };
    }
  }), B.handle("check-for-updates", async () => {
    if (Kn)
      return { available: !1, message: "开发环境不检查更新" };
    try {
      const t = await Ge.checkForUpdates();
      return { available: !0, updateInfo: t == null ? void 0 : t.updateInfo };
    } catch (t) {
      return console.error("检查更新失败:", t), { available: !1, error: t.message };
    }
  }), B.handle("download-update", async () => {
    try {
      return await Ge.downloadUpdate(), { success: !0 };
    } catch (t) {
      return console.error("下载更新失败:", t), { success: !1, error: t.message };
    }
  }), B.handle("install-update", async () => {
    Ge.quitAndInstall();
  }), B.handle("add-favorite-stock", async (t, n) => {
    try {
      return console.log(`[IPC] add-favorite-stock: tsCode=${n}`), { success: td(n) };
    } catch (r) {
      return console.error("Failed to add favorite stock:", r), { success: !1, message: r.message };
    }
  }), B.handle("remove-favorite-stock", async (t, n) => {
    try {
      return console.log(`[IPC] remove-favorite-stock: tsCode=${n}`), { success: nd(n) };
    } catch (r) {
      return console.error("Failed to remove favorite stock:", r), { success: !1, message: r.message };
    }
  }), B.handle("is-favorite-stock", async (t, n) => {
    try {
      return rd(n);
    } catch (r) {
      return console.error("Failed to check favorite stock:", r), !1;
    }
  }), B.handle("get-all-favorite-stocks", async () => {
    try {
      return gs();
    } catch (t) {
      return console.error("Failed to get favorite stocks:", t), [];
    }
  }), B.handle("count-favorite-stocks", async () => {
    try {
      return ys();
    } catch (t) {
      return console.error("Failed to count favorite stocks:", t), 0;
    }
  }), B.handle(
    "get-favorite-stocks-announcements-grouped",
    async (t, n, r, i, o) => {
      try {
        console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${n}, pageSize=${r}, dateRange=${i}-${o}`);
        const s = await yT(n, r, i, o);
        return console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${n}, items=${s.items.length}, total=${s.total}`), {
          items: s.items,
          total: s.total,
          page: n,
          pageSize: r
        };
      } catch (s) {
        throw console.error("Failed to get favorite stocks announcements:", s), s;
      }
    }
  ), B.handle("get-news", async (t, n, r, i) => {
    try {
      return console.log(`[IPC] get-news: src=${n}, startDate=${r}, endDate=${i}`), await Te.getNews(n, r, i);
    } catch (o) {
      throw console.error("Failed to get news:", o), o;
    }
  }), B.handle("get-top10-holders", async (t, n, r, i, o, s) => {
    try {
      return console.log(
        `[IPC] get-top10-holders: tsCode=${n}, period=${r}, annDate=${i}, startDate=${o}, endDate=${s}`
      ), await Te.getTop10Holders(n, r, i, o, s);
    } catch (a) {
      throw console.error("Failed to get top10 holders:", a), a;
    }
  }), B.handle("search-stocks", async (t, n, r = 50) => {
    try {
      return console.log(`[IPC] search-stocks: keyword=${n}, limit=${r}`), ms(n, r);
    } catch (i) {
      throw console.error("Failed to search stocks:", i), i;
    }
  }), B.handle("sync-all-top10-holders", async (t) => {
    var n, r;
    if (mt)
      return { status: "skipped", message: "同步正在进行中" };
    mt = !0, ot = !1, console.log("[IPC] Starting sync all top10 holders...");
    try {
      const i = Ii(), o = i.length;
      if (o === 0)
        return { status: "failed", message: "没有股票数据，请先同步股票列表" };
      console.log(`[IPC] Total stocks to sync: ${o}`);
      let s = 0, a = 0, l = 0;
      for (let h = 0; h < i.length; h++) {
        for (; ot && mt; )
          await new Promise((u) => setTimeout(u, 500));
        if (!mt)
          return console.log("[IPC] Sync stopped by user"), {
            status: "stopped",
            message: `同步已停止。成功：${s}，跳过：${a}，失败：${l}`,
            successCount: s,
            skipCount: a,
            failCount: l,
            totalStocks: o
          };
        const c = i[h];
        if (Do(c.ts_code)) {
          a++, console.log(`[${h + 1}/${o}] Skip ${c.ts_code} ${c.name} - already synced`), b == null || b.webContents.send("top10-holders-sync-progress", {
            current: h + 1,
            total: o,
            tsCode: c.ts_code,
            name: c.name,
            status: "skipped",
            successCount: s,
            skipCount: a,
            failCount: l
          });
          continue;
        }
        try {
          const u = await Te.getTop10Holders(c.ts_code);
          u && u.length > 0 ? (Po(u), s++, console.log(`[${h + 1}/${o}] Success ${c.ts_code} ${c.name} - ${u.length} holders`)) : (a++, console.log(`[${h + 1}/${o}] Skip ${c.ts_code} ${c.name} - no data`)), b == null || b.webContents.send("top10-holders-sync-progress", {
            current: h + 1,
            total: o,
            tsCode: c.ts_code,
            name: c.name,
            status: "success",
            successCount: s,
            skipCount: a,
            failCount: l
          }), await new Promise((f) => setTimeout(f, 200));
        } catch (u) {
          l++, console.error(`[${h + 1}/${o}] Failed ${c.ts_code} ${c.name}:`, u.message), b == null || b.webContents.send("top10-holders-sync-progress", {
            current: h + 1,
            total: o,
            tsCode: c.ts_code,
            name: c.name,
            status: "failed",
            error: u.message,
            successCount: s,
            skipCount: a,
            failCount: l
          }), ((n = u.message) != null && n.includes("限流") || (r = u.message) != null && r.includes("频繁")) && (console.log("API 限流，等待 5 秒后继续..."), await new Promise((f) => setTimeout(f, 5e3)));
        }
      }
      return console.log(`[IPC] Sync completed: success=${s}, skip=${a}, fail=${l}`), {
        status: "success",
        message: `同步完成：成功 ${s}，跳过 ${a}，失败 ${l}`,
        successCount: s,
        skipCount: a,
        failCount: l,
        totalStocks: o
      };
    } catch (i) {
      return console.error("Failed to sync all top10 holders:", i), { status: "failed", message: i.message || "同步失败" };
    } finally {
      mt = !1, ot = !1;
    }
  }), B.handle("toggle-pause-top10-holders-sync", async () => {
    if (!mt)
      return { status: "failed", message: "没有正在进行的同步任务" };
    ot = !ot;
    const t = ot ? "paused" : "resumed", n = ot ? "同步已暂停" : "同步已恢复";
    return console.log(`[IPC] Sync ${t}`), { status: t, message: n, isPaused: ot };
  }), B.handle("stop-top10-holders-sync", async () => mt ? (mt = !1, ot = !1, console.log("[IPC] Sync stopped by user"), { status: "success", message: "同步已停止" }) : { status: "failed", message: "没有正在进行的同步任务" }), B.handle("sync-stock-top10-holders", async (t, n) => {
    try {
      console.log(`[IPC] sync-stock-top10-holders: tsCode=${n}`), ud(n);
      const r = await Te.getTop10Holders(n);
      return r && r.length > 0 ? (Po(r), console.log(`[IPC] Synced ${r.length} holders for ${n}`), {
        status: "success",
        message: `成功同步 ${r.length} 条股东数据`,
        count: r.length
      }) : {
        status: "success",
        message: "该股票暂无十大股东数据",
        count: 0
      };
    } catch (r) {
      return console.error("Failed to sync stock top10 holders:", r), {
        status: "failed",
        message: r.message || "同步失败"
      };
    }
  }), B.handle("get-top10-holders-from-db", async (t, n, r = 100) => {
    try {
      return console.log(`[IPC] get-top10-holders-from-db: tsCode=${n}, limit=${r}`), sd(n, r);
    } catch (i) {
      throw console.error("Failed to get top10 holders from db:", i), i;
    }
  }), B.handle("has-top10-holders-data", async (t, n) => {
    try {
      return Do(n);
    } catch (r) {
      return console.error("Failed to check top10 holders data:", r), !1;
    }
  }), B.handle("get-top10-holders-sync-stats", async () => {
    try {
      const t = cr(), n = _s(), r = cd();
      return {
        totalStocks: t,
        syncedStocks: n,
        syncedStockCodes: r,
        syncRate: t > 0 ? (n / t * 100).toFixed(2) : "0"
      };
    } catch (t) {
      throw console.error("Failed to get top10 holders sync stats:", t), t;
    }
  }), B.handle("get-top10-holders-end-dates", async (t, n) => {
    try {
      return console.log(`[IPC] get-top10-holders-end-dates: tsCode=${n}`), ad(n);
    } catch (r) {
      return console.error("Failed to get top10 holders end dates:", r), [];
    }
  }), B.handle("get-top10-holders-by-end-date", async (t, n, r) => {
    try {
      return console.log(`[IPC] get-top10-holders-by-end-date: tsCode=${n}, endDate=${r}`), ld(n, r);
    } catch (i) {
      return console.error("Failed to get top10 holders by end date:", i), [];
    }
  }), B.handle("get-stock-list-sync-info", async () => {
    try {
      return console.log("[IPC] get-stock-list-sync-info"), ei();
    } catch (t) {
      throw console.error("Failed to get stock list sync info:", t), t;
    }
  }), B.handle("sync-all-stocks", async () => {
    try {
      return console.log("[IPC] sync-all-stocks"), await gd();
    } catch (t) {
      return console.error("Failed to sync all stocks:", t), {
        success: !1,
        stockCount: 0,
        message: t.message || "同步失败"
      };
    }
  }), B.handle("check-stock-list-sync-status", async () => {
    try {
      console.log("[IPC] check-stock-list-sync-status");
      const t = Es("stock_list"), n = ei();
      return {
        isSyncedToday: t,
        stockCount: n.stockCount,
        lastSyncTime: n.lastSyncTime
      };
    } catch (t) {
      return console.error("Failed to check stock list sync status:", t), {
        isSyncedToday: !1,
        stockCount: 0,
        lastSyncTime: null
      };
    }
  }), B.handle("get-cache-data-stats", async () => {
    try {
      return console.log("[IPC] get-cache-data-stats"), md();
    } catch (t) {
      return console.error("Failed to get cache data stats:", t), {
        stocks: { count: 0, lastSyncTime: null },
        favoriteStocks: { count: 0 },
        top10Holders: { stockCount: 0, recordCount: 0 },
        syncFlags: []
      };
    }
  }), B.handle("get-untagged-count", async () => {
    try {
      return { success: !0, count: Ts() };
    } catch (t) {
      return console.error("Failed to get untagged count:", t), { success: !1, error: t.message, count: 0 };
    }
  }), B.handle("tag-all-announcements", async (t, n = 1e3) => {
    try {
      return fd(n, (i, o) => {
        b == null || b.webContents.send("tagging-progress", {
          processed: i,
          total: o,
          percentage: (i / o * 100).toFixed(2)
        });
      });
    } catch (r) {
      return console.error("Failed to tag announcements:", r), { success: !1, error: r.message, processed: 0, total: 0 };
    }
  }), B.handle(
    "get-announcements-with-cache",
    async (t, n, r, i, o) => {
      try {
        if (console.log(`[IPC] get-announcements-with-cache: tsCode=${n || "all"}, startDate=${r}, endDate=${i}`), ln(n, r, i)) {
          console.log(`[IPC] 时间范围 ${r}-${i} 已缓存，从本地读取`);
          const l = Hr(r, i, n || void 0);
          return {
            success: !0,
            data: l,
            source: "cache",
            count: l.length
          };
        }
        const s = Fo(n, r, i);
        console.log(
          `[IPC] 需要同步 ${s.length} 个时间段:`,
          s.map((l) => `${l.start_date}-${l.end_date}`)
        );
        for (const l of s) {
          console.log(`[IPC] 开始同步时间段: ${l.start_date} - ${l.end_date}`);
          const h = await Te.getAnnouncementsIterative(
            n || void 0,
            l.start_date,
            l.end_date,
            o ? (c, u) => {
              b == null || b.webContents.send("announcement-sync-progress", {
                tsCode: n || "all",
                startDate: l.start_date,
                endDate: l.end_date,
                currentBatch: c,
                totalFetched: u
              });
            } : void 0
          );
          h.length > 0 && (Oi(h), console.log(`[IPC] 已缓存 ${h.length} 条公告到本地数据库`)), vs(n, l.start_date, l.end_date);
        }
        const a = Hr(r, i, n || void 0);
        return console.log(`[IPC] 返回 ${a.length} 条公告（来源：API + 缓存）`), {
          success: !0,
          data: a,
          source: "api",
          count: a.length
        };
      } catch (s) {
        return console.error("Failed to get announcements with cache:", s), {
          success: !1,
          error: s.message || "获取公告失败",
          data: [],
          source: "error",
          count: 0
        };
      }
    }
  ), B.handle("get-announcements-from-cache", async (t, n, r, i) => {
    try {
      console.log(`[IPC] get-announcements-from-cache: tsCode=${n || "all"}, startDate=${r}, endDate=${i}`);
      const o = Hr(r, i, n || void 0), s = ln(n, r, i);
      return {
        success: !0,
        data: o,
        isCached: s,
        count: o.length
      };
    } catch (o) {
      return console.error("Failed to get announcements from cache:", o), {
        success: !1,
        error: o.message || "读取缓存失败",
        data: [],
        isCached: !1,
        count: 0
      };
    }
  }), B.handle("check-announcement-range-synced", async (t, n, r, i) => {
    try {
      console.log(`[IPC] check-announcement-range-synced: tsCode=${n || "all"}, startDate=${r}, endDate=${i}`);
      const o = ln(n, r, i), s = o ? [] : Fo(n, r, i);
      return {
        success: !0,
        isSynced: o,
        unsyncedRanges: s
      };
    } catch (o) {
      return console.error("Failed to check announcement range:", o), {
        success: !1,
        error: o.message || "检查失败",
        isSynced: !1,
        unsyncedRanges: []
      };
    }
  }), B.handle("search-announcements-from-cache", async (t, n, r = 100) => {
    try {
      console.log(`[IPC] search-announcements-from-cache: keyword=${n}, limit=${r}`);
      const i = dd(n, r);
      return {
        success: !0,
        data: i,
        count: i.length
      };
    } catch (i) {
      return console.error("Failed to search announcements:", i), {
        success: !1,
        error: i.message || "搜索失败",
        data: [],
        count: 0
      };
    }
  }), B.handle("get-announcements-cache-stats", async () => {
    try {
      return console.log("[IPC] get-announcements-cache-stats"), {
        success: !0,
        totalCount: ws()
      };
    } catch (t) {
      return console.error("Failed to get announcements cache stats:", t), {
        success: !1,
        error: t.message || "获取统计失败",
        totalCount: 0
      };
    }
  });
  const e = () => {
    const t = Ce.getPath("userData");
    return J.join(t, "column-widths.json");
  };
  B.handle("save-column-widths", async (t, n, r) => {
    try {
      const i = e();
      let o = {};
      if (Be.existsSync(i)) {
        const s = Be.readFileSync(i, "utf-8");
        o = JSON.parse(s);
      }
      return o[n] = r, Be.writeFileSync(i, JSON.stringify(o, null, 2), "utf-8"), console.log(`[IPC] save-column-widths: tableId=${n}, columns=${Object.keys(r).length}`), { success: !0 };
    } catch (i) {
      return console.error("Failed to save column widths:", i), {
        success: !1,
        error: i.message || "保存列宽配置失败"
      };
    }
  }), B.handle("get-column-widths", async (t, n) => {
    try {
      const r = e();
      if (!Be.existsSync(r))
        return { success: !0, columnWidths: {} };
      const i = Be.readFileSync(r, "utf-8"), o = JSON.parse(i);
      return console.log(`[IPC] get-column-widths: tableId=${n}`), {
        success: !0,
        columnWidths: o[n] || {}
      };
    } catch (r) {
      return console.error("Failed to get column widths:", r), {
        success: !1,
        error: r.message || "读取列宽配置失败",
        columnWidths: {}
      };
    }
  });
}
function _T() {
  Ge.on("checking-for-update", () => {
    console.log("正在检查更新..."), b == null || b.webContents.send("update-checking");
  }), Ge.on("update-available", (e) => {
    console.log("发现新版本:", e.version), b == null || b.webContents.send("update-available", e), Le.isSupported() && new Le({
      title: "发现新版本",
      body: `版本 ${e.version} 可用，点击查看详情`
    }).show();
  }), Ge.on("update-not-available", (e) => {
    console.log("当前已是最新版本"), b == null || b.webContents.send("update-not-available", e);
  }), Ge.on("download-progress", (e) => {
    console.log(`下载进度: ${e.percent.toFixed(2)}%`), b == null || b.webContents.send("update-download-progress", e);
  }), Ge.on("update-downloaded", (e) => {
    console.log("更新下载完成:", e.version), b == null || b.webContents.send("update-downloaded", e), Le.isSupported() && new Le({
      title: "更新已下载",
      body: "新版本已准备就绪，重启应用即可安装"
    }).show();
  }), Ge.on("error", (e) => {
    console.error("更新错误:", e), b == null || b.webContents.send("update-error", e.message);
  });
}
const vT = Ce.requestSingleInstanceLock();
vT ? (Ce.on("second-instance", (e, t, n) => {
  console.log("检测到第二个实例尝试启动，聚焦到主窗口"), b && (b.isMinimized() && b.restore(), b.focus(), b.show());
}), Ce.whenReady().then(() => {
  Ul(), dT(), fT(), ET(), _T(), pT().catch((t) => console.error("Stock sync failed:", t)), hT().catch((t) => console.error("Auto sync failed:", t)), (async () => {
    try {
      Es("stock_list") ? console.log("Stock list already synced today") : (console.log("Today's stock list not synced yet, starting automatic sync..."), setTimeout(async () => {
        await gd();
      }, 3e3));
    } catch (t) {
      console.error("Daily sync check failed:", t);
    }
  })(), Kn || setTimeout(() => {
    Ge.checkForUpdates();
  }, 3e3), Ce.on("activate", () => {
    Ml.getAllWindows().length === 0 ? Ul() : b == null || b.show();
  });
})) : (console.log("应用已经在运行，退出当前实例"), Ce.quit());
Ce.on("window-all-closed", () => {
  process.platform !== "darwin" && Ce.quit();
});
Ce.on("before-quit", () => {
  Oe && (Oe.close(), Oe = null, console.log("[SQLite HTTP Server] Closed on app quit")), Ss.isQuitting = !0;
});
Ce.on("will-quit", () => {
  Bl.unregisterAll();
});
