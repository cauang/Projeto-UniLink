import { Link } from "react-router-dom";
import { Button, Card } from "../components/Ui";

export default function NotFound() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 text-center">
      <Card className="mx-auto max-w-md p-10">
        <div className="text-6xl mb-2">🤔</div>
        <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
        <p className="text-neutral-400 mb-6">Talvez o link tenha expirado ou nunca existiu.</p>
        <Button as={Link} to="/">Voltar ao início</Button>
      </Card>
    </section>
  );
}
