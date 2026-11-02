import Navbar from "./Navbar";
import Footer from "./Footer";

function PageShell({ children, variant = "student" }) {
    return (
        <>
            <Navbar variant={variant} />
            {children}
            <Footer variant={variant} />
        </>
    );
}

export default PageShell;