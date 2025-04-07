export interface HeaderProps {
    user: { name: string; email: string, accountType: string, image: string, bio: string, country: string, fullName: string };
    setUser: (user: { name: string; email: string, accountType: string, image: string, bio: string, country: string, fullName: string }) => void;
}

