function wr(e, t) {
  const n = /* @__PURE__ */ Object.create(null), r = e.split(",");
  for (let s = 0; s < r.length; s++)
    n[r[s]] = !0;
  return t ? (s) => !!n[s.toLowerCase()] : (s) => !!n[s];
}
const ue = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {}, _r = process.env.NODE_ENV !== "production" ? Object.freeze([]) : [], ke = () => {
}, vr = /^on[^a-z]/, yr = (e) => vr.test(e), ee = Object.assign, br = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Sr = Object.prototype.hasOwnProperty, W = (e, t) => Sr.call(e, t), C = Array.isArray, Ne = (e) => vt(e) === "[object Map]", Nn = (e) => vt(e) === "[object Set]", Z = (e) => typeof e == "function", Q = (e) => typeof e == "string", Wt = (e) => typeof e == "symbol", B = (e) => e !== null && typeof e == "object", Er = (e) => B(e) && Z(e.then) && Z(e.catch), $n = Object.prototype.toString, vt = (e) => $n.call(e), Dn = (e) => vt(e).slice(8, -1), Cn = (e) => vt(e) === "[object Object]", Zt = (e) => Q(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Rn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, In = Rn(
  (e) => e.charAt(0).toUpperCase() + e.slice(1)
), Tr = Rn(
  (e) => e ? `on${In(e)}` : ""
), Je = (e, t) => !Object.is(e, t), Mr = (e, t, n) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
};
let an;
const Dt = () => an || (an = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function yt(e) {
  if (C(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const r = e[n], s = Q(r) ? $r(r) : yt(r);
      if (s)
        for (const i in s)
          t[i] = s[i];
    }
    return t;
  } else {
    if (Q(e))
      return e;
    if (B(e))
      return e;
  }
}
const xr = /;(?![^(]*\))/g, Or = /:([^]+)/, Nr = /\/\*[^]*?\*\//g;
function $r(e) {
  const t = {};
  return e.replace(Nr, "").split(xr).forEach((n) => {
    if (n) {
      const r = n.split(Or);
      r.length > 1 && (t[r[0].trim()] = r[1].trim());
    }
  }), t;
}
function bt(e) {
  let t = "";
  if (Q(e))
    t = e;
  else if (C(e))
    for (let n = 0; n < e.length; n++) {
      const r = bt(e[n]);
      r && (t += r + " ");
    }
  else if (B(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Dr = (e) => Q(e) ? e : e == null ? "" : C(e) || B(e) && (e.toString === $n || !Z(e.toString)) ? JSON.stringify(e, Vn, 2) : String(e), Vn = (e, t) => t && t.__v_isRef ? Vn(e, t.value) : Ne(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce((n, [r, s]) => (n[`${r} =>`] = s, n), {})
} : Nn(t) ? {
  [`Set(${t.size})`]: [...t.values()]
} : B(t) && !C(t) && !Cn(t) ? String(t) : t;
function un(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let Pn;
function Cr(e, t = Pn) {
  t && t.active && t.effects.push(e);
}
function Rr() {
  return Pn;
}
const qe = (e) => {
  const t = new Set(e);
  return t.w = 0, t.n = 0, t;
}, Ln = (e) => (e.w & _e) > 0, Hn = (e) => (e.n & _e) > 0, Ir = ({ deps: e }) => {
  if (e.length)
    for (let t = 0; t < e.length; t++)
      e[t].w |= _e;
}, Vr = (e) => {
  const { deps: t } = e;
  if (t.length) {
    let n = 0;
    for (let r = 0; r < t.length; r++) {
      const s = t[r];
      Ln(s) && !Hn(s) ? s.delete(e) : t[n++] = s, s.w &= ~_e, s.n &= ~_e;
    }
    t.length = n;
  }
}, Ct = /* @__PURE__ */ new WeakMap();
let ze = 0, _e = 1;
const Rt = 30;
let X;
const $e = Symbol(process.env.NODE_ENV !== "production" ? "iterate" : ""), It = Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
class An {
  constructor(t, n = null, r) {
    this.fn = t, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, Cr(this, r);
  }
  run() {
    if (!this.active)
      return this.fn();
    let t = X, n = we;
    for (; t; ) {
      if (t === this)
        return;
      t = t.parent;
    }
    try {
      return this.parent = X, X = this, we = !0, _e = 1 << ++ze, ze <= Rt ? Ir(this) : ln(this), this.fn();
    } finally {
      ze <= Rt && Vr(this), _e = 1 << --ze, X = this.parent, we = n, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    X === this ? this.deferStop = !0 : this.active && (ln(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function ln(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
let we = !0;
const jn = [];
function zt() {
  jn.push(we), we = !1;
}
function Bt() {
  const e = jn.pop();
  we = e === void 0 ? !0 : e;
}
function q(e, t, n) {
  if (we && X) {
    let r = Ct.get(e);
    r || Ct.set(e, r = /* @__PURE__ */ new Map());
    let s = r.get(n);
    s || r.set(n, s = qe());
    const i = process.env.NODE_ENV !== "production" ? { effect: X, target: e, type: t, key: n } : void 0;
    Vt(s, i);
  }
}
function Vt(e, t) {
  let n = !1;
  ze <= Rt ? Hn(e) || (e.n |= _e, n = !Ln(e)) : n = !e.has(X), n && (e.add(X), X.deps.push(e), process.env.NODE_ENV !== "production" && X.onTrack && X.onTrack(
    ee(
      {
        effect: X
      },
      t
    )
  ));
}
function ve(e, t, n, r, s, i) {
  const c = Ct.get(e);
  if (!c)
    return;
  let o = [];
  if (t === "clear")
    o = [...c.values()];
  else if (n === "length" && C(e)) {
    const p = Number(r);
    c.forEach((S, u) => {
      (u === "length" || u >= p) && o.push(S);
    });
  } else
    switch (n !== void 0 && o.push(c.get(n)), t) {
      case "add":
        C(e) ? Zt(n) && o.push(c.get("length")) : (o.push(c.get($e)), Ne(e) && o.push(c.get(It)));
        break;
      case "delete":
        C(e) || (o.push(c.get($e)), Ne(e) && o.push(c.get(It)));
        break;
      case "set":
        Ne(e) && o.push(c.get($e));
        break;
    }
  const l = process.env.NODE_ENV !== "production" ? { target: e, type: t, key: n, newValue: r, oldValue: s, oldTarget: i } : void 0;
  if (o.length === 1)
    o[0] && (process.env.NODE_ENV !== "production" ? Ae(o[0], l) : Ae(o[0]));
  else {
    const p = [];
    for (const S of o)
      S && p.push(...S);
    process.env.NODE_ENV !== "production" ? Ae(qe(p), l) : Ae(qe(p));
  }
}
function Ae(e, t) {
  const n = C(e) ? e : [...e];
  for (const r of n)
    r.computed && fn(r, t);
  for (const r of n)
    r.computed || fn(r, t);
}
function fn(e, t) {
  (e !== X || e.allowRecurse) && (process.env.NODE_ENV !== "production" && e.onTrigger && e.onTrigger(ee({ effect: e }, t)), e.scheduler ? e.scheduler() : e.run());
}
const Pr = /* @__PURE__ */ wr("__proto__,__v_isRef,__isVue"), Fn = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Wt)
), Lr = /* @__PURE__ */ kt(), Hr = /* @__PURE__ */ kt(!0), Ar = /* @__PURE__ */ kt(!0, !0), dn = /* @__PURE__ */ jr();
function jr() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const r = x(this);
      for (let i = 0, c = this.length; i < c; i++)
        q(r, "get", i + "");
      const s = r[t](...n);
      return s === -1 || s === !1 ? r[t](...n.map(x)) : s;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      zt();
      const r = x(this)[t].apply(this, n);
      return Bt(), r;
    };
  }), e;
}
function Fr(e) {
  const t = x(this);
  return q(t, "has", e), t.hasOwnProperty(e);
}
function kt(e = !1, t = !1) {
  return function(r, s, i) {
    if (s === "__v_isReactive")
      return !e;
    if (s === "__v_isReadonly")
      return e;
    if (s === "__v_isShallow")
      return t;
    if (s === "__v_raw" && i === (e ? t ? Bn : zn : t ? ns : Zn).get(r))
      return r;
    const c = C(r);
    if (!e) {
      if (c && W(dn, s))
        return Reflect.get(dn, s, i);
      if (s === "hasOwnProperty")
        return Fr;
    }
    const o = Reflect.get(r, s, i);
    return (Wt(s) ? Fn.has(s) : Pr(s)) || (e || q(r, "get", s), t) ? o : J(o) ? c && Zt(s) ? o : o.value : B(o) ? e ? kn(o) : Et(o) : o;
  };
}
const Yr = /* @__PURE__ */ Wr();
function Wr(e = !1) {
  return function(n, r, s, i) {
    let c = n[r];
    if (ye(c) && J(c) && !J(s))
      return !1;
    if (!e && (!pt(s) && !ye(s) && (c = x(c), s = x(s)), !C(n) && J(c) && !J(s)))
      return c.value = s, !0;
    const o = C(n) && Zt(r) ? Number(r) < n.length : W(n, r), l = Reflect.set(n, r, s, i);
    return n === x(i) && (o ? Je(s, c) && ve(n, "set", r, s, c) : ve(n, "add", r, s)), l;
  };
}
function Zr(e, t) {
  const n = W(e, t), r = e[t], s = Reflect.deleteProperty(e, t);
  return s && n && ve(e, "delete", t, void 0, r), s;
}
function zr(e, t) {
  const n = Reflect.has(e, t);
  return (!Wt(t) || !Fn.has(t)) && q(e, "has", t), n;
}
function Br(e) {
  return q(e, "iterate", C(e) ? "length" : $e), Reflect.ownKeys(e);
}
const kr = {
  get: Lr,
  set: Yr,
  deleteProperty: Zr,
  has: zr,
  ownKeys: Br
}, Yn = {
  get: Hr,
  set(e, t) {
    return process.env.NODE_ENV !== "production" && un(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  },
  deleteProperty(e, t) {
    return process.env.NODE_ENV !== "production" && un(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, Ur = /* @__PURE__ */ ee(
  {},
  Yn,
  {
    get: Ar
  }
), Ut = (e) => e, St = (e) => Reflect.getPrototypeOf(e);
function st(e, t, n = !1, r = !1) {
  e = e.__v_raw;
  const s = x(e), i = x(t);
  n || (t !== i && q(s, "get", t), q(s, "get", i));
  const { has: c } = St(s), o = r ? Ut : n ? Xt : Qe;
  if (c.call(s, t))
    return o(e.get(t));
  if (c.call(s, i))
    return o(e.get(i));
  e !== s && e.get(t);
}
function ot(e, t = !1) {
  const n = this.__v_raw, r = x(n), s = x(e);
  return t || (e !== s && q(r, "has", e), q(r, "has", s)), e === s ? n.has(e) : n.has(e) || n.has(s);
}
function it(e, t = !1) {
  return e = e.__v_raw, !t && q(x(e), "iterate", $e), Reflect.get(e, "size", e);
}
function hn(e) {
  e = x(e);
  const t = x(this);
  return St(t).has.call(t, e) || (t.add(e), ve(t, "add", e, e)), this;
}
function pn(e, t) {
  t = x(t);
  const n = x(this), { has: r, get: s } = St(n);
  let i = r.call(n, e);
  i ? process.env.NODE_ENV !== "production" && Wn(n, r, e) : (e = x(e), i = r.call(n, e));
  const c = s.call(n, e);
  return n.set(e, t), i ? Je(t, c) && ve(n, "set", e, t, c) : ve(n, "add", e, t), this;
}
function mn(e) {
  const t = x(this), { has: n, get: r } = St(t);
  let s = n.call(t, e);
  s ? process.env.NODE_ENV !== "production" && Wn(t, n, e) : (e = x(e), s = n.call(t, e));
  const i = r ? r.call(t, e) : void 0, c = t.delete(e);
  return s && ve(t, "delete", e, void 0, i), c;
}
function gn() {
  const e = x(this), t = e.size !== 0, n = process.env.NODE_ENV !== "production" ? Ne(e) ? new Map(e) : new Set(e) : void 0, r = e.clear();
  return t && ve(e, "clear", void 0, void 0, n), r;
}
function ct(e, t) {
  return function(r, s) {
    const i = this, c = i.__v_raw, o = x(c), l = t ? Ut : e ? Xt : Qe;
    return !e && q(o, "iterate", $e), c.forEach((p, S) => r.call(s, l(p), l(S), i));
  };
}
function at(e, t, n) {
  return function(...r) {
    const s = this.__v_raw, i = x(s), c = Ne(i), o = e === "entries" || e === Symbol.iterator && c, l = e === "keys" && c, p = s[e](...r), S = n ? Ut : t ? Xt : Qe;
    return !t && q(
      i,
      "iterate",
      l ? It : $e
    ), {
      // iterator protocol
      next() {
        const { value: u, done: v } = p.next();
        return v ? { value: u, done: v } : {
          value: o ? [S(u[0]), S(u[1])] : S(u),
          done: v
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function pe(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(
        `${In(e)} operation ${n}failed: target is readonly.`,
        x(this)
      );
    }
    return e === "delete" ? !1 : this;
  };
}
function Kr() {
  const e = {
    get(i) {
      return st(this, i);
    },
    get size() {
      return it(this);
    },
    has: ot,
    add: hn,
    set: pn,
    delete: mn,
    clear: gn,
    forEach: ct(!1, !1)
  }, t = {
    get(i) {
      return st(this, i, !1, !0);
    },
    get size() {
      return it(this);
    },
    has: ot,
    add: hn,
    set: pn,
    delete: mn,
    clear: gn,
    forEach: ct(!1, !0)
  }, n = {
    get(i) {
      return st(this, i, !0);
    },
    get size() {
      return it(this, !0);
    },
    has(i) {
      return ot.call(this, i, !0);
    },
    add: pe("add"),
    set: pe("set"),
    delete: pe("delete"),
    clear: pe("clear"),
    forEach: ct(!0, !1)
  }, r = {
    get(i) {
      return st(this, i, !0, !0);
    },
    get size() {
      return it(this, !0);
    },
    has(i) {
      return ot.call(this, i, !0);
    },
    add: pe("add"),
    set: pe("set"),
    delete: pe("delete"),
    clear: pe("clear"),
    forEach: ct(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
    e[i] = at(
      i,
      !1,
      !1
    ), n[i] = at(
      i,
      !0,
      !1
    ), t[i] = at(
      i,
      !1,
      !0
    ), r[i] = at(
      i,
      !0,
      !0
    );
  }), [
    e,
    n,
    t,
    r
  ];
}
const [
  Gr,
  Xr,
  Jr,
  qr
] = /* @__PURE__ */ Kr();
function Kt(e, t) {
  const n = t ? e ? qr : Jr : e ? Xr : Gr;
  return (r, s, i) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? r : Reflect.get(
    W(n, s) && s in r ? n : r,
    s,
    i
  );
}
const Qr = {
  get: /* @__PURE__ */ Kt(!1, !1)
}, es = {
  get: /* @__PURE__ */ Kt(!0, !1)
}, ts = {
  get: /* @__PURE__ */ Kt(!0, !0)
};
function Wn(e, t, n) {
  const r = x(n);
  if (r !== n && t.call(e, r)) {
    const s = Dn(e);
    console.warn(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Zn = /* @__PURE__ */ new WeakMap(), ns = /* @__PURE__ */ new WeakMap(), zn = /* @__PURE__ */ new WeakMap(), Bn = /* @__PURE__ */ new WeakMap();
function rs(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function ss(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : rs(Dn(e));
}
function Et(e) {
  return ye(e) ? e : Gt(
    e,
    !1,
    kr,
    Qr,
    Zn
  );
}
function kn(e) {
  return Gt(
    e,
    !0,
    Yn,
    es,
    zn
  );
}
function ut(e) {
  return Gt(
    e,
    !0,
    Ur,
    ts,
    Bn
  );
}
function Gt(e, t, n, r, s) {
  if (!B(e))
    return process.env.NODE_ENV !== "production" && console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = s.get(e);
  if (i)
    return i;
  const c = ss(e);
  if (c === 0)
    return e;
  const o = new Proxy(
    e,
    c === 2 ? r : n
  );
  return s.set(e, o), o;
}
function De(e) {
  return ye(e) ? De(e.__v_raw) : !!(e && e.__v_isReactive);
}
function ye(e) {
  return !!(e && e.__v_isReadonly);
}
function pt(e) {
  return !!(e && e.__v_isShallow);
}
function Pt(e) {
  return De(e) || ye(e);
}
function x(e) {
  const t = e && e.__v_raw;
  return t ? x(t) : e;
}
function os(e) {
  return Mr(e, "__v_skip", !0), e;
}
const Qe = (e) => B(e) ? Et(e) : e, Xt = (e) => B(e) ? kn(e) : e;
function Un(e) {
  we && X && (e = x(e), process.env.NODE_ENV !== "production" ? Vt(e.dep || (e.dep = qe()), {
    target: e,
    type: "get",
    key: "value"
  }) : Vt(e.dep || (e.dep = qe())));
}
function Kn(e, t) {
  e = x(e);
  const n = e.dep;
  n && (process.env.NODE_ENV !== "production" ? Ae(n, {
    target: e,
    type: "set",
    key: "value",
    newValue: t
  }) : Ae(n));
}
function J(e) {
  return !!(e && e.__v_isRef === !0);
}
function Ue(e) {
  return is(e, !1);
}
function is(e, t) {
  return J(e) ? e : new cs(e, t);
}
class cs {
  constructor(t, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? t : x(t), this._value = n ? t : Qe(t);
  }
  get value() {
    return Un(this), this._value;
  }
  set value(t) {
    const n = this.__v_isShallow || pt(t) || ye(t);
    t = n ? t : x(t), Je(t, this._rawValue) && (this._rawValue = t, this._value = n ? t : Qe(t), Kn(this, t));
  }
}
function as(e) {
  return J(e) ? e.value : e;
}
const us = {
  get: (e, t, n) => as(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const s = e[t];
    return J(s) && !J(n) ? (s.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function ls(e) {
  return De(e) ? e : new Proxy(e, us);
}
class fs {
  constructor(t, n, r, s) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this._dirty = !0, this.effect = new An(t, () => {
      this._dirty || (this._dirty = !0, Kn(this));
    }), this.effect.computed = this, this.effect.active = this._cacheable = !s, this.__v_isReadonly = r;
  }
  get value() {
    const t = x(this);
    return Un(t), (t._dirty || !t._cacheable) && (t._dirty = !1, t._value = t.effect.run()), t._value;
  }
  set value(t) {
    this._setter(t);
  }
}
function ds(e, t, n = !1) {
  let r, s;
  const i = Z(e);
  i ? (r = e, s = process.env.NODE_ENV !== "production" ? () => {
    console.warn("Write operation failed: computed value is readonly");
  } : ke) : (r = e.get, s = e.set);
  const c = new fs(r, s, i || !s, n);
  return process.env.NODE_ENV !== "production" && t && !n && (c.effect.onTrack = t.onTrack, c.effect.onTrigger = t.onTrigger), c;
}
const Ce = [];
function hs(e) {
  Ce.push(e);
}
function ps() {
  Ce.pop();
}
function F(e, ...t) {
  if (process.env.NODE_ENV === "production")
    return;
  zt();
  const n = Ce.length ? Ce[Ce.length - 1].component : null, r = n && n.appContext.config.warnHandler, s = ms();
  if (r)
    Re(
      r,
      n,
      11,
      [
        e + t.join(""),
        n && n.proxy,
        s.map(
          ({ vnode: i }) => `at <${fr(n, i.type)}>`
        ).join(`
`),
        s
      ]
    );
  else {
    const i = [`[Vue warn]: ${e}`, ...t];
    s.length && i.push(`
`, ...gs(s)), console.warn(...i);
  }
  Bt();
}
function ms() {
  let e = Ce[Ce.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const r = e.component && e.component.parent;
    e = r && r.vnode;
  }
  return t;
}
function gs(e) {
  const t = [];
  return e.forEach((n, r) => {
    t.push(...r === 0 ? [] : [`
`], ...ws(n));
  }), t;
}
function ws({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", r = e.component ? e.component.parent == null : !1, s = ` at <${fr(
    e.component,
    e.type,
    r
  )}`, i = ">" + n;
  return e.props ? [s, ..._s(e.props), i] : [s + i];
}
function _s(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((r) => {
    t.push(...Gn(r, e[r]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Gn(e, t, n) {
  return Q(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : J(t) ? (t = Gn(e, x(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : Z(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = x(t), n ? t : [`${e}=`, t]);
}
const Jt = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
};
function Re(e, t, n, r) {
  let s;
  try {
    s = r ? e(...r) : e();
  } catch (i) {
    Xn(i, t, n);
  }
  return s;
}
function Ke(e, t, n, r) {
  if (Z(e)) {
    const i = Re(e, t, n, r);
    return i && Er(i) && i.catch((c) => {
      Xn(c, t, n);
    }), i;
  }
  const s = [];
  for (let i = 0; i < e.length; i++)
    s.push(Ke(e[i], t, n, r));
  return s;
}
function Xn(e, t, n, r = !0) {
  const s = t ? t.vnode : null;
  if (t) {
    let i = t.parent;
    const c = t.proxy, o = process.env.NODE_ENV !== "production" ? Jt[n] : n;
    for (; i; ) {
      const p = i.ec;
      if (p) {
        for (let S = 0; S < p.length; S++)
          if (p[S](e, c, o) === !1)
            return;
      }
      i = i.parent;
    }
    const l = t.appContext.config.errorHandler;
    if (l) {
      Re(
        l,
        null,
        10,
        [e, c, o]
      );
      return;
    }
  }
  vs(e, n, s, r);
}
function vs(e, t, n, r = !0) {
  if (process.env.NODE_ENV !== "production") {
    const s = Jt[t];
    if (n && hs(n), F(`Unhandled error${s ? ` during execution of ${s}` : ""}`), n && ps(), r)
      throw e;
    console.error(e);
  } else
    console.error(e);
}
let mt = !1, Lt = !1;
const re = [];
let ge = 0;
const Ye = [];
let ae = null, me = 0;
const Jn = /* @__PURE__ */ Promise.resolve();
let qt = null;
const ys = 100;
function Qt(e) {
  const t = qt || Jn;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function bs(e) {
  let t = ge + 1, n = re.length;
  for (; t < n; ) {
    const r = t + n >>> 1;
    et(re[r]) < e ? t = r + 1 : n = r;
  }
  return t;
}
function en(e) {
  (!re.length || !re.includes(
    e,
    mt && e.allowRecurse ? ge + 1 : ge
  )) && (e.id == null ? re.push(e) : re.splice(bs(e.id), 0, e), qn());
}
function qn() {
  !mt && !Lt && (Lt = !0, qt = Jn.then(er));
}
function Qn(e) {
  C(e) ? Ye.push(...e) : (!ae || !ae.includes(
    e,
    e.allowRecurse ? me + 1 : me
  )) && Ye.push(e), qn();
}
function Ss(e) {
  if (Ye.length) {
    const t = [...new Set(Ye)];
    if (Ye.length = 0, ae) {
      ae.push(...t);
      return;
    }
    for (ae = t, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), ae.sort((n, r) => et(n) - et(r)), me = 0; me < ae.length; me++)
      process.env.NODE_ENV !== "production" && tr(e, ae[me]) || ae[me]();
    ae = null, me = 0;
  }
}
const et = (e) => e.id == null ? 1 / 0 : e.id, Es = (e, t) => {
  const n = et(e) - et(t);
  if (n === 0) {
    if (e.pre && !t.pre)
      return -1;
    if (t.pre && !e.pre)
      return 1;
  }
  return n;
};
function er(e) {
  Lt = !1, mt = !0, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), re.sort(Es);
  const t = process.env.NODE_ENV !== "production" ? (n) => tr(e, n) : ke;
  try {
    for (ge = 0; ge < re.length; ge++) {
      const n = re[ge];
      if (n && n.active !== !1) {
        if (process.env.NODE_ENV !== "production" && t(n))
          continue;
        Re(n, null, 14);
      }
    }
  } finally {
    ge = 0, re.length = 0, Ss(e), mt = !1, qt = null, (re.length || Ye.length) && er(e);
  }
}
function tr(e, t) {
  if (!e.has(t))
    e.set(t, 1);
  else {
    const n = e.get(t);
    if (n > ys) {
      const r = t.ownerInstance, s = r && lr(r.type);
      return F(
        `Maximum recursive updates exceeded${s ? ` in component <${s}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`
      ), !0;
    } else
      e.set(t, n + 1);
  }
}
const Ze = /* @__PURE__ */ new Set();
process.env.NODE_ENV !== "production" && (Dt().__VUE_HMR_RUNTIME__ = {
  createRecord: Ot(Ts),
  rerender: Ot(Ms),
  reload: Ot(xs)
});
const gt = /* @__PURE__ */ new Map();
function Ts(e, t) {
  return gt.has(e) ? !1 : (gt.set(e, {
    initialDef: Ge(t),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function Ge(e) {
  return dr(e) ? e.__vccOpts : e;
}
function Ms(e, t) {
  const n = gt.get(e);
  n && (n.initialDef.render = t, [...n.instances].forEach((r) => {
    t && (r.render = t, Ge(r.type).render = t), r.renderCache = [], r.update();
  }));
}
function xs(e, t) {
  const n = gt.get(e);
  if (!n)
    return;
  t = Ge(t), wn(n.initialDef, t);
  const r = [...n.instances];
  for (const s of r) {
    const i = Ge(s.type);
    Ze.has(i) || (i !== n.initialDef && wn(i, t), Ze.add(i)), s.appContext.propsCache.delete(s.type), s.appContext.emitsCache.delete(s.type), s.appContext.optionsCache.delete(s.type), s.ceReload ? (Ze.add(i), s.ceReload(t.styles), Ze.delete(i)) : s.parent ? en(s.parent.update) : s.appContext.reload ? s.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn(
      "[HMR] Root or manually mounted instance modified. Full reload required."
    );
  }
  Qn(() => {
    for (const s of r)
      Ze.delete(
        Ge(s.type)
      );
  });
}
function wn(e, t) {
  ee(e, t);
  for (const n in e)
    n !== "__file" && !(n in t) && delete e[n];
}
function Ot(e) {
  return (t, n) => {
    try {
      return e(t, n);
    } catch (r) {
      console.error(r), console.warn(
        "[HMR] Something went wrong during Vue component hot-reload. Full reload required."
      );
    }
  };
}
let le = null, Os = null;
const Ns = (e) => e.__isSuspense;
function $s(e, t) {
  t && t.pendingBranch ? C(e) ? t.effects.push(...e) : t.effects.push(e) : Qn(e);
}
function Ds(e, t) {
  return tn(
    e,
    null,
    process.env.NODE_ENV !== "production" ? ee({}, t, { flush: "post" }) : { flush: "post" }
  );
}
const lt = {};
function Cs(e, t, n) {
  return process.env.NODE_ENV !== "production" && !Z(t) && F(
    "`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."
  ), tn(e, t, n);
}
function tn(e, t, { immediate: n, deep: r, flush: s, onTrack: i, onTrigger: c } = ue) {
  var o;
  process.env.NODE_ENV !== "production" && !t && (n !== void 0 && F(
    'watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'
  ), r !== void 0 && F(
    'watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'
  ));
  const l = (N) => {
    F(
      "Invalid watch source: ",
      N,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, p = Rr() === ((o = fe) == null ? void 0 : o.scope) ? fe : null;
  let S, u = !1, v = !1;
  if (J(e) ? (S = () => e.value, u = pt(e)) : De(e) ? (S = () => e, r = !0) : C(e) ? (v = !0, u = e.some((N) => De(N) || pt(N)), S = () => e.map((N) => {
    if (J(N))
      return N.value;
    if (De(N))
      return je(N);
    if (Z(N))
      return Re(N, p, 2);
    process.env.NODE_ENV !== "production" && l(N);
  })) : Z(e) ? t ? S = () => Re(e, p, 2) : S = () => {
    if (!(p && p.isUnmounted))
      return O && O(), Ke(
        e,
        p,
        3,
        [E]
      );
  } : (S = ke, process.env.NODE_ENV !== "production" && l(e)), t && r) {
    const N = S;
    S = () => je(N());
  }
  let O, E = (N) => {
    O = R.onStop = () => {
      Re(N, p, 4);
    };
  }, H;
  if (ur)
    if (E = ke, t ? n && Ke(t, p, 3, [
      S(),
      v ? [] : void 0,
      E
    ]) : S(), s === "sync") {
      const N = ao();
      H = N.__watcherHandles || (N.__watcherHandles = []);
    } else
      return ke;
  let A = v ? new Array(e.length).fill(lt) : lt;
  const T = () => {
    if (R.active)
      if (t) {
        const N = R.run();
        (r || u || (v ? N.some(
          (te, Ie) => Je(te, A[Ie])
        ) : Je(N, A))) && (O && O(), Ke(t, p, 3, [
          N,
          // pass undefined as the old value when it's changed for the first time
          A === lt ? void 0 : v && A[0] === lt ? [] : A,
          E
        ]), A = N);
      } else
        R.run();
  };
  T.allowRecurse = !!t;
  let k;
  s === "sync" ? k = T : s === "post" ? k = () => En(T, p && p.suspense) : (T.pre = !0, p && (T.id = p.uid), k = () => en(T));
  const R = new An(S, k);
  process.env.NODE_ENV !== "production" && (R.onTrack = i, R.onTrigger = c), t ? n ? T() : A = R.run() : s === "post" ? En(
    R.run.bind(R),
    p && p.suspense
  ) : R.run();
  const ne = () => {
    R.stop(), p && p.scope && br(p.scope.effects, R);
  };
  return H && H.push(ne), ne;
}
function Rs(e, t, n) {
  const r = this.proxy, s = Q(e) ? e.includes(".") ? Is(r, e) : () => r[e] : e.bind(r, r);
  let i;
  Z(t) ? i = t : (i = t.handler, n = t);
  const c = fe;
  jt(this);
  const o = tn(s, i.bind(r), n);
  return c ? jt(c) : ar(), o;
}
function Is(e, t) {
  const n = t.split(".");
  return () => {
    let r = e;
    for (let s = 0; s < n.length && r; s++)
      r = r[n[s]];
    return r;
  };
}
function je(e, t) {
  if (!B(e) || e.__v_skip || (t = t || /* @__PURE__ */ new Set(), t.has(e)))
    return e;
  if (t.add(e), J(e))
    je(e.value, t);
  else if (C(e))
    for (let n = 0; n < e.length; n++)
      je(e[n], t);
  else if (Nn(e) || Ne(e))
    e.forEach((n) => {
      je(n, t);
    });
  else if (Cn(e))
    for (const n in e)
      je(e[n], t);
  return e;
}
function Vs(e, t, n = fe, r = !1) {
  if (n) {
    const s = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...c) => {
      if (n.isUnmounted)
        return;
      zt(), jt(n);
      const o = Ke(t, n, e, c);
      return ar(), Bt(), o;
    });
    return r ? s.unshift(i) : s.push(i), i;
  } else if (process.env.NODE_ENV !== "production") {
    const s = Tr(Jt[e].replace(/ hook$/, ""));
    F(
      `${s} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
    );
  }
}
const nn = (e) => (t, n = fe) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  Vs(e, (...r) => t(...r), n)
), rn = nn("m"), Ps = nn("bum"), Ls = nn("um"), Hs = Symbol.for("v-ndc");
function As(e, t, n, r) {
  let s;
  const i = n && n[r];
  if (C(e) || Q(e)) {
    s = new Array(e.length);
    for (let c = 0, o = e.length; c < o; c++)
      s[c] = t(e[c], c, void 0, i && i[c]);
  } else if (typeof e == "number") {
    process.env.NODE_ENV !== "production" && !Number.isInteger(e) && F(`The v-for range expect an integer value but got ${e}.`), s = new Array(e);
    for (let c = 0; c < e; c++)
      s[c] = t(c + 1, c, void 0, i && i[c]);
  } else if (B(e))
    if (e[Symbol.iterator])
      s = Array.from(
        e,
        (c, o) => t(c, o, void 0, i && i[o])
      );
    else {
      const c = Object.keys(e);
      s = new Array(c.length);
      for (let o = 0, l = c.length; o < l; o++) {
        const p = c[o];
        s[o] = t(e[p], p, o, i && i[o]);
      }
    }
  else
    s = [];
  return n && (n[r] = s), s;
}
const Ht = (e) => e ? ro(e) ? so(e) || e.proxy : Ht(e.parent) : null, Xe = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ee(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => process.env.NODE_ENV !== "production" ? ut(e.props) : e.props,
    $attrs: (e) => process.env.NODE_ENV !== "production" ? ut(e.attrs) : e.attrs,
    $slots: (e) => process.env.NODE_ENV !== "production" ? ut(e.slots) : e.slots,
    $refs: (e) => process.env.NODE_ENV !== "production" ? ut(e.refs) : e.refs,
    $parent: (e) => Ht(e.parent),
    $root: (e) => Ht(e.root),
    $emit: (e) => e.emit,
    $options: (e) => Ys(e),
    $forceUpdate: (e) => e.f || (e.f = () => en(e.update)),
    $nextTick: (e) => e.n || (e.n = Qt.bind(e.proxy)),
    $watch: (e) => Rs.bind(e)
  })
), js = (e) => e === "_" || e === "$", Nt = (e, t) => e !== ue && !e.__isScriptSetup && W(e, t), Fs = {
  get({ _: e }, t) {
    const { ctx: n, setupState: r, data: s, props: i, accessCache: c, type: o, appContext: l } = e;
    if (process.env.NODE_ENV !== "production" && t === "__isVue")
      return !0;
    let p;
    if (t[0] !== "$") {
      const O = c[t];
      if (O !== void 0)
        switch (O) {
          case 1:
            return r[t];
          case 2:
            return s[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Nt(r, t))
          return c[t] = 1, r[t];
        if (s !== ue && W(s, t))
          return c[t] = 2, s[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (p = e.propsOptions[0]) && W(p, t)
        )
          return c[t] = 3, i[t];
        if (n !== ue && W(n, t))
          return c[t] = 4, n[t];
        c[t] = 0;
      }
    }
    const S = Xe[t];
    let u, v;
    if (S)
      return t === "$attrs" ? (q(e, "get", t), process.env.NODE_ENV !== "production" && void 0) : process.env.NODE_ENV !== "production" && t === "$slots" && q(e, "get", t), S(e);
    if (
      // css module (injected by vue-loader)
      (u = o.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== ue && W(n, t))
      return c[t] = 4, n[t];
    if (
      // global properties
      v = l.config.globalProperties, W(v, t)
    )
      return v[t];
    process.env.NODE_ENV !== "production" && le && (!Q(t) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    t.indexOf("__v") !== 0) && (s !== ue && js(t[0]) && W(s, t) ? F(
      `Property ${JSON.stringify(
        t
      )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
    ) : e === le && F(
      `Property ${JSON.stringify(t)} was accessed during render but is not defined on instance.`
    ));
  },
  set({ _: e }, t, n) {
    const { data: r, setupState: s, ctx: i } = e;
    return Nt(s, t) ? (s[t] = n, !0) : process.env.NODE_ENV !== "production" && s.__isScriptSetup && W(s, t) ? (F(`Cannot mutate <script setup> binding "${t}" from Options API.`), !1) : r !== ue && W(r, t) ? (r[t] = n, !0) : W(e.props, t) ? (process.env.NODE_ENV !== "production" && F(`Attempting to mutate prop "${t}". Props are readonly.`), !1) : t[0] === "$" && t.slice(1) in e ? (process.env.NODE_ENV !== "production" && F(
      `Attempting to mutate public property "${t}". Properties starting with $ are reserved and readonly.`
    ), !1) : (process.env.NODE_ENV !== "production" && t in e.appContext.config.globalProperties ? Object.defineProperty(i, t, {
      enumerable: !0,
      configurable: !0,
      value: n
    }) : i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: s, propsOptions: i }
  }, c) {
    let o;
    return !!n[c] || e !== ue && W(e, c) || Nt(t, c) || (o = i[0]) && W(o, c) || W(r, c) || W(Xe, c) || W(s.config.globalProperties, c);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : W(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
process.env.NODE_ENV !== "production" && (Fs.ownKeys = (e) => (F(
  "Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."
), Reflect.ownKeys(e)));
function _n(e) {
  return C(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
function Ys(e) {
  const t = e.type, { mixins: n, extends: r } = t, {
    mixins: s,
    optionsCache: i,
    config: { optionMergeStrategies: c }
  } = e.appContext, o = i.get(t);
  let l;
  return o ? l = o : !s.length && !n && !r ? l = t : (l = {}, s.length && s.forEach(
    (p) => wt(l, p, c, !0)
  ), wt(l, t, c)), B(t) && i.set(t, l), l;
}
function wt(e, t, n, r = !1) {
  const { mixins: s, extends: i } = t;
  i && wt(e, i, n, !0), s && s.forEach(
    (c) => wt(e, c, n, !0)
  );
  for (const c in t)
    if (r && c === "expose")
      process.env.NODE_ENV !== "production" && F(
        '"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.'
      );
    else {
      const o = Ws[c] || n && n[c];
      e[c] = o ? o(e[c], t[c]) : t[c];
    }
  return e;
}
const Ws = {
  data: vn,
  props: bn,
  emits: bn,
  // objects
  methods: Be,
  computed: Be,
  // lifecycle
  beforeCreate: G,
  created: G,
  beforeMount: G,
  mounted: G,
  beforeUpdate: G,
  updated: G,
  beforeDestroy: G,
  beforeUnmount: G,
  destroyed: G,
  unmounted: G,
  activated: G,
  deactivated: G,
  errorCaptured: G,
  serverPrefetch: G,
  // assets
  components: Be,
  directives: Be,
  // watch
  watch: zs,
  // provide / inject
  provide: vn,
  inject: Zs
};
function vn(e, t) {
  return t ? e ? function() {
    return ee(
      Z(e) ? e.call(this, this) : e,
      Z(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Zs(e, t) {
  return Be(yn(e), yn(t));
}
function yn(e) {
  if (C(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function G(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Be(e, t) {
  return e ? ee(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function bn(e, t) {
  return e ? C(e) && C(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ee(
    /* @__PURE__ */ Object.create(null),
    _n(e),
    _n(t ?? {})
  ) : t;
}
function zs(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  const n = ee(/* @__PURE__ */ Object.create(null), e);
  for (const r in t)
    n[r] = G(e[r], t[r]);
  return n;
}
let Sn = null;
function Bs(e, t, n = !1) {
  const r = fe || le;
  if (r || Sn) {
    const s = r ? r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : Sn._context.provides;
    if (s && e in s)
      return s[e];
    if (arguments.length > 1)
      return n && Z(t) ? t.call(r && r.proxy) : t;
    process.env.NODE_ENV !== "production" && F(`injection "${String(e)}" not found.`);
  } else
    process.env.NODE_ENV !== "production" && F("inject() can only be used inside setup() or functional components.");
}
const En = $s, ks = (e) => e.__isTeleport, Tt = Symbol.for("v-fgt"), Us = Symbol.for("v-txt"), At = Symbol.for("v-cmt"), Ks = Symbol.for("v-stc"), ft = [];
let se = null;
function Fe(e = !1) {
  ft.push(se = e ? null : []);
}
function Gs() {
  ft.pop(), se = ft[ft.length - 1] || null;
}
function nr(e) {
  return e.dynamicChildren = se || _r, Gs(), se && se.push(e), e;
}
function dt(e, t, n, r, s, i) {
  return nr(
    tt(
      e,
      t,
      n,
      r,
      s,
      i,
      !0
      /* isBlock */
    )
  );
}
function rr(e, t, n, r, s) {
  return nr(
    sn(
      e,
      t,
      n,
      r,
      s,
      !0
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function Xs(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
const Js = (...e) => ir(
  ...e
), sr = "__vInternal", or = ({ key: e }) => e ?? null, ht = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? Q(e) || J(e) || Z(e) ? { i: le, r: e, k: t, f: !!n } : e : null);
function tt(e, t = null, n = null, r = 0, s = null, i = e === Tt ? 0 : 1, c = !1, o = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && or(t),
    ref: t && ht(t),
    scopeId: Os,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: r,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: le
  };
  return o ? (on(l, n), i & 128 && e.normalize(l)) : n && (l.shapeFlag |= Q(n) ? 8 : 16), process.env.NODE_ENV !== "production" && l.key !== l.key && F("VNode created with invalid key (NaN). VNode type:", l.type), // avoid a block node from tracking itself
  !c && // has current parent block
  se && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && se.push(l), l;
}
const sn = process.env.NODE_ENV !== "production" ? Js : ir;
function ir(e, t = null, n = null, r = 0, s = null, i = !1) {
  if ((!e || e === Hs) && (process.env.NODE_ENV !== "production" && !e && F(`Invalid vnode type when creating vnode: ${e}.`), e = At), Xs(e)) {
    const o = _t(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && on(o, n), !i && se && (o.shapeFlag & 6 ? se[se.indexOf(e)] = o : se.push(o)), o.patchFlag |= -2, o;
  }
  if (dr(e) && (e = e.__vccOpts), t) {
    t = qs(t);
    let { class: o, style: l } = t;
    o && !Q(o) && (t.class = bt(o)), B(l) && (Pt(l) && !C(l) && (l = ee({}, l)), t.style = yt(l));
  }
  const c = Q(e) ? 1 : Ns(e) ? 128 : ks(e) ? 64 : B(e) ? 4 : Z(e) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && c & 4 && Pt(e) && (e = x(e), F(
    "Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",
    `
Component that was made reactive: `,
    e
  )), tt(
    e,
    t,
    n,
    r,
    s,
    c,
    i,
    !0
  );
}
function qs(e) {
  return e ? Pt(e) || sr in e ? ee({}, e) : e : null;
}
function _t(e, t, n = !1) {
  const { props: r, ref: s, patchFlag: i, children: c } = e, o = t ? to(r || {}, t) : r;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: o,
    key: o && or(o),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? C(s) ? s.concat(ht(t)) : [s, ht(t)] : ht(t)
    ) : s,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && i === -1 && C(c) ? c.map(cr) : c,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Tt ? i === -1 ? 16 : i | 16 : i,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && _t(e.ssContent),
    ssFallback: e.ssFallback && _t(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
}
function cr(e) {
  const t = _t(e);
  return C(e.children) && (t.children = e.children.map(cr)), t;
}
function Qs(e = " ", t = 0) {
  return sn(Us, null, e, t);
}
function eo(e = "", t = !1) {
  return t ? (Fe(), rr(At, null, e)) : sn(At, null, e);
}
function on(e, t) {
  let n = 0;
  const { shapeFlag: r } = e;
  if (t == null)
    t = null;
  else if (C(t))
    n = 16;
  else if (typeof t == "object")
    if (r & 65) {
      const s = t.default;
      s && (s._c && (s._d = !1), on(e, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = t._;
      !s && !(sr in t) ? t._ctx = le : s === 3 && le && (le.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else
    Z(t) ? (t = { default: t, _ctx: le }, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [Qs(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function to(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    for (const s in r)
      if (s === "class")
        t.class !== r.class && (t.class = bt([t.class, r.class]));
      else if (s === "style")
        t.style = yt([t.style, r.style]);
      else if (yr(s)) {
        const i = t[s], c = r[s];
        c && i !== c && !(C(i) && i.includes(c)) && (t[s] = i ? [].concat(i, c) : c);
      } else
        s !== "" && (t[s] = r[s]);
  }
  return t;
}
let fe = null;
const no = () => fe || le;
let cn, Le, Tn = "__VUE_INSTANCE_SETTERS__";
(Le = Dt()[Tn]) || (Le = Dt()[Tn] = []), Le.push((e) => fe = e), cn = (e) => {
  Le.length > 1 ? Le.forEach((t) => t(e)) : Le[0](e);
};
const jt = (e) => {
  cn(e), e.scope.on();
}, ar = () => {
  fe && fe.scope.off(), cn(null);
};
function ro(e) {
  return e.vnode.shapeFlag & 4;
}
let ur = !1;
function so(e) {
  if (e.exposed)
    return e.exposeProxy || (e.exposeProxy = new Proxy(ls(os(e.exposed)), {
      get(t, n) {
        if (n in t)
          return t[n];
        if (n in Xe)
          return Xe[n](e);
      },
      has(t, n) {
        return n in t || n in Xe;
      }
    }));
}
const oo = /(?:^|[-_])(\w)/g, io = (e) => e.replace(oo, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function lr(e, t = !0) {
  return Z(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function fr(e, t, n = !1) {
  let r = lr(t);
  if (!r && t.__file) {
    const s = t.__file.match(/([^/\\]+)\.\w+$/);
    s && (r = s[1]);
  }
  if (!r && e && e.parent) {
    const s = (i) => {
      for (const c in i)
        if (i[c] === t)
          return c;
    };
    r = s(
      e.components || e.parent.type.components
    ) || s(e.appContext.components);
  }
  return r ? io(r) : n ? "App" : "Anonymous";
}
function dr(e) {
  return Z(e) && "__vccOpts" in e;
}
const He = (e, t) => ds(e, t, ur), co = Symbol.for("v-scx"), ao = () => {
  {
    const e = Bs(co);
    return e || process.env.NODE_ENV !== "production" && F(
      "Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build."
    ), e;
  }
};
function $t(e) {
  return !!(e && e.__v_isShallow);
}
function uo() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const e = { style: "color:#3ba776" }, t = { style: "color:#0b1bc9" }, n = { style: "color:#b62e24" }, r = { style: "color:#9d288c" }, s = {
    header(u) {
      return B(u) ? u.__isVue ? ["div", e, "VueInstance"] : J(u) ? [
        "div",
        {},
        ["span", e, S(u)],
        "<",
        o(u.value),
        ">"
      ] : De(u) ? [
        "div",
        {},
        ["span", e, $t(u) ? "ShallowReactive" : "Reactive"],
        "<",
        o(u),
        `>${ye(u) ? " (readonly)" : ""}`
      ] : ye(u) ? [
        "div",
        {},
        ["span", e, $t(u) ? "ShallowReadonly" : "Readonly"],
        "<",
        o(u),
        ">"
      ] : null : null;
    },
    hasBody(u) {
      return u && u.__isVue;
    },
    body(u) {
      if (u && u.__isVue)
        return [
          "div",
          {},
          ...i(u.$)
        ];
    }
  };
  function i(u) {
    const v = [];
    u.type.props && u.props && v.push(c("props", x(u.props))), u.setupState !== ue && v.push(c("setup", u.setupState)), u.data !== ue && v.push(c("data", x(u.data)));
    const O = l(u, "computed");
    O && v.push(c("computed", O));
    const E = l(u, "inject");
    return E && v.push(c("injected", E)), v.push([
      "div",
      {},
      [
        "span",
        {
          style: r.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: u }]
    ]), v;
  }
  function c(u, v) {
    return v = ee({}, v), Object.keys(v).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        u
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(v).map((O) => [
          "div",
          {},
          ["span", r, O + ": "],
          o(v[O], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function o(u, v = !0) {
    return typeof u == "number" ? ["span", t, u] : typeof u == "string" ? ["span", n, JSON.stringify(u)] : typeof u == "boolean" ? ["span", r, u] : B(u) ? ["object", { object: v ? x(u) : u }] : ["span", n, String(u)];
  }
  function l(u, v) {
    const O = u.type;
    if (Z(O))
      return;
    const E = {};
    for (const H in u.ctx)
      p(O, H, v) && (E[H] = u.ctx[H]);
    return E;
  }
  function p(u, v, O) {
    const E = u[O];
    if (C(E) && E.includes(v) || B(E) && v in E || u.extends && p(u.extends, v, O) || u.mixins && u.mixins.some((H) => p(H, v, O)))
      return !0;
  }
  function S(u) {
    return $t(u) ? "ShallowRef" : u.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(s) : window.devtoolsFormatters = [s];
}
function lo(e) {
  const t = no();
  if (!t) {
    process.env.NODE_ENV !== "production" && F("useCssVars is called without current active component instance.");
    return;
  }
  const n = t.ut = (s = e(t.proxy)) => {
    Array.from(
      document.querySelectorAll(`[data-v-owner="${t.uid}"]`)
    ).forEach((i) => Yt(i, s));
  }, r = () => {
    const s = e(t.proxy);
    Ft(t.subTree, s), n(s);
  };
  Ds(r), rn(() => {
    const s = new MutationObserver(r);
    s.observe(t.subTree.el.parentNode, { childList: !0 }), Ls(() => s.disconnect());
  });
}
function Ft(e, t) {
  if (e.shapeFlag & 128) {
    const n = e.suspense;
    e = n.activeBranch, n.pendingBranch && !n.isHydrating && n.effects.push(() => {
      Ft(n.activeBranch, t);
    });
  }
  for (; e.component; )
    e = e.component.subTree;
  if (e.shapeFlag & 1 && e.el)
    Yt(e.el, t);
  else if (e.type === Tt)
    e.children.forEach((n) => Ft(n, t));
  else if (e.type === Ks) {
    let { el: n, anchor: r } = e;
    for (; n && (Yt(n, t), n !== r); )
      n = n.nextSibling;
  }
}
function Yt(e, t) {
  if (e.nodeType === 1) {
    const n = e.style;
    for (const r in t)
      n.setProperty(`--${r}`, t[r]);
  }
}
const fo = ["ctrl", "shift", "alt", "meta"], ho = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => fo.some((n) => e[`${n}Key`] && !t.includes(n))
}, po = (e, t) => (n, ...r) => {
  for (let s = 0; s < t.length; s++) {
    const i = ho[t[s]];
    if (i && i(n, t))
      return;
  }
  return e(n, ...r);
};
function mo() {
  uo();
}
process.env.NODE_ENV !== "production" && mo();
var go = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function wo(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var hr = { exports: {} };
(function(e, t) {
  (function(n, r) {
    e.exports = r();
  })(go, function() {
    var n = 1e3, r = 6e4, s = 36e5, i = "millisecond", c = "second", o = "minute", l = "hour", p = "day", S = "week", u = "month", v = "quarter", O = "year", E = "date", H = "Invalid Date", A = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, T = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, k = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(w) {
      var m = ["th", "st", "nd", "rd"], f = w % 100;
      return "[" + w + (m[(f - 20) % 10] || m[f] || m[0]) + "]";
    } }, R = function(w, m, f) {
      var g = String(w);
      return !g || g.length >= m ? w : "" + Array(m + 1 - g.length).join(f) + w;
    }, ne = { s: R, z: function(w) {
      var m = -w.utcOffset(), f = Math.abs(m), g = Math.floor(f / 60), d = f % 60;
      return (m <= 0 ? "+" : "-") + R(g, 2, "0") + ":" + R(d, 2, "0");
    }, m: function w(m, f) {
      if (m.date() < f.date())
        return -w(f, m);
      var g = 12 * (f.year() - m.year()) + (f.month() - m.month()), d = m.clone().add(g, u), y = f - d < 0, b = m.clone().add(g + (y ? -1 : 1), u);
      return +(-(g + (f - d) / (y ? d - b : b - d)) || 0);
    }, a: function(w) {
      return w < 0 ? Math.ceil(w) || 0 : Math.floor(w);
    }, p: function(w) {
      return { M: u, y: O, w: S, d: p, D: E, h: l, m: o, s: c, ms: i, Q: v }[w] || String(w || "").toLowerCase().replace(/s$/, "");
    }, u: function(w) {
      return w === void 0;
    } }, N = "en", te = {};
    te[N] = k;
    var Ie = "$isDayjsObject", We = function(w) {
      return w instanceof Se || !(!w || !w[Ie]);
    }, be = function w(m, f, g) {
      var d;
      if (!m)
        return N;
      if (typeof m == "string") {
        var y = m.toLowerCase();
        te[y] && (d = y), f && (te[y] = f, d = y);
        var b = m.split("-");
        if (!d && b.length > 1)
          return w(b[0]);
      } else {
        var D = m.name;
        te[D] = m, d = D;
      }
      return !g && d && (N = d), d || !g && N;
    }, P = function(w, m) {
      if (We(w))
        return w.clone();
      var f = typeof m == "object" ? m : {};
      return f.date = w, f.args = arguments, new Se(f);
    }, $ = ne;
    $.l = be, $.i = We, $.w = function(w, m) {
      return P(w, { locale: m.$L, utc: m.$u, x: m.$x, $offset: m.$offset });
    };
    var Se = function() {
      function w(f) {
        this.$L = be(f.locale, null, !0), this.parse(f), this.$x = this.$x || f.x || {}, this[Ie] = !0;
      }
      var m = w.prototype;
      return m.parse = function(f) {
        this.$d = function(g) {
          var d = g.date, y = g.utc;
          if (d === null)
            return /* @__PURE__ */ new Date(NaN);
          if ($.u(d))
            return /* @__PURE__ */ new Date();
          if (d instanceof Date)
            return new Date(d);
          if (typeof d == "string" && !/Z$/i.test(d)) {
            var b = d.match(A);
            if (b) {
              var D = b[2] - 1 || 0, L = (b[7] || "0").substring(0, 3);
              return y ? new Date(Date.UTC(b[1], D, b[3] || 1, b[4] || 0, b[5] || 0, b[6] || 0, L)) : new Date(b[1], D, b[3] || 1, b[4] || 0, b[5] || 0, b[6] || 0, L);
            }
          }
          return new Date(d);
        }(f), this.init();
      }, m.init = function() {
        var f = this.$d;
        this.$y = f.getFullYear(), this.$M = f.getMonth(), this.$D = f.getDate(), this.$W = f.getDay(), this.$H = f.getHours(), this.$m = f.getMinutes(), this.$s = f.getSeconds(), this.$ms = f.getMilliseconds();
      }, m.$utils = function() {
        return $;
      }, m.isValid = function() {
        return this.$d.toString() !== H;
      }, m.isSame = function(f, g) {
        var d = P(f);
        return this.startOf(g) <= d && d <= this.endOf(g);
      }, m.isAfter = function(f, g) {
        return P(f) < this.startOf(g);
      }, m.isBefore = function(f, g) {
        return this.endOf(g) < P(f);
      }, m.$g = function(f, g, d) {
        return $.u(f) ? this[g] : this.set(d, f);
      }, m.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, m.valueOf = function() {
        return this.$d.getTime();
      }, m.startOf = function(f, g) {
        var d = this, y = !!$.u(g) || g, b = $.p(f), D = function(de, U) {
          var ce = $.w(d.$u ? Date.UTC(d.$y, U, de) : new Date(d.$y, U, de), d);
          return y ? ce : ce.endOf(p);
        }, L = function(de, U) {
          return $.w(d.toDate()[de].apply(d.toDate("s"), (y ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(U)), d);
        }, j = this.$W, V = this.$M, K = this.$D, oe = "set" + (this.$u ? "UTC" : "");
        switch (b) {
          case O:
            return y ? D(1, 0) : D(31, 11);
          case u:
            return y ? D(1, V) : D(0, V + 1);
          case S:
            var ie = this.$locale().weekStart || 0, Ee = (j < ie ? j + 7 : j) - ie;
            return D(y ? K - Ee : K + (6 - Ee), V);
          case p:
          case E:
            return L(oe + "Hours", 0);
          case l:
            return L(oe + "Minutes", 1);
          case o:
            return L(oe + "Seconds", 2);
          case c:
            return L(oe + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, m.endOf = function(f) {
        return this.startOf(f, !1);
      }, m.$set = function(f, g) {
        var d, y = $.p(f), b = "set" + (this.$u ? "UTC" : ""), D = (d = {}, d[p] = b + "Date", d[E] = b + "Date", d[u] = b + "Month", d[O] = b + "FullYear", d[l] = b + "Hours", d[o] = b + "Minutes", d[c] = b + "Seconds", d[i] = b + "Milliseconds", d)[y], L = y === p ? this.$D + (g - this.$W) : g;
        if (y === u || y === O) {
          var j = this.clone().set(E, 1);
          j.$d[D](L), j.init(), this.$d = j.set(E, Math.min(this.$D, j.daysInMonth())).$d;
        } else
          D && this.$d[D](L);
        return this.init(), this;
      }, m.set = function(f, g) {
        return this.clone().$set(f, g);
      }, m.get = function(f) {
        return this[$.p(f)]();
      }, m.add = function(f, g) {
        var d, y = this;
        f = Number(f);
        var b = $.p(g), D = function(V) {
          var K = P(y);
          return $.w(K.date(K.date() + Math.round(V * f)), y);
        };
        if (b === u)
          return this.set(u, this.$M + f);
        if (b === O)
          return this.set(O, this.$y + f);
        if (b === p)
          return D(1);
        if (b === S)
          return D(7);
        var L = (d = {}, d[o] = r, d[l] = s, d[c] = n, d)[b] || 1, j = this.$d.getTime() + f * L;
        return $.w(j, this);
      }, m.subtract = function(f, g) {
        return this.add(-1 * f, g);
      }, m.format = function(f) {
        var g = this, d = this.$locale();
        if (!this.isValid())
          return d.invalidDate || H;
        var y = f || "YYYY-MM-DDTHH:mm:ssZ", b = $.z(this), D = this.$H, L = this.$m, j = this.$M, V = d.weekdays, K = d.months, oe = d.meridiem, ie = function(U, ce, Te, Ve) {
          return U && (U[ce] || U(g, y)) || Te[ce].slice(0, Ve);
        }, Ee = function(U) {
          return $.s(D % 12 || 12, U, "0");
        }, de = oe || function(U, ce, Te) {
          var Ve = U < 12 ? "AM" : "PM";
          return Te ? Ve.toLowerCase() : Ve;
        };
        return y.replace(T, function(U, ce) {
          return ce || function(Te) {
            switch (Te) {
              case "YY":
                return String(g.$y).slice(-2);
              case "YYYY":
                return $.s(g.$y, 4, "0");
              case "M":
                return j + 1;
              case "MM":
                return $.s(j + 1, 2, "0");
              case "MMM":
                return ie(d.monthsShort, j, K, 3);
              case "MMMM":
                return ie(K, j);
              case "D":
                return g.$D;
              case "DD":
                return $.s(g.$D, 2, "0");
              case "d":
                return String(g.$W);
              case "dd":
                return ie(d.weekdaysMin, g.$W, V, 2);
              case "ddd":
                return ie(d.weekdaysShort, g.$W, V, 3);
              case "dddd":
                return V[g.$W];
              case "H":
                return String(D);
              case "HH":
                return $.s(D, 2, "0");
              case "h":
                return Ee(1);
              case "hh":
                return Ee(2);
              case "a":
                return de(D, L, !0);
              case "A":
                return de(D, L, !1);
              case "m":
                return String(L);
              case "mm":
                return $.s(L, 2, "0");
              case "s":
                return String(g.$s);
              case "ss":
                return $.s(g.$s, 2, "0");
              case "SSS":
                return $.s(g.$ms, 3, "0");
              case "Z":
                return b;
            }
            return null;
          }(U) || b.replace(":", "");
        });
      }, m.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, m.diff = function(f, g, d) {
        var y, b = this, D = $.p(g), L = P(f), j = (L.utcOffset() - this.utcOffset()) * r, V = this - L, K = function() {
          return $.m(b, L);
        };
        switch (D) {
          case O:
            y = K() / 12;
            break;
          case u:
            y = K();
            break;
          case v:
            y = K() / 3;
            break;
          case S:
            y = (V - j) / 6048e5;
            break;
          case p:
            y = (V - j) / 864e5;
            break;
          case l:
            y = V / s;
            break;
          case o:
            y = V / r;
            break;
          case c:
            y = V / n;
            break;
          default:
            y = V;
        }
        return d ? y : $.a(y);
      }, m.daysInMonth = function() {
        return this.endOf(u).$D;
      }, m.$locale = function() {
        return te[this.$L];
      }, m.locale = function(f, g) {
        if (!f)
          return this.$L;
        var d = this.clone(), y = be(f, g, !0);
        return y && (d.$L = y), d;
      }, m.clone = function() {
        return $.w(this.$d, this);
      }, m.toDate = function() {
        return new Date(this.valueOf());
      }, m.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, m.toISOString = function() {
        return this.$d.toISOString();
      }, m.toString = function() {
        return this.$d.toUTCString();
      }, w;
    }(), nt = Se.prototype;
    return P.prototype = nt, [["$ms", i], ["$s", c], ["$m", o], ["$H", l], ["$W", p], ["$M", u], ["$y", O], ["$D", E]].forEach(function(w) {
      nt[w[1]] = function(m) {
        return this.$g(m, w[0], w[1]);
      };
    }), P.extend = function(w, m) {
      return w.$i || (w(m, Se, P), w.$i = !0), P;
    }, P.locale = be, P.isDayjs = We, P.unix = function(w) {
      return P(1e3 * w);
    }, P.en = te[N], P.Ls = te, P.p = {}, P;
  });
})(hr);
var _o = hr.exports;
const xe = /* @__PURE__ */ wo(_o);
const pr = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [r, s] of t)
    n[r] = s;
  return n;
}, vo = { class: "order" }, yo = /* @__PURE__ */ Object.assign({ name: "WindowListItem" }, {
  __name: "WindowListItem",
  props: {
    index: {
      type: Number
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    totalMS: {
      type: Number
    },
    startTimestamp: {
      type: Number
    },
    width: {
      type: Number
    },
    active: {
      type: Boolean,
      default: !1
    },
    multiSegmentActiveColor: {
      type: String,
      default: "#333"
    }
  },
  emits: ["click", "click_window_timeSegments"],
  setup(e, { expose: t, emit: n }) {
    const r = e;
    lo((E) => ({
      "427ddd57": E.multiSegment
    }));
    const s = Ue(null), i = Ue(null), c = Et({
      height: 0,
      ctx: null
    }), o = () => {
      let { height: E } = s.value.getBoundingClientRect();
      c.height = E - 1, i.value.width = r.width, i.value.height = c.height, c.ctx = i.value.getContext("2d");
    }, l = (E, H) => {
      if (!r.data.timeSegments || r.data.timeSegments.length <= 0)
        return;
      const A = r.width / r.totalMS;
      r.data.timeSegments.forEach((T) => {
        if (T.beginTime <= r.startTimestamp + r.totalMS && T.endTime >= r.startTimestamp) {
          c.ctx.beginPath();
          let k = (T.beginTime - r.startTimestamp) * A, R;
          k < 0 ? (k = 0, R = (T.endTime - r.startTimestamp) * A) : R = (T.endTime - T.beginTime) * A;
          let ne = T.startRatio === void 0 ? 0.6 : T.startRatio, N = T.endRatio === void 0 ? 0.9 : T.endRatio;
          H ? c.ctx.rect(
            k,
            c.height * ne,
            R,
            c.height * (N - ne)
          ) : (c.ctx.fillStyle = T.color, c.ctx.fillRect(
            k,
            c.height * ne,
            R,
            c.height * (N - ne)
          )), E && E(T);
        }
      });
    }, p = () => {
      c.ctx.clearRect(0, 0, r.width, c.height);
    }, S = () => {
      Qt(() => {
        p(), l();
      });
    }, u = (E) => {
      n("click", E);
      let { left: H, top: A } = s.value.getBoundingClientRect(), T = E.clientX - H, k = E.clientY - A, R = v(T, k);
      R.length > 0 && n("click_window_timeSegments", R, r.index, r.data);
    }, v = (E, H) => {
      if (!r.data.timeSegments || r.data.timeSegments.length <= 0)
        return [];
      let A = [];
      return l((T) => {
        c.ctx.isPointInPath(E, H) && A.push(T);
      }, !0), A;
    }, O = () => s.value ? s.value.getBoundingClientRect() : null;
    return rn(() => {
      o(), l();
    }), t({
      draw: S,
      getRect: O
    }), (E, H) => (Fe(), dt("div", {
      class: bt(["windowListItem", { active: e.active }]),
      ref_key: "windowListItem",
      ref: s,
      onClick: u
    }, [
      tt("span", vo, Dr(e.index + 1), 1),
      tt("canvas", {
        class: "windowListItemCanvas",
        ref_key: "canvas",
        ref: i
      }, null, 512)
    ], 2));
  }
}), bo = /* @__PURE__ */ pr(yo, [["__scopeId", "data-v-35f19113"]]), Mn = 60 * 60 * 1e3, Oe = [0.5, 1, 2, 6, 12, 24, 72, 360, 720, 8760, 87600], xn = [1 / 60, 1 / 60, 2 / 60, 1 / 6, 0.25, 0.5, 1, 4, 4, 720, 7200], On = [
  1 / 20,
  1 / 30,
  1 / 20,
  1 / 3,
  0.5,
  2,
  4,
  4,
  4,
  720,
  7200
], So = [
  () => !0,
  (e) => e.getMinutes() % 5 === 0,
  (e) => e.getMinutes() % 10 === 0,
  (e) => e.getMinutes() === 0 || e.getMinutes() === 30,
  (e) => e.getMinutes() === 0,
  (e) => e.getHours() % 2 === 0 && e.getMinutes() === 0,
  (e) => e.getHours() % 3 === 0 && e.getMinutes() === 0,
  (e) => e.getHours() % 12 === 0 && e.getMinutes() === 0,
  (e) => !1,
  (e) => !0,
  (e) => !0
], Eo = [
  () => !0,
  (e) => e.getMinutes() % 5 === 0,
  (e) => e.getMinutes() % 10 === 0,
  (e) => e.getMinutes() === 0 || e.getMinutes() === 30,
  (e) => e.getHours() % 2 === 0 && e.getMinutes() === 0,
  (e) => e.getHours() % 4 === 0 && e.getMinutes() === 0,
  (e) => e.getHours() % 3 === 0 && e.getMinutes() === 0,
  (e) => e.getHours() % 12 === 0 && e.getMinutes() === 0,
  (e) => !1,
  (e) => !0,
  (e) => !0
];
const To = ["onMousewheel"], Mo = /* @__PURE__ */ Object.assign({ name: "TimeLine" }, {
  __name: "TimeLine",
  props: {
    // 初始时间，中点所在的时间，默认为当天0点
    initTime: {
      type: [Number, String],
      default: ""
    },
    // 显示预览的时间范围，即中间刻度所允许的时间范围
    /*
        {
          start: '2020-12-19 18:30:00',// 允许显示的最小时间
          end: '2021-01-20 10:0:00'// 允许显示的最大时间
        }
      */
    timeRange: {
      type: Object,
      default() {
        return {};
      }
    },
    // 初始的时间分辨率
    initZoomIndex: {
      type: Number,
      default: 5
      // 24小时
    },
    // 是否显示中间的竖线
    showCenterLine: {
      type: Boolean,
      default: !0
    },
    // 中间竖线的样式
    centerLineStyle: {
      type: Object,
      default() {
        return {
          width: 2,
          color: "#fff"
        };
      }
    },
    // 日期时间文字颜色
    textColor: {
      type: String,
      default: "rgba(151,158,167,1)"
    },
    // 鼠标滑过显示的时间文字颜色
    hoverTextColor: {
      type: String,
      default: "rgb(194, 202, 215)"
    },
    // 时间线段颜色
    lineColor: {
      type: String,
      default: "rgba(151,158,167,1)"
    },
    // 时间线段高度占时间轴高度的比例
    lineHeightRatio: {
      type: Object,
      default() {
        return {
          date: 0.3,
          // 0点时的日期线段高度
          time: 0.2,
          // 显示时间的线段高度
          none: 0.1,
          // 不显示时间的线段高度
          hover: 0.3
          // 鼠标滑过时显示的时间段高度
        };
      }
    },
    // 鼠标滑过时是否显示实时所在的时间
    showHoverTime: {
      type: Boolean,
      default: !0
    },
    // 格式化鼠标滑过时间
    hoverTimeFormat: {
      type: Function
    },
    // 要显示的时间颜色段
    /*
        {
          beginTime: new Date('2021-01-19 14:30:00').getTime(),// 起始时间戳
          endTime: new Date('2021-01-20 18:00:00').getTime(),// 结束时间戳
          color: '#FA3239',// 颜色
          startRatio: 0.65,// 高度的起始比例，即top=时间轴高度*startRatio
          endRatio: 0.9// 高度的结束比例，即bottom=时间轴高度*endRatio
        }
      */
    timeSegments: {
      type: Array,
      default: () => []
    },
    // 时间轴背景颜色
    backgroundColor: {
      type: String,
      default: "#262626"
    },
    // 多时间轴选中背景颜色
    multiSegmentActiveColor: {
      type: String
    },
    // 是否允许切换分辨率
    enableZoom: {
      type: Boolean,
      default: !0
    },
    // 是否允许拖动
    enableDrag: {
      type: Boolean,
      default: !0
    },
    // 多轴窗口列表，如果窗口数量大于1的话可以配置此项，会显示和窗口对应数量的时间轴，只有一个窗口的话请直接使用基本时间轴
    /*
        {
            name: '窗口1',
            timeSegments: [
                {
                    name: '窗口1的时间段1',
                    beginTime: new Date('2021-01-13 10:00:00').getTime(),
                    endTime: new Date('2021-01-14 23:00:00').getTime(),
                    color: '#FA3239',
                    startRatio: 0.1,
                    endRatio: 0.9
                },
                {
                    name: '窗口1的时间段2',
                    beginTime: new Date('2021-01-12 18:00:00').getTime(),
                    endTime: new Date('2021-01-13 00:00:00').getTime(),
                    color: '#00AEFF',
                    startRatio: 0.1,
                    endRatio: 0.9
                }
            ]
        },
      */
    windowList: {
      type: Array,
      default: () => []
    },
    // 当显示windowList时的基础时间轴高度
    baseTimeLineHeight: {
      type: Number,
      default: 50
    },
    // 初始选中的窗口时间轴
    initSelectWindowTimeLineIndex: {
      type: Number,
      default: -1
    },
    // 是否是手机端
    isMobile: {
      type: Boolean,
      default: !1
    },
    // 鼠标按下和松开的距离小于该值认为是点击事件
    maxClickDistance: {
      type: Number,
      default: 3
    },
    // 绘制时间段时对计算出来的坐标进行四舍五入，可以防止相连的时间段绘制出来有间隔的问题
    roundWidthTimeSegments: {
      type: Boolean,
      default: !0
    },
    // 自定义显示哪些时间
    customShowTime: {
      type: Function
    },
    // 0点处是否显示日期
    showDateAtZero: {
      type: Boolean,
      default: !0
    },
    // 扩展ZOOM列表，这个数组的数据会追加到内部的ZOOM数组，对应的zoomIndex往后累加即可，内部一共有11个zoom，那么你追加了一项，对应的zoomIndex为11，因为是从零开始计数
    // 数组类型，数组的每一项为：
    /*
        {
          zoom: 26,// 时间分辨率，整个时间轴表示的时间范围，单位：小时
          zoomHourGrid: 0.5,// 时间分辨率对应的每格小时数，即时间轴上最小格代表多少小时
          mobileZoomHourGrid: 2, // 手机模式下时间分辨率对应的每格小时数，如果不用适配手机端，可以不用设置
        }
      */
    // 同时你需要传递customShowTime属性来自定义控制时间显示，否则会报错，因为内置的规则只有11个
    extendZOOM: {
      type: Array,
      default() {
        return [];
      }
    },
    // 格式化时间轴显示时间
    formatTime: {
      type: Function
    }
  },
  emits: [
    "timeChange",
    "mousedown",
    "dragTimeChange",
    "mouseup",
    "click_timeSegments",
    "click_timeline",
    "change_window_time_line",
    "click_window_timeSegments"
  ],
  setup(e, { expose: t, emit: n }) {
    const r = e, s = Ue(null), i = Ue(null), c = Ue([]), o = Et({
      width: 0,
      height: 0,
      ctx: null,
      currentZoomIndex: 0,
      currentTime: 0,
      startTimestamp: 0,
      mousedown: !1,
      mousedownX: 0,
      mousedownY: 0,
      mousedownCacheStartTimestamp: 0,
      showWindowList: !1,
      windowListInner: [],
      mousemoveX: -1,
      watchTimeList: []
    });
    r.extendZOOM.forEach((a) => {
      Oe.push(a.zoom), xn.push(a.zoomHourGrid), On.push(a.mobileZoomHourGrid);
    });
    const l = He(() => Oe[o.currentZoomIndex] * Mn), p = He(() => {
      let a = {};
      return r.timeRange.start && (a.start = typeof r.timeRange.start == "number" ? r.timeRange.start : new Date(r.timeRange.start).getTime()), r.timeRange.end && (a.end = typeof r.timeRange.end == "number" ? r.timeRange.end : new Date(r.timeRange.end).getTime()), a;
    }), S = He(() => r.isMobile ? On : xn), u = He(() => r.isMobile ? Eo : So), v = He(() => o.currentZoomIndex === 9), O = He(() => o.currentZoomIndex === 10), E = () => {
      o.windowListInner = r.windowList.map((a, h) => ({
        ...a,
        active: r.initSelectWindowTimeLineIndex === h
      })), o.currentZoomIndex = r.initZoomIndex >= 0 && r.initZoomIndex < Oe.length ? r.initZoomIndex : 5, o.startTimestamp = (r.initTime ? typeof r.initTime == "number" ? r.initTime : new Date(r.initTime).getTime() : new Date(xe().format("YYYY-MM-DD 00:00:00")).getTime()) - l.value / 2, H();
    }, H = () => {
      let a = l.value / 2, h = o.startTimestamp + a;
      p.value.start && h < p.value.start && (o.startTimestamp = p.value.start - a), p.value.end && h > p.value.end && (o.startTimestamp = p.value.end - a);
    }, A = () => {
      let { width: a, height: h } = s.value.getBoundingClientRect();
      o.width = a, o.height = r.windowList.length > 1 ? r.baseTimeLineHeight : h, i.value.width = o.width, i.value.height = o.height, o.ctx = i.value.getContext("2d"), o.showWindowList = !0;
    }, T = () => {
      te(), ne(), R(), o.currentTime = o.startTimestamp + l.value / 2, n("timeChange", o.currentTime);
      try {
        c.value.forEach((a) => {
          a.draw();
        });
      } catch (a) {
        console.error(a);
      }
      k();
    }, k = () => {
      o.watchTimeList.forEach((a) => {
        if (a.time < o.startTimestamp || a.time > o.startTimestamp + l.value)
          a.callback(-1, -1);
        else {
          let h = (a.time - o.startTimestamp) * (o.width / l.value), _ = 0, { left: M, top: Y } = i.value.getBoundingClientRect();
          if (a.windowTimeLineIndex !== -1 && r.windowList.length > 1 && a.windowTimeLineIndex >= 0 && a.windowTimeLineIndex < r.windowList.length) {
            let I = c.value[a.windowTimeLineIndex].getRect();
            _ = I ? I.top : Y;
          } else
            _ = Y;
          a.callback(h + M, _);
        }
      });
    }, R = () => {
      if (!r.showCenterLine)
        return;
      o.ctx.beginPath();
      let { width: a, color: h } = r.centerLineStyle, _ = o.width / 2;
      oe(_, 0, _, o.height, a, h);
    }, ne = () => {
      o.ctx.beginPath();
      let a = Oe[o.currentZoomIndex] / S.value[o.currentZoomIndex], h = S.value[o.currentZoomIndex] * Mn, _ = o.width / a, M = h - o.startTimestamp % h, Y = M / h * _;
      for (let I = 0; I < a; I++) {
        let z = o.startTimestamp + M + I * h, he = 0;
        O.value ? he = z - (/* @__PURE__ */ new Date(`${xe(z).format("YYYY")}-01-01 00:00:00`)).getTime() : v.value && (he = z - (/* @__PURE__ */ new Date(
          `${xe(z).format("YYYY")}-${xe(z).format(
            "MM"
          )}-01 00:00:00`
        )).getTime());
        let Me = Y + I * _ - he / h * _, Mt = z - he, Pe = 0, xt = new Date(Mt);
        r.showDateAtZero && xt.getHours() === 0 && xt.getMinutes() === 0 ? (Pe = o.height * (r.lineHeightRatio.date === void 0 ? 0.3 : r.lineHeightRatio.date), o.ctx.fillStyle = r.textColor, o.ctx.fillText(K(Mt), Me - 13, Pe + 15)) : N(xt) ? (Pe = o.height * (r.lineHeightRatio.time === void 0 ? 0.2 : r.lineHeightRatio.time), o.ctx.fillStyle = r.textColor, o.ctx.fillText(K(Mt), Me - 13, Pe + 15)) : Pe = o.height * (r.lineHeightRatio.none === void 0 ? 0.1 : r.lineHeightRatio.none), oe(Me, 0, Me, Pe, 1, r.lineColor);
      }
    }, N = (a) => {
      if (r.customShowTime) {
        let h = r.customShowTime(a, o.currentZoomIndex);
        if (h === !0)
          return !0;
        if (h === !1)
          return !1;
      }
      return u.value[o.currentZoomIndex](a);
    }, te = (a, h) => {
      const _ = o.width / l.value;
      r.timeSegments.forEach((M) => {
        if (M.beginTime <= o.startTimestamp + l.value) {
          let Y = M.endTime >= o.startTimestamp;
          o.ctx.beginPath();
          let I = (M.beginTime - o.startTimestamp) * _, z;
          I < 0 ? (I = 0, z = Y ? (M.endTime - o.startTimestamp) * _ : 1) : z = Y ? (M.endTime - M.beginTime) * _ : 1;
          let he = M.startRatio === void 0 ? 0.6 : M.startRatio, Me = M.endRatio === void 0 ? 0.9 : M.endRatio;
          r.roundWidthTimeSegments && (I = Math.round(I), z = Math.round(z)), z = Math.max(1, z), h ? o.ctx.rect(
            I,
            o.height * he,
            z,
            o.height * (Me - he)
          ) : (o.ctx.fillStyle = M.color, o.ctx.fillRect(
            I,
            o.height * he,
            z,
            o.height * (Me - he)
          )), a && a(M);
        }
      });
    }, Ie = (a) => {
      r.isMobile && (a = a.touches[0], be(a));
    }, We = (a) => {
      r.isMobile || be(a);
    }, be = (a) => {
      let h = j(a);
      a.target.style.cursor = "grabbing", o.mousedownX = h[0], o.mousedownY = h[1], o.mousedown = !0, o.mousedownCacheStartTimestamp = o.startTimestamp, n("mousedown", a);
    };
    let P = (a) => {
      r.isMobile && (a = a.touches[0], Se(a));
    }, $ = (a) => {
      r.isMobile || Se(a);
    };
    const Se = (a) => {
      a.target.style.cursor = "pointer";
      let h = j(a);
      const _ = () => {
        o.mousedown = !1, o.mousedownX = 0, o.mousedownY = 0, o.mousedownCacheStartTimestamp = 0;
      };
      if (Math.abs(h[0] - o.mousedownX) <= r.maxClickDistance && Math.abs(h[1] - o.mousedownY) <= r.maxClickDistance) {
        _(), D(...h);
        return;
      }
      o.mousedown && r.enableDrag ? (_(), n("dragTimeChange", o.currentTime)) : _(), n("mouseup", a);
    }, nt = (a) => {
      r.isMobile && (a = a.touches[0], m(a));
    }, w = (a) => {
      r.isMobile || m(a);
    }, m = (a) => {
      let h = j(a)[0];
      o.mousemoveX = h, o.mousedown && r.enableDrag ? g(h) : r.showHoverTime && d(h);
    }, f = () => {
      o.mousemoveX = -1;
    }, g = (a) => {
      if (!r.enableDrag)
        return;
      const h = o.width / l.value;
      let _ = a - o.mousedownX, M = l.value / 2, Y = o.mousedownCacheStartTimestamp - Math.round(_ / h), I = Y + M;
      p.value.start && I < p.value.start && (Y = p.value.start - M), p.value.end && I > p.value.end && (Y = p.value.end - M), o.startTimestamp = Y, V(o.width, o.height), T();
    }, d = (a, h) => {
      const _ = o.width / l.value;
      let M = o.startTimestamp + a / _;
      h || (V(o.width, o.height), T());
      let Y = o.height * (r.lineHeightRatio.hover === void 0 ? 0.3 : r.lineHeightRatio.hover);
      oe(a, 0, a, Y, 1, r.lineColor), o.ctx.fillStyle = r.hoverTextColor;
      let I = r.hoverTimeFormat ? r.hoverTimeFormat(M) : xe(M).format("YYYY-MM-DD HH:mm:ss"), z = o.ctx.measureText(I).width;
      o.ctx.fillText(I, a - z / 2, Y + 20);
    }, y = () => {
      V(o.width, o.height), T();
    }, b = (a) => {
      if (!r.enableZoom)
        return;
      let h = window.event || a, _ = Math.max(-1, Math.min(1, h.wheelDelta || -h.detail));
      _ < 0 ? o.currentZoomIndex + 1 >= Oe.length - 1 ? o.currentZoomIndex = Oe.length - 1 : o.currentZoomIndex++ : _ > 0 && (o.currentZoomIndex - 1 <= 0 ? o.currentZoomIndex = 0 : o.currentZoomIndex--), V(o.width, o.height), o.startTimestamp = o.currentTime - l.value / 2, T();
    }, D = (a, h) => {
      const _ = o.width / l.value;
      let M = o.startTimestamp + a / _, Y = xe(M).format("YYYY-MM-DD HH:mm:ss"), I = L(a, h);
      I && I.length > 0 ? n("click_timeSegments", I, M, Y, a) : gr(M, Y, a);
    }, L = (a, h) => {
      let _ = [];
      return te((M) => {
        o.ctx.isPointInPath(a, h) && _.push(M);
      }, !0), _;
    }, j = (a) => {
      if (!s.value || !a)
        return [0, 0];
      let { left: h, top: _ } = s.value.getBoundingClientRect();
      return [a.clientX - h, a.clientY - _];
    }, V = (a, h) => {
      o.ctx.clearRect(0, 0, a, h);
    }, K = (a) => {
      let h = xe(a), _ = "";
      return r.formatTime && (_ = r.formatTime(h)), _ || (O.value ? h.format("YYYY") : v.value ? h.format("YYYY-MM") : h.hour() === 0 && h.minute() === 0 && h.millisecond() === 0 ? h.format("MM-DD") : h.format("HH:mm"));
    }, oe = (a, h, _, M, Y = 1, I = "#fff") => {
      o.ctx.beginPath(), o.ctx.strokeStyle = I, o.ctx.lineWidth = Y, o.ctx.moveTo(a, h), o.ctx.lineTo(_, M), o.ctx.stroke();
    }, ie = () => {
      Qt(() => {
        V(o.width, o.height), Ee(), E(), A(), T();
      });
    }, Ee = () => {
      o.width = 0, o.height = 0, o.ctx = null, o.currentZoomIndex = 0, o.currentTime = 0, o.startTimestamp = 0, o.mousedown = !1, o.mousedownX = 0, o.mousedownCacheStartTimestamp = 0;
    }, de = (a) => {
      if (o.mousedown)
        return;
      let h = typeof a == "number" ? a : new Date(a).getTime();
      o.startTimestamp = h - l.value / 2, H(), V(o.width, o.height), T(), o.mousemoveX !== -1 && !r.isMobile && d(o.mousemoveX, !0);
    }, U = (a, h, _) => {
      n("click_window_timeSegments", a, h, _);
    }, ce = (a) => {
      o.currentZoomIndex = a >= 0 && a < Oe.length ? a : 5, V(o.width, o.height), o.startTimestamp = o.currentTime - l.value / 2, T();
    }, Te = (a) => {
      o.windowListInner.forEach((h) => {
        h.active = !1;
      }), o.windowListInner[a].active = !0, n("change_window_time_line", a, o.windowListInner[a]);
    }, Ve = (a, h, _) => {
      !a || !h || o.watchTimeList.push({
        time: typeof a == "number" ? a : new Date(a).getTime(),
        callback: h,
        windowTimeLineIndex: typeof _ == "number" ? _ - 1 : -1
      });
    }, mr = () => {
      k();
    };
    let rt = () => {
      A(), T();
      try {
        c.value.forEach((a) => {
          a.init();
        });
      } catch (a) {
        console.error(a);
      }
    };
    const gr = (...a) => {
      n("click_timeline", ...a);
    };
    return Cs(() => r.timeSegments, ie, { deep: !0 }), rn(() => {
      E(), A(), T(), $ = $.bind(this), rt = rt.bind(this), P = P.bind(this), r.isMobile ? window.addEventListener("touchend", P) : window.addEventListener("mouseup", $), window.addEventListener("resize", rt);
    }), Ps(() => {
      r.isMobile ? window.removeEventListener("touchend", P) : window.removeEventListener("mouseup", $), window.removeEventListener("resize", rt);
    }), t({
      setTime: de,
      setZoom: ce,
      watchTime: Ve,
      reRender: ie
    }), (a, h) => (Fe(), dt("div", {
      class: "timeLineContainer",
      ref_key: "timeLineContainer",
      ref: s,
      style: yt({
        backgroundColor: e.backgroundColor
      }),
      onTouchstart: Ie,
      onTouchmove: nt,
      onMousedown: We,
      onMouseout: y,
      onMousemove: w,
      onMouseleave: f
    }, [
      tt("canvas", {
        class: "canvas",
        ref_key: "canvas",
        ref: i,
        onMousewheel: po(b, ["stop", "prevent"])
      }, null, 40, To),
      o.showWindowList && e.windowList && e.windowList.length > 1 ? (Fe(), dt("div", {
        key: 0,
        class: "windowList",
        ref: "windowList",
        onScroll: mr
      }, [
        (Fe(!0), dt(Tt, null, As(o.windowListInner, (_, M) => (Fe(), rr(bo, {
          ref_for: !0,
          ref_key: "WindowListItemRef",
          ref: c,
          key: M,
          index: M,
          data: _,
          totalMS: l.value,
          startTimestamp: o.startTimestamp,
          width: o.width,
          active: _.active,
          multiSegmentActiveColor: e.multiSegmentActiveColor,
          onClick_window_timeSegments: U,
          onClick: (Y) => Te(M)
        }, null, 8, ["index", "data", "totalMS", "startTimestamp", "width", "active", "multiSegmentActiveColor", "onClick"]))), 128))
      ], 544)) : eo("", !0)
    ], 36));
  }
}), xo = /* @__PURE__ */ pr(Mo, [["__scopeId", "data-v-55d6c60f"]]), Oo = {
  install(e, t) {
    const n = t != null && t.comName ? t == null ? void 0 : t.comName : "TimeLine";
    e.component(n, xo);
  }
};
export {
  xo as TimeLineCom,
  Oo as default
};
