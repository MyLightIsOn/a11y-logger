import Link from "next/link";

import { getUserMeLoader } from "@/data/services/get-user-me-loader";

import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { LightDarkToggle } from "@/components/custom/light-dark-toggle";
import { UserProfileMenu } from "@/components/custom/user-profile-menu";
import { User } from "@/types/user";

interface HeaderProps {
  data: {
    logoText: {
      id: number;
      text: string;
      url: string;
    };
    ctaButton: {
      id: number;
      text: string;
      url: string;
    };
  };
}

export function LoggedInUser({ userData }: { readonly userData: User }) {
  return (
    <div className="flex gap-2 items-center">
      <UserProfileMenu user={userData.email} />
    </div>
  );
}

export async function Header({ data }: Readonly<HeaderProps>) {
  const { logoText, ctaButton } = data;
  const user = await getUserMeLoader();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-card">
      <Logo text={logoText.text} />
      <div className="flex items-center gap-4">
        <LightDarkToggle />
        {user.ok ? (
          <LoggedInUser userData={user.data} />
        ) : (
          <Link href={ctaButton.url}>
            <Button
              className={"text-white hover:bg-gray-100 hover:text-primary"}
            >
              {ctaButton.text}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
