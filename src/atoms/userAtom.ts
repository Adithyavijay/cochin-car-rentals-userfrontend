import {atom} from 'recoil'

export  interface UserDetails{ 
    name : string;
    email : string ;
    profilePicture: string;
} 

export const userAtom = atom<UserDetails | null>({
    key: 'userAtom',
    default: null,
  });