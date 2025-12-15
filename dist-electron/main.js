import Ht, { app as Oe, BrowserWindow as Fl, globalShortcut as Ll, session as Ef, Notification as Le, nativeImage as Fi, Tray as yf, Menu as _f, ipcMain as j, shell as vf } from "electron";
import J from "path";
import fn, { fileURLToPath as wf, URL as Tf } from "url";
import Sf, { createServer as Cf } from "http";
import At from "fs";
import Af from "constants";
import zn from "stream";
import Fo from "util";
import xl from "assert";
import ti from "child_process";
import kl from "events";
import Kn from "crypto";
import Ul from "tty";
import ni from "os";
import If from "string_decoder";
import Ml from "zlib";
import Of from "better-sqlite3";
var Re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Rf(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Bl = {}, qt = {}, $e = {};
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
var ht = Af, Nf = process.cwd, Lr = null, bf = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Lr || (Lr = Nf.call(process)), Lr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var ks = process.chdir;
  process.chdir = function(e) {
    Lr = null, ks.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, ks);
}
var $f = Pf;
function Pf(e) {
  ht.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, u, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, u, h, p) {
    p && process.nextTick(p);
  }, e.lchownSync = function() {
  }), bf === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function u(h, p, y) {
      var E = Date.now(), T = 0;
      c(h, p, function S(C) {
        if (C && (C.code === "EACCES" || C.code === "EPERM" || C.code === "EBUSY") && Date.now() - E < 6e4) {
          setTimeout(function() {
            e.stat(p, function(D, x) {
              D && D.code === "ENOENT" ? c(h, p, S) : y(C);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        y && y(C);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function u(h, p, y, E, T, S) {
      var C;
      if (S && typeof S == "function") {
        var D = 0;
        C = function(x, re, le) {
          if (x && x.code === "EAGAIN" && D < 10)
            return D++, c.call(e, h, p, y, E, T, C);
          S.apply(this, arguments);
        };
      }
      return c.call(e, h, p, y, E, T, C);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(u, h, p, y, E) {
      for (var T = 0; ; )
        try {
          return c.call(e, u, h, p, y, E);
        } catch (S) {
          if (S.code === "EAGAIN" && T < 10) {
            T++;
            continue;
          }
          throw S;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(u, h, p) {
      c.open(
        u,
        ht.O_WRONLY | ht.O_SYMLINK,
        h,
        function(y, E) {
          if (y) {
            p && p(y);
            return;
          }
          c.fchmod(E, h, function(T) {
            c.close(E, function(S) {
              p && p(T || S);
            });
          });
        }
      );
    }, c.lchmodSync = function(u, h) {
      var p = c.openSync(u, ht.O_WRONLY | ht.O_SYMLINK, h), y = !0, E;
      try {
        E = c.fchmodSync(p, h), y = !1;
      } finally {
        if (y)
          try {
            c.closeSync(p);
          } catch {
          }
        else
          c.closeSync(p);
      }
      return E;
    };
  }
  function n(c) {
    ht.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(u, h, p, y) {
      c.open(u, ht.O_SYMLINK, function(E, T) {
        if (E) {
          y && y(E);
          return;
        }
        c.futimes(T, h, p, function(S) {
          c.close(T, function(C) {
            y && y(S || C);
          });
        });
      });
    }, c.lutimesSync = function(u, h, p) {
      var y = c.openSync(u, ht.O_SYMLINK), E, T = !0;
      try {
        E = c.futimesSync(y, h, p), T = !1;
      } finally {
        if (T)
          try {
            c.closeSync(y);
          } catch {
          }
        else
          c.closeSync(y);
      }
      return E;
    }) : c.futimes && (c.lutimes = function(u, h, p, y) {
      y && process.nextTick(y);
    }, c.lutimesSync = function() {
    });
  }
  function r(c) {
    return c && function(u, h, p) {
      return c.call(e, u, h, function(y) {
        f(y) && (y = null), p && p.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(u, h) {
      try {
        return c.call(e, u, h);
      } catch (p) {
        if (!f(p)) throw p;
      }
    };
  }
  function o(c) {
    return c && function(u, h, p, y) {
      return c.call(e, u, h, p, function(E) {
        f(E) && (E = null), y && y.apply(this, arguments);
      });
    };
  }
  function s(c) {
    return c && function(u, h, p) {
      try {
        return c.call(e, u, h, p);
      } catch (y) {
        if (!f(y)) throw y;
      }
    };
  }
  function a(c) {
    return c && function(u, h, p) {
      typeof h == "function" && (p = h, h = null);
      function y(E, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), p && p.apply(this, arguments);
      }
      return h ? c.call(e, u, h, y) : c.call(e, u, y);
    };
  }
  function l(c) {
    return c && function(u, h) {
      var p = h ? c.call(e, u, h) : c.call(e, u);
      return p && (p.uid < 0 && (p.uid += 4294967296), p.gid < 0 && (p.gid += 4294967296)), p;
    };
  }
  function f(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var u = !process.getuid || process.getuid() !== 0;
    return !!(u && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var Us = zn.Stream, Df = Ff;
function Ff(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    Us.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var s = Object.keys(i), a = 0, l = s.length; a < l; a++) {
      var f = s[a];
      this[f] = i[f];
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
    Us.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var Lf = kf, xf = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function kf(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: xf(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var oe = At, Uf = $f, Mf = Df, Bf = Lf, yr = Fo, ye, Hr;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (ye = Symbol.for("graceful-fs.queue"), Hr = Symbol.for("graceful-fs.previous")) : (ye = "___graceful-fs.queue", Hr = "___graceful-fs.previous");
function Hf() {
}
function Hl(e, t) {
  Object.defineProperty(e, ye, {
    get: function() {
      return t;
    }
  });
}
var Mt = Hf;
yr.debuglog ? Mt = yr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Mt = function() {
  var e = yr.format.apply(yr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[ye]) {
  var jf = Re[ye] || [];
  Hl(oe, jf), oe.close = function(e) {
    function t(n, r) {
      return e.call(oe, n, function(i) {
        i || Ms(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Hr, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(n) {
      e.apply(oe, arguments), Ms();
    }
    return Object.defineProperty(t, Hr, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Mt(oe[ye]), xl.equal(oe[ye].length, 0);
  });
}
Re[ye] || Hl(Re, oe[ye]);
var Pe = Lo(Bf(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && (Pe = Lo(oe), oe.__patched = !0);
function Lo(e) {
  Uf(e), e.gracefulify = Lo, e.createReadStream = re, e.createWriteStream = le;
  var t = e.readFile;
  e.readFile = n;
  function n(_, X, q) {
    return typeof X == "function" && (q = X, X = null), H(_, X, q);
    function H(Q, b, O, P) {
      return t(Q, b, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Vt([H, [Q, b, O], I, P || Date.now(), Date.now()]) : typeof O == "function" && O.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(_, X, q, H) {
    return typeof q == "function" && (H = q, q = null), Q(_, X, q, H);
    function Q(b, O, P, I, F) {
      return r(b, O, P, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Vt([Q, [b, O, P, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = s);
  function s(_, X, q, H) {
    return typeof q == "function" && (H = q, q = null), Q(_, X, q, H);
    function Q(b, O, P, I, F) {
      return o(b, O, P, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Vt([Q, [b, O, P, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = l);
  function l(_, X, q, H) {
    return typeof q == "function" && (H = q, q = 0), Q(_, X, q, H);
    function Q(b, O, P, I, F) {
      return a(b, O, P, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Vt([Q, [b, O, P, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var f = e.readdir;
  e.readdir = u;
  var c = /^v[0-5]\./;
  function u(_, X, q) {
    typeof X == "function" && (q = X, X = null);
    var H = c.test(process.version) ? function(O, P, I, F) {
      return f(O, Q(
        O,
        P,
        I,
        F
      ));
    } : function(O, P, I, F) {
      return f(O, P, Q(
        O,
        P,
        I,
        F
      ));
    };
    return H(_, X, q);
    function Q(b, O, P, I) {
      return function(F, $) {
        F && (F.code === "EMFILE" || F.code === "ENFILE") ? Vt([
          H,
          [b, O, P],
          F,
          I || Date.now(),
          Date.now()
        ]) : ($ && $.sort && $.sort(), typeof P == "function" && P.call(this, F, $));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = Mf(e);
    S = h.ReadStream, D = h.WriteStream;
  }
  var p = e.ReadStream;
  p && (S.prototype = Object.create(p.prototype), S.prototype.open = C);
  var y = e.WriteStream;
  y && (D.prototype = Object.create(y.prototype), D.prototype.open = x), Object.defineProperty(e, "ReadStream", {
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
      return D;
    },
    set: function(_) {
      D = _;
    },
    enumerable: !0,
    configurable: !0
  });
  var E = S;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return E;
    },
    set: function(_) {
      E = _;
    },
    enumerable: !0,
    configurable: !0
  });
  var T = D;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return T;
    },
    set: function(_) {
      T = _;
    },
    enumerable: !0,
    configurable: !0
  });
  function S(_, X) {
    return this instanceof S ? (p.apply(this, arguments), this) : S.apply(Object.create(S.prototype), arguments);
  }
  function C() {
    var _ = this;
    Ue(_.path, _.flags, _.mode, function(X, q) {
      X ? (_.autoClose && _.destroy(), _.emit("error", X)) : (_.fd = q, _.emit("open", q), _.read());
    });
  }
  function D(_, X) {
    return this instanceof D ? (y.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function x() {
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
  function Ue(_, X, q, H) {
    return typeof q == "function" && (H = q, q = null), Q(_, X, q, H);
    function Q(b, O, P, I, F) {
      return z(b, O, P, function($, B) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Vt([Q, [b, O, P, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  return e;
}
function Vt(e) {
  Mt("ENQUEUE", e[0].name, e[1]), oe[ye].push(e), xo();
}
var _r;
function Ms() {
  for (var e = Date.now(), t = 0; t < oe[ye].length; ++t)
    oe[ye][t].length > 2 && (oe[ye][t][3] = e, oe[ye][t][4] = e);
  xo();
}
function xo() {
  if (clearTimeout(_r), _r = void 0, oe[ye].length !== 0) {
    var e = oe[ye].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Mt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Mt("TIMEOUT", t.name, n);
      var s = n.pop();
      typeof s == "function" && s.call(null, r);
    } else {
      var a = Date.now() - o, l = Math.max(o - i, 1), f = Math.min(l * 1.2, 100);
      a >= f ? (Mt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : oe[ye].push(e);
    }
    _r === void 0 && (_r = setTimeout(xo, 0));
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
  }, e.read = function(i, o, s, a, l, f) {
    return typeof f == "function" ? n.read(i, o, s, a, l, f) : new Promise((c, u) => {
      n.read(i, o, s, a, l, (h, p, y) => {
        if (h) return u(h);
        c({ bytesRead: p, buffer: y });
      });
    });
  }, e.write = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.write(i, o, ...s) : new Promise((a, l) => {
      n.write(i, o, ...s, (f, c, u) => {
        if (f) return l(f);
        a({ bytesWritten: c, buffer: u });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.writev(i, o, ...s) : new Promise((a, l) => {
      n.writev(i, o, ...s, (f, c, u) => {
        if (f) return l(f);
        a({ bytesWritten: c, buffers: u });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(qt);
var ko = {}, jl = {};
const qf = J;
jl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(qf.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const ql = qt, { checkPath: Gl } = jl, Yl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
ko.makeDir = async (e, t) => (Gl(e), ql.mkdir(e, {
  mode: Yl(t),
  recursive: !0
}));
ko.makeDirSync = (e, t) => (Gl(e), ql.mkdirSync(e, {
  mode: Yl(t),
  recursive: !0
}));
const Gf = $e.fromPromise, { makeDir: Yf, makeDirSync: Li } = ko, xi = Gf(Yf);
var tt = {
  mkdirs: xi,
  mkdirsSync: Li,
  // alias
  mkdirp: xi,
  mkdirpSync: Li,
  ensureDir: xi,
  ensureDirSync: Li
};
const Xf = $e.fromPromise, Xl = qt;
function Vf(e) {
  return Xl.access(e).then(() => !0).catch(() => !1);
}
var Gt = {
  pathExists: Xf(Vf),
  pathExistsSync: Xl.existsSync
};
const sn = Pe;
function Wf(e, t, n, r) {
  sn.open(e, "r+", (i, o) => {
    if (i) return r(i);
    sn.futimes(o, t, n, (s) => {
      sn.close(o, (a) => {
        r && r(s || a);
      });
    });
  });
}
function zf(e, t, n) {
  const r = sn.openSync(e, "r+");
  return sn.futimesSync(r, t, n), sn.closeSync(r);
}
var Vl = {
  utimesMillis: Wf,
  utimesMillisSync: zf
};
const ln = qt, pe = J, Kf = Fo;
function Jf(e, t, n) {
  const r = n.dereference ? (i) => ln.stat(i, { bigint: !0 }) : (i) => ln.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Qf(e, t, n) {
  let r;
  const i = n.dereference ? (s) => ln.statSync(s, { bigint: !0 }) : (s) => ln.lstatSync(s, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: o, destStat: null };
    throw s;
  }
  return { srcStat: o, destStat: r };
}
function Zf(e, t, n, r, i) {
  Kf.callbackify(Jf)(e, t, r, (o, s) => {
    if (o) return i(o);
    const { srcStat: a, destStat: l } = s;
    if (l) {
      if (Jn(a, l)) {
        const f = pe.basename(e), c = pe.basename(t);
        return n === "move" && f !== c && f.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: a, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && Uo(e, t) ? i(new Error(ri(e, t, n))) : i(null, { srcStat: a, destStat: l });
  });
}
function eh(e, t, n, r) {
  const { srcStat: i, destStat: o } = Qf(e, t, r);
  if (o) {
    if (Jn(i, o)) {
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
  if (i.isDirectory() && Uo(e, t))
    throw new Error(ri(e, t, n));
  return { srcStat: i, destStat: o };
}
function Wl(e, t, n, r, i) {
  const o = pe.resolve(pe.dirname(e)), s = pe.resolve(pe.dirname(n));
  if (s === o || s === pe.parse(s).root) return i();
  ln.stat(s, { bigint: !0 }, (a, l) => a ? a.code === "ENOENT" ? i() : i(a) : Jn(t, l) ? i(new Error(ri(e, n, r))) : Wl(e, t, s, r, i));
}
function zl(e, t, n, r) {
  const i = pe.resolve(pe.dirname(e)), o = pe.resolve(pe.dirname(n));
  if (o === i || o === pe.parse(o).root) return;
  let s;
  try {
    s = ln.statSync(o, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Jn(t, s))
    throw new Error(ri(e, n, r));
  return zl(e, t, o, r);
}
function Jn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Uo(e, t) {
  const n = pe.resolve(e).split(pe.sep).filter((i) => i), r = pe.resolve(t).split(pe.sep).filter((i) => i);
  return n.reduce((i, o, s) => i && r[s] === o, !0);
}
function ri(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var hn = {
  checkPaths: Zf,
  checkPathsSync: eh,
  checkParentPaths: Wl,
  checkParentPathsSync: zl,
  isSrcSubdir: Uo,
  areIdentical: Jn
};
const xe = Pe, Dn = J, th = tt.mkdirs, nh = Gt.pathExists, rh = Vl.utimesMillis, Fn = hn;
function ih(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Fn.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: s, destStat: a } = o;
    Fn.checkParentPaths(e, s, t, "copy", (l) => l ? r(l) : n.filter ? Kl(Bs, a, e, t, n, r) : Bs(a, e, t, n, r));
  });
}
function Bs(e, t, n, r, i) {
  const o = Dn.dirname(n);
  nh(o, (s, a) => {
    if (s) return i(s);
    if (a) return jr(e, t, n, r, i);
    th(o, (l) => l ? i(l) : jr(e, t, n, r, i));
  });
}
function Kl(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((s) => s ? e(t, n, r, i, o) : o(), (s) => o(s));
}
function oh(e, t, n, r, i) {
  return r.filter ? Kl(jr, e, t, n, r, i) : jr(e, t, n, r, i);
}
function jr(e, t, n, r, i) {
  (r.dereference ? xe.stat : xe.lstat)(t, (s, a) => s ? i(s) : a.isDirectory() ? fh(a, e, t, n, r, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? sh(a, e, t, n, r, i) : a.isSymbolicLink() ? mh(e, t, n, r, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function sh(e, t, n, r, i, o) {
  return t ? ah(e, n, r, i, o) : Jl(e, n, r, i, o);
}
function ah(e, t, n, r, i) {
  if (r.overwrite)
    xe.unlink(n, (o) => o ? i(o) : Jl(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function Jl(e, t, n, r, i) {
  xe.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? lh(e.mode, t, n, i) : ii(n, e.mode, i));
}
function lh(e, t, n, r) {
  return ch(e) ? uh(n, e, (i) => i ? r(i) : Hs(e, t, n, r)) : Hs(e, t, n, r);
}
function ch(e) {
  return (e & 128) === 0;
}
function uh(e, t, n) {
  return ii(e, t | 128, n);
}
function Hs(e, t, n, r) {
  dh(t, n, (i) => i ? r(i) : ii(n, e, r));
}
function ii(e, t, n) {
  return xe.chmod(e, t, n);
}
function dh(e, t, n) {
  xe.stat(e, (r, i) => r ? n(r) : rh(t, i.atime, i.mtime, n));
}
function fh(e, t, n, r, i, o) {
  return t ? Ql(n, r, i, o) : hh(e.mode, n, r, i, o);
}
function hh(e, t, n, r, i) {
  xe.mkdir(n, (o) => {
    if (o) return i(o);
    Ql(t, n, r, (s) => s ? i(s) : ii(n, e, i));
  });
}
function Ql(e, t, n, r) {
  xe.readdir(e, (i, o) => i ? r(i) : Zl(o, e, t, n, r));
}
function Zl(e, t, n, r, i) {
  const o = e.pop();
  return o ? ph(e, o, t, n, r, i) : i();
}
function ph(e, t, n, r, i, o) {
  const s = Dn.join(n, t), a = Dn.join(r, t);
  Fn.checkPaths(s, a, "copy", i, (l, f) => {
    if (l) return o(l);
    const { destStat: c } = f;
    oh(c, s, a, i, (u) => u ? o(u) : Zl(e, n, r, i, o));
  });
}
function mh(e, t, n, r, i) {
  xe.readlink(t, (o, s) => {
    if (o) return i(o);
    if (r.dereference && (s = Dn.resolve(process.cwd(), s)), e)
      xe.readlink(n, (a, l) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? xe.symlink(s, n, i) : i(a) : (r.dereference && (l = Dn.resolve(process.cwd(), l)), Fn.isSrcSubdir(s, l) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Fn.isSrcSubdir(l, s) ? i(new Error(`Cannot overwrite '${l}' with '${s}'.`)) : gh(s, n, i)));
    else
      return xe.symlink(s, n, i);
  });
}
function gh(e, t, n) {
  xe.unlink(t, (r) => r ? n(r) : xe.symlink(e, t, n));
}
var Eh = ih;
const Se = Pe, Ln = J, yh = tt.mkdirsSync, _h = Vl.utimesMillisSync, xn = hn;
function vh(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = xn.checkPathsSync(e, t, "copy", n);
  return xn.checkParentPathsSync(e, r, t, "copy"), wh(i, e, t, n);
}
function wh(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Ln.dirname(n);
  return Se.existsSync(i) || yh(i), ec(e, t, n, r);
}
function Th(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return ec(e, t, n, r);
}
function ec(e, t, n, r) {
  const o = (r.dereference ? Se.statSync : Se.lstatSync)(t);
  if (o.isDirectory()) return Nh(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return Sh(o, e, t, n, r);
  if (o.isSymbolicLink()) return Ph(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Sh(e, t, n, r, i) {
  return t ? Ch(e, n, r, i) : tc(e, n, r, i);
}
function Ch(e, t, n, r) {
  if (r.overwrite)
    return Se.unlinkSync(n), tc(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function tc(e, t, n, r) {
  return Se.copyFileSync(t, n), r.preserveTimestamps && Ah(e.mode, t, n), Mo(n, e.mode);
}
function Ah(e, t, n) {
  return Ih(e) && Oh(n, e), Rh(t, n);
}
function Ih(e) {
  return (e & 128) === 0;
}
function Oh(e, t) {
  return Mo(e, t | 128);
}
function Mo(e, t) {
  return Se.chmodSync(e, t);
}
function Rh(e, t) {
  const n = Se.statSync(e);
  return _h(t, n.atime, n.mtime);
}
function Nh(e, t, n, r, i) {
  return t ? nc(n, r, i) : bh(e.mode, n, r, i);
}
function bh(e, t, n, r) {
  return Se.mkdirSync(n), nc(t, n, r), Mo(n, e);
}
function nc(e, t, n) {
  Se.readdirSync(e).forEach((r) => $h(r, e, t, n));
}
function $h(e, t, n, r) {
  const i = Ln.join(t, e), o = Ln.join(n, e), { destStat: s } = xn.checkPathsSync(i, o, "copy", r);
  return Th(s, i, o, r);
}
function Ph(e, t, n, r) {
  let i = Se.readlinkSync(t);
  if (r.dereference && (i = Ln.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Se.readlinkSync(n);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Se.symlinkSync(i, n);
      throw s;
    }
    if (r.dereference && (o = Ln.resolve(process.cwd(), o)), xn.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Se.statSync(n).isDirectory() && xn.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Dh(i, n);
  } else
    return Se.symlinkSync(i, n);
}
function Dh(e, t) {
  return Se.unlinkSync(t), Se.symlinkSync(e, t);
}
var Fh = vh;
const Lh = $e.fromCallback;
var Bo = {
  copy: Lh(Eh),
  copySync: Fh
};
const js = Pe, rc = J, ee = xl, kn = process.platform === "win32";
function ic(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || js[n], n = n + "Sync", e[n] = e[n] || js[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Ho(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), ee(e, "rimraf: missing path"), ee.strictEqual(typeof e, "string", "rimraf: path should be a string"), ee.strictEqual(typeof n, "function", "rimraf: callback function required"), ee(t, "rimraf: invalid options argument provided"), ee.strictEqual(typeof t, "object", "rimraf: options should be object"), ic(t), qs(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const s = r * 100;
        return setTimeout(() => qs(e, t, i), s);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function qs(e, t, n) {
  ee(e), ee(t), ee(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && kn)
      return Gs(e, t, r, n);
    if (i && i.isDirectory())
      return xr(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return kn ? Gs(e, t, o, n) : xr(e, t, o, n);
        if (o.code === "EISDIR")
          return xr(e, t, o, n);
      }
      return n(o);
    });
  });
}
function Gs(e, t, n, r) {
  ee(e), ee(t), ee(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, s) => {
      o ? r(o.code === "ENOENT" ? null : n) : s.isDirectory() ? xr(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function Ys(e, t, n) {
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
  r.isDirectory() ? kr(e, t, n) : t.unlinkSync(e);
}
function xr(e, t, n, r) {
  ee(e), ee(t), ee(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? xh(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function xh(e, t, n) {
  ee(e), ee(t), ee(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, s;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((a) => {
      Ho(rc.join(e, a), t, (l) => {
        if (!s) {
          if (l) return n(s = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function oc(e, t) {
  let n;
  t = t || {}, ic(t), ee(e, "rimraf: missing path"), ee.strictEqual(typeof e, "string", "rimraf: path should be a string"), ee(t, "rimraf: missing options"), ee.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && kn && Ys(e, t, r);
  }
  try {
    n && n.isDirectory() ? kr(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return kn ? Ys(e, t, r) : kr(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    kr(e, t, r);
  }
}
function kr(e, t, n) {
  ee(e), ee(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      kh(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function kh(e, t) {
  if (ee(e), ee(t), t.readdirSync(e).forEach((n) => oc(rc.join(e, n), t)), kn) {
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
var Uh = Ho;
Ho.sync = oc;
const qr = Pe, Mh = $e.fromCallback, sc = Uh;
function Bh(e, t) {
  if (qr.rm) return qr.rm(e, { recursive: !0, force: !0 }, t);
  sc(e, t);
}
function Hh(e) {
  if (qr.rmSync) return qr.rmSync(e, { recursive: !0, force: !0 });
  sc.sync(e);
}
var oi = {
  remove: Mh(Bh),
  removeSync: Hh
};
const jh = $e.fromPromise, ac = qt, lc = J, cc = tt, uc = oi, Xs = jh(async function(t) {
  let n;
  try {
    n = await ac.readdir(t);
  } catch {
    return cc.mkdirs(t);
  }
  return Promise.all(n.map((r) => uc.remove(lc.join(t, r))));
});
function Vs(e) {
  let t;
  try {
    t = ac.readdirSync(e);
  } catch {
    return cc.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = lc.join(e, n), uc.removeSync(n);
  });
}
var qh = {
  emptyDirSync: Vs,
  emptydirSync: Vs,
  emptyDir: Xs,
  emptydir: Xs
};
const Gh = $e.fromCallback, dc = J, Et = Pe, fc = tt;
function Yh(e, t) {
  function n() {
    Et.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  Et.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = dc.dirname(e);
    Et.stat(o, (s, a) => {
      if (s)
        return s.code === "ENOENT" ? fc.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(s);
      a.isDirectory() ? n() : Et.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Xh(e) {
  let t;
  try {
    t = Et.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = dc.dirname(e);
  try {
    Et.statSync(n).isDirectory() || Et.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") fc.mkdirsSync(n);
    else throw r;
  }
  Et.writeFileSync(e, "");
}
var Vh = {
  createFile: Gh(Yh),
  createFileSync: Xh
};
const Wh = $e.fromCallback, hc = J, gt = Pe, pc = tt, zh = Gt.pathExists, { areIdentical: mc } = hn;
function Kh(e, t, n) {
  function r(i, o) {
    gt.link(i, o, (s) => {
      if (s) return n(s);
      n(null);
    });
  }
  gt.lstat(t, (i, o) => {
    gt.lstat(e, (s, a) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), n(s);
      if (o && mc(a, o)) return n(null);
      const l = hc.dirname(t);
      zh(l, (f, c) => {
        if (f) return n(f);
        if (c) return r(e, t);
        pc.mkdirs(l, (u) => {
          if (u) return n(u);
          r(e, t);
        });
      });
    });
  });
}
function Jh(e, t) {
  let n;
  try {
    n = gt.lstatSync(t);
  } catch {
  }
  try {
    const o = gt.lstatSync(e);
    if (n && mc(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = hc.dirname(t);
  return gt.existsSync(r) || pc.mkdirsSync(r), gt.linkSync(e, t);
}
var Qh = {
  createLink: Wh(Kh),
  createLinkSync: Jh
};
const yt = J, Nn = Pe, Zh = Gt.pathExists;
function ep(e, t, n) {
  if (yt.isAbsolute(e))
    return Nn.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = yt.dirname(t), i = yt.join(r, e);
    return Zh(i, (o, s) => o ? n(o) : s ? n(null, {
      toCwd: i,
      toDst: e
    }) : Nn.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), n(a)) : n(null, {
      toCwd: e,
      toDst: yt.relative(r, e)
    })));
  }
}
function tp(e, t) {
  let n;
  if (yt.isAbsolute(e)) {
    if (n = Nn.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = yt.dirname(t), i = yt.join(r, e);
    if (n = Nn.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = Nn.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: yt.relative(r, e)
    };
  }
}
var np = {
  symlinkPaths: ep,
  symlinkPathsSync: tp
};
const gc = Pe;
function rp(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  gc.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function ip(e, t) {
  let n;
  if (t) return t;
  try {
    n = gc.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var op = {
  symlinkType: rp,
  symlinkTypeSync: ip
};
const sp = $e.fromCallback, Ec = J, Ve = qt, yc = tt, ap = yc.mkdirs, lp = yc.mkdirsSync, _c = np, cp = _c.symlinkPaths, up = _c.symlinkPathsSync, vc = op, dp = vc.symlinkType, fp = vc.symlinkTypeSync, hp = Gt.pathExists, { areIdentical: wc } = hn;
function pp(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, Ve.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Ve.stat(e),
      Ve.stat(t)
    ]).then(([s, a]) => {
      if (wc(s, a)) return r(null);
      Ws(e, t, n, r);
    }) : Ws(e, t, n, r);
  });
}
function Ws(e, t, n, r) {
  cp(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, dp(o.toCwd, n, (s, a) => {
      if (s) return r(s);
      const l = Ec.dirname(t);
      hp(l, (f, c) => {
        if (f) return r(f);
        if (c) return Ve.symlink(e, t, a, r);
        ap(l, (u) => {
          if (u) return r(u);
          Ve.symlink(e, t, a, r);
        });
      });
    });
  });
}
function mp(e, t, n) {
  let r;
  try {
    r = Ve.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const a = Ve.statSync(e), l = Ve.statSync(t);
    if (wc(a, l)) return;
  }
  const i = up(e, t);
  e = i.toDst, n = fp(i.toCwd, n);
  const o = Ec.dirname(t);
  return Ve.existsSync(o) || lp(o), Ve.symlinkSync(e, t, n);
}
var gp = {
  createSymlink: sp(pp),
  createSymlinkSync: mp
};
const { createFile: zs, createFileSync: Ks } = Vh, { createLink: Js, createLinkSync: Qs } = Qh, { createSymlink: Zs, createSymlinkSync: ea } = gp;
var Ep = {
  // file
  createFile: zs,
  createFileSync: Ks,
  ensureFile: zs,
  ensureFileSync: Ks,
  // link
  createLink: Js,
  createLinkSync: Qs,
  ensureLink: Js,
  ensureLinkSync: Qs,
  // symlink
  createSymlink: Zs,
  createSymlinkSync: ea,
  ensureSymlink: Zs,
  ensureSymlinkSync: ea
};
function yp(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function _p(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var jo = { stringify: yp, stripBom: _p };
let cn;
try {
  cn = Pe;
} catch {
  cn = At;
}
const si = $e, { stringify: Tc, stripBom: Sc } = jo;
async function vp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || cn, r = "throws" in t ? t.throws : !0;
  let i = await si.fromCallback(n.readFile)(e, t);
  i = Sc(i);
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
const wp = si.fromPromise(vp);
function Tp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || cn, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Sc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Sp(e, t, n = {}) {
  const r = n.fs || cn, i = Tc(t, n);
  await si.fromCallback(r.writeFile)(e, i, n);
}
const Cp = si.fromPromise(Sp);
function Ap(e, t, n = {}) {
  const r = n.fs || cn, i = Tc(t, n);
  return r.writeFileSync(e, i, n);
}
var Ip = {
  readFile: wp,
  readFileSync: Tp,
  writeFile: Cp,
  writeFileSync: Ap
};
const vr = Ip;
var Op = {
  // jsonfile exports
  readJson: vr.readFile,
  readJsonSync: vr.readFileSync,
  writeJson: vr.writeFile,
  writeJsonSync: vr.writeFileSync
};
const Rp = $e.fromCallback, bn = Pe, Cc = J, Ac = tt, Np = Gt.pathExists;
function bp(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = Cc.dirname(e);
  Np(i, (o, s) => {
    if (o) return r(o);
    if (s) return bn.writeFile(e, t, n, r);
    Ac.mkdirs(i, (a) => {
      if (a) return r(a);
      bn.writeFile(e, t, n, r);
    });
  });
}
function $p(e, ...t) {
  const n = Cc.dirname(e);
  if (bn.existsSync(n))
    return bn.writeFileSync(e, ...t);
  Ac.mkdirsSync(n), bn.writeFileSync(e, ...t);
}
var qo = {
  outputFile: Rp(bp),
  outputFileSync: $p
};
const { stringify: Pp } = jo, { outputFile: Dp } = qo;
async function Fp(e, t, n = {}) {
  const r = Pp(t, n);
  await Dp(e, r, n);
}
var Lp = Fp;
const { stringify: xp } = jo, { outputFileSync: kp } = qo;
function Up(e, t, n) {
  const r = xp(t, n);
  kp(e, r, n);
}
var Mp = Up;
const Bp = $e.fromPromise, be = Op;
be.outputJson = Bp(Lp);
be.outputJsonSync = Mp;
be.outputJSON = be.outputJson;
be.outputJSONSync = be.outputJsonSync;
be.writeJSON = be.writeJson;
be.writeJSONSync = be.writeJsonSync;
be.readJSON = be.readJson;
be.readJSONSync = be.readJsonSync;
var Hp = be;
const jp = Pe, ho = J, qp = Bo.copy, Ic = oi.remove, Gp = tt.mkdirp, Yp = Gt.pathExists, ta = hn;
function Xp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  ta.checkPaths(e, t, "move", n, (o, s) => {
    if (o) return r(o);
    const { srcStat: a, isChangingCase: l = !1 } = s;
    ta.checkParentPaths(e, a, t, "move", (f) => {
      if (f) return r(f);
      if (Vp(t)) return na(e, t, i, l, r);
      Gp(ho.dirname(t), (c) => c ? r(c) : na(e, t, i, l, r));
    });
  });
}
function Vp(e) {
  const t = ho.dirname(e);
  return ho.parse(t).root === t;
}
function na(e, t, n, r, i) {
  if (r) return ki(e, t, n, i);
  if (n)
    return Ic(t, (o) => o ? i(o) : ki(e, t, n, i));
  Yp(t, (o, s) => o ? i(o) : s ? i(new Error("dest already exists.")) : ki(e, t, n, i));
}
function ki(e, t, n, r) {
  jp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : Wp(e, t, n, r) : r());
}
function Wp(e, t, n, r) {
  qp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : Ic(e, r));
}
var zp = Xp;
const Oc = Pe, po = J, Kp = Bo.copySync, Rc = oi.removeSync, Jp = tt.mkdirpSync, ra = hn;
function Qp(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = ra.checkPathsSync(e, t, "move", n);
  return ra.checkParentPathsSync(e, i, t, "move"), Zp(t) || Jp(po.dirname(t)), em(e, t, r, o);
}
function Zp(e) {
  const t = po.dirname(e);
  return po.parse(t).root === t;
}
function em(e, t, n, r) {
  if (r) return Ui(e, t, n);
  if (n)
    return Rc(t), Ui(e, t, n);
  if (Oc.existsSync(t)) throw new Error("dest already exists.");
  return Ui(e, t, n);
}
function Ui(e, t, n) {
  try {
    Oc.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return tm(e, t, n);
  }
}
function tm(e, t, n) {
  return Kp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), Rc(e);
}
var nm = Qp;
const rm = $e.fromCallback;
var im = {
  move: rm(zp),
  moveSync: nm
}, It = {
  // Export promiseified graceful-fs:
  ...qt,
  // Export extra methods:
  ...Bo,
  ...qh,
  ...Ep,
  ...Hp,
  ...tt,
  ...im,
  ...qo,
  ...Gt,
  ...oi
}, lt = {}, vt = {}, me = {}, wt = {};
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.CancellationError = wt.CancellationToken = void 0;
const om = kl;
class sm extends om.EventEmitter {
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
      return Promise.reject(new mo());
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
          o(new mo());
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
wt.CancellationToken = sm;
class mo extends Error {
  constructor() {
    super("cancelled");
  }
}
wt.CancellationError = mo;
var pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.newError = am;
function am(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var Ne = {}, go = { exports: {} }, wr = { exports: {} }, Mi, ia;
function lm() {
  if (ia) return Mi;
  ia = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  Mi = function(c, u) {
    u = u || {};
    var h = typeof c;
    if (h === "string" && c.length > 0)
      return s(c);
    if (h === "number" && isFinite(c))
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
        var h = parseFloat(u[1]), p = (u[2] || "ms").toLowerCase();
        switch (p) {
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
  function a(c) {
    var u = Math.abs(c);
    return u >= r ? Math.round(c / r) + "d" : u >= n ? Math.round(c / n) + "h" : u >= t ? Math.round(c / t) + "m" : u >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var u = Math.abs(c);
    return u >= r ? f(c, u, r, "day") : u >= n ? f(c, u, n, "hour") : u >= t ? f(c, u, t, "minute") : u >= e ? f(c, u, e, "second") : c + " ms";
  }
  function f(c, u, h, p) {
    var y = u >= h * 1.5;
    return Math.round(c / h) + " " + p + (y ? "s" : "");
  }
  return Mi;
}
var Bi, oa;
function Nc() {
  if (oa) return Bi;
  oa = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = f, r.disable = a, r.enable = o, r.enabled = l, r.humanize = lm(), r.destroy = c, Object.keys(t).forEach((u) => {
      r[u] = t[u];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(u) {
      let h = 0;
      for (let p = 0; p < u.length; p++)
        h = (h << 5) - h + u.charCodeAt(p), h |= 0;
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = n;
    function r(u) {
      let h, p = null, y, E;
      function T(...S) {
        if (!T.enabled)
          return;
        const C = T, D = Number(/* @__PURE__ */ new Date()), x = D - (h || D);
        C.diff = x, C.prev = h, C.curr = D, h = D, S[0] = r.coerce(S[0]), typeof S[0] != "string" && S.unshift("%O");
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
      return T.namespace = u, T.useColors = r.useColors(), T.color = r.selectColor(u), T.extend = i, T.destroy = r.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : (y !== r.namespaces && (y = r.namespaces, E = r.enabled(u)), E),
        set: (S) => {
          p = S;
        }
      }), typeof r.init == "function" && r.init(T), T;
    }
    function i(u, h) {
      const p = r(this.namespace + (typeof h > "u" ? ":" : h) + u);
      return p.log = this.log, p;
    }
    function o(u) {
      r.save(u), r.namespaces = u, r.names = [], r.skips = [];
      const h = (typeof u == "string" ? u : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const p of h)
        p[0] === "-" ? r.skips.push(p.slice(1)) : r.names.push(p);
    }
    function s(u, h) {
      let p = 0, y = 0, E = -1, T = 0;
      for (; p < u.length; )
        if (y < h.length && (h[y] === u[p] || h[y] === "*"))
          h[y] === "*" ? (E = y, T = p, y++) : (p++, y++);
        else if (E !== -1)
          y = E + 1, T++, p = T;
        else
          return !1;
      for (; y < h.length && h[y] === "*"; )
        y++;
      return y === h.length;
    }
    function a() {
      const u = [
        ...r.names,
        ...r.skips.map((h) => "-" + h)
      ].join(",");
      return r.enable(""), u;
    }
    function l(u) {
      for (const h of r.skips)
        if (s(u, h))
          return !1;
      for (const h of r.names)
        if (s(u, h))
          return !0;
      return !1;
    }
    function f(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return Bi = e, Bi;
}
var sa;
function cm() {
  return sa || (sa = 1, function(e, t) {
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
      const f = "color: " + this.color;
      l.splice(1, 0, f, "color: inherit");
      let c = 0, u = 0;
      l[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (c++, h === "%c" && (u = c));
      }), l.splice(u, 0, f);
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
    e.exports = Nc()(t);
    const { formatters: a } = e.exports;
    a.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (f) {
        return "[UnexpectedJSONParseError]: " + f.message;
      }
    };
  }(wr, wr.exports)), wr.exports;
}
var Tr = { exports: {} }, Hi, aa;
function um() {
  return aa || (aa = 1, Hi = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), Hi;
}
var ji, la;
function dm() {
  if (la) return ji;
  la = 1;
  const e = ni, t = Ul, n = um(), { env: r } = process;
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
  function s(l, f) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (l && !f && i === void 0)
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
    const f = s(l, l && l.isTTY);
    return o(f);
  }
  return ji = {
    supportsColor: a,
    stdout: o(s(!0, t.isatty(1))),
    stderr: o(s(!0, t.isatty(2)))
  }, ji;
}
var ca;
function fm() {
  return ca || (ca = 1, function(e, t) {
    const n = Ul, r = Fo;
    t.init = c, t.log = a, t.formatArgs = o, t.save = l, t.load = f, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = dm();
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
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, p) => {
      const y = p.substring(6).toLowerCase().replace(/_([a-z])/g, (T, S) => S.toUpperCase());
      let E = process.env[p];
      return /^(yes|on|true|enabled)$/i.test(E) ? E = !0 : /^(no|off|false|disabled)$/i.test(E) ? E = !1 : E === "null" ? E = null : E = Number(E), h[y] = E, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: p, useColors: y } = this;
      if (y) {
        const E = this.color, T = "\x1B[3" + (E < 8 ? E : "8;5;" + E), S = `  ${T};1m${p} \x1B[0m`;
        h[0] = S + h[0].split(`
`).join(`
` + S), h.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = s() + p + " " + h[0];
    }
    function s() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function a(...h) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function l(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function f() {
      return process.env.DEBUG;
    }
    function c(h) {
      h.inspectOpts = {};
      const p = Object.keys(t.inspectOpts);
      for (let y = 0; y < p.length; y++)
        h.inspectOpts[p[y]] = t.inspectOpts[p[y]];
    }
    e.exports = Nc()(t);
    const { formatters: u } = e.exports;
    u.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, u.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(Tr, Tr.exports)), Tr.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? go.exports = cm() : go.exports = fm();
var hm = go.exports, Qn = {};
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.ProgressCallbackTransform = void 0;
const pm = zn;
class mm extends pm.Transform {
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
Qn.ProgressCallbackTransform = mm;
Object.defineProperty(Ne, "__esModule", { value: !0 });
Ne.DigestTransform = Ne.HttpExecutor = Ne.HttpError = void 0;
Ne.createHttpError = Eo;
Ne.parseJson = Sm;
Ne.configureRequestOptionsFromUrl = $c;
Ne.configureRequestUrl = Yo;
Ne.safeGetHeader = an;
Ne.configureRequestOptions = Yr;
Ne.safeStringifyJson = Xr;
const gm = Kn, Em = hm, ym = At, _m = zn, bc = fn, vm = wt, ua = pn, wm = Qn, Tn = (0, Em.default)("electron-builder");
function Eo(e, t = null) {
  return new Go(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Xr(e.headers), t);
}
const Tm = /* @__PURE__ */ new Map([
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
class Go extends Error {
  constructor(t, n = `HTTP error: ${Tm.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ne.HttpError = Go;
function Sm(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Gr {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new vm.CancellationToken(), r) {
    Yr(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      Tn(i);
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
    return Tn.enabled && Tn(`Request: ${Xr(t)}`), n.createPromise((o, s, a) => {
      const l = this.createRequest(t, (f) => {
        try {
          this.handleResponse(f, t, n, o, s, i, r);
        } catch (c) {
          s(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, s, t.timeout), this.addRedirectHandlers(l, t, s, i, (f) => {
        this.doApiRequest(f, n, r, i).then(o).catch(s);
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
    if (Tn.enabled && Tn(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Xr(n)}`), t.statusCode === 404) {
      o(Eo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const f = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = f >= 300 && f < 400, u = an(t, "location");
    if (c && u != null) {
      if (s > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Gr.prepareRedirectUrlOptions(u, n), r, a, s).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (p) => h += p), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const p = an(t, "content-type"), y = p != null && (Array.isArray(p) ? p.find((E) => E.includes("json")) != null : p.includes("json"));
          o(Eo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${y ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (p) {
        o(p);
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
      Yo(t, a), Yr(a), this.doDownload(a, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (l) => {
          l == null ? r(Buffer.concat(s)) : i(l);
        },
        responseHandler: (l, f) => {
          let c = 0;
          l.on("data", (u) => {
            if (c += u.length, c > 524288e3) {
              f(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            s.push(u);
          }), l.on("end", () => {
            f(null);
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
        r < this.maxRedirects ? this.doDownload(Gr.prepareRedirectUrlOptions(s, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? Am(n, o) : n.responseHandler(o, n.callback);
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
    const r = $c(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = new bc.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return r;
  }
  static retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return t();
      } catch (i) {
        if (r < n && (i instanceof Go && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ne.HttpExecutor = Gr;
function $c(e, t) {
  const n = Yr(t);
  return Yo(new bc.URL(e), n), n;
}
function Yo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class yo extends _m.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, gm.createHash)(n);
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
      throw (0, ua.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, ua.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Ne.DigestTransform = yo;
function Cm(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function an(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function Am(e, t) {
  if (!Cm(an(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const s = an(t, "content-length");
    s != null && n.push(new wm.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new yo(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new yo(e.options.sha2, "sha256", "hex"));
  const i = (0, ym.createWriteStream)(e.destination);
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
function Yr(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Xr(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
ai.MemoLazy = void 0;
class Im {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Pc(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
ai.MemoLazy = Im;
function Pc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((s) => Pc(e[s], t[s]));
  }
  return e === t;
}
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
li.githubUrl = Om;
li.getS3LikeProviderBaseUrl = Rm;
function Om(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Rm(e) {
  const t = e.provider;
  if (t === "s3")
    return Nm(e);
  if (t === "spaces")
    return bm(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Nm(e) {
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
  return Dc(t, e.path);
}
function Dc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function bm(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Dc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
Xo.retry = Fc;
const $m = wt;
async function Fc(e, t, n, r = 0, i = 0, o) {
  var s;
  const a = new $m.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((s = o == null ? void 0 : o(l)) !== null && s !== void 0) || s) && t > 0 && !a.cancelled)
      return await new Promise((f) => setTimeout(f, n + r * i)), await Fc(e, t - 1, n, r, i + 1, o);
    throw l;
  }
}
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
Vo.parseDn = Pm;
function Pm(e) {
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
var un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
un.nil = un.UUID = void 0;
const Lc = Kn, xc = pn, Dm = "options.name must be either a string or a Buffer", da = (0, Lc.randomBytes)(16);
da[0] = da[0] | 1;
const Ur = {}, W = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Ur[t] = e, W[e] = t;
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
    return Fm(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = Lm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Ur[t[14] + t[15]] & 240) >> 4,
        variant: fa((Ur[t[19] + t[20]] & 224) >> 5),
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
        variant: fa((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, xc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = Ur[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
un.UUID = jt;
jt.OID = jt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function fa(e) {
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
var $n;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})($n || ($n = {}));
function Fm(e, t, n, r, i = $n.ASCII) {
  const o = (0, Lc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, xc.newError)(Dm, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const a = o.digest();
  let l;
  switch (i) {
    case $n.BINARY:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, l = a;
      break;
    case $n.OBJECT:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, l = new jt(a);
      break;
    default:
      l = W[a[0]] + W[a[1]] + W[a[2]] + W[a[3]] + "-" + W[a[4]] + W[a[5]] + "-" + W[a[6] & 15 | n] + W[a[7]] + "-" + W[a[8] & 63 | 128] + W[a[9]] + "-" + W[a[10]] + W[a[11]] + W[a[12]] + W[a[13]] + W[a[14]] + W[a[15]];
      break;
  }
  return l;
}
function Lm(e) {
  return W[e[0]] + W[e[1]] + W[e[2]] + W[e[3]] + "-" + W[e[4]] + W[e[5]] + "-" + W[e[6]] + W[e[7]] + "-" + W[e[8]] + W[e[9]] + "-" + W[e[10]] + W[e[11]] + W[e[12]] + W[e[13]] + W[e[14]] + W[e[15]];
}
un.nil = new jt("00000000-0000-0000-0000-000000000000");
var Zn = {}, kc = {};
(function(e) {
  (function(t) {
    t.parser = function(m, d) {
      return new r(m, d);
    }, t.SAXParser = r, t.SAXStream = c, t.createStream = f, t.MAX_BUFFER_LENGTH = 64 * 1024;
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
    function r(m, d) {
      if (!(this instanceof r))
        return new r(m, d);
      var A = this;
      o(A), A.q = A.c = "", A.bufferCheckPosition = t.MAX_BUFFER_LENGTH, A.opt = d || {}, A.opt.lowercase = A.opt.lowercase || A.opt.lowercasetags, A.looseCase = A.opt.lowercase ? "toLowerCase" : "toUpperCase", A.tags = [], A.closed = A.closedRoot = A.sawRoot = !1, A.tag = A.error = null, A.strict = !!m, A.noscript = !!(m || A.opt.noscript), A.state = _.BEGIN, A.strictEntities = A.opt.strictEntities, A.ENTITIES = A.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), A.attribList = [], A.opt.xmlns && (A.ns = Object.create(E)), A.opt.unquotedAttributeValues === void 0 && (A.opt.unquotedAttributeValues = !m), A.trackPosition = A.opt.position !== !1, A.trackPosition && (A.position = A.line = A.column = 0), q(A, "onready");
    }
    Object.create || (Object.create = function(m) {
      function d() {
      }
      d.prototype = m;
      var A = new d();
      return A;
    }), Object.keys || (Object.keys = function(m) {
      var d = [];
      for (var A in m) m.hasOwnProperty(A) && d.push(A);
      return d;
    });
    function i(m) {
      for (var d = Math.max(t.MAX_BUFFER_LENGTH, 10), A = 0, w = 0, K = n.length; w < K; w++) {
        var te = m[n[w]].length;
        if (te > d)
          switch (n[w]) {
            case "textNode":
              Q(m);
              break;
            case "cdata":
              H(m, "oncdata", m.cdata), m.cdata = "";
              break;
            case "script":
              H(m, "onscript", m.script), m.script = "";
              break;
            default:
              O(m, "Max buffer length exceeded: " + n[w]);
          }
        A = Math.max(A, te);
      }
      var se = t.MAX_BUFFER_LENGTH - A;
      m.bufferCheckPosition = se + m.position;
    }
    function o(m) {
      for (var d = 0, A = n.length; d < A; d++)
        m[n[d]] = "";
    }
    function s(m) {
      Q(m), m.cdata !== "" && (H(m, "oncdata", m.cdata), m.cdata = ""), m.script !== "" && (H(m, "onscript", m.script), m.script = "");
    }
    r.prototype = {
      end: function() {
        P(this);
      },
      write: Je,
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
    var l = t.EVENTS.filter(function(m) {
      return m !== "error" && m !== "end";
    });
    function f(m, d) {
      return new c(m, d);
    }
    function c(m, d) {
      if (!(this instanceof c))
        return new c(m, d);
      a.apply(this), this._parser = new r(m, d), this.writable = !0, this.readable = !0;
      var A = this;
      this._parser.onend = function() {
        A.emit("end");
      }, this._parser.onerror = function(w) {
        A.emit("error", w), A._parser.error = null;
      }, this._decoder = null, l.forEach(function(w) {
        Object.defineProperty(A, "on" + w, {
          get: function() {
            return A._parser["on" + w];
          },
          set: function(K) {
            if (!K)
              return A.removeAllListeners(w), A._parser["on" + w] = K, K;
            A.on(w, K);
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
    }), c.prototype.write = function(m) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(m)) {
        if (!this._decoder) {
          var d = If.StringDecoder;
          this._decoder = new d("utf8");
        }
        m = this._decoder.write(m);
      }
      return this._parser.write(m.toString()), this.emit("data", m), !0;
    }, c.prototype.end = function(m) {
      return m && m.length && this.write(m), this._parser.end(), !0;
    }, c.prototype.on = function(m, d) {
      var A = this;
      return !A._parser["on" + m] && l.indexOf(m) !== -1 && (A._parser["on" + m] = function() {
        var w = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        w.splice(0, 0, m), A.emit.apply(A, w);
      }), a.prototype.on.call(A, m, d);
    };
    var u = "[CDATA[", h = "DOCTYPE", p = "http://www.w3.org/XML/1998/namespace", y = "http://www.w3.org/2000/xmlns/", E = { xml: p, xmlns: y }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, S = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, C = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(m) {
      return m === " " || m === `
` || m === "\r" || m === "	";
    }
    function re(m) {
      return m === '"' || m === "'";
    }
    function le(m) {
      return m === ">" || x(m);
    }
    function z(m, d) {
      return m.test(d);
    }
    function Ue(m, d) {
      return !z(m, d);
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
    }, Object.keys(t.ENTITIES).forEach(function(m) {
      var d = t.ENTITIES[m], A = typeof d == "number" ? String.fromCharCode(d) : d;
      t.ENTITIES[m] = A;
    });
    for (var X in t.STATE)
      t.STATE[t.STATE[X]] = X;
    _ = t.STATE;
    function q(m, d, A) {
      m[d] && m[d](A);
    }
    function H(m, d, A) {
      m.textNode && Q(m), q(m, d, A);
    }
    function Q(m) {
      m.textNode = b(m.opt, m.textNode), m.textNode && q(m, "ontext", m.textNode), m.textNode = "";
    }
    function b(m, d) {
      return m.trim && (d = d.trim()), m.normalize && (d = d.replace(/\s+/g, " ")), d;
    }
    function O(m, d) {
      return Q(m), m.trackPosition && (d += `
Line: ` + m.line + `
Column: ` + m.column + `
Char: ` + m.c), d = new Error(d), m.error = d, q(m, "onerror", d), m;
    }
    function P(m) {
      return m.sawRoot && !m.closedRoot && I(m, "Unclosed root tag"), m.state !== _.BEGIN && m.state !== _.BEGIN_WHITESPACE && m.state !== _.TEXT && O(m, "Unexpected end"), Q(m), m.c = "", m.closed = !0, q(m, "onend"), r.call(m, m.strict, m.opt), m;
    }
    function I(m, d) {
      if (typeof m != "object" || !(m instanceof r))
        throw new Error("bad call to strictFail");
      m.strict && O(m, d);
    }
    function F(m) {
      m.strict || (m.tagName = m.tagName[m.looseCase]());
      var d = m.tags[m.tags.length - 1] || m, A = m.tag = { name: m.tagName, attributes: {} };
      m.opt.xmlns && (A.ns = d.ns), m.attribList.length = 0, H(m, "onopentagstart", A);
    }
    function $(m, d) {
      var A = m.indexOf(":"), w = A < 0 ? ["", m] : m.split(":"), K = w[0], te = w[1];
      return d && m === "xmlns" && (K = "xmlns", te = ""), { prefix: K, local: te };
    }
    function B(m) {
      if (m.strict || (m.attribName = m.attribName[m.looseCase]()), m.attribList.indexOf(m.attribName) !== -1 || m.tag.attributes.hasOwnProperty(m.attribName)) {
        m.attribName = m.attribValue = "";
        return;
      }
      if (m.opt.xmlns) {
        var d = $(m.attribName, !0), A = d.prefix, w = d.local;
        if (A === "xmlns")
          if (w === "xml" && m.attribValue !== p)
            I(
              m,
              "xml: prefix must be bound to " + p + `
Actual: ` + m.attribValue
            );
          else if (w === "xmlns" && m.attribValue !== y)
            I(
              m,
              "xmlns: prefix must be bound to " + y + `
Actual: ` + m.attribValue
            );
          else {
            var K = m.tag, te = m.tags[m.tags.length - 1] || m;
            K.ns === te.ns && (K.ns = Object.create(te.ns)), K.ns[w] = m.attribValue;
          }
        m.attribList.push([m.attribName, m.attribValue]);
      } else
        m.tag.attributes[m.attribName] = m.attribValue, H(m, "onattribute", {
          name: m.attribName,
          value: m.attribValue
        });
      m.attribName = m.attribValue = "";
    }
    function V(m, d) {
      if (m.opt.xmlns) {
        var A = m.tag, w = $(m.tagName);
        A.prefix = w.prefix, A.local = w.local, A.uri = A.ns[w.prefix] || "", A.prefix && !A.uri && (I(
          m,
          "Unbound namespace prefix: " + JSON.stringify(m.tagName)
        ), A.uri = w.prefix);
        var K = m.tags[m.tags.length - 1] || m;
        A.ns && K.ns !== A.ns && Object.keys(A.ns).forEach(function(cr) {
          H(m, "onopennamespace", {
            prefix: cr,
            uri: A.ns[cr]
          });
        });
        for (var te = 0, se = m.attribList.length; te < se; te++) {
          var ge = m.attribList[te], ve = ge[0], ct = ge[1], ue = $(ve, !0), Ye = ue.prefix, Ii = ue.local, lr = Ye === "" ? "" : A.ns[Ye] || "", En = {
            name: ve,
            value: ct,
            prefix: Ye,
            local: Ii,
            uri: lr
          };
          Ye && Ye !== "xmlns" && !lr && (I(
            m,
            "Unbound namespace prefix: " + JSON.stringify(Ye)
          ), En.uri = Ye), m.tag.attributes[ve] = En, H(m, "onattribute", En);
        }
        m.attribList.length = 0;
      }
      m.tag.isSelfClosing = !!d, m.sawRoot = !0, m.tags.push(m.tag), H(m, "onopentag", m.tag), d || (!m.noscript && m.tagName.toLowerCase() === "script" ? m.state = _.SCRIPT : m.state = _.TEXT, m.tag = null, m.tagName = ""), m.attribName = m.attribValue = "", m.attribList.length = 0;
    }
    function G(m) {
      if (!m.tagName) {
        I(m, "Weird empty close tag."), m.textNode += "</>", m.state = _.TEXT;
        return;
      }
      if (m.script) {
        if (m.tagName !== "script") {
          m.script += "</" + m.tagName + ">", m.tagName = "", m.state = _.SCRIPT;
          return;
        }
        H(m, "onscript", m.script), m.script = "";
      }
      var d = m.tags.length, A = m.tagName;
      m.strict || (A = A[m.looseCase]());
      for (var w = A; d--; ) {
        var K = m.tags[d];
        if (K.name !== w)
          I(m, "Unexpected close tag");
        else
          break;
      }
      if (d < 0) {
        I(m, "Unmatched closing tag: " + m.tagName), m.textNode += "</" + m.tagName + ">", m.state = _.TEXT;
        return;
      }
      m.tagName = A;
      for (var te = m.tags.length; te-- > d; ) {
        var se = m.tag = m.tags.pop();
        m.tagName = m.tag.name, H(m, "onclosetag", m.tagName);
        var ge = {};
        for (var ve in se.ns)
          ge[ve] = se.ns[ve];
        var ct = m.tags[m.tags.length - 1] || m;
        m.opt.xmlns && se.ns !== ct.ns && Object.keys(se.ns).forEach(function(ue) {
          var Ye = se.ns[ue];
          H(m, "onclosenamespace", { prefix: ue, uri: Ye });
        });
      }
      d === 0 && (m.closedRoot = !0), m.tagName = m.attribValue = m.attribName = "", m.attribList.length = 0, m.state = _.TEXT;
    }
    function Z(m) {
      var d = m.entity, A = d.toLowerCase(), w, K = "";
      return m.ENTITIES[d] ? m.ENTITIES[d] : m.ENTITIES[A] ? m.ENTITIES[A] : (d = A, d.charAt(0) === "#" && (d.charAt(1) === "x" ? (d = d.slice(2), w = parseInt(d, 16), K = w.toString(16)) : (d = d.slice(1), w = parseInt(d, 10), K = w.toString(10))), d = d.replace(/^0+/, ""), isNaN(w) || K.toLowerCase() !== d || w < 0 || w > 1114111 ? (I(m, "Invalid character entity"), "&" + m.entity + ";") : String.fromCodePoint(w));
    }
    function fe(m, d) {
      d === "<" ? (m.state = _.OPEN_WAKA, m.startTagPosition = m.position) : x(d) || (I(m, "Non-whitespace before first tag."), m.textNode = d, m.state = _.TEXT);
    }
    function U(m, d) {
      var A = "";
      return d < m.length && (A = m.charAt(d)), A;
    }
    function Je(m) {
      var d = this;
      if (this.error)
        throw this.error;
      if (d.closed)
        return O(
          d,
          "Cannot write after close. Assign an onready handler."
        );
      if (m === null)
        return P(d);
      typeof m == "object" && (m = m.toString());
      for (var A = 0, w = ""; w = U(m, A++), d.c = w, !!w; )
        switch (d.trackPosition && (d.position++, w === `
` ? (d.line++, d.column = 0) : d.column++), d.state) {
          case _.BEGIN:
            if (d.state = _.BEGIN_WHITESPACE, w === "\uFEFF")
              continue;
            fe(d, w);
            continue;
          case _.BEGIN_WHITESPACE:
            fe(d, w);
            continue;
          case _.TEXT:
            if (d.sawRoot && !d.closedRoot) {
              for (var te = A - 1; w && w !== "<" && w !== "&"; )
                w = U(m, A++), w && d.trackPosition && (d.position++, w === `
` ? (d.line++, d.column = 0) : d.column++);
              d.textNode += m.substring(te, A - 1);
            }
            w === "<" && !(d.sawRoot && d.closedRoot && !d.strict) ? (d.state = _.OPEN_WAKA, d.startTagPosition = d.position) : (!x(w) && (!d.sawRoot || d.closedRoot) && I(d, "Text data outside of root node."), w === "&" ? d.state = _.TEXT_ENTITY : d.textNode += w);
            continue;
          case _.SCRIPT:
            w === "<" ? d.state = _.SCRIPT_ENDING : d.script += w;
            continue;
          case _.SCRIPT_ENDING:
            w === "/" ? d.state = _.CLOSE_TAG : (d.script += "<" + w, d.state = _.SCRIPT);
            continue;
          case _.OPEN_WAKA:
            if (w === "!")
              d.state = _.SGML_DECL, d.sgmlDecl = "";
            else if (!x(w)) if (z(T, w))
              d.state = _.OPEN_TAG, d.tagName = w;
            else if (w === "/")
              d.state = _.CLOSE_TAG, d.tagName = "";
            else if (w === "?")
              d.state = _.PROC_INST, d.procInstName = d.procInstBody = "";
            else {
              if (I(d, "Unencoded <"), d.startTagPosition + 1 < d.position) {
                var K = d.position - d.startTagPosition;
                w = new Array(K).join(" ") + w;
              }
              d.textNode += "<" + w, d.state = _.TEXT;
            }
            continue;
          case _.SGML_DECL:
            if (d.sgmlDecl + w === "--") {
              d.state = _.COMMENT, d.comment = "", d.sgmlDecl = "";
              continue;
            }
            d.doctype && d.doctype !== !0 && d.sgmlDecl ? (d.state = _.DOCTYPE_DTD, d.doctype += "<!" + d.sgmlDecl + w, d.sgmlDecl = "") : (d.sgmlDecl + w).toUpperCase() === u ? (H(d, "onopencdata"), d.state = _.CDATA, d.sgmlDecl = "", d.cdata = "") : (d.sgmlDecl + w).toUpperCase() === h ? (d.state = _.DOCTYPE, (d.doctype || d.sawRoot) && I(
              d,
              "Inappropriately located doctype declaration"
            ), d.doctype = "", d.sgmlDecl = "") : w === ">" ? (H(d, "onsgmldeclaration", d.sgmlDecl), d.sgmlDecl = "", d.state = _.TEXT) : (re(w) && (d.state = _.SGML_DECL_QUOTED), d.sgmlDecl += w);
            continue;
          case _.SGML_DECL_QUOTED:
            w === d.q && (d.state = _.SGML_DECL, d.q = ""), d.sgmlDecl += w;
            continue;
          case _.DOCTYPE:
            w === ">" ? (d.state = _.TEXT, H(d, "ondoctype", d.doctype), d.doctype = !0) : (d.doctype += w, w === "[" ? d.state = _.DOCTYPE_DTD : re(w) && (d.state = _.DOCTYPE_QUOTED, d.q = w));
            continue;
          case _.DOCTYPE_QUOTED:
            d.doctype += w, w === d.q && (d.q = "", d.state = _.DOCTYPE);
            continue;
          case _.DOCTYPE_DTD:
            w === "]" ? (d.doctype += w, d.state = _.DOCTYPE) : w === "<" ? (d.state = _.OPEN_WAKA, d.startTagPosition = d.position) : re(w) ? (d.doctype += w, d.state = _.DOCTYPE_DTD_QUOTED, d.q = w) : d.doctype += w;
            continue;
          case _.DOCTYPE_DTD_QUOTED:
            d.doctype += w, w === d.q && (d.state = _.DOCTYPE_DTD, d.q = "");
            continue;
          case _.COMMENT:
            w === "-" ? d.state = _.COMMENT_ENDING : d.comment += w;
            continue;
          case _.COMMENT_ENDING:
            w === "-" ? (d.state = _.COMMENT_ENDED, d.comment = b(d.opt, d.comment), d.comment && H(d, "oncomment", d.comment), d.comment = "") : (d.comment += "-" + w, d.state = _.COMMENT);
            continue;
          case _.COMMENT_ENDED:
            w !== ">" ? (I(d, "Malformed comment"), d.comment += "--" + w, d.state = _.COMMENT) : d.doctype && d.doctype !== !0 ? d.state = _.DOCTYPE_DTD : d.state = _.TEXT;
            continue;
          case _.CDATA:
            for (var te = A - 1; w && w !== "]"; )
              w = U(m, A++), w && d.trackPosition && (d.position++, w === `
` ? (d.line++, d.column = 0) : d.column++);
            d.cdata += m.substring(te, A - 1), w === "]" && (d.state = _.CDATA_ENDING);
            continue;
          case _.CDATA_ENDING:
            w === "]" ? d.state = _.CDATA_ENDING_2 : (d.cdata += "]" + w, d.state = _.CDATA);
            continue;
          case _.CDATA_ENDING_2:
            w === ">" ? (d.cdata && H(d, "oncdata", d.cdata), H(d, "onclosecdata"), d.cdata = "", d.state = _.TEXT) : w === "]" ? d.cdata += "]" : (d.cdata += "]]" + w, d.state = _.CDATA);
            continue;
          case _.PROC_INST:
            w === "?" ? d.state = _.PROC_INST_ENDING : x(w) ? d.state = _.PROC_INST_BODY : d.procInstName += w;
            continue;
          case _.PROC_INST_BODY:
            if (!d.procInstBody && x(w))
              continue;
            w === "?" ? d.state = _.PROC_INST_ENDING : d.procInstBody += w;
            continue;
          case _.PROC_INST_ENDING:
            w === ">" ? (H(d, "onprocessinginstruction", {
              name: d.procInstName,
              body: d.procInstBody
            }), d.procInstName = d.procInstBody = "", d.state = _.TEXT) : (d.procInstBody += "?" + w, d.state = _.PROC_INST_BODY);
            continue;
          case _.OPEN_TAG:
            z(S, w) ? d.tagName += w : (F(d), w === ">" ? V(d) : w === "/" ? d.state = _.OPEN_TAG_SLASH : (x(w) || I(d, "Invalid character in tag name"), d.state = _.ATTRIB));
            continue;
          case _.OPEN_TAG_SLASH:
            w === ">" ? (V(d, !0), G(d)) : (I(
              d,
              "Forward-slash in opening tag not followed by >"
            ), d.state = _.ATTRIB);
            continue;
          case _.ATTRIB:
            if (x(w))
              continue;
            w === ">" ? V(d) : w === "/" ? d.state = _.OPEN_TAG_SLASH : z(T, w) ? (d.attribName = w, d.attribValue = "", d.state = _.ATTRIB_NAME) : I(d, "Invalid attribute name");
            continue;
          case _.ATTRIB_NAME:
            w === "=" ? d.state = _.ATTRIB_VALUE : w === ">" ? (I(d, "Attribute without value"), d.attribValue = d.attribName, B(d), V(d)) : x(w) ? d.state = _.ATTRIB_NAME_SAW_WHITE : z(S, w) ? d.attribName += w : I(d, "Invalid attribute name");
            continue;
          case _.ATTRIB_NAME_SAW_WHITE:
            if (w === "=")
              d.state = _.ATTRIB_VALUE;
            else {
              if (x(w))
                continue;
              I(d, "Attribute without value"), d.tag.attributes[d.attribName] = "", d.attribValue = "", H(d, "onattribute", {
                name: d.attribName,
                value: ""
              }), d.attribName = "", w === ">" ? V(d) : z(T, w) ? (d.attribName = w, d.state = _.ATTRIB_NAME) : (I(d, "Invalid attribute name"), d.state = _.ATTRIB);
            }
            continue;
          case _.ATTRIB_VALUE:
            if (x(w))
              continue;
            re(w) ? (d.q = w, d.state = _.ATTRIB_VALUE_QUOTED) : (d.opt.unquotedAttributeValues || O(d, "Unquoted attribute value"), d.state = _.ATTRIB_VALUE_UNQUOTED, d.attribValue = w);
            continue;
          case _.ATTRIB_VALUE_QUOTED:
            if (w !== d.q) {
              w === "&" ? d.state = _.ATTRIB_VALUE_ENTITY_Q : d.attribValue += w;
              continue;
            }
            B(d), d.q = "", d.state = _.ATTRIB_VALUE_CLOSED;
            continue;
          case _.ATTRIB_VALUE_CLOSED:
            x(w) ? d.state = _.ATTRIB : w === ">" ? V(d) : w === "/" ? d.state = _.OPEN_TAG_SLASH : z(T, w) ? (I(d, "No whitespace between attributes"), d.attribName = w, d.attribValue = "", d.state = _.ATTRIB_NAME) : I(d, "Invalid attribute name");
            continue;
          case _.ATTRIB_VALUE_UNQUOTED:
            if (!le(w)) {
              w === "&" ? d.state = _.ATTRIB_VALUE_ENTITY_U : d.attribValue += w;
              continue;
            }
            B(d), w === ">" ? V(d) : d.state = _.ATTRIB;
            continue;
          case _.CLOSE_TAG:
            if (d.tagName)
              w === ">" ? G(d) : z(S, w) ? d.tagName += w : d.script ? (d.script += "</" + d.tagName, d.tagName = "", d.state = _.SCRIPT) : (x(w) || I(d, "Invalid tagname in closing tag"), d.state = _.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(w))
                continue;
              Ue(T, w) ? d.script ? (d.script += "</" + w, d.state = _.SCRIPT) : I(d, "Invalid tagname in closing tag.") : d.tagName = w;
            }
            continue;
          case _.CLOSE_TAG_SAW_WHITE:
            if (x(w))
              continue;
            w === ">" ? G(d) : I(d, "Invalid characters in closing tag");
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
            if (w === ";") {
              var ve = Z(d);
              d.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ve) ? (d.entity = "", d.state = se, d.write(ve)) : (d[ge] += ve, d.entity = "", d.state = se);
            } else z(d.entity.length ? D : C, w) ? d.entity += w : (I(d, "Invalid character in entity name"), d[ge] += "&" + d.entity + w, d.entity = "", d.state = se);
            continue;
          default:
            throw new Error(d, "Unknown state: " + d.state);
        }
      return d.position >= d.bufferCheckPosition && i(d), d;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var m = String.fromCharCode, d = Math.floor, A = function() {
        var w = 16384, K = [], te, se, ge = -1, ve = arguments.length;
        if (!ve)
          return "";
        for (var ct = ""; ++ge < ve; ) {
          var ue = Number(arguments[ge]);
          if (!isFinite(ue) || // `NaN`, `+Infinity`, or `-Infinity`
          ue < 0 || // not a valid Unicode code point
          ue > 1114111 || // not a valid Unicode code point
          d(ue) !== ue)
            throw RangeError("Invalid code point: " + ue);
          ue <= 65535 ? K.push(ue) : (ue -= 65536, te = (ue >> 10) + 55296, se = ue % 1024 + 56320, K.push(te, se)), (ge + 1 === ve || K.length > w) && (ct += m.apply(null, K), K.length = 0);
        }
        return ct;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: A,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = A;
    }();
  })(e);
})(kc);
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.XElement = void 0;
Zn.parseXml = Mm;
const xm = kc, Sr = pn;
class Uc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Sr.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Um(t))
      throw (0, Sr.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, Sr.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, Sr.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (ha(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => ha(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
Zn.XElement = Uc;
const km = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Um(e) {
  return km.test(e);
}
function ha(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function Mm(e) {
  let t = null;
  const n = xm.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new Uc(i.name);
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
  var t = wt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = pn;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = Ne;
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
  var i = ai;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = Qn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var s = li;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } });
  var a = Xo;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var l = Vo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var f = un;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return f.UUID;
  } });
  var c = Zn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function u(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(me);
var _e = {}, Wo = {}, We = {};
function Mc(e) {
  return typeof e > "u" || e === null;
}
function Bm(e) {
  return typeof e == "object" && e !== null;
}
function Hm(e) {
  return Array.isArray(e) ? e : Mc(e) ? [] : [e];
}
function jm(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function qm(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function Gm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
We.isNothing = Mc;
We.isObject = Bm;
We.toArray = Hm;
We.repeat = qm;
We.isNegativeZero = Gm;
We.extend = jm;
function Bc(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Un(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Bc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Un.prototype = Object.create(Error.prototype);
Un.prototype.constructor = Un;
Un.prototype.toString = function(t) {
  return this.name + ": " + Bc(this, t);
};
var er = Un, On = We;
function qi(e, t, n, r, i) {
  var o = "", s = "", a = Math.floor(i / 2) - 1;
  return r - t > a && (o = " ... ", t = r - a + o.length), n - r > a && (s = " ...", n = r + a - s.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + s,
    pos: r - t + o.length
    // relative position
  };
}
function Gi(e, t) {
  return On.repeat(" ", t - e.length) + e;
}
function Ym(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, s = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = r.length - 2);
  s < 0 && (s = r.length - 1);
  var a = "", l, f, c = Math.min(e.line + t.linesAfter, i.length).toString().length, u = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(s - l < 0); l++)
    f = qi(
      e.buffer,
      r[s - l],
      i[s - l],
      e.position - (r[s] - r[s - l]),
      u
    ), a = On.repeat(" ", t.indent) + Gi((e.line - l + 1).toString(), c) + " | " + f.str + `
` + a;
  for (f = qi(e.buffer, r[s], i[s], e.position, u), a += On.repeat(" ", t.indent) + Gi((e.line + 1).toString(), c) + " | " + f.str + `
`, a += On.repeat("-", t.indent + c + 3 + f.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++)
    f = qi(
      e.buffer,
      r[s + l],
      i[s + l],
      e.position - (r[s] - r[s + l]),
      u
    ), a += On.repeat(" ", t.indent) + Gi((e.line + l + 1).toString(), c) + " | " + f.str + `
`;
  return a.replace(/\n$/, "");
}
var Xm = Ym, pa = er, Vm = [
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
], Wm = [
  "scalar",
  "sequence",
  "mapping"
];
function zm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function Km(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (Vm.indexOf(n) === -1)
      throw new pa('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = zm(t.styleAliases || null), Wm.indexOf(this.kind) === -1)
    throw new pa('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var De = Km, Sn = er, Yi = De;
function ma(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, s) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = s);
    }), n[i] = r;
  }), n;
}
function Jm() {
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
function _o(e) {
  return this.extend(e);
}
_o.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof Yi)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new Sn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Yi))
      throw new Sn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Sn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Sn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Yi))
      throw new Sn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(_o.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = ma(i, "implicit"), i.compiledExplicit = ma(i, "explicit"), i.compiledTypeMap = Jm(i.compiledImplicit, i.compiledExplicit), i;
};
var Hc = _o, Qm = De, jc = new Qm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Zm = De, qc = new Zm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), eg = De, Gc = new eg("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), tg = Hc, Yc = new tg({
  explicit: [
    jc,
    qc,
    Gc
  ]
}), ng = De;
function rg(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function ig() {
  return null;
}
function og(e) {
  return e === null;
}
var Xc = new ng("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: rg,
  construct: ig,
  predicate: og,
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
}), sg = De;
function ag(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function lg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function cg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Vc = new sg("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: ag,
  construct: lg,
  predicate: cg,
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
}), ug = We, dg = De;
function fg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function hg(e) {
  return 48 <= e && e <= 55;
}
function pg(e) {
  return 48 <= e && e <= 57;
}
function mg(e) {
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
          if (!fg(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!hg(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!pg(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function gg(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function Eg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !ug.isNegativeZero(e);
}
var Wc = new dg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: mg,
  construct: gg,
  predicate: Eg,
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
}), zc = We, yg = De, _g = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function vg(e) {
  return !(e === null || !_g.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function wg(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var Tg = /^[-+]?[0-9]+e/;
function Sg(e, t) {
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
  else if (zc.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), Tg.test(n) ? n.replace("e", ".e") : n;
}
function Cg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || zc.isNegativeZero(e));
}
var Kc = new yg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: vg,
  construct: wg,
  predicate: Cg,
  represent: Sg,
  defaultStyle: "lowercase"
}), Jc = Yc.extend({
  implicit: [
    Xc,
    Vc,
    Wc,
    Kc
  ]
}), Qc = Jc, Ag = De, Zc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), eu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Ig(e) {
  return e === null ? !1 : Zc.exec(e) !== null || eu.exec(e) !== null;
}
function Og(e) {
  var t, n, r, i, o, s, a, l = 0, f = null, c, u, h;
  if (t = Zc.exec(e), t === null && (t = eu.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], s = +t[5], a = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], u = +(t[11] || 0), f = (c * 60 + u) * 6e4, t[9] === "-" && (f = -f)), h = new Date(Date.UTC(n, r, i, o, s, a, l)), f && h.setTime(h.getTime() - f), h;
}
function Rg(e) {
  return e.toISOString();
}
var tu = new Ag("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Ig,
  construct: Og,
  instanceOf: Date,
  represent: Rg
}), Ng = De;
function bg(e) {
  return e === "<<" || e === null;
}
var nu = new Ng("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: bg
}), $g = De, zo = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Pg(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = zo;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function Dg(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = zo, s = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : n === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : n === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function Fg(e) {
  var t = "", n = 0, r, i, o = e.length, s = zo;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]) : i === 2 ? (t += s[n >> 10 & 63], t += s[n >> 4 & 63], t += s[n << 2 & 63], t += s[64]) : i === 1 && (t += s[n >> 2 & 63], t += s[n << 4 & 63], t += s[64], t += s[64]), t;
}
function Lg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var ru = new $g("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Pg,
  construct: Dg,
  predicate: Lg,
  represent: Fg
}), xg = De, kg = Object.prototype.hasOwnProperty, Ug = Object.prototype.toString;
function Mg(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, s, a = e;
  for (n = 0, r = a.length; n < r; n += 1) {
    if (i = a[n], s = !1, Ug.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (kg.call(i, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Bg(e) {
  return e !== null ? e : [];
}
var iu = new xg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Mg,
  construct: Bg
}), Hg = De, jg = Object.prototype.toString;
function qg(e) {
  if (e === null) return !0;
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1) {
    if (r = s[t], jg.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function Gg(e) {
  if (e === null) return [];
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1)
    r = s[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var ou = new Hg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: qg,
  construct: Gg
}), Yg = De, Xg = Object.prototype.hasOwnProperty;
function Vg(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (Xg.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function Wg(e) {
  return e !== null ? e : {};
}
var su = new Yg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Vg,
  construct: Wg
}), Ko = Qc.extend({
  implicit: [
    tu,
    nu
  ],
  explicit: [
    ru,
    iu,
    ou,
    su
  ]
}), kt = We, au = er, zg = Xm, Kg = Ko, Tt = Object.prototype.hasOwnProperty, Vr = 1, lu = 2, cu = 3, Wr = 4, Xi = 1, Jg = 2, ga = 3, Qg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Zg = /[\x85\u2028\u2029]/, e0 = /[,\[\]\{\}]/, uu = /^(?:!|!!|![a-z\-]+!)$/i, du = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Ea(e) {
  return Object.prototype.toString.call(e);
}
function et(e) {
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
function t0(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function n0(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function r0(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function ya(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function i0(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function fu(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var hu = new Array(256), pu = new Array(256);
for (var Wt = 0; Wt < 256; Wt++)
  hu[Wt] = ya(Wt) ? 1 : 0, pu[Wt] = ya(Wt);
function o0(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Kg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function mu(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = zg(n), new au(t, n);
}
function k(e, t) {
  throw mu(e, t);
}
function zr(e, t) {
  e.onWarning && e.onWarning.call(null, mu(e, t));
}
var _a = {
  YAML: function(t, n, r) {
    var i, o, s;
    t.version !== null && k(t, "duplication of %YAML directive"), r.length !== 1 && k(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && k(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), s = parseInt(i[2], 10), o !== 1 && k(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && zr(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && k(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], uu.test(i) || k(t, "ill-formed tag handle (first argument) of the TAG directive"), Tt.call(t.tagMap, i) && k(t, 'there is a previously declared suffix for "' + i + '" tag handle'), du.test(o) || k(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      k(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function _t(e, t, n, r) {
  var i, o, s, a;
  if (t < n) {
    if (a = e.input.slice(t, n), r)
      for (i = 0, o = a.length; i < o; i += 1)
        s = a.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || k(e, "expected valid JSON character");
    else Qg.test(a) && k(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function va(e, t, n, r) {
  var i, o, s, a;
  for (kt.isObject(n) || k(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), s = 0, a = i.length; s < a; s += 1)
    o = i[s], Tt.call(t, o) || (fu(t, o, n[o]), r[o] = !0);
}
function tn(e, t, n, r, i, o, s, a, l) {
  var f, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), f = 0, c = i.length; f < c; f += 1)
      Array.isArray(i[f]) && k(e, "nested arrays are not supported inside keys"), typeof i == "object" && Ea(i[f]) === "[object Object]" && (i[f] = "[object Object]");
  if (typeof i == "object" && Ea(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (f = 0, c = o.length; f < c; f += 1)
        va(e, t, o[f], n);
    else
      va(e, t, o, n);
  else
    !e.json && !Tt.call(n, i) && Tt.call(t, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = l || e.position, k(e, "duplicated mapping key")), fu(t, i, o), delete n[i];
  return t;
}
function Jo(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : k(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ce(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Bt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (et(i))
      for (Jo(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && zr(e, "deficient indentation"), r;
}
function ci(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || ke(n)));
}
function Qo(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += kt.repeat(`
`, t - 1));
}
function s0(e, t, n) {
  var r, i, o, s, a, l, f, c, u = e.kind, h = e.result, p;
  if (p = e.input.charCodeAt(e.position), ke(p) || en(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), ke(i) || n && en(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; p !== 0; ) {
    if (p === 58) {
      if (i = e.input.charCodeAt(e.position + 1), ke(i) || n && en(i))
        break;
    } else if (p === 35) {
      if (r = e.input.charCodeAt(e.position - 1), ke(r))
        break;
    } else {
      if (e.position === e.lineStart && ci(e) || n && en(p))
        break;
      if (et(p))
        if (l = e.line, f = e.lineStart, c = e.lineIndent, ce(e, !1, -1), e.lineIndent >= t) {
          a = !0, p = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = f, e.lineIndent = c;
          break;
        }
    }
    a && (_t(e, o, s, !1), Qo(e, e.line - l), o = s = e.position, a = !1), Bt(p) || (s = e.position + 1), p = e.input.charCodeAt(++e.position);
  }
  return _t(e, o, s, !1), e.result ? !0 : (e.kind = u, e.result = h, !1);
}
function a0(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (_t(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else et(n) ? (_t(e, r, i, !0), Qo(e, ce(e, !1, t)), r = i = e.position) : e.position === e.lineStart && ci(e) ? k(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  k(e, "unexpected end of the stream within a single quoted scalar");
}
function l0(e, t) {
  var n, r, i, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return _t(e, n, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (_t(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), et(a))
        ce(e, !1, t);
      else if (a < 256 && hu[a])
        e.result += pu[a], e.position++;
      else if ((s = n0(a)) > 0) {
        for (i = s, o = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (s = t0(a)) >= 0 ? o = (o << 4) + s : k(e, "expected hexadecimal character");
        e.result += i0(o), e.position++;
      } else
        k(e, "unknown escape sequence");
      n = r = e.position;
    } else et(a) ? (_t(e, n, r, !0), Qo(e, ce(e, !1, t)), n = r = e.position) : e.position === e.lineStart && ci(e) ? k(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  k(e, "unexpected end of the stream within a double quoted scalar");
}
function c0(e, t) {
  var n = !0, r, i, o, s = e.tag, a, l = e.anchor, f, c, u, h, p, y = /* @__PURE__ */ Object.create(null), E, T, S, C;
  if (C = e.input.charCodeAt(e.position), C === 91)
    c = 93, p = !1, a = [];
  else if (C === 123)
    c = 125, p = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), C = e.input.charCodeAt(++e.position); C !== 0; ) {
    if (ce(e, !0, t), C = e.input.charCodeAt(e.position), C === c)
      return e.position++, e.tag = s, e.anchor = l, e.kind = p ? "mapping" : "sequence", e.result = a, !0;
    n ? C === 44 && k(e, "expected the node content, but found ','") : k(e, "missed comma between flow collection entries"), T = E = S = null, u = h = !1, C === 63 && (f = e.input.charCodeAt(e.position + 1), ke(f) && (u = h = !0, e.position++, ce(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, dn(e, t, Vr, !1, !0), T = e.tag, E = e.result, ce(e, !0, t), C = e.input.charCodeAt(e.position), (h || e.line === r) && C === 58 && (u = !0, C = e.input.charCodeAt(++e.position), ce(e, !0, t), dn(e, t, Vr, !1, !0), S = e.result), p ? tn(e, a, y, T, E, S, r, i, o) : u ? a.push(tn(e, null, y, T, E, S, r, i, o)) : a.push(E), ce(e, !0, t), C = e.input.charCodeAt(e.position), C === 44 ? (n = !0, C = e.input.charCodeAt(++e.position)) : n = !1;
  }
  k(e, "unexpected end of the stream within a flow collection");
}
function u0(e, t) {
  var n, r, i = Xi, o = !1, s = !1, a = t, l = 0, f = !1, c, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    r = !1;
  else if (u === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      Xi === i ? i = u === 43 ? ga : Jg : k(e, "repeat of a chomping mode identifier");
    else if ((c = r0(u)) >= 0)
      c === 0 ? k(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? k(e, "repeat of an indentation width identifier") : (a = t + c - 1, s = !0);
    else
      break;
  if (Bt(u)) {
    do
      u = e.input.charCodeAt(++e.position);
    while (Bt(u));
    if (u === 35)
      do
        u = e.input.charCodeAt(++e.position);
      while (!et(u) && u !== 0);
  }
  for (; u !== 0; ) {
    for (Jo(e), e.lineIndent = 0, u = e.input.charCodeAt(e.position); (!s || e.lineIndent < a) && u === 32; )
      e.lineIndent++, u = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > a && (a = e.lineIndent), et(u)) {
      l++;
      continue;
    }
    if (e.lineIndent < a) {
      i === ga ? e.result += kt.repeat(`
`, o ? 1 + l : l) : i === Xi && o && (e.result += `
`);
      break;
    }
    for (r ? Bt(u) ? (f = !0, e.result += kt.repeat(`
`, o ? 1 + l : l)) : f ? (f = !1, e.result += kt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += kt.repeat(`
`, l) : e.result += kt.repeat(`
`, o ? 1 + l : l), o = !0, s = !0, l = 0, n = e.position; !et(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    _t(e, n, e.position, !1);
  }
  return !0;
}
function wa(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], s, a = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, k(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !ke(s)))); ) {
    if (a = !0, e.position++, ce(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, dn(e, t, cu, !1, !0), o.push(e.result), ce(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      k(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function d0(e, t, n) {
  var r, i, o, s, a, l, f = e.tag, c = e.anchor, u = {}, h = /* @__PURE__ */ Object.create(null), p = null, y = null, E = null, T = !1, S = !1, C;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), C = e.input.charCodeAt(e.position); C !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, k(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (C === 63 || C === 58) && ke(r))
      C === 63 ? (T && (tn(e, u, h, p, y, null, s, a, l), p = y = E = null), S = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : k(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, C = r;
    else {
      if (s = e.line, a = e.lineStart, l = e.position, !dn(e, n, lu, !1, !0))
        break;
      if (e.line === o) {
        for (C = e.input.charCodeAt(e.position); Bt(C); )
          C = e.input.charCodeAt(++e.position);
        if (C === 58)
          C = e.input.charCodeAt(++e.position), ke(C) || k(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (tn(e, u, h, p, y, null, s, a, l), p = y = E = null), S = !0, T = !1, i = !1, p = e.tag, y = e.result;
        else if (S)
          k(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = f, e.anchor = c, !0;
      } else if (S)
        k(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = f, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (T && (s = e.line, a = e.lineStart, l = e.position), dn(e, t, Wr, !0, i) && (T ? y = e.result : E = e.result), T || (tn(e, u, h, p, y, E, s, a, l), p = y = E = null), ce(e, !0, -1), C = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && C !== 0)
      k(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && tn(e, u, h, p, y, null, s, a, l), S && (e.tag = f, e.anchor = c, e.kind = "mapping", e.result = u), S;
}
function f0(e) {
  var t, n = !1, r = !1, i, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && k(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (n = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (r = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : k(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !ke(s); )
      s === 33 && (r ? k(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), uu.test(i) || k(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), e0.test(o) && k(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !du.test(o) && k(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    k(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : Tt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : k(e, 'undeclared tag handle "' + i + '"'), !0;
}
function h0(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && k(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !ke(n) && !en(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && k(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function p0(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !ke(r) && !en(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && k(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), Tt.call(e.anchorMap, n) || k(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], ce(e, !0, -1), !0;
}
function dn(e, t, n, r, i) {
  var o, s, a, l = 1, f = !1, c = !1, u, h, p, y, E, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = Wr === n || cu === n, r && ce(e, !0, -1) && (f = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; f0(e) || h0(e); )
      ce(e, !0, -1) ? (f = !0, a = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : a = !1;
  if (a && (a = f || i), (l === 1 || Wr === n) && (Vr === n || lu === n ? E = t : E = t + 1, T = e.position - e.lineStart, l === 1 ? a && (wa(e, T) || d0(e, T, E)) || c0(e, E) ? c = !0 : (s && u0(e, E) || a0(e, E) || l0(e, E) ? c = !0 : p0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && k(e, "alias node should not have any properties")) : s0(e, E, Vr === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = a && wa(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && k(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, h = e.implicitTypes.length; u < h; u += 1)
      if (y = e.implicitTypes[u], y.resolve(e.result)) {
        e.result = y.construct(e.result), e.tag = y.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Tt.call(e.typeMap[e.kind || "fallback"], e.tag))
      y = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (y = null, p = e.typeMap.multi[e.kind || "fallback"], u = 0, h = p.length; u < h; u += 1)
        if (e.tag.slice(0, p[u].tag.length) === p[u].tag) {
          y = p[u];
          break;
        }
    y || k(e, "unknown tag !<" + e.tag + ">"), e.result !== null && y.kind !== e.kind && k(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + y.kind + '", not "' + e.kind + '"'), y.resolve(e.result, e.tag) ? (e.result = y.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : k(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function m0(e) {
  var t = e.position, n, r, i, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (ce(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), n = e.position; s !== 0 && !ke(s); )
      s = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && k(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; Bt(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !et(s));
        break;
      }
      if (et(s)) break;
      for (n = e.position; s !== 0 && !ke(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    s !== 0 && Jo(e), Tt.call(_a, r) ? _a[r](e, r, i) : zr(e, 'unknown document directive "' + r + '"');
  }
  if (ce(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ce(e, !0, -1)) : o && k(e, "directives end mark is expected"), dn(e, e.lineIndent - 1, Wr, !1, !0), ce(e, !0, -1), e.checkLineBreaks && Zg.test(e.input.slice(t, e.position)) && zr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ci(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ce(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    k(e, "end of the stream or a document separator is expected");
  else
    return;
}
function gu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new o0(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, k(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    m0(n);
  return n.documents;
}
function g0(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = gu(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function E0(e, t) {
  var n = gu(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new au("expected a single document in the stream, but found more");
  }
}
Wo.loadAll = g0;
Wo.load = E0;
var Eu = {}, ui = We, tr = er, y0 = Ko, yu = Object.prototype.toString, _u = Object.prototype.hasOwnProperty, Zo = 65279, _0 = 9, Mn = 10, v0 = 13, w0 = 32, T0 = 33, S0 = 34, vo = 35, C0 = 37, A0 = 38, I0 = 39, O0 = 42, vu = 44, R0 = 45, Kr = 58, N0 = 61, b0 = 62, $0 = 63, P0 = 64, wu = 91, Tu = 93, D0 = 96, Su = 123, F0 = 124, Cu = 125, Ce = {};
Ce[0] = "\\0";
Ce[7] = "\\a";
Ce[8] = "\\b";
Ce[9] = "\\t";
Ce[10] = "\\n";
Ce[11] = "\\v";
Ce[12] = "\\f";
Ce[13] = "\\r";
Ce[27] = "\\e";
Ce[34] = '\\"';
Ce[92] = "\\\\";
Ce[133] = "\\N";
Ce[160] = "\\_";
Ce[8232] = "\\L";
Ce[8233] = "\\P";
var L0 = [
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
], x0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function k0(e, t) {
  var n, r, i, o, s, a, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    s = r[i], a = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && _u.call(l.styleAliases, a) && (a = l.styleAliases[a]), n[s] = a;
  return n;
}
function U0(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new tr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + ui.repeat("0", r - t.length) + t;
}
var M0 = 1, Bn = 2;
function B0(e) {
  this.schema = e.schema || y0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ui.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = k0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Bn : M0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ta(e, t) {
  for (var n = ui.repeat(" ", t), r = 0, i = -1, o = "", s, a = e.length; r < a; )
    i = e.indexOf(`
`, r), i === -1 ? (s = e.slice(r), r = a) : (s = e.slice(r, i + 1), r = i + 1), s.length && s !== `
` && (o += n), o += s;
  return o;
}
function wo(e, t) {
  return `
` + ui.repeat(" ", e.indent * t);
}
function H0(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function Jr(e) {
  return e === w0 || e === _0;
}
function Hn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Zo || 65536 <= e && e <= 1114111;
}
function Sa(e) {
  return Hn(e) && e !== Zo && e !== v0 && e !== Mn;
}
function Ca(e, t, n) {
  var r = Sa(e), i = r && !Jr(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== vu && e !== wu && e !== Tu && e !== Su && e !== Cu) && e !== vo && !(t === Kr && !i) || Sa(t) && !Jr(t) && e === vo || t === Kr && i
  );
}
function j0(e) {
  return Hn(e) && e !== Zo && !Jr(e) && e !== R0 && e !== $0 && e !== Kr && e !== vu && e !== wu && e !== Tu && e !== Su && e !== Cu && e !== vo && e !== A0 && e !== O0 && e !== T0 && e !== F0 && e !== N0 && e !== b0 && e !== I0 && e !== S0 && e !== C0 && e !== P0 && e !== D0;
}
function q0(e) {
  return !Jr(e) && e !== Kr;
}
function Rn(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Au(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Iu = 1, To = 2, Ou = 3, Ru = 4, Zt = 5;
function G0(e, t, n, r, i, o, s, a) {
  var l, f = 0, c = null, u = !1, h = !1, p = r !== -1, y = -1, E = j0(Rn(e, 0)) && q0(Rn(e, e.length - 1));
  if (t || s)
    for (l = 0; l < e.length; f >= 65536 ? l += 2 : l++) {
      if (f = Rn(e, l), !Hn(f))
        return Zt;
      E = E && Ca(f, c, a), c = f;
    }
  else {
    for (l = 0; l < e.length; f >= 65536 ? l += 2 : l++) {
      if (f = Rn(e, l), f === Mn)
        u = !0, p && (h = h || // Foldable line = too long, and not more-indented.
        l - y - 1 > r && e[y + 1] !== " ", y = l);
      else if (!Hn(f))
        return Zt;
      E = E && Ca(f, c, a), c = f;
    }
    h = h || p && l - y - 1 > r && e[y + 1] !== " ";
  }
  return !u && !h ? E && !s && !i(e) ? Iu : o === Bn ? Zt : To : n > 9 && Au(e) ? Zt : s ? o === Bn ? Zt : To : h ? Ru : Ou;
}
function Y0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Bn ? '""' : "''";
    if (!e.noCompatMode && (L0.indexOf(t) !== -1 || x0.test(t)))
      return e.quotingType === Bn ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(f) {
      return H0(e, f);
    }
    switch (G0(
      t,
      a,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case Iu:
        return t;
      case To:
        return "'" + t.replace(/'/g, "''") + "'";
      case Ou:
        return "|" + Aa(t, e.indent) + Ia(Ta(t, o));
      case Ru:
        return ">" + Aa(t, e.indent) + Ia(Ta(X0(t, s), o));
      case Zt:
        return '"' + V0(t) + '"';
      default:
        throw new tr("impossible error: invalid scalar style");
    }
  }();
}
function Aa(e, t) {
  var n = Au(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function Ia(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function X0(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var f = e.indexOf(`
`);
    return f = f !== -1 ? f : e.length, n.lastIndex = f, Oa(e.slice(0, f), t);
  }(), i = e[0] === `
` || e[0] === " ", o, s; s = n.exec(e); ) {
    var a = s[1], l = s[2];
    o = l[0] === " ", r += a + (!i && !o && l !== "" ? `
` : "") + Oa(l, t), i = o;
  }
  return r;
}
function Oa(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, s = 0, a = 0, l = ""; r = n.exec(e); )
    a = r.index, a - i > t && (o = s > i ? s : a, l += `
` + e.slice(i, o), i = o + 1), s = a;
  return l += `
`, e.length - i > t && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function V0(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = Rn(e, i), r = Ce[n], !r && Hn(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || U0(n);
  return t;
}
function W0(e, t, n) {
  var r = "", i = e.tag, o, s, a;
  for (o = 0, s = n.length; o < s; o += 1)
    a = n[o], e.replacer && (a = e.replacer.call(n, String(o), a)), (at(e, t, a, !1, !1) || typeof a > "u" && at(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function Ra(e, t, n, r) {
  var i = "", o = e.tag, s, a, l;
  for (s = 0, a = n.length; s < a; s += 1)
    l = n[s], e.replacer && (l = e.replacer.call(n, String(s), l)), (at(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && at(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += wo(e, t)), e.dump && Mn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function z0(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), s, a, l, f, c;
  for (s = 0, a = o.length; s < a; s += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[s], f = n[l], e.replacer && (f = e.replacer.call(n, l, f)), at(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), at(e, t, f, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function K0(e, t, n, r) {
  var i = "", o = e.tag, s = Object.keys(n), a, l, f, c, u, h;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new tr("sortKeys must be a boolean or a function");
  for (a = 0, l = s.length; a < l; a += 1)
    h = "", (!r || i !== "") && (h += wo(e, t)), f = s[a], c = n[f], e.replacer && (c = e.replacer.call(n, f, c)), at(e, t + 1, f, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && Mn === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, u && (h += wo(e, t)), at(e, t + 1, c, !0, u) && (e.dump && Mn === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function Na(e, t, n) {
  var r, i, o, s, a, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, s = i.length; o < s; o += 1)
    if (a = i[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (n ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (l = e.styleMap[a.tag] || a.defaultStyle, yu.call(a.represent) === "[object Function]")
          r = a.represent(t, l);
        else if (_u.call(a.represent, l))
          r = a.represent[l](t, l);
        else
          throw new tr("!<" + a.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function at(e, t, n, r, i, o, s) {
  e.tag = null, e.dump = n, Na(e, n, !1) || Na(e, n, !0);
  var a = yu.call(e.dump), l = r, f;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = a === "[object Object]" || a === "[object Array]", u, h;
  if (c && (u = e.duplicates.indexOf(n), h = u !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (c && h && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), a === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (K0(e, t, e.dump, i), h && (e.dump = "&ref_" + u + e.dump)) : (z0(e, t, e.dump), h && (e.dump = "&ref_" + u + " " + e.dump));
    else if (a === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? Ra(e, t - 1, e.dump, i) : Ra(e, t, e.dump, i), h && (e.dump = "&ref_" + u + e.dump)) : (W0(e, t, e.dump), h && (e.dump = "&ref_" + u + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && Y0(e, e.dump, t, o, l);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new tr("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (f = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? f = "!" + f : f.slice(0, 18) === "tag:yaml.org,2002:" ? f = "!!" + f.slice(18) : f = "!<" + f + ">", e.dump = f + " " + e.dump);
  }
  return !0;
}
function J0(e, t) {
  var n = [], r = [], i, o;
  for (So(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function So(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        So(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        So(e[r[i]], t, n);
}
function Q0(e, t) {
  t = t || {};
  var n = new B0(t);
  n.noRefs || J0(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), at(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
Eu.dump = Q0;
var Nu = Wo, Z0 = Eu;
function es(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
_e.Type = De;
_e.Schema = Hc;
_e.FAILSAFE_SCHEMA = Yc;
_e.JSON_SCHEMA = Jc;
_e.CORE_SCHEMA = Qc;
_e.DEFAULT_SCHEMA = Ko;
_e.load = Nu.load;
_e.loadAll = Nu.loadAll;
_e.dump = Z0.dump;
_e.YAMLException = er;
_e.types = {
  binary: ru,
  float: Kc,
  map: Gc,
  null: Xc,
  pairs: ou,
  set: su,
  timestamp: tu,
  bool: Vc,
  int: Wc,
  merge: nu,
  omap: iu,
  seq: qc,
  str: jc
};
_e.safeLoad = es("safeLoad", "load");
_e.safeLoadAll = es("safeLoadAll", "loadAll");
_e.safeDump = es("safeDump", "dump");
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.Lazy = void 0;
class eE {
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
di.Lazy = eE;
var Co = { exports: {} };
const tE = "2.0.0", bu = 256, nE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, rE = 16, iE = bu - 6, oE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var fi = {
  MAX_LENGTH: bu,
  MAX_SAFE_COMPONENT_LENGTH: rE,
  MAX_SAFE_BUILD_LENGTH: iE,
  MAX_SAFE_INTEGER: nE,
  RELEASE_TYPES: oE,
  SEMVER_SPEC_VERSION: tE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const sE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var hi = sE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = fi, o = hi;
  t = e.exports = {};
  const s = t.re = [], a = t.safeRe = [], l = t.src = [], f = t.safeSrc = [], c = t.t = {};
  let u = 0;
  const h = "[a-zA-Z0-9-]", p = [
    ["\\s", 1],
    ["\\d", i],
    [h, r]
  ], y = (T) => {
    for (const [S, C] of p)
      T = T.split(`${S}*`).join(`${S}{0,${C}}`).split(`${S}+`).join(`${S}{1,${C}}`);
    return T;
  }, E = (T, S, C) => {
    const D = y(S), x = u++;
    o(T, x, S), c[T] = x, l[x] = S, f[x] = D, s[x] = new RegExp(S, C ? "g" : void 0), a[x] = new RegExp(D, C ? "g" : void 0);
  };
  E("NUMERICIDENTIFIER", "0|[1-9]\\d*"), E("NUMERICIDENTIFIERLOOSE", "\\d+"), E("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), E("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), E("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), E("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), E("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), E("BUILDIDENTIFIER", `${h}+`), E("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), E("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), E("FULL", `^${l[c.FULLPLAIN]}$`), E("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), E("LOOSE", `^${l[c.LOOSEPLAIN]}$`), E("GTLT", "((?:<|>)?=?)"), E("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), E("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), E("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), E("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), E("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), E("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), E("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), E("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), E("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), E("COERCERTL", l[c.COERCE], !0), E("COERCERTLFULL", l[c.COERCEFULL], !0), E("LONETILDE", "(?:~>?)"), E("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", E("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), E("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), E("LONECARET", "(?:\\^)"), E("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", E("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), E("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), E("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), E("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), E("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", E("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), E("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), E("STAR", "(<|>)?=?\\s*\\*"), E("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), E("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Co, Co.exports);
var nr = Co.exports;
const aE = Object.freeze({ loose: !0 }), lE = Object.freeze({}), cE = (e) => e ? typeof e != "object" ? aE : e : lE;
var ts = cE;
const ba = /^[0-9]+$/, $u = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = ba.test(e), r = ba.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, uE = (e, t) => $u(t, e);
var Pu = {
  compareIdentifiers: $u,
  rcompareIdentifiers: uE
};
const Cr = hi, { MAX_LENGTH: $a, MAX_SAFE_INTEGER: Ar } = fi, { safeRe: Ir, t: Or } = nr, dE = ts, { compareIdentifiers: Vi } = Pu;
let fE = class Ze {
  constructor(t, n) {
    if (n = dE(n), t instanceof Ze) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > $a)
      throw new TypeError(
        `version is longer than ${$a} characters`
      );
    Cr("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? Ir[Or.LOOSE] : Ir[Or.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > Ar || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Ar || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Ar || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < Ar)
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
    if (Cr("SemVer.compare", this.version, this.options, t), !(t instanceof Ze)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Ze(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Ze || (t = new Ze(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof Ze || (t = new Ze(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (Cr("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return Vi(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof Ze || (t = new Ze(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (Cr("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return Vi(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? Ir[Or.PRERELEASELOOSE] : Ir[Or.PRERELEASE]);
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
          r === !1 && (o = [n]), Vi(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Fe = fE;
const Pa = Fe, hE = (e, t, n = !1) => {
  if (e instanceof Pa)
    return e;
  try {
    return new Pa(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var mn = hE;
const pE = mn, mE = (e, t) => {
  const n = pE(e, t);
  return n ? n.version : null;
};
var gE = mE;
const EE = mn, yE = (e, t) => {
  const n = EE(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var _E = yE;
const Da = Fe, vE = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new Da(
      e instanceof Da ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var wE = vE;
const Fa = mn, TE = (e, t) => {
  const n = Fa(e, null, !0), r = Fa(t, null, !0), i = n.compare(r);
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
var SE = TE;
const CE = Fe, AE = (e, t) => new CE(e, t).major;
var IE = AE;
const OE = Fe, RE = (e, t) => new OE(e, t).minor;
var NE = RE;
const bE = Fe, $E = (e, t) => new bE(e, t).patch;
var PE = $E;
const DE = mn, FE = (e, t) => {
  const n = DE(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var LE = FE;
const La = Fe, xE = (e, t, n) => new La(e, n).compare(new La(t, n));
var ze = xE;
const kE = ze, UE = (e, t, n) => kE(t, e, n);
var ME = UE;
const BE = ze, HE = (e, t) => BE(e, t, !0);
var jE = HE;
const xa = Fe, qE = (e, t, n) => {
  const r = new xa(e, n), i = new xa(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var ns = qE;
const GE = ns, YE = (e, t) => e.sort((n, r) => GE(n, r, t));
var XE = YE;
const VE = ns, WE = (e, t) => e.sort((n, r) => VE(r, n, t));
var zE = WE;
const KE = ze, JE = (e, t, n) => KE(e, t, n) > 0;
var pi = JE;
const QE = ze, ZE = (e, t, n) => QE(e, t, n) < 0;
var rs = ZE;
const ey = ze, ty = (e, t, n) => ey(e, t, n) === 0;
var Du = ty;
const ny = ze, ry = (e, t, n) => ny(e, t, n) !== 0;
var Fu = ry;
const iy = ze, oy = (e, t, n) => iy(e, t, n) >= 0;
var is = oy;
const sy = ze, ay = (e, t, n) => sy(e, t, n) <= 0;
var os = ay;
const ly = Du, cy = Fu, uy = pi, dy = is, fy = rs, hy = os, py = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return ly(e, n, r);
    case "!=":
      return cy(e, n, r);
    case ">":
      return uy(e, n, r);
    case ">=":
      return dy(e, n, r);
    case "<":
      return fy(e, n, r);
    case "<=":
      return hy(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Lu = py;
const my = Fe, gy = mn, { safeRe: Rr, t: Nr } = nr, Ey = (e, t) => {
  if (e instanceof my)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? Rr[Nr.COERCEFULL] : Rr[Nr.COERCE]);
  else {
    const l = t.includePrerelease ? Rr[Nr.COERCERTLFULL] : Rr[Nr.COERCERTL];
    let f;
    for (; (f = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || f.index + f[0].length !== n.index + n[0].length) && (n = f), l.lastIndex = f.index + f[1].length + f[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", s = t.includePrerelease && n[5] ? `-${n[5]}` : "", a = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return gy(`${r}.${i}.${o}${s}${a}`, t);
};
var yy = Ey;
class _y {
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
var vy = _y, Wi, ka;
function Ke() {
  if (ka) return Wi;
  ka = 1;
  const e = /\s+/g;
  class t {
    constructor(O, P) {
      if (P = i(P), O instanceof t)
        return O.loose === !!P.loose && O.includePrerelease === !!P.includePrerelease ? O : new t(O.raw, P);
      if (O instanceof o)
        return this.raw = O.value, this.set = [[O]], this.formatted = void 0, this;
      if (this.options = P, this.loose = !!P.loose, this.includePrerelease = !!P.includePrerelease, this.raw = O.trim().replace(e, " "), this.set = this.raw.split("||").map((I) => this.parseRange(I.trim())).filter((I) => I.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const I = this.set[0];
        if (this.set = this.set.filter((F) => !E(F[0])), this.set.length === 0)
          this.set = [I];
        else if (this.set.length > 1) {
          for (const F of this.set)
            if (F.length === 1 && T(F[0])) {
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
          const P = this.set[O];
          for (let I = 0; I < P.length; I++)
            I > 0 && (this.formatted += " "), this.formatted += P[I].toString().trim();
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
      const I = ((this.options.includePrerelease && p) | (this.options.loose && y)) + ":" + O, F = r.get(I);
      if (F)
        return F;
      const $ = this.options.loose, B = $ ? l[f.HYPHENRANGELOOSE] : l[f.HYPHENRANGE];
      O = O.replace(B, H(this.options.includePrerelease)), s("hyphen replace", O), O = O.replace(l[f.COMPARATORTRIM], c), s("comparator trim", O), O = O.replace(l[f.TILDETRIM], u), s("tilde trim", O), O = O.replace(l[f.CARETTRIM], h), s("caret trim", O);
      let V = O.split(" ").map((U) => C(U, this.options)).join(" ").split(/\s+/).map((U) => q(U, this.options));
      $ && (V = V.filter((U) => (s("loose invalid filter", U, this.options), !!U.match(l[f.COMPARATORLOOSE])))), s("range list", V);
      const G = /* @__PURE__ */ new Map(), Z = V.map((U) => new o(U, this.options));
      for (const U of Z) {
        if (E(U))
          return [U];
        G.set(U.value, U);
      }
      G.size > 1 && G.has("") && G.delete("");
      const fe = [...G.values()];
      return r.set(I, fe), fe;
    }
    intersects(O, P) {
      if (!(O instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((I) => S(I, P) && O.set.some((F) => S(F, P) && I.every(($) => F.every((B) => $.intersects(B, P)))));
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
      for (let P = 0; P < this.set.length; P++)
        if (Q(this.set[P], O, this.options))
          return !0;
      return !1;
    }
  }
  Wi = t;
  const n = vy, r = new n(), i = ts, o = mi(), s = hi, a = Fe, {
    safeRe: l,
    t: f,
    comparatorTrimReplace: c,
    tildeTrimReplace: u,
    caretTrimReplace: h
  } = nr, { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: y } = fi, E = (b) => b.value === "<0.0.0-0", T = (b) => b.value === "", S = (b, O) => {
    let P = !0;
    const I = b.slice();
    let F = I.pop();
    for (; P && I.length; )
      P = I.every(($) => F.intersects($, O)), F = I.pop();
    return P;
  }, C = (b, O) => (b = b.replace(l[f.BUILD], ""), s("comp", b, O), b = le(b, O), s("caret", b), b = x(b, O), s("tildes", b), b = Ue(b, O), s("xrange", b), b = X(b, O), s("stars", b), b), D = (b) => !b || b.toLowerCase() === "x" || b === "*", x = (b, O) => b.trim().split(/\s+/).map((P) => re(P, O)).join(" "), re = (b, O) => {
    const P = O.loose ? l[f.TILDELOOSE] : l[f.TILDE];
    return b.replace(P, (I, F, $, B, V) => {
      s("tilde", b, I, F, $, B, V);
      let G;
      return D(F) ? G = "" : D($) ? G = `>=${F}.0.0 <${+F + 1}.0.0-0` : D(B) ? G = `>=${F}.${$}.0 <${F}.${+$ + 1}.0-0` : V ? (s("replaceTilde pr", V), G = `>=${F}.${$}.${B}-${V} <${F}.${+$ + 1}.0-0`) : G = `>=${F}.${$}.${B} <${F}.${+$ + 1}.0-0`, s("tilde return", G), G;
    });
  }, le = (b, O) => b.trim().split(/\s+/).map((P) => z(P, O)).join(" "), z = (b, O) => {
    s("caret", b, O);
    const P = O.loose ? l[f.CARETLOOSE] : l[f.CARET], I = O.includePrerelease ? "-0" : "";
    return b.replace(P, (F, $, B, V, G) => {
      s("caret", b, F, $, B, V, G);
      let Z;
      return D($) ? Z = "" : D(B) ? Z = `>=${$}.0.0${I} <${+$ + 1}.0.0-0` : D(V) ? $ === "0" ? Z = `>=${$}.${B}.0${I} <${$}.${+B + 1}.0-0` : Z = `>=${$}.${B}.0${I} <${+$ + 1}.0.0-0` : G ? (s("replaceCaret pr", G), $ === "0" ? B === "0" ? Z = `>=${$}.${B}.${V}-${G} <${$}.${B}.${+V + 1}-0` : Z = `>=${$}.${B}.${V}-${G} <${$}.${+B + 1}.0-0` : Z = `>=${$}.${B}.${V}-${G} <${+$ + 1}.0.0-0`) : (s("no pr"), $ === "0" ? B === "0" ? Z = `>=${$}.${B}.${V}${I} <${$}.${B}.${+V + 1}-0` : Z = `>=${$}.${B}.${V}${I} <${$}.${+B + 1}.0-0` : Z = `>=${$}.${B}.${V} <${+$ + 1}.0.0-0`), s("caret return", Z), Z;
    });
  }, Ue = (b, O) => (s("replaceXRanges", b, O), b.split(/\s+/).map((P) => _(P, O)).join(" ")), _ = (b, O) => {
    b = b.trim();
    const P = O.loose ? l[f.XRANGELOOSE] : l[f.XRANGE];
    return b.replace(P, (I, F, $, B, V, G) => {
      s("xRange", b, I, F, $, B, V, G);
      const Z = D($), fe = Z || D(B), U = fe || D(V), Je = U;
      return F === "=" && Je && (F = ""), G = O.includePrerelease ? "-0" : "", Z ? F === ">" || F === "<" ? I = "<0.0.0-0" : I = "*" : F && Je ? (fe && (B = 0), V = 0, F === ">" ? (F = ">=", fe ? ($ = +$ + 1, B = 0, V = 0) : (B = +B + 1, V = 0)) : F === "<=" && (F = "<", fe ? $ = +$ + 1 : B = +B + 1), F === "<" && (G = "-0"), I = `${F + $}.${B}.${V}${G}`) : fe ? I = `>=${$}.0.0${G} <${+$ + 1}.0.0-0` : U && (I = `>=${$}.${B}.0${G} <${$}.${+B + 1}.0-0`), s("xRange return", I), I;
    });
  }, X = (b, O) => (s("replaceStars", b, O), b.trim().replace(l[f.STAR], "")), q = (b, O) => (s("replaceGTE0", b, O), b.trim().replace(l[O.includePrerelease ? f.GTE0PRE : f.GTE0], "")), H = (b) => (O, P, I, F, $, B, V, G, Z, fe, U, Je) => (D(I) ? P = "" : D(F) ? P = `>=${I}.0.0${b ? "-0" : ""}` : D($) ? P = `>=${I}.${F}.0${b ? "-0" : ""}` : B ? P = `>=${P}` : P = `>=${P}${b ? "-0" : ""}`, D(Z) ? G = "" : D(fe) ? G = `<${+Z + 1}.0.0-0` : D(U) ? G = `<${Z}.${+fe + 1}.0-0` : Je ? G = `<=${Z}.${fe}.${U}-${Je}` : b ? G = `<${Z}.${fe}.${+U + 1}-0` : G = `<=${G}`, `${P} ${G}`.trim()), Q = (b, O, P) => {
    for (let I = 0; I < b.length; I++)
      if (!b[I].test(O))
        return !1;
    if (O.prerelease.length && !P.includePrerelease) {
      for (let I = 0; I < b.length; I++)
        if (s(b[I].semver), b[I].semver !== o.ANY && b[I].semver.prerelease.length > 0) {
          const F = b[I].semver;
          if (F.major === O.major && F.minor === O.minor && F.patch === O.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Wi;
}
var zi, Ua;
function mi() {
  if (Ua) return zi;
  Ua = 1;
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
      const u = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], h = c.match(u);
      if (!h)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new a(h[2], this.options.loose) : this.semver = e;
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
  zi = t;
  const n = ts, { safeRe: r, t: i } = nr, o = Lu, s = hi, a = Fe, l = Ke();
  return zi;
}
const wy = Ke(), Ty = (e, t, n) => {
  try {
    t = new wy(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var gi = Ty;
const Sy = Ke(), Cy = (e, t) => new Sy(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var Ay = Cy;
const Iy = Fe, Oy = Ke(), Ry = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new Oy(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === -1) && (r = s, i = new Iy(r, n));
  }), r;
};
var Ny = Ry;
const by = Fe, $y = Ke(), Py = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new $y(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === 1) && (r = s, i = new by(r, n));
  }), r;
};
var Dy = Py;
const Ki = Fe, Fy = Ke(), Ma = pi, Ly = (e, t) => {
  e = new Fy(e, t);
  let n = new Ki("0.0.0");
  if (e.test(n) || (n = new Ki("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((s) => {
      const a = new Ki(s.semver.version);
      switch (s.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!o || Ma(a, o)) && (o = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), o && (!n || Ma(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var xy = Ly;
const ky = Ke(), Uy = (e, t) => {
  try {
    return new ky(e, t).range || "*";
  } catch {
    return null;
  }
};
var My = Uy;
const By = Fe, xu = mi(), { ANY: Hy } = xu, jy = Ke(), qy = gi, Ba = pi, Ha = rs, Gy = os, Yy = is, Xy = (e, t, n, r) => {
  e = new By(e, r), t = new jy(t, r);
  let i, o, s, a, l;
  switch (n) {
    case ">":
      i = Ba, o = Gy, s = Ha, a = ">", l = ">=";
      break;
    case "<":
      i = Ha, o = Yy, s = Ba, a = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (qy(e, t, r))
    return !1;
  for (let f = 0; f < t.set.length; ++f) {
    const c = t.set[f];
    let u = null, h = null;
    if (c.forEach((p) => {
      p.semver === Hy && (p = new xu(">=0.0.0")), u = u || p, h = h || p, i(p.semver, u.semver, r) ? u = p : s(p.semver, h.semver, r) && (h = p);
    }), u.operator === a || u.operator === l || (!h.operator || h.operator === a) && o(e, h.semver))
      return !1;
    if (h.operator === l && s(e, h.semver))
      return !1;
  }
  return !0;
};
var ss = Xy;
const Vy = ss, Wy = (e, t, n) => Vy(e, t, ">", n);
var zy = Wy;
const Ky = ss, Jy = (e, t, n) => Ky(e, t, "<", n);
var Qy = Jy;
const ja = Ke(), Zy = (e, t, n) => (e = new ja(e, n), t = new ja(t, n), e.intersects(t, n));
var e_ = Zy;
const t_ = gi, n_ = ze;
var r_ = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const s = e.sort((c, u) => n_(c, u, n));
  for (const c of s)
    t_(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const a = [];
  for (const [c, u] of r)
    c === u ? a.push(c) : !u && c === s[0] ? a.push("*") : u ? c === s[0] ? a.push(`<=${u}`) : a.push(`${c} - ${u}`) : a.push(`>=${c}`);
  const l = a.join(" || "), f = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < f.length ? l : t;
};
const qa = Ke(), as = mi(), { ANY: Ji } = as, Cn = gi, ls = ze, i_ = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new qa(e, n), t = new qa(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const s = s_(i, o, n);
      if (r = r || s !== null, s)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, o_ = [new as(">=0.0.0-0")], Ga = [new as(">=0.0.0")], s_ = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Ji) {
    if (t.length === 1 && t[0].semver === Ji)
      return !0;
    n.includePrerelease ? e = o_ : e = Ga;
  }
  if (t.length === 1 && t[0].semver === Ji) {
    if (n.includePrerelease)
      return !0;
    t = Ga;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const p of e)
    p.operator === ">" || p.operator === ">=" ? i = Ya(i, p, n) : p.operator === "<" || p.operator === "<=" ? o = Xa(o, p, n) : r.add(p.semver);
  if (r.size > 1)
    return null;
  let s;
  if (i && o) {
    if (s = ls(i.semver, o.semver, n), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const p of r) {
    if (i && !Cn(p, String(i), n) || o && !Cn(p, String(o), n))
      return null;
    for (const y of t)
      if (!Cn(p, String(y), n))
        return !1;
    return !0;
  }
  let a, l, f, c, u = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && o.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const p of t) {
    if (c = c || p.operator === ">" || p.operator === ">=", f = f || p.operator === "<" || p.operator === "<=", i) {
      if (h && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === h.major && p.semver.minor === h.minor && p.semver.patch === h.patch && (h = !1), p.operator === ">" || p.operator === ">=") {
        if (a = Ya(i, p, n), a === p && a !== i)
          return !1;
      } else if (i.operator === ">=" && !Cn(i.semver, String(p), n))
        return !1;
    }
    if (o) {
      if (u && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === u.major && p.semver.minor === u.minor && p.semver.patch === u.patch && (u = !1), p.operator === "<" || p.operator === "<=") {
        if (l = Xa(o, p, n), l === p && l !== o)
          return !1;
      } else if (o.operator === "<=" && !Cn(o.semver, String(p), n))
        return !1;
    }
    if (!p.operator && (o || i) && s !== 0)
      return !1;
  }
  return !(i && f && !o && s !== 0 || o && c && !i && s !== 0 || h || u);
}, Ya = (e, t, n) => {
  if (!e)
    return t;
  const r = ls(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Xa = (e, t, n) => {
  if (!e)
    return t;
  const r = ls(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var a_ = i_;
const Qi = nr, Va = fi, l_ = Fe, Wa = Pu, c_ = mn, u_ = gE, d_ = _E, f_ = wE, h_ = SE, p_ = IE, m_ = NE, g_ = PE, E_ = LE, y_ = ze, __ = ME, v_ = jE, w_ = ns, T_ = XE, S_ = zE, C_ = pi, A_ = rs, I_ = Du, O_ = Fu, R_ = is, N_ = os, b_ = Lu, $_ = yy, P_ = mi(), D_ = Ke(), F_ = gi, L_ = Ay, x_ = Ny, k_ = Dy, U_ = xy, M_ = My, B_ = ss, H_ = zy, j_ = Qy, q_ = e_, G_ = r_, Y_ = a_;
var ku = {
  parse: c_,
  valid: u_,
  clean: d_,
  inc: f_,
  diff: h_,
  major: p_,
  minor: m_,
  patch: g_,
  prerelease: E_,
  compare: y_,
  rcompare: __,
  compareLoose: v_,
  compareBuild: w_,
  sort: T_,
  rsort: S_,
  gt: C_,
  lt: A_,
  eq: I_,
  neq: O_,
  gte: R_,
  lte: N_,
  cmp: b_,
  coerce: $_,
  Comparator: P_,
  Range: D_,
  satisfies: F_,
  toComparators: L_,
  maxSatisfying: x_,
  minSatisfying: k_,
  minVersion: U_,
  validRange: M_,
  outside: B_,
  gtr: H_,
  ltr: j_,
  intersects: q_,
  simplifyRange: G_,
  subset: Y_,
  SemVer: l_,
  re: Qi.re,
  src: Qi.src,
  tokens: Qi.t,
  SEMVER_SPEC_VERSION: Va.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Va.RELEASE_TYPES,
  compareIdentifiers: Wa.compareIdentifiers,
  rcompareIdentifiers: Wa.rcompareIdentifiers
}, rr = {}, Qr = { exports: {} };
Qr.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, s = 9007199254740991, a = "[object Arguments]", l = "[object Array]", f = "[object AsyncFunction]", c = "[object Boolean]", u = "[object Date]", h = "[object Error]", p = "[object Function]", y = "[object GeneratorFunction]", E = "[object Map]", T = "[object Number]", S = "[object Null]", C = "[object Object]", D = "[object Promise]", x = "[object Proxy]", re = "[object RegExp]", le = "[object Set]", z = "[object String]", Ue = "[object Symbol]", _ = "[object Undefined]", X = "[object WeakMap]", q = "[object ArrayBuffer]", H = "[object DataView]", Q = "[object Float32Array]", b = "[object Float64Array]", O = "[object Int8Array]", P = "[object Int16Array]", I = "[object Int32Array]", F = "[object Uint8Array]", $ = "[object Uint8ClampedArray]", B = "[object Uint16Array]", V = "[object Uint32Array]", G = /[\\^$.*+?()[\]{}|]/g, Z = /^\[object .+?Constructor\]$/, fe = /^(?:0|[1-9]\d*)$/, U = {};
  U[Q] = U[b] = U[O] = U[P] = U[I] = U[F] = U[$] = U[B] = U[V] = !0, U[a] = U[l] = U[q] = U[c] = U[H] = U[u] = U[h] = U[p] = U[E] = U[T] = U[C] = U[re] = U[le] = U[z] = U[X] = !1;
  var Je = typeof Re == "object" && Re && Re.Object === Object && Re, m = typeof self == "object" && self && self.Object === Object && self, d = Je || m || Function("return this")(), A = t && !t.nodeType && t, w = A && !0 && e && !e.nodeType && e, K = w && w.exports === A, te = K && Je.process, se = function() {
    try {
      return te && te.binding && te.binding("util");
    } catch {
    }
  }(), ge = se && se.isTypedArray;
  function ve(g, v) {
    for (var R = -1, L = g == null ? 0 : g.length, ne = 0, Y = []; ++R < L; ) {
      var ae = g[R];
      v(ae, R, g) && (Y[ne++] = ae);
    }
    return Y;
  }
  function ct(g, v) {
    for (var R = -1, L = v.length, ne = g.length; ++R < L; )
      g[ne + R] = v[R];
    return g;
  }
  function ue(g, v) {
    for (var R = -1, L = g == null ? 0 : g.length; ++R < L; )
      if (v(g[R], R, g))
        return !0;
    return !1;
  }
  function Ye(g, v) {
    for (var R = -1, L = Array(g); ++R < g; )
      L[R] = v(R);
    return L;
  }
  function Ii(g) {
    return function(v) {
      return g(v);
    };
  }
  function lr(g, v) {
    return g.has(v);
  }
  function En(g, v) {
    return g == null ? void 0 : g[v];
  }
  function cr(g) {
    var v = -1, R = Array(g.size);
    return g.forEach(function(L, ne) {
      R[++v] = [ne, L];
    }), R;
  }
  function pd(g, v) {
    return function(R) {
      return g(v(R));
    };
  }
  function md(g) {
    var v = -1, R = Array(g.size);
    return g.forEach(function(L) {
      R[++v] = L;
    }), R;
  }
  var gd = Array.prototype, Ed = Function.prototype, ur = Object.prototype, Oi = d["__core-js_shared__"], _s = Ed.toString, Qe = ur.hasOwnProperty, vs = function() {
    var g = /[^.]+$/.exec(Oi && Oi.keys && Oi.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), ws = ur.toString, yd = RegExp(
    "^" + _s.call(Qe).replace(G, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ts = K ? d.Buffer : void 0, dr = d.Symbol, Ss = d.Uint8Array, Cs = ur.propertyIsEnumerable, _d = gd.splice, Rt = dr ? dr.toStringTag : void 0, As = Object.getOwnPropertySymbols, vd = Ts ? Ts.isBuffer : void 0, wd = pd(Object.keys, Object), Ri = Xt(d, "DataView"), yn = Xt(d, "Map"), Ni = Xt(d, "Promise"), bi = Xt(d, "Set"), $i = Xt(d, "WeakMap"), _n = Xt(Object, "create"), Td = $t(Ri), Sd = $t(yn), Cd = $t(Ni), Ad = $t(bi), Id = $t($i), Is = dr ? dr.prototype : void 0, Pi = Is ? Is.valueOf : void 0;
  function Nt(g) {
    var v = -1, R = g == null ? 0 : g.length;
    for (this.clear(); ++v < R; ) {
      var L = g[v];
      this.set(L[0], L[1]);
    }
  }
  function Od() {
    this.__data__ = _n ? _n(null) : {}, this.size = 0;
  }
  function Rd(g) {
    var v = this.has(g) && delete this.__data__[g];
    return this.size -= v ? 1 : 0, v;
  }
  function Nd(g) {
    var v = this.__data__;
    if (_n) {
      var R = v[g];
      return R === r ? void 0 : R;
    }
    return Qe.call(v, g) ? v[g] : void 0;
  }
  function bd(g) {
    var v = this.__data__;
    return _n ? v[g] !== void 0 : Qe.call(v, g);
  }
  function $d(g, v) {
    var R = this.__data__;
    return this.size += this.has(g) ? 0 : 1, R[g] = _n && v === void 0 ? r : v, this;
  }
  Nt.prototype.clear = Od, Nt.prototype.delete = Rd, Nt.prototype.get = Nd, Nt.prototype.has = bd, Nt.prototype.set = $d;
  function nt(g) {
    var v = -1, R = g == null ? 0 : g.length;
    for (this.clear(); ++v < R; ) {
      var L = g[v];
      this.set(L[0], L[1]);
    }
  }
  function Pd() {
    this.__data__ = [], this.size = 0;
  }
  function Dd(g) {
    var v = this.__data__, R = hr(v, g);
    if (R < 0)
      return !1;
    var L = v.length - 1;
    return R == L ? v.pop() : _d.call(v, R, 1), --this.size, !0;
  }
  function Fd(g) {
    var v = this.__data__, R = hr(v, g);
    return R < 0 ? void 0 : v[R][1];
  }
  function Ld(g) {
    return hr(this.__data__, g) > -1;
  }
  function xd(g, v) {
    var R = this.__data__, L = hr(R, g);
    return L < 0 ? (++this.size, R.push([g, v])) : R[L][1] = v, this;
  }
  nt.prototype.clear = Pd, nt.prototype.delete = Dd, nt.prototype.get = Fd, nt.prototype.has = Ld, nt.prototype.set = xd;
  function bt(g) {
    var v = -1, R = g == null ? 0 : g.length;
    for (this.clear(); ++v < R; ) {
      var L = g[v];
      this.set(L[0], L[1]);
    }
  }
  function kd() {
    this.size = 0, this.__data__ = {
      hash: new Nt(),
      map: new (yn || nt)(),
      string: new Nt()
    };
  }
  function Ud(g) {
    var v = pr(this, g).delete(g);
    return this.size -= v ? 1 : 0, v;
  }
  function Md(g) {
    return pr(this, g).get(g);
  }
  function Bd(g) {
    return pr(this, g).has(g);
  }
  function Hd(g, v) {
    var R = pr(this, g), L = R.size;
    return R.set(g, v), this.size += R.size == L ? 0 : 1, this;
  }
  bt.prototype.clear = kd, bt.prototype.delete = Ud, bt.prototype.get = Md, bt.prototype.has = Bd, bt.prototype.set = Hd;
  function fr(g) {
    var v = -1, R = g == null ? 0 : g.length;
    for (this.__data__ = new bt(); ++v < R; )
      this.add(g[v]);
  }
  function jd(g) {
    return this.__data__.set(g, r), this;
  }
  function qd(g) {
    return this.__data__.has(g);
  }
  fr.prototype.add = fr.prototype.push = jd, fr.prototype.has = qd;
  function ut(g) {
    var v = this.__data__ = new nt(g);
    this.size = v.size;
  }
  function Gd() {
    this.__data__ = new nt(), this.size = 0;
  }
  function Yd(g) {
    var v = this.__data__, R = v.delete(g);
    return this.size = v.size, R;
  }
  function Xd(g) {
    return this.__data__.get(g);
  }
  function Vd(g) {
    return this.__data__.has(g);
  }
  function Wd(g, v) {
    var R = this.__data__;
    if (R instanceof nt) {
      var L = R.__data__;
      if (!yn || L.length < n - 1)
        return L.push([g, v]), this.size = ++R.size, this;
      R = this.__data__ = new bt(L);
    }
    return R.set(g, v), this.size = R.size, this;
  }
  ut.prototype.clear = Gd, ut.prototype.delete = Yd, ut.prototype.get = Xd, ut.prototype.has = Vd, ut.prototype.set = Wd;
  function zd(g, v) {
    var R = mr(g), L = !R && df(g), ne = !R && !L && Di(g), Y = !R && !L && !ne && Ls(g), ae = R || L || ne || Y, he = ae ? Ye(g.length, String) : [], Ee = he.length;
    for (var ie in g)
      Qe.call(g, ie) && !(ae && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ne && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      Y && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      sf(ie, Ee))) && he.push(ie);
    return he;
  }
  function hr(g, v) {
    for (var R = g.length; R--; )
      if ($s(g[R][0], v))
        return R;
    return -1;
  }
  function Kd(g, v, R) {
    var L = v(g);
    return mr(g) ? L : ct(L, R(g));
  }
  function vn(g) {
    return g == null ? g === void 0 ? _ : S : Rt && Rt in Object(g) ? rf(g) : uf(g);
  }
  function Os(g) {
    return wn(g) && vn(g) == a;
  }
  function Rs(g, v, R, L, ne) {
    return g === v ? !0 : g == null || v == null || !wn(g) && !wn(v) ? g !== g && v !== v : Jd(g, v, R, L, Rs, ne);
  }
  function Jd(g, v, R, L, ne, Y) {
    var ae = mr(g), he = mr(v), Ee = ae ? l : dt(g), ie = he ? l : dt(v);
    Ee = Ee == a ? C : Ee, ie = ie == a ? C : ie;
    var Me = Ee == C, Xe = ie == C, we = Ee == ie;
    if (we && Di(g)) {
      if (!Di(v))
        return !1;
      ae = !0, Me = !1;
    }
    if (we && !Me)
      return Y || (Y = new ut()), ae || Ls(g) ? Ns(g, v, R, L, ne, Y) : tf(g, v, Ee, R, L, ne, Y);
    if (!(R & i)) {
      var Be = Me && Qe.call(g, "__wrapped__"), He = Xe && Qe.call(v, "__wrapped__");
      if (Be || He) {
        var ft = Be ? g.value() : g, rt = He ? v.value() : v;
        return Y || (Y = new ut()), ne(ft, rt, R, L, Y);
      }
    }
    return we ? (Y || (Y = new ut()), nf(g, v, R, L, ne, Y)) : !1;
  }
  function Qd(g) {
    if (!Fs(g) || lf(g))
      return !1;
    var v = Ps(g) ? yd : Z;
    return v.test($t(g));
  }
  function Zd(g) {
    return wn(g) && Ds(g.length) && !!U[vn(g)];
  }
  function ef(g) {
    if (!cf(g))
      return wd(g);
    var v = [];
    for (var R in Object(g))
      Qe.call(g, R) && R != "constructor" && v.push(R);
    return v;
  }
  function Ns(g, v, R, L, ne, Y) {
    var ae = R & i, he = g.length, Ee = v.length;
    if (he != Ee && !(ae && Ee > he))
      return !1;
    var ie = Y.get(g);
    if (ie && Y.get(v))
      return ie == v;
    var Me = -1, Xe = !0, we = R & o ? new fr() : void 0;
    for (Y.set(g, v), Y.set(v, g); ++Me < he; ) {
      var Be = g[Me], He = v[Me];
      if (L)
        var ft = ae ? L(He, Be, Me, v, g, Y) : L(Be, He, Me, g, v, Y);
      if (ft !== void 0) {
        if (ft)
          continue;
        Xe = !1;
        break;
      }
      if (we) {
        if (!ue(v, function(rt, Pt) {
          if (!lr(we, Pt) && (Be === rt || ne(Be, rt, R, L, Y)))
            return we.push(Pt);
        })) {
          Xe = !1;
          break;
        }
      } else if (!(Be === He || ne(Be, He, R, L, Y))) {
        Xe = !1;
        break;
      }
    }
    return Y.delete(g), Y.delete(v), Xe;
  }
  function tf(g, v, R, L, ne, Y, ae) {
    switch (R) {
      case H:
        if (g.byteLength != v.byteLength || g.byteOffset != v.byteOffset)
          return !1;
        g = g.buffer, v = v.buffer;
      case q:
        return !(g.byteLength != v.byteLength || !Y(new Ss(g), new Ss(v)));
      case c:
      case u:
      case T:
        return $s(+g, +v);
      case h:
        return g.name == v.name && g.message == v.message;
      case re:
      case z:
        return g == v + "";
      case E:
        var he = cr;
      case le:
        var Ee = L & i;
        if (he || (he = md), g.size != v.size && !Ee)
          return !1;
        var ie = ae.get(g);
        if (ie)
          return ie == v;
        L |= o, ae.set(g, v);
        var Me = Ns(he(g), he(v), L, ne, Y, ae);
        return ae.delete(g), Me;
      case Ue:
        if (Pi)
          return Pi.call(g) == Pi.call(v);
    }
    return !1;
  }
  function nf(g, v, R, L, ne, Y) {
    var ae = R & i, he = bs(g), Ee = he.length, ie = bs(v), Me = ie.length;
    if (Ee != Me && !ae)
      return !1;
    for (var Xe = Ee; Xe--; ) {
      var we = he[Xe];
      if (!(ae ? we in v : Qe.call(v, we)))
        return !1;
    }
    var Be = Y.get(g);
    if (Be && Y.get(v))
      return Be == v;
    var He = !0;
    Y.set(g, v), Y.set(v, g);
    for (var ft = ae; ++Xe < Ee; ) {
      we = he[Xe];
      var rt = g[we], Pt = v[we];
      if (L)
        var xs = ae ? L(Pt, rt, we, v, g, Y) : L(rt, Pt, we, g, v, Y);
      if (!(xs === void 0 ? rt === Pt || ne(rt, Pt, R, L, Y) : xs)) {
        He = !1;
        break;
      }
      ft || (ft = we == "constructor");
    }
    if (He && !ft) {
      var gr = g.constructor, Er = v.constructor;
      gr != Er && "constructor" in g && "constructor" in v && !(typeof gr == "function" && gr instanceof gr && typeof Er == "function" && Er instanceof Er) && (He = !1);
    }
    return Y.delete(g), Y.delete(v), He;
  }
  function bs(g) {
    return Kd(g, pf, of);
  }
  function pr(g, v) {
    var R = g.__data__;
    return af(v) ? R[typeof v == "string" ? "string" : "hash"] : R.map;
  }
  function Xt(g, v) {
    var R = En(g, v);
    return Qd(R) ? R : void 0;
  }
  function rf(g) {
    var v = Qe.call(g, Rt), R = g[Rt];
    try {
      g[Rt] = void 0;
      var L = !0;
    } catch {
    }
    var ne = ws.call(g);
    return L && (v ? g[Rt] = R : delete g[Rt]), ne;
  }
  var of = As ? function(g) {
    return g == null ? [] : (g = Object(g), ve(As(g), function(v) {
      return Cs.call(g, v);
    }));
  } : mf, dt = vn;
  (Ri && dt(new Ri(new ArrayBuffer(1))) != H || yn && dt(new yn()) != E || Ni && dt(Ni.resolve()) != D || bi && dt(new bi()) != le || $i && dt(new $i()) != X) && (dt = function(g) {
    var v = vn(g), R = v == C ? g.constructor : void 0, L = R ? $t(R) : "";
    if (L)
      switch (L) {
        case Td:
          return H;
        case Sd:
          return E;
        case Cd:
          return D;
        case Ad:
          return le;
        case Id:
          return X;
      }
    return v;
  });
  function sf(g, v) {
    return v = v ?? s, !!v && (typeof g == "number" || fe.test(g)) && g > -1 && g % 1 == 0 && g < v;
  }
  function af(g) {
    var v = typeof g;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? g !== "__proto__" : g === null;
  }
  function lf(g) {
    return !!vs && vs in g;
  }
  function cf(g) {
    var v = g && g.constructor, R = typeof v == "function" && v.prototype || ur;
    return g === R;
  }
  function uf(g) {
    return ws.call(g);
  }
  function $t(g) {
    if (g != null) {
      try {
        return _s.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function $s(g, v) {
    return g === v || g !== g && v !== v;
  }
  var df = Os(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Os : function(g) {
    return wn(g) && Qe.call(g, "callee") && !Cs.call(g, "callee");
  }, mr = Array.isArray;
  function ff(g) {
    return g != null && Ds(g.length) && !Ps(g);
  }
  var Di = vd || gf;
  function hf(g, v) {
    return Rs(g, v);
  }
  function Ps(g) {
    if (!Fs(g))
      return !1;
    var v = vn(g);
    return v == p || v == y || v == f || v == x;
  }
  function Ds(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= s;
  }
  function Fs(g) {
    var v = typeof g;
    return g != null && (v == "object" || v == "function");
  }
  function wn(g) {
    return g != null && typeof g == "object";
  }
  var Ls = ge ? Ii(ge) : Zd;
  function pf(g) {
    return ff(g) ? zd(g) : ef(g);
  }
  function mf() {
    return [];
  }
  function gf() {
    return !1;
  }
  e.exports = hf;
})(Qr, Qr.exports);
var X_ = Qr.exports;
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.DownloadedUpdateHelper = void 0;
rr.createTempUpdateFile = J_;
const V_ = Kn, W_ = At, za = X_, Lt = It, Pn = J;
class z_ {
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
    return Pn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return za(this.versionInfo, n) && za(this.fileInfo.info, r.info) && await (0, Lt.pathExists)(t) ? t : null;
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
    } catch (f) {
      let c = "No cached update info available";
      return f.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${f.message})`), n.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = Pn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Lt.pathExists)(a))
      return n.info("Cached update file doesn't exist"), null;
    const l = await K_(a);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, a);
  }
  getUpdateInfoFile() {
    return Pn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
rr.DownloadedUpdateHelper = z_;
function K_(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const s = (0, V_.createHash)(t);
    s.on("error", o).setEncoding(n), (0, W_.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function J_(e, t, n) {
  let r = 0, i = Pn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Lt.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${s}`), i = Pn.join(t, `${r++}-${e}`);
    }
  return i;
}
var Ei = {}, cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
cs.getAppCacheDir = Z_;
const Zi = J, Q_ = ni;
function Z_() {
  const e = (0, Q_.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Zi.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Zi.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Zi.join(e, ".cache"), t;
}
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.ElectronAppAdapter = void 0;
const Ka = J, ev = cs;
class tv {
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
    return this.isPackaged ? Ka.join(process.resourcesPath, "app-update.yml") : Ka.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, ev.getAppCacheDir)();
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
Ei.ElectronAppAdapter = tv;
var Uu = {};
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
      return await a.cancellationToken.createPromise((l, f, c) => {
        const u = {
          headers: a.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, u), (0, t.configureRequestOptions)(u), this.doDownload(u, {
          destination: s,
          options: a,
          onCancel: c,
          callback: (h) => {
            h == null ? l(s) : f(h);
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
    addRedirectHandlers(o, s, a, l, f) {
      o.on("redirect", (c, u, h) => {
        o.abort(), l > this.maxRedirects ? a(this.createMaxRedirectError()) : f(t.HttpExecutor.prepareRedirectUrlOptions(h, s));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(Uu);
var ir = {}, Ge = {}, nv = "[object Symbol]", Mu = /[\\^$.*+?()[\]{}|]/g, rv = RegExp(Mu.source), iv = typeof Re == "object" && Re && Re.Object === Object && Re, ov = typeof self == "object" && self && self.Object === Object && self, sv = iv || ov || Function("return this")(), av = Object.prototype, lv = av.toString, Ja = sv.Symbol, Qa = Ja ? Ja.prototype : void 0, Za = Qa ? Qa.toString : void 0;
function cv(e) {
  if (typeof e == "string")
    return e;
  if (dv(e))
    return Za ? Za.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function uv(e) {
  return !!e && typeof e == "object";
}
function dv(e) {
  return typeof e == "symbol" || uv(e) && lv.call(e) == nv;
}
function fv(e) {
  return e == null ? "" : cv(e);
}
function hv(e) {
  return e = fv(e), e && rv.test(e) ? e.replace(Mu, "\\$&") : e;
}
var pv = hv;
Object.defineProperty(Ge, "__esModule", { value: !0 });
Ge.newBaseUrl = gv;
Ge.newUrlFromBase = Ao;
Ge.getChannelFilename = Ev;
Ge.blockmapFiles = yv;
const Bu = fn, mv = pv;
function gv(e) {
  const t = new Bu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Ao(e, t, n = !1) {
  const r = new Bu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function Ev(e) {
  return `${e}.yml`;
}
function yv(e, t, n) {
  const r = Ao(`${e.pathname}.blockmap`, e);
  return [Ao(`${e.pathname.replace(new RegExp(mv(n), "g"), t)}.blockmap`, e), r];
}
var de = {};
Object.defineProperty(de, "__esModule", { value: !0 });
de.Provider = void 0;
de.findFile = wv;
de.parseUpdateInfo = Tv;
de.getFileList = Hu;
de.resolveFiles = Sv;
const St = me, _v = _e, el = Ge;
class vv {
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
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, St.configureRequestUrl)(t, r), r;
  }
}
de.Provider = vv;
function wv(e, t, n) {
  if (e.length === 0)
    throw (0, St.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const r = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return r ?? (n == null ? e[0] : e.find((i) => !n.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function Tv(e, t, n) {
  if (e == null)
    throw (0, St.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, _v.load)(e);
  } catch (i) {
    throw (0, St.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function Hu(e) {
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
  throw (0, St.newError)(`No files provided: ${(0, St.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Sv(e, t, n = (r) => r) {
  const i = Hu(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, St.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, St.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, el.newUrlFromBase)(n(a.url), t),
      info: a
    };
  }), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, el.newUrlFromBase)(n(s.path), t).href
  }), i;
}
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.GenericProvider = void 0;
const tl = me, eo = Ge, to = de;
class Cv extends to.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, eo.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, eo.getChannelFilename)(this.channel), n = (0, eo.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, to.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof tl.HttpError && i.statusCode === 404)
          throw (0, tl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, to.resolveFiles)(t, this.baseUrl);
  }
}
ir.GenericProvider = Cv;
var yi = {}, _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.BitbucketProvider = void 0;
const nl = me, no = Ge, ro = de;
class Av extends ro.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, no.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new nl.CancellationToken(), n = (0, no.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, no.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, ro.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, nl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, ro.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
_i.BitbucketProvider = Av;
var Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.GitHubProvider = Ct.BaseGitHubProvider = void 0;
Ct.computeReleaseNotes = qu;
const st = me, nn = ku, Iv = fn, rn = Ge, Io = de, io = /\/tag\/([^/]+)$/;
class ju extends Io.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, rn.newBaseUrl)((0, st.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, rn.newBaseUrl)((0, st.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
Ct.BaseGitHubProvider = ju;
class Ov extends ju {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const s = new st.CancellationToken(), a = await this.httpRequest((0, rn.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), l = (0, st.parseXml)(a);
    let f = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = nn.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (T === null)
          c = io.exec(f.element("link").attribute("href"))[1];
        else
          for (const S of l.getElements("entry")) {
            const C = io.exec(S.element("link").attribute("href"));
            if (C === null)
              continue;
            const D = C[1], x = ((r = nn.prerelease(D)) === null || r === void 0 ? void 0 : r[0]) || null, re = !T || ["alpha", "beta"].includes(T), le = x !== null && !["alpha", "beta"].includes(String(x));
            if (re && !le && !(T === "beta" && x === "alpha")) {
              c = D;
              break;
            }
            if (x && x === T) {
              c = D;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(s);
        for (const T of l.getElements("entry"))
          if (io.exec(T.element("link").attribute("href"))[1] === c) {
            f = T;
            break;
          }
      }
    } catch (T) {
      throw (0, st.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, st.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let u, h = "", p = "";
    const y = async (T) => {
      h = (0, rn.getChannelFilename)(T), p = (0, rn.newUrlFromBase)(this.getBaseDownloadPath(String(c), h), this.baseUrl);
      const S = this.createRequestOptions(p);
      try {
        return await this.executor.request(S, s);
      } catch (C) {
        throw C instanceof st.HttpError && C.statusCode === 404 ? (0, st.newError)(`Cannot find ${h} in the latest release artifacts (${p}): ${C.stack || C.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : C;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = nn.prerelease(c)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((o = nn.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), u = await y(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        u = await y(this.getDefaultChannelName());
      else
        throw T;
    }
    const E = (0, Io.parseUpdateInfo)(u, h, p);
    return E.releaseName == null && (E.releaseName = f.elementValueOrEmpty("title")), E.releaseNotes == null && (E.releaseNotes = qu(this.updater.currentVersion, this.updater.fullChangelog, l, f)), {
      tag: c,
      ...E
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, rn.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Iv.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, st.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Io.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
Ct.GitHubProvider = Ov;
function rl(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function qu(e, t, n, r) {
  if (!t)
    return rl(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    nn.lt(e, s) && i.push({
      version: s,
      note: rl(o)
    });
  }
  return i.sort((o, s) => nn.rcompare(o.version, s.version));
}
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.KeygenProvider = void 0;
const il = me, oo = Ge, so = de;
class Rv extends so.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, oo.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new il.CancellationToken(), n = (0, oo.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, oo.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, so.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, il.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, so.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
vi.KeygenProvider = Rv;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.PrivateGitHubProvider = void 0;
const zt = me, Nv = _e, bv = J, ol = fn, sl = Ge, $v = Ct, Pv = de;
class Dv extends $v.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new zt.CancellationToken(), n = (0, sl.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((a) => a.name === n);
    if (i == null)
      throw (0, zt.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new ol.URL(i.url);
    let s;
    try {
      s = (0, Nv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
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
    const i = (0, sl.newUrlFromBase)(r, this.baseUrl);
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
    return (0, Pv.getFileList)(t).map((n) => {
      const r = bv.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, zt.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ol.URL(i.url),
        info: n
      };
    });
  }
}
wi.PrivateGitHubProvider = Dv;
Object.defineProperty(yi, "__esModule", { value: !0 });
yi.isUrlProbablySupportMultiRangeRequests = Gu;
yi.createClient = Uv;
const br = me, Fv = _i, al = ir, Lv = Ct, xv = vi, kv = wi;
function Gu(e) {
  return !e.includes("s3.amazonaws.com");
}
function Uv(e, t, n) {
  if (typeof e == "string")
    throw (0, br.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Lv.GitHubProvider(i, t, n) : new kv.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new Fv.BitbucketProvider(e, t, n);
    case "keygen":
      return new xv.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new al.GenericProvider({
        provider: "generic",
        url: (0, br.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new al.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Gu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, br.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, br.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Ti = {}, or = {}, gn = {}, Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.OperationKind = void 0;
Yt.computeOperations = Mv;
var Ut;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Ut || (Yt.OperationKind = Ut = {}));
function Mv(e, t, n) {
  const r = cl(e.files), i = cl(t.files);
  let o = null;
  const s = t.files[0], a = [], l = s.name, f = r.get(l);
  if (f == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let u = 0;
  const { checksumToOffset: h, checksumToOldSize: p } = Hv(r.get(l), f.offset, n);
  let y = s.offset;
  for (let E = 0; E < c.checksums.length; y += c.sizes[E], E++) {
    const T = c.sizes[E], S = c.checksums[E];
    let C = h.get(S);
    C != null && p.get(S) !== T && (n.warn(`Checksum ("${S}") matches, but size differs (old: ${p.get(S)}, new: ${T})`), C = void 0), C === void 0 ? (u++, o != null && o.kind === Ut.DOWNLOAD && o.end === y ? o.end += T : (o = {
      kind: Ut.DOWNLOAD,
      start: y,
      end: y + T
      // oldBlocks: null,
    }, ll(o, a, S, E))) : o != null && o.kind === Ut.COPY && o.end === C ? o.end += T : (o = {
      kind: Ut.COPY,
      start: C,
      end: C + T
      // oldBlocks: [checksum]
    }, ll(o, a, S, E));
  }
  return u > 0 && n.info(`File${s.name === "file" ? "" : " " + s.name} has ${u} changed blocks`), a;
}
const Bv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function ll(e, t, n, r) {
  if (Bv && t.length !== 0) {
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
function Hv(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const a = e.checksums[s], l = e.sizes[s], f = i.get(a);
    if (f === void 0)
      r.set(a, o), i.set(a, l);
    else if (n.debug != null) {
      const c = f === l ? "(same size)" : `(size: ${f}, this size: ${l})`;
      n.debug(`${a} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function cl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(gn, "__esModule", { value: !0 });
gn.DataSplitter = void 0;
gn.copyData = Yu;
const $r = me, jv = At, qv = zn, Gv = Yt, ul = Buffer.from(`\r
\r
`);
var mt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(mt || (mt = {}));
function Yu(e, t, n, r, i) {
  const o = (0, jv.createReadStream)("", {
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
class Yv extends qv.Writable {
  constructor(t, n, r, i, o, s) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = s, this.partIndex = -1, this.headerListBuffer = null, this.readState = mt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, $r.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === mt.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = mt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === mt.BODY)
          this.readState = mt.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, $r.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < s)
            await this.copyExistingData(a, s);
          else if (a > s)
            throw (0, $r.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = mt.HEADER;
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
        if (s.kind !== Gv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Yu(s, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(ul, n);
    if (r !== -1)
      return r + ul.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, $r.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
gn.DataSplitter = Yv;
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.executeTasksUsingMultipleRangeRequests = Xv;
Si.checkIsRangesSupported = Ro;
const Oo = me, dl = gn, fl = Yt;
function Xv(e, t, n, r, i) {
  const o = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const a = s + 1e3;
    Vv(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, a),
      oldFileFd: r
    }, n, () => o(a), i);
  };
  return o;
}
function Vv(e, t, n, r, i) {
  let o = "bytes=", s = 0;
  const a = /* @__PURE__ */ new Map(), l = [];
  for (let u = t.start; u < t.end; u++) {
    const h = t.tasks[u];
    h.kind === fl.OperationKind.DOWNLOAD && (o += `${h.start}-${h.end - 1}, `, a.set(s, u), s++, l.push(h.end - h.start));
  }
  if (s <= 1) {
    const u = (h) => {
      if (h >= t.end) {
        r();
        return;
      }
      const p = t.tasks[h++];
      if (p.kind === fl.OperationKind.COPY)
        (0, dl.copyData)(p, n, t.oldFileFd, i, () => u(h));
      else {
        const y = e.createRequestOptions();
        y.headers.Range = `bytes=${p.start}-${p.end - 1}`;
        const E = e.httpExecutor.createRequest(y, (T) => {
          Ro(T, i) && (T.pipe(n, {
            end: !1
          }), T.once("end", () => u(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(E, i), E.end();
      }
    };
    u(t.start);
    return;
  }
  const f = e.createRequestOptions();
  f.headers.Range = o.substring(0, o.length - 2);
  const c = e.httpExecutor.createRequest(f, (u) => {
    if (!Ro(u, i))
      return;
    const h = (0, Oo.safeGetHeader)(u, "content-type"), p = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(h);
    if (p == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const y = new dl.DataSplitter(n, t, a, p[1] || p[2], l, r);
    y.on("error", i), u.pipe(y), u.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function Ro(e, t) {
  if (e.statusCode >= 400)
    return t((0, Oo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, Oo.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.ProgressDifferentialDownloadCallbackTransform = void 0;
const Wv = zn;
var on;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(on || (on = {}));
class zv extends Wv.Transform {
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
Ci.ProgressDifferentialDownloadCallbackTransform = zv;
Object.defineProperty(or, "__esModule", { value: !0 });
or.DifferentialDownloader = void 0;
const An = me, ao = It, Kv = At, Jv = gn, Qv = fn, Pr = Yt, hl = Si, Zv = Ci;
class ew {
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
    return (0, An.configureRequestUrl)(this.options.newUrl, t), (0, An.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Pr.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, s = 0;
    for (const l of i) {
      const f = l.end - l.start;
      l.kind === Pr.OperationKind.DOWNLOAD ? o += f : s += f;
    }
    const a = this.blockAwareFileInfo.size;
    if (o + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${s}, newSize: ${a}`);
    return r.info(`Full: ${pl(a)}, To download: ${pl(o)} (${Math.round(o / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, ao.close)(i.descriptor).catch((o) => {
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
    const r = await (0, ao.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, ao.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, Kv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, a) => {
      const l = [];
      let f;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const S = [];
        let C = 0;
        for (const x of t)
          x.kind === Pr.OperationKind.DOWNLOAD && (S.push(x.end - x.start), C += x.end - x.start);
        const D = {
          expectedByteCounts: S,
          grandTotal: C
        };
        f = new Zv.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), l.push(f);
      }
      const c = new An.DigestTransform(this.blockAwareFileInfo.sha512);
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
      const h = l[0];
      let p;
      if (this.options.isUseMultipleRangeRequest) {
        p = (0, hl.executeTasksUsingMultipleRangeRequests)(this, t, h, r, a), p(0);
        return;
      }
      let y = 0, E = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", p = (S) => {
        var C, D;
        if (S >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const x = t[S++];
        if (x.kind === Pr.OperationKind.COPY) {
          f && f.beginFileCopy(), (0, Jv.copyData)(x, h, r, a, () => p(S));
          return;
        }
        const re = `bytes=${x.start}-${x.end - 1}`;
        T.headers.range = re, (D = (C = this.logger) === null || C === void 0 ? void 0 : C.debug) === null || D === void 0 || D.call(C, `download range: ${re}`), f && f.beginRangeDownload();
        const le = this.httpExecutor.createRequest(T, (z) => {
          z.on("error", a), z.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), z.statusCode >= 400 && a((0, An.createHttpError)(z)), z.pipe(h, {
            end: !1
          }), z.once("end", () => {
            f && f.endRangeDownload(), ++y === 100 ? (y = 0, setTimeout(() => p(S), 1e3)) : p(S);
          });
        });
        le.on("redirect", (z, Ue, _) => {
          this.logger.info(`Redirect to ${tw(_)}`), E = _, (0, An.configureRequestUrl)(new Qv.URL(E), T), le.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(le, a), le.end();
      }, p(0);
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
        (0, hl.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", n), s.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
or.DifferentialDownloader = ew;
function pl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function tw(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.GenericDifferentialDownloader = void 0;
const nw = or;
class rw extends nw.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
Ti.GenericDifferentialDownloader = rw;
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
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.NoOpLogger = vt.AppUpdater = void 0;
const Ae = me, iw = Kn, ow = ni, sw = kl, Kt = It, aw = _e, lo = di, Dt = J, xt = ku, ml = rr, lw = Ei, gl = Uu, cw = ir, co = yi, uw = Ml, dw = Ge, fw = Ti, Jt = Ot;
class us extends sw.EventEmitter {
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
    return (0, gl.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Xu();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new lo.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Jt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this.clientPromise = null, this.stagingUserIdPromise = new lo.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new lo.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new lw.ElectronAppAdapter(), this.httpExecutor = new gl.ElectronHttpExecutor((o, s) => this.emit("login", o, s))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, xt.parse)(r);
    if (i == null)
      throw (0, Ae.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = hw(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? r = new cw.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, co.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, co.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
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
      const r = us.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
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
    const i = await this.stagingUserIdPromise.value, s = Ae.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${s}, user id: ${i}`), s < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, xt.parse)(t.version);
    if (n == null)
      throw (0, Ae.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, xt.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const o = (0, xt.gt)(n, r), s = (0, xt.lt)(n, r);
    return o ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, ow.release)();
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
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, co.createClient)(r, this, this.createProviderRuntimeOptions())));
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
    this.emit(Jt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, aw.load)(await (0, Kt.readFile)(this._appUpdateConfigPath, "utf-8"));
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
      if (Ae.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Ae.UUID.v5((0, iw.randomBytes)(4096), Ae.UUID.OID);
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
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new ml.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    const l = await this.getOrCreateDownloadHelper(), f = l.cacheDirForPendingUpdate;
    await (0, Kt.mkdir)(f, { recursive: !0 });
    const c = a();
    let u = Dt.join(f, c);
    const h = s == null ? null : Dt.join(f, `package-${o}${Dt.extname(s.path) || ".7z"}`), p = async (C) => (await l.setDownloadedFile(u, h, i, n, c, C), await t.done({
      ...i,
      downloadedFile: u
    }), h == null ? [u] : [u, h]), y = this._logger, E = await l.validateDownloadedPath(u, i, n, y);
    if (E != null)
      return u = E, await p(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, Kt.unlink)(u).catch(() => {
    })), S = await (0, ml.createTempUpdateFile)(`temp-${c}`, f, y);
    try {
      await t.task(S, r, h, T), await (0, Ae.retry)(() => (0, Kt.rename)(S, u), 60, 500, 0, 0, (C) => C instanceof Error && /^EBUSY:/.test(C.message));
    } catch (C) {
      throw await T(), C instanceof Ae.CancellationError && (y.info("cancelled"), this.emit("update-cancelled", i)), C;
    }
    return y.info(`New version ${o} has been downloaded to ${u}`), await p(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, dw.blockmapFiles)(t.url, this.app.version, n.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const a = async (c) => {
        const u = await this.httpExecutor.downloadToBuffer(c, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (u == null || u.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, uw.gunzipSync)(u).toString());
        } catch (h) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${h}`);
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
      const f = await Promise.all(s.map((c) => a(c)));
      return await new fw.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(f[0], f[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
vt.AppUpdater = us;
function hw(e) {
  const t = (0, xt.prerelease)(e);
  return t != null && t.length > 0;
}
class Xu {
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
vt.NoOpLogger = Xu;
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.BaseUpdater = void 0;
const El = ti, pw = vt;
class mw extends pw.AppUpdater {
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
    const i = (0, El.spawnSync)(t, n, {
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
        const a = { stdio: i, env: r, detached: !0 }, l = (0, El.spawn)(t, n, a);
        l.on("error", (f) => {
          s(f);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (a) {
        s(a);
      }
    });
  }
}
lt.BaseUpdater = mw;
var jn = {}, sr = {};
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Qt = It, gw = or, Ew = Ml;
class yw extends gw.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = Vu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await _w(this.options.oldFile), i);
  }
}
sr.FileWithEmbeddedBlockMapDifferentialDownloader = yw;
function Vu(e) {
  return JSON.parse((0, Ew.inflateRawSync)(e).toString());
}
async function _w(e) {
  const t = await (0, Qt.open)(e, "r");
  try {
    const n = (await (0, Qt.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, Qt.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, Qt.read)(t, i, 0, i.length, n - r.length - i.length), await (0, Qt.close)(t), Vu(i);
  } catch (n) {
    throw await (0, Qt.close)(t), n;
  }
}
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.AppImageUpdater = void 0;
const yl = me, _l = ti, vw = It, ww = At, In = J, Tw = lt, Sw = sr, Cw = de, vl = Ot;
class Aw extends Tw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Cw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, yl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, s, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, vw.chmod)(i, 493);
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
      return this.listenerCount(vl.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(vl.DOWNLOAD_PROGRESS, a)), await new Sw.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, yl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, ww.unlinkSync)(n);
    let r;
    const i = In.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    In.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = In.join(In.dirname(n), In.basename(o)), (0, _l.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, _l.execFileSync)(r, [], { env: s })), !0;
  }
}
jn.AppImageUpdater = Aw;
var qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.DebUpdater = void 0;
const Iw = lt, Ow = de, wl = Ot;
class Rw extends Iw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Ow.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(wl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(wl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
qn.DebUpdater = Rw;
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.PacmanUpdater = void 0;
const Nw = lt, Tl = Ot, bw = de;
class $w extends Nw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, bw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Tl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Tl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
Gn.PacmanUpdater = $w;
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.RpmUpdater = void 0;
const Pw = lt, Sl = Ot, Dw = de;
class Fw extends Pw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Dw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Sl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Sl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
Yn.RpmUpdater = Fw;
var Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.MacUpdater = void 0;
const Cl = me, uo = It, Lw = At, Al = J, xw = Sf, kw = vt, Uw = de, Il = ti, Ol = Kn;
class Mw extends kw.AppUpdater {
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
      this.debug("Checking for macOS Rosetta environment"), o = (0, Il.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (u) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${u}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Il.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      r.info(`Checked 'uname -a': arm64=${h}`), s = s || h;
    } catch (u) {
      r.warn(`uname shell command to check for arm64 failed: ${u}`);
    }
    s = s || process.arch === "arm64" || o;
    const a = (u) => {
      var h;
      return u.url.pathname.includes("arm64") || ((h = u.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    s && n.some(a) ? n = n.filter((u) => s === a(u)) : n = n.filter((u) => !a(u));
    const l = (0, Uw.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Cl.newError)(`ZIP file not provided: ${(0, Cl.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const f = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (u, h) => {
        const p = Al.join(this.downloadedUpdateHelper.cacheDir, c), y = () => (0, uo.pathExistsSync)(p) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let E = !0;
        y() && (E = await this.differentialDownloadInstaller(l, t, u, f, c)), E && await this.httpExecutor.download(l.url, u, h);
      },
      done: async (u) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Al.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, uo.copyFile)(u.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, u);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, uo.stat)(i)).size, s = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, xw.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const l = (f) => {
      const c = f.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((f, c) => {
      const u = (0, Ol.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${u}`, "ascii"), p = `/${(0, Ol.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (y, E) => {
        const T = y.url;
        if (s.info(`${T} requested`), T === "/") {
          if (!y.headers.authorization || y.headers.authorization.indexOf("Basic ") === -1) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), s.warn("No authenthication info");
            return;
          }
          const D = y.headers.authorization.split(" ")[1], x = Buffer.from(D, "base64").toString("ascii"), [re, le] = x.split(":");
          if (re !== "autoupdater" || le !== u) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const z = Buffer.from(`{ "url": "${l(this.server)}${p}" }`);
          E.writeHead(200, { "Content-Type": "application/json", "Content-Length": z.length }), E.end(z);
          return;
        }
        if (!T.startsWith(p)) {
          s.warn(`${T} requested, but not supported`), E.writeHead(404), E.end();
          return;
        }
        s.info(`${p} requested by Squirrel.Mac, pipe ${i}`);
        let S = !1;
        E.on("finish", () => {
          S || (this.nativeUpdater.removeListener("error", c), f([]));
        });
        const C = (0, Lw.createReadStream)(i);
        C.on("error", (D) => {
          try {
            E.end();
          } catch (x) {
            s.warn(`cannot end response: ${x}`);
          }
          S = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${D}`));
        }), E.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), C.pipe(E);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${a})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${a})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : f([]);
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
Xn.MacUpdater = Mw;
var Vn = {}, ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
ds.verifySignature = Hw;
const Rl = me, Wu = ti, Bw = ni, Nl = J;
function Hw(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, Wu.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, a, l) => {
      var f;
      try {
        if (s != null || l) {
          fo(n, s, l, i), r(null);
          return;
        }
        const c = jw(a);
        if (c.Status === 0) {
          try {
            const y = Nl.normalize(c.Path), E = Nl.normalize(t);
            if (n.info(`LiteralPath: ${y}. Update Path: ${E}`), y !== E) {
              fo(n, new Error(`LiteralPath of ${y} is different than ${E}`), l, i), r(null);
              return;
            }
          } catch (y) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(f = y.message) !== null && f !== void 0 ? f : y.stack}`);
          }
          const h = (0, Rl.parseDn)(c.SignerCertificate.Subject);
          let p = !1;
          for (const y of e) {
            const E = (0, Rl.parseDn)(y);
            if (E.size ? p = Array.from(E.keys()).every((S) => E.get(S) === h.get(S)) : y === h.get("CN") && (n.warn(`Signature validated using only CN ${y}. Please add your full Distinguished Name (DN) to publisherNames configuration`), p = !0), p) {
              r(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (h, p) => h === "RawData" ? void 0 : p, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), r(u);
      } catch (c) {
        fo(n, c, null, i), r(null);
        return;
      }
    });
  });
}
function jw(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function fo(e, t, n, r) {
  if (qw()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Wu.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function qw() {
  const e = Bw.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.NsisUpdater = void 0;
const Dr = me, bl = J, Gw = lt, Yw = sr, $l = Ot, Xw = de, Vw = It, Ww = ds, Pl = fn;
class zw extends Gw.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, Ww.verifySignature)(r, i, this._logger);
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
    const n = t.updateInfoAndProvider.provider, r = (0, Xw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, s, a) => {
        const l = r.packageInfo, f = l != null && s != null;
        if (f && t.disableWebInstaller)
          throw (0, Dr.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !f && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (f || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, Dr.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await a(), (0, Dr.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (f && await this.differentialDownloadWebPackage(t, l, s, n))
          try {
            await this.httpExecutor.download(new Pl.URL(l.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (u) {
            try {
              await (0, Vw.unlink)(s);
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
      this.spawnLog(bl.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((s) => this.dispatchError(s));
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
        newUrl: new Pl.URL(n.path),
        oldFile: bl.join(this.downloadedUpdateHelper.cacheDir, Dr.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount($l.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit($l.DOWNLOAD_PROGRESS, s)), await new Yw.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Vn.NsisUpdater = zw;
(function(e) {
  var t = Re && Re.__createBinding || (Object.create ? function(T, S, C, D) {
    D === void 0 && (D = C);
    var x = Object.getOwnPropertyDescriptor(S, C);
    (!x || ("get" in x ? !S.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return S[C];
    } }), Object.defineProperty(T, D, x);
  } : function(T, S, C, D) {
    D === void 0 && (D = C), T[D] = S[C];
  }), n = Re && Re.__exportStar || function(T, S) {
    for (var C in T) C !== "default" && !Object.prototype.hasOwnProperty.call(S, C) && t(S, T, C);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = It, i = J;
  var o = lt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var s = vt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var a = de;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var l = jn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var f = qn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return f.DebUpdater;
  } });
  var c = Gn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var u = Yn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return u.RpmUpdater;
  } });
  var h = Xn;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var p = Vn;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return p.NsisUpdater;
  } }), n(Ot, e);
  let y;
  function E() {
    if (process.platform === "win32")
      y = new Vn.NsisUpdater();
    else if (process.platform === "darwin")
      y = new Xn.MacUpdater();
    else {
      y = new jn.AppImageUpdater();
      try {
        const T = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(T))
          return y;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const S = (0, r.readFileSync)(T).toString().trim();
        switch (console.info("Found package-type:", S), S) {
          case "deb":
            y = new qn.DebUpdater();
            break;
          case "rpm":
            y = new Yn.RpmUpdater();
            break;
          case "pacman":
            y = new Gn.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (T) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", T.message);
      }
    }
    return y;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => y || E()
  });
})(Bl);
const Kw = /* @__PURE__ */ Rf(Bl), zu = J.join(Oe.getPath("userData"), "cafe_stock.db"), M = new Of(zu), No = () => zu;
M.exec(`
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
    ann_date TEXT NOT NULL,
    ts_code TEXT NOT NULL,
    name TEXT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    rec_time TEXT,
    created_at TEXT NOT NULL,
    UNIQUE(ts_code, ann_date, title)
  );

  CREATE INDEX IF NOT EXISTS idx_ann_date ON announcements (ann_date DESC);
  CREATE INDEX IF NOT EXISTS idx_ann_ts_code ON announcements (ts_code);
  CREATE INDEX IF NOT EXISTS idx_ann_ts_code_date ON announcements (ts_code, ann_date DESC);

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
const fs = (e) => {
  const t = (/* @__PURE__ */ new Date()).toISOString(), n = M.prepare(`
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
  M.transaction((i) => {
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
}, Ai = () => M.prepare("SELECT * FROM stocks ORDER BY ts_code").all(), ar = () => M.prepare("SELECT COUNT(*) as count FROM stocks").get().count, Zr = () => {
  const e = ar(), t = M.prepare("SELECT MAX(updated_at) as last_sync_time FROM stocks").get();
  return {
    stockCount: e,
    lastSyncTime: (t == null ? void 0 : t.last_sync_time) || null
  };
}, hs = (e, t = 50) => {
  const n = `%${e}%`;
  return M.prepare(
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
}, Ku = (e) => {
  const t = M.prepare("SELECT last_sync_date FROM sync_flags WHERE sync_type = ?").get(e);
  return (t == null ? void 0 : t.last_sync_date) || null;
}, Ju = (e, t) => {
  const n = (/* @__PURE__ */ new Date()).toISOString();
  M.prepare(
    `
    INSERT INTO sync_flags (sync_type, last_sync_date, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(sync_type) DO UPDATE SET
      last_sync_date = excluded.last_sync_date,
      updated_at = excluded.updated_at
  `
  ).run(e, t, n);
}, ps = (e) => {
  const t = Ku(e);
  if (!t) return !1;
  const n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  return t === n;
}, Qu = (e) => {
  const t = (/* @__PURE__ */ new Date()).toISOString();
  try {
    return M.prepare(
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
}, Zu = (e) => M.prepare("DELETE FROM favorite_stocks WHERE ts_code = ?").run(e).changes > 0, ed = (e) => M.prepare("SELECT COUNT(*) as count FROM favorite_stocks WHERE ts_code = ?").get(e).count > 0, ms = () => M.prepare("SELECT ts_code FROM favorite_stocks ORDER BY created_at DESC").all().map((t) => t.ts_code), gs = () => M.prepare("SELECT COUNT(*) as count FROM favorite_stocks").get().count, bo = (e) => {
  const t = (/* @__PURE__ */ new Date()).toISOString(), n = M.prepare(`
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
  M.transaction((i) => {
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
}, td = (e, t = 100) => M.prepare(
  `
    SELECT * FROM top10_holders 
    WHERE ts_code = ?
    ORDER BY end_date DESC, hold_ratio DESC
    LIMIT ?
  `
).all(e, t), nd = (e) => M.prepare(
  `
    SELECT DISTINCT end_date 
    FROM top10_holders 
    WHERE ts_code = ?
    ORDER BY end_date DESC
  `
).all(e).map((n) => n.end_date), rd = (e, t) => M.prepare(
  `
    SELECT * FROM top10_holders 
    WHERE ts_code = ? AND end_date = ?
    ORDER BY hold_ratio DESC
  `
).all(e, t), $o = (e) => M.prepare("SELECT COUNT(*) as count FROM top10_holders WHERE ts_code = ?").get(e).count > 0, id = () => M.prepare("SELECT DISTINCT ts_code FROM top10_holders ORDER BY ts_code").all().map((t) => t.ts_code), Es = () => M.prepare("SELECT COUNT(DISTINCT ts_code) as count FROM top10_holders").get().count, Jw = (e, t = 100) => {
  const n = `%${e}%`;
  return M.prepare(
    `
    SELECT h.*, s.name as stock_name, s.industry, s.market
    FROM top10_holders h
    INNER JOIN stocks s ON h.ts_code = s.ts_code
    WHERE h.holder_name LIKE ?
    ORDER BY h.end_date DESC, h.hold_ratio DESC
    LIMIT ?
  `
  ).all(n, t);
}, Qw = (e) => M.prepare(
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
).all(e), od = (e) => M.prepare("DELETE FROM top10_holders WHERE ts_code = ?").run(e).changes, sd = (e) => {
  const t = (/* @__PURE__ */ new Date()).toISOString(), n = M.prepare(`
    INSERT INTO announcements (
      ann_date, ts_code, name, title, url, rec_time, created_at
    )
    VALUES (
      @ann_date, @ts_code, @name, @title, @url, @rec_time, @created_at
    )
    ON CONFLICT(ts_code, ann_date, title) DO UPDATE SET
      name = excluded.name,
      url = excluded.url,
      rec_time = excluded.rec_time,
      created_at = excluded.created_at
  `);
  M.transaction((i) => {
    for (const o of i)
      n.run({
        ann_date: o.ann_date || null,
        ts_code: o.ts_code || null,
        name: o.name || null,
        title: o.title || null,
        url: o.url || null,
        rec_time: o.rec_time || null,
        created_at: t
      });
  })(e);
}, Mr = (e, t, n) => {
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
  const o = M.prepare(r).all(...i);
  if (o.length === 0)
    return !1;
  for (const s of o)
    if (s.start_date <= t && s.end_date >= n)
      return !0;
  return !1;
}, Po = (e, t, n) => {
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
  const o = M.prepare(r).all(...i);
  if (o.length === 0)
    return [{ start_date: t, end_date: n }];
  const s = [];
  let a = t;
  for (const l of o) {
    if (a < l.start_date) {
      const f = tT(l.start_date);
      s.push({
        start_date: a,
        end_date: f
      });
    }
    a = ud(l.end_date);
  }
  return a <= n && s.push({
    start_date: a,
    end_date: n
  }), s;
}, ad = (e, t, n) => {
  const r = (/* @__PURE__ */ new Date()).toISOString();
  e ? M.prepare(`
      INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
      VALUES (?, ?, ?, ?)
    `).run(e, t, n, r) : M.prepare(`
      INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
      VALUES (NULL, ?, ?, ?)
    `).run(t, n, r), Zw(e);
}, Zw = (e) => {
  var f, c;
  let t, n;
  e ? (t = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code = ? ORDER BY start_date", n = [e]) : (t = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code IS NULL ORDER BY start_date", n = []);
  const r = M.prepare(t).all(...n);
  if (r.length <= 1)
    return;
  const i = [], o = [];
  let s = r[0];
  for (let u = 1; u < r.length; u++) {
    const h = r[u];
    ud(s.end_date) >= h.start_date ? (s = {
      id: s.id,
      start_date: s.start_date,
      end_date: h.end_date > s.end_date ? h.end_date : s.end_date
    }, i.push(h.id)) : (s.end_date !== ((f = r.find((p) => p.id === s.id)) == null ? void 0 : f.end_date) && o.push(s), s = h);
  }
  s.end_date !== ((c = r.find((u) => u.id === s.id)) == null ? void 0 : c.end_date) && o.push(s);
  const a = M.prepare("UPDATE announcement_sync_ranges SET end_date = ? WHERE id = ?"), l = M.prepare("DELETE FROM announcement_sync_ranges WHERE id = ?");
  M.transaction(() => {
    for (const u of o)
      a.run(u.end_date, u.id);
    for (const u of i)
      l.run(u);
  })();
}, eT = (e, t = 100) => M.prepare(
  `
    SELECT * FROM announcements 
    WHERE ts_code = ?
    ORDER BY ann_date DESC, rec_time DESC
    LIMIT ?
  `
).all(e, t), Br = (e, t, n, r = 200) => n ? M.prepare(
  `
      SELECT * FROM announcements 
      WHERE ts_code = ? AND ann_date >= ? AND ann_date <= ?
      ORDER BY ann_date DESC, rec_time DESC
      LIMIT ?
    `
).all(n, e, t, r) : M.prepare(
  `
      SELECT * FROM announcements 
      WHERE ann_date >= ? AND ann_date <= ?
      ORDER BY ann_date DESC, rec_time DESC
      LIMIT ?
    `
).all(e, t, r), ld = (e, t = 100) => {
  const n = `%${e}%`;
  return M.prepare(
    `
    SELECT a.*, s.name as stock_name 
    FROM announcements a
    LEFT JOIN stocks s ON a.ts_code = s.ts_code
    WHERE a.title LIKE ? OR a.ts_code LIKE ? OR s.name LIKE ?
    ORDER BY a.ann_date DESC, a.rec_time DESC
    LIMIT ?
  `
  ).all(n, n, n, t);
}, cd = () => M.prepare("SELECT COUNT(*) as count FROM announcements").get().count, tT = (e) => {
  const t = parseInt(e.substring(0, 4)), n = parseInt(e.substring(4, 6)) - 1, r = parseInt(e.substring(6, 8)), i = new Date(t, n, r);
  return i.setDate(i.getDate() - 1), dd(i);
}, ud = (e) => {
  const t = parseInt(e.substring(0, 4)), n = parseInt(e.substring(4, 6)) - 1, r = parseInt(e.substring(6, 8)), i = new Date(t, n, r);
  return i.setDate(i.getDate() + 1), dd(i);
}, dd = (e) => {
  const t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0");
  return `${t}${n}${r}`;
};
M.pragma("journal_mode = WAL");
M.pragma("synchronous = NORMAL");
M.pragma("cache_size = -64000");
M.pragma("temp_store = MEMORY");
const nT = (e, t = []) => {
  const n = M.prepare(`EXPLAIN QUERY PLAN ${e}`).all(...t);
  return console.log("Query Plan:", JSON.stringify(n, null, 2)), n;
}, fd = () => {
  const e = ar(), t = gs(), n = Es(), i = M.prepare("SELECT COUNT(*) as count FROM top10_holders").get().count, o = Zr(), s = M.prepare("SELECT sync_type, last_sync_date, updated_at FROM sync_flags ORDER BY sync_type").all();
  return {
    stocks: {
      count: e,
      lastSyncTime: o.lastSyncTime
    },
    favoriteStocks: {
      count: t
    },
    top10Holders: {
      stockCount: n,
      recordCount: i
    },
    syncFlags: s.map((a) => ({
      type: a.sync_type,
      lastSyncDate: a.last_sync_date,
      updatedAt: a.updated_at
    }))
  };
}, rT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addFavoriteStock: Qu,
  analyzeQuery: nT,
  countAnnouncements: cd,
  countFavoriteStocks: gs,
  countStocks: ar,
  countStocksWithTop10Holders: Es,
  default: M,
  deleteTop10HoldersByStock: od,
  getAllFavoriteStocks: ms,
  getAllStocks: Ai,
  getAnnouncementsByDateRange: Br,
  getAnnouncementsByStock: eT,
  getCacheDataStats: fd,
  getDbPath: No,
  getLastSyncDate: Ku,
  getStockListSyncInfo: Zr,
  getStocksByHolder: Qw,
  getStocksWithTop10Holders: id,
  getTop10HoldersByStock: td,
  getTop10HoldersByStockAndEndDate: rd,
  getTop10HoldersEndDates: nd,
  getUnsyncedAnnouncementRanges: Po,
  hasTop10HoldersData: $o,
  isAnnouncementRangeSynced: Mr,
  isFavoriteStock: ed,
  isSyncedToday: ps,
  recordAnnouncementSyncRange: ad,
  removeFavoriteStock: Zu,
  searchAnnouncements: ld,
  searchHoldersByName: Jw,
  searchStocks: hs,
  updateSyncFlag: Ju,
  upsertAnnouncements: sd,
  upsertStocks: fs,
  upsertTop10Holders: bo
}, Symbol.toStringTag, { value: "Module" })), ei = class ei {
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
      const s = await o.json();
      if (s.code !== 0)
        throw new Error(`Tushare Error [${s.code}]: ${s.msg}`);
      if (!s.data)
        return [];
      const { fields: a, items: l } = s.data;
      return l.map((c) => {
        const u = {};
        return a.forEach((h, p) => {
          u[h] = c[p];
        }), u;
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
      const f = await this.getAnnouncementFiles(t, void 0, n, s);
      if (!f || f.length === 0) {
        console.log("[Tushare] 没有更多公告数据"), l = !1;
        break;
      }
      if (o.push(...f), i && i(f.length, o.length), console.log(`[Tushare] 获取到 ${f.length} 条公告，累计 ${o.length} 条`), f.length < a) {
        l = !1;
        break;
      }
      const c = f[f.length - 1].ann_date;
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
    const l = a.map((u) => u.ann_date).sort(), f = l[0], c = l[l.length - 1];
    if (console.log(`[Tushare] 首批数据日期范围: ${f} - ${c}`), f > n) {
      console.log("[Tushare] 向后获取更早的数据...");
      let u = this.getPreviousDay(f);
      for (; u >= n; ) {
        console.log(`[Tushare] 获取历史数据: ${n} - ${u}`);
        const h = await this.getAnnouncements(t, void 0, n, u, 2e3, 0);
        if (!h || h.length === 0) {
          console.log("[Tushare] 没有更早的数据");
          break;
        }
        if (o.push(...h), console.log(`[Tushare] 获取到 ${h.length} 条历史公告，累计 ${o.length} 条`), i && i(`已获取 ${o.length} 条`, o.length, o.length), h.length < 2e3)
          break;
        const p = h.map((y) => y.ann_date).sort()[0];
        if (p <= n)
          break;
        u = this.getPreviousDay(p), await this.sleep(300);
      }
    }
    if (c < r) {
      console.log("[Tushare] 向前获取更新的数据...");
      let u = this.getNextDay(c);
      for (; u <= r; ) {
        console.log(`[Tushare] 获取最新数据: ${u} - ${r}`);
        const h = await this.getAnnouncements(t, void 0, u, r, 2e3, 0);
        if (!h || h.length === 0) {
          console.log("[Tushare] 没有更新的数据");
          break;
        }
        if (o.push(...h), console.log(`[Tushare] 获取到 ${h.length} 条最新公告，累计 ${o.length} 条`), i && i(`已获取 ${o.length} 条`, o.length, o.length), h.length < 2e3)
          break;
        const p = h.map((y) => y.ann_date).sort()[h.length - 1];
        if (p >= r)
          break;
        u = this.getNextDay(p), await this.sleep(300);
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
ei.TOKEN = "834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d", ei.BASE_URL = "http://api.tushare.pro";
let Te = ei;
const { autoUpdater: qe } = Kw, iT = wf(import.meta.url), Do = J.dirname(iT), Wn = process.env.NODE_ENV === "development" || !Oe.isPackaged;
let N = null, Fr = null;
const ys = Oe;
let pt = !1, it = !1, Ie = null, Ft = 8080, je = "", ot = "";
qe.autoDownload = !1;
qe.autoInstallOnAppQuit = !0;
function Dl() {
  Wn || Ef.defaultSession.webRequest.onHeadersReceived((e, t) => {
    t({
      responseHeaders: {
        ...e.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.tushare.pro https://github.com;"
        ]
      }
    });
  }), N = new Fl({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "酷咖啡",
    webPreferences: {
      preload: J.join(Do, "preload.cjs"),
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !1,
      webSecurity: !0,
      webviewTag: !0
      // 启用 webview 标签
    },
    show: !1,
    backgroundColor: "#ffffff"
  }), N.webContents.on("console-message", (e, t, n, r, i) => {
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
  }), N.once("ready-to-show", () => {
    N == null || N.show(), Le.isSupported() && new Le({
      title: "酷咖啡",
      body: "应用已启动，准备好为您服务！"
    }).show();
  }), Wn ? (N.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173"), N.webContents.openDevTools()) : N.loadFile(J.join(Do, "../dist/index.html")), N.on("close", (e) => {
    ys.isQuitting || (e.preventDefault(), N == null || N.hide());
  }), N.on("closed", () => {
    N = null;
  });
}
function oT() {
  const e = Wn ? J.join(Do, "../build/tray-icon.png") : J.join(process.resourcesPath, "build/tray-icon.png");
  let t;
  try {
    t = Fi.createFromPath(e), t.isEmpty() && (t = Fi.createEmpty());
  } catch (r) {
    console.error("创建托盘图标失败:", r), t = Fi.createEmpty();
  }
  Fr = new yf(t), Fr.setToolTip("酷咖啡");
  const n = _f.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        N == null || N.show();
      }
    },
    { type: "separator" },
    {
      label: "关于",
      click: () => {
        Le.isSupported() && new Le({
          title: "酷咖啡",
          body: `版本: ${Oe.getVersion()}
基于 Electron + React`
        }).show();
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        ys.isQuitting = !0, Oe.quit();
      }
    }
  ]);
  Fr.setContextMenu(n), Fr.on("click", () => {
    N != null && N.isVisible() ? N.hide() : N == null || N.show();
  });
}
function sT() {
  Ll.register("CommandOrControl+Shift+S", () => {
    N != null && N.isVisible() ? N.hide() : N == null || N.show();
  });
}
async function aT() {
  return console.log("Incremental sync is deprecated. Data is now fetched in real-time from Tushare API."), { status: "success", message: "数据现在实时从服务端获取，无需同步", totalSynced: 0 };
}
async function lT() {
  try {
    const e = ar();
    if (e > 0) {
      console.log(`Stock list already synced: ${e} stocks`);
      return;
    }
    console.log("Stock list is empty, syncing...");
    const t = await Te.getStockList(void 0, void 0, void 0, void 0, void 0, "L", 5e3, 0);
    t && t.length > 0 && (fs(t), console.log(`Synced ${t.length} stocks to database`), Le.isSupported() && new Le({
      title: "股票列表同步完成",
      body: `已同步 ${t.length} 只股票`
    }).show());
  } catch (e) {
    console.error("Failed to sync stocks:", e);
  }
}
async function cT(e, t, n, r, i) {
  const o = Ai();
  let s = o;
  i && i !== "all" && (s = o.filter((p) => p.market === i));
  let a = [];
  n && r ? (console.log(`[getAnnouncementsGroupedFromAPI] 使用完整获取方式获取公告: ${n} - ${r}`), a = await Te.getAnnouncementsComplete(
    void 0,
    // 全市场
    n,
    r,
    (p, y, E) => {
      console.log(`[getAnnouncementsGroupedFromAPI] ${p}`);
    }
  )) : a = await Te.getAnnouncements(void 0, void 0, n, r, 2e3, 0);
  const l = /* @__PURE__ */ new Map();
  s.forEach((p) => {
    l.set(p.ts_code, {
      ts_code: p.ts_code,
      stock_name: p.name,
      industry: p.industry || "",
      market: p.market || "",
      announcements: []
    });
  }), a.forEach((p) => {
    const y = l.get(p.ts_code);
    y && y.announcements.push(p);
  });
  const f = Array.from(l.values()).map((p) => {
    if (p.announcements.length === 0)
      return null;
    p.announcements.sort((E, T) => {
      const S = (T.ann_date || "").localeCompare(E.ann_date || "");
      return S !== 0 ? S : (T.pub_time || "").localeCompare(E.pub_time || "");
    });
    const y = p.announcements[0];
    return {
      ts_code: p.ts_code,
      stock_name: p.stock_name,
      industry: p.industry,
      market: p.market,
      announcement_count: p.announcements.length,
      latest_ann_date: y.ann_date,
      latest_ann_title: y.title
    };
  }).filter((p) => p !== null).sort((p, y) => {
    const E = ((y == null ? void 0 : y.latest_ann_date) || "").localeCompare((p == null ? void 0 : p.latest_ann_date) || "");
    return E !== 0 ? E : ((p == null ? void 0 : p.stock_name) || "").localeCompare((y == null ? void 0 : y.stock_name) || "");
  }), c = f.length, u = (e - 1) * t;
  return { items: f.slice(u, u + t), total: c };
}
async function uT(e, t, n, r, i, o) {
  const s = hs(e, 1e3);
  let a = s;
  if (o && o !== "all" && (a = s.filter((E) => E.market === o)), a.length === 0)
    return { items: [], total: 0 };
  const l = a.map((E) => E.ts_code).join(","), f = await Te.getAnnouncements(l, void 0, r, i, 2e3, 0), c = /* @__PURE__ */ new Map();
  a.forEach((E) => {
    c.set(E.ts_code, {
      ts_code: E.ts_code,
      stock_name: E.name,
      industry: E.industry || "",
      market: E.market || "",
      announcements: []
    });
  }), f.forEach((E) => {
    const T = c.get(E.ts_code);
    T && T.announcements.push(E);
  });
  const u = Array.from(c.values()).map((E) => {
    if (E.announcements.length === 0)
      return null;
    E.announcements.sort((S, C) => {
      const D = (C.ann_date || "").localeCompare(S.ann_date || "");
      return D !== 0 ? D : (C.pub_time || "").localeCompare(S.pub_time || "");
    });
    const T = E.announcements[0];
    return {
      ts_code: E.ts_code,
      stock_name: E.stock_name,
      industry: E.industry,
      market: E.market,
      announcement_count: E.announcements.length,
      latest_ann_date: T.ann_date,
      latest_ann_title: T.title
    };
  }).filter((E) => E !== null).sort((E, T) => {
    const S = ((T == null ? void 0 : T.latest_ann_date) || "").localeCompare((E == null ? void 0 : E.latest_ann_date) || "");
    return S !== 0 ? S : ((E == null ? void 0 : E.stock_name) || "").localeCompare((T == null ? void 0 : T.stock_name) || "");
  }), h = u.length, p = (t - 1) * n;
  return { items: u.slice(p, p + n), total: h };
}
async function dT(e, t, n, r) {
  const i = ms();
  if (i.length === 0)
    return { items: [], total: 0 };
  const s = Ai().filter((y) => i.includes(y.ts_code)), a = i.join(","), l = await Te.getAnnouncements(a, void 0, n, r, 2e3, 0), f = /* @__PURE__ */ new Map();
  s.forEach((y) => {
    f.set(y.ts_code, {
      ts_code: y.ts_code,
      stock_name: y.name,
      industry: y.industry || "",
      market: y.market || "",
      announcements: []
    });
  }), l.forEach((y) => {
    const E = f.get(y.ts_code);
    E && E.announcements.push(y);
  });
  const c = Array.from(f.values()).map((y) => {
    if (y.announcements.length === 0)
      return null;
    y.announcements.sort((T, S) => {
      const C = (S.ann_date || "").localeCompare(T.ann_date || "");
      return C !== 0 ? C : (S.pub_time || "").localeCompare(T.pub_time || "");
    });
    const E = y.announcements[0];
    return {
      ts_code: y.ts_code,
      stock_name: y.stock_name,
      industry: y.industry,
      market: y.market,
      announcement_count: y.announcements.length,
      latest_ann_date: E.ann_date,
      latest_ann_title: E.title
    };
  }).filter((y) => y !== null).sort((y, E) => {
    const T = ((E == null ? void 0 : E.latest_ann_date) || "").localeCompare((y == null ? void 0 : y.latest_ann_date) || "");
    return T !== 0 ? T : ((y == null ? void 0 : y.stock_name) || "").localeCompare((E == null ? void 0 : E.stock_name) || "");
  }), u = c.length, h = (e - 1) * t;
  return { items: c.slice(h, h + t), total: u };
}
async function hd() {
  try {
    console.log("Starting full stock list sync..."), N == null || N.webContents.send("stock-list-sync-progress", {
      status: "started",
      message: "开始同步股票列表..."
    });
    const e = await Te.getStockList(void 0, void 0, void 0, void 0, void 0, "L", 5e3, 0);
    if (e && e.length > 0) {
      N == null || N.webContents.send("stock-list-sync-progress", {
        status: "syncing",
        message: `正在同步 ${e.length} 只股票...`,
        total: e.length,
        current: 0
      }), fs(e), console.log(`Synced ${e.length} stocks to database`);
      const t = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
      return Ju("stock_list", t), N == null || N.webContents.send("stock-list-sync-progress", {
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
      return N == null || N.webContents.send("stock-list-sync-progress", {
        status: "failed",
        message: "未获取到股票数据"
      }), {
        success: !1,
        stockCount: 0,
        message: "未获取到股票数据"
      };
  } catch (e) {
    return console.error("Failed to sync stocks:", e), N == null || N.webContents.send("stock-list-sync-progress", {
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
function fT() {
  j.handle("show-notification", async (e, t, n) => {
    Le.isSupported() && new Le({ title: t, body: n }).show();
  }), j.handle("get-app-version", async () => Oe.getVersion()), j.handle(
    "get-announcements-grouped",
    async (e, t, n, r, i, o) => {
      try {
        console.log(
          `[IPC] get-announcements-grouped: page=${t}, pageSize=${n}, dateRange=${r}-${i}, market=${o}`
        );
        const s = await cT(t, n, r, i, o);
        return console.log(`[IPC] get-announcements-grouped: page=${t}, items=${s.items.length}, total=${s.total}`), {
          items: s.items,
          total: s.total,
          page: t,
          pageSize: n
        };
      } catch (s) {
        throw console.error("Failed to get grouped announcements:", s), s;
      }
    }
  ), j.handle("get-stock-announcements", async (e, t, n = 100, r, i) => {
    try {
      console.log(`[IPC] get-stock-announcements: tsCode=${t}, limit=${n}, dateRange=${r}-${i}`);
      const o = await Te.getAnnouncements(t, void 0, r, i, n, 0);
      return o.sort((s, a) => {
        const l = (a.ann_date || "").localeCompare(s.ann_date || "");
        return l !== 0 ? l : (a.pub_time || "").localeCompare(s.pub_time || "");
      }), o.map((s) => ({
        ts_code: s.ts_code,
        ann_date: s.ann_date,
        ann_type: s.ann_type,
        title: s.title,
        content: s.content,
        pub_time: s.pub_time
      }));
    } catch (o) {
      throw console.error("Failed to get stock announcements:", o), o;
    }
  }), j.handle(
    "search-announcements-grouped",
    async (e, t, n, r, i, o, s) => {
      try {
        console.log(
          `[IPC] search-announcements-grouped: keyword=${t}, page=${n}, pageSize=${r}, dateRange=${i}-${o}, market=${s}`
        );
        const a = await uT(t, n, r, i, o, s);
        return console.log(
          `[IPC] search-announcements-grouped: keyword=${t}, page=${n}, items=${a.items.length}, total=${a.total}`
        ), {
          items: a.items,
          total: a.total,
          page: n,
          pageSize: r
        };
      } catch (a) {
        throw console.error("Failed to search grouped announcements:", a), a;
      }
    }
  ), j.handle("get-latest-trade-date", async () => {
    try {
      const t = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ""), n = /* @__PURE__ */ new Date();
      n.setDate(n.getDate() - 30);
      const r = n.toISOString().slice(0, 10).replace(/-/g, "");
      console.log(`[IPC] get-latest-trade-date: fetching from ${r} to ${t}`);
      const i = await Te.getTradeCalendar("SSE", r, t, "1");
      if (i && i.length > 0) {
        const o = i.filter((s) => s.is_open === "1" || s.is_open === 1).sort((s, a) => a.cal_date.localeCompare(s.cal_date));
        if (o.length > 0) {
          const s = o[0].cal_date;
          return console.log(`[IPC] get-latest-trade-date: found ${s}`), s;
        }
      }
      return console.log("[IPC] get-latest-trade-date: no trade date found, returning today"), t;
    } catch (e) {
      return console.error("Failed to get latest trade date:", e), (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    }
  }), j.handle("get-announcement-pdf", async (e, t, n, r) => {
    try {
      console.log(`[IPC] get-announcement-pdf: tsCode=${t}, annDate=${n}, title=${r}`);
      const i = await Te.getAnnouncementFiles(t, n);
      console.log(`[IPC] Found ${i.length} announcements for ${t} on ${n}`);
      let o = i.find((s) => s.title === r);
      return o || (o = i.find((s) => {
        const a = s.title || "", l = r || "";
        return a.includes(l) || l.includes(a);
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
  }), j.handle("open-external", async (e, t) => {
    try {
      return console.log(`[IPC] open-external: ${t}`), await vf.openExternal(t), { success: !0 };
    } catch (n) {
      return console.error("Failed to open external URL:", n), {
        success: !1,
        message: n.message || "打开链接失败"
      };
    }
  }), j.handle("get-db-connection-info", async () => {
    try {
      const e = No(), t = Ie !== null, n = t ? `http://localhost:${Ft}` : null, r = !!(je && ot);
      return console.log(`[IPC] get-db-connection-info: ${e}`), {
        success: !0,
        dbPath: e,
        connectionString: `sqlite://${e}`,
        httpServerUrl: n,
        isServerRunning: t,
        port: Ft,
        hasAuth: r,
        username: je || null,
        password: r ? ot : ""
      };
    } catch (e) {
      return console.error("Failed to get DB connection info:", e), {
        success: !1,
        message: e.message || "获取数据库信息失败"
      };
    }
  }), j.handle("start-sqlite-http-server", async (e, t) => {
    try {
      if (Ie)
        return {
          success: !1,
          message: "HTTP 服务器已在运行",
          port: Ft
        };
      const n = t || Ft, r = No(), o = (await Promise.resolve().then(() => rT)).default;
      return Ie = Cf(async (s, a) => {
        if (a.setHeader("Access-Control-Allow-Origin", "*"), a.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"), a.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"), a.setHeader("Content-Type", "application/json; charset=utf-8"), s.method === "OPTIONS") {
          a.writeHead(200), a.end();
          return;
        }
        if (je && ot) {
          const l = s.headers.authorization;
          if (!l || !l.startsWith("Basic ")) {
            a.writeHead(401, { "WWW-Authenticate": 'Basic realm="SQLite Database"' }), a.end(JSON.stringify({ error: "Authentication required" }));
            return;
          }
          const f = Buffer.from(l.substring(6), "base64").toString("utf-8"), [c, u] = f.split(":");
          if (c !== je || u !== ot) {
            a.writeHead(401, { "WWW-Authenticate": 'Basic realm="SQLite Database"' }), a.end(JSON.stringify({ error: "Invalid credentials" }));
            return;
          }
        }
        try {
          const f = new Tf(s.url || "/", `http://${s.headers.host}`).pathname;
          if (f === "/health" || f === "/") {
            a.writeHead(200), a.end(
              JSON.stringify({
                status: "ok",
                database: r,
                port: n,
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              })
            );
            return;
          }
          if (f === "/query" && s.method === "POST") {
            let c = "";
            s.on("data", (u) => {
              c += u.toString();
            }), s.on("end", () => {
              try {
                const { sql: u, params: h = [] } = JSON.parse(c);
                if (!u || typeof u != "string") {
                  a.writeHead(400), a.end(JSON.stringify({ error: "SQL query is required" }));
                  return;
                }
                if (!u.trim().toUpperCase().startsWith("SELECT")) {
                  a.writeHead(403), a.end(JSON.stringify({ error: "Only SELECT queries are allowed" }));
                  return;
                }
                const p = o.prepare(u), y = h.length > 0 ? p.all(...h) : p.all();
                a.writeHead(200), a.end(JSON.stringify({ success: !0, data: y }));
              } catch (u) {
                a.writeHead(500), a.end(JSON.stringify({ error: u.message || "Query execution failed" }));
              }
            });
            return;
          }
          if (f === "/tables" && s.method === "GET") {
            const c = o.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
            a.writeHead(200), a.end(JSON.stringify({ success: !0, data: c.map((u) => u.name) }));
            return;
          }
          if (f.startsWith("/table/") && s.method === "GET") {
            const c = f.split("/")[2];
            if (!c) {
              a.writeHead(400), a.end(JSON.stringify({ error: "Table name is required" }));
              return;
            }
            const u = o.prepare(`PRAGMA table_info(${c})`).all();
            a.writeHead(200), a.end(JSON.stringify({ success: !0, data: u }));
            return;
          }
          a.writeHead(404), a.end(JSON.stringify({ error: "Not found" }));
        } catch (l) {
          a.writeHead(500), a.end(JSON.stringify({ error: l.message || "Internal server error" }));
        }
      }), Ie.listen(n, () => {
        const s = je && ot ? ` (认证: ${je})` : " (无认证)";
        console.log(`[SQLite HTTP Server] Started on http://localhost:${n}${s}`), N == null || N.webContents.send("sqlite-http-server-started", {
          port: n,
          hasAuth: !!(je && ot),
          username: je || null
        });
      }), Ie.on("error", (s) => {
        console.error("[SQLite HTTP Server] Error:", s), s.code === "EADDRINUSE" && (N == null || N.webContents.send("sqlite-http-server-error", {
          message: `端口 ${n} 已被占用`
        }));
      }), Ft = n, {
        success: !0,
        port: n,
        url: `http://localhost:${n}`
      };
    } catch (n) {
      return console.error("Failed to start SQLite HTTP server:", n), {
        success: !1,
        message: n.message || "启动 HTTP 服务器失败"
      };
    }
  }), j.handle("stop-sqlite-http-server", async () => {
    try {
      return Ie ? new Promise((e) => {
        Ie == null || Ie.close(() => {
          console.log("[SQLite HTTP Server] Stopped"), Ie = null, N == null || N.webContents.send("sqlite-http-server-stopped"), e({
            success: !0,
            message: "HTTP 服务器已停止"
          });
        });
      }) : {
        success: !1,
        message: "HTTP 服务器未运行"
      };
    } catch (e) {
      return console.error("Failed to stop SQLite HTTP server:", e), {
        success: !1,
        message: e.message || "停止 HTTP 服务器失败"
      };
    }
  }), j.handle("get-sqlite-http-server-status", async () => ({
    isRunning: Ie !== null,
    port: Ft,
    url: Ie ? `http://localhost:${Ft}` : null,
    hasAuth: !!(je && ot),
    username: je || null
  })), j.handle("set-sqlite-http-auth", async (e, t, n) => {
    try {
      return !t || !n ? {
        success: !1,
        message: "用户名和密码不能为空"
      } : (je = t, ot = n, console.log(`[SQLite HTTP Server] Auth configured: username=${t}`), {
        success: !0,
        message: "认证信息已设置"
      });
    } catch (r) {
      return console.error("Failed to set auth:", r), {
        success: !1,
        message: r.message || "设置认证信息失败"
      };
    }
  }), j.handle("clear-sqlite-http-auth", async () => {
    try {
      return je = "", ot = "", console.log("[SQLite HTTP Server] Auth cleared"), {
        success: !0,
        message: "认证信息已清除"
      };
    } catch (e) {
      return console.error("Failed to clear auth:", e), {
        success: !1,
        message: e.message || "清除认证信息失败"
      };
    }
  }), j.handle("check-for-updates", async () => {
    if (Wn)
      return { available: !1, message: "开发环境不检查更新" };
    try {
      const e = await qe.checkForUpdates();
      return { available: !0, updateInfo: e == null ? void 0 : e.updateInfo };
    } catch (e) {
      return console.error("检查更新失败:", e), { available: !1, error: e.message };
    }
  }), j.handle("download-update", async () => {
    try {
      return await qe.downloadUpdate(), { success: !0 };
    } catch (e) {
      return console.error("下载更新失败:", e), { success: !1, error: e.message };
    }
  }), j.handle("install-update", async () => {
    qe.quitAndInstall();
  }), j.handle("add-favorite-stock", async (e, t) => {
    try {
      return console.log(`[IPC] add-favorite-stock: tsCode=${t}`), { success: Qu(t) };
    } catch (n) {
      return console.error("Failed to add favorite stock:", n), { success: !1, message: n.message };
    }
  }), j.handle("remove-favorite-stock", async (e, t) => {
    try {
      return console.log(`[IPC] remove-favorite-stock: tsCode=${t}`), { success: Zu(t) };
    } catch (n) {
      return console.error("Failed to remove favorite stock:", n), { success: !1, message: n.message };
    }
  }), j.handle("is-favorite-stock", async (e, t) => {
    try {
      return ed(t);
    } catch (n) {
      return console.error("Failed to check favorite stock:", n), !1;
    }
  }), j.handle("get-all-favorite-stocks", async () => {
    try {
      return ms();
    } catch (e) {
      return console.error("Failed to get favorite stocks:", e), [];
    }
  }), j.handle("count-favorite-stocks", async () => {
    try {
      return gs();
    } catch (e) {
      return console.error("Failed to count favorite stocks:", e), 0;
    }
  }), j.handle(
    "get-favorite-stocks-announcements-grouped",
    async (e, t, n, r, i) => {
      try {
        console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${t}, pageSize=${n}, dateRange=${r}-${i}`);
        const o = await dT(t, n, r, i);
        return console.log(`[IPC] get-favorite-stocks-announcements-grouped: page=${t}, items=${o.items.length}, total=${o.total}`), {
          items: o.items,
          total: o.total,
          page: t,
          pageSize: n
        };
      } catch (o) {
        throw console.error("Failed to get favorite stocks announcements:", o), o;
      }
    }
  ), j.handle("get-news", async (e, t, n, r) => {
    try {
      return console.log(`[IPC] get-news: src=${t}, startDate=${n}, endDate=${r}`), await Te.getNews(t, n, r);
    } catch (i) {
      throw console.error("Failed to get news:", i), i;
    }
  }), j.handle("get-top10-holders", async (e, t, n, r, i, o) => {
    try {
      return console.log(
        `[IPC] get-top10-holders: tsCode=${t}, period=${n}, annDate=${r}, startDate=${i}, endDate=${o}`
      ), await Te.getTop10Holders(t, n, r, i, o);
    } catch (s) {
      throw console.error("Failed to get top10 holders:", s), s;
    }
  }), j.handle("search-stocks", async (e, t, n = 50) => {
    try {
      return console.log(`[IPC] search-stocks: keyword=${t}, limit=${n}`), hs(t, n);
    } catch (r) {
      throw console.error("Failed to search stocks:", r), r;
    }
  }), j.handle("sync-all-top10-holders", async (e) => {
    var t, n;
    if (pt)
      return { status: "skipped", message: "同步正在进行中" };
    pt = !0, it = !1, console.log("[IPC] Starting sync all top10 holders...");
    try {
      const r = Ai(), i = r.length;
      if (i === 0)
        return { status: "failed", message: "没有股票数据，请先同步股票列表" };
      console.log(`[IPC] Total stocks to sync: ${i}`);
      let o = 0, s = 0, a = 0;
      for (let l = 0; l < r.length; l++) {
        for (; it && pt; )
          await new Promise((c) => setTimeout(c, 500));
        if (!pt)
          return console.log("[IPC] Sync stopped by user"), {
            status: "stopped",
            message: `同步已停止。成功：${o}，跳过：${s}，失败：${a}`,
            successCount: o,
            skipCount: s,
            failCount: a,
            totalStocks: i
          };
        const f = r[l];
        if ($o(f.ts_code)) {
          s++, console.log(`[${l + 1}/${i}] Skip ${f.ts_code} ${f.name} - already synced`), N == null || N.webContents.send("top10-holders-sync-progress", {
            current: l + 1,
            total: i,
            tsCode: f.ts_code,
            name: f.name,
            status: "skipped",
            successCount: o,
            skipCount: s,
            failCount: a
          });
          continue;
        }
        try {
          const c = await Te.getTop10Holders(f.ts_code);
          c && c.length > 0 ? (bo(c), o++, console.log(`[${l + 1}/${i}] Success ${f.ts_code} ${f.name} - ${c.length} holders`)) : (s++, console.log(`[${l + 1}/${i}] Skip ${f.ts_code} ${f.name} - no data`)), N == null || N.webContents.send("top10-holders-sync-progress", {
            current: l + 1,
            total: i,
            tsCode: f.ts_code,
            name: f.name,
            status: "success",
            successCount: o,
            skipCount: s,
            failCount: a
          }), await new Promise((u) => setTimeout(u, 200));
        } catch (c) {
          a++, console.error(`[${l + 1}/${i}] Failed ${f.ts_code} ${f.name}:`, c.message), N == null || N.webContents.send("top10-holders-sync-progress", {
            current: l + 1,
            total: i,
            tsCode: f.ts_code,
            name: f.name,
            status: "failed",
            error: c.message,
            successCount: o,
            skipCount: s,
            failCount: a
          }), ((t = c.message) != null && t.includes("限流") || (n = c.message) != null && n.includes("频繁")) && (console.log("API 限流，等待 5 秒后继续..."), await new Promise((u) => setTimeout(u, 5e3)));
        }
      }
      return console.log(`[IPC] Sync completed: success=${o}, skip=${s}, fail=${a}`), {
        status: "success",
        message: `同步完成：成功 ${o}，跳过 ${s}，失败 ${a}`,
        successCount: o,
        skipCount: s,
        failCount: a,
        totalStocks: i
      };
    } catch (r) {
      return console.error("Failed to sync all top10 holders:", r), { status: "failed", message: r.message || "同步失败" };
    } finally {
      pt = !1, it = !1;
    }
  }), j.handle("toggle-pause-top10-holders-sync", async () => {
    if (!pt)
      return { status: "failed", message: "没有正在进行的同步任务" };
    it = !it;
    const e = it ? "paused" : "resumed", t = it ? "同步已暂停" : "同步已恢复";
    return console.log(`[IPC] Sync ${e}`), { status: e, message: t, isPaused: it };
  }), j.handle("stop-top10-holders-sync", async () => pt ? (pt = !1, it = !1, console.log("[IPC] Sync stopped by user"), { status: "success", message: "同步已停止" }) : { status: "failed", message: "没有正在进行的同步任务" }), j.handle("sync-stock-top10-holders", async (e, t) => {
    try {
      console.log(`[IPC] sync-stock-top10-holders: tsCode=${t}`), od(t);
      const n = await Te.getTop10Holders(t);
      return n && n.length > 0 ? (bo(n), console.log(`[IPC] Synced ${n.length} holders for ${t}`), {
        status: "success",
        message: `成功同步 ${n.length} 条股东数据`,
        count: n.length
      }) : {
        status: "success",
        message: "该股票暂无十大股东数据",
        count: 0
      };
    } catch (n) {
      return console.error("Failed to sync stock top10 holders:", n), {
        status: "failed",
        message: n.message || "同步失败"
      };
    }
  }), j.handle("get-top10-holders-from-db", async (e, t, n = 100) => {
    try {
      return console.log(`[IPC] get-top10-holders-from-db: tsCode=${t}, limit=${n}`), td(t, n);
    } catch (r) {
      throw console.error("Failed to get top10 holders from db:", r), r;
    }
  }), j.handle("has-top10-holders-data", async (e, t) => {
    try {
      return $o(t);
    } catch (n) {
      return console.error("Failed to check top10 holders data:", n), !1;
    }
  }), j.handle("get-top10-holders-sync-stats", async () => {
    try {
      const e = ar(), t = Es(), n = id();
      return {
        totalStocks: e,
        syncedStocks: t,
        syncedStockCodes: n,
        syncRate: e > 0 ? (t / e * 100).toFixed(2) : "0"
      };
    } catch (e) {
      throw console.error("Failed to get top10 holders sync stats:", e), e;
    }
  }), j.handle("get-top10-holders-end-dates", async (e, t) => {
    try {
      return console.log(`[IPC] get-top10-holders-end-dates: tsCode=${t}`), nd(t);
    } catch (n) {
      return console.error("Failed to get top10 holders end dates:", n), [];
    }
  }), j.handle("get-top10-holders-by-end-date", async (e, t, n) => {
    try {
      return console.log(`[IPC] get-top10-holders-by-end-date: tsCode=${t}, endDate=${n}`), rd(t, n);
    } catch (r) {
      return console.error("Failed to get top10 holders by end date:", r), [];
    }
  }), j.handle("get-stock-list-sync-info", async () => {
    try {
      return console.log("[IPC] get-stock-list-sync-info"), Zr();
    } catch (e) {
      throw console.error("Failed to get stock list sync info:", e), e;
    }
  }), j.handle("sync-all-stocks", async () => {
    try {
      return console.log("[IPC] sync-all-stocks"), await hd();
    } catch (e) {
      return console.error("Failed to sync all stocks:", e), {
        success: !1,
        stockCount: 0,
        message: e.message || "同步失败"
      };
    }
  }), j.handle("check-stock-list-sync-status", async () => {
    try {
      console.log("[IPC] check-stock-list-sync-status");
      const e = ps("stock_list"), t = Zr();
      return {
        isSyncedToday: e,
        stockCount: t.stockCount,
        lastSyncTime: t.lastSyncTime
      };
    } catch (e) {
      return console.error("Failed to check stock list sync status:", e), {
        isSyncedToday: !1,
        stockCount: 0,
        lastSyncTime: null
      };
    }
  }), j.handle("get-cache-data-stats", async () => {
    try {
      return console.log("[IPC] get-cache-data-stats"), fd();
    } catch (e) {
      return console.error("Failed to get cache data stats:", e), {
        stocks: { count: 0, lastSyncTime: null },
        favoriteStocks: { count: 0 },
        top10Holders: { stockCount: 0, recordCount: 0 },
        syncFlags: []
      };
    }
  }), j.handle(
    "get-announcements-with-cache",
    async (e, t, n, r, i) => {
      try {
        if (console.log(`[IPC] get-announcements-with-cache: tsCode=${t || "all"}, startDate=${n}, endDate=${r}`), Mr(t, n, r)) {
          console.log(`[IPC] 时间范围 ${n}-${r} 已缓存，从本地读取`);
          const a = Br(n, r, t || void 0);
          return {
            success: !0,
            data: a,
            source: "cache",
            count: a.length
          };
        }
        const o = Po(t, n, r);
        console.log(
          `[IPC] 需要同步 ${o.length} 个时间段:`,
          o.map((a) => `${a.start_date}-${a.end_date}`)
        );
        for (const a of o) {
          console.log(`[IPC] 开始同步时间段: ${a.start_date} - ${a.end_date}`);
          const l = await Te.getAnnouncementsIterative(
            t || void 0,
            a.start_date,
            a.end_date,
            i ? (f, c) => {
              N == null || N.webContents.send("announcement-sync-progress", {
                tsCode: t || "all",
                startDate: a.start_date,
                endDate: a.end_date,
                currentBatch: f,
                totalFetched: c
              });
            } : void 0
          );
          l.length > 0 && (sd(l), console.log(`[IPC] 已缓存 ${l.length} 条公告到本地数据库`)), ad(t, a.start_date, a.end_date);
        }
        const s = Br(n, r, t || void 0);
        return console.log(`[IPC] 返回 ${s.length} 条公告（来源：API + 缓存）`), {
          success: !0,
          data: s,
          source: "api",
          count: s.length
        };
      } catch (o) {
        return console.error("Failed to get announcements with cache:", o), {
          success: !1,
          error: o.message || "获取公告失败",
          data: [],
          source: "error",
          count: 0
        };
      }
    }
  ), j.handle("get-announcements-from-cache", async (e, t, n, r) => {
    try {
      console.log(`[IPC] get-announcements-from-cache: tsCode=${t || "all"}, startDate=${n}, endDate=${r}`);
      const i = Br(n, r, t || void 0), o = Mr(t, n, r);
      return {
        success: !0,
        data: i,
        isCached: o,
        count: i.length
      };
    } catch (i) {
      return console.error("Failed to get announcements from cache:", i), {
        success: !1,
        error: i.message || "读取缓存失败",
        data: [],
        isCached: !1,
        count: 0
      };
    }
  }), j.handle("check-announcement-range-synced", async (e, t, n, r) => {
    try {
      console.log(`[IPC] check-announcement-range-synced: tsCode=${t || "all"}, startDate=${n}, endDate=${r}`);
      const i = Mr(t, n, r), o = i ? [] : Po(t, n, r);
      return {
        success: !0,
        isSynced: i,
        unsyncedRanges: o
      };
    } catch (i) {
      return console.error("Failed to check announcement range:", i), {
        success: !1,
        error: i.message || "检查失败",
        isSynced: !1,
        unsyncedRanges: []
      };
    }
  }), j.handle("search-announcements-from-cache", async (e, t, n = 100) => {
    try {
      console.log(`[IPC] search-announcements-from-cache: keyword=${t}, limit=${n}`);
      const r = ld(t, n);
      return {
        success: !0,
        data: r,
        count: r.length
      };
    } catch (r) {
      return console.error("Failed to search announcements:", r), {
        success: !1,
        error: r.message || "搜索失败",
        data: [],
        count: 0
      };
    }
  }), j.handle("get-announcements-cache-stats", async () => {
    try {
      return console.log("[IPC] get-announcements-cache-stats"), {
        success: !0,
        totalCount: cd()
      };
    } catch (e) {
      return console.error("Failed to get announcements cache stats:", e), {
        success: !1,
        error: e.message || "获取统计失败",
        totalCount: 0
      };
    }
  });
}
function hT() {
  qe.on("checking-for-update", () => {
    console.log("正在检查更新..."), N == null || N.webContents.send("update-checking");
  }), qe.on("update-available", (e) => {
    console.log("发现新版本:", e.version), N == null || N.webContents.send("update-available", e), Le.isSupported() && new Le({
      title: "发现新版本",
      body: `版本 ${e.version} 可用，点击查看详情`
    }).show();
  }), qe.on("update-not-available", (e) => {
    console.log("当前已是最新版本"), N == null || N.webContents.send("update-not-available", e);
  }), qe.on("download-progress", (e) => {
    console.log(`下载进度: ${e.percent.toFixed(2)}%`), N == null || N.webContents.send("update-download-progress", e);
  }), qe.on("update-downloaded", (e) => {
    console.log("更新下载完成:", e.version), N == null || N.webContents.send("update-downloaded", e), Le.isSupported() && new Le({
      title: "更新已下载",
      body: "新版本已准备就绪，重启应用即可安装"
    }).show();
  }), qe.on("error", (e) => {
    console.error("更新错误:", e), N == null || N.webContents.send("update-error", e.message);
  });
}
const pT = Oe.requestSingleInstanceLock();
pT ? (Oe.on("second-instance", (e, t, n) => {
  console.log("检测到第二个实例尝试启动，聚焦到主窗口"), N && (N.isMinimized() && N.restore(), N.focus(), N.show());
}), Oe.whenReady().then(() => {
  Dl(), oT(), sT(), fT(), hT(), lT().catch((t) => console.error("Stock sync failed:", t)), aT().catch((t) => console.error("Auto sync failed:", t)), (async () => {
    try {
      ps("stock_list") ? console.log("Stock list already synced today") : (console.log("Today's stock list not synced yet, starting automatic sync..."), setTimeout(async () => {
        await hd();
      }, 3e3));
    } catch (t) {
      console.error("Daily sync check failed:", t);
    }
  })(), Wn || setTimeout(() => {
    qe.checkForUpdates();
  }, 3e3), Oe.on("activate", () => {
    Fl.getAllWindows().length === 0 ? Dl() : N == null || N.show();
  });
})) : (console.log("应用已经在运行，退出当前实例"), Oe.quit());
Oe.on("window-all-closed", () => {
  process.platform !== "darwin" && Oe.quit();
});
Oe.on("before-quit", () => {
  Ie && (Ie.close(), Ie = null, console.log("[SQLite HTTP Server] Closed on app quit")), ys.isQuitting = !0;
});
Oe.on("will-quit", () => {
  Ll.unregisterAll();
});
