import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";


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

        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] b p-4">
          <Link href="/" className="flex items-center justify-center lg:justify-start gap-1">
            <Image src="/school-management-logo.png" alt="logo" width={80} height={80}/>
            <span className="hidden lg:block font-bold"> School-Mgmt</span>
          </Link>
          <Menu />
        </div>

        {/*RIGHT*/}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#f7f8fa] overflow-scroll flex flex-col">
          <Navbar /> 
          {children}
        </div>
    </div>
  );
}
