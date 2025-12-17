import Rt, { app as se, session as Hd, BrowserWindow as jd, Notification as Ge, nativeImage as eo, Tray as qd, Menu as Gd, globalShortcut as rc, ipcMain as x, shell as Yd } from "electron";
import z from "path";
import vn, { fileURLToPath as ic, URL as Xd } from "url";
import ce from "fs";
import Vd from "constants";
import ur from "stream";
import ns from "util";
import oc from "assert";
import yi from "child_process";
import sc from "events";
import fr from "crypto";
import ac from "tty";
import Ei from "os";
import Wd from "string_decoder";
import lc from "zlib";
import zd, { createServer as Kd } from "http";
import Jd from "better-sqlite3";
var Ne = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function cc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var gt = Vd, Qd = process.cwd, Zr = null, Zd = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Zr || (Zr = Qd.call(process)), Zr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var ra = process.chdir;
  process.chdir = function(e) {
    Zr = null, ra.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, ra);
}
var eh = th;
function th(e) {
  gt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, u, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, u, h, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), Zd === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function u(h, g, E) {
      var _ = Date.now(), T = 0;
      c(h, g, function A(R) {
        if (R && (R.code === "EACCES" || R.code === "EPERM" || R.code === "EBUSY") && Date.now() - _ < 6e4) {
          setTimeout(function() {
            e.stat(g, function(P, k) {
              P && P.code === "ENOENT" ? c(h, g, A) : E(R);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        E && E(R);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function u(h, g, E, _, T, A) {
      var R;
      if (A && typeof A == "function") {
        var P = 0;
        R = function(k, Q, U) {
          if (k && k.code === "EAGAIN" && P < 10)
            return P++, c.call(e, h, g, E, _, T, R);
          A.apply(this, arguments);
        };
      }
      return c.call(e, h, g, E, _, T, R);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(u, c), u;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(u, h, g, E, _) {
      for (var T = 0; ; )
        try {
          return c.call(e, u, h, g, E, _);
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
    c.lchmod = function(u, h, g) {
      c.open(
        u,
        gt.O_WRONLY | gt.O_SYMLINK,
        h,
        function(E, _) {
          if (E) {
            g && g(E);
            return;
          }
          c.fchmod(_, h, function(T) {
            c.close(_, function(A) {
              g && g(T || A);
            });
          });
        }
      );
    }, c.lchmodSync = function(u, h) {
      var g = c.openSync(u, gt.O_WRONLY | gt.O_SYMLINK, h), E = !0, _;
      try {
        _ = c.fchmodSync(g, h), E = !1;
      } finally {
        if (E)
          try {
            c.closeSync(g);
          } catch {
          }
        else
          c.closeSync(g);
      }
      return _;
    };
  }
  function n(c) {
    gt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(u, h, g, E) {
      c.open(u, gt.O_SYMLINK, function(_, T) {
        if (_) {
          E && E(_);
          return;
        }
        c.futimes(T, h, g, function(A) {
          c.close(T, function(R) {
            E && E(A || R);
          });
        });
      });
    }, c.lutimesSync = function(u, h, g) {
      var E = c.openSync(u, gt.O_SYMLINK), _, T = !0;
      try {
        _ = c.futimesSync(E, h, g), T = !1;
      } finally {
        if (T)
          try {
            c.closeSync(E);
          } catch {
          }
        else
          c.closeSync(E);
      }
      return _;
    }) : c.futimes && (c.lutimes = function(u, h, g, E) {
      E && process.nextTick(E);
    }, c.lutimesSync = function() {
    });
  }
  function r(c) {
    return c && function(u, h, g) {
      return c.call(e, u, h, function(E) {
        d(E) && (E = null), g && g.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(u, h) {
      try {
        return c.call(e, u, h);
      } catch (g) {
        if (!d(g)) throw g;
      }
    };
  }
  function o(c) {
    return c && function(u, h, g, E) {
      return c.call(e, u, h, g, function(_) {
        d(_) && (_ = null), E && E.apply(this, arguments);
      });
    };
  }
  function s(c) {
    return c && function(u, h, g) {
      try {
        return c.call(e, u, h, g);
      } catch (E) {
        if (!d(E)) throw E;
      }
    };
  }
  function a(c) {
    return c && function(u, h, g) {
      typeof h == "function" && (g = h, h = null);
      function E(_, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), g && g.apply(this, arguments);
      }
      return h ? c.call(e, u, h, E) : c.call(e, u, E);
    };
  }
  function l(c) {
    return c && function(u, h) {
      var g = h ? c.call(e, u, h) : c.call(e, u);
      return g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)), g;
    };
  }
  function d(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var u = !process.getuid || process.getuid() !== 0;
    return !!(u && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var ia = ur.Stream, nh = rh;
function rh(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    ia.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var s = Object.keys(i), a = 0, l = s.length; a < l; a++) {
      var d = s[a];
      this[d] = i[d];
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
    ia.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var ih = sh, oh = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function sh(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: oh(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var oe = ce, ah = eh, lh = nh, ch = ih, Lr = ns, we, ii;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (we = Symbol.for("graceful-fs.queue"), ii = Symbol.for("graceful-fs.previous")) : (we = "___graceful-fs.queue", ii = "___graceful-fs.previous");
function uh() {
}
function uc(e, t) {
  Object.defineProperty(e, we, {
    get: function() {
      return t;
    }
  });
}
var Xt = uh;
Lr.debuglog ? Xt = Lr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Xt = function() {
  var e = Lr.format.apply(Lr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[we]) {
  var fh = Ne[we] || [];
  uc(oe, fh), oe.close = function(e) {
    function t(n, r) {
      return e.call(oe, n, function(i) {
        i || oa(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, ii, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(n) {
      e.apply(oe, arguments), oa();
    }
    return Object.defineProperty(t, ii, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Xt(oe[we]), oc.equal(oe[we].length, 0);
  });
}
Ne[we] || uc(Ne, oe[we]);
var Ie = rs(ch(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && (Ie = rs(oe), oe.__patched = !0);
function rs(e) {
  ah(e), e.gracefulify = rs, e.createReadStream = Q, e.createWriteStream = U;
  var t = e.readFile;
  e.readFile = n;
  function n(y, V, G) {
    return typeof V == "function" && (G = V, V = null), j(y, V, G);
    function j(Z, N, b, D) {
      return t(Z, N, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Zt([j, [Z, N, b], I, D || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(y, V, G, j) {
    return typeof G == "function" && (j = G, G = null), Z(y, V, G, j);
    function Z(N, b, D, I, F) {
      return r(N, b, D, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Zt([Z, [N, b, D, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = s);
  function s(y, V, G, j) {
    return typeof G == "function" && (j = G, G = null), Z(y, V, G, j);
    function Z(N, b, D, I, F) {
      return o(N, b, D, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Zt([Z, [N, b, D, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = l);
  function l(y, V, G, j) {
    return typeof G == "function" && (j = G, G = 0), Z(y, V, G, j);
    function Z(N, b, D, I, F) {
      return a(N, b, D, function($) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Zt([Z, [N, b, D, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var d = e.readdir;
  e.readdir = u;
  var c = /^v[0-5]\./;
  function u(y, V, G) {
    typeof V == "function" && (G = V, V = null);
    var j = c.test(process.version) ? function(b, D, I, F) {
      return d(b, Z(
        b,
        D,
        I,
        F
      ));
    } : function(b, D, I, F) {
      return d(b, D, Z(
        b,
        D,
        I,
        F
      ));
    };
    return j(y, V, G);
    function Z(N, b, D, I) {
      return function(F, $) {
        F && (F.code === "EMFILE" || F.code === "ENFILE") ? Zt([
          j,
          [N, b, D],
          F,
          I || Date.now(),
          Date.now()
        ]) : ($ && $.sort && $.sort(), typeof D == "function" && D.call(this, F, $));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = lh(e);
    A = h.ReadStream, P = h.WriteStream;
  }
  var g = e.ReadStream;
  g && (A.prototype = Object.create(g.prototype), A.prototype.open = R);
  var E = e.WriteStream;
  E && (P.prototype = Object.create(E.prototype), P.prototype.open = k), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return A;
    },
    set: function(y) {
      A = y;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return P;
    },
    set: function(y) {
      P = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var _ = A;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return _;
    },
    set: function(y) {
      _ = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var T = P;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return T;
    },
    set: function(y) {
      T = y;
    },
    enumerable: !0,
    configurable: !0
  });
  function A(y, V) {
    return this instanceof A ? (g.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
  }
  function R() {
    var y = this;
    Me(y.path, y.flags, y.mode, function(V, G) {
      V ? (y.autoClose && y.destroy(), y.emit("error", V)) : (y.fd = G, y.emit("open", G), y.read());
    });
  }
  function P(y, V) {
    return this instanceof P ? (E.apply(this, arguments), this) : P.apply(Object.create(P.prototype), arguments);
  }
  function k() {
    var y = this;
    Me(y.path, y.flags, y.mode, function(V, G) {
      V ? (y.destroy(), y.emit("error", V)) : (y.fd = G, y.emit("open", G));
    });
  }
  function Q(y, V) {
    return new e.ReadStream(y, V);
  }
  function U(y, V) {
    return new e.WriteStream(y, V);
  }
  var q = e.open;
  e.open = Me;
  function Me(y, V, G, j) {
    return typeof G == "function" && (j = G, G = null), Z(y, V, G, j);
    function Z(N, b, D, I, F) {
      return q(N, b, D, function($, H) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Zt([Z, [N, b, D, I], $, F || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  return e;
}
function Zt(e) {
  Xt("ENQUEUE", e[0].name, e[1]), oe[we].push(e), is();
}
var kr;
function oa() {
  for (var e = Date.now(), t = 0; t < oe[we].length; ++t)
    oe[we][t].length > 2 && (oe[we][t][3] = e, oe[we][t][4] = e);
  is();
}
function is() {
  if (clearTimeout(kr), kr = void 0, oe[we].length !== 0) {
    var e = oe[we].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Xt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Xt("TIMEOUT", t.name, n);
      var s = n.pop();
      typeof s == "function" && s.call(null, r);
    } else {
      var a = Date.now() - o, l = Math.max(o - i, 1), d = Math.min(l * 1.2, 100);
      a >= d ? (Xt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : oe[we].push(e);
    }
    kr === void 0 && (kr = setTimeout(is, 0));
  }
}
var gn;
try {
  gn = Ie;
} catch {
  gn = ce;
}
function dh(e, t, n) {
  n == null && (n = t, t = {}), typeof t == "string" && (t = { encoding: t }), t = t || {};
  var r = t.fs || gn, i = !0;
  "throws" in t && (i = t.throws), r.readFile(e, t, function(o, s) {
    if (o) return n(o);
    s = dc(s);
    var a;
    try {
      a = JSON.parse(s, t ? t.reviver : null);
    } catch (l) {
      return i ? (l.message = e + ": " + l.message, n(l)) : n(null, null);
    }
    n(null, a);
  });
}
function hh(e, t) {
  t = t || {}, typeof t == "string" && (t = { encoding: t });
  var n = t.fs || gn, r = !0;
  "throws" in t && (r = t.throws);
  try {
    var i = n.readFileSync(e, t);
    return i = dc(i), JSON.parse(i, t.reviver);
  } catch (o) {
    if (r)
      throw o.message = e + ": " + o.message, o;
    return null;
  }
}
function fc(e, t) {
  var n, r = `
`;
  typeof t == "object" && t !== null && (t.spaces && (n = t.spaces), t.EOL && (r = t.EOL));
  var i = JSON.stringify(e, t ? t.replacer : null, n);
  return i.replace(/\n/g, r) + r;
}
function ph(e, t, n, r) {
  r == null && (r = n, n = {}), n = n || {};
  var i = n.fs || gn, o = "";
  try {
    o = fc(t, n);
  } catch (s) {
    r && r(s, null);
    return;
  }
  i.writeFile(e, o, n, r);
}
function gh(e, t, n) {
  n = n || {};
  var r = n.fs || gn, i = fc(t, n);
  return r.writeFileSync(e, i, n);
}
function dc(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e = e.replace(/^\uFEFF/, ""), e;
}
var mh = {
  readFile: dh,
  readFileSync: hh,
  writeFile: ph,
  writeFileSync: gh
}, yh = mh, qn = z, hc = ce, pc = parseInt("0777", 8), Eh = dn.mkdirp = dn.mkdirP = dn;
function dn(e, t, n, r) {
  typeof t == "function" ? (n = t, t = {}) : (!t || typeof t != "object") && (t = { mode: t });
  var i = t.mode, o = t.fs || hc;
  i === void 0 && (i = pc), r || (r = null);
  var s = n || /* istanbul ignore next */
  function() {
  };
  e = qn.resolve(e), o.mkdir(e, i, function(a) {
    if (!a)
      return r = r || e, s(null, r);
    switch (a.code) {
      case "ENOENT":
        if (qn.dirname(e) === e) return s(a);
        dn(qn.dirname(e), t, function(l, d) {
          l ? s(l, d) : dn(e, t, s, d);
        });
        break;
      default:
        o.stat(e, function(l, d) {
          l || !d.isDirectory() ? s(a, r) : s(null, r);
        });
        break;
    }
  });
}
dn.sync = function e(t, n, r) {
  (!n || typeof n != "object") && (n = { mode: n });
  var i = n.mode, o = n.fs || hc;
  i === void 0 && (i = pc), r || (r = null), t = qn.resolve(t);
  try {
    o.mkdirSync(t, i), r = r || t;
  } catch (a) {
    switch (a.code) {
      case "ENOENT":
        r = e(qn.dirname(t), n, r), e(t, n, r);
        break;
      default:
        var s;
        try {
          s = o.statSync(t);
        } catch {
          throw a;
        }
        if (!s.isDirectory()) throw a;
        break;
    }
  }
  return r;
};
const sa = z, xr = Rt, aa = yh, _h = Eh;
var vh = function(e) {
  const t = xr.app || xr.remote.app, n = xr.screen || xr.remote.screen;
  let r, i, o;
  const s = 100, a = Object.assign({
    file: "window-state.json",
    path: t.getPath("userData"),
    maximize: !0,
    fullScreen: !0
  }, e), l = sa.join(a.path, a.file);
  function d(U) {
    return !U.isMaximized() && !U.isMinimized() && !U.isFullScreen();
  }
  function c() {
    return r && Number.isInteger(r.x) && Number.isInteger(r.y) && Number.isInteger(r.width) && r.width > 0 && Number.isInteger(r.height) && r.height > 0;
  }
  function u() {
    const U = n.getPrimaryDisplay().bounds;
    r = {
      width: a.defaultWidth || 800,
      height: a.defaultHeight || 600,
      x: 0,
      y: 0,
      displayBounds: U
    };
  }
  function h(U) {
    return r.x >= U.x && r.y >= U.y && r.x + r.width <= U.x + U.width && r.y + r.height <= U.y + U.height;
  }
  function g() {
    if (!n.getAllDisplays().some((q) => h(q.bounds)))
      return u();
  }
  function E() {
    if (!(r && (c() || r.isMaximized || r.isFullScreen))) {
      r = null;
      return;
    }
    c() && r.displayBounds && g();
  }
  function _(U) {
    if (U = U || i, !!U)
      try {
        const q = U.getBounds();
        d(U) && (r.x = q.x, r.y = q.y, r.width = q.width, r.height = q.height), r.isMaximized = U.isMaximized(), r.isFullScreen = U.isFullScreen(), r.displayBounds = n.getDisplayMatching(q).bounds;
      } catch {
      }
  }
  function T(U) {
    U && _(U);
    try {
      _h.sync(sa.dirname(l)), aa.writeFileSync(l, r);
    } catch {
    }
  }
  function A() {
    clearTimeout(o), o = setTimeout(_, s);
  }
  function R() {
    _();
  }
  function P() {
    Q(), T();
  }
  function k(U) {
    a.maximize && r.isMaximized && U.maximize(), a.fullScreen && r.isFullScreen && U.setFullScreen(!0), U.on("resize", A), U.on("move", A), U.on("close", R), U.on("closed", P), i = U;
  }
  function Q() {
    i && (i.removeListener("resize", A), i.removeListener("move", A), clearTimeout(o), i.removeListener("close", R), i.removeListener("closed", P), i = null);
  }
  try {
    r = aa.readFileSync(l);
  } catch {
  }
  return E(), r = Object.assign({
    width: a.defaultWidth || 800,
    height: a.defaultHeight || 600
  }, r), {
    get x() {
      return r.x;
    },
    get y() {
      return r.y;
    },
    get width() {
      return r.width;
    },
    get height() {
      return r.height;
    },
    get displayBounds() {
      return r.displayBounds;
    },
    get isMaximized() {
      return r.isMaximized;
    },
    get isFullScreen() {
      return r.isFullScreen;
    },
    saveState: T,
    unmanage: Q,
    manage: k,
    resetStateToDefault: u
  };
};
const wh = /* @__PURE__ */ cc(vh), Th = ic(import.meta.url), gc = z.dirname(Th), ko = process.env.NODE_ENV === "development" || !se.isPackaged, Sh = ko ? z.join(process.cwd(), "dist-electron/preload.cjs") : z.join(gc, "../../preload.cjs");
let ke = null;
function Ah() {
  ko || Hd.defaultSession.webRequest.onHeadersReceived((t, n) => {
    n({
      responseHeaders: {
        ...t.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.tushare.pro https://github.com;"
        ]
      }
    });
  });
  const e = wh({
    defaultWidth: 1280,
    defaultHeight: 800
  });
  return ke = new jd({
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    minWidth: 800,
    minHeight: 600,
    title: "酷咖啡",
    webPreferences: {
      preload: Sh,
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !1,
      webSecurity: !0,
      webviewTag: !0
      // 启用 webview 标签
    },
    show: !1,
    backgroundColor: "#ffffff"
  }), e.manage(ke), ke.webContents.on("console-message", (t, n, r, i, o) => {
    const a = {
      0: "LOG",
      1: "INFO",
      2: "WARN",
      3: "ERROR"
    }[n] || "UNKNOWN", l = o ? `[${o}]` : "", d = i ? `:${i}` : "";
    switch (n) {
      case 0:
        console.log(`[Renderer ${a}]${l}${d} ${r}`);
        break;
      case 1:
        console.info(`[Renderer ${a}]${l}${d} ${r}`);
        break;
      case 2:
        console.warn(`[Renderer ${a}]${l}${d} ${r}`);
        break;
      case 3:
        console.error(`[Renderer ${a}]${l}${d} ${r}`);
        break;
      default:
        console.log(`[Renderer ${a}]${l}${d} ${r}`);
    }
  }), ke.once("ready-to-show", () => {
    ke == null || ke.show(), Ge.isSupported() && new Ge({
      title: "酷咖啡",
      body: "应用已启动，准备好为您服务！"
    }).show();
  }), ko ? (ke.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173"), ke.webContents.openDevTools()) : ke.loadFile(z.join(gc, "../../dist/index.html")), ke.on("closed", () => {
    ke = null;
  }), ke;
}
function mc() {
  return ke;
}
const Rh = ic(import.meta.url), Ch = z.dirname(Rh), Ih = process.env.NODE_ENV === "development" || !se.isPackaged;
let Dn = null;
function bh(e, t) {
  const n = Ih ? z.join(Ch, "../../build/tray-icon.png") : z.join(process.resourcesPath, "build/tray-icon.png");
  let r;
  try {
    r = eo.createFromPath(n), r.isEmpty() && (r = eo.createEmpty());
  } catch (o) {
    console.error("创建托盘图标失败:", o), r = eo.createEmpty();
  }
  Dn = new qd(r), Dn.setToolTip("酷咖啡");
  const i = Gd.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        e == null || e.show();
      }
    },
    { type: "separator" },
    {
      label: "关于",
      click: () => {
        Ge.isSupported() && new Ge({
          title: "酷咖啡",
          body: `版本: ${se.getVersion()}
基于 Electron + React`
        }).show();
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        t.isQuitting = !0, se.quit();
      }
    }
  ]);
  return Dn.setContextMenu(i), Dn.on("click", () => {
    e != null && e.isVisible() ? e.hide() : e == null || e.show();
  }), Dn;
}
function Oh(e) {
  rc.register("CommandOrControl+Shift+S", () => {
    e != null && e.isVisible() ? e.hide() : e == null || e.show();
  });
}
var yc = {}, zt = {}, Pe = {};
Pe.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Pe.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
(function(e) {
  const t = Pe.fromCallback, n = Ie, r = [
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
  }, e.read = function(i, o, s, a, l, d) {
    return typeof d == "function" ? n.read(i, o, s, a, l, d) : new Promise((c, u) => {
      n.read(i, o, s, a, l, (h, g, E) => {
        if (h) return u(h);
        c({ bytesRead: g, buffer: E });
      });
    });
  }, e.write = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.write(i, o, ...s) : new Promise((a, l) => {
      n.write(i, o, ...s, (d, c, u) => {
        if (d) return l(d);
        a({ bytesWritten: c, buffer: u });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.writev(i, o, ...s) : new Promise((a, l) => {
      n.writev(i, o, ...s, (d, c, u) => {
        if (d) return l(d);
        a({ bytesWritten: c, buffers: u });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(zt);
var os = {}, Ec = {};
const Nh = z;
Ec.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Nh.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const _c = zt, { checkPath: vc } = Ec, wc = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
os.makeDir = async (e, t) => (vc(e), _c.mkdir(e, {
  mode: wc(t),
  recursive: !0
}));
os.makeDirSync = (e, t) => (vc(e), _c.mkdirSync(e, {
  mode: wc(t),
  recursive: !0
}));
const $h = Pe.fromPromise, { makeDir: Dh, makeDirSync: to } = os, no = $h(Dh);
var it = {
  mkdirs: no,
  mkdirsSync: to,
  // alias
  mkdirp: no,
  mkdirpSync: to,
  ensureDir: no,
  ensureDirSync: to
};
const Ph = Pe.fromPromise, Tc = zt;
function Fh(e) {
  return Tc.access(e).then(() => !0).catch(() => !1);
}
var Kt = {
  pathExists: Ph(Fh),
  pathExistsSync: Tc.existsSync
};
const hn = Ie;
function Lh(e, t, n, r) {
  hn.open(e, "r+", (i, o) => {
    if (i) return r(i);
    hn.futimes(o, t, n, (s) => {
      hn.close(o, (a) => {
        r && r(s || a);
      });
    });
  });
}
function kh(e, t, n) {
  const r = hn.openSync(e, "r+");
  return hn.futimesSync(r, t, n), hn.closeSync(r);
}
var Sc = {
  utimesMillis: Lh,
  utimesMillisSync: kh
};
const mn = zt, me = z, xh = ns;
function Uh(e, t, n) {
  const r = n.dereference ? (i) => mn.stat(i, { bigint: !0 }) : (i) => mn.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Mh(e, t, n) {
  let r;
  const i = n.dereference ? (s) => mn.statSync(s, { bigint: !0 }) : (s) => mn.lstatSync(s, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: o, destStat: null };
    throw s;
  }
  return { srcStat: o, destStat: r };
}
function Bh(e, t, n, r, i) {
  xh.callbackify(Uh)(e, t, r, (o, s) => {
    if (o) return i(o);
    const { srcStat: a, destStat: l } = s;
    if (l) {
      if (dr(a, l)) {
        const d = me.basename(e), c = me.basename(t);
        return n === "move" && d !== c && d.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: a, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && ss(e, t) ? i(new Error(_i(e, t, n))) : i(null, { srcStat: a, destStat: l });
  });
}
function Hh(e, t, n, r) {
  const { srcStat: i, destStat: o } = Mh(e, t, r);
  if (o) {
    if (dr(i, o)) {
      const s = me.basename(e), a = me.basename(t);
      if (n === "move" && s !== a && s.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && ss(e, t))
    throw new Error(_i(e, t, n));
  return { srcStat: i, destStat: o };
}
function Ac(e, t, n, r, i) {
  const o = me.resolve(me.dirname(e)), s = me.resolve(me.dirname(n));
  if (s === o || s === me.parse(s).root) return i();
  mn.stat(s, { bigint: !0 }, (a, l) => a ? a.code === "ENOENT" ? i() : i(a) : dr(t, l) ? i(new Error(_i(e, n, r))) : Ac(e, t, s, r, i));
}
function Rc(e, t, n, r) {
  const i = me.resolve(me.dirname(e)), o = me.resolve(me.dirname(n));
  if (o === i || o === me.parse(o).root) return;
  let s;
  try {
    s = mn.statSync(o, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (dr(t, s))
    throw new Error(_i(e, n, r));
  return Rc(e, t, o, r);
}
function dr(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function ss(e, t) {
  const n = me.resolve(e).split(me.sep).filter((i) => i), r = me.resolve(t).split(me.sep).filter((i) => i);
  return n.reduce((i, o, s) => i && r[s] === o, !0);
}
function _i(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var wn = {
  checkPaths: Bh,
  checkPathsSync: Hh,
  checkParentPaths: Ac,
  checkParentPathsSync: Rc,
  isSrcSubdir: ss,
  areIdentical: dr
};
const xe = Ie, Wn = z, jh = it.mkdirs, qh = Kt.pathExists, Gh = Sc.utimesMillis, zn = wn;
function Yh(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), zn.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: s, destStat: a } = o;
    zn.checkParentPaths(e, s, t, "copy", (l) => l ? r(l) : n.filter ? Cc(la, a, e, t, n, r) : la(a, e, t, n, r));
  });
}
function la(e, t, n, r, i) {
  const o = Wn.dirname(n);
  qh(o, (s, a) => {
    if (s) return i(s);
    if (a) return oi(e, t, n, r, i);
    jh(o, (l) => l ? i(l) : oi(e, t, n, r, i));
  });
}
function Cc(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((s) => s ? e(t, n, r, i, o) : o(), (s) => o(s));
}
function Xh(e, t, n, r, i) {
  return r.filter ? Cc(oi, e, t, n, r, i) : oi(e, t, n, r, i);
}
function oi(e, t, n, r, i) {
  (r.dereference ? xe.stat : xe.lstat)(t, (s, a) => s ? i(s) : a.isDirectory() ? Zh(a, e, t, n, r, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? Vh(a, e, t, n, r, i) : a.isSymbolicLink() ? np(e, t, n, r, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Vh(e, t, n, r, i, o) {
  return t ? Wh(e, n, r, i, o) : Ic(e, n, r, i, o);
}
function Wh(e, t, n, r, i) {
  if (r.overwrite)
    xe.unlink(n, (o) => o ? i(o) : Ic(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function Ic(e, t, n, r, i) {
  xe.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? zh(e.mode, t, n, i) : vi(n, e.mode, i));
}
function zh(e, t, n, r) {
  return Kh(e) ? Jh(n, e, (i) => i ? r(i) : ca(e, t, n, r)) : ca(e, t, n, r);
}
function Kh(e) {
  return (e & 128) === 0;
}
function Jh(e, t, n) {
  return vi(e, t | 128, n);
}
function ca(e, t, n, r) {
  Qh(t, n, (i) => i ? r(i) : vi(n, e, r));
}
function vi(e, t, n) {
  return xe.chmod(e, t, n);
}
function Qh(e, t, n) {
  xe.stat(e, (r, i) => r ? n(r) : Gh(t, i.atime, i.mtime, n));
}
function Zh(e, t, n, r, i, o) {
  return t ? bc(n, r, i, o) : ep(e.mode, n, r, i, o);
}
function ep(e, t, n, r, i) {
  xe.mkdir(n, (o) => {
    if (o) return i(o);
    bc(t, n, r, (s) => s ? i(s) : vi(n, e, i));
  });
}
function bc(e, t, n, r) {
  xe.readdir(e, (i, o) => i ? r(i) : Oc(o, e, t, n, r));
}
function Oc(e, t, n, r, i) {
  const o = e.pop();
  return o ? tp(e, o, t, n, r, i) : i();
}
function tp(e, t, n, r, i, o) {
  const s = Wn.join(n, t), a = Wn.join(r, t);
  zn.checkPaths(s, a, "copy", i, (l, d) => {
    if (l) return o(l);
    const { destStat: c } = d;
    Xh(c, s, a, i, (u) => u ? o(u) : Oc(e, n, r, i, o));
  });
}
function np(e, t, n, r, i) {
  xe.readlink(t, (o, s) => {
    if (o) return i(o);
    if (r.dereference && (s = Wn.resolve(process.cwd(), s)), e)
      xe.readlink(n, (a, l) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? xe.symlink(s, n, i) : i(a) : (r.dereference && (l = Wn.resolve(process.cwd(), l)), zn.isSrcSubdir(s, l) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && zn.isSrcSubdir(l, s) ? i(new Error(`Cannot overwrite '${l}' with '${s}'.`)) : rp(s, n, i)));
    else
      return xe.symlink(s, n, i);
  });
}
function rp(e, t, n) {
  xe.unlink(t, (r) => r ? n(r) : xe.symlink(e, t, n));
}
var ip = Yh;
const Re = Ie, Kn = z, op = it.mkdirsSync, sp = Sc.utimesMillisSync, Jn = wn;
function ap(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = Jn.checkPathsSync(e, t, "copy", n);
  return Jn.checkParentPathsSync(e, r, t, "copy"), lp(i, e, t, n);
}
function lp(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Kn.dirname(n);
  return Re.existsSync(i) || op(i), Nc(e, t, n, r);
}
function cp(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return Nc(e, t, n, r);
}
function Nc(e, t, n, r) {
  const o = (r.dereference ? Re.statSync : Re.lstatSync)(t);
  if (o.isDirectory()) return mp(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return up(o, e, t, n, r);
  if (o.isSymbolicLink()) return _p(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function up(e, t, n, r, i) {
  return t ? fp(e, n, r, i) : $c(e, n, r, i);
}
function fp(e, t, n, r) {
  if (r.overwrite)
    return Re.unlinkSync(n), $c(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function $c(e, t, n, r) {
  return Re.copyFileSync(t, n), r.preserveTimestamps && dp(e.mode, t, n), as(n, e.mode);
}
function dp(e, t, n) {
  return hp(e) && pp(n, e), gp(t, n);
}
function hp(e) {
  return (e & 128) === 0;
}
function pp(e, t) {
  return as(e, t | 128);
}
function as(e, t) {
  return Re.chmodSync(e, t);
}
function gp(e, t) {
  const n = Re.statSync(e);
  return sp(t, n.atime, n.mtime);
}
function mp(e, t, n, r, i) {
  return t ? Dc(n, r, i) : yp(e.mode, n, r, i);
}
function yp(e, t, n, r) {
  return Re.mkdirSync(n), Dc(t, n, r), as(n, e);
}
function Dc(e, t, n) {
  Re.readdirSync(e).forEach((r) => Ep(r, e, t, n));
}
function Ep(e, t, n, r) {
  const i = Kn.join(t, e), o = Kn.join(n, e), { destStat: s } = Jn.checkPathsSync(i, o, "copy", r);
  return cp(s, i, o, r);
}
function _p(e, t, n, r) {
  let i = Re.readlinkSync(t);
  if (r.dereference && (i = Kn.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Re.readlinkSync(n);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Re.symlinkSync(i, n);
      throw s;
    }
    if (r.dereference && (o = Kn.resolve(process.cwd(), o)), Jn.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Re.statSync(n).isDirectory() && Jn.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return vp(i, n);
  } else
    return Re.symlinkSync(i, n);
}
function vp(e, t) {
  return Re.unlinkSync(t), Re.symlinkSync(e, t);
}
var wp = ap;
const Tp = Pe.fromCallback;
var ls = {
  copy: Tp(ip),
  copySync: wp
};
const ua = Ie, Pc = z, te = oc, Qn = process.platform === "win32";
function Fc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || ua[n], n = n + "Sync", e[n] = e[n] || ua[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function cs(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te.strictEqual(typeof n, "function", "rimraf: callback function required"), te(t, "rimraf: invalid options argument provided"), te.strictEqual(typeof t, "object", "rimraf: options should be object"), Fc(t), fa(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const s = r * 100;
        return setTimeout(() => fa(e, t, i), s);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function fa(e, t, n) {
  te(e), te(t), te(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && Qn)
      return da(e, t, r, n);
    if (i && i.isDirectory())
      return ei(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return Qn ? da(e, t, o, n) : ei(e, t, o, n);
        if (o.code === "EISDIR")
          return ei(e, t, o, n);
      }
      return n(o);
    });
  });
}
function da(e, t, n, r) {
  te(e), te(t), te(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, s) => {
      o ? r(o.code === "ENOENT" ? null : n) : s.isDirectory() ? ei(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function ha(e, t, n) {
  let r;
  te(e), te(t);
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
  r.isDirectory() ? ti(e, t, n) : t.unlinkSync(e);
}
function ei(e, t, n, r) {
  te(e), te(t), te(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Sp(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function Sp(e, t, n) {
  te(e), te(t), te(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, s;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((a) => {
      cs(Pc.join(e, a), t, (l) => {
        if (!s) {
          if (l) return n(s = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function Lc(e, t) {
  let n;
  t = t || {}, Fc(t), te(e, "rimraf: missing path"), te.strictEqual(typeof e, "string", "rimraf: path should be a string"), te(t, "rimraf: missing options"), te.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && Qn && ha(e, t, r);
  }
  try {
    n && n.isDirectory() ? ti(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return Qn ? ha(e, t, r) : ti(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    ti(e, t, r);
  }
}
function ti(e, t, n) {
  te(e), te(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      Ap(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function Ap(e, t) {
  if (te(e), te(t), t.readdirSync(e).forEach((n) => Lc(Pc.join(e, n), t)), Qn) {
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
var Rp = cs;
cs.sync = Lc;
const si = Ie, Cp = Pe.fromCallback, kc = Rp;
function Ip(e, t) {
  if (si.rm) return si.rm(e, { recursive: !0, force: !0 }, t);
  kc(e, t);
}
function bp(e) {
  if (si.rmSync) return si.rmSync(e, { recursive: !0, force: !0 });
  kc.sync(e);
}
var wi = {
  remove: Cp(Ip),
  removeSync: bp
};
const Op = Pe.fromPromise, xc = zt, Uc = z, Mc = it, Bc = wi, pa = Op(async function(t) {
  let n;
  try {
    n = await xc.readdir(t);
  } catch {
    return Mc.mkdirs(t);
  }
  return Promise.all(n.map((r) => Bc.remove(Uc.join(t, r))));
});
function ga(e) {
  let t;
  try {
    t = xc.readdirSync(e);
  } catch {
    return Mc.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Uc.join(e, n), Bc.removeSync(n);
  });
}
var Np = {
  emptyDirSync: ga,
  emptydirSync: ga,
  emptyDir: pa,
  emptydir: pa
};
const $p = Pe.fromCallback, Hc = z, wt = Ie, jc = it;
function Dp(e, t) {
  function n() {
    wt.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  wt.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = Hc.dirname(e);
    wt.stat(o, (s, a) => {
      if (s)
        return s.code === "ENOENT" ? jc.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(s);
      a.isDirectory() ? n() : wt.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Pp(e) {
  let t;
  try {
    t = wt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = Hc.dirname(e);
  try {
    wt.statSync(n).isDirectory() || wt.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") jc.mkdirsSync(n);
    else throw r;
  }
  wt.writeFileSync(e, "");
}
var Fp = {
  createFile: $p(Dp),
  createFileSync: Pp
};
const Lp = Pe.fromCallback, qc = z, _t = Ie, Gc = it, kp = Kt.pathExists, { areIdentical: Yc } = wn;
function xp(e, t, n) {
  function r(i, o) {
    _t.link(i, o, (s) => {
      if (s) return n(s);
      n(null);
    });
  }
  _t.lstat(t, (i, o) => {
    _t.lstat(e, (s, a) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), n(s);
      if (o && Yc(a, o)) return n(null);
      const l = qc.dirname(t);
      kp(l, (d, c) => {
        if (d) return n(d);
        if (c) return r(e, t);
        Gc.mkdirs(l, (u) => {
          if (u) return n(u);
          r(e, t);
        });
      });
    });
  });
}
function Up(e, t) {
  let n;
  try {
    n = _t.lstatSync(t);
  } catch {
  }
  try {
    const o = _t.lstatSync(e);
    if (n && Yc(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = qc.dirname(t);
  return _t.existsSync(r) || Gc.mkdirsSync(r), _t.linkSync(e, t);
}
var Mp = {
  createLink: Lp(xp),
  createLinkSync: Up
};
const Tt = z, Gn = Ie, Bp = Kt.pathExists;
function Hp(e, t, n) {
  if (Tt.isAbsolute(e))
    return Gn.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = Tt.dirname(t), i = Tt.join(r, e);
    return Bp(i, (o, s) => o ? n(o) : s ? n(null, {
      toCwd: i,
      toDst: e
    }) : Gn.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), n(a)) : n(null, {
      toCwd: e,
      toDst: Tt.relative(r, e)
    })));
  }
}
function jp(e, t) {
  let n;
  if (Tt.isAbsolute(e)) {
    if (n = Gn.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = Tt.dirname(t), i = Tt.join(r, e);
    if (n = Gn.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = Gn.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Tt.relative(r, e)
    };
  }
}
var qp = {
  symlinkPaths: Hp,
  symlinkPathsSync: jp
};
const Xc = Ie;
function Gp(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  Xc.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function Yp(e, t) {
  let n;
  if (t) return t;
  try {
    n = Xc.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var Xp = {
  symlinkType: Gp,
  symlinkTypeSync: Yp
};
const Vp = Pe.fromCallback, Vc = z, We = zt, Wc = it, Wp = Wc.mkdirs, zp = Wc.mkdirsSync, zc = qp, Kp = zc.symlinkPaths, Jp = zc.symlinkPathsSync, Kc = Xp, Qp = Kc.symlinkType, Zp = Kc.symlinkTypeSync, eg = Kt.pathExists, { areIdentical: Jc } = wn;
function tg(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, We.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      We.stat(e),
      We.stat(t)
    ]).then(([s, a]) => {
      if (Jc(s, a)) return r(null);
      ma(e, t, n, r);
    }) : ma(e, t, n, r);
  });
}
function ma(e, t, n, r) {
  Kp(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, Qp(o.toCwd, n, (s, a) => {
      if (s) return r(s);
      const l = Vc.dirname(t);
      eg(l, (d, c) => {
        if (d) return r(d);
        if (c) return We.symlink(e, t, a, r);
        Wp(l, (u) => {
          if (u) return r(u);
          We.symlink(e, t, a, r);
        });
      });
    });
  });
}
function ng(e, t, n) {
  let r;
  try {
    r = We.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const a = We.statSync(e), l = We.statSync(t);
    if (Jc(a, l)) return;
  }
  const i = Jp(e, t);
  e = i.toDst, n = Zp(i.toCwd, n);
  const o = Vc.dirname(t);
  return We.existsSync(o) || zp(o), We.symlinkSync(e, t, n);
}
var rg = {
  createSymlink: Vp(tg),
  createSymlinkSync: ng
};
const { createFile: ya, createFileSync: Ea } = Fp, { createLink: _a, createLinkSync: va } = Mp, { createSymlink: wa, createSymlinkSync: Ta } = rg;
var ig = {
  // file
  createFile: ya,
  createFileSync: Ea,
  ensureFile: ya,
  ensureFileSync: Ea,
  // link
  createLink: _a,
  createLinkSync: va,
  ensureLink: _a,
  ensureLinkSync: va,
  // symlink
  createSymlink: wa,
  createSymlinkSync: Ta,
  ensureSymlink: wa,
  ensureSymlinkSync: Ta
};
function og(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function sg(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var us = { stringify: og, stripBom: sg };
let yn;
try {
  yn = Ie;
} catch {
  yn = ce;
}
const Ti = Pe, { stringify: Qc, stripBom: Zc } = us;
async function ag(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || yn, r = "throws" in t ? t.throws : !0;
  let i = await Ti.fromCallback(n.readFile)(e, t);
  i = Zc(i);
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
const lg = Ti.fromPromise(ag);
function cg(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || yn, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Zc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function ug(e, t, n = {}) {
  const r = n.fs || yn, i = Qc(t, n);
  await Ti.fromCallback(r.writeFile)(e, i, n);
}
const fg = Ti.fromPromise(ug);
function dg(e, t, n = {}) {
  const r = n.fs || yn, i = Qc(t, n);
  return r.writeFileSync(e, i, n);
}
var hg = {
  readFile: lg,
  readFileSync: cg,
  writeFile: fg,
  writeFileSync: dg
};
const Ur = hg;
var pg = {
  // jsonfile exports
  readJson: Ur.readFile,
  readJsonSync: Ur.readFileSync,
  writeJson: Ur.writeFile,
  writeJsonSync: Ur.writeFileSync
};
const gg = Pe.fromCallback, Yn = Ie, eu = z, tu = it, mg = Kt.pathExists;
function yg(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = eu.dirname(e);
  mg(i, (o, s) => {
    if (o) return r(o);
    if (s) return Yn.writeFile(e, t, n, r);
    tu.mkdirs(i, (a) => {
      if (a) return r(a);
      Yn.writeFile(e, t, n, r);
    });
  });
}
function Eg(e, ...t) {
  const n = eu.dirname(e);
  if (Yn.existsSync(n))
    return Yn.writeFileSync(e, ...t);
  tu.mkdirsSync(n), Yn.writeFileSync(e, ...t);
}
var fs = {
  outputFile: gg(yg),
  outputFileSync: Eg
};
const { stringify: _g } = us, { outputFile: vg } = fs;
async function wg(e, t, n = {}) {
  const r = _g(t, n);
  await vg(e, r, n);
}
var Tg = wg;
const { stringify: Sg } = us, { outputFileSync: Ag } = fs;
function Rg(e, t, n) {
  const r = Sg(t, n);
  Ag(e, r, n);
}
var Cg = Rg;
const Ig = Pe.fromPromise, De = pg;
De.outputJson = Ig(Tg);
De.outputJsonSync = Cg;
De.outputJSON = De.outputJson;
De.outputJSONSync = De.outputJsonSync;
De.writeJSON = De.writeJson;
De.writeJSONSync = De.writeJsonSync;
De.readJSON = De.readJson;
De.readJSONSync = De.readJsonSync;
var bg = De;
const Og = Ie, xo = z, Ng = ls.copy, nu = wi.remove, $g = it.mkdirp, Dg = Kt.pathExists, Sa = wn;
function Pg(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  Sa.checkPaths(e, t, "move", n, (o, s) => {
    if (o) return r(o);
    const { srcStat: a, isChangingCase: l = !1 } = s;
    Sa.checkParentPaths(e, a, t, "move", (d) => {
      if (d) return r(d);
      if (Fg(t)) return Aa(e, t, i, l, r);
      $g(xo.dirname(t), (c) => c ? r(c) : Aa(e, t, i, l, r));
    });
  });
}
function Fg(e) {
  const t = xo.dirname(e);
  return xo.parse(t).root === t;
}
function Aa(e, t, n, r, i) {
  if (r) return ro(e, t, n, i);
  if (n)
    return nu(t, (o) => o ? i(o) : ro(e, t, n, i));
  Dg(t, (o, s) => o ? i(o) : s ? i(new Error("dest already exists.")) : ro(e, t, n, i));
}
function ro(e, t, n, r) {
  Og.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : Lg(e, t, n, r) : r());
}
function Lg(e, t, n, r) {
  Ng(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : nu(e, r));
}
var kg = Pg;
const ru = Ie, Uo = z, xg = ls.copySync, iu = wi.removeSync, Ug = it.mkdirpSync, Ra = wn;
function Mg(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = Ra.checkPathsSync(e, t, "move", n);
  return Ra.checkParentPathsSync(e, i, t, "move"), Bg(t) || Ug(Uo.dirname(t)), Hg(e, t, r, o);
}
function Bg(e) {
  const t = Uo.dirname(e);
  return Uo.parse(t).root === t;
}
function Hg(e, t, n, r) {
  if (r) return io(e, t, n);
  if (n)
    return iu(t), io(e, t, n);
  if (ru.existsSync(t)) throw new Error("dest already exists.");
  return io(e, t, n);
}
function io(e, t, n) {
  try {
    ru.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return jg(e, t, n);
  }
}
function jg(e, t, n) {
  return xg(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), iu(e);
}
var qg = Mg;
const Gg = Pe.fromCallback;
var Yg = {
  move: Gg(kg),
  moveSync: qg
}, $t = {
  // Export promiseified graceful-fs:
  ...zt,
  // Export extra methods:
  ...ls,
  ...Np,
  ...ig,
  ...bg,
  ...it,
  ...Yg,
  ...fs,
  ...Kt,
  ...wi
}, ut = {}, Ct = {}, Ee = {}, It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
It.CancellationError = It.CancellationToken = void 0;
const Xg = sc;
class Vg extends Xg.EventEmitter {
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
      return Promise.reject(new Mo());
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
          o(new Mo());
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
It.CancellationToken = Vg;
class Mo extends Error {
  constructor() {
    super("cancelled");
  }
}
It.CancellationError = Mo;
var Tn = {};
Object.defineProperty(Tn, "__esModule", { value: !0 });
Tn.newError = Wg;
function Wg(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var $e = {}, Bo = { exports: {} }, Mr = { exports: {} }, oo, Ca;
function zg() {
  if (Ca) return oo;
  Ca = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  oo = function(c, u) {
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
        var h = parseFloat(u[1]), g = (u[2] || "ms").toLowerCase();
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
  function a(c) {
    var u = Math.abs(c);
    return u >= r ? Math.round(c / r) + "d" : u >= n ? Math.round(c / n) + "h" : u >= t ? Math.round(c / t) + "m" : u >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var u = Math.abs(c);
    return u >= r ? d(c, u, r, "day") : u >= n ? d(c, u, n, "hour") : u >= t ? d(c, u, t, "minute") : u >= e ? d(c, u, e, "second") : c + " ms";
  }
  function d(c, u, h, g) {
    var E = u >= h * 1.5;
    return Math.round(c / h) + " " + g + (E ? "s" : "");
  }
  return oo;
}
var so, Ia;
function ou() {
  if (Ia) return so;
  Ia = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = d, r.disable = a, r.enable = o, r.enabled = l, r.humanize = zg(), r.destroy = c, Object.keys(t).forEach((u) => {
      r[u] = t[u];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(u) {
      let h = 0;
      for (let g = 0; g < u.length; g++)
        h = (h << 5) - h + u.charCodeAt(g), h |= 0;
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = n;
    function r(u) {
      let h, g = null, E, _;
      function T(...A) {
        if (!T.enabled)
          return;
        const R = T, P = Number(/* @__PURE__ */ new Date()), k = P - (h || P);
        R.diff = k, R.prev = h, R.curr = P, h = P, A[0] = r.coerce(A[0]), typeof A[0] != "string" && A.unshift("%O");
        let Q = 0;
        A[0] = A[0].replace(/%([a-zA-Z%])/g, (q, Me) => {
          if (q === "%%")
            return "%";
          Q++;
          const y = r.formatters[Me];
          if (typeof y == "function") {
            const V = A[Q];
            q = y.call(R, V), A.splice(Q, 1), Q--;
          }
          return q;
        }), r.formatArgs.call(R, A), (R.log || r.log).apply(R, A);
      }
      return T.namespace = u, T.useColors = r.useColors(), T.color = r.selectColor(u), T.extend = i, T.destroy = r.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (E !== r.namespaces && (E = r.namespaces, _ = r.enabled(u)), _),
        set: (A) => {
          g = A;
        }
      }), typeof r.init == "function" && r.init(T), T;
    }
    function i(u, h) {
      const g = r(this.namespace + (typeof h > "u" ? ":" : h) + u);
      return g.log = this.log, g;
    }
    function o(u) {
      r.save(u), r.namespaces = u, r.names = [], r.skips = [];
      const h = (typeof u == "string" ? u : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const g of h)
        g[0] === "-" ? r.skips.push(g.slice(1)) : r.names.push(g);
    }
    function s(u, h) {
      let g = 0, E = 0, _ = -1, T = 0;
      for (; g < u.length; )
        if (E < h.length && (h[E] === u[g] || h[E] === "*"))
          h[E] === "*" ? (_ = E, T = g, E++) : (g++, E++);
        else if (_ !== -1)
          E = _ + 1, T++, g = T;
        else
          return !1;
      for (; E < h.length && h[E] === "*"; )
        E++;
      return E === h.length;
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
    function d(u) {
      return u instanceof Error ? u.stack || u.message : u;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return so = e, so;
}
var ba;
function Kg() {
  return ba || (ba = 1, function(e, t) {
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
      const d = "color: " + this.color;
      l.splice(1, 0, d, "color: inherit");
      let c = 0, u = 0;
      l[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (c++, h === "%c" && (u = c));
      }), l.splice(u, 0, d);
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
    e.exports = ou()(t);
    const { formatters: a } = e.exports;
    a.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (d) {
        return "[UnexpectedJSONParseError]: " + d.message;
      }
    };
  }(Mr, Mr.exports)), Mr.exports;
}
var Br = { exports: {} }, ao, Oa;
function Jg() {
  return Oa || (Oa = 1, ao = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), ao;
}
var lo, Na;
function Qg() {
  if (Na) return lo;
  Na = 1;
  const e = Ei, t = ac, n = Jg(), { env: r } = process;
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
  function s(l, d) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (l && !d && i === void 0)
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
    const d = s(l, l && l.isTTY);
    return o(d);
  }
  return lo = {
    supportsColor: a,
    stdout: o(s(!0, t.isatty(1))),
    stderr: o(s(!0, t.isatty(2)))
  }, lo;
}
var $a;
function Zg() {
  return $a || ($a = 1, function(e, t) {
    const n = ac, r = ns;
    t.init = c, t.log = a, t.formatArgs = o, t.save = l, t.load = d, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = Qg();
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
      const E = g.substring(6).toLowerCase().replace(/_([a-z])/g, (T, A) => A.toUpperCase());
      let _ = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(_) ? _ = !0 : /^(no|off|false|disabled)$/i.test(_) ? _ = !1 : _ === "null" ? _ = null : _ = Number(_), h[E] = _, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: g, useColors: E } = this;
      if (E) {
        const _ = this.color, T = "\x1B[3" + (_ < 8 ? _ : "8;5;" + _), A = `  ${T};1m${g} \x1B[0m`;
        h[0] = A + h[0].split(`
`).join(`
` + A), h.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = s() + g + " " + h[0];
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
    function d() {
      return process.env.DEBUG;
    }
    function c(h) {
      h.inspectOpts = {};
      const g = Object.keys(t.inspectOpts);
      for (let E = 0; E < g.length; E++)
        h.inspectOpts[g[E]] = t.inspectOpts[g[E]];
    }
    e.exports = ou()(t);
    const { formatters: u } = e.exports;
    u.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, u.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(Br, Br.exports)), Br.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Bo.exports = Kg() : Bo.exports = Zg();
var em = Bo.exports, hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.ProgressCallbackTransform = void 0;
const tm = ur;
class nm extends tm.Transform {
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
hr.ProgressCallbackTransform = nm;
Object.defineProperty($e, "__esModule", { value: !0 });
$e.DigestTransform = $e.HttpExecutor = $e.HttpError = void 0;
$e.createHttpError = Ho;
$e.parseJson = um;
$e.configureRequestOptionsFromUrl = au;
$e.configureRequestUrl = hs;
$e.safeGetHeader = pn;
$e.configureRequestOptions = li;
$e.safeStringifyJson = ci;
const rm = fr, im = em, om = ce, sm = ur, su = vn, am = It, Da = Tn, lm = hr, Pn = (0, im.default)("electron-builder");
function Ho(e, t = null) {
  return new ds(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + ci(e.headers), t);
}
const cm = /* @__PURE__ */ new Map([
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
class ds extends Error {
  constructor(t, n = `HTTP error: ${cm.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
$e.HttpError = ds;
function um(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class ai {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new am.CancellationToken(), r) {
    li(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      Pn(i);
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
    return Pn.enabled && Pn(`Request: ${ci(t)}`), n.createPromise((o, s, a) => {
      const l = this.createRequest(t, (d) => {
        try {
          this.handleResponse(d, t, n, o, s, i, r);
        } catch (c) {
          s(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, s, t.timeout), this.addRedirectHandlers(l, t, s, i, (d) => {
        this.doApiRequest(d, n, r, i).then(o).catch(s);
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
    if (Pn.enabled && Pn(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${ci(n)}`), t.statusCode === 404) {
      o(Ho(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const d = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = d >= 300 && d < 400, u = pn(t, "location");
    if (c && u != null) {
      if (s > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(ai.prepareRedirectUrlOptions(u, n), r, a, s).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (g) => h += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = pn(t, "content-type"), E = g != null && (Array.isArray(g) ? g.find((_) => _.includes("json")) != null : g.includes("json"));
          o(Ho(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${E ? JSON.stringify(JSON.parse(h)) : h}
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
      const s = [], a = {
        headers: n.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      hs(t, a), li(a), this.doDownload(a, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (l) => {
          l == null ? r(Buffer.concat(s)) : i(l);
        },
        responseHandler: (l, d) => {
          let c = 0;
          l.on("data", (u) => {
            if (c += u.length, c > 524288e3) {
              d(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            s.push(u);
          }), l.on("end", () => {
            d(null);
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
      const s = pn(o, "location");
      if (s != null) {
        r < this.maxRedirects ? this.doDownload(ai.prepareRedirectUrlOptions(s, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? dm(n, o) : n.responseHandler(o, n.callback);
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
    const r = au(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = new su.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return r;
  }
  static retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return t();
      } catch (i) {
        if (r < n && (i instanceof ds && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
$e.HttpExecutor = ai;
function au(e, t) {
  const n = li(t);
  return hs(new su.URL(e), n), n;
}
function hs(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class jo extends sm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, rm.createHash)(n);
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
      throw (0, Da.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Da.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
$e.DigestTransform = jo;
function fm(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function pn(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function dm(e, t) {
  if (!fm(pn(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const s = pn(t, "content-length");
    s != null && n.push(new lm.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new jo(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new jo(e.options.sha2, "sha256", "hex"));
  const i = (0, om.createWriteStream)(e.destination);
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
function li(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function ci(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.MemoLazy = void 0;
class hm {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && lu(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
Si.MemoLazy = hm;
function lu(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((s) => lu(e[s], t[s]));
  }
  return e === t;
}
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.githubUrl = pm;
Ai.getS3LikeProviderBaseUrl = gm;
function pm(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function gm(e) {
  const t = e.provider;
  if (t === "s3")
    return mm(e);
  if (t === "spaces")
    return ym(e);
  throw new Error(`Not supported provider: ${t}`);
}
function mm(e) {
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
  return cu(t, e.path);
}
function cu(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function ym(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return cu(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var ps = {};
Object.defineProperty(ps, "__esModule", { value: !0 });
ps.retry = uu;
const Em = It;
async function uu(e, t, n, r = 0, i = 0, o) {
  var s;
  const a = new Em.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((s = o == null ? void 0 : o(l)) !== null && s !== void 0) || s) && t > 0 && !a.cancelled)
      return await new Promise((d) => setTimeout(d, n + r * i)), await uu(e, t - 1, n, r, i + 1, o);
    throw l;
  }
}
var gs = {};
Object.defineProperty(gs, "__esModule", { value: !0 });
gs.parseDn = _m;
function _m(e) {
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
var En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
En.nil = En.UUID = void 0;
const fu = fr, du = Tn, vm = "options.name must be either a string or a Buffer", Pa = (0, fu.randomBytes)(16);
Pa[0] = Pa[0] | 1;
const ni = {}, K = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  ni[t] = e, K[e] = t;
}
class Wt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = Wt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return wm(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = Tm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (ni[t[14] + t[15]] & 240) >> 4,
        variant: Fa((ni[t[19] + t[20]] & 224) >> 5),
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
        variant: Fa((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, du.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = ni[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
En.UUID = Wt;
Wt.OID = Wt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Fa(e) {
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
var Xn;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Xn || (Xn = {}));
function wm(e, t, n, r, i = Xn.ASCII) {
  const o = (0, fu.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, du.newError)(vm, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const a = o.digest();
  let l;
  switch (i) {
    case Xn.BINARY:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, l = a;
      break;
    case Xn.OBJECT:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, l = new Wt(a);
      break;
    default:
      l = K[a[0]] + K[a[1]] + K[a[2]] + K[a[3]] + "-" + K[a[4]] + K[a[5]] + "-" + K[a[6] & 15 | n] + K[a[7]] + "-" + K[a[8] & 63 | 128] + K[a[9]] + "-" + K[a[10]] + K[a[11]] + K[a[12]] + K[a[13]] + K[a[14]] + K[a[15]];
      break;
  }
  return l;
}
function Tm(e) {
  return K[e[0]] + K[e[1]] + K[e[2]] + K[e[3]] + "-" + K[e[4]] + K[e[5]] + "-" + K[e[6]] + K[e[7]] + "-" + K[e[8]] + K[e[9]] + "-" + K[e[10]] + K[e[11]] + K[e[12]] + K[e[13]] + K[e[14]] + K[e[15]];
}
En.nil = new Wt("00000000-0000-0000-0000-000000000000");
var pr = {}, hu = {};
(function(e) {
  (function(t) {
    t.parser = function(p, f) {
      return new r(p, f);
    }, t.SAXParser = r, t.SAXStream = c, t.createStream = d, t.MAX_BUFFER_LENGTH = 64 * 1024;
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
    function r(p, f) {
      if (!(this instanceof r))
        return new r(p, f);
      var C = this;
      o(C), C.q = C.c = "", C.bufferCheckPosition = t.MAX_BUFFER_LENGTH, C.opt = f || {}, C.opt.lowercase = C.opt.lowercase || C.opt.lowercasetags, C.looseCase = C.opt.lowercase ? "toLowerCase" : "toUpperCase", C.tags = [], C.closed = C.closedRoot = C.sawRoot = !1, C.tag = C.error = null, C.strict = !!p, C.noscript = !!(p || C.opt.noscript), C.state = y.BEGIN, C.strictEntities = C.opt.strictEntities, C.ENTITIES = C.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), C.attribList = [], C.opt.xmlns && (C.ns = Object.create(_)), C.opt.unquotedAttributeValues === void 0 && (C.opt.unquotedAttributeValues = !p), C.trackPosition = C.opt.position !== !1, C.trackPosition && (C.position = C.line = C.column = 0), G(C, "onready");
    }
    Object.create || (Object.create = function(p) {
      function f() {
      }
      f.prototype = p;
      var C = new f();
      return C;
    }), Object.keys || (Object.keys = function(p) {
      var f = [];
      for (var C in p) p.hasOwnProperty(C) && f.push(C);
      return f;
    });
    function i(p) {
      for (var f = Math.max(t.MAX_BUFFER_LENGTH, 10), C = 0, w = 0, J = n.length; w < J; w++) {
        var ne = p[n[w]].length;
        if (ne > f)
          switch (n[w]) {
            case "textNode":
              Z(p);
              break;
            case "cdata":
              j(p, "oncdata", p.cdata), p.cdata = "";
              break;
            case "script":
              j(p, "onscript", p.script), p.script = "";
              break;
            default:
              b(p, "Max buffer length exceeded: " + n[w]);
          }
        C = Math.max(C, ne);
      }
      var ae = t.MAX_BUFFER_LENGTH - C;
      p.bufferCheckPosition = ae + p.position;
    }
    function o(p) {
      for (var f = 0, C = n.length; f < C; f++)
        p[n[f]] = "";
    }
    function s(p) {
      Z(p), p.cdata !== "" && (j(p, "oncdata", p.cdata), p.cdata = ""), p.script !== "" && (j(p, "onscript", p.script), p.script = "");
    }
    r.prototype = {
      end: function() {
        D(this);
      },
      write: Ze,
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
    function d(p, f) {
      return new c(p, f);
    }
    function c(p, f) {
      if (!(this instanceof c))
        return new c(p, f);
      a.apply(this), this._parser = new r(p, f), this.writable = !0, this.readable = !0;
      var C = this;
      this._parser.onend = function() {
        C.emit("end");
      }, this._parser.onerror = function(w) {
        C.emit("error", w), C._parser.error = null;
      }, this._decoder = null, l.forEach(function(w) {
        Object.defineProperty(C, "on" + w, {
          get: function() {
            return C._parser["on" + w];
          },
          set: function(J) {
            if (!J)
              return C.removeAllListeners(w), C._parser["on" + w] = J, J;
            C.on(w, J);
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
          var f = Wd.StringDecoder;
          this._decoder = new f("utf8");
        }
        p = this._decoder.write(p);
      }
      return this._parser.write(p.toString()), this.emit("data", p), !0;
    }, c.prototype.end = function(p) {
      return p && p.length && this.write(p), this._parser.end(), !0;
    }, c.prototype.on = function(p, f) {
      var C = this;
      return !C._parser["on" + p] && l.indexOf(p) !== -1 && (C._parser["on" + p] = function() {
        var w = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        w.splice(0, 0, p), C.emit.apply(C, w);
      }), a.prototype.on.call(C, p, f);
    };
    var u = "[CDATA[", h = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", E = "http://www.w3.org/2000/xmlns/", _ = { xml: g, xmlns: E }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, R = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, P = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function k(p) {
      return p === " " || p === `
` || p === "\r" || p === "	";
    }
    function Q(p) {
      return p === '"' || p === "'";
    }
    function U(p) {
      return p === ">" || k(p);
    }
    function q(p, f) {
      return p.test(f);
    }
    function Me(p, f) {
      return !q(p, f);
    }
    var y = 0;
    t.STATE = {
      BEGIN: y++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: y++,
      // leading whitespace
      TEXT: y++,
      // general stuff
      TEXT_ENTITY: y++,
      // &amp and such.
      OPEN_WAKA: y++,
      // <
      SGML_DECL: y++,
      // <!BLARG
      SGML_DECL_QUOTED: y++,
      // <!BLARG foo "bar
      DOCTYPE: y++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: y++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: y++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: y++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: y++,
      // <!-
      COMMENT: y++,
      // <!--
      COMMENT_ENDING: y++,
      // <!-- blah -
      COMMENT_ENDED: y++,
      // <!-- blah --
      CDATA: y++,
      // <![CDATA[ something
      CDATA_ENDING: y++,
      // ]
      CDATA_ENDING_2: y++,
      // ]]
      PROC_INST: y++,
      // <?hi
      PROC_INST_BODY: y++,
      // <?hi there
      PROC_INST_ENDING: y++,
      // <?hi "there" ?
      OPEN_TAG: y++,
      // <strong
      OPEN_TAG_SLASH: y++,
      // <strong /
      ATTRIB: y++,
      // <a
      ATTRIB_NAME: y++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: y++,
      // <a foo _
      ATTRIB_VALUE: y++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: y++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: y++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: y++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: y++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: y++,
      // <foo bar=&quot
      CLOSE_TAG: y++,
      // </a
      CLOSE_TAG_SAW_WHITE: y++,
      // </a   >
      SCRIPT: y++,
      // <script> ...
      SCRIPT_ENDING: y++
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
      var f = t.ENTITIES[p], C = typeof f == "number" ? String.fromCharCode(f) : f;
      t.ENTITIES[p] = C;
    });
    for (var V in t.STATE)
      t.STATE[t.STATE[V]] = V;
    y = t.STATE;
    function G(p, f, C) {
      p[f] && p[f](C);
    }
    function j(p, f, C) {
      p.textNode && Z(p), G(p, f, C);
    }
    function Z(p) {
      p.textNode = N(p.opt, p.textNode), p.textNode && G(p, "ontext", p.textNode), p.textNode = "";
    }
    function N(p, f) {
      return p.trim && (f = f.trim()), p.normalize && (f = f.replace(/\s+/g, " ")), f;
    }
    function b(p, f) {
      return Z(p), p.trackPosition && (f += `
Line: ` + p.line + `
Column: ` + p.column + `
Char: ` + p.c), f = new Error(f), p.error = f, G(p, "onerror", f), p;
    }
    function D(p) {
      return p.sawRoot && !p.closedRoot && I(p, "Unclosed root tag"), p.state !== y.BEGIN && p.state !== y.BEGIN_WHITESPACE && p.state !== y.TEXT && b(p, "Unexpected end"), Z(p), p.c = "", p.closed = !0, G(p, "onend"), r.call(p, p.strict, p.opt), p;
    }
    function I(p, f) {
      if (typeof p != "object" || !(p instanceof r))
        throw new Error("bad call to strictFail");
      p.strict && b(p, f);
    }
    function F(p) {
      p.strict || (p.tagName = p.tagName[p.looseCase]());
      var f = p.tags[p.tags.length - 1] || p, C = p.tag = { name: p.tagName, attributes: {} };
      p.opt.xmlns && (C.ns = f.ns), p.attribList.length = 0, j(p, "onopentagstart", C);
    }
    function $(p, f) {
      var C = p.indexOf(":"), w = C < 0 ? ["", p] : p.split(":"), J = w[0], ne = w[1];
      return f && p === "xmlns" && (J = "xmlns", ne = ""), { prefix: J, local: ne };
    }
    function H(p) {
      if (p.strict || (p.attribName = p.attribName[p.looseCase]()), p.attribList.indexOf(p.attribName) !== -1 || p.tag.attributes.hasOwnProperty(p.attribName)) {
        p.attribName = p.attribValue = "";
        return;
      }
      if (p.opt.xmlns) {
        var f = $(p.attribName, !0), C = f.prefix, w = f.local;
        if (C === "xmlns")
          if (w === "xml" && p.attribValue !== g)
            I(
              p,
              "xml: prefix must be bound to " + g + `
Actual: ` + p.attribValue
            );
          else if (w === "xmlns" && p.attribValue !== E)
            I(
              p,
              "xmlns: prefix must be bound to " + E + `
Actual: ` + p.attribValue
            );
          else {
            var J = p.tag, ne = p.tags[p.tags.length - 1] || p;
            J.ns === ne.ns && (J.ns = Object.create(ne.ns)), J.ns[w] = p.attribValue;
          }
        p.attribList.push([p.attribName, p.attribValue]);
      } else
        p.tag.attributes[p.attribName] = p.attribValue, j(p, "onattribute", {
          name: p.attribName,
          value: p.attribValue
        });
      p.attribName = p.attribValue = "";
    }
    function W(p, f) {
      if (p.opt.xmlns) {
        var C = p.tag, w = $(p.tagName);
        C.prefix = w.prefix, C.local = w.local, C.uri = C.ns[w.prefix] || "", C.prefix && !C.uri && (I(
          p,
          "Unbound namespace prefix: " + JSON.stringify(p.tagName)
        ), C.uri = w.prefix);
        var J = p.tags[p.tags.length - 1] || p;
        C.ns && J.ns !== C.ns && Object.keys(C.ns).forEach(function(Cr) {
          j(p, "onopennamespace", {
            prefix: Cr,
            uri: C.ns[Cr]
          });
        });
        for (var ne = 0, ae = p.attribList.length; ne < ae; ne++) {
          var _e = p.attribList[ne], Se = _e[0], ft = _e[1], fe = $(Se, !0), Xe = fe.prefix, Xi = fe.local, Rr = Xe === "" ? "" : C.ns[Xe] || "", In = {
            name: Se,
            value: ft,
            prefix: Xe,
            local: Xi,
            uri: Rr
          };
          Xe && Xe !== "xmlns" && !Rr && (I(
            p,
            "Unbound namespace prefix: " + JSON.stringify(Xe)
          ), In.uri = Xe), p.tag.attributes[Se] = In, j(p, "onattribute", In);
        }
        p.attribList.length = 0;
      }
      p.tag.isSelfClosing = !!f, p.sawRoot = !0, p.tags.push(p.tag), j(p, "onopentag", p.tag), f || (!p.noscript && p.tagName.toLowerCase() === "script" ? p.state = y.SCRIPT : p.state = y.TEXT, p.tag = null, p.tagName = ""), p.attribName = p.attribValue = "", p.attribList.length = 0;
    }
    function Y(p) {
      if (!p.tagName) {
        I(p, "Weird empty close tag."), p.textNode += "</>", p.state = y.TEXT;
        return;
      }
      if (p.script) {
        if (p.tagName !== "script") {
          p.script += "</" + p.tagName + ">", p.tagName = "", p.state = y.SCRIPT;
          return;
        }
        j(p, "onscript", p.script), p.script = "";
      }
      var f = p.tags.length, C = p.tagName;
      p.strict || (C = C[p.looseCase]());
      for (var w = C; f--; ) {
        var J = p.tags[f];
        if (J.name !== w)
          I(p, "Unexpected close tag");
        else
          break;
      }
      if (f < 0) {
        I(p, "Unmatched closing tag: " + p.tagName), p.textNode += "</" + p.tagName + ">", p.state = y.TEXT;
        return;
      }
      p.tagName = C;
      for (var ne = p.tags.length; ne-- > f; ) {
        var ae = p.tag = p.tags.pop();
        p.tagName = p.tag.name, j(p, "onclosetag", p.tagName);
        var _e = {};
        for (var Se in ae.ns)
          _e[Se] = ae.ns[Se];
        var ft = p.tags[p.tags.length - 1] || p;
        p.opt.xmlns && ae.ns !== ft.ns && Object.keys(ae.ns).forEach(function(fe) {
          var Xe = ae.ns[fe];
          j(p, "onclosenamespace", { prefix: fe, uri: Xe });
        });
      }
      f === 0 && (p.closedRoot = !0), p.tagName = p.attribValue = p.attribName = "", p.attribList.length = 0, p.state = y.TEXT;
    }
    function ee(p) {
      var f = p.entity, C = f.toLowerCase(), w, J = "";
      return p.ENTITIES[f] ? p.ENTITIES[f] : p.ENTITIES[C] ? p.ENTITIES[C] : (f = C, f.charAt(0) === "#" && (f.charAt(1) === "x" ? (f = f.slice(2), w = parseInt(f, 16), J = w.toString(16)) : (f = f.slice(1), w = parseInt(f, 10), J = w.toString(10))), f = f.replace(/^0+/, ""), isNaN(w) || J.toLowerCase() !== f || w < 0 || w > 1114111 ? (I(p, "Invalid character entity"), "&" + p.entity + ";") : String.fromCodePoint(w));
    }
    function he(p, f) {
      f === "<" ? (p.state = y.OPEN_WAKA, p.startTagPosition = p.position) : k(f) || (I(p, "Non-whitespace before first tag."), p.textNode = f, p.state = y.TEXT);
    }
    function B(p, f) {
      var C = "";
      return f < p.length && (C = p.charAt(f)), C;
    }
    function Ze(p) {
      var f = this;
      if (this.error)
        throw this.error;
      if (f.closed)
        return b(
          f,
          "Cannot write after close. Assign an onready handler."
        );
      if (p === null)
        return D(f);
      typeof p == "object" && (p = p.toString());
      for (var C = 0, w = ""; w = B(p, C++), f.c = w, !!w; )
        switch (f.trackPosition && (f.position++, w === `
` ? (f.line++, f.column = 0) : f.column++), f.state) {
          case y.BEGIN:
            if (f.state = y.BEGIN_WHITESPACE, w === "\uFEFF")
              continue;
            he(f, w);
            continue;
          case y.BEGIN_WHITESPACE:
            he(f, w);
            continue;
          case y.TEXT:
            if (f.sawRoot && !f.closedRoot) {
              for (var ne = C - 1; w && w !== "<" && w !== "&"; )
                w = B(p, C++), w && f.trackPosition && (f.position++, w === `
` ? (f.line++, f.column = 0) : f.column++);
              f.textNode += p.substring(ne, C - 1);
            }
            w === "<" && !(f.sawRoot && f.closedRoot && !f.strict) ? (f.state = y.OPEN_WAKA, f.startTagPosition = f.position) : (!k(w) && (!f.sawRoot || f.closedRoot) && I(f, "Text data outside of root node."), w === "&" ? f.state = y.TEXT_ENTITY : f.textNode += w);
            continue;
          case y.SCRIPT:
            w === "<" ? f.state = y.SCRIPT_ENDING : f.script += w;
            continue;
          case y.SCRIPT_ENDING:
            w === "/" ? f.state = y.CLOSE_TAG : (f.script += "<" + w, f.state = y.SCRIPT);
            continue;
          case y.OPEN_WAKA:
            if (w === "!")
              f.state = y.SGML_DECL, f.sgmlDecl = "";
            else if (!k(w)) if (q(T, w))
              f.state = y.OPEN_TAG, f.tagName = w;
            else if (w === "/")
              f.state = y.CLOSE_TAG, f.tagName = "";
            else if (w === "?")
              f.state = y.PROC_INST, f.procInstName = f.procInstBody = "";
            else {
              if (I(f, "Unencoded <"), f.startTagPosition + 1 < f.position) {
                var J = f.position - f.startTagPosition;
                w = new Array(J).join(" ") + w;
              }
              f.textNode += "<" + w, f.state = y.TEXT;
            }
            continue;
          case y.SGML_DECL:
            if (f.sgmlDecl + w === "--") {
              f.state = y.COMMENT, f.comment = "", f.sgmlDecl = "";
              continue;
            }
            f.doctype && f.doctype !== !0 && f.sgmlDecl ? (f.state = y.DOCTYPE_DTD, f.doctype += "<!" + f.sgmlDecl + w, f.sgmlDecl = "") : (f.sgmlDecl + w).toUpperCase() === u ? (j(f, "onopencdata"), f.state = y.CDATA, f.sgmlDecl = "", f.cdata = "") : (f.sgmlDecl + w).toUpperCase() === h ? (f.state = y.DOCTYPE, (f.doctype || f.sawRoot) && I(
              f,
              "Inappropriately located doctype declaration"
            ), f.doctype = "", f.sgmlDecl = "") : w === ">" ? (j(f, "onsgmldeclaration", f.sgmlDecl), f.sgmlDecl = "", f.state = y.TEXT) : (Q(w) && (f.state = y.SGML_DECL_QUOTED), f.sgmlDecl += w);
            continue;
          case y.SGML_DECL_QUOTED:
            w === f.q && (f.state = y.SGML_DECL, f.q = ""), f.sgmlDecl += w;
            continue;
          case y.DOCTYPE:
            w === ">" ? (f.state = y.TEXT, j(f, "ondoctype", f.doctype), f.doctype = !0) : (f.doctype += w, w === "[" ? f.state = y.DOCTYPE_DTD : Q(w) && (f.state = y.DOCTYPE_QUOTED, f.q = w));
            continue;
          case y.DOCTYPE_QUOTED:
            f.doctype += w, w === f.q && (f.q = "", f.state = y.DOCTYPE);
            continue;
          case y.DOCTYPE_DTD:
            w === "]" ? (f.doctype += w, f.state = y.DOCTYPE) : w === "<" ? (f.state = y.OPEN_WAKA, f.startTagPosition = f.position) : Q(w) ? (f.doctype += w, f.state = y.DOCTYPE_DTD_QUOTED, f.q = w) : f.doctype += w;
            continue;
          case y.DOCTYPE_DTD_QUOTED:
            f.doctype += w, w === f.q && (f.state = y.DOCTYPE_DTD, f.q = "");
            continue;
          case y.COMMENT:
            w === "-" ? f.state = y.COMMENT_ENDING : f.comment += w;
            continue;
          case y.COMMENT_ENDING:
            w === "-" ? (f.state = y.COMMENT_ENDED, f.comment = N(f.opt, f.comment), f.comment && j(f, "oncomment", f.comment), f.comment = "") : (f.comment += "-" + w, f.state = y.COMMENT);
            continue;
          case y.COMMENT_ENDED:
            w !== ">" ? (I(f, "Malformed comment"), f.comment += "--" + w, f.state = y.COMMENT) : f.doctype && f.doctype !== !0 ? f.state = y.DOCTYPE_DTD : f.state = y.TEXT;
            continue;
          case y.CDATA:
            for (var ne = C - 1; w && w !== "]"; )
              w = B(p, C++), w && f.trackPosition && (f.position++, w === `
` ? (f.line++, f.column = 0) : f.column++);
            f.cdata += p.substring(ne, C - 1), w === "]" && (f.state = y.CDATA_ENDING);
            continue;
          case y.CDATA_ENDING:
            w === "]" ? f.state = y.CDATA_ENDING_2 : (f.cdata += "]" + w, f.state = y.CDATA);
            continue;
          case y.CDATA_ENDING_2:
            w === ">" ? (f.cdata && j(f, "oncdata", f.cdata), j(f, "onclosecdata"), f.cdata = "", f.state = y.TEXT) : w === "]" ? f.cdata += "]" : (f.cdata += "]]" + w, f.state = y.CDATA);
            continue;
          case y.PROC_INST:
            w === "?" ? f.state = y.PROC_INST_ENDING : k(w) ? f.state = y.PROC_INST_BODY : f.procInstName += w;
            continue;
          case y.PROC_INST_BODY:
            if (!f.procInstBody && k(w))
              continue;
            w === "?" ? f.state = y.PROC_INST_ENDING : f.procInstBody += w;
            continue;
          case y.PROC_INST_ENDING:
            w === ">" ? (j(f, "onprocessinginstruction", {
              name: f.procInstName,
              body: f.procInstBody
            }), f.procInstName = f.procInstBody = "", f.state = y.TEXT) : (f.procInstBody += "?" + w, f.state = y.PROC_INST_BODY);
            continue;
          case y.OPEN_TAG:
            q(A, w) ? f.tagName += w : (F(f), w === ">" ? W(f) : w === "/" ? f.state = y.OPEN_TAG_SLASH : (k(w) || I(f, "Invalid character in tag name"), f.state = y.ATTRIB));
            continue;
          case y.OPEN_TAG_SLASH:
            w === ">" ? (W(f, !0), Y(f)) : (I(
              f,
              "Forward-slash in opening tag not followed by >"
            ), f.state = y.ATTRIB);
            continue;
          case y.ATTRIB:
            if (k(w))
              continue;
            w === ">" ? W(f) : w === "/" ? f.state = y.OPEN_TAG_SLASH : q(T, w) ? (f.attribName = w, f.attribValue = "", f.state = y.ATTRIB_NAME) : I(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME:
            w === "=" ? f.state = y.ATTRIB_VALUE : w === ">" ? (I(f, "Attribute without value"), f.attribValue = f.attribName, H(f), W(f)) : k(w) ? f.state = y.ATTRIB_NAME_SAW_WHITE : q(A, w) ? f.attribName += w : I(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME_SAW_WHITE:
            if (w === "=")
              f.state = y.ATTRIB_VALUE;
            else {
              if (k(w))
                continue;
              I(f, "Attribute without value"), f.tag.attributes[f.attribName] = "", f.attribValue = "", j(f, "onattribute", {
                name: f.attribName,
                value: ""
              }), f.attribName = "", w === ">" ? W(f) : q(T, w) ? (f.attribName = w, f.state = y.ATTRIB_NAME) : (I(f, "Invalid attribute name"), f.state = y.ATTRIB);
            }
            continue;
          case y.ATTRIB_VALUE:
            if (k(w))
              continue;
            Q(w) ? (f.q = w, f.state = y.ATTRIB_VALUE_QUOTED) : (f.opt.unquotedAttributeValues || b(f, "Unquoted attribute value"), f.state = y.ATTRIB_VALUE_UNQUOTED, f.attribValue = w);
            continue;
          case y.ATTRIB_VALUE_QUOTED:
            if (w !== f.q) {
              w === "&" ? f.state = y.ATTRIB_VALUE_ENTITY_Q : f.attribValue += w;
              continue;
            }
            H(f), f.q = "", f.state = y.ATTRIB_VALUE_CLOSED;
            continue;
          case y.ATTRIB_VALUE_CLOSED:
            k(w) ? f.state = y.ATTRIB : w === ">" ? W(f) : w === "/" ? f.state = y.OPEN_TAG_SLASH : q(T, w) ? (I(f, "No whitespace between attributes"), f.attribName = w, f.attribValue = "", f.state = y.ATTRIB_NAME) : I(f, "Invalid attribute name");
            continue;
          case y.ATTRIB_VALUE_UNQUOTED:
            if (!U(w)) {
              w === "&" ? f.state = y.ATTRIB_VALUE_ENTITY_U : f.attribValue += w;
              continue;
            }
            H(f), w === ">" ? W(f) : f.state = y.ATTRIB;
            continue;
          case y.CLOSE_TAG:
            if (f.tagName)
              w === ">" ? Y(f) : q(A, w) ? f.tagName += w : f.script ? (f.script += "</" + f.tagName, f.tagName = "", f.state = y.SCRIPT) : (k(w) || I(f, "Invalid tagname in closing tag"), f.state = y.CLOSE_TAG_SAW_WHITE);
            else {
              if (k(w))
                continue;
              Me(T, w) ? f.script ? (f.script += "</" + w, f.state = y.SCRIPT) : I(f, "Invalid tagname in closing tag.") : f.tagName = w;
            }
            continue;
          case y.CLOSE_TAG_SAW_WHITE:
            if (k(w))
              continue;
            w === ">" ? Y(f) : I(f, "Invalid characters in closing tag");
            continue;
          case y.TEXT_ENTITY:
          case y.ATTRIB_VALUE_ENTITY_Q:
          case y.ATTRIB_VALUE_ENTITY_U:
            var ae, _e;
            switch (f.state) {
              case y.TEXT_ENTITY:
                ae = y.TEXT, _e = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                ae = y.ATTRIB_VALUE_QUOTED, _e = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                ae = y.ATTRIB_VALUE_UNQUOTED, _e = "attribValue";
                break;
            }
            if (w === ";") {
              var Se = ee(f);
              f.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Se) ? (f.entity = "", f.state = ae, f.write(Se)) : (f[_e] += Se, f.entity = "", f.state = ae);
            } else q(f.entity.length ? P : R, w) ? f.entity += w : (I(f, "Invalid character in entity name"), f[_e] += "&" + f.entity + w, f.entity = "", f.state = ae);
            continue;
          default:
            throw new Error(f, "Unknown state: " + f.state);
        }
      return f.position >= f.bufferCheckPosition && i(f), f;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var p = String.fromCharCode, f = Math.floor, C = function() {
        var w = 16384, J = [], ne, ae, _e = -1, Se = arguments.length;
        if (!Se)
          return "";
        for (var ft = ""; ++_e < Se; ) {
          var fe = Number(arguments[_e]);
          if (!isFinite(fe) || // `NaN`, `+Infinity`, or `-Infinity`
          fe < 0 || // not a valid Unicode code point
          fe > 1114111 || // not a valid Unicode code point
          f(fe) !== fe)
            throw RangeError("Invalid code point: " + fe);
          fe <= 65535 ? J.push(fe) : (fe -= 65536, ne = (fe >> 10) + 55296, ae = fe % 1024 + 56320, J.push(ne, ae)), (_e + 1 === Se || J.length > w) && (ft += p.apply(null, J), J.length = 0);
        }
        return ft;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: C,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = C;
    }();
  })(e);
})(hu);
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.XElement = void 0;
pr.parseXml = Cm;
const Sm = hu, Hr = Tn;
class pu {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Hr.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Rm(t))
      throw (0, Hr.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, Hr.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, Hr.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (La(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => La(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
pr.XElement = pu;
const Am = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Rm(e) {
  return Am.test(e);
}
function La(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function Cm(e) {
  let t = null;
  const n = Sm.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new pu(i.name);
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
  var t = It;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = Tn;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = $e;
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
  var i = Si;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = hr;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var s = Ai;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } });
  var a = ps;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var l = gs;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var d = En;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return d.UUID;
  } });
  var c = pr;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function u(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(Ee);
var Te = {}, ms = {}, Ke = {};
function gu(e) {
  return typeof e > "u" || e === null;
}
function Im(e) {
  return typeof e == "object" && e !== null;
}
function bm(e) {
  return Array.isArray(e) ? e : gu(e) ? [] : [e];
}
function Om(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function Nm(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function $m(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ke.isNothing = gu;
Ke.isObject = Im;
Ke.toArray = bm;
Ke.repeat = Nm;
Ke.isNegativeZero = $m;
Ke.extend = Om;
function mu(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Zn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = mu(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Zn.prototype = Object.create(Error.prototype);
Zn.prototype.constructor = Zn;
Zn.prototype.toString = function(t) {
  return this.name + ": " + mu(this, t);
};
var gr = Zn, Hn = Ke;
function co(e, t, n, r, i) {
  var o = "", s = "", a = Math.floor(i / 2) - 1;
  return r - t > a && (o = " ... ", t = r - a + o.length), n - r > a && (s = " ...", n = r + a - s.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + s,
    pos: r - t + o.length
    // relative position
  };
}
function uo(e, t) {
  return Hn.repeat(" ", t - e.length) + e;
}
function Dm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, s = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = r.length - 2);
  s < 0 && (s = r.length - 1);
  var a = "", l, d, c = Math.min(e.line + t.linesAfter, i.length).toString().length, u = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(s - l < 0); l++)
    d = co(
      e.buffer,
      r[s - l],
      i[s - l],
      e.position - (r[s] - r[s - l]),
      u
    ), a = Hn.repeat(" ", t.indent) + uo((e.line - l + 1).toString(), c) + " | " + d.str + `
` + a;
  for (d = co(e.buffer, r[s], i[s], e.position, u), a += Hn.repeat(" ", t.indent) + uo((e.line + 1).toString(), c) + " | " + d.str + `
`, a += Hn.repeat("-", t.indent + c + 3 + d.pos) + `^
`, l = 1; l <= t.linesAfter && !(s + l >= i.length); l++)
    d = co(
      e.buffer,
      r[s + l],
      i[s + l],
      e.position - (r[s] - r[s + l]),
      u
    ), a += Hn.repeat(" ", t.indent) + uo((e.line + l + 1).toString(), c) + " | " + d.str + `
`;
  return a.replace(/\n$/, "");
}
var Pm = Dm, ka = gr, Fm = [
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
], Lm = [
  "scalar",
  "sequence",
  "mapping"
];
function km(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function xm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (Fm.indexOf(n) === -1)
      throw new ka('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = km(t.styleAliases || null), Lm.indexOf(this.kind) === -1)
    throw new ka('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Fe = xm, Fn = gr, fo = Fe;
function xa(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, s) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = s);
    }), n[i] = r;
  }), n;
}
function Um() {
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
function qo(e) {
  return this.extend(e);
}
qo.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof fo)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new Fn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof fo))
      throw new Fn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Fn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Fn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof fo))
      throw new Fn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(qo.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = xa(i, "implicit"), i.compiledExplicit = xa(i, "explicit"), i.compiledTypeMap = Um(i.compiledImplicit, i.compiledExplicit), i;
};
var yu = qo, Mm = Fe, Eu = new Mm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Bm = Fe, _u = new Bm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Hm = Fe, vu = new Hm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), jm = yu, wu = new jm({
  explicit: [
    Eu,
    _u,
    vu
  ]
}), qm = Fe;
function Gm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Ym() {
  return null;
}
function Xm(e) {
  return e === null;
}
var Tu = new qm("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Gm,
  construct: Ym,
  predicate: Xm,
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
}), Vm = Fe;
function Wm(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function zm(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Km(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Su = new Vm("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Wm,
  construct: zm,
  predicate: Km,
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
}), Jm = Ke, Qm = Fe;
function Zm(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function ey(e) {
  return 48 <= e && e <= 55;
}
function ty(e) {
  return 48 <= e && e <= 57;
}
function ny(e) {
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
          if (!Zm(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!ey(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!ty(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function ry(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function iy(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !Jm.isNegativeZero(e);
}
var Au = new Qm("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: ny,
  construct: ry,
  predicate: iy,
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
}), Ru = Ke, oy = Fe, sy = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function ay(e) {
  return !(e === null || !sy.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function ly(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var cy = /^[-+]?[0-9]+e/;
function uy(e, t) {
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
  else if (Ru.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), cy.test(n) ? n.replace("e", ".e") : n;
}
function fy(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Ru.isNegativeZero(e));
}
var Cu = new oy("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: ay,
  construct: ly,
  predicate: fy,
  represent: uy,
  defaultStyle: "lowercase"
}), Iu = wu.extend({
  implicit: [
    Tu,
    Su,
    Au,
    Cu
  ]
}), bu = Iu, dy = Fe, Ou = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Nu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function hy(e) {
  return e === null ? !1 : Ou.exec(e) !== null || Nu.exec(e) !== null;
}
function py(e) {
  var t, n, r, i, o, s, a, l = 0, d = null, c, u, h;
  if (t = Ou.exec(e), t === null && (t = Nu.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], s = +t[5], a = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], u = +(t[11] || 0), d = (c * 60 + u) * 6e4, t[9] === "-" && (d = -d)), h = new Date(Date.UTC(n, r, i, o, s, a, l)), d && h.setTime(h.getTime() - d), h;
}
function gy(e) {
  return e.toISOString();
}
var $u = new dy("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: hy,
  construct: py,
  instanceOf: Date,
  represent: gy
}), my = Fe;
function yy(e) {
  return e === "<<" || e === null;
}
var Du = new my("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: yy
}), Ey = Fe, ys = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function _y(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = ys;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function vy(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = ys, s = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : n === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : n === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function wy(e) {
  var t = "", n = 0, r, i, o = e.length, s = ys;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]) : i === 2 ? (t += s[n >> 10 & 63], t += s[n >> 4 & 63], t += s[n << 2 & 63], t += s[64]) : i === 1 && (t += s[n >> 2 & 63], t += s[n << 4 & 63], t += s[64], t += s[64]), t;
}
function Ty(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Pu = new Ey("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: _y,
  construct: vy,
  predicate: Ty,
  represent: wy
}), Sy = Fe, Ay = Object.prototype.hasOwnProperty, Ry = Object.prototype.toString;
function Cy(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, s, a = e;
  for (n = 0, r = a.length; n < r; n += 1) {
    if (i = a[n], s = !1, Ry.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Ay.call(i, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Iy(e) {
  return e !== null ? e : [];
}
var Fu = new Sy("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Cy,
  construct: Iy
}), by = Fe, Oy = Object.prototype.toString;
function Ny(e) {
  if (e === null) return !0;
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1) {
    if (r = s[t], Oy.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function $y(e) {
  if (e === null) return [];
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1)
    r = s[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var Lu = new by("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Ny,
  construct: $y
}), Dy = Fe, Py = Object.prototype.hasOwnProperty;
function Fy(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (Py.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function Ly(e) {
  return e !== null ? e : {};
}
var ku = new Dy("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Fy,
  construct: Ly
}), Es = bu.extend({
  implicit: [
    $u,
    Du
  ],
  explicit: [
    Pu,
    Fu,
    Lu,
    ku
  ]
}), qt = Ke, xu = gr, ky = Pm, xy = Es, bt = Object.prototype.hasOwnProperty, ui = 1, Uu = 2, Mu = 3, fi = 4, ho = 1, Uy = 2, Ua = 3, My = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, By = /[\x85\u2028\u2029]/, Hy = /[,\[\]\{\}]/, Bu = /^(?:!|!!|![a-z\-]+!)$/i, Hu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Ma(e) {
  return Object.prototype.toString.call(e);
}
function rt(e) {
  return e === 10 || e === 13;
}
function Vt(e) {
  return e === 9 || e === 32;
}
function Ue(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function an(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function jy(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function qy(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Gy(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Ba(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Yy(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function ju(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var qu = new Array(256), Gu = new Array(256);
for (var en = 0; en < 256; en++)
  qu[en] = Ba(en) ? 1 : 0, Gu[en] = Ba(en);
function Xy(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || xy, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Yu(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = ky(n), new xu(t, n);
}
function M(e, t) {
  throw Yu(e, t);
}
function di(e, t) {
  e.onWarning && e.onWarning.call(null, Yu(e, t));
}
var Ha = {
  YAML: function(t, n, r) {
    var i, o, s;
    t.version !== null && M(t, "duplication of %YAML directive"), r.length !== 1 && M(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && M(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), s = parseInt(i[2], 10), o !== 1 && M(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && di(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && M(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], Bu.test(i) || M(t, "ill-formed tag handle (first argument) of the TAG directive"), bt.call(t.tagMap, i) && M(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Hu.test(o) || M(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      M(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function At(e, t, n, r) {
  var i, o, s, a;
  if (t < n) {
    if (a = e.input.slice(t, n), r)
      for (i = 0, o = a.length; i < o; i += 1)
        s = a.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || M(e, "expected valid JSON character");
    else My.test(a) && M(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function ja(e, t, n, r) {
  var i, o, s, a;
  for (qt.isObject(n) || M(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), s = 0, a = i.length; s < a; s += 1)
    o = i[s], bt.call(t, o) || (ju(t, o, n[o]), r[o] = !0);
}
function ln(e, t, n, r, i, o, s, a, l) {
  var d, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), d = 0, c = i.length; d < c; d += 1)
      Array.isArray(i[d]) && M(e, "nested arrays are not supported inside keys"), typeof i == "object" && Ma(i[d]) === "[object Object]" && (i[d] = "[object Object]");
  if (typeof i == "object" && Ma(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (d = 0, c = o.length; d < c; d += 1)
        ja(e, t, o[d], n);
    else
      ja(e, t, o, n);
  else
    !e.json && !bt.call(n, i) && bt.call(t, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = l || e.position, M(e, "duplicated mapping key")), ju(t, i, o), delete n[i];
  return t;
}
function _s(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : M(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ue(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Vt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (rt(i))
      for (_s(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && di(e, "deficient indentation"), r;
}
function Ri(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || Ue(n)));
}
function vs(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += qt.repeat(`
`, t - 1));
}
function Vy(e, t, n) {
  var r, i, o, s, a, l, d, c, u = e.kind, h = e.result, g;
  if (g = e.input.charCodeAt(e.position), Ue(g) || an(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), Ue(i) || n && an(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ue(i) || n && an(i))
        break;
    } else if (g === 35) {
      if (r = e.input.charCodeAt(e.position - 1), Ue(r))
        break;
    } else {
      if (e.position === e.lineStart && Ri(e) || n && an(g))
        break;
      if (rt(g))
        if (l = e.line, d = e.lineStart, c = e.lineIndent, ue(e, !1, -1), e.lineIndent >= t) {
          a = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = d, e.lineIndent = c;
          break;
        }
    }
    a && (At(e, o, s, !1), vs(e, e.line - l), o = s = e.position, a = !1), Vt(g) || (s = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return At(e, o, s, !1), e.result ? !0 : (e.kind = u, e.result = h, !1);
}
function Wy(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (At(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else rt(n) ? (At(e, r, i, !0), vs(e, ue(e, !1, t)), r = i = e.position) : e.position === e.lineStart && Ri(e) ? M(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  M(e, "unexpected end of the stream within a single quoted scalar");
}
function zy(e, t) {
  var n, r, i, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return At(e, n, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (At(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), rt(a))
        ue(e, !1, t);
      else if (a < 256 && qu[a])
        e.result += Gu[a], e.position++;
      else if ((s = qy(a)) > 0) {
        for (i = s, o = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (s = jy(a)) >= 0 ? o = (o << 4) + s : M(e, "expected hexadecimal character");
        e.result += Yy(o), e.position++;
      } else
        M(e, "unknown escape sequence");
      n = r = e.position;
    } else rt(a) ? (At(e, n, r, !0), vs(e, ue(e, !1, t)), n = r = e.position) : e.position === e.lineStart && Ri(e) ? M(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  M(e, "unexpected end of the stream within a double quoted scalar");
}
function Ky(e, t) {
  var n = !0, r, i, o, s = e.tag, a, l = e.anchor, d, c, u, h, g, E = /* @__PURE__ */ Object.create(null), _, T, A, R;
  if (R = e.input.charCodeAt(e.position), R === 91)
    c = 93, g = !1, a = [];
  else if (R === 123)
    c = 125, g = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), R = e.input.charCodeAt(++e.position); R !== 0; ) {
    if (ue(e, !0, t), R = e.input.charCodeAt(e.position), R === c)
      return e.position++, e.tag = s, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = a, !0;
    n ? R === 44 && M(e, "expected the node content, but found ','") : M(e, "missed comma between flow collection entries"), T = _ = A = null, u = h = !1, R === 63 && (d = e.input.charCodeAt(e.position + 1), Ue(d) && (u = h = !0, e.position++, ue(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, _n(e, t, ui, !1, !0), T = e.tag, _ = e.result, ue(e, !0, t), R = e.input.charCodeAt(e.position), (h || e.line === r) && R === 58 && (u = !0, R = e.input.charCodeAt(++e.position), ue(e, !0, t), _n(e, t, ui, !1, !0), A = e.result), g ? ln(e, a, E, T, _, A, r, i, o) : u ? a.push(ln(e, null, E, T, _, A, r, i, o)) : a.push(_), ue(e, !0, t), R = e.input.charCodeAt(e.position), R === 44 ? (n = !0, R = e.input.charCodeAt(++e.position)) : n = !1;
  }
  M(e, "unexpected end of the stream within a flow collection");
}
function Jy(e, t) {
  var n, r, i = ho, o = !1, s = !1, a = t, l = 0, d = !1, c, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    r = !1;
  else if (u === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      ho === i ? i = u === 43 ? Ua : Uy : M(e, "repeat of a chomping mode identifier");
    else if ((c = Gy(u)) >= 0)
      c === 0 ? M(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? M(e, "repeat of an indentation width identifier") : (a = t + c - 1, s = !0);
    else
      break;
  if (Vt(u)) {
    do
      u = e.input.charCodeAt(++e.position);
    while (Vt(u));
    if (u === 35)
      do
        u = e.input.charCodeAt(++e.position);
      while (!rt(u) && u !== 0);
  }
  for (; u !== 0; ) {
    for (_s(e), e.lineIndent = 0, u = e.input.charCodeAt(e.position); (!s || e.lineIndent < a) && u === 32; )
      e.lineIndent++, u = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > a && (a = e.lineIndent), rt(u)) {
      l++;
      continue;
    }
    if (e.lineIndent < a) {
      i === Ua ? e.result += qt.repeat(`
`, o ? 1 + l : l) : i === ho && o && (e.result += `
`);
      break;
    }
    for (r ? Vt(u) ? (d = !0, e.result += qt.repeat(`
`, o ? 1 + l : l)) : d ? (d = !1, e.result += qt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += qt.repeat(`
`, l) : e.result += qt.repeat(`
`, o ? 1 + l : l), o = !0, s = !0, l = 0, n = e.position; !rt(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    At(e, n, e.position, !1);
  }
  return !0;
}
function qa(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], s, a = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, M(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !Ue(s)))); ) {
    if (a = !0, e.position++, ue(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, _n(e, t, Mu, !1, !0), o.push(e.result), ue(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      M(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function Qy(e, t, n) {
  var r, i, o, s, a, l, d = e.tag, c = e.anchor, u = {}, h = /* @__PURE__ */ Object.create(null), g = null, E = null, _ = null, T = !1, A = !1, R;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), R = e.input.charCodeAt(e.position); R !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, M(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (R === 63 || R === 58) && Ue(r))
      R === 63 ? (T && (ln(e, u, h, g, E, null, s, a, l), g = E = _ = null), A = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : M(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, R = r;
    else {
      if (s = e.line, a = e.lineStart, l = e.position, !_n(e, n, Uu, !1, !0))
        break;
      if (e.line === o) {
        for (R = e.input.charCodeAt(e.position); Vt(R); )
          R = e.input.charCodeAt(++e.position);
        if (R === 58)
          R = e.input.charCodeAt(++e.position), Ue(R) || M(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (ln(e, u, h, g, E, null, s, a, l), g = E = _ = null), A = !0, T = !1, i = !1, g = e.tag, E = e.result;
        else if (A)
          M(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = d, e.anchor = c, !0;
      } else if (A)
        M(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = d, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (T && (s = e.line, a = e.lineStart, l = e.position), _n(e, t, fi, !0, i) && (T ? E = e.result : _ = e.result), T || (ln(e, u, h, g, E, _, s, a, l), g = E = _ = null), ue(e, !0, -1), R = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && R !== 0)
      M(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && ln(e, u, h, g, E, null, s, a, l), A && (e.tag = d, e.anchor = c, e.kind = "mapping", e.result = u), A;
}
function Zy(e) {
  var t, n = !1, r = !1, i, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && M(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (n = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (r = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : M(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !Ue(s); )
      s === 33 && (r ? M(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Bu.test(i) || M(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), Hy.test(o) && M(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Hu.test(o) && M(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    M(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : bt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : M(e, 'undeclared tag handle "' + i + '"'), !0;
}
function e0(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && M(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ue(n) && !an(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && M(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function t0(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ue(r) && !an(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && M(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), bt.call(e.anchorMap, n) || M(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], ue(e, !0, -1), !0;
}
function _n(e, t, n, r, i) {
  var o, s, a, l = 1, d = !1, c = !1, u, h, g, E, _, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = fi === n || Mu === n, r && ue(e, !0, -1) && (d = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; Zy(e) || e0(e); )
      ue(e, !0, -1) ? (d = !0, a = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : a = !1;
  if (a && (a = d || i), (l === 1 || fi === n) && (ui === n || Uu === n ? _ = t : _ = t + 1, T = e.position - e.lineStart, l === 1 ? a && (qa(e, T) || Qy(e, T, _)) || Ky(e, _) ? c = !0 : (s && Jy(e, _) || Wy(e, _) || zy(e, _) ? c = !0 : t0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && M(e, "alias node should not have any properties")) : Vy(e, _, ui === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = a && qa(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && M(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, h = e.implicitTypes.length; u < h; u += 1)
      if (E = e.implicitTypes[u], E.resolve(e.result)) {
        e.result = E.construct(e.result), e.tag = E.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (bt.call(e.typeMap[e.kind || "fallback"], e.tag))
      E = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (E = null, g = e.typeMap.multi[e.kind || "fallback"], u = 0, h = g.length; u < h; u += 1)
        if (e.tag.slice(0, g[u].tag.length) === g[u].tag) {
          E = g[u];
          break;
        }
    E || M(e, "unknown tag !<" + e.tag + ">"), e.result !== null && E.kind !== e.kind && M(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + E.kind + '", not "' + e.kind + '"'), E.resolve(e.result, e.tag) ? (e.result = E.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : M(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function n0(e) {
  var t = e.position, n, r, i, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (ue(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), n = e.position; s !== 0 && !Ue(s); )
      s = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && M(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; Vt(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !rt(s));
        break;
      }
      if (rt(s)) break;
      for (n = e.position; s !== 0 && !Ue(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    s !== 0 && _s(e), bt.call(Ha, r) ? Ha[r](e, r, i) : di(e, 'unknown document directive "' + r + '"');
  }
  if (ue(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ue(e, !0, -1)) : o && M(e, "directives end mark is expected"), _n(e, e.lineIndent - 1, fi, !1, !0), ue(e, !0, -1), e.checkLineBreaks && By.test(e.input.slice(t, e.position)) && di(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Ri(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ue(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    M(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Xu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new Xy(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, M(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    n0(n);
  return n.documents;
}
function r0(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = Xu(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function i0(e, t) {
  var n = Xu(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new xu("expected a single document in the stream, but found more");
  }
}
ms.loadAll = r0;
ms.load = i0;
var Vu = {}, Ci = Ke, mr = gr, o0 = Es, Wu = Object.prototype.toString, zu = Object.prototype.hasOwnProperty, ws = 65279, s0 = 9, er = 10, a0 = 13, l0 = 32, c0 = 33, u0 = 34, Go = 35, f0 = 37, d0 = 38, h0 = 39, p0 = 42, Ku = 44, g0 = 45, hi = 58, m0 = 61, y0 = 62, E0 = 63, _0 = 64, Ju = 91, Qu = 93, v0 = 96, Zu = 123, w0 = 124, ef = 125, be = {};
be[0] = "\\0";
be[7] = "\\a";
be[8] = "\\b";
be[9] = "\\t";
be[10] = "\\n";
be[11] = "\\v";
be[12] = "\\f";
be[13] = "\\r";
be[27] = "\\e";
be[34] = '\\"';
be[92] = "\\\\";
be[133] = "\\N";
be[160] = "\\_";
be[8232] = "\\L";
be[8233] = "\\P";
var T0 = [
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
], S0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function A0(e, t) {
  var n, r, i, o, s, a, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    s = r[i], a = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && zu.call(l.styleAliases, a) && (a = l.styleAliases[a]), n[s] = a;
  return n;
}
function R0(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new mr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + Ci.repeat("0", r - t.length) + t;
}
var C0 = 1, tr = 2;
function I0(e) {
  this.schema = e.schema || o0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Ci.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = A0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? tr : C0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ga(e, t) {
  for (var n = Ci.repeat(" ", t), r = 0, i = -1, o = "", s, a = e.length; r < a; )
    i = e.indexOf(`
`, r), i === -1 ? (s = e.slice(r), r = a) : (s = e.slice(r, i + 1), r = i + 1), s.length && s !== `
` && (o += n), o += s;
  return o;
}
function Yo(e, t) {
  return `
` + Ci.repeat(" ", e.indent * t);
}
function b0(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function pi(e) {
  return e === l0 || e === s0;
}
function nr(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== ws || 65536 <= e && e <= 1114111;
}
function Ya(e) {
  return nr(e) && e !== ws && e !== a0 && e !== er;
}
function Xa(e, t, n) {
  var r = Ya(e), i = r && !pi(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Ku && e !== Ju && e !== Qu && e !== Zu && e !== ef) && e !== Go && !(t === hi && !i) || Ya(t) && !pi(t) && e === Go || t === hi && i
  );
}
function O0(e) {
  return nr(e) && e !== ws && !pi(e) && e !== g0 && e !== E0 && e !== hi && e !== Ku && e !== Ju && e !== Qu && e !== Zu && e !== ef && e !== Go && e !== d0 && e !== p0 && e !== c0 && e !== w0 && e !== m0 && e !== y0 && e !== h0 && e !== u0 && e !== f0 && e !== _0 && e !== v0;
}
function N0(e) {
  return !pi(e) && e !== hi;
}
function jn(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function tf(e) {
  var t = /^\n* /;
  return t.test(e);
}
var nf = 1, Xo = 2, rf = 3, of = 4, sn = 5;
function $0(e, t, n, r, i, o, s, a) {
  var l, d = 0, c = null, u = !1, h = !1, g = r !== -1, E = -1, _ = O0(jn(e, 0)) && N0(jn(e, e.length - 1));
  if (t || s)
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = jn(e, l), !nr(d))
        return sn;
      _ = _ && Xa(d, c, a), c = d;
    }
  else {
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = jn(e, l), d === er)
        u = !0, g && (h = h || // Foldable line = too long, and not more-indented.
        l - E - 1 > r && e[E + 1] !== " ", E = l);
      else if (!nr(d))
        return sn;
      _ = _ && Xa(d, c, a), c = d;
    }
    h = h || g && l - E - 1 > r && e[E + 1] !== " ";
  }
  return !u && !h ? _ && !s && !i(e) ? nf : o === tr ? sn : Xo : n > 9 && tf(e) ? sn : s ? o === tr ? sn : Xo : h ? of : rf;
}
function D0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === tr ? '""' : "''";
    if (!e.noCompatMode && (T0.indexOf(t) !== -1 || S0.test(t)))
      return e.quotingType === tr ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(d) {
      return b0(e, d);
    }
    switch ($0(
      t,
      a,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case nf:
        return t;
      case Xo:
        return "'" + t.replace(/'/g, "''") + "'";
      case rf:
        return "|" + Va(t, e.indent) + Wa(Ga(t, o));
      case of:
        return ">" + Va(t, e.indent) + Wa(Ga(P0(t, s), o));
      case sn:
        return '"' + F0(t) + '"';
      default:
        throw new mr("impossible error: invalid scalar style");
    }
  }();
}
function Va(e, t) {
  var n = tf(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function Wa(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function P0(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var d = e.indexOf(`
`);
    return d = d !== -1 ? d : e.length, n.lastIndex = d, za(e.slice(0, d), t);
  }(), i = e[0] === `
` || e[0] === " ", o, s; s = n.exec(e); ) {
    var a = s[1], l = s[2];
    o = l[0] === " ", r += a + (!i && !o && l !== "" ? `
` : "") + za(l, t), i = o;
  }
  return r;
}
function za(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, s = 0, a = 0, l = ""; r = n.exec(e); )
    a = r.index, a - i > t && (o = s > i ? s : a, l += `
` + e.slice(i, o), i = o + 1), s = a;
  return l += `
`, e.length - i > t && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function F0(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = jn(e, i), r = be[n], !r && nr(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || R0(n);
  return t;
}
function L0(e, t, n) {
  var r = "", i = e.tag, o, s, a;
  for (o = 0, s = n.length; o < s; o += 1)
    a = n[o], e.replacer && (a = e.replacer.call(n, String(o), a)), (ct(e, t, a, !1, !1) || typeof a > "u" && ct(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function Ka(e, t, n, r) {
  var i = "", o = e.tag, s, a, l;
  for (s = 0, a = n.length; s < a; s += 1)
    l = n[s], e.replacer && (l = e.replacer.call(n, String(s), l)), (ct(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && ct(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += Yo(e, t)), e.dump && er === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function k0(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), s, a, l, d, c;
  for (s = 0, a = o.length; s < a; s += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[s], d = n[l], e.replacer && (d = e.replacer.call(n, l, d)), ct(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), ct(e, t, d, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function x0(e, t, n, r) {
  var i = "", o = e.tag, s = Object.keys(n), a, l, d, c, u, h;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new mr("sortKeys must be a boolean or a function");
  for (a = 0, l = s.length; a < l; a += 1)
    h = "", (!r || i !== "") && (h += Yo(e, t)), d = s[a], c = n[d], e.replacer && (c = e.replacer.call(n, d, c)), ct(e, t + 1, d, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && er === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, u && (h += Yo(e, t)), ct(e, t + 1, c, !0, u) && (e.dump && er === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function Ja(e, t, n) {
  var r, i, o, s, a, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, s = i.length; o < s; o += 1)
    if (a = i[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (n ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (l = e.styleMap[a.tag] || a.defaultStyle, Wu.call(a.represent) === "[object Function]")
          r = a.represent(t, l);
        else if (zu.call(a.represent, l))
          r = a.represent[l](t, l);
        else
          throw new mr("!<" + a.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function ct(e, t, n, r, i, o, s) {
  e.tag = null, e.dump = n, Ja(e, n, !1) || Ja(e, n, !0);
  var a = Wu.call(e.dump), l = r, d;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = a === "[object Object]" || a === "[object Array]", u, h;
  if (c && (u = e.duplicates.indexOf(n), h = u !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (c && h && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), a === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (x0(e, t, e.dump, i), h && (e.dump = "&ref_" + u + e.dump)) : (k0(e, t, e.dump), h && (e.dump = "&ref_" + u + " " + e.dump));
    else if (a === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? Ka(e, t - 1, e.dump, i) : Ka(e, t, e.dump, i), h && (e.dump = "&ref_" + u + e.dump)) : (L0(e, t, e.dump), h && (e.dump = "&ref_" + u + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && D0(e, e.dump, t, o, l);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new mr("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (d = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? d = "!" + d : d.slice(0, 18) === "tag:yaml.org,2002:" ? d = "!!" + d.slice(18) : d = "!<" + d + ">", e.dump = d + " " + e.dump);
  }
  return !0;
}
function U0(e, t) {
  var n = [], r = [], i, o;
  for (Vo(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function Vo(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Vo(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        Vo(e[r[i]], t, n);
}
function M0(e, t) {
  t = t || {};
  var n = new I0(t);
  n.noRefs || U0(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), ct(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
Vu.dump = M0;
var sf = ms, B0 = Vu;
function Ts(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Te.Type = Fe;
Te.Schema = yu;
Te.FAILSAFE_SCHEMA = wu;
Te.JSON_SCHEMA = Iu;
Te.CORE_SCHEMA = bu;
Te.DEFAULT_SCHEMA = Es;
Te.load = sf.load;
Te.loadAll = sf.loadAll;
Te.dump = B0.dump;
Te.YAMLException = gr;
Te.types = {
  binary: Pu,
  float: Cu,
  map: vu,
  null: Tu,
  pairs: Lu,
  set: ku,
  timestamp: $u,
  bool: Su,
  int: Au,
  merge: Du,
  omap: Fu,
  seq: _u,
  str: Eu
};
Te.safeLoad = Ts("safeLoad", "load");
Te.safeLoadAll = Ts("safeLoadAll", "loadAll");
Te.safeDump = Ts("safeDump", "dump");
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.Lazy = void 0;
class H0 {
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
Ii.Lazy = H0;
var Wo = { exports: {} };
const j0 = "2.0.0", af = 256, q0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, G0 = 16, Y0 = af - 6, X0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var bi = {
  MAX_LENGTH: af,
  MAX_SAFE_COMPONENT_LENGTH: G0,
  MAX_SAFE_BUILD_LENGTH: Y0,
  MAX_SAFE_INTEGER: q0,
  RELEASE_TYPES: X0,
  SEMVER_SPEC_VERSION: j0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const V0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Oi = V0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = bi, o = Oi;
  t = e.exports = {};
  const s = t.re = [], a = t.safeRe = [], l = t.src = [], d = t.safeSrc = [], c = t.t = {};
  let u = 0;
  const h = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [h, r]
  ], E = (T) => {
    for (const [A, R] of g)
      T = T.split(`${A}*`).join(`${A}{0,${R}}`).split(`${A}+`).join(`${A}{1,${R}}`);
    return T;
  }, _ = (T, A, R) => {
    const P = E(A), k = u++;
    o(T, k, A), c[T] = k, l[k] = A, d[k] = P, s[k] = new RegExp(A, R ? "g" : void 0), a[k] = new RegExp(P, R ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), _("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${h}+`), _("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), _("FULL", `^${l[c.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), _("LOOSE", `^${l[c.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), _("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), _("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", l[c.COERCE], !0), _("COERCERTLFULL", l[c.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Wo, Wo.exports);
var yr = Wo.exports;
const W0 = Object.freeze({ loose: !0 }), z0 = Object.freeze({}), K0 = (e) => e ? typeof e != "object" ? W0 : e : z0;
var Ss = K0;
const Qa = /^[0-9]+$/, lf = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = Qa.test(e), r = Qa.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, J0 = (e, t) => lf(t, e);
var cf = {
  compareIdentifiers: lf,
  rcompareIdentifiers: J0
};
const jr = Oi, { MAX_LENGTH: Za, MAX_SAFE_INTEGER: qr } = bi, { safeRe: Gr, t: Yr } = yr, Q0 = Ss, { compareIdentifiers: po } = cf;
let Z0 = class tt {
  constructor(t, n) {
    if (n = Q0(n), t instanceof tt) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Za)
      throw new TypeError(
        `version is longer than ${Za} characters`
      );
    jr("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? Gr[Yr.LOOSE] : Gr[Yr.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > qr || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > qr || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > qr || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < qr)
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
    if (jr("SemVer.compare", this.version, this.options, t), !(t instanceof tt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new tt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof tt || (t = new tt(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof tt || (t = new tt(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (jr("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return po(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof tt || (t = new tt(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (jr("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return po(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? Gr[Yr.PRERELEASELOOSE] : Gr[Yr.PRERELEASE]);
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
          r === !1 && (o = [n]), po(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Le = Z0;
const el = Le, eE = (e, t, n = !1) => {
  if (e instanceof el)
    return e;
  try {
    return new el(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var Sn = eE;
const tE = Sn, nE = (e, t) => {
  const n = tE(e, t);
  return n ? n.version : null;
};
var rE = nE;
const iE = Sn, oE = (e, t) => {
  const n = iE(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var sE = oE;
const tl = Le, aE = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new tl(
      e instanceof tl ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var lE = aE;
const nl = Sn, cE = (e, t) => {
  const n = nl(e, null, !0), r = nl(t, null, !0), i = n.compare(r);
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
var uE = cE;
const fE = Le, dE = (e, t) => new fE(e, t).major;
var hE = dE;
const pE = Le, gE = (e, t) => new pE(e, t).minor;
var mE = gE;
const yE = Le, EE = (e, t) => new yE(e, t).patch;
var _E = EE;
const vE = Sn, wE = (e, t) => {
  const n = vE(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var TE = wE;
const rl = Le, SE = (e, t, n) => new rl(e, n).compare(new rl(t, n));
var Je = SE;
const AE = Je, RE = (e, t, n) => AE(t, e, n);
var CE = RE;
const IE = Je, bE = (e, t) => IE(e, t, !0);
var OE = bE;
const il = Le, NE = (e, t, n) => {
  const r = new il(e, n), i = new il(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var As = NE;
const $E = As, DE = (e, t) => e.sort((n, r) => $E(n, r, t));
var PE = DE;
const FE = As, LE = (e, t) => e.sort((n, r) => FE(r, n, t));
var kE = LE;
const xE = Je, UE = (e, t, n) => xE(e, t, n) > 0;
var Ni = UE;
const ME = Je, BE = (e, t, n) => ME(e, t, n) < 0;
var Rs = BE;
const HE = Je, jE = (e, t, n) => HE(e, t, n) === 0;
var uf = jE;
const qE = Je, GE = (e, t, n) => qE(e, t, n) !== 0;
var ff = GE;
const YE = Je, XE = (e, t, n) => YE(e, t, n) >= 0;
var Cs = XE;
const VE = Je, WE = (e, t, n) => VE(e, t, n) <= 0;
var Is = WE;
const zE = uf, KE = ff, JE = Ni, QE = Cs, ZE = Rs, e_ = Is, t_ = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return zE(e, n, r);
    case "!=":
      return KE(e, n, r);
    case ">":
      return JE(e, n, r);
    case ">=":
      return QE(e, n, r);
    case "<":
      return ZE(e, n, r);
    case "<=":
      return e_(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var df = t_;
const n_ = Le, r_ = Sn, { safeRe: Xr, t: Vr } = yr, i_ = (e, t) => {
  if (e instanceof n_)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? Xr[Vr.COERCEFULL] : Xr[Vr.COERCE]);
  else {
    const l = t.includePrerelease ? Xr[Vr.COERCERTLFULL] : Xr[Vr.COERCERTL];
    let d;
    for (; (d = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || d.index + d[0].length !== n.index + n[0].length) && (n = d), l.lastIndex = d.index + d[1].length + d[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", s = t.includePrerelease && n[5] ? `-${n[5]}` : "", a = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return r_(`${r}.${i}.${o}${s}${a}`, t);
};
var o_ = i_;
class s_ {
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
var a_ = s_, go, ol;
function Qe() {
  if (ol) return go;
  ol = 1;
  const e = /\s+/g;
  class t {
    constructor(b, D) {
      if (D = i(D), b instanceof t)
        return b.loose === !!D.loose && b.includePrerelease === !!D.includePrerelease ? b : new t(b.raw, D);
      if (b instanceof o)
        return this.raw = b.value, this.set = [[b]], this.formatted = void 0, this;
      if (this.options = D, this.loose = !!D.loose, this.includePrerelease = !!D.includePrerelease, this.raw = b.trim().replace(e, " "), this.set = this.raw.split("||").map((I) => this.parseRange(I.trim())).filter((I) => I.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const I = this.set[0];
        if (this.set = this.set.filter((F) => !_(F[0])), this.set.length === 0)
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
        for (let b = 0; b < this.set.length; b++) {
          b > 0 && (this.formatted += "||");
          const D = this.set[b];
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
    parseRange(b) {
      const I = ((this.options.includePrerelease && g) | (this.options.loose && E)) + ":" + b, F = r.get(I);
      if (F)
        return F;
      const $ = this.options.loose, H = $ ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      b = b.replace(H, j(this.options.includePrerelease)), s("hyphen replace", b), b = b.replace(l[d.COMPARATORTRIM], c), s("comparator trim", b), b = b.replace(l[d.TILDETRIM], u), s("tilde trim", b), b = b.replace(l[d.CARETTRIM], h), s("caret trim", b);
      let W = b.split(" ").map((B) => R(B, this.options)).join(" ").split(/\s+/).map((B) => G(B, this.options));
      $ && (W = W.filter((B) => (s("loose invalid filter", B, this.options), !!B.match(l[d.COMPARATORLOOSE])))), s("range list", W);
      const Y = /* @__PURE__ */ new Map(), ee = W.map((B) => new o(B, this.options));
      for (const B of ee) {
        if (_(B))
          return [B];
        Y.set(B.value, B);
      }
      Y.size > 1 && Y.has("") && Y.delete("");
      const he = [...Y.values()];
      return r.set(I, he), he;
    }
    intersects(b, D) {
      if (!(b instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((I) => A(I, D) && b.set.some((F) => A(F, D) && I.every(($) => F.every((H) => $.intersects(H, D)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(b) {
      if (!b)
        return !1;
      if (typeof b == "string")
        try {
          b = new a(b, this.options);
        } catch {
          return !1;
        }
      for (let D = 0; D < this.set.length; D++)
        if (Z(this.set[D], b, this.options))
          return !0;
      return !1;
    }
  }
  go = t;
  const n = a_, r = new n(), i = Ss, o = $i(), s = Oi, a = Le, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: c,
    tildeTrimReplace: u,
    caretTrimReplace: h
  } = yr, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: E } = bi, _ = (N) => N.value === "<0.0.0-0", T = (N) => N.value === "", A = (N, b) => {
    let D = !0;
    const I = N.slice();
    let F = I.pop();
    for (; D && I.length; )
      D = I.every(($) => F.intersects($, b)), F = I.pop();
    return D;
  }, R = (N, b) => (N = N.replace(l[d.BUILD], ""), s("comp", N, b), N = U(N, b), s("caret", N), N = k(N, b), s("tildes", N), N = Me(N, b), s("xrange", N), N = V(N, b), s("stars", N), N), P = (N) => !N || N.toLowerCase() === "x" || N === "*", k = (N, b) => N.trim().split(/\s+/).map((D) => Q(D, b)).join(" "), Q = (N, b) => {
    const D = b.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return N.replace(D, (I, F, $, H, W) => {
      s("tilde", N, I, F, $, H, W);
      let Y;
      return P(F) ? Y = "" : P($) ? Y = `>=${F}.0.0 <${+F + 1}.0.0-0` : P(H) ? Y = `>=${F}.${$}.0 <${F}.${+$ + 1}.0-0` : W ? (s("replaceTilde pr", W), Y = `>=${F}.${$}.${H}-${W} <${F}.${+$ + 1}.0-0`) : Y = `>=${F}.${$}.${H} <${F}.${+$ + 1}.0-0`, s("tilde return", Y), Y;
    });
  }, U = (N, b) => N.trim().split(/\s+/).map((D) => q(D, b)).join(" "), q = (N, b) => {
    s("caret", N, b);
    const D = b.loose ? l[d.CARETLOOSE] : l[d.CARET], I = b.includePrerelease ? "-0" : "";
    return N.replace(D, (F, $, H, W, Y) => {
      s("caret", N, F, $, H, W, Y);
      let ee;
      return P($) ? ee = "" : P(H) ? ee = `>=${$}.0.0${I} <${+$ + 1}.0.0-0` : P(W) ? $ === "0" ? ee = `>=${$}.${H}.0${I} <${$}.${+H + 1}.0-0` : ee = `>=${$}.${H}.0${I} <${+$ + 1}.0.0-0` : Y ? (s("replaceCaret pr", Y), $ === "0" ? H === "0" ? ee = `>=${$}.${H}.${W}-${Y} <${$}.${H}.${+W + 1}-0` : ee = `>=${$}.${H}.${W}-${Y} <${$}.${+H + 1}.0-0` : ee = `>=${$}.${H}.${W}-${Y} <${+$ + 1}.0.0-0`) : (s("no pr"), $ === "0" ? H === "0" ? ee = `>=${$}.${H}.${W}${I} <${$}.${H}.${+W + 1}-0` : ee = `>=${$}.${H}.${W}${I} <${$}.${+H + 1}.0-0` : ee = `>=${$}.${H}.${W} <${+$ + 1}.0.0-0`), s("caret return", ee), ee;
    });
  }, Me = (N, b) => (s("replaceXRanges", N, b), N.split(/\s+/).map((D) => y(D, b)).join(" ")), y = (N, b) => {
    N = N.trim();
    const D = b.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return N.replace(D, (I, F, $, H, W, Y) => {
      s("xRange", N, I, F, $, H, W, Y);
      const ee = P($), he = ee || P(H), B = he || P(W), Ze = B;
      return F === "=" && Ze && (F = ""), Y = b.includePrerelease ? "-0" : "", ee ? F === ">" || F === "<" ? I = "<0.0.0-0" : I = "*" : F && Ze ? (he && (H = 0), W = 0, F === ">" ? (F = ">=", he ? ($ = +$ + 1, H = 0, W = 0) : (H = +H + 1, W = 0)) : F === "<=" && (F = "<", he ? $ = +$ + 1 : H = +H + 1), F === "<" && (Y = "-0"), I = `${F + $}.${H}.${W}${Y}`) : he ? I = `>=${$}.0.0${Y} <${+$ + 1}.0.0-0` : B && (I = `>=${$}.${H}.0${Y} <${$}.${+H + 1}.0-0`), s("xRange return", I), I;
    });
  }, V = (N, b) => (s("replaceStars", N, b), N.trim().replace(l[d.STAR], "")), G = (N, b) => (s("replaceGTE0", N, b), N.trim().replace(l[b.includePrerelease ? d.GTE0PRE : d.GTE0], "")), j = (N) => (b, D, I, F, $, H, W, Y, ee, he, B, Ze) => (P(I) ? D = "" : P(F) ? D = `>=${I}.0.0${N ? "-0" : ""}` : P($) ? D = `>=${I}.${F}.0${N ? "-0" : ""}` : H ? D = `>=${D}` : D = `>=${D}${N ? "-0" : ""}`, P(ee) ? Y = "" : P(he) ? Y = `<${+ee + 1}.0.0-0` : P(B) ? Y = `<${ee}.${+he + 1}.0-0` : Ze ? Y = `<=${ee}.${he}.${B}-${Ze}` : N ? Y = `<${ee}.${he}.${+B + 1}-0` : Y = `<=${Y}`, `${D} ${Y}`.trim()), Z = (N, b, D) => {
    for (let I = 0; I < N.length; I++)
      if (!N[I].test(b))
        return !1;
    if (b.prerelease.length && !D.includePrerelease) {
      for (let I = 0; I < N.length; I++)
        if (s(N[I].semver), N[I].semver !== o.ANY && N[I].semver.prerelease.length > 0) {
          const F = N[I].semver;
          if (F.major === b.major && F.minor === b.minor && F.patch === b.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return go;
}
var mo, sl;
function $i() {
  if (sl) return mo;
  sl = 1;
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
  mo = t;
  const n = Ss, { safeRe: r, t: i } = yr, o = df, s = Oi, a = Le, l = Qe();
  return mo;
}
const l_ = Qe(), c_ = (e, t, n) => {
  try {
    t = new l_(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Di = c_;
const u_ = Qe(), f_ = (e, t) => new u_(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var d_ = f_;
const h_ = Le, p_ = Qe(), g_ = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new p_(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === -1) && (r = s, i = new h_(r, n));
  }), r;
};
var m_ = g_;
const y_ = Le, E_ = Qe(), __ = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new E_(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === 1) && (r = s, i = new y_(r, n));
  }), r;
};
var v_ = __;
const yo = Le, w_ = Qe(), al = Ni, T_ = (e, t) => {
  e = new w_(e, t);
  let n = new yo("0.0.0");
  if (e.test(n) || (n = new yo("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((s) => {
      const a = new yo(s.semver.version);
      switch (s.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!o || al(a, o)) && (o = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), o && (!n || al(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var S_ = T_;
const A_ = Qe(), R_ = (e, t) => {
  try {
    return new A_(e, t).range || "*";
  } catch {
    return null;
  }
};
var C_ = R_;
const I_ = Le, hf = $i(), { ANY: b_ } = hf, O_ = Qe(), N_ = Di, ll = Ni, cl = Rs, $_ = Is, D_ = Cs, P_ = (e, t, n, r) => {
  e = new I_(e, r), t = new O_(t, r);
  let i, o, s, a, l;
  switch (n) {
    case ">":
      i = ll, o = $_, s = cl, a = ">", l = ">=";
      break;
    case "<":
      i = cl, o = D_, s = ll, a = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (N_(e, t, r))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const c = t.set[d];
    let u = null, h = null;
    if (c.forEach((g) => {
      g.semver === b_ && (g = new hf(">=0.0.0")), u = u || g, h = h || g, i(g.semver, u.semver, r) ? u = g : s(g.semver, h.semver, r) && (h = g);
    }), u.operator === a || u.operator === l || (!h.operator || h.operator === a) && o(e, h.semver))
      return !1;
    if (h.operator === l && s(e, h.semver))
      return !1;
  }
  return !0;
};
var bs = P_;
const F_ = bs, L_ = (e, t, n) => F_(e, t, ">", n);
var k_ = L_;
const x_ = bs, U_ = (e, t, n) => x_(e, t, "<", n);
var M_ = U_;
const ul = Qe(), B_ = (e, t, n) => (e = new ul(e, n), t = new ul(t, n), e.intersects(t, n));
var H_ = B_;
const j_ = Di, q_ = Je;
var G_ = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const s = e.sort((c, u) => q_(c, u, n));
  for (const c of s)
    j_(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const a = [];
  for (const [c, u] of r)
    c === u ? a.push(c) : !u && c === s[0] ? a.push("*") : u ? c === s[0] ? a.push(`<=${u}`) : a.push(`${c} - ${u}`) : a.push(`>=${c}`);
  const l = a.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const fl = Qe(), Os = $i(), { ANY: Eo } = Os, Ln = Di, Ns = Je, Y_ = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new fl(e, n), t = new fl(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const s = V_(i, o, n);
      if (r = r || s !== null, s)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, X_ = [new Os(">=0.0.0-0")], dl = [new Os(">=0.0.0")], V_ = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Eo) {
    if (t.length === 1 && t[0].semver === Eo)
      return !0;
    n.includePrerelease ? e = X_ : e = dl;
  }
  if (t.length === 1 && t[0].semver === Eo) {
    if (n.includePrerelease)
      return !0;
    t = dl;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = hl(i, g, n) : g.operator === "<" || g.operator === "<=" ? o = pl(o, g, n) : r.add(g.semver);
  if (r.size > 1)
    return null;
  let s;
  if (i && o) {
    if (s = Ns(i.semver, o.semver, n), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of r) {
    if (i && !Ln(g, String(i), n) || o && !Ln(g, String(o), n))
      return null;
    for (const E of t)
      if (!Ln(g, String(E), n))
        return !1;
    return !0;
  }
  let a, l, d, c, u = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  u && u.prerelease.length === 1 && o.operator === "<" && u.prerelease[0] === 0 && (u = !1);
  for (const g of t) {
    if (c = c || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", i) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === ">" || g.operator === ">=") {
        if (a = hl(i, g, n), a === g && a !== i)
          return !1;
      } else if (i.operator === ">=" && !Ln(i.semver, String(g), n))
        return !1;
    }
    if (o) {
      if (u && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === u.major && g.semver.minor === u.minor && g.semver.patch === u.patch && (u = !1), g.operator === "<" || g.operator === "<=") {
        if (l = pl(o, g, n), l === g && l !== o)
          return !1;
      } else if (o.operator === "<=" && !Ln(o.semver, String(g), n))
        return !1;
    }
    if (!g.operator && (o || i) && s !== 0)
      return !1;
  }
  return !(i && d && !o && s !== 0 || o && c && !i && s !== 0 || h || u);
}, hl = (e, t, n) => {
  if (!e)
    return t;
  const r = Ns(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, pl = (e, t, n) => {
  if (!e)
    return t;
  const r = Ns(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var W_ = Y_;
const _o = yr, gl = bi, z_ = Le, ml = cf, K_ = Sn, J_ = rE, Q_ = sE, Z_ = lE, ev = uE, tv = hE, nv = mE, rv = _E, iv = TE, ov = Je, sv = CE, av = OE, lv = As, cv = PE, uv = kE, fv = Ni, dv = Rs, hv = uf, pv = ff, gv = Cs, mv = Is, yv = df, Ev = o_, _v = $i(), vv = Qe(), wv = Di, Tv = d_, Sv = m_, Av = v_, Rv = S_, Cv = C_, Iv = bs, bv = k_, Ov = M_, Nv = H_, $v = G_, Dv = W_;
var pf = {
  parse: K_,
  valid: J_,
  clean: Q_,
  inc: Z_,
  diff: ev,
  major: tv,
  minor: nv,
  patch: rv,
  prerelease: iv,
  compare: ov,
  rcompare: sv,
  compareLoose: av,
  compareBuild: lv,
  sort: cv,
  rsort: uv,
  gt: fv,
  lt: dv,
  eq: hv,
  neq: pv,
  gte: gv,
  lte: mv,
  cmp: yv,
  coerce: Ev,
  Comparator: _v,
  Range: vv,
  satisfies: wv,
  toComparators: Tv,
  maxSatisfying: Sv,
  minSatisfying: Av,
  minVersion: Rv,
  validRange: Cv,
  outside: Iv,
  gtr: bv,
  ltr: Ov,
  intersects: Nv,
  simplifyRange: $v,
  subset: Dv,
  SemVer: z_,
  re: _o.re,
  src: _o.src,
  tokens: _o.t,
  SEMVER_SPEC_VERSION: gl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: gl.RELEASE_TYPES,
  compareIdentifiers: ml.compareIdentifiers,
  rcompareIdentifiers: ml.rcompareIdentifiers
}, Er = {}, gi = { exports: {} };
gi.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, s = 9007199254740991, a = "[object Arguments]", l = "[object Array]", d = "[object AsyncFunction]", c = "[object Boolean]", u = "[object Date]", h = "[object Error]", g = "[object Function]", E = "[object GeneratorFunction]", _ = "[object Map]", T = "[object Number]", A = "[object Null]", R = "[object Object]", P = "[object Promise]", k = "[object Proxy]", Q = "[object RegExp]", U = "[object Set]", q = "[object String]", Me = "[object Symbol]", y = "[object Undefined]", V = "[object WeakMap]", G = "[object ArrayBuffer]", j = "[object DataView]", Z = "[object Float32Array]", N = "[object Float64Array]", b = "[object Int8Array]", D = "[object Int16Array]", I = "[object Int32Array]", F = "[object Uint8Array]", $ = "[object Uint8ClampedArray]", H = "[object Uint16Array]", W = "[object Uint32Array]", Y = /[\\^$.*+?()[\]{}|]/g, ee = /^\[object .+?Constructor\]$/, he = /^(?:0|[1-9]\d*)$/, B = {};
  B[Z] = B[N] = B[b] = B[D] = B[I] = B[F] = B[$] = B[H] = B[W] = !0, B[a] = B[l] = B[G] = B[c] = B[j] = B[u] = B[h] = B[g] = B[_] = B[T] = B[R] = B[Q] = B[U] = B[q] = B[V] = !1;
  var Ze = typeof Ne == "object" && Ne && Ne.Object === Object && Ne, p = typeof self == "object" && self && self.Object === Object && self, f = Ze || p || Function("return this")(), C = t && !t.nodeType && t, w = C && !0 && e && !e.nodeType && e, J = w && w.exports === C, ne = J && Ze.process, ae = function() {
    try {
      return ne && ne.binding && ne.binding("util");
    } catch {
    }
  }(), _e = ae && ae.isTypedArray;
  function Se(m, v) {
    for (var O = -1, L = m == null ? 0 : m.length, re = 0, X = []; ++O < L; ) {
      var le = m[O];
      v(le, O, m) && (X[re++] = le);
    }
    return X;
  }
  function ft(m, v) {
    for (var O = -1, L = v.length, re = m.length; ++O < L; )
      m[re + O] = v[O];
    return m;
  }
  function fe(m, v) {
    for (var O = -1, L = m == null ? 0 : m.length; ++O < L; )
      if (v(m[O], O, m))
        return !0;
    return !1;
  }
  function Xe(m, v) {
    for (var O = -1, L = Array(m); ++O < m; )
      L[O] = v(O);
    return L;
  }
  function Xi(m) {
    return function(v) {
      return m(v);
    };
  }
  function Rr(m, v) {
    return m.has(v);
  }
  function In(m, v) {
    return m == null ? void 0 : m[v];
  }
  function Cr(m) {
    var v = -1, O = Array(m.size);
    return m.forEach(function(L, re) {
      O[++v] = [re, L];
    }), O;
  }
  function Mf(m, v) {
    return function(O) {
      return m(v(O));
    };
  }
  function Bf(m) {
    var v = -1, O = Array(m.size);
    return m.forEach(function(L) {
      O[++v] = L;
    }), O;
  }
  var Hf = Array.prototype, jf = Function.prototype, Ir = Object.prototype, Vi = f["__core-js_shared__"], Ms = jf.toString, et = Ir.hasOwnProperty, Bs = function() {
    var m = /[^.]+$/.exec(Vi && Vi.keys && Vi.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), Hs = Ir.toString, qf = RegExp(
    "^" + Ms.call(et).replace(Y, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), js = J ? f.Buffer : void 0, br = f.Symbol, qs = f.Uint8Array, Gs = Ir.propertyIsEnumerable, Gf = Hf.splice, Pt = br ? br.toStringTag : void 0, Ys = Object.getOwnPropertySymbols, Yf = js ? js.isBuffer : void 0, Xf = Mf(Object.keys, Object), Wi = Qt(f, "DataView"), bn = Qt(f, "Map"), zi = Qt(f, "Promise"), Ki = Qt(f, "Set"), Ji = Qt(f, "WeakMap"), On = Qt(Object, "create"), Vf = kt(Wi), Wf = kt(bn), zf = kt(zi), Kf = kt(Ki), Jf = kt(Ji), Xs = br ? br.prototype : void 0, Qi = Xs ? Xs.valueOf : void 0;
  function Ft(m) {
    var v = -1, O = m == null ? 0 : m.length;
    for (this.clear(); ++v < O; ) {
      var L = m[v];
      this.set(L[0], L[1]);
    }
  }
  function Qf() {
    this.__data__ = On ? On(null) : {}, this.size = 0;
  }
  function Zf(m) {
    var v = this.has(m) && delete this.__data__[m];
    return this.size -= v ? 1 : 0, v;
  }
  function ed(m) {
    var v = this.__data__;
    if (On) {
      var O = v[m];
      return O === r ? void 0 : O;
    }
    return et.call(v, m) ? v[m] : void 0;
  }
  function td(m) {
    var v = this.__data__;
    return On ? v[m] !== void 0 : et.call(v, m);
  }
  function nd(m, v) {
    var O = this.__data__;
    return this.size += this.has(m) ? 0 : 1, O[m] = On && v === void 0 ? r : v, this;
  }
  Ft.prototype.clear = Qf, Ft.prototype.delete = Zf, Ft.prototype.get = ed, Ft.prototype.has = td, Ft.prototype.set = nd;
  function ot(m) {
    var v = -1, O = m == null ? 0 : m.length;
    for (this.clear(); ++v < O; ) {
      var L = m[v];
      this.set(L[0], L[1]);
    }
  }
  function rd() {
    this.__data__ = [], this.size = 0;
  }
  function id(m) {
    var v = this.__data__, O = Nr(v, m);
    if (O < 0)
      return !1;
    var L = v.length - 1;
    return O == L ? v.pop() : Gf.call(v, O, 1), --this.size, !0;
  }
  function od(m) {
    var v = this.__data__, O = Nr(v, m);
    return O < 0 ? void 0 : v[O][1];
  }
  function sd(m) {
    return Nr(this.__data__, m) > -1;
  }
  function ad(m, v) {
    var O = this.__data__, L = Nr(O, m);
    return L < 0 ? (++this.size, O.push([m, v])) : O[L][1] = v, this;
  }
  ot.prototype.clear = rd, ot.prototype.delete = id, ot.prototype.get = od, ot.prototype.has = sd, ot.prototype.set = ad;
  function Lt(m) {
    var v = -1, O = m == null ? 0 : m.length;
    for (this.clear(); ++v < O; ) {
      var L = m[v];
      this.set(L[0], L[1]);
    }
  }
  function ld() {
    this.size = 0, this.__data__ = {
      hash: new Ft(),
      map: new (bn || ot)(),
      string: new Ft()
    };
  }
  function cd(m) {
    var v = $r(this, m).delete(m);
    return this.size -= v ? 1 : 0, v;
  }
  function ud(m) {
    return $r(this, m).get(m);
  }
  function fd(m) {
    return $r(this, m).has(m);
  }
  function dd(m, v) {
    var O = $r(this, m), L = O.size;
    return O.set(m, v), this.size += O.size == L ? 0 : 1, this;
  }
  Lt.prototype.clear = ld, Lt.prototype.delete = cd, Lt.prototype.get = ud, Lt.prototype.has = fd, Lt.prototype.set = dd;
  function Or(m) {
    var v = -1, O = m == null ? 0 : m.length;
    for (this.__data__ = new Lt(); ++v < O; )
      this.add(m[v]);
  }
  function hd(m) {
    return this.__data__.set(m, r), this;
  }
  function pd(m) {
    return this.__data__.has(m);
  }
  Or.prototype.add = Or.prototype.push = hd, Or.prototype.has = pd;
  function dt(m) {
    var v = this.__data__ = new ot(m);
    this.size = v.size;
  }
  function gd() {
    this.__data__ = new ot(), this.size = 0;
  }
  function md(m) {
    var v = this.__data__, O = v.delete(m);
    return this.size = v.size, O;
  }
  function yd(m) {
    return this.__data__.get(m);
  }
  function Ed(m) {
    return this.__data__.has(m);
  }
  function _d(m, v) {
    var O = this.__data__;
    if (O instanceof ot) {
      var L = O.__data__;
      if (!bn || L.length < n - 1)
        return L.push([m, v]), this.size = ++O.size, this;
      O = this.__data__ = new Lt(L);
    }
    return O.set(m, v), this.size = O.size, this;
  }
  dt.prototype.clear = gd, dt.prototype.delete = md, dt.prototype.get = yd, dt.prototype.has = Ed, dt.prototype.set = _d;
  function vd(m, v) {
    var O = Dr(m), L = !O && Ld(m), re = !O && !L && Zi(m), X = !O && !L && !re && ta(m), le = O || L || re || X, pe = le ? Xe(m.length, String) : [], ve = pe.length;
    for (var ie in m)
      et.call(m, ie) && !(le && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      re && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      X && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      Nd(ie, ve))) && pe.push(ie);
    return pe;
  }
  function Nr(m, v) {
    for (var O = m.length; O--; )
      if (Js(m[O][0], v))
        return O;
    return -1;
  }
  function wd(m, v, O) {
    var L = v(m);
    return Dr(m) ? L : ft(L, O(m));
  }
  function Nn(m) {
    return m == null ? m === void 0 ? y : A : Pt && Pt in Object(m) ? bd(m) : Fd(m);
  }
  function Vs(m) {
    return $n(m) && Nn(m) == a;
  }
  function Ws(m, v, O, L, re) {
    return m === v ? !0 : m == null || v == null || !$n(m) && !$n(v) ? m !== m && v !== v : Td(m, v, O, L, Ws, re);
  }
  function Td(m, v, O, L, re, X) {
    var le = Dr(m), pe = Dr(v), ve = le ? l : ht(m), ie = pe ? l : ht(v);
    ve = ve == a ? R : ve, ie = ie == a ? R : ie;
    var Be = ve == R, Ve = ie == R, Ae = ve == ie;
    if (Ae && Zi(m)) {
      if (!Zi(v))
        return !1;
      le = !0, Be = !1;
    }
    if (Ae && !Be)
      return X || (X = new dt()), le || ta(m) ? zs(m, v, O, L, re, X) : Cd(m, v, ve, O, L, re, X);
    if (!(O & i)) {
      var He = Be && et.call(m, "__wrapped__"), je = Ve && et.call(v, "__wrapped__");
      if (He || je) {
        var pt = He ? m.value() : m, st = je ? v.value() : v;
        return X || (X = new dt()), re(pt, st, O, L, X);
      }
    }
    return Ae ? (X || (X = new dt()), Id(m, v, O, L, re, X)) : !1;
  }
  function Sd(m) {
    if (!ea(m) || Dd(m))
      return !1;
    var v = Qs(m) ? qf : ee;
    return v.test(kt(m));
  }
  function Ad(m) {
    return $n(m) && Zs(m.length) && !!B[Nn(m)];
  }
  function Rd(m) {
    if (!Pd(m))
      return Xf(m);
    var v = [];
    for (var O in Object(m))
      et.call(m, O) && O != "constructor" && v.push(O);
    return v;
  }
  function zs(m, v, O, L, re, X) {
    var le = O & i, pe = m.length, ve = v.length;
    if (pe != ve && !(le && ve > pe))
      return !1;
    var ie = X.get(m);
    if (ie && X.get(v))
      return ie == v;
    var Be = -1, Ve = !0, Ae = O & o ? new Or() : void 0;
    for (X.set(m, v), X.set(v, m); ++Be < pe; ) {
      var He = m[Be], je = v[Be];
      if (L)
        var pt = le ? L(je, He, Be, v, m, X) : L(He, je, Be, m, v, X);
      if (pt !== void 0) {
        if (pt)
          continue;
        Ve = !1;
        break;
      }
      if (Ae) {
        if (!fe(v, function(st, xt) {
          if (!Rr(Ae, xt) && (He === st || re(He, st, O, L, X)))
            return Ae.push(xt);
        })) {
          Ve = !1;
          break;
        }
      } else if (!(He === je || re(He, je, O, L, X))) {
        Ve = !1;
        break;
      }
    }
    return X.delete(m), X.delete(v), Ve;
  }
  function Cd(m, v, O, L, re, X, le) {
    switch (O) {
      case j:
        if (m.byteLength != v.byteLength || m.byteOffset != v.byteOffset)
          return !1;
        m = m.buffer, v = v.buffer;
      case G:
        return !(m.byteLength != v.byteLength || !X(new qs(m), new qs(v)));
      case c:
      case u:
      case T:
        return Js(+m, +v);
      case h:
        return m.name == v.name && m.message == v.message;
      case Q:
      case q:
        return m == v + "";
      case _:
        var pe = Cr;
      case U:
        var ve = L & i;
        if (pe || (pe = Bf), m.size != v.size && !ve)
          return !1;
        var ie = le.get(m);
        if (ie)
          return ie == v;
        L |= o, le.set(m, v);
        var Be = zs(pe(m), pe(v), L, re, X, le);
        return le.delete(m), Be;
      case Me:
        if (Qi)
          return Qi.call(m) == Qi.call(v);
    }
    return !1;
  }
  function Id(m, v, O, L, re, X) {
    var le = O & i, pe = Ks(m), ve = pe.length, ie = Ks(v), Be = ie.length;
    if (ve != Be && !le)
      return !1;
    for (var Ve = ve; Ve--; ) {
      var Ae = pe[Ve];
      if (!(le ? Ae in v : et.call(v, Ae)))
        return !1;
    }
    var He = X.get(m);
    if (He && X.get(v))
      return He == v;
    var je = !0;
    X.set(m, v), X.set(v, m);
    for (var pt = le; ++Ve < ve; ) {
      Ae = pe[Ve];
      var st = m[Ae], xt = v[Ae];
      if (L)
        var na = le ? L(xt, st, Ae, v, m, X) : L(st, xt, Ae, m, v, X);
      if (!(na === void 0 ? st === xt || re(st, xt, O, L, X) : na)) {
        je = !1;
        break;
      }
      pt || (pt = Ae == "constructor");
    }
    if (je && !pt) {
      var Pr = m.constructor, Fr = v.constructor;
      Pr != Fr && "constructor" in m && "constructor" in v && !(typeof Pr == "function" && Pr instanceof Pr && typeof Fr == "function" && Fr instanceof Fr) && (je = !1);
    }
    return X.delete(m), X.delete(v), je;
  }
  function Ks(m) {
    return wd(m, Ud, Od);
  }
  function $r(m, v) {
    var O = m.__data__;
    return $d(v) ? O[typeof v == "string" ? "string" : "hash"] : O.map;
  }
  function Qt(m, v) {
    var O = In(m, v);
    return Sd(O) ? O : void 0;
  }
  function bd(m) {
    var v = et.call(m, Pt), O = m[Pt];
    try {
      m[Pt] = void 0;
      var L = !0;
    } catch {
    }
    var re = Hs.call(m);
    return L && (v ? m[Pt] = O : delete m[Pt]), re;
  }
  var Od = Ys ? function(m) {
    return m == null ? [] : (m = Object(m), Se(Ys(m), function(v) {
      return Gs.call(m, v);
    }));
  } : Md, ht = Nn;
  (Wi && ht(new Wi(new ArrayBuffer(1))) != j || bn && ht(new bn()) != _ || zi && ht(zi.resolve()) != P || Ki && ht(new Ki()) != U || Ji && ht(new Ji()) != V) && (ht = function(m) {
    var v = Nn(m), O = v == R ? m.constructor : void 0, L = O ? kt(O) : "";
    if (L)
      switch (L) {
        case Vf:
          return j;
        case Wf:
          return _;
        case zf:
          return P;
        case Kf:
          return U;
        case Jf:
          return V;
      }
    return v;
  });
  function Nd(m, v) {
    return v = v ?? s, !!v && (typeof m == "number" || he.test(m)) && m > -1 && m % 1 == 0 && m < v;
  }
  function $d(m) {
    var v = typeof m;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? m !== "__proto__" : m === null;
  }
  function Dd(m) {
    return !!Bs && Bs in m;
  }
  function Pd(m) {
    var v = m && m.constructor, O = typeof v == "function" && v.prototype || Ir;
    return m === O;
  }
  function Fd(m) {
    return Hs.call(m);
  }
  function kt(m) {
    if (m != null) {
      try {
        return Ms.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function Js(m, v) {
    return m === v || m !== m && v !== v;
  }
  var Ld = Vs(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Vs : function(m) {
    return $n(m) && et.call(m, "callee") && !Gs.call(m, "callee");
  }, Dr = Array.isArray;
  function kd(m) {
    return m != null && Zs(m.length) && !Qs(m);
  }
  var Zi = Yf || Bd;
  function xd(m, v) {
    return Ws(m, v);
  }
  function Qs(m) {
    if (!ea(m))
      return !1;
    var v = Nn(m);
    return v == g || v == E || v == d || v == k;
  }
  function Zs(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= s;
  }
  function ea(m) {
    var v = typeof m;
    return m != null && (v == "object" || v == "function");
  }
  function $n(m) {
    return m != null && typeof m == "object";
  }
  var ta = _e ? Xi(_e) : Ad;
  function Ud(m) {
    return kd(m) ? vd(m) : Rd(m);
  }
  function Md() {
    return [];
  }
  function Bd() {
    return !1;
  }
  e.exports = xd;
})(gi, gi.exports);
var Pv = gi.exports;
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.DownloadedUpdateHelper = void 0;
Er.createTempUpdateFile = Uv;
const Fv = fr, Lv = ce, yl = Pv, Ht = $t, Vn = z;
class kv {
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
    return Vn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return yl(this.versionInfo, n) && yl(this.fileInfo.info, r.info) && await (0, Ht.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, s) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, Ht.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Ht.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, Ht.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, Ht.readJson)(r);
    } catch (d) {
      let c = "No cached update info available";
      return d.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${d.message})`), n.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = Vn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Ht.pathExists)(a))
      return n.info("Cached update file doesn't exist"), null;
    const l = await xv(a);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, a);
  }
  getUpdateInfoFile() {
    return Vn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Er.DownloadedUpdateHelper = kv;
function xv(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const s = (0, Fv.createHash)(t);
    s.on("error", o).setEncoding(n), (0, Lv.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function Uv(e, t, n) {
  let r = 0, i = Vn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Ht.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${s}`), i = Vn.join(t, `${r++}-${e}`);
    }
  return i;
}
var Pi = {}, $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
$s.getAppCacheDir = Bv;
const vo = z, Mv = Ei;
function Bv() {
  const e = (0, Mv.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || vo.join(e, "AppData", "Local") : process.platform === "darwin" ? t = vo.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || vo.join(e, ".cache"), t;
}
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.ElectronAppAdapter = void 0;
const El = z, Hv = $s;
class jv {
  constructor(t = Rt.app) {
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
    return this.isPackaged ? El.join(process.resourcesPath, "app-update.yml") : El.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Hv.getAppCacheDir)();
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
Pi.ElectronAppAdapter = jv;
var gf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = Ee;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Rt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, s, a) {
      return await a.cancellationToken.createPromise((l, d, c) => {
        const u = {
          headers: a.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, u), (0, t.configureRequestOptions)(u), this.doDownload(u, {
          destination: s,
          options: a,
          onCancel: c,
          callback: (h) => {
            h == null ? l(s) : d(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, s) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const a = Rt.net.request({
        ...o,
        session: this.cachedSession
      });
      return a.on("response", s), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
    }
    addRedirectHandlers(o, s, a, l, d) {
      o.on("redirect", (c, u, h) => {
        o.abort(), l > this.maxRedirects ? a(this.createMaxRedirectError()) : d(t.HttpExecutor.prepareRedirectUrlOptions(h, s));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(gf);
var _r = {}, Ye = {}, qv = "[object Symbol]", mf = /[\\^$.*+?()[\]{}|]/g, Gv = RegExp(mf.source), Yv = typeof Ne == "object" && Ne && Ne.Object === Object && Ne, Xv = typeof self == "object" && self && self.Object === Object && self, Vv = Yv || Xv || Function("return this")(), Wv = Object.prototype, zv = Wv.toString, _l = Vv.Symbol, vl = _l ? _l.prototype : void 0, wl = vl ? vl.toString : void 0;
function Kv(e) {
  if (typeof e == "string")
    return e;
  if (Qv(e))
    return wl ? wl.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Jv(e) {
  return !!e && typeof e == "object";
}
function Qv(e) {
  return typeof e == "symbol" || Jv(e) && zv.call(e) == qv;
}
function Zv(e) {
  return e == null ? "" : Kv(e);
}
function ew(e) {
  return e = Zv(e), e && Gv.test(e) ? e.replace(mf, "\\$&") : e;
}
var tw = ew;
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.newBaseUrl = rw;
Ye.newUrlFromBase = zo;
Ye.getChannelFilename = iw;
Ye.blockmapFiles = ow;
const yf = vn, nw = tw;
function rw(e) {
  const t = new yf.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function zo(e, t, n = !1) {
  const r = new yf.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function iw(e) {
  return `${e}.yml`;
}
function ow(e, t, n) {
  const r = zo(`${e.pathname}.blockmap`, e);
  return [zo(`${e.pathname.replace(new RegExp(nw(n), "g"), t)}.blockmap`, e), r];
}
var de = {};
Object.defineProperty(de, "__esModule", { value: !0 });
de.Provider = void 0;
de.findFile = lw;
de.parseUpdateInfo = cw;
de.getFileList = Ef;
de.resolveFiles = uw;
const Ot = Ee, sw = Te, Tl = Ye;
class aw {
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
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, Ot.configureRequestUrl)(t, r), r;
  }
}
de.Provider = aw;
function lw(e, t, n) {
  if (e.length === 0)
    throw (0, Ot.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const r = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return r ?? (n == null ? e[0] : e.find((i) => !n.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function cw(e, t, n) {
  if (e == null)
    throw (0, Ot.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, sw.load)(e);
  } catch (i) {
    throw (0, Ot.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function Ef(e) {
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
  throw (0, Ot.newError)(`No files provided: ${(0, Ot.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function uw(e, t, n = (r) => r) {
  const i = Ef(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, Ot.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Ot.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Tl.newUrlFromBase)(n(a.url), t),
      info: a
    };
  }), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, Tl.newUrlFromBase)(n(s.path), t).href
  }), i;
}
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.GenericProvider = void 0;
const Sl = Ee, wo = Ye, To = de;
class fw extends To.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, wo.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, wo.getChannelFilename)(this.channel), n = (0, wo.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, To.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof Sl.HttpError && i.statusCode === 404)
          throw (0, Sl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, To.resolveFiles)(t, this.baseUrl);
  }
}
_r.GenericProvider = fw;
var Fi = {}, Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.BitbucketProvider = void 0;
const Al = Ee, So = Ye, Ao = de;
class dw extends Ao.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, So.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Al.CancellationToken(), n = (0, So.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, So.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, Ao.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Al.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Ao.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
Li.BitbucketProvider = dw;
var Nt = {};
Object.defineProperty(Nt, "__esModule", { value: !0 });
Nt.GitHubProvider = Nt.BaseGitHubProvider = void 0;
Nt.computeReleaseNotes = vf;
const lt = Ee, cn = pf, hw = vn, un = Ye, Ko = de, Ro = /\/tag\/([^/]+)$/;
class _f extends Ko.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, un.newBaseUrl)((0, lt.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, un.newBaseUrl)((0, lt.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
Nt.BaseGitHubProvider = _f;
class pw extends _f {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const s = new lt.CancellationToken(), a = await this.httpRequest((0, un.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), l = (0, lt.parseXml)(a);
    let d = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = cn.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (T === null)
          c = Ro.exec(d.element("link").attribute("href"))[1];
        else
          for (const A of l.getElements("entry")) {
            const R = Ro.exec(A.element("link").attribute("href"));
            if (R === null)
              continue;
            const P = R[1], k = ((r = cn.prerelease(P)) === null || r === void 0 ? void 0 : r[0]) || null, Q = !T || ["alpha", "beta"].includes(T), U = k !== null && !["alpha", "beta"].includes(String(k));
            if (Q && !U && !(T === "beta" && k === "alpha")) {
              c = P;
              break;
            }
            if (k && k === T) {
              c = P;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(s);
        for (const T of l.getElements("entry"))
          if (Ro.exec(T.element("link").attribute("href"))[1] === c) {
            d = T;
            break;
          }
      }
    } catch (T) {
      throw (0, lt.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, lt.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let u, h = "", g = "";
    const E = async (T) => {
      h = (0, un.getChannelFilename)(T), g = (0, un.newUrlFromBase)(this.getBaseDownloadPath(String(c), h), this.baseUrl);
      const A = this.createRequestOptions(g);
      try {
        return await this.executor.request(A, s);
      } catch (R) {
        throw R instanceof lt.HttpError && R.statusCode === 404 ? (0, lt.newError)(`Cannot find ${h} in the latest release artifacts (${g}): ${R.stack || R.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : R;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = cn.prerelease(c)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((o = cn.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), u = await E(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        u = await E(this.getDefaultChannelName());
      else
        throw T;
    }
    const _ = (0, Ko.parseUpdateInfo)(u, h, g);
    return _.releaseName == null && (_.releaseName = d.elementValueOrEmpty("title")), _.releaseNotes == null && (_.releaseNotes = vf(this.updater.currentVersion, this.updater.fullChangelog, l, d)), {
      tag: c,
      ..._
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, un.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new hw.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, lt.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Ko.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
Nt.GitHubProvider = pw;
function Rl(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function vf(e, t, n, r) {
  if (!t)
    return Rl(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    cn.lt(e, s) && i.push({
      version: s,
      note: Rl(o)
    });
  }
  return i.sort((o, s) => cn.rcompare(o.version, s.version));
}
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.KeygenProvider = void 0;
const Cl = Ee, Co = Ye, Io = de;
class gw extends Io.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Co.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Cl.CancellationToken(), n = (0, Co.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Co.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Io.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Cl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Io.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
ki.KeygenProvider = gw;
var xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.PrivateGitHubProvider = void 0;
const tn = Ee, mw = Te, yw = z, Il = vn, bl = Ye, Ew = Nt, _w = de;
class vw extends Ew.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new tn.CancellationToken(), n = (0, bl.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((a) => a.name === n);
    if (i == null)
      throw (0, tn.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new Il.URL(i.url);
    let s;
    try {
      s = (0, mw.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof tn.HttpError && a.statusCode === 404 ? (0, tn.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
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
    const i = (0, bl.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((s) => s.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, tn.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, _w.getFileList)(t).map((n) => {
      const r = yw.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, tn.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Il.URL(i.url),
        info: n
      };
    });
  }
}
xi.PrivateGitHubProvider = vw;
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.isUrlProbablySupportMultiRangeRequests = wf;
Fi.createClient = Rw;
const Wr = Ee, ww = Li, Ol = _r, Tw = Nt, Sw = ki, Aw = xi;
function wf(e) {
  return !e.includes("s3.amazonaws.com");
}
function Rw(e, t, n) {
  if (typeof e == "string")
    throw (0, Wr.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Tw.GitHubProvider(i, t, n) : new Aw.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new ww.BitbucketProvider(e, t, n);
    case "keygen":
      return new Sw.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new Ol.GenericProvider({
        provider: "generic",
        url: (0, Wr.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Ol.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && wf(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Wr.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, Wr.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Ui = {}, vr = {}, An = {}, Jt = {};
Object.defineProperty(Jt, "__esModule", { value: !0 });
Jt.OperationKind = void 0;
Jt.computeOperations = Cw;
var Gt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Gt || (Jt.OperationKind = Gt = {}));
function Cw(e, t, n) {
  const r = $l(e.files), i = $l(t.files);
  let o = null;
  const s = t.files[0], a = [], l = s.name, d = r.get(l);
  if (d == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let u = 0;
  const { checksumToOffset: h, checksumToOldSize: g } = bw(r.get(l), d.offset, n);
  let E = s.offset;
  for (let _ = 0; _ < c.checksums.length; E += c.sizes[_], _++) {
    const T = c.sizes[_], A = c.checksums[_];
    let R = h.get(A);
    R != null && g.get(A) !== T && (n.warn(`Checksum ("${A}") matches, but size differs (old: ${g.get(A)}, new: ${T})`), R = void 0), R === void 0 ? (u++, o != null && o.kind === Gt.DOWNLOAD && o.end === E ? o.end += T : (o = {
      kind: Gt.DOWNLOAD,
      start: E,
      end: E + T
      // oldBlocks: null,
    }, Nl(o, a, A, _))) : o != null && o.kind === Gt.COPY && o.end === R ? o.end += T : (o = {
      kind: Gt.COPY,
      start: R,
      end: R + T
      // oldBlocks: [checksum]
    }, Nl(o, a, A, _));
  }
  return u > 0 && n.info(`File${s.name === "file" ? "" : " " + s.name} has ${u} changed blocks`), a;
}
const Iw = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Nl(e, t, n, r) {
  if (Iw && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((s, a) => s < a ? s : a);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${Gt[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function bw(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const a = e.checksums[s], l = e.sizes[s], d = i.get(a);
    if (d === void 0)
      r.set(a, o), i.set(a, l);
    else if (n.debug != null) {
      const c = d === l ? "(same size)" : `(size: ${d}, this size: ${l})`;
      n.debug(`${a} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function $l(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(An, "__esModule", { value: !0 });
An.DataSplitter = void 0;
An.copyData = Tf;
const zr = Ee, Ow = ce, Nw = ur, $w = Jt, Dl = Buffer.from(`\r
\r
`);
var Et;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Et || (Et = {}));
function Tf(e, t, n, r, i) {
  const o = (0, Ow.createReadStream)("", {
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
class Dw extends Nw.Writable {
  constructor(t, n, r, i, o, s) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = s, this.partIndex = -1, this.headerListBuffer = null, this.readState = Et.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, zr.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === Et.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = Et.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Et.BODY)
          this.readState = Et.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, zr.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < s)
            await this.copyExistingData(a, s);
          else if (a > s)
            throw (0, zr.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = Et.HEADER;
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
        if (s.kind !== $w.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Tf(s, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(Dl, n);
    if (r !== -1)
      return r + Dl.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, zr.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
An.DataSplitter = Dw;
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.executeTasksUsingMultipleRangeRequests = Pw;
Mi.checkIsRangesSupported = Qo;
const Jo = Ee, Pl = An, Fl = Jt;
function Pw(e, t, n, r, i) {
  const o = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const a = s + 1e3;
    Fw(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, a),
      oldFileFd: r
    }, n, () => o(a), i);
  };
  return o;
}
function Fw(e, t, n, r, i) {
  let o = "bytes=", s = 0;
  const a = /* @__PURE__ */ new Map(), l = [];
  for (let u = t.start; u < t.end; u++) {
    const h = t.tasks[u];
    h.kind === Fl.OperationKind.DOWNLOAD && (o += `${h.start}-${h.end - 1}, `, a.set(s, u), s++, l.push(h.end - h.start));
  }
  if (s <= 1) {
    const u = (h) => {
      if (h >= t.end) {
        r();
        return;
      }
      const g = t.tasks[h++];
      if (g.kind === Fl.OperationKind.COPY)
        (0, Pl.copyData)(g, n, t.oldFileFd, i, () => u(h));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${g.start}-${g.end - 1}`;
        const _ = e.httpExecutor.createRequest(E, (T) => {
          Qo(T, i) && (T.pipe(n, {
            end: !1
          }), T.once("end", () => u(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(_, i), _.end();
      }
    };
    u(t.start);
    return;
  }
  const d = e.createRequestOptions();
  d.headers.Range = o.substring(0, o.length - 2);
  const c = e.httpExecutor.createRequest(d, (u) => {
    if (!Qo(u, i))
      return;
    const h = (0, Jo.safeGetHeader)(u, "content-type"), g = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(h);
    if (g == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const E = new Pl.DataSplitter(n, t, a, g[1] || g[2], l, r);
    E.on("error", i), u.pipe(E), u.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function Qo(e, t) {
  if (e.statusCode >= 400)
    return t((0, Jo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, Jo.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.ProgressDifferentialDownloadCallbackTransform = void 0;
const Lw = ur;
var fn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(fn || (fn = {}));
class kw extends Lw.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = fn.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == fn.COPY) {
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
    this.operationType = fn.COPY;
  }
  beginRangeDownload() {
    this.operationType = fn.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
Bi.ProgressDifferentialDownloadCallbackTransform = kw;
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.DifferentialDownloader = void 0;
const kn = Ee, bo = $t, xw = ce, Uw = An, Mw = vn, Kr = Jt, Ll = Mi, Bw = Bi;
class Hw {
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
    return (0, kn.configureRequestUrl)(this.options.newUrl, t), (0, kn.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Kr.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, s = 0;
    for (const l of i) {
      const d = l.end - l.start;
      l.kind === Kr.OperationKind.DOWNLOAD ? o += d : s += d;
    }
    const a = this.blockAwareFileInfo.size;
    if (o + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${s}, newSize: ${a}`);
    return r.info(`Full: ${kl(a)}, To download: ${kl(o)} (${Math.round(o / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, bo.close)(i.descriptor).catch((o) => {
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
    const r = await (0, bo.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, bo.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, xw.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, a) => {
      const l = [];
      let d;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const A = [];
        let R = 0;
        for (const k of t)
          k.kind === Kr.OperationKind.DOWNLOAD && (A.push(k.end - k.start), R += k.end - k.start);
        const P = {
          expectedByteCounts: A,
          grandTotal: R
        };
        d = new Bw.ProgressDifferentialDownloadCallbackTransform(P, this.options.cancellationToken, this.options.onProgress), l.push(d);
      }
      const c = new kn.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            c.validate();
          } catch (A) {
            a(A);
            return;
          }
          s(void 0);
        });
      }), l.push(o);
      let u = null;
      for (const A of l)
        A.on("error", a), u == null ? u = A : u = u.pipe(A);
      const h = l[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, Ll.executeTasksUsingMultipleRangeRequests)(this, t, h, r, a), g(0);
        return;
      }
      let E = 0, _ = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", g = (A) => {
        var R, P;
        if (A >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const k = t[A++];
        if (k.kind === Kr.OperationKind.COPY) {
          d && d.beginFileCopy(), (0, Uw.copyData)(k, h, r, a, () => g(A));
          return;
        }
        const Q = `bytes=${k.start}-${k.end - 1}`;
        T.headers.range = Q, (P = (R = this.logger) === null || R === void 0 ? void 0 : R.debug) === null || P === void 0 || P.call(R, `download range: ${Q}`), d && d.beginRangeDownload();
        const U = this.httpExecutor.createRequest(T, (q) => {
          q.on("error", a), q.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), q.statusCode >= 400 && a((0, kn.createHttpError)(q)), q.pipe(h, {
            end: !1
          }), q.once("end", () => {
            d && d.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => g(A), 1e3)) : g(A);
          });
        });
        U.on("redirect", (q, Me, y) => {
          this.logger.info(`Redirect to ${jw(y)}`), _ = y, (0, kn.configureRequestUrl)(new Mw.URL(_), T), U.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(U, a), U.end();
      }, g(0);
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
        (0, Ll.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", n), s.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
vr.DifferentialDownloader = Hw;
function kl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function jw(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.GenericDifferentialDownloader = void 0;
const qw = vr;
class Gw extends qw.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
Ui.GenericDifferentialDownloader = Gw;
var Dt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = r;
  const t = Ee;
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
})(Dt);
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.NoOpLogger = Ct.AppUpdater = void 0;
const Oe = Ee, Yw = fr, Xw = Ei, Vw = sc, nn = $t, Ww = Te, Oo = Ii, Ut = z, jt = pf, xl = Er, zw = Pi, Ul = gf, Kw = _r, No = Fi, Jw = lc, Qw = Ye, Zw = Ui, rn = Dt;
class Ds extends Vw.EventEmitter {
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
        throw (0, Oe.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Oe.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, Ul.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Sf();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Oo.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new rn.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this.clientPromise = null, this.stagingUserIdPromise = new Oo.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Oo.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new zw.ElectronAppAdapter(), this.httpExecutor = new Ul.ElectronHttpExecutor((o, s) => this.emit("login", o, s))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, jt.parse)(r);
    if (i == null)
      throw (0, Oe.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = eT(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? r = new Kw.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, No.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, No.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
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
      const r = Ds.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new Rt.Notification(r).show();
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
    const i = await this.stagingUserIdPromise.value, s = Oe.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${s}, user id: ${i}`), s < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, jt.parse)(t.version);
    if (n == null)
      throw (0, Oe.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, jt.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const o = (0, jt.gt)(n, r), s = (0, jt.lt)(n, r);
    return o ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, Xw.release)();
    if (n)
      try {
        if ((0, jt.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, No.createClient)(r, this, this.createProviderRuntimeOptions())));
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
    const r = new Oe.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Oe.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Oe.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Oe.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof Oe.CancellationError))
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
    this.emit(rn.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, Ww.load)(await (0, nn.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Ut.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, nn.readFile)(t, "utf-8");
      if (Oe.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Oe.UUID.v5((0, Yw.randomBytes)(4096), Oe.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, nn.outputFile)(t, n);
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
      const i = Ut.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new xl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(rn.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (R) => this.emit(rn.DOWNLOAD_PROGRESS, R));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, s = n.packageInfo;
    function a() {
      const R = decodeURIComponent(t.fileInfo.url.pathname);
      return R.endsWith(`.${t.fileExtension}`) ? Ut.basename(R) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), d = l.cacheDirForPendingUpdate;
    await (0, nn.mkdir)(d, { recursive: !0 });
    const c = a();
    let u = Ut.join(d, c);
    const h = s == null ? null : Ut.join(d, `package-${o}${Ut.extname(s.path) || ".7z"}`), g = async (R) => (await l.setDownloadedFile(u, h, i, n, c, R), await t.done({
      ...i,
      downloadedFile: u
    }), h == null ? [u] : [u, h]), E = this._logger, _ = await l.validateDownloadedPath(u, i, n, E);
    if (_ != null)
      return u = _, await g(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, nn.unlink)(u).catch(() => {
    })), A = await (0, xl.createTempUpdateFile)(`temp-${c}`, d, E);
    try {
      await t.task(A, r, h, T), await (0, Oe.retry)(() => (0, nn.rename)(A, u), 60, 500, 0, 0, (R) => R instanceof Error && /^EBUSY:/.test(R.message));
    } catch (R) {
      throw await T(), R instanceof Oe.CancellationError && (E.info("cancelled"), this.emit("update-cancelled", i)), R;
    }
    return E.info(`New version ${o} has been downloaded to ${u}`), await g(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, Qw.blockmapFiles)(t.url, this.app.version, n.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const a = async (c) => {
        const u = await this.httpExecutor.downloadToBuffer(c, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (u == null || u.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, Jw.gunzipSync)(u).toString());
        } catch (h) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${h}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: Ut.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(rn.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(rn.DOWNLOAD_PROGRESS, c));
      const d = await Promise.all(s.map((c) => a(c)));
      return await new Zw.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(d[0], d[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
Ct.AppUpdater = Ds;
function eT(e) {
  const t = (0, jt.prerelease)(e);
  return t != null && t.length > 0;
}
class Sf {
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
Ct.NoOpLogger = Sf;
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.BaseUpdater = void 0;
const Ml = yi, tT = Ct;
class nT extends tT.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Rt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
    const i = (0, Ml.spawnSync)(t, n, {
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
        const a = { stdio: i, env: r, detached: !0 }, l = (0, Ml.spawn)(t, n, a);
        l.on("error", (d) => {
          s(d);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (a) {
        s(a);
      }
    });
  }
}
ut.BaseUpdater = nT;
var rr = {}, wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const on = $t, rT = vr, iT = lc;
class oT extends rT.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = Af(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await sT(this.options.oldFile), i);
  }
}
wr.FileWithEmbeddedBlockMapDifferentialDownloader = oT;
function Af(e) {
  return JSON.parse((0, iT.inflateRawSync)(e).toString());
}
async function sT(e) {
  const t = await (0, on.open)(e, "r");
  try {
    const n = (await (0, on.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, on.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, on.read)(t, i, 0, i.length, n - r.length - i.length), await (0, on.close)(t), Af(i);
  } catch (n) {
    throw await (0, on.close)(t), n;
  }
}
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.AppImageUpdater = void 0;
const Bl = Ee, Hl = yi, aT = $t, lT = ce, xn = z, cT = ut, uT = wr, fT = de, jl = Dt;
class dT extends cT.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, fT.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, Bl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, s, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, aT.chmod)(i, 493);
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
      return this.listenerCount(jl.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(jl.DOWNLOAD_PROGRESS, a)), await new uT.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, Bl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, lT.unlinkSync)(n);
    let r;
    const i = xn.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    xn.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = xn.join(xn.dirname(n), xn.basename(o)), (0, Hl.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Hl.execFileSync)(r, [], { env: s })), !0;
  }
}
rr.AppImageUpdater = dT;
var ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.DebUpdater = void 0;
const hT = ut, pT = de, ql = Dt;
class gT extends hT.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, pT.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(ql.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(ql.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
ir.DebUpdater = gT;
var or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.PacmanUpdater = void 0;
const mT = ut, Gl = Dt, yT = de;
class ET extends mT.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, yT.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Gl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Gl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
or.PacmanUpdater = ET;
var sr = {};
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.RpmUpdater = void 0;
const _T = ut, Yl = Dt, vT = de;
class wT extends _T.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, vT.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Yl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Yl.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
sr.RpmUpdater = wT;
var ar = {};
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.MacUpdater = void 0;
const Xl = Ee, $o = $t, TT = ce, Vl = z, ST = zd, AT = Ct, RT = de, Wl = yi, zl = fr;
class CT extends AT.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = Rt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
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
      this.debug("Checking for macOS Rosetta environment"), o = (0, Wl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (u) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${u}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Wl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const l = (0, RT.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Xl.newError)(`ZIP file not provided: ${(0, Xl.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const d = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (u, h) => {
        const g = Vl.join(this.downloadedUpdateHelper.cacheDir, c), E = () => (0, $o.pathExistsSync)(g) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let _ = !0;
        E() && (_ = await this.differentialDownloadInstaller(l, t, u, d, c)), _ && await this.httpExecutor.download(l.url, u, h);
      },
      done: async (u) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Vl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, $o.copyFile)(u.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, u);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, $o.stat)(i)).size, s = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, ST.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const l = (d) => {
      const c = d.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((d, c) => {
      const u = (0, zl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${u}`, "ascii"), g = `/${(0, zl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (E, _) => {
        const T = E.url;
        if (s.info(`${T} requested`), T === "/") {
          if (!E.headers.authorization || E.headers.authorization.indexOf("Basic ") === -1) {
            _.statusCode = 401, _.statusMessage = "Invalid Authentication Credentials", _.end(), s.warn("No authenthication info");
            return;
          }
          const P = E.headers.authorization.split(" ")[1], k = Buffer.from(P, "base64").toString("ascii"), [Q, U] = k.split(":");
          if (Q !== "autoupdater" || U !== u) {
            _.statusCode = 401, _.statusMessage = "Invalid Authentication Credentials", _.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const q = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          _.writeHead(200, { "Content-Type": "application/json", "Content-Length": q.length }), _.end(q);
          return;
        }
        if (!T.startsWith(g)) {
          s.warn(`${T} requested, but not supported`), _.writeHead(404), _.end();
          return;
        }
        s.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let A = !1;
        _.on("finish", () => {
          A || (this.nativeUpdater.removeListener("error", c), d([]));
        });
        const R = (0, TT.createReadStream)(i);
        R.on("error", (P) => {
          try {
            _.end();
          } catch (k) {
            s.warn(`cannot end response: ${k}`);
          }
          A = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${P}`));
        }), _.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), R.pipe(_);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${a})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${a})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : d([]);
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
ar.MacUpdater = CT;
var lr = {}, Ps = {};
Object.defineProperty(Ps, "__esModule", { value: !0 });
Ps.verifySignature = bT;
const Kl = Ee, Rf = yi, IT = Ei, Jl = z;
function bT(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, Rf.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, a, l) => {
      var d;
      try {
        if (s != null || l) {
          Do(n, s, l, i), r(null);
          return;
        }
        const c = OT(a);
        if (c.Status === 0) {
          try {
            const E = Jl.normalize(c.Path), _ = Jl.normalize(t);
            if (n.info(`LiteralPath: ${E}. Update Path: ${_}`), E !== _) {
              Do(n, new Error(`LiteralPath of ${E} is different than ${_}`), l, i), r(null);
              return;
            }
          } catch (E) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(d = E.message) !== null && d !== void 0 ? d : E.stack}`);
          }
          const h = (0, Kl.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const E of e) {
            const _ = (0, Kl.parseDn)(E);
            if (_.size ? g = Array.from(_.keys()).every((A) => _.get(A) === h.get(A)) : E === h.get("CN") && (n.warn(`Signature validated using only CN ${E}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              r(null);
              return;
            }
          }
        }
        const u = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (h, g) => h === "RawData" ? void 0 : g, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${u}`), r(u);
      } catch (c) {
        Do(n, c, null, i), r(null);
        return;
      }
    });
  });
}
function OT(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function Do(e, t, n, r) {
  if (NT()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Rf.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function NT() {
  const e = IT.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.NsisUpdater = void 0;
const Jr = Ee, Ql = z, $T = ut, DT = wr, Zl = Dt, PT = de, FT = $t, LT = Ps, ec = vn;
class kT extends $T.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, LT.verifySignature)(r, i, this._logger);
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
    const n = t.updateInfoAndProvider.provider, r = (0, PT.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, s, a) => {
        const l = r.packageInfo, d = l != null && s != null;
        if (d && t.disableWebInstaller)
          throw (0, Jr.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !d && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, Jr.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await a(), (0, Jr.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (d && await this.differentialDownloadWebPackage(t, l, s, n))
          try {
            await this.httpExecutor.download(new ec.URL(l.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (u) {
            try {
              await (0, FT.unlink)(s);
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
      this.spawnLog(Ql.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((s) => {
      const a = s.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? o() : a === "ENOENT" ? Rt.shell.openPath(n).catch((l) => this.dispatchError(l)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new ec.URL(n.path),
        oldFile: Ql.join(this.downloadedUpdateHelper.cacheDir, Jr.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Zl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Zl.DOWNLOAD_PROGRESS, s)), await new DT.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
lr.NsisUpdater = kT;
(function(e) {
  var t = Ne && Ne.__createBinding || (Object.create ? function(T, A, R, P) {
    P === void 0 && (P = R);
    var k = Object.getOwnPropertyDescriptor(A, R);
    (!k || ("get" in k ? !A.__esModule : k.writable || k.configurable)) && (k = { enumerable: !0, get: function() {
      return A[R];
    } }), Object.defineProperty(T, P, k);
  } : function(T, A, R, P) {
    P === void 0 && (P = R), T[P] = A[R];
  }), n = Ne && Ne.__exportStar || function(T, A) {
    for (var R in T) R !== "default" && !Object.prototype.hasOwnProperty.call(A, R) && t(A, T, R);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = $t, i = z;
  var o = ut;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var s = Ct;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var a = de;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var l = rr;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var d = ir;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return d.DebUpdater;
  } });
  var c = or;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var u = sr;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return u.RpmUpdater;
  } });
  var h = ar;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var g = lr;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), n(Dt, e);
  let E;
  function _() {
    if (process.platform === "win32")
      E = new lr.NsisUpdater();
    else if (process.platform === "darwin")
      E = new ar.MacUpdater();
    else {
      E = new rr.AppImageUpdater();
      try {
        const T = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(T))
          return E;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const A = (0, r.readFileSync)(T).toString().trim();
        switch (console.info("Found package-type:", A), A) {
          case "deb":
            E = new ir.DebUpdater();
            break;
          case "rpm":
            E = new sr.RpmUpdater();
            break;
          case "pacman":
            E = new or.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (T) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", T.message);
      }
    }
    return E;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => E || _()
  });
})(yc);
const xT = /* @__PURE__ */ cc(yc), { autoUpdater: ze } = xT;
ze.autoDownload = !1;
ze.autoInstallOnAppQuit = !0;
function UT(e) {
  ze.on("checking-for-update", () => {
    console.log("正在检查更新..."), e == null || e.webContents.send("update-checking");
  }), ze.on("update-available", (t) => {
    console.log("发现新版本:", t.version), e == null || e.webContents.send("update-available", t), Ge.isSupported() && new Ge({
      title: "发现新版本",
      body: `版本 ${t.version} 可用，点击查看详情`
    }).show();
  }), ze.on("update-not-available", (t) => {
    console.log("当前已是最新版本"), e == null || e.webContents.send("update-not-available", t);
  }), ze.on("download-progress", (t) => {
    console.log(`下载进度: ${t.percent.toFixed(2)}%`), e == null || e.webContents.send("update-download-progress", t);
  }), ze.on("update-downloaded", (t) => {
    console.log("更新下载完成:", t.version), e == null || e.webContents.send("update-downloaded", t), Ge.isSupported() && new Ge({
      title: "更新已下载",
      body: "新版本已准备就绪，重启应用即可安装"
    }).show();
  }), ze.on("error", (t) => {
    console.error("更新错误:", t), e == null || e.webContents.send("update-error", t.message);
  });
}
async function MT() {
  try {
    return await ze.checkForUpdates();
  } catch (e) {
    throw console.error("检查更新失败:", e), e;
  }
}
async function BT() {
  try {
    return await ze.downloadUpdate();
  } catch (e) {
    throw console.error("下载更新失败:", e), e;
  }
}
function HT() {
  ze.quitAndInstall();
}
function jT() {
  return se.getVersion();
}
var Cf = /* @__PURE__ */ ((e) => (e.UNKNOWN_ERROR = "UNKNOWN_ERROR", e.INVALID_PARAMS = "INVALID_PARAMS", e.OPERATION_FAILED = "OPERATION_FAILED", e.DATABASE_ERROR = "DATABASE_ERROR", e.DATABASE_CONNECTION_ERROR = "DATABASE_CONNECTION_ERROR", e.DATABASE_QUERY_ERROR = "DATABASE_QUERY_ERROR", e.API_ERROR = "API_ERROR", e.API_REQUEST_FAILED = "API_REQUEST_FAILED", e.API_RESPONSE_ERROR = "API_RESPONSE_ERROR", e.API_RATE_LIMIT = "API_RATE_LIMIT", e.STOCK_NOT_FOUND = "STOCK_NOT_FOUND", e.ANNOUNCEMENT_NOT_FOUND = "ANNOUNCEMENT_NOT_FOUND", e.SYNC_IN_PROGRESS = "SYNC_IN_PROGRESS", e.SYNC_FAILED = "SYNC_FAILED", e.FILE_NOT_FOUND = "FILE_NOT_FOUND", e.FILE_READ_ERROR = "FILE_READ_ERROR", e.FILE_WRITE_ERROR = "FILE_WRITE_ERROR", e))(Cf || {});
class Tr extends Error {
  constructor(t, n, r) {
    super(n), this.name = "AppError", this.code = t, this.details = r, Error.captureStackTrace && Error.captureStackTrace(this, Tr);
  }
}
function qT(e) {
  if (e instanceof Tr)
    return e.code;
  if (e instanceof Error) {
    const t = e.message.toLowerCase();
    if (t.includes("database") || t.includes("sqlite"))
      return "DATABASE_ERROR";
    if (t.includes("api") || t.includes("fetch") || t.includes("network"))
      return "API_ERROR";
    if (t.includes("file") || t.includes("enoent"))
      return "FILE_NOT_FOUND";
  }
  return "UNKNOWN_ERROR";
}
function GT(e) {
  return e instanceof Error ? e.message : typeof e == "string" ? e : "未知错误";
}
function YT(e) {
  return e instanceof Tr ? e.details : e instanceof Error ? {
    name: e.name,
    stack: e.stack
  } : e;
}
function XT(e) {
  return {
    success: !0,
    data: e
  };
}
function VT(e) {
  return {
    success: !1,
    error: {
      code: qT(e),
      message: GT(e),
      details: YT(e)
    }
  };
}
const WT = {
  0: "DEBUG",
  1: "INFO",
  2: "WARN",
  3: "ERROR"
};
function zT() {
  const e = process.env.NODE_ENV !== "production" || !se.isPackaged;
  return {
    level: e ? 0 : 1,
    enableFileLog: !e,
    // 生产环境启用文件日志
    logFilePath: e ? void 0 : z.join(se.getPath("logs"), "cafe-stock.log"),
    enableConsole: !0
  };
}
function KT() {
  const e = /* @__PURE__ */ new Date(), t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), i = String(e.getHours()).padStart(2, "0"), o = String(e.getMinutes()).padStart(2, "0"), s = String(e.getSeconds()).padStart(2, "0"), a = String(e.getMilliseconds()).padStart(3, "0");
  return `${t}-${n}-${r} ${i}:${o}:${s}.${a}`;
}
function JT(e, t, n, ...r) {
  const i = KT(), o = WT[e], s = t ? `[${t}]` : "";
  let a = "";
  if (r.length > 0)
    try {
      a = r.map((d) => typeof d == "object" ? JSON.stringify(d, null, 2) : String(d)).join(" ");
    } catch {
      a = "[无法序列化的对象]";
    }
  const l = a ? `${n} ${a}` : n;
  return `${i} [${o}]${s} ${l}`;
}
function QT(e, t) {
  if (!(!e.enableFileLog || !e.logFilePath))
    try {
      const n = z.dirname(e.logFilePath);
      ce.existsSync(n) || ce.mkdirSync(n, { recursive: !0 }), ce.appendFileSync(e.logFilePath, t + `
`, "utf-8");
    } catch (n) {
      console.error("[Logger] Failed to write log to file:", n);
    }
}
class ZT {
  constructor() {
    this.config = zT();
  }
  /**
   * 更新配置
   */
  updateConfig(t) {
    this.config = { ...this.config, ...t };
  }
  /**
   * 记录 DEBUG 级别日志
   */
  debug(t, n, ...r) {
    this.log(0, t, n, ...r);
  }
  /**
   * 记录 INFO 级别日志
   */
  info(t, n, ...r) {
    this.log(1, t, n, ...r);
  }
  /**
   * 记录 WARN 级别日志
   */
  warn(t, n, ...r) {
    this.log(2, t, n, ...r);
  }
  /**
   * 记录 ERROR 级别日志
   */
  error(t, n, ...r) {
    this.log(3, t, n, ...r);
  }
  /**
   * 核心日志记录方法
   */
  log(t, n, r, ...i) {
    if (t < this.config.level)
      return;
    const o = JT(t, n, r, ...i);
    if (this.config.enableConsole)
      switch (t) {
        case 0:
          console.debug(o);
          break;
        case 1:
          console.info(o);
          break;
        case 2:
          console.warn(o);
          break;
        case 3:
          console.error(o);
          break;
      }
    (t >= 2 || this.config.enableFileLog) && QT(this.config, o);
  }
}
const Qr = new ZT(), S = {
  debug: (e, t, ...n) => Qr.debug(e, t, ...n),
  info: (e, t, ...n) => Qr.info(e, t, ...n),
  warn: (e, t, ...n) => Qr.warn(e, t, ...n),
  error: (e, t, ...n) => Qr.error(e, t, ...n)
};
function Po(e, t) {
  return async (n, ...r) => {
    const i = t || e.name || "unknown";
    try {
      S.debug("IPC", `处理请求: ${i}`, r.length > 0 ? r : void 0);
      const o = await e(n, ...r);
      return S.debug("IPC", `请求成功: ${i}`), XT(o);
    } catch (o) {
      return S.error("IPC", `请求失败: ${i}`, o), VT(o);
    }
  };
}
function eS() {
  x.handle(
    "show-notification",
    Po(async (e, t, n) => (Ge.isSupported() && new Ge({ title: t, body: n }).show(), { success: !0 }), "show-notification")
  ), x.handle(
    "get-app-version",
    Po(async () => jT(), "get-app-version")
  ), x.handle(
    "open-external",
    Po(async (e, t) => {
      if (S.debug("IPC", `打开外部链接: ${t}`), !t.startsWith("http://") && !t.startsWith("https://"))
        throw new Tr(Cf.INVALID_PARAMS, "只支持 HTTP/HTTPS 协议");
      return await Yd.openExternal(t), { success: !0 };
    }, "open-external")
  );
}
function tS() {
  x.handle("check-for-updates", async () => {
    try {
      return console.log("[IPC] check-for-updates"), await MT();
    } catch (e) {
      throw console.error("Failed to check for updates:", e), e;
    }
  }), x.handle("download-update", async () => {
    try {
      return console.log("[IPC] download-update"), await BT();
    } catch (e) {
      throw console.error("Failed to download update:", e), e;
    }
  }), x.handle("install-update", async () => {
    console.log("[IPC] install-update"), HT();
  });
}
let nt = null, Fo = null;
function Fs() {
  return Fo || (Fo = z.join(se.getPath("userData"), "cafe_stock.db")), Fo;
}
function If() {
  if (nt)
    return nt;
  const e = Fs();
  S.info("DB", `初始化数据库连接: ${e}`);
  try {
    return nt = new Jd(e), nS(nt), S.info("DB", "数据库连接初始化成功"), nt;
  } catch (t) {
    throw S.error("DB", "数据库连接初始化失败:", t), t;
  }
}
function nS(e) {
  try {
    e.pragma("journal_mode = WAL"), e.pragma("synchronous = NORMAL"), e.pragma("cache_size = -64000"), e.pragma("temp_store = MEMORY"), S.debug("DB", "数据库性能参数配置完成");
  } catch (t) {
    throw S.error("DB", "配置数据库性能参数失败:", t), t;
  }
}
function Hi() {
  return nt || If();
}
function bf() {
  if (!nt)
    return S.warn("DB", "数据库连接未初始化，无需关闭"), !0;
  try {
    return nt.close(), nt = null, S.info("DB", "数据库连接已关闭"), !0;
  } catch (e) {
    return S.error("DB", "关闭数据库连接失败:", e), !1;
  }
}
function rS(e, t = []) {
  const r = Hi().prepare(`EXPLAIN QUERY PLAN ${e}`).all(...t);
  return S.debug("DB", "Query Plan:", JSON.stringify(r, null, 2)), r;
}
const Ls = [
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
], Of = Ls;
function Nf(e, t) {
  if (!e) return "其他";
  const r = [...t || Ls].sort((i, o) => i.priority - o.priority);
  for (const i of r)
    for (const o of i.keywords)
      if (e.includes(o))
        return i.category;
  return "其他";
}
function cr(e) {
  return Nf(e, Ls);
}
function $f(e) {
  return {
    财务报告: "blue",
    分红派息: "green",
    重大事项: "red",
    股权变动: "purple",
    公司治理: "cyan",
    经营情况: "geekblue",
    风险提示: "orange",
    交易公告: "volcano",
    诉讼仲裁: "magenta",
    对外投资: "lime",
    担保事项: "gold",
    债券相关: "purple",
    内部控制: "cyan",
    资质认证: "green",
    基金相关: "blue",
    募集资金: "lime",
    股权激励: "magenta",
    投资者关系: "geekblue",
    持续督导: "cyan",
    ESG报告: "green",
    股份质押: "gold",
    其他: "default"
  }[e] || "default";
}
function Df(e) {
  return {
    财务报告: "📊",
    分红派息: "💰",
    重大事项: "⚠️",
    股权变动: "📈",
    公司治理: "👔",
    经营情况: "🏭",
    风险提示: "🚨",
    交易公告: "🤝",
    诉讼仲裁: "⚖️",
    对外投资: "💼",
    担保事项: "🛡️",
    债券相关: "📜",
    内部控制: "🔒",
    资质认证: "🏆",
    基金相关: "💹",
    募集资金: "💵",
    股权激励: "🎁",
    投资者关系: "🤝",
    持续督导: "👁️",
    ESG报告: "🌱",
    股份质押: "🔗",
    其他: "📄"
  }[e] || "📄";
}
function Pf(e) {
  S.info("DB", "开始创建数据库表...");
  try {
    e.exec(`
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

			CREATE TABLE IF NOT EXISTS classification_categories (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				category_key TEXT NOT NULL UNIQUE,
				category_name TEXT NOT NULL,
				color TEXT,
				icon TEXT,
				priority INTEGER NOT NULL,
				enabled INTEGER DEFAULT 1,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL
			);

			CREATE INDEX IF NOT EXISTS idx_category_priority ON classification_categories (priority);
			CREATE INDEX IF NOT EXISTS idx_category_enabled ON classification_categories (enabled);

			CREATE TABLE IF NOT EXISTS classification_rules (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				category_key TEXT NOT NULL,
				keyword TEXT NOT NULL,
				enabled INTEGER DEFAULT 1,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				FOREIGN KEY (category_key) REFERENCES classification_categories(category_key)
			);

			CREATE INDEX IF NOT EXISTS idx_rules_category ON classification_rules(category_key);
			CREATE INDEX IF NOT EXISTS idx_rules_enabled ON classification_rules(enabled);
		`), S.info("DB", "数据库表创建完成");
  } catch (t) {
    throw S.error("DB", "创建数据库表失败:", t), t;
  }
}
function Ff(e) {
  S.info("DB", "开始数据库迁移...");
  try {
    iS(e), oS(e), sS(e), S.info("DB", "数据库迁移完成");
  } catch (t) {
    throw S.error("DB", "数据库迁移失败:", t), t;
  }
}
function iS(e) {
  const t = e.prepare("PRAGMA table_info(announcements)").all(), n = new Set(t.map((i) => i.name)), r = [
    { name: "name", type: "TEXT" },
    { name: "url", type: "TEXT" },
    { name: "rec_time", type: "TEXT" },
    { name: "category", type: "TEXT DEFAULT NULL" }
  ];
  for (const i of r)
    if (!n.has(i.name)) {
      S.info("DB", `添加 announcements.${i.name} 列`);
      try {
        e.exec(`ALTER TABLE announcements ADD COLUMN ${i.name} ${i.type}`), S.info("DB", `announcements.${i.name} 列添加成功`), i.name === "category" && (e.exec("CREATE INDEX IF NOT EXISTS idx_ann_category ON announcements (category)"), S.info("DB", "announcements.category 索引创建成功"));
      } catch (o) {
        S.error("DB", `添加 announcements.${i.name} 列失败:`, o);
      }
    }
}
function oS(e) {
  const t = e.prepare("PRAGMA table_info(stocks)").all();
  if (!new Set(t.map((r) => r.name)).has("is_favorite")) {
    S.info("DB", "添加 stocks.is_favorite 列");
    try {
      e.exec("ALTER TABLE stocks ADD COLUMN is_favorite INTEGER DEFAULT 0"), S.info("DB", "stocks.is_favorite 列添加成功"), e.exec("CREATE INDEX IF NOT EXISTS idx_stock_is_favorite ON stocks (is_favorite)"), S.info("DB", "stocks.is_favorite 索引创建成功");
    } catch (r) {
      S.error("DB", "添加 stocks.is_favorite 列失败:", r);
    }
  }
}
function sS(e) {
  try {
    if (e.prepare("SELECT COUNT(*) as count FROM classification_categories").get().count > 0) {
      S.debug("DB", "分类规则已存在，跳过初始化");
      return;
    }
    S.info("DB", "开始初始化默认分类规则");
    const n = (/* @__PURE__ */ new Date()).toISOString(), r = e.prepare(`
			INSERT INTO classification_categories (category_key, category_name, color, icon, priority, enabled, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, 1, ?, ?)
		`), i = e.prepare(`
			INSERT INTO classification_rules (category_key, keyword, enabled, created_at, updated_at)
			VALUES (?, ?, 1, ?, ?)
		`);
    e.transaction(() => {
      for (const s of Of) {
        const a = s.category, l = s.category, d = $f(s.category), c = Df(s.category), u = s.priority;
        r.run(a, l, d, c, u, n, n);
        for (const h of s.keywords)
          i.run(a, h, n, n);
      }
    })(), S.info("DB", "默认分类规则初始化完成");
  } catch (t) {
    S.error("DB", "初始化分类规则失败:", t);
  }
}
class Lf {
  constructor(t) {
    this.db = t;
  }
  /**
   * 获取上次同步日期
   */
  getLastSyncDate(t) {
    try {
      const n = this.db.prepare("SELECT last_sync_date FROM sync_flags WHERE sync_type = ?").get(t);
      return (n == null ? void 0 : n.last_sync_date) || null;
    } catch (n) {
      return S.error("SyncFlag", `获取同步日期失败 (${t}):`, n), null;
    }
  }
  /**
   * 更新同步标志位
   */
  updateSyncFlag(t, n) {
    try {
      const r = (/* @__PURE__ */ new Date()).toISOString();
      return this.db.prepare(
        `
				INSERT INTO sync_flags (sync_type, last_sync_date, updated_at)
				VALUES (?, ?, ?)
				ON CONFLICT(sync_type) DO UPDATE SET
					last_sync_date = excluded.last_sync_date,
					updated_at = excluded.updated_at
			`
      ).run(t, n, r), S.debug("SyncFlag", `更新同步标志位成功: ${t} = ${n}`), !0;
    } catch (r) {
      return S.error("SyncFlag", `更新同步标志位失败 (${t}):`, r), !1;
    }
  }
  /**
   * 检查今天是否已同步
   */
  isSyncedToday(t) {
    const n = this.getLastSyncDate(t);
    if (!n) return !1;
    const r = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    return n === r;
  }
  /**
   * 获取所有同步标志位
   */
  getAllSyncFlags() {
    try {
      return this.db.prepare("SELECT sync_type, last_sync_date, updated_at FROM sync_flags ORDER BY updated_at DESC").all();
    } catch (t) {
      return S.error("SyncFlag", "获取所有同步标志位失败:", t), [];
    }
  }
  /**
   * 删除同步标志位
   */
  deleteSyncFlag(t) {
    try {
      return this.db.prepare("DELETE FROM sync_flags WHERE sync_type = ?").run(t), S.debug("SyncFlag", `删除同步标志位成功: ${t}`), !0;
    } catch (n) {
      return S.error("SyncFlag", `删除同步标志位失败 (${t}):`, n), !1;
    }
  }
  /**
   * 清空所有同步标志位
   */
  clearAllSyncFlags() {
    try {
      return this.db.prepare("DELETE FROM sync_flags").run(), S.info("SyncFlag", "清空所有同步标志位成功"), !0;
    } catch (t) {
      return S.error("SyncFlag", "清空所有同步标志位失败:", t), !1;
    }
  }
}
const ji = If();
Pf(ji);
Ff(ji);
const Rn = new Lf(ji), ye = () => Hi(), ri = () => Fs(), aS = (e) => Rn.getLastSyncDate(e), lS = (e, t) => {
  Rn.updateSyncFlag(e, t);
}, kf = (e) => Rn.isSyncedToday(e), cS = (e, t = []) => rS(e, t), xf = () => bf();
S.info("DB", "数据库模块初始化完成");
const uS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SyncFlagManager: Lf,
  analyzeQuery: cS,
  closeDatabase: xf,
  closeDatabaseConnection: bf,
  createTables: Pf,
  default: ji,
  getDatabase: Hi,
  getDatabasePath: Fs,
  getDb: ye,
  getDbPath: ri,
  getLastSyncDate: aS,
  isSyncedToday: kf,
  migrateDatabase: Ff,
  syncFlagManager: Rn,
  updateSyncFlag: lS
}, Symbol.toStringTag, { value: "Module" }));
class Sr {
  constructor(t) {
    this.db = t;
  }
  /**
   * 执行事务
   */
  transaction(t) {
    return this.db.transaction(t)();
  }
  /**
   * 获取当前时间戳（ISO格式）
   */
  getCurrentTimestamp() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  /**
   * 格式化日期为 YYYYMMDD
   */
  formatDateToYYYYMMDD(t) {
    const n = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0");
    return `${n}${r}${i}`;
  }
  /**
   * 获取日期的前一天（YYYYMMDD格式）
   */
  getPreviousDay(t) {
    const n = parseInt(t.substring(0, 4)), r = parseInt(t.substring(4, 6)) - 1, i = parseInt(t.substring(6, 8)), o = new Date(n, r, i);
    return o.setDate(o.getDate() - 1), this.formatDateToYYYYMMDD(o);
  }
  /**
   * 获取日期的后一天（YYYYMMDD格式）
   */
  getNextDay(t) {
    const n = parseInt(t.substring(0, 4)), r = parseInt(t.substring(4, 6)) - 1, i = parseInt(t.substring(6, 8)), o = new Date(n, r, i);
    return o.setDate(o.getDate() + 1), this.formatDateToYYYYMMDD(o);
  }
}
class qi extends Sr {
  constructor(t) {
    super(t);
  }
  /**
   * 添加收藏股票
   */
  addFavoriteStock(t) {
    try {
      return this.db.prepare("UPDATE stocks SET is_favorite = 1 WHERE ts_code = ?").run(t).changes > 0;
    } catch (n) {
      return console.error("Failed to add favorite stock:", n), !1;
    }
  }
  /**
   * 取消收藏股票
   */
  removeFavoriteStock(t) {
    try {
      return this.db.prepare("UPDATE stocks SET is_favorite = 0 WHERE ts_code = ?").run(t).changes > 0;
    } catch (n) {
      return console.error("Failed to remove favorite stock:", n), !1;
    }
  }
  /**
   * 检查股票是否已收藏
   */
  isFavoriteStock(t) {
    try {
      const r = this.db.prepare("SELECT is_favorite FROM stocks WHERE ts_code = ?").get(t);
      return (r == null ? void 0 : r.is_favorite) === 1;
    } catch (n) {
      return console.error("Failed to check favorite stock:", n), !1;
    }
  }
  /**
   * 获取所有收藏的股票代码
   */
  getAllFavoriteStocks() {
    try {
      return this.db.prepare("SELECT ts_code FROM stocks WHERE is_favorite = 1 ORDER BY ts_code").all().map((r) => r.ts_code);
    } catch (t) {
      return console.error("Failed to get all favorite stocks:", t), [];
    }
  }
  /**
   * 统计收藏的股票数量
   */
  countFavoriteStocks() {
    try {
      const n = this.db.prepare("SELECT COUNT(*) as count FROM stocks WHERE is_favorite = 1").get();
      return (n == null ? void 0 : n.count) || 0;
    } catch (t) {
      return console.error("Failed to count favorite stocks:", t), 0;
    }
  }
}
const Ar = new qi(ye());
function fS(e) {
  return Ar.addFavoriteStock(e);
}
function dS(e) {
  return Ar.removeFavoriteStock(e);
}
function hS(e) {
  return Ar.isFavoriteStock(e);
}
function pS() {
  return Ar.getAllFavoriteStocks();
}
function gS() {
  return Ar.countFavoriteStocks();
}
function mS() {
  x.handle("add-favorite-stock", async (e, t) => {
    try {
      return console.log(`[IPC] add-favorite-stock: ${t}`), { success: fS(t) };
    } catch (n) {
      throw console.error("Failed to add favorite stock:", n), n;
    }
  }), x.handle("remove-favorite-stock", async (e, t) => {
    try {
      return console.log(`[IPC] remove-favorite-stock: ${t}`), { success: dS(t) };
    } catch (n) {
      throw console.error("Failed to remove favorite stock:", n), n;
    }
  }), x.handle("is-favorite-stock", async (e, t) => {
    try {
      return { isFavorite: hS(t) };
    } catch (n) {
      throw console.error("Failed to check favorite stock:", n), n;
    }
  }), x.handle("get-all-favorite-stocks", async () => {
    try {
      return console.log("[IPC] get-all-favorite-stocks"), pS();
    } catch (e) {
      throw console.error("Failed to get all favorite stocks:", e), e;
    }
  }), x.handle("count-favorite-stocks", async () => {
    try {
      return console.log("[IPC] count-favorite-stocks"), { count: gS() };
    } catch (e) {
      throw console.error("Failed to count favorite stocks:", e), e;
    }
  });
}
const mi = class mi {
  static async request(t, n = {}, r = "") {
    const i = {
      api_name: t,
      token: this.TOKEN,
      params: n,
      fields: Array.isArray(r) ? r.join(",") : r
    }, o = Date.now();
    S.debug("Tushare", `开始请求 API: ${t}`), S.debug("Tushare", "请求参数:", JSON.stringify(n, null, 2)), S.debug("Tushare", "请求字段:", r);
    try {
      const s = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(i)
      }), a = Date.now() - o;
      if (S.debug("Tushare", `API: ${t}, HTTP状态: ${s.status}, 耗时: ${a}ms`), !s.ok)
        throw new Error(`HTTP Error: ${s.status}`);
      const l = await s.json();
      if (S.debug("Tushare", `API: ${t}, 响应码: ${l.code}, 消息: ${l.msg || "成功"}`), l.code !== 0)
        throw new Error(`Tushare Error [${l.code}]: ${l.msg}`);
      if (!l.data)
        return S.debug("Tushare", `API: ${t}, 返回空数据`), [];
      const { fields: d, items: c } = l.data, u = c.map((h) => {
        const g = {};
        return d.forEach((E, _) => {
          g[E] = h[_];
        }), g;
      });
      return S.info("Tushare", `API: ${t}, 返回 ${u.length} 条数据, 总耗时: ${Date.now() - o}ms`), u;
    } catch (s) {
      const a = Date.now() - o;
      throw S.error("Tushare", `API: ${t}, 耗时: ${a}ms`), S.error("Tushare", "请求参数:", JSON.stringify(n, null, 2)), S.error("Tushare", "错误详情:", s), s;
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
      S.debug("Tushare", `获取公告: ts_code=${t || "全市场"}, start=${n}, end=${s}`);
      const d = await this.getAnnouncementFiles(t, void 0, n, s);
      if (!d || d.length === 0) {
        S.debug("Tushare", "没有更多公告数据"), l = !1;
        break;
      }
      if (o.push(...d), i && i(d.length, o.length), S.info("Tushare", `获取到 ${d.length} 条公告，累计 ${o.length} 条`), d.length < a) {
        l = !1;
        break;
      }
      const c = d[d.length - 1].ann_date;
      if (c <= n) {
        S.debug("Tushare", "已到达起始日期，停止迭代"), l = !1;
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
    S.info("Tushare", `开始获取完整公告数据: ${n} - ${r}`);
    let a = await this.getAnnouncements(t, void 0, n, r, 2e3, 0);
    if (S.info("Tushare", `首次获取 ${a.length} 条公告`), !a || a.length === 0)
      return S.info("Tushare", "该时间范围内没有公告数据"), [];
    if (o.push(...a), i && i(`已获取 ${o.length} 条`, o.length, o.length), a.length < 2e3)
      return S.debug("Tushare", "数据量小于批次大小，获取完成"), o;
    const l = a.map((u) => u.ann_date).sort(), d = l[0], c = l[l.length - 1];
    if (S.debug("Tushare", `首批数据日期范围: ${d} - ${c}`), d > n) {
      S.debug("Tushare", "向后获取更早的数据...");
      let u = this.getPreviousDay(d);
      for (; u >= n; ) {
        S.debug("Tushare", `获取历史数据: ${n} - ${u}`);
        const h = await this.getAnnouncements(t, void 0, n, u, 2e3, 0);
        if (!h || h.length === 0) {
          S.debug("Tushare", "没有更早的数据");
          break;
        }
        if (o.push(...h), S.info("Tushare", `获取到 ${h.length} 条历史公告，累计 ${o.length} 条`), i && i(`已获取 ${o.length} 条`, o.length, o.length), h.length < 2e3)
          break;
        const g = h.map((E) => E.ann_date).sort()[0];
        if (g <= n)
          break;
        u = this.getPreviousDay(g), await this.sleep(300);
      }
    }
    if (c < r) {
      S.debug("Tushare", "向前获取更新的数据...");
      let u = this.getNextDay(c);
      for (; u <= r; ) {
        S.debug("Tushare", `获取最新数据: ${u} - ${r}`);
        const h = await this.getAnnouncements(t, void 0, u, r, 2e3, 0);
        if (!h || h.length === 0) {
          S.debug("Tushare", "没有更新的数据");
          break;
        }
        if (o.push(...h), S.info("Tushare", `获取到 ${h.length} 条最新公告，累计 ${o.length} 条`), i && i(`已获取 ${o.length} 条`, o.length, o.length), h.length < 2e3)
          break;
        const g = h.map((E) => E.ann_date).sort()[h.length - 1];
        if (g >= r)
          break;
        u = this.getNextDay(g), await this.sleep(300);
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
mi.TOKEN = "834c0133bb912100b3cdacaeb7b5741523839fd9f8932d9e24c0aa1d", mi.BASE_URL = "http://api.tushare.pro";
let Ce = mi;
async function yS(e, t, n) {
  return await Ce.getNews(e, t, n);
}
function ES() {
  x.handle("get-news", async (e, t, n, r) => {
    try {
      return console.log(`[IPC] get-news: src=${t}, dateRange=${n}-${r}`), await yS(t, n, r);
    } catch (i) {
      throw console.error("Failed to get news:", i), i;
    }
  });
}
class Cn extends Sr {
  constructor(t) {
    super(t);
  }
  /**
   * 批量插入或更新股票数据
   */
  upsertStocks(t) {
    const n = this.getCurrentTimestamp(), r = this.db.prepare(`
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
    this.transaction(() => {
      for (const i of t)
        r.run({
          ts_code: i.ts_code || null,
          symbol: i.symbol || null,
          name: i.name || null,
          area: i.area || null,
          industry: i.industry || null,
          fullname: i.fullname || null,
          enname: i.enname || null,
          cnspell: i.cnspell || null,
          market: i.market || null,
          exchange: i.exchange || null,
          curr_type: i.curr_type || null,
          list_status: i.list_status || null,
          list_date: i.list_date || null,
          delist_date: i.delist_date || null,
          is_hs: i.is_hs || null,
          updated_at: n
        });
    });
  }
  /**
   * 获取所有股票列表
   */
  getAllStocks() {
    return this.db.prepare("SELECT * FROM stocks ORDER BY ts_code").all();
  }
  /**
   * 统计股票数量
   */
  countStocks() {
    return this.db.prepare("SELECT COUNT(*) as count FROM stocks").get().count;
  }
  /**
   * 根据关键词搜索股票（名称、代码、拼音）
   */
  searchStocks(t, n = 50) {
    const r = `%${t}%`;
    return this.db.prepare(
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
    ).all(r, r, r, r, t, t, t, n);
  }
  /**
   * 获取股票列表同步信息
   */
  getStockListSyncInfo() {
    const t = this.countStocks(), n = this.db.prepare("SELECT MAX(updated_at) as last_sync_time FROM stocks").get();
    return {
      stockCount: t,
      lastSyncTime: (n == null ? void 0 : n.last_sync_time) || null
    };
  }
}
class Gi extends Sr {
  constructor(t) {
    super(t);
  }
  /**
   * 批量插入或更新十大股东数据
   */
  upsertTop10Holders(t) {
    const n = this.getCurrentTimestamp(), r = this.db.prepare(`
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
    this.transaction(() => {
      for (const i of t)
        r.run({
          ts_code: i.ts_code || null,
          ann_date: i.ann_date || null,
          end_date: i.end_date || null,
          holder_name: i.holder_name || null,
          hold_amount: i.hold_amount || null,
          hold_ratio: i.hold_ratio || null,
          updated_at: n
        });
    });
  }
  /**
   * 获取指定股票的十大股东数据
   */
  getTop10HoldersByStock(t, n = 100) {
    return this.db.prepare(
      `
				SELECT * FROM top10_holders 
				WHERE ts_code = ?
				ORDER BY end_date DESC, hold_ratio DESC
				LIMIT ?
			`
    ).all(t, n);
  }
  /**
   * 获取股票的所有报告期列表
   */
  getTop10HoldersEndDates(t) {
    return this.db.prepare(
      `
				SELECT DISTINCT end_date 
				FROM top10_holders 
				WHERE ts_code = ?
				ORDER BY end_date DESC
			`
    ).all(t).map((r) => r.end_date);
  }
  /**
   * 根据报告期获取十大股东
   */
  getTop10HoldersByStockAndEndDate(t, n) {
    return this.db.prepare(
      `
				SELECT * FROM top10_holders 
				WHERE ts_code = ? AND end_date = ?
				ORDER BY hold_ratio DESC
			`
    ).all(t, n);
  }
  /**
   * 检查股票是否已有十大股东数据
   */
  hasTop10HoldersData(t) {
    return this.db.prepare("SELECT COUNT(*) as count FROM top10_holders WHERE ts_code = ?").get(t).count > 0;
  }
  /**
   * 获取所有已同步十大股东的股票代码列表
   */
  getStocksWithTop10Holders() {
    return this.db.prepare("SELECT DISTINCT ts_code FROM top10_holders ORDER BY ts_code").all().map((n) => n.ts_code);
  }
  /**
   * 统计已同步十大股东的股票数量
   */
  countStocksWithTop10Holders() {
    return this.db.prepare("SELECT COUNT(DISTINCT ts_code) as count FROM top10_holders").get().count;
  }
  /**
   * 根据股东名称搜索股东持股信息
   */
  searchHoldersByName(t, n = 100) {
    const r = `%${t}%`;
    return this.db.prepare(
      `
				SELECT h.*, s.name as stock_name, s.industry, s.market
				FROM top10_holders h
				INNER JOIN stocks s ON h.ts_code = s.ts_code
				WHERE h.holder_name LIKE ?
				ORDER BY h.end_date DESC, h.hold_ratio DESC
				LIMIT ?
			`
    ).all(r, n);
  }
  /**
   * 获取股东持有的所有股票
   */
  getStocksByHolder(t) {
    return this.db.prepare(
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
    ).all(t);
  }
  /**
   * 删除指定股票的十大股东数据（用于重新同步）
   */
  deleteTop10HoldersByStock(t) {
    return this.db.prepare("DELETE FROM top10_holders WHERE ts_code = ?").run(t).changes;
  }
}
class ks extends Sr {
  constructor(t) {
    super(t);
  }
  /**
   * 获取所有分类
   */
  getClassificationCategories() {
    return this.db.prepare(
      `
			SELECT * FROM classification_categories 
			ORDER BY priority ASC
		`
    ).all();
  }
  /**
   * 获取所有规则
   */
  getClassificationRules() {
    return this.db.prepare(
      `
			SELECT * FROM classification_rules 
			ORDER BY category_key, id
		`
    ).all();
  }
  /**
   * 获取指定分类的规则
   */
  getClassificationRulesByCategory(t) {
    return this.db.prepare(
      `
			SELECT id, category_key, keyword, enabled 
			FROM classification_rules 
			WHERE category_key = ?
			ORDER BY id
		`
    ).all(t);
  }
  /**
   * 更新分类信息
   */
  updateClassificationCategory(t, n) {
    const r = this.getCurrentTimestamp(), i = [], o = [];
    n.category_name !== void 0 && (i.push("category_name = ?"), o.push(n.category_name)), n.color !== void 0 && (i.push("color = ?"), o.push(n.color)), n.icon !== void 0 && (i.push("icon = ?"), o.push(n.icon)), n.priority !== void 0 && (i.push("priority = ?"), o.push(n.priority)), n.enabled !== void 0 && (i.push("enabled = ?"), o.push(n.enabled ? 1 : 0)), i.push("updated_at = ?"), o.push(r), o.push(t);
    const s = `UPDATE classification_categories SET ${i.join(", ")} WHERE id = ?`;
    return this.db.prepare(s).run(...o).changes;
  }
  /**
   * 添加分类规则
   */
  addClassificationRule(t, n) {
    const r = this.getCurrentTimestamp();
    return this.db.prepare(`
			INSERT INTO classification_rules (category_key, keyword, enabled, created_at, updated_at)
			VALUES (?, ?, 1, ?, ?)
		`).run(t, n, r, r).lastInsertRowid;
  }
  /**
   * 更新分类规则
   */
  updateClassificationRule(t, n, r) {
    const i = this.getCurrentTimestamp();
    return this.db.prepare(`
			UPDATE classification_rules 
			SET keyword = ?, enabled = ?, updated_at = ?
			WHERE id = ?
		`).run(n, r ? 1 : 0, i, t).changes;
  }
  /**
   * 删除分类规则
   */
  deleteClassificationRule(t) {
    return this.db.prepare("DELETE FROM classification_rules WHERE id = ?").run(t).changes;
  }
  /**
   * 重置为默认规则
   */
  resetClassificationRules() {
    try {
      return this.transaction(() => {
        this.db.prepare("DELETE FROM classification_rules").run(), this.db.prepare("DELETE FROM classification_categories").run();
        const t = this.getCurrentTimestamp(), n = this.db.prepare(`
					INSERT INTO classification_categories (category_key, category_name, color, icon, priority, enabled, created_at, updated_at)
					VALUES (?, ?, ?, ?, ?, 1, ?, ?)
				`), r = this.db.prepare(`
					INSERT INTO classification_rules (category_key, keyword, enabled, created_at, updated_at)
					VALUES (?, ?, 1, ?, ?)
				`);
        for (const i of Of) {
          const o = i.category, s = i.category, a = $f(i.category), l = Df(i.category), d = i.priority;
          n.run(o, s, a, l, d, t, t);
          for (const c of i.keywords)
            r.run(o, c, t, t);
        }
      }), console.log("[DB] 分类规则已重置为默认"), { success: !0 };
    } catch (t) {
      return console.error("[DB Error] 重置分类规则失败:", t), { success: !1, error: String(t) };
    }
  }
  /**
   * 从数据库加载规则并转换为分类引擎可用的格式
   */
  loadClassificationRulesFromDb() {
    const t = this.getClassificationCategories().filter((i) => i.enabled), n = this.getClassificationRules().filter((i) => i.enabled), r = /* @__PURE__ */ new Map();
    for (const i of n)
      r.has(i.category_key) || r.set(i.category_key, []), r.get(i.category_key).push(i.keyword);
    return t.map((i) => ({
      category: i.category_key,
      keywords: r.get(i.category_key) || [],
      priority: i.priority
    }));
  }
}
class Yi extends Sr {
  constructor(t) {
    super(t), this.classificationRepository = new ks(t);
  }
  /**
   * 批量插入或更新公告数据
   */
  upsertAnnouncements(t) {
    const n = this.db.prepare(`
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
    this.transaction(() => {
      for (const r of t) {
        const i = r.category || cr(r.title || "");
        n.run({
          ts_code: r.ts_code || null,
          ann_date: r.ann_date || null,
          ann_type: r.ann_type || null,
          title: r.title || null,
          content: r.content || null,
          pub_time: r.pub_time || null,
          file_path: r.file_path || null,
          name: r.name || null,
          category: i
        });
      }
    });
  }
  /**
   * 获取指定股票的公告列表
   */
  getAnnouncementsByStock(t, n, r = 100) {
    let i = "SELECT * FROM announcements WHERE ts_code = ?";
    const o = [t];
    if (n && n.length > 0) {
      const s = n.map(() => "?").join(",");
      i += ` AND category IN (${s})`, o.push(...n);
    }
    return i += " ORDER BY ann_date DESC, rec_time DESC LIMIT ?", o.push(r), this.db.prepare(i).all(...o);
  }
  /**
   * 根据日期范围获取公告
   */
  getAnnouncementsByDateRange(t, n, r, i, o = 200) {
    let s = "SELECT * FROM announcements WHERE ann_date >= ? AND ann_date <= ?";
    const a = [t, n];
    if (r && (s += " AND ts_code = ?", a.push(r)), i && i.length > 0) {
      const l = i.map(() => "?").join(",");
      s += ` AND category IN (${l})`, a.push(...i);
    }
    return s += " ORDER BY ann_date DESC, rec_time DESC LIMIT ?", a.push(o), this.db.prepare(s).all(...a);
  }
  /**
   * 搜索公告标题
   */
  searchAnnouncements(t, n = 100) {
    const r = `%${t}%`;
    return this.db.prepare(
      `
				SELECT a.*, s.name as stock_name 
				FROM announcements a
				LEFT JOIN stocks s ON a.ts_code = s.ts_code
				WHERE a.title LIKE ? OR a.ts_code LIKE ? OR s.name LIKE ?
				ORDER BY a.ann_date DESC, a.rec_time DESC
				LIMIT ?
			`
    ).all(r, r, r, n);
  }
  /**
   * 检查时间范围是否已同步
   */
  isAnnouncementRangeSynced(t, n, r) {
    let i, o;
    t ? (i = `
				SELECT start_date, end_date 
				FROM announcement_sync_ranges 
				WHERE ts_code = ?
					AND start_date <= ?
					AND end_date >= ?
				ORDER BY start_date
			`, o = [t, r, n]) : (i = `
				SELECT start_date, end_date 
				FROM announcement_sync_ranges 
				WHERE ts_code IS NULL
					AND start_date <= ?
					AND end_date >= ?
				ORDER BY start_date
			`, o = [r, n]);
    const s = this.db.prepare(i).all(...o);
    if (s.length === 0)
      return !1;
    for (const a of s)
      if (a.start_date <= n && a.end_date >= r)
        return !0;
    return !1;
  }
  /**
   * 记录已同步的时间范围
   */
  recordAnnouncementSyncRange(t, n, r) {
    const i = this.getCurrentTimestamp();
    t ? this.db.prepare(`
				INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
				VALUES (?, ?, ?, ?)
			`).run(t, n, r, i) : this.db.prepare(`
				INSERT INTO announcement_sync_ranges (ts_code, start_date, end_date, synced_at)
				VALUES (NULL, ?, ?, ?)
			`).run(n, r, i), this.mergeAnnouncementSyncRanges(t);
  }
  /**
   * 获取需要同步的时间段（排除已同步的部分）
   */
  getUnsyncedAnnouncementRanges(t, n, r) {
    let i, o;
    t ? (i = `
				SELECT start_date, end_date 
				FROM announcement_sync_ranges 
				WHERE ts_code = ?
					AND NOT (end_date < ? OR start_date > ?)
				ORDER BY start_date
			`, o = [t, n, r]) : (i = `
				SELECT start_date, end_date 
				FROM announcement_sync_ranges 
				WHERE ts_code IS NULL
					AND NOT (end_date < ? OR start_date > ?)
				ORDER BY start_date
			`, o = [n, r]);
    const s = this.db.prepare(i).all(...o);
    if (s.length === 0)
      return [{ start_date: n, end_date: r }];
    const a = [];
    let l = n;
    for (const d of s) {
      if (l < d.start_date) {
        const c = this.getPreviousDay(d.start_date);
        a.push({
          start_date: l,
          end_date: c
        });
      }
      l = this.getNextDay(d.end_date);
    }
    return l <= r && a.push({
      start_date: l,
      end_date: r
    }), a;
  }
  /**
   * 统计公告数量
   */
  countAnnouncements() {
    return this.db.prepare("SELECT COUNT(*) as count FROM announcements").get().count;
  }
  /**
   * 获取未打标的公告数量
   */
  getUntaggedAnnouncementsCount() {
    return this.db.prepare("SELECT COUNT(*) as count FROM announcements WHERE category IS NULL").get().count;
  }
  /**
   * 批量打标公告
   */
  tagAnnouncementsBatch(t = 1e3, n, r = !1, i = !0) {
    const o = r ? this.countAnnouncements() : this.getUntaggedAnnouncementsCount();
    let s = 0;
    if (o === 0)
      return { success: !0, processed: 0, total: 0 };
    console.log(`[Tagging] 开始批量打标，共 ${o} 条公告，重新处理所有: ${r}`);
    let a;
    i ? (a = this.classificationRepository.loadClassificationRulesFromDb().map((c) => ({
      category: c.category,
      keywords: c.keywords,
      priority: c.priority
    })), console.log(`[Tagging] 使用数据库规则，共 ${a.length} 个分类`)) : console.log("[Tagging] 使用默认规则");
    const l = this.db.prepare("UPDATE announcements SET category = ? WHERE id = ?");
    try {
      return this.transaction(() => {
        for (; s < o; ) {
          const d = r ? "SELECT id, title FROM announcements LIMIT ? OFFSET ?" : "SELECT id, title FROM announcements WHERE category IS NULL LIMIT ?", c = r ? this.db.prepare(d).all(t, s) : this.db.prepare(d).all(t);
          if (c.length === 0) break;
          for (const u of c) {
            const h = i ? Nf(u.title || "", a) : cr(u.title || "");
            l.run(h, u.id);
          }
          s += c.length, n && n(s, o), console.log(`[Tagging] 已处理 ${s}/${o} (${(s / o * 100).toFixed(2)}%)`);
        }
      }), console.log(`[Tagging] 批量打标完成，共处理 ${s} 条`), { success: !0, processed: s, total: o };
    } catch (d) {
      return console.error("[Tagging Error]", d), { success: !1, processed: s, total: o };
    }
  }
  /**
   * 按分类查询公告
   */
  getAnnouncementsByCategory(t, n = 100) {
    return this.db.prepare(
      `
				SELECT * FROM announcements 
				WHERE category = ? 
				ORDER BY ann_date DESC, pub_time DESC 
				LIMIT ?
			`
    ).all(t, n);
  }
  /**
   * 合并连续或重叠的同步范围（私有方法）
   */
  mergeAnnouncementSyncRanges(t) {
    var c, u;
    let n, r;
    t ? (n = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code = ? ORDER BY start_date", r = [t]) : (n = "SELECT id, start_date, end_date FROM announcement_sync_ranges WHERE ts_code IS NULL ORDER BY start_date", r = []);
    const i = this.db.prepare(n).all(...r);
    if (i.length <= 1)
      return;
    const o = [], s = [];
    let a = i[0];
    for (let h = 1; h < i.length; h++) {
      const g = i[h];
      this.getNextDay(a.end_date) >= g.start_date ? (a = {
        id: a.id,
        start_date: a.start_date,
        end_date: g.end_date > a.end_date ? g.end_date : a.end_date
      }, o.push(g.id)) : (a.end_date !== ((c = i.find((E) => E.id === a.id)) == null ? void 0 : c.end_date) && s.push(a), a = g);
    }
    a.end_date !== ((u = i.find((h) => h.id === a.id)) == null ? void 0 : u.end_date) && s.push(a);
    const l = this.db.prepare("UPDATE announcement_sync_ranges SET end_date = ? WHERE id = ?"), d = this.db.prepare("DELETE FROM announcement_sync_ranges WHERE id = ?");
    this.transaction(() => {
      for (const h of s)
        l.run(h.end_date, h.id);
      for (const h of o)
        d.run(h);
    });
  }
}
const Zo = new Cn(ye());
async function _S() {
  try {
    const e = Zo.countStocks();
    if (e > 0) {
      console.log(`Stock list already synced: ${e} stocks`);
      return;
    }
    console.log("Stock list is empty, syncing...");
    const t = await Ce.getStockList(void 0, void 0, void 0, void 0, void 0, "L", 5e3, 0);
    if (t && t.length > 0) {
      Zo.upsertStocks(t), console.log(`Synced ${t.length} stocks to database`);
      const n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
      Rn.updateSyncFlag("stock_list", n), Ge.isSupported() && new Ge({
        title: "股票列表同步完成",
        body: `已同步 ${t.length} 只股票`
      }).show();
    }
  } catch (e) {
    console.error("Failed to sync stocks:", e);
  }
}
async function vS(e) {
  try {
    console.log("Starting to sync all stocks..."), e == null || e({
      status: "started",
      message: "开始同步股票列表..."
    });
    const t = await Ce.getStockList(void 0, void 0, void 0, void 0, void 0, "L", 5e3, 0);
    if (t && t.length > 0) {
      e == null || e({
        status: "syncing",
        message: `正在同步 ${t.length} 只股票...`,
        stockCount: t.length
      }), Zo.upsertStocks(t), console.log(`Synced ${t.length} stocks to database`);
      const n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
      return Rn.updateSyncFlag("stock_list", n), e == null || e({
        status: "completed",
        message: `成功同步 ${t.length} 只股票`,
        stockCount: t.length
      }), {
        success: !0,
        stockCount: t.length,
        message: `成功同步 ${t.length} 只股票`
      };
    } else
      return e == null || e({
        status: "failed",
        message: "未获取到股票数据"
      }), {
        success: !1,
        stockCount: 0,
        message: "未获取到股票数据"
      };
  } catch (t) {
    return console.error("Failed to sync stocks:", t), e == null || e({
      status: "failed",
      message: t.message || "同步失败",
      error: t.message
    }), {
      success: !1,
      stockCount: 0,
      message: t.message || "同步失败"
    };
  }
}
const Un = new Cn(ye()), wS = new qi(ye()), TS = new Gi(ye()), tc = new Yi(ye());
function SS(e) {
  x.handle("search-stocks", async (t, n, r = 50) => {
    try {
      return console.log(`[IPC] search-stocks: keyword=${n}, limit=${r}`), Un.searchStocks(n, r);
    } catch (i) {
      throw console.error("Failed to search stocks:", i), i;
    }
  }), x.handle("get-stock-list-sync-info", async () => {
    try {
      return console.log("[IPC] get-stock-list-sync-info"), Un.getStockListSyncInfo();
    } catch (t) {
      throw console.error("Failed to get stock list sync info:", t), t;
    }
  }), x.handle("sync-all-stocks", async () => {
    try {
      return console.log("[IPC] sync-all-stocks"), await vS((n) => {
        e == null || e.webContents.send("stock-list-sync-progress", n);
      });
    } catch (t) {
      throw console.error("Failed to sync all stocks:", t), t;
    }
  }), x.handle("check-stock-list-sync-status", async () => {
    try {
      console.log("[IPC] check-stock-list-sync-status");
      const t = Un.getStockListSyncInfo(), n = kf("stock_list");
      return {
        ...t,
        isSyncedToday: n
      };
    } catch (t) {
      throw console.error("Failed to check stock list sync status:", t), t;
    }
  }), x.handle("get-latest-trade-date", async () => {
    try {
      const n = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ""), r = /* @__PURE__ */ new Date();
      r.setDate(r.getDate() - 30);
      const i = r.toISOString().slice(0, 10).replace(/-/g, "");
      console.log(`[IPC] get-latest-trade-date: fetching from ${i} to ${n}`);
      const o = await Ce.getTradeCalendar("SSE", i, n, "1");
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
  }), x.handle("get-cache-data-stats", async () => {
    try {
      console.log("[IPC] get-cache-data-stats");
      const t = Un.countStocks(), n = wS.countFavoriteStocks(), r = TS.countStocksWithTop10Holders(), i = tc.countAnnouncements(), o = Un.getStockListSyncInfo(), s = ye().prepare("SELECT sync_type, last_sync_date, updated_at FROM sync_flags ORDER BY sync_type").all(), l = ye().prepare("SELECT COUNT(*) as count FROM top10_holders").get().count;
      return {
        stocks: {
          count: t,
          lastSyncTime: o.lastSyncTime
        },
        favoriteStocks: {
          count: n
        },
        top10Holders: {
          stockCount: r,
          recordCount: l
        },
        announcements: {
          count: i
        },
        syncFlags: s.map((d) => ({
          type: d.sync_type,
          lastSyncDate: d.last_sync_date,
          updatedAt: d.updated_at
        }))
      };
    } catch (t) {
      throw console.error("Failed to get cache data stats:", t), t;
    }
  }), x.handle("get-untagged-count", async () => {
    try {
      return console.log("[IPC] get-untagged-count"), { count: tc.getUntaggedAnnouncementsCount() };
    } catch (t) {
      throw console.error("Failed to get untagged count:", t), t;
    }
  });
}
const xs = new Cn(ye()), AS = new qi(ye()), Yt = new Yi(ye());
async function RS(e, t, n, r, i, o) {
  const s = xs.getAllStocks();
  let a = s;
  i && i !== "all" && (a = s.filter((E) => E.market === i));
  let l = [];
  (!o && n && r ? Yt.isAnnouncementRangeSynced(null, n, r) : !1) && n && r ? (S.debug("Announcement", `从数据库读取公告: ${n} - ${r}`), l = Yt.getAnnouncementsByDateRange(n, r), S.info("Announcement", `从数据库读取到 ${l.length} 条公告`)) : (o ? S.info("Announcement", `强制从 API 获取公告: ${n || "无"} - ${r || "无"}`) : S.info("Announcement", `从 API 获取公告: ${n || "无"} - ${r || "无"}`), n && r ? (S.debug("Announcement", `使用完整获取方式获取公告: ${n} - ${r}`), l = await Ce.getAnnouncementsComplete(
    void 0,
    // 全市场
    n,
    r,
    (E, _, T) => {
      S.debug("Announcement", E);
    }
  )) : l = await Ce.getAnnouncements(void 0, void 0, n, r, 2e3, 0), l.length > 0 && (S.info("Announcement", `保存 ${l.length} 条公告到数据库`), Yt.upsertAnnouncements(l), n && r && (Yt.recordAnnouncementSyncRange(null, n, r), S.debug("Announcement", `记录同步范围: ${n} - ${r}`))));
  const c = Us(a, l), u = c.length, h = (e - 1) * t;
  return { items: c.slice(h, h + t), total: u, page: e, pageSize: t };
}
async function CS(e, t, n, r, i, o) {
  const s = xs.searchStocks(e, 1e3);
  let a = s;
  if (o && o !== "all" && (a = s.filter((E) => E.market === o)), a.length === 0)
    return { items: [], total: 0, page: t, pageSize: n };
  const l = a.map((E) => E.ts_code).join(","), d = await Ce.getAnnouncements(l, void 0, r, i, 2e3, 0), c = Us(a, d), u = c.length, h = (t - 1) * n;
  return { items: c.slice(h, h + n), total: u, page: t, pageSize: n };
}
async function IS(e, t, n, r) {
  const i = AS.getAllFavoriteStocks();
  if (i.length === 0)
    return { items: [], total: 0, page: e, pageSize: t };
  const s = xs.getAllStocks().filter((g) => i.includes(g.ts_code));
  let a = [];
  if ((n && r ? Yt.isAnnouncementRangeSynced(null, n, r) : !1) && n && r)
    S.debug("Announcement", `从数据库读取关注股票公告: ${n} - ${r}`), a = Yt.getAnnouncementsByDateRange(n, r).filter((E) => i.includes(E.ts_code)), S.info("Announcement", `从数据库读取到 ${a.length} 条关注股票公告`);
  else {
    S.info("Announcement", `从 API 获取关注股票公告: ${n || "无"} - ${r || "无"}`);
    for (const g of i)
      try {
        const E = await Ce.getAnnouncements(g, void 0, n, r, 2e3, 0);
        a.push(...E), i.length > 1 && await new Promise((_) => setTimeout(_, 200));
      } catch (E) {
        S.error("Announcement", `Failed to get announcements for ${g}:`, E);
      }
    a.length > 0 && (S.info("Announcement", `保存 ${a.length} 条关注股票公告到数据库`), Yt.upsertAnnouncements(a));
  }
  const d = Us(s, a), c = d.length, u = (e - 1) * t;
  return { items: d.slice(u, u + t), total: c, page: e, pageSize: t };
}
function Us(e, t) {
  const n = /* @__PURE__ */ new Map();
  e.forEach((i) => {
    n.set(i.ts_code, {
      ts_code: i.ts_code,
      stock_name: i.name,
      industry: i.industry || "",
      market: i.market || "",
      announcements: []
    });
  }), t.forEach((i) => {
    const o = n.get(i.ts_code);
    o && o.announcements.push(i);
  });
  const r = Array.from(n.values()).map((i) => {
    if (i.announcements.length === 0)
      return null;
    i.announcements.sort((a, l) => {
      const d = (l.ann_date || "").localeCompare(a.ann_date || "");
      return d !== 0 ? d : (l.pub_time || "").localeCompare(a.pub_time || "");
    });
    const o = {};
    i.announcements.forEach((a) => {
      const l = cr(a.title);
      o[l] = (o[l] || 0) + 1;
    });
    const s = i.announcements[0];
    return {
      ts_code: i.ts_code,
      name: i.stock_name,
      industry: i.industry,
      market: i.market,
      announcements: i.announcements.map((a) => ({
        ts_code: a.ts_code,
        ann_date: a.ann_date,
        ann_type: a.ann_type,
        title: a.title,
        content: a.content,
        pub_time: a.pub_time,
        category: cr(a.title)
      })),
      totalCount: i.announcements.length,
      // 添加分类统计
      category_stats: o,
      // 添加最新公告信息
      latest_ann_date: s.ann_date,
      latest_ann_time: s.pub_time,
      latest_ann_title: s.title
    };
  }).filter((i) => i !== null);
  return r.sort((i, o) => {
    var d, c;
    const s = ((d = i.announcements[0]) == null ? void 0 : d.ann_date) || "", l = (((c = o.announcements[0]) == null ? void 0 : c.ann_date) || "").localeCompare(s);
    return l !== 0 ? l : (i.name || "").localeCompare(o.name || "");
  }), r;
}
function Lo(e) {
  return cr(e);
}
const mt = new Yi(ye());
function bS() {
  x.handle(
    "get-announcements-grouped",
    async (e, t, n, r, i, o, s) => {
      try {
        S.debug(
          "IPC",
          `get-announcements-grouped: page=${t}, pageSize=${n}, dateRange=${r}-${i}, market=${o}, forceRefresh=${s}`
        );
        const a = await RS(t, n, r, i, o, s);
        return S.debug("IPC", `get-announcements-grouped: page=${t}, items=${a.items.length}, total=${a.total}`), a;
      } catch (a) {
        throw S.error("IPC", "Failed to get grouped announcements:", a), a;
      }
    }
  ), x.handle("get-stock-announcements", async (e, t, n = 100, r, i) => {
    try {
      S.debug("IPC", `get-stock-announcements: tsCode=${t}, limit=${n}, dateRange=${r}-${i}`);
      const o = await Ce.getAnnouncements(t, void 0, r, i, n, 0);
      return o.sort((s, a) => {
        const l = (a.ann_date || "").localeCompare(s.ann_date || "");
        return l !== 0 ? l : (a.pub_time || "").localeCompare(s.pub_time || "");
      }), o.map((s) => ({
        ts_code: s.ts_code,
        ann_date: s.ann_date,
        ann_type: s.ann_type,
        title: s.title,
        content: s.content,
        pub_time: s.pub_time,
        category: Lo(s.title)
      }));
    } catch (o) {
      throw S.error("IPC", "Failed to get stock announcements:", o), o;
    }
  }), x.handle(
    "search-announcements-grouped",
    async (e, t, n, r, i, o, s) => {
      try {
        S.debug(
          "IPC",
          `search-announcements-grouped: keyword=${t}, page=${n}, pageSize=${r}, dateRange=${i}-${o}, market=${s}`
        );
        const a = await CS(t, n, r, i, o, s);
        return S.debug("IPC", `search-announcements-grouped: page=${n}, items=${a.items.length}, total=${a.total}`), a;
      } catch (a) {
        throw S.error("IPC", "Failed to search grouped announcements:", a), a;
      }
    }
  ), x.handle(
    "get-favorite-stocks-announcements-grouped",
    async (e, t, n, r, i) => {
      try {
        S.debug("IPC", `get-favorite-stocks-announcements-grouped: page=${t}, pageSize=${n}, dateRange=${r}-${i}`);
        const o = await IS(t, n, r, i);
        return S.debug("IPC", `get-favorite-stocks-announcements-grouped: page=${t}, items=${o.items.length}, total=${o.total}`), o;
      } catch (o) {
        throw S.error("IPC", "Failed to get favorite stocks announcements:", o), o;
      }
    }
  ), x.handle("get-announcement-pdf", async (e, t, n, r) => {
    try {
      S.debug("IPC", `get-announcement-pdf: tsCode=${t}, annDate=${n}, title=${r}`);
      const i = await Ce.getAnnouncementFiles(t, n);
      S.debug("IPC", `Found ${i.length} announcements for ${t} on ${n}`);
      let o = i.find((s) => s.title === r);
      return o || (o = i.find((s) => {
        const a = s.title || "", l = r || "";
        return a.includes(l) || l.includes(a);
      })), o && o.url ? (S.debug("IPC", `Found PDF URL: ${o.url}`), {
        success: !0,
        url: o.url
      }) : (S.debug("IPC", `No PDF found for announcement: ${r}`), {
        success: !1,
        message: "该公告暂无 PDF 文件"
      });
    } catch (i) {
      return S.error("IPC", "Failed to get announcement PDF:", i), {
        success: !1,
        message: i.message || "获取 PDF 失败"
      };
    }
  }), x.handle("get-announcements-from-cache", async (e, t, n, r) => {
    try {
      S.debug("IPC", `get-announcements-from-cache: tsCode=${t}, dateRange=${n}-${r}`);
      const o = mt.getAnnouncementsByDateRange(n, r, t || void 0).map((s) => ({
        ...s,
        category: Lo(s.title)
      }));
      return S.debug("IPC", `get-announcements-from-cache: found ${o.length} announcements`), o;
    } catch (i) {
      throw S.error("IPC", "Failed to get announcements from cache:", i), i;
    }
  }), x.handle("check-announcement-range-synced", async (e, t, n, r) => {
    try {
      S.debug("IPC", `check-announcement-range-synced: tsCode=${t}, dateRange=${n}-${r}`);
      const i = mt.isAnnouncementRangeSynced(t, n, r);
      return S.debug("IPC", `check-announcement-range-synced: isSynced=${i}`), { isSynced: i };
    } catch (i) {
      throw S.error("IPC", "Failed to check announcement range synced:", i), i;
    }
  }), x.handle("search-announcements-from-cache", async (e, t, n = 100) => {
    try {
      S.debug("IPC", `search-announcements-from-cache: keyword=${t}, limit=${n}`);
      const i = mt.searchAnnouncements(t, n).map((o) => ({
        ...o,
        category: Lo(o.title)
      }));
      return S.debug("IPC", `search-announcements-from-cache: found ${i.length} announcements`), i;
    } catch (r) {
      throw S.error("IPC", "Failed to search announcements from cache:", r), r;
    }
  }), x.handle("get-announcements-cache-stats", async () => {
    try {
      return S.debug("IPC", "get-announcements-cache-stats"), {
        totalCount: mt.countAnnouncements()
      };
    } catch (e) {
      throw S.error("IPC", "Failed to get announcements cache stats:", e), e;
    }
  }), x.handle("tag-all-announcements", async (e, t = 1e3, n = !1) => {
    try {
      S.info("IPC", `tag-all-announcements: batchSize=${t}, reprocessAll=${n}`);
      const r = mt.tagAnnouncementsBatch(t, void 0, n);
      return S.info("IPC", `tag-all-announcements: processed ${r.processed} announcements`), r;
    } catch (r) {
      throw S.error("IPC", "Failed to tag all announcements:", r), r;
    }
  }), x.handle("reprocess-all-announcements", async (e, t = 1e3) => {
    try {
      S.info("IPC", `reprocess-all-announcements: batchSize=${t}`);
      const n = mt.tagAnnouncementsBatch(t, void 0, !0);
      return S.info("IPC", `reprocess-all-announcements: processed ${n.processed} announcements`), n;
    } catch (n) {
      throw S.error("IPC", "Failed to reprocess all announcements:", n), n;
    }
  }), x.handle("sync-announcements-range", async (e, t, n, r) => {
    try {
      S.info("IPC", `sync-announcements-range: tsCode=${t}, dateRange=${n}-${r}`);
      const i = await Ce.getAnnouncementsComplete(t || void 0, n, r, (o, s, a) => {
        S.debug("IPC", o);
      });
      return i.length > 0 && (mt.upsertAnnouncements(i), mt.recordAnnouncementSyncRange(t, n, r)), S.info("IPC", `sync-announcements-range: synced ${i.length} announcements`), {
        success: !0,
        count: i.length
      };
    } catch (i) {
      throw S.error("IPC", "Failed to sync announcements range:", i), i;
    }
  });
}
const OS = new Cn(ye()), es = new Gi(ye());
let vt = !1, St = !1;
async function NS(e, t) {
  var n, r;
  if (vt)
    return { success: !1, status: "skipped", message: "同步正在进行中" };
  vt = !0, St = !1, console.log("[Holder Service] Starting sync all top10 holders...");
  try {
    const i = OS.getAllStocks(), o = i.length;
    if (o === 0)
      return { success: !1, status: "failed", message: "没有股票数据，请先同步股票列表" };
    console.log(`[Holder Service] Total stocks to sync: ${o}`);
    let s = 0, a = 0, l = 0;
    for (let d = 0; d < i.length; d++) {
      for (; St && vt; )
        await new Promise((u) => setTimeout(u, 500));
      if (!vt)
        return console.log("[Holder Service] Sync stopped by user"), {
          success: !1,
          status: "stopped",
          message: `同步已停止。成功：${s}，跳过：${a}，失败：${l}`,
          successCount: s,
          skipCount: a,
          failCount: l,
          totalStocks: o
        };
      const c = i[d];
      if (es.hasTop10HoldersData(c.ts_code)) {
        a++, console.log(`[${d + 1}/${o}] Skip ${c.ts_code} ${c.name} - already synced`);
        const u = {
          status: "skipped",
          current: d + 1,
          total: o,
          tsCode: c.ts_code,
          name: c.name,
          successCount: s,
          skipCount: a,
          failCount: l
        };
        t == null || t(u), e == null || e.webContents.send("top10-holders-sync-progress", u);
        continue;
      }
      try {
        const u = await Ce.getTop10Holders(c.ts_code);
        u && u.length > 0 ? (es.upsertTop10Holders(u), s++, console.log(`[${d + 1}/${o}] Success ${c.ts_code} ${c.name} - ${u.length} holders`)) : (a++, console.log(`[${d + 1}/${o}] Skip ${c.ts_code} ${c.name} - no data`));
        const h = {
          status: "syncing",
          current: d + 1,
          total: o,
          tsCode: c.ts_code,
          name: c.name,
          successCount: s,
          skipCount: a,
          failCount: l
        };
        t == null || t(h), e == null || e.webContents.send("top10-holders-sync-progress", h), await new Promise((g) => setTimeout(g, 200));
      } catch (u) {
        l++, console.error(`[${d + 1}/${o}] Failed ${c.ts_code} ${c.name}:`, u.message);
        const h = {
          status: "failed",
          current: d + 1,
          total: o,
          tsCode: c.ts_code,
          name: c.name,
          error: u.message,
          successCount: s,
          skipCount: a,
          failCount: l
        };
        t == null || t(h), e == null || e.webContents.send("top10-holders-sync-progress", h), ((n = u.message) != null && n.includes("限流") || (r = u.message) != null && r.includes("频繁")) && (console.log("API 限流，等待 5 秒后继续..."), await new Promise((g) => setTimeout(g, 5e3)));
      }
    }
    return console.log(`[Holder Service] Sync completed: success=${s}, skip=${a}, fail=${l}`), {
      success: !0,
      status: "success",
      message: `同步完成：成功 ${s}，跳过 ${a}，失败 ${l}`,
      successCount: s,
      skipCount: a,
      failCount: l,
      totalStocks: o
    };
  } catch (i) {
    return console.error("Failed to sync all top10 holders:", i), { success: !1, status: "failed", message: i.message || "同步失败" };
  } finally {
    vt = !1, St = !1;
  }
}
function $S() {
  if (!vt)
    return { status: "failed", message: "没有正在进行的同步任务" };
  St = !St;
  const e = St ? "paused" : "resumed", t = St ? "同步已暂停" : "同步已恢复";
  return console.log(`[Holder Service] Sync ${e}`), { status: e, message: t };
}
function DS() {
  return vt ? (vt = !1, St = !1, console.log("[Holder Service] Sync stopped"), { status: "stopped", message: "同步已停止" }) : { status: "failed", message: "没有正在进行的同步任务" };
}
async function PS(e) {
  try {
    console.log(`[Holder Service] Syncing top10 holders for ${e}...`);
    const t = await Ce.getTop10Holders(e);
    return t && t.length > 0 ? (es.upsertTop10Holders(t), console.log(`[Holder Service] Synced ${t.length} holders for ${e}`), {
      status: "success",
      message: `成功同步 ${t.length} 条十大股东数据`,
      count: t.length
    }) : {
      status: "success",
      message: "该股票暂无十大股东数据",
      count: 0
    };
  } catch (t) {
    return console.error(`[Holder Service] Failed to sync top10 holders for ${e}:`, t), {
      status: "failed",
      message: t.message || "同步失败"
    };
  }
}
const FS = new Cn(ye()), Mt = new Gi(ye());
function LS(e) {
  x.handle("get-top10-holders", async (t, n, r, i, o, s) => {
    try {
      return console.log(
        `[IPC] get-top10-holders: tsCode=${n}, period=${r}, annDate=${i}, startDate=${o}, endDate=${s}`
      ), await Ce.getTop10Holders(n, r, i, o, s);
    } catch (a) {
      throw console.error("Failed to get top10 holders:", a), a;
    }
  }), x.handle("sync-all-top10-holders", async (t) => {
    try {
      return console.log("[IPC] sync-all-top10-holders"), await NS(e);
    } catch (n) {
      throw console.error("Failed to sync all top10 holders:", n), n;
    }
  }), x.handle("toggle-pause-top10-holders-sync", async () => {
    try {
      return console.log("[IPC] toggle-pause-top10-holders-sync"), $S();
    } catch (t) {
      throw console.error("Failed to toggle pause sync:", t), t;
    }
  }), x.handle("stop-top10-holders-sync", async () => {
    try {
      return console.log("[IPC] stop-top10-holders-sync"), DS();
    } catch (t) {
      throw console.error("Failed to stop sync:", t), t;
    }
  }), x.handle("sync-stock-top10-holders", async (t, n) => {
    try {
      return console.log(`[IPC] sync-stock-top10-holders: tsCode=${n}`), Mt.deleteTop10HoldersByStock(n), await PS(n);
    } catch (r) {
      return console.error("Failed to sync stock top10 holders:", r), {
        status: "failed",
        message: r.message || "同步失败"
      };
    }
  }), x.handle("get-top10-holders-from-db", async (t, n, r = 100) => {
    try {
      return console.log(`[IPC] get-top10-holders-from-db: tsCode=${n}, limit=${r}`), Mt.getTop10HoldersByStock(n, r);
    } catch (i) {
      throw console.error("Failed to get top10 holders from db:", i), i;
    }
  }), x.handle("has-top10-holders-data", async (t, n) => {
    try {
      return Mt.hasTop10HoldersData(n);
    } catch (r) {
      return console.error("Failed to check top10 holders data:", r), !1;
    }
  }), x.handle("get-top10-holders-sync-stats", async () => {
    try {
      const t = FS.countStocks(), n = Mt.countStocksWithTop10Holders(), r = Mt.getStocksWithTop10Holders();
      return {
        totalStocks: t,
        syncedStocks: n,
        syncedStockCodes: r,
        syncRate: t > 0 ? (n / t * 100).toFixed(2) : "0"
      };
    } catch (t) {
      throw console.error("Failed to get top10 holders sync stats:", t), t;
    }
  }), x.handle("get-top10-holders-end-dates", async (t, n) => {
    try {
      return console.log(`[IPC] get-top10-holders-end-dates: tsCode=${n}`), Mt.getTop10HoldersEndDates(n);
    } catch (r) {
      return console.error("Failed to get top10 holders end dates:", r), [];
    }
  }), x.handle("get-top10-holders-by-end-date", async (t, n, r) => {
    try {
      return console.log(`[IPC] get-top10-holders-by-end-date: tsCode=${n}, endDate=${r}`), Mt.getTop10HoldersByStockAndEndDate(n, r);
    } catch (i) {
      throw console.error("Failed to get top10 holders by end date:", i), i;
    }
  });
}
const yt = new ks(ye());
function kS() {
  x.handle("get-classification-categories", async () => {
    try {
      return { success: !0, categories: yt.getClassificationCategories() };
    } catch (e) {
      return console.error("Failed to get classification categories:", e), { success: !1, categories: [], error: e.message };
    }
  }), x.handle("get-classification-rules", async () => {
    try {
      return { success: !0, rules: yt.getClassificationRules() };
    } catch (e) {
      return console.error("Failed to get classification rules:", e), { success: !1, rules: [], error: e.message };
    }
  }), x.handle("get-classification-rules-by-category", async (e, t) => {
    try {
      return { success: !0, rules: yt.getClassificationRulesByCategory(t) };
    } catch (n) {
      return console.error("Failed to get classification rules by category:", n), { success: !1, rules: [], error: n.message };
    }
  }), x.handle("update-classification-category", async (e, t, n) => {
    try {
      return { success: !0, changes: yt.updateClassificationCategory(t, n) };
    } catch (r) {
      return console.error("Failed to update classification category:", r), { success: !1, changes: 0, error: r.message };
    }
  }), x.handle("add-classification-rule", async (e, t, n) => {
    try {
      const r = yt.addClassificationRule(t, n);
      return { success: !0, id: Number(r) };
    } catch (r) {
      return console.error("Failed to add classification rule:", r), { success: !1, id: 0, error: r.message };
    }
  }), x.handle("update-classification-rule", async (e, t, n, r) => {
    try {
      return { success: !0, changes: yt.updateClassificationRule(t, n, r) };
    } catch (i) {
      return console.error("Failed to update classification rule:", i), { success: !1, changes: 0, error: i.message };
    }
  }), x.handle("delete-classification-rule", async (e, t) => {
    try {
      return { success: !0, changes: yt.deleteClassificationRule(t) };
    } catch (n) {
      return console.error("Failed to delete classification rule:", n), { success: !1, changes: 0, error: n.message };
    }
  }), x.handle("reset-classification-rules", async () => {
    try {
      return yt.resetClassificationRules();
    } catch (e) {
      return console.error("Failed to reset classification rules:", e), { success: !1, error: e.message };
    }
  });
}
let ge = null, Bt = 8080, qe = "", at = "";
function nc() {
  return z.join(se.getPath("userData"), "column-widths.json");
}
function xS(e) {
  x.handle("get-db-connection-info", async () => {
    try {
      const t = ri(), n = ge !== null, r = n ? `http://localhost:${Bt}` : null, i = !!(qe && at);
      return console.log(`[IPC] get-db-connection-info: ${t}`), {
        success: !0,
        dbPath: t,
        connectionString: `sqlite://${t}`,
        httpServerUrl: r,
        isServerRunning: n,
        port: Bt,
        hasAuth: i,
        username: qe || null,
        password: i ? at : ""
      };
    } catch (t) {
      return console.error("Failed to get DB connection info:", t), {
        success: !1,
        message: t.message || "获取数据库信息失败"
      };
    }
  }), x.handle("start-sqlite-http-server", async (t, n) => {
    try {
      if (ge)
        return {
          success: !1,
          message: "HTTP 服务器已在运行",
          port: Bt
        };
      const r = n || Bt, i = ri(), s = (await Promise.resolve().then(() => uS)).default;
      return ge = Kd(async (a, l) => {
        if (l.setHeader("Access-Control-Allow-Origin", "*"), l.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"), l.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"), l.setHeader("Content-Type", "application/json; charset=utf-8"), a.method === "OPTIONS") {
          l.writeHead(200), l.end();
          return;
        }
        if (qe && at) {
          const d = a.headers.authorization;
          if (!d || !d.startsWith("Basic ")) {
            l.writeHead(401, { "WWW-Authenticate": 'Basic realm="SQLite Database"' }), l.end(JSON.stringify({ error: "Authentication required" }));
            return;
          }
          const c = Buffer.from(d.substring(6), "base64").toString("utf-8"), [u, h] = c.split(":");
          if (u !== qe || h !== at) {
            l.writeHead(401, { "WWW-Authenticate": 'Basic realm="SQLite Database"' }), l.end(JSON.stringify({ error: "Invalid credentials" }));
            return;
          }
        }
        try {
          const c = new Xd(a.url || "/", `http://${a.headers.host}`).pathname;
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
            a.on("data", (h) => {
              u += h.toString();
            }), a.on("end", () => {
              try {
                const { sql: h, params: g = [] } = JSON.parse(u);
                if (!h || typeof h != "string") {
                  l.writeHead(400), l.end(JSON.stringify({ error: "SQL query is required" }));
                  return;
                }
                if (!h.trim().toUpperCase().startsWith("SELECT")) {
                  l.writeHead(403), l.end(JSON.stringify({ error: "Only SELECT queries are allowed" }));
                  return;
                }
                const E = s.prepare(h), _ = g.length > 0 ? E.all(...g) : E.all();
                l.writeHead(200), l.end(JSON.stringify({ success: !0, data: _ }));
              } catch (h) {
                l.writeHead(500), l.end(JSON.stringify({ error: h.message || "Query execution failed" }));
              }
            });
            return;
          }
          if (c === "/tables" && a.method === "GET") {
            const u = s.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
            l.writeHead(200), l.end(JSON.stringify({ success: !0, data: u.map((h) => h.name) }));
            return;
          }
          if (c.startsWith("/table/") && a.method === "GET") {
            const u = c.split("/")[2];
            if (!u) {
              l.writeHead(400), l.end(JSON.stringify({ error: "Table name is required" }));
              return;
            }
            const h = s.prepare(`PRAGMA table_info(${u})`).all();
            l.writeHead(200), l.end(JSON.stringify({ success: !0, data: h }));
            return;
          }
          l.writeHead(404), l.end(JSON.stringify({ error: "Not found" }));
        } catch (d) {
          l.writeHead(500), l.end(JSON.stringify({ error: d.message || "Internal server error" }));
        }
      }), ge.listen(r, () => {
        const a = qe && at ? ` (认证: ${qe})` : " (无认证)";
        console.log(`[SQLite HTTP Server] Started on http://localhost:${r}${a}`), e == null || e.webContents.send("sqlite-http-server-started", {
          port: r,
          hasAuth: !!(qe && at),
          username: qe || null
        });
      }), ge.on("error", (a) => {
        console.error("[SQLite HTTP Server] Error:", a), a.code === "EADDRINUSE" && (e == null || e.webContents.send("sqlite-http-server-error", {
          message: `端口 ${r} 已被占用`
        }));
      }), Bt = r, {
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
  }), x.handle("stop-sqlite-http-server", async () => {
    try {
      return ge ? new Promise((t) => {
        ge == null || ge.close(() => {
          console.log("[SQLite HTTP Server] Stopped"), ge = null, e == null || e.webContents.send("sqlite-http-server-stopped"), t({
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
  }), x.handle("get-sqlite-http-server-status", async () => ({
    isRunning: ge !== null,
    port: Bt,
    url: ge ? `http://localhost:${Bt}` : null,
    hasAuth: !!(qe && at),
    username: qe || null
  })), x.handle("set-sqlite-http-auth", async (t, n, r) => {
    try {
      return !n || !r ? {
        success: !1,
        message: "用户名和密码不能为空"
      } : (qe = n, at = r, console.log(`[SQLite HTTP Server] Auth configured: username=${n}`), {
        success: !0,
        message: "认证信息已设置"
      });
    } catch (i) {
      return console.error("Failed to set SQLite HTTP auth:", i), {
        success: !1,
        message: i.message || "设置认证信息失败"
      };
    }
  }), x.handle("clear-sqlite-http-auth", async () => {
    try {
      return qe = "", at = "", console.log("[SQLite HTTP Server] Auth cleared"), {
        success: !0,
        message: "认证信息已清除"
      };
    } catch (t) {
      return console.error("Failed to clear SQLite HTTP auth:", t), {
        success: !1,
        message: t.message || "清除认证信息失败"
      };
    }
  }), x.handle("save-column-widths", async (t, n, r) => {
    try {
      const i = nc();
      let o = {};
      if (ce.existsSync(i)) {
        const s = ce.readFileSync(i, "utf-8");
        o = JSON.parse(s);
      }
      return o[n] = r, ce.writeFileSync(i, JSON.stringify(o, null, 2), "utf-8"), console.log(`[IPC] save-column-widths: tableId=${n}`), { success: !0 };
    } catch (i) {
      return console.error("Failed to save column widths:", i), {
        success: !1,
        error: i.message || "保存列宽配置失败"
      };
    }
  }), x.handle("get-column-widths", async (t, n) => {
    try {
      const r = nc();
      if (!ce.existsSync(r))
        return { success: !0, columnWidths: {} };
      const i = ce.readFileSync(r, "utf-8"), o = JSON.parse(i);
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
  }), x.handle("reset-database", async (t, n) => {
    try {
      console.log("[IPC] reset-database: 开始重置数据库", n);
      const r = ri();
      let i = null;
      if (n.backup)
        try {
          const o = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
          i = z.join(se.getPath("userData"), `cafe_stock_backup_${o}.db`), console.log(`[DB Reset] 正在备份数据库到: ${i}`), ce.copyFileSync(r, i), console.log("[DB Reset] 数据库备份成功");
        } catch (o) {
          return console.error("[DB Reset] 备份失败:", o), {
            success: !1,
            message: `备份失败: ${o.message}`
          };
        }
      if (ge)
        try {
          console.log("[DB Reset] 正在停止 SQLite HTTP 服务器..."), ge.close(), ge = null, console.log("[DB Reset] SQLite HTTP 服务器已停止");
        } catch (o) {
          console.error("[DB Reset] 停止服务器失败:", o);
        }
      try {
        console.log("[DB Reset] 正在关闭数据库连接..."), xf(), console.log("[DB Reset] 数据库连接已关闭");
      } catch (o) {
        return console.error("[DB Reset] 关闭数据库失败:", o), {
          success: !1,
          message: `关闭数据库失败: ${o.message}`
        };
      }
      try {
        console.log("[DB Reset] 正在删除数据库文件..."), ce.existsSync(r) && (ce.unlinkSync(r), console.log("[DB Reset] 数据库文件已删除"));
      } catch (o) {
        return console.error("[DB Reset] 删除数据库文件失败:", o), {
          success: !1,
          message: `删除数据库文件失败: ${o.message}`,
          backupPath: i
        };
      }
      return console.log("[DB Reset] 数据库重置成功，准备重启应用..."), setTimeout(() => {
        se.relaunch(), se.exit(0);
      }, 1e3), {
        success: !0,
        message: "数据库重置成功，应用将在 1 秒后重启",
        backupPath: i
      };
    } catch (r) {
      return console.error("[DB Reset] 重置数据库失败:", r), {
        success: !1,
        message: `重置数据库失败: ${r.message}`
      };
    }
  });
}
function US() {
  ge && (ge.close(), ge = null);
}
function MS(e) {
  S.info("IPC", "Setting up IPC handlers..."), eS(), tS(), mS(), ES(), SS(e), bS(), LS(e), kS(), xS(e), S.info("IPC", "All IPC handlers registered successfully");
}
class BS {
  constructor() {
    this.services = /* @__PURE__ */ new Map(), this.factories = /* @__PURE__ */ new Map(), this.singletons = /* @__PURE__ */ new Map();
  }
  /**
   * 注册服务工厂函数
   * @param key 服务标识
   * @param factory 工厂函数
   * @param singleton 是否单例（默认 true）
   */
  register(t, n, r = !0) {
    this.factories.set(t, n), r || this.services.set(t, n), S.debug("DI", `注册服务: ${t} (单例: ${r})`);
  }
  /**
   * 注册服务实例（直接注册）
   * @param key 服务标识
   * @param instance 服务实例
   */
  registerInstance(t, n) {
    this.singletons.set(t, n), S.debug("DI", `注册服务实例: ${t}`);
  }
  /**
   * 解析服务
   * @param key 服务标识
   * @returns 服务实例
   */
  resolve(t) {
    if (this.singletons.has(t))
      return this.singletons.get(t);
    const n = this.factories.get(t);
    if (!n)
      throw new Error(`服务未注册: ${t}`);
    const r = n();
    return this.services.has(t) || this.singletons.set(t, r), r;
  }
  /**
   * 检查服务是否已注册
   * @param key 服务标识
   * @returns 是否已注册
   */
  has(t) {
    return this.factories.has(t) || this.singletons.has(t);
  }
  /**
   * 清空容器
   */
  clear() {
    this.services.clear(), this.factories.clear(), this.singletons.clear(), S.debug("DI", "容器已清空");
  }
  /**
   * 获取所有已注册的服务标识
   */
  getRegisteredKeys() {
    const t = /* @__PURE__ */ new Set();
    return this.factories.forEach((n, r) => t.add(r)), this.singletons.forEach((n, r) => t.add(r)), Array.from(t);
  }
}
const Mn = new BS(), Bn = {
  // 仓储
  STOCK_REPOSITORY: "StockRepository",
  FAVORITE_REPOSITORY: "FavoriteRepository",
  ANNOUNCEMENT_REPOSITORY: "AnnouncementRepository",
  HOLDER_REPOSITORY: "HolderRepository",
  CLASSIFICATION_REPOSITORY: "ClassificationRepository"
};
function HS() {
  S.info("DI", "开始注册服务...");
  const e = Hi();
  Mn.register(
    Bn.STOCK_REPOSITORY,
    () => new Cn(e),
    !0
  ), Mn.register(
    Bn.FAVORITE_REPOSITORY,
    () => new qi(e),
    !0
  ), Mn.register(
    Bn.ANNOUNCEMENT_REPOSITORY,
    () => new Yi(e),
    !0
  ), Mn.register(
    Bn.HOLDER_REPOSITORY,
    () => new Gi(e),
    !0
  ), Mn.register(
    Bn.CLASSIFICATION_REPOSITORY,
    () => new ks(e),
    !0
  ), S.info("DI", "服务注册完成");
}
const ts = se;
async function Uf() {
  S.info("App", "=".repeat(60)), S.info("App", "酷咖啡股票助手 - 启动中..."), S.info("App", "=".repeat(60)), HS();
  const e = Ah();
  e.on("close", (t) => {
    ts.isQuitting || (t.preventDefault(), e.hide());
  }), bh(e, ts), Oh(e), MS(e), UT(e);
  try {
    await _S();
  } catch (t) {
    S.error("App", "Stock sync failed:", t);
  }
  S.info("App", "=".repeat(60)), S.info("App", "酷咖啡股票助手 - 启动完成"), S.info("App", "=".repeat(60));
}
const jS = se.requestSingleInstanceLock();
jS ? (se.on("second-instance", () => {
  S.info("App", "检测到第二个实例尝试启动，聚焦到主窗口");
  const e = mc();
  e && (e.isMinimized() && e.restore(), e.focus(), e.show());
}), se.whenReady().then(() => {
  Uf().catch((e) => {
    S.error("App", "Failed to initialize app:", e), se.quit();
  });
})) : (S.info("App", "应用已经在运行，退出当前实例"), se.quit());
se.on("window-all-closed", () => {
  process.platform !== "darwin" && se.quit();
});
se.on("activate", () => {
  const e = mc();
  e ? e.show() : Uf().catch((t) => {
    S.error("App", "Failed to re-initialize app:", t);
  });
});
se.on("before-quit", () => {
  ts.isQuitting = !0, S.info("App", "Application is quitting...");
});
se.on("will-quit", () => {
  rc.unregisterAll(), US(), S.info("App", "Application cleanup completed");
});
process.on("uncaughtException", (e) => {
  S.error("App", "Uncaught Exception:", e);
});
process.on("unhandledRejection", (e, t) => {
  S.error("App", "Unhandled Rejection at:", t, "reason:", e);
});
