import * as React from "react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Rocket } from "lucide-react";

interface LaunchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    className?: string;
}

function LaunchButton({ children = "Launch", className, ...props }: LaunchButtonProps) {
    return (
        <Button
            variant="ghost"
            className={cn(
                "group relative h-10 px-6 rounded-lg overflow-hidden transition-all duration-500 w-fit text-sm font-medium",
                className
            )}
            {...props}
        >
            {/* Outer glow border */}
            <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-[#8580f9] via-[#6351df] to-[#c6cafe]">
                <div className="absolute inset-0 bg-[#0a0a0a] rounded-lg" />
            </div>

            {/* Main background */}
            <div className="absolute inset-[1px] bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] rounded-lg" />

            {/* Shimmer effect */}
            <div className="absolute inset-[1px] bg-gradient-to-r from-transparent via-[#8580f9]/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                <Rocket className="h-4 w-4 text-[#8580f9] group-hover:text-[#c6cafe] transition-colors duration-300" />
                <span className="text-white group-hover:text-[#c6cafe] transition-colors duration-300 font-medium">
                    {children}
                </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-[1px] opacity-0 transition-opacity duration-300 bg-gradient-to-r from-[#8580f9]/10 via-[#6351df]/5 to-[#c6cafe]/10 group-hover:opacity-100 rounded-lg" />
        </Button>
    );
}

export { LaunchButton }
