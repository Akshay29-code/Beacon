import * as React from "react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    className?: string;
}

function ButtonCta({ label = "Write now!", className, ...props }: ButtonCtaProps) {
    return (
        <Button
            variant="ghost"
            className={cn(
                "group relative h-12 px-4 rounded-lg overflow-hidden transition-all duration-500 w-fit text-sm",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-b from-[#8580f9] via-[#8580f9] to-[#8580f9]">
                <div className="absolute inset-0 bg-[#170928] rounded-lg opacity-90" />
            </div>

            <div className="absolute inset-[2px] bg-[#8580f9] rounded-lg opacity-95" />

            <div className="absolute inset-[2px] bg-gradient-to-r from-[#8580f9] via-[#8580f9] to-[#8580f9] rounded-lg opacity-90" />
            <div className="absolute inset-[2px] bg-gradient-to-b from-[#8580f9]/40 via-[#8580f9] to-[#8580f9]/30 rounded-lg opacity-80" />
            <div className="absolute inset-[2px] bg-gradient-to-br from-[#8580f9]/10 via-[#8580f9] to-[#8580f9]/50 rounded-lg" />

            <div className="absolute inset-[2px] shadow-[inset_0_0_15px_rgba(198,202,254,0.15)] rounded-lg" />

            <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg font-light bg-gradient-to-b from-[#c6cafe] to-[#8580f9] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(198,202,254,0.4)] tracking-tighter" style={{color: '#000'}}>
                    {label}
                </span>
            </div>

            <div className="absolute inset-[2px] opacity-0 transition-opacity duration-300 bg-gradient-to-r from-[#2A1736]/20 via-[#c6cafe]/10 to-[#2A1736]/20 group-hover:opacity-100 rounded-lg" />
        </Button>
    );
}

export { ButtonCta }