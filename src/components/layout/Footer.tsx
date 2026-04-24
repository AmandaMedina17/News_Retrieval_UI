export function Footer() {
  return (
    <footer className="w-full bg-foreground text-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl font-black text-card mb-4">
              EL DIARIO <span className="text-primary">DIGITAL</span>
            </h3>
            <p className="text-sm text-card/60 leading-relaxed">
              Tu fuente confiable de informacion.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
