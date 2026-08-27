import Link from "next/link";
import { Mail } from "lucide-react";

export default function AppFooter() {
    return (
        <div className="h-9 flex items-center justify-between gap-4 px-4 bg-muted/40 backdrop-blur-sm border-0 border-muted-foreground/20 text-xs rounded-t-xl">

            <Link href="/legal" className="text-muted-foreground hover:underline">
                Impressum · Datenschutz
            </Link>
            <a
                href="mailto:monkeycroissant5@gmail.com"
                className="flex items-center gap-1.5 font-medium hover:text-primary"
            >
                <Mail className="size-3.5" />
                Feedback senden
            </a>
        </div>
    );
}
