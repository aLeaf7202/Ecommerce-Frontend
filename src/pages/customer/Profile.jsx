import { useState } from 'react';
import { FaChevronLeft, FaEdit, FaUser } from 'react-icons/fa';

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: 'Customer Name',
    phone: 'Phone Number',
    email: 'Email',
    address: 'Address'
  });

  const [orders] = useState([
    {
      id: 1,
      itemName: 'Wireless Headphones',
      quantity: 2,
      price: '$199.99',
      orderDate: '2024-11-28',
      status: 'Awaiting Delivery',
      color: 'blue'
    },
    {
      id: 2,
      itemName: 'Smart Watch',
      quantity: 1,
      price: '$299.99',
      orderDate: '2024-11-25',
      status: 'Awaiting Delivery',
      color: 'blue'
    },
    {
      id: 3,
      itemName: 'Laptop Stand',
      quantity: 1,
      price: '$49.99',
      orderDate: '2024-11-20',
      status: 'Pending Payment',
      color: 'yellow'
    },
    {
      id: 4,
      itemName: 'USB-C Cable',
      quantity: 3,
      price: '$29.99',
      orderDate: '2024-11-15',
      status: 'Canceled',
      color: 'red'
    },
    {
      id: 5,
      itemName: 'Phone Case',
      quantity: 1,
      price: '$19.99',
      orderDate: '2024-11-10',
      status: 'Completed',
      color: 'green'
    },
    {
      id: 6,
      itemName: 'Screen Protector',
      quantity: 2,
      price: '$15.99',
      orderDate: '2024-11-05',
      status: 'Completed',
      color: 'green'
    }
  ]);

  const [editForm, setEditForm] = useState(customerInfo);

  const handleEdit = () => {
    if (isEditing) {
      setCustomerInfo(editForm);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditForm(customerInfo);
    setIsEditing(false);
  };

  const getStatusColor = (color) => {
    const colors = {
      blue: 'bg-blue-200',
      yellow: 'bg-yellow-200',
      red: 'bg-red-200',
      green: 'bg-green-200'
    };
    return colors[color] || 'bg-gray-200';
  };

  const getButtonColor = (status) => {
    if (status === 'Awaiting Delivery') return 'bg-blue-500 hover:bg-blue-600';
    if (status === 'Pending Payment') return 'bg-yellow-500 hover:bg-yellow-600';
    if (status === 'Canceled') return 'bg-red-500 hover:bg-red-600';
    if (status === 'Completed') return 'bg-green-500 hover:bg-green-600';
    return 'bg-gray-500 hover:bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center hover:bg-gray-100 hover:cursor-pointer transition">
              <FaChevronLeft className="text-lg" />
            </button>
            <h1 className="text-3xl font-semibold">Customer Profile</h1>
          </div>
          <button className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 hover:cursor-pointer transition">
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-gray-300 flex items-center justify-center border-8 border-gray-200">
                  <FaUser className="w-32 h-32 text-gray-600" />
                </div>
                <button 
                  onClick={handleEdit}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-gray-800 hover:bg-gray-50 hover:cursor-pointer transition"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full max-w-md mt-8 space-y-3">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-center font-medium focus:outline-none focus:border-blue-500"
                      placeholder="Customer Name"
                    />
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-center font-medium focus:outline-none focus:border-blue-500"
                      placeholder="Phone Number"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-center font-medium focus:outline-none focus:border-blue-500"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-center font-medium focus:outline-none focus:border-blue-500"
                      placeholder="Address"
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleEdit}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 hover:cursor-pointer transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 hover:cursor-pointer transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full px-4 py-3 bg-gray-200 rounded-lg text-center font-medium">
                      {customerInfo.name}
                    </div>
                    <div className="w-full px-4 py-3 bg-gray-200 rounded-lg text-center font-medium">
                      {customerInfo.phone}
                    </div>
                    <div className="w-full px-4 py-3 bg-gray-200 rounded-lg text-center font-medium">
                      {customerInfo.email}
                    </div>
                    <div className="w-full px-4 py-3 bg-gray-200 rounded-lg text-center font-medium">
                      {customerInfo.address}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
            <div className="space-y-4 max-h-[525px] overflow-y-auto pr-2">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`${getStatusColor(order.color)} rounded-lg p-4 h-20 flex items-center justify-between transition hover:shadow-md`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-15 h-15 bg-gray-400 rounded"></div>
                    <div>
                      <p className="font-semibold text-gray-800">{order.itemName}</p>
                      <p className="text-xs text-gray-600">Quantity: {order.quantity}</p>
                      <p className="text-xs text-gray-600">Price: {order.price}</p>
                      <p className="text-xs text-gray-600">Order Date: {order.orderDate}</p>
                    </div>
                  </div>
                  <button className={`${getButtonColor(order.status)} text-white px-6 py-2 rounded-lg font-medium text-sm hover:cursor-pointer transition`}>
                    {order.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}