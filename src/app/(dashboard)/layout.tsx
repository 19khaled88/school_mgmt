

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
        {/*LEFT*/}
        {/* <div className="w-1/4 bg-gray-200 p-4">
            <h2 className="text-xl font-bold mb-4">Sidebar</h2>
            <ul>
                <li className="mb-2"><a href="#">Dashboard</a></li>
                <li className="mb-2"><a href="#">Settings</a></li>
                <li className="mb-2"><a href="#">Profile</a></li>
            </ul>
        </div> */}
        {/* <div className="w-3/4 p-4">
            {children}
        </div> */}

        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-red-200"></div>

        {/*RIGHT*/}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-blue-200"></div>
    </div>
  );
}
