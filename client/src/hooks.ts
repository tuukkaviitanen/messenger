import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { useEffect } from "react";
import { userWithTokenSchema } from "./validators/UserWithToken";
import { localStorageKeys } from "./utils/constants";
import { setCurrentUser } from "./reducers/userReducer";


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()


export const useStoredUser = () => {
  const dispatch = useDispatch();

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
