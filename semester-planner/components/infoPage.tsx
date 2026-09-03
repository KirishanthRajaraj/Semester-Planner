'use client'
import { useState } from "react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import { useGeneralStore } from "@/store/generalStore";

function SwissFlag() {
    return (
        <svg viewBox="0 0 32 32" className="size-3.5 rounded-[2px]" role="img" aria-label="Schweiz">
            <rect width="32" height="32" fill="#d52b1e" />
            <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#ffffff" />
        </svg>
    );
}

export default function InfoPage() {
    const version = useGeneralStore((state) => state.version);
    const notationProps = {
        show: true,
        animationDuration: 500,
        animationDelay: 500,
        color: "var(--primary)",
    };

    return (
        <div>

            <p className="text-2xl opacity-90 font-semibold mb-2">Goodbye uncertainty 👋 <br></br></p>

            <h2 className="text-3xl font-extrabold mb-12">
                <RoughNotation type="highlight" {...notationProps}>
                    <span className="font-black text-background">Plänlify</span>
                </RoughNotation>{" "}
                <span className="">your semester!</span>
            </h2>


            <h3 className="text-xl font-semibold text-foreground">

                <p className="mb-5">
                    <span className="opacity-80">
                        <RoughNotation
                            type="strike-through"
                            {...notationProps}
                            color="red"
                        >
                            <RoughNotation
                                type="crossed-off"
                                {...notationProps}
                                 strokeWidth={2}
                                color="red"
                            >
                                <span className="font-black">5+ clicks</span>
                            </RoughNotation>
                            {" "}
                            to create <span className="font-black">one</span> task
                        </RoughNotation>
                    </span>{" "}
                    <span className="font-black">-&gt;</span>{" "}
                    <span className="opacity-80">create</span>{" "}
                    <RoughNotation type="underline" strokeWidth={2} {...notationProps}>
                        <span className="font-black">a dozen</span>
                    </RoughNotation>{" "}
                    <span className="opacity-80">tasks in</span>{" "}
                    <RoughNotation type="circle" {...notationProps}>
                        <span className="font-black">seconds</span>
                    </RoughNotation>
                    <span className="opacity-80">,</span>{" "}
                    <RoughNotation type="underline" strokeWidth={2} {...notationProps}>
                        <span className="font-black">0 clicks</span>
                    </RoughNotation>
                </p>


                <p className="mb-5">
                    <RoughNotation type="highlight" {...notationProps}>
                        <span className="font-black text-background">Plan like you are in your notes.</span>
                    </RoughNotation>{" "}
                    <span className="opacity-80">
                        But use and visualize{" "}
                    </span>
                    <RoughNotation type="underline" strokeWidth={2} {...notationProps}>
                        <span className="font-black">like a real app</span>
                    </RoughNotation>
                </p>

                <p className="mb-5">
                    <span className="opacity-80">Keep</span>{" "}
                    <RoughNotation type="underline" strokeWidth={2} {...notationProps}>
                        <span className="font-black">
                            your whole semester in view
                        </span>
                    </RoughNotation>{" "}
                    <span className="opacity-80">
                        at
                    </span>

                    <span className="font-black">{" "}any time{" "}</span>
                    <span className="opacity-80">
                        and{" "}
                    </span>

                    <RoughNotation type="highlight" {...notationProps}>
                        <span className="font-black text-background">
                            GET to work!
                        </span>
                    </RoughNotation>
                </p>
            </h3>

            <div className="mt-16 flex items-center gap-2 text-sm text-muted-foreground">
                <span>FHNW student project</span>

                ·<span className="flex items-center gap-1.5">made in <SwissFlag /></span>
                <span className="ml-auto">v{version}</span>
            </div>
        </div>
    )
}