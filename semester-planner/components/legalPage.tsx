export default function LegalPage() {
    return (
        <div className="max-w-2xl text-sm leading-relaxed">
            <h2 className="text-2xl font-bold mb-8">Rechtliches</h2>

            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Impressum</h3>
                <p className="text-muted-foreground">
                    Nicht-kommerzielles Studentenprojekt im Rahmen des Moduls IPRO an der FHNW.
                </p>
                <p className="mt-2">
                    Kontakt: <a href="mailto:monkeycroissant5@gmail.com" className="underline">monkeycroissant5@gmail.com</a>
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Datenschutz</h3>
                <p className="text-muted-foreground">
                    Diese Anwendung läuft vollständig im Browser. Es gibt kein Backend, keine Nutzerkonten
                    und keinen Server, an den Daten übertragen werden. Alle Inhalte (Aufgaben, Semesterdaten,
                    Einstellungen) werden ausschliesslich lokal im localStorage deines Browsers gespeichert
                    und verlassen dein Gerät nie. Es werden keine Cookies gesetzt und keine Analyse- oder
                    Trackingtools eingesetzt.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">Kontakt</h3>
                <p className="text-muted-foreground">
                    Feedback, Fragen oder Bugs gerne per Mail an{" "}
                    <a href="mailto:monkeycroissant5@gmail.com" className="underline">monkeycroissant5@gmail.com</a>.
                </p>
            </section>
        </div>
    )
}
