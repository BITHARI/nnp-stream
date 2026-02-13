import EmptyState from "@/components/general/EmptyState";
import Navbar from "./(public)/_components/Navbar";

export default function NotFoundPage() {
    return (
        <div>
            <Navbar />
            <main className='container mx-auto px-4 md:px-6 lg:px-6 my-16'>
                <EmptyState title="Page non trouvée" description="Nous n'avons trouvée aucune ressource à l'adresse que vous avez visitée" />
            </main>
        </div>
    )
}
