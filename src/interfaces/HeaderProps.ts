export interface HeaderProps {
    user: { name: string; email: string, accountType: string, imageUrl: string, bio: string, country: string, fullName: string };
    setUser: (user: { name: string; email: string, accountType: string, imageUrl: string, bio: string, country: string, fullName: string }) => void;
}

