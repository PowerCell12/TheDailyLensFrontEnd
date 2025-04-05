export interface HeaderProps {
    user: { name: string; email: string, accountType: string, image: string, bio: string };
    setUser: (user: { name: string; email: string, accountType: string, image: string, bio: string }) => void;
}

