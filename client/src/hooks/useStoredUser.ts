import { useEffect } from "react";
import { userWithTokenSchema } from "../validators/UserWithToken";
import { localStorageKeys } from "../utils/constants";
import { setCurrentUser } from "../reducers/userReducer";
import { useAppDispatch } from "./typedReduxHooks";

export const useStoredUser = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const localStorageUser = window.localStorage.getItem(localStorageKeys.currentUser);
    if (!localStorageUser) return;

    const user = userWithTokenSchema.safeParse(JSON.parse(localStorageUser));

    if (!user.success) {
      console.error('Parsed user invalid');
      return;
    }

    dispatch(setCurrentUser(user.data));
  }, [dispatch]);
}
