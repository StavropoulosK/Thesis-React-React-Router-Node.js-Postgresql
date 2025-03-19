import "./footer.css"



const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Easy Snow. All rights reserved.</p>
        </footer>
    )
};

const styles = {
    footer: {
        backgroundColor: "#246265",
        color: "white",
        padding: "1.5rem 0",
        textAlign: "center",
        marginTop: "2rem"
    },
    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    links: {
        display: "flex",
        gap: "1rem",
        marginTop: "0.5rem"
    },
    socialIcons: {
        display: "flex",
        gap: "1rem",
        marginTop: "0.5rem"
    }
};

export default Footer;
