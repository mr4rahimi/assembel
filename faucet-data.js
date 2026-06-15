/* ===========================================================================
   مای مونتا — داده‌های پیکربندی شیر
   FINISHES: روکش‌ها / رنگ‌ها  (هر کدام ۴ تُن برای جلوه‌ی فلزی هم‌مرکز)
   SPOUTS:   مدل‌های علم (گردنه)   |   HANDLES: مدل‌های دسته (اهرم)
   هندسه روی صفحه‌ی مختصات viewBox = 0 0 420 600 طراحی شده.
   =========================================================================== */

const FINISHES = {
  chrome:   { name: 'کروم براق',        dark: '#6e767d', mid: '#b8bfc5', light: '#eff3f5', spec: '#ffffff', glossy: 1.00 },
  nickel:   { name: 'نیکل برس‌خورده',   dark: '#7c7b73', mid: '#a9a89e', light: '#d2d0c7', spec: '#ece9df', glossy: 0.42 },
  white:    { name: 'سفید مات',          dark: '#c4c5c6', mid: '#e2e3e4', light: '#f3f4f5', spec: '#ffffff', glossy: 0.22 },
  rose:     { name: 'رزگلد',             dark: '#a76a55', mid: '#d79c83', light: '#f0c5b2', spec: '#ffe8dd', glossy: 0.72 },
  copper:   { name: 'مسی برنزی',         dark: '#82481f', mid: '#b06a3e', light: '#d4915f', spec: '#f1c193', glossy: 0.66 },
  gunmetal: { name: 'استیل نوک‌مدادی',   dark: '#2a2e34', mid: '#494e56', light: '#6f757e', spec: '#9aa1aa', glossy: 0.55 },
  gold:     { name: 'طلایی',             dark: '#967a1e', mid: '#d2ad35', light: '#ecd178', spec: '#fff3bf', glossy: 0.82 },
  black:    { name: 'مشکی مات',          dark: '#141416', mid: '#28282b', light: '#3d3d41', spec: '#565659', glossy: 0.20 },
};

const FINISH_ORDER = ['chrome', 'nickel', 'white', 'rose', 'copper', 'gunmetal', 'gold', 'black'];

/* علم شیر — هر مدل: مسیر علم + مسیر پلاتور خروجی در نوک آن */
const SPOUTS = [
  {
    id: 'goose', name: 'گردنه‌قویی کلاسیک',
    spoutD: 'M210 300 L210 150 C210 100 175 84 132 84 C104 84 92 104 92 134 L92 170',
    spoutW: 34, aeratorD: 'M92 170 L92 198', aeratorW: 42,
    thumbVB: '60 64 180 250',
  },
  {
    id: 'square', name: 'قوس مربعی مدرن',
    spoutD: 'M210 300 L210 112 Q210 96 194 96 L108 96 Q92 96 92 112 L92 170',
    spoutW: 34, aeratorD: 'M92 170 L92 198', aeratorW: 42,
    thumbVB: '60 76 180 240',
  },
  {
    id: 'low', name: 'قوسی کوتاه',
    spoutD: 'M210 300 L210 232 C210 204 186 190 150 190 C128 190 116 200 110 214 L106 232',
    spoutW: 34, aeratorD: 'M106 233 L106 262', aeratorW: 42,
    thumbVB: '78 170 150 150',
  },
  {
    id: 'pro', name: 'بلند حرفه‌ای',
    spoutD: 'M210 300 L210 96 L150 96',
    spoutW: 30, aeratorD: 'M150 97 L150 128', aeratorW: 38,
    thumbVB: '120 76 130 250',
  },
];

/* دسته شیر — هر مدل: مجموعه‌ای از قطعات (توپی + اهرم) */
const HANDLES = [
  {
    id: 'paddle', name: 'اهرمی پهن',
    segments: [ { d: 'M236 354 L252 351', w: 30 }, { d: 'M240 355 Q272 347 304 335', w: 24 } ],
    thumbVB: '226 326 96 44',
  },
  {
    id: 'slim', name: 'اهرمی باریک',
    segments: [ { d: 'M236 355 L250 353', w: 26 }, { d: 'M242 356 L316 328', w: 13 } ],
    thumbVB: '226 320 104 48',
  },
  {
    id: 'knob', name: 'دکمه‌ای گرد',
    segments: [ { d: 'M236 352 L262 352', w: 28 }, { d: 'M268 352 L272 352', w: 48 } ],
    thumbVB: '230 324 76 56',
  },
  {
    id: 'classic', name: 'اهرم بلند خمیده',
    segments: [ { d: 'M236 356 L250 354', w: 28 }, { d: 'M242 356 Q274 350 302 322 Q312 312 318 300', w: 17 } ],
    thumbVB: '226 292 106 78',
  },
];

/* قطعات ثابت */
const BODY = { d: 'M210 298 L210 512', w: 52 };
const BASE = { d: 'M156 514 L264 514', w: 40 };

/* فهرست قطعات قابل سفارشی‌سازی (ترتیب نمایش در پنل) */
const PARTS = [
  { key: 'body',    name: 'تنه شیر',        hint: 'بدنه‌ی مرکزی',        hasModel: false },
  { key: 'spout',   name: 'علم شیر',        hint: 'گردنه و قوس',          hasModel: true,  models: SPOUTS },
  { key: 'handle',  name: 'دسته شیر',       hint: 'اهرم کنترل',           hasModel: true,  models: HANDLES },
  { key: 'base',    name: 'پایه شیر',       hint: 'فلنج اتصال',           hasModel: false },
  { key: 'aerator', name: 'پلاتور خروجی',   hint: 'سرشیر و افشانک',       hasModel: false },
];

window.MM = { FINISHES, FINISH_ORDER, SPOUTS, HANDLES, BODY, BASE, PARTS };
