interface AppLayoutProps {
    children: React.ReactNode
}

const AppLayout = (props: AppLayoutProps) => {
    return (
        <>
        <main>
            {props.children}
        </main>
        </>
    )
}

export default AppLayout