

export default function RegistrationForm() {
  
  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">
     <div className="bg-white rounded-lg border-1 p-8 max-w-md w-full relative ">

      
      <h2 className="text-2xl font-bold mb-0 text-gray-800 text-center">Register</h2>
      <h2 className="text-m mb-8 text-gray-800 text-center">Create an account</h2>
      <div className="space-y-4">
        
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
           "
        />
        
        <input
          type="email"
          placeholder="Email"
          
          className="w-full px-4 py-2 border border-gray-300 rounded-lg "
        />
        
       
        <div className="relative">
          <input
            
            placeholder="Password"
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg "
          />
          <button
            type="button"
           
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
          >
           
          </button>
        </div>

 <button
        
          className="w-full bg-cyan-400 text-white py-2 rounded-lg hover:bg-stone-500 transition"
        >
          Register
        </button>
        <button
        
          className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white py-3 rounded-lg border border-gray-300 hover:bg-blue-600 transition font-medium"
        >
          Continue with Google
        </button>

       
      </div>
      
    </div>
    </div>
  );
}
