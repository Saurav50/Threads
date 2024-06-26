"use client";
import { sidebarLinks } from "@/constants/";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          if (link.route === "/profile") {
            if (userId == null) link.route = "/sign-in";
            else link.route = `/profile/${userId}`;
          }

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive ? "bg-primary-500" : ""}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        {" "}
        <SignedIn>
          <SignOutButton>
            <div
              className="flex gap-4 px-4 cursor-pointer"
              onClick={() => router.push("/sign-in")}
            >
              <Image src="/logout.svg" alt="logout" width={22} height={22} />
              <p className="text-light-1">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
