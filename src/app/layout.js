import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider from './components/ThemeProvider';

export const metadata = {
  title: "Sistema de Inventario",
  description: "Aplicación de inventario con modo oscuro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body  >
      <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}


