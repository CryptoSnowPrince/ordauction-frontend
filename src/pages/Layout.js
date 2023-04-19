const Layout = (props) => {
    const { children } = props;

    return (
        <div className="layout py-4 px-4 sm:px-12 w-full mb-8 min-h-[560px]">
            {children}
        </div>
    )
}

export default Layout;