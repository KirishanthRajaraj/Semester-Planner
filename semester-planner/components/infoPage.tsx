'use client'
import { useState } from "react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

export default function InfoPage() {
    const [state, setState] = useState<'init' | 'active' | 'animate' | 'done' | 'done'>('init');
    const notationProps = {
        show: true,
        animationDuration: 500,
        color: "var(--primary)"
    };

    return (
        <div>

            <h2 className="text-3xl font-extrabold mb-12">
                <RoughNotation type="highlight" {...notationProps}><span className="font-black text-background">Plänlify</span></RoughNotation> your semester!
            </h2>
            <h3 className="text-xl font-semibold">
                <p className="mb-5">
                    <RoughNotation type="underline" {...notationProps}><span className="font-black">plan like you are in your notes</span></RoughNotation>, use and persist your data <RoughNotation type="underline" {...notationProps}>like a real app</RoughNotation>
                </p>
                <p className="mb-5">
                    <span className="opacity-70"><RoughNotation type="strike-through" {...notationProps} color="red"><RoughNotation type="crossed-off" {...notationProps} color="red"><span className="font-black">5+ clicks</span></RoughNotation> to create one task</RoughNotation></span>, create <RoughNotation type="underline" {...notationProps}><span className="font-black">a dozen</span></RoughNotation> tasks in <RoughNotation type="circle" {...notationProps}><span className="font-black">seconds</span></RoughNotation>, <RoughNotation type="circle" {...notationProps}><span className="font-black">0 clicks</span></RoughNotation>
                </p>
                <p className="mb-5">
                    focused on <span className="font-black"><RoughNotation type="underline" {...notationProps}>as little planning management</RoughNotation></span> as possible, capture and <RoughNotation type="highlight" {...notationProps}><span className="font-black text-background">GET to work!</span></RoughNotation>
                </p>
            </h3>
        </div>
    )
}