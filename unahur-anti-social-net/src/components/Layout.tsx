import { ThemeProvider } from "../hooks/useTheme";
import NavbarApp from "./NavbarApp";
import FooterApp from "./FooterApp";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div>
                <NavbarApp />
                <main className="py-4 container">{children}</main>
                <FooterApp />
            </div>
        </ThemeProvider>
    );
}