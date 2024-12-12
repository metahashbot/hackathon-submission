import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from "react-redux";
import ojStore from "./modules/oj"

const store = configureStore({
    reducer: {
        oj: ojStore,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;