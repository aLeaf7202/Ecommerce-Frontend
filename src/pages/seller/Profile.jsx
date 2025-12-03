
import { User, Edit , ChevronLeft } from 'lucide-react';

export default function SellerProfile() {
 

  return (
  <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6'>
         {/*header */} 
<div className='flex items-center gap-2 mb-8'>
<button className='flex items-center text-gray-700 hover:text-green-500'>
  <ChevronLeft size={22} strokeWidth={2.5}  />
<span className='text-lg'>Seller Profile</span>
</button>
</div>
<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
   {/* Left Column - Profile Info */}
   <div className='space-y-6'>
      {/* Profile Picture */}
      <div className="relative w-40 h-40 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-gray-800 flex items-center justify-center bg-gray-100">
                <User size={80} className="text-gray-800" />
              </div>
              <button className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
                <Edit size={18} className="text-gray-600" />
              </button>
            </div>

   </div>

</div>
        </div>
  </div>
  );
}