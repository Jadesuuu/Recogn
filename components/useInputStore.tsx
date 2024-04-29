import { create } from 'zustand';

type InputStoreState = {
  inputValue: string;
  setInputValue: (value: string) => void;
};

const useInputStore = create<InputStoreState>(set => ({
  inputValue: '',
  setInputValue: (value: string) => set({ inputValue: value }),
}));

export default useInputStore;
