import Header from '../../components/Header';
import Featured from '../../components/Featured';

export default function Landing() {
  return (
    <>
    <Header />
    <Featured />
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-blue-500 to-purple-600 text-white p-4">
        
        <h1 className="text-5xl font-bold mb-6">Welcome to Kenakata.com</h1>
        <p className="text-lg mb-8 text-center max-w-2xl">
            Buy stuff :D
        </p>
    </div>
    </>
    );
}