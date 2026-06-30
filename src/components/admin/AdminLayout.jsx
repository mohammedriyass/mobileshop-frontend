import Sidebar from "./Sidebar";

// children = whatever page content is passed inside
function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-black font-body">
            <Sidebar />

            {/* ml-60 = margin-left, pushes content right of sidebar */}
            <main className="ml-60 p-8">
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;