import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configStore';

export const useAppDispatch = () =>
  useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
