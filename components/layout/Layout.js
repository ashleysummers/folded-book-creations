export default function Layout({ children }) {
    return (        
        <div className="container">
            <GlobalMenu />
            {children}
            <Footer />
        </div>
    )
}