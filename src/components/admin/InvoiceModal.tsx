import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Mail, Download, CheckCircle, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface InvoiceOrder {
  id: string;
  _id?: string;
  order_number: string;
  invoice_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_status: string;
  payment_method: string;
  payment_status: string;
  payment_details?: {
    transaction_id?: string;
    bkash_number?: string;
    paid_at?: string;
  };
  subtotal: number;
  discount?: number;
  shipping: number;
  total: number;
  shipping_address?: {
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  notes?: string | null;
  createdAt: string;
  invoice_sent_at?: string | null;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
  }>;
}

interface InvoiceModalProps {
  order: InvoiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onInvoiceSent?: () => void;
}

export function InvoiceModal({ order, isOpen, onClose, onInvoiceSent }: InvoiceModalProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  if (!order) return null;

  const invoiceNum = order.invoice_number || `INV-${order.order_number || order.id?.substring(0, 8)}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=850,height=900");
    if (!printWindow) {
      window.print();
      return;
    }

    const itemsHtml = (order.items || []).map((item, idx) => `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">${idx + 1}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 42px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0; flex-shrink: 0;" />` : ''}
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${item.name}</div>
              ${item.size || item.color ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">${item.size ? `Size: <strong>${item.size}</strong>` : ''}${item.size && item.color ? ' | ' : ''}${item.color ? `Color: <strong>${item.color}</strong>` : ''}</div>` : ''}
            </div>
          </div>
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center; color: #0f172a; font-weight: 600;">${item.quantity}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; color: #64748b;">$${item.price.toFixed(2)}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; color: #0f172a; font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice - ${invoiceNum} - ZIVARA</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #0f172a;
              background-color: #ffffff;
              padding: 30px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .invoice-card {
              max-width: 780px;
              margin: 0 auto;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 36px;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 24px;
              border-bottom: 3px solid #eab308;
              margin-bottom: 24px;
            }

            .brand-title {
              font-size: 28px;
              font-weight: 800;
              letter-spacing: 4px;
              color: #0f172a;
            }

            .brand-subtitle {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #ca8a04;
              margin-top: 2px;
            }

            .invoice-label {
              text-align: right;
            }

            .inv-title {
              font-size: 24px;
              font-weight: 800;
              letter-spacing: 1px;
              color: #0f172a;
            }

            .inv-num {
              font-size: 12px;
              font-family: monospace;
              color: #64748b;
              margin-top: 2px;
            }

            .badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              margin-top: 6px;
            }

            .badge-paid {
              background-color: #10b981;
              color: #ffffff;
            }

            .badge-unpaid {
              background-color: #f59e0b;
              color: #ffffff;
            }

            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
              padding-bottom: 24px;
              border-bottom: 1px solid #e2e8f0;
              margin-bottom: 24px;
            }

            .section-tag {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #94a3b8;
              margin-bottom: 6px;
            }

            .cust-name {
              font-size: 15px;
              font-weight: 700;
              color: #0f172a;
            }

            .cust-detail {
              font-size: 12px;
              color: #475569;
              margin-top: 2px;
              line-height: 1.4;
            }

            .order-meta-table {
              font-size: 12px;
              color: #475569;
            }

            .order-meta-table td {
              padding: 2px 0;
            }

            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
            }

            .items-table th {
              background-color: #f8fafc;
              padding: 10px 10px;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #64748b;
              border-bottom: 2px solid #e2e8f0;
              text-align: left;
            }

            .summary-grid {
              display: grid;
              grid-template-columns: 1.2fr 1fr;
              gap: 24px;
              padding-top: 12px;
            }

            .note-box {
              background-color: #fefce8;
              border: 1px dashed #ca8a04;
              border-radius: 8px;
              padding: 12px 16px;
              font-size: 11px;
              color: #713f12;
            }

            .totals-table {
              width: 100%;
              font-size: 13px;
            }

            .totals-table td {
              padding: 4px 0;
            }

            .grand-total-row td {
              border-top: 2px solid #0f172a;
              padding-top: 10px;
              font-size: 15px;
              font-weight: 800;
              color: #0f172a;
            }

            .footer {
              margin-top: 32px;
              padding-top: 16px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              line-height: 1.5;
            }

            @media print {
              body {
                padding: 0;
                background: none;
              }
              .invoice-card {
                border: none;
                padding: 0;
              }
              @page {
                size: auto;
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            
            <!-- Header -->
            <div class="header">
              <div>
                <div class="brand-title">ZIVARA</div>
                <div class="brand-subtitle">Wear The Future</div>
              </div>
              <div class="invoice-label">
                <div class="inv-title">INVOICE</div>
                <div class="inv-num">#${invoiceNum}</div>
                <div>
                  <span class="badge ${order.payment_status === 'paid' ? 'badge-paid' : 'badge-unpaid'}">
                    ${order.payment_status === 'paid' ? 'PAID' : 'UNPAID / COD'}
                  </span>
                </div>
              </div>
            </div>

            <!-- Customer & Order Meta -->
            <div class="info-grid">
              <div>
                <div class="section-tag">Billed To:</div>
                <div class="cust-name">${order.customer_name}</div>
                <div class="cust-detail"><strong>Email:</strong> ${order.customer_email}</div>
                <div class="cust-detail"><strong>Phone:</strong> ${order.customer_phone}</div>
                ${order.shipping_address?.address ? `
                  <div class="cust-detail" style="margin-top: 4px;">
                    <strong>Address:</strong> ${order.shipping_address.address}, ${order.shipping_address.city || ''} ${order.shipping_address.zip_code || ''}, ${order.shipping_address.country || 'Bangladesh'}
                  </div>
                ` : ''}
              </div>

              <div>
                <div class="section-tag">Invoice Details:</div>
                <table class="order-meta-table">
                  <tr>
                    <td><strong>Order Number:</strong></td>
                    <td style="text-align: right; color: #0f172a; font-weight: 600;">${order.order_number}</td>
                  </tr>
                  <tr>
                    <td><strong>Invoice Date:</strong></td>
                    <td style="text-align: right;">${orderDate}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Method:</strong></td>
                    <td style="text-align: right; text-transform: uppercase; font-weight: 600;">${order.payment_method || 'COD'}</td>
                  </tr>
                  ${order.payment_details?.transaction_id ? `
                    <tr>
                      <td><strong>Txn ID:</strong></td>
                      <td style="text-align: right; font-family: monospace; color: #ca8a04; font-weight: bold;">${order.payment_details.transaction_id}</td>
                    </tr>
                  ` : ''}
                </table>
              </div>
            </div>

            <!-- Items Table -->
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 30px;">#</th>
                  <th>Item & Description</th>
                  <th style="text-align: center; width: 60px;">Qty</th>
                  <th style="text-align: right; width: 100px;">Price</th>
                  <th style="text-align: right; width: 100px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Summary & Totals -->
            <div class="summary-grid">
              <div>
                <div class="note-box">
                  <strong>Thank you for choosing ZIVARA!</strong><br />
                  For sizing exchanges, fitting inquiries, or customer support, please contact <strong>support@zivara.fashion</strong>.
                </div>
                ${order.notes ? `
                  <div style="font-size: 11px; color: #64748b; margin-top: 8px; font-style: italic;">
                    <strong>Order Note:</strong> ${order.notes}
                  </div>
                ` : ''}
              </div>

              <div>
                <table class="totals-table">
                  <tr>
                    <td style="color: #64748b;">Subtotal:</td>
                    <td style="text-align: right; font-weight: 600;">$${(order.subtotal || order.total).toFixed(2)}</td>
                  </tr>
                  ${order.discount ? `
                    <tr>
                      <td style="color: #10b981;">Discount:</td>
                      <td style="text-align: right; color: #10b981; font-weight: 600;">-$${order.discount.toFixed(2)}</td>
                    </tr>
                  ` : ''}
                  <tr>
                    <td style="color: #64748b;">Shipping:</td>
                    <td style="text-align: right; font-weight: 600;">${(order.shipping || 0) === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</td>
                  </tr>
                  <tr class="grand-total-row">
                    <td>Total Bill:</td>
                    <td style="text-align: right;">
                      <div style="font-size: 18px; color: #0f172a;">$${order.total.toFixed(2)}</div>
                      <div style="font-size: 11px; font-weight: 500; color: #64748b;">(Approx. ৳${(order.total * 120).toLocaleString()})</div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <strong>ZIVARA Fashion Technologies Ltd.</strong> • House 42, Road 11, Banani, Dhaka, Bangladesh<br />
              BIN: 002918271-0101 • This is an authentic electronically generated tax invoice.
            </div>

          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      const token = localStorage.getItem("zivara_token");
      const orderId = order._id || order.id;

      const res = await fetch(`/api/orders/${orderId}/send-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send invoice email");
      }

      toast({
        title: "Invoice Email Dispatched! ✉️✨",
        description: `Official invoice #${invoiceNum} was successfully sent to ${order.customer_email}`,
      });

      if (onInvoiceSent) onInvoiceSent();
    } catch (err: any) {
      toast({
        title: "Email Dispatch Error",
        description: err.message || "Failed to send invoice email",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border border-border bg-card">
        <DialogHeader className="p-6 border-b border-border bg-muted/40 sticky top-0 z-20 backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <span>Official Customer Invoice</span>
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {invoiceNum}
                </Badge>
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Order #{order.order_number} • Placed on {orderDate}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / PDF
              </Button>

              <Button
                size="sm"
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="gap-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    Send Invoice Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Invoice Printable View */}
        <div className="p-6 md:p-10" ref={invoiceRef}>
          <div className="border border-border/80 rounded-xl p-6 md:p-8 bg-background shadow-sm space-y-6">
            
            {/* Top Brand Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-primary/60">
              <div>
                <h1 className="text-3xl font-extrabold tracking-[0.2em] text-foreground font-display">
                  ZIVARA
                </h1>
                <p className="text-xs font-semibold tracking-widest text-primary uppercase mt-0.5">
                  Wear The Future
                </p>
              </div>

              <div className="text-left sm:text-right">
                <h2 className="text-2xl font-black tracking-wider text-foreground">
                  INVOICE
                </h2>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  #{invoiceNum}
                </p>
                <div className="mt-2 flex sm:justify-end gap-1.5">
                  <Badge
                    className={`text-[10px] font-bold uppercase ${
                      order.payment_status === "paid"
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {order.payment_status === "paid" ? "PAID" : "UNPAID / COD"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {order.order_status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Customer & Order Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Bill To / Customer:
                </span>
                <p className="text-sm font-bold text-foreground mt-1">{order.customer_name}</p>
                <p className="text-muted-foreground mt-0.5">Email: {order.customer_email}</p>
                <p className="text-muted-foreground">Phone: {order.customer_phone}</p>
                {order.shipping_address?.address && (
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    <strong>Delivery Address:</strong> {order.shipping_address.address},{" "}
                    {order.shipping_address.city} {order.shipping_address.zip_code},{" "}
                    {order.shipping_address.country}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Invoice & Payment Info:
                </span>
                <p className="text-muted-foreground">
                  <strong>Order Number:</strong> {order.order_number}
                </p>
                <p className="text-muted-foreground">
                  <strong>Date:</strong> {orderDate}
                </p>
                <p className="text-muted-foreground">
                  <strong>Payment Method:</strong>{" "}
                  <span className="uppercase font-semibold text-foreground">
                    {order.payment_method || "Cash On Delivery"}
                  </span>
                </p>
                {order.payment_details?.transaction_id && (
                  <p className="text-primary font-mono font-semibold">
                    <strong>Txn ID:</strong> {order.payment_details.transaction_id}
                  </p>
                )}
                {order.invoice_sent_at && (
                  <p className="text-[11px] text-emerald-500 font-medium flex sm:justify-end items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Emailed on{" "}
                    {new Date(order.invoice_sent_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-border bg-muted/30">
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground uppercase">#</th>
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground uppercase">Item Description</th>
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground uppercase text-center">Qty</th>
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground uppercase text-right">Unit Price</th>
                    <th className="py-2.5 px-3 font-semibold text-muted-foreground uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 text-muted-foreground">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-9 h-9 object-cover rounded border border-border shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-foreground">{item.name}</p>
                            {(item.size || item.color) && (
                              <p className="text-[11px] text-muted-foreground">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && " | "}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-medium">{item.quantity}</td>
                      <td className="py-3 px-3 text-right text-muted-foreground">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-bold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="space-y-3">
                <div className="p-3.5 bg-muted/40 rounded-lg border border-border text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Thank you for shopping with ZIVARA!
                  </p>
                  <p className="text-[11px] mt-1 leading-relaxed">
                    For any support, sizing adjustments, or virtual fitting inquiries, reach out to <strong>support@zivara.fashion</strong>.
                  </p>
                </div>

                {order.notes && (
                  <p className="text-xs text-muted-foreground italic">
                    <strong>Customer Note:</strong> {order.notes}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 text-muted-foreground">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-foreground">
                    ${(order.subtotal || order.total).toFixed(2)}
                  </span>
                </div>

                {order.discount ? (
                  <div className="flex justify-between py-1 text-emerald-500 font-medium">
                    <span>Discount / Coupon:</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between py-1 text-muted-foreground">
                  <span>Shipping Delivery:</span>
                  <span className="font-semibold text-foreground">
                    {(order.shipping || 0) === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2.5 border-t-2 border-border text-sm">
                  <span className="font-bold text-foreground">Total Bill:</span>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      (Approx. ৳{(order.total * 120).toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-border text-center text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">
                ZIVARA Fashion Technologies Ltd.
              </p>
              <p>House 42, Road 11, Banani, Dhaka, Bangladesh • BIN: 002918271-0101</p>
              <p className="text-[10px] text-muted-foreground/70">
                This is an electronically generated official tax invoice.
              </p>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
