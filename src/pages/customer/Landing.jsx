import Header from '../../components/Header';

export default function Landing() {
  return (
    <>
    <Header />
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-blue-500 to-purple-600 text-white p-4">
        
        <h1 className="text-5xl font-bold mb-6">Welcome to Our Service</h1>
        <p className="text-lg mb-8 text-center max-w-2xl">
            Discover a seamless experience tailored just for you. Join us today and explore the amazing features we have to offer!
        </p>
    </div>
    </>
    );
}