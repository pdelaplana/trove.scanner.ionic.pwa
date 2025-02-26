import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
} from 'react';
import { auth, db } from '@infrastructure/firebase/firebase.config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  onAuthStateChanged,
  User,
  updateProfile,
  updateEmail as updateAuthEmail,
} from 'firebase/auth';
import { Preferences } from '@capacitor/preferences';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { get } from 'react-hook-form';

type profileFields = 'businessId' | 'customerId' | 'role';

export type UserRole =
  | 'businessAdmin'
  | 'businessStaff'
  | 'customer'
  | undefined;

interface AuthUser extends User {
  role: UserRole;
  businessId?: string;
  customerId?: string;
}

interface AuthContextType {
  signup: (
    email: string,
    password: string,
    name?: string
  ) => Promise<UserCredential | void>;
  signin: (email: string, password: string) => Promise<UserCredential | void>;
  signout: () => Promise<void>;
  setProfileData: ({
    key,
    value,
    uid,
  }: {
    key: profileFields;
    value: string;
    uid?: string;
  }) => void;
  getProfileData: (key: profileFields) => Promise<string | null>;
  updateDisplayName: (displayName: string) => void;
  updatePhotoUrl: (photoURL: string) => void;
  updateEmail: (email: string) => void;
  error: string | null;
  pendingUpdate: boolean;
  authStateLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const dbCollection = 'userProfileExtensions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authStateLoading, setAuthStateLoading] = useState<boolean>(true);
  const [pendingUpdate, setPendingUpdate] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [profileUpdating, setProfileUpdating] = useState<boolean>(false);

  const getAllProfileData = async (uid?: string) => {
    try {
      const userDocRef = doc(db, dbCollection, uid ?? user!.uid);

      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        return docSnapshot.data() as { role: UserRole; shopId: string };
      }
      return { role: undefined, shopId: undefined };
    } catch (error) {
      console.error('Error getting profile data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchStoredUser = async () => {
      const { value } = await Preferences.get({ key: 'authUser' });
      if (value) {
        setUser(JSON.parse(value));
        setIsSignedIn(true);
      }
    };

    fetchStoredUser();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsSignedIn(false);
        setAuthStateLoading(false);
        return;
      }
      setUser({
        ...currentUser,
        ...(await getAllProfileData(currentUser?.uid)),
      } as AuthUser);
      setIsSignedIn(!!currentUser);
      if (currentUser) setAuthStateLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const storeUser = async () => {
      if (user)
        await Preferences.set({
          key: 'authUser',
          value: JSON.stringify(user),
        });
      else await Preferences.remove({ key: 'authUser' });
    };
    storeUser();
  }, [user]);

  const signup = async (
    email: string,
    password: string,
    name?: string
  ): Promise<UserCredential | void> => {
    setPendingUpdate(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      return userCredential;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPendingUpdate(false);
    }
  };

  const signin = async (
    email: string,
    password: string
  ): Promise<UserCredential | void> => {
    setPendingUpdate(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPendingUpdate(false);
    }
  };

  const signout = async (): Promise<void> => {
    setPendingUpdate(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPendingUpdate(false);
    }
  };

  const setProfileData = async ({
    key,
    value,
    uid,
  }: {
    key: profileFields;
    value: string;
    uid?: string;
  }) => {
    try {
      const userDocRef = doc(db, dbCollection, uid ?? user!.uid);
      await setDoc(userDocRef, { [key]: value }, { merge: true });
    } catch (error) {
      console.error('Error setting profile data:', error);
    }
  };

  const getProfileData = async (key: profileFields, uid?: string) => {
    try {
      const userDocRef = doc(db, dbCollection, uid ?? user!.uid);

      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        return docSnapshot.data()[key] || null;
      }
    } catch (error) {
      console.error('Error getting profile data:', error);
      return null;
    }
  };

  const updateDisplayName = async (displayName: string) => {
    try {
      setProfileUpdating(true);
      await updateProfile(auth.currentUser!, { displayName });
    } catch (error) {
      console.error('Error updating display name:', error);
    } finally {
      auth.currentUser!.reload();
      setUser({ ...user!, displayName: auth.currentUser!.displayName });
      setProfileUpdating(false);
    }
  };

  const updatePhotoUrl = async (photoURL: string) => {
    try {
      setPendingUpdate(true);
      await updateProfile(auth.currentUser!, { photoURL });
    } catch (error) {
      console.error('Error updating photo URL:', error);
    } finally {
      auth.currentUser!.reload();
      setPendingUpdate(false);
    }
  };

  const updateEmail = async (email: string) => {
    try {
      await updateAuthEmail(auth.currentUser!, email);
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        signout,
        setProfileData,
        getProfileData,
        updateDisplayName,
        updatePhotoUrl,
        updateEmail,
        error,
        pendingUpdate,
        authStateLoading,
        isAuthenticated: isSignedIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
