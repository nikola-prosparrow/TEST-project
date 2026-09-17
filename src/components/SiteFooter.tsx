import Link from "next/link";
import { BrandMark } from "@/components/SiteHeader";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <BrandMark />
            <span>prosparrow</span>
          </div>
          <p>Pronalaženje doma bez glavobolje. Beograd, Srbija.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <span className="title">Kompanija</span>
            <a href="#">O nama</a>
            <a href="#">Karijera</a>
            <a href="#">Kontakt</a>
          </div>
          <div className="footer-col">
            <span className="title">Za korisnike</span>
            <Link href="/">Kupovina</Link>
            <a href="#">Izdavanje</a>
            <a href="#">Postavi oglas</a>
          </div>
          <div className="footer-col">
            <span className="title">Podrška</span>
            <a href="#">Pomoć</a>
            <a href="#">Privatnost</a>
            <a href="#">Uslovi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
