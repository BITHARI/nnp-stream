import Navbar from "./_components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-nnp-primary">
            <div className="w-full pb-20">
                <Navbar />
                {children}
            </div>
        </div>
    )
}
