import {
  S as $,
  b as Ct,
  a as St,
  B as Ue,
  c as X,
} from "./colorToUniform-DmtBy-2V.js";
import {
  H as _t,
  l as A,
  J as Be,
  I as bt,
  _ as C,
  n as Ce,
  ah as ce,
  ag as ct,
  af as D,
  ad as de,
  z as dt,
  M as F,
  F as Fe,
  v as ft,
  B as G,
  am as gt,
  ak as ht,
  s as ie,
  ap as K,
  ai as k,
  U as lt,
  D as Me,
  E as m,
  o as mt,
  w as O,
  ab as P,
  q as Pe,
  Q as pt,
  b as q,
  R as re,
  aj as S,
  Z as Se,
  al as se,
  aa as T,
  d as Te,
  ao as Tt,
  a7 as U,
  T as ue,
  a as ut,
  m as V,
  e as v,
  an as vt,
  ae as W,
  t as w,
  x as we,
  aq as wt,
  p as xt,
  X as Y,
  K as yt,
} from "./index-DRbAUgUq.js";
class Re {
  static init(e) {
    Object.defineProperty(Re, "resizeTo", {
      set(t) {
        globalThis.removeEventListener("resize", this.queueResize),
          (this._resizeTo = t),
          t &&
            (globalThis.addEventListener("resize", this.queueResize),
            this.resize());
      },
      get() {
        return this._resizeTo;
      },
    }),
      (Re.queueResize = () => {
        Re._resizeTo &&
          (Re._cancelResize(),
          (Re._resizeId = requestAnimationFrame(() => Re.resize())));
      }),
      (Re._cancelResize = () => {
        Re._resizeId &&
          (cancelAnimationFrame(Re._resizeId), (Re._resizeId = null));
      }),
      (Re.resize = () => {
        if (!Re._resizeTo) return;
        Re._cancelResize();
        let t, r;
        if (Re._resizeTo === globalThis.window)
          (t = globalThis.innerWidth), (r = globalThis.innerHeight);
        else {
          const { clientWidth: s, clientHeight: i } = Re._resizeTo;
          (t = s), (r = i);
        }
        Re.renderer.resize(t, r), Re.render();
      }),
      (Re._resizeId = null),
      (Re._resizeTo = null),
      (Re.resizeTo = e.resizeTo || null);
  }
  static destroy() {
    globalThis.removeEventListener("resize", Re.queueResize),
      Re._cancelResize(),
      (Re._cancelResize = null),
      (Re.queueResize = null),
      (Re.resizeTo = null),
      (Re.resize = null);
  }
}
Re.extension = m.Application;
class Ge {
  static init(e) {
    (e = Object.assign({ autoStart: !0, sharedTicker: !1 }, e)),
      Object.defineProperty(Ge, "ticker", {
        set(t) {
          this._ticker && this._ticker.remove(this.render, this),
            (this._ticker = t),
            t && t.add(this.render, this, lt.LOW);
        },
        get() {
          return this._ticker;
        },
      }),
      (Ge.stop = () => {
        Ge._ticker.stop();
      }),
      (Ge.start = () => {
        Ge._ticker.start();
      }),
      (Ge._ticker = null),
      (Ge.ticker = e.sharedTicker ? ue.shared : new ue()),
      e.autoStart && Ge.start();
  }
  static destroy() {
    if (Ge._ticker) {
      const e = Ge._ticker;
      (Ge.ticker = null), e.destroy();
    }
  }
}
Ge.extension = m.Application;
class Pt extends ut {
  constructor() {
    super(...arguments),
      (this.chars = Object.create(null)),
      (this.lineHeight = 0),
      (this.fontFamily = ""),
      (this.fontMetrics = { fontSize: 0, ascent: 0, descent: 0 }),
      (this.baseLineOffset = 0),
      (this.distanceField = { type: "none", range: 0 }),
      (this.pages = []),
      (this.applyFillAsTint = !0),
      (this.baseMeasurementFontSize = 100),
      (this.baseRenderedFontSize = 100);
  }
  get font() {
    return (
      T(
        P,
        "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead.",
      ),
      this.fontFamily
    );
  }
  get pageTextures() {
    return (
      T(
        P,
        "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead.",
      ),
      this.pages
    );
  }
  get size() {
    return (
      T(
        P,
        "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead.",
      ),
      this.fontMetrics.fontSize
    );
  }
  get distanceFieldRange() {
    return (
      T(
        P,
        "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead.",
      ),
      this.distanceField.range
    );
  }
  get distanceFieldType() {
    return (
      T(
        P,
        "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead.",
      ),
      this.distanceField.type
    );
  }
  destroy(e = !1) {
    var t;
    this.emit("destroy", this), this.removeAllListeners();
    for (const r in this.chars)
      (t = this.chars[r].texture) == null || t.destroy();
    (this.chars = null),
      e &&
        (this.pages.forEach((r) => r.texture.destroy(!0)), (this.pages = null));
  }
}
const ke = class Ae extends Pt {
  constructor(e) {
    super(),
      (this.resolution = 1),
      (this.pages = []),
      (this._padding = 0),
      (this._measureCache = Object.create(null)),
      (this._currentChars = []),
      (this._currentX = 0),
      (this._currentY = 0),
      (this._currentMaxCharHeight = 0),
      (this._currentPageIndex = -1),
      (this._skipKerning = !1);
    const t = { ...Ae.defaultOptions, ...e };
    (this._textureSize = t.textureSize), (this._mipmap = t.mipmap);
    const r = t.style.clone();
    t.overrideFill &&
      ((r._fill.color = 16777215),
      (r._fill.alpha = 1),
      (r._fill.texture = w.WHITE),
      (r._fill.fill = null)),
      (this.applyFillAsTint = t.overrideFill);
    const s = r.fontSize;
    r.fontSize = this.baseMeasurementFontSize;
    const i = de(r);
    t.overrideSize
      ? r._stroke && (r._stroke.width *= this.baseRenderedFontSize / s)
      : (r.fontSize = this.baseRenderedFontSize = s),
      (this._style = r),
      (this._skipKerning = t.skipKerning ?? !1),
      (this.resolution = t.resolution ?? 1),
      (this._padding = t.padding ?? 4),
      t.textureStyle &&
        (this._textureStyle =
          t.textureStyle instanceof W ? t.textureStyle : new W(t.textureStyle)),
      (this.fontMetrics = D.measureFont(i)),
      (this.lineHeight =
        r.lineHeight || this.fontMetrics.fontSize || r.fontSize);
  }
  ensureCharacters(e) {
    var g, p;
    const t = D.graphemeSegmenter(e)
      .filter((_) => !this._currentChars.includes(_))
      .filter((_, y, B) => B.indexOf(_) === y);
    if (!t.length) return;
    this._currentChars = [...this._currentChars, ...t];
    let r;
    this._currentPageIndex === -1
      ? (r = this._nextPage())
      : (r = this.pages[this._currentPageIndex]);
    let { canvas: s, context: i } = r.canvasAndContext,
      a = r.texture.source;
    const o = this._style;
    let l = this._currentX,
      u = this._currentY,
      c = this._currentMaxCharHeight;
    const d = this.baseRenderedFontSize / this.baseMeasurementFontSize,
      h = this._padding * d;
    let f = !1;
    const b = s.width / this.resolution,
      x = s.height / this.resolution;
    for (let _ = 0; _ < t.length; _++) {
      const y = t[_],
        B = D.measureText(y, o, s, !1);
      B.lineHeight = B.height;
      const j = B.width * d,
        z = Math.ceil((o.fontStyle === "italic" ? 2 : 1) * j),
        M = B.height * d,
        I = z + h * 2,
        N = M + h * 2;
      if (
        ((f = !1),
        y !==
          `
` &&
          y !== "\r" &&
          y !== "	" &&
          y !== " " &&
          ((f = !0), (c = Math.ceil(Math.max(N, c)))),
        l + I > b && ((u += c), (c = N), (l = 0), u + c > x))
      ) {
        a.update();
        const R = this._nextPage();
        (s = R.canvasAndContext.canvas),
          (i = R.canvasAndContext.context),
          (a = R.texture.source),
          (l = 0),
          (u = 0),
          (c = 0);
      }
      const at =
        j / d -
        (((g = o.dropShadow) == null ? void 0 : g.distance) ?? 0) -
        (((p = o._stroke) == null ? void 0 : p.width) ?? 0);
      if (
        ((this.chars[y] = {
          id: y.codePointAt(0),
          xOffset: -this._padding,
          yOffset: -this._padding,
          xAdvance: at,
          kerning: {},
        }),
        f)
      ) {
        this._drawGlyph(i, B, l + h, u + h, d, o);
        const R = a.width * d,
          le = a.height * d,
          ot = new dt(
            (l / R) * a.width,
            (u / le) * a.height,
            (I / R) * a.width,
            (N / le) * a.height,
          );
        (this.chars[y].texture = new w({ source: a, frame: ot })),
          (l += Math.ceil(I));
      }
    }
    a.update(),
      (this._currentX = l),
      (this._currentY = u),
      (this._currentMaxCharHeight = c),
      this._skipKerning && this._applyKerning(t, i);
  }
  get pageTextures() {
    return (
      T(
        P,
        "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead.",
      ),
      this.pages
    );
  }
  _applyKerning(e, t) {
    const r = this._measureCache;
    for (let s = 0; s < e.length; s++) {
      const i = e[s];
      for (let a = 0; a < this._currentChars.length; a++) {
        const o = this._currentChars[a];
        let l = r[i];
        l || (l = r[i] = t.measureText(i).width);
        let u = r[o];
        u || (u = r[o] = t.measureText(o).width);
        let c = t.measureText(i + o).width,
          d = c - (l + u);
        d && (this.chars[i].kerning[o] = d),
          (c = t.measureText(i + o).width),
          (d = c - (l + u)),
          d && (this.chars[o].kerning[i] = d);
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const e = this.resolution,
      t = V.getOptimalCanvasAndContext(this._textureSize, this._textureSize, e);
    this._setupContext(t.context, this._style, e);
    const r = e * (this.baseRenderedFontSize / this.baseMeasurementFontSize),
      s = new w({
        source: new ct({
          resource: t.canvas,
          resolution: r,
          alphaMode: "premultiply-alpha-on-upload",
          autoGenerateMipmaps: this._mipmap,
        }),
      });
    this._textureStyle && (s.source.style = this._textureStyle);
    const i = { canvasAndContext: t, texture: s };
    return (this.pages[this._currentPageIndex] = i), i;
  }
  _setupContext(e, t, r) {
    (t.fontSize = this.baseRenderedFontSize),
      e.scale(r, r),
      (e.font = de(t)),
      (t.fontSize = this.baseMeasurementFontSize),
      (e.textBaseline = t.textBaseline);
    const s = t._stroke,
      i = (s == null ? void 0 : s.width) ?? 0;
    if (
      (s &&
        ((e.lineWidth = i),
        (e.lineJoin = s.join),
        (e.miterLimit = s.miterLimit),
        (e.strokeStyle = ce(s, e))),
      t._fill && (e.fillStyle = ce(t._fill, e)),
      t.dropShadow)
    ) {
      const a = t.dropShadow,
        o = U.shared.setValue(a.color).toArray(),
        l = a.blur * r,
        u = a.distance * r;
      (e.shadowColor = `rgba(${o[0] * 255},${o[1] * 255},${o[2] * 255},${a.alpha})`),
        (e.shadowBlur = l),
        (e.shadowOffsetX = Math.cos(a.angle) * u),
        (e.shadowOffsetY = Math.sin(a.angle) * u);
    } else
      (e.shadowColor = "black"),
        (e.shadowBlur = 0),
        (e.shadowOffsetX = 0),
        (e.shadowOffsetY = 0);
  }
  _drawGlyph(e, t, r, s, i, a) {
    const o = t.text,
      l = t.fontProperties,
      u = a._stroke,
      c = ((u == null ? void 0 : u.width) ?? 0) * i,
      d = r + c / 2,
      h = s - c / 2,
      f = l.descent * i,
      b = t.lineHeight * i;
    let x = !1;
    a.stroke && c && ((x = !0), e.strokeText(o, d, h + b - f));
    const { shadowBlur: g, shadowOffsetX: p, shadowOffsetY: _ } = e;
    a._fill &&
      (x && ((e.shadowBlur = 0), (e.shadowOffsetX = 0), (e.shadowOffsetY = 0)),
      e.fillText(o, d, h + b - f)),
      x && ((e.shadowBlur = g), (e.shadowOffsetX = p), (e.shadowOffsetY = _));
  }
  destroy() {
    super.destroy();
    for (let e = 0; e < this.pages.length; e++) {
      const { canvasAndContext: t, texture: r } = this.pages[e];
      V.returnCanvasAndContext(t), r.destroy(!0);
    }
    this.pages = null;
  }
};
ke.defaultOptions = { textureSize: 512, style: new k(), mipmap: !0 };
const he = ke;
function ze(n, e, t, r) {
  const s = {
    width: 0,
    height: 0,
    offsetY: 0,
    scale: e.fontSize / t.baseMeasurementFontSize,
    lines: [
      {
        width: 0,
        charPositions: [],
        spaceWidth: 0,
        spacesIndex: [],
        chars: [],
      },
    ],
  };
  s.offsetY = t.baseLineOffset;
  let i = s.lines[0],
    a = null,
    o = !0;
  const l = { width: 0, start: 0, index: 0, positions: [], chars: [] },
    u = (g) => {
      const p = i.width;
      for (let _ = 0; _ < l.index; _++) {
        const y = g.positions[_];
        i.chars.push(g.chars[_]), i.charPositions.push(y + p);
      }
      (i.width += g.width),
        (o = !1),
        (l.width = 0),
        (l.index = 0),
        (l.chars.length = 0);
    },
    c = () => {
      let g = i.chars.length - 1;
      if (r) {
        let p = i.chars[g];
        for (; p === " "; )
          (i.width -= t.chars[p].xAdvance), (p = i.chars[--g]);
      }
      (s.width = Math.max(s.width, i.width)),
        (i = {
          width: 0,
          charPositions: [],
          chars: [],
          spaceWidth: 0,
          spacesIndex: [],
        }),
        (o = !0),
        s.lines.push(i),
        (s.height += t.lineHeight);
    },
    d = t.baseMeasurementFontSize / e.fontSize,
    h = e.letterSpacing * d,
    f = e.wordWrapWidth * d,
    b = e.wordWrap && e.breakWords,
    x = (g) => g - h > f;
  for (let g = 0; g < n.length + 1; g++) {
    let p;
    const _ = g === n.length;
    _ || (p = n[g]);
    const y = t.chars[p] || t.chars[" "];
    if (
      /(?:\s)/.test(p) ||
      p === "\r" ||
      p ===
        `
` ||
      _
    ) {
      if (
        (!o && e.wordWrap && x(i.width + l.width)
          ? (c(), u(l), _ || i.charPositions.push(0))
          : ((l.start = i.width), u(l), _ || i.charPositions.push(0)),
        p === "\r" ||
          p ===
            `
`)
      )
        i.width !== 0 && c();
      else if (!_) {
        const M = y.xAdvance + (y.kerning[a] || 0) + h;
        (i.width += M),
          (i.spaceWidth = M),
          i.spacesIndex.push(i.charPositions.length),
          i.chars.push(p);
      }
    } else {
      const z = y.kerning[a] || 0,
        M = y.xAdvance + z + h;
      b && x(i.width + l.width + M) && (u(l), c()),
        (l.positions[l.index++] = l.width + z),
        l.chars.push(p),
        (l.width += M);
    }
    a = p;
  }
  return (
    c(),
    e.align === "center"
      ? Ft(s)
      : e.align === "right"
        ? Bt(s)
        : e.align === "justify" && Mt(s),
    s
  );
}
function Ft(n) {
  for (let e = 0; e < n.lines.length; e++) {
    const t = n.lines[e],
      r = n.width / 2 - t.width / 2;
    for (let s = 0; s < t.charPositions.length; s++) t.charPositions[s] += r;
  }
}
function Bt(n) {
  for (let e = 0; e < n.lines.length; e++) {
    const t = n.lines[e],
      r = n.width - t.width;
    for (let s = 0; s < t.charPositions.length; s++) t.charPositions[s] += r;
  }
}
function Mt(n) {
  const e = n.width;
  for (let t = 0; t < n.lines.length; t++) {
    const r = n.lines[t];
    let s = 0,
      i = r.spacesIndex[s++],
      a = 0;
    const o = r.spacesIndex.length,
      u = (e - r.width) / o;
    for (let c = 0; c < r.charPositions.length; c++)
      c === i && ((i = r.spacesIndex[s++]), (a += u)),
        (r.charPositions[c] += a);
  }
}
function Ut(n) {
  if (n === "") return [];
  typeof n == "string" && (n = [n]);
  const e = [];
  for (let t = 0, r = n.length; t < r; t++) {
    const s = n[t];
    if (Array.isArray(s)) {
      if (s.length !== 2)
        throw new Error(
          `[BitmapFont]: Invalid character range length, expecting 2 got ${s.length}.`,
        );
      if (s[0].length === 0 || s[1].length === 0)
        throw new Error("[BitmapFont]: Invalid character delimiter.");
      const i = s[0].charCodeAt(0),
        a = s[1].charCodeAt(0);
      if (a < i) throw new Error("[BitmapFont]: Invalid character range.");
      for (let o = i, l = a; o <= l; o++) e.push(String.fromCharCode(o));
    } else e.push(...Array.from(s));
  }
  if (e.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return e;
}
let L = 0;
class Rt {
  constructor() {
    (this.ALPHA = [["a", "z"], ["A", "Z"], " "]),
      (this.NUMERIC = [["0", "9"]]),
      (this.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "]),
      (this.ASCII = [[" ", "~"]]),
      (this.defaultOptions = {
        chars: this.ALPHANUMERIC,
        resolution: 1,
        padding: 4,
        skipKerning: !1,
        textureStyle: null,
      });
  }
  getFont(e, t) {
    var a;
    let r = `${t.fontFamily}-bitmap`,
      s = !0;
    if (t._fill.fill && !t._stroke) (r += t._fill.fill.styleKey), (s = !1);
    else if (t._stroke || t.dropShadow) {
      let o = t.styleKey;
      (o = o.substring(0, o.lastIndexOf("-"))), (r = `${o}-bitmap`), (s = !1);
    }
    if (!S.has(r)) {
      const o = new he({
        style: t,
        overrideFill: s,
        overrideSize: !0,
        ...this.defaultOptions,
      });
      L++,
        L > 50 &&
          O(
            "BitmapText",
            `You have dynamically created ${L} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``,
          ),
        o.once("destroy", () => {
          L--, S.remove(r);
        }),
        S.set(r, o);
    }
    const i = S.get(r);
    return (a = i.ensureCharacters) == null || a.call(i, e), i;
  }
  getLayout(e, t, r = !0) {
    const s = this.getFont(e, t),
      i = D.graphemeSegmenter(e);
    return ze(i, t, s, r);
  }
  measureText(e, t, r = !0) {
    return this.getLayout(e, t, r);
  }
  install(...e) {
    var u, c, d, h;
    let t = e[0];
    typeof t == "string" &&
      ((t = {
        name: t,
        style: e[1],
        chars: (u = e[2]) == null ? void 0 : u.chars,
        resolution: (c = e[2]) == null ? void 0 : c.resolution,
        padding: (d = e[2]) == null ? void 0 : d.padding,
        skipKerning: (h = e[2]) == null ? void 0 : h.skipKerning,
      }),
      T(
        P,
        "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})",
      ));
    const r = t == null ? void 0 : t.name;
    if (!r) throw new Error("[BitmapFontManager] Property `name` is required.");
    t = { ...this.defaultOptions, ...t };
    const s = t.style,
      i = s instanceof k ? s : new k(s),
      a = i._fill.fill !== null && i._fill.fill !== void 0,
      o = new he({
        style: i,
        overrideFill: a,
        skipKerning: t.skipKerning,
        padding: t.padding,
        resolution: t.resolution,
        overrideSize: !1,
        textureStyle: t.textureStyle,
      }),
      l = Ut(t.chars);
    return (
      o.ensureCharacters(l.join("")),
      S.set(`${r}-bitmap`, o),
      o.once("destroy", () => S.remove(`${r}-bitmap`)),
      o
    );
  }
  uninstall(e) {
    const t = `${e}-bitmap`,
      r = S.get(t);
    r && r.destroy();
  }
}
const Gt = new Rt();
class De {
  constructor(e) {
    this._renderer = e;
  }
  push(e, t, r) {
    this._renderer.renderPipes.batch.break(r),
      r.add({
        renderPipeId: "filter",
        canBundle: !1,
        action: "pushFilter",
        container: t,
        filterEffect: e,
      });
  }
  pop(e, t, r) {
    this._renderer.renderPipes.batch.break(r),
      r.add({ renderPipeId: "filter", action: "popFilter", canBundle: !1 });
  }
  execute(e) {
    e.action === "pushFilter"
      ? this._renderer.filter.push(e)
      : e.action === "popFilter" && this._renderer.filter.pop();
  }
  destroy() {
    this._renderer = null;
  }
}
De.extension = {
  type: [m.WebGLPipes, m.WebGPUPipes, m.CanvasPipes],
  name: "filter",
};
function kt(n, e) {
  e.clear();
  const t = e.matrix;
  for (let r = 0; r < n.length; r++) {
    const s = n[r];
    s.globalDisplayStatus < 7 ||
      ((e.matrix = s.worldTransform), e.addBounds(s.bounds));
  }
  return (e.matrix = t), e;
}
const At = new we({
  attributes: {
    aPosition: {
      buffer: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      format: "float32x2",
      stride: 2 * 4,
      offset: 0,
    },
  },
  indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3]),
});
class zt {
  constructor() {
    (this.skip = !1),
      (this.inputTexture = null),
      (this.backTexture = null),
      (this.filters = null),
      (this.bounds = new Se()),
      (this.container = null),
      (this.blendRequired = !1),
      (this.outputRenderSurface = null),
      (this.globalFrame = { x: 0, y: 0, width: 0, height: 0 });
  }
}
class We {
  constructor(e) {
    (this._filterStackIndex = 0),
      (this._filterStack = []),
      (this._filterGlobalUniforms = new A({
        uInputSize: { value: new Float32Array(4), type: "vec4<f32>" },
        uInputPixel: { value: new Float32Array(4), type: "vec4<f32>" },
        uInputClamp: { value: new Float32Array(4), type: "vec4<f32>" },
        uOutputFrame: { value: new Float32Array(4), type: "vec4<f32>" },
        uGlobalFrame: { value: new Float32Array(4), type: "vec4<f32>" },
        uOutputTexture: { value: new Float32Array(4), type: "vec4<f32>" },
      })),
      (this._globalFilterBindGroup = new Te({})),
      (this.renderer = e);
  }
  get activeBackTexture() {
    var e;
    return (e = this._activeFilterData) == null ? void 0 : e.backTexture;
  }
  push(e) {
    const t = this.renderer,
      r = e.filterEffect.filters,
      s = this._pushFilterData();
    (s.skip = !1),
      (s.filters = r),
      (s.container = e.container),
      (s.outputRenderSurface = t.renderTarget.renderSurface);
    const i = t.renderTarget.renderTarget.colorTexture.source,
      a = i.resolution,
      o = i.antialias;
    if (r.length === 0) {
      s.skip = !0;
      return;
    }
    const l = s.bounds;
    if (
      (this._calculateFilterArea(e, l),
      this._calculateFilterBounds(s, t.renderTarget.rootViewPort, o, a, 1),
      s.skip)
    )
      return;
    const u = this._getPreviousFilterData(),
      c = this._findFilterResolution(a);
    let d = 0,
      h = 0;
    u && ((d = u.bounds.minX), (h = u.bounds.minY)),
      this._calculateGlobalFrame(s, d, h, c, i.width, i.height),
      this._setupFilterTextures(s, l, t, u);
  }
  generateFilteredTexture({ texture: e, filters: t }) {
    const r = this._pushFilterData();
    (this._activeFilterData = r), (r.skip = !1), (r.filters = t);
    const s = e.source,
      i = s.resolution,
      a = s.antialias;
    if (t.length === 0) return (r.skip = !0), e;
    const o = r.bounds;
    if (
      (o.addRect(e.frame),
      this._calculateFilterBounds(r, o.rectangle, a, i, 0),
      r.skip)
    )
      return e;
    const l = i;
    this._calculateGlobalFrame(r, 0, 0, l, s.width, s.height),
      (r.outputRenderSurface = C.getOptimalTexture(
        o.width,
        o.height,
        r.resolution,
        r.antialias,
      )),
      (r.backTexture = w.EMPTY),
      (r.inputTexture = e),
      this.renderer.renderTarget.finishRenderPass(),
      this._applyFiltersToTexture(r, !0);
    const h = r.outputRenderSurface;
    return (h.source.alphaMode = "premultiplied-alpha"), h;
  }
  pop() {
    const e = this.renderer,
      t = this._popFilterData();
    t.skip ||
      (e.globalUniforms.pop(),
      e.renderTarget.finishRenderPass(),
      (this._activeFilterData = t),
      this._applyFiltersToTexture(t, !1),
      t.blendRequired && C.returnTexture(t.backTexture),
      C.returnTexture(t.inputTexture));
  }
  getBackTexture(e, t, r) {
    const s = e.colorTexture.source._resolution,
      i = C.getOptimalTexture(t.width, t.height, s, !1);
    let a = t.minX,
      o = t.minY;
    r && ((a -= r.minX), (o -= r.minY)),
      (a = Math.floor(a * s)),
      (o = Math.floor(o * s));
    const l = Math.ceil(t.width * s),
      u = Math.ceil(t.height * s);
    return (
      this.renderer.renderTarget.copyToTexture(
        e,
        i,
        { x: a, y: o },
        { width: l, height: u },
        { x: 0, y: 0 },
      ),
      i
    );
  }
  applyFilter(e, t, r, s) {
    const i = this.renderer,
      a = this._activeFilterData,
      l = a.outputRenderSurface === r,
      u = i.renderTarget.rootRenderTarget.colorTexture.source._resolution,
      c = this._findFilterResolution(u);
    let d = 0,
      h = 0;
    if (l) {
      const f = this._findPreviousFilterOffset();
      (d = f.x), (h = f.y);
    }
    this._updateFilterUniforms(t, r, a, d, h, c, l, s),
      this._setupBindGroupsAndRender(e, t, i);
  }
  calculateSpriteMatrix(e, t) {
    const r = this._activeFilterData,
      s = e.set(
        r.inputTexture._source.width,
        0,
        0,
        r.inputTexture._source.height,
        r.bounds.minX,
        r.bounds.minY,
      ),
      i = t.worldTransform.copyTo(F.shared),
      a = t.renderGroup || t.parentRenderGroup;
    return (
      a && a.cacheToLocalTransform && i.prepend(a.cacheToLocalTransform),
      i.invert(),
      s.prepend(i),
      s.scale(1 / t.texture.frame.width, 1 / t.texture.frame.height),
      s.translate(t.anchor.x, t.anchor.y),
      s
    );
  }
  destroy() {}
  _setupBindGroupsAndRender(e, t, r) {
    if (r.renderPipes.uniformBatch) {
      const s = r.renderPipes.uniformBatch.getUboResource(
        this._filterGlobalUniforms,
      );
      this._globalFilterBindGroup.setResource(s, 0);
    } else
      this._globalFilterBindGroup.setResource(this._filterGlobalUniforms, 0);
    this._globalFilterBindGroup.setResource(t.source, 1),
      this._globalFilterBindGroup.setResource(t.source.style, 2),
      (e.groups[0] = this._globalFilterBindGroup),
      r.encoder.draw({
        geometry: At,
        shader: e,
        state: e._state,
        topology: "triangle-list",
      }),
      r.type === re.WEBGL && r.renderTarget.finishRenderPass();
  }
  _setupFilterTextures(e, t, r, s) {
    if (((e.backTexture = w.EMPTY), e.blendRequired)) {
      r.renderTarget.finishRenderPass();
      const i = r.renderTarget.getRenderTarget(e.outputRenderSurface);
      e.backTexture = this.getBackTexture(i, t, s == null ? void 0 : s.bounds);
    }
    (e.inputTexture = C.getOptimalTexture(
      t.width,
      t.height,
      e.resolution,
      e.antialias,
    )),
      r.renderTarget.bind(e.inputTexture, !0),
      r.globalUniforms.push({ offset: t });
  }
  _calculateGlobalFrame(e, t, r, s, i, a) {
    const o = e.globalFrame;
    (o.x = t * s), (o.y = r * s), (o.width = i * s), (o.height = a * s);
  }
  _updateFilterUniforms(e, t, r, s, i, a, o, l) {
    const u = this._filterGlobalUniforms.uniforms,
      c = u.uOutputFrame,
      d = u.uInputSize,
      h = u.uInputPixel,
      f = u.uInputClamp,
      b = u.uGlobalFrame,
      x = u.uOutputTexture;
    o
      ? ((c[0] = r.bounds.minX - s), (c[1] = r.bounds.minY - i))
      : ((c[0] = 0), (c[1] = 0)),
      (c[2] = e.frame.width),
      (c[3] = e.frame.height),
      (d[0] = e.source.width),
      (d[1] = e.source.height),
      (d[2] = 1 / d[0]),
      (d[3] = 1 / d[1]),
      (h[0] = e.source.pixelWidth),
      (h[1] = e.source.pixelHeight),
      (h[2] = 1 / h[0]),
      (h[3] = 1 / h[1]),
      (f[0] = 0.5 * h[2]),
      (f[1] = 0.5 * h[3]),
      (f[2] = e.frame.width * d[2] - 0.5 * h[2]),
      (f[3] = e.frame.height * d[3] - 0.5 * h[3]);
    const g = this.renderer.renderTarget.rootRenderTarget.colorTexture;
    (b[0] = s * a),
      (b[1] = i * a),
      (b[2] = g.source.width * a),
      (b[3] = g.source.height * a),
      t instanceof w && (t.source.resource = null);
    const p = this.renderer.renderTarget.getRenderTarget(t);
    this.renderer.renderTarget.bind(t, !!l),
      t instanceof w
        ? ((x[0] = t.frame.width), (x[1] = t.frame.height))
        : ((x[0] = p.width), (x[1] = p.height)),
      (x[2] = p.isRoot ? -1 : 1),
      this._filterGlobalUniforms.update();
  }
  _findFilterResolution(e) {
    let t = this._filterStackIndex - 1;
    for (; t > 0 && this._filterStack[t].skip; ) --t;
    return t > 0 && this._filterStack[t].inputTexture
      ? this._filterStack[t].inputTexture.source._resolution
      : e;
  }
  _findPreviousFilterOffset() {
    let e = 0,
      t = 0,
      r = this._filterStackIndex;
    for (; r > 0; ) {
      r--;
      const s = this._filterStack[r];
      if (!s.skip) {
        (e = s.bounds.minX), (t = s.bounds.minY);
        break;
      }
    }
    return { x: e, y: t };
  }
  _calculateFilterArea(e, t) {
    if (
      (e.renderables
        ? kt(e.renderables, t)
        : e.filterEffect.filterArea
          ? (t.clear(),
            t.addRect(e.filterEffect.filterArea),
            t.applyMatrix(e.container.worldTransform))
          : e.container.getFastGlobalBounds(!0, t),
      e.container)
    ) {
      const s = (e.container.renderGroup || e.container.parentRenderGroup)
        .cacheToLocalTransform;
      s && t.applyMatrix(s);
    }
  }
  _applyFiltersToTexture(e, t) {
    const r = e.inputTexture,
      s = e.bounds,
      i = e.filters;
    if (
      (this._globalFilterBindGroup.setResource(r.source.style, 2),
      this._globalFilterBindGroup.setResource(e.backTexture.source, 3),
      i.length === 1)
    )
      i[0].apply(this, r, e.outputRenderSurface, t);
    else {
      let a = e.inputTexture;
      const o = C.getOptimalTexture(
        s.width,
        s.height,
        a.source._resolution,
        !1,
      );
      let l = o,
        u = 0;
      for (u = 0; u < i.length - 1; ++u) {
        i[u].apply(this, a, l, !0);
        const d = a;
        (a = l), (l = d);
      }
      i[u].apply(this, a, e.outputRenderSurface, t), C.returnTexture(o);
    }
  }
  _calculateFilterBounds(e, t, r, s, i) {
    var x;
    const a = this.renderer,
      o = e.bounds,
      l = e.filters;
    let u = 1 / 0,
      c = 0,
      d = !0,
      h = !1,
      f = !1,
      b = !0;
    for (let g = 0; g < l.length; g++) {
      const p = l[g];
      if (
        ((u = Math.min(u, p.resolution === "inherit" ? s : p.resolution)),
        (c += p.padding),
        p.antialias === "off"
          ? (d = !1)
          : p.antialias === "inherit" && d && (d = r),
        p.clipToViewport || (b = !1),
        !(p.compatibleRenderers & a.type))
      ) {
        f = !1;
        break;
      }
      if (
        p.blendRequired &&
        !(((x = a.backBuffer) == null ? void 0 : x.useBackBuffer) ?? !0)
      ) {
        O(
          "Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options.",
        ),
          (f = !1);
        break;
      }
      (f = p.enabled || f), h || (h = p.blendRequired);
    }
    if (!f) {
      e.skip = !0;
      return;
    }
    if (
      (b && o.fitBounds(0, t.width / s, 0, t.height / s),
      o
        .scale(u)
        .ceil()
        .scale(1 / u)
        .pad((c | 0) * i),
      !o.isPositive)
    ) {
      e.skip = !0;
      return;
    }
    (e.antialias = d), (e.resolution = u), (e.blendRequired = h);
  }
  _popFilterData() {
    return this._filterStackIndex--, this._filterStack[this._filterStackIndex];
  }
  _getPreviousFilterData() {
    let e,
      t = this._filterStackIndex - 1;
    for (; t > 1 && (t--, (e = this._filterStack[t]), !!e.skip); );
    return e;
  }
  _pushFilterData() {
    let e = this._filterStack[this._filterStackIndex];
    return (
      e || (e = this._filterStack[this._filterStackIndex] = new zt()),
      this._filterStackIndex++,
      e
    );
  }
}
We.extension = { type: [m.WebGLSystem, m.WebGPUSystem], name: "filter" };
const Oe = class Ie extends we {
  constructor(...e) {
    let t = e[0] ?? {};
    t instanceof Float32Array &&
      (T(P, "use new MeshGeometry({ positions, uvs, indices }) instead"),
      (t = { positions: t, uvs: e[1], indices: e[2] })),
      (t = { ...Ie.defaultOptions, ...t });
    const r = t.positions || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    let s = t.uvs;
    s ||
      (t.positions
        ? (s = new Float32Array(r.length))
        : (s = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])));
    const i = t.indices || new Uint32Array([0, 1, 2, 0, 2, 3]),
      a = t.shrinkBuffersToFit,
      o = new q({
        data: r,
        label: "attribute-mesh-positions",
        shrinkToFit: a,
        usage: G.VERTEX | G.COPY_DST,
      }),
      l = new q({
        data: s,
        label: "attribute-mesh-uvs",
        shrinkToFit: a,
        usage: G.VERTEX | G.COPY_DST,
      }),
      u = new q({
        data: i,
        label: "index-mesh-buffer",
        shrinkToFit: a,
        usage: G.INDEX | G.COPY_DST,
      });
    super({
      attributes: {
        aPosition: { buffer: o, format: "float32x2", stride: 2 * 4, offset: 0 },
        aUV: { buffer: l, format: "float32x2", stride: 2 * 4, offset: 0 },
      },
      indexBuffer: u,
      topology: t.topology,
    }),
      (this.batchMode = "auto");
  }
  get positions() {
    return this.attributes.aPosition.buffer.data;
  }
  set positions(e) {
    this.attributes.aPosition.buffer.data = e;
  }
  get uvs() {
    return this.attributes.aUV.buffer.data;
  }
  set uvs(e) {
    this.attributes.aUV.buffer.data = e;
  }
  get indices() {
    return this.indexBuffer.data;
  }
  set indices(e) {
    this.indexBuffer.data = e;
  }
};
Oe.defaultOptions = { topology: "triangle-list", shrinkBuffersToFit: !1 };
const ne = Oe;
function Dt(n) {
  const e = n._stroke,
    t = n._fill,
    s = [
      `div { ${[`color: ${U.shared.setValue(t.color).toHex()}`, `font-size: ${n.fontSize}px`, `font-family: ${n.fontFamily}`, `font-weight: ${n.fontWeight}`, `font-style: ${n.fontStyle}`, `font-variant: ${n.fontVariant}`, `letter-spacing: ${n.letterSpacing}px`, `text-align: ${n.align}`, `padding: ${n.padding}px`, `white-space: ${n.whiteSpace === "pre" && n.wordWrap ? "pre-wrap" : n.whiteSpace}`, ...(n.lineHeight ? [`line-height: ${n.lineHeight}px`] : []), ...(n.wordWrap ? [`word-wrap: ${n.breakWords ? "break-all" : "break-word"}`, `max-width: ${n.wordWrapWidth}px`] : []), ...(e ? [Ee(e)] : []), ...(n.dropShadow ? [Le(n.dropShadow)] : []), ...n.cssOverrides].join(";")} }`,
    ];
  return Wt(n.tagStyles, s), s.join(" ");
}
function Le(n) {
  const e = U.shared.setValue(n.color).setAlpha(n.alpha).toHexa(),
    t = Math.round(Math.cos(n.angle) * n.distance),
    r = Math.round(Math.sin(n.angle) * n.distance),
    s = `${t}px ${r}px`;
  return n.blur > 0
    ? `text-shadow: ${s} ${n.blur}px ${e}`
    : `text-shadow: ${s} ${e}`;
}
function Ee(n) {
  return [
    `-webkit-text-stroke-width: ${n.width}px`,
    `-webkit-text-stroke-color: ${U.shared.setValue(n.color).toHex()}`,
    `text-stroke-width: ${n.width}px`,
    `text-stroke-color: ${U.shared.setValue(n.color).toHex()}`,
    "paint-order: stroke",
  ].join(";");
}
const fe = {
    fontSize: "font-size: {{VALUE}}px",
    fontFamily: "font-family: {{VALUE}}",
    fontWeight: "font-weight: {{VALUE}}",
    fontStyle: "font-style: {{VALUE}}",
    fontVariant: "font-variant: {{VALUE}}",
    letterSpacing: "letter-spacing: {{VALUE}}px",
    align: "text-align: {{VALUE}}",
    padding: "padding: {{VALUE}}px",
    whiteSpace: "white-space: {{VALUE}}",
    lineHeight: "line-height: {{VALUE}}px",
    wordWrapWidth: "max-width: {{VALUE}}px",
  },
  pe = {
    fill: (n) => `color: ${U.shared.setValue(n).toHex()}`,
    breakWords: (n) => `word-wrap: ${n ? "break-all" : "break-word"}`,
    stroke: Ee,
    dropShadow: Le,
  };
function Wt(n, e) {
  for (const t in n) {
    const r = n[t],
      s = [];
    for (const i in r)
      pe[i]
        ? s.push(pe[i](r[i]))
        : fe[i] && s.push(fe[i].replace("{{VALUE}}", r[i]));
    e.push(`${t} { ${s.join(";")} }`);
  }
}
class ae extends k {
  constructor(e = {}) {
    super(e),
      (this._cssOverrides = []),
      (this.cssOverrides = e.cssOverrides ?? []),
      (this.tagStyles = e.tagStyles ?? {});
  }
  set cssOverrides(e) {
    (this._cssOverrides = e instanceof Array ? e : [e]), this.update();
  }
  get cssOverrides() {
    return this._cssOverrides;
  }
  update() {
    (this._cssStyle = null), super.update();
  }
  clone() {
    return new ae({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this.dropShadow ? { ...this.dropShadow } : null,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth,
      cssOverrides: this.cssOverrides,
      tagStyles: { ...this.tagStyles },
    });
  }
  get cssStyle() {
    return this._cssStyle || (this._cssStyle = Dt(this)), this._cssStyle;
  }
  addOverride(...e) {
    const t = e.filter((r) => !this.cssOverrides.includes(r));
    t.length > 0 && (this.cssOverrides.push(...t), this.update());
  }
  removeOverride(...e) {
    const t = e.filter((r) => this.cssOverrides.includes(r));
    t.length > 0 &&
      ((this.cssOverrides = this.cssOverrides.filter((r) => !t.includes(r))),
      this.update());
  }
  set fill(e) {
    typeof e != "string" &&
      typeof e != "number" &&
      O("[HTMLTextStyle] only color fill is not supported by HTMLText"),
      (super.fill = e);
  }
  set stroke(e) {
    e &&
      typeof e != "string" &&
      typeof e != "number" &&
      O("[HTMLTextStyle] only color stroke is not supported by HTMLText"),
      (super.stroke = e);
  }
}
const ge = "http://www.w3.org/2000/svg",
  me = "http://www.w3.org/1999/xhtml";
class He {
  constructor() {
    (this.svgRoot = document.createElementNS(ge, "svg")),
      (this.foreignObject = document.createElementNS(ge, "foreignObject")),
      (this.domElement = document.createElementNS(me, "div")),
      (this.styleElement = document.createElementNS(me, "style")),
      (this.image = new Image());
    const {
      foreignObject: e,
      svgRoot: t,
      styleElement: r,
      domElement: s,
    } = this;
    e.setAttribute("width", "10000"),
      e.setAttribute("height", "10000"),
      (e.style.overflow = "hidden"),
      t.appendChild(e),
      e.appendChild(r),
      e.appendChild(s);
  }
}
let xe;
function Ot(n, e, t, r) {
  r || (r = xe || (xe = new He()));
  const { domElement: s, styleElement: i, svgRoot: a } = r;
  (s.innerHTML = `<style>${e.cssStyle};</style><div style='padding:0'>${n}</div>`),
    s.setAttribute(
      "style",
      "transform-origin: top left; display: inline-block",
    ),
    t && (i.textContent = t),
    document.body.appendChild(a);
  const o = s.getBoundingClientRect();
  a.remove();
  const l = e.padding * 2;
  return { width: o.width - l, height: o.height - l };
}
class It {
  constructor() {
    (this.batches = []), (this.batched = !1);
  }
  destroy() {
    this.batches.forEach((e) => {
      Y.return(e);
    }),
      (this.batches.length = 0);
  }
}
class Ve {
  constructor(e, t) {
    (this.state = $.for2d()),
      (this.renderer = e),
      (this._adaptor = t),
      this.renderer.runners.contextChange.add(this);
  }
  contextChange() {
    this._adaptor.contextChange(this.renderer);
  }
  validateRenderable(e) {
    const t = e.context,
      r = !!e._gpuData,
      s = this.renderer.graphicsContext.updateGpuContext(t);
    return !!(s.isBatchable || r !== s.isBatchable);
  }
  addRenderable(e, t) {
    const r = this.renderer.graphicsContext.updateGpuContext(e.context);
    e.didViewUpdate && this._rebuild(e),
      r.isBatchable
        ? this._addToBatcher(e, t)
        : (this.renderer.renderPipes.batch.break(t), t.add(e));
  }
  updateRenderable(e) {
    const r = this._getGpuDataForRenderable(e).batches;
    for (let s = 0; s < r.length; s++) {
      const i = r[s];
      i._batcher.updateElement(i);
    }
  }
  execute(e) {
    if (!e.isRenderable) return;
    const t = this.renderer,
      r = e.context;
    if (!t.graphicsContext.getGpuContext(r).batches.length) return;
    const i = r.customShader || this._adaptor.shader;
    this.state.blendMode = e.groupBlendMode;
    const a = i.resources.localUniforms.uniforms;
    (a.uTransformMatrix = e.groupTransform),
      (a.uRound = t._roundPixels | e._roundPixels),
      X(e.groupColorAlpha, a.uColor, 0),
      this._adaptor.execute(this, e);
  }
  _rebuild(e) {
    const t = this._getGpuDataForRenderable(e),
      r = this.renderer.graphicsContext.updateGpuContext(e.context);
    t.destroy(), r.isBatchable && this._updateBatchesForRenderable(e, t);
  }
  _addToBatcher(e, t) {
    const r = this.renderer.renderPipes.batch,
      s = this._getGpuDataForRenderable(e).batches;
    for (let i = 0; i < s.length; i++) {
      const a = s[i];
      r.addToBatch(a, t);
    }
  }
  _getGpuDataForRenderable(e) {
    return e._gpuData[this.renderer.uid] || this._initGpuDataForRenderable(e);
  }
  _initGpuDataForRenderable(e) {
    const t = new It();
    return (e._gpuData[this.renderer.uid] = t), t;
  }
  _updateBatchesForRenderable(e, t) {
    const r = e.context,
      s = this.renderer.graphicsContext.getGpuContext(r),
      i = this.renderer._roundPixels | e._roundPixels;
    t.batches = s.batches.map((a) => {
      const o = Y.get(ht);
      return a.copyTo(o), (o.renderable = e), (o.roundPixels = i), o;
    });
  }
  destroy() {
    (this.renderer = null),
      this._adaptor.destroy(),
      (this._adaptor = null),
      (this.state = null);
  }
}
Ve.extension = {
  type: [m.WebGLPipes, m.WebGPUPipes, m.CanvasPipes],
  name: "graphics",
};
const Ye = class $e extends ne {
  constructor(...e) {
    super({});
    let t = e[0] ?? {};
    typeof t == "number" &&
      (T(
        P,
        "PlaneGeometry constructor changed please use { width, height, verticesX, verticesY } instead",
      ),
      (t = { width: t, height: e[1], verticesX: e[2], verticesY: e[3] })),
      this.build(t);
  }
  build(e) {
    (e = { ...$e.defaultOptions, ...e }),
      (this.verticesX = this.verticesX ?? e.verticesX),
      (this.verticesY = this.verticesY ?? e.verticesY),
      (this.width = this.width ?? e.width),
      (this.height = this.height ?? e.height);
    const t = this.verticesX * this.verticesY,
      r = [],
      s = [],
      i = [],
      a = this.verticesX - 1,
      o = this.verticesY - 1,
      l = this.width / a,
      u = this.height / o;
    for (let d = 0; d < t; d++) {
      const h = d % this.verticesX,
        f = (d / this.verticesX) | 0;
      r.push(h * l, f * u), s.push(h / a, f / o);
    }
    const c = a * o;
    for (let d = 0; d < c; d++) {
      const h = d % a,
        f = (d / a) | 0,
        b = f * this.verticesX + h,
        x = f * this.verticesX + h + 1,
        g = (f + 1) * this.verticesX + h,
        p = (f + 1) * this.verticesX + h + 1;
      i.push(b, x, g, x, p, g);
    }
    (this.buffers[0].data = new Float32Array(r)),
      (this.buffers[1].data = new Float32Array(s)),
      (this.indexBuffer.data = new Uint32Array(i)),
      this.buffers[0].update(),
      this.buffers[1].update(),
      this.indexBuffer.update();
  }
};
Ye.defaultOptions = { width: 100, height: 100, verticesX: 10, verticesY: 10 };
const Lt = Ye;
class oe {
  constructor() {
    (this.batcherName = "default"),
      (this.packAsQuad = !1),
      (this.indexOffset = 0),
      (this.attributeOffset = 0),
      (this.roundPixels = 0),
      (this._batcher = null),
      (this._batch = null),
      (this._textureMatrixUpdateId = -1),
      (this._uvUpdateId = -1);
  }
  get blendMode() {
    return this.renderable.groupBlendMode;
  }
  get topology() {
    return this._topology || this.geometry.topology;
  }
  set topology(e) {
    this._topology = e;
  }
  reset() {
    (this.renderable = null),
      (this.texture = null),
      (this._batcher = null),
      (this._batch = null),
      (this.geometry = null),
      (this._uvUpdateId = -1),
      (this._textureMatrixUpdateId = -1);
  }
  setTexture(e) {
    this.texture !== e &&
      ((this.texture = e), (this._textureMatrixUpdateId = -1));
  }
  get uvs() {
    const t = this.geometry.getBuffer("aUV"),
      r = t.data;
    let s = r;
    const i = this.texture.textureMatrix;
    return (
      i.isSimple ||
        ((s = this._transformedUvs),
        (this._textureMatrixUpdateId !== i._updateID ||
          this._uvUpdateId !== t._updateID) &&
          ((!s || s.length < r.length) &&
            (s = this._transformedUvs = new Float32Array(r.length)),
          (this._textureMatrixUpdateId = i._updateID),
          (this._uvUpdateId = t._updateID),
          i.multiplyUvs(r, s))),
      s
    );
  }
  get positions() {
    return this.geometry.positions;
  }
  get indices() {
    return this.geometry.indices;
  }
  get color() {
    return this.renderable.groupColorAlpha;
  }
  get groupTransform() {
    return this.renderable.groupTransform;
  }
  get attributeSize() {
    return this.geometry.positions.length / 2;
  }
  get indexSize() {
    return this.geometry.indices.length;
  }
}
class _e {
  destroy() {}
}
class Xe {
  constructor(e, t) {
    (this.localUniforms = new A({
      uTransformMatrix: { value: new F(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uRound: { value: 0, type: "f32" },
    })),
      (this.localUniformsBindGroup = new Te({ 0: this.localUniforms })),
      (this.renderer = e),
      (this._adaptor = t),
      this._adaptor.init();
  }
  validateRenderable(e) {
    const t = this._getMeshData(e),
      r = t.batched,
      s = e.batched;
    if (((t.batched = s), r !== s)) return !0;
    if (s) {
      const i = e._geometry;
      if (
        i.indices.length !== t.indexSize ||
        i.positions.length !== t.vertexSize
      )
        return (
          (t.indexSize = i.indices.length),
          (t.vertexSize = i.positions.length),
          !0
        );
      const a = this._getBatchableMesh(e);
      return (
        a.texture.uid !== e._texture.uid && (a._textureMatrixUpdateId = -1),
        !a._batcher.checkAndUpdateTexture(a, e._texture)
      );
    }
    return !1;
  }
  addRenderable(e, t) {
    const r = this.renderer.renderPipes.batch,
      { batched: s } = this._getMeshData(e);
    if (s) {
      const i = this._getBatchableMesh(e);
      i.setTexture(e._texture), (i.geometry = e._geometry), r.addToBatch(i, t);
    } else r.break(t), t.add(e);
  }
  updateRenderable(e) {
    if (e.batched) {
      const t = this._getBatchableMesh(e);
      t.setTexture(e._texture),
        (t.geometry = e._geometry),
        t._batcher.updateElement(t);
    }
  }
  execute(e) {
    if (!e.isRenderable) return;
    e.state.blendMode = se(e.groupBlendMode, e.texture._source);
    const t = this.localUniforms;
    (t.uniforms.uTransformMatrix = e.groupTransform),
      (t.uniforms.uRound = this.renderer._roundPixels | e._roundPixels),
      t.update(),
      X(e.groupColorAlpha, t.uniforms.uColor, 0),
      this._adaptor.execute(this, e);
  }
  _getMeshData(e) {
    var t, r;
    return (
      (t = e._gpuData)[(r = this.renderer.uid)] || (t[r] = new _e()),
      e._gpuData[this.renderer.uid].meshData || this._initMeshData(e)
    );
  }
  _initMeshData(e) {
    var t, r;
    return (
      (e._gpuData[this.renderer.uid].meshData = {
        batched: e.batched,
        indexSize: (t = e._geometry.indices) == null ? void 0 : t.length,
        vertexSize: (r = e._geometry.positions) == null ? void 0 : r.length,
      }),
      e._gpuData[this.renderer.uid].meshData
    );
  }
  _getBatchableMesh(e) {
    var t, r;
    return (
      (t = e._gpuData)[(r = this.renderer.uid)] || (t[r] = new _e()),
      e._gpuData[this.renderer.uid].batchableMesh || this._initBatchableMesh(e)
    );
  }
  _initBatchableMesh(e) {
    const t = new oe();
    return (
      (t.renderable = e),
      t.setTexture(e._texture),
      (t.transform = e.groupTransform),
      (t.roundPixels = this.renderer._roundPixels | e._roundPixels),
      (e._gpuData[this.renderer.uid].batchableMesh = t),
      t
    );
  }
  destroy() {
    (this.localUniforms = null),
      (this.localUniformsBindGroup = null),
      this._adaptor.destroy(),
      (this._adaptor = null),
      (this.renderer = null);
  }
}
Xe.extension = {
  type: [m.WebGLPipes, m.WebGPUPipes, m.CanvasPipes],
  name: "mesh",
};
class Et {
  execute(e, t) {
    const r = e.state,
      s = e.renderer,
      i = t.shader || e.defaultShader;
    (i.resources.uTexture = t.texture._source),
      (i.resources.uniforms = e.localUniforms);
    const a = s.gl,
      o = e.getBuffers(t);
    s.shader.bind(i), s.state.set(r), s.geometry.bind(o.geometry, i.glProgram);
    const u =
      o.geometry.indexBuffer.data.BYTES_PER_ELEMENT === 2
        ? a.UNSIGNED_SHORT
        : a.UNSIGNED_INT;
    a.drawElements(a.TRIANGLES, t.particleChildren.length * 6, u, 0);
  }
}
class Ht {
  execute(e, t) {
    const r = e.renderer,
      s = t.shader || e.defaultShader;
    (s.groups[0] = r.renderPipes.uniformBatch.getUniformBindGroup(
      e.localUniforms,
      !0,
    )),
      (s.groups[1] = r.texture.getTextureBindGroup(t.texture));
    const i = e.state,
      a = e.getBuffers(t);
    r.encoder.draw({
      geometry: a.geometry,
      shader: t.shader || e.defaultShader,
      state: i,
      size: t.particleChildren.length * 6,
    });
  }
}
var Vt = `varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,
  Yt = `attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,
  be = `
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;
class $t extends ie {
  constructor() {
    const e = ft.from({ vertex: Yt, fragment: Vt }),
      t = pt.from({
        fragment: { source: be, entryPoint: "mainFragment" },
        vertex: { source: be, entryPoint: "mainVertex" },
      });
    super({
      glProgram: e,
      gpuProgram: t,
      resources: {
        uTexture: w.WHITE.source,
        uSampler: new W({}),
        uniforms: {
          uTranslationMatrix: { value: new F(), type: "mat3x3<f32>" },
          uColor: { value: new U(16777215), type: "vec4<f32>" },
          uRound: { value: 1, type: "f32" },
          uResolution: { value: [0, 0], type: "vec2<f32>" },
        },
      },
    });
  }
}
class je {
  constructor(e, t) {
    (this.state = $.for2d()),
      (this.localUniforms = new A({
        uTranslationMatrix: { value: new F(), type: "mat3x3<f32>" },
        uColor: { value: new Float32Array(4), type: "vec4<f32>" },
        uRound: { value: 1, type: "f32" },
        uResolution: { value: [0, 0], type: "vec2<f32>" },
      })),
      (this.renderer = e),
      (this.adaptor = t),
      (this.defaultShader = new $t()),
      (this.state = $.for2d());
  }
  validateRenderable(e) {
    return !1;
  }
  addRenderable(e, t) {
    this.renderer.renderPipes.batch.break(t), t.add(e);
  }
  getBuffers(e) {
    return e._gpuData[this.renderer.uid] || this._initBuffer(e);
  }
  _initBuffer(e) {
    return (
      (e._gpuData[this.renderer.uid] = new gt({
        size: e.particleChildren.length,
        properties: e._properties,
      })),
      e._gpuData[this.renderer.uid]
    );
  }
  updateRenderable(e) {}
  execute(e) {
    const t = e.particleChildren;
    if (t.length === 0) return;
    const r = this.renderer,
      s = this.getBuffers(e);
    e.texture || (e.texture = t[0].texture);
    const i = this.state;
    s.update(t, e._childrenDirty),
      (e._childrenDirty = !1),
      (i.blendMode = se(e.blendMode, e.texture._source));
    const a = this.localUniforms.uniforms,
      o = a.uTranslationMatrix;
    e.worldTransform.copyTo(o),
      o.prepend(r.globalUniforms.globalUniformData.projectionMatrix),
      (a.uResolution = r.globalUniforms.globalUniformData.resolution),
      (a.uRound = r._roundPixels | e._roundPixels),
      X(e.groupColorAlpha, a.uColor, 0),
      this.adaptor.execute(this, e);
  }
  destroy() {
    this.defaultShader &&
      (this.defaultShader.destroy(), (this.defaultShader = null));
  }
}
class Ne extends je {
  constructor(e) {
    super(e, new Et());
  }
}
Ne.extension = { type: [m.WebGLPipes], name: "particle" };
class qe extends je {
  constructor(e) {
    super(e, new Ht());
  }
}
qe.extension = { type: [m.WebGPUPipes], name: "particle" };
const Ke = class Qe extends Lt {
  constructor(e = {}) {
    (e = { ...Qe.defaultOptions, ...e }),
      super({ width: e.width, height: e.height, verticesX: 4, verticesY: 4 }),
      this.update(e);
  }
  update(e) {
    var t, r;
    (this.width = e.width ?? this.width),
      (this.height = e.height ?? this.height),
      (this._originalWidth = e.originalWidth ?? this._originalWidth),
      (this._originalHeight = e.originalHeight ?? this._originalHeight),
      (this._leftWidth = e.leftWidth ?? this._leftWidth),
      (this._rightWidth = e.rightWidth ?? this._rightWidth),
      (this._topHeight = e.topHeight ?? this._topHeight),
      (this._bottomHeight = e.bottomHeight ?? this._bottomHeight),
      (this._anchorX = (t = e.anchor) == null ? void 0 : t.x),
      (this._anchorY = (r = e.anchor) == null ? void 0 : r.y),
      this.updateUvs(),
      this.updatePositions();
  }
  updatePositions() {
    const e = this.positions,
      {
        width: t,
        height: r,
        _leftWidth: s,
        _rightWidth: i,
        _topHeight: a,
        _bottomHeight: o,
        _anchorX: l,
        _anchorY: u,
      } = this,
      c = s + i,
      d = t > c ? 1 : t / c,
      h = a + o,
      f = r > h ? 1 : r / h,
      b = Math.min(d, f),
      x = l * t,
      g = u * r;
    (e[0] = e[8] = e[16] = e[24] = -x),
      (e[2] = e[10] = e[18] = e[26] = s * b - x),
      (e[4] = e[12] = e[20] = e[28] = t - i * b - x),
      (e[6] = e[14] = e[22] = e[30] = t - x),
      (e[1] = e[3] = e[5] = e[7] = -g),
      (e[9] = e[11] = e[13] = e[15] = a * b - g),
      (e[17] = e[19] = e[21] = e[23] = r - o * b - g),
      (e[25] = e[27] = e[29] = e[31] = r - g),
      this.getBuffer("aPosition").update();
  }
  updateUvs() {
    const e = this.uvs;
    (e[0] = e[8] = e[16] = e[24] = 0),
      (e[1] = e[3] = e[5] = e[7] = 0),
      (e[6] = e[14] = e[22] = e[30] = 1),
      (e[25] = e[27] = e[29] = e[31] = 1);
    const t = 1 / this._originalWidth,
      r = 1 / this._originalHeight;
    (e[2] = e[10] = e[18] = e[26] = t * this._leftWidth),
      (e[9] = e[11] = e[13] = e[15] = r * this._topHeight),
      (e[4] = e[12] = e[20] = e[28] = 1 - t * this._rightWidth),
      (e[17] = e[19] = e[21] = e[23] = 1 - r * this._bottomHeight),
      this.getBuffer("aUV").update();
  }
};
Ke.defaultOptions = {
  width: 100,
  height: 100,
  leftWidth: 10,
  topHeight: 10,
  rightWidth: 10,
  bottomHeight: 10,
  originalWidth: 100,
  originalHeight: 100,
};
const Xt = Ke;
class jt extends oe {
  constructor() {
    super(), (this.geometry = new Xt());
  }
  destroy() {
    this.geometry.destroy();
  }
}
class Je {
  constructor(e) {
    this._renderer = e;
  }
  addRenderable(e, t) {
    const r = this._getGpuSprite(e);
    e.didViewUpdate && this._updateBatchableSprite(e, r),
      this._renderer.renderPipes.batch.addToBatch(r, t);
  }
  updateRenderable(e) {
    const t = this._getGpuSprite(e);
    e.didViewUpdate && this._updateBatchableSprite(e, t),
      t._batcher.updateElement(t);
  }
  validateRenderable(e) {
    const t = this._getGpuSprite(e);
    return !t._batcher.checkAndUpdateTexture(t, e._texture);
  }
  _updateBatchableSprite(e, t) {
    t.geometry.update(e), t.setTexture(e._texture);
  }
  _getGpuSprite(e) {
    return e._gpuData[this._renderer.uid] || this._initGPUSprite(e);
  }
  _initGPUSprite(e) {
    const t = (e._gpuData[this._renderer.uid] = new jt()),
      r = t;
    return (
      (r.renderable = e),
      (r.transform = e.groupTransform),
      (r.texture = e._texture),
      (r.roundPixels = this._renderer._roundPixels | e._roundPixels),
      e.didViewUpdate || this._updateBatchableSprite(e, r),
      t
    );
  }
  destroy() {
    this._renderer = null;
  }
}
Je.extension = {
  type: [m.WebGLPipes, m.WebGPUPipes, m.CanvasPipes],
  name: "nineSliceSprite",
};
const Nt = {
    name: "tiling-bit",
    vertex: {
      header: `
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,
      main: `
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `,
    },
    fragment: {
      header: `
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,
      main: `

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `,
    },
  },
  qt = {
    name: "tiling-bit",
    vertex: {
      header: `
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,
      main: `
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `,
    },
    fragment: {
      header: `
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,
      main: `

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `,
    },
  };
let Q, J;
class Kt extends ie {
  constructor() {
    Q ?? (Q = Ce({ name: "tiling-sprite-shader", bits: [St, Nt, Pe] })),
      J ?? (J = Fe({ name: "tiling-sprite-shader", bits: [Ct, qt, Be] }));
    const e = new A({
      uMapCoord: { value: new F(), type: "mat3x3<f32>" },
      uClampFrame: { value: new Float32Array([0, 0, 1, 1]), type: "vec4<f32>" },
      uClampOffset: { value: new Float32Array([0, 0]), type: "vec2<f32>" },
      uTextureTransform: { value: new F(), type: "mat3x3<f32>" },
      uSizeAnchor: {
        value: new Float32Array([100, 100, 0.5, 0.5]),
        type: "vec4<f32>",
      },
    });
    super({
      glProgram: J,
      gpuProgram: Q,
      resources: {
        localUniforms: new A({
          uTransformMatrix: { value: new F(), type: "mat3x3<f32>" },
          uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
          uRound: { value: 0, type: "f32" },
        }),
        tilingUniforms: e,
        uTexture: w.EMPTY.source,
        uSampler: w.EMPTY.source.style,
      },
    });
  }
  updateUniforms(e, t, r, s, i, a) {
    const o = this.resources.tilingUniforms,
      l = a.width,
      u = a.height,
      c = a.textureMatrix,
      d = o.uniforms.uTextureTransform;
    d.set(
      (r.a * l) / e,
      (r.b * l) / t,
      (r.c * u) / e,
      (r.d * u) / t,
      r.tx / e,
      r.ty / t,
    ),
      d.invert(),
      (o.uniforms.uMapCoord = c.mapCoord),
      (o.uniforms.uClampFrame = c.uClampFrame),
      (o.uniforms.uClampOffset = c.uClampOffset),
      (o.uniforms.uTextureTransform = d),
      (o.uniforms.uSizeAnchor[0] = e),
      (o.uniforms.uSizeAnchor[1] = t),
      (o.uniforms.uSizeAnchor[2] = s),
      (o.uniforms.uSizeAnchor[3] = i),
      a &&
        ((this.resources.uTexture = a.source),
        (this.resources.uSampler = a.source.style));
  }
}
class Qt extends ne {
  constructor() {
    super({
      positions: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
    });
  }
}
function Jt(n, e) {
  const t = n.anchor.x,
    r = n.anchor.y;
  (e[0] = -t * n.width),
    (e[1] = -r * n.height),
    (e[2] = (1 - t) * n.width),
    (e[3] = -r * n.height),
    (e[4] = (1 - t) * n.width),
    (e[5] = (1 - r) * n.height),
    (e[6] = -t * n.width),
    (e[7] = (1 - r) * n.height);
}
function Zt(n, e, t, r) {
  let s = 0;
  const i = n.length / e,
    a = r.a,
    o = r.b,
    l = r.c,
    u = r.d,
    c = r.tx,
    d = r.ty;
  for (t *= e; s < i; ) {
    const h = n[t],
      f = n[t + 1];
    (n[t] = a * h + l * f + c), (n[t + 1] = o * h + u * f + d), (t += e), s++;
  }
}
function er(n, e) {
  const t = n.texture,
    r = t.frame.width,
    s = t.frame.height;
  let i = 0,
    a = 0;
  n.applyAnchorToTexture && ((i = n.anchor.x), (a = n.anchor.y)),
    (e[0] = e[6] = -i),
    (e[2] = e[4] = 1 - i),
    (e[1] = e[3] = -a),
    (e[5] = e[7] = 1 - a);
  const o = F.shared;
  o.copyFrom(n._tileTransform.matrix),
    (o.tx /= n.width),
    (o.ty /= n.height),
    o.invert(),
    o.scale(n.width / r, n.height / s),
    Zt(e, 2, 0, o);
}
const H = new Qt();
class tr {
  constructor() {
    (this.canBatch = !0),
      (this.geometry = new ne({
        indices: H.indices.slice(),
        positions: H.positions.slice(),
        uvs: H.uvs.slice(),
      }));
  }
  destroy() {
    var e;
    this.geometry.destroy(), (e = this.shader) == null || e.destroy();
  }
}
class Ze {
  constructor(e) {
    (this._state = $.default2d), (this._renderer = e);
  }
  validateRenderable(e) {
    const t = this._getTilingSpriteData(e),
      r = t.canBatch;
    this._updateCanBatch(e);
    const s = t.canBatch;
    if (s && s === r) {
      const { batchableMesh: i } = t;
      return !i._batcher.checkAndUpdateTexture(i, e.texture);
    }
    return r !== s;
  }
  addRenderable(e, t) {
    const r = this._renderer.renderPipes.batch;
    this._updateCanBatch(e);
    const s = this._getTilingSpriteData(e),
      { geometry: i, canBatch: a } = s;
    if (a) {
      s.batchableMesh || (s.batchableMesh = new oe());
      const o = s.batchableMesh;
      e.didViewUpdate &&
        (this._updateBatchableMesh(e),
        (o.geometry = i),
        (o.renderable = e),
        (o.transform = e.groupTransform),
        o.setTexture(e._texture)),
        (o.roundPixels = this._renderer._roundPixels | e._roundPixels),
        r.addToBatch(o, t);
    } else
      r.break(t),
        s.shader || (s.shader = new Kt()),
        this.updateRenderable(e),
        t.add(e);
  }
  execute(e) {
    const { shader: t } = this._getTilingSpriteData(e);
    t.groups[0] = this._renderer.globalUniforms.bindGroup;
    const r = t.resources.localUniforms.uniforms;
    (r.uTransformMatrix = e.groupTransform),
      (r.uRound = this._renderer._roundPixels | e._roundPixels),
      X(e.groupColorAlpha, r.uColor, 0),
      (this._state.blendMode = se(e.groupBlendMode, e.texture._source)),
      this._renderer.encoder.draw({
        geometry: H,
        shader: t,
        state: this._state,
      });
  }
  updateRenderable(e) {
    const t = this._getTilingSpriteData(e),
      { canBatch: r } = t;
    if (r) {
      const { batchableMesh: s } = t;
      e.didViewUpdate && this._updateBatchableMesh(e),
        s._batcher.updateElement(s);
    } else if (e.didViewUpdate) {
      const { shader: s } = t;
      s.updateUniforms(
        e.width,
        e.height,
        e._tileTransform.matrix,
        e.anchor.x,
        e.anchor.y,
        e.texture,
      );
    }
  }
  _getTilingSpriteData(e) {
    return e._gpuData[this._renderer.uid] || this._initTilingSpriteData(e);
  }
  _initTilingSpriteData(e) {
    const t = new tr();
    return (t.renderable = e), (e._gpuData[this._renderer.uid] = t), t;
  }
  _updateBatchableMesh(e) {
    const t = this._getTilingSpriteData(e),
      { geometry: r } = t,
      s = e.texture.source.style;
    s.addressMode !== "repeat" && ((s.addressMode = "repeat"), s.update()),
      er(e, r.uvs),
      Jt(e, r.positions);
  }
  destroy() {
    this._renderer = null;
  }
  _updateCanBatch(e) {
    const t = this._getTilingSpriteData(e),
      r = e.texture;
    let s = !0;
    return (
      this._renderer.type === re.WEBGL &&
        (s = this._renderer.context.supports.nonPowOf2wrapping),
      (t.canBatch = r.textureMatrix.isSimple && (s || r.source.isPowerOfTwo)),
      t.canBatch
    );
  }
}
Ze.extension = {
  type: [m.WebGLPipes, m.WebGPUPipes, m.CanvasPipes],
  name: "tilingSprite",
};
const rr = {
    name: "local-uniform-msdf-bit",
    vertex: {
      header: `
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,
      main: `
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,
      end: `
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `,
    },
    fragment: {
      header: `
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,
      main: `
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `,
    },
  },
  sr = {
    name: "local-uniform-msdf-bit",
    vertex: {
      header: `
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,
      main: `
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,
      end: `
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `,
    },
    fragment: {
      header: `
            uniform float uDistance;
         `,
      main: `
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `,
    },
  },
  ir = {
    name: "msdf-bit",
    fragment: {
      header: `
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `,
    },
  },
  nr = {
    name: "msdf-bit",
    fragment: {
      header: `
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `,
    },
  };
let Z, ee;
class ar extends ie {
  constructor(e) {
    const t = new A({
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uTransformMatrix: { value: new F(), type: "mat3x3<f32>" },
      uDistance: { value: 4, type: "f32" },
      uRound: { value: 0, type: "f32" },
    });
    Z ?? (Z = Ce({ name: "sdf-shader", bits: [mt, xt(e), rr, ir, Pe] })),
      ee ?? (ee = Fe({ name: "sdf-shader", bits: [_t, bt(e), sr, nr, Be] })),
      super({
        glProgram: ee,
        gpuProgram: Z,
        resources: { localUniforms: t, batchSamplers: yt(e) },
      });
  }
}
class or extends vt {
  destroy() {
    this.context.customShader && this.context.customShader.destroy(),
      super.destroy();
  }
}
class et {
  constructor(e) {
    (this._renderer = e),
      this._renderer.renderableGC.addManagedHash(this, "_gpuBitmapText");
  }
  validateRenderable(e) {
    const t = this._getGpuBitmapText(e);
    return (
      e._didTextUpdate && ((e._didTextUpdate = !1), this._updateContext(e, t)),
      this._renderer.renderPipes.graphics.validateRenderable(t)
    );
  }
  addRenderable(e, t) {
    const r = this._getGpuBitmapText(e);
    ye(e, r),
      e._didTextUpdate && ((e._didTextUpdate = !1), this._updateContext(e, r)),
      this._renderer.renderPipes.graphics.addRenderable(r, t),
      r.context.customShader && this._updateDistanceField(e);
  }
  updateRenderable(e) {
    const t = this._getGpuBitmapText(e);
    ye(e, t),
      this._renderer.renderPipes.graphics.updateRenderable(t),
      t.context.customShader && this._updateDistanceField(e);
  }
  _updateContext(e, t) {
    const { context: r } = t,
      s = Gt.getFont(e.text, e._style);
    r.clear(),
      s.distanceField.type !== "none" &&
        (r.customShader ||
          (r.customShader = new ar(
            this._renderer.limits.maxBatchableTextures,
          )));
    const i = D.graphemeSegmenter(e.text),
      a = e._style;
    let o = s.baseLineOffset;
    const l = ze(i, a, s, !0),
      u = a.padding,
      c = l.scale;
    let d = l.width,
      h = l.height + l.offsetY;
    a._stroke && ((d += a._stroke.width / c), (h += a._stroke.width / c)),
      r.translate(-e._anchor._x * d - u, -e._anchor._y * h - u).scale(c, c);
    const f = s.applyFillAsTint ? a._fill.color : 16777215;
    for (let b = 0; b < l.lines.length; b++) {
      const x = l.lines[b];
      for (let g = 0; g < x.charPositions.length; g++) {
        const p = x.chars[g],
          _ = s.chars[p];
        _ != null &&
          _.texture &&
          r.texture(
            _.texture,
            f || "black",
            Math.round(x.charPositions[g] + _.xOffset),
            Math.round(o + _.yOffset),
          );
      }
      o += s.lineHeight;
    }
  }
  _getGpuBitmapText(e) {
    return e._gpuData[this._renderer.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = new or();
    return (e._gpuData[this._renderer.uid] = t), this._updateContext(e, t), t;
  }
  _updateDistanceField(e) {
    const t = this._getGpuBitmapText(e).context,
      r = e._style.fontFamily,
      s = S.get(`${r}-bitmap`),
      { a: i, b: a, c: o, d: l } = e.groupTransform,
      u = Math.sqrt(i * i + a * a),
      c = Math.sqrt(o * o + l * l),
      d = (Math.abs(u) + Math.abs(c)) / 2,
      h = s.baseRenderedFontSize / e._style.fontSize,
      f = d * s.distanceField.range * (1 / h);
    t.customShader.resources.localUniforms.uniforms.uDistance = f;
  }
  destroy() {
    this._renderer = null;
  }
}
et.extension = {
  type: [m.WebGLPipes, m.WebGPUPipes, m.CanvasPipes],
  name: "bitmapText",
};
function ye(n, e) {
  (e.groupTransform = n.groupTransform),
    (e.groupColorAlpha = n.groupColorAlpha),
    (e.groupColor = n.groupColor),
    (e.groupBlendMode = n.groupBlendMode),
    (e.globalDisplayStatus = n.globalDisplayStatus),
    (e.groupTransform = n.groupTransform),
    (e.localDisplayStatus = n.localDisplayStatus),
    (e.groupAlpha = n.groupAlpha),
    (e._roundPixels = n._roundPixels);
}
class lr extends Ue {
  constructor(e) {
    super(),
      (this.generatingTexture = !1),
      (this._renderer = e),
      e.runners.resolutionChange.add(this);
  }
  resolutionChange() {
    const e = this.renderable;
    e._autoResolution && e.onViewUpdate();
  }
  destroy() {
    this._renderer.htmlText.returnTexturePromise(this.texturePromise),
      (this.texturePromise = null),
      (this._renderer = null);
  }
}
function te(n, e) {
  const { texture: t, bounds: r } = n,
    s = e._style._getFinalPadding();
  Tt(r, e._anchor, t);
  const i = e._anchor._x * s * 2,
    a = e._anchor._y * s * 2;
  (r.minX -= s - i), (r.minY -= s - a), (r.maxX -= s - i), (r.maxY -= s - a);
}
class tt {
  constructor(e) {
    this._renderer = e;
  }
  validateRenderable(e) {
    return e._didTextUpdate;
  }
  addRenderable(e, t) {
    const r = this._getGpuText(e);
    e._didTextUpdate &&
      (this._updateGpuText(e).catch((s) => {
        console.error(s);
      }),
      (e._didTextUpdate = !1),
      te(r, e)),
      this._renderer.renderPipes.batch.addToBatch(r, t);
  }
  updateRenderable(e) {
    const t = this._getGpuText(e);
    t._batcher.updateElement(t);
  }
  async _updateGpuText(e) {
    e._didTextUpdate = !1;
    const t = this._getGpuText(e);
    if (t.generatingTexture) return;
    t.texturePromise &&
      (this._renderer.htmlText.returnTexturePromise(t.texturePromise),
      (t.texturePromise = null)),
      (t.generatingTexture = !0),
      (e._resolution = e._autoResolution
        ? this._renderer.resolution
        : e.resolution);
    const r = this._renderer.htmlText.getTexturePromise(e);
    (t.texturePromise = r), (t.texture = await r);
    const s = e.renderGroup || e.parentRenderGroup;
    s && (s.structureDidChange = !0), (t.generatingTexture = !1), te(t, e);
  }
  _getGpuText(e) {
    return e._gpuData[this._renderer.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = new lr(this._renderer);
    return (
      (t.renderable = e),
      (t.transform = e.groupTransform),
      (t.texture = w.EMPTY),
      (t.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }),
      (t.roundPixels = this._renderer._roundPixels | e._roundPixels),
      (e._resolution = e._autoResolution
        ? this._renderer.resolution
        : e.resolution),
      (e._gpuData[this._renderer.uid] = t),
      t
    );
  }
  destroy() {
    this._renderer = null;
  }
}
tt.extension = {
  type: [m.WebGLPipes, m.WebGPUPipes, m.CanvasPipes],
  name: "htmlText",
};
function ur() {
  const { userAgent: n } = Me.get().getNavigator();
  return /^((?!chrome|android).)*safari/i.test(n);
}
const dr = new Se();
function rt(n, e, t, r) {
  const s = dr;
  (s.minX = 0),
    (s.minY = 0),
    (s.maxX = (n.width / r) | 0),
    (s.maxY = (n.height / r) | 0);
  const i = C.getOptimalTexture(s.width, s.height, r, !1);
  return (
    (i.source.uploadMethodId = "image"),
    (i.source.resource = n),
    (i.source.alphaMode = "premultiply-alpha-on-upload"),
    (i.frame.width = e / r),
    (i.frame.height = t / r),
    i.source.emit("update", i.source),
    i.updateUvs(),
    i
  );
}
function cr(n, e) {
  const t = e.fontFamily,
    r = [],
    s = {},
    i = /font-family:([^;"\s]+)/g,
    a = n.match(i);
  function o(l) {
    s[l] || (r.push(l), (s[l] = !0));
  }
  if (Array.isArray(t)) for (let l = 0; l < t.length; l++) o(t[l]);
  else o(t);
  a &&
    a.forEach((l) => {
      const u = l.split(":")[1].trim();
      o(u);
    });
  for (const l in e.tagStyles) {
    const u = e.tagStyles[l].fontFamily;
    o(u);
  }
  return r;
}
async function hr(n) {
  const t = await (await Me.get().fetch(n)).blob(),
    r = new FileReader();
  return await new Promise((i, a) => {
    (r.onloadend = () => i(r.result)), (r.onerror = a), r.readAsDataURL(t);
  });
}
async function ve(n, e) {
  const t = await hr(e);
  return `@font-face {
        font-family: "${n.fontFamily}";
        src: url('${t}');
        font-weight: ${n.fontWeight};
        font-style: ${n.fontStyle};
    }`;
}
const E = new Map();
async function fr(n, e, t) {
  const r = n
    .filter((s) => S.has(`${s}-and-url`))
    .map((s, i) => {
      if (!E.has(s)) {
        const { url: a } = S.get(`${s}-and-url`);
        i === 0
          ? E.set(
              s,
              ve(
                {
                  fontWeight: e.fontWeight,
                  fontStyle: e.fontStyle,
                  fontFamily: s,
                },
                a,
              ),
            )
          : E.set(
              s,
              ve(
                {
                  fontWeight: t.fontWeight,
                  fontStyle: t.fontStyle,
                  fontFamily: s,
                },
                a,
              ),
            );
      }
      return E.get(s);
    });
  return (await Promise.all(r)).join(`
`);
}
function pr(n, e, t, r, s) {
  const { domElement: i, styleElement: a, svgRoot: o } = s;
  (i.innerHTML = `<style>${e.cssStyle}</style><div style='padding:0;'>${n}</div>`),
    i.setAttribute(
      "style",
      `transform: scale(${t});transform-origin: top left; display: inline-block`,
    ),
    (a.textContent = r);
  const { width: l, height: u } = s.image;
  return (
    o.setAttribute("width", l.toString()),
    o.setAttribute("height", u.toString()),
    new XMLSerializer().serializeToString(o)
  );
}
function gr(n, e) {
  const t = V.getOptimalCanvasAndContext(n.width, n.height, e),
    { context: r } = t;
  return r.clearRect(0, 0, n.width, n.height), r.drawImage(n, 0, 0), t;
}
function mr(n, e, t) {
  return new Promise(async (r) => {
    t && (await new Promise((s) => setTimeout(s, 100))),
      (n.onload = () => {
        r();
      }),
      (n.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`),
      (n.crossOrigin = "anonymous");
  });
}
class st {
  constructor(e) {
    (this._renderer = e), (this._createCanvas = e.type === re.WEBGPU);
  }
  getTexture(e) {
    return this.getTexturePromise(e);
  }
  getTexturePromise(e) {
    return this._buildTexturePromise(e);
  }
  async _buildTexturePromise(e) {
    const { text: t, style: r, resolution: s, textureStyle: i } = e,
      a = Y.get(He),
      o = cr(t, r),
      l = await fr(o, r, ae.defaultTextStyle),
      u = Ot(t, r, l, a),
      c = Math.ceil(Math.ceil(Math.max(1, u.width) + r.padding * 2) * s),
      d = Math.ceil(Math.ceil(Math.max(1, u.height) + r.padding * 2) * s),
      h = a.image,
      f = 2;
    (h.width = (c | 0) + f), (h.height = (d | 0) + f);
    const b = pr(t, r, s, l, a);
    await mr(h, b, ur() && o.length > 0);
    const x = h;
    let g;
    this._createCanvas && (g = gr(h, s));
    const p = rt(g ? g.canvas : x, h.width - f, h.height - f, s);
    return (
      i && (p.source.style = i),
      this._createCanvas &&
        (this._renderer.texture.initSource(p.source),
        V.returnCanvasAndContext(g)),
      Y.return(a),
      p
    );
  }
  returnTexturePromise(e) {
    e.then((t) => {
      this._cleanUp(t);
    }).catch(() => {
      O("HTMLTextSystem: Failed to clean texture");
    });
  }
  _cleanUp(e) {
    C.returnTexture(e, !0),
      (e.source.resource = null),
      (e.source.uploadMethodId = "unknown");
  }
  destroy() {
    this._renderer = null;
  }
}
st.extension = {
  type: [m.WebGLSystem, m.WebGPUSystem, m.CanvasSystem],
  name: "htmlText",
};
class xr extends Ue {
  constructor(e) {
    super(), (this._renderer = e), e.runners.resolutionChange.add(this);
  }
  resolutionChange() {
    const e = this.renderable;
    e._autoResolution && e.onViewUpdate();
  }
  destroy() {
    this._renderer.canvasText.returnTexture(this.texture),
      (this._renderer = null);
  }
}
class it {
  constructor(e) {
    this._renderer = e;
  }
  validateRenderable(e) {
    return e._didTextUpdate;
  }
  addRenderable(e, t) {
    const r = this._getGpuText(e);
    e._didTextUpdate && (this._updateGpuText(e), (e._didTextUpdate = !1)),
      this._renderer.renderPipes.batch.addToBatch(r, t);
  }
  updateRenderable(e) {
    const t = this._getGpuText(e);
    t._batcher.updateElement(t);
  }
  _updateGpuText(e) {
    const t = this._getGpuText(e);
    t.texture && this._renderer.canvasText.returnTexture(t.texture),
      (e._resolution = e._autoResolution
        ? this._renderer.resolution
        : e.resolution),
      (t.texture = t.texture = this._renderer.canvasText.getTexture(e)),
      te(t, e);
  }
  _getGpuText(e) {
    return e._gpuData[this._renderer.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = new xr(this._renderer);
    return (
      (t.renderable = e),
      (t.transform = e.groupTransform),
      (t.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }),
      (t.roundPixels = this._renderer._roundPixels | e._roundPixels),
      (e._gpuData[this._renderer.uid] = t),
      t
    );
  }
  destroy() {
    this._renderer = null;
  }
}
it.extension = {
  type: [m.WebGLPipes, m.WebGPUPipes, m.CanvasPipes],
  name: "text",
};
class nt {
  constructor(e) {
    this._renderer = e;
  }
  getTexture(e, t, r, s) {
    typeof e == "string" &&
      (T(
        "8.0.0",
        "CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments",
      ),
      (e = { text: e, style: r, resolution: t })),
      e.style instanceof k || (e.style = new k(e.style)),
      e.textureStyle instanceof W || (e.textureStyle = new W(e.textureStyle)),
      typeof e.text != "string" && (e.text = e.text.toString());
    const { text: i, style: a, textureStyle: o } = e,
      l = e.resolution ?? this._renderer.resolution,
      { frame: u, canvasAndContext: c } = K.getCanvasAndContext({
        text: i,
        style: a,
        resolution: l,
      }),
      d = rt(c.canvas, u.width, u.height, l);
    if (
      (o && (d.source.style = o),
      a.trim && (u.pad(a.padding), d.frame.copyFrom(u), d.updateUvs()),
      a.filters)
    ) {
      const h = this._applyFilters(d, a.filters);
      return this.returnTexture(d), K.returnCanvasAndContext(c), h;
    }
    return (
      this._renderer.texture.initSource(d._source),
      K.returnCanvasAndContext(c),
      d
    );
  }
  returnTexture(e) {
    const t = e.source;
    (t.resource = null),
      (t.uploadMethodId = "unknown"),
      (t.alphaMode = "no-premultiply-alpha"),
      C.returnTexture(e, !0);
  }
  renderTextToCanvas() {
    T(
      "8.10.0",
      "CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead",
    );
  }
  _applyFilters(e, t) {
    const r = this._renderer.renderTarget.renderTarget,
      s = this._renderer.filter.generateFilteredTexture({
        texture: e,
        filters: t,
      });
    return this._renderer.renderTarget.bind(r, !1), s;
  }
  destroy() {
    this._renderer = null;
  }
}
nt.extension = {
  type: [m.WebGLSystem, m.WebGPUSystem, m.CanvasSystem],
  name: "canvasText",
};
v.add(Re);
v.add(Ge);
v.add(Ve);
v.add(wt);
v.add(Xe);
v.add(Ne);
v.add(qe);
v.add(nt);
v.add(it);
v.add(et);
v.add(st);
v.add(tt);
v.add(Ze);
v.add(Je);
v.add(We);
v.add(De);
//# sourceMappingURL=webworkerAll-BVxsgAfo.js.map
