import Navbar from "../../components/common/Navbar";

function HomePage() {
    return (
        // pt-20 = padding top 80px (so content doesn't hide behind fixed navbar!)
        <div className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-20 px-4 max-w-7xl mx-auto">
                <h2 className="font-heading text-white text-3xl mt-8">
                    Home Page
                </h2>
                <p className="text-gray-500 mt-2">
                    Mobile listings coming soon...
                </p>
            </div>
        </div>
    );
}

export default HomePage;