import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Printer, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Invoice() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error || 'Invoice not found'}</p>
            <Link to="/" className="text-indigo-600 hover:underline">Go back home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const items = order.OrderItems || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const distinctStores = new Set(items.map(item => item.Product?.sellerId).filter(Boolean)).size || 1;
  const deliveryFee = distinctStores * 70;
  const discount = items.reduce((sum, item) => {
    const disc = item.Product?.discountPercentage || 0;
    return sum + (item.price * item.quantity * disc / 100);
  }, 0);
  const grandTotal = subtotal + deliveryFee - discount;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const invoiceNumber = order.id?.slice(0, 8).toUpperCase();

  return (
    <>
      {/* Print-specific styles */}
      <style>{`
        @media print {
          /* Hide everything except the invoice */
          body * {
            visibility: hidden;
          }
          #invoice-area, #invoice-area * {
            visibility: visible;
          }
          #invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          /* Hide non-printable elements */
          .no-print {
            display: none !important;
          }
          /* Clean print styles */
          @page {
            margin: 15mm;
            size: A4;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white flex flex-col">
        {/* Header - hidden in print */}
        <div className="no-print">
          <Header />
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

          {/* Success Banner - hidden in print */}
          <div className="no-print mb-8 bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
            <CheckCircle className="w-10 h-10 text-green-500 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-green-800">Order Placed Successfully!</h2>
              <p className="text-green-600 text-sm">Your order has been confirmed. You can download the invoice below.</p>
            </div>
          </div>

          {/* Action Buttons - hidden in print */}
          <div className="no-print flex items-center justify-between mb-6">
            <Link to="/customerprofile" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition font-medium">
              <ArrowLeft className="w-4 h-4" />
              Go to My Orders
            </Link>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md hover:cursor-pointer"
            >
              <Printer className="w-5 h-5" />
              Download PDF
            </button>
          </div>

          {/* ====== INVOICE AREA (Printable) ====== */}
          <div id="invoice-area" className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 sm:p-10">

            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-6 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">INVOICE</h1>
                <p className="text-sm text-gray-500 mt-1">Kenakata E-Commerce</p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-sm text-gray-500">Invoice #</p>
                <p className="text-lg font-bold text-gray-800">{invoiceNumber}</p>
                <p className="text-sm text-gray-500 mt-1">{orderDate}</p>
              </div>
            </div>

            {/* Customer & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                <p className="font-semibold text-gray-800">{order.User?.name || 'N/A'}</p>
                <p className="text-sm text-gray-600">{order.User?.email || ''}</p>
                {order.phoneNumber && (
                  <p className="text-sm text-gray-600">{order.phoneNumber}</p>
                )}
                {order.shippingAddress && (
                  <p className="text-sm text-gray-600 mt-1">{order.shippingAddress}</p>
                )}
              </div>
              <div className="sm:text-right">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Details</h3>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Method:</span> {order.paymentMethod || 'Cash'}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Status:</span>{' '}
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Paid
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Order Status:</span>{' '}
                  <span className="text-indigo-600 font-semibold">{order.status}</span>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-50 text-indigo-800">
                    <th className="text-left py-3 px-4 rounded-l-lg font-semibold">#</th>
                    <th className="text-left py-3 px-4 font-semibold">Product</th>
                    <th className="text-center py-3 px-4 font-semibold">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold">Unit Price</th>
                    <th className="text-right py-3 px-4 font-semibold">Discount</th>
                    <th className="text-right py-3 px-4 rounded-r-lg font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const disc = item.Product?.discountPercentage || 0;
                    const lineTotal = item.price * item.quantity;
                    return (
                      <tr key={item.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {item.Product?.name || 'Unknown Product'}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-gray-700">৳{item.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-gray-500">
                          {disc > 0 ? `${disc}%` : '—'}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-800">
                          ৳{lineTotal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>৳{deliveryFee.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Product Discount</span>
                      <span>-৳{Math.round(discount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-indigo-800">
                      <span>Grand Total</span>
                      <span>৳{Math.round(grandTotal).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">Thank you for shopping with Kenakata!</p>
              <p className="text-xs text-gray-400 mt-1">If you have any questions, please contact our support team.</p>
            </div>
          </div>

        </div>

        {/* Footer - hidden in print */}
        <div className="no-print">
          <Footer />
        </div>
      </div>
    </>
  );
}
