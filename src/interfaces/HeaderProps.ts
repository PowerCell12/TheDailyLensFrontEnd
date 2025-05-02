export interface HeaderProps {
    user: { name: string; email: string, accountType: string, imageUrl: string, bio: string, country: string, fullName: string, id: string, likedComments: number[], dislikedComments: number[] };
    setUser: React.Dispatch<React.SetStateAction<{
        name: string;
        email: string;
        accountType: string;
        imageUrl: string;
        bio: string;
        country: string;
        fullName: string;
        id: string;
        likedComments: number[];
        dislikedComments: number[]
      }>>;
}

export interface CommentAuthorData{
  name: string,
  imageUrl: string
}