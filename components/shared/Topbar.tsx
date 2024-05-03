import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Topbar = () => {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="logo"
          width={28}
          height={28}
          className="rounded-full"
        />
        <p className="text-light-1 text-heading3-bold max-xs:hidden">
          Thread Verse
        </p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image src="/logout.svg" alt="logout" width={24} height={24} />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "px-4 py-2",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Topbar;
