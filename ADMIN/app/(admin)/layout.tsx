import Navbar from "./_components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-nnp-primary">
            {/* Main content - no sidebar margins */}
            <div className="w-full pb-20">
                <Navbar />
                {children}
            </div>
        </div>
    )
}
