import ThemeToggle from "./ThemeToggle";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="font-semibold text-lg">Reginald Ojunga</div>

                <ThemeToggle />
            </div>
        </header>
    );
}
