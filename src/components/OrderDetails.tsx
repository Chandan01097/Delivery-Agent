import React, { useState } from 'react';
import { ArrowLeft, Camera, Upload, CheckCircle, XCircle } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { PhotoUpload } from './PhotoUpload';
import { AIComparison } from './AIComparison';

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
}

export function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
  const { getOrder, updateOrder } = useOrders();
  const [showDispatchUpload, setShowDispatchUpload] = useState(false);
  const [showReturnUpload, setShowReturnUpload] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleDispatchPhoto = (photo: string) => {
    updateOrder(orderId, { dispatchPhoto: photo, status: 'dispatched' });
    setShowDispatchUpload(false);
  };

  const handleReturnPhoto = (photo: string) => {
    updateOrder(orderId, { returnPhoto: photo, status: 'return-pending' });
    setShowReturnUpload(false);
    setShowComparison(true);
  };

  const handleComparisonResult = (similarity: number, accepted: boolean) => {
    updateOrder(orderId, { 
      returnAccepted: accepted,
      status: accepted ? 'returned' : 'delivered'
    });
    setShowComparison(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">Order #{order.id}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {order.customerName}</p>
                  <p><span className="font-medium">Mobile:</span> {order.customerMobile}</p>
                  <p><span className="font-medium">Address:</span> {order.customerAddress}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Order Date:</span> {order.orderDate}</p>
                  <p><span className="font-medium">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
                  <p><span className="font-medium">Products:</span> {order.products.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Dispatch Photo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-blue-600" />
                Before Dispatch Photo
              </h3>
              {order.dispatchPhoto ? (
                <div className="text-center">
                  <img
                    src={order.dispatchPhoto}
                    alt="Dispatch"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Photo Captured
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Take a photo before dispatching the order</p>
                    <button
                      onClick={() => setShowDispatchUpload(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Take Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Return Photo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-orange-600" />
                After Return Photo
              </h3>
              {order.returnPhoto ? (
                <div className="text-center">
                  <img
                    src={order.returnPhoto}
                    alt="Return"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-center">
                    {order.returnAccepted ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Return Accepted
                      </div>
                    ) : order.returnAccepted === false ? (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-2" />
                        Return Rejected
                      </div>
                    ) : (
                      <div className="text-yellow-600">Processing...</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Take a photo if product is returned</p>
                    <button
                      onClick={() => setShowReturnUpload(true)}
                      disabled={!order.dispatchPhoto}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Take Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photo Upload Modals */}
        {showDispatchUpload && (
          <PhotoUpload
            title="Take Dispatch Photo"
            onPhotoTaken={handleDispatchPhoto}
            onClose={() => setShowDispatchUpload(false)}
          />
        )}

        {showReturnUpload && (
          <PhotoUpload
            title="Take Return Photo"
            onPhotoTaken={handleReturnPhoto}
            onClose={() => setShowReturnUpload(false)}
          />
        )}

        {/* AI Comparison Modal */}
        {showComparison && order.dispatchPhoto && order.returnPhoto && (
          <AIComparison
            dispatchPhoto={order.dispatchPhoto}
            returnPhoto={order.returnPhoto}
            onResult={handleComparisonResult}
            onClose={() => setShowComparison(false)}
          />
        )}
      </div>
    </div>
  );
}