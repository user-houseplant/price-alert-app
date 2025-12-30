import { ExternalLink, Tag } from "lucide-react";

type ProductProps = {
    title: string;
    price: number;
    image: string;
    link: string;
    source: string;
    badge?: string;
};

export default function ProductCard({ title, price, image, link, source, badge }: ProductProps) {
    return (
        <div className="glass glass-hover rounded-2xl overflow-hidden group relative flex flex-col h-full transition-all duration-300 hover:-translate-y-1">
            {badge && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-lg flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {badge}
                </div>
            )}

            <div className="relative h-48 sm:h-56 p-6 bg-white flex items-center justify-center overflow-hidden border-b border-gray-100">
                <img
                    src={image}
                    alt={title}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-gray-100 text-[#2D2A32] text-xs font-bold px-2 py-1 rounded">
                    {source}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1 bg-white">
                <h3 className="text-[#2D2A32] font-semibold text-sm sm:text-base leading-snug line-clamp-2 mb-3 flex-1" title={title}>
                    {title}
                </h3>

                <div className="flex items-end justify-between mt-auto gap-4">
                    <div>
                        <p className="text-xs text-[#2D2A32]/70 mb-0.5 font-medium">Price</p>
                        <p className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                            ₹{price.toLocaleString('en-IN')}
                        </p>
                    </div>

                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#E07A78]/10 hover:bg-[#E07A78]/20 text-[#E07A78] text-sm font-bold rounded-lg transition-colors border border-[#E07A78]/20"
                    >
                        Buy <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
