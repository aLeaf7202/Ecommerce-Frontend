
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
        </div>
  </div>
  );
}