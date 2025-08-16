import { Heading } from "./Heading";

export const AuthLayout = ({
    children,
    quote = "",
    author = "",
    logoSrc = "/wallet-pay.svg",
    gradient = "from-slate-900 via-slate-800 to-slate-700",
    blob1 = "bg-slate-300",
    blob2 = "bg-slate-600",
}) => {
    return (
        <div className="page min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Left brand panel */}
                <div className={`relative hidden md:flex items-center justify-center bg-gradient-to-br ${gradient}`}>
                    <div className="absolute inset-0 opacity-10" aria-hidden>
                        <div className={`w-[600px] h-[600px] rounded-full ${blob1} blur-3xl -top-32 -left-24 absolute`} />
                        <div className={`w-[400px] h-[400px] rounded-full ${blob2} blur-3xl bottom-0 right-0 absolute`} />
                    </div>
                    <div className="relative z-10 max-w-md mx-auto p-8 text-center text-white">
                        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-xl">
                            <img src={logoSrc} alt="PayPlus" className="w-10 h-10" />
                        </div>
                        <Heading title="PayPlus" align="center" className="mb-2 !text-white" />
                        {quote ? (
                            <blockquote className="mt-4 text-lg leading-relaxed text-white/90">
                                {quote}
                                {author ? <footer className="mt-2 text-sm text-white/70">— {author}</footer> : null}
                            </blockquote>
                        ) : null}
                    </div>
                </div>

                {/* Right form panel */}
                <div className="flex items-center justify-center py-12 px-6 lg:px-12 bg-transparent">
                    <div className="w-full max-w-md">{children}</div>
                </div>
            </div>
        </div>
    );
};
