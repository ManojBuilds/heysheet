export default function PageHeader({title, action}: {title: string, action: React.ReactNode}) {
    return <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg lg:text-4xl font-semibold">{title}</h2>
        <>
        {action}
        </>

    </div>
}
