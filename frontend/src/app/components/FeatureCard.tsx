import React from "react";

interface FeaturesCardProps {
    icon: React.ReactNode;
    heading: string;
    text: string;
}

function FeaturesCard({ icon, heading, text }: FeaturesCardProps) {
    return (
        <div className="flex xl:flex-row flex-col gap-3.5 font-sans justify-center items-center">
            <div className="items-center xl:text-2xl lg:text-xl md:text-lg sm:text-base text-sm">
                {icon}
            </div>
            <div className="flex flex-col xl:justify-start gap-0.5 justify-center xl:items-start items-center">
                <h5 className="xl:text-xl lg:text-lg md:text-base sm:text-sm text-[12px] font-medium">
                    {heading}
                </h5>
                <p className="xl:text-lg lg:text-base md:text-sm sm:text-[12px] text-[10px] font-normal">
                    {text}
                </p>
            </div>
        </div>
    );
}

export default FeaturesCard;
