const Layout = (props) => {
    const { children } = props;

    return (
        <div className="layout py-4 px-12 w-full mb-8 min-h-[560px] pb-[140px]">
            {children}
        </div>
    )
}

export default Layout;