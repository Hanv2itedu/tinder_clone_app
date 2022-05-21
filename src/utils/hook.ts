import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/configStore';

export const useAppDispatch = () =>
  useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCardDetailModal = () => {
  const [isModalShow, setModalShow] = useState(false);
  const onShowModal = () => setModalShow(true);
  const onHideModal = () => setModalShow(false);

  return { isModalShow, onShowModal, onHideModal };
};
