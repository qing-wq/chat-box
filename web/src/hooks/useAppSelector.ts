import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
