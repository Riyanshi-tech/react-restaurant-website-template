import { Order } from '../types';
import { BillingSettings } from '../services/posService';
import { formatINR } from './utils';

export function calcBillTotals(order: Order, billing: BillingSettings) {
  const subtotal = order.total;
  const gstRate = Number(billing.gstPercent) || 0;
  const cgstRate = Number(billing.cgstPercent) || gstRate / 2;
  const sgstRate = Number(billing.sgstPercent) || gstRate / 2;
  const cgst = (subtotal * cgstRate) / 100;
  const sgst = (subtotal * sgstRate) / 100;
  const gst = cgst + sgst;
  return { subtotal, cgstRate, sgstRate, cgst, sgst, gst, grand: subtotal + gst };
}

export function billDetailsPath(order: Order) {
  const slug = order.orderNumber || order._id || order.id;
  return `/billdetails/${encodeURIComponent(String(slug))}`;
}

export function billDetailsUrl(order: Order) {
  return `${window.location.origin}${billDetailsPath(order)}`;
}

export function whatsappBillUrl(phone: string, countryCode: string, text: string) {
  let digits = phone.replace(/\D/g, '');
  const cc = (countryCode || '91').replace(/\D/g, '');
  if (digits.length === 10) digits = cc + digits;
  if (digits.startsWith('0') && digits.length === 11) digits = cc + digits.slice(1);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Open WhatsApp with link to public bill page */
export function sendBillWhatsApp(order: Order, billing: BillingSettings) {
  if (!order.guestPhone) throw new Error('No guest phone on this order');

  const { grand } = calcBillTotals(order, billing);
  const url = billDetailsUrl(order);
  const text = [
    `*${billing.restaurantName || 'Restaurant'}*`,
    `Bill: ${order.orderNumber}`,
    `Total (incl. GST): ${formatINR(grand)}`,
    '',
    'View your bill:',
    url
  ].join('\n');

  window.open(
    whatsappBillUrl(order.guestPhone, billing.whatsappCountryCode, text),
    '_blank',
    'noopener,noreferrer'
  );
}

const esc = (s: string) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Open thermal-receipt print dialog (80mm / small bill printer) */
export function printThermalBill(order: Order, billing: BillingSettings) {
  const { subtotal, cgstRate, sgstRate, cgst, sgst, grand } = calcBillTotals(order, billing);
  const table = typeof order.table === 'object' ? order.table : null;
  const when = order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');

  const itemRows = order.items
    .map((i) => {
      const name = esc(i.name).slice(0, 18);
      return `<tr>
        <td class="qty">${i.quantity}</td>
        <td class="name">${name}</td>
        <td class="amt">${formatINR(i.priceAtOrder * i.quantity)}</td>
      </tr>
      <tr class="unit"><td></td><td colspan="2">@ ${formatINR(i.priceAtOrder)}</td></tr>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Bill ${esc(order.orderNumber)}</title>
  <style>
    @page { size: 80mm auto; margin: 2mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Courier New", Courier, monospace;
      font-size: 11px;
      color: #000;
      background: #fff;
      width: 72mm;
      margin: 0 auto;
      padding: 4mm 2mm;
      line-height: 1.25;
    }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: 700; }
    .shop { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .muted { font-size: 10px; }
    .dash { border: none; border-top: 1px dashed #000; margin: 6px 0; }
    .solid { border: none; border-top: 1px solid #000; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; }
    td { vertical-align: top; padding: 1px 0; }
    td.qty { width: 14px; }
    td.name { width: auto; }
    td.amt { width: 72px; text-align: right; white-space: nowrap; }
    tr.unit td { font-size: 9px; padding-bottom: 3px; }
    .totals td { padding: 2px 0; }
    .grand td { font-size: 13px; font-weight: 700; padding-top: 4px; }
    .footer { margin-top: 8px; font-size: 10px; }
    @media print {
      body { width: 72mm; }
      html, body { background: #fff; }
    }
  </style>
</head>
<body>
  <div class="center shop">${esc(billing.restaurantName || 'Restaurant')}</div>
  ${billing.address ? `<div class="center muted">${esc(billing.address)}</div>` : ''}
  ${billing.phone ? `<div class="center muted">Ph: ${esc(billing.phone)}</div>` : ''}
  ${billing.gstin ? `<div class="center muted">GSTIN: ${esc(billing.gstin)}</div>` : ''}

  <hr class="dash" />

  <div><span class="bold">Bill:</span> ${esc(order.orderNumber)}</div>
  <div>${esc(when)}</div>
  ${table ? `<div><span class="bold">Table:</span> ${esc(table.name)}</div>` : ''}
  ${order.guestName ? `<div><span class="bold">Guest:</span> ${esc(order.guestName)}</div>` : ''}
  ${order.guestPhone ? `<div><span class="bold">Phone:</span> ${esc(order.guestPhone)}</div>` : ''}

  <hr class="dash" />

  <table>
    <thead>
      <tr class="bold">
        <td class="qty">#</td>
        <td class="name">Item</td>
        <td class="amt">Amt</td>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <hr class="dash" />

  <table class="totals">
    <tr><td>Subtotal</td><td class="right">${formatINR(subtotal)}</td></tr>
    ${cgstRate ? `<tr><td>CGST ${cgstRate}%</td><td class="right">${formatINR(cgst)}</td></tr>` : ''}
    ${sgstRate ? `<tr><td>SGST ${sgstRate}%</td><td class="right">${formatINR(sgst)}</td></tr>` : ''}
    <tr class="grand"><td>TOTAL</td><td class="right">${formatINR(grand)}</td></tr>
  </table>

  <hr class="solid" />

  <div class="center footer">${esc(billing.billFooter || 'Thank you! Visit again')}</div>
  <div class="center muted" style="margin-top:4px">*** CUSTOMER COPY ***</div>
</body>
</html>`;

  // ponytail: hidden iframe — no window.open (blocked after await / no gesture)
  let iframe = document.getElementById('thermal-bill-print') as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'thermal-bill-print';
    iframe.setAttribute('title', 'Bill print');
    iframe.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc || !iframe.contentWindow) throw new Error('Print frame unavailable');

  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow.focus();
  iframe.contentWindow.print();
}
