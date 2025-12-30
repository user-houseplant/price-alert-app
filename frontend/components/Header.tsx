import { Bell, Zap } from "lucide-react";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-[#2D2A32] rounded-lg shadow-lg shadow-[#2D2A32]/20">
                    <Zap className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-[#2D2A32]">
                    Price<span className="text-[#E07A78] drop-shadow-sm">Wise</span>
                </h1>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2D2A32] hover:text-[#000] transition-colors">
                <Bell className="w-5 h-5" />
                <span className="hidden sm:inline">Alerts</span>
            </button>
        </header>
    );
}
